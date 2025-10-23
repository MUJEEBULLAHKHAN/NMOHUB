using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.Formats.Asn1;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using NMOHUM.API.Models;
//using NMOHUM.API.Services;
//using NMOHUM.API.Utilities.SecurityUtilities;

namespace NMOHUM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReferencesController : ControllerBase
    {
        //private readonly NMOHUMContext _context;
        private readonly NMOHUMAuthenticationContext _masterContext;
        //private ICompanyService _companyService;
        //private AccountingExpenseService _accountingExpenseService;
        //private CsvHelperService _csvHelperService;
        public ReferencesController(NMOHUMAuthenticationContext NMOHUMAuthenticationContext)
        {
            //_context = context;
            //_companyService = companyService;
            //_accountingExpenseService = accountingExpenseService;
            //_csvHelperService = csvHelperService;
            _masterContext = NMOHUMAuthenticationContext;
        }

		//      [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//      [HttpGet]
		//      [Route("AllBrokers")]
		//      public async Task<List<Broker>> GetAllBrokers()
		//      {
		//          return await _context.Broker.ToListAsync();
		//      }

		//      //  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
		[HttpGet]
		[Route("AllEmployees")]
		public async Task<List<Employee>> GetAllEmployees(int? workshopId)
		{
			if (workshopId == null)
			{
				// workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);
			}
			var df = workshopId.GetValueOrDefault(0);
			return await _masterContext.Employee.ToListAsync();
		}

		//      [HttpGet]
		//      [Route("AllEmployeeAndRole")]
		//      public async Task<object> GetAllEmployeeAndRole(int? workshopId)
		//      {
		//          if (workshopId == null)
		//          {
		//              workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);
		//          }
		//          var df = workshopId.GetValueOrDefault(0);
		//          //return await _context.Employee.Where(a => a.WorkshopId == workshopId.GetValueOrDefault(0)).ToListAsync();

		//          var employee = (from e in _context.Employee
		//                          join ur in _context.UserRoles
		//                          on e.UserId equals ur.UserId
		//                          join r in _context.Roles
		//                          on ur.RoleId equals r.Id
		//                          where e.WorkshopId == workshopId && e.IsRemoved != true
		//                          && r.Name != "Super Administrator" && r.Name != "Administrator"
		//					select new
		//                          {
		//                              employeeId = e.EmployeeId,
		//                              firstNames = e.FirstNames,
		//                              role = r.Name,
		//                          }).ToList();

		//          return employee;
		//      }

		//      [HttpGet]
		//      [Route("insurancecompanies")]
		//      public async Task<object> InsuranceCompany(int? id)
		//      {
		//          if (id == null)
		//          {
		//		return _companyService.GetInsuranceCompanies();
		//          }
		//          else
		//          {
		//              return _companyService.GetCompanyById(id.Value);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("AllAssesors")]
		//      public async Task<object> GetAllAssesors()
		//      {
		//          return await _context.Assessor.Include(s => s.AssesorCompany).Select(a => new { a.FullName, a.WorkTelephone }).ToListAsync();
		//      }


		//      [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//      [Route("ServiceAdvisorByWorkshop")]
		//      [HttpGet]
		//      public async Task<object> ServiceAdvisorByWorkshop()
		//      {
		//          int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);

		//          var _serviceadvisors = (from e in _context.Employee
		//                                  join role in _context.UserRoles
		//                                  on e.UserId equals role.UserId
		//                                  where role.RoleId == "4" && e.WorkshopId == workshopId
		//                                  select new
		//                                  {
		//								e.EmployeeId,
		//                                      Name = string.Concat(e.FirstNames, " ", e.LastName).ToUpper(),
		//                                      Category = e.JobTitle
		//                                  }).ToList();

		//          return _serviceadvisors;

		//      }

		//      [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//      [Route("ServiceAdvisorByWorkshop1")]
		//      [HttpGet]
		//      public async Task<object> ServiceAdvisorByWorkshop1()
		//      {
		//          int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);
		//          try
		//          {
		//              var _result = (from s in _context.Employee
		//                             join js in _context.Jobs on s.EmployeeId equals js.ServiceAdvisorId
		//                             join j in _context.UserRoles on s.UserId equals j.UserId
		//                             where j.RoleId == "4" && js.WorkshopId == workshopId
		//                             group s by new { s.FirstNames, s.EmployeeId } into serviceGroup
		//                             select new
		//                             {
		//                                 ServiceName = serviceGroup.Key.FirstNames,
		//                                 ServiceId = serviceGroup.Key.EmployeeId,
		//          }).ToList();
		//              return _result;
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest();
		//          }

		//      }

		//      [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//[Route("EstimatorsByWorkshop")]
		//[HttpGet]
		//public async Task<object> EstimatorsByWorkshop()
		//{

		//	var _estimators = (from e in _context.Employee
		//					   join role in _context.UserRoles
		//					   on e.UserId equals role.UserId
		//					   where role.RoleId == "10"
		//					   select new
		//					   {
		//						    e.EmployeeId,
		//						    Name = string.Concat(e.FirstNames, " ", e.LastName).ToUpper(),
		//						    Category = e.JobTitle
		//					   }).ToList();

		//	return _estimators;

		//}

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//      [Route("EmployeeByWorkshop")]
		//      [HttpGet]
		//      public async Task<object> GetAllEmployeeByWorkshop()
		//      {
		//          int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);

		//          var emp = await (from e in _context.Employee

		//                           join roles in _context.UserRoles
		//                           on e.UserId equals roles.UserId
		//                           join rolename in _context.Roles
		//                           on roles.RoleId equals rolename.Id
		//                           where e.WorkshopId == workshopId
		//                           select new
		//                           {
		//                               e.EmployeeId,
		//                               Name = string.Concat(e.FirstNames, " ", e.LastName).ToUpper(),
		//                               Category = rolename.Name,
		//                               IsEstimator = e.JobTitle
		//                           }


		//                           ).Distinct().ToListAsync();


		//          return emp;

		//      }

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		//[Route("GetEmployeesWithTitles")]
		//[HttpGet]
		//public async Task<object> GetEmployeesWithTitles()
		//{
		//	int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);

		//          var _workshop = _context.Workshops.Where(x => x.WorkshopId == workshopId).FirstOrDefault();
		//          if (_workshop == null)
		//          {
		//              return Ok(new { success = false });
		//          }

		//	var titles = await (from e in _context.Employee
		//                              join r in _context.UserRoles
		//                              on e.UserId equals r.UserId
		//                              join rn in _context.Roles
		//                              on r.RoleId equals rn.Id
		//                              where rn.Id != "8" && rn.Id != "7"
		//				select new
		//				{
		//					e.JobTitle
		//				}
		//				).Distinct().ToListAsync();

		//	var emp = await (from e in _context.Employee
		//					 join r in _context.UserRoles
		//					 on e.UserId equals r.UserId
		//					 join rn in _context.Roles
		//					 on r.RoleId equals rn.Id
		//					 where rn.Id != "8" && rn.Id != "7"
		//					 select new
		//			{
		//				e.EmployeeId,
		//				Name = string.Concat(e.FirstNames, " ", e.LastName).ToUpper(),
		//                      e.JobTitle,
		//				Checked = false
		//                    //  jobCount = _context
		//			}).OrderBy(x => x.Name).ToListAsync();

		//          return Ok(new { employeeCount =  emp.Count, employeeList = emp, titles = titles, _workshop.AllowStatusToBeAssignedToMultipleUsers });
		//}


		//[HttpGet]
		//      [Route("WorkShopsByUsername")]
		//      public async Task<List<Workshops>> GetWorkShopsByUsername(string username)
		//      {

		//          try
		//          {
		//              Employee employee = await GetEmployeeByUserName(username);
		//              var employeeWorkshops = _context.EmployeeWorkshops.Include(s => s.Workshop).Where(a => a.EmployeeId == employee.EmployeeId);
		//              List<Workshops> workshops = new List<Workshops>();
		//              foreach (var item in employeeWorkshops)
		//              {
		//                  workshops.Add(item.Workshop);
		//              }
		//              return workshops.Select(a => new Workshops(){ WorkshopId=a.WorkshopId, WorkshopName=a.WorkshopName, WorkshopLogo = a.WorkshopLogo, DBConnectionString = a.DBConnectionString }).ToList();
		//          }
		//          catch (Exception ex)
		//          {
		//              return null;
		//          }
		//      }

		//      private async Task<Employee> GetEmployeeByUserName(string username)
		//      {
		//          var userId = _context.Users.Where(a => a.UserName == username).Select(a => a.Id).FirstOrDefault();
		//          return await _context.Employee.Where(a => a.UserId == userId).FirstAsync();
		//      }

		//      [HttpGet]
		//      [Route("colors")]
		//      public async Task<List<Color>> Colors(int? id)
		//      {
		//          return id == null ? await _context.Color.ToListAsync() : await _context.Color.Where(a => a.ColorId == id).ToListAsync();
		//      }

		//      [HttpGet]
		//      [Route("currency")]
		//      public async Task<List<Currency>> Currency(int? id)
		//      {
		//          return id == null ? await _context.Currency.ToListAsync() : await _context.Currency.Where(a => a.CurrencyId == id).ToListAsync();
		//      }

		//      [HttpGet]
		//      [Route("country")]
		//      public async Task<List<Country>> Country(int? id)
		//      {
		//          return id == null ? await _context.Country.ToListAsync() : await _context.Country.Where(a => a.Id == id).ToListAsync();
		//      }

		//[HttpGet]
		//[Route("GetInsuranceCompaniesDropDown")]
		//public async Task<object> GetInsuranceCompaniesDropDown()
		//{
		//          try
		//          {
		//              return _companyService.GetInsuranceCompaniesViaDropDown();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new
		//              {
		//                  success = false,
		//                  message = ex.Message
		//              });
		//          }

		//}

		//[HttpGet]
		//[Route("GetPartSuppliersDropDown")]
		//public async Task<object> GetPartSuppliersDropDown()
		//{
		//	return _companyService.GetPartSuppliersViaDropDown();
		//}

		//[HttpGet]
		//[Route("GetTowingCompaniesDropDown")]
		//public async Task<object> GetTowingCompaniesDropDown()
		//{
		//	return _companyService.GetTowingCompaniesViaDropDown();
		//}

		//[HttpGet]
		//[Route("GetFitmentCentresDropDown")]
		//public async Task<object> GetFitmentCentresDropDown()
		//{
		//	return _companyService.GetFitmentCentresViaDropDown();
		//}

		//[HttpGet]
		//[Route("GetAllVendorsDropdown")]
		//public async Task<object> GetAllVendorsDropdown()
		//{
		//	return _companyService.GetAllCompaniesViaDropDown();
		//}

		//[HttpGet]
		//[Route("GetAllExpenseCategories")]
		//public async Task<object> GetAllExpenseCategories()
		//{
		//	return _accountingExpenseService.GetExpenseCategories();
		//}

		//[HttpGet]
		//[Route("GetVatPercentage")]
		//public async Task<object> GetVatPercentage()
		//{
		//	return _context.Workshops.Select(x => x.VatPercentage).FirstOrDefault();
		//}

		//[HttpGet]
		//[Route("PartTypes")]
		//public async Task<object> PartTypes()
		//{
		//          var _partTypes = _context.part_types.ToList();

		//          return _partTypes;
		//}

		//[HttpGet]
		//[Route("ReturnForCreditReasons")]
		//public async Task<object> ReturnForCreditReasons()
		//{
		//	var _reasons = _context.return_for_credits_reasons.ToList();

		//	return _reasons;
		//}

		//[HttpGet]
		//      [Route("make")]
		//      public async Task<object> Make(int? id)
		//      {
		//          if (id == null)
		//          {
		//              var data = await _context.Make.Select(a => new
		//              {
		//                  MakeId = a.MakeId,
		//                  Name = a.Name
		//              }).ToListAsync();

		//              return data;
		//          }
		//          else
		//          {
		//              var data = await _context.Make.Select(a => new
		//              {
		//                  MakeId = a.MakeId,
		//                  Name = a.Name
		//              }).Where(a => a.MakeId == id).ToListAsync();
		//              return data;
		//          }
		//      }

		//      [HttpGet]
		//      [Route("modeltypes")]
		//      public async Task<List<ModelType>> ModelTypes(int? id)
		//      {
		//          return id == null ? await _context.ModelType.ToListAsync() : await _context.ModelType.Where(a => a.ModelId == id).ToListAsync();
		//      }

		//      [HttpGet]
		//      [Route("ModelsByMakeId")]
		//      public async Task<List<ModelType>> ModelTypesByMake(int makeid, int? id)
		//      {
		//          return id == null ? await _context.ModelType.Where(a => a.MakeId == makeid).ToListAsync() : await _context.ModelType.Where(a => a.ModelId == id && a.MakeId == makeid).ToListAsync();
		//      }

		//[HttpGet]
		//[Route("VehicleBodyTypes")]
		//public async Task<object> VehicleBodyTypes()
		//{
		//	return await _context.VehicleBodyTypes.ToListAsync();
		//}

		//[HttpPost]
		//      [Route("UpdateMake")]
		//      public async Task<object> UpdateMake(Make make)
		//      {
		//          Make vehileMake = _context.Make.Where(a => a.Name.ToUpper().Trim() == make.Name.ToUpper().Trim()).FirstOrDefault();

		//          if (vehileMake == null)
		//          {
		//              try
		//              {
		//                  _context.Make.Add(make);
		//                  await _context.SaveChangesAsync();
		//                  return Ok(new { success = true, message = "added successfully" , id = make.MakeId });
		//              }
		//              catch (Exception ex)
		//              {
		//			return Ok(new { success = false, message = ex.Message });
		//              }
		//          }
		//          else
		//          {
		//              return Ok(new {success = false, message="make already exists."});
		//          }
		//         // return await _context.Make.ToListAsync();
		//      }

		//      [HttpPost]
		//      [Route("UpdateModel")]
		//      public async Task<object> UpdateModel(ModelType modelType)
		//      {
		//          ModelType vehileModel = _context.ModelType.Where(a => a.ModelDesc == modelType.ModelDesc).FirstOrDefault();

		//          if (vehileModel == null)
		//          {
		//              try
		//              {
		//                  _context.ModelType.Add(modelType);
		//                  await _context.SaveChangesAsync();
		//                  return Ok(new { success = true, message = "added successfully" });
		//              }
		//              catch (Exception ex)
		//              {
		//                  return BadRequest(ex.Message);
		//              }
		//          }
		//          else
		//          {
		//              return Ok(new { success = false, message = "Model already exists." });
		//          }
		//      }

		//      [HttpPost]
		//      [Route("UpdateColour")]
		//      public async Task<List<Color>> UpdateColor(Color color)
		//      {
		//          Color vehileColour = _context.Color.Where(a => a.ColorName == color.ColorName).FirstOrDefault();

		//          if (vehileColour == null)
		//          {
		//              int Colorcount = _context.Color.Count() + 1;
		//              color.ColorId = Colorcount;
		//              _context.Color.Add(color);
		//              await _context.SaveChangesAsync();
		//          }
		//          else
		//          {
		//              return null;
		//          }
		//          return await _context.Color.ToListAsync();
		//      }


		//      [HttpGet]
		//      public async Task<List<RepairMethod>> RepairMethods(int? id)
		//      {
		//          return null;
		//      }

		//      [HttpGet]
		//      [Route("jobtypes")]
		//      public async Task<List<JobTypes>> JobTypes(int? id)
		//      {
		//          return id == null ? await _context.JobTypes.ToListAsync() : await _context.JobTypes.Where(a => a.JobTypeId == id).ToListAsync();
		//      }

		//      [HttpGet]
		//      [Route("AllCompaniesBranches")]
		//      public async Task<object> GetCompaniesIncludingSuppliers()
		//      {
		//          var companies = await _context.CompanyBranch.ToListAsync();
		//          return companies;
		//      }

		//      [HttpPut]
		//      [Route("ModifyMake/{id}")]
		//      public async Task<List<Make>> PutMake(int id, Make make)
		//      {
		//          if (id != make.MakeId)
		//          {
		//              return null;
		//          }

		//          _context.Entry(make).State = EntityState.Modified;

		//          try
		//          {
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (DbUpdateConcurrencyException)
		//          {
		//              if (!MakeExists(id))
		//              {
		//                  return null;
		//              }
		//              else
		//              {
		//                  throw;
		//              }
		//          }

		//          return await _context.Make.ToListAsync();
		//      }

		//      [HttpPut]
		//      [Route("ModifyModel/{id}")]
		//      public async Task<List<ModelType>> PutModel(int id, ModelType model)
		//      {
		//          if (id != model.ModelId)
		//          {
		//              return null;
		//          }

		//          _context.Entry(model).State = EntityState.Modified;

		//          try
		//          {
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (DbUpdateConcurrencyException)
		//          {
		//              if (!ModelExists(id))
		//              {
		//                  return null;
		//              }
		//              else
		//              {
		//                  throw;
		//              }
		//          }

		//          return await _context.ModelType.ToListAsync();
		//      }

		//      [HttpPut]
		//      [Route("ModifyColour/{id}")]
		//      public async Task<List<Color>> PutColor(int id, Color model)
		//      {
		//          if (id != model.ColorId)
		//          {
		//              return null;
		//          }

		//          _context.Entry(model).State = EntityState.Modified;

		//          try
		//          {
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (DbUpdateConcurrencyException)
		//          {
		//              if (!ColorExists(id))
		//              {
		//                  return null;
		//              }
		//              else
		//              {
		//                  throw;
		//              }
		//          }

		//          return await _context.Color.ToListAsync();
		//      }


		//      [HttpPut]
		//      [Route("ModifyInsuranceCompany/{id}")]
		//      public async Task<List<CompanyBranch>> PutInsuranceCompany(int id, CompanyBranch model)
		//      {
		//          if (id != model.CompanyBranchId)
		//          {
		//              return null;
		//          }

		//          _context.Entry(model).State = EntityState.Modified;

		//          try
		//          {
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (DbUpdateConcurrencyException)
		//          {
		//              if (!InsuranceCompanyExists(id))
		//              {
		//                  return null;
		//              }
		//              else
		//              {
		//                  throw;
		//              }
		//          }

		//          return await _context.CompanyBranch.ToListAsync();
		//      }

		//[HttpGet]
		//[Route("WorkshopWhatsAppTemplate")]
		//public async Task<object> WorkshopWhatsAppTemplate()
		//{
		//	try
		//	{
		//		var smsTemplate = (from e in _context.whatsapp_templates
		//						   select new
		//						   {
		//							   e.Id,
		//							   e.MessageType,
		//							   e.MessageTemplateBody,
		//                                     e.SortOrder
		//						   }).OrderBy(x => x.SortOrder).ToList();

		//		return Ok(new { success = true, Data = smsTemplate });

		//	}
		//	catch (Exception ex)
		//	{
		//		return Ok(new { success = false, message = ex.Message });
		//	}
		//}


		//#region workshopsmstemplates

		//[HttpGet]
		//      [Route("WorkshopSMSTemplate")]
		//      public async Task<object> GetAllWorkshopSMSTemplate()
		//      {
		//          try
		//          {
		//              var smsTemplate = (from e in _context.WorkshopSmsTemplates
		//                                  select new
		//                                  {
		//                                      e.Id,
		//                                      e.MessageType,
		//                                      e.MessageBody
		//                                  }).ToList();

		//              return Ok(new { success = true, Data = smsTemplate });

		//          }
		//          catch (Exception ex)
		//          {
		//              return Ok(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPost]
		//      [Route("WorkshopSMSTemplate")]
		//      public async Task<ActionResult> CreateWorkshopSMSTemplate(WorkshopSmsTemplates model)
		//      {

		//          try
		//          {
		//              var _smsTemplates = _context.WorkshopSmsTemplates.Where(x=> x.MessageType == model.MessageType).FirstOrDefault();
		//              if (_smsTemplates != null)
		//              {
		//                  return BadRequest(model.MessageType + " Message Type Already Exists.");
		//              }

		//              int smsTemplatescount = 0;
		//              var smsTemplates = _context.WorkshopSmsTemplates.OrderByDescending(x=> x.Id).FirstOrDefault();
		//              if(smsTemplates ==null)
		//              {
		//                  smsTemplatescount = 1;
		//              }
		//              else
		//              {
		//                  smsTemplatescount = smsTemplates.Id + 1;
		//              }
		//              model.Id = smsTemplatescount;
		//              _context.WorkshopSmsTemplates.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPut]
		//      [Route("WorkshopSMSTemplate")]
		//      public async Task<ActionResult> UpdateWorkshopSMSTemplate(WorkshopSmsTemplates model)
		//      {
		//          try
		//          {
		//              //int s = Convert.ToInt32("str");
		//              _context.Entry(model).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//[HttpGet]
		//[Route("WorkshopSMSTemplateByMessageType")]
		//public async Task<object> GetWorkshopSMSTemplateByMessageType(string MessageType)
		//{
		//	try
		//	{
		//		var smsTemplate = (from e in _context.WorkshopSmsTemplates
		//						   where e.MessageType == MessageType
		//						   select new
		//						   {
		//							   e.Id,
		//							   e.MessageType,
		//							   e.MessageBody
		//						   }).FirstOrDefault();

		//		return Ok(new { success = true, Data = smsTemplate });

		//	}
		//	catch (Exception ex)
		//	{
		//		return Ok(new { success = false, message = ex.Message });
		//	}
		//}

		//#endregion



		//[HttpPost]
		//      [Route("DocumentTypes")]
		//      public async Task<object> CreateDocumentTypes(DocumentTypes model)
		//      {

		//          try
		//          {
		//              DocumentTypes documentTypes = _context.DocumentTypes.Where(a => a.DocumentType == model.DocumentType).FirstOrDefault();

		//              if (documentTypes != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }

		//              _context.DocumentTypes.Add(model);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("DocumentTypes")]
		//      public async Task<object> GetDocumentTypes()
		//      {
		//          try
		//          {
		//              var _documentTypes = _context.DocumentTypes.ToList();
		//              return Ok(new { success = true, Data = _documentTypes });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPut]
		//      [Route("DocumentTypes")]
		//      public async Task<object> UpdateDocumentTypes(DocumentTypes model)
		//      {
		//          try
		//          {
		//              DocumentTypes documentTypes = _context.DocumentTypes.Where(a => a.DocumentId != model.DocumentId && a.DocumentType == model.DocumentType).FirstOrDefault();

		//              if (documentTypes != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }

		//              _context.Entry(model).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("CompanyType")]
		//      public async Task<object> GetAllCompanyType()
		//      {
		//          try
		//          {
		//              var _companyTypes = _context.CompanyTypes.ToList();
		//              return Ok(new { success = true, Data = _companyTypes });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }

		//      }

		//      [HttpPost]
		//      [Route("CompanyType")]
		//      public async Task<object> CreateCompanyType(CompanyType model)
		//      {
		//          try
		//          {
		//              _context.CompanyTypes.Add(model);
		//              await _context.SaveChangesAsync();
		//              var _companyTypes = _context.CompanyTypes.ToList();
		//              return Ok(new { success = true, Data = _companyTypes });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpGet]
		//      [Route("RepairType")]
		//      public async Task<object> GetAllRepairType()
		//      {
		//          try
		//          {
		//              var _repairType = _context.RepairTypes.ToList();
		//              return Ok(new { success = true, Data = _repairType });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }

		//      }

		//      #region Disclaimers

		//      [HttpGet]
		//      [Route("Disclaimer")]
		//      public async Task<object> GetAllDisclaimer()
		//      {
		//          try
		//          {
		//              var _disclaimers = (from e in _context.Disclaimers
		//                                 select new
		//                                 {
		//                                     e.DisclaimerTypeId,
		//                                     e.DisclaimerType,
		//                                     e.DisclaimerText,
		//                                 }).ToList();

		//              return Ok(new { success = true, Data = _disclaimers });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpPost]
		//      [Route("Disclaimer")]
		//      public async Task<ActionResult> CreateDisclaimers(Disclaimer model)
		//      {

		//          try
		//          {
		//              var _smsTemplates = _context.Disclaimers.Where(x => x.DisclaimerType == model.DisclaimerType).FirstOrDefault();
		//              if (_smsTemplates != null)
		//              {
		//                  return Ok(new { success = false, message = model.DisclaimerType + " Message Type Already Exists." });
		//              }

		//              _context.Disclaimers.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPut]
		//      [Route("Disclaimer")]
		//      public async Task<ActionResult> UpdateDisclaimer(Disclaimer model)
		//      {
		//          try
		//          {
		//              var _smsTemplates = _context.Disclaimers.Where(x => x.DisclaimerTypeId != model.DisclaimerTypeId && x.DisclaimerType == model.DisclaimerType).FirstOrDefault();
		//              if (_smsTemplates != null)
		//              {
		//                  return Ok(new { success = false, message = model.DisclaimerType + " Message Type Already Exists." });
		//              }

		//              _context.Entry(model).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }

		//      #endregion

		//      #region Department Type

		//      [HttpGet]
		//      [Route("DepartmentCategories")]
		//      public async Task<object> GetAllDepartmentCategories()
		//      {
		//          try
		//          {
		//              var _departmentCategories = _context.DepartmentCategories.ToList();

		//              return Ok(new { success = true, Data = _departmentCategories });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("DepartmentType")]
		//      public async Task<object> GetAllDepartmentType()
		//      {
		//          try
		//          {
		//              var _departmentType = (from d in _context.DepartmentType
		//                                  join dc in _context.DepartmentCategories
		//                                  on d.CategoryId equals dc.CategoryId
		//                                  where d.IsDelete != true
		//                                  select new
		//                                  {
		//                                      d.CategoryId,
		//                                      d.Type,
		//                                      d.DepartmentTypeId,
		//                                      d.SequenceId,
		//                                      dc.CategoryDescription,
		//                                  }).ToList();

		//              return Ok(new { success = true, Data = _departmentType });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("DepartmentTypeByCategoryId")]
		//      public List<DepartmentType> GetAllDepartmentTypeByCategoryId(int categoryId)
		//      {
		//          return _context.DepartmentType.Where(x => x.CategoryId == categoryId).ToList();
		//      }

		//      [HttpPost]
		//      [Route("DepartmentType")]
		//      public async Task<ActionResult> CreateDepartmentType(DepartmentType model)
		//      {
		//          try
		//          {

		//              var _departmentType = _context.DepartmentType.Where(x => x.Type == model.Type && x.IsDelete == false).FirstOrDefault();
		//              if (_departmentType != null)
		//              {
		//                  return Ok(new { success = false, message = model.Type + " Department Type Already Exists." });
		//              }

		//              var seqId = _context.DepartmentType.OrderByDescending(x => x.SequenceId).FirstOrDefault();
		//              if (seqId != null)
		//              {
		//                  model.SequenceId = seqId.SequenceId + 1;
		//              }
		//              else
		//              {
		//                  model.SequenceId = 1;
		//              }

		//              model.IsDelete = false;
		//              _context.DepartmentType.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpDelete]
		//      [Route("DepartmentType/{departmentTypeId}")]
		//      public async Task<ActionResult> DeleteDepartmentType(int departmentTypeId)
		//      {
		//          try
		//          {
		//              var _departmentType = _context.DepartmentType.Where(x => x.DepartmentTypeId == departmentTypeId).FirstOrDefault();
		//              if (_departmentType == null)
		//              {
		//                  return Ok(new { success = false, message = "Record Not Found" });
		//              }
		//              _departmentType.IsDelete = true;
		//              _context.Entry(_departmentType).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Deleted Successfully" });
		//      }

		//[HttpGet]
		//[Route("SubDepartments")]
		//public async Task<List<ActivityStatus>> ActivitiesByDepartments(int DepartmentId, int? id)
		//{
		//	var x = _context.DepartmentReference.Where(a => a.DepartmentTypeId == DepartmentId).ToList();
		//	var activityStatuses = new List<ActivityStatus>();


		//	foreach (var item in x)
		//	{
		//		ActivityStatus data = await _context.ActivityStatus.AsNoTracking().Where(a => a.ActivityStatusId == item.ActivityStatusId).SingleOrDefaultAsync();


		//		activityStatuses.Add(data);
		//	}

		//	return activityStatuses;

		//}

		//      [HttpGet]
		//      [Route("UnHiddenDepartmentCategories")]
		//      public async Task<object> GetAllUnHiddenDepartmentCategories()
		//      {
		//          try
		//          {
		//              var _departmentCategories = _context.DepartmentCategories.Where(x => x.IsHidden != true).ToList();
		//              return Ok(new { success = true, Data = _departmentCategories });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      #endregion

		//      #region Workshop Survey Question

		//      [HttpGet]
		//      [Route("AnswerTypes")]
		//      public async Task<object> GetAllAnswerTypes()
		//      {
		//          try
		//          {
		//              var _answerTypes = _context.AnswerTypes.ToList();

		//              return Ok(new { success = true, Data = _answerTypes });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("WorkshopSurveyQuestions")]
		//      public async Task<object> GetAllWorkshopSurveyQuestion()
		//      {
		//          try
		//          {
		//              var _departmentType = (from qt in _context.AnswerTypes
		//                                     join q in _context.WorkshopSurveyQuestions
		//                                     on qt.AnswerTypeId equals q.AnswerTypeId
		//                                     join wsa in _context.WorkshopSurveyAnswers
		//                                     on q.WorkshopSurveyQuestionId equals wsa.WorkshopSurveyQuestionId into iwsa
		//                                     from a in iwsa.DefaultIfEmpty()
		//                                     where q.IsDelete == false
		//                                     select new
		//                                     {
		//                                         q.WorkshopSurveyQuestionId,
		//                                         q.AnswerTypeId,
		//                                         q.Question,
		//                                         qt.Type,
		//                                         //q.IsComplete,
		//                                         a.Answer,
		//                                         AnswerForRadioButton = (a.Answer == "true" || a.Answer == "false") ? Convert.ToBoolean(a.Answer) : false,
		//                                     }).ToList();

		//              return Ok(new { success = true, Data = _departmentType });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("GetAllWorkshopSurveyQuestionByJobSurveyId")]
		//      public async Task<object> GetAllWorkshopSurveyQuestionByJobSurveyId(int jobId, int surveyId)
		//      {
		//          try
		//          {
		//              var _departmentType = (from qt in _context.AnswerTypes
		//                                     join q in _context.WorkshopSurveyQuestions
		//                                     on qt.AnswerTypeId equals q.AnswerTypeId
		//                                     join wsa in _context.WorkshopSurveyAnswers
		//                                     on q.WorkshopSurveyQuestionId equals wsa.WorkshopSurveyQuestionId into iwsa
		//                                     from a in iwsa.DefaultIfEmpty()
		//                                     where q.IsDelete == false
		//                                     select new
		//                                     {
		//                                         q.WorkshopSurveyQuestionId,
		//                                         q.AnswerTypeId,
		//                                         q.Question,
		//                                         qt.Type,
		//                                         a.IsComplete,
		//                                         a.Answer,
		//                                         AnswerForRadioButton = (a.Answer == "true" || a.Answer == "false") ? Convert.ToBoolean(a.Answer) : false,
		//                                     }).ToList();

		//              return Ok(new { success = true, Data = _departmentType });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpGet]
		//      [Route("GetAllWorkshopSurveyQuestionByJobId")]
		//      public async Task<object> GetAllWorkshopSurveyQuestionByJobId(int jobId)
		//      {
		//          try
		//          {
		//              var _departmentType = (from qt in _context.AnswerTypes
		//                                     join q in _context.WorkshopSurveyQuestions
		//                                     on qt.AnswerTypeId equals q.AnswerTypeId
		//                                     join wsa in _context.WorkshopSurveyAnswers
		//                                     on q.WorkshopSurveyQuestionId equals wsa.WorkshopSurveyQuestionId into iwsa
		//                                     from a in iwsa.DefaultIfEmpty()
		//                                     where q.IsDelete == false && a.JobId == jobId
		//                                     select new
		//                                     {
		//                                         a.WorkshopSurveyAnswerId,
		//                                         q.WorkshopSurveyQuestionId,
		//                                         q.AnswerTypeId,
		//                                         q.Question,
		//                                         qt.Type,
		//                                         a.IsComplete,
		//                                         a.Answer,
		//                                         AnswerForRadioButton = (a.Answer == "true" || a.Answer == "false") ? Convert.ToBoolean(a.Answer) : false,
		//                                     }).OrderByDescending(x=> x.WorkshopSurveyAnswerId).ToList();

		//              return Ok(new { success = true, Data = _departmentType });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpPost]
		//      [Route("WorkshopSurveyAnswer")]
		//      public async Task<ActionResult> CreateWorkshopSurveyAnswer(List<WorkshopSurveyQuestionAnswer> model)
		//      {
		//          try
		//          {
		//              if (model.Count() <= 0)
		//              {
		//                  return Ok(new { success = false, message = "Please Select At Least One Answer." });
		//              }

		//              var _surveyMaster = _context.SurveyMaster.Where(x=> x.SurveyMasterId == model.FirstOrDefault().SurveyMasterId).FirstOrDefault();
		//              if (_surveyMaster == null)
		//              {
		//                  return Ok(new { success = false, message = "Survey Not Found" });
		//              }

		//              _surveyMaster.IsSurveyCompleted = true;
		//              _surveyMaster.SurveryCompletedOn = DateTime.Now;
		//              _context.Entry(_surveyMaster).State = EntityState.Modified;
		//              _context.SaveChanges();

		//              foreach (var item in model)
		//              {
		//                  WorkshopSurveyAnswer workshopSurveyAnswer = new WorkshopSurveyAnswer();
		//                  workshopSurveyAnswer.WorkshopSurveyQuestionId = item.WorkshopSurveyQuestionId;
		//                  workshopSurveyAnswer.AnswerTypeId = item.AnswerTypeId;
		//                  workshopSurveyAnswer.Question = item.Question;
		//                  workshopSurveyAnswer.IsComplete = true;
		//                  workshopSurveyAnswer.Answer = item.Answer;
		//                  workshopSurveyAnswer.CreatedDate = DateTime.Now;
		//                  workshopSurveyAnswer.SurveyMasterId = item.SurveyMasterId;
		//                  workshopSurveyAnswer.JobId = item.JobId;
		//                  _context.WorkshopSurveyAnswers.Add(workshopSurveyAnswer);
		//                  await _context.SaveChangesAsync();
		//              }
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPost]
		//      [Route("WorkshopSurveyQuestions")]
		//      public async Task<ActionResult> CreateWorkshopSurveyQuestions(WorkshopSurveyQuestion model)
		//      {
		//          try
		//          {
		//              string userId = NMOHUMSecurity.GetUserId(Request.HttpContext);
		//              var _workshopSurveyQuestions = _context.WorkshopSurveyQuestions.Where(x => x.Question == model.Question && x.IsDelete == false).FirstOrDefault();
		//              if (_workshopSurveyQuestions != null)
		//              {
		//                  return Ok(new { success = false, message = model.Question + " Question Already Exists." });
		//              }

		//              model.IsDelete = false;
		//              //model.IsComplete = false;
		//              model.UserId = userId;
		//              model.CreatedDate = DateTime.Now;
		//              _context.WorkshopSurveyQuestions.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPut]
		//      [Route("WorkshopSurveyQuestions")]
		//      public async Task<ActionResult> UpdateWorkshopSurveyQuestions(WorkshopSurveyQuestion model)
		//      {
		//          try
		//          {
		//              var _workshopSurveyQuestion = _context.WorkshopSurveyQuestions.Where(x => x.WorkshopSurveyQuestionId == model.WorkshopSurveyQuestionId).FirstOrDefault();
		//              if (_workshopSurveyQuestion == null)
		//              {
		//                  return Ok(new { success = false, message = "Record Not Found" });
		//              }

		//              var _workshopSurveyQuestions = _context.WorkshopSurveyQuestions.Where(x => x.WorkshopSurveyQuestionId != model.WorkshopSurveyQuestionId && x.Question == model.Question && x.IsDelete == false).FirstOrDefault();
		//              if (_workshopSurveyQuestions != null)
		//              {
		//                  return Ok(new { success = false, message = model.Question + " Question Already Exists." });
		//              }

		//              _workshopSurveyQuestion.Question = model.Question;
		//              _workshopSurveyQuestion.IsDelete = model.IsDelete == null ? false: model.IsDelete;
		//              _workshopSurveyQuestion.AnswerTypeId = model.AnswerTypeId;
		//              _workshopSurveyQuestion.UpdatedDate = DateTime.Now;
		//              _context.Entry(_workshopSurveyQuestion).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Deleted Successfully" });
		//      }



		//      [HttpDelete]
		//      [Route("WorkshopSurveyQuestions/{workshopSurveyQuestionId}")]
		//      public async Task<ActionResult> DeleteWorkshopSurveyQuestions(int WorkshopSurveyQuestionId)
		//      {
		//          try
		//          {
		//              var _workshopSurveyQuestion = _context.WorkshopSurveyQuestions.Where(x => x.WorkshopSurveyQuestionId == WorkshopSurveyQuestionId).FirstOrDefault();
		//              if (_workshopSurveyQuestion == null)
		//              {
		//                  return Ok(new { success = false, message = "Record Not Found" });
		//              }
		//              _workshopSurveyQuestion.IsDelete = true;
		//              _context.Entry(_workshopSurveyQuestion).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Deleted Successfully" });
		//      }

		//      #endregion WorkshopCSIField

		//      [HttpGet]
		//      [Route("WorkshopCSIField")]
		//      public async Task<object> GetAllWorkshopCSIField()
		//      {
		//          try
		//          {
		//              var csiField = _context.WorkshopCSIFields.GroupBy(s => s.CSIFieldType).ToList();
		//              var _workshopCSIFields = (from wct in csiField
		//                                        select new
		//                                        {
		//                                            wct.Key,
		//                                            workshopCSIFieldList = wct.ToList()
		//                                        }).ToList();


		//              return Ok(new { success = true, Data = _workshopCSIFields });

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//      }

		//      [HttpPut]
		//      [Route("WorkshopCSIField")]
		//      public async Task<ActionResult> UpdateWorkshopCSIField(List<WorkshopCSIField> model)
		//      {
		//          try
		//          {
		//              foreach (var item in model)
		//              {
		//                  var _workshopCSIFields = _context.WorkshopCSIFields.Where(x => x.WorkshopCSIFieldId == item.WorkshopCSIFieldId).FirstOrDefault();
		//                  if (_workshopCSIFields != null)
		//                  {
		//                      _workshopCSIFields.CSIField = item.CSIField;
		//                      _workshopCSIFields.IsEnabled = item.IsEnabled;
		//                      _workshopCSIFields.UpdatedDate = DateTime.Now;
		//                      _context.Entry(_workshopCSIFields).State = EntityState.Modified;
		//                      await _context.SaveChangesAsync();
		//                  }
		//              }
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }

		//      [HttpPost]
		//      [Route("WorkshopCSIPackage")]
		//      public async Task<ActionResult> AddWorkshopCSIPackage(WorkshopCSIPackage model)
		//      {
		//          try
		//          {
		//              string userId = NMOHUMSecurity.GetUserId(Request.HttpContext);
		//              var employee = _context.Employee.Where(e => e.UserId == userId).FirstOrDefault();

		//              WorkshopCSIPackage workshopCSIPackage = new WorkshopCSIPackage();

		//              workshopCSIPackage.CSIPackage = model.CSIPackage;
		//              workshopCSIPackage.CreatedBy = employee.EmployeeId;
		//              workshopCSIPackage.CreatedDate = DateTime.Now;
		//              _context.WorkshopCSIPackage.Add(workshopCSIPackage);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Created Successfully" });
		//      }

		//      [HttpPost]
		//      [Route("ExportToExcel")]
		//      public async Task<ActionResult> ExportToExcel(WorkshopCSIPackage model)
		//      {


		//          string base64 = "";

		//          try
		//          {
		//              string userId = NMOHUMSecurity.GetUserId(Request.HttpContext);
		//              var employee = _context.Employee.Where(e => e.UserId == userId).FirstOrDefault();


		//              dynamic _csoPackageData = JsonConvert.DeserializeObject<List<ExpandoObject>>(model.CSIPackage);


		//		base64 = _csvHelperService.ConvertDynamicObjectsToCsvBase64(_csoPackageData);

		//             // base64 = ConvertDynamicObjectsToCsvBase64(_csoPackageData);

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Created Successfully", body = base64 });
		//      }

		//      //[HttpGet]
		//      //[Route("EmailTemplate")]
		//      //public async Task<ActionResult> EmailTemplate(string TemplateFor)
		//      //{


		//      //    string base64 = "";

		//      //    try
		//      //    {
		//      //       var emailTemplate = _context.EmailTemplate.Where(x=> x.TemplateFor == TemplateFor).FirstOrDefault();
		//      //        return Ok(new { success = true, body = emailTemplate });
		//      //    }
		//      //    catch (Exception ex)
		//      //    {
		//      //        return BadRequest(ex.Message);
		//      //    }
		//      //}

		//      public static string ConvertDynamicObjectsToCsvBase64(List<ExpandoObject> data)
		//      {
		//          using (var ms = new MemoryStream())
		//          using (var writer = new StreamWriter(ms))
		//          using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
		//          {
		//              {
		//                  var config = new CsvConfiguration(CultureInfo.InvariantCulture)
		//                  {
		//                      HasHeaderRecord = true,
		//                      // Optional: Customize header naming if needed
		//                      // HeaderNamingConvention = new PascalCaseNamingConvention(),
		//                  };

		//                  if (data.Count > 0)
		//                  {
		//                      var firstObject = data[0] as IDictionary<string, object>;
		//                      foreach (var key in firstObject.Keys)
		//                      {
		//                          csv.WriteField(key);
		//                      }
		//                      csv.NextRecord();
		//                  }

		//                  foreach (var item in data)
		//                  {
		//                      var dictionary = item as IDictionary<string, object>;
		//                      foreach (var value in dictionary.Values)
		//                      {
		//                          csv.WriteField(value);
		//                      }
		//                      csv.NextRecord();
		//                  }

		//                  writer.Flush();
		//                  byte[] _convertedData = ms.ToArray();
		//                  string base64 = Convert.ToBase64String(_convertedData);

		//                  return base64;
		//              }
		//          }
		//      }


		//      #region workshopemailtemplates

		//      //[HttpGet]
		//      //[Route("EmailType")]
		//      //public async Task<object> GetAllEmailType()
		//      //{
		//      //    try
		//      //    {

		//      //        var emailtype = _context.WorkshopEmailType.ToList();

		//      //        return Ok(new { success = true, Data = emailtype });

		//      //    }
		//      //    catch (Exception ex)
		//      //    {
		//      //        return Ok(new { success = false, message = ex.Message });
		//      //    }
		//      //}

		//      [HttpGet]
		//      [Route("WorkshopEmailTemplate")]
		//      public async Task<object> GetAllWorkshopEmailTemplate()
		//      {
		//          try
		//          {

		//              var emailTemplate = (from e in _context.EmailTemplate
		//                                 select new
		//                                 {
		//                                     e.EmailTemplateId,
		//                                     e.TemplateFor,
		//                                     e.Template,
		//                                     e.WorkshopId
		//                                 }).ToList();

		//              return Ok(new { success = true, Data = emailTemplate });

		//          }
		//          catch (Exception ex)
		//          {
		//              return Ok(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPost]
		//      [Route("WorkshopEmailTemplate")]
		//      public async Task<ActionResult> CreateWorkshopEmailTemplate(EmailTemplate model)
		//      {

		//          try
		//          {
		//              var _emailTemplates = _context.EmailTemplate.Where(x => x.TemplateFor == model.TemplateFor).FirstOrDefault();
		//              if (_emailTemplates != null)
		//              {
		//                  return BadRequest("Email Type Already Exists.");
		//              }

		//              //int smsTemplatescount = 0;
		//              //var smsTemplates = _context.WorkshopSmsTemplates.OrderByDescending(x => x.Id).FirstOrDefault();
		//              //if (smsTemplates == null)
		//              //{
		//              //    smsTemplatescount = 1;
		//              //}
		//              //else
		//              //{
		//              //    smsTemplatescount = smsTemplates.Id + 1;
		//              //}
		//              //model.Id = smsTemplatescount;
		//              _context.EmailTemplate.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPut]
		//      [Route("WorkshopEmailTemplate")]
		//      public async Task<ActionResult> UpdateWorkshopEmailTemplate(EmailTemplate model)
		//      {
		//          try
		//          {
		//              //int s = Convert.ToInt32("str");
		//              _context.Entry(model).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      [HttpGet]
		//      [Route("WorkshopEmailTemplateByEmailType/{EmailType}")]
		//      public async Task<object> GetWorkshopEmailTemplateByEmailType(string EmailType)
		//      {
		//          try
		//          {
		//              var emailTemplate = (from e in _context.EmailTemplate
		//                                   where e.TemplateFor == EmailType
		//                                 select new
		//                                 {
		//                                     e.EmailTemplateId,
		//                                     e.TemplateFor,
		//                                     e.Template,
		//                                     e.WorkshopId
		//                                 }).FirstOrDefault();

		//              return Ok(new { success = true, Data = emailTemplate });

		//          }
		//          catch (Exception ex)
		//          {
		//              return Ok(new { success = false, message = ex.Message });
		//          }
		//      }

		//[HttpGet]
		//[Route("GetPartStatusOptions")]
		//public async Task<object> GetPartStatusOptions()
		//{
		//	try
		//	{
		//		var options = _context.part_status_options.OrderBy(x => x.SequenceId).ToList();

		//		return Ok(new { success = true, statusOptions = options });

		//	}
		//	catch (Exception ex)
		//	{
		//		return Ok(new { success = false, message = ex.Message });
		//	}
		//}

		//#endregion


		//      #region documenttemplates

		//      [HttpGet]
		//      [Route("DocumentTemplate")]
		//      public async Task<object> GetAllDocumentTemplate()
		//      {
		//          try
		//          {

		//              var documentTemplate = (from e in _context.DocumentTemplate
		//                                   select new
		//                                   {
		//                                       e.DocumentTemplateId,
		//                                       e.Type,
		//                                       e.Template,
		//                                   }).ToList();

		//              return Ok(new { success = true, Data = documentTemplate });

		//          }
		//          catch (Exception ex)
		//          {
		//              return Ok(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPost]
		//      [Route("DocumentTemplate")]
		//      public async Task<ActionResult> CreateDocumentTemplate(DocumentTemplate model)
		//      {

		//          try
		//          {
		//              var _documentTemplates = _context.DocumentTemplate.Where(x => x.Type == model.Type).FirstOrDefault();
		//              if (_documentTemplates != null)
		//              {
		//                  return BadRequest("Document Type Already Exists.");
		//              }

		//              //int smsTemplatescount = 0;
		//              //var smsTemplates = _context.WorkshopSmsTemplates.OrderByDescending(x => x.Id).FirstOrDefault();
		//              //if (smsTemplates == null)
		//              //{
		//              //    smsTemplatescount = 1;
		//              //}
		//              //else
		//              //{
		//              //    smsTemplatescount = smsTemplates.Id + 1;
		//              //}
		//              //model.Id = smsTemplatescount;
		//              _context.DocumentTemplate.Add(model);
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpPut]
		//      [Route("DocumentTemplate")]
		//      public async Task<ActionResult> UpdateDocumentTemplate(DocumentTemplate model)
		//      {
		//          try
		//          {
		//              //int s = Convert.ToInt32("str");
		//              _context.Entry(model).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();

		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(ex.Message);
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      [HttpGet]
		//      [Route("DocumentTemplateByType/{Type}")]
		//      public async Task<object> GetDocumentTemplateByEmailType(string Type)
		//      {
		//          try
		//          {
		//              var documentTemplate = (from e in _context.DocumentTemplate
		//                                   where e.Type == Type
		//                                   select new
		//                                   {
		//                                       e.DocumentTemplateId,
		//                                       e.Type,
		//                                       e.Template,
		//                                   }).FirstOrDefault();

		//              return Ok(new { success = true, Data = documentTemplate });

		//          }
		//          catch (Exception ex)
		//          {
		//              return Ok(new { success = false, message = ex.Message });
		//          }
		//      }

		//      #endregion

		//      #region User Role

		//      [HttpPost]
		//      [Route("Roles")]
		//      public async Task<object> CreateUserRole(RolesModel model)
		//      {

		//          try
		//          {
		//              var _masterRole = _masterContext.Roles.Where(a => a.Name.ToUpper().Replace(" ","") == model.Name.ToUpper().Replace(" ", "")).FirstOrDefault();
		//		if (_masterRole != null)
		//		{
		//			return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//		}



		//		IdentityRole identityRole = new IdentityRole();
		//		identityRole.Name = model.Name;
		//		identityRole.NormalizedName = model.Name.ToUpper();

		//		_masterContext.Roles.Add(identityRole);
		//		await _masterContext.SaveChangesAsync();

		//		IdentityRole identityRole2 = new IdentityRole();
		//		identityRole2.Id = identityRole.Id;
		//		identityRole2.Name = model.Name;
		//		identityRole2.NormalizedName = model.Name.ToUpper();

		//              _context.Roles.Add(identityRole2);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("Roles")]
		//      public async Task<object> GetRoles()
		//      {
		//          try
		//          {
		//              var _role = _context.Roles.ToList();
		//              return Ok(new { success = true, Data = _role });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPut]
		//      [Route("Roles")]
		//      public async Task<object> UpdateRole(RolesModel model)
		//      {
		//          try
		//          {
		//              var _role = _context.Roles.Where(a => a.Id != model.Id && a.Name == model.Name).FirstOrDefault();

		//              if (_role != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }


		//              var role = _context.Roles.Where(a => a.Id == model.Id).FirstOrDefault();

		//              if (role == null)
		//              {
		//                  return BadRequest(new { success = false, message = "Record Not Found" });
		//              }

		//              role.Name = model.Name;
		//              role.NormalizedName = model.Name.ToUpper();

		//              _context.Entry(role).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      #endregion


		//      #region Task Description

		//      [HttpPost]
		//      [Route("TaskReference")]
		//      public async Task<object> CreateTaskDescription(TaskReferenceDescription model)
		//      {

		//          try
		//          {

		//              var _task = _context.task_reference_descriptions.Where(a => a.TaskDescription == model.TaskDescription).FirstOrDefault();

		//              if (_task != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }

		//              _context.task_reference_descriptions.Add(model);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("TaskReference")]
		//      public async Task<object> GetTaskDescription()
		//      {
		//          try
		//          {
		//              var _role = _context.task_reference_descriptions.ToList();
		//              return Ok(new { success = true, Data = _role });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPut]
		//      [Route("TaskReference")]
		//      public async Task<object> UpdateTaskDescription(TaskReferenceDescription model)
		//      {
		//          try
		//          {
		//              var _task = _context.task_reference_descriptions.Where(a => a.Id != model.Id && a.TaskDescription == model.TaskDescription).FirstOrDefault();

		//              if (_task != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }


		//              var task = _context.task_reference_descriptions.Where(a => a.Id == model.Id).FirstOrDefault();

		//              if (task == null)
		//              {
		//                  return BadRequest(new { success = false, message = "Record Not Found" });
		//              }

		//              task.TaskDescription = model.TaskDescription;
		//              _context.Entry(task).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      #endregion


		//      #region Communication Method

		//      [HttpPost]
		//      [Route("CommunicationMethod")]
		//      public async Task<object> CreateCommunicationMethod(CommunicationMethod model)
		//      {

		//          try
		//          {
		//              var _methodType = _context.communication_methods.Where(a => a.MethodType == model.MethodType).FirstOrDefault();
		//              if (_methodType != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }

		//              _context.communication_methods.Add(model);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("CommunicationMethod")]
		//      public async Task<object> GetCommunicationMethod()
		//      {
		//          try
		//          {
		//              var _methodType = _context.communication_methods.ToList();
		//              return Ok(new { success = true, Data = _methodType });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpGet]
		//      [Route("CommunicationMethodActive")]
		//      public async Task<object> GetActiveCommunicationMethod()
		//      {
		//          try
		//          {
		//              var _methodType = _context.communication_methods.Where(x=> x.IsEnabled).ToList();
		//              return Ok(new { success = true, Data = _methodType });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPut]
		//      [Route("CommunicationMethod")]
		//      public async Task<object> UpdateCommunicationMethod(CommunicationMethod model)
		//      {
		//          try
		//          {
		//              var _methodType = _context.communication_methods.Where(a => a.Id != model.Id && a.MethodType == model.MethodType).FirstOrDefault();

		//              if (_methodType != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }


		//              var methodType = _context.communication_methods.Where(a => a.Id == model.Id).FirstOrDefault();

		//              if (methodType == null)
		//              {
		//                  return BadRequest(new { success = false, message = "Record Not Found" });
		//              }

		//              methodType.MethodType = model.MethodType;
		//              methodType.IsEnabled = model.IsEnabled;
		//              _context.Entry(methodType).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      #endregion

		//      #region Quality Control Questions

		//      [HttpPost]
		//      [Route("QualityControlQuestions")]
		//      public async Task<object> CreateQualityControlQuestions(QualityControlQuestions model)
		//      {

		//          try
		//          {
		//              int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);

		//              var _methodType = _context.quality_control_questions.Where(a => a.Question == model.Question).FirstOrDefault();
		//              if (_methodType != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }

		//              model.WorkshopId = workshopId;
		//              _context.quality_control_questions.Add(model);
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Added Successfully" });
		//      }

		//      [HttpGet]
		//      [Route("QualityControlQuestions")]
		//      public async Task<object> GetQualityControlQuestions()
		//      {
		//          try
		//          {
		//              //int workshopId = NMOHUMSecurity.GetWorkShopId(Request.HttpContext);
		//              var _communicationType = (from qc in _context.quality_control_questions
		//                                     join a in _context.AnswerTypes
		//                                     on qc.AnswerTypeId equals a.AnswerTypeId
		//                                        select new
		//                                     {
		//                                         qc.Id,
		//                                         qc.WorkshopId,
		//                                         qc.Question,
		//                                         qc.AnswerTypeId,
		//                                         a.Type,
		//                                            answer = ""
		//                                        }).ToList();

		//              return Ok(new { success = true, Data = _communicationType });
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//      }

		//      [HttpPut]
		//      [Route("QualityControlQuestions")]
		//      public async Task<object> UpdateQualityControlQuestions(QualityControlQuestions model)
		//      {
		//          try
		//          {
		//              var _methodType = _context.quality_control_questions.Where(a => a.Id != model.Id && a.Question == model.Question).FirstOrDefault();

		//              if (_methodType != null)
		//              {
		//                  return BadRequest(new { success = false, message = "An Entity with the same name already exists." });
		//              }


		//              var methodType = _context.quality_control_questions.Where(a => a.Id == model.Id).FirstOrDefault();

		//              if (methodType == null)
		//              {
		//                  return BadRequest(new { success = false, message = "Record Not Found" });
		//              }

		//              methodType.AnswerTypeId = model.AnswerTypeId;
		//              methodType.Question = model.Question;
		//              _context.Entry(methodType).State = EntityState.Modified;
		//              await _context.SaveChangesAsync();
		//          }
		//          catch (Exception ex)
		//          {
		//              return BadRequest(new { success = false, message = ex.Message });
		//          }
		//          return Ok(new { success = true, message = "Record Updated Successfully" });
		//      }


		//      #endregion

		//      private bool MakeExists(int id)
		//      {
		//          return _context.Make.Any(e => e.MakeId == id);
		//      }

		//      private bool ModelExists(int id)
		//      {
		//          return _context.ModelType.Any(e => e.ModelId == id);
		//      }

		//      private bool ColorExists(int id)
		//      {
		//          return _context.Color.Any(e => e.ColorId == id);
		//      }

		//      private bool InsuranceCompanyExists(int id)
		//      {
		//          return _context.CompanyBranch.Any(e => e.CompanyBranchId == id);
		//      }

		//public string FormatTimeSpan(TimeSpan ts)
		//{
		//    return $"{ts.Days}d {ts.Hours}h {ts.Minutes}m";
		//}

		public class YourResultType
        {
            public int JobId { get; set; }
            public string DamageReportNumber { get; set; }
            public string RepairOrderNumber { get; set; }
            public string Make { get; set; }
            public string ModelDesc { get; set; }
            public string RegistrationNumber { get; set; }
            public string Department { get; set; }
            public string SubDepartment { get; set; }
            public string DepCategory { get; set; }
            public string ServiceA { get; set; }
            public string Customer { get; set; }
            public string LastContact { get; set; }
        }

    }
}