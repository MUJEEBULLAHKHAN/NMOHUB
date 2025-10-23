using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ForeignPackage
    {
        [Key]
        public int Id { get; set; }
        public string PackageName { get; set; }
        public string Description { get; set; }
    }
}