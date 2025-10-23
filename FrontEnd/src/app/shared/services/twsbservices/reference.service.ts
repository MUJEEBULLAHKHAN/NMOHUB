import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  
  constructor(private http: HttpClient) {
  }
  
  public GetAllCity(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `City/GetAllCities`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateCity(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`City`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

   public UpdateCity(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`City/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

    public GetAllProjectType(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ProjectType`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateProjectType(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`ProjectType`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateProjectType(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`ProjectType/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }


    public GetAllProjectStatus(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ProjectStage`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateProjectStatus(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`ProjectStage`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateProjectStatus(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`ProjectStage/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

    public GetAllPaymentStatus(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `PaymentStatus`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreatePaymentStatus(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`PaymentStatus`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdatePaymentStatus(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`PaymentStatus/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }


   public UpdateConfigure(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`ConfigureValue/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }



























  public GetAllCountry(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/country`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllCurrency(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/currency`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllmake(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/make`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetPartTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/PartTypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }



  async GetAllmakeAsync(): Promise<any> {
    try {
      const data = await firstValueFrom(this.http.get<any[]>(environment.baseAPIUrl + `References/make`)); // Convert Observable to Promise
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  public GetmakeById(makeId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/make?makeId=` + makeId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllModelsByMakeId(makeid: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/ModelsByMakeId?makeId=` + makeid, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetModelByMakeId(makeid: any, modelId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/ModelsByMakeId?makeId=` + makeid + '?id=' + modelId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateMake(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/UpdateMake`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateModel(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/UpdateModel`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllcolors(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/colors`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateColour(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/UpdateColour`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateDocumentTypes(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/DocumentTypes`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllDocumentTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/DocumentTypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateDocumentTypes(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/DocumentTypes`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public UpdateCompanyType(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/CompanyType`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetExternalEmailByCompanyBranchId(CompanyBranchId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`Workshops/ExternalCompanyEmail?CompanyBranchId=` + CompanyBranchId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateExternalCompanyEmail(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Workshops/ExternalCompanyEmail`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateExternalCompanyEmail(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`Workshops/ExternalCompanyEmail`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DeleteExternalEmailById(Id: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(environment.baseAPIUrl +`Workshops/ExternalCompanyEmail?Id=` + Id, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetJobTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/jobtypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetVehicleBodyTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/VehicleBodyTypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetInsuranceCompaniesDropDown(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetInsuranceCompaniesDropDown`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetPartSuppliersDropDown(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetPartSuppliersDropDown`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetServiceAdvisors(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/ServiceAdvisorByWorkshop`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetEstimators(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/EstimatorsByWorkshop`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllDisclaimer(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/Disclaimer`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateDisclaimers(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/Disclaimer`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateDisclaimer(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/Disclaimer`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllDepartmentCategories(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/DepartmentCategories`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllDepartmentType(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/DepartmentType`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllSubDepartmentTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/GetAllSubDeptartments`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateDepartmentType(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/DepartmentType`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DeleteDepartmentType(departmentTypeId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(environment.baseAPIUrl +`References/DepartmentType/${departmentTypeId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllDepartmentTypeByCategoryId(categoryId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/DepartmentTypeByCategoryId?categoryId=` + categoryId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllUnHiddenDepartmentCategories(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/UnHiddenDepartmentCategories`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllAnswerTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/AnswerTypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllWorkshopSurveyQuestion(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/WorkshopSurveyQuestions`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateWorkshopSurveyQuestions(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/WorkshopSurveyQuestions`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateWorkshopSurveyQuestions(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/WorkshopSurveyQuestions`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DeleteWorkshopSurveyQuestions(workshopSurveyQuestionId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(environment.baseAPIUrl +`References/WorkshopSurveyQuestions/${workshopSurveyQuestionId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public WorkshopSurveyAnswer(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/WorkshopSurveyAnswer`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllWorkshopCSIField(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/WorkshopCSIField`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public GetAllWorkshopSurveyQuestionByJobSurveyId(jobId: number, surveyId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/GetAllWorkshopSurveyQuestionByJobSurveyId?jobId=` + jobId + '&surveyId=' + surveyId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllWorkshopSurveyQuestionByJobId(jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/GetAllWorkshopSurveyQuestionByJobId?jobId=` + jobId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateWorkshopCSIField(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/WorkshopCSIField`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddWorkshopCSIPackage(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `References/WorkshopCSIPackage`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public ExportToExcel(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `References/ExportToExcel`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public GetEmployeesWithTitles(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/GetEmployeesWithTitles`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AllEmployees(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/AllEmployees`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllEmployeeAndRole(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/AllEmployeeAndRole`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetEmailTemplateByTemplateFor(TemplateFor: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/EmailTemplate?TemplateFor=` + TemplateFor, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetReturnForCreditReasons(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/ReturnForCreditReasons`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetPartStatusOptions(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetPartStatusOptions`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetServiceAdvisors1(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/ServiceAdvisorByWorkshop1`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  
  public CreateRoles(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/Roles`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllRoles(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/Roles`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateRoles(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/Roles`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateTaskReference(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/TaskReference`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllTaskReference(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/TaskReference`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateTaskReference(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/TaskReference`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateCommunicationMethod(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/CommunicationMethod`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllCommunicationMethod(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/CommunicationMethod`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateCommunicationMethod(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/CommunicationMethod`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllCommunicationMethodActive(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/CommunicationMethodActive`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public PostCustomer(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Customers`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateQualityControlQuestions(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/QualityControlQuestions`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetQualityControlQuestions(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`References/QualityControlQuestions`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateQualityControlQuestions(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/QualityControlQuestions`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
}