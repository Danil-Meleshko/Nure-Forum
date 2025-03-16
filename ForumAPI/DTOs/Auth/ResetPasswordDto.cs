namespace ForumAPI.DTOs.Auth;

public class ResetPasswordDto
{
    public required string Email { get; set; }
    
    public required string NewPassword { get; set; }

    public required string ResetToken { get; set; }
}