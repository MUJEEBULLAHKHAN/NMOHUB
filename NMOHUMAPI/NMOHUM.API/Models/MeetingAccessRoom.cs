using Google.Apis.Calendar.v3.Data;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class MeetingAccessRoom
    {
        [Key]
        public int MeetingAccessRoomId { get; set; }
        public int TotalMeetingRooms { get; set; }
        public int SeatingCapacity { get; set; }
        public double Price { get; set; }
        public string BIllingCycleUnit { get; set; }
        public int DailyHours { get; set; }
        public string Features { get; set; }
        public string Description { get; set; }
    }
}
