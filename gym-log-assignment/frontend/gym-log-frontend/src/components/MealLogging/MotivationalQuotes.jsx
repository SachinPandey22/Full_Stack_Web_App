import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const MotivationalQuotes = () => {
  const quotes = [
    "If you keep on eating unhealthy food, then no matter how many weight loss tips you follow, you are likely to retain weight and become obese. If only you start eating healthy food, you will be pleasantly surprised how easy it is to lose weight. – Subodh Gupta",
    "One cannot think well, love well, or sleep well, if one has not dined well. – Virginia Woolf",
    "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison. – Ann Wigmore",
    "I don't think I'll ever grow old and say, 'What was I thinking eating all those fruits and vegetables?' – Nancy S. Mure",
    "Tell me what you eat, and I will tell you what you are. – G. K. Chesterton",
    "When you start eating foods without labels, you no longer need to count calories. – Amanda Kraft",
    "Your body is the direct result of what you eat as well as what you don't eat. – Gloria Swanson",
    "People who love to eat are always the best people. – Julia Child",
    "Food is medicine, and the right kind of a relationship with food can make a positive impact on your health. – Hayley Hobson",
    "Exercise is king; nutrition is queen. Put them together, and you've got a kingdom. – Jack LaLanne",
    "All children should have the basic nutrition they need to learn and grow and to pursue their dreams, because, in the end, nothing is more important than the health and well-being of our children. – Michelle Obama",
    "If you keep good food in your fridge, you will eat good food. – Errick McAdams",
    "By eating many fruits and vegetables in place of fast food and junk food, people could avoid obesity. – David H. Murdock",
    "The best and most efficient pharmacy is within your own system. – Robert C. Peale",
    "I always take the time to eat well and eat locally because it's common sense. – Ellen Page",
    "One should eat to live, not live to eat. – Benjamin Franklin",
    "My favorite thing to do is eat, and eat well. – Lena Olin",
    "We struggle with eating healthily, obesity, and access to good nutrition for everyone. But we have a great opportunity to get on the right side of this battle by beginning to think differently about the way that we eat and the way that we approach food. – Marcus Samuelsson",
    "Your diet is a bank account. Good food choices are good investments. – Bethenny Frankel",
    "Every time you eat or drink, you are either feeding disease or fighting it. – Heather Morgan"
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentQuoteIndex]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
      setFade(true);
    }, 300);
  };

  const handleDotClick = (index) => {
    if (index !== currentQuoteIndex) {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex(index);
        setFade(true);
      }, 300);
    }
  };

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border border-purple-200 shadow-lg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Sparkle decorations */}
        <div className="absolute top-4 right-8 opacity-20 animate-pulse-slow">
          <Sparkles size={24} className="text-purple-400" />
        </div>
        <div className="absolute bottom-6 left-10 opacity-20 animate-pulse-slow animation-delay-1000">
          <Sparkles size={20} className="text-blue-400" />
        </div>
        <div className="absolute top-1/2 right-12 opacity-15 animate-pulse-slow animation-delay-2000">
          <Sparkles size={18} className="text-indigo-400" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex items-center gap-4">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          className="flex-shrink-0 p-2.5 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:scale-110 transition-all duration-200 shadow-md group"
          aria-label="Previous quote"
        >
          <ChevronLeft size={20} className="text-purple-600 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Quote content */}
        <div className="flex-1 min-h-[70px] flex items-center justify-center px-4">
          <div
            className={`transition-all duration-500 ${
              fade 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="relative">
                  <Sparkles size={22} className="text-purple-600 animate-spin-slow" />
                  <div className="absolute inset-0 bg-purple-400 blur-md opacity-40 animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-800 italic font-medium text-lg leading-relaxed">
                "{quotes[currentQuoteIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="flex-shrink-0 p-2.5 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:scale-110 transition-all duration-200 shadow-md group"
          aria-label="Next quote"
        >
          <ChevronRight size={20} className="text-purple-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="relative flex justify-center gap-2 mt-5 flex-wrap">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentQuoteIndex
                ? 'w-8 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg'
                : 'w-2 bg-purple-300 hover:bg-purple-400 hover:scale-125'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default MotivationalQuotes;