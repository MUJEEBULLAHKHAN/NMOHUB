using Azure.Storage.Blobs.Models;
using Microsoft.VisualBasic;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class MeetingAccessRoomRequest
    {
        [Key]
        public int MeetingAccessRoomRequestId { get; set; }
        public int MeetingAccessRoomId { get; set; }
        public int EmployeeId { get; set; }
        public int MeetingSlotId { get; set; }
        public DateTime CreateDate { get; set; }
        public double Amount { get; set; }
        public string BookType { get; set; }
        public string Status { get; set; }

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