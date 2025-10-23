using System;

namespace NMOHUM.API.Models
{
    public class Package
    {
        public int PackageId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int MeetingAccessRoomConsume { get; set; }
        public string BillingPackage { get; set; }
        public string Features { get; set; }
        public int PackageValidityInMonth { get; set; }
        public string OfficeAddress { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}