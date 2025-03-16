using System.Net;
using ForumAPI.DTOs.Auth;
using ForumAPI.Interfaces;
using ForumAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ForumAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ICreateToken _tokenService;
        private readonly IEmailSender _emailSender;
        private readonly ForumDataContext _dbContext;

        public AuthController(UserManager<ApplicationUser> userManger, 
            IConfiguration configuration,
            ICreateToken tokenService,
            IEmailSender emailSender,
            ForumDataContext dataContext)
        {
            _userManager = userManger;
            _config = configuration;
            _tokenService = tokenService;
            _emailSender = emailSender;
            _dbContext = dataContext;
        }

        [HttpPost]
        //api/Auth/Register
        public async Task<IActionResult> Register([FromBody] RegisterDto register)
        {
            if (register == null) return BadRequest();
    
            var existingUser = await _userManager.FindByEmailAsync(register.Email);
            
            if (existingUser != null)
            {
                bool isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(existingUser);

                if (!isEmailConfirmed)
                {
                    var newToken = await _userManager.GenerateEmailConfirmationTokenAsync(existingUser);
                    await _emailSender.SendEmailAsync(existingUser.Email, "Confirm your email", newToken);

                    return Ok(new { message = "Please confirm your account. A new confirmation email has been sent." });
                }
                
                return BadRequest(new { message = "User with this email already exists and is confirmed." });
            }
            
            ApplicationUser newUser = new ApplicationUser
            {
                UserName = register.Email,
                Email = register.Email,
                Group = register.Group!
            };

            var result = await _userManager.CreateAsync(newUser, register.Password!);
            if (!result.Succeeded) {
                return BadRequest(new { message = "Invalid email or password, or user already exists." });
            }
            
            if (register.Group == "Teacher") {
                if (!Teachers.TeacerEmails.Contains(register.Email.Trim()))
                    return Forbid();

                await _userManager.AddToRoleAsync(newUser, "Teacher");
            }
            else if (register.Group != "None") {
                if(register.Email.Split("@")[1] != "nure.ua") return Forbid();

                await _userManager.AddToRoleAsync(newUser, "Student");
            }
            else {
                await _userManager.AddToRoleAsync(newUser, "User");
            }
            
            var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
            await _emailSender.SendEmailAsync(newUser.Email, "Confirm your email", confirmationToken);
            
            return Ok(new { message = "Please confirm your account" });
        }

        [HttpPost]
        //api/Auth/LogIn
        public async Task<ActionResult<AppUserDto>> LogIn([FromBody] LogInDto? logIn)
        {
            if(logIn == null) return BadRequest();

            var user = await _userManager.FindByEmailAsync(logIn.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, logIn.Password)) {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            if (!user.EmailConfirmed) return Unauthorized("This account doesn't exist");
            
            Response.Cookies.Delete("refreshToken");
            
            var token = _tokenService.CreateToken(user);
            var newRefreshToken = _tokenService.CreateRefreshToken();
            
            var refreshToken = new RefreshTokens
            {
                RefreshTokenId = Guid.NewGuid().ToString(),
                TokenOwner = user.Id,
                Refreshtoken = newRefreshToken,
                ExpirationTime = DateTime.UtcNow.AddDays(14)
            };
            
            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            await _dbContext.SaveChangesAsync();
            
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.ExpirationTime
            });
            
            var response = new AppUserDto()
            {
                Id = user.Id,
                Email = user.Email,
                Token = token,
                Group = user.Group,
                Image = user.Image
            };

            return Ok(response);
        }
        
        [HttpPost]
        public async Task<IActionResult> RefreshToken()
        {
            var oldRefreshToken = Request.Cookies["refreshToken"];
            if (oldRefreshToken == null) return Unauthorized("Invalid refresh token");

            var storedRToken = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(t => t.Refreshtoken == oldRefreshToken);
    
            if (storedRToken == null) return Unauthorized("Invalid refresh token");

            var user = await _userManager.FindByIdAsync(storedRToken.TokenOwner);
            if (user == null) return Unauthorized("This account doesn't exist");
            if (storedRToken.ExpirationTime < DateTime.UtcNow) return Unauthorized("Time to log in");
            
            _dbContext.RefreshTokens.Remove(storedRToken);
    
            var newRefreshToken = _tokenService.CreateRefreshToken();
            var newTokenEntry = new RefreshTokens
            {
                RefreshTokenId = Guid.NewGuid().ToString(),
                TokenOwner = user.Id,
                Refreshtoken = newRefreshToken,
                ExpirationTime = DateTime.UtcNow.AddDays(14)
            };

            _dbContext.RefreshTokens.Add(newTokenEntry);
            await _dbContext.SaveChangesAsync();
            
            var newAccessToken = _tokenService.CreateToken(user);
            var userRoles = await _userManager.GetRolesAsync(user);

            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = storedRToken.ExpirationTime
            });

            return Ok(new { Token = newAccessToken, Group = user.Group, Image = user.Image, Id = user.Id, Email = user.Email, Role = userRoles[0] });
        }

        [HttpPost]
        public async Task<IActionResult> LogOut() {
            var oldRefreshToken = Request.Cookies["refreshToken"];
            if (oldRefreshToken == null) return Unauthorized("Invalid refresh token");
            
            var storedRToken = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(t => t.Refreshtoken == oldRefreshToken);
    
            if (storedRToken == null) return Unauthorized("Invalid refresh token");
            
            var user = await _userManager.FindByIdAsync(storedRToken.TokenOwner);
            if (user == null) return Unauthorized("This account doesn't exist");
            
            Response.Cookies.Append("refreshToken", oldRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddSeconds(-1)
            });
            
            _dbContext.RefreshTokens.Remove(storedRToken);
            await _dbContext.SaveChangesAsync();
            
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> ForgotPassword(string? email)
        {
            if (email == null) return BadRequest("Invalid email"); 
            
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null) return Unauthorized("Couldn't find the user");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            string encodedToken = WebUtility.UrlEncode(token);
            string link = $"{_config["Client"]}/ChangePassword?token={encodedToken}&email={email}";

            await _emailSender.SendEmailAsync(email, "Reset password link", link);
            
            return Ok(new { message = "Password reset link sent successfully" });
        }

        [HttpPost]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto changePassword)
        {
            var user = await _userManager.FindByEmailAsync(changePassword.Email);
            if (user == null) return Unauthorized("Couldn't find the user");
            
            var result = await _userManager.ResetPasswordAsync(user, changePassword.ResetToken, changePassword.NewPassword);
            
            if (!result.Succeeded) {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }
            return Ok(new { message = "Password reset successful" });
        }
        
        [HttpPost]
        public async Task<IActionResult> EmailConfirmation(string? email, string? token)
        {
            if (email == null || token == null) return BadRequest(); 
            
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Email could not be found");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded) return Ok(new { message = "Email confirmed" });
            
            return BadRequest("Email wasn't confirmed");
        }
    }
}
