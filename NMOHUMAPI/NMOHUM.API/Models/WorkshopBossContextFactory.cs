using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using NMOHUM.API.Services;

namespace NMOHUM.API.Models
{
	public interface INMOHUMContextFactory
	{
		//NMOHUMContext CreateDbContext(); // from tenant
		//NMOHUMContext CreateInternalDynamicTenantDbContext(string connectionString); // manual override
	}

	//public class NMOHUMContextFactory : INMOHUMContextFactory
	//{
	//	private readonly ITenantService _tenantService;

	//	public NMOHUMContextFactory(ITenantService tenantService)
	//	{
	//		_tenantService = tenantService;
	//	}

	//	public NMOHUMContext CreateDbContext()
	//	{
	//		var optionsBuilder = new DbContextOptionsBuilder<NMOHUMContext>();

	//		// Block async since OnConfiguring isn't async-safe
	//		var connectionString = _tenantService.GetConnectionByTenant().GetAwaiter().GetResult();

	//		optionsBuilder.UseMySQL(connectionString);

	//		return new NMOHUMContext(optionsBuilder.Options);
	//	}

	//	public NMOHUMContext CreateInternalDynamicTenantDbContext(string connectionString)
	//	{
	//		var optionsBuilder = new DbContextOptionsBuilder<NMOHUMContext>();

	//		optionsBuilder.UseMySQL(connectionString);

	//		return new NMOHUMContext(optionsBuilder.Options);
	//	}


	//}
}
