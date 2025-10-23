import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { da } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class WorkshopCommunicationService {

 constructor(private http: HttpClient) {
   }
 
   public GetPaginatedConversations(pageId:any,employeeId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/GetAllConversations/`+pageId+'/'+employeeId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

   public GetUnreadPaginatedConversations(pageId:any,employeeId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/GetUnreadPaginatedConversations/`+pageId+'/'+employeeId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

    public GetAllChatsByConversationId(conversationId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/GetAllChatsByConversationId/`+conversationId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

   public MarkConversationAsRead(conversationId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/MarkConversationAsRead/`+conversationId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

   public ArchiveConversation(conversationId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/ArchiveChat/`+conversationId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

   public SearchForJobToBeTransfered(data:any,conversationId:any): Observable<HttpResponse<any>> {
     return this.http.post<any>(environment.baseAPIUrl + `Conversations/SearchForJobToBeTransfered/`+conversationId,data ,  {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }

    public TransferConversationToAJob(conversationId:any,jobId:any): Observable<HttpResponse<any>> {
     return this.http.get<any>(environment.baseAPIUrl + `Conversations/TransferConversationToAJob/`+conversationId+'/'+jobId, {
       headers: new HttpHeaders({'Content-type': 'Application/json'}),
       observe: 'response'
     });
   }
 

}
