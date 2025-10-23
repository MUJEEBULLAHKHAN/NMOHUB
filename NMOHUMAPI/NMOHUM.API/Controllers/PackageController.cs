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
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using static NMOHUM.API.Models.EventResource;


namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
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
        public PackageController(
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



        //// GET: api/Package
        //[HttpGet]
        //[Route("ViewAllPackages")]
        //public async Task<ActionResult<IEnumerable<object>>> ViewAllPackages()
        //{
        //    var packages = await _context.Package
        //        .Include(p => p.Service)
        //        .Select(p => new
        //        {
        //            Package = p,
        //            ServiceName = p.Service.Name

        //        })
        //        .ToListAsync();

        //    return Ok(new { message = "Packages fetched successfully", data = packages });
        //}


        // GET: api/Package
        [HttpGet]
        [Route("GetAllPackages")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPackages()
        {
            var packages = await _context.Package
                .Select(p => new
                {
                    p.PackageId,
                    p.Name,
                    p.Price,
                    p.BillingPackage,
                    p.Features,
                    p.OfficeAddress,
                    p.MeetingAccessRoomConsume,
                    p.PackageValidityInMonth,
                    p.UpdatedBy,
                    p.UpdatedDate,
                })
                .ToListAsync();

            return Ok(new { message = "Packages fetched successfully", data = packages });
        }

        // GET: api/Package/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPackage(int id)
        {
            var package = await _context.Package
                .Where(p => p.PackageId == id)
                .Select(p => new
                {
                    p.PackageId,
                    p.Name,
                    p.Price,
                    p.BillingPackage,
                    p.Features,
                    p.OfficeAddress,
                    p.MeetingAccessRoomConsume,
                    p.PackageValidityInMonth,
                    p.UpdatedBy,
                    p.UpdatedDate,
                })
                .FirstOrDefaultAsync();

            if (package == null)
                return NotFound(new { message = "Package not found" });

            return Ok(new { message = "Package fetched successfully", data = package });
        }

        //[HttpGet("GetPackagesByServiceId/{ServiceId}")]
        //public async Task<ActionResult<object>> GetPackagesByServiceId(int ServiceId)
        //{
        //    var package = await _context.Package
        //        .Include(p => p.Service)
        //        .Where(p => p.ServiceId == ServiceId)
        //        .Select(p => new
        //        {
        //            p.Id,
        //            p.Name,
        //            p.Price,
        //            p.ServiceId,
        //            ServiceName = p.Service.Name
        //        })
        //        .ToListAsync();

        //    if (package == null)
        //        return NotFound(new { message = "Packages not found" });

        //    return Ok(new { message = "Packages fetched successfully", data = package });
        //}

        //[HttpGet("GetPackagesByServiceId/{ServiceId}")]
        //public async Task<ActionResult<object>> GetPackagesByServiceId(int ServiceId)
        //{
        //    var package = await _context.Package
        //        .Include(p => p.Service)
        //        .Where(p => p.ServiceId == ServiceId)
        //        .ToListAsync();

        //    if (package == null)
        //        return NotFound(new { message = "Packages not found" });

        //    return Ok(new { message = "Packages fetched successfully", data = package });
        //}


        // POST: api/Package
        //[HttpPost]
        //public async Task<ActionResult> CreatePackage(Package package)
        //{
        //    var serviceExists = await _context.Service.Where(s => s.Id == package.ServiceId).FirstOrDefaultAsync();
        //    if (serviceExists == null)
        //        return BadRequest(new { message = "Invalid ServiceId" });

        //    _context.Package.Add(package);
        //    serviceExists.HasPackages = true;
        //    _context.Service.Update(serviceExists);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetPackage), new { id = package.Id }, new { message = "Package created successfully", data = package });
        //}

        // PUT: api/Package/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackage(int id, Package package)
        {
            if (id != package.PackageId)
                return BadRequest(new { message = "Package ID mismatch" });

            var existing = await _context.Package.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Package not found" });


            existing.Name = package.Name;
            existing.Price = package.Price;
            existing.BillingPackage = package.BillingPackage;
            existing.Features = package.Features;
            existing.OfficeAddress = package.OfficeAddress;
            existing.MeetingAccessRoomConsume = package.MeetingAccessRoomConsume;
            existing.PackageValidityInMonth = package.PackageValidityInMonth;
            existing.UpdatedBy = package.UpdatedBy;
            existing.UpdatedDate = package.UpdatedDate;
            _context.Package.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Package updated successfully", data = existing });
        }

        // DELETE: api/Package/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackage(int id)
        {
            var package = await _context.Package.FindAsync(id);
            if (package == null)
                return NotFound(new { message = "Package not found" });

            _context.Package.Remove(package);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Package deleted successfully" });
        }





        // Package Request

        [HttpGet]
        [Route("GetAllPackageRequestRequestByEmployeeId/{employeeid}")]
        public async Task<ActionResult<object>> GetAllPackageRequestRequestByEmployeeId(int EmployeeId)
        {
            try
            {
                var _result = await (from co in _context.PackageRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.EmployeeId == EmployeeId
                                     select new
                                     {
                                         co.PackageRequestId,
                                         co.PackageId,
                                         co.EmployeeId,
                                         co.Name,
                                         co.Price,
                                         co.MeetingAccessRoomQty,
                                         co.PackageValidityInMonth,
                                         co.ExpiryDate,
                                         co.OfficeAddress,
                                         co.Status,
                                         co.CreatedDate,
                                         co.CreatedBy,
                                         emp.FirstNames,
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
        [Route("GetAllPackageRequestRequest")]
        public async Task<ActionResult<object>> GetAllPackageRequestRequest()
        {
            try
            {
                var _result = await (from co in _context.PackageRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     select new
                                     {
                                         co.PackageRequestId,
                                         co.PackageId,
                                         co.EmployeeId,
                                         co.Name,
                                         co.Price,
                                         co.MeetingAccessRoomQty,
                                         co.PackageValidityInMonth,
                                         co.ExpiryDate,
                                         co.OfficeAddress,
                                         co.Status,
                                         co.CreatedDate,
                                         co.CreatedBy,
                                         emp.FirstNames,
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


        [HttpGet("GetPackageRequestRequest/{id}")]
        public async Task<ActionResult<PackageRequest>> GetPackageRequestRequest(int id)
        {
            try
            {
                var _result = await (from co in _context.PackageRequest
                                     join em in _context.Employee on co.EmployeeId equals em.EmployeeId into iem
                                     from emp in iem.DefaultIfEmpty()
                                     where co.PackageRequestId == id
                                     select new
                                     {
                                         co.PackageRequestId,
                                         co.PackageId,
                                         co.EmployeeId,
                                         co.CreatedDate,
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

        [HttpPost("CreateVirtualRequest")]
        public async Task<ActionResult<PackageRequest>> Create(PackageRequest model)
        {
            try
            {
                var _package = _context.Package.Where(x => x.PackageId == model.PackageId).FirstOrDefault();
                if (_package == null)
                    return BadRequest(new { success = false, message = "Package Not Found" });


                if (model.EmployeeId == null || model.EmployeeId <= 0)
                {

                    if (string.IsNullOrWhiteSpace(model.EmailAddress))
                        return BadRequest(new { success = false, message = "Email address is required." });
                    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == model.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                    if (existingEmployee != null)
                    {
                        model.EmployeeId = existingEmployee.EmployeeId;

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(model.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(model.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[model.EmailAddress] != model.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(model.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        existingEmployee.NationalID = model.NationalID;
                        existingEmployee.CommercialRegistration = model.CommercialRegistration;
                        existingEmployee.CompanyName = model.CompanyName;
                        await _context.SaveChangesAsync();

                    }
                    else
                    {

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(model.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(model.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[model.EmailAddress] != model.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(model.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        // create user and create request with that user inofrmation

                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = model.EmailAddress,
                            UserName = model.EmailAddress
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
                            FirstNames = model.FullName,
                            LastName = model.FullName,
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = model.MobileNumber,
                            NationalID = model.NationalID,
                            CommercialRegistration = model.CommercialRegistration,
                            CompanyName = model.CompanyName
                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();


                        // Send password via email
                        string[] emailList = new string[1] { model.EmailAddress };
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
                        model.EmployeeId = employee.EmployeeId;

                    }

                }
                else
                {
                    model.EmployeeId = model.EmployeeId;
                }


                model.Name = _package.Name;
                model.Price = _package.Price;
                model.MeetingAccessRoomQty = _package.MeetingAccessRoomConsume;
                model.OfficeAddress = _package.OfficeAddress;
                model.PackageValidityInMonth = _package.PackageValidityInMonth;

                model.Status = "Submit";
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = model.EmployeeId;
                _context.PackageRequest.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("RejectPackageRequestRequest/{id}")]
        public async Task<ActionResult<PackageRequest>> RejectPackageRequestRequest(int id)
        {
            try
            {
                var _result = _context.PackageRequest.Where(x => x.PackageRequestId == id).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                var _employee = _context.Employee.Where(x => x.EmployeeId == _result.EmployeeId).FirstOrDefault();

                if (_employee == null)
                {
                    return Ok(new { success = false, message = "User Not Found" });
                }

                _result.Status = "Reject";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                string[] emailList = new string[1] { _employee.EmailAddress };
                _mailer.SendEmail(
   emailList,
   "support@nmohub.com",
   "NMOHUB Your Request Is Rejected", // fixed character encoding
   $@"",
   true
);

                return Ok(new { success = true });

            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("ApprovePackageRequestRequest/{id}")]
        public async Task<ActionResult<PackageRequest>> ApprovePackageRequestRequest(int id)
        {
            try
            {
                var _result = _context.PackageRequest.Where(x => x.PackageRequestId == id).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                var _employee = _context.Employee.Where(x => x.EmployeeId == _result.EmployeeId).FirstOrDefault();

                if (_employee == null)
                {
                    return Ok(new { success = false, message = "User Not Found" });
                }

                var _package = _context.Package.Where(x => x.PackageId == _result.PackageId).FirstOrDefault();
                if (_package == null)
                    return BadRequest(new { success = false, message = "Package Not Found" });


                _result.ExpiryDate = DateTime.Now.AddMonths(_result.PackageValidityInMonth);

                _result.Status = "Approve";
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                string[] emailList = new string[1] { _employee.EmailAddress };
                _mailer.SendEmail(
   emailList,
   "support@nmohub.com",
   "NMOHUB Approved Your Request", // fixed character encoding
   $@"
     <p>Congratulations,Your Request Is Approved.</p>
     <p>Please find your credentials below:</p>
     <p><strong>Your Address is:</strong> {_result.OfficeAddress} </p>
<br>
<p>Features below:</p>
     <p><strong>  {_package.Features} </strong> </p>
 ",
   true
);

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


            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[model.EmailAddress] = otp;
            string[] emailList = new string[1] { model.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "  NMOHUB Email Verification", $"Welcome to NMOHUB!.\r\n Please find your Otp for Verification.\r\nYour OTP code is: {otp}", true);

            // _mailer.SendEmail(emailList, "support@nmohub.com", "Your OTP Code", $"Your OTP code is: {otp}", true);

            return Ok(new { success = true, message = "OTP sent to email." });
        }


        [HttpPost("CreateMeetingAccessRequest")]
        public async Task<ActionResult<MeetingAccessRoom>> Create(PackageMeetingSlots model)
        {
            try
            {
                var existingEmployee = _context.Employee.Where(e => e.EmployeeId == model.EmployeeId).FirstOrDefault();
                if (existingEmployee == null)
                {
                    return Ok(new { success = false, message = "Empoyee Not Found" });
                }

                var _result = _context.PackageRequest.Where(x => x.PackageRequestId == model.PackageRequestId).FirstOrDefault();

                if (_result == null)
                {
                    return Ok(new { success = false, message = "Record Not Found" });
                }

                if (_result.MeetingAccessRoomQty <= 0)
                {
                    return Ok(new { success = false, message = "You Can't Book You Don't have Meeting Access Room" });
                }

                var slot = await _context.MeetingSlots.Where(s => s.MeetingSlotId == model.MeetingSlotId).FirstOrDefaultAsync();

                if (slot == null)
                    return Ok(new { success = false, message = "Slot not found" });

                if (slot.Status == "Booked")
                    return Ok(new { success = false, message = "Slot already booked" });

                //var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == meetingAccessRoom.MeetingSlotId);

                slot.Status = "Booked";
                slot.EmployeeId = model.EmployeeId;
                slot.BookedBy = model.EmployeeId;
                _context.Entry(slot).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                _result.MeetingAccessRoomQty = _result.MeetingAccessRoomQty - 1;
                _context.Entry(_result).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }


        [HttpGet]
        [Route("GetAllMeetingSlots/{id}")]
        public async Task<object> GetAllMeetingSlotsAsync(int id)
        {
            try
            {
                var slots = await _context.MeetingSlots.Where(x => x.EmployeeId == id).
                Select(p => new
                {
                    p.MeetingSlotId,
                    p.SlotDate,
                    p.StartTime,
                    p.EndTime,
                    p.Status,
                    p.BookedBy,

                    //StartTime = "10:00",
                    //EndTime = "10:00",
                    Id = p.MeetingSlotId,
                    Title = p.IsMeetingRoomOne == true ? "Meeting R - 1" : (p.IsMeetingRoomTwo == true ? "Meeting R - 2" : ""),
                    Date = p.SlotDate,
                    Type = p.Status == "Available" ? "green" : "gray",
                    p.IsMeetingRoomOne,
                    p.IsMeetingRoomTwo
                }).ToListAsync();

                return Ok(new { success = true, message = "Success", Data = slots });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }

        }

        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }
    }
}


public class PackageMeetingSlots
{
    public int MeetingSlotId { get; set; }
    public int EmployeeId { get; set; }
    public int PackageRequestId { get; set; }
}