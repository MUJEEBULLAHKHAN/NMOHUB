using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Utilities;
using System;
using System.Data;
using System.Data.Common;


namespace NMOHUM.API.Models
{
	public class NMOHUMAuthenticationContext : IdentityDbContext
	{

		private DbCommand _dbCommand { get; set; }
		private string _connectionString { get; set; }
		private readonly DbConnectionSettings _connectionSettings;
		public NMOHUMAuthenticationContext(DbConnectionSettings connectionSettings)
		{
			_connectionSettings = connectionSettings;
			_connectionString = $"server={_connectionSettings.Server};port={_connectionSettings.Port};user={_connectionSettings.User}; password={_connectionSettings.Password};database={_connectionSettings.Database};Convert Zero Datetime=True;Default Command Timeout=300000;";
		}

		#region Database Reference Models
		
		public virtual DbSet<Employee> Employee { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<ProjectArea> ProjectArea { get; set; }
        public virtual DbSet<ProjectPhase> ProjectPhase { get; set; }
        public virtual DbSet<ServicePhase> ServicePhase { get; set; }
        public virtual DbSet<PaymentStatus> PaymentStatuse { get; set; }
        public virtual DbSet<Entrepreneur> Entrepreneur { get; set; }

        public virtual DbSet<Service> Service { get; set; }
        public virtual DbSet<Package> Package { get; set; }
        public virtual DbSet<PackageRequest> PackageRequest { get; set; }
        public virtual DbSet<AdminPages> AdminPages { get; set; }

        public virtual DbSet<ServiceRequest> ServiceRequest { get; set; }
        public DbSet<RequestPaymentGatewayDetails> RequestPaymentGatewayDetails { get; set; }
        public DbSet<ResponsePaymentGatewayDetails> ResponsePaymentGatewayDetails { get; set; }

        // Project Management Models
        public virtual DbSet<ProjectRequest> ProjectRequest { get; set; }
        public virtual DbSet<Partner> Partner { get; set; }
        public virtual DbSet<ProjectActivity> ProjectActivity { get; set; }
        public virtual DbSet<OtherProgramAttend> OtherProgramAttend { get; set; }
        public virtual DbSet<Documents> Documents { get; set; }
        public virtual DbSet<Notes> Notes { get; set; }
        public virtual DbSet<Evaluate> Evaluate { get; set; }
        public virtual DbSet<SupportNeeds> SupportNeeds { get; set; }
        public virtual DbSet<ProjectStatus> ProjectStatus { get; set; }
        public virtual DbSet<Meetings> Meetings { get; set; }
        public virtual DbSet<MeetingSlots>  MeetingSlots { get; set; }
        //public virtual DbSet<TowingDetails> TowingDetails { get; set; }
       
        public virtual DbSet<UserTokens> UserTokens { get; set; }
	
        public virtual DbSet<Country> Country { get; set; }
		
        public virtual DbSet<Transactions> Transactions { get; set; }

        public virtual DbSet<ConfigureValue> ConfigureValue { get; set; }
        public virtual DbSet<PaymentActivity> PaymentActivity { get; set; }
        public virtual DbSet<MvpProgram> MvpProgram { get; set; }
        public virtual DbSet<FeasibilityStudy> FeasibilityStudy { get; set; }
        public virtual DbSet<PreAccelerator> PreAccelerator { get; set; }
        public virtual DbSet<ServiceStatus> ServiceStatus { get; set; }
        public virtual DbSet<ServiceActivity> ServiceActivity { get; set; }
        public virtual DbSet<Newsletter>  Newsletters { get; set; }

        public DbSet<ForeignEntrepreneur> ForeignEntrepreneur { get; set; }

        // Service-specific tables
        public DbSet<EntrepreneurshipLicense> EntrepreneurshipLicense { get; set; }
        public DbSet<MarketNavigator> MarketNavigator { get; set; }
        public DbSet<ComplianceCatalyst> ComplianceCatalyst { get; set; }
        public DbSet<VentureLaunchpad> VentureLaunchpad { get; set; }
        public DbSet<InnovationBuilder> InnovationBuilder { get; set; }
        public DbSet<CustomizedPackage> CustomizedPackage { get; set; }
        public virtual DbSet<ForeignerStatus> ForeignerStatus { get; set; }

        public virtual DbSet<MeetingAccessRoom> MeetingAccessRoom { get; set; }
        public virtual DbSet<MeetingAccessRoomRequest> MeetingAccessRoomRequest { get; set; }
        public virtual DbSet<ClosedOffice> ClosedOffice { get; set; }
        public virtual DbSet<ClosedOfficeRequest> ClosedOfficeRequest { get; set; }
        public virtual DbSet<CoWorkingSpace> CoWorkingSpace { get; set; }
        public virtual DbSet<CoWorkingSpaceRequest> CoWorkingSpaceRequest { get; set; }
        public virtual DbSet<VirtualOffice> VirtualOffice { get; set; }
        public virtual DbSet<VOPackages> VOPackages { get; set; }
        public virtual DbSet<VirtualOfficeRequest> VirtualOfficeRequest { get; set; }

        public virtual DbSet<Expert> Expert { get; set; }
        public virtual DbSet<ExpertAvailability> ExpertAvailability { get; set; }
        public virtual DbSet<ExpertAreaOfExpertise> ExpertAreaOfExpertise { get; set; }
        public virtual DbSet<AreaOfExpertise> AreaOfExpertise { get; set; }
        public virtual DbSet<ExpertFeedback> ExpertFeedback { get; set; }
        public virtual DbSet<ExpertBooking> ExpertBooking { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<ForeignPackage> ForeignPackage { get; set; }
        #endregion


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			if (!optionsBuilder.IsConfigured)
			{
				optionsBuilder.UseMySQL(_connectionString);
			}
		}

		public T RawSQL<T>(string queryString)
		{
			string jsonString = "[";
			try
			{
				using (DbConnection connection = new MySqlConnection(_connectionString))
				{
					_dbCommand = new MySqlCommand();
					DbCommand command = _dbCommand;
					command.CommandText = queryString;
					command.Connection = connection;
					connection.Open();
					DbProviderFactory factory = DbProviderFactories.GetFactory(connection);

					DbDataAdapter adapter = factory.CreateDataAdapter();
					adapter.SelectCommand = command;


					// Fill the DataTable.
					DataTable table = new DataTable();
					adapter.Fill(table);

					int r = 1;
					//  Display each row and column value.
					int rowCount = table.Rows.Count;
					foreach (DataRow row in table.Rows)
					{
						jsonString += "{";
						int i = 1;
						int columnCount = table.Columns.Count;
						foreach (DataColumn column in table.Columns)
						{

							string type = row[column].GetType().Name;
							if (type.ToLower().Contains("Date".ToLower()))
							{

							}
							if (row[column] != null)
								jsonString += $"\"{column}\"" + ":" + ((type.ToLower() == "DbNull".ToLower()) ? $"\"\"{(columnCount > i ? ", " : "")}" : (type.ToLower() == "string" || type.ToLower() == "double") ? $"\"{row[column]}\"{(columnCount > i ? "," : "")}" : $"{row[column]}{(columnCount > i ? "," : "")}");
							i++;

						}

						jsonString += "}" + $"{(rowCount > r ? "," : "")}";
						r++;
					}
				}
			}
			catch (Exception x)
			{

				throw;
			}
			jsonString += "]";
			return JsonConvert.DeserializeObject<T>(jsonString);
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

			
		}
	}
}

