export interface Doctor {
  id: number;
  name: string;
  role: string;
  gender: 'Male' | 'Female';
  specialty: string;
  img: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Nguyen Kim Thuy',
    role: 'Surgeon',
    gender: 'Female',
    specialty: 'Surgery',
    img: 'Doctor.png',
  },
  {
    id: 2,
    name: 'Le Minh Anh',
    role: 'Psychologist',
    gender: 'Female',
    specialty: 'Mental Health',
    img: 'Doctor.png',
  },
  {
    id: 3,
    name: 'Tran Quoc Duy',
    role: 'Endocrinologist',
    gender: 'Male',
    specialty: 'Endocrinology',
    img: 'Doctor.png',
  },
  {
    id: 4,
    name: 'Phan Hoang Phuc',
    role: 'Legal Consultant',
    gender: 'Male',
    specialty: 'Legal Support',
    img: 'Doctor.png',
  },
  {
    id: 5,
    name: 'Nguyen Hoang Lam',
    role: 'Laboratory Specialist',
    gender: 'Male',
    specialty: 'Lab Test',
    img: 'Doctor.png',
  },
  {
    id: 6,
    name: 'Vu Thi Thanh',
    role: 'Education Specialist',
    gender: 'Female',
    specialty: 'Education',
    img: 'Doctor.png',
  },
  // ...add more as needed
];
