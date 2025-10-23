using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NanoidDotNet;
using static NMOHUM.API.Controllers.ProjectRequestController;
using NMOHUM.API.Models;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MvpProgramController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly Mailer _mailer;
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;
        private static Dictionary<string, string> _otpStore = new Dictionary<string, string>();

        public MvpProgramController(
            NMOHUMAuthenticationContext context,
            UserManager<IdentityUser> userManager,
            IFileStorageServiceHandler fileStorageServiceHandler,
            Mailer mailer)
        {
            _context = context;
            _userManager = userManager;
            _fileStorageServiceHandler = fileStorageServiceHandler;
            _mailer = mailer;
        }



        // GET: api/dashboard/GetAllDashboardCounter
        [HttpGet]
        [Route("GetAllDashboardCounter")]
        public async Task<IActionResult> GetAllDashboardCounter()
        {
            // Get all project status
            var statuses = await _context.ProjectStatus.ToListAsync();
            // Get counts of ProjectRequest grouped by StatusId
            var projectCounts = await _context.MvpProgram
                .GroupBy(pr => pr.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in projectCounts on status.StatusId equals count.StatusId into sc
                         from count in sc.DefaultIfEmpty()
                         select new
                         {
                             StatusId = status.StatusId,
                             StatusName = status.StatusName,
                             Description = status.Description,
                             Count = count != null ? count.Count : 0
                         };

            return Ok(new { success = true, data = result });
        }

        // GET: api/dashboard/DashboardCountersByUser/{employeeId}
        [HttpGet("DashboardCountersByUser/{employeeId}")]
        public async Task<IActionResult> DashboardCountersByUser(int employeeId)
        {
            // Get all project status
            var statuses = await _context.ProjectStatus.ToListAsync();
            // Get counts of ProjectRequest grouped by StatusId for the given employee
            var projectCounts = await _context.MvpProgram
                .Where(pr => pr.EmployeeId == employeeId)
                .GroupBy(pr => pr.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in projectCounts on status.StatusId equals count.StatusId into sc
                         from count in sc.DefaultIfEmpty()
                         select new
                         {
                             StatusId = status.StatusId,
                             StatusName = status.StatusName,
                             Description = status.Description,
                             Count = count != null ? count.Count : 0
                         };

            return Ok(new { success = true, data = result });
        }
    


        // 1. Get all MVP requests
        [HttpGet("GetAllMvpRequests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllMvpRequests([FromQuery] int statusId = 0)
        {
            var query = _context.MvpProgram.AsQueryable();
            if (statusId != 0)
                query = query.Where(p => p.StatusId == statusId && p.ServiceId==2);
            var list = await query.ToListAsync();
            // You can add employee and status info as in ProjectRequestController if needed
            return Ok(new { success = true, data = list });
        }

        // 2. Get MVP request by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<MvpProgram>> GetMvpRequest(int id)
        {
            var mvp = await _context.MvpProgram.FindAsync(id);
            return mvp == null ? NotFound() : mvp;
        }

        // 3. Get MVP requests by employee
        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetMvpRequestsByEmployeeId(int employeeId, [FromQuery] int statusId = 0)
        {
            var query = _context.MvpProgram.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
                query = query.Where(p => p.StatusId == statusId);
            var list = await query.ToListAsync();
            return Ok(new { success = true, data = list });
        }

        // 4. Get MVP request details
        [HttpGet("details/{id}")]
        public async Task<ActionResult<MvpProgramResponseVM>> GetMvpRequestDetails(int id)
        {
            //var mvp = await _context.MvpProgram
            //    .Include(p => p.Partner)
            //    .Include(p => p.OtherProgramAttend)
            //    .Include(p => p.Documents)
            //    .FirstOrDefaultAsync(p => p.Id == id);
            //if (mvp == null)
            //    return NotFound(new { success = false, message = "MVP Program not found." });

            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == id);
            if (mvp == null)
                return NotFound(new { success = false, message = "MvP program not found." });

            var doclist = await _context.Documents.Where(x => x.ProjectID == id && x.ServiceId == mvp.ServiceId).ToListAsync();




            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == mvp.EmployeeId);
            var projectArea = await _context.ProjectArea.FirstOrDefaultAsync(a => a.Id == mvp.ProjectAreaID);
            var projectPhase = await _context.ProjectPhase.FirstOrDefaultAsync(a => a.Id == mvp.ProjectPhaseId);
            var projectStatus = await _context.ProjectStatus.FirstOrDefaultAsync(a => a.StatusId == mvp.StatusId);

            var userinfo = new RegisterUserVM
            {
                EmployeeId = employee.EmployeeId,
                EmailAddress = employee?.EmailAddress,
                CountryId = employee?.CountryId ?? 0,
                FullName = (employee?.FirstNames ?? ""),
                DateOfBirth = employee?.DateOfBirth,
                MobileNumber = employee?.MobileNumber,
                LinkedInProfileLink = employee?.LinkedInProfileLink,
                CountryName = (await _context.Countries.FirstOrDefaultAsync(x => x.Id == employee.CountryId))?.Name
            };

            var details = new MvpProgramResponseVM
            {
                requestModel = mvp,
                documentlist = doclist,
                projectArea = projectArea,
                projectPhase = projectPhase,
                projectStatus = projectStatus,
                userRegisterModel = userinfo
            };

            return Ok(new { success = true, data = details });
        }

        // 5. Create MVP request
        [HttpPost("CreateMvpRequest")]
        public async Task<ActionResult<MvpProgram>> CreateMvpRequest([FromBody] MvpProgramFullVM model)
            {
            var mvp = model.requestModel as MvpProgram;
            mvp.CreateAt = DateTime.Now; mvp.ServiceId = 2;
            mvp.StatusId = 1;
            mvp.CaseId = Nanoid.Generate(size: 10);
            _context.MvpProgram.Add(mvp);
            await _context.SaveChangesAsync();

            //if (mvp.IsPartnerAvailable && model.Partner != null)
            //{
            //    model.Partner.ProjectId = mvp.Id;
            //    _context.Partner.Add(model.Partner);
            //}
            //if (mvp.AlreadyParticipatedProgram && model.OtherProgramAttend != null)
            //{
            //    model.OtherProgramAttend.ProjectId = mvp.Id;
            //    _context.OtherProgramAttend.Add(model.OtherProgramAttend);
            //}
            var mvpActivity = new ProjectActivity
            {
                ProjectId = mvp.Id, ServiceId=mvp.ServiceId,
                StatusId = 1,
                Comments = "New MVP Request Created",
                UpdatedBy = mvp.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            if (model.documentlist != null && model.documentlist.Count > 0)
            {
                int i = 0;
                foreach (var item in model.documentlist)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, mvp.Id, mvp.ServiceId, mvp.EmployeeId, fileName, item.DocumentType, "Mvp");
                }
            }
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMvpRequest), new { id = mvp.Id }, mvp);
        }

        // 6. Update MVP request
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMvpRequest(int id, [FromBody] MvpProgram mvp)
        {
            if (id != mvp.Id)
                return BadRequest();
            _context.Entry(mvp).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 7. Delete MVP request
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMvpRequest(int id)
        {
            var mvp = await _context.MvpProgram.FindAsync(id);
            if (mvp == null)
                return NotFound();
            _context.MvpProgram.Remove(mvp);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 8. Send OTP to email
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtpToEmail([FromBody] EmailAddressModel model)
        {
            if (string.IsNullOrWhiteSpace(model.EmailAddress))
                return BadRequest(new { success = false, message = "Email address is required." });

            var existingUser = await _userManager.FindByEmailAsync(model.EmailAddress);
            if (existingUser != null)
                return BadRequest(new { success = false, message = "Email address already registered." });

            var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == model.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
            if (existingEmployee != null)
                return BadRequest(new { success = false, message = "Email address already registered." });

            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[model.EmailAddress] = otp;
            string[] emailList = new string[1] { model.EmailAddress };
            _mailer.SendEmail(emailList, "support@nmohub.com", "NMOHUB Email Verification", $"Your OTP code is: {otp}", true);

            return Ok(new { success = true, message = "OTP sent to email." });
        }

        // 9. Verify email and create MVP request
        [HttpPost("verifyEmailAndCreateMvp")]
        public async Task<IActionResult> VerifyEmailAndCreateMvp([FromBody] MVPProgramVM model)
        {
            // Use the same logic as ProjectRequestController, but create MvpProgram instead of ProjectRequest
            // (Omitted for brevity, copy logic from ProjectRequestController and adapt for MvpProgram)
            try
            {

                bool byPassValue = false;
                try
                {
                    var con = _context.ConfigureValue.FirstOrDefault();
                    if (con != null)
                    {
                        byPassValue = Convert.ToBoolean(con.Value);
                    }
                }
                catch (Exception ex)
                {

                }

                // Step 1: Verify OTP
                if (string.IsNullOrWhiteSpace(model.emailverifyModel.EmailAddress))
                    return BadRequest(new { success = false, message = "Email are required." });

                if (!byPassValue)
                {
                    if (string.IsNullOrWhiteSpace(model.emailverifyModel.Otp))
                        return BadRequest(new { success = false, message = "OTP are required." });
                }

                if (!byPassValue)
                {
                    if (_otpStore[model.emailverifyModel.EmailAddress] != model.emailverifyModel.Otp)
                        return BadRequest(new { success = false, message = "Invalid OTP." });

                    if (!_otpStore.ContainsKey(model.emailverifyModel.EmailAddress))
                        return BadRequest(new { success = false, message = "Invalid OTP." });
                }



                // Step 2: Check if user exists
                var existingUser = await _userManager.FindByEmailAsync(model.emailverifyModel.EmailAddress);
                Employee employee = null;

                if (existingUser == null)
                {
                    // Step 3: Create new user if doesn't exist
                    if (model.userRegisterModel == null)
                        return BadRequest(new { success = false, message = "User registration details are required for new users." });

                    var password = GenerateRandomPassword();
                    var user = new IdentityUser
                    {
                        Email = model.userRegisterModel.EmailAddress,
                        UserName = model.userRegisterModel.EmailAddress
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
                    employee = new Employee
                    {
                        FirstNames = model.userRegisterModel.FullName,
                        LastName = model.userRegisterModel.FullName,
                        UserId = user.Id,
                        EmailAddress = user.Email,
                        MobileNumber = model.userRegisterModel.MobileNumber,
                        CountryId = model.userRegisterModel.CountryId,
                        DateOfBirth = model.userRegisterModel.DateOfBirth,
                        LinkedInProfileLink = model.userRegisterModel.LinkedInProfileLink
                    };
                    _context.Employee.Add(employee);
                    await _context.SaveChangesAsync();

                    // Send password via email
                    string[] emailList = new string[1] { model.userRegisterModel.EmailAddress };
                    if (!byPassValue)
                    {
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

                    }

                }
                else
                {
                    // Get existing employee
                    employee = await _context.Employee.FirstOrDefaultAsync(a =>
                        a.UserId == existingUser.Id && (a.IsRemoved == null || a.IsRemoved == false));

                    if (employee == null)
                        return BadRequest(new { success = false, message = "Employee record not found." });
                }

                // Step 4: Create project request
                if (model.requestModel == null)
                    return BadRequest(new { success = false, message = "Project request details are required." });
                var caseId = Nanoid.Generate(size: 10);
                var mvp = new MvpProgram
                {
                    EmployeeId = employee.EmployeeId,
                    ServiceId = 2,
                    ProjectName = model.requestModel.ProjectName,
                    ProjectDescription= model.requestModel.ProjectDescription,
                    DesiredTechStack = model.requestModel.DesiredTechStack,
                    UiMockupsUploaded = model.requestModel.UiMockupsUploaded,
                    MockupFileUrl = model.requestModel.MockupFileUrl,
                    PrototypeLink = model.requestModel.PrototypeLink,
                    DesiredLaunchDate= model.requestModel.DesiredLaunchDate,
                    EstimatedBudget= model.requestModel.EstimatedBudget,
                    ApiSpecificationsUrl= model.requestModel.ApiSpecificationsUrl,
                    DesignAssetsUrl= model.requestModel.DesignAssetsUrl,
                    PackageId = model.requestModel.PackageId,
                    CreateAt = DateTime.Now,
                    StatusId = 1,
                    Duration = model.requestModel.Duration,
                    ProgramStarted = model.requestModel.ProgramStarted,
                    ProgramEnd = model.requestModel.ProgramEnd,
                    BriefDescription = model.requestModel.BriefDescription,
                    ProjectPhaseId = model.requestModel.ProjectPhaseId,
                    ProjectAreaID = model.requestModel.ProjectAreaID,
                    IsEvaluate = model.requestModel.IsEvaluate,
                    AggregateScore = model.requestModel.AggregateScore,
                    CurrentPhaseId = model.requestModel.CurrentPhaseId,
                    IsPartnerAvailable = model.requestModel.IsPartnerAvailable,
                    AlreadyParticipatedProgram = model.requestModel.AlreadyParticipatedProgram,
                    IsWrittenBusinessPlan = model.requestModel.IsWrittenBusinessPlan,
                    HopeAchieve = model.requestModel.HopeAchieve,
                    SupportsNeeds = model.requestModel.SupportsNeeds,
                    CaseId = caseId
                };

                _context.MvpProgram.Add(mvp);
                await _context.SaveChangesAsync();

                //send project submitted confirmation email
                string[] emailList1 = new string[1] { model.userRegisterModel.EmailAddress };
                //    _mailer.SendEmail(emailList1, "support@nmohub.com", "NMOHUB Project Submission Complete", $"Your project has been submitted successfully. Use Case ID: {projectRequest.CaseId} to track your status.", true);
                _mailer.SendEmail(
    emailList1,
    "support@nmohub.com",
    "NMOHUB Registration Complete – Track you application", // fixed character encoding
    $@"
        <p>Congratulations for Registration.</p>
        <p>Use Case ID: <strong> {mvp.CaseId} </strong> to track your status with below link:</p>
       <p>
  <a href=""http://localhost:4200/customer-project-track?id={mvp.Id}&serv=2"" 
     style=""display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"">
    Track
  </a>
</p>

    ",
    true
);

              
                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = mvp.Id,
                    ServiceId = mvp.ServiceId,
                    StatusId = 1, // In Review status
                    Comments = "New Request Created",
                    UpdatedBy = mvp.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                if (model.documentlist != null)
                {
                    if (model.documentlist.Count > 0)
                    {
                        int i = 0;
                        foreach (var item in model.documentlist)
                        {
                            i++;
                            var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                            _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, mvp.Id, mvp.ServiceId, model.requestModel.EmployeeId, fileName, item.DocumentType, "Other");
                        }
                    }
                }

                await _context.SaveChangesAsync();

                // Clean up OTP
                _otpStore.Remove(model.emailverifyModel.EmailAddress);

                return Ok(new
                {
                    success = true,
                    message = "MvP request created successfully.",
                    projectId = mvp.Id,
                    employeeId = employee.EmployeeId,
                    isNewUser = existingUser == null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while processing the request.", error = ex.Message });
            }
            //return Ok(new { success = true, message = "MVP request created successfully." });
        }

        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }
        // 10. Approve MVP request
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveMvpRequest([FromBody] ApproveProjectRequestModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });

            mvp.FollowUpStart = model.FollowUpStart;
            mvp.FollowUpEnd = model.FollowUpEnd;
            mvp.StatusId = 2;

            var note = new Notes
            {
                ProjectID = mvp.Id,
                ServiceId = mvp.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvpActivity = new ProjectActivity
            {
                ProjectId = mvp.Id,
                ServiceId = mvp.ServiceId,
                StatusId = 2,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "MVP request approved." });
        }

        // 11. Reject MVP request
        [HttpPost("reject")]
        public async Task<IActionResult> RejectMvpRequest([FromBody] RejectProjectRequestModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });

            mvp.StatusId = 3;

            var note = new Notes
            {
                ProjectID = mvp.Id,
                ServiceId = mvp.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvpActivity = new ProjectActivity
            {
                ProjectId = mvp.Id,
                ServiceId = mvp.ServiceId,
                StatusId = 3,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "MVP request rejected." });
        }

        // 12. Schedule meeting
        [HttpPost("schedule-meeting")]
        public async Task<IActionResult> ScheduleMvpMeeting([FromBody] Meetings meeting)
        {
            try
            {
                var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == meeting.SlotId);

                if (slot == null)
                    return Ok(new { success = false, message = "Slot not found" });

                if (slot.Status == "Booked")
                    return Ok(new { success = false, message = "Slot already booked" });

                slot.Status = "Booked";
                slot.BookedBy = meeting.EmployeeId;
                await _context.SaveChangesAsync();

                meeting.ServiceId = 2;
                _context.Meetings.Add(meeting);

                var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == meeting.ProjectID);
                if (mvp == null)
                    return NotFound(new { success = false, message = "MVP request not found." });
                mvp.StatusId = 4;

                var mvpActivity = new ProjectActivity
                {
                    ProjectId = meeting.ProjectID,
                    ServiceId = mvp.ServiceId,
                    StatusId = 4,
                    Comments = "Meeting scheduled.",
                    UpdatedBy = meeting.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(mvpActivity);

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Meeting scheduled." });

            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
            
        }
        // 13. Pitch complete
        [HttpPost("pitch-complete")]
        public async Task<IActionResult> PitchComplete([FromBody] PitchCompleteRequestModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 2,
                FullDescription = model.Feedback,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var meetings = _context.Meetings.Where(m => m.ProjectID == model.ProjectId && m.ServiceId==2).ToList();
            foreach (var meeting in meetings)
            {
                meeting.Feedback = model.Feedback;
                _context.Entry(meeting).State = EntityState.Modified;
            }

            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId==2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 5;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 5,
                Comments = model.Feedback,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId,mvp.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Mvp");
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Pitch completed successfully." });
        }

        // 14. Review pitch and score
        [HttpPost("review-pitch-and-score")]
        public async Task<IActionResult> ReviewPitchAndScore([FromBody] ReviewPitchAndScoreModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 2,
                FullDescription = model.Review,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId==2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 6;
            mvp.AggregateScore = model.ScoreValue;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 6,
                Comments = model.Review,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Pitch reviewed and scored successfully." });
        }

        // 15. Send proposal
        [HttpPost("send-proposal")]
        public async Task<IActionResult> SendProposal([FromBody] SendProposalModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 2,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId==2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 7;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 7,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, mvp.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Mvp");
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal sent successfully." });
        }

        // 16. Reject idea
        [HttpPost("reject-idea")]
        public async Task<IActionResult> RejectIdea([FromBody] RejectIdeaModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 8;
            _context.Entry(mvp).State = EntityState.Modified;

            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = mvp.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 8,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Idea rejected successfully." });
        }

        // 17. Accept proposal
        [HttpPost("accept-proposal")]
        public async Task<IActionResult> AcceptProposal([FromBody] AcceptProposalModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 9;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 9,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal accepted successfully." });
        }

        // 18. Reject proposal
        [HttpPost("reject-proposal")]
        public async Task<IActionResult> RejectProposal([FromBody] RejectProposalModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 10;
            _context.Entry(mvp).State = EntityState.Modified;

            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = mvp.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 10,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal rejected successfully." });
        }

        // 19. Upload payment proof document
        [HttpPost("upload-payment-proofdoc")]
        public async Task<IActionResult> UploadPaymentProofdoc([FromBody] UploadPaymentProofdocModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0)
                return BadRequest(new { success = false, message = "EmployeeId and Id are required and must be greater than 0." });

            if (model.Documents == null || model.Documents.Count <= 0)
                return BadRequest(new { success = false, message = "Please Upload Payment Receipt" });

            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 2,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 11;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 11,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            PaymentActivity paymentActivity = new PaymentActivity();
            paymentActivity.ProjectId = mvp.Id; paymentActivity.ServiceId = mvp.ServiceId;
            paymentActivity.PaymentName = "Initial Payment";
            paymentActivity.CreatedAt = DateTime.Now;
            _context.PaymentActivity.Add(paymentActivity);
            await _context.SaveChangesAsync();

            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    var filePath = $"Resources/Mvp/{model.ProjectId}/{fileName}";
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, mvp.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Mvp");
                    //var document = new Documents
                    //{
                    //    Name = fileName,
                    //    DocumentType = item.DocumentType,
                    //    DocumentUrl = filePath,
                    //    IsActive = true,
                    //    IsPublic = false,
                    //    ProjectID = model.ProjectId,
                    //    CreateAt = DateTime.Now
                    //};
                    //_context.Documents.Add(document);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Payment proof documents uploaded successfully." });
        }

        // 20. Payment received
        [HttpPost("payment-received")]
        public async Task<IActionResult> PaymentReceived([FromBody] PaymentReceivedModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });
            mvp.StatusId = 12;
            _context.Entry(mvp).State = EntityState.Modified;

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = mvp.ServiceId,
                StatusId = 12,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();

            var paymentActivity = await _context.PaymentActivity.FirstOrDefaultAsync(p => p.ProjectId == model.ProjectId && p.ServiceId == mvp.ServiceId);
            if (paymentActivity == null)
                return NotFound();
            paymentActivity.IsVerified = true; 
            _context.Entry(paymentActivity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Payment received and confirmed." });
        }

        // 21. Get MVP Id by caseId
        [HttpGet("id-by-caseid/{caseId}")]
        public async Task<IActionResult> GetMvpIdByCaseId(string caseId)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.CaseId == caseId);
            if (mvp == null)
                return NotFound(new { success = false, message = "No MVP found for the provided caseId." });
            return Ok(new { success = true, id = mvp.Id , serviceid= mvp.ServiceId });
        }

        // 22. Program active
        [HttpPost("program-active")]
        public async Task<IActionResult> ProgramActive([FromBody] ProgramActiveRequestModel model)
        {
            var mvp = await _context.MvpProgram.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 2);
            if (mvp == null)
                return NotFound(new { success = false, message = "MVP request not found." });

            mvp.ProgramStarted = model.ProjectStart;
            mvp.ProgramEnd = model.ProjectEnd;
            mvp.StatusId = 13;

            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = mvp.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            var mvpActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                StatusId = 13,
                ServiceId = mvp.ServiceId,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(mvpActivity);

            await _context.SaveChangesAsync();
            return Ok(new
            {
                success = true,
                message = "Program Active successfully.",
                id = model.ProjectId,
                projectStart = model.ProjectStart,
                projectEnd = model.ProjectEnd
            });
        }


        [HttpGet("export")]
        public async Task<IActionResult> ExportMvpProgramList([FromQuery] int statusId = 0)
        {
            var query = _context.MvpProgram.AsQueryable();
            if (statusId != 0)
                query = query.Where(x => x.StatusId == statusId);

            var list = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.EmployeeId,
                    x.BriefDescription,
                    x.StatusId,
                    x.ProjectName,
                    x.CaseId,
                    CreatedAt = x.CreateAt.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            var employeeIds = list.Select(x => x.EmployeeId).Distinct().ToList();
            var employees = await _context.Employee
                .Where(e => employeeIds.Contains(e.EmployeeId))
                .ToDictionaryAsync(e => e.EmployeeId, e => $"{e.FirstNames ?? ""} {e.LastName ?? ""}".Trim());

            var csv = new StringBuilder();
            csv.AppendLine("Id,EmployeeId,EmployeeFullName,BriefDescription,StatusId,ProjectName,CaseId,CreatedAt");
            foreach (var item in list)
            {
                var fullName = employees.TryGetValue(item.EmployeeId, out var name) ? name : "";
                csv.AppendLine($"{item.Id},{item.EmployeeId},\"{fullName}\",\"{item.BriefDescription}\",{item.StatusId},{item.ProjectName},{item.CaseId},{item.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var fileName = $"Mvp_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            return File(bytes, "text/csv", fileName);
        }

    }
}
