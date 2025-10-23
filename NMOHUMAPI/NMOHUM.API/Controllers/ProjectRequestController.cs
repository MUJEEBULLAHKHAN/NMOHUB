using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Models.Option;
using NMOHUM.API.Utilities;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using NanoidDotNet;
using NMOHUM.API.Services;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectRequestController : ControllerBase
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
        //private readonly NotificationService _notificationService;
        public ProjectRequestController(
            NMOHUMAuthenticationContext context,
            UserManager<IdentityUser> userManager,
           IFileStorageServiceHandler  fileStorageServiceHandler,
            Mailer mailer,
            JwtSettings jwtSettings, ITokenService tokenService, IEventService eventService 
            // ,NotificationService notificationService
            )
        {
            _context = context;
            _userManager = userManager;
            _mailer = mailer;
            _jwtSettings = jwtSettings;
            _key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            _fileStorageServiceHandler = fileStorageServiceHandler;
            this.tokenService = tokenService;
            this.eventService = eventService;
           // _notificationService = notificationService;
        }

        // GET: api/projectrequest?statusId=0
        [HttpGet]
        [Route("GetAllProjectRequests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllProjectRequests([FromQuery] int statusId = 0)
        {
            try
            {
                var query = _context.ProjectRequest.AsQueryable();
                if (statusId != 0)
                {
                    query = query.Where(p => p.StatusId == statusId && p.ServiceId==1);
                }
                var projectlist = await query.ToListAsync();
                var employeeIds = projectlist.Select(p => p.EmployeeId).Distinct().ToList();
                List<Employee> employeeList = new List<Employee>();
                if (employeeIds.Any())
                {
                    employeeList = _context.Employee.AsEnumerable().Where(e => employeeIds.Contains(e.EmployeeId)).ToList();
                    foreach (var emp in employeeList)
                    {
                        if (emp == null)
                            throw new Exception("Null employee in employeeList");
                        if (emp.EmployeeId == 0)
                            throw new Exception("Employee with EmployeeId == 0 found");
                    }
                }
                var employees = employeeList.ToDictionary(e => e.EmployeeId, e => e);

                // Pre-load all ProjectStatus data to avoid concurrent DbContext operations
                var statusIds = projectlist.Select(p => p.StatusId).Distinct().ToList();
                var projectStatuses = await _context.ProjectStatus
                    .Where(ps => statusIds.Contains(ps.StatusId))
                    .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

                var result = projectlist.Select(p => {
                    employees.TryGetValue(p.EmployeeId, out var emp);
                    projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                    return new {
                        p.ProjectID, p.ServiceId,
                        p.EmployeeId,
                        EmployeeFullName = emp != null ? $"{emp.FirstNames ?? ""} {emp.LastName ?? ""}".Trim() : null,
                        p.ProjectName,
                        p.PackageId,
                        p.CreateAt,
                        p.StatusId,
                        p.Duration,
                        p.ProgramStarted,
                        p.ProgramEnd,
                        p.BriefDescription,
                        p.ProjectPhaseId,
                        p.ProjectAreaID,
                        p.IsEvaluate,
                        p.AggregateScore,
                        p.CurrentPhaseId,
                        p.IsPartnerAvailable,
                        p.AlreadyParticipatedProgram,
                        p.IsWrittenBusinessPlan,
                        p.HopeAchieve,
                        p.SupportsNeeds,
                        ProjectStatus = projectStatus
                    };
                }).ToList();
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/projectrequest/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectRequest>> GetProjectRequest(int id)
        {
            var projectRequest = await _context.ProjectRequest.FindAsync(id);
            return projectRequest == null ? NotFound() : projectRequest;
        }

        // GET: api/projectrequest/employee/5?statusId=0
        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProjectRequestsByEmployeeId(int employeeId, [FromQuery] int statusId = 0)
        {
            var query = _context.ProjectRequest.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
            {
                query = query.Where(p => p.StatusId == statusId && p.ServiceId == 1);
            }
            var projectlist = await query.ToListAsync();

            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
            
            // Pre-load all ProjectStatus data to avoid concurrent DbContext operations
            var statusIds = projectlist.Select(p => p.StatusId).Distinct().ToList();
            var projectStatuses = await _context.ProjectStatus
                .Where(ps => statusIds.Contains(ps.StatusId))
                .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

            var result = projectlist.Select(p => {
                projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                return new {
                    p.ProjectID,p.ServiceId,
                    p.EmployeeId,
                    EmployeeFullName = employee != null ? $"{employee.FirstNames ?? ""} {employee.LastName ?? ""}".Trim() : null,
                    p.ProjectName,
                    p.PackageId,
                    p.CreateAt,
                    p.StatusId,
                    p.Duration,
                    p.ProgramStarted,
                    p.ProgramEnd,
                    p.BriefDescription,
                    p.ProjectPhaseId,
                    p.ProjectAreaID,
                    p.IsEvaluate,
                    p.AggregateScore,
                    p.CurrentPhaseId,
                    p.IsPartnerAvailable,
                    p.AlreadyParticipatedProgram,
                    p.IsWrittenBusinessPlan,
                    p.HopeAchieve,
                    p.SupportsNeeds,
                    ProjectStatus = projectStatus
                };
            }).ToList();

            return Ok(new { success = true, data = result });
        }

        
        
        [HttpGet("details/{projectRequestId}")]
        public async Task<ActionResult<ProjectRequestResponseVM>> GetProjectRequestDetailsbyProjectRequestid(int projectRequestId)
        {
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == projectRequestId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "ProjectRequest not found." });

            var partner = await _context.Partner.FirstOrDefaultAsync(p => p.ProjectId == projectRequestId);
            var otherProgramAttend = await _context.OtherProgramAttend.FirstOrDefaultAsync(o => o.ProjectId == projectRequestId);
            var doclist = await _context.Documents.Where(x => x.ProjectID == projectRequestId && x.ServiceId == 1).ToListAsync();

            var projectPhase = await _context.ProjectPhase.FirstOrDefaultAsync(p => p.Id == projectRequest.ProjectPhaseId);
            var projectArea = await _context.ProjectArea.FirstOrDefaultAsync(p => p.Id == projectRequest.ProjectAreaID);
            var projectStatus = await _context.ProjectStatus.FirstOrDefaultAsync(p => p.StatusId == projectRequest.StatusId);

            var employee = await _context.Employee.FirstOrDefaultAsync(p => p.EmployeeId == projectRequest.EmployeeId);
            var userinfo = new RegisterUserVM
            {
                EmployeeId = employee.EmployeeId,
                EmailAddress = employee.EmailAddress,
                CountryId = employee.CountryId.HasValue ? employee.CountryId.Value : 0, // Explicitly handle nullable int
                FullName = employee.FirstNames + " " + employee.LastName,
                DateOfBirth = employee.DateOfBirth, 
                MobileNumber = employee.MobileNumber,
                LinkedInProfileLink=employee.LinkedInProfileLink,
                
                // Fixing the CS0029 error by changing the type of `CountryName` to `string` in the `RegisterUserVM` class
                CountryName = (await _context.Countries.FirstOrDefaultAsync(x => x.Id == employee.CountryId))?.Name
            };
            var details = new ProjectRequestResponseVM
            {
                requestModel = projectRequest,
                Partner = partner,
                OtherProgramAttend = otherProgramAttend,
                documentlist = doclist,
                projectArea= projectArea,   
                projectPhase = projectPhase,
                projectStatus = projectStatus,
                userRegisterModel=userinfo
            };

            return Ok(new { success = true, data = details });
        }


        // POST: api/projectrequest
        [HttpPost]
        [Route("CreateProjectRequest")]
        public async Task<ActionResult<ProjectRequest>> CreateProjectRequest([FromBody] ProjectRequestFullVM model)
        {
            var projectRequest = model.requestModel;
            projectRequest.CreateAt = System.DateTime.Now;
            projectRequest.StatusId = 1; projectRequest.ServiceId = 1;      
            var caseId = Nanoid.Generate(size: 10);
            projectRequest.CaseId = caseId;
            _context.ProjectRequest.Add(projectRequest);
            await _context.SaveChangesAsync();

            // Save Partner if required
            if (projectRequest.IsPartnerAvailable)
            {
                if (model.Partner == null)
                    return BadRequest(new { success = false, message = "Partner information is required." });
                model.Partner.ProjectId = projectRequest.ProjectID;
                _context.Partner.Add(model.Partner);
            }

            // Save OtherProgramAttend if required
            if (projectRequest.AlreadyParticipatedProgram)
            {
                if (model.OtherProgramAttend == null)
                    return BadRequest(new { success = false, message = "Other program information is required." });
                model.OtherProgramAttend.ProjectId = projectRequest.ProjectID;
                _context.OtherProgramAttend.Add(model.OtherProgramAttend);
            }
            // Add new ProjectActivity record
            var projectActivity = new ProjectActivity
            {
                ProjectId = projectRequest.ProjectID, ServiceId = projectRequest.ServiceId,
                StatusId = 1, // In-Review status
                Comments = "New Request Created",
                UpdatedBy = projectRequest.EmployeeId,
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

                        _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, projectRequest.ProjectID,projectRequest.ServiceId, model.requestModel.EmployeeId, fileName, item.DocumentType, "Other");
                    }
                }
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectRequest), new { id = projectRequest.ProjectID }, projectRequest);
        }

        // PUT: api/projectrequest/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectRequest(int id, ProjectRequest projectRequest)
        {
            if (id != projectRequest.ProjectID)
                return BadRequest();

            _context.Entry(projectRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectRequest.Any(e => e.ProjectID == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/projectrequest/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectRequest(int id)
        {
            var projectRequest = await _context.ProjectRequest.FindAsync(id);
            if (projectRequest == null)
                return NotFound();

            _context.ProjectRequest.Remove(projectRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Fix for CS4032: The 'await' operator can only be used within an async method.
        // The method `SendOtpToEmail` needs to be marked as `async` and its return type changed to `Task<IActionResult>`.

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

        // New API: Verify email, create user if needed, and create project request
        [HttpPost("verifyEmailandcreateProject")]
        public async Task<IActionResult> VerifyEmailAndCreateProject([FromBody] ProjectRequestVM model)
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
                catch (Exception ex)
                {

                }
                
                // Step 1: Verify OTP
                if (string.IsNullOrWhiteSpace(model.emailverifyModel.EmailAddress))
                    return BadRequest(new { success = false, message = "Email are required." });

                if(!byPassValue)
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
                var projectRequest = new ProjectRequest
                {
                    EmployeeId = employee.EmployeeId, ServiceId=1,
                    ProjectName = model.requestModel.ProjectName,
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

                _context.ProjectRequest.Add(projectRequest);
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
        <p>Use Case ID: <strong> {projectRequest.CaseId} </strong> to track your status with below link:</p>
       <p>
  <a href=""http://localhost:4200/customer-project-track?id={projectRequest.ProjectID}&serv=1"" 
     style=""display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"">
    Track
  </a>
</p>

    ",
    true
);

                // Save Partner if required
                if (model.requestModel.IsPartnerAvailable)
                {
                    if (model.Partner == null)
                        return BadRequest(new { success = false, message = "Partner information is required." });
                    model.Partner.ProjectId = projectRequest.ProjectID;
                    _context.Partner.Add(model.Partner);
                }

                // Save OtherProgramAttend if required
                if (model.requestModel.AlreadyParticipatedProgram)
                {
                    if (model.OtherProgramAttend == null)
                        return BadRequest(new { success = false, message = "Other program information is required." });
                    model.OtherProgramAttend.ProjectId = projectRequest.ProjectID;
                    _context.OtherProgramAttend.Add(model.OtherProgramAttend);
                }

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = projectRequest.ProjectID, ServiceId = projectRequest.ServiceId,
                    StatusId = 1, // In Review status
                    Comments = "New Request Created",
                    UpdatedBy = projectRequest.EmployeeId,
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

                            _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, projectRequest.ProjectID, projectRequest.ServiceId, model.requestModel.EmployeeId, fileName, item.DocumentType, "Other");
                        }
                    }
                }
                
                await _context.SaveChangesAsync();

                // Clean up OTP
                _otpStore.Remove(model.emailverifyModel.EmailAddress);

                return Ok(new { 
                    success = true, 
                    message = "Project request created successfully.", 
                    projectId = projectRequest.ProjectID, 
                    employeeId = employee.EmployeeId,
                    isNewUser = existingUser == null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }

        // POST: api/projectrequest/approve
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveProjectRequest([FromBody] ApproveProjectRequestModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                if (model.FollowUpStart >= model.FollowUpEnd)
                    return BadRequest(new { success = false, message = "ProjectStart must be before ProjectEnd." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId==1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == projectRequest.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                // Update ProjectRequest with new start and end dates
                projectRequest.FollowUpStart = model.FollowUpStart;
                projectRequest.FollowUpEnd = model.FollowUpEnd;
                projectRequest.StatusId = 2; // Set status to approved

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId, ServiceId= projectRequest.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId, ServiceId=projectRequest.ServiceId,
                    StatusId = 2, // Approved status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                if (!string.IsNullOrEmpty(employee.EmailAddress))
                {
                    string[] emailList = new string[1] { employee.EmailAddress };
                    string emailSubject = "NMOHUB - Project Request Approved";
                    string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},

Your project request '{projectRequest.ProjectName}' has been approved!

Project Details:
- Project Name: {projectRequest.ProjectName}
- Project Start Date: {model.FollowUpStart:dd/MM/yyyy}
- Project End Date: {model.FollowUpEnd:dd/MM/yyyy}
- Comments: {model.Comments}

Your project is now scheduled to begin on {model.FollowUpStart:dd/MM/yyyy} and will end on {model.FollowUpEnd:dd/MM/yyyy}.

Best regards,
NMOHUB Team";

                    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);

                    try
                    {
                        Notification notification = new Notification();
                        notification.DateCreated = DateTime.Now;
                        notification.EmployeeId = employee.EmployeeId;
                        notification.IsActive = true;
                        notification.Message = emailBody;
                        notification.Title = emailSubject;
                        _context.Notifications.Add(notification);
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {

                    }
                    

                }

                return Ok(new { 
                    success = true, 
                    message = "Project request approved successfully.",
                    projectId = model.ProjectId,
                    followUpStart = model.FollowUpStart,
                    followUpEnd = model.FollowUpEnd
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while approving the project request.", error = ex.Message });
            }
        }

        // POST: api/projectrequest/reject
        [HttpPost("reject")]
        public async Task<IActionResult> RejectProjectRequest([FromBody] RejectProjectRequestModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId==1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == projectRequest.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                // Update ProjectRequest status to 3 (rejected)
                projectRequest.StatusId = 3;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId, ServiceId= projectRequest.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    StatusId = 3, // Rejected status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                if (!string.IsNullOrEmpty(employee.EmailAddress))
                {
                    string[] emailList = new string[1] { employee.EmailAddress };
                    string emailSubject = "NMOHUB - Project Request Rejected";
                    string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{projectRequest.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                }

                return Ok(new {
                    success = true,
                    message = "Project request rejected successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while rejecting the project request.", error = ex.Message });
            }
        }

        // POST: api/projectrequest/schedule-meeting
        [HttpPost("schedule-meeting")]
        public async Task<IActionResult> ScheduleMeeting([FromBody] Meetings meeting)
        {
            if (meeting == null)
                return BadRequest(new { success = false, message = "Meeting details are required." });

            // Validate required fields
            if (meeting.ProjectID <= 0 || meeting.EmployeeId <= 0)
                return BadRequest(new { success = false, message = "ProjectID and EmployeeId are required and must be greater than 0." });
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

           


            // Add meeting record
            meeting.ServiceId = 1;
            _context.Meetings.Add(meeting);


            // Update project status to 4
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == meeting.ProjectID && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 4;

            // Add ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = meeting.ProjectID,
                ServiceId = projectRequest.ServiceId,
                StatusId = 4, // Meeting scheduled status
                Comments =  "Meeting scheduled.",
                UpdatedBy = meeting.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            await _context.SaveChangesAsync();

                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == meeting.EmployeeId);
                DateTime sTime = slot.SlotDate + slot.StartTime;
                DateTime eTime= slot.SlotDate + slot.EndTime;
                await this.eventService.CreateGoogleMeeting(employee.EmailAddress, employee.FirstNames, sTime, eTime);
               

            return Ok(new { success = true, message = "Meeting scheduled successfully." });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        // POST: api/projectrequest/pitch-complete
        [HttpPost("pitch-complete")]
        public async Task<IActionResult> PitchComplete([FromBody] PitchCompleteRequestModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0 || string.IsNullOrWhiteSpace(model.Feedback))
            {
                return BadRequest(new { success = false, message = "EmployeeId, ProjectId, and Feedback are required." });
            }

            // Add new Notes
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 1,
                FullDescription = model.Feedback,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Update Feedback in Meetings for this ProjectId
            var meetings = _context.Meetings.Where(m => m.ProjectID == model.ProjectId && m.ServiceId == 1).ToList();
            foreach (var meeting in meetings)
            {
                meeting.Feedback = model.Feedback;
                _context.Entry(meeting).State = EntityState.Modified;
            }

            // Update ProjectRequest status to 5
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 5;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = 5,
                Comments = model.Feedback,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            // Save documents
            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, projectRequest.ServiceId,  model.EmployeeId, fileName, item.DocumentType, "Other");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Pitch completed successfully." });
         }

        // POST: api/projectrequest/review-pitch-and-score
        [HttpPost("review-pitch-and-score")]
        public async Task<IActionResult> ReviewPitchAndScore([FromBody] ReviewPitchAndScoreModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0 || string.IsNullOrWhiteSpace(model.Review))
            {
                return BadRequest(new { success = false, message = "EmployeeId, ProjectId, and Review are required." });
            }

            // Add new Notes
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId =1,
                FullDescription = model.Review,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Update ProjectRequest status to 6 and set AggregateScore
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 6;
            projectRequest.AggregateScore = model.ScoreValue;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = 6,
                Comments = model.Review,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Pitch reviewed and scored successfully." });
        }

        // Model for ReviewPitchAndScore
        public class ReviewPitchAndScoreModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
            public string Review { get; set; }
            public double ScoreValue { get; set; }
        }

        // Model for SendProposal
        public class SendProposalModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
            public string Comments { get; set; }
            public List<DocumentData> Documents { get; set; }
        }

        // POST: api/projectrequest/send-proposal
        [HttpPost("send-proposal")]
        public async Task<IActionResult> SendProposal([FromBody] SendProposalModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0 || string.IsNullOrWhiteSpace(model.Comments))
            {
                return BadRequest(new { success = false, message = "EmployeeId, ProjectId, and Comments are required." });
            }

            // Add new Notes
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 1,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Update ProjectRequest status to 7
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 7;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = 7,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            // Save documents and collect file info for email
            List<(string filePath, string fileName, string base64Data, string extension)> filesForEmail = new List<(string, string, string, string)>();
            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId,projectRequest.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Other");
                    filesForEmail.Add((
                        filePath: $"Resources/Other/{model.ProjectId}/{fileName}",
                        fileName: fileName,
                        base64Data: item.Base64Data,
                        extension: item.Extension
                    ));
                }
            }

            await _context.SaveChangesAsync();

            // Get employee email
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == model.EmployeeId);
            if (employee == null || string.IsNullOrEmpty(employee.EmailAddress))
                return NotFound(new { success = false, message = "Employee not found or email missing." });

            // Send email with attachments
            string[] emailList = new string[1] { employee.EmailAddress };
            string emailSubject = "NMOHUB - Proposal Submitted";
            string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},<br/><br/>Your proposal has been submitted for Project ID: {model.ProjectId}.<br/><br/>Comments: {model.Comments}<br/><br/>Please find the attached documents.";

            // Attach all documents (send as separate emails if needed, or as multiple attachments)
            if (filesForEmail.Count > 0)
            {
                foreach (var file in filesForEmail)
                {
                    // Use base64 data for attachment
                    try
                    {
                        _mailer.SendEmailWithBase64Attachment(emailList, "support@nmohub.com", emailSubject, emailBody, file.base64Data, file.fileName);
                    }
                    catch (Exception ex)
                    {
                        // Log or handle email sending error
                    }
                }
            }
            else
            {
                // Send email without attachments
                _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
            }

            return Ok(new { success = true, message = "Proposal sent successfully." });
        }

        // Model for RejectIdea
        public class RejectIdeaModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
            public string Comments { get; set; }
        }

        // POST: api/projectrequest/reject-idea
        [HttpPost("reject-idea")]
        public async Task<IActionResult> RejectIdea([FromBody] RejectIdeaModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == projectRequest.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                // Update ProjectRequest status to 8 (idea rejected)
                projectRequest.StatusId = 8;
                _context.Entry(projectRequest).State = EntityState.Modified;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    StatusId = 8, // Rejected idea status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                if (!string.IsNullOrEmpty(employee.EmailAddress))
                {
                    string[] emailList = new string[1] { employee.EmailAddress };
                    string emailSubject = "NMOHUB - Idea Rejected";
                    string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour idea for project '{projectRequest.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                }

                return Ok(new {
                    success = true,
                    message = "Idea rejected successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while rejecting the idea.", error = ex.Message });
            }
        }

        // Model for AcceptProposal API
        public class AcceptProposalModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
        }

        // POST: api/projectrequest/accept-proposal
        [HttpPost("accept-proposal")]
        public async Task<IActionResult> AcceptProposal([FromBody] AcceptProposalModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == projectRequest.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                // Update ProjectRequest status to 9 (proposal accepted)
                projectRequest.StatusId = 9;
                _context.Entry(projectRequest).State = EntityState.Modified;

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    StatusId = 9, // Proposal accepted status
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee with dummy payment info
                if (!string.IsNullOrEmpty(employee.EmailAddress))
                {
                    string[] emailList = new string[1] { employee.EmailAddress };
                    string emailSubject = "NMOHUB - Proposal Accepted";
                    string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nCongratulations! Your proposal for project '{projectRequest.ProjectName}' has been accepted.\n\nNext Steps:\nPlease pay the amount of $500 to the following account to proceed:\nAccount Name: NMOHUB Payments\nAccount Number: 1234567890\nBank: Demo Bank\nIFSC: DEMO0001234\n\nOnce payment is received, your project will move to the next phase.\n\nBest regards,\nNMOHUB Team";

                    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                }

                return Ok(new {
                    success = true,
                    message = "Proposal accepted successfully. Confirmation email sent.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while accepting the proposal.", error = ex.Message });
            }
        }

        // Model for RejectProposal API
        public class RejectProposalModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
            public string Comments { get; set; }
        }

        // POST: api/projectrequest/reject-proposal
        [HttpPost("reject-proposal")]
        public async Task<IActionResult> RejectProposal([FromBody] RejectProposalModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0 || string.IsNullOrWhiteSpace(model.Comments))
                    return BadRequest(new { success = false, message = "EmployeeId, ProjectId, and Comments are required." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Update ProjectRequest status to 10 (proposal rejected)
                projectRequest.StatusId = 10;
                _context.Entry(projectRequest).State = EntityState.Modified;

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    StatusId = 10, // Proposal rejected status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = "Proposal rejected successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while rejecting the proposal.", error = ex.Message });
            }
        }

        public class UploadPaymentProofdocModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
            public string Comments { get; set; }
            public List<DocumentData> Documents { get; set; }
        }

        // POST: api/projectrequest/upload-payment-proofdoc
        [HttpPost("upload-payment-proofdoc")]
        public async Task<IActionResult> UploadPaymentProofdoc([FromBody] UploadPaymentProofdocModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0)
            {
                return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });
            }

            if (model.Documents == null || model.Documents.Count <= 0)
            {
                return BadRequest(new { success = false, message = "Please Upload Payment Receipt" });
            }

            // Add new Notes
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 1,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Update ProjectRequest status to 11
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 11;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = 11,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            PaymentActivity paymentActivity = new PaymentActivity();
            paymentActivity.ProjectId = projectRequest.ProjectID;
            paymentActivity.PaymentName = "Initial Payment";
            paymentActivity.CreatedAt = DateTime.Now;
            paymentActivity.ServiceId = projectRequest.ServiceId;
            _context.PaymentActivity.Add(paymentActivity);
            await _context.SaveChangesAsync();

            // Save documents
            if (model.Documents != null && model.Documents.Count > 0)
            {
                int i = 0;
                foreach (var item in model.Documents)
                {
                    i++;
                    var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;
                    var filePath = $"Resources/Other/{model.ProjectId}/{fileName}";
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId,projectRequest.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Other");
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

        public class PaymentReceivedModel
        {
            public int EmployeeId { get; set; }
            public int ProjectId { get; set; }
        }

        // POST: api/projectrequest/payment-received
        [HttpPost("payment-received")]
        public async Task<IActionResult> PaymentReceived([FromBody] PaymentReceivedModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0)
            {
                return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });
            }

            // Update ProjectRequest status to 12
            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Project request not found." });
            projectRequest.StatusId = 12;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = 12,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);

            await _context.SaveChangesAsync();



            // Updating Payment activiy table
            var paymentActivity = await _context.PaymentActivity.FirstOrDefaultAsync(p => p.ProjectId == model.ProjectId && p.ServiceId == projectRequest.ServiceId);
            if (paymentActivity == null)
                return NotFound();
            paymentActivity.IsVerified = true;
            _context.Entry(paymentActivity).State = EntityState.Modified;
            await _context.SaveChangesAsync();


            // Send payment confirmation email
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == model.EmployeeId);
            if (employee != null && !string.IsNullOrEmpty(employee.EmailAddress))
            {
                string[] emailList = new string[1] { employee.EmailAddress };
                string emailSubject = "NMOHUB - Payment Received";
                string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},<br/><br/>Your payment for Project : {projectRequest.ProjectName} has been received and confirmed.<br/><br/>Thank you for your payment. Your project will proceed to the next phase.<br/><br/>Best regards,<br/>NMOHUB Team";
                _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
            }

            return Ok(new { success = true, message = "Payment received and confirmed. Email sent." });
        }

        // GET: api/projectrequest/projectid-by-caseid/{caseId}
        [HttpGet("projectid-by-caseid/{caseId}")]
        public async Task<IActionResult> GetProjectIdByCaseId(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
                return BadRequest(new { success = false, message = "caseId is required." });

            var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.CaseId == caseId);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "No project found for the provided caseId." });

            return Ok(new { success = true, projectId = projectRequest.ProjectID ,serviceId = projectRequest.ServiceId });
        }

        // POST: api/projectrequest/programactive
        [HttpPost("program-active")]
        public async Task<IActionResult> ProgramActiveRequest([FromBody] ProgramActiveRequestModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                if (model.ProjectStart >= model.ProjectEnd)
                    return BadRequest(new { success = false, message = "ProjectStart must be before ProjectEnd." });

                // Find the project request
                var projectRequest = await _context.ProjectRequest.FirstOrDefaultAsync(p => p.ProjectID == model.ProjectId && p.ServiceId == 1);
                if (projectRequest == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == projectRequest.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                // Update ProjectRequest with new start and end dates
                projectRequest.ProgramStarted = model.ProjectStart;
                projectRequest.ProgramEnd = model.ProjectEnd;
                projectRequest.StatusId = 13; // Set status to program active

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId=projectRequest.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = projectRequest.ServiceId,
                    StatusId = 13, // Program Active status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                if (!string.IsNullOrEmpty(employee.EmailAddress))
                {
                    string[] emailList = new string[1] { employee.EmailAddress };
                    string emailSubject = "NMOHUB - Program Active";
                    string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},

Your project request '{projectRequest.ProjectName}' has been approved!

Project Details:
- Project Name: {projectRequest.ProjectName}
- Project Start Date: {model.ProjectStart:dd/MM/yyyy}
- Project End Date: {model.ProjectEnd:dd/MM/yyyy}
- Comments: {model.Comments}

Your project is now scheduled to begin on {model.ProjectStart:dd/MM/yyyy} and will end on {model.ProjectEnd:dd/MM/yyyy}.

Best regards,
NMOHUB Team";

                    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                }

                return Ok(new
                {
                    success = true,
                    message = "Program Active successfully.",
                    projectId = model.ProjectId,
                    projectStart = model.ProjectStart,
                    projectEnd = model.ProjectEnd
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while program activating request.", error = ex.Message });
            }
        }


        [HttpGet("export")]
        public async Task<IActionResult> ExportIncubatorList([FromQuery] int statusId = 0)
        {
            var query = _context.ProjectRequest.AsQueryable();
            if (statusId != 0)
                query = query.Where(x => x.StatusId == statusId);

            var list = await query
                .OrderByDescending(x => x.ProjectID)
                .Select(x => new
                {
                    x.ProjectID,
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
            csv.AppendLine("ProjectID,EmployeeId,EmployeeFullName,BriefDescription,StatusId,ProjectName,CaseId,CreatedAt");
            foreach (var item in list)
            {
                var fullName = employees.TryGetValue(item.EmployeeId, out var name) ? name : "";
                csv.AppendLine($"{item.ProjectID},{item.EmployeeId},\"{fullName}\",\"{item.BriefDescription}\",{item.StatusId},{item.ProjectName},{item.CaseId},{item.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var fileName = $"Inc_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            return File(bytes, "text/csv", fileName);
        }

    }
}