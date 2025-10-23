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
    public class SupportNeedsController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public SupportNeedsController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllSupportNeeds")]
        public async Task<ActionResult<IEnumerable<SupportNeeds>>> GetAllSupportNeeds() =>
            await _context.SupportNeeds.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<SupportNeeds>> GetSupportNeeds(int id)
        {
            var supportNeeds = await _context.SupportNeeds.FindAsync(id);
            return supportNeeds == null ? NotFound() : supportNeeds;
        }

        [HttpPost]
        public async Task<ActionResult<SupportNeeds>> Create(SupportNeeds supportNeeds)
        {
            _context.SupportNeeds.Add(supportNeeds);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSupportNeeds), new { id = supportNeeds.SupportNeedId }, supportNeeds);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SupportNeeds supportNeeds)
        {
            if (id != supportNeeds.SupportNeedId) return BadRequest();
            _context.Entry(supportNeeds).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var supportNeeds = await _context.SupportNeeds.FindAsync(id);
            if (supportNeeds == null) return NotFound();
            _context.SupportNeeds.Remove(supportNeeds);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 