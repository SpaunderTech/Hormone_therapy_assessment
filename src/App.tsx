import React, { useState } from 'react';
import { 
  Clock, 
  Shield, 
  CalendarClock, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Sun,
  Moon,
  Heart,
  Smile,
  Frown,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  ThermometerSun,
  Brain,
  Sparkles
} from 'lucide-react';

type Question = {
  prompt: string;
  options: string[];
  icon: React.ReactNode;
};

const iconBaseClass = "drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-transform hover:scale-105";

const questions: Question[] = [
  {
    prompt: "On a scale of 1 to 5, how would you rate your daily energy levels?",
    options: ["1 - Always tired", "2", "3", "4", "5 - Very energetic"],
    icon: <div className="flex gap-2 mb-2 justify-center">
      <BatteryLow className={`w-6 h-6 ${iconBaseClass} text-red-500`} />
      <BatteryMedium className={`w-6 h-6 ${iconBaseClass} text-yellow-500`} />
      <BatteryFull className={`w-6 h-6 ${iconBaseClass} text-green-500`} />
    </div>
  },
  {
    prompt: "Do you experience frequent mood swings or irritability?",
    options: ["Rarely", "Occasionally", "Frequently", "Almost Always"],
    icon: <div className="flex gap-4 mb-2 justify-center">
      <Smile className={`w-6 h-6 ${iconBaseClass} text-emerald-500`} />
      <Frown className={`w-6 h-6 ${iconBaseClass} text-orange-500`} />
    </div>
  },
  {
    prompt: "Have you noticed changes in your libido or sexual performance?",
    options: ["Rarely", "Occasionally", "Frequently", "Almost Always"],
    icon: <Heart className={`w-6 h-6 mb-2 mx-auto ${iconBaseClass} text-rose-500`} />
  },
  {
    prompt: "How would you describe your sleep quality?",
    options: ["Very Poor", "Poor", "Fair", "Good", "Excellent"],
    icon: <div className="flex gap-4 mb-2 justify-center">
      <Sun className={`w-6 h-6 ${iconBaseClass} text-amber-500`} />
      <Moon className={`w-6 h-6 ${iconBaseClass} text-indigo-500`} />
    </div>
  },
  {
    prompt: "Do you experience symptoms like hot flashes, night sweats, or unexplained weight gain?",
    options: ["Rarely", "Occasionally", "Frequently", "Almost Always"],
    icon: <ThermometerSun className={`w-6 h-6 mb-2 mx-auto ${iconBaseClass} text-orange-500`} />
  }
];

const getOptionScore = (questionIndex: number, optionIndex: number): number => {
  if (questionIndex === 0) {
    return optionIndex + 1;
  }
  if (questionIndex === 3) {
    switch (optionIndex) {
      case 0: return 5;
      case 1: return 4;
      case 2: return 2;
      case 3: return 1;
      case 4: return 0;
      default: return 0;
    }
  }
  switch (optionIndex) {
    case 0: return 1;
    case 1: return 2;
    case 2: return 4;
    case 3: return 5;
    default: return 0;
  }
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completionTime, setCompletionTime] = useState<Date | null>(null);

  const isLastStep = currentStep === questions.length - 1;
  const isComplete = currentStep === questions.length;

  const handleRedirect = () => {
    const message = {
      type: "REDIRECT",
      buttonId: "auto-click-target"
    };
  
    window.parent.postMessage(message, "*");
    console.log("Sent postMessage to parent window:", message);
  };
  

  const handleNext = () => {
    if (selectedOption !== null) {
      const score = getOptionScore(currentStep, selectedOption);
      setAnswers([...answers, score]);
      if (isLastStep) {
        setCompletionTime(new Date());
      }
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(null);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedOption(null);
    setCompletionTime(null);
  };

  const calculateScore = () => {
    return answers.reduce((sum, score) => sum + score, 0);
  };

  const getAssessmentLevel = (score: number) => {
    if (score <= 5) return "Excellent";
    if (score <= 10) return "Very Good";
    if (score <= 15) return "Moderate";
    if (score <= 20) return "Concerning";
    return "Severe";
  };

  const getAssessmentDescription = (level: string) => {
    switch (level) {
      case "Excellent": return "Minimal to no symptoms of hormonal imbalance.";
      case "Very Good": return "Slight symptoms, not likely requiring treatment.";
      case "Moderate": return "Some symptoms present — a consultation is advised.";
      case "Concerning": return "Strong signs of hormonal imbalance.";
      case "Severe": return "Significant symptoms, urgent consultation recommended.";
      default: return "";
    }
  };

  const getLevelIcon = (level: string) => {
    const iconClass = `w-6 h-6 ${iconBaseClass}`;
    switch (level) {
      case "Excellent": return <Sparkles className={`${iconClass} text-amber-400`} />;
      case "Very Good": return <Sun className={`${iconClass} text-yellow-500`} />;
      case "Moderate": return <Brain className={`${iconClass} text-purple-500`} />;
      case "Concerning": return <ThermometerSun className={`${iconClass} text-orange-500`} />;
      case "Severe": return <Heart className={`${iconClass} text-red-500`} />;
      default: return null;
    }
  };

  const renderHeader = () => (
    <div className="p-4 shrink-0">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold text-[#337D80]">
          {isComplete ? "Assessment Complete" : "Progress"}
        </h1>
        <span className="text-lg font-semibold text-[#337D80]">
          {isComplete ? "5/5" : `${currentStep + 1}/5`}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#337D80] transition-all duration-300 ease-out"
          style={{ width: isComplete ? '100%' : `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              isComplete ? 'bg-[#337D80]' : 
              index === currentStep ? 'bg-[#337D80]' :
              index < currentStep ? 'bg-[#337D80]/40' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (isComplete && completionTime) {
    const score = calculateScore();
    const level = getAssessmentLevel(score);
    const description = getAssessmentDescription(level);
    const levelIcon = getLevelIcon(level);

    
    
    return (
      <div className="h-[780px] flex items-center justify-center bg-gray-50">
        <div className="w-[600px] h-[700px] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
          {renderHeader()}

          <div className="px-6 py-3 flex-1 flex flex-col">
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm">
                Completed on {completionTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric'
                })}
              </p>
              <p className="text-gray-500 text-xs">
                at {completionTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>

            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-[#FBD44B] shadow-lg">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-6 mb-1">
                    {levelIcon}
                  </div>
                  <div className="text-2xl font-bold text-[#337D80]">{score}/25</div>
                  <div className="text-[#FBD44B] font-medium text-sm">{level}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#337D80]/5 rounded-xl p-4 mb-4">
              <p className="text-center text-gray-700 text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <button 
              onClick={handleRedirect}
              className="flex items-center gap-2 bg-[#337D80] hover:bg-[#286264] text-white px-4 py-2.5 rounded-xl text-base font-medium transition-colors w-full justify-center shadow-md hover:shadow-lg">
                <CalendarClock className={`w-4 h-4 ${iconBaseClass}`} />
                Schedule Your Consultation Today
              </button>
              <button 
                onClick={handleRestart}
                className="flex items-center gap-2 bg-[#FBD44B] hover:bg-[#f5c423] text-[#337D80] px-4 py-2.5 rounded-xl text-base font-medium transition-colors w-full justify-center shadow-md hover:shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${iconBaseClass}`} />
                Retake Assessment
              </button>
            </div>

            <div className="flex justify-center items-center gap-2 text-gray-500 mb-3">
              <Clock className={`w-4 h-4 ${iconBaseClass}`} />
              <span className="text-xs">Consultations typically available within 48 hours</span>
            </div>

            <div className="mt-auto flex flex-col items-center text-center border-t border-gray-100 pt-3">
              <Shield className={`w-4 h-4 text-gray-400 mb-1 ${iconBaseClass}`} />
              <p className="text-gray-500 text-xs px-4">
                This assessment is for informational purposes only and does not constitute
                medical advice. Please consult with a healthcare professional for diagnosis
                and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[780px] flex items-center justify-center bg-gray-50">
      <div className="w-[600px] h-[700px] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
        {renderHeader()}

        <div className="px-6 py-4 flex-1 flex flex-col">
          <div className="h-[160px] flex flex-col items-center justify-center">
            {questions[currentStep].icon}
            <h2 className="text-xl font-semibold text-[#337D80] text-center px-4 leading-relaxed min-h-[3.5rem] flex items-center">
              {questions[currentStep].prompt}
            </h2>
          </div>

          <div className="flex-1 grid grid-rows-[repeat(5,60px)] gap-3">
            {[...Array(5)].map((_, index) => {
              const option = questions[currentStep].options[index];
              return option ? (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full h-[60px] p-3 text-left rounded-xl border-2 transition-all ${
                    selectedOption === index
                      ? 'border-[#337D80] bg-[#337D80]/5'
                      : 'border-gray-200 hover:border-[#337D80]/30'
                  }`}
                >
                  {option}
                </button>
              ) : (
                <div key={index} className="h-[60px]" />
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#337D80] hover:text-[#286264]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedOption === null
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#337D80] text-white hover:bg-[#286264]'
              }`}
            >
              {isLastStep ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;