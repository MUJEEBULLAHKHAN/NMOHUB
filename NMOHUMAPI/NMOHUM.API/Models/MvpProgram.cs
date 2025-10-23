using System;

namespace NMOHUM.API.Models
{
    public class MvpProgram
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectDescription { get; set; }
        public string DesiredTechStack { get; set; }
        public bool UiMockupsUploaded { get; set; }
        public string? MockupFileUrl { get; set; }
        public string PrototypeLink { get; set; }

        public DateTime DesiredLaunchDate { get; set; }
        public decimal EstimatedBudget { get; set; }

        public string? ApiSpecificationsUrl { get; set; }
        public string? DesignAssetsUrl { get; set; }
        
        public int EmployeeId { get; set; }
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
