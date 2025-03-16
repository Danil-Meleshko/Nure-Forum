using ForumAPI.Data;
using ForumAPI.DTOs.Announcements;
using ForumAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ForumAPI.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AnnouncementsController : ControllerBase
    {
        private readonly ForumDataContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;


        public AnnouncementsController(ForumDataContext db, UserManager<ApplicationUser> userManager, IEmailSender emailSender)
        {
            _db = db;
            _userManager = userManager;
            _emailSender = emailSender;
        }
        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAllAnnouncements([FromQuery] int page, [FromQuery] string? authorEmail, 
                                                                                       [FromQuery] string? title, [FromQuery] DateTime? dateOfCreation, 
                                                                                       [FromQuery] string? authorRole, CancellationToken ct)
        {
            const int pageLimit = 5;
            int announcementsSkiped = (page - 1) * pageLimit;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Forbid();
            
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == userId, ct);
            if (user == null) return BadRequest();
            
            var query = _db.Announcements.AsQueryable();
            query = query.Where(x => x.GroupVisibility.Any(g => g == "*" || g == user.Group));

            if(!string.IsNullOrWhiteSpace(authorEmail)) {
                query = query.Where(a => a.AuthorEmail.Contains(authorEmail));
            }
            if(!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(a => a.Title.Contains(title));
            }
            if (dateOfCreation.HasValue) {
                query = query.Where(a => a.CreatedAt <= dateOfCreation.Value);
            }
            if(!string.IsNullOrWhiteSpace(authorRole)) {
                query = query.Where(a => a.AuthorRole == authorRole);
            }

            var totalAnnouncements = await query.CountAsync(ct);
            var totalPages = (int)Math.Ceiling(totalAnnouncements / (double)pageLimit);
            
            var announcements = await query
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .Skip(announcementsSkiped)
                .Take(pageLimit)
                .ToListAsync(ct);
            
            return Ok(new
            {
                announcements = announcements,
                totalPages = totalPages
            });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcement>> GetAnnouncement(string? id, CancellationToken ct)
        {
            var announcement = await _db.Announcements.FindAsync(id, ct);
            if (announcement == null) return NotFound();

            return Ok(announcement);
        }

        [Authorize(Roles = "Admin, Teacher")]
        [HttpPost]
        public async Task<ActionResult<Announcement>> AddAnnouncement([FromBody] AddAnnouncementDto? newAnnouncement)
        {
            if (newAnnouncement == null) return BadRequest();
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Forbid(); 
            
            var author = await _db.Users.FindAsync(userId);
            if (author == null) return BadRequest("Author is not exist");
            
            var roles = await _userManager.GetRolesAsync(author);
            var announcement = new Announcement
            {
                Id = newAnnouncement.Id!,
                Title = newAnnouncement.Title,
                Text = newAnnouncement.Text,
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                AuthorEmail = author.Email,
                AuthorImage = author.Image,
                AuthorRole = roles[0],
                WithComments = newAnnouncement.WithComments,
                GroupVisibility = newAnnouncement.GroupVisibility,
                AmountOfComments = 0
            };

            List<ApplicationUser> users = new();
            if (announcement.GroupVisibility.Contains("*")) {
                users = await _db.Users.AsNoTracking().Where(user => user.Email != author.Email).ToListAsync();
            }
            else {
                var relevantUsers = await _db.Users
                    .AsNoTracking()
                    .Where(user => announcement.GroupVisibility.Any(group => user.Group.Contains(group) 
                                                                             && user.Email != author.Email
                                                                             && user.AnnouncementsNotifications))
                    .ToListAsync();

                foreach (var user in relevantUsers)
                {
                    if (user.Email != null) users.Add(user);
                }
            }

            var emailTasks = users.Select(user => _emailSender.SendEmailAsync(user.Email, announcement.Title, announcement.Text))
                .ToList();
            await Task.WhenAll(emailTasks);
            
            await _db.Announcements.AddAsync(announcement);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditAnnouncement(string? id, [FromBody] EditAnnouncement? editedAnnouncement)
        {
            if(editedAnnouncement == null) return BadRequest();

            var announcement = await _db.Announcements.FindAsync(id);
            if (announcement == null) return NotFound();

            announcement.Title = editedAnnouncement.Title;
            announcement.Text = editedAnnouncement.Text;
            announcement.WithComments = editedAnnouncement.WithComments;
            announcement.IsEdited = true;
            if (editedAnnouncement.GroupVisibility != null) announcement.GroupVisibility = editedAnnouncement.GroupVisibility;

            _db.Announcements.Update(announcement);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(string id) 
        { 
            var announcement = await _db.Announcements.FindAsync(id);
            if (announcement == null) return NotFound();

            _db.Announcements.Remove(announcement);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet]
        //api/Announcements/GetAllAnnouncementsOfTheUser
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAllAnnouncementsOfTheUser([FromQuery] int page, [FromQuery] string? title, 
                                                                                                [FromQuery] DateTime? dateOfCreation, CancellationToken ct)
        {
            const int pageLimit = 5;
            int announcementsSkiped = (page - 1) * pageLimit;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Forbid();

            var query = _db.Announcements.AsQueryable();
            query = query.Where(x => x.AuthorId == userId);

            if (!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(a => a.Title.Contains(title));
            }

            if (dateOfCreation.HasValue) {
                query = query.Where(a => a.CreatedAt <= dateOfCreation.Value);
            }
            
            var totalAnnouncements = await query.CountAsync(ct);
            var totalPages = (int)Math.Ceiling(totalAnnouncements / (double)pageLimit);
            
            var announcements = await query
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .Skip(announcementsSkiped)
                .Take(pageLimit)
                .ToListAsync(ct);

            return Ok(new {
                announcements = announcements,
                totalPages = totalPages
            });
        }

        [Authorize]
        [HttpPut("{announcementId}/Like")]
        //api/Posts/ToggleLike/{announcementId}/Like
        public async Task<ActionResult<int>> ToggleLike(string announcementId)
        {
            var announcement = await _db.Announcements.FindAsync(announcementId);
            if (announcement == null) return NotFound();
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Forbid();

            var like = await _db.Likes.FirstOrDefaultAsync(x => x.UserId == userId && x.LikeFor == announcementId);
            if (like != null)
            {
                _db.Likes.Remove(like);
                announcement.Likes--;
            }
            else
            {
                Like newLike = new Like()
                {
                    Id = Guid.NewGuid().ToString(),
                    LikeFor = announcementId,
                    UserId = userId
                };

                await _db.Likes.AddAsync(newLike);
                announcement.Likes++;
            }

            _db.Announcements.Update(announcement);
            await _db.SaveChangesAsync();

            return Ok(announcement);
        }
    }
}
