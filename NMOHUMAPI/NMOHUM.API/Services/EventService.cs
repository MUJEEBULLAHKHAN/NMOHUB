using RestSharp;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static NMOHUM.API.Models.EventResource;

namespace NMOHUM.API.Services
{
    public class EventService : IEventService
    {
        private readonly IRestClient restClient;
        private readonly ITokenService tokenService;

        public EventService(ITokenService tokenService)
        {
            this.restClient = new RestClient("https://www.googleapis.com/calendar/v3/calendars/");
            this.tokenService = tokenService;
        }


        public async Task<EventResponse> CreateEventAsync(EventRequest eventRequest)
        {
            var restRequest = new RestRequest("primary/events");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddQueryParameter("conferenceDataVersion", "1");
            restRequest.AddQueryParameter("sendUpdates", "all");
            restRequest.AddJsonBody(eventRequest);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            var response = await this.restClient.PostAsync<EventResponse>(restRequest);
            return response;
        }

        public async Task DeleteEventAsync(string eventId)
        {
            var restRequest = new RestRequest($"primary/events/{eventId}");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            var response = await this.restClient.DeleteAsync(restRequest);
        }

        public async Task<EventResponse> GetEventByIdAsync(string eventId)
        {
            var restRequest = new RestRequest($"primary/events/{eventId}");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            var response = await this.restClient.GetAsync<EventResponse>(restRequest);
            return response;
        }

        public async Task<PagedEventResponse> GetEventsAsync(DateTime minTime, DateTime maxTime)
        {
            var restRequest = new RestRequest("primary/events");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            restRequest.AddQueryParameter("timeMin", minTime.ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
            restRequest.AddQueryParameter("timeMax", maxTime.ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
            var response = await this.restClient.GetAsync<PagedEventResponse>(restRequest);
            return response;
        }

        public async Task<EventResponse> UpdateEventAsync(string eventId, EventRequest eventRequest)
        {
            var restRequest = new RestRequest($"primary/events/{eventId}");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddJsonBody(eventRequest);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            var response = await this.restClient.PutAsync<EventResponse>(restRequest);
            return response;
        }
            

        public async Task<EventResponse> CreateGoogleMeeting(string _email, string name, DateTime startTime, DateTime endTime)
        {
           List<Attendee> attendees = new List<Attendee> { new Attendee { email = _email, displayName = name, responseStatus = "needsAction" } };
            EventTime start = new EventTime { dateTime = startTime, timeZone = "Asia/Kolkata" };
            EventTime end = new EventTime { dateTime = endTime, timeZone = "Asia/Kolkata" };
            EventRequest eventRequest = new EventRequest
            {
                summary = "Meeting ",
                description = "Google meet",
                start = start,
                end = end,
                attendees = attendees,
                conferenceData = new ConferenceData
                {
                    createRequest = new CreateRequest
                    {
                        requestId = Guid.NewGuid().ToString(),
                        conferenceSolutionKey = new ConferenceSolutionKey
                        {
                            type = "hangoutsMeet"
                        }
                    }
                }
            };
            var restRequest = new RestRequest("primary/events");
            var accessToken = await this.tokenService.GetAccessTokenAsync();
            restRequest.AddQueryParameter("conferenceDataVersion", "1");
            restRequest.AddQueryParameter("sendUpdates", "all");
            restRequest.AddJsonBody(eventRequest);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");

            var response = await this.restClient.PostAsync<EventResponse>(restRequest);
            return response;
        }
    }
}
