
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace NMOHUM.API.Models
    {
        public class Meetings
        {
            [Key]
            public int MeetingId { get; set; }

            public bool IsVirtual { get; set; }

            //[Required]
            public string Platform { get; set; } = string.Empty;

            public string? Url { get; set; }
            public int ServiceId { get; set; }
            [Required]
            public int ProjectID { get; set; }

            [Required]
            public int EmployeeId { get; set; }
            public string Feedback { get; set; } = string.Empty;

            //[Required]
            //public DateTime ScheduleDate { get; set; }

            //[Required]
            //public TimeSpan ScheduleTime { get; set; }

            //// Not mapped to the DB — for accepting time as string
            //[NotMapped]
            //public string? ScheduleTimeString
            //{
            //    get => ScheduleTime.ToString(@"hh\:mm\:ss");
            //    set => ScheduleTime = TimeSpan.TryParse(value, out var time) ? time : TimeSpan.Zero;
            //}

            public int? SlotId { get; set; }
        }
    }


