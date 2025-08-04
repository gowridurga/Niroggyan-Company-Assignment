// src/components/common/Header.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/about';
  const isContactPage = location.pathname === '/contact';

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">HealthCare</h1>
                <p className="text-xs text-gray-500">Book Your Appointment</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-medium transition-colors duration-200 ${
                isHomePage 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isAboutPage 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isContactPage 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                // Toggle mobile menu - you can implement this later
                console.log('Mobile menu toggle');
              }}
              className="text-gray-600 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Emergency Contact */}
          <div className="hidden md:flex items-center">
            <div className="hidden sm:block text-right mr-4">
              <p className="text-sm font-medium text-gray-900">Emergency</p>
              <p className="text-sm text-red-600 font-semibold">+91 1800-123-456</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;