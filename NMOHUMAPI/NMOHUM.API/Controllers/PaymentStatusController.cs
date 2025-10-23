using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentStatusController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public PaymentStatusController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/PaymentStatus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentStatus>>> GetPaymentStatuses()
        {
            return await _context.PaymentStatuse.ToListAsync();
        }

        // GET: api/PaymentStatus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentStatus>> GetPaymentStatus(int id)
        {
            var paymentStatus = await _context.PaymentStatuse.FindAsync(id);

            if (paymentStatus == null)
            {
                return NotFound();
            }

            return paymentStatus;
        }

        // POST: api/PaymentStatus
        [HttpPost]
        public async Task<ActionResult<PaymentStatus>> CreatePaymentStatus(PaymentStatus paymentStatus)
        {
            _context.PaymentStatuse.Add(paymentStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaymentStatus), new { id = paymentStatus.Id }, paymentStatus);
        }

        // PUT: api/PaymentStatus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, PaymentStatus paymentStatus)
        {
            if (id != paymentStatus.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymentStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentStatusExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/PaymentStatus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentStatus(int id)
        {
            var paymentStatus = await _context.PaymentStatuse.FindAsync(id);
            if (paymentStatus == null)
            {
                return NotFound();
            }

            _context.PaymentStatuse.Remove(paymentStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentStatusExists(int id)
        {
            return _context.PaymentStatuse.Any(e => e.Id == id);
        }
    }
} 