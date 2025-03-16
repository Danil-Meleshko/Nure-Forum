namespace ForumAPI.DTOs.Posts
{
    public class EditPostDto
    {
        public string? Title { get; set; }
        public string? Text { get; set; }
        public bool WithComments { get; set; } = true;
        public List<string>? GroupVisibility { get; set; }
    }
}
