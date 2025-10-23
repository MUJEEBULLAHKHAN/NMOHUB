using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Twilio.TwiML.Messaging;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public DashboardController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/GetAllDashboardCounter
        [HttpGet]
        [Route("GetAllDashboardCounter")]
        public async Task<IActionResult> GetAllDashboardCounter()
        {
            // Get all project status
            var statuses = await _context.ProjectStatus.ToListAsync();
            // Get counts of ProjectRequest grouped by StatusId
            var projectCounts = await _context.ProjectRequest
                .GroupBy(pr => pr.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in projectCounts on status.StatusId equals count.StatusId into sc
                         from count in sc.DefaultIfEmpty()
                         select new {
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
            var projectCounts = await _context.ProjectRequest
                .Where(pr => pr.EmployeeId == employeeId)
                .GroupBy(pr => pr.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Join status info with counts
            var result = from status in statuses
                         join count in projectCounts on status.StatusId equals count.StatusId into sc
                         from count in sc.DefaultIfEmpty()
                         select new {
                             StatusId = status.StatusId,
                             StatusName = status.StatusName,
                             Description = status.Description,
                             Count = count != null ? count.Count : 0
                         };

            return Ok(new { success = true, data = result });
        }

        // GET: api/dashboard/GetAllServicesDashboardCounterGroupByStatusId
        [HttpGet]
        [Route("GetAllServicesDashboardCounterGroupByStatusId")]
        public async Task<IActionResult> GetAllServicesDashboardCounterGroupByStatusId()
        {
            // Get all project statuses
            var statuses = await _context.ProjectStatus.ToListAsync();

            // Get counts grouped by StatusId from each service
            var projectRequestCounts = await _context.ProjectRequest
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var feasibilityStudyCounts = await _context.FeasibilityStudy
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var mvpProgramCounts = await _context.MvpProgram
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var preAcceleratorCounts = await _context.PreAccelerator
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Combine all counts
            var allCounts = projectRequestCounts
                .Concat(feasibilityStudyCounts)
                .Concat(mvpProgramCounts)
                .Concat(preAcceleratorCounts)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Sum(x => x.Count) })
                .ToList();

            // Join with status info
            var result = from status in statuses
                         join count in allCounts on status.StatusId equals count.StatusId into sc
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

        // GET: api/dashboard/GetAllServicesDashboardCounterGroupByStatusIdAndEmployeeId/{employeeId}
        [HttpGet]
        [Route("GetAllServicesDashboardCounterGroupByStatusIdAndEmployeeId/{employeeId}")]
        public async Task<IActionResult> GetAllServicesDashboardCounterGroupByStatusIdAndEmployeeId(int employeeId)
        {
            // Get all project statuses
            var statuses = await _context.ProjectStatus.ToListAsync();

            // Get counts grouped by StatusId from each service, filtered by employeeId
            var projectRequestCounts = await _context.ProjectRequest
                .Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var feasibilityStudyCounts = await _context.FeasibilityStudy
                .Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var mvpProgramCounts = await _context.MvpProgram
                .Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var preAcceleratorCounts = await _context.PreAccelerator
                .Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Combine all counts
            var allCounts = projectRequestCounts
                .Concat(feasibilityStudyCounts)
                .Concat(mvpProgramCounts)
                .Concat(preAcceleratorCounts)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Sum(x => x.Count) })
                .ToList();

            // Join with status info
            var result = from status in statuses
                         join count in allCounts on status.StatusId equals count.StatusId into sc
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



        // GET: api/GetAllServicesList?statusId=0
        [HttpGet]
        [Route("GetAllServicesList")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllServicesList([FromQuery] int statusId = 0)
        {
            try
            {
                // ProjectRequest
                var projectRequestQuery = _context.ProjectRequest.AsQueryable();
                if (statusId != 0)
                    projectRequestQuery = projectRequestQuery.Where(p => p.StatusId == statusId);
                var projectRequests = await projectRequestQuery.ToListAsync();

                // FeasibilityStudy
                var feasibilityStudyQuery = _context.FeasibilityStudy.AsQueryable();
                if (statusId != 0)
                    feasibilityStudyQuery = feasibilityStudyQuery.Where(f => f.StatusId == statusId);
                var feasibilityStudies = await feasibilityStudyQuery.ToListAsync();

                // MvpProgram
                var mvpProgramQuery = _context.MvpProgram.AsQueryable();
                if (statusId != 0)
                    mvpProgramQuery = mvpProgramQuery.Where(m => m.StatusId == statusId);
                var mvpPrograms = await mvpProgramQuery.ToListAsync();

                // PreAccelerator
                var preAcceleratorQuery = _context.PreAccelerator.AsQueryable();
                if (statusId != 0)
                    preAcceleratorQuery = preAcceleratorQuery.Where(p => p.StatusId == statusId);
                var preAccelerators = await preAcceleratorQuery.ToListAsync();

                // Collect all employeeIds
                var employeeIds = projectRequests.Select(p => p.EmployeeId)
                    .Concat(feasibilityStudies.Select(f => f.EmployeeId))
                    .Concat(mvpPrograms.Select(m => m.EmployeeId))
                    .Concat(preAccelerators.Select(p => p.EmployeeId))
                    .Distinct()
                    .ToList();

                var employees = _context.Employee.AsEnumerable()
                    .Where(e => employeeIds.Contains(e.EmployeeId))
                    .ToDictionary(e => e.EmployeeId, e => e);

                // Collect all statusIds
                var statusIds = projectRequests.Select(p => p.StatusId)
                    .Concat(feasibilityStudies.Select(f => f.StatusId))
                    .Concat(mvpPrograms.Select(m => m.StatusId))
                    .Concat(preAccelerators.Select(p => p.StatusId))
                    .Distinct()
                    .ToList();

                var projectStatuses = await _context.ProjectStatus
                    .Where(ps => statusIds.Contains(ps.StatusId))
                    .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

                // Project all results to a common type
                var result = new List<object>();

                result.AddRange(projectRequests.Select(p => {
                    employees.TryGetValue(p.EmployeeId, out var emp);
                    projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                    return new
                    {
                        ServiceType = "Incubator Program",
                        p.ProjectID,
                        p.ServiceId,
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
                        ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                    };
                }));

                result.AddRange(feasibilityStudies.Select(f => {
                    employees.TryGetValue(f.EmployeeId, out var emp);
                    projectStatuses.TryGetValue(f.StatusId, out var projectStatus);
                    return new
                    {
                        ServiceType = "Feasibility Study",
                        ProjectID = f.Id,
                        f.ServiceId,
                        f.EmployeeId,
                        EmployeeFullName = emp != null ? $"{emp.FirstNames ?? ""} {emp.LastName ?? ""}".Trim() : null,
                        ProjectName = f.ProjectName,
                        PackageId = f.PackageId,
                        CreateAt = (DateTime?)null,
                        f.StatusId,
                        Duration = (int?)null,
                        f.ProgramStarted,
                        f.ProgramEnd,
                        f.BriefDescription,
                        f.ProjectPhaseId,
                        f.ProjectAreaID,
                        IsEvaluate = (bool?)null,
                        f.AggregateScore,
                        f.CurrentPhaseId,
                        f.IsPartnerAvailable,
                        f.AlreadyParticipatedProgram,
                        f.IsWrittenBusinessPlan,
                        f.HopeAchieve,
                        f.SupportsNeeds,
                        ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                    };
                }));

                result.AddRange(mvpPrograms.Select(m => {
                    employees.TryGetValue(m.EmployeeId, out var emp);
                    projectStatuses.TryGetValue(m.StatusId, out var projectStatus);
                    return new
                    {
                        ServiceType = "Mvp Program",
                        ProjectID = m.Id,
                        m.ServiceId,
                        m.EmployeeId,
                        EmployeeFullName = emp != null ? $"{emp.FirstNames ?? ""} {emp.LastName ?? ""}".Trim() : null,
                        ProjectName = m.ProjectName,
                        PackageId = m.PackageId,
                        CreateAt = (DateTime?)null,
                        m.StatusId,
                        Duration = (int?)null,
                        m.ProgramStarted,
                        m.ProgramEnd,
                        m.BriefDescription,
                        m.ProjectPhaseId,
                        m.ProjectAreaID,
                        IsEvaluate = (bool?)null,
                        m.AggregateScore,
                        m.CurrentPhaseId,
                        m.IsPartnerAvailable,
                        m.AlreadyParticipatedProgram,
                        m.IsWrittenBusinessPlan,
                        m.HopeAchieve,
                        m.SupportsNeeds,
                        ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                    };
                }));

                result.AddRange(preAccelerators.Select(p => {
                    employees.TryGetValue(p.EmployeeId, out var emp);
                    projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                    return new
                    {
                        ServiceType = "Pre Accelerator",
                        ProjectID = p.Id,
                        p.ServiceId,
                        p.EmployeeId,
                        EmployeeFullName = emp != null ? $"{emp.FirstNames ?? ""} {emp.LastName ?? ""}".Trim() : null,
                        ProjectName = (string)null,
                        PackageId = p.PackageId,
                        CreateAt = (DateTime?)null,
                        p.StatusId,
                        Duration = (int?)null,
                        p.ProgramStarted,
                        p.ProgramEnd,
                        p.BriefDescription,
                        p.ProjectPhaseId,
                        p.ProjectAreaID,
                        IsEvaluate = (bool?)null,
                        p.AggregateScore,
                        p.CurrentPhaseId,
                        p.IsPartnerAvailable,
                        p.AlreadyParticipatedProgram,
                        p.IsWrittenBusinessPlan,
                        p.HopeAchieve,
                        p.SupportsNeeds,
                        ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                    };
                }));

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/GetAllServiceListByEmployeeId/employee/5?statusId=0
        [HttpGet("GetAllServiceListByEmployeeId/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllServiceListByEmployeeId(int employeeId, [FromQuery] int statusId = 0)
        {
            // ProjectRequest
            var projectRequestQuery = _context.ProjectRequest.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
                projectRequestQuery = projectRequestQuery.Where(p => p.StatusId == statusId);
            var projectRequests = await projectRequestQuery.ToListAsync();

            // FeasibilityStudy
            var feasibilityStudyQuery = _context.FeasibilityStudy.Where(f => f.EmployeeId == employeeId);
            if (statusId != 0)
                feasibilityStudyQuery = feasibilityStudyQuery.Where(f => f.StatusId == statusId);
            var feasibilityStudies = await feasibilityStudyQuery.ToListAsync();

            // MvpProgram
            var mvpProgramQuery = _context.MvpProgram.Where(m => m.EmployeeId == employeeId);
            if (statusId != 0)
                mvpProgramQuery = mvpProgramQuery.Where(m => m.StatusId == statusId);
            var mvpPrograms = await mvpProgramQuery.ToListAsync();

            // PreAccelerator
            var preAcceleratorQuery = _context.PreAccelerator.Where(p => p.EmployeeId == employeeId);
            if (statusId != 0)
                preAcceleratorQuery = preAcceleratorQuery.Where(p => p.StatusId == statusId);
            var preAccelerators = await preAcceleratorQuery.ToListAsync();

            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

            // Collect all statusIds
            var statusIds = projectRequests.Select(p => p.StatusId)
                .Concat(feasibilityStudies.Select(f => f.StatusId))
                .Concat(mvpPrograms.Select(m => m.StatusId))
                .Concat(preAccelerators.Select(p => p.StatusId))
                .Distinct()
                .ToList();

            var projectStatuses = await _context.ProjectStatus
                .Where(ps => statusIds.Contains(ps.StatusId))
                .ToDictionaryAsync(ps => ps.StatusId, ps => ps);

            var result = new List<object>();

            result.AddRange(projectRequests.Select(p => {
                projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                return new
                {
                    ServiceType = "Incubator Program",
                    p.ProjectID,
                    p.ServiceId,
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
                    ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                };
            }));

            result.AddRange(feasibilityStudies.Select(f => {
                projectStatuses.TryGetValue(f.StatusId, out var projectStatus);
                return new
                {
                    ServiceType = "Feasibility Study",
                    ProjectID = f.Id,
                    f.ServiceId,
                    f.EmployeeId,
                    EmployeeFullName = employee != null ? $"{employee.FirstNames ?? ""} {employee.LastName ?? ""}".Trim() : null,
                    ProjectName = f.ProjectName,
                    PackageId = f.PackageId,
                    CreateAt = (DateTime?)null,
                    f.StatusId,
                    Duration = (int?)null,
                    f.ProgramStarted,
                    f.ProgramEnd,
                    f.BriefDescription,
                    f.ProjectPhaseId,
                    f.ProjectAreaID,
                    IsEvaluate = (bool?)null,
                    f.AggregateScore,
                    f.CurrentPhaseId,
                    f.IsPartnerAvailable,
                    f.AlreadyParticipatedProgram,
                    f.IsWrittenBusinessPlan,
                    f.HopeAchieve,
                    f.SupportsNeeds,
                    ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                };
            }));

            result.AddRange(mvpPrograms.Select(m => {
                projectStatuses.TryGetValue(m.StatusId, out var projectStatus);
                return new
                {
                    ServiceType = "Mvp Program",
                    ProjectID = m.Id,
                    m.ServiceId,
                    m.EmployeeId,
                    EmployeeFullName = employee != null ? $"{employee.FirstNames ?? ""} {employee.LastName ?? ""}".Trim() : null,
                    ProjectName = m.ProjectName,
                    PackageId = m.PackageId,
                    CreateAt = (DateTime?)null,
                    m.StatusId,
                    Duration = (int?)null,
                    m.ProgramStarted,
                    m.ProgramEnd,
                    m.BriefDescription,
                    m.ProjectPhaseId,
                    m.ProjectAreaID,
                    IsEvaluate = (bool?)null,
                    m.AggregateScore,
                    m.CurrentPhaseId,
                    m.IsPartnerAvailable,
                    m.AlreadyParticipatedProgram,
                    m.IsWrittenBusinessPlan,
                    m.HopeAchieve,
                    m.SupportsNeeds,
                    ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                };
            }));

            result.AddRange(preAccelerators.Select(p => {
                projectStatuses.TryGetValue(p.StatusId, out var projectStatus);
                return new
                {
                    ServiceType = "Pre Accelerator",
                    ProjectID = p.Id,
                    p.ServiceId,
                    p.EmployeeId,
                    EmployeeFullName = employee != null ? $"{employee.FirstNames ?? ""} {employee.LastName ?? ""}".Trim() : null,
                    ProjectName = (string)null,
                    PackageId = p.PackageId,
                    CreateAt = (DateTime?)null,
                    p.StatusId,
                    Duration = (int?)null,
                    p.ProgramStarted,
                    p.ProgramEnd,
                    p.BriefDescription,
                    p.ProjectPhaseId,
                    p.ProjectAreaID,
                    IsEvaluate = (bool?)null,
                    p.AggregateScore,
                    p.CurrentPhaseId,
                    p.IsPartnerAvailable,
                    p.AlreadyParticipatedProgram,
                    p.IsWrittenBusinessPlan,
                    p.HopeAchieve,
                    p.SupportsNeeds,
                    ProjectStatus = projectStatus == null ? "" : projectStatus.StatusName
                };
            }));

            return Ok(new { success = true, data = result });
        }




        // GET: api/dashboard/GetAllServicesRequestDashboardCounterGroupByStatusId
        [HttpGet]
        [Route("GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId/{employeeId}")]
        public async Task<IActionResult> GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId(int employeeId)
        {
            // Get all project statuses
            var statuses = await _context.ProjectStatus.ToListAsync();

            // Get counts grouped by StatusId from each service
            var projectRequestCounts = await _context.ProjectRequest.Where(x=> x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var feasibilityStudyCounts = await _context.FeasibilityStudy.Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var mvpProgramCounts = await _context.MvpProgram.Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var preAcceleratorCounts = await _context.PreAccelerator.Where(x => x.EmployeeId == employeeId)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Combine all counts
            var allCounts = projectRequestCounts
                .Concat(feasibilityStudyCounts)
                .Concat(mvpProgramCounts)
                .Concat(preAcceleratorCounts)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Sum(x => x.Count) })
                .ToList();

            // Join with status info
            var result = from status in statuses
                         join count in allCounts on status.StatusId equals count.StatusId into sc
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

        // GET: api/dashboard/GetAllServicesRequestDashboardCounterGroupByStatusId
        [HttpGet]
        [Route("GetAllServicesRequestDashboardCounterGroupByStatusId")]
        public async Task<IActionResult> GetAllServicesRequestDashboardCounterGroupByStatusId()
        {
            // Get all project statuses
            var statuses = await _context.ProjectStatus.ToListAsync();

            // Get counts grouped by StatusId from each service
            var projectRequestCounts = await _context.ProjectRequest
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var feasibilityStudyCounts = await _context.FeasibilityStudy
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var mvpProgramCounts = await _context.MvpProgram
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            var preAcceleratorCounts = await _context.PreAccelerator
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Count() })
                .ToListAsync();

            // Combine all counts
            var allCounts = projectRequestCounts
                .Concat(feasibilityStudyCounts)
                .Concat(mvpProgramCounts)
                .Concat(preAcceleratorCounts)
                .GroupBy(x => x.StatusId)
                .Select(g => new { StatusId = g.Key, Count = g.Sum(x => x.Count) })
                .ToList();

            // Join with status info
            var result = from status in statuses
                         join count in allCounts on status.StatusId equals count.StatusId into sc
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


        // GET: api/paymentactivity/project/{projectId}
        [HttpGet("FechEmployeeId/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<PaymentActivity>>> GetEmployeeIdByProjectId(int projectId, int serviceId)
        {

            if (serviceId == 1)
            {
                var preData = _context.ProjectRequest.Where(x => x.ProjectID == projectId).FirstOrDefault();
                if (preData != null)
                {
                    var employee = _context.Employee.Where(x => x.EmployeeId == preData.EmployeeId).FirstOrDefault();

                    if (employee != null)
                    {
                        return Ok(new { success = true, data = employee.EmployeeId });
                    }
                }
            }

            if (serviceId == 2)
            {
                var preData = _context.MvpProgram.Where(x => x.Id == projectId).FirstOrDefault();
                if (preData != null)
                {
                    var employee = _context.Employee.Where(x => x.EmployeeId == preData.EmployeeId).FirstOrDefault();

                    if (employee != null)
                    {
                        return Ok(new { success = true, data = employee.EmployeeId });
                    }
                }
            }

            if (serviceId == 3)
            {
                var preData = _context.FeasibilityStudy.Where(x => x.Id == projectId).FirstOrDefault();
                if (preData != null)
                {
                    var employee = _context.Employee.Where(x => x.EmployeeId == preData.EmployeeId).FirstOrDefault();

                    if (employee != null)
                    {
                        return Ok(new { success = true, data = employee.EmployeeId });
                    }
                }
            }

            if (serviceId == 4)
            {
                var preData = _context.PreAccelerator.Where(x => x.Id == projectId).FirstOrDefault();
                if(preData != null)
                {
                    var employee = _context.Employee.Where(x => x.EmployeeId == preData.EmployeeId).FirstOrDefault();
                    
                    if(employee!= null)
                    {
                        return Ok(new { success = true, data = employee.EmployeeId });
                    }
                }
            }

            return Ok(new { success = false, message = "Record not found"});

        }
               
    }
}
