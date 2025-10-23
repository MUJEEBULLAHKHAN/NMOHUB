import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

// ... other imports
@Injectable({
  providedIn: 'root',
})
export class SignarRService {

  private hubConnection: signalR.HubConnection | undefined;
  private messageReceivedSubject = new Subject<{ user: string; message: string }>();
  messageReceived$ = this.messageReceivedSubject.asObservable();
  private reconnectCount = 0;
  private maxReconnectAttempts = 1000;
  private reconnectDelay = 1000;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.APIUrl + 'chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on("ReceiveMessage", (user, message) => {
      const userdetails = JSON.parse(localStorage.getItem('workshop') as string)
      if (userdetails == null || userdetails == undefined || userdetails == "") {
        return;
      }
      if (userdetails.workshopId == user) {
        this.messageReceivedSubject.next({ user, message });
      }
    });

    this.connectWithRetry(); // Use retry logic
  };

  private connectWithRetry() {
    this.hubConnection?.start()
      .then(() => {
        console.log('Connection started');
        this.reconnectCount = 0; // Reset reconnect count on successful connection
        this.reconnectDelay = 1000; // Reset reconnect delay
      })
      .catch((err) => {
        console.error('Error while starting connection: ' + err);
        if (this.reconnectCount < this.maxReconnectAttempts) {
          console.log(`Retrying connection in ${this.reconnectDelay / 1000} seconds...`);
          setTimeout(() => {
            this.reconnectCount++;
            this.reconnectDelay *= 2; // Exponential backoff
            this.connectWithRetry(); // Recursive call to retry
          }, this.reconnectDelay);
        } else {
          console.error('Max reconnect attempts reached.');
          // Handle the case where all retries have failed (e.g., display an error message to the user)
        }
      });

    this.hubConnection?.onclose(() => {
      console.error('Connection closed.');
      this.connectWithRetry(); // Retry on close as well
    });
  }
}