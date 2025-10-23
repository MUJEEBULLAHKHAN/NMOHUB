using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ServiceStatus
    {
        [Key]
        public int StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
