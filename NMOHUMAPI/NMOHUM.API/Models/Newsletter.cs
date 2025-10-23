using System;

namespace NMOHUM.API.Models
{
    public class Newsletter
    {
        public int NewsletterId { get; set; }   // PK
        public string Title { get; set; }
        public string TitleArabic { get; set; }
        public string Content { get; set; }
        public string ContentArabic { get; set; }
        public string? Category { get; set; }   // optional
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }


}
