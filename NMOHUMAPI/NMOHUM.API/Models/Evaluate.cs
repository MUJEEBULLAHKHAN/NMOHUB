using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class Evaluate
    {
        [Key]
        public int EvaluateId { get; set; }
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public double Score { get; set; }
        public DateTime CreateAt { get; set; }
    }
} 