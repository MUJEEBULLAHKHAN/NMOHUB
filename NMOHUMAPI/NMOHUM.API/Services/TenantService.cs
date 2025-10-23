using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using iText.Layout.Element;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MySqlX.XDevAPI;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using NMOHUM.API.Models;
//using NMOHUM.API.Models.AutoMxModels.Payloads;
using NMOHUM.API.Models.KeyVaultDi;
//using NMOHUM.API.Models.TenantConfiguration;
using NMOHUM.API.Utilities;

namespace NMOHUM.API.Services
{
	public interface ITenantService
	{
		Task<string> GetConnectionByTenant();
		Task<string> GetConnectionByTenantInternal(string clientId);
		string PackageRawWorkshopConnectionStringViaNonHttpRequests(DbConnectionSettings WorkshopDB);
		DbConnectionSettings PackageWorkshopConnectionStringViaNonHttpRequests(string WorkshopDB);
	}
	public class TenantService : ITenantService
	{
		private readonly NMOHUMAuthenticationContext _context;
		private readonly HttpContext? _httpContext;
		private readonly DbConnectionSettings _connectionSettings;
		private readonly SecretClient _secretClient;
		private readonly KeyVaultConfig _keyVaultConfig;
		private readonly IMemoryCache _cache;
		private readonly ILogger<TenantService> _logger;

		public TenantService(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, NMOHUMAuthenticationContext context, DbConnectionSettings connectionSettings, 
			KeyVaultConfig keyVaultConfig, ILogger<TenantService> logger, SecretClient secretClient)
		{
			_context = context;
			_httpContext = httpContextAccessor.HttpContext;
			_connectionSettings = connectionSettings;
			_keyVaultConfig = keyVaultConfig;
			_cache = cache;
			_logger = logger;

			_secretClient = secretClient;
		}

		public async Task<string> GetConnectionByTenant()
		{
			try
			{
				_logger.LogInformation("Connection Map Start {Time}", DateTime.UtcNow);
				if (_httpContext == null)
					throw new Exception("Could not find Tenant Configuration...");


				var clientId = _httpContext.Request.Headers["XTenantId"].FirstOrDefault();
				// No tenant = fallback to auth DB
				if (string.IsNullOrEmpty(clientId))
				{
					return  BuildConnectionString(_connectionSettings.Database);
				}

				// Use in-memory cache to avoid hitting Key Vault repeatedly
				return await _cache.GetOrCreateAsync(clientId, async entry =>
				{
					entry.SlidingExpiration = TimeSpan.FromMinutes(60); 

					try
					{
						string secretName = "";
						if (_keyVaultConfig.KeyVaultEnviroment == "Development")
						{
							string _conn = $"server={_connectionSettings.Server};" +
							$"port={_connectionSettings.Port};" +
							$"user={_connectionSettings.User};" +
							$"password={_connectionSettings.Password};" +
							$"database={_connectionSettings.TenantDatabaseName};" +
							$"Convert Zero Datetime=True;Default Command Timeout=300000;";
							return _conn;
						}

						 secretName = $"tenant-workshop-id-{clientId}";
						_logger.LogInformation($"Connection With ClientId {clientId}");
						
						//KeyVaultSecret updatedSecret = await _secretClient.SetSecretAsync(secretName, "");
						KeyVaultSecret secret = await _secretClient.GetSecretAsync(secretName);
						
						return BuildDynamicConnectionString(secret.Value); 
					}
					catch (Exception ex)
					{
						_logger.LogInformation($"No DB Mapping");
						_logger.LogInformation($"DB Exception {ex.Message}");

						
						return null;
					}
				});
			
				
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
				throw;
			}
			
		}

		public async Task<string> GetConnectionByTenantInternal(string clientId)
		{
			try
			{
	
				// No tenant
				if (string.IsNullOrEmpty(clientId))
				{
					_logger.LogInformation($"No Mapping Found via WA Hook");
					return "";
				}

				// Use in-memory cache to avoid hitting Key Vault repeatedly
				return await _cache.GetOrCreateAsync(clientId, async entry =>
				{
					entry.SlidingExpiration = TimeSpan.FromMinutes(60);

					try
					{
						string secretName = "";
						if (_keyVaultConfig.KeyVaultEnviroment == "Development")
						{
							return $"server={_connectionSettings.Server};" +
							$"port={_connectionSettings.Port};" +
							$"user={_connectionSettings.User};" +
							$"password={_connectionSettings.Password};" +
							$"database={_connectionSettings.TenantDatabaseName};" +
							$"Convert Zero Datetime=True;Default Command Timeout=300000;";
						}

						secretName = $"tenant-workshop-id-{clientId}";
						_logger.LogInformation($"Connection With ClientId {clientId}");

						//KeyVaultSecret updatedSecret = await _secretClient.SetSecretAsync(secretName, "");
						KeyVaultSecret secret = await _secretClient.GetSecretAsync(secretName);

						return BuildDynamicConnectionString(secret.Value);
					}
					catch (Exception ex)
					{
						_logger.LogInformation($"No DB Mapping");
						_logger.LogInformation($"DB Exception {ex.Message}");


						return null;
					}
				});


			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
				throw;
			}

		}

		private string BuildConnectionString(string dbName)
		{

			
			//string secretName = "";
			//if (_keyVaultConfig.KeyVaultEnviroment == "Development")
			//{
			//	return $"server={_connectionSettings.Server};" +
			//	$"port={_connectionSettings.Port};" +
			//	$"user={_connectionSettings.User};" +
			//	$"password={_connectionSettings.Password};" +
			//	$"database={dbName};" +
			//	$"Convert Zero Datetime=True;Default Command Timeout=300000;";
			//}


			return $"server={_connectionSettings.Server};" +
				$"port={_connectionSettings.Port};" +
				$"user={_connectionSettings.User};" +
				$"password={_connectionSettings.Password};" +
				$"database={_connectionSettings.Database};" +
				$"Convert Zero Datetime=True;Default Command Timeout=300000;";

		}

		private string BuildDynamicConnectionString(string data)
		{
			string[] _properties = data.Split(';');
			string ip = _properties[0];
			string port = _properties[1];
			string user = _properties[2];
			string password = _properties[3];
			string database = _properties[4];

			_logger.LogInformation($"Connection logged with {database}");

			return $"server={ip};" +
				   $"port={port};" +
				   $"user={user};" +
				   $"password={password};" +
				   $"database={database};" +
				   $"Convert Zero Datetime=True;Default Command Timeout=300000;";
		}

		public DbConnectionSettings PackageWorkshopConnectionStringViaNonHttpRequests(string WorkshopDB)
		{
			if(String.IsNullOrEmpty(WorkshopDB))
			{
				return null;
			}

			try
			{
				
				_logger.LogInformation($"Trying To Resolve DB Connection With ClientId {WorkshopDB}");

				KeyVaultSecret secret = _secretClient.GetSecretAsync(WorkshopDB).GetAwaiter().GetResult();

				string[] _properties = secret.Value.Split(';');
				string ip = _properties[0];
				string port = _properties[1];
				string user = _properties[2];
				string password = _properties[3];
				string database = _properties[4];

				_logger.LogInformation($"Connection logged with {database}");

				string connectionString = $"server={ip};" +
					   $"port={port};" +
					   $"user={user};" +
					   $"password={password};" +
					   $"database={database};" +
					   $"Convert Zero Datetime=True;Default Command Timeout=300000;";

				

				return ParseConnectionString(connectionString);
			}
			catch (Exception ex)
			{
				return null;
			}
			
		}

		public string PackageRawWorkshopConnectionStringViaNonHttpRequests(DbConnectionSettings _connectionSettings)
		{
			if (String.IsNullOrEmpty(_connectionSettings.Server))
			{
				return null;
			}

			string connectionString = $"server={_connectionSettings.Server};port={_connectionSettings.Port};user={_connectionSettings.User}; password={_connectionSettings.Password};database={_connectionSettings.Database};Convert Zero Datetime=True;Default Command Timeout=300000;";

			return connectionString;
		}

		private DbConnectionSettings ParseConnectionString(string connectionString)
		{
			var connectionDetails = new DbConnectionSettings();
			var parts = connectionString.Split(';');

			foreach (var part in parts)
			{
				var keyValue = part.Split('=');

				if (keyValue.Length == 2)
				{
					var key = keyValue[0].Trim().ToLower();
					var value = keyValue[1].Trim();

					
					switch (key)
					{
						case "server":
							connectionDetails.Server = value;
							break;
						case "port":
							connectionDetails.Port = value;
							break;
						case "user":
							connectionDetails.User = value;
							break;
						case "password":
							connectionDetails.Password = value;
							break;
						case "database":
							connectionDetails.Database = value;
							break;
						
						default:
							
							break;
					}
				}
			}

			return connectionDetails;
		}





	}

	
}
