using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class PackageRequest
    {
        public int PackageRequestId { get; set; }
        public int PackageId { get; set; }
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int MeetingAccessRoomQty { get; set; }
        public int PackageValidityInMonth { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string OfficeAddress { get; set; }
        public string Status { get; set; } // Submit // Reject // Approve
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }

        [NotMapped]
        public string EmailAddress { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string MobileNumber { get; set; }

        [NotMapped]
        public string NationalID { get; set; }

        [NotMapped]
        public string CommercialRegistration { get; set; }

        [NotMapped]
        public string CompanyName { get; set; }

        [NotMapped]
        public string Otp { get; set; }
    }
}