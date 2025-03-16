namespace ForumAPI.DTOs.Auth
{
    public class AppUserDto
    {
        public string? Id { get; set; }
        public string? Token { get; set; }
        public string? Email { get; set; }
        public string Group { get; set; } = "None";
        public string? Image { get; set; } = null;
    }
}
