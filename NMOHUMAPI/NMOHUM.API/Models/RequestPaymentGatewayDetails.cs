using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class RequestPaymentGatewayDetails
    {
        [Key]
        public int TrackId { get; set; }
        public string TransId { get; set; }
        public string TerminalId { get; set; }
        public string Action { get; set; }
        public string CustomerEmail { get; set; }
        public string MerchantIp { get; set; }
        public string Password { get; set; }
        public string Currency { get; set; }
        public double Amount { get; set; }
        public string RequestHash { get; set; }
        public string Country { get; set; }
        public string B2BCustomerName { get; set; }
        public string CustomerIp { get; set; }
        public string Udf1 { get; set; }
        public string Udf2 { get; set; }
        public string Udf3 { get; set; }
        public string Udf4 { get; set; }
        public string Udf5 { get; set; }
        public string InstrumentType { get; set; }
        public string PaymentCycle { get; set; }
        public string SubInterfaceCode { get; set; }
        public string BeneficiaryAccountNo { get; set; }
        public string PaymentDetails { get; set; }
        public string BeneficiaryCurrency { get; set; }
        public string BeneficiaryAmount { get; set; }
        public string RequestNumber { get; set; }
        public int TowerId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
