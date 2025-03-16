using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ForumAPI.Models;

public class RefreshTokens
{
    [Key]
    public string RefreshTokenId { get; set; }

    [ForeignKey("UserId")]
    public string TokenOwner { get; set; }

    public DateTime ExpirationTime { get; set; }

    public string Refreshtoken { get; set; }
}