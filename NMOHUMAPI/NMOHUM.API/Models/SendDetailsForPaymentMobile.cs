using System.Collections.Generic;

namespace NMOHUM.API.Models
{
    public class SendDetailsForPaymentMobile
    {
        public string trackId { get; set; }
        public double Price { get; set; }
    }
    public class PaymentRequestDetails
    {
        public string trackid { get; set; }
        public string customerIp { get; set; }
        public string terminalId { get; set; }
        public string action { get; set; }
        public string password { get; set; }
        public string merchantIp { get; set; }
        public string customerEmail { get; set; }
        public string amount { get; set; }
        public string currency { get; set; }
        public string country { get; set; }
        public string paymentCycle { get; set; }
        public string instrumentType { get; set; }
        public string subInterfaceCode { get; set; }
        public string b2bCustomerName { get; set; }
        public List<b2bPaymentDetails> b2bPaymentDetails { get; set; }
        public string udf1 { get; set; }
        public string udf2 { get; set; }
        public string udf3 { get; set; }
        public string udf4 { get; set; }
        public string udf5 { get; set; }
        public string transid { get; set; }
        public string requestHash { get; set; }
    }
    public class b2bPaymentDetails
    {
        public string beneficiaryBank { get; set; }
        public string beneficiaryBankAddress { get; set; }
        public string beneficiaryBankClearingCode { get; set; }
        public string beneficiaryBankCode { get; set; }
        public string beneficiaryAccountNo { get; set; }
        public string beneficiaryName { get; set; }
        public string beneficiaryAddress { get; set; }
        public string paymentDetails { get; set; }
        public string beneficiaryCurrency { get; set; }
        public string beneficiaryAmount { get; set; }

    }
    public class PaymentResponseDetails
    {
        public string result { get; set; }
        public string responseCode { get; set; }
        public string authcode { get; set; }
        public string tranid { get; set; }
        public string trackid { get; set; }
        public string terminalid { get; set; }
        public string udf1 { get; set; }
        public string udf2 { get; set; }
        public string udf3 { get; set; }
        public string udf4 { get; set; }
        public string udf5 { get; set; }
        public string rrn { get; set; }
        public string eci { get; set; }
        public string subscriptionId { get; set; }
        public string trandate { get; set; }
        public string tranType { get; set; }
        public string integrationModule { get; set; }
        public string integrationData { get; set; }
        public string payid { get; set; }
        public string targetUrl { get; set; }
        public string postData { get; set; }
        public string intUrl { get; set; }
        public string responseHash { get; set; }
        public string amount { get; set; }
        public string cardBrand { get; set; }
        public string maskedPAN { get; set; }
        public string linkBasedUrl { get; set; }
        public string sadadNumber { get; set; }
        public string billNumber { get; set; }
        public string cardToken { get; set; }
    }
}
