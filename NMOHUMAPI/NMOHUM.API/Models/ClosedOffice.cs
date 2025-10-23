using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ClosedOffice
    {
        [Key]
        public int ClosedOfficeId { get; set; }
        public string CloseOfficeName { get; set; }
        public double Price { get; set; }
        public int OfficeSizes { get; set; }
        public string AccessModel { get; set; }
        public bool? Status { get; set; }
    }
}