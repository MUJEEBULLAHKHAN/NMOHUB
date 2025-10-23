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
    public class CityController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public CityController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllCities")]
        public async Task<ActionResult<IEnumerable<City>>> GetAllCities() 
         // =>  await _context.Cities.ToListAsync();
       { 
            var cities = await _context.Cities.ToListAsync();
        Console.WriteLine("✅ Retrieved cities count: " + cities.Count);
        return cities;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            return city == null ? NotFound() : city;
        }

        [HttpPost]
        public async Task<ActionResult<City>> Create(City city)
        {
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCity), new { id = city.Id }, city);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, City city)
        {
            if (id != city.Id) return BadRequest();
            _context.Entry(city).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null) return NotFound();
            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
