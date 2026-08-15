export interface ProfileData {
  // Personal Data
  fullName: string;
  nickname: string;
  nik: string;
  age: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  address: string;

  // Academic Data
  university: string;
  studentId: string; // NIM/NPM
  faculty: string;
  major: string;
  semester: string;
  gpa: string;
  startYear: string;
  gradYear: string;

  // Professional Data
  summary: string;
  linkedin: string;
  github: string;
  portfolio: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  skills: string;
  workExperience: string;
  orgExperience: string;
}

export interface FieldMatcher {
  field: keyof ProfileData;
  regex: RegExp;
  label: string;
}

export interface AutofillMessage {
  action: "AUTOFILL_EXECUTE" | "CHECK_FORM_STATUS";
}

export interface AutofillResponse {
  success: boolean;
  filledCount?: number;
  totalFields?: number;
  hasForm?: boolean;
  message?: string;
}
