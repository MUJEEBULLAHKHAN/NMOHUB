export class StatusUpdates
{
    jobId?:any;
    assignedUser:assignedTicketUsers[]=[];
    departments:departmentActivity[]=[];
    notes: string = ""
}

export class assignedTicketUsers
{
    employeeId?:number;
}

export class departmentActivity
{
    departmentId?:number;
    activityId?:any;
}