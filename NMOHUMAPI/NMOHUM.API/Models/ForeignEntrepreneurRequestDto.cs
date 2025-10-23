using System.Collections.Generic;

namespace NMOHUM.API.Models
{
    public class ForeignEntrepreneurEntities
    {
        public class ForeignEntrepreneurRequestDto
        {
            // --- Basic Info ---
            public int EmployeeId { get; set; }
            public int ServiceId { get; set; }
            public string FullName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string CompanyOrStartupName { get; set; }
            public string CurrentLocation { get; set; }
            public string BusinessDescription { get; set; }
            public BusinessStage CurrentStage { get; set; }
            public string? OtherStageDetails { get; set; }
            public List<int> TargetIndustries { get; set; }
            public string? OtherIndustryDetails { get; set; }
            public SupportTimeframe Timeframe { get; set; }

            // --- Selected Services ---
            public List<ServiceType> Services { get; set; }

            //------ Documents ------
            public List<DocumentData> documentlist { get; set; }

            // --- Service-specific DTOs ---
            public EntrepreneurshipLicenseDto EntrepreneurshipLicense { get; set; }
            public MarketNavigatorDto MarketNavigator { get; set; }
            public ComplianceCatalystDto ComplianceCatalyst { get; set; }
            public VentureLaunchpadDto VentureLaunchpad { get; set; }
            public InnovationBuilderDto InnovationBuilder { get; set; }
            public CustomizedPackageDto CustomizedPackage { get; set; }
        }

        // ========== Service-specific DTOs ==========

        public class EntrepreneurshipLicenseDto
        {
            public bool? OnlyLicenseFacilitation { get; set; }
            public string OtherNeedsDescription { get; set; }
        }

        public class MarketNavigatorDto
        {
            public string TargetMarket { get; set; }
            public string KeyAssumptions { get; set; }
            public bool? HasMarketResearch { get; set; }
        }

        public class ComplianceCatalystDto
        {
            public string CompanyStructure { get; set; }
            public bool? HasIntellectualProperty { get; set; }
            public string LegalConcerns { get; set; }
        }

        public class VentureLaunchpadDto
        {
            public string FundingStage { get; set; }
            public decimal? TargetFundraisingAmount { get; set; }
            public decimal? EstimatedValuation { get; set; }
            public bool? HasMVP { get; set; }
            public string MVPLink { get; set; }
        }

        public class InnovationBuilderDto
        {
            public string DevelopmentStage { get; set; }
            public bool? HasSpecificationDoc { get; set; }
            public bool? SeekingCoFounder { get; set; }
            public string RolesDescription { get; set; }
            public bool? HasCodeOrDesign { get; set; }
            public string CodeOrDesignLinks { get; set; }
        }

        public class CustomizedPackageDto
        {
            public string DetailedRequest { get; set; }
            public string PrimaryObjectives { get; set; }
            public decimal? BudgetAmount { get; set; }
            public string BudgetCurrency { get; set; }
        }
        // Dropdowns / Multi-select enums

        public enum BusinessStage
        {
            IdeaStage = 1,
            ConceptOrValidation = 2,
            MVPOrPrototype = 3,
            EarlyRevenue = 4,
            Scaling = 5,
            Other = 99
        }

        public enum IndustryType
        {
            FinTech = 1,
            HealthTech = 2,
            EduTech = 3,
            ECommerce = 4,
            AI_ML = 5,
            SaaS = 6,
            CleanTech = 7,
            Logistics = 8,
            Tourism = 9,
            FoodAndBeverage = 10,
            Manufacturing = 11,
            Other = 99
        }

        public enum ServiceType
        {
            EntrepreneurshipLicenseGateway = 1,
            MarketNavigatorLicensePackage = 2,
            ComplianceCatalystLicensePackage = 3,
            VentureLaunchpadAccelerator = 4,
            InnovationBuilderLicensePackage = 5,
            CustomizedPackage = 99
        }

        public enum SupportTimeframe
        {
            Immediately_Within1Month = 1,
            OneToThreeMonths = 2,
            ThreeToSixMonths = 3,
            SixPlusMonths = 4
        }
    }
}
