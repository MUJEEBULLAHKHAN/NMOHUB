using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class SupportNeeds
    {
        [Key]
        public int SupportNeedId { get; set; }
        public string SupportNeed { get; set; } = string.Empty;

        [NotMapped]
        public bool IsChecked { get; set; } = false;
    }
} 