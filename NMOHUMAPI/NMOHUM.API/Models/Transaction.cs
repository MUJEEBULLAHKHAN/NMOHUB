using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class Transactions
    {
        [Key]
        public int TransactionId { get; set; }
        public int ProjectId { get; set; }
        public decimal Amount { get; set; }
        public bool IsVerified { get; set; }
        public string TransactionReciptUrl { get; set; }
        public DateTime CreateAt { get; set; }
    }
} 