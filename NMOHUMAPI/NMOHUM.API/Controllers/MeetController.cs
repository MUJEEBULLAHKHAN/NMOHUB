using GoogleMeetAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetController : ControllerBase
    {
        private readonly GoogleMeetService _meetService;

        public MeetController(GoogleMeetService meetService)
        {
            _meetService = meetService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateMeetLink([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var link = await _meetService.CreateMeetLinkAsync(email);
            return Ok(new { meetLink = link });
        }
    }
}
