import { useEffect, useState } from 'react';
import Spinner from './Spinner';

interface ProgressStep {
  message: string;
  delayMs: number;
}

const SCAN_PROGRESS_STEPS: ProgressStep[] = [
  { message: 'Connecting to website...', delayMs: 0 },
  { message: 'Extracting brand identity...', delayMs: 1000 },
  { message: 'Analyzing colors and typography...', delayMs: 3000 },
  { message: 'Looking for logo and imagery...', delayMs: 6000 },
  { message: 'Identifying industry and capabilities...', delayMs: 8000 },
];

interface Props {
  isScanning: boolean;
}

export default function ScanProgress({ isScanning }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      return;
    }

    const timers = SCAN_PROGRESS_STEPS.map((step, index) =>
      setTimeout(() => {
        setCurrentStep(index);
      }, step.delayMs),
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isScanning]);

  if (!isScanning) return null;

  const currentMessage = SCAN_PROGRESS_STEPS[currentStep]?.message || 'Scanning...';

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-3">
        <Spinner className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">{currentMessage}</p>
          <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / SCAN_PROGRESS_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
