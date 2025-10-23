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
    public class NotesController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public NotesController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/notes
        [HttpGet]
        [Route("GetNotes")]
        public async Task<ActionResult<IEnumerable<Notes>>> GetNotes()
        {
            return await _context.Notes.ToListAsync();
        }

        // GET: api/notes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Notes>> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            return note == null ? NotFound() : note;
        }

        // GET: api/notes/project/5
        [HttpGet("project/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<Notes>>> GetNotesByProject(int projectId , int serviceId)
        {
            var notes =  await _context.Notes
                .Where(n => n.ProjectID == projectId && n.ServiceId == serviceId)
                .OrderByDescending(n => n.CreateAt)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                message = "Project activity.",
                data = notes
            });
        }

        // GET: api/notes/meeting/5
        [HttpGet("meeting/{meetingId}")]
        public async Task<ActionResult<IEnumerable<Notes>>> GetNotesByMeeting(int meetingId)
        {
            return await _context.Notes
                .Where(n => n.MeetingID == meetingId)
                .OrderByDescending(n => n.CreateAt)
                .ToListAsync();
        }

        // POST: api/notes
        [HttpPost]
        public async Task<ActionResult<Notes>> CreateNote(Notes note)
        {
            note.CreateAt = System.DateTime.Now;
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNote), new { id = note.NotesId }, note);
        }

        // PUT: api/notes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, Notes note)
        {
            if (id != note.NotesId)
                return BadRequest();

            _context.Entry(note).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Notes.Any(e => e.NotesId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/notes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
                return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 