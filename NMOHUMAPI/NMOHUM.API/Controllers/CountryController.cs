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
    public class CountryController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public CountryController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllCountries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetAllCountries() =>
            await _context.Country.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            var country = await _context.Country.FindAsync(id);
            return country == null ? NotFound() : country;
        }

        [HttpPost]
        public async Task<ActionResult<Country>> Create(Country country)
        {
            _context.Country.Add(country);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCountry), new { id = country.Id }, country);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Country country)
        {
            if (id != country.Id) return BadRequest();
            _context.Entry(country).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var country = await _context.Country.FindAsync(id);
            if (country == null) return NotFound();
            _context.Country.Remove(country);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 