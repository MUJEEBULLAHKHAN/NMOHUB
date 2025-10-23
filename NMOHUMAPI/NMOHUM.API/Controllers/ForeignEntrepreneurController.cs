using Google.Apis.Calendar.v3.Data;
using Microsoft.AspNetCore.Http;
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
//using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NMOHUM.API.Controllers.ProjectRequestController;
using static NMOHUM.API.Models.ForeignEntrepreneurEntities;
using EntityState = Microsoft.EntityFrameworkCore.EntityState;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForeignEntrepreneurController : ControllerBase
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
        public ForeignEntrepreneurController(
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



        [HttpPost]
        [HttpPost("CreateForeignEntrepreneurRequest")]
        public async Task<IActionResult> CreateForeignEntrepreneurRequest([FromBody] ForeignEntrepreneurRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                int empid = 0;
                if (request.EmployeeId == null || request.EmployeeId == 0)
                {
                    var existingUser = await _userManager.FindByEmailAsync(request.Email);
                    Employee employee = null;

                    if (existingUser == null)
                    {
                        var password = GenerateRandomPassword();
                        var user = new IdentityUser
                        {
                            Email = request.Email,
                            UserName = request.Email,
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
                            FirstNames = request.FullName,
                            LastName = " ",
                            UserId = user.Id,
                            EmailAddress = user.Email,
                            MobileNumber = request.PhoneNumber,
                            CountryId = 1,
                            DateOfBirth = DateTime.Now

                        };
                        _context.Employee.Add(employee);
                        await _context.SaveChangesAsync();

                        empid = employee.EmployeeId;
                        //send project submitted confirmation email
                        string[] emailList1 = new string[1] { request.Email };
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

                    }
                    else
                    {
                        empid = request.EmployeeId;
                    }

                    // 2. Save Foreign Entrepreneur
                    var entrepreneur = new ForeignEntrepreneur
                    {
                        EmployeeId = empid,
                        BusinessDescription = request.BusinessDescription,
                        StatusId = 1, // default pending 
                        ServiceId = 9,
                        CurrentStage = (int)request.CurrentStage,
                        OtherStageDetails = request.OtherStageDetails,
                        OtherIndustryDetails = request.OtherIndustryDetails,
                        Timeframe = (int)request.Timeframe,
                        TargetIndustries = request.TargetIndustries != null
                                           ? string.Join(",", request.TargetIndustries.Select(i => (int)i))
                                           : null
                    };

                    _context.ForeignEntrepreneur.Add(entrepreneur);
                    await _context.SaveChangesAsync();

                    // 3. Save Service-specific details
                    if (request.Services != null)
                    {
                        foreach (var service in request.Services)
                        {
                            switch (service)
                            {
                                case ServiceType.EntrepreneurshipLicenseGateway:
                                    if (request.EntrepreneurshipLicense != null)
                                    {
                                        _context.EntrepreneurshipLicense.Add(new EntrepreneurshipLicense
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            OnlyLicenseFacilitation = request.EntrepreneurshipLicense.OnlyLicenseFacilitation,
                                            OtherNeedsDescription = request.EntrepreneurshipLicense.OtherNeedsDescription
                                        });
                                    }
                                    break;

                                case ServiceType.MarketNavigatorLicensePackage:
                                    if (request.MarketNavigator != null)
                                    {
                                        _context.MarketNavigator.Add(new MarketNavigator
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            TargetMarket = request.MarketNavigator.TargetMarket,
                                            KeyAssumptions = request.MarketNavigator.KeyAssumptions,
                                            HasMarketResearch = request.MarketNavigator.HasMarketResearch
                                        });
                                    }
                                    break;

                                case ServiceType.ComplianceCatalystLicensePackage:
                                    if (request.ComplianceCatalyst != null)
                                    {
                                        _context.ComplianceCatalyst.Add(new ComplianceCatalyst
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            CompanyStructure = request.ComplianceCatalyst.CompanyStructure,
                                            HasIntellectualProperty = request.ComplianceCatalyst.HasIntellectualProperty,
                                            LegalConcerns = request.ComplianceCatalyst.LegalConcerns
                                        });
                                    }
                                    break;

                                case ServiceType.VentureLaunchpadAccelerator:
                                    if (request.VentureLaunchpad != null)
                                    {
                                        _context.VentureLaunchpad.Add(new VentureLaunchpad
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            FundingStage = request.VentureLaunchpad.FundingStage,
                                            TargetFundraisingAmount = request.VentureLaunchpad.TargetFundraisingAmount,
                                            EstimatedValuation = request.VentureLaunchpad.EstimatedValuation,
                                            HasMVP = request.VentureLaunchpad.HasMVP,
                                            MVPLink = request.VentureLaunchpad.MVPLink
                                        });
                                    }
                                    break;

                                case ServiceType.InnovationBuilderLicensePackage:
                                    if (request.InnovationBuilder != null)
                                    {
                                        _context.InnovationBuilder.Add(new InnovationBuilder
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            DevelopmentStage = request.InnovationBuilder.DevelopmentStage,
                                            HasSpecificationDoc = request.InnovationBuilder.HasSpecificationDoc,
                                            SeekingCoFounder = request.InnovationBuilder.SeekingCoFounder,
                                            RolesDescription = request.InnovationBuilder.RolesDescription,
                                            HasCodeOrDesign = request.InnovationBuilder.HasCodeOrDesign,
                                            CodeOrDesignLinks = request.InnovationBuilder.CodeOrDesignLinks
                                        });
                                    }
                                    break;

                            }
                        }
                    }

                    await _context.SaveChangesAsync();

                    // 4. Save Documents
                    if (request.documentlist != null && request.documentlist.Count > 0)
                    {
                        if (request.documentlist.Count > 0)
                        {
                            int i = 0;
                            foreach (var item in request.documentlist)
                            {
                                i++;
                                var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                                _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, entrepreneur.ForeignEntrepreneurId, entrepreneur.ForeignEntrepreneurId, request.EmployeeId, fileName, item.DocumentType, "Other");
                            }
                        }
                    }
                    await transaction.CommitAsync();
                    return Ok(new { message = "Foreign entrepreneur request created successfully", success = true, id = entrepreneur.ForeignEntrepreneurId });
                }
                // If EmployeeId is not null or 0, handle the case here
                else
                {
                    // 2. Save Foreign Entrepreneur
                    var entrepreneur = new ForeignEntrepreneur
                    {
                        EmployeeId = request.EmployeeId,
                        BusinessDescription = request.BusinessDescription,
                        StatusId = 1, // default pending
                        ServiceId = 9,
                        CurrentStage = (int)request.CurrentStage,
                        OtherStageDetails = request.OtherStageDetails,
                        OtherIndustryDetails = request.OtherIndustryDetails,
                        Timeframe = (int)request.Timeframe,
                        TargetIndustries = request.TargetIndustries != null
                                           ? string.Join(",", request.TargetIndustries.Select(i => (int)i))
                                           : null
                    };

                    _context.ForeignEntrepreneur.Add(entrepreneur);
                    await _context.SaveChangesAsync();

                    // 3. Save Service-specific details
                    if (request.Services != null)
                    {
                        foreach (var service in request.Services)
                        {
                            switch (service)
                            {
                                case ServiceType.EntrepreneurshipLicenseGateway:
                                    if (request.EntrepreneurshipLicense != null)
                                    {
                                        _context.EntrepreneurshipLicense.Add(new EntrepreneurshipLicense
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            OnlyLicenseFacilitation = request.EntrepreneurshipLicense.OnlyLicenseFacilitation,
                                            OtherNeedsDescription = request.EntrepreneurshipLicense.OtherNeedsDescription
                                        });
                                    }
                                    break;

                                case ServiceType.MarketNavigatorLicensePackage:
                                    if (request.MarketNavigator != null)
                                    {
                                        _context.MarketNavigator.Add(new MarketNavigator
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            TargetMarket = request.MarketNavigator.TargetMarket,
                                            KeyAssumptions = request.MarketNavigator.KeyAssumptions,
                                            HasMarketResearch = request.MarketNavigator.HasMarketResearch
                                        });
                                    }
                                    break;

                                case ServiceType.ComplianceCatalystLicensePackage:
                                    if (request.ComplianceCatalyst != null)
                                    {
                                        _context.ComplianceCatalyst.Add(new ComplianceCatalyst
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            CompanyStructure = request.ComplianceCatalyst.CompanyStructure,
                                            HasIntellectualProperty = request.ComplianceCatalyst.HasIntellectualProperty,
                                            LegalConcerns = request.ComplianceCatalyst.LegalConcerns
                                        });
                                    }
                                    break;

                                case ServiceType.VentureLaunchpadAccelerator:
                                    if (request.VentureLaunchpad != null)
                                    {
                                        _context.VentureLaunchpad.Add(new VentureLaunchpad
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            FundingStage = request.VentureLaunchpad.FundingStage,
                                            TargetFundraisingAmount = request.VentureLaunchpad.TargetFundraisingAmount,
                                            EstimatedValuation = request.VentureLaunchpad.EstimatedValuation,
                                            HasMVP = request.VentureLaunchpad.HasMVP,
                                            MVPLink = request.VentureLaunchpad.MVPLink
                                        });
                                    }
                                    break;

                                case ServiceType.InnovationBuilderLicensePackage:
                                    if (request.InnovationBuilder != null)
                                    {
                                        _context.InnovationBuilder.Add(new InnovationBuilder
                                        {
                                            ForeignEntrepreneurId = entrepreneur.ForeignEntrepreneurId,
                                            DevelopmentStage = request.InnovationBuilder.DevelopmentStage,
                                            HasSpecificationDoc = request.InnovationBuilder.HasSpecificationDoc,
                                            SeekingCoFounder = request.InnovationBuilder.SeekingCoFounder,
                                            RolesDescription = request.InnovationBuilder.RolesDescription,
                                            HasCodeOrDesign = request.InnovationBuilder.HasCodeOrDesign,
                                            CodeOrDesignLinks = request.InnovationBuilder.CodeOrDesignLinks
                                        });
                                    }
                                    break;

                            }
                        }
                    }

                    await _context.SaveChangesAsync();

                    // 4. Save Documents
                    if (request.documentlist != null && request.documentlist.Count > 0)
                    {
                        if (request.documentlist.Count > 0)
                        {
                            int i = 0;
                            foreach (var item in request.documentlist)
                            {
                                i++;
                                var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                                _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, entrepreneur.ForeignEntrepreneurId, entrepreneur.ForeignEntrepreneurId, request.EmployeeId, fileName, item.DocumentType, "Other");
                            }
                        }
                    }
                    await transaction.CommitAsync();
                    return Ok(new { message = "Foreign entrepreneur request created successfully", success = true, id = entrepreneur.ForeignEntrepreneurId });
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating request", details = ex.Message });
            }
        }

        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveForeignRequest([FromBody] ApproveFERequestModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId  are required and must be greater than 0." });


                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });


                fe.StatusId = 2; // Set status to approved



                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = 9,
                    StatusId = 2, // Approved status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee

                return Ok(new
                {
                    success = true,
                    message = "FE approved successfully.",
                    projectId = model.ProjectId,

                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while approving the project request.", error = ex.Message });
            }
        }

        [HttpPost("reject")]
        public async Task<IActionResult> RejectForeignRequest([FromBody] RejectFEtModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 3;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = 3, // Rejected status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
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

        [HttpPost("missinginfo")]
        public async Task<IActionResult> MissingInfoForeignRequest([FromBody] MissingInfoFEtModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 4;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId,
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
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

        [HttpPost("missinginfosubmited")]
        public async Task<IActionResult> MissingInfoSubmitedForeignRequest([FromBody] MissingInfoUpdateFEtModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 5;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId,
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);
                // 4. Save Documents
                if (model.documentlist != null && model.documentlist.Count > 0)
                {
                    if (model.documentlist.Count > 0)
                    {
                        int i = 0;
                        foreach (var item in model.documentlist)
                        {
                            i++;
                            var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                            _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, fe.ForeignEntrepreneurId, fe.ForeignEntrepreneurId, model.EmployeeId, fileName, item.DocumentType, "Other");
                        }
                    }
                }
                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
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
                meeting.ServiceId = 9;
                _context.Meetings.Add(meeting);


                // Update project status to 4
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == meeting.ProjectID && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });
                fe.StatusId = 6;

                // Add ProjectActivity
                var projectActivity = new ProjectActivity
                {
                    ProjectId = meeting.ProjectID,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId, // Meeting scheduled status
                    Comments = "Meeting scheduled.",
                    UpdatedBy = meeting.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                await _context.SaveChangesAsync();

                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == meeting.EmployeeId);
                DateTime sTime = slot.SlotDate + slot.StartTime;
                DateTime eTime = slot.SlotDate + slot.EndTime;
                await this.eventService.CreateGoogleMeeting(employee.EmailAddress, employee.FirstNames, sTime, eTime);


                return Ok(new { success = true, message = "Meeting scheduled successfully." });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("pitch-complete")]
        public async Task<IActionResult> PitchComplete([FromBody] UpdateWithDocsModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.ProjectId <= 0 || string.IsNullOrWhiteSpace(model.Comments))
            {
                return BadRequest(new { success = false, message = "EmployeeId, ProjectId, and Feedback are required." });
            }

            // Add new Notes
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 9,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Update Feedback in Meetings for this ProjectId
            var meetings = _context.Meetings.Where(m => m.ProjectID == model.ProjectId && m.ServiceId == 1).ToList();
            foreach (var meeting in meetings)
            {
                meeting.Feedback = model.Comments;
                _context.Entry(meeting).State = EntityState.Modified;
            }

            var projectRequest = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (projectRequest == null)
                return NotFound(new { success = false, message = "Foreigner Request not found." });
            projectRequest.StatusId = 7;
            _context.Entry(projectRequest).State = EntityState.Modified;

            // Add new ProjectActivity
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = projectRequest.ServiceId,
                StatusId = projectRequest.StatusId,
                Comments = model.Comments,
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
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, projectRequest.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Other");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Pitch completed successfully." });
        }

        [HttpPost("approve-plan")]
        public async Task<IActionResult> ApprovePlan([FromBody] ApproveFERequestModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId  are required and must be greater than 0." });


                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });


                fe.StatusId = 8; // Set status to approved

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = 9,
                    FullDescription = "Plan Approved",
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = 9,
                    StatusId = fe.StatusId, // Approved status
                    Comments = "Plan Approved",
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee

                return Ok(new
                {
                    success = true,
                    message = "FE approved successfully.",
                    projectId = model.ProjectId,

                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while approving the project request.", error = ex.Message });
            }
        }

        [HttpPost("reject-plan")]
        public async Task<IActionResult> RejectPlan([FromBody] RejectFEtModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 9;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId, // Rejected status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
                    success = true,
                    message = "Plan rejected successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while rejecting the project request.", error = ex.Message });
            }
        }


        [HttpPost("send-proposal")]
        public async Task<IActionResult> SendProposal([FromBody] UpdateWithDocsModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 9,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (fs == null)
                return NotFound(new { success = false, message = "Foriegner request not found." });
            fs.StatusId = 10;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = fs.StatusId,
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
            return Ok(new { success = true, message = "Proposal sent to employee for Foreigner Entreprenuer request." });
        }


        [HttpPost("accept-proposal")]
        public async Task<IActionResult> AcceptProposal([FromBody] AcceptProposalModel model)
        {
            var fs = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (fs == null)
                return NotFound(new { success = false, message = "Foreigner Entreprenuer request not found." });
            fs.StatusId = 11;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = fs.StatusId,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal accepted for Foreigner Entreprenuer request." });
        }

        [HttpPost("reject-proposal")]
        public async Task<IActionResult> RejectProposal([FromBody] RejectProposalModel model)
        {
            var fs = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (fs == null)
                return NotFound(new { success = false, message = "Foreigner Entrepreneur request not found." });
            fs.StatusId = 12;
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
                StatusId = fs.StatusId,
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Proposal rejected for  Foreigner Entreprenuer request." });
        }

        [HttpPost("send-contract")]
        public async Task<IActionResult> SendContract([FromBody] UpdateWithDocsModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 9,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (fs == null)
                return NotFound(new { success = false, message = "Foriegner request not found." });
            fs.StatusId = 13;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = fs.StatusId,
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
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, fs.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Foreigner");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Contract sent to employee for Foreigner Entreprenuer request." });
        }

        [HttpPost("signed-contract")]
        public async Task<IActionResult> SignedContract([FromBody] UpdateWithDocsModel model)
        {
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 9,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);
            var fs = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
            if (fs == null)
                return NotFound(new { success = false, message = "Foreigner request not found." });
            fs.StatusId = 14;
            _context.Entry(fs).State = EntityState.Modified;
            var activity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = fs.ServiceId,
                StatusId = fs.StatusId,
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
                    _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, model.ProjectId, fs.ServiceId, model.EmployeeId, fileName, item.DocumentType, "Foreigner");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Contract Signed for Foreigner Entreprenuer request." });
        }



        [HttpPost("upload-full-documents")]
        public async Task<IActionResult> UploadFullDocuments(UpdateWithDocsModel model)
        {


            // Find the project request
            var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId);
            if (fe == null)
                return NotFound(new { success = false, message = "Foreigner entrepreneur request not found." });

            // Get employee information for email
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == model.EmployeeId);
            if (employee == null)
                return NotFound(new { success = false, message = "Employee not found." });


            fe.StatusId = 15; // Set status to approved

            // Add new Notes record
            var note = new Notes
            {
                ProjectID = model.ProjectId,
                ServiceId = 9,
                FullDescription = model.Comments,
                CreateAt = DateTime.Now
            };
            _context.Notes.Add(note);

            // Add new ProjectActivity record
            var projectActivity = new ProjectActivity
            {
                ProjectId = model.ProjectId,
                ServiceId = 9,
                StatusId = fe.StatusId, // Approved status
                Comments = model.Comments,
                UpdatedBy = model.EmployeeId,
                CreateAt = DateTime.Now
            };
            _context.ProjectActivity.Add(projectActivity);
            // 4. Save Documents
            if (model.Documents != null && model.Documents.Count > 0)
            {
                if (model.Documents.Count > 0)
                {
                    int i = 0;
                    foreach (var item in model.Documents)
                    {
                        i++;
                        var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                        _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, fe.ForeignEntrepreneurId, fe.ForeignEntrepreneurId, model.EmployeeId, fileName, item.DocumentType, "Other");
                    }
                }
            }
            // Save all changes
            await _context.SaveChangesAsync();


            return Ok(new { success = true, message = "Full Documents uploaded for Foreigner Entrepreneur request." });
        }


        [HttpPost("docs-verified")]
        public async Task<IActionResult> DocsVerified([FromBody] UpdateModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 16;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = "Docs Verified",
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId, // Rejected status
                    Comments = "Docs Verified",
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
                    success = true,
                    message = "Docs Verified successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while verifiying docs.", error = ex.Message });
            }
        }

        [HttpPost("payment-done")]
        public async Task<IActionResult> PaymentDone([FromBody] UpdateWithDocsModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 17;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId, // Rejected status
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);
                // 4. Save Documents
                if (model.Documents != null && model.Documents.Count > 0)
                {
                    if (model.Documents.Count > 0)
                    {
                        int i = 0;
                        foreach (var item in model.Documents)
                        {
                            i++;
                            var fileName = i + DateTime.Now.ToString("ddMMyyyHHmmss") + item.Extension;

                            _fileStorageServiceHandler.StoreBlob(item.Base64Data, item.Extension, fe.ForeignEntrepreneurId, fe.ForeignEntrepreneurId, model.EmployeeId, fileName, item.DocumentType, "Other");
                        }
                    }
                }

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
                    success = true,
                    message = "Payment Done successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while payment the project request.", error = ex.Message });
            }
        }

        [HttpPost("service-active")]
        public async Task<IActionResult> ServiceActive([FromBody] UpdateModel model)
        {
            try
            {
                // Validate input parameters
                if (model.EmployeeId <= 0 || model.ProjectId <= 0)
                    return BadRequest(new { success = false, message = "EmployeeId and ProjectId are required and must be greater than 0." });

                // Find the project request
                var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == model.ProjectId && p.ServiceId == 9);
                if (fe == null)
                    return NotFound(new { success = false, message = "Project request not found." });

                // Get employee information for email
                var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found." });

                fe.StatusId = 18;

                // Add new Notes record
                var note = new Notes
                {
                    ProjectID = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    FullDescription = model.Comments,
                    CreateAt = DateTime.Now
                };
                _context.Notes.Add(note);

                // Add new ProjectActivity record
                var projectActivity = new ProjectActivity
                {
                    ProjectId = model.ProjectId,
                    ServiceId = fe.ServiceId,
                    StatusId = fe.StatusId,
                    Comments = model.Comments,
                    UpdatedBy = model.EmployeeId,
                    CreateAt = DateTime.Now
                };
                _context.ProjectActivity.Add(projectActivity);

                // Save all changes
                await _context.SaveChangesAsync();

                // Send email notification to employee
                //if (!string.IsNullOrEmpty(employee.EmailAddress))
                //{
                //    string[] emailList = new string[1] { employee.EmailAddress };
                //    string emailSubject = "NMOHUB - Project Request Rejected";
                //  //  string emailBody = $@"Dear {employee.FirstNames} {employee.LastName},\n\nYour project request '{fe.ProjectName}' has been rejected.\n\nReason: {model.Comments}\n\nIf you have any questions, please contact support.\n\nBest regards,\nNMOHUB Team";

                //    _mailer.SendEmail(emailList, "support@nmohub.com", emailSubject, emailBody, true);
                //}

                return Ok(new
                {
                    success = true,
                    message = "Service Activated successfully.",
                    projectId = model.ProjectId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while Activating Service.", error = ex.Message });
            }
        }



        [HttpGet]
        [Route("GetAllProjectRequests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllFERequests([FromQuery] int statusId = 0)
        {
            try
            {
                var query = _context.ForeignEntrepreneur.AsQueryable();
                if (statusId != 0)
                {
                    query = query.Where(p => p.StatusId == statusId && p.ServiceId == 9);
                }
                var fe = await query.ToListAsync();
                var employeeIds = fe.Select(p => p.EmployeeId).Distinct().ToList();
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

                // Pre-load all ForeignerStatus data to avoid concurrent DbContext operations
                var statusIds = fe.Select(p => p.StatusId).Distinct().ToList();
                var ForeignerStatuses = await _context.ForeignerStatus
                    .Where(ps => statusIds.Contains(ps.StatusId))
                    .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

                var result = fe.Select(p => {
                    employees.TryGetValue(p.EmployeeId, out var emp);
                    ForeignerStatuses.TryGetValue(p.StatusId, out var ForeignerStatus);

                    // Map CurrentStage and Timeframe to enum names
                    var currentStageEnum = (NMOHUM.API.Models.ForeignEntrepreneurEntities.BusinessStage?)p.CurrentStage;
                    var supportTimeframeEnum = (NMOHUM.API.Models.ForeignEntrepreneurEntities.SupportTimeframe?)p.Timeframe;

                    return new
                    {
                        p.ForeignEntrepreneurId,
                        p.ServiceId,
                        p.EmployeeId,
                        EmployeeFullName = emp != null ? $"{emp.FirstNames ?? ""} {emp.LastName ?? ""}".Trim() : null,
                        p.StatusId,
                        ForeignerStatus = ForeignerStatus,
                        CurrentStage = new
                        {
                            Value = p.CurrentStage,
                            Name = currentStageEnum.HasValue ? currentStageEnum.Value.ToString() : null
                        },
                        SupportTimeframe = new
                        {
                            Value = p.Timeframe,
                            Name = supportTimeframeEnum.HasValue ? supportTimeframeEnum.Value.ToString() : null
                        }
                    };
                }).ToList();
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ForeignEntrepreneur>> GetFERequest(int id)
        {
            var fe = await _context.ForeignEntrepreneur.FindAsync(id);
            return fe == null ? NotFound() : fe;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFERequestsByEmployeeId(int employeeId, [FromQuery] int statusId = 0)
        {
            var query = _context.ForeignEntrepreneur.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
            {
                query = query.Where(p => p.StatusId == statusId && p.ServiceId == 9);
            }
            var fe = await query.ToListAsync();

            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

            // Pre-load all ForeignerStatus data to avoid concurrent DbContext operations
            var statusIds = fe.Select(p => p.StatusId).Distinct().ToList();
            var ForeignerStatuses = await _context.ForeignerStatus
                .Where(ps => statusIds.Contains(ps.StatusId))
                .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

            var result = fe.Select(p => {
                ForeignerStatuses.TryGetValue(p.StatusId, out var ForeignerStatus);

                // Map CurrentStage and Timeframe to enum names
                var currentStageEnum = (NMOHUM.API.Models.ForeignEntrepreneurEntities.BusinessStage?)p.CurrentStage;
                var supportTimeframeEnum = (NMOHUM.API.Models.ForeignEntrepreneurEntities.SupportTimeframe?)p.Timeframe;

                return new
                {
                    p.ForeignEntrepreneurId,
                    p.ServiceId,
                    p.EmployeeId,
                    EmployeeFullName = employee != null ? $"{employee.FirstNames ?? ""} {employee.LastName ?? ""}".Trim() : null,
                    p.StatusId,
                    ForeignerStatus = ForeignerStatus,
                    CurrentStage = new
                    {
                        Value = p.CurrentStage,
                        Name = currentStageEnum.HasValue ? currentStageEnum.Value.ToString() : null
                    },
                    SupportTimeframe = new
                    {
                        Value = p.Timeframe,
                        Name = supportTimeframeEnum.HasValue ? supportTimeframeEnum.Value.ToString() : null
                    }
                };
            }).ToList();

            return Ok(new { success = true, data = result });
        }



        [HttpGet("details/{feId}")]
        public async Task<ActionResult<FEResponseVM>> GetFERequestDetailsbyFeId(int feId)
        {
            var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(p => p.ForeignEntrepreneurId == feId && p.ServiceId == 9);
            if (fe == null)
                return NotFound(new { success = false, message = "FE not found." });

            var doclist = await _context.Documents.Where(x => x.ProjectID == feId && x.ServiceId == 9).ToListAsync();

            var ForeignerStatus = await _context.ForeignerStatus.FirstOrDefaultAsync(p => p.StatusId == fe.StatusId);

            var employee = await _context.Employee.FirstOrDefaultAsync(p => p.EmployeeId == fe.EmployeeId);
            var userinfo = new RegisterUserVM
            {
                EmployeeId = employee.EmployeeId,
                EmailAddress = employee.EmailAddress,
                CountryId = employee.CountryId.HasValue ? employee.CountryId.Value : 0, // Explicitly handle nullable int
                FullName = employee.FirstNames + " " + employee.LastName,
                DateOfBirth = employee.DateOfBirth,
                MobileNumber = employee.MobileNumber,
                LinkedInProfileLink = employee.LinkedInProfileLink,

                // Fixing the CS0029 error by changing the type of `CountryName` to `string` in the `RegisterUserVM` class
                CountryName = (await _context.Countries.FirstOrDefaultAsync(x => x.Id == employee.CountryId))?.Name
            };
            var details = new FEResponseVM
            {
                requestModel = fe,
                documentlist = doclist,
                ForeignerStatus = ForeignerStatus,
                userRegisterModel = userinfo
            };

            return Ok(new { success = true, data = details });
        }


        // GET: api/ForeignEntrepreneur/DashboardCountersForAdmin
        [HttpGet("DashboardCountersForAdmin")]
        public async Task<IActionResult> DashboardCountersForAdmin()
        {
            // Get all project statuses
            var statuses = await _context.ForeignerStatus.ToListAsync();

            // Get counts of ForeignEntrepreneur grouped by StatusId
            var feCounts = await _context.ForeignEntrepreneur
                .GroupBy(fe => fe.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in feCounts on status.StatusId equals count.StatusId into sc
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

        // GET: api/ForeignEntrepreneur/DashboardCountersForEmp/{employeeId}
        [HttpGet("DashboardCountersForEmp/{employeeId}")]
        public async Task<IActionResult> DashboardCountersForEmp(int employeeId)
        {
            // Get all project statuses
            var statuses = await _context.ForeignerStatus.ToListAsync();

            // Get counts of ForeignEntrepreneur grouped by StatusId for the given employee
            var feCounts = await _context.ForeignEntrepreneur
                .Where(fe => fe.EmployeeId == employeeId)
                .GroupBy(fe => fe.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in feCounts on status.StatusId equals count.StatusId into sc
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


        // 2. GetAllForeignEntreprenuerRequestListForAdmin
        [HttpGet("GetAllForeignEntrepreneurRequestListForAdmin")]
        public async Task<IActionResult> GetAllForeignEntreprenuerRequestListForAdmin([FromQuery] int statusId = 0)
        {
            var query = _context.ForeignEntrepreneur.AsQueryable();
            if (statusId != 0)
                query = query.Where(x => x.StatusId == statusId);

            var list = await query
                .OrderByDescending(x => x.ForeignEntrepreneurId)
                .Select(x => new
                {
                    x.ForeignEntrepreneurId,
                    x.EmployeeId,
                    x.StatusId,
                    x.BusinessDescription,
                    x.CurrentStage,
                    x.Timeframe,
                    x.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        // 4. GetForeignEntreprenuerDetalisbyFEid
        [HttpGet("GetForeignEntreprenuerDetalisbyFEid/{feId}")]
        public async Task<IActionResult> GetForeignEntreprenuerDetalisbyFEid(int feId)
        {
            var fe = await _context.ForeignEntrepreneur.FirstOrDefaultAsync(x => x.ForeignEntrepreneurId == feId);
            if (fe == null)
                return NotFound(new { success = false, message = "Foreign Entrepreneur not found." });

            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == fe.EmployeeId);
            var docs = await _context.Documents.Where(d => d.ProjectID == feId && d.ServiceId == 9).ToListAsync();
            var status = await _context.ForeignerStatus.FirstOrDefaultAsync(s => s.StatusId == fe.StatusId);

            return Ok(new
            {
                fe,
                employee,
                documents = docs,
                status
            });
        }

        // 5. ForeignerVerifyEmail
        [HttpPost("ForeignerVerifyEmail")]
        public async Task<IActionResult> ForeignerVerifyEmail([FromBody] EmailVerifyModel model)
        {
            if (string.IsNullOrWhiteSpace(model.EmailAddress) || string.IsNullOrWhiteSpace(model.Otp))
                return BadRequest(new { success = false, message = "Email and OTP are required." });

            if (_otpStore.TryGetValue(model.EmailAddress, out var otp) && otp == model.Otp)
            {
                _otpStore.Remove(model.EmailAddress);
                return Ok(new { success = true, message = "Email verified successfully." });
            }
            return BadRequest(new { success = false, message = "Invalid OTP." });
        }

        // 6. RegisterandCreateFErequest
        [HttpPost("RegisterandCreateFErequest")]
        public async Task<IActionResult> RegisterandCreateFErequest([FromBody] ForeignEntrepreneurRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if user exists
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                user = new IdentityUser { UserName = request.Email, Email = request.Email };
                var result = await _userManager.CreateAsync(user, "Default@123"); // Use a secure password policy in production
                if (!result.Succeeded)
                    return BadRequest(new { success = false, message = "User registration failed.", errors = result.Errors });
            }

            // Create Foreign Entrepreneur request
            var entrepreneur = new ForeignEntrepreneur
            {
                EmployeeId = 0, // Set appropriately if you have employee mapping
                BusinessDescription = request.BusinessDescription,
                StatusId = 1,
                CurrentStage = (int)request.CurrentStage,
                OtherStageDetails = request.OtherStageDetails,
                OtherIndustryDetails = request.OtherIndustryDetails,
                Timeframe = (int)request.Timeframe,
                TargetIndustries = request.TargetIndustries != null
                    ? string.Join(",", request.TargetIndustries.Select(i => (int)i))
                    : null
            };

            _context.ForeignEntrepreneur.Add(entrepreneur);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Registration and request created successfully.", id = entrepreneur.ForeignEntrepreneurId });
        }
        // GET: api/projectactivity/project/5
        [HttpGet("{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ProjectActivity>>> GetProjectActivitiesByProject(int projectId, int serviceId)
        {
            return await _context.ProjectActivity
                .Where(p => p.ProjectId == projectId && p.ServiceId == serviceId)
                .OrderByDescending(p => p.CreateAt)
                .ToListAsync();
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportForeignEntrepreneurList([FromQuery] int statusId = 0)
        {
            var query = _context.ForeignEntrepreneur.AsQueryable();
            if (statusId != 0)
                query = query.Where(x => x.StatusId == statusId);

            var list = await query
                .OrderByDescending(x => x.ForeignEntrepreneurId)
                .Select(x => new
                {
                    x.ForeignEntrepreneurId, 
                    x.EmployeeId,
                    x.BusinessDescription,
                    x.StatusId,
                    x.CurrentStage,
                    x.Timeframe,
                    CreatedAt = x.CreatedAt.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            var employeeIds = list.Select(x => x.EmployeeId).Distinct().ToList();
            var employees = await _context.Employee
                .Where(e => employeeIds.Contains(e.EmployeeId))
                .ToDictionaryAsync(e => e.EmployeeId, e => $"{e.FirstNames ?? ""} {e.LastName ?? ""}".Trim());

            var csv = new StringBuilder();
            csv.AppendLine("ForeignEntrepreneurId,EmployeeId,EmployeeFullName,BusinessDescription,StatusId,CurrentStage,Timeframe,CreatedAt");
            foreach (var item in list)
            {
                var fullName = employees.TryGetValue(item.EmployeeId, out var name) ? name : "";
                csv.AppendLine($"{item.ForeignEntrepreneurId},{item.EmployeeId},\"{fullName}\",\"{item.BusinessDescription}\",{item.StatusId},{item.CurrentStage},{item.Timeframe},{item.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var fileName = $"FE_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            return File(bytes, "text/csv", fileName);
        }
    }



    /// <summary>
    /// Represents the models for supporting  a Foreign Entrepreneur request apis.
    /// </summary>

    public class FEResponseVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public ForeignEntrepreneur requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<Documents> documentlist { get; set; }
        public ForeignerStatus ForeignerStatus { get; set; }

    }
    public class ApproveFERequestModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
    }
    public class ForeignerFullUpdateModel
    {
        public ForeignEntrepreneur ForeignEntrepreneur { get; set; }
        public ForeignEntrepreneurRequestDto request { get; set; }
    }

    public class MissingInfoUpdateFEtModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
        public ForeignEntrepreneur ForeignEntrepreneur { get; set; }
        public List<DocumentData> documentlist { get; set; }
        public List<string> MissingInfo { get; set; } = new List<string>(); // List of missing information items>
    }

    public class MissingInfoFEtModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
        public List<string> MissingInfo { get; set; } = new List<string>(); // List of missing information items>
    }

    public class RejectFEtModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
    }
    public class UpdateModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
    }
    public class UpdateWithDocsModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
        public List<DocumentData> Documents { get; set; }
    }

}
