export class authentication
{
    emailAddress:any;
    password:any;
    workshopId?:number;
}
export class registerUser
{
    userId?:number;
    firstNames?:string;
    lastName?:string;
    emailAddress?:string;
    password?:string;
    confirmPassword?:string;
    roleIds:number[]= [];
}