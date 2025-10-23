using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectActivityController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ProjectActivityController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/projectactivity
        [HttpGet]
        [Route("GetProjectActivities")]
        public async Task<ActionResult<IEnumerable<ProjectActivity>>> GetProjectActivities()
        {
            return await _context.ProjectActivity.ToListAsync();
        }

        // GET: api/projectactivity/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectActivity>> GetProjectActivity(int id)
        {
            var projectActivity = await _context.ProjectActivity.FindAsync(id);
            return projectActivity == null ? NotFound() : projectActivity;
        }

        // GET: api/projectactivity/project/5
        [HttpGet("project/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ProjectActivity>>> GetProjectActivitiesByProject(int projectId , int serviceId)
        {
            return await _context.ProjectActivity
                .Where(p => p.ProjectId == projectId && p.ServiceId==serviceId)
                .OrderByDescending(p => p.CreateAt)
                .ToListAsync();
        }

        // GET: api/projectactivity/projectid/5
        [HttpGet("projectid/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ProjectActivity>>> GetTimelineByProjectId(int projectId, int serviceId)
        {

            int StatusId = 0;

            if(serviceId == 1)
            {
                var projectRequest = _context.ProjectRequest.Where(x => x.ProjectID == projectId && x.ServiceId == serviceId).FirstOrDefault();
                if (projectRequest != null)
                {
                    StatusId = projectRequest.StatusId;
                }
            }

            if (serviceId == 2)
            {
                var projectRequest = _context.MvpProgram.Where(x => x.Id == projectId && x.ServiceId == serviceId).FirstOrDefault();
                if (projectRequest != null)
                {
                    StatusId = projectRequest.StatusId;
                }
            }
            if (serviceId == 3)
            {
                var projectRequest = _context.FeasibilityStudy.Where(x => x.Id == projectId && x.ServiceId == serviceId).FirstOrDefault();
                if (projectRequest != null)
                {
                    StatusId = projectRequest.StatusId;
                }
            }
            if (serviceId == 4)
            {
                var projectRequest = _context.PreAccelerator.Where(x => x.Id == projectId && x.ServiceId == serviceId).FirstOrDefault();
                if (projectRequest != null)
                {
                    StatusId = projectRequest.StatusId;
                }
            }
            var activities = await (from pa in _context.ProjectActivity
                                    join emp in _context.Set<Employee>() on pa.UpdatedBy equals emp.EmployeeId into empJoin
                                    from emp in empJoin.DefaultIfEmpty()
                                    join status in _context.ProjectStatus on pa.StatusId equals status.StatusId into statusJoin
                                    from status in statusJoin.DefaultIfEmpty()
                                    where pa.ProjectId == projectId && pa.ServiceId == serviceId
                                    orderby pa.CreateAt descending
                                    select new ProjectActivity
                                    {
                                        ActivityId = pa.ActivityId,
                                        ProjectId = pa.ProjectId,
                                        StatusId = pa.StatusId,
                                        Comments=pa.Comments,
                                        UpdatedBy = pa.UpdatedBy,
                                        CreateAt = pa.CreateAt,
                                        UserName = emp != null ? emp.LastName : null,
                                        StatusName = status != null ? status.StatusName : null
                                    }).ToListAsync();

            return Ok(new { success = true, data=activities, currentStatusId = StatusId, message = "Timeline retrieved successfully." });
           // return activities;
        }
        // POST: api/projectactivity
        [HttpPost]
        public async Task<ActionResult<ProjectActivity>> CreateProjectActivity(ProjectActivity projectActivity)
        {
            projectActivity.CreateAt = System.DateTime.Now;
            _context.ProjectActivity.Add(projectActivity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectActivity), new { id = projectActivity.ActivityId }, projectActivity);
        }

        // PUT: api/projectactivity/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectActivity(int id, ProjectActivity projectActivity)
        {
            if (id != projectActivity.ActivityId)
                return BadRequest();

            _context.Entry(projectActivity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectActivity.Any(e => e.ActivityId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/projectactivity/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectActivity(int id)
        {
            var projectActivity = await _context.ProjectActivity.FindAsync(id);
            if (projectActivity == null)
                return NotFound();

            _context.ProjectActivity.Remove(projectActivity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 