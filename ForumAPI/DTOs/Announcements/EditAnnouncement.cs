namespace ForumAPI.DTOs.Announcements
{
    public class EditAnnouncement
    {
        public string? Title { get; set; }
        public string? Text { get; set; }
        public bool WithComments { get; set; } = true;
        public List<string>? GroupVisibility { get; set; }
    }
}
