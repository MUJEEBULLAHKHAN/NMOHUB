using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NMOHUM.API.Models;
using NMOHUM.API.Utilities.MailingUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static NMOHUM.API.Controllers.ProjectRequestController;

namespace NMOHUM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceRequestController : ControllerBase
    {
        private readonly NMOHUMAuthenticationContext _context;
        private readonly UserAuthController _userAuthController;
        private readonly UserManager<IdentityUser> _userManager; private readonly Mailer _mailer;
        public ServiceRequestController(NMOHUMAuthenticationContext context, UserManager<IdentityUser> userManager, Mailer mailer, UserAuthController userAuthController)
        {
            _context = context;
            _mailer = mailer;
            _userManager = userManager;
            _userAuthController = userAuthController;
        }

        

        [HttpPost("CreateRequestByUser")]
        public async Task<ActionResult> CreateRequestByUser(ServiceRequestVM request)
        {
            ServiceRequest serviceRequest = new ServiceRequest();
            if (request.EmployeeId == null || request.EmployeeId == 0)
            {
                if (string.IsNullOrWhiteSpace(request.EmailAddress))
                    return BadRequest(new { success = false, message = "Email address is required." });
                var existingEmployee = _context.Employee.FirstOrDefault(e => e.EmailAddress == request.EmailAddress && (e.IsRemoved == null || e.IsRemoved == false));
                if (existingEmployee != null)
                {
                    serviceRequest.EmployeeId = existingEmployee.EmployeeId;
                }
                else
                {
                    // create user and create request with that user inofrmation

                    var password = GenerateRandomPassword();
                    var user = new IdentityUser
                    {
                        Email = request.EmailAddress,
                        UserName = request.EmailAddress
                    };

                    var result = await _userManager.CreateAsync(user, password);
                    if (!result.Succeeded)
                        return BadRequest(new { success = false, message = "Failed to create user.", errors = result.Errors });

                    // Assign RoleId = 1
                    _context.UserRoles.Add(new IdentityUserRole<string>
                    {
                        RoleId = "1",
                        UserId = user.Id
                    });
                    await _context.SaveChangesAsync();

                    // Create employee record

                    Employee employee = new Employee
                    {
                        FirstNames = request.FullName,
                        LastName = request.FullName,
                        UserId = user.Id,
                        EmailAddress = user.Email,
                        MobileNumber = "0000000000",
                        CountryId = 1,
                        DateOfBirth = DateTime.Now,
                        LinkedInProfileLink = string.Empty
                    };
                    _context.Employee.Add(employee);
                    await _context.SaveChangesAsync();


                    // Send password via email
                    string[] emailList = new string[1] { request.EmailAddress };
                    _mailer.SendEmail(
       emailList,
       "support@nmohub.com",
       "NMOHUB Registration Complete – Login Info Inside", // fixed character encoding
       $@"
     <p>Congratulations for Registration.</p>
     <p>Please find your credentials below:</p>
     <p><strong>Your password is:</strong> {password}</p>
 ",
       true
   );

                    serviceRequest.EmployeeId = employee.EmployeeId;

                }

            }
            else
            {
                serviceRequest.EmployeeId = request.EmployeeId;
            }
            serviceRequest.ServiceId = request.ServiceId;
            serviceRequest.PackageId = request.PackageId;
            serviceRequest.Status = "Created";
            serviceRequest.StatusId= 1;
            serviceRequest.PaymentStatus = "Pending";
            serviceRequest.CreatedAt = DateTime.UtcNow;
            // Get package details if PackageId is provided and convert to JSON string and assign it  to PackagejsonString
            
                var package = await _context.Package.FirstOrDefaultAsync(p => p.PackageId == request.PackageId);
                if (package != null)
                {
                    var packageJson = JsonConvert.SerializeObject(package);
                    serviceRequest.PackageJsonString = packageJson;
                }
            
            _context.ServiceRequest.Add(serviceRequest);
            await _context.SaveChangesAsync();
            var activity = new ServiceActivity
            {
                ServiceRequestId = serviceRequest.Id,
                ServiceId = serviceRequest.ServiceId,
                StatusId = 1,
                UpdatedBy = serviceRequest.EmployeeId, Comments="Created",
                CreateAt = DateTime.Now
            };
            _context.ServiceActivity.Add(activity);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Service request created successfully", data = serviceRequest });
        }
        private string GenerateRandomPassword()
        {
            return $"Nmo{new Random().Next(100000, 999999)}!";
        }
        // GET: api/ServiceRequest
        [HttpGet]
        [Route("GetAllVOService/{employeeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllVOService(int employeeId)
        {
            try
            {

               var query = _context.ServiceRequest.Where(x=>x.EmployeeId==employeeId).AsQueryable();


                // generate code for query to include service and package details
                var requests = await query
                    .Include(r => r.Service)
                    .Include(r => r.Package)
                  
                    .ToListAsync();

                return Ok(new { message = "Service requests fetched successfully", data = requests });
            }
            catch (Exception ex)
            {
                return Ok(new { message = "Something went wrong", data = ex });
            }
          
        }


        // GET: api/ServiceRequest
        [HttpGet]
        [Route("GetVOServiceById/{id}")]
        public async Task<ActionResult<object>> GetVOServiceById(int id)
        {
            try
            {

                var query = _context.ServiceRequest.Where(x => x.Id == id).AsQueryable();


                // generate code for query to include service and package details
                var requests = query
                    .Include(r => r.Service)
                    .Include(r => r.Package)
                    .Include(r => r.Employee)

                    .FirstOrDefault();

                return Ok(new { message = "Service requests fetched successfully", data = requests });
            }
            catch (Exception ex)
            {
                return Ok(new { message = "Something went wrong", data = ex });
            }

        }


        // GET: api/ServiceRequest
        [HttpGet]
        [Route("GetAllServicesByAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllServicesByAdmin()
        {
            var query = _context.ServiceRequest.AsQueryable();
            var requests = await query
                .Include(r => r.Service)
                .Include(r => r.Package)
                .Join(
                    _context.Employee,
                    sr => sr.EmployeeId,
                    emp => emp.EmployeeId,
                    (sr, emp) => new
                    {
                        sr.Id,
                        sr.ServiceId,
                        ServiceName = sr.Service.Name,
                        UserName = emp.FirstNames + " " + emp.LastName,
                        sr.PackageId,
                        PackageName = sr.Package != null ? sr.Package.Name : null,
                        sr.Status,
                        sr.PaymentStatus,
                        sr.CreatedAt
                    }
                )
                .ToListAsync();

            return Ok(new { message = "Service requests fetched successfully", data = requests });
        }


      
        [HttpPost("UpdatePaymentStatus")]
        public async Task<IActionResult> UpdatePaymentStatus([FromBody] PaymentUpdateModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.Id <= 0)
                return BadRequest(new { success = false, message = "EmployeeId and Id are required and must be greater than 0." });
           
            var pa = await _context.ServiceRequest.FirstOrDefaultAsync(p => p.Id == model.Id);
            if (pa == null)
                return NotFound(new { success = false, message = "Service  request not found." });
            //  pa.StatusId = 11;
            pa.Status = "Payment Done";
            pa.PaymentStatus = "Done";
            _context.Entry(pa).State = EntityState.Modified;
            var activity = new ServiceActivity
            {
                ServiceRequestId = model.Id,
                ServiceId = pa.ServiceId,
                StatusId = 2,
                UpdatedBy = model.EmployeeId,
                Comments = "Payment Done",
                CreateAt = DateTime.Now
            };
            _context.ServiceActivity.Add(activity);
            PaymentActivity paymentActivity = new PaymentActivity();
            paymentActivity.ProjectId = pa.Id; 
            paymentActivity.ServiceId = pa.ServiceId; 
            paymentActivity.PaymentName = "Initial Payment";
            paymentActivity.CreatedAt = DateTime.Now;
            _context.PaymentActivity.Add(paymentActivity);
            await _context.SaveChangesAsync();
           
            return Ok(new { success = true, message = "Payment Process completed successfully." });
        }
        public class PaymentUpdateModel
        {
            public int EmployeeId { get; set; }
            public int Id { get; set; }
         
        }




        [HttpPost("UpdateServiceActive")]
        public async Task<IActionResult> UpdateServiceActive([FromBody] ServiceActiveUpdateModel model)
        {
            if (model == null || model.EmployeeId <= 0 || model.Id <= 0)
                return BadRequest(new { success = false, message = "EmployeeId and Id are required and must be greater than 0." });

            var pa = await _context.ServiceRequest.FirstOrDefaultAsync(p => p.Id == model.Id);
            if (pa == null)
                return NotFound(new { success = false, message = "Service  request not found." });
            //  pa.StatusId = 11;
            pa.Status = "Service Activated";
            _context.Entry(pa).State = EntityState.Modified;
            var activity = new ServiceActivity
            {
                ServiceRequestId = model.Id,
                ServiceId = pa.ServiceId, 
                StatusId = 3,
                UpdatedBy = model.EmployeeId,
                Comments = "Service Activated",
                CreateAt = DateTime.Now
            };
            _context.ServiceActivity.Add(activity);
            
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Service Activated successfully." });
        }
        public class ServiceActiveUpdateModel
        {
            public int EmployeeId { get; set; }
            public int Id { get; set; }

        }


        [HttpGet("export")]
        public async Task<IActionResult> ExportVirtualOfficeList([FromQuery] int statusId = 0)
        {

            try
            {
                var query = _context.ServiceRequest.AsQueryable();
                var _result = await query
                .Include(r => r.Service)
                .Include(r => r.Package)
                .Join(
                    _context.Employee,
                    sr => sr.EmployeeId,
                    emp => emp.EmployeeId,
                    (sr, emp) => new
                    {
                        sr.Id,
                        sr.ServiceId,
                        ServiceName = sr.Service.Name,
                        UserName = emp.FirstNames + " " + emp.LastName,
                        sr.PackageId,
                        PackageName = sr.Package != null ? sr.Package.Name : null,
                        sr.Status,
                        sr.PaymentStatus,
                        sr.CreatedAt
                    }
                )
                .ToListAsync();

                var csv = new StringBuilder();
                csv.AppendLine("Id,ServiceName,UserName,PackageName,CreatedAt,Status");
                foreach (var item in _result)
                {
                    csv.AppendLine($"{item.Id},{item.ServiceName},{item.UserName},\"{item.PackageName}\",\"{item.CreatedAt},\"{item.Status}");
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                var fileName = $"VO_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                return File(bytes, "text/csv", fileName);

            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }




        }


    }

}
