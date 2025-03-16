using ForumAPI.Data;
using ForumAPI.DTOs.Comments;
using ForumAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CommentsController : ControllerBase
    {
        private readonly ForumDataContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public CommentsController(ForumDataContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("{postId}")]
        //api/Comments/GetComments/{postId}
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments(string postId, CancellationToken ct)
        {
            var comments = await _dbContext.Comments
                .AsNoTracking()
                .Where(x => x.PostId == postId).ToListAsync(ct);
            
            var commentDictionary = comments.ToDictionary(c => c.Id);
            
            for (int i = comments.Count - 1; i >= 0; i--)
            {
                var comment = comments[i];
                if (comment.ReplyTo != null && commentDictionary.TryGetValue(comment.ReplyTo, out var parentComment))
                {
                    parentComment.RepliesToComment.Add(comment);
                    comments.RemoveAt(i);
                }
            }
            
            return Ok(comments);
        }

        [Authorize]
        [HttpGet("{id}")]
        //api/Comments/GetComment/{id}
        public async Task<ActionResult<Comment>> GetComment(string id, CancellationToken ct)
        {
            var comment = await _dbContext.Comments.FindAsync(id, ct);
            if (comment == null) return NotFound();

            var replys = await _dbContext.Comments
                .AsNoTracking()
                .Where(x => x.ReplyTo == comment.Id).ToListAsync(ct);
            
            comment.RepliesToComment.AddRange(replys);

            return Ok(comment);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpPost("{postId}")]
        //api/Comments/AddComment/{postid}
        public async Task<ActionResult<Comment>> AddComment(string postId, [FromBody] AddCommentDto? comment)
        {
            if (comment == null) return BadRequest();
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Forbid();
            
            Announcement? announcement = null;
            var author = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == userId);
            
            if (author == null) return BadRequest("Author is not exist");
            
            var post = await _dbContext.Posts.FindAsync(postId);
            if (post != null)
            {
                post.AmountOfComments++;
                _dbContext.Posts.Update(post);
            }
            else announcement = await _dbContext.Announcements.FindAsync(postId);

            if (announcement != null && post == null)
            {
                announcement.AmountOfComments++;
                _dbContext.Announcements.Update(announcement);
            }

            if(announcement == null && post == null) throw new Exception("No Announcement of Post found");
            
            Comment newComment = new Comment() {
                Id = comment.Id!,
                Text = comment.Text,
                AuthorId = userId,
                AuthorEmail = author.Email,
                AuthorImage = author.Image,
                AuthorRole = _userManager.GetRolesAsync(author).Result.ToList()[0],
                CreatedAt = DateTime.UtcNow,
                PostId = postId,
                Likes = 0,
                ReplyTo = comment.ReplyTo == null || comment.ReplyTo == "" ? null : comment.ReplyTo,
            };
            
            await _dbContext.Comments.AddAsync(newComment);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = newComment.Id }, newComment);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpPut("{commentId}")]
        //api/Comments/EditComment/{commentId}?text=""
        public async Task<IActionResult> EditComment(string commentId, [FromBody] EditCommentDto text)
        {
            var editedComment = await _dbContext.Comments.FindAsync(commentId);
            if (editedComment == null) return NotFound();

            editedComment.Text = text.comment;
            
            _dbContext.Comments.Update(editedComment);
            await _dbContext.SaveChangesAsync();

            return Ok(editedComment);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpDelete("{commentId}")]
        //api/Comments/DeleteComment/{commentId}
        public async Task<IActionResult> DeleteComment(string commentId) {
            var comment = await _dbContext.Comments.FindAsync(commentId);
            if(comment == null) return NotFound();
            Announcement? announcement = null;
            
            var post = await _dbContext.Posts.FindAsync(comment.PostId);
            
            if (post != null)
            {
                post.AmountOfComments--;
                _dbContext.Posts.Update(post);
            }
            else announcement = await _dbContext.Announcements.FindAsync(comment.PostId);
            
            if (announcement != null && post == null) {
                announcement.AmountOfComments--;
                _dbContext.Announcements.Update(announcement);
            }

            if(announcement == null && post == null) throw new Exception("No Announcement of Post found");
            
            _dbContext.Comments.Remove(comment);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPut("{commentId}/Like")]
        //api/Comments/ToggleLike/{commentId}/Like
        public async Task<ActionResult<int>> ToggleLike(string commentId)
        {
            var comment = await _dbContext.Comments.FindAsync(commentId);
            if (comment == null) return NotFound();
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Forbid();
            
            var like = await _dbContext.Likes.FirstOrDefaultAsync(x => x.UserId == userId && x.LikeFor == commentId);
            if (like != null)
            {
                _dbContext.Likes.Remove(like);
                comment.Likes--;
            }
            else
            {
                Like newLike = new Like() {
                    Id = Guid.NewGuid().ToString(),
                    LikeFor = commentId,
                    UserId = userId
                };

                await _dbContext.Likes.AddAsync(newLike);
                comment.Likes++;
            }

            _dbContext.Comments.Update(comment);
            await _dbContext.SaveChangesAsync();

            return Ok(comment);
        }
    }
}
