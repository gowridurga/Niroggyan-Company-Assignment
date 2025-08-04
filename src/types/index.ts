// src/types/index.ts

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  availability: AvailabilityStatus;
  experience: number;
  rating: number;
  location: string;
  education: string;
  about: string;
  schedule: TimeSlot[];
  consultationFee: number;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Patient {
  name: string;
  email: string;
  phone?: string;
}

export interface BookingFormData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: string;
}

export type AvailabilityStatus = 
  | 'Available Today' 
  | 'Fully Booked' 
  | 'On Leave' 
  | 'Available Tomorrow';

export type AppointmentStatus = 
  | 'scheduled' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show';

export interface AppContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  getAvailableSlots: (doctorId: string, date: string) => TimeSlot[];
}

export interface FormErrors {
  patientName?: string;
  patientEmail?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}