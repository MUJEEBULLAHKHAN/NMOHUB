using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NMOHUM.API.Migrations
{
    /// <inheritdoc />
    public partial class ConvoChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

         
       
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "accounting_expenses");

            migrationBuilder.DropTable(
                name: "AccountingCompanyReference");

            migrationBuilder.DropTable(
                name: "AlternateContact");

            migrationBuilder.DropTable(
                name: "AnswerTypes");

            migrationBuilder.DropTable(
                name: "AppointmentScheduleBook");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AssesorCompany");

            migrationBuilder.DropTable(
                name: "AuadtexCredentials");

            migrationBuilder.DropTable(
                name: "audatex_block_codes");

            migrationBuilder.DropTable(
                name: "AudatexAuth");

            migrationBuilder.DropTable(
                name: "AudatexShellAssessments");

            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "CategoryType");

            migrationBuilder.DropTable(
                name: "ClaimHandler");

            migrationBuilder.DropTable(
                name: "ClaimHistory");

            migrationBuilder.DropTable(
                name: "ClientVehicles");

            migrationBuilder.DropTable(
                name: "communication_methods");

            migrationBuilder.DropTable(
                name: "CompanyTypes");

            migrationBuilder.DropTable(
                name: "ContactClient");

            migrationBuilder.DropTable(
                name: "CourtesyCarLog");

            migrationBuilder.DropTable(
                name: "csi_companies");

            migrationBuilder.DropTable(
                name: "csi_companies_manufacturer_approvals");

            migrationBuilder.DropTable(
                name: "csi_job_submission_detail");

            migrationBuilder.DropTable(
                name: "csi_master_submission_detail");

            migrationBuilder.DropTable(
                name: "Currency");

            migrationBuilder.DropTable(
                name: "DepartmentCategories");

            migrationBuilder.DropTable(
                name: "DepartmentReference");

            migrationBuilder.DropTable(
                name: "Disclaimers");

            migrationBuilder.DropTable(
                name: "DocumentTemplate");

            migrationBuilder.DropTable(
                name: "DocumentTypes");

            migrationBuilder.DropTable(
                name: "EmailTemplate");

            migrationBuilder.DropTable(
                name: "EmployeeWorkshops");

            migrationBuilder.DropTable(
                name: "ExternalCompanyEmails");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "InsuranceClaim");

            migrationBuilder.DropTable(
                name: "InvoiceData");

            migrationBuilder.DropTable(
                name: "Invoicelineitem");

            migrationBuilder.DropTable(
                name: "job_task_details");

            migrationBuilder.DropTable(
                name: "job_task_quote_item");

            migrationBuilder.DropTable(
                name: "JobActivities");

            migrationBuilder.DropTable(
                name: "JobActivityStatusAssignedEmployee");

            migrationBuilder.DropTable(
                name: "JobCards");

            migrationBuilder.DropTable(
                name: "JobStatus");

            migrationBuilder.DropTable(
                name: "Labour");

            migrationBuilder.DropTable(
                name: "Outwork");

            migrationBuilder.DropTable(
                name: "Paint");

            migrationBuilder.DropTable(
                name: "PaintedPanels");

            migrationBuilder.DropTable(
                name: "part_status_history");

            migrationBuilder.DropTable(
                name: "part_status_options");

            migrationBuilder.DropTable(
                name: "part_types");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "quality_control_questions");

            migrationBuilder.DropTable(
                name: "RepairTypes");

            migrationBuilder.DropTable(
                name: "return_for_credits_reasons");

            migrationBuilder.DropTable(
                name: "Stock");

            migrationBuilder.DropTable(
                name: "StockItemType");

            migrationBuilder.DropTable(
                name: "StockOrder");

            migrationBuilder.DropTable(
                name: "StockPurchase");

            migrationBuilder.DropTable(
                name: "StockTransaction");

            migrationBuilder.DropTable(
                name: "SuppliedParts");

            migrationBuilder.DropTable(
                name: "SurveyDetail");

            migrationBuilder.DropTable(
                name: "SurveyMaster");

            migrationBuilder.DropTable(
                name: "task_reference_descriptions");

            migrationBuilder.DropTable(
                name: "TatSchedule");

            migrationBuilder.DropTable(
                name: "TowingDetails");

            migrationBuilder.DropTable(
                name: "UnitOfMeasure");

            migrationBuilder.DropTable(
                name: "UploadDocument");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "vehicle_parts_quoteitems");

            migrationBuilder.DropTable(
                name: "VehicleBodyTypes");

            migrationBuilder.DropTable(
                name: "whatsapp_conversations");

            migrationBuilder.DropTable(
                name: "whatsapp_template_variables");

            migrationBuilder.DropTable(
                name: "whatsapp_templates");

            migrationBuilder.DropTable(
                name: "workshop_notifications");

            migrationBuilder.DropTable(
                name: "workshop_vehicle_manufacturer_approvals");

            migrationBuilder.DropTable(
                name: "WorkshopBankAccounts");

            migrationBuilder.DropTable(
                name: "WorkShopCourtesyCars");

            migrationBuilder.DropTable(
                name: "WorkshopCSIFields");

            migrationBuilder.DropTable(
                name: "WorkshopCSIPackage");

            migrationBuilder.DropTable(
                name: "WorkshopEmailType");

            migrationBuilder.DropTable(
                name: "WorkshopInsurerRates");

            migrationBuilder.DropTable(
                name: "WorkshopNotes");

            migrationBuilder.DropTable(
                name: "WorkshopSmsTemplates");

            migrationBuilder.DropTable(
                name: "WorkshopSurveyAnswers");

            migrationBuilder.DropTable(
                name: "WorkshopSurveyQuestions");

            migrationBuilder.DropTable(
                name: "accounting_expense_categories");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Assessor");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Broker");

            migrationBuilder.DropTable(
                name: "ActivityStatus");

            migrationBuilder.DropTable(
                name: "PaidByType");

            migrationBuilder.DropTable(
                name: "PaymentFor");

            migrationBuilder.DropTable(
                name: "PaymentMethod");

            migrationBuilder.DropTable(
                name: "PaymentType");

            migrationBuilder.DropTable(
                name: "Part");

            migrationBuilder.DropTable(
                name: "DepartmentType");

            migrationBuilder.DropTable(
                name: "CompanyBranch");

            migrationBuilder.DropTable(
                name: "QuoteItem");

            migrationBuilder.DropTable(
                name: "RepairMethod");

            migrationBuilder.DropTable(
                name: "QuoteItemType");

            migrationBuilder.DropTable(
                name: "Quote");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "ClientVehicle");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "JobTypes");

            migrationBuilder.DropTable(
                name: "Workshops");

            migrationBuilder.DropTable(
                name: "Color");

            migrationBuilder.DropTable(
                name: "ModelType");

            migrationBuilder.DropTable(
                name: "Country");

            migrationBuilder.DropTable(
                name: "Make");
        }
    }
}
