using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using NMOHUM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminPageController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        public AdminPageController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("GetAllAdminPages")]
        public async Task<ActionResult<IEnumerable<AdminPages>>> GetAllAdminPages()
        {
            var adminPages = await _context.AdminPages.ToListAsync();
            return Ok(new { message = "Admin Pages fetched successfully", data = adminPages });
        }

        // GET: api/Service/5
        [HttpGet("GetAdminPage/{id}")]
        public async Task<ActionResult<AdminPages>> GetAdminPage(int id)
        {
            var adminPages = await _context.AdminPages.FindAsync(id);

            if (adminPages == null)
                return NotFound(new { message = "Admin Pages not found" });

            return Ok(new { message = "Admin Pages fetched successfully", data = adminPages });
        }

        // POST: api/Service
        [HttpPost]
        public async Task<ActionResult<Service>> CreateAdminPage(AdminPages adminPages)
        {
            adminPages.CreatedAt = DateTime.UtcNow;
            _context.AdminPages.Add(adminPages);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdminPage), new { id = adminPages.AdminPageId }, new { message = "Admin Page created successfully", data = adminPages });
        }

        // PUT: api/Service/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdminPage(int id, AdminPages adminPages)
        {
            if (id != adminPages.AdminPageId)
                return BadRequest(new { message = "AdminPage ID mismatch" });

            var existing = await _context.AdminPages.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Admin Pages not found" });
            existing.UpdatedAt = DateTime.UtcNow;
            existing.AdminPageName = adminPages.AdminPageName;
            existing.AdminPageDescription = adminPages.AdminPageDescription;
            existing.AdminPageTitle = adminPages.AdminPageTitle;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin Pages updated successfully", data = existing });
        }

        // DELETE: api/Service/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var adminPages = await _context.AdminPages.FindAsync(id);
            if (adminPages == null)
                return NotFound(new { message = "Admin Pages not found" });

            _context.AdminPages.Remove(adminPages);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin Pages deleted successfully" });
        }
    }
}
