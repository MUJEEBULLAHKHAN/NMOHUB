using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class ProjectActivity
    {
        [Key]
        public int ActivityId { get; set; }
        public int ProjectId { get; set; }
        public int StatusId { get; set; }
        public string Comments { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreateAt { get; set; }
        public int ServiceId { get; set; }

        [NotMapped]
        public string UserName { get; set; }
        [NotMapped]
        public string StatusName { get; set; }
    }
} 