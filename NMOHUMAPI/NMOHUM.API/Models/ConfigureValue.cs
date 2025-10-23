using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ConfigureValue
    {
        [Key]
        public int ConfigurationId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;
    }
}
