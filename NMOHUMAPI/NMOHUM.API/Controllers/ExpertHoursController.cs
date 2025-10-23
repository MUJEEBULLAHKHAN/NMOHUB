using Google.Apis.Calendar.v3.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Services;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static NMOHUM.API.Models.Invoice;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpertHoursController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly Mailer _mailer;
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;
        private readonly IEventService eventService;
        public ExpertHoursController(NMOHUMAuthenticationContext context, Mailer mailer, UserManager<IdentityUser> userManager, IFileStorageServiceHandler fileStorageServiceHandler, IEventService eventService)
        {
            _context = context;
            _userManager = userManager;
            _mailer = mailer;
            _fileStorageServiceHandler = fileStorageServiceHandler;
            this.eventService = eventService;
        }

        // RegisterExpertApi
        [HttpPost("register")]
        public async Task<IActionResult> RegisterExpert([FromBody] ExpertDto expertDto)
        {
            // Step 2: Check if user exists
            var existingUser = await _userManager.FindByEmailAsync(expertDto.Email);
            Employee employee = null;

            if (existingUser == null)
            {
                var password = GenerateRandomPassword();
                var user = new IdentityUser
                {
                    Email = expertDto.Email,
                    UserName = expertDto.Email
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                    return BadRequest(new { success = false, message = "Failed to create user.", errors = result.Errors });

                // Assign RoleId = 1
                _context.UserRoles.Add(new IdentityUserRole<string>
                {
                    RoleId = "9",
                    UserId = user.Id
                });
                await _context.SaveChangesAsync();

                // Create employee record
                employee = new Employee
                {
                    FirstNames = expertDto.FullName,
                    LastName = " ",
                    UserId = user.Id,
                    EmailAddress = user.Email,
                    MobileNumber = expertDto.PhoneNumber,
                    CountryId = 1,
                    DateOfBirth = DateTime.Now,
                    LinkedInProfileLink = expertDto.LinkedInProfileURL
                };
                _context.Employee.Add(employee);
                await _context.SaveChangesAsync();

                string profilePicUrl = null;
                if (expertDto.ProfilePicture != null)
                {
                    profilePicUrl = _fileStorageServiceHandler.SaveDocument(expertDto.ProfilePicture, "ExpertProfilePicture");
                }
                //send project submitted confirmation email
                string[] emailList1 = new string[1] { expertDto.Email };
                //    _mailer.SendEmail(emailList1, "support@nmohub.com", "NMOHUB Project Submission Complete", $"Your project has been submitted successfully. Use Case ID: {projectRequest.CaseId} to track your status.", true);
                _mailer.SendEmail(
     emailList1,
     "support@nmohub.com",
     "NMOHUB Registration Complete – Login Info Inside", // fixed character encoding
     $@"
        <p>Congratulations for Registration.</p>
        <p>Please find your credentials below:</p>
        <p><strong>Your password is:</strong> {password}</p>
    ",
     true
 );

                var expert = new Expert
                {
                    FullName = expertDto.FullName,
                    Email = expertDto.Email,
                    PhoneNumber = expertDto.PhoneNumber,
                    Nationality = expertDto.Nationality,
                    IDType = expertDto.IDType,
                    IDNumber = expertDto.IDNumber,
                    ProfilePicture = profilePicUrl,
                    ExperienceYears = expertDto.ExperienceYears,
                    EducationDetails = expertDto.EducationDetails,
                    LinkedInProfileURL = expertDto.LinkedInProfileURL,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                };
                _context.Expert.Add(expert);
                await _context.SaveChangesAsync();

                // Add area of expertise links
                if (expertDto.AreaOfExpertiseIDs != null)
                {
                    foreach (var areaId in expertDto.AreaOfExpertiseIDs)
                    {
                        _context.ExpertAreaOfExpertise.Add(new ExpertAreaOfExpertise
                        {
                            ExpertID = expert.ExpertID,
                            AreaOfExpertiseID = areaId
                        });
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new { success = true, expertId = expert.ExpertID });
            }
            else
            {
                // If user already exists, return a suitable response
                return BadRequest(new { success = false, message = "User with this email already exists." });
            }
        }


        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }
        // ActiveExpert
        [HttpPost("activate/{expertId}")]
        public async Task<IActionResult> ActivateExpert(int expertId)
        {
            var expert = await _context.Expert.FindAsync(expertId);
            if (expert == null) return NotFound();
            expert.Status = "Active";
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // InActiveExpert
        [HttpPost("deactivate/{expertId}")]
        public async Task<IActionResult> DeactivateExpert(int expertId)
        {
            var expert = await _context.Expert.FindAsync(expertId);
            if (expert == null) return NotFound();
            expert.Status = "Inactive";
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // RejectExpert
        [HttpPost("reject/{expertId}")]
        public async Task<IActionResult> RejectExpert(int expertId, [FromBody] RejectObjectModel reason)
        {
            var expert = await _context.Expert.FindAsync(expertId);
            if (expert == null) return NotFound();
            expert.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // ViewExpertProfileByExpertId
        [HttpGet("profile/{expertId}")]
        public async Task<ActionResult<ExpertDto>> ViewExpertProfileByExpertId(int expertId)
        {
            var expert = await _context.Expert.FindAsync(expertId);
            if (expert == null) return NotFound();

            // Get area of expertise IDs for this expert
            var areaIds = await _context.ExpertAreaOfExpertise
                .Where(ea => ea.ExpertID == expertId)
                .Select(ea => ea.AreaOfExpertiseID)
                .ToListAsync();

            // Optionally, get area names as well
            var areaNames = await _context.AreaOfExpertise
                .Where(a => areaIds.Contains(a.AreaOfExpertiseID))
                .Select(a => a.Name)
                .ToListAsync();

            var dto = new ExpertDto
            {
                ExpertID = expert.ExpertID,
                FullName = expert.FullName,
                Email = expert.Email,
                PhoneNumber = expert.PhoneNumber,
                Nationality = expert.Nationality,
                IDType = expert.IDType,
                IDNumber = expert.IDNumber,
                ProfilePicture = expert.ProfilePicture,
                ExperienceYears = expert.ExperienceYears,
                EducationDetails = expert.EducationDetails,
                LinkedInProfileURL = expert.LinkedInProfileURL,
                Status = expert.Status,
                CreatedAt = expert.CreatedAt,
                AreaOfExpertiseIDs = areaIds // Add this to your DTO
                // Optionally, add AreaOfExpertiseNames if you add it to your DTO
            };

            // If you want to return area names as well, you can add a new property to ExpertDto:
            // public List<string> AreaOfExpertiseNames { get; set; }
            // and set: AreaOfExpertiseNames = areaNames

            return Ok(dto);
        }

        // UpdateExpertProfileByExpertId
        [HttpPut("profile/{expertId}")]
        public async Task<IActionResult> UpdateExpertProfileByExpertId(int expertId, [FromBody] ExpertDto expertDto)
        {
            var expert = await _context.Expert.FindAsync(expertId);
            if (expert == null) return NotFound();
            expert.FullName = expertDto.FullName;
            expert.Email = expertDto.Email;
            expert.PhoneNumber = expertDto.PhoneNumber;
            expert.Nationality = expertDto.Nationality;
            expert.IDType = expertDto.IDType;
            expert.IDNumber = expertDto.IDNumber;
            expert.ProfilePicture = expertDto.ProfilePicture;
            expert.ExperienceYears = expertDto.ExperienceYears;
            expert.EducationDetails = expertDto.EducationDetails;
            expert.LinkedInProfileURL = expertDto.LinkedInProfileURL;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // ViewAllExperts
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ExpertDto>>> ViewAllExperts([FromQuery] string status = null)
        {
            var query = _context.Expert.AsQueryable();
            if (!string.IsNullOrEmpty(status))
                query = query.Where(e => e.Status == status);
            var experts = await query.ToListAsync();
            var dtos = experts.Select(expert => new ExpertDto
            {
                ExpertID = expert.ExpertID,
                FullName = expert.FullName,
                Email = expert.Email,
                PhoneNumber = expert.PhoneNumber,
                Nationality = expert.Nationality,
                IDType = expert.IDType,
                IDNumber = expert.IDNumber,
                ProfilePicture = expert.ProfilePicture,
                ExperienceYears = expert.ExperienceYears,
                EducationDetails = expert.EducationDetails,
                LinkedInProfileURL = expert.LinkedInProfileURL,
                Status = expert.Status,
                CreatedAt = expert.CreatedAt
            }).ToList();
            return Ok(dtos);
        }

        // GetAreasOfExpertise
        [HttpGet("get-areas-of-expertise")]
        public async Task<ActionResult<IEnumerable<AreaOfExpertise>>> GetAreasOfExpertise()
        {
            var areas = await _context.AreaOfExpertise.ToListAsync();
            return Ok(areas);
        }

        [HttpPost("create-expertise")]
        public async Task<object> CreateExpertise(AreaOfExpertise model)
        {
            try
            {
                _context.AreaOfExpertise.Add(model);
                await _context.SaveChangesAsync();


                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("update-expertise")]
        public async Task<IActionResult> UpdateExpertise(AreaOfExpertise model)
        {
            try
            {
                var _expert = _context.AreaOfExpertise.Where(x => x.AreaOfExpertiseID == model.AreaOfExpertiseID).FirstOrDefault();

                if (_expert == null)
                {
                    return BadRequest(new { success = false, message = "Expert Not Found" });

                }

                _expert.Name = model.Name;
                _context.Entry(_expert).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("view-all-experts")]
        public async Task<ActionResult<IEnumerable<ExpertDto>>> AllExperts([FromQuery] string status = null)
        {
            var query = _context.Expert.AsQueryable();
            if (!string.IsNullOrEmpty(status))
                query = query.Where(e => e.Status == status);
            var experts = await query.ToListAsync();

            // Get all expert IDs
            var expertIds = experts.Select(e => e.ExpertID).ToList();

            // Get all area links for these experts
            var areaLinks = await _context.ExpertAreaOfExpertise
                .Where(ea => expertIds.Contains(ea.ExpertID))
                .ToListAsync();

            // Get all area IDs
            var areaIds = areaLinks.Select(a => a.AreaOfExpertiseID).Distinct().ToList();

            // Get all area names
            var areaDict = await _context.AreaOfExpertise
                .Where(a => areaIds.Contains(a.AreaOfExpertiseID))
                .ToDictionaryAsync(a => a.AreaOfExpertiseID, a => a.Name);

            var dtos = experts.Select(expert =>
            {
                var expertAreaIds = areaLinks.Where(a => a.ExpertID == expert.ExpertID).Select(a => a.AreaOfExpertiseID).ToList();
                var expertAreaNames = expertAreaIds.Select(id => areaDict.ContainsKey(id) ? areaDict[id] : null).Where(n => n != null).ToList();

                return new ExpertDto
                {
                    ExpertID = expert.ExpertID,
                    FullName = expert.FullName,
                    Email = expert.Email,
                    PhoneNumber = expert.PhoneNumber,
                    Nationality = expert.Nationality,
                    IDType = expert.IDType,
                    IDNumber = expert.IDNumber,
                    ProfilePicture = expert.ProfilePicture,
                    ExperienceYears = expert.ExperienceYears,
                    EducationDetails = expert.EducationDetails,
                    LinkedInProfileURL = expert.LinkedInProfileURL,
                    Status = expert.Status,
                    CreatedAt = expert.CreatedAt,
                    AreaOfExpertiseIDs = expertAreaIds,
                    AreaOfExpertiseNames = expertAreaNames
                };
            }).ToList();

            return Ok(dtos);
        }
        
        [HttpGet("search-experts-by-area")]
        public async Task<ActionResult<IEnumerable<ExpertDto>>> SearchExpertsByArea([FromQuery] int areaOfExpertiseId)
        {
            // Get all active expert IDs for the given area
            var expertIds = await _context.ExpertAreaOfExpertise
                .Where(ea => ea.AreaOfExpertiseID == areaOfExpertiseId)
                .Select(ea => ea.ExpertID)
                .ToListAsync();

            // Get all active experts with those IDs
            var experts = await _context.Expert
                .Where(e => expertIds.Contains(e.ExpertID) && e.Status == "Active")
                .ToListAsync();

            // Get all area links for these experts
            var areaLinks = await _context.ExpertAreaOfExpertise
                .Where(ea => expertIds.Contains(ea.ExpertID))
                .ToListAsync();

            // Get all area IDs
            var areaIds = areaLinks.Select(a => a.AreaOfExpertiseID).Distinct().ToList();

            // Get all area names
            var areaDict = await _context.AreaOfExpertise
                .Where(a => areaIds.Contains(a.AreaOfExpertiseID))
                .ToDictionaryAsync(a => a.AreaOfExpertiseID, a => a.Name);

            var dtos = experts.Select(expert =>
            {
                var expertAreaIds = areaLinks.Where(a => a.ExpertID == expert.ExpertID).Select(a => a.AreaOfExpertiseID).ToList();
                var expertAreaNames = expertAreaIds.Select(id => areaDict.ContainsKey(id) ? areaDict[id] : null).Where(n => n != null).ToList();

                return new ExpertDto
                {
                    ExpertID = expert.ExpertID,
                    FullName = expert.FullName,
                    Email = expert.Email,
                    PhoneNumber = expert.PhoneNumber,
                    Nationality = expert.Nationality,
                    IDType = expert.IDType,
                    IDNumber = expert.IDNumber,
                    ProfilePicture = expert.ProfilePicture,
                    ExperienceYears = expert.ExperienceYears,
                    EducationDetails = expert.EducationDetails,
                    LinkedInProfileURL = expert.LinkedInProfileURL,
                    Status = expert.Status,
                    CreatedAt = expert.CreatedAt,
                    AreaOfExpertiseIDs = expertAreaIds,
                    AreaOfExpertiseNames = expertAreaNames
                };
            }).ToList();

            return Ok(dtos);
        }


        [HttpGet("availability-slots/{expertId}")]
        public async Task<ActionResult<IEnumerable<ExpertAvailability>>> GetAllAvailabilitySlotsByExpertIdForUser(int expertId)
        {
            var slots = await _context.ExpertAvailability
                .Where(a => a.ExpertId == expertId && a.Status == "Available")
                .ToListAsync();

            if (slots == null || !slots.Any())
                return NotFound(new { message = "No availability slots found for this expert." });

            return Ok(slots);
        }

        [HttpGet("mycalender/{expertId}")]
        public async Task<ActionResult<IEnumerable<ExpertAvailability>>> GetAllSlotsByExpertIdForExpert(int expertId)
        {
            var slots = await _context.ExpertAvailability
                .Where(a => a.ExpertId == expertId)
                .ToListAsync();

            if (slots == null || !slots.Any())
                return NotFound(new { message = "No availability slots found for this expert." });

            return Ok(slots);
        }










        [HttpPost]
        [Route("GenerateAvailableSlot")]
        public async Task<ActionResult<List<ExpertAvailability>>> GenerateAvailableSlotsAsync([FromBody] List<AvailabilitySlotRequest> inputSlots)
        {
            var createdSlots = new List<ExpertAvailability>();

            foreach (var request in inputSlots)
            {

                if (request.IsPhysical == false && request.IsVirtual == false)
                {
                    return Ok(new { success = false, message = "Please Availablity type" });
                }

                bool exists = await _context.ExpertAvailability
                    .AnyAsync(s => s.AvailableSlotDate == request.SlotDate && s.StartTime == request.StartTime);

                if (!exists)
                {
                    var newSlot = new ExpertAvailability
                    {
                        ExpertId = request.ExpertId,
                        AvailableSlotDate = request.SlotDate,
                        StartTime = request.StartTime,
                        EndTime = request.StartTime.Add(TimeSpan.FromMinutes(60)), // 1 hour duration
                        Status = "Available",
                        CreatedAt = DateTime.Now,
                        IsPhysical = request.IsPhysical,
                        IsVirtual = request.IsVirtual,
                    };

                    _context.ExpertAvailability.Add(newSlot);
                    createdSlots.Add(newSlot);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = createdSlots });
        }
        [HttpPost]
        [Route("GenerateDayWiseAvailableSlots")]
        public async Task<ActionResult<List<ExpertAvailability>>> GenerateDayWiseAvailableSlots([FromBody] List<DailyAvailabilitySlotRequest> request)
        {
            if (request == null || !request.Any())
                return BadRequest("Invalid slot request.");

            var createdSlots = new List<ExpertAvailability>();

            foreach (var dayRequest in request)
            {

                if (dayRequest.TimeSlots == null || !dayRequest.TimeSlots.Any())
                    continue;

                foreach (var timing in dayRequest.TimeSlots)
                {
                    bool exists = await _context.MeetingSlots
                        .AnyAsync(s => s.SlotDate == dayRequest.SlotDate && s.StartTime == timing.StartTime);

                    if (!exists)
                    {
                        var newSlot = new ExpertAvailability
                        {
                            ExpertId = dayRequest.ExpertId,
                            AvailableSlotDate = dayRequest.SlotDate,
                            StartTime = timing.StartTime,
                            EndTime = timing.StartTime.Add(TimeSpan.FromMinutes(60)), // 1 hour duration
                            Status = "Available",
                            CreatedAt = DateTime.Now,
                            IsPhysical = dayRequest.IsPhysical,
                            IsVirtual = dayRequest.IsVirtual
                        };

                        _context.ExpertAvailability.Add(newSlot);
                        createdSlots.Add(newSlot);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(createdSlots);
        }


        // GetAllSessions
        [HttpGet("get-all-bookings")]
        public async Task<ActionResult<IEnumerable<ExpertBookingDto>>> GetAllBookingSessions([FromQuery] int? expertId = null, [FromQuery] int? customerId = null)
        {
            var query = _context.ExpertBooking.AsQueryable();
            if (expertId.HasValue)
                query = query.Where(b => b.ExpertId == expertId);
            if (customerId.HasValue)
                query = query.Where(b => b.BookedBy == customerId);
            var sessions = await query.ToListAsync();
            var dtos = sessions.Select(b => new ExpertBookingDto
            {
                BookingId = b.BookingId,
                ExpertId = b.ExpertId,
                BookedBy = b.BookedBy,
                AvailabilityId = b.AvailabilityId,
                SessionDateTime = b.SessionDateTime,
                MeetingType = b.MeetingType,
                BookingStatus = b.BookingStatus,
                PaymentStatus = b.PaymentStatus,
                PaymentId = b.PaymentId,
                SessionLink = b.SessionLink,
                LocationDetails = b.LocationDetails,
                CancellationReason = b.CancellationReason,
                RescheduleHistory = b.RescheduleHistory,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt
            }).ToList();
            return Ok(dtos);
        }

        // BookSlotByCustomer
        [HttpPost("book")]
        public async Task<IActionResult> BookSlotByCustomer([FromBody] ExpertBookingDto bookingDto)
        {
            var booking = new ExpertBooking
            {
                ExpertId = bookingDto.ExpertId,
                BookedBy = bookingDto.BookedBy,
                AvailabilityId = bookingDto.AvailabilityId,
                SessionDateTime = bookingDto.SessionDateTime,
                MeetingType = bookingDto.MeetingType,
                BookingStatus = "Pending",
                PaymentStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            _context.ExpertBooking.Add(booking);

            // Update slot status to "Booked"
            var slot = await _context.ExpertAvailability.FindAsync(bookingDto.AvailabilityId);
            if (slot != null)
            {
                slot.Status = "Booked";
            }


            await _context.SaveChangesAsync();


            // Update project status to 4
            var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == bookingDto.ProjectId && p.ServiceId == 9);
            if (fe == null)
                return NotFound(new { success = false, message = "Project request not found." });
            fe.StatusId = 6;

            // Add ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = bookingDto.ProjectId,
                ServiceId = fe.ServiceId,
                StatusId = fe.StatusId, // Meeting scheduled status
                Comments = "Meeting scheduled.",
                UpdatedBy = bookingDto.BookedBy,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            await _context.SaveChangesAsync();

            //var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == bookingDto.BookedBy);
            //DateTime sTime = slot.AvailableSlotDate + slot.StartTime;
            //DateTime eTime = slot.AvailableSlotDate + slot.EndTime;
            //await this.eventService.CreateGoogleMeeting(employee.EmailAddress, employee.FirstNames, sTime, eTime);

            return Ok(new { success = true, bookingId = booking.BookingId });
        }

        // ConfirmBookingByExpert
        [HttpPost("confirm-booking/{bookingId}")]
        public async Task<IActionResult> ConfirmBookingByExpert(int bookingId)
        {
            var booking = await _context.ExpertBooking.FindAsync(bookingId);
            if (booking == null) return NotFound();
            booking.BookingStatus = "Confirmed";
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // CancelBookingByExpert
        [HttpPost("cancel-by-expert/{bookingId}")]
        public async Task<IActionResult> CancelBookingByExpert(int bookingId, [FromBody] RejectObjectModel model)
        {
            var booking = await _context.ExpertBooking.FindAsync(bookingId);
            if (booking == null) return NotFound();

            booking.BookingStatus = "Cancelled";
            booking.CancellationReason = model.reason;

            // Make the slot available again
            var slot = await _context.ExpertAvailability.FindAsync(booking.AvailabilityId);
            if (slot != null)
            {
                slot.Status = "Available";
                slot.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // CancelBookingByUser
        [HttpPost("cancel-by-user/{bookingId}")]
        public async Task<IActionResult> CancelBookingByUser(int bookingId, [FromBody] RejectObjectModel model)
        {
            var booking = await _context.ExpertBooking.FindAsync(bookingId);
            if (booking == null) return NotFound();
            booking.BookingStatus = "Cancelled";
            booking.CancellationReason = model.reason;

            // Make the slot available again
            var slot = await _context.ExpertAvailability.FindAsync(booking.AvailabilityId);
            if (slot != null)
            {
                slot.Status = "Available";
                slot.UpdatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // ResheduledByUser
        [HttpPost("reschedule/{bookingId}")]
        public async Task<IActionResult> ResheduledByUser(int bookingId, ExpertBookingDto rescheduleDto)
        {
            var booking = await _context.ExpertBooking.FindAsync(bookingId);
            if (booking == null) return NotFound();

            // Mark the old slot as available
            var oldSlot = await _context.ExpertAvailability.FindAsync(booking.AvailabilityId);
            if (oldSlot != null)
            {
                oldSlot.Status = "Available";
                oldSlot.UpdatedAt = DateTime.UtcNow;
            }

            // Mark the new slot as booked
            var newSlot = await _context.ExpertAvailability.FindAsync(rescheduleDto.AvailabilityId);
            if (newSlot != null)
            {
                newSlot.Status = "Booked";
                newSlot.UpdatedAt = DateTime.UtcNow;
            }

            // Prepare reschedule history entry
            var rescheduleEntry = new
            {
                PreviousAvailabilityId = booking.AvailabilityId,
                PreviousSessionDateTime = booking.SessionDateTime,
                NewAvailabilityId = rescheduleDto.AvailabilityId,
                NewSessionDateTime = rescheduleDto.SessionDateTime,
                RescheduledAt = DateTime.UtcNow
            };

            // Append to reschedule history (as JSON array)
            var historyList = new List<object>();
            if (!string.IsNullOrEmpty(booking.RescheduleHistory))
            {
                try
                {
                    historyList = System.Text.Json.JsonSerializer.Deserialize<List<object>>(booking.RescheduleHistory) ?? new List<object>();
                }
                catch
                {
                    historyList = new List<object>();
                }
            }
            historyList.Add(rescheduleEntry);
            booking.RescheduleHistory = System.Text.Json.JsonSerializer.Serialize(historyList);

            // Update booking to new slot
            booking.AvailabilityId = rescheduleDto.AvailabilityId;
            booking.SessionDateTime = rescheduleDto.SessionDateTime;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // PayForMeetingExpert
        [HttpPost("pay/{bookingId}")]
        public async Task<IActionResult> PayForMeetingExpert(int bookingId)
        {
            var booking = await _context.ExpertBooking.FindAsync(bookingId);
            if (booking == null) return NotFound();
            booking.PaymentStatus = "Paid";

            var user = await _context.Employee.FindAsync(booking.BookedBy);
            if (user == null) return NotFound();

            var expert = await _context.Expert.FindAsync(booking.ExpertId);
            if (expert == null) return NotFound();

            var pdfLink = await GeneratePdfLink(booking, user, expert);
            await _context.SaveChangesAsync();

             
            return Ok(new { success = true });
        }

        private async Task<string> GeneratePdfLink(ExpertBooking booking, Employee customerobj, Expert sellerobj)
        {
            try
            {
                InvoiceModel invoiceData = new InvoiceModel();
                // Fill the properties of model1
                invoiceData.model1 = new Model1
                {
                    terms = "Net 30",
                    sales_man = sellerobj.FullName,// "Syed Saber",
                    customer_ref = "ABCD123",
                    customer_id = customerobj.EmployeeId,
                    customer_name = customerobj.FirstNames + " " + customerobj.LastName,
                    customer_address = customerobj.FullAddress,// "123 Main St.",
                    customer_city = customerobj.CityTown,//  "Anytown",
                    customer_contact_name = customerobj.FirstNames + " " + customerobj.LastName, // "Jane Smith",
                    customer_contact_tel = customerobj.MobileNumber, //"555-1234",
                    customer_postal_code = "12345",
                    customer_vat_number = "1234567890",

                    seller_id = sellerobj.ExpertID,
                    seller_name = sellerobj.FullName, // "My Companys",
                    seller_address = " Address ", // "456 Oak St.",
                    seller_city = "City", //"Somewhere",
                    seller_contact_name = sellerobj.FullName, // "Joe Johnson",
                    seller_contact_tel = sellerobj.PhoneNumber, // "555-4321",
                    seller_postal_code =  "67890",
                    seller_vat_number =  "0987654321",
                    seller_IBAN =  "US1234567890",
                    seller_logo = null,
                    line_item = false
                };


                List<Model2> m2 = new List<Model2>();
               
                    var newitem = new Model2
                    {
                        item_code = "1",
                        item_name = "Expert Meeting",
                        pack = "1",
                        quantity = "1",
                        unit_price = "200 SAR",
                        discount = "0",
                        item_sub_total_including_vat = "200 SAR"
                    };
                    m2.Add(newitem);
                

                invoiceData.model2 = m2;



                // Fill the properties of model3 (totals)
                invoiceData.model3 = new Model3
                {
                    total_excluding_vat = "230 SAR", // sale.TotalAmount.ToString(),
                    total_discount = "0",  // sale.Discount.ToString(),
                    net_excluding_VAT = "200 SAR", // sale.TotalAmount.ToString(),
                    total_vat_15perc = "30 SAR", //" sale.VAT.ToString(),
                    net_amount ="200 SAR", //" sale.GrandTotal.ToString(),
                    total_amount_due = "0",
                    remarks = "Some remarks"
                };

                // Convert InvoiceData to JSON
                string json = JsonConvert.SerializeObject(invoiceData);


                var content = new StringContent(json, Encoding.UTF8, "application/json");




                // Make the API call to generate the PDF and obtain the response PDF URL
                var httpClient = new HttpClient();
                var response = await httpClient.PostAsync("http://74.208.184.175:442/post-data2/", content);
                if (response.IsSuccessStatusCode)
                {
                    // API call successful
                    return await response.Content.ReadAsStringAsync();

                }
                return "something went wrong";
            }
            catch (Exception ex)
            {
                return "something went wrong";
            }
            return "something went wrong";
        }

        // MeetingSessionNotesByExpert
        [HttpPost("session-notes/{bookingId}")]
        public async Task<IActionResult> MeetingSessionNotesByExpert(int bookingId, [FromBody] GeneralModel model)
        {
          
            // Add new Notes record
            var note = new Notes
            {
                ProjectID = bookingId,
                ServiceId = 10,
                FullDescription = model.notes,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            return Ok(new { success = true });
        }

        // ExpertFeedbackByUser
        [HttpPost("feedback")]
        public async Task<IActionResult> ExpertFeedbackByUser([FromBody] ExpertFeedbackDto feedbackDto)
        {
            var feedback = new ExpertFeedback
            {
                BookingId = feedbackDto.BookingId,
                UserId = feedbackDto.UserId,
                ExpertId = feedbackDto.ExpertId,
                Rating = feedbackDto.Rating,
                FeedbackText = feedbackDto.FeedbackText,
                SubmittedAt = DateTime.UtcNow
            };
            _context.ExpertFeedback.Add(feedback);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, feedbackId = feedback.FeedbackId });
        }

        [HttpGet("get-expertid-by-userid/{userId}")]
        public async Task<IActionResult> GetExpertIdByUserId(string userId)
        {
            // Find the employee with the given userId
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null)
                return NotFound(new { success = false, message = "Employee not found for the given userId." });

            // Find the expert with the same email as the employee
            var expert = await _context.Expert.FirstOrDefaultAsync(ex => ex.Email == employee.EmailAddress);
            if (expert == null)
                return NotFound(new { success = false, message = "Expert not found for the given userId." });

            return Ok(new { success = true, expertId = expert.ExpertID });
        }

          }

    public class RejectObjectModel
    {
        public string reason { get; set; }
    }

    public class GeneralModel
    {
        public string notes { get; set; }
    }
}
