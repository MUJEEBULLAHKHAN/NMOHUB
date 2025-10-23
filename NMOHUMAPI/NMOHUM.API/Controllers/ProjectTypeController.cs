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
    public class ProjectAreaController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ProjectAreaController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/ProjectArea
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectArea>>> GetProjectAreas()
        {
            return await _context.ProjectArea.ToListAsync();
        }

        // GET: api/ProjectArea/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectArea>> GetProjectArea(int id)
        {
            var ProjectArea = await _context.ProjectArea.FindAsync(id);

            if (ProjectArea == null)
            {
                return NotFound();
            }

            return ProjectArea;
        }

        // POST: api/ProjectArea
        [HttpPost]
        public async Task<ActionResult<ProjectArea>> CreateProjectArea(ProjectArea ProjectArea)
        {
            _context.ProjectArea.Add(ProjectArea);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectArea), new { id = ProjectArea.Id }, ProjectArea);
        }

        // PUT: api/ProjectArea/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectArea(int id, ProjectArea ProjectArea)
        {
            if (id != ProjectArea.Id)
            {
                return BadRequest();
            }

            _context.Entry(ProjectArea).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectAreaExists(id))
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

        // DELETE: api/ProjectArea/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectArea(int id)
        {
            var ProjectArea = await _context.ProjectArea.FindAsync(id);
            if (ProjectArea == null)
            {
                return NotFound();
            }

            _context.ProjectArea.Remove(ProjectArea);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectAreaExists(int id)
        {
            return _context.ProjectArea.Any(e => e.Id == id);
        }
    }
} 