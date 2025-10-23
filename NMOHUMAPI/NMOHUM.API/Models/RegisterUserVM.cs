using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public class RegisterUserVM
    {
        public string FullName { get; set; }
        public int CountryId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string MobileNumber { get; set; }
        public string EmailAddress { get; set; }
        public string LinkedInProfileLink { get; set; }
        [NotMapped]
        public string CountryName { get; set; }
    }
} 