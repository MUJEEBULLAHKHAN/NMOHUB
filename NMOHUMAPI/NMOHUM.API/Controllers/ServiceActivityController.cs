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
    public class ServiceActivityController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ServiceActivityController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }


        // GET: api/serviceactivity
        [HttpGet]
        [Route("GetServiceActivities")]
        public async Task<ActionResult<IEnumerable<ServiceActivity>>> GetServiceActivities()
        {
            return await _context.ServiceActivity.ToListAsync();
        }

        // GET: api/ServiceActivity/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceActivity>> GetServiceActivity(int id)
        {
            var ServiceActivity = await _context.ServiceActivity.FindAsync(id);
            return ServiceActivity == null ? NotFound() : ServiceActivity;
        }

        // GET: api/ServiceActivity/project/5
        [HttpGet("project/{serviceRequestId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ServiceActivity>>> GetProjectActivitiesByProject(int serviceRequestId, int serviceId)
        {
            return await _context.ServiceActivity
                .Where(p => p.ServiceRequestId == serviceRequestId && p.ServiceId == serviceId)
                .OrderByDescending(p => p.CreateAt)
                .ToListAsync();
        }

        // GET: api/ServiceActivity/serviceRequestId/5
        [HttpGet("GetTimelineByServiceRequestId/{serviceRequestId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ServiceActivity>>> GetTimelineByServiceRequestId(int serviceRequestId, int serviceId)
        {

            int StatusId = 0;

            
                var serviceRequest = _context.ServiceRequest.Where(x => x.Id == serviceRequestId && x.ServiceId == serviceId).FirstOrDefault();
                if (serviceRequest != null)
                {
                    StatusId = serviceRequest.StatusId;
                }
            


            var activities = await (from pa in _context.ServiceActivity
                                    join emp in _context.Set<Employee>() on pa.UpdatedBy equals emp.EmployeeId into empJoin
                                    from emp in empJoin.DefaultIfEmpty()
                                    join status in _context.ServiceStatus on pa.StatusId equals status.StatusId into statusJoin
                                    from status in statusJoin.DefaultIfEmpty()
                                    where pa.ServiceRequestId == serviceRequestId && pa.ServiceId == serviceId
                                    orderby pa.CreateAt descending
                                    select new ServiceActivity
                                    {
                                        ActivityId = pa.ActivityId,
                                        ServiceRequestId = pa.ServiceRequestId,
                                        StatusId = pa.StatusId,
                                        Comments = pa.Comments,
                                        UpdatedBy = pa.UpdatedBy,
                                        CreateAt = pa.CreateAt,
                                        UserName = emp != null ? emp.LastName : null,
                                        StatusName = status != null ? status.StatusName : null
                                    }).ToListAsync();

            return Ok(new { success = true, data = activities, currentStatusId = StatusId, message = "service activtiy fetched successfully." });
            // return activities;
        }
        // POST: api/ServiceActivity
        [HttpPost]
        public async Task<ActionResult<ServiceActivity>> CreateServiceActivity(ServiceActivity ServiceActivity)
        {
            ServiceActivity.CreateAt = System.DateTime.Now;
            _context.ServiceActivity.Add(ServiceActivity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceActivity), new { id = ServiceActivity.ActivityId }, ServiceActivity);
        }

        // PUT: api/ServiceActivity/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceActivity(int id, ServiceActivity ServiceActivity)
        {
            if (id != ServiceActivity.ActivityId)
                return BadRequest();

            _context.Entry(ServiceActivity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ServiceActivity.Any(e => e.ActivityId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/ServiceActivity/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceActivity(int id)
        {
            var ServiceActivity = await _context.ServiceActivity.FindAsync(id);
            if (ServiceActivity == null)
                return NotFound();

            _context.ServiceActivity.Remove(ServiceActivity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
