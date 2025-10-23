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
    public class EvaluateController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public EvaluateController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/evaluate
        [HttpGet]
        [Route("GetEvaluations")]
        public async Task<ActionResult<IEnumerable<Evaluate>>> GetEvaluations()
        {
            return await _context.Evaluate.ToListAsync();
        }

        // GET: api/evaluate/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Evaluate>> GetEvaluation(int id)
        {
            var evaluation = await _context.Evaluate.FindAsync(id);
            return evaluation == null ? NotFound() : evaluation;
        }

        // GET: api/evaluate/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Evaluate>>> GetEvaluationsByProject(int projectId)
        {
            return await _context.Evaluate
                .Where(e => e.ProjectId == projectId)
                .OrderByDescending(e => e.CreateAt)
                .ToListAsync();
        }

        // GET: api/evaluate/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Evaluate>>> GetEvaluationsByUser(int userId)
        {
            return await _context.Evaluate
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CreateAt)
                .ToListAsync();
        }

        // GET: api/evaluate/project/5/average
        [HttpGet("project/{projectId}/average")]
        public async Task<ActionResult<double>> GetAverageScoreByProject(int projectId)
        {
            var evaluations = await _context.Evaluate
                .Where(e => e.ProjectId == projectId)
                .ToListAsync();

            if (!evaluations.Any())
                return NotFound();

            var averageScore = evaluations.Average(e => e.Score);
            return averageScore;
        }

        // POST: api/evaluate
        [HttpPost]
        public async Task<ActionResult<Evaluate>> CreateEvaluation(Evaluate evaluation)
        {
            evaluation.CreateAt = System.DateTime.Now;
            _context.Evaluate.Add(evaluation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvaluation), new { id = evaluation.ProjectId }, evaluation);
        }

        // PUT: api/evaluate/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvaluation(int id, Evaluate evaluation)
        {
            if (id != evaluation.ProjectId)
                return BadRequest();

            _context.Entry(evaluation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Evaluate.Any(e => e.ProjectId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/evaluate/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvaluation(int id)
        {
            var evaluation = await _context.Evaluate.FindAsync(id);
            if (evaluation == null)
                return NotFound();

            _context.Evaluate.Remove(evaluation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 