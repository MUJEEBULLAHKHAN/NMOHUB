using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using NMOHUM.API.Utilities;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly IFileStorageServiceHandler _fileStorageServiceHandler;

        public DocumentsController(NMOHUMAuthenticationContext context, IFileStorageServiceHandler fileStorageServiceHandler)
        {
            _context = context;
            _fileStorageServiceHandler = fileStorageServiceHandler;
        }

        // GET: api/documents
        [HttpGet]
        [Route("GetDocuments")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetDocuments()
        {
            return await _context.Documents.ToListAsync();
        }

        // GET: api/documents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Documents>> GetDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            return document == null ? NotFound() : document;
        }

        // GET: api/documents/project/5
        [HttpGet("project/{projectId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetDocumentsByProject(int projectId, int serviceId)
        {
            return await _context.Documents
                .Where(d => d.ProjectID == projectId && d.ServiceId==serviceId && d.IsActive)
                .ToListAsync();
        }

        // GET: api/documents/public
        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetPublicDocuments()
        {
            return await _context.Documents
                .Where(d => d.IsPublic && d.IsActive)
                .ToListAsync();
        }

        // GET: api/documents/type/{documentType}
        [HttpGet("type/{documentType}")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetDocumentsByType(string documentType)
        {
            return await _context.Documents
                .Where(d => d.DocumentType == documentType && d.IsActive)
                .ToListAsync();
        }

        // POST: api/documents
        [HttpPost]
        public async Task<ActionResult<Documents>> CreateDocument(Documents document)
        {
            document.CreateAt = System.DateTime.Now;
            document.IsActive = true;
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocument), new { id = document.DocumentId }, document);
        }

        // PUT: api/documents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(int id, Documents document)
        {
            if (id != document.DocumentId)
                return BadRequest();

            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Documents.Any(e => e.DocumentId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // PUT: api/documents/5/deactivate
        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
                return NotFound();

            document.IsActive = false;
            _context.Entry(document).State = EntityState.Modified;

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

        // DELETE: api/documents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
                return NotFound();

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("UploadDocument")]
        public IActionResult UploadDocument([FromBody] UploadDocumentVM model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //// Generate file name if not provided
            //var fileName = string.IsNullOrWhiteSpace(model.FileName)
            //    ? $"{DateTime.Now:yyyyMMddHHmmssfff}{model.Extension}"
            //    : model.FileName;

            var fileName = DateTime.Now.ToString("ddMMyyyHHmmss") + model.Extension;

            _fileStorageServiceHandler.StoreBlob(
                model.Base64Data,
                model.Extension,
                model.ProjectId, model.ServiceId,
                model.EmployeeId,
                fileName,
                model.DocumentType,
                "Other");

            // Find the document just created
            var document = _context.Documents
                .OrderByDescending(d => d.CreateAt)
                .FirstOrDefault(d => d.ProjectID == model.ProjectId && d.Name == fileName);

            if (document == null)
                return StatusCode(500, new { success = false, message = "Document saved to storage but not found in database." });

            return Ok(new { success = true, data = document });
        }

        // GET: api/documents/project/5
        [HttpGet("ClosedOffice/{closedOfficeRequestId}")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetDocumentsClosedOffice(int closedOfficeRequestId)
        {
            try
            {
                var document = await _context.Documents
                .Where(d => d.ClosedOfficeRequestId == closedOfficeRequestId)
                .ToListAsync();
                return Ok(new { success = true, data = document });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });

            }

        }
    }
} 