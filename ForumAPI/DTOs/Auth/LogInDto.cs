namespace ForumAPI.DTOs.Auth
{
    public class LogInDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
