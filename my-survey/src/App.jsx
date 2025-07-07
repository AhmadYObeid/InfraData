import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import SurveyForm from './components/SurveyForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <SurveyForm />
    </div>
  );
}