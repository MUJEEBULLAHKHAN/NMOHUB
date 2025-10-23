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
    public class OtherProgramAttendController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public OtherProgramAttendController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/otherprogramattend

        [HttpGet]
        [Route("GetOtherProgramAttends")]
        public async Task<ActionResult<IEnumerable<OtherProgramAttend>>> GetOtherProgramAttends()
        {
            return await _context.OtherProgramAttend.ToListAsync();
        }

        // GET: api/otherprogramattend/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OtherProgramAttend>> GetOtherProgramAttend(int id)
        {
            var otherProgramAttend = await _context.OtherProgramAttend.FindAsync(id);
            return otherProgramAttend == null ? NotFound() : otherProgramAttend;
        }

        // GET: api/otherprogramattend/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<OtherProgramAttend>>> GetOtherProgramAttendsByProject(int projectId)
        {
            return await _context.OtherProgramAttend
                .Where(p => p.ProjectId == projectId)
                .ToListAsync();
        }

        // POST: api/otherprogramattend
        [HttpPost]
        public async Task<ActionResult<OtherProgramAttend>> CreateOtherProgramAttend(OtherProgramAttend otherProgramAttend)
        {
            _context.OtherProgramAttend.Add(otherProgramAttend);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOtherProgramAttend), new { id = otherProgramAttend.ProgramId }, otherProgramAttend);
        }

        // PUT: api/otherprogramattend/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOtherProgramAttend(int id, OtherProgramAttend otherProgramAttend)
        {
            if (id != otherProgramAttend.ProgramId)
                return BadRequest();

            _context.Entry(otherProgramAttend).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OtherProgramAttend.Any(e => e.ProgramId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/otherprogramattend/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOtherProgramAttend(int id)
        {
            var otherProgramAttend = await _context.OtherProgramAttend.FindAsync(id);
            if (otherProgramAttend == null)
                return NotFound();

            _context.OtherProgramAttend.Remove(otherProgramAttend);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 