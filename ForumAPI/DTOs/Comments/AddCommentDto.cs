namespace ForumAPI.DTOs.Comments
{
    public class AddCommentDto
    {
        public string? Id { get; set; }
        public string? Text { get; set; }
        public string? AuthorId { get; set; }
        public string? PostId { get; set; }
        public string? ReplyTo { get; set; }
    }
}
