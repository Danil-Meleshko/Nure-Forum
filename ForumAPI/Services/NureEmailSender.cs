using System.Net;
using System.Net.Mail;
using ForumAPI.Interfaces;

namespace ForumAPI.Services;

public class NureEmailSender: IEmailSender
{
    private readonly IConfiguration _config;

    public NureEmailSender(IConfiguration config)
    {
        _config = config;
    }
    
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        using var smtpClient = new SmtpClient(_config["Email:Host"], Convert.ToInt32(_config["Email:Port"]))
        {
            UseDefaultCredentials = false,
            EnableSsl = true,
            Credentials = new NetworkCredential(_config["Email:NureHubEmail"], _config["Email:EmailPassword"])
        };

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(_config["Email:NureHubEmail"]!, "NureHub"),
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };

        mailMessage.To.Add(email);

        await smtpClient.SendMailAsync(mailMessage).ConfigureAwait(false);
    }
}
