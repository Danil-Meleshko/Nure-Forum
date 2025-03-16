using ForumAPI.Data;
using ForumAPI.DTOs.Posts;
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
    public class PostsController : ControllerBase
    {
        private readonly ForumDataContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostsController(ForumDataContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        //api/Posts/GetAllPosts
        public async Task<ActionResult<IEnumerable<Post>>> GetAllPosts([FromQuery] int page, [FromQuery] string? authorEmail, 
                                                                       [FromQuery] string? title, [FromQuery] DateTime? dateOfCreation, 
                                                                       [FromQuery] string? authorRole, CancellationToken ct)
        {
            const int pageLimit = 5;
            int postsSkiped = (page - 1) * pageLimit;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var user = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == userId, ct);
            if (user == null) return Forbid();
            
            var query = _dbContext.Posts.AsQueryable();
            query = query.Where(post => post.GroupVisibility.Contains("*") || 
                                        post.GroupVisibility.Contains(user.Group));
            
            if (!string.IsNullOrWhiteSpace(authorEmail)) {
                query = query.Where(post => post.AuthorEmail!.Contains(authorEmail));
            }
            if(!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(post => post.Title!.Contains(title));
            }
            if (dateOfCreation.HasValue) {
                query = query.Where(post => post.CreatedAt <= dateOfCreation.Value);
            }
            if(!string.IsNullOrWhiteSpace(authorRole)) {
                query = query.Where(post => post.AuthorRole == authorRole);
            }
            
            var totalPosts = await query.CountAsync(ct);
            var totalPages = (int)Math.Ceiling(totalPosts / (double)pageLimit);

            var posts = await query
                .AsNoTracking()
                .OrderByDescending(post => post.CreatedAt)
                .Skip(postsSkiped)
                .Take(pageLimit)
                .ToListAsync(ct);

            return Ok(new
            {
                posts = posts,
                totalPages = totalPages
            });
        }

        [Authorize]
        [HttpGet("{id}")]
        //api/Posts/GetPost/{id}
        public async Task<ActionResult<Post>> GetPost(string id, CancellationToken ct)
        {

            var post = await _dbContext.Posts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, ct);
            if (post == null) return NotFound();

            return Ok(post);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpPost]
        //apo/Posts/AddPost
        public async Task<ActionResult<Post>> AddPost([FromBody] AddPostDto newPost)
        {
            if (newPost == null) return BadRequest();
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var author = await _dbContext.Users
                .FindAsync(userId);
            if (author == null) return Forbid(); // BadRequest("Author is not exist")

            var post = new Post {
                Id = newPost.Id!,
                Title = newPost.Title,
                Text = newPost.Text,
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                AuthorEmail = author.Email,
                AuthorImage = author.Image,
                AuthorRole = _userManager.GetRolesAsync(author).Result.ToList()[0],
                WithComments = newPost.WithComments,
                Likes = 0,
                GroupVisibility = newPost.GroupVisibility
            };

            await _dbContext.Posts.AddAsync(post);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpPut("{id}")]
        //api/Posts/EditPost/{id}
        public async Task<IActionResult> EditPost(string id, [FromBody] EditPostDto post)
        {
            if (post == null) return BadRequest();

            var editedPost = await _dbContext.Posts.FindAsync(id);
            if (editedPost == null) return NotFound();

            editedPost.Title = post.Title;
            editedPost.Text = post.Text;
            editedPost.WithComments = post.WithComments;
            editedPost.IsEdited = true;
            if(post.GroupVisibility != null) editedPost.GroupVisibility = post.GroupVisibility;

            _dbContext.Posts.Update(editedPost);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
        
        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpDelete("{id}")]
        //api/Posts/DeletePost/{id}
        public async Task<IActionResult> DeletePost(string id)
        {
            var post = await _dbContext.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpGet]
        //api/Posts/GetAllPostsOfTheUser
        public async Task<ActionResult<IEnumerable<Post>>> GetAllPostsOfTheUser([FromQuery] int page, [FromQuery] string? title, 
                                                                                [FromQuery] DateTime? dateOfCreation, CancellationToken ct)
        {
            const int pageLimit = 5;
            int postsSkiped = (page - 1) * pageLimit;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Forbid();
            
            var query = _dbContext.Posts.AsQueryable();
            query = query.Where(x => x.AuthorId == userId);

            if (!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(a => a.Title!.Contains(title));
            }

            if (dateOfCreation.HasValue) {
                query = query.Where(a => a.CreatedAt <= dateOfCreation.Value);
            }
            
            var totalPosts = await query.CountAsync(ct);
            var totalPages = (int)Math.Ceiling(totalPosts / (double)pageLimit);
            
            var posts = await query
                .AsNoTracking()
                .OrderByDescending(post => post.CreatedAt)
                .Skip(postsSkiped)
                .Take(pageLimit)
                .ToListAsync(ct);

            return Ok(new
            {
                posts = posts,
                totalPages = totalPages
            });
        }

        [Authorize]
        [HttpPut("{postId}/Like")]
        //api/Posts/ToggleLike/{postId}/Like
        public async Task<ActionResult<int>> ToggleLike(string postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Forbid();
            
            var post = await _dbContext.Posts.FindAsync(postId);
            if (post == null) return NotFound();

            var like = await _dbContext.Likes.FirstOrDefaultAsync(x => x.UserId == userId && x.LikeFor == postId);
            if (like != null)
            {
                _dbContext.Likes.Remove(like);
                post.Likes--;
            }
            else
            {
                Like newLike = new Like()
                {
                    Id = Guid.NewGuid().ToString(),
                    LikeFor = postId,
                    UserId = userId
                };

                await _dbContext.Likes.AddAsync(newLike);
                post.Likes++;
            }

            _dbContext.Posts.Update(post);
            await _dbContext.SaveChangesAsync();

            return Ok(post);
        }
    }
}
