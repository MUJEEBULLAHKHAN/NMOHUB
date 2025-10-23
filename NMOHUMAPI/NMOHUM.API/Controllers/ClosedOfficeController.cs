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
    public class ClosedOfficeController : ControllerBase
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
        public ClosedOfficeController(
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
        [Route("GetAllClosedOffice")]
        public async Task<ActionResult<object>> GetAllClosedOffice()
        {
            try
            {
                var _result = await _context.ClosedOffice.ToListAsync();
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ClosedOffice>> GetClosedOffice(int id)
        {
            try
            {
                var _result = await _context.ClosedOffice.FindAsync(id);
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ClosedOffice>> Create(ClosedOffice ClosedOffice)
        {
            try
            {
                _context.ClosedOffice.Add(ClosedOffice);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ClosedOffice ClosedOffice)
        {
            try
            {
                if (id != ClosedOffice.ClosedOfficeId) return BadRequest();
                _context.Entry(ClosedOffice).State = EntityState.Modified;
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
        [Route("GetAllClosedOfficeRequestByEmployeeId/{employeeid}")]
        public async Task<ActionResult<object>> GetAllClosedOfficeRequestByEmployeeId(int EmployeeId)
        {
            try
            {
                var _result = await (from co in _context.ClosedOfficeRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     join clo in _context.ClosedOffice on co.ClosedOfficeId equals clo.ClosedOfficeId into iclo
                                     from clos in iclo.DefaultIfEmpty()
                                     where co.EmployeeId == EmployeeId
                                     select new
                                     {
                                         co.ClosedOfficeRequestId,
                                         co.ClosedOfficeId,
                                         co.EmployeeId,
                                         co.StartDate,
                                         co.EndDate,
                                         clos.CloseOfficeName,
                                         clos.OfficeSizes,
                                         co.CreateDate,
                                         co.Price,
                                         co.Status,
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
        [Route("GetAllClosedOfficeRequest")]
        public async Task<ActionResult<object>> GetAllClosedOfficeRequest()
        {
            try
            {
                var _result = await (from co in _context.ClosedOfficeRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     join clo in _context.ClosedOffice on co.ClosedOfficeId equals clo.ClosedOfficeId into iclo
                                     from clos in iclo.DefaultIfEmpty()
                                     select new
                                     {
                                         co.ClosedOfficeRequestId,
                                         co.ClosedOfficeId,
                                         co.EmployeeId,
                                         co.StartDate,
                                         co.EndDate,
                                         clos.CloseOfficeName,
                                         clos.OfficeSizes,
                                         co.CreateDate,
                                         co.Price,
                                         co.Status,
                                         emp.FirstNames,
                                     }).ToListAsync();

                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetClosedOfficeRequest/{id}")]
        public async Task<ActionResult<ClosedOffice>> GetClosedOfficeRequest(int id)
        {
            try
            {
                var _result = await (from co in _context.ClosedOfficeRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.ClosedOfficeRequestId == id
                                     select new
                                     {
                                         co.ClosedOfficeRequestId,
                                         co.ClosedOfficeId,
                                         co.EmployeeId,
                                         co.StartDate,
                                         co.EndDate,
                                         co.CreateDate,
                                         co.Price,
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

        [HttpPost("CreateClosedOfficeRequest")]
        public async Task<ActionResult<ClosedOfficeRequest>> Create(ClosedOfficeRequest closedOfficeRequest)
        {
            try
            {
                var _closeoffice = _context.ClosedOffice.Where(x => x.ClosedOfficeId == closedOfficeRequest.ClosedOfficeId).FirstOrDefault();
                if (_closeoffice == null)
                {
                    return Ok(new { success = false, message = "Close Office Not Found" });
                }

                if (_closeoffice.Status == true)
                {
                    return Ok(new { success = false, message = "Already Booked" });
                }



                if (closedOfficeRequest.EmployeeId == null || closedOfficeRequest.EmployeeId <= 0)
                {
                    if (string.IsNullOrWhiteSpace(closedOfficeRequest.EmailAddress))
                        return BadRequest(new { success = false, message = "Email address is required." });
                    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == closedOfficeRequest.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                    if (existingEmployee != null)
                    {
                        closedOfficeRequest.EmployeeId = existingEmployee.EmployeeId;

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(closedOfficeRequest.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(closedOfficeRequest.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[closedOfficeRequest.EmailAddress] != closedOfficeRequest.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(closedOfficeRequest.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        existingEmployee.NationalID = closedOfficeRequest.NationalID;
                        existingEmployee.CommercialRegistration = closedOfficeRequest.CommercialRegistration;
                        existingEmployee.CompanyName = closedOfficeRequest.CompanyName;
                        await _context.SaveChangesAsync();

                    }
                    else
                    {

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(closedOfficeRequest.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(closedOfficeRequest.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[closedOfficeRequest.EmailAddress] != closedOfficeRequest.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(closedOfficeRequest.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        // create user and create request with that user inofrmation

                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = closedOfficeRequest.EmailAddress,
                            UserName = closedOfficeRequest.EmailAddress
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
                            FirstNames = closedOfficeRequest.FullName,
                            LastName = closedOfficeRequest.FullName,
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = closedOfficeRequest.MobileNumber,
                            NationalID = closedOfficeRequest.NationalID,
                            CommercialRegistration = closedOfficeRequest.CommercialRegistration,
                            CompanyName = closedOfficeRequest.CompanyName
                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();


                        // Send password via email
                        string[] emailList = new string[1] { closedOfficeRequest.EmailAddress };
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
                        closedOfficeRequest.EmployeeId = employee.EmployeeId;

                    }

                }
                else
                {
                    closedOfficeRequest.EmployeeId = closedOfficeRequest.EmployeeId;
                }



                //if (_closeoffice.Status == true)
                //{
                //    return Ok(new { success = false, message = "Close Office Already Booked" });
                //}

                //closedOfficeRequest.StartDate = DateTime.Now;
                //closedOfficeRequest.EndDate = DateTime.Now.AddDays(30);

                closedOfficeRequest.Price = _closeoffice.Price;
                closedOfficeRequest.Status = "Submit";
                closedOfficeRequest.CreateDate = DateTime.Now;
                closedOfficeRequest.CreatedBy = closedOfficeRequest.EmployeeId;
                _context.ClosedOfficeRequest.Add(closedOfficeRequest);
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

        [HttpGet("ApproveClosedRequestById/{id}")]
        public async Task<ActionResult<ClosedOffice>> ApproveClosedRequestById(int id)
        {
            try
            {

                var _closeoffice = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();
                if (_closeoffice == null)
                {
                    return Ok(new { success = false, message = "Close Office Request Not Found" });
                }

                _closeoffice.Status = "Approve";
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("RejectClosedRequestById/{id}")]
        public async Task<ActionResult<ClosedOffice>> RejectClosedRequestById(int id)
        {
            try
            {

                var _closeoffice = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();
                if (_closeoffice == null)
                {
                    return Ok(new { success = false, message = "Close Office Request Not Found" });
                }

                _closeoffice.Status = "Reject";
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("ActiveClosedRequestById/{id}")]
        public async Task<ActionResult<ClosedOffice>> ActiveClosedRequestById(int id)
        {
            try
            {

                var _closeoffice = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();
                if (_closeoffice == null)
                {
                    return Ok(new { success = false, message = "Close Office Request Not Found" });
                }

                _closeoffice.Status = "Active";
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("UpdateClosedOfficeRequest{id}")]
        public async Task<IActionResult> Update(int id, ClosedOfficeRequest ClosedOffice)
        {
            try
            {
                if (id != ClosedOffice.ClosedOfficeId) return BadRequest();
                _context.Entry(ClosedOffice).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("RejectClosedOfficeRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> RejectCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();

                if (_result == null)
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

        [HttpGet("ApproveClosedOfficeRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> ApproveCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }


                var closedOffice = _context.ClosedOffice.Where(x => x.ClosedOfficeId == _result.ClosedOfficeId).FirstOrDefault();
                if (closedOffice == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                if (closedOffice.Status == true)
                {
                    return Ok(new { success = false, message = "This Room Is Already Booked" });
                }


                //_result.StartDate = DateTime.Now;
                //_result.EndDate = DateTime.Now.AddDays(30);

                _result.Status = "Approve";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                //closedOffice.Status = true;
                //_context.Entry(closedOffice).State = EntityState.Modified;
                //await _context.SaveChangesAsync();

                return Ok(new { success = true });

            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("ActivateCoWorkingSpaceRequest/{id}")]
        public async Task<ActionResult<CoWorkingSpace>> ActivateCoWorkingSpaceRequest(int id)
        {
            try
            {
                var _result = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == id).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }


                var closedOffice = _context.ClosedOffice.Where(x => x.ClosedOfficeId == _result.ClosedOfficeId).FirstOrDefault();
                if (closedOffice == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                if (closedOffice.Status == true)
                {
                    return Ok(new { success = false, message = "This Room Is Already Booked" });
                }


                _result.StartDate = DateTime.Now;
                _result.EndDate = DateTime.Now.AddDays(30);

                _result.Status = "Activate";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                closedOffice.Status = true;
                _context.Entry(closedOffice).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });

            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UploadDocumentClosedOfficeRequest")]
        public async Task<ActionResult<CoWorkingSpace>> UploadDocumentClosedOfficeRequest(ClosedOfficeRequestDocument model)
        {
            try
            {
                var _result = _context.ClosedOfficeRequest.Where(x => x.ClosedOfficeRequestId == model.ClosedOfficeRequestId).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                if (model.documentlist != null)
                {
                    if (model.documentlist.Count > 0)
                    {
                        int i = 0;
                        foreach (var item in model.documentlist)
                        {
                            i++;
                            var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                            _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, 0, _result.ClosedOfficeRequestId, model.EmployeeId, fileName, item.DocumentType, "ClosedOffice");
                        }
                    }
                }

                var documents = await _context.Documents
                .Where(d => d.ClosedOfficeRequestId == _result.ClosedOfficeRequestId)
                .ToListAsync();


                return Ok(new { success = true, data = documents });

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
        public async Task<IActionResult> ExportClosedOfficeList([FromQuery] int statusId = 0)
        {

            try
            {
                var _result = await (from co in _context.ClosedOfficeRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     join clo in _context.ClosedOffice on co.ClosedOfficeId equals clo.ClosedOfficeId into iclo
                                     from clos in iclo.DefaultIfEmpty()
                                     select new
                                     {
                                         co.ClosedOfficeRequestId,
                                         co.ClosedOfficeId,
                                         co.EmployeeId,
                                         co.StartDate,
                                         co.EndDate,
                                         clos.CloseOfficeName,
                                         clos.OfficeSizes,
                                         co.CreateDate,
                                         co.Price,
                                         co.Status,
                                         emp.FirstNames,
                                     }).ToListAsync();


                var csv = new StringBuilder();
                csv.AppendLine("ClosedOfficeRequestId,ClosedOfficeId,EmployeeId,EmployeeFullName,CreateDate,Price,Status");
                foreach (var item in _result)
                {
                    csv.AppendLine($"{item.ClosedOfficeRequestId},{item.ClosedOfficeId},{item.EmployeeId},\"{item.FirstNames}\",\"{item.CreateDate}\",{item.Price},{item.Status}");
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                var fileName = $"ClosedOff_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                return File(bytes, "text/csv", fileName);

            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }




        }

    }


} 



public class ClosedOfficeRequestDocument
{
   
    public List<ClosedDocumentData> documentlist { get; set; }
    public int ClosedOfficeRequestId { get; set; }
    public int EmployeeId { get; set; }
}
public class ClosedDocumentData
{
    public string Base64Data { get; set; }
    public string DocumentType { get; set; }
    public string Extension { get; set; }

}