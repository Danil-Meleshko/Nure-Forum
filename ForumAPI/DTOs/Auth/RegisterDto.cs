﻿namespace ForumAPI.DTOs.Auth
{
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Group { get; set; }
    }
}
