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
    public class PartnerController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public PartnerController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/partner
        [HttpGet]
        [Route("GetPartners")]
        public async Task<ActionResult<IEnumerable<Partner>>> GetPartners()
        {
            return await _context.Partner.ToListAsync();
        }

        // GET: api/partner/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Partner>> GetPartner(int id)
        {
            var partner = await _context.Partner.FindAsync(id);
            return partner == null ? NotFound() : partner;
        }

        // GET: api/partner/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Partner>>> GetPartnersByProject(int projectId)
        {
            return await _context.Partner
                .Where(p => p.ProjectId == projectId)
                .ToListAsync();
        }

        // POST: api/partner
        [HttpPost]
        public async Task<ActionResult<Partner>> CreatePartner(Partner partner)
        {
            _context.Partner.Add(partner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPartner), new { id = partner.PartnerId }, partner);
        }

        // PUT: api/partner/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePartner(int id, Partner partner)
        {
            if (id != partner.PartnerId)
                return BadRequest();

            _context.Entry(partner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Partner.Any(e => e.PartnerId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/partner/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePartner(int id)
        {
            var partner = await _context.Partner.FindAsync(id);
            if (partner == null)
                return NotFound();

            _context.Partner.Remove(partner);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 