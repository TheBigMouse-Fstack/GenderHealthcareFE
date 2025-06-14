export interface DoctorDetail {
  doctor_id: string;
  department: string;
  speciality: string;
  license_no: string;
  about_me: {
    description: string;
    experience: string;
  };
  staff_members: {
    full_name: string;
    image_link: string;
    working_email: string;
    years_experience: number;
    gender: string;
  };
}
export interface Doctor {
  doctor_id: string;
  department: string;
  speciality: string;
  staff_members: {
    full_name: string;
    image_link: string;
    gender: string;
  };
}
