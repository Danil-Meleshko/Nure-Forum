using System.Security.Claims;
using ForumAPI.Data;
using ForumAPI.Interfaces;
using ForumAPI.Models;
using ForumAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ForumAPI.Extensions
{
    public static class ServiceColectionExtention
    {
        public static IServiceCollection AddAuthServices(this IServiceCollection Services, IConfiguration configuration) {
            Services.AddScoped<ICreateToken, JwtTokenService>();
            Services.AddScoped<IUserStore<ApplicationUser>, UserStore<ApplicationUser, IdentityRole, ForumDataContext>>();
            Services.AddScoped<IRoleStore<IdentityRole>, RoleStore<IdentityRole, ForumDataContext>>();
            Services.AddScoped<IEmailSender, NureEmailSender>();

            Services.AddIdentityCore<ApplicationUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequiredLength = 8;
                opt.Password.RequireUppercase = true;
                opt.Password.RequireLowercase = true;
                opt.Password.RequireDigit = true;
                opt.SignIn.RequireConfirmedEmail = true;
                opt.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;

            }).AddEntityFrameworkStores<ForumDataContext>()
              .AddRoles<IdentityRole>()
              .AddDefaultTokenProviders();

            Services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme =
                opt.DefaultForbidScheme =
                opt.DefaultChallengeScheme =
                opt.DefaultScheme =
                opt.DefaultSignInScheme = 
                opt.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(opt => {
                opt.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(configuration["JWT:SigningKey"]!)),
                    
                    RoleClaimType = ClaimTypes.Role
                };
            });

            return Services;
        }

        public static IServiceCollection AddCorsAndEFServices(this IServiceCollection Services, IConfiguration configuration)
        {
            Services.AddDbContext<ForumDataContext>(opt =>
            {
                opt.UseSqlServer(configuration.GetConnectionString("ForumDataBase"));
            });

            Services.AddCors(opt =>
            {
                opt.AddPolicy(name: "ForumPolicy",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://localhost:5025") 
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            return Services;
        }
    }
}
