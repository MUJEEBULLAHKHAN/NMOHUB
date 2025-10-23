using System;

namespace NMOHUM.API.Models
{
    public class ServiceRequest
    {
        public int Id { get; set; }
     //   public string UserId { get; set; } // either employeeid or userid    --- decide  EmployeeId
        public int EmployeeId { get; set; }
        public int ServiceId { get; set; }
        public int? PackageId { get; set; }
        public string Status { get; set; } // Pending, Approved, etc.
        public string PaymentStatus { get; set; } // Pending, Paid, Partial
        public DateTime CreatedAt { get; set; }
        public Service Service { get; set; }
        public Package Package { get; set; }
        public Employee Employee { get; set; }
        public string PackageJsonString { get; set; }
        public bool IsNafathVerfied { get; set; }
        public int StatusId { get; internal set; }
    }
}
