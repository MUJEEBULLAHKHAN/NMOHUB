using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class VirtualOffice
    {
        [Key]
        public int VirtualOfficeId { get; set; }
        public string Description { get; set; }
    }
}