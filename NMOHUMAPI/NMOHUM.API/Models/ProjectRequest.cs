using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class ProjectRequest
    {
        [Key]
        public int ProjectID { get; set; }
        public int ServiceId { get; set; }
        public int EmployeeId { get; set; }
        public string ProjectName { get; set; }
        public int? PackageId { get; set; }
        public DateTime CreateAt { get; set; }
        public int StatusId { get; set; }
        public int Duration { get; set; }
        public DateTime? ProgramStarted { get; set; }
        public DateTime? ProgramEnd { get; set; }
        public string BriefDescription { get; set; }
        public int ProjectPhaseId { get; set; }
        public int ProjectAreaID { get; set; }
        public bool IsEvaluate { get; set; }
        public double? AggregateScore { get; set; }
        public int? CurrentPhaseId { get; set; }
        public bool IsPartnerAvailable { get; set; }
        public bool AlreadyParticipatedProgram { get; set; }
        public bool IsWrittenBusinessPlan { get; set; }
        public string HopeAchieve { get; set; }
        public string SupportsNeeds { get; set; }
        public string CaseId { get; set; } = string.Empty;

        public DateTime? FollowUpStart { get; set; }
        public DateTime? FollowUpEnd { get; set; }
    }
} 