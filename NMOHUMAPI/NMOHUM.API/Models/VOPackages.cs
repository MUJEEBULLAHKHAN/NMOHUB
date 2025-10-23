using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class VOPackages
    {
        [Key]
        public int VOPackageId { get; set; }
        public double Price { get; set; }
        public int PersonsQuantity { get; set; }
        public string BIllingCycleUnit { get; set; }
        public int DailyHours { get; set; }
        public int TotalQuantity { get; set; }
        public string Features { get; set; }
        public string Description { get; set; }
        public int MeetingAccessRoomQty { get; set; }
    }
}