using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class AdminPages
    {
        [Key]
        public int AdminPageId { get; set; }
        public string AdminPageTitle { get; set; }
        public string AdminPageName { get; set; }
        public string AdminPageDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
