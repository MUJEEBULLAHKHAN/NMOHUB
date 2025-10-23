using System;

namespace NMOHUM.API.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int ProjectId { get; set; }
        public decimal Amount { get; set; }
        public bool IsVerified { get; set; }
        public string TransactionReciptUrl { get; set; }
        public DateTime CreateAt { get; set; }
    }
} 