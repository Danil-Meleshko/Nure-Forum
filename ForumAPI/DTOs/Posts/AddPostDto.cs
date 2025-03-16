namespace ForumAPI.DTOs.Posts
{
    public class AddPostDto
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public string? Text { get; set; }
        public string? AuthorId { get; set; }
        public bool WithComments { get; set; } = true;
        public List<string> GroupVisibility { get; set; } = new List<string> { "*" };
    }
}
