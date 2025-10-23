using Azure.Storage.Blobs.Models;
using Google.Apis.Calendar.v3.Data;
using iText.Layout.Element;
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
using System.Text;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using static NMOHUM.API.Models.EventResource;


namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingAccessRoomController : ControllerBase
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
        public MeetingAccessRoomController(
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
        [Route("GetAllMeetingAccessRoom")]
        public async Task<ActionResult<IEnumerable<MeetingAccessRoom>>> GetAllCountries() =>
            await _context.MeetingAccessRoom.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<MeetingAccessRoom>> GetMeetingAccessRoom(int id)
        {

            try
            {
                var meetingAccessRoom = await _context.MeetingAccessRoom.FindAsync(id);

                return Ok(new { success = true, data = meetingAccessRoom });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<MeetingAccessRoom>> Create(MeetingAccessRoom meetingAccessRoom)
        {
            try
            {
                meetingAccessRoom.BIllingCycleUnit = "Hour";
                meetingAccessRoom.DailyHours = meetingAccessRoom.DailyHours;
                _context.MeetingAccessRoom.Add(meetingAccessRoom);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = meetingAccessRoom });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MeetingAccessRoom meetingAccessRoom)
        {
            try
            {
                if (id != meetingAccessRoom.MeetingAccessRoomId) return BadRequest();
                _context.Entry(meetingAccessRoom).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = meetingAccessRoom });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }


        //[HttpPost("send-otp")]
        //public async Task<IActionResult> SendOtpToEmail([FromBody] EmailAddressModel model)
        //{
        //    if (string.IsNullOrWhiteSpace(model.EmailAddress))
        //        return BadRequest(new { success = false, message = "Email address is required." });

        //    // Check if email already exists in IdentityUser table
        //    var existingUser = await _userManager.FindByEmailAsync(model.EmailAddress);
        //    if (existingUser != null)
        //    {
        //        return BadRequest(new { success = false, message = "Email address already registered." });
        //    }

        //    // Check if email already exists in Employee table
        //    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == model.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
        //    if (existingEmployee != null)
        //    {
        //        return BadRequest(new { success = false, message = "Email address already registered." });
        //    }

        //    var otp = new Random().Next(100000, 999999).ToString();
        //    _otpStore[model.EmailAddress] = otp;
        //    string[] emailList = new string[1] { model.EmailAddress };
        //    _mailer.SendEmail(emailList, "support@nmohub.com", "  NMOHUB Email Verification", $"Welcome to NMOHUB!.\r\n Please find your Otp for Verification.\r\nYour OTP code is: {otp}", true);

        //    // _mailer.SendEmail(emailList, "support@nmohub.com", "Your OTP Code", $"Your OTP code is: {otp}", true);

        //    return Ok(new { success = true, message = "OTP sent to email." });
        //}

        // Meeting Access Room Request

        [HttpGet]
        [Route("GetAllMeetingAccessRequestByEmployeeId/{employeeid}")]
        public async Task<ActionResult<object>> GetAllMeetingAccessRequestByEmployeeId(int EmployeeId)
        {
            try
            {
                var meetingAccessRoomRequest = await (from mr in _context.MeetingAccessRoomRequest
                                                      join ma in _context.MeetingAccessRoom on mr.MeetingAccessRoomId equals ma.MeetingAccessRoomId into ima
                                                      from mar in ima.DefaultIfEmpty()
                                                      join ms in _context.MeetingSlots on mr.MeetingSlotId equals ms.MeetingSlotId into ims
                                                      from mss in ims.DefaultIfEmpty()
                                                      join em in _context.Employee on mr.EmployeeId equals em.EmployeeId into iem
                                                      from emp in iem.DefaultIfEmpty()
                                                      where mr.EmployeeId == EmployeeId
                                                      select new
                                                      {
                                                          mr.MeetingAccessRoomRequestId,
                                                          mr.EmployeeId,
                                                          mr.MeetingSlotId,
                                                          mr.CreateDate,
                                                          mr.Amount,
                                                          mr.BookType,
                                                          mr.Status,
                                                          BookingSlot = mss.Status,
                                                          mss.SlotDate,
                                                          mss.StartTime,
                                                          mss.EndTime,
                                                          emp.FirstNames,
                                                          mar.MeetingAccessRoomId,
                                                          mar.Price,
                                                          mar.BIllingCycleUnit,
                                                          mar.DailyHours,
                                                          mar.Features,
                                                          mar.Description,
                                                      }).ToListAsync();

                return Ok(new { success = true, data = meetingAccessRoomRequest });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
            
        }

        [HttpGet]
        [Route("GetAllMeetingAccessRequest")]
        public async Task<ActionResult<object>> GetAllMeetingAccessRequest()
        {
            try
            {
                var meetingAccessRoomRequest = await (from mr in _context.MeetingAccessRoomRequest
                                                      join ma in _context.MeetingAccessRoom on mr.MeetingAccessRoomId equals ma.MeetingAccessRoomId into ima
                                                      from mar in ima.DefaultIfEmpty()
                                                      join ms in _context.MeetingSlots on mr.MeetingSlotId equals ms.MeetingSlotId into ims
                                                      from mss in ims.DefaultIfEmpty()
                                                      join em in _context.Employee on mr.EmployeeId equals em.EmployeeId into iem
                                                      from emp in iem.DefaultIfEmpty()
                                                      select new
                                                      {
                                                          mr.MeetingAccessRoomRequestId,
                                                          mr.EmployeeId,
                                                          mr.MeetingSlotId,
                                                          mr.CreateDate,
                                                          mr.Amount,
                                                          mr.BookType,
                                                          mr.Status,
                                                          BookingSlot = mss.Status,
                                                          mss.SlotDate,
                                                          mss.StartTime,
                                                          mss.EndTime,
                                                          emp.FirstNames,
                                                          mar.MeetingAccessRoomId,
                                                          mar.Price,
                                                          mar.BIllingCycleUnit,
                                                          mar.DailyHours,
                                                          mar.Features,
                                                          mar.Description,
                                                      }).ToListAsync();

                return Ok(new { success = true, data = meetingAccessRoomRequest });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }

        }

        [HttpGet("MeetingAccessRequest/{id}")]

        public async Task<ActionResult<object>> MeetingAccessRequestId(int id)
        {
            try
            {
                var meetingAccessRoomRequest = await (from mr in _context.MeetingAccessRoomRequest
                                                      join ma in _context.MeetingAccessRoom on mr.MeetingAccessRoomId equals ma.MeetingAccessRoomId into ima
                                                      from mar in ima.DefaultIfEmpty()
                                                      join ms in _context.MeetingSlots on mr.MeetingSlotId equals ms.MeetingSlotId into ims
                                                      from mss in ims.DefaultIfEmpty()
                                                      join em in _context.Employee on mr.EmployeeId equals em.EmployeeId into iem
                                                      from emp in iem.DefaultIfEmpty()
                                                      where mr.MeetingAccessRoomRequestId == id
                                                      select new
                                                      {
                                                          mr.MeetingAccessRoomRequestId,
                                                          mr.EmployeeId,
                                                          mr.MeetingSlotId,
                                                          mr.CreateDate,
                                                          mr.Amount,
                                                          mr.BookType,
                                                          mr.Status,
                                                          BookingSlot = mss.Status,
                                                          mss.SlotDate,
                                                          mss.StartTime,
                                                          mss.EndTime,
                                                          emp.FirstNames,
                                                          mar.MeetingAccessRoomId,
                                                          mar.Price,
                                                          mar.BIllingCycleUnit,
                                                          mar.DailyHours,
                                                          mar.Features,
                                                          mar.Description,
                                                      }).FirstOrDefaultAsync();

                return Ok(new { success = true, data = meetingAccessRoomRequest });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateMeetingAccessRequest")]
        public async Task<ActionResult<MeetingAccessRoom>> Create(MeetingAccessRoomRequest meetingAccessRoom)
        {
            try
            {
                if (meetingAccessRoom.EmployeeId == null || meetingAccessRoom.EmployeeId <= 0)
                {
                    if (string.IsNullOrWhiteSpace(meetingAccessRoom.EmailAddress))
                        return BadRequest(new { success = false, message = "Email address is required." });
                    var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == meetingAccessRoom.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                    if (existingEmployee != null)
                    {
                        meetingAccessRoom.EmployeeId = existingEmployee.EmployeeId;

                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(meetingAccessRoom.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(meetingAccessRoom.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[meetingAccessRoom.EmailAddress] != meetingAccessRoom.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(meetingAccessRoom.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        existingEmployee.NationalID = meetingAccessRoom.NationalID;
                        existingEmployee.CommercialRegistration = meetingAccessRoom.CommercialRegistration;
                        existingEmployee.CompanyName = meetingAccessRoom.CompanyName;
                        await _context.SaveChangesAsync();

                    }
                    else
                    {
                        // Step 1: Verify OTP
                        if (string.IsNullOrWhiteSpace(meetingAccessRoom.EmailAddress))
                            return BadRequest(new { success = false, message = "Email are required." });


                        if (string.IsNullOrWhiteSpace(meetingAccessRoom.Otp))
                            return BadRequest(new { success = false, message = "OTP are required." });

                        if (_otpStore[meetingAccessRoom.EmailAddress] != meetingAccessRoom.Otp)
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        if (!_otpStore.ContainsKey(meetingAccessRoom.EmailAddress))
                            return BadRequest(new { success = false, message = "Invalid OTP." });

                        // create user and create request with that user inofrmation

                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = meetingAccessRoom.EmailAddress,
                            UserName = meetingAccessRoom.EmailAddress
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
                            FirstNames = meetingAccessRoom.FullName,
                            LastName = meetingAccessRoom.FullName,
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = meetingAccessRoom.MobileNumber,
                            NationalID = meetingAccessRoom.NationalID,
                            CommercialRegistration = meetingAccessRoom.CommercialRegistration,
                            CompanyName = meetingAccessRoom.CompanyName
                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();


                        // Send password via email
                        string[] emailList = new string[1] { meetingAccessRoom.EmailAddress };
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
                        meetingAccessRoom.EmployeeId = employee.EmployeeId;

                    }

                }
                else
                {
                    meetingAccessRoom.EmployeeId = meetingAccessRoom.EmployeeId;
                }

                var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == meetingAccessRoom.MeetingSlotId);

                if (slot == null)
                    return Ok(new { success = false, message = "Slot not found" });

                if (slot.Status == "Booked")
                    return Ok(new { success = false, message = "Slot already booked" });

                meetingAccessRoom.Status = "Activate";
                _context.MeetingAccessRoomRequest.Add(meetingAccessRoom);
                await _context.SaveChangesAsync();

                //var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == meetingAccessRoom.MeetingSlotId);

                slot.Status = "Booked";
                slot.BookedBy = meetingAccessRoom.EmployeeId;
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


        [HttpPut("UpdateMeetingAccessRequest/{id}")]
        public async Task<IActionResult> Update(int id, MeetingAccessRoomRequest meetingAccessRoom)
        {
            try
            {
                if (id != meetingAccessRoom.MeetingAccessRoomId) return BadRequest();
                _context.Entry(meetingAccessRoom).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
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

        [HttpGet("export")]
        public async Task<IActionResult> ExportMeetingAccessRoomList([FromQuery] int statusId = 0)
        {

            try
            {
                var meetingAccessRoomRequest = await (from mr in _context.MeetingAccessRoomRequest
                                                      join ma in _context.MeetingAccessRoom on mr.MeetingAccessRoomId equals ma.MeetingAccessRoomId into ima
                                                      from mar in ima.DefaultIfEmpty()
                                                      join ms in _context.MeetingSlots on mr.MeetingSlotId equals ms.MeetingSlotId into ims
                                                      from mss in ims.DefaultIfEmpty()
                                                      join em in _context.Employee on mr.EmployeeId equals em.EmployeeId into iem
                                                      from emp in iem.DefaultIfEmpty()
                                                      select new
                                                      {
                                                          mr.MeetingAccessRoomRequestId,
                                                          mr.EmployeeId,
                                                          mr.MeetingSlotId,
                                                          mr.CreateDate,
                                                          mr.Amount,
                                                          mr.BookType,
                                                          mr.Status,
                                                          BookingSlot = mss.Status,
                                                          mss.SlotDate,
                                                          mss.StartTime,
                                                          mss.EndTime,
                                                          emp.FirstNames,
                                                          mar.MeetingAccessRoomId,
                                                          mar.Price,
                                                          mar.BIllingCycleUnit,
                                                          mar.DailyHours,
                                                          mar.Features,
                                                          mar.Description,
                                                      }).ToListAsync();




                var csv = new StringBuilder(); 
                csv.AppendLine("MeetingAccessRoomRequestId,EmployeeId,EmployeeFullName,MeetingSlotId,CreateDate,Amount,Status");
                foreach (var item in meetingAccessRoomRequest)
                {
                    csv.AppendLine($"{item.MeetingAccessRoomRequestId},{item.EmployeeId},\"{item.FirstNames}\",\"{item.MeetingSlotId}\",\"{item.CreateDate}\",{item.Amount},{item.Status}");
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                var fileName = $"MeetingAcc_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                return File(bytes, "text/csv", fileName);

            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }



   
        }

    }
}