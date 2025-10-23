using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForeignerPackagesController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ForeignerPackagesController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/ForeignerPackages
        [HttpGet]
        [Route("GetAllForeignPackages")]
        public async Task<ActionResult<IEnumerable<ForeignPackage>>> GetAllForeignPackages()
        {
            var packages = await _context.ForeignPackage.ToListAsync();
            return Ok(new { message = "Foreign packages fetched successfully", data = packages });
        }

        // GET: api/ForeignerPackages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ForeignPackage>> GetForeignPackage(int id)
        {
            var package = await _context.ForeignPackage.FindAsync(id);

            if (package == null)
                return NotFound(new { message = "Foreign package not found" });

            return Ok(new { message = "Foreign package fetched successfully", data = package });
        }

        // POST: api/ForeignerPackages
        [HttpPost]
        public async Task<ActionResult<ForeignPackage>> CreateForeignPackage(ForeignPackage package)
        {
            try
            {
                _context.ForeignPackage.Add(package);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, });
            }
            catch (System.Exception ex)
            {

                return Ok(new { message = ex.Message, success = false});
            }
            
        }

        // PUT: api/ForeignerPackages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateForeignPackage(int id, ForeignPackage package)
        {
            try
            {
                if (id != package.Id)
                    return BadRequest(new { message = "Foreign package ID mismatch" });

                var existing = await _context.ForeignPackage.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Foreign package not found" });

                existing.PackageName = package.PackageName;
                existing.Description = package.Description;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, });
            }
            catch (System.Exception ex)
            {

                return Ok(new { message = ex.Message, success = false });
            }
            
        }

        // DELETE: api/ForeignerPackages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForeignPackage(int id)
        {
            var package = await _context.ForeignPackage.FindAsync(id);
            if (package == null)
                return NotFound(new { message = "Foreign package not found" });

            _context.ForeignPackage.Remove(package);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Foreign package deleted successfully" });
        }
    }
}