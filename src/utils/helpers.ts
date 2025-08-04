// Utility functions for the healthcare appointment booking app

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 % 12 || 12;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleanPhone.length >= 10;
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isTimeSlotAvailable = (
  appointments: any[],
  date: string,
  time: string,
  doctorId?: string
): boolean => {
  return !appointments.some(appointment => 
    appointment.date === date && 
    appointment.time === time &&
    (doctorId ? appointment.doctorId === doctorId : true)
  );
};

export const formatAppointmentDateTime = (date: string, time: string): string => {
  return `${formatDate(date)} at ${formatTime(time)}`;
};