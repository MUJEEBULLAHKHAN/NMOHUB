using System;

namespace NMOHUM.API.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int EmployeeId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsRead { get; set; }
        public bool IsActive { get; set; }
    }
}