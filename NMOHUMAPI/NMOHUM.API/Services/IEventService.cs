using System;
using System.Threading.Tasks;
using static NMOHUM.API.Models.EventResource;

namespace NMOHUM.API.Services
{
    public interface IEventService
    {
        Task<EventResponse> CreateEventAsync(EventRequest eventRequest);
        Task DeleteEventAsync(string eventId);
        Task<EventResponse> GetEventByIdAsync(string eventId);
        Task<PagedEventResponse> GetEventsAsync(DateTime minTime, DateTime maxTime);
        Task<EventResponse> UpdateEventAsync(string eventId, EventRequest eventRequest);
        Task<EventResponse> CreateGoogleMeeting(string _email, string name, DateTime startTime, DateTime endTime);
    }
}
