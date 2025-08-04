// src/components/appointments/BookingForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { BookingFormData, FormErrors, Doctor, Appointment } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface BookingFormProps {
  doctor: Doctor;
}

const BookingForm: React.FC<BookingFormProps> = ({ doctor }) => {
  const { addAppointment, getAvailableSlots } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    doctorId: doctor.id,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Update available slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      const slots = getAvailableSlots(doctor.id, formData.appointmentDate);
      setAvailableSlots(slots.map(slot => slot.startTime));
      
      // Clear selected time if it's no longer available
      if (formData.appointmentTime && !slots.some(slot => slot.startTime === formData.appointmentTime)) {
        setFormData(prev => ({ ...prev, appointmentTime: '' }));
      }
    }
  }, [formData.appointmentDate, formData.appointmentTime, doctor.id, getAvailableSlots]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate patient name
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    } else if (formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Patient name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.patientName.trim())) {
      newErrors.patientName = 'Patient name should only contain letters and spaces';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Email is required';
    } else if (!emailRegex.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }

    // Validate date
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date';
    } else if (formData.appointmentDate < today) {
      newErrors.appointmentDate = 'Please select a future date';
    } else {
      // Check if selected date is too far in future (optional)
      const selectedDate = new Date(formData.appointmentDate);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90); // 90 days from today
      
      if (selectedDate > maxDate) {
        newErrors.appointmentDate = 'Please select a date within the next 90 days';
      }
    }

    // Validate time
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select an appointment time';
    } else if (!availableSlots.includes(formData.appointmentTime)) {
      newErrors.appointmentTime = 'Selected time slot is no longer available';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const appointmentData = {
        doctorId: formData.doctorId,
        patientName: formData.patientName.trim(),
        patientEmail: formData.patientEmail.trim(),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        status: 'scheduled' as const,
      };

      addAppointment(appointmentData);

      // Create the confirmed appointment object for the modal
      const appointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setConfirmedAppointment(appointment);
      setShowConfirmation(true);

    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setConfirmedAppointment(null);
    navigate('/');
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientEmail: '',
      appointmentDate: '',
      appointmentTime: '',
      doctorId: doctor.id,
    });
    setErrors({});
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle Terms of Service navigation
    console.log('Navigate to Terms of Service');
    // You can implement proper navigation here, e.g.:
    // navigate('/terms-of-service');
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle Privacy Policy navigation
    console.log('Navigate to Privacy Policy');
    // You can implement proper navigation here, e.g.:
    // navigate('/privacy-policy');
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/doctor/${doctor.id}`)}
          className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=ffffff&size=100`;
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Book Appointment</h1>
              <p className="text-gray-600">
                Schedule your consultation with <span className="font-medium">{doctor.name}</span>
              </p>
              <p className="text-sm text-primary-600">{doctor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Name */}
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.patientName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
              {errors.patientName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.patientName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="patientEmail"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.patientEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {errors.patientEmail && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.patientEmail}
                </p>
              )}
            </div>

            {/* Appointment Date */}
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.appointmentDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.appointmentDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.appointmentDate}
                </p>
              )}
            </div>

            {/* Appointment Time */}
            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <select
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.appointmentTime ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={!formData.appointmentDate || isSubmitting}
              >
                <option value="">
                  {formData.appointmentDate ? 'Select a time slot' : 'Please select a date first'}
                </option>
                {availableSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.appointmentTime}
                </p>
              )}
              {formData.appointmentDate && availableSlots.length === 0 && (
                <p className="mt-2 text-sm text-yellow-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  No slots available for selected date. Please choose another date.
                </p>
              )}
            </div>

            {/* Consultation Fee Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Consultation Fee: ₹{doctor.consultationFee}
                  </p>
                  <p className="text-xs text-blue-700">
                    Payment can be made at the clinic or online before the appointment.
                    Cancellation allowed up to 2 hours before the scheduled time.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || availableSlots.length === 0 || !formData.appointmentDate}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  isSubmitting || availableSlots.length === 0 || !formData.appointmentDate
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking Appointment...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-500 text-center">
              By booking this appointment, you agree to our{' '}
              <button
                type="button"
                onClick={handleTermsClick}
                className="text-primary-600 hover:text-primary-700 underline bg-transparent border-none cursor-pointer p-0"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={handlePrivacyClick}
                className="text-primary-600 hover:text-primary-700 underline bg-transparent border-none cursor-pointer p-0"
              >
                Privacy Policy
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && confirmedAppointment && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={handleConfirmationClose}
          appointment={confirmedAppointment}
          doctor={doctor}
        />
      )}
    </>
  );
};

export default BookingForm;