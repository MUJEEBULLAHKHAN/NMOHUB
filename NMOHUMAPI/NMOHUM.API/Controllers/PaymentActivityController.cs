using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlX.XDevAPI.Common;
using NMOHUM.API.Models;
using NMOHUM.API.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentActivityController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;

        public PaymentActivityController(NMOHUMAuthenticationContext context, IFileStorageServiceHandler fileStorageServiceHandler)
        {
            _context = context;
            _fileStorageServiceHandler = fileStorageServiceHandler;
        }

        // GET: api/paymentactivity
        [HttpGet]
        [Route("GetAllPaymentActivities")]
        public async Task<ActionResult<IEnumerable<PaymentActivity>>> GetAllPaymentActivities()
        {
            var paymentactivities = await _context.PaymentActivity.ToListAsync();
            return Ok(new { success = true, data = paymentactivities });
        }

        // POST: api/paymentactivity
        [HttpPost]
        [Route("CreatePaymentActivity")]
        public async Task<ActionResult<PaymentActivity>> CreatePaymentActivity([FromBody] PaymentActivity paymentActivity)
        {
            if (paymentActivity.Document != null)
            {
                if (string.IsNullOrEmpty(paymentActivity.Document.Base64Data))
                    return BadRequest(new { success = false, message = "Document data is required" });

                if (string.IsNullOrEmpty(paymentActivity.Document.Extension))
                    return BadRequest(new { success = false, message = "Document extension is required" });

                var fileName = DateTime.Now.ToString("ddMMyyyHHmmss") + paymentActivity.Document.Extension;
                
                try
                {
                    _fileStorageServiceHandler.StoreBlob(
                        paymentActivity.Document.Base64Data,
                        paymentActivity.Document.Extension,
                        paymentActivity.ProjectId, paymentActivity.ServiceId,
                        0,
                        fileName,
                        paymentActivity.Document.DocumentType,
                        "Other");

                    paymentActivity.TransactionReciptUrl = $"/Resources/Other/{paymentActivity.ProjectId}/{fileName}";
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, message = "Failed to upload document", error = ex.Message });
                }
            }

            paymentActivity.CreatedAt = DateTime.Now; 
            _context.PaymentActivity.Add(paymentActivity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllPaymentActivities), new { id = paymentActivity.PaymentId }, new { success = true, data = paymentActivity });
        }

        // PUT: api/paymentactivity/verify
        [HttpPut("verify")]
        public async Task<IActionResult> UpdatePaymentActivityIsVerified([FromBody] UpdatePaymentActivityVerifyRequest request)
        {
            var paymentActivity = await _context.PaymentActivity.FindAsync(request.PaymentId);
            if (paymentActivity == null)
                return BadRequest(new { success = false, message = "Not Found" });
            paymentActivity.IsVerified = request.IsVerified;
            if (!request.IsVerified)
            {
                paymentActivity.DeclineReason = request.DeclineReason;
            }
            // Optionally, you can log or use EmployeeId for auditing here
            _context.Entry(paymentActivity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // GET: api/paymentactivity/project/{projectId}
        [HttpGet("project/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<PaymentActivity>>> GetAllPaymentActivityByProjectId(int projectId , int serviceId)
        {
            var paymentactivities = await _context.PaymentActivity
                .Where(p => p.ProjectId == projectId && p.ServiceId==serviceId)
                .ToListAsync();
            return Ok(new { success = true, data = paymentactivities });
        }
    }

    public class UpdatePaymentActivityVerifyRequest
    {
        public int EmployeeId { get; set; }
        public int PaymentId { get; set; }
        public bool IsVerified { get; set; }
        public string? DeclineReason { get; set; }
    }
}
