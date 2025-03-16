namespace ForumAPI.Models
{
    public class Like
    {
        public required string Id { get; set; }
        public string? UserId { get; set; }
        public string? LikeFor { get; set; }
    }
}
