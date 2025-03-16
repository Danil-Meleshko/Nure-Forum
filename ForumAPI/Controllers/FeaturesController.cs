using System.Security.Claims;
using ForumAPI.Data;
using ForumAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ForumAPI.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class FeaturesController: ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ForumDataContext _db;

    public FeaturesController(UserManager<ApplicationUser> userManager, ForumDataContext db) {
        _userManager = userManager;
        _db = db;
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> ToggleAnnouncementNotifications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Forbid();
        
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if(user == null) return Forbid();
        
        user.AnnouncementsNotifications = !user.AnnouncementsNotifications;
        await _userManager.UpdateAsync(user);
        
        return Ok();
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<bool>> IsAnnouncementsNotificationsEnabled()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Forbid();
        
        var user = await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
        if(user == null) return Forbid();
        
        return Ok(user.AnnouncementsNotifications);
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<bool>> IsLiked(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Forbid();
            
        var like = await _db.Likes.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId && x.LikeFor == id);
        if(like == null) return Ok(false);
            
        return Ok(true);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> ChangeGroup([FromQuery] string newGroup)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if(user == null) return NotFound();
        
        if(user.NextGroupChangingDateAvailable.HasValue && user.NextGroupChangingDateAvailable.Value > DateTime.Now) return BadRequest();
        
        var userRoles = await _userManager.GetRolesAsync(user);
        
        if (newGroup == "Teacher") {
            if (!Teachers.TeacerEmails.Contains(user.Email.Trim()))
                return Forbid();
            
            await _userManager.RemoveFromRoleAsync(user, userRoles[0]);
            await _userManager.AddToRoleAsync(user, "Teacher");
        }
        else if (newGroup != "None") {
            if(user.Email.Split("@")[1] != "nure.ua") return Forbid();
            
            await _userManager.RemoveFromRoleAsync(user, userRoles[0]);
            await _userManager.AddToRoleAsync(user, "Student");
        }
        else {
            await _userManager.RemoveFromRoleAsync(user, userRoles[0]);
            await _userManager.AddToRoleAsync(user, "User");
        }
        
        user.NextGroupChangingDateAvailable = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);
        
        return Ok();
    }
}