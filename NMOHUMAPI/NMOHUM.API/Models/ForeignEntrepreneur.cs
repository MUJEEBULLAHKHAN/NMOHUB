using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static NMOHUM.API.Models.ForeignEntrepreneurEntities;

namespace NMOHUM.API.Models
{
    public class ForeignEntrepreneur 
    {
        [Key]
        public int ForeignEntrepreneurId { get; set; }
        public int ServiceId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [MaxLength(500)]
        public string BusinessDescription { get; set; }
        public int StatusId { get; set; }

        public int CurrentStage { get; set; }

        [MaxLength(200)]
        public string? OtherStageDetails { get; set; }

        [MaxLength(200)]
        public string? OtherIndustryDetails { get; set; }

        public int Timeframe { get; set; }

        [MaxLength(200)]
        public string TargetIndustries { get; set; } // CSV storage

        public DateTime CreatedAt { get; set; } 
    }

    public class EntrepreneurshipLicense
    {
        [Key]
        public int Id { get; set; }
        public int ForeignEntrepreneurId { get; set; }


        public bool? OnlyLicenseFacilitation { get; set; }
        public string OtherNeedsDescription { get; set; }
    }

    public class MarketNavigator
    {
        [Key]
        public int Id { get; set; }
        public int ForeignEntrepreneurId { get; set; }

        

        public string TargetMarket { get; set; }
        public string KeyAssumptions { get; set; }
        public bool? HasMarketResearch { get; set; }
    }

    public class ComplianceCatalyst
    {
        [Key]
        public int Id { get; set; }
        public int ForeignEntrepreneurId { get; set; }


        public string CompanyStructure { get; set; }
        public bool? HasIntellectualProperty { get; set; }
        public string LegalConcerns { get; set; }
    }

    public class VentureLaunchpad
    {
        [Key]
        public int Id { get; set; }
        public int ForeignEntrepreneurId { get; set; }

        public string FundingStage { get; set; }
        public decimal? TargetFundraisingAmount { get; set; }
        public decimal? EstimatedValuation { get; set; }
        public bool? HasMVP { get; set; }
        public string MVPLink { get; set; }
    }

    public class InnovationBuilder
    {
        [Key]
        public int Id { get; set; }
        public int ForeignEntrepreneurId { get; set; }

      
        public string DevelopmentStage { get; set; }
        public bool? HasSpecificationDoc { get; set; }
        public bool? SeekingCoFounder { get; set; }
        public string RolesDescription { get; set; }
        public bool? HasCodeOrDesign { get; set; }
        public string CodeOrDesignLinks { get; set; }
    }

    public class CustomizedPackage
    {
        [Key]
        public int CustomizedPackageId { get; set; }
        public string ServiceName { get; set; }
        public int MeetingRoomAccessRequiredHour { get; set; }
        public int CoWorkingSpaceMonthly { get; set; }
        public int CoWorkingSpaceRequiredSeats { get; set; }
        public int ClosedOfficeMonthly { get; set; }
        public int ClosedOfficeSizeRequest { get; set; }
        public decimal BudgetAmount { get; set; }
        public string Description { get; set; }
        public int EmployeeId { get; set; }
        public string Status { get; set; } // Submit // Reject // Approve // Activate 
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public int CreatedBy { get; set; }

        [NotMapped]
        public string EmailAddress { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string MobileNumber { get; set; }

        [NotMapped]
        public string NationalID { get; set; }

        [NotMapped]
        public string CommercialRegistration { get; set; }

        [NotMapped]
        public string CompanyName { get; set; }

        [NotMapped]
        public string Otp { get; set; }
    }
}
