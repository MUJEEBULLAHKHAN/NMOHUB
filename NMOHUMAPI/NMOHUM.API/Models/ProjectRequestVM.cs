using System;
using System.Collections.Generic;

namespace NMOHUM.API.Models
{
    public class ProjectRequestVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public ProjectRequest requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public Partner Partner { get; set; }
        public OtherProgramAttend OtherProgramAttend { get; set; }
        public List<DocumentData> documentlist { get; set; }

    }
    public class ProjectRequestResponseVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public ProjectRequest requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public Partner Partner { get; set; }
        public OtherProgramAttend OtherProgramAttend { get; set; }
        public List<Documents> documentlist { get; set; }
        public ProjectArea projectArea { get; set; }
        public ProjectPhase projectPhase { get; set; }
        public ProjectStatus projectStatus { get; set; }

    }
    public class EmailVerifyModel
    {
        public string EmailAddress { get; set; }
        public string Otp { get; set; }
    }
    public class ProjectRequestFullVM
    {
        public ProjectRequest requestModel { get; set; }
        public Partner Partner { get; set; }
        public OtherProgramAttend OtherProgramAttend { get; set; }
        public List<DocumentData> documentlist { get; set; }
    }
    public class DocumentData
    {
        public string Base64Data { get; set; }
        public string DocumentType { get; set; }
        public string Extension { get; set; }

    }

    public class ApproveProjectRequestModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public DateTime? FollowUpStart { get; set; }
        public DateTime? FollowUpEnd { get; set; }
        public string Comments { get; set; }
    }
    public class RejectProjectRequestModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Comments { get; set; }
    }
    public class PitchCompleteRequestModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public string Feedback { get; set; }
        public List<DocumentData> Documents { get; set; }
    }

    public class ProgramActiveRequestModel
    {
        public int EmployeeId { get; set; }
        public int ProjectId { get; set; }
        public DateTime? ProjectStart { get; set; }
        public DateTime? ProjectEnd { get; set; }
        public string Comments { get; set; }
    }

    public class MvpProgramFullVM
    {
        public MvpProgram requestModel { get; set; }
        public List<DocumentData> documentlist { get; set; }
    }
    public class MvpProgramResponseVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public MvpProgram requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<Documents> documentlist { get; set; }
        public ProjectArea projectArea { get; set; }
        public ProjectPhase projectPhase { get; set; }
        public ProjectStatus projectStatus { get; set; }

    }
    public class MVPProgramVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public MvpProgram requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<DocumentData> documentlist { get; set; }

    }

    public class FeasibilityStudyFullVM
    {
        public FeasibilityStudy requestModel { get; set; }
        public List<DocumentData> documentlist { get; set; }
    }
    public class FeasibilityStudyResponseVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public FeasibilityStudy requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<Documents> documentlist { get; set; }
        public ProjectArea projectArea { get; set; }
        public ProjectPhase projectPhase { get; set; }
        public ProjectStatus projectStatus { get; set; }

    }
    public class FeasibilityStudyVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public FeasibilityStudy requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<DocumentData> documentlist { get; set; }

    }
    public class PreAcceleratorFullVM
    {
        public PreAccelerator requestModel { get; set; }
        public List<DocumentData> documentlist { get; set; }
    }
    public class PreAcceleratorResponseVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public PreAccelerator requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<Documents> documentlist { get; set; }
        public ProjectArea projectArea { get; set; }
        public ProjectPhase projectPhase { get; set; }
        public ProjectStatus projectStatus { get; set; }

    }
    public class PreAcceleratorVM
    {
        public EmailVerifyModel emailverifyModel { get; set; }
        public PreAccelerator requestModel { get; set; }
        public RegisterUserVM userRegisterModel { get; set; }
        public List<DocumentData> documentlist { get; set; }

    }
}

