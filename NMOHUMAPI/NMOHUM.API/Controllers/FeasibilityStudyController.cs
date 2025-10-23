using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NanoidDotNet;
using NMOHUM.API.Models;
using NMOHUM.API.Models;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NMOHUM.API.Controllers.ProjectRequestController;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeasibilityStudyController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly Mailer _mailer;
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;
        private static Dictionary<string, string> _otpStore = new Dictionary<string, string>();

        public FeasibilityStudyController(
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

        // 1. Get all FeasibilityStudy requests
        [HttpGet("GetAllFeasibilityRequests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllFeasibilityRequests([FromQuery] int statusId = 0)
        {
            var query = _context.FeasibilityStudy.AsQueryable();
            if (statusId != 0)
                query = query.Where(p => p.StatusId == statusId && p.ServiceId == 3);
            var list = await query.ToListAsync();
            return Ok(new { success = true, data = list });
        }

        // 2. Get FeasibilityStudy request by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<FeasibilityStudy>> GetFeasibilityRequest(int id)
        {
            var fs = await _context.FeasibilityStudy.FindAsync(id);
            return fs == null ? NotFound() : fs;
        }

        // 3. Get FeasibilityStudy requests by employee
        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFeasibilityRequestsByEmployeeId(int employeeId, [FromQuery] int statusId = 0)
        {
            var query = _context.FeasibilityStudy.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
                query = query.Where(p => p.StatusId == statusId && p.ServiceId == 3);
            var list = await query.ToListAsync();
            return Ok(new { success = true, data = list });
        }

        // 4. Get FeasibilityStudy request details
        [HttpGet("details/{id}")]
        public async Task<ActionResult<FeasibilityStudyResponseVM>> GetFeasibilityRequestDetails(int id)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == id);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study not found." });
            var doclist = await _context.Documents.Where(x => x.ProjectID == id && x.ServiceId == fs.ServiceId).ToListAsync();
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fs.EmployeeId);
            var projectArea = await _context.ProjectArea.FirstOrDefaultAsync(a => a.Id == fs.ProjectAreaID);
            var projectPhase = await _context.ProjectPhase.FirstOrDefaultAsync(a => a.Id == fs.ProjectPhaseId);
            var projectStatus = await _context.ProjectStatus.FirstOrDefaultAsync(a => a.StatusId == fs.StatusId);
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
            var details = new FeasibilityStudyResponseVM
            {
                requestModel = fs,
                documentlist = doclist,
                projectArea = projectArea,
                projectPhase = projectPhase,
                projectStatus = projectStatus,
                userRegisterModel = userinfo
            };
            return Ok(new { success = true, data = details });
        }

        // 5. Create FeasibilityStudy request
        [HttpPost("CreateFeasibilityRequest")]
        public async Task<ActionResult<FeasibilityStudy>> CreateFeasibilityRequest([FromBody] FeasibilityStudy model)
        {
            model.CreateAt = DateTime.Now; model.ServiceId = 3;
            model.StatusId = 1;
            model.CaseId = Nanoid.Generate(size: 10);
            _context.FeasibilityStudy.Add(model);
            await _context.SaveChangesAsync();
            var activity = new ProjectActivity
            {
                ProjectId = model.Id, ServiceId = model.ServiceId,
                StatusId = 1,
                Comments = "New Feasibility Study Request Created",
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFeasibilityRequest), new { id = model.Id }, model);
        }

        // 6. Update FeasibilityStudy request
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeasibilityRequest(int id, [FromBody] FeasibilityStudy model)
        {
            if (id != model.Id)
                return BadRequest();
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 7. Delete FeasibilityStudy request
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeasibilityRequest(int id)
        {
            var fs = await _context.FeasibilityStudy.FindAsync(id);
            if (fs == null)
                return NotFound();
            _context.FeasibilityStudy.Remove(fs);
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

        // 9. Verify email and create FeasibilityStudy request
        [HttpPost("verifyEmailAndCreateFeasibility")]
        public async Task<IActionResult> VerifyEmailAndCreateFeasibility([FromBody] FeasibilityStudyVM model)
        {
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
                catch (Exception) { }

                if (string.IsNullOrWhiteSpace(model.emailverifyModel.EmailAddress))
                    return BadRequest(new { success = false, message = "Email are required." });
                if (!byPassValue)
                {
                    if (string.IsNullOrWhiteSpace(model.emailverifyModel.Otp))
                        return BadRequest(new { success = false, message = "OTP are required." });
                }
                if (!byPassValue)
                {
                    if (!_otpStore.ContainsKey(model.emailverifyModel.EmailAddress) || _otpStore[model.emailverifyModel.EmailAddress] != model.emailverifyModel.Otp)
                        return BadRequest(new { success = false, message = "Invalid OTP." });
                }
                var existingUser = await _userManager.FindByEmailAsync(model.emailverifyModel.EmailAddress);
                Employee employee = null;
                if (existingUser == null)
                {
                    if (model.userRegisterModel == null)
                        return BadRequest(new { success = false, message = "User registration details are required for new users." });
                    var password = $"Nmo{new Random().Next(100000, 999999)}!";
                    var user = new IdentityUser
                    {
                        Email = model.userRegisterModel.EmailAddress,
                        UserName = model.userRegisterModel.EmailAddress
                    };
                    var result = await _userManager.CreateAsync(user, password);
                    if (!result.Succeeded)
                        return BadRequest(new { success = false, message = "Failed to create user.", errors = result.Errors });
                    _context.UserRoles.Add(new IdentityUserRole<string>
                    {
                        RoleId = "1",
                        UserId = user.Id
                    });
                    await _context.SaveChangesAsync();
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
                    string[] emailList = new string[1] { model.userRegisterModel.EmailAddress };
                    if (!byPassValue)
                    {
                        _mailer.SendEmail(emailList, "support@nmohub.com", "NMOHUB Registration Complete – Login Info Inside",
                            $@"<p>Congratulations for Registration.</p><p>Please find your credentials below:</p><p><strong>Your password is:</strong> {password}</p>", true);
                    }
                }
                else
                {
                    employee = await _context.Employee.FirstOrDefaultAsync(a => a.UserId == existingUser.Id && (a.IsRemoved == null || a.IsRemoved == false));
                    if (employee == null)
                        return BadRequest(new { success = false, message = "Employee record not found." });
                }
                if (model.requestModel == null)
                    return BadRequest(new { success = false, message = "Feasibility Study details are required." });
                var caseId = Nanoid.Generate(size: 10);
                var fs = new FeasibilityStudy
                {
                    EmployeeId = employee.EmployeeId,
                    ServiceId = 3,
                    ProjectName = model.requestModel.ProjectName,
                    IndustrySector = model.requestModel.IndustrySector,
                    EstimatedBudget = model.requestModel.EstimatedBudget,
                    StudyObjectives = model.requestModel.StudyObjectives,
                    KeyAssumptions = model.requestModel.KeyAssumptions,
                    HasMarketResearch = model.requestModel.HasMarketResearch,
                    ResearchDocsUrl = model.requestModel.ResearchDocsUrl,
                    MarketReportsUrl = model.requestModel.MarketReportsUrl,
                    FinancialSpreadsheetsUrl = model.requestModel.FinancialSpreadsheetsUrl,
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
                _context.FeasibilityStudy.Add(fs);
                await _context.SaveChangesAsync();
                string[] emailList1 = new string[1] { model.userRegisterModel.EmailAddress };
                _mailer.SendEmail(emailList1, "support@nmohub.com", "NMOHUB Registration Complete – Track your application",
                    $@"<p>Congratulations for Registration.</p><p>Use Case ID: <strong> {fs.CaseId} </strong> to track your status with below link:</p><p><a href='http://localhost:4200/customer-project-track?id={fs.Id}&serv=3' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;'>Track</a></p>", true);
                var projectActivity = new ProjectActivity
                {
                    ProjectId = fs.Id,
                    ServiceId = fs.ServiceId,
                    StatusId = 1,
                    Comments = "New Feasibility Study Request Created",
                    UpdatedBy = fs.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);
                if (model.documentlist != null && model.documentlist.Count > 0)
                {
                    int i = 0;
                    foreach (var item in model.documentlist)
                    {
                        i++;
                        var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                        _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, fs.Id, fs.ServiceId, fs.EmployeeId, fileName, item.DocumentType, "Feasibility");
                    }
                }
                await _context.SaveChangesAsync();
                _otpStore.Remove(model.emailverifyModel.EmailAddress);
                return Ok(new { success = true, message = "Feasibility Study request created successfully.", projectId = fs.Id, employeeId = employee.EmployeeId, isNewUser = existingUser == null });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new { success = false, message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        // 10. Approve FeasibilityStudy request
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveFeasibilityRequest([FromBody] ApproveProjectRequestModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.FollowUpStart = model.FollowUpStart;
            fs.FollowUpEnd = model.FollowUpEnd;
            fs.StatusId = 2;
            var note = new Notes
            {
                ProjectID = fs.Id,
                ServiceId = fs.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var activity = new ProjectActivity
            {
                ProjectId = fs.Id,
                ServiceId = fs.ServiceId,
                StatusId = 2,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Feasibility Study request approved." });
        }

        // 11. Reject FeasibilityStudy request
        [HttpPost("reject")]
        public async Task<IActionResult> RejectFeasibilityRequest([FromBody] RejectProjectRequestModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 3;
            var note = new Notes
            {
                ProjectID = fs.Id,
                ServiceId = fs.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var activity = new ProjectActivity
            {
                ProjectId = fs.Id,
                ServiceId = fs.ServiceId,
                StatusId = 3,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Feasibility Study request rejected." });
        }

        // 12. Schedule meeting for FeasibilityStudy request
        [HttpPost("schedule-meeting")]
        public async Task<IActionResult> ScheduleMeeting([FromBody] Meetings meeting)
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

           


            meeting.ServiceId = 3;
            _context.Meetings.Add(meeting);
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == meeting.ProjectID);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 4;
            var activity = new ProjectActivity
            {
                ProjectId = meeting.ProjectID,
                ServiceId = fs.ServiceId,
                StatusId = 4,
                Comments = "Meeting scheduled.",
                UpdatedBy = meeting.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Meeting scheduled for Feasibility Study request." });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        // 13. Complete pitch for FeasibilityStudy request
        [HttpPost("pitch-complete")]
        public async Task<IActionResult> CompletePitch([FromBody] PitchCompleteRequestModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 3,
                FullDescription = model.Feedback,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var meetings = _context.Meetings.Where(m => m.ProjectID == model.ProjectId && m.ServiceId == 3).ToList();
            foreach (var meeting in meetings)
            {
                meeting.Feedback = model.Feedback;
                _context.Entry(meeting).State = EntityState.Modified;
            }
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 5;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 5,
                Comments = model.Feedback,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, fs.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Feasibility");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Pitch completed for Feasibility Study request." });
        }

        // 14. Review pitch and score FeasibilityStudy request
        [HttpPost("review-pitch-and-score")]
        public async Task<IActionResult> ReviewPitchAndScore([FromBody] ReviewPitchAndScoreModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 3,
                FullDescription = model.Review,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 6;
            fs.AggregateScore = model.ScoreValue;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 6,
                Comments = model.Review,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Pitch reviewed and scored for Feasibility Study request." });
        }

        // 15. Send proposal to employee for FeasibilityStudy request
        [HttpPost("send-proposal")]
        public async Task<IActionResult> SendProposal([FromBody] SendProposalModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 3,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 7;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 7,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, fs.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Feasibility");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal sent to employee for Feasibility Study request." });
        }

        // 16. Reject idea for FeasibilityStudy request
        [HttpPost("reject-idea")]
        public async Task<IActionResult> RejectIdea([FromBody] RejectIdeaModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 8;
            _context.Entry(fs).State = EntityState.Modified;
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = fs.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 8,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Idea rejected for Feasibility Study request." });
        }

        // 17. Accept proposal for FeasibilityStudy request
        [HttpPost("accept-proposal")]
        public async Task<IActionResult> AcceptProposal([FromBody] AcceptProposalModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 9;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 9,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal accepted for Feasibility Study request." });
        }

        // 18. Reject proposal for FeasibilityStudy request
        [HttpPost("reject-proposal")]
        public async Task<IActionResult> RejectProposal([FromBody] RejectProposalModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 10;
            _context.Entry(fs).State = EntityState.Modified;
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = fs.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 10,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal rejected for Feasibility Study request." });
        }

        // 19. Upload payment proof document for FeasibilityStudy request
        [HttpPost("upload-payment-proofdoc")]
        public async Task<IActionResult> UploadPaymentProofDoc([FromBody] UploadPaymentProofdocModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0)
                return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });
            if (model.Documents == null || model.Documents.Count <= 0)
                return BadRequest(new { success = false, message = "Please Upload Payment Receipt" });
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 3,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 11;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 11,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            PaymentActivity paymentActivity = new PaymentActivity();
            paymentActivity.ProjectId = fs.Id; paymentActivity.ServiceId = fs.ServiceId;
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
                    var filePath = $"Resources/Feasibility/{model.ProjectId}/{fileName}";
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, fs.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Feasibility");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Payment proof document uploaded for Feasibility Study request." });
        }

        // 20. Mark payment received for FeasibilityStudy request
        [HttpPost("payment-received")]
        public async Task<IActionResult> MarkPaymentReceived([FromBody] PaymentReceivedModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.StatusId = 12;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = 12,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            var paymentActivity = await _context.PaymentActivity.FirstOrDefaultAsync(p => p.ProjectId == model.ProjectId && p.ServiceId == fs.ServiceId);
            if (paymentActivity == null)
                return NotFound();
            paymentActivity.IsVerified = true;
            _context.Entry(paymentActivity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Payment marked as received for Feasibility Study request." });
        }

        // 21. Get FeasibilityStudy request by case ID
        [HttpGet("id-by-caseid/{caseId}")]
        public async Task<ActionResult<FeasibilityStudy>> GetFeasibilityRequestByCaseId(string caseId)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.CaseId == caseId && p.ServiceId == 3);
            return fs == null ? NotFound() : fs;
        }

        // 22. Activate program for FeasibilityStudy request
        [HttpPost("program-active")]
        public async Task<IActionResult> ActivateProgram([FromBody] ProgramActiveRequestModel model)
        {
            var fs = await _context.FeasibilityStudy.FirstOrDefaultAsync(p => p.Id == model.ProjectId && p.ServiceId == 3);
            if (fs == null)
                return NotFound(new { success = false, message = "Feasibility Study request not found." });
            fs.ProgramStarted = model.ProjectStart;
            fs.ProgramEnd = model.ProjectEnd;
            fs.StatusId = 13;
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = fs.ServiceId,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                StatusId = 13,
                ServiceId = fs.ServiceId,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Program activated for Feasibility Study request.", id = model.ProjectId, projectStart = model.ProjectStart, projectEnd = model.ProjectEnd });
        }

        // GET: api/dashboard/GetAllDashboardCounter
        [HttpGet]
        [Route("GetAllDashboardCounter")]
        public async Task<IActionResult> GetAllDashboardCounter()
        {
            // Get all project status
            var statuses = await _context.ProjectStatus.ToListAsync();
            // Get counts of ProjectRequest grouped by StatusId
            var projectCounts = await _context.FeasibilityStudy
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
            var projectCounts = await _context.FeasibilityStudy
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

        [HttpGet("export")]
        public async Task<IActionResult> ExportFeasibilityProgramList(int statusId = 0)
        {
            var query = _context.FeasibilityStudy.AsQueryable();
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
            var fileName = $"Feas_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            return File(bytes, "text/csv", fileName);
        }

    }
}
