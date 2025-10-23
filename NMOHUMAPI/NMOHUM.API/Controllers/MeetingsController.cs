using Google.Apis.Calendar.v3.Data;
using iText.Kernel.Pdf.Canvas.Parser.ClipperLib;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlX.XDevAPI.Common;
using NMOHUM.API.Models; // Added for NMOHUMAuthenticationContext
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;

        public MeetingsController(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        // GET: api/GetAllMeetings
        [HttpGet]
        [Route("GetAllMeetings")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllMeetings()
        {
            var meetings = await (from m in _context.Meetings
                                  join e in _context.Employee on m.EmployeeId equals e.EmployeeId
                                  join p in _context.ProjectRequest on m.ProjectID equals p.ProjectID
                                  select new {
                                      m.MeetingId,
                                      m.IsVirtual,
                                      m.Platform,
                                      m.Url,
                                      m.ProjectID,
                                      m.EmployeeId,
                                      m.Feedback,
                                      
                                      EmployeeName = (e.FirstNames + " " + e.LastName).Trim(),
                                      ProjectName = p.ProjectName
                                  }).ToListAsync();
            return Ok(meetings);
        }

        // GET: api/meetings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Meetings>> GetMeeting(int id)
        {
            var meeting = await _context.Meetings.FindAsync(id);
            return meeting == null ? NotFound() : meeting;
        }

        // POST: api/meetings
        [HttpPost]
        [Route("CreateNewMeeting")]
        public async Task<ActionResult<object>> CreateNewMeeting(Meetings meeting)
        {
            try
            {
                var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == meeting.SlotId);

                if (slot == null)
                    return Ok(new { success = false, message = "Slot not found" });

                if (slot.Status == "Booked")
                    return Ok(new { success = false, message = "Slot already booked" });

                slot.Status = "Booked";
                slot.BookedBy = meeting.EmployeeId;
                await _context.SaveChangesAsync();

                _context.Meetings.Add(meeting);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = meeting });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
           
        }

        // PUT: api/meetings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMeeting(int id, Meetings meeting)
        {
            if (id != meeting.MeetingId)
                return BadRequest();
            _context.Entry(meeting).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Meetings.Any(e => e.MeetingId == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // DELETE: api/meetings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeeting(int id)
        {
            var meeting = await _context.Meetings.FindAsync(id);
            if (meeting == null)
                return NotFound();
            _context.Meetings.Remove(meeting);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/GenerateMeetingSlot
        [HttpPost]
        [Route("GenerateMeetingSlot")]
        public async Task<ActionResult<List<MeetingSlots>>> GenerateMeetingSlotsAsync([FromBody] List<MeetingSlotRequest> inputSlots)
        {
            var createdSlots = new List<MeetingSlots>();

            foreach (var request in inputSlots)
            {

                if (request.IsMeetingRoomOne == false && request.IsMeetingRoomTwo == false)
                {
                    return Ok(new { success = false, message = "Please Select Room Number" });
                }

                bool exists = await _context.MeetingSlots
                    .AnyAsync(s => s.SlotDate == request.SlotDate && s.StartTime == request.StartTime);

                if (!exists)
                {
                    var newSlot = new MeetingSlots
                    {
                        SlotDate = request.SlotDate,
                        StartTime = request.StartTime,
                        EndTime = request.StartTime.Add(TimeSpan.FromMinutes(60)), // 1 hour duration
                        Status = "Available",
                        CreatedDate = DateTime.Now,
                        IsMeetingRoomOne = request.IsMeetingRoomOne,
                        IsMeetingRoomTwo = request.IsMeetingRoomTwo
                    };

                    _context.MeetingSlots.Add(newSlot);
                    createdSlots.Add(newSlot);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = createdSlots });
        }

        [HttpGet]
        [Route("GetAllMeetingSlots")]
        public async Task <object> GetAllMeetingSlotsAsync()
        {
            try
            {
                var slots = await _context.MeetingSlots.
                Select(p => new
                {
                    p.MeetingSlotId,
                    p.SlotDate,
                    p.StartTime,
                    p.EndTime,
                    p.Status,
                    p.BookedBy,

                    //StartTime = "10:00",
                    //EndTime = "10:00",
                    Id = p.MeetingSlotId,
                    Title = p.IsMeetingRoomOne == true ? "Meeting R - 1" : (p.IsMeetingRoomTwo == true ? "Meeting R - 2" : ""),
                    Date = p.SlotDate,
                    Type = p.Status == "Available" ? "green" : "gray",
                    p.IsMeetingRoomOne,
                    p.IsMeetingRoomTwo
                }).ToListAsync();

                return Ok(new { success = true, message = "Success", Data = slots });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message});
            }
            
        }
        [HttpGet]
        [Route("GetAllMeetingSlotsByEmpId")]
        public async Task<object> GetAllMeetingSlotsByEmpIdAsync(int EmpId)
        {
            try
            {
                var slots = await _context.MeetingSlots.Where(p=>p.BookedBy==EmpId).
                Select(p => new
                {
                    p.MeetingSlotId,
                    p.SlotDate,
                    p.StartTime,
                    p.EndTime,
                    p.Status,
                    p.BookedBy,

                    //StartTime = "10:00",
                    //EndTime = "10:00",
                    Id = p.MeetingSlotId,
                    Title = "Meeting",
                    Date = p.SlotDate,
                    Type = p.Status == "Available" ? "green" : "gray",
                }).ToListAsync();

                return Ok(new { success = true, message = "Success", Data = slots });
            }
            catch (Exception ex)
            {

                return Ok(new { success = false, message = ex.Message });
            }

        }
        static string convertDate(DateTime date)
        {
            TimeZoneInfo localZone = TimeZoneInfo.Local;
            TimeSpan offset = localZone.GetUtcOffset(date);

            string dayOfWeek = date.ToString("ddd", CultureInfo.InvariantCulture);
            string month = date.ToString("MMM", CultureInfo.InvariantCulture);
            string formattedDate = $"{dayOfWeek} {month} {date:dd yyyy HH:mm:ss} GMT{offset:hhmm}";

            // Adjust the GMT offset sign
            string gmtOffset = offset.Hours >= 0
                ? $"+{offset.Hours:D2}{offset.Minutes:D2}"
                : $"-{Math.Abs(offset.Hours):D2}{Math.Abs(offset.Minutes):D2}";

            string finalString = $"{dayOfWeek} {month} {date:dd yyyy HH:mm:ss} GMT{gmtOffset}";

            return finalString;
        }

        [HttpGet]
        [Route("GetAllDailyWiseSlotsAsync")]
        public async Task<ActionResult<IEnumerable<DailyMeetingSlotsResponse>>> GetAllDailyWiseSlotsAsync()
        {
            var slotsByDate = await _context.MeetingSlots
                .GroupBy(s => s.SlotDate)
                .Select(g => new DailyMeetingSlotsResponse
                {
                    SlotDate = g.Key,
                    Slots = g.ToList()
                })
                .ToListAsync();

            return Ok(slotsByDate);
        }

        // PUT: api/BookMeetingSlot/5
        [HttpPut]
        public async Task<string> BookMeetingSlotAsync(int slotId, int userId)
        {
            var slot = await _context.Set<MeetingSlots>().FirstOrDefaultAsync(s => s.MeetingSlotId == slotId);

            if (slot == null)
                return "Slot not found";

            if (slot.Status == "Booked")
                return "Slot already booked";

            slot.Status = "Booked";
            slot.BookedBy = userId;
            await _context.SaveChangesAsync();

            return "Booking successful";
        }

        // POST: api/GenerateTimeSlots
        [HttpPost]
        [Route("GenerateTimeSlots")]
        public async Task<ActionResult<List<MeetingSlots>>> GenerateTimeSlots([FromBody] List<SlotRequest> request)
        {
            if (request == null || !request.Any())
                return BadRequest("Invalid slot request.");

            var createdSlots = new List<MeetingSlots>();

            foreach (var dayRequest in request)
            {

                if (dayRequest.TimeSlots == null || !dayRequest.TimeSlots.Any())
                    continue;

                foreach (var timing in dayRequest.TimeSlots)
                {
                    bool exists = await _context.MeetingSlots
                        .AnyAsync(s => s.SlotDate == dayRequest.SlotDate && s.StartTime == timing.StartTime);

                    if (!exists)
                    {
                        var newSlot = new MeetingSlots
                        {
                            SlotDate = dayRequest.SlotDate,
                            StartTime = timing.StartTime,
                            EndTime = timing.StartTime.Add(TimeSpan.FromMinutes(60)), // 1 hour slot
                            Status = "Available",
                            BookedBy = 0, // Not booked yet
                            CreatedDate = DateTime.Now
                        };

                        _context.MeetingSlots.Add(newSlot);
                        createdSlots.Add(newSlot);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(createdSlots);
        }


        [HttpGet]
        [Route("GetAllAvailableSlot")]
        public async Task<ActionResult<IEnumerable<DailyMeetingSlotsResponse>>> GetAllAvailableSlot()
        {
            try
            {
                var slotsByDate = await _context.MeetingSlots
                .Where(x => x.SlotDate >= DateTime.Now.AddDays(-1) && x.Status == "Available")
                .GroupBy(s => s.SlotDate)
                .Select(g => new DailyMeetingSlotsResponse
                {
                    SlotDate = g.Key,
                    Slots = g.ToList()
                })
                .ToListAsync();

                return Ok(new { success = true, data = slotsByDate });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
            
        }

    }
    public class MeetingSlotRequest
    {
        public DateTime SlotDate { get; set; }  // 01/01/2024
        public TimeSpan StartTime { get; set; }  // 01:00:00

        public bool IsMeetingRoomOne { get; set; }
        public bool IsMeetingRoomTwo { get; set; }
    }

    public class SlotRequest
    {
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime SlotDate { get; set; }
        public List<TimingSlot> TimeSlots { get; set; }
    }
    public class TimingSlot
    {
        public TimeSpan StartTime { get; set; }
    }

    public class DailyMeetingSlotsResponse
    {
        public DateTime SlotDate { get; set; }
        public List<MeetingSlots> Slots { get; set; }
    }

}
