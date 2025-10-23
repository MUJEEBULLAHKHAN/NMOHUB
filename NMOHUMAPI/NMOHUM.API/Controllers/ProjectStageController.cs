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
    public class ProjectPhaseController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ProjectPhaseController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/ProjectPhase
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectPhase>>> GetProjectPhases()
        {
            return await _context.ProjectPhase.ToListAsync();
        }

        // GET: api/ProjectPhase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectPhase>> GetProjectPhase(int id)
        {
            var projectPhase = await _context.ProjectPhase.FindAsync(id);

            if (projectPhase == null)
            {
                return NotFound();
            }

            return projectPhase;
        }

        // POST: api/ProjectPhase
        [HttpPost]
        public async Task<ActionResult<ProjectPhase>> CreateProjectPhase(ProjectPhase projectphase)
        {
            _context.ProjectPhase.Add(projectphase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectPhase), new { id = projectphase.Id }, projectphase);
        }

        // PUT: api/ProjectPhase/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectPhase(int id, ProjectPhase projectphase)
        {
            if (id != projectphase.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectphase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectPhaseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ProjectPhase/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectPhase(int id)
        {
            var projectPhase = await _context.ProjectPhase.FindAsync(id);
            if (projectPhase == null)
            {
                return NotFound();
            }

            _context.ProjectPhase.Remove(projectPhase);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectPhaseExists(int id)
        {
            return _context.ProjectPhase.Any(e => e.Id == id);
        }
    }
} 