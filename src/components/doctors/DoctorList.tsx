// src/components/doctors/DoctorList.tsx

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import DoctorCard from './DoctorCard';

const DoctorList: React.FC = () => {
  const { doctors, searchTerm } = useAppContext();

  // Enhanced filter - show all doctors if searching for common prefixes like "Dr."
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchTerm) return true; // Show all doctors when no search term
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // If searching for common doctor prefixes, show all doctors with that prefix
    if (searchLower === 'dr' || searchLower === 'dr.' || searchLower === 'doctor') {
      return doctor.name.toLowerCase().startsWith('dr');
    }
    
    // Split search term for multiple words
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    // Check if search starts with "Dr." - if so, show all doctors starting with Dr.
    if (searchWords[0] === 'dr' || searchWords[0] === 'dr.') {
      // Show all doctors starting with Dr., plus specific name matches
      if (doctor.name.toLowerCase().startsWith('dr')) {
        // If there's a second word (like "James" in "Dr. James"), also match that
        if (searchWords.length > 1) {
          const nameAfterDr = doctor.name.toLowerCase().replace(/^dr\.?\s*/, '');
          return searchWords.slice(1).some(word => 
            nameAfterDr.includes(word) || nameAfterDr.startsWith(word)
          );
        }
        return true; // Show all Dr. names if just searching "Dr"
      }
    }
    
    // Regular search logic for other terms
    return searchWords.some(word => (
      doctor.name.toLowerCase().includes(word) ||
      doctor.specialization.toLowerCase().includes(word) ||
      doctor.location.toLowerCase().includes(word) ||
      // Also check if any word in doctor's name starts with the search term
      doctor.name.toLowerCase().split(' ').some(nameWord => nameWord.startsWith(word)) ||
      doctor.specialization.toLowerCase().split(' ').some(specWord => specWord.startsWith(word))
    ));
  });

  // Get search suggestions based on available doctors
  const getSearchSuggestions = () => {
    if (!searchTerm || filteredDoctors.length > 0) return [];
    
    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();
    
    doctors.forEach(doctor => {
      // Suggest names that contain the search term
      if (doctor.name.toLowerCase().includes(searchLower)) {
        suggestions.add(`"${doctor.name}"`);
      }
      
      // Suggest specializations
      if (doctor.specialization.toLowerCase().includes(searchLower)) {
        suggestions.add(`"${doctor.specialization}"`);
      }
      
      // Suggest locations
      if (doctor.location.toLowerCase().includes(searchLower)) {
        suggestions.add(`"${doctor.location}"`);
      }
    });
    
    return Array.from(suggestions).slice(0, 3); // Limit to 3 suggestions
  };

  const searchSuggestions = getSearchSuggestions();

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      {searchTerm && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results for "{searchTerm}"
          </h2>
          <span className="text-sm text-gray-500">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* No Results Message with Smart Suggestions */}
      {searchTerm && filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500 mb-4">
            No doctors match "{searchTerm}". Try a different search term.
          </p>
          
          {/* Dynamic suggestions based on available data */}
          {searchSuggestions.length > 0 ? (
            <div className="text-sm text-gray-600 mb-4">
              <p className="font-medium mb-2">Did you mean:</p>
              <div className="space-y-1">
                {searchSuggestions.map((suggestion, index) => (
                  <div key={index} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          <div className="text-sm text-gray-400">
            <p>Search tips:</p>
            <ul className="mt-2 space-y-1">
              <li>• Try searching by doctor name (e.g., "Dr. Smith" or just "Smith")</li>
              <li>• Try searching by specialization (e.g., "Cardiology" or "Heart")</li>
              <li>• Try searching by location (e.g., "New York" or "NY")</li>
              <li>• Use partial words (e.g., "card" for Cardiology)</li>
              <li>• Check your spelling</li>
            </ul>
          </div>
        </div>
      )}

      {/* Doctor Cards Grid */}
      {filteredDoctors.length > 0 && (
        <>
          {!searchTerm && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Doctors</h2>
              <span className="text-sm text-gray-500">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </>
      )}

      {/* Loading State */}
      {doctors.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-gray-400 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading doctors...</h3>
          <p className="text-gray-500">Please wait while we fetch available doctors.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorList;