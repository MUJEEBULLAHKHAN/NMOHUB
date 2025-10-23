using Azure.Storage.Blobs.Models;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using static NMOHUM.API.Models.EventResource;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VirtualOfficeController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public VirtualOfficeController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllVOPackages")]
        public async Task<ActionResult<object>> GetAllVOPackages()
        {
            try
            {
                var _result = await _context.VOPackages.ToListAsync();
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }
            

        [HttpGet("{id}")]
        public async Task<ActionResult<VOPackages>> GetVOPackage(int id)
        {
            try
            {
                var _result = await _context.VOPackages.FindAsync(id);
                return Ok(new { success = true, data = _result });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<VOPackages>> Create(VOPackages VOPackages)
        {
            try
            {
                _context.VOPackages.Add(VOPackages);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, VOPackages VOPackages)
        {
            try
            {
                if (id != VOPackages.VOPackageId) return BadRequest();
                _context.Entry(VOPackages).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }
    }
}
