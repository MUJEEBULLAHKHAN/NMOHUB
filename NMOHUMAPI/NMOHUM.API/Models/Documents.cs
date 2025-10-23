using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class Documents
    {
        [Key]
        public int DocumentId { get; set; }
        public string Name { get; set; }
        public string DocumentType { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsPublic { get; set; }
        public int ProjectID { get; set; }
        public int ServiceId { get; set; }
        public int ClosedOfficeRequestId { get; set; }
        public DateTime CreateAt { get; set; }
    }
} 