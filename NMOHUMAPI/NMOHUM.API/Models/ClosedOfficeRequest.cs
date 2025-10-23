using Azure.Storage.Blobs.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class ClosedOfficeRequest
    {
        [Key]
        public int ClosedOfficeRequestId { get; set; }
        public int ClosedOfficeId { get; set; }
        public int EmployeeId { get; set; }
        //public int Duration { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public double Price { get; set; }
        //public string BookType { get; set; }
        public string Status { get; set; } // Submit // Reject // Approve // Activate 

        public int CreatedBy { get; set; }

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
