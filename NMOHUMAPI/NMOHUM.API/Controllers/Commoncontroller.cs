using Microsoft.AspNetCore.Mvc;
using NMOHUM.API.Models;
using System.Linq;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Commoncontroller : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public Commoncontroller(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        [HttpGet("AllLookups")]
        public IActionResult AllLookups()
        {
            var cities = _context.Cities.ToList();
            var countries = _context.Countries.ToList(); // Country DbSet is commented, so use Set<Country>()
            var projectArea = _context.ProjectArea.ToList();
            var projectPhase = _context.ProjectPhase.ToList();
            var supportneeds = _context.SupportNeeds.ToList();
            var result = new
            {
                Cities = cities,
                Countries = countries,
                ProjectAreas = projectArea,
                ProjectPhases = projectPhase,
                SupportNeeds = supportneeds
            };

            return Ok(result);
        }
    }
} 