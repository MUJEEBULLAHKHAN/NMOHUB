using Azure.Storage.Blobs.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class CoWorkingSpaceRequest
    {
        [Key]
        public int CoWorkingSpaceRequestId { get; set; }
        public int CoWorkingSpaceId { get; set; }
        public int EmployeeId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }
        public string Status { get; set; }     // Submit / Approve / Reject
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public int CreatedBy { get; set; }

        [NotMapped]
        public string EmailAddress { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string MobileNumber { get; set; }

        [NotMapped]
        public string Otp { get; set; }

        [NotMapped]
        public string NationalID { get; set; }

        [NotMapped]
        public string CommercialRegistration { get; set; }

        [NotMapped]
        public string CompanyName { get; set; }


        //public DateTime? StartDate { get; set; }
        //public DateTime? EndDate { get; set; }
        //public DateTime? CreateDate { get; set; }
        //public double Amount { get; set; }
        //public string BookType { get; set; }
        //public string Status { get; set; }
    }
}