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
    public class EntrepreneurController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public EntrepreneurController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/entrepreneur
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entrepreneur>>> GetEntrepreneurs()
        {
            return await _context.Entrepreneur.ToListAsync();
        }

        // GET: api/entrepreneur/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entrepreneur>> GetEntrepreneur(int id)
        {
            var entrepreneur = await _context.Entrepreneur.FindAsync(id);
            return entrepreneur == null ? NotFound() : entrepreneur;
        }

        // POST: api/entrepreneur
        [HttpPost]
        public async Task<ActionResult<Entrepreneur>> CreateEntrepreneur(Entrepreneur entrepreneur)
        {
            _context.Entrepreneur.Add(entrepreneur);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntrepreneur), new { id = entrepreneur.EntrepreneurId }, entrepreneur);
        }

        // PUT: api/entrepreneur/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntrepreneur(int id, Entrepreneur entrepreneur)
        {
            if (id != entrepreneur.EntrepreneurId)
                return BadRequest();

            _context.Entry(entrepreneur).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Entrepreneur.Any(e => e.EntrepreneurId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/entrepreneur/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntrepreneur(int id)
        {
            var entrepreneur = await _context.Entrepreneur.FindAsync(id);
            if (entrepreneur == null)
                return NotFound();

            _context.Entrepreneur.Remove(entrepreneur);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
