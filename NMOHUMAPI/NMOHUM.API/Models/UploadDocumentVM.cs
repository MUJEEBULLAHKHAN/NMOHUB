using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class UploadDocumentVM
    {
        [Required]
        public int ProjectId { get; set; }
        [Required]
        public string Base64Data { get; set; }
        [Required]
        public string Extension { get; set; }
        [Required]
        public string DocumentType { get; set; }
        public int EmployeeId { get; set; }

        public int ServiceId { get; set; }

    }
} 