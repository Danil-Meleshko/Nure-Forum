namespace ForumAPI.DTOs.Announcements
{
    public class AddAnnouncementDto
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public required string Text { get; set; }
        public required string AuthorId { get; set; }
        public bool WithComments { get; set; } = false;
        public List<string> GroupVisibility { get; set; } = new List<string> { "*" };
    }
}
