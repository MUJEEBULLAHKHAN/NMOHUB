using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    // Expert main entity
    public class Expert
    {
        [Key]
        public int ExpertID { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Nationality { get; set; }
        public string IDType { get; set; } // "National ID", "Iqama", "Passport"
        public string IDNumber { get; set; }
        public string ProfilePicture { get; set; }
        public int ExperienceYears { get; set; }
        public string EducationDetails { get; set; }
        public string LinkedInProfileURL { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
  

    // Expert availability entity
    public class ExpertAvailability
    {
        [Key]
        public int AvailabilityId { get; set; }
        [Required]
        public int ExpertId { get; set; }
        public Expert Expert { get; set; }
        [Required]
        public DateTime AvailableSlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
        [Required]
        public string Status { get; set; }
      
        public bool IsPhysical { get; set; }
        public bool IsVirtual { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
    }
    public enum AvailabilityStatus
    {
        Available,
        Booked
    }
    public enum MeetingType
    {
        Virtual,
        Physical
    }

    // Relational tables for multi-selects
    public class ExpertAreaOfExpertise
    {
        [Key]
        public int Id { get; set; } // Primary key
        public int ExpertID { get; set; }
        public int AreaOfExpertiseID { get; set; }
    }
    public class AreaOfExpertise
    {
        [Key]
        public int AreaOfExpertiseID { get; set; }
        public string Name { get; set; }
    }
  

    // Expert feedback entity
    public class ExpertFeedback
    {
        [Key]
        public int FeedbackId { get; set; }
        [Required]
        public int BookingId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int ExpertId { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string FeedbackText { get; set; }
        public DateTime SubmittedAt { get; set; }
    }

    // Expert booking entity
    public class ExpertBooking
    {
        [Key]
        public int BookingId { get; set; }
        [Required]
        public int ExpertId { get; set; }
        public Expert Expert { get; set; }
        [Required]
        public int BookedBy { get; set; }
        [Required]
        public int AvailabilityId { get; set; }
        public ExpertAvailability Availability { get; set; }
        [Required]
        public DateTime SessionDateTime { get; set; }
        [Required]
        public string MeetingType { get; set; }
        [Required]
        public string BookingStatus { get; set; } // Pending, Confirmed, Cancelled, etc.
        [Required]
        public string PaymentStatus { get; set; } // Paid, Pending, Refunded
        public int? PaymentId { get; set; }
        public string SessionLink { get; set; }
        public string LocationDetails { get; set; }
        public string CancellationReason { get; set; }
        public string RescheduleHistory { get; set; } // text/json
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
