using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ResponsePaymentGatewayDetails
    {
        public string Result { get; set; }
        public string ResponseCode { get; set; }
        public string Authcode { get; set; }
        public string Tranid { get; set; }

        [Key]
        public string Trackid { get; set; }
        public string TerminalId { get; set; }
        public string Udf1 { get; set; }
        public string Udf2 { get; set; }
        public string Udf3 { get; set; }
        public string Udf4 { get; set; }
        public string Udf5 { get; set; }
        public string Rrn { get; set; }
        public string Eci { get; set; }
        public string SubscriptionId { get; set; }
        public string Trandate { get; set; }
        public string TranType { get; set; }
        public string IntegrationModule { get; set; }
        public string IntegrationData { get; set; }
        public string Payid { get; set; }
        public string TargetUrl { get; set; }
        public string PostData { get; set; }
        public string IntUrl { get; set; }
        public string ResponseHash { get; set; }
        public string Amount { get; set; }
        public string CardBrand { get; set; }
        public string MaskedPAN { get; set; }
        public string LinkBasedUrl { get; set; }
        public string SadadNumber { get; set; }
        public string BillNumber { get; set; }
        public string CardToken { get; set; }
        public string RequestNumber { get; set; }
        public int TowerId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
