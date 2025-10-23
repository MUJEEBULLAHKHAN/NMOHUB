using System;
using System.ComponentModel.DataAnnotations;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

namespace NMOHUM.API.Models
{
    public class ServiceRequestViewModel
    {
        public int ServiceId { get; set; }
        public int? PackageId { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }
        public RegisterVM Entrepreneur { get; set; }
    }
    public class ServiceRequestModel
    {
        public int ServiceId { get; set; }
        public string UserId { get; set; }
        public int? PackageId { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }
        public RegisterEntrepreneur Entrepreneur { get; set; }
    }
    public class RegisterEntrepreneur
    {
        public string EmailAddress { get; set; }
        public string FirstNames { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public int[] RoleIds { get; set; }

    }
    public class EntrepreneurViewModel
    {
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string FullName { get; set; }
        public string NationalId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
    public class RequestVM
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public int PackageId { get; set; }
        public string PackageName { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public DateTime CreatedAt { get; set; }

    }

    public class ServiceRequestVM
    {
        public int EmployeeId { get; set; }
        public string UserId { get; set; }
        public int ServiceId { get; set; }
        public int PackageId { get; set; }
        public string EmailAddress { get; set; }
        public string FullName { get; set; }
        public bool IsNafathVerfied { get; set; }

    }
}
