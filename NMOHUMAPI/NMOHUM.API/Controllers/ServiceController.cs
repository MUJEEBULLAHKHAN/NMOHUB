using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMOHUM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ServiceController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/Service
        [HttpGet]
        [Route("GetAllServices")]
        public async Task<ActionResult<IEnumerable<Service>>> GetAllServices()
        {
            var services = await _context.Service.ToListAsync();
            return Ok(new { message = "Services fetched successfully", data = services });
        }

        // GET: api/Service/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var service = await _context.Service.FindAsync(id);

            if (service == null)
                return NotFound(new { message = "Service not found" });

            return Ok(new { message = "Service fetched successfully", data = service });
        }

        // POST: api/Service
        [HttpPost]
        public async Task<ActionResult<Service>> CreateService(Service service)
        {
            _context.Service.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, new { message = "Service created successfully", data = service });
        }

        // PUT: api/Service/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, Service service)
        {
            if (id != service.Id)
                return BadRequest(new { message = "Service ID mismatch" });

            var existing = await _context.Service.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Service not found" });

            existing.Name = service.Name;
            existing.Description = service.Description;
            existing.HasPackages = service.HasPackages;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Service updated successfully", data = existing });
        }

        // DELETE: api/Service/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Service.FindAsync(id);
            if (service == null)
                return NotFound(new { message = "Service not found" });

            _context.Service.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service deleted successfully" });
        }
    }
}
