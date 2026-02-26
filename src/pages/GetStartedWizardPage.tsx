import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  'Company Info',
  'Website & Brand',
  'Equipment',
  'Capabilities',
  'Location',
  'Review',
];

export default function GetStartedWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Get Started</h1>

        {/* Step indicator */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
                  {step}
                </span>
                {index < STEPS.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-2" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Step content placeholder */}
        <div className="bg-white rounded-lg shadow p-8 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            Step {currentStep + 1}: {STEPS[currentStep]} - Coming soon
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
