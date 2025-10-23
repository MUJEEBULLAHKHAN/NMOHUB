using System;
using System.Collections.Generic;

namespace NMOHUM.API.Models
{
    // Expert DTO
    public class ExpertDto
    {
        public int? ExpertID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Nationality { get; set; }
        public string IDType { get; set; }
        public string IDNumber { get; set; }
        public string ProfilePicture { get; set; }
        //public DocumentData profiileBase64 { get; set; }
        public int ExperienceYears { get; set; }
        public string EducationDetails { get; set; }
        public string LinkedInProfileURL { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<int> AreaOfExpertiseIDs { get; set; } // <-- Add this
        public List<string> AreaOfExpertiseNames { get; internal set; }
    }

    public class ExpertAvailabilityDto
    {
        public int? AvailabilityId { get; set; }
        public int ExpertId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public AvailabilityStatus Status { get; set; }
        public MeetingType MeetingType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ExpertAreaOfExpertiseDto
    {
        public int ExpertID { get; set; }
        public int AreaOfExpertiseID { get; set; }
    }

    public class AreaOfExpertiseDto
    {
        public int AreaOfExpertiseID { get; set; }
        public string Name { get; set; }
    }

    public class ExpertFeedbackDto
    {
        public int? FeedbackId { get; set; }
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int ExpertId { get; set; }
        public int Rating { get; set; }
        public string FeedbackText { get; set; }
        public DateTime? SubmittedAt { get; set; }
    }

    public class ExpertBookingDto
    {
        public int? BookingId { get; set; }
        public int ExpertId { get; set; }
        public int BookedBy { get; set; }
        public int ProjectId { get; set; }
        public int AvailabilityId { get; set; }
        public DateTime SessionDateTime { get; set; }
        public string MeetingType { get; set; }
        public string BookingStatus { get; set; }
        public string PaymentStatus { get; set; }
        public int? PaymentId { get; set; }
        public string SessionLink { get; set; }
        public string LocationDetails { get; set; }
        public string CancellationReason { get; set; }
        public string RescheduleHistory { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class AvailabilitySlotRequest
    {
        public int ExpertId { get; set; }
        public DateTime SlotDate { get; set; }  // 01/01/2024
        public TimeSpan StartTime { get; set; }  // 01:00:00

        public bool IsPhysical { get; set; }
        public bool IsVirtual { get; set; }

    }

    public class DailyAvailabilitySlotRequest
    {
        public int ExpertId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime SlotDate { get; set; }
        public bool IsPhysical { get; set; }
        public bool IsVirtual { get; set; }
        public List<AvailabilitySlot> TimeSlots { get; set; }
    }
    public class AvailabilitySlot
    {
        public TimeSpan StartTime { get; set; }
    }
}
