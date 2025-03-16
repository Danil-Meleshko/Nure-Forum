using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ForumAPI.Models
{
    public class Comment
    {
        [Key]
        public required string Id { get; set; }
        public string? Text { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("Post")]
        public string? PostId { get; set; }
        [ForeignKey("Author")]
        public string? AuthorId { get; set; }
        public string? AuthorEmail { get; set; }
        public string? AuthorImage { get; set; } = null;
        public string AuthorRole { get; set; }
        public int Likes { get; set; } = 0;
        [ForeignKey("ReplyTo")]
        public string? ReplyTo { get; set; } = null;
        public List<Comment> RepliesToComment { get; set; } = new List<Comment>();
    }
}
