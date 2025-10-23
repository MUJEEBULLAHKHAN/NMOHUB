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
    public class ServicePhaseController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ServicePhaseController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }
      
        // GET: api/ServicePhase
        [HttpGet]
        [Route("GetServicePhases")]
        public async Task<ActionResult<IEnumerable<ServicePhase>>> GetServicePhases()
        {
            return await _context.ServicePhase.ToListAsync();
        }

        // GET: api/ServicePhase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServicePhase>> GetServicePhase(int id)
        {
            var servicePhase = await _context.ServicePhase.FindAsync(id);

            if (servicePhase == null)
            {
                return NotFound();
            }

            return servicePhase;
        }

        // POST: api/ServicePhase
        [HttpPost]
        public async Task<ActionResult<ServicePhase>> CreateServicePhase(ServicePhase servicePhase)
        {
            _context.ServicePhase.Add(servicePhase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServicePhase), new { id = servicePhase.Id }, servicePhase);
        }

        // PUT: api/ServicePhase/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServicePhase(int id, ServicePhase servicePhase)
        {
            if (id != servicePhase.Id)
            {
                return BadRequest();
            }

            _context.Entry(servicePhase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicePhaseExists(id))
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

        // DELETE: api/ServicePhase/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicePhase(int id)
        {
            var servicePhase = await _context.ServicePhase.FindAsync(id);
            if (servicePhase == null)
            {
                return NotFound();
            }

            _context.ServicePhase.Remove(servicePhase);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServicePhaseExists(int id)
        {
            return _context.ServicePhase.Any(e => e.Id == id);
        }
    }
} 