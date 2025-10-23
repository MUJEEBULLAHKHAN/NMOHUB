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
    public class ConfigureValueController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public ConfigureValueController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/configuration/GetConfigureValues
        [HttpGet]
        [Route("GetConfigureValues")]
        public async Task<ActionResult<IEnumerable<ConfigureValue>>> GetConfigureValues()
        {
            return await _context.ConfigureValue.ToListAsync();
        }
        // PUT: api/configuration/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConfigure(int id, ConfigureValue conf)
        {
            if (id != conf.ConfigurationId)
                return BadRequest();

            _context.Entry(conf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ConfigureValue.Any(e => e.ConfigurationId == id))
                    return NotFound();
                else
                    throw;
            }

            return Ok();
        }
    }
}
