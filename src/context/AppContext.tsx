// src/context/AppContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Doctor, Appointment, TimeSlot } from '../types';
import { mockDoctors } from '../data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load doctors
        setDoctors(mockDoctors);
        
        // Load appointments from localStorage
        const savedAppointments = localStorage.getItem('appointments');
        if (savedAppointments) {
          setAppointments(JSON.parse(savedAppointments));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Save appointments to localStorage whenever appointments change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);

    // Update doctor's schedule to mark the slot as unavailable
    setDoctors(prev => prev.map(doctor => {
      if (doctor.id === appointmentData.doctorId) {
        const updatedSchedule = doctor.schedule.map(slot => {
          if (slot.date === appointmentData.appointmentDate && 
              slot.startTime === appointmentData.appointmentTime) {
            return { ...slot, isAvailable: false };
          }
          return slot;
        });
        return { ...doctor, schedule: updatedSchedule };
      }
      return doctor;
    }));
  };

  const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getAvailableSlots = (doctorId: string, date: string): TimeSlot[] => {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return [];

    return doctor.schedule.filter(slot => 
      slot.date === date && slot.isAvailable
    );
  };

  const contextValue: AppContextType = {
    doctors,
    appointments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addAppointment,
    getDoctorById,
    getAvailableSlots,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;