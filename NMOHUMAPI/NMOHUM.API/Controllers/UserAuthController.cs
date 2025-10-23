using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Models.Option;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly NMOHUMAuthenticationContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly byte[] _key;
        private readonly Mailer _mailer;
        private readonly IConfiguration _configuration;

        public UserAuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            NMOHUMAuthenticationContext context,
            JwtSettings jwtSettings,
            Mailer mailer,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _jwtSettings = jwtSettings;
            _mailer = mailer;
            _configuration = configuration;
            _key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
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
            List<IdentityRole> roles = new List<IdentityRole>();
            foreach (var roleId in roleIds)
            {
                var role = _context.Roles.FirstOrDefault(a => a.Id == roleId);
                if (role != null)
                    roles.Add(role);
            }

            var employee = _context.Employee.FirstOrDefault(a => a.UserId == user.Id && (a.IsRemoved == null || a.IsRemoved == false));
            if (employee == null)
                return Unauthorized(new { message = "User not found or removed" });

            var token = GenerateToken(user, roles, employee);
            return Ok(new { token, userDetails = employee, roles, success = true });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterVM model)
        {
            model.Password = model.Password.Trim();
            model.ConfirmPassword = model.ConfirmPassword.Trim();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser { Email = model.EmailAddress, UserName = model.EmailAddress };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            List<IdentityRole> roles = new List<IdentityRole>();
            Employee employee = null;
            using (var dbContextTransaction = _context.Database.BeginTransaction())
            {
                foreach (int id in model.RoleIds)
                {
                    _context.UserRoles.Add(new IdentityUserRole<string>
                    {
                        RoleId = id.ToString(),
                        UserId = user.Id
                    });
                    _context.SaveChanges();
                    var role = _context.Roles.FirstOrDefault(a => a.Id == id.ToString());
                    if (role != null)
                        roles.Add(role);
                }

                employee = new Employee
                {
                    FirstNames = model.FirstNames,
                    LastName = model.LastName,
                    UserId = user.Id,
                    EmailAddress = user.Email
                };
                _context.Employee.Add(employee);
                _context.SaveChanges();

                // Optionally, send email notification
                string[] emailList = new string[1] { model.EmailAddress };
                _mailer.SendEmail(emailList, "support@nmohub.com", "Account Created", $"New user has been created. Username: {model.EmailAddress}, Password: {model.Password}", true);

                dbContextTransaction.Commit();
            }
            return Ok(new { success = true, userDetails = new { employee.FirstNames, employee.LastName, employee.UserId }, roles });
        }
        [HttpPost("registerEntrepreneur")]
        public async Task<IActionResult> RegisterEntrepreneur(EntrepreneurViewModel model)
        {
            model.Password = model.Password.Trim();
            model.ConfirmPassword = model.ConfirmPassword.Trim();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser { Email = model.EmailAddress, UserName = model.EmailAddress };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            List<IdentityRole> roles = new List<IdentityRole>();
            Employee employee = null;
            Entrepreneur entrepreneur = null;
            using (var dbContextTransaction = _context.Database.BeginTransaction())
            {

                _context.UserRoles.Add(new IdentityUserRole<string>
                {
                    RoleId = "1",
                    UserId = user.Id
                });
                _context.SaveChanges();

                entrepreneur = new Entrepreneur
                {
                    FullName = model.FullName,
                    NationalId = model.NationalId,
                    UserId = user.Id,
                    Email = model.EmailAddress,
                    Gender = model.Gender,
                    DateOfBirth = model.DateOfBirth,
                    Phone = model.Phone
                };
                _context.Entrepreneur.Add(entrepreneur);

                employee = new Employee
                {
                    FirstNames = model.FullName,
                    LastName = model.FullName,
                    UserId = user.Id,
                    EmailAddress = user.Email,
                    MobileNumber = model.Phone
                };
                _context.Employee.Add(employee);
                _context.SaveChanges();
                employee.EntrepreneurId = entrepreneur.EntrepreneurId;
                // Optionally, send email notification
                string[] emailList = new string[1] { model.EmailAddress };
                _mailer.SendEmail(emailList, "support@nmohub.com", "Account Created", $"New user has been created. Username: {model.EmailAddress}, Password: {model.Password}", true);

                dbContextTransaction.Commit();
            }
            return Ok(new { success = true, userDetails = new { employee.FirstNames, employee.LastName, employee.UserId, employee.EntrepreneurId }, roles });
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
    }
}