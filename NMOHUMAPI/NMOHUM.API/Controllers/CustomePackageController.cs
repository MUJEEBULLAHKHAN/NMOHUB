using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using NMOHUM.API.Models.Option;
using NMOHUM.API.Services;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomePackageController : ControllerBase
    {
       
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
        public CustomePackageController(
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
        [Route("GetAllcustomizedPackageByEmployeeId/{employeeid}")]
        public async Task<ActionResult<object>> GetAllcustomizedPackageByEmployeeId(int EmployeeId)
        {
            try
            {
                var _result = await (from co in _context.CustomizedPackage
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.EmployeeId == EmployeeId
                                     select new
                                     {
                                         co.ServiceName,
                                         co.BudgetAmount,
                                         co.ClosedOfficeMonthly,
                                         co.ClosedOfficeSizeRequest,
                                         co.CoWorkingSpaceMonthly,
                                         co.CoWorkingSpaceRequiredSeats,
                                         co.Description,
                                         co.CreateDate,
                                         emp.FirstNames,
                                     }).ToListAsync();

                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetAllcustomizedPackage")]
        public async Task<ActionResult<object>> GetAllcustomizedPackage()
        {
            try
            {
                var _result = await (from co in _context.CustomizedPackage
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     select new
                                     {
                                         co.ServiceName,
                                         co.BudgetAmount,
                                         co.ClosedOfficeMonthly,
                                         co.ClosedOfficeSizeRequest,
                                         co.CoWorkingSpaceMonthly,
                                         co.CoWorkingSpaceRequiredSeats,
                                         co.Description,
                                         co.CreateDate,
                                         emp.FirstNames,
                                     }).ToListAsync();

                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }


        //[HttpGet("GetcustomizedPackage/{id}")]
        //public async Task<ActionResult<ClosedOffice>> GetcustomizedPackage(int id)
        //{
        //    try
        //    {
        //        var _result = await (from co in _context.CustomizedPackage
        //                             join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
        //                             from emp in iem.DefaultIfEmpty()
        //                             where co.customizedPackageId == id
        //                             select new
        //                             {
        //                                 co.customizedPackageId,
        //                                 co.ClosedOfficeId,
        //                                 co.EmployeeId,
        //                                 co.StartDate,
        //                                 co.EndDate,
        //                                 co.CreateDate,
        //                                 co.Price,
        //                                 co.Status,
        //                                 emp.FirstNames,
        //                             }).FirstOrDefaultAsync();
        //        return Ok(new { success = true, data = _result });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        [HttpPost("CreateCustomizedPackage")]
        public async Task<ActionResult<object>> Create(CustomizedPackage customizedPackage)
        {
            try
            {
                if (customizedPackage.EmployeeId == null || customizedPackage.EmployeeId <= 0)
                {
                    if (string.IsNullOrWhiteSpace(customizedPackage.EmailAddress))
                        return BadRequest(new { success = false, message = "Email address is required." });
                    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == customizedPackage.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                    if (existingEmployee != null)
                    {
                        customizedPackage.EmployeeId = existingEmployee.EmployeeId;

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(customizedPackage.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(customizedPackage.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[customizedPackage.EmailAddress] != customizedPackage.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(customizedPackage.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        existingEmployee.NationalID = customizedPackage.NationalID;
                        existingEmployee.CommercialRegistration = customizedPackage.CommercialRegistration;
                        existingEmployee.CompanyName = customizedPackage.CompanyName;
                        await _context.SaveChangesAsync();

                    }
                    else
                    {

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(customizedPackage.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(customizedPackage.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[customizedPackage.EmailAddress] != customizedPackage.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(customizedPackage.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        // create user and create request with that user inofrmation

                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = customizedPackage.EmailAddress,
                            UserName = customizedPackage.EmailAddress
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
                            FirstNames = customizedPackage.FullName,
                            LastName = customizedPackage.FullName,
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = customizedPackage.MobileNumber,
                            NationalID = customizedPackage.NationalID,
                            CommercialRegistration = customizedPackage.CommercialRegistration,
                            CompanyName = customizedPackage.CompanyName
                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();


                        // Send password via email
                        string[] emailList = new string[1] { customizedPackage.EmailAddress };
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
                        customizedPackage.EmployeeId = employee.EmployeeId;

                    }

                }
                else
                {
                    customizedPackage.EmployeeId = customizedPackage.EmployeeId;
                }

                customizedPackage.Status = "Submit";
                customizedPackage.CreateDate = DateTime.Now;
                customizedPackage.CreatedBy = customizedPackage.EmployeeId;
                _context.CustomizedPackage.Add(customizedPackage);
                await _context.SaveChangesAsync();


                //_closeoffice.Status = true;
                //await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        //[HttpGet("ApproveClosedRequestById/{id}")]
        //public async Task<ActionResult<ClosedOffice>> ApproveClosedRequestById(int id)
        //{
        //    try
        //    {

        //        var _closeoffice = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();
        //        if (_closeoffice == null)
        //        {
        //            return Ok(new { success = false, message = "Close Office Request Not Found" });
        //        }

        //        _closeoffice.Status = "Approve";
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });
        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpGet("RejectClosedRequestById/{id}")]
        //public async Task<ActionResult<ClosedOffice>> RejectClosedRequestById(int id)
        //{
        //    try
        //    {

        //        var _closeoffice = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();
        //        if (_closeoffice == null)
        //        {
        //            return Ok(new { success = false, message = "Close Office Request Not Found" });
        //        }

        //        _closeoffice.Status = "Reject";
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });
        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpGet("ActiveClosedRequestById/{id}")]
        //public async Task<ActionResult<ClosedOffice>> ActiveClosedRequestById(int id)
        //{
        //    try
        //    {

        //        var _closeoffice = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();
        //        if (_closeoffice == null)
        //        {
        //            return Ok(new { success = false, message = "Close Office Request Not Found" });
        //        }

        //        _closeoffice.Status = "Active";
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });
        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpPut("UpdatecustomizedPackage{id}")]
        //public async Task<IActionResult> Update(int id, customizedPackage ClosedOffice)
        //{
        //    try
        //    {
        //        if (id != ClosedOffice.ClosedOfficeId) return BadRequest();
        //        _context.Entry(ClosedOffice).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpGet("RejectcustomizedPackage/{id}")]
        //public async Task<ActionResult<CoWorkingSpace>> RejectCoWorkingSpaceRequest(int id)
        //{
        //    try
        //    {
        //        var _result = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();

        //        if (_result == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }

        //        _result.Status = "Reject";
        //        _context.Entry(_result).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });

        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpGet("ApprovecustomizedPackage/{id}")]
        //public async Task<ActionResult<CoWorkingSpace>> ApproveCoWorkingSpaceRequest(int id)
        //{
        //    try
        //    {
        //        var _result = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();

        //        if (_result == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }


        //        var closedOffice = _context.ClosedOffice.Where(x => x.ClosedOfficeId == _result.ClosedOfficeId).FirstOrDefault();
        //        if (closedOffice == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }

        //        if (closedOffice.Status == true)
        //        {
        //            return Ok(new { success = false, message = "This Room Is Already Booked" });
        //        }


        //        //_result.StartDate = DateTime.Now;
        //        //_result.EndDate = DateTime.Now.AddDays(30);

        //        _result.Status = "Approve";
        //        _context.Entry(_result).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();


        //        //closedOffice.Status = true;
        //        //_context.Entry(closedOffice).State = EntityState.Modified;
        //        //await _context.SaveChangesAsync();

        //        return Ok(new { success = true });

        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpGet("ActivateCoWorkingSpaceRequest/{id}")]
        //public async Task<ActionResult<CoWorkingSpace>> ActivateCoWorkingSpaceRequest(int id)
        //{
        //    try
        //    {
        //        var _result = _context.CustomizedPackage.Where(x => x.customizedPackageId == id).FirstOrDefault();

        //        if (_result == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }


        //        var closedOffice = _context.ClosedOffice.Where(x => x.ClosedOfficeId == _result.ClosedOfficeId).FirstOrDefault();
        //        if (closedOffice == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }

        //        if (closedOffice.Status == true)
        //        {
        //            return Ok(new { success = false, message = "This Room Is Already Booked" });
        //        }


        //        _result.StartDate = DateTime.Now;
        //        _result.EndDate = DateTime.Now.AddDays(30);

        //        _result.Status = "Activate";
        //        _context.Entry(_result).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();


        //        closedOffice.Status = true;
        //        _context.Entry(closedOffice).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();

        //        return Ok(new { success = true });

        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}

        //[HttpPost("UploadDocumentcustomizedPackage")]
        //public async Task<ActionResult<CoWorkingSpace>> UploadDocumentcustomizedPackage(customizedPackageDocument model)
        //{
        //    try
        //    {
        //        var _result = _context.CustomizedPackage.Where(x => x.customizedPackageId == model.customizedPackageId).FirstOrDefault();

        //        if (_result == null)
        //        {
        //            return Ok(new { success = false, message = "Record Not Found" });
        //        }

        //        if (model.documentlist != null)
        //        {
        //            if (model.documentlist.Count > 0)
        //            {
        //                int i = 0;
        //                foreach (var item in model.documentlist)
        //                {
        //                    i++;
        //                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

        //                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, 0, _result.customizedPackageId, model.EmployeeId, fileName, item.DocumentType, "ClosedOffice");
        //                }
        //            }
        //        }

        //        var documents = await _context.Documents
        //        .Where(d => d.customizedPackageId == _result.customizedPackageId)
        //        .ToListAsync();


        //        return Ok(new { success = true, data = documents });

        //    }
        //    catch (Exception ex)
        //    {

        //        return Ok(new { success = false, message = ex.Message });
        //    }
        //}


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
        public async Task<IActionResult> ExportCustomizedPackageList([FromQuery] int statusId = 0)
        {

            try
            {
                var _result = await (from co in _context.CustomizedPackage
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     select new
                                     {
                                         co.ServiceName,
                                         co.BudgetAmount,
                                         co.ClosedOfficeMonthly,
                                         co.ClosedOfficeSizeRequest,
                                         co.CoWorkingSpaceMonthly,
                                         co.CoWorkingSpaceRequiredSeats,
                                         co.Description,
                                         co.CreateDate,
                                         emp.FirstNames,
                                     }).ToListAsync();

                var csv = new StringBuilder();
                csv.AppendLine("ServiceName,BudgetAmount,ClosedOfficeMonthly,FullName,Description,CreateDate");
                foreach (var item in _result)
                {
                    csv.AppendLine($"{item.ServiceName},{item.BudgetAmount},{item.ClosedOfficeMonthly},\"{item.FirstNames}\",{item.Description},\"{item.CreateDate}\"");
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


//public class customizedPackageDocument
//{
   
//    public List<ClosedDocumentData> documentlist { get; set; }
//    public int customizedPackageId { get; set; }
//    public int EmployeeId { get; set; }
//}
//public class ClosedDocumentData
//{
//    public string Base64Data { get; set; }
//    public string DocumentType { get; set; }
//    public string Extension { get; set; }

//}