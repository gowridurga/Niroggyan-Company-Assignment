# Healthcare Appointment Booking

A modern web application for booking doctor appointments built with React and TypeScript.

## 🚀 Features

- Browse and search doctors by name or specialization
- View doctor profiles with ratings and availability
- Book appointments with date/time selection
- Real-time slot availability updates
- Responsive design for all devices

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management
- **Local Storage** - Data persistence

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-appointment-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   ```
  http://localhost:3005
   ```

## 🏗️ Project Structure

src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, SearchBar, Loading)
│   ├── doctors/         # Doctor-related components
│   └── appointments/    # Booking-related components
├── context/             # React Context for state management
├── data/               # Mock data and utilities
├── types/              # TypeScript type definitions
├── pages/              # Main page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.tsx             # Main application component

## 📱 Usage

1. **Search Doctors** - Use search bar to find doctors by name or specialty
2. **View Profiles** - Click doctor cards to see detailed information
3. **Book Appointment** - Select date/time and fill booking form
4. **Get Confirmation** - Receive instant booking confirmation

## 🚀 Build for Production

```bash
npm run build
```


