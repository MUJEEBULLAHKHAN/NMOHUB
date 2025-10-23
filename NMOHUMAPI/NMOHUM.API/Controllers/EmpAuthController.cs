using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Models.Option;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Text;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpAuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly NMOHUMAuthenticationContext _context;
        private readonly Mailer _mailer;
        private readonly JwtSettings _jwtSettings;
        private readonly byte[] _key;
        // In-memory OTP and registration store (for demo)
        private static Dictionary<string, string> _otpStore = new Dictionary<string, string>();
        private static Dictionary<string, RegisterUserVM> _pendingRegistrations = new Dictionary<string, RegisterUserVM>();

        public EmpAuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            NMOHUMAuthenticationContext context,
            JwtSettings jwtSettings,
            Mailer mailer)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _mailer = mailer;
            _jwtSettings = jwtSettings;
            _key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserVM model)
        {
            // Check if email already exists in IdentityUser table
            var existingUser = await _userManager.FindByEmailAsync(model.EmailAddress);
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email address already registered." });
            }

            // Check if email already exists in Employee table
            var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == model.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
            if (existingEmployee != null)
            {
                return BadRequest(new { success = false, message = "Email address already registered." });
            }

            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[model.EmailAddress] = otp;
            _pendingRegistrations[model.EmailAddress] = model;
            string[] emailList = new string[1] { model.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "  NMOHUB Email Verification", $"Welcome to NMOHUB!.\r\n Please find your Otp for Verification.\r\nYour OTP code is: {otp}", true);

            return Ok(new { success = true, message = "OTP sent to email." });
        }
        private string GenerateToken(IdentityUser user, List<IdentityRole> roles, Employee employee)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, user.Id),
                new Claim(ClaimTypes.Surname, employee.LastName ?? string.Empty),
                new Claim(ClaimTypes.Name, employee.FirstNames ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("Roles", JsonConvert.SerializeObject(roles)),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };
            foreach (var identityRole in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, identityRole.Name));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        [HttpPost("verifyEmail")]
        public async Task<IActionResult> VerifyEmail([FromBody] OtpVerifyModel model)
        {
            if (!_otpStore.ContainsKey(model.EmailAddress) || _otpStore[model.EmailAddress] != model.Otp)
                return BadRequest(new { success = false, message = "Invalid OTP." });

            var regModel = _pendingRegistrations[model.EmailAddress];
            var password = GenerateRandomPassword();
            var user = new IdentityUser { Email = regModel.EmailAddress, UserName = regModel.EmailAddress };
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Assign RoleId = 1
            _context.UserRoles.Add(new IdentityUserRole<string>
            {
                RoleId = "1",
                UserId = user.Id
            });
            _context.SaveChanges();

            var employee = new Employee
            {
                FirstNames = regModel.FullName,
                LastName = regModel.FullName,
                UserId = user.Id,
                EmailAddress = user.Email,
                MobileNumber = regModel.MobileNumber,
                CountryId = regModel.CountryId,
                DateOfBirth = regModel.DateOfBirth,
                LinkedInProfileLink = regModel.LinkedInProfileLink
            };
            _context.Employee.Add(employee);
            _context.SaveChanges();

            // Send password via email
            string[] emailList = new string[1] { regModel.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "NMOHUB Registration Complete – Login Info Inside", $" Congratulations for Registration.\r\n Please find your Credentials.\r\n  Your password is: {password}", true);

            // Clean up OTP and pending registration
            _otpStore.Remove(model.EmailAddress);
            _pendingRegistrations.Remove(model.EmailAddress);

            var roleIds = _context.UserRoles.Where(a => a.UserId == user.Id).Select(a => a.RoleId).ToList();
            var roles = _context.Roles.Where(r => roleIds.Contains(r.Id)).ToList();
            var token = GenerateToken(user, roles, employee);
            return Ok(new { userDetails = employee, roles, token, success = true, message = "Registration complete. Password sent to email." });
           // return Ok(new { success = true, message = "Registration complete. Password sent to email." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginVM model)
        {
            var user = await _userManager.FindByEmailAsync(model.EmailAddress);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid credentials" });

            var roleIds = _context.UserRoles.Where(a => a.UserId == user.Id).Select(a => a.RoleId).ToList();
            var roles = _context.Roles.Where(r => roleIds.Contains(r.Id)).ToList();
            var employee = _context.Employee.FirstOrDefault(a => a.UserId == user.Id && (a.IsRemoved == null || a.IsRemoved == false));
            if (employee == null)
                return Unauthorized(new { message = "User not found or removed" });
            var token = GenerateToken(user, roles, employee);
            return Ok(new { userDetails = employee, roles, token, success = true });
        }

        // New API: Send OTP to email address
        [HttpPost("send-otp")]
        public IActionResult SendOtpToEmail([FromBody] EmailAddressModel model)
        {
            if (string.IsNullOrWhiteSpace(model.EmailAddress))
                return BadRequest(new { success = false, message = "Email address is required." });
            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[model.EmailAddress] = otp;
            string[] emailList = new string[1] { model.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "  NMOHUB Email Verification", $"Welcome to NMOHUB!.\r\n Please find your Otp for Verification.\r\nYour OTP code is: {otp}", true);

            //_mailer.SendEmail(emailList, "support@nmohub.com", "Your OTP Code", $"Your OTP code is: {otp}", true);
            return Ok(new { success = true, message = "OTP sent to email." });
        }

        // New API: Verify email by OTP
        [HttpPost("verify-email-otp")]
        public IActionResult VerifyEmailByOtp([FromBody] OtpVerifyModel model)
        {
            if (string.IsNullOrWhiteSpace(model.EmailAddress) || string.IsNullOrWhiteSpace(model.Otp))
                return BadRequest(new { success = false, message = "Email and OTP are required." });
            if (!_otpStore.ContainsKey(model.EmailAddress) || _otpStore[model.EmailAddress] != model.Otp)
                return BadRequest(new { success = false, message = "Invalid OTP." });
            // Optionally, remove OTP after successful verification
            _otpStore.Remove(model.EmailAddress);
            return Ok(new { success = true, message = "OTP verified successfully." });
        }

        public class OtpVerifyModel
        {
            public string EmailAddress { get; set; }
            public string Otp { get; set; }
        }



        private string GenerateRandomPassword()
        {
            return $"Aa{new Random().Next(100000, 999999)}!";
        }
    }
} 