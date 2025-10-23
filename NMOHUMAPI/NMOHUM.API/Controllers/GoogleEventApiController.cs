using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMOHUM.API.Services;
using System;
using System.Threading.Tasks;
using static NMOHUM.API.Models.EventResource;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleEventAPIController : ControllerBase
    {
        private readonly ITokenService tokenService;
        private readonly IEventService eventService;

        public GoogleEventAPIController(ITokenService tokenService , IEventService eventService)
        {
            this.tokenService = tokenService;
            this.eventService = eventService;
        }

        [HttpGet("token")]
        public async Task<string> GetAccessTokenAsync()
        {
            return await this.tokenService.GetAccessTokenAsync();
        }

        [HttpPost("event/{eventId}")]
        public async Task<EventResponse> GetEventByIdAsync(string eventId)
        {
            return await this.eventService.GetEventByIdAsync(eventId);
        }

        [HttpPost("events")]
        public async Task<PagedEventResponse> GetEventsAsync(DateTime minTime, DateTime maxTime)
        {
            return await this.eventService.GetEventsAsync(minTime, maxTime);
        }

        [HttpPost("event/create")]
        public async Task<EventResponse> CreateEventAsync(EventRequest eventRequest)
        {
            return await this.eventService.CreateEventAsync(eventRequest);
        }

        [HttpPost("event/update")]
        public async Task<EventResponse> UpdateEventAsync(string eventId, EventRequest eventRequest)
        {
            return await this.eventService.UpdateEventAsync(eventId, eventRequest);
        }

        [HttpPost("event/{eventId}/delete")]
        public async Task DeleteEventAsync(string eventId)
        {
            await this.eventService.DeleteEventAsync(eventId);
        }

    }
}
