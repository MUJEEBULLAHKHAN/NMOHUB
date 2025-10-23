using Azure.Storage.Blobs.Models;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using NMOHUM.API.Models.Option;
using NMOHUM.API.Services;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using static NMOHUM.API.Models.EventResource;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoWorkingSpaceController : ControllerBase
    {
        //private readonly NMOHUMAuthenticationContext _context;

        //public CoWorkingSpaceController(NMOHUMAuthenticationContext context)
        //{
        //    _context = context;
        //}

        private readonly NMOHUMAuthenticationContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly Mailer _mailer;
        private readonly JwtSettings _jwtSettings;
        private readonly byte[] _key;
        // In-memory OTP store (for demo)
        private static Dictionary<string, string> _otpStore = new Dictionary<string, string>();
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;
        private readonly ITokenService tokenService;
        private readonly IEventService eventService;
        public CoWorkingSpaceController(
            NMOHUMAuthenticationContext context,
            UserManager<IdentityUser> userManager,
           IFileStorageServiceHandler fileStorageServiceHandler,
            Mailer mailer,
            JwtSettings jwtSettings, ITokenService tokenService, IEventService eventService)
        {
            _context = context;
            _userManager = userManager;
            _mailer = mailer;
            _jwtSettings = jwtSettings;
            _key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            _fileStorageServiceHandler = fileStorageServiceHandler;
            this.tokenService = tokenService;
            this.eventService = eventService;
        }

        [HttpGet]
        [Route("GetAllCoWorkingSpace")]
        public async Task<ActionResult<object>> GetAllCoWorkingSpace()
        {
            try
            {
                var _result = await _context.CoWorkingSpace.ToListAsync();
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }
            

        [HttpGet("{id}")]
        public async Task<ActionResult<CoWorkingSpace>> GetCoWorkingSpace(int id)
        {
            try
            {
                var _result = await _context.CoWorkingSpace.FindAsync(id);
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CoWorkingSpace>> Create(CoWorkingSpace CoWorkingSpace)
        {
            try
            {
                _context.CoWorkingSpace.Add(CoWorkingSpace);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CoWorkingSpace CoWorkingSpace)
        {
            try
            {
                if (id != CoWorkingSpace.CoWorkingSpaceId) return BadRequest();
                _context.Entry(CoWorkingSpace).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        ///// Closed Office Request
        ///

        [HttpGet]
        [Route("GetAllCoWorkingSpaceRequestByEmployeeId/{employeeid}")]
        public async Task<ActionResult<object>> GetAllCoWorkingSpaceRequestByEmployeeId(int EmployeeId)
        {
            try
            {
                var _result = await (from co in _context.CoWorkingSpaceRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.EmployeeId == EmployeeId
                                     select new
                                     {
                                         co.CoWorkingSpaceRequestId,
                                         co.CoWorkingSpaceId,
                                         co.EmployeeId,
                                         co.CreateDate,
                                         co.StartDate,
                                         co.EndDate,
                                         co.Status,
                                         emp.FirstNames,
                                         co.Quantity,
                                         co.Price,
                                         co.TotalPrice,
                                         emp.NationalID,
                                         emp.CompanyName,
                                         emp.CommercialRegistration,
                                     }).ToListAsync();

                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetAllCoWorkingSpaceRequest")]
        public async Task<ActionResult<object>> GetAllCoWorkingSpaceRequest()
        {
            try
            {
                var _result = await (from co in _context.CoWorkingSpaceRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     select new
                                     {
                                         co.CoWorkingSpaceRequestId,
                                         co.CoWorkingSpaceId,
                                         co.EmployeeId,
                                         co.CreateDate,
                                         co.StartDate,
                                         co.EndDate,
                                         co.Status,
                                         emp.FirstNames,
                                         co.Quantity,
                                         co.Price,
                                         co.TotalPrice,
                                         co.NationalID,
                                         co.CompanyName,
                                         co.CommercialRegistration,
                                     }).ToListAsync();

                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetCoWorkingSpaceRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> GetCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = await (from co in _context.CoWorkingSpaceRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.CoWorkingSpaceRequestId == id
                                     select new
                                     {
                                         co.CoWorkingSpaceRequestId,
                                         co.CoWorkingSpaceId,
                                         co.EmployeeId,
                                         co.CreateDate,
                                         co.Status,
                                         emp.FirstNames,
                                     }).FirstOrDefaultAsync();
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateCoWorkingSpaceRequest")]
        public async Task<ActionResult<CoWorkingSpaceRequest>> Create(CoWorkingSpaceRequest CoWorkingSpace)
        {
            try
            {
                if (CoWorkingSpace.EmployeeId == null || CoWorkingSpace.EmployeeId <= 0)
                {
                    if (string.IsNullOrWhiteSpace(CoWorkingSpace.EmailAddress))
                        return BadRequest(new { success = false, message = "Email address is required." });
                    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == CoWorkingSpace.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                    if (existingEmployee != null)
                    {
                        CoWorkingSpace.EmployeeId = existingEmployee.EmployeeId;

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(CoWorkingSpace.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(CoWorkingSpace.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[CoWorkingSpace.EmailAddress] != CoWorkingSpace.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(CoWorkingSpace.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        existingEmployee.NationalID = CoWorkingSpace.NationalID;
                        existingEmployee.CommercialRegistration = CoWorkingSpace.CommercialRegistration;
                        existingEmployee.CompanyName = CoWorkingSpace.CompanyName;
                        await _context.SaveChangesAsync();

                    }
                    else
                    {

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(CoWorkingSpace.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(CoWorkingSpace.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[CoWorkingSpace.EmailAddress] != CoWorkingSpace.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(CoWorkingSpace.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        // create user and create request with that user inofrmation

                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = CoWorkingSpace.EmailAddress,
                            UserName = CoWorkingSpace.EmailAddress
                        };

                        var result = await _userManager.CreateAsync(user, password);
                        if (!result.Succeeded)
                            return BadRequest(new { success = false, message = "Failed to create user.", errors = result.Errors });

                        // Assign RoleId = 1
                        _context.UserRoles.Add(new IdentityUserRole<string>
                        {
                            RoleId = "1",
                            UserId = user.Id
                        });
                        await _context.SaveChangesAsync();

                        // Create employee record

                        Employee employee = new Employee
                        {
                            FirstNames = CoWorkingSpace.FullName,
                            LastName = CoWorkingSpace.FullName,
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = CoWorkingSpace.MobileNumber,
                            NationalID = CoWorkingSpace.NationalID,
                            CommercialRegistration = CoWorkingSpace.CommercialRegistration,
                            CompanyName = CoWorkingSpace.CompanyName
                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();


                        // Send password via email
                        string[] emailList = new string[1] { CoWorkingSpace.EmailAddress };
                        _mailer.SendEmail(
           emailList,
           "support@nmohub.com",
           "NMOHUB Registration Complete – Login Info Inside", // fixed character encoding
           $@"
     <p>Congratulations for Registration.</p>
     <p>Please find your credentials below:</p>
     <p><strong>Your password is:</strong> {password}</p>
 ",
           true
       );
                        CoWorkingSpace.EmployeeId = employee.EmployeeId;

                    }

                }
                else
                {
                    CoWorkingSpace.EmployeeId = CoWorkingSpace.EmployeeId;
                }


                CoWorkingSpace.CreateDate = DateTime.Now;
                CoWorkingSpace.CreatedBy = CoWorkingSpace.EmployeeId;
                _context.CoWorkingSpaceRequest.Add(CoWorkingSpace);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("UpdateCoWorkingSpaceRequest{id}")]
        public async Task<IActionResult> Update(int id, CoWorkingSpaceRequest CoWorkingSpace)
        {
            try
            {
                if (id != CoWorkingSpace.CoWorkingSpaceId) return BadRequest();
                _context.Entry(CoWorkingSpace).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("RejectCoWorkingSpaceRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> RejectCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = _context.CoWorkingSpaceRequest.Where(x => x.CoWorkingSpaceRequestId == id).FirstOrDefault();

                if(_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                _result.Status = "Reject";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });

            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("ApproveCoWorkingSpaceRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> ApproveCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = _context.CoWorkingSpaceRequest.Where(x => x.CoWorkingSpaceRequestId == id).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }


                var coWorkingSpace = _context.CoWorkingSpace.Where(x => x.CoWorkingSpaceId == _result.CoWorkingSpaceId).FirstOrDefault();
                if (coWorkingSpace == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                if(_result.Quantity > coWorkingSpace.TotalQuantity)
                {
                    return Ok(new { success = false, message = "Can Not Approve This Request, We Don't have Required Space As Per Request" });
                }


                _result.StartDate = DateTime.Now;
                _result.EndDate = DateTime.Now.AddDays(30);

                _result.Status = "Approve";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                coWorkingSpace.TotalQuantity = coWorkingSpace.TotalQuantity - _result.Quantity;
                _context.Entry(coWorkingSpace).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });

            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtpToEmail([FromBody] EmailAddressModel model)
        {
            if (string.IsNullOrWhiteSpace(model.EmailAddress))
                return BadRequest(new { success = false, message = "Email address is required." });

            // Check if email already exists in IdentityUser table
            //var existingUser = await _userManager.FindByEmailAsync(model.EmailAddress);
            //if (existingUser != null)
            //{
            //    return BadRequest(new { success = false, message = "Email address already registered." });
            //}

            //// Check if email already exists in Employee table
            //var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == model.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
            //if (existingEmployee != null)
            //{
            //    return BadRequest(new { success = false, message = "Email address already registered." });
            //}

            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[model.EmailAddress] = otp;
            string[] emailList = new string[1] { model.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "  NMOHUB Email Verification", $"Welcome to NMOHUB!.\r\n Please find your Otp for Verification.\r\nYour OTP code is: {otp}", true);

            // _mailer.SendEmail(emailList, "support@nmohub.com", "Your OTP Code", $"Your OTP code is: {otp}", true);

            return Ok(new { success = true, message = "OTP sent to email." });
        }

        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportCoWorkingSpaceList([FromQuery] int statusId = 0)
        {

            try
            {
                var _result = await (from co in _context.CoWorkingSpaceRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     select new
                                     {
                                         co.CoWorkingSpaceRequestId,
                                         co.CoWorkingSpaceId,
                                         co.EmployeeId,
                                         co.CreateDate,
                                         co.StartDate,
                                         co.EndDate,
                                         co.Status,
                                         emp.FirstNames,
                                         co.Quantity,
                                         co.Price,
                                         co.TotalPrice,
                                         co.NationalID,
                                         co.CompanyName,
                                         co.CommercialRegistration,
                                     }).ToListAsync();

                var csv = new StringBuilder();
                csv.AppendLine("CoWorkingSpaceRequestId,CoWorkingSpaceId,EmployeeId,EmployeeFullName,MeetingSlotId,CreateDate,TotalPrice,Status");
                foreach (var item in _result)
                {
                    csv.AppendLine($"{item.CoWorkingSpaceRequestId},{item.CoWorkingSpaceId},{item.EmployeeId},\"{item.FirstNames}\",\"{item.CreateDate}\",{item.TotalPrice},{item.Status}");
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                var fileName = $"CoWorkingSpace_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                return File(bytes, "text/csv", fileName);

            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }




        }

    }
}
