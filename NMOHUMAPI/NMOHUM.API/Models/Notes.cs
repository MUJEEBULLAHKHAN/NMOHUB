using System;

namespace NMOHUM.API.Models
{
    public class Notes
    {
        public int NotesId { get; set; }
        public int ProjectID { get; set; }
        public int ServiceId { get; set; }
        public string FullDescription { get; set; }
        public int? MeetingID { get; set; }

        public DateTime CreateAt { get; set; }
    }
} 