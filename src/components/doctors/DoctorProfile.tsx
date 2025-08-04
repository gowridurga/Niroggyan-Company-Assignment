// src/components/doctors/DoctorProfile.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor } from '../../types';
import { getAvailabilityColor } from '../../data/mockData';

interface DoctorProfileProps {
  doctor: Doctor;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/book/${doctor.id}`);
  };

  // Get today's available slots
  const today = new Date().toISOString().split('T')[0];
  const todaySlots = doctor.schedule.filter(slot => 
    slot.date === today && slot.isAvailable
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Doctors
      </button>

      {/* Doctor Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="md:flex">
          {/* Doctor Image */}
          <div className="md:w-1/3">
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="w-full h-64 md:h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=ffffff&size=400`;
              }}
            />
          </div>

          {/* Doctor Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {doctor.name}
                </h1>
                <p className="text-lg text-primary-600 font-medium mb-2">
                  {doctor.specialization}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {doctor.education}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(doctor.availability)}`}>
                {doctor.availability}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{doctor.experience}</div>
                <div className="text-sm text-gray-600">Years Exp.</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{doctor.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">₹{doctor.consultationFee}</div>
                <div className="text-sm text-gray-600">Consultation</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{todaySlots.length}</div>
                <div className="text-sm text-gray-600">Available Today</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {doctor.location}
              </div>
            </div>

            {/* Book Appointment Button */}
            <button
              onClick={handleBookAppointment}
              disabled={doctor.availability === 'On Leave'}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-colors duration-200 ${
                doctor.availability === 'On Leave'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {doctor.availability === 'On Leave' ? 'Currently On Leave' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
      </div>

      {/* Today's Available Slots */}
      {todaySlots.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Today</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {todaySlots.slice(0, 12).map((slot) => (
              <div
                key={slot.id}
                className="p-3 border border-gray-200 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
                onClick={handleBookAppointment}
              >
                <div className="text-sm font-medium text-gray-900">
                  {slot.startTime}
                </div>
              </div>
            ))}
          </div>
          {todaySlots.length > 12 && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              +{todaySlots.length - 12} more slots available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;