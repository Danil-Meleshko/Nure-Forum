using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ForumAPI.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string Group { get; set; } = "None";
        public bool AnnouncementsNotifications { get; set; } = false;
        public string? Image { get; set; } = null;
        public DateTime? NextGroupChangingDateAvailable { get; set; }
    }
}
