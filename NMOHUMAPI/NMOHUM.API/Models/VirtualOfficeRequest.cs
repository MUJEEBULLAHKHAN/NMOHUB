using Azure.Storage.Blobs.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class VirtualOfficeRequest
    {
        [Key]
        public int VirtualOfficeRequestId { get; set; }
        public int VOPackageId { get; set; }
        public int EmployeeId { get; set; }
        public int Duration { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public double Amount { get; set; }
        public string BookType { get; set; }
        public string Status { get; set; }
        public int MeetingAccessRoomAvailableQty { get; set; }
    }
}