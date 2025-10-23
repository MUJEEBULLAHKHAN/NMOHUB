using System;
using System.ComponentModel.DataAnnotations;

namespace NMOHUM.API.Models
{
    public class RegisterVM
    {
        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }
        [Required]
        public string FirstNames { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [Display(Name = "Confirm Password")]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
        public int[] RoleIds { get; set; }
       
    }
    
} 