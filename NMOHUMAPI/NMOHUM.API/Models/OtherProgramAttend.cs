using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class OtherProgramAttend
    {
        [Key]
        public int ProgramId { get; set; }
        public int ProjectId { get; set; }
        public string IncubatorName { get; set; }
        public string Details { get; set; }
    }
} 