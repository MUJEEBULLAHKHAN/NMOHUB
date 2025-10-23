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
    public class TransactionsController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public TransactionsController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/transaction
        [HttpGet]
        [Route("GetTransactions")]
        public async Task<ActionResult<IEnumerable<Transactions>>> GetTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        // GET: api/transaction/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transactions>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            return transaction == null ? NotFound() : transaction;
        }

        // GET: api/transaction/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Transactions>>> GetTransactionsByProject(int projectId)
        {
            return await _context.Transactions
                .Where(t => t.ProjectId == projectId)
                .OrderByDescending(t => t.CreateAt)
                .ToListAsync();
        }

        // GET: api/transaction/verified
        [HttpGet("verified")]
        public async Task<ActionResult<IEnumerable<Transactions>>> GetVerifiedTransactions()
        {
            return await _context.Transactions
                .Where(t => t.IsVerified)
                .ToListAsync();
        }

        // POST: api/transaction
        [HttpPost]
        public async Task<ActionResult<Transactions>> CreateTransaction(Transactions transaction)
        {
            transaction.CreateAt = System.DateTime.Now;
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, transaction);
        }

        // PUT: api/transaction/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, Transactions transaction)
        {
            if (id != transaction.TransactionId)
                return BadRequest();

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Transactions.Any(e => e.TransactionId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // PUT: api/transaction/5/verify
        [HttpPut("{id}/verify")]
        public async Task<IActionResult> VerifyTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            transaction.IsVerified = true;
            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // DELETE: api/transaction/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 