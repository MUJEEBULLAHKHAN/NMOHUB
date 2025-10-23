using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static Azure.Core.HttpHeader;
 
namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly NMOHUMAuthenticationContext _context;
        public PaymentController(IConfiguration configuration, NMOHUMAuthenticationContext context) 
        {
            _configuration = configuration;
            _context = context;
        }

        //[HttpPost]
        //public async Task<IActionResult<string>> SettledDriverAmountByServiceStatusId(ServiceStatusIdList serviceStatusIdList)
        //{
        //    ResponseObj<string> responseObj = new ResponseObj<string>();
        //    try
        //    {
        //        if (serviceStatusIdList == null || serviceStatusIdList.ServiceStatusIdAndTransaction.Count == 0)
        //        {
        //            responseObj.isSuccess = false;
        //            responseObj.Message = "Please Select At Least One Service";
        //            return responseObj;
        //        }
        //            var _service = db.NajmServiceStatus.FirstOrDefault(x => x.NajmServiceStatusId == item.ServiceStatusId);
        //            var _request = db.Request.FirstOrDefault(x => x.RequestNumber == _service.RequestNumber);


        //            if (_service != null)
        //            {
        //                if (serviceStatusIdList.ServiceStatusIdAndTransaction.Count == 1)
        //                {
        //                    if (_request.DriverFees > item.Fees)
        //                    {
        //                        _request.PaidDriverFees = item.Fees + _request.PaidDriverFees;
        //                        _request.DriverFees = _request.DriverFees - item.Fees;
        //                    }
        //                    else
        //                    {
        //                        responseObj.Message = "Amount should be less then Driver Fees";
        //                        responseObj.isSuccess = false;
        //                        return responseObj;
        //                    }
        //                }

        //                var TowerDetails = db.Tower.Where(x => x.TowerId == _request.TowerId).FirstOrDefault();

        //                RequestPaymentGatewayDetails requestPaymentGatewayDetails = new RequestPaymentGatewayDetails();
        //                PaymentRequestDetails paymentRequestDetails = new PaymentRequestDetails();

        //                requestPaymentGatewayDetails.TerminalId = ConfigurationManager.AppSettings["PaymentTerminalId"];
        //                requestPaymentGatewayDetails.MerchantIp = "109.206.64.13";
        //                requestPaymentGatewayDetails.Password = ConfigurationManager.AppSettings["PaymentPassword"];
        //                requestPaymentGatewayDetails.CustomerEmail = requestPaymentGatewayDetails.Udf1 = requestPaymentGatewayDetails.Udf2 = requestPaymentGatewayDetails.Udf3
        //                    = requestPaymentGatewayDetails.Udf4 = requestPaymentGatewayDetails.Udf5 = requestPaymentGatewayDetails.SubInterfaceCode = string.Empty;
        //                requestPaymentGatewayDetails.Country = "SA";
        //                requestPaymentGatewayDetails.Currency = "SAR";
        //                requestPaymentGatewayDetails.Amount = item.Fees;
        //                requestPaymentGatewayDetails.Action = "16";
        //                requestPaymentGatewayDetails.B2BCustomerName = TowerDetails.FirstName + " " + TowerDetails.MiddelName + " " + TowerDetails.LastName;
        //                requestPaymentGatewayDetails.CustomerIp = "10.10.10.1";
        //                requestPaymentGatewayDetails.InstrumentType = "Default";
        //                requestPaymentGatewayDetails.PaymentCycle = "RT";
        //                requestPaymentGatewayDetails.BeneficiaryAccountNo = TowerDetails.Iban;
        //                requestPaymentGatewayDetails.PaymentDetails = "abc123";
        //                requestPaymentGatewayDetails.BeneficiaryCurrency = "SAR";
        //                requestPaymentGatewayDetails.BeneficiaryAmount = item.Fees.ToString("#.00");
        //                requestPaymentGatewayDetails.TowerId = _request.TowerId;
        //                requestPaymentGatewayDetails.RequestNumber = _request.RequestNumber;
        //                requestPaymentGatewayDetails.CreatedDate = common.GetCurrentSaudiTime();

        //                db.RequestPaymentGatewayDetails.Add(requestPaymentGatewayDetails);
        //                await db.SaveChangesAsync();

        //                var trackId = db.RequestPaymentGatewayDetails.Where(x => x.TrackId == requestPaymentGatewayDetails.TrackId).FirstOrDefault();
        //                paymentRequestDetails.trackid = trackId.TrackId.ToString();
        //                string hashCode = string.Format("{0}|{1}|{2}|{3}|{4}|SAR", paymentRequestDetails.trackid, "fazah", "fazah@123", ConfigurationManager.AppSettings["secretkey"], item.Fees.ToString("#.00"));
        //                requestPaymentGatewayDetails.RequestHash = ComputeSha256Hash(hashCode);

        //                db.Entry(trackId).State = EntityState.Modified;
        //                db.Configuration.ValidateOnSaveEnabled = false;
        //                await db.SaveChangesAsync();
        //                db.Configuration.ValidateOnSaveEnabled = true;

        //                paymentRequestDetails.terminalId = requestPaymentGatewayDetails.TerminalId;
        //                paymentRequestDetails.merchantIp = requestPaymentGatewayDetails.MerchantIp;
        //                paymentRequestDetails.password = requestPaymentGatewayDetails.Password;
        //                paymentRequestDetails.customerEmail = "Abc@gmail.com";
        //                paymentRequestDetails.country = requestPaymentGatewayDetails.Country;
        //                paymentRequestDetails.currency = requestPaymentGatewayDetails.Currency;
        //                paymentRequestDetails.amount = requestPaymentGatewayDetails.Amount.ToString("#.00");
        //                paymentRequestDetails.action = requestPaymentGatewayDetails.Action;
        //                paymentRequestDetails.b2bCustomerName = TowerDetails.FirstName + " " + TowerDetails.MiddelName + " " + TowerDetails.LastName;
        //                paymentRequestDetails.customerIp = requestPaymentGatewayDetails.CustomerIp;
        //                paymentRequestDetails.udf1 = paymentRequestDetails.udf2 = paymentRequestDetails.udf3 = paymentRequestDetails.udf4 = paymentRequestDetails.udf5 = string.Empty;
        //                paymentRequestDetails.instrumentType = requestPaymentGatewayDetails.InstrumentType;
        //                paymentRequestDetails.paymentCycle = requestPaymentGatewayDetails.PaymentCycle;
        //                paymentRequestDetails.subInterfaceCode = string.Empty;
        //                b2bPaymentDetails b2BPayment = new b2bPaymentDetails();
        //                //b2BPayment.beneficiaryAccountNo = requestPaymentGatewayDetails.BeneficiaryAccountNo;
        //                b2BPayment.beneficiaryAccountNo = "68200068489000";
        //                b2BPayment.paymentDetails = requestPaymentGatewayDetails.PaymentDetails;
        //                b2BPayment.beneficiaryCurrency = requestPaymentGatewayDetails.BeneficiaryCurrency;
        //                b2BPayment.beneficiaryAmount = requestPaymentGatewayDetails.BeneficiaryAmount;
        //                List<b2bPaymentDetails> b2BPayments = new List<b2bPaymentDetails>();
        //                b2BPayments.Add(b2BPayment);
        //                paymentRequestDetails.b2bPaymentDetails = b2BPayments;

        //                paymentRequestDetails.requestHash = requestPaymentGatewayDetails.RequestHash;


        //                var json = JsonConvert.SerializeObject(paymentRequestDetails);
        //                using (var httpClient = new HttpClient())
        //                {
        //                    using (var content = new StringContent(json))
        //                    {

        //                        content.Headers.Clear();
        //                        content.Headers.Add("Content-Type", "application/json");
        //                        string url = ConfigurationManager.AppSettings["PaymentRequestUrl"];
        //                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        //                        var response = await httpClient.PostAsync(url, content);
        //                        if (response.IsSuccessStatusCode)
        //                        {
        //                            var responseJson = await response.Content.ReadAsStringAsync();
        //                            var resFromPayment = JsonConvert.DeserializeObject<PaymentResponseDetails>(responseJson);

        //                            ResponsePaymentGatewayDetails responsePaymentGatewayDetails = new ResponsePaymentGatewayDetails();
        //                            responsePaymentGatewayDetails.Result = resFromPayment.result;
        //                            responsePaymentGatewayDetails.ResponseCode = resFromPayment.responseCode;
        //                            responsePaymentGatewayDetails.Authcode = resFromPayment.authcode;
        //                            responsePaymentGatewayDetails.Tranid = resFromPayment.tranid;
        //                            responsePaymentGatewayDetails.Trackid = requestPaymentGatewayDetails.TrackId.ToString();
        //                            responsePaymentGatewayDetails.TerminalId = resFromPayment.terminalid;
        //                            responsePaymentGatewayDetails.Udf1 = resFromPayment.udf1;
        //                            responsePaymentGatewayDetails.Udf2 = resFromPayment.udf2;
        //                            responsePaymentGatewayDetails.Udf3 = resFromPayment.udf3;
        //                            responsePaymentGatewayDetails.Udf4 = resFromPayment.udf4;
        //                            responsePaymentGatewayDetails.Udf5 = resFromPayment.udf5;
        //                            responsePaymentGatewayDetails.Rrn = resFromPayment.rrn;
        //                            responsePaymentGatewayDetails.Eci = resFromPayment.eci;
        //                            responsePaymentGatewayDetails.SubscriptionId = resFromPayment.subscriptionId;
        //                            responsePaymentGatewayDetails.TranType = resFromPayment.tranType;
        //                            responsePaymentGatewayDetails.IntegrationModule = resFromPayment.integrationModule;
        //                            responsePaymentGatewayDetails.IntegrationData = resFromPayment.integrationData;
        //                            responsePaymentGatewayDetails.Payid = resFromPayment.payid;
        //                            responsePaymentGatewayDetails.TargetUrl = resFromPayment.targetUrl;
        //                            responsePaymentGatewayDetails.PostData = resFromPayment.postData;
        //                            responsePaymentGatewayDetails.IntUrl = resFromPayment.intUrl;
        //                            responsePaymentGatewayDetails.ResponseHash = resFromPayment.responseHash;
        //                            responsePaymentGatewayDetails.Amount = resFromPayment.amount;
        //                            responsePaymentGatewayDetails.CardBrand = resFromPayment.cardBrand;
        //                            responsePaymentGatewayDetails.MaskedPAN = resFromPayment.maskedPAN;
        //                            responsePaymentGatewayDetails.CardToken = resFromPayment.cardToken;
        //                            responsePaymentGatewayDetails.TowerId = _request.TowerId;
        //                            responsePaymentGatewayDetails.RequestNumber = _request.RequestNumber;
        //                            responsePaymentGatewayDetails.CreatedDate = common.GetCurrentSaudiTime();

        //                            db.ResponsePaymentGatewayDetails.Add(responsePaymentGatewayDetails);
        //                            await db.SaveChangesAsync();

        //                            if (resFromPayment.responseCode == "000")
        //                            {
        //                                if (serviceStatusIdList.ServiceStatusIdAndTransaction.Count > 1)
        //                                {
        //                                    _service.IsDriverAmountSettled = true;
        //                                }




        //                                _service.UpdatedDate = common.GetCurrentSaudiTime();
        //                                _service.UpdatedBy = serviceStatusIdList.UserId;
        //                                _service.BankTransactionNo = resFromPayment.tranid;
        //                                db.Entry(_service).State = EntityState.Modified;
        //                                db.Entry(_request).State = EntityState.Modified;
        //                                db.Configuration.ValidateOnSaveEnabled = false;
        //                                Save();
        //                                db.Configuration.ValidateOnSaveEnabled = true;
        //                                responseObj.isSuccess = true;
        //                                responseObj.Message = resFromPayment.result;
        //                                responseObj.Data = responseJson;
        //                            }
        //                            else
        //                            {
        //                                responseObj.Message = "Transaction Failed";
        //                                responseObj.isSuccess = false;
        //                            }
        //                        }


        //                    }
        //                }


        //            }


        //        responseObj.isSuccess = true;
        //        responseObj.Message = "Driver Amount Settled Successfully";
        //    }
        //    catch (Exception ex)
        //    {


        //    }
        //    return responseObj;
        //}

        //[HttpPost("PaymentFromMobile")]
        //public async Task<IActionResult> PaymentFromMobile(SendDetailsForPaymentMobile getDetailsForPayment)
        //{
        //    string paymentURL = string.Empty; string responseJson=string.Empty;
        //    try
        //    {
        //        PaymentRequestDetails paymentRequestDetails = new PaymentRequestDetails();
        //        paymentRequestDetails.amount = getDetailsForPayment.Price.ToString("#.00");
        //        paymentRequestDetails.trackid = getDetailsForPayment.trackId;
        //        string hashCode = string.Format("{0}|{1}|{2}|{3}|{4}|SAR", paymentRequestDetails.trackid, "360repair", "URWAY@123", _configuration["secretkey"], paymentRequestDetails.amount);
        //        string RequestHash = ComputeSha256Hash(hashCode);

        //        paymentRequestDetails.terminalId = _configuration["PaymentTerminalId"];
        //        paymentRequestDetails.merchantIp = "109.206.64.13";
        //        paymentRequestDetails.password = _configuration["PaymentPassword"];
        //        paymentRequestDetails.customerEmail = string.Empty;
        //        paymentRequestDetails.country = "SA";
        //        paymentRequestDetails.currency = "SAR";
        //        paymentRequestDetails.amount = getDetailsForPayment.Price.ToString("#.00");
        //        paymentRequestDetails.action = "1";
        //        // paymentRequestDetails.udf2= ConfigurationManager.AppSettings["RedirectApi"];
        //        paymentRequestDetails.requestHash = RequestHash;
        //        var json = JsonConvert.SerializeObject(paymentRequestDetails);
                
        //        using (var httpClient = new HttpClient())
        //        {
        //            using (var content = new StringContent(json))
        //            {
        //                content.Headers.Clear();
        //                content.Headers.Add("Content-Type", "application/json");
        //                string url = _configuration["PaymentRequestUrl"];
        //                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        //                var response = await httpClient.PostAsync(url, content);
        //                if (response.IsSuccessStatusCode)
        //                {
        //                    responseJson = await response.Content.ReadAsStringAsync();
        //                    var resFromPayment = JsonConvert.DeserializeObject<PaymentResponseDetails>(responseJson);
                            
        //                    paymentURL = resFromPayment.targetUrl + "?paymentid=" + resFromPayment.payid;
        //                    return Ok(new { data = paymentURL, res = responseJson });
        //                }
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {

               
        //    }
        //    return Ok(new { data = paymentURL, res = responseJson });
        //}
        //[HttpGet("GetTransactionResponse")]
        //public async Task<IActionResult> GetTransactionResponse(string Url, string RequestNumber)
        //{
        //    try
        //    {

        //        Uri myUri = new Uri(Url);
        //        string PaymentId = HttpUtility.ParseQueryString(myUri.Query).Get("PaymentId");
        //        string TranId = HttpUtility.ParseQueryString(myUri.Query).Get("TranId");
        //        string ECI = HttpUtility.ParseQueryString(myUri.Query).Get("ECI");
        //        string Result = HttpUtility.ParseQueryString(myUri.Query).Get("Result");
        //        string TrackId = HttpUtility.ParseQueryString(myUri.Query).Get("TrackId");
        //        string AuthCode = HttpUtility.ParseQueryString(myUri.Query).Get("AuthCode");
        //        string ResponseCode = HttpUtility.ParseQueryString(myUri.Query).Get("ResponseCode");
        //        string responseHash = HttpUtility.ParseQueryString(myUri.Query).Get("responseHash");
        //        string amount = HttpUtility.ParseQueryString(myUri.Query).Get("amount");
        //        string cardBrand = HttpUtility.ParseQueryString(myUri.Query).Get("cardBrand");
        //        string RRN = HttpUtility.ParseQueryString(myUri.Query).Get("AuthCode");
        //        string UserField1 = HttpUtility.ParseQueryString(myUri.Query).Get("UserField1");
        //        string UserField2 = HttpUtility.ParseQueryString(myUri.Query).Get("UserField2");
        //        string UserField3 = HttpUtility.ParseQueryString(myUri.Query).Get("UserField3");
        //        string UserField4 = HttpUtility.ParseQueryString(myUri.Query).Get("UserField4");
        //        string UserField5 = HttpUtility.ParseQueryString(myUri.Query).Get("UserField5");
        //        string maskedPAN = HttpUtility.ParseQueryString(myUri.Query).Get("maskedPAN");
        //        string cardToken = HttpUtility.ParseQueryString(myUri.Query).Get("cardToken");
        //        string SubscriptionId = HttpUtility.ParseQueryString(myUri.Query).Get("SubscriptionId");
        //        var UpdateTransResponse = await _context.ResponsePaymentGatewayDetails.Where(x => x.Trackid == TrackId).FirstOrDefaultAsync();
        //        if (UpdateTransResponse != null)
        //        {
        //            UpdateTransResponse.Payid = PaymentId;
        //            UpdateTransResponse.Tranid = TranId;
        //            UpdateTransResponse.Eci = ECI;
        //            UpdateTransResponse.Result = Result;
        //            UpdateTransResponse.Authcode = AuthCode;
        //            UpdateTransResponse.ResponseCode = ResponseCode;
        //            UpdateTransResponse.ResponseHash = responseHash;
        //            UpdateTransResponse.Amount = amount;
        //            UpdateTransResponse.CardBrand = cardBrand;
        //            UpdateTransResponse.Rrn = RRN;
        //            UpdateTransResponse.Udf1 = UserField1;
        //            UpdateTransResponse.Udf3 = UserField3;
        //            UpdateTransResponse.Udf4 = UserField4;
        //            UpdateTransResponse.Udf5 = UserField5;
        //            UpdateTransResponse.MaskedPAN = maskedPAN;
        //            UpdateTransResponse.CardToken = cardToken;
        //            UpdateTransResponse.SubscriptionId = SubscriptionId;
        //            UpdateTransResponse.RequestNumber = RequestNumber;
        //            _context.ResponsePaymentGatewayDetails.Update(UpdateTransResponse);
        //            await _context.SaveChangesAsync();
        //            if (ResponseCode == "000")
        //            {
        //                return Ok(new { message = "Transaction has been successfully done" });
        //            }
        //            else
        //            {
        //                return BadRequest(new {responseCode = ResponseCode,message = "Transaction Failed"});
        //            }


        //        }
        //        else
        //        {
        //            return BadRequest(new { message = "Transaction Failed" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
                
        //    }
        //    return null;
        //}
        //static string ComputeSha256Hash(string rawData)
        //{
        //    // Create a SHA256   
        //    using (SHA256 sha256Hash = SHA256.Create())
        //    {
        //        // ComputeHash - returns byte array  
        //        byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

        //        // Convert byte array to a string   
        //        StringBuilder builder = new StringBuilder();
        //        foreach (Byte b in bytes)
        //        {
        //            builder.Append(b.ToString("x2"));
        //        }
        //        return builder.ToString();
        //    }
        //}
    }
}
