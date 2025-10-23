using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NMOHUM.API.Models
{
    public partial class Employee   
    {
        [Key]
        public int    EmployeeId { get; set; }
        public string FirstNames { get; set; }
        public string LastName { get; set; }
        public string JobTitle { get; set; }
        public string Department { get; set; }
        public string WorkTelephone { get; set; }
        public string HomeTelephone { get; set; }
        public string MobileNumber { get; set; }
        public string EmailAddress { get; set; }
        public string FullAddress { get; set; }
        public string StreetNo { get; set; }
        public string StreetName { get; set; }
        public string CityTown { get; set; }
        public string ZipCode { get; set; }
        public int? CountryId { get; set; }
        public string UserId { get; set; }
        public string SignatureUrl { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? LastLoggedIn { get; set; }
        public bool? IsRemoved { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string LinkedInProfileLink { get; set; }
        public string NationalID  { get; set; }
        public string CommercialRegistration   { get; set; }
        public string CompanyName   { get; set; }

		public virtual IdentityUser User { get; set; }
        [NotMapped]
        public int EntrepreneurId {  get; set; }
        public string? Organization { get; set; }
    }
}
