using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleMeetAPI.Services
{
    public class GoogleMeetService
    {
        private const string ServiceAccountEmail = "your-service-account@your-project.iam.gserviceaccount.com";
        private const string ImpersonatedUser = "adminuser@yourdomain.com"; // Must belong to your domain

        public async Task<string> CreateMeetLinkAsync(string attendeeEmail)
        {
            var credential = GoogleCredential
                .FromFile("credentials.json")
                .CreateScoped(CalendarService.Scope.Calendar)
                .CreateWithUser(ImpersonatedUser); // impersonates user

            var service = new CalendarService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Google Meet Link Generator",
            });

            var newEvent = new Event
            {
                Summary = "API-generated Google Meet",
                Start = new EventDateTime
                {
                    DateTime = DateTime.UtcNow.AddMinutes(10),
                    TimeZone = "UTC"
                },
                End = new EventDateTime
                {
                    DateTime = DateTime.UtcNow.AddMinutes(40),
                    TimeZone = "UTC"
                },
                Attendees = new[] { new EventAttendee { Email = attendeeEmail } },
                ConferenceData = new ConferenceData
                {
                    CreateRequest = new CreateConferenceRequest
                    {
                        RequestId = Guid.NewGuid().ToString(),
                        ConferenceSolutionKey = new ConferenceSolutionKey { Type = "hangoutsMeet" }
                    }
                }
            };

            var insertRequest = service.Events.Insert(newEvent, "primary");
            insertRequest.ConferenceDataVersion = 1;
            var createdEvent = await insertRequest.ExecuteAsync();

            return createdEvent.ConferenceData?.EntryPoints?[0]?.Uri ?? "No meet link created.";
        }
    }
}