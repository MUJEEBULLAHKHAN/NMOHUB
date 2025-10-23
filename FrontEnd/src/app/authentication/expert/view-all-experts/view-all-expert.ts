export interface Expert {

  expertID: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  idType: string;
  idNumber: string;
  profilePicture: string;
  experienceYears: number;
  educationDetails: string;
  linkedInProfileURL: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Rejected';
  createdAt: string;
  areaOfExpertiseIDs: number[];
  areaOfExpertiseNames: string[];
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Expert[];
}