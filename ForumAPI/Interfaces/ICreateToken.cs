using ForumAPI.Models;

namespace ForumAPI.Interfaces
{
    public interface ICreateToken
    {
        public string CreateToken(ApplicationUser user);
        public string CreateRefreshToken();
    }
}
