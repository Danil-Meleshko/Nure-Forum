using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ForumAPI.Models
{
    public class Announcement
    {
        [Key]
        public required string Id { get; set; }
        public string? Title { get; set; }
        public string? Text { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("Author")]
        public string? AuthorId { get; set; }
        public string? AuthorEmail { get; set; }
        public string? AuthorImage { get; set; } = null;
        public string AuthorRole { get; set; }
        public int Likes { get; set; }
        public bool IsEdited { get; set; } = false;
        public bool WithComments { get; set; } = false;
        public List<string> GroupVisibility { get; set; } = new List<string> { "*" };
        public int AmountOfComments { get; set; } = 0;
    }
}
