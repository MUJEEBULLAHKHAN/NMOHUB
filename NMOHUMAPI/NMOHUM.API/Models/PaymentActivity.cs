using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class PaymentActivity
    {
        [Key]
        public int PaymentId { get; set; }

        public int ProjectId { get; set; }

        public decimal Amount { get; set; }
        public string? PaymentName { get; set; }
        public string? DeclineReason { get; set; }
        public bool? IsVerified { get; set; }
        public int ServiceId { get; set; }
        public string? TransactionReciptUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        [NotMapped]
        public DocumentData Document { get; set; }

    }
}
