using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class CoWorkingSpace
    {
        [Key]
        public int CoWorkingSpaceId { get; set; }
        public double Price { get; set; }
        public int TotalQuantity { get; set; }
        public string DeskType { get; set; }
        public int AccessScopeHour { get; set; }
        


        //public string BIllingCycleUnit { get; set; }
        //public int DailyHours { get; set; }
        //public int TotalQuantity { get; set; }
        //public string Features { get; set; }
        //public string Description { get; set; }
    }
}