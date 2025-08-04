// src/data/mockData.ts

import { Doctor, TimeSlot } from '../types';

// Generate time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateString = date.toISOString().split('T')[0];
    
    // Morning slots (9 AM - 12 PM)
    for (let hour = 9; hour < 12; hour++) {
      slots.push({
        id: `${dateString}-${hour}:00`,
        date: dateString,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isAvailable: Math.random() > 0.3 // 70% availability
      });
    }
    
    // Evening slots (2 PM - 6 PM)
    for (let hour = 14; hour < 18; hour++) {
      slots.push({
        id: `${dateString}-${hour}:00`,
        date: dateString,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isAvailable: Math.random() > 0.2 // 80% availability
      });
    }
  }
  
  return slots;
};

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    profileImage: '/images/doctor1.jpg',
    availability: 'Available Today',
    experience: 12,
    rating: 4.8,
    location: 'Heart Care Center, Mumbai',
    education: 'MBBS, MD (Cardiology) - AIIMS Delhi',
    about: 'Dr. Sarah Johnson is a renowned cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and has helped thousands of patients maintain healthy hearts.',
    schedule: generateTimeSlots(),
    consultationFee: 800
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    profileImage: '/images/doctor2.jpg',
    availability: 'Available Today',
    experience: 8,
    rating: 4.6,
    location: 'Skin Care Clinic, Delhi',
    education: 'MBBS, MD (Dermatology) - PGIMER Chandigarh',
    about: 'Dr. Michael Chen is an expert dermatologist specializing in skin disorders, cosmetic procedures, and hair treatments. He stays updated with the latest dermatological advancements.',
    schedule: generateTimeSlots(),
    consultationFee: 600
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    profileImage: '/images/doctor3.jpg',
    availability: 'Fully Booked',
    experience: 15,
    rating: 4.9,
    location: 'Children\'s Hospital, Bangalore',
    education: 'MBBS, MD (Pediatrics) - CMC Vellore',
    about: 'Dr. Priya Sharma is a dedicated pediatrician with extensive experience in child healthcare. She is known for her gentle approach and expertise in treating various childhood conditions.',
    schedule: generateTimeSlots().map(slot => ({ ...slot, isAvailable: false })), // Fully booked
    consultationFee: 700
  },
  {
    id: '4',
    name: 'Dr. Robert Wilson',
    specialization: 'Orthopedic',
    profileImage: '/images/doctor1.jpg',
    availability: 'Available Tomorrow',
    experience: 10,
    rating: 4.7,
    location: 'Bone & Joint Center, Chennai',
    education: 'MBBS, MS (Orthopedics) - JIPMER',
    about: 'Dr. Robert Wilson specializes in orthopedic surgery and sports medicine. He has successfully treated numerous patients with bone and joint disorders.',
    schedule: generateTimeSlots(),
    consultationFee: 900
  },
  {
    id: '5',
    name: 'Dr. Emily Davis',
    specialization: 'Gynecologist',
    profileImage: '/images/doctor2.jpg',
    availability: 'On Leave',
    experience: 14,
    rating: 4.8,
    location: 'Women\'s Health Center, Pune',
    education: 'MBBS, MD (Gynecology) - KEM Hospital Mumbai',
    about: 'Dr. Emily Davis is a compassionate gynecologist with expertise in women\'s health, pregnancy care, and reproductive medicine.',
    schedule: generateTimeSlots().map(slot => ({ ...slot, isAvailable: false })), // On leave
    consultationFee: 750
  },
  {
    id: '6',
    name: 'Dr. James Miller',
    specialization: 'Neurologist',
    profileImage: '/images/doctor3.jpg',
    availability: 'Available Today',
    experience: 16,
    rating: 4.9,
    location: 'Neuro Care Institute, Hyderabad',
    education: 'MBBS, DM (Neurology) - NIMHANS Bangalore',
    about: 'Dr. James Miller is a highly experienced neurologist specializing in brain and nervous system disorders. He uses cutting-edge diagnostic techniques.',
    schedule: generateTimeSlots(),
    consultationFee: 1000
  }
];

export const getAvailabilityColor = (status: string): string => {
  switch (status) {
    case 'Available Today':
      return 'bg-green-100 text-green-800';
    case 'Available Tomorrow':
      return 'bg-blue-100 text-blue-800';
    case 'Fully Booked':
      return 'bg-red-100 text-red-800';
    case 'On Leave':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};