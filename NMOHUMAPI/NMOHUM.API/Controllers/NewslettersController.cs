using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewslettersController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        public NewslettersController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/newsletters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsletterDto>>> GetAll()
        {
            var newsletters = await _context.Newsletters
                .Select(n => new NewsletterDto
                {
                    NewsletterId = n.NewsletterId,
                    Title = n.Title,
                    TitleArabic = n.TitleArabic,
                    Content = n.Content,
                    ContentArabic = n.ContentArabic,
                    Category = n.Category,
                    CreatedDate = n.CreatedDate,
                    CreatedBy = n.CreatedBy
                }).ToListAsync();

            return Ok(newsletters);
        }

        // GET: api/newsletters/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsletterDto>> GetById(int id)
        {
            var newsletter = await _context.Newsletters.FindAsync(id);

            if (newsletter == null)
                return NotFound();

            return Ok(new NewsletterDto
            {
                NewsletterId = newsletter.NewsletterId,
                Title = newsletter.Title,
                TitleArabic = newsletter.TitleArabic,
                Content = newsletter.Content,
                ContentArabic = newsletter.ContentArabic,
                Category = newsletter.Category,
                CreatedDate = newsletter.CreatedDate,
                CreatedBy = newsletter.CreatedBy
            });
        }

        // POST: api/newsletters
        [HttpPost]
        public async Task<ActionResult<NewsletterDto>> Create(CreateNewsletterDto dto)
        {
            var newsletter = new Newsletter
            {
                Title = dto.Title,
                TitleArabic = dto.TitleArabic,
                Content = dto.Content,
                ContentArabic = dto.ContentArabic,
                Category = dto.Category,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy
            };

            _context.Newsletters.Add(newsletter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newsletter.NewsletterId }, new NewsletterDto
            {
                NewsletterId = newsletter.NewsletterId,
                Title = newsletter.Title,
                TitleArabic = newsletter.TitleArabic,
                Content = newsletter.Content,
                ContentArabic = newsletter.ContentArabic,
                Category = newsletter.Category,
                CreatedDate = newsletter.CreatedDate,
                CreatedBy = newsletter.CreatedBy
            });
        }

        // PUT: api/newsletters/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateNewsletterDto dto)
        {
            var newsletter = await _context.Newsletters.FindAsync(id);

            if (newsletter == null)
                return NotFound();

            newsletter.Title = dto.Title ?? newsletter.Title;
            newsletter.TitleArabic = dto.TitleArabic ?? newsletter.TitleArabic;
            newsletter.Content = dto.Content ?? newsletter.Content;
            newsletter.ContentArabic = dto.ContentArabic ?? newsletter.ContentArabic;
            newsletter.Category = dto.Category ?? newsletter.Category;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/newsletters/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var newsletter = await _context.Newsletters.FindAsync(id);

            if (newsletter == null)
                return NotFound();

            _context.Newsletters.Remove(newsletter);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    public class NewsletterDto
    {
        public int NewsletterId { get; set; }
        public string Title { get; set; }
        public string TitleArabic { get; set; }
        public string Content { get; set; }
        public string ContentArabic { get; set; }
        public string? Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }

    public class CreateNewsletterDto
    {
        public string Title { get; set; }
        public string TitleArabic { get; set; }
        public string Content { get; set; }
        public string ContentArabic { get; set; }
        public string? Category { get; set; }
        public int CreatedBy { get; set; }
    }

    public class UpdateNewsletterDto
    {
        public string? Title { get; set; }
        public string? TitleArabic { get; set; }
        public string? Content { get; set; }
        public string? ContentArabic { get; set; }
        public string? Category { get; set; }
    }

}
