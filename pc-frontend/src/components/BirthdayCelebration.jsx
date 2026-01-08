import React, { useState, useEffect } from 'react';
import { Heart, Gift, Music, Cake, Sparkles, Star } from 'lucide-react';

const BirthdayCelebration = () => {
  const [step, setStep] = useState(1);
  const [showSad, setShowSad] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [effects, setEffects] = useState([]);

  // Create floating hearts continuously
  useEffect(() => {
    const interval = setInterval(() => {
      const heartTypes = ['💖', '💕', '💗', '💝', '💘', '❤️'];
      const newHeart = {
        id: Date.now() + Math.random(),
        emoji: heartTypes[Math.floor(Math.random() * heartTypes.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        size: 15 + Math.random() * 15
      };
      setHearts(prev => [...prev.slice(-20), newHeart]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const createEffects = (type, count = 30) => {
    const emojis = {
      confetti: ['🎊', '🎉', '✨', '💫', '⭐'],
      balloons: ['🎈', '🎈', '🎈', '🎈'],
      music: ['🎵', '🎶', '🎼', '🎤'],
      celebration: ['🎉', '🌟', '💖', '🦋', '🌸', '✨']
    };

    const newEffects = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[type][Math.floor(Math.random() * emojis[type].length)],
      left: Math.random() * 100,
      delay: i * 50
    }));

    setEffects(prev => [...prev, ...newEffects]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => !newEffects.find(ne => ne.id === e.id)));
    }, 4000);
  };

  const handleYes = () => {
    createEffects('celebration', 20);
    setTimeout(() => setStep(3), 500);
  };

  const handleNo = () => {
    setShowSad(true);
    setTimeout(() => setShowSad(false), 2000);
  };

  const handleLights = () => {
    createEffects('celebration', 40);
    setTimeout(() => setStep(4), 2000);
  };

  const handleSurprise = () => {
    createEffects('confetti', 50);
  };

  const handleMusic = () => {
    createEffects('music', 15);
    setTimeout(() => setStep(5), 2000);
  };

  const handleBalloons = () => {
    createEffects('balloons', 20);
    setTimeout(() => setStep(6), 3000);
  };

  const handleCake = () => {
    createEffects('celebration', 25);
    setTimeout(() => setStep(7), 2000);
  };

  const handleMessage = () => {
    createEffects('celebration', 40);
    setTimeout(() => setStep(8), 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-500">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-emerald-500/20 animate-pulse" />
      
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="absolute animate-float-up"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
              bottom: '-50px'
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Effects layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {effects.map(effect => (
          <div
            key={effect.id}
            className="absolute animate-effect-float text-3xl"
            style={{
              left: `${effect.left}%`,
              animationDelay: `${effect.delay}ms`,
              top: '100%'
            }}
          >
            {effect.emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full">
          {/* Step 1: Initial Greeting */}
          {step === 1 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full animate-bounce-slow">
                <Sparkles className="w-16 h-16 text-cyan-300" />
              </div>
              <h1 className="text-6xl font-bold text-white drop-shadow-2xl animate-slide-up">
                "It's Your Special Day Yeyey!"
              </h1>
              <div className="inline-block">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 hover:from-cyan-600 hover:to-teal-700"
                >
                  Continue ✨
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Question */}
          {step === 2 && (
            <div className="text-center space-y-8 animate-fade-in bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
              <Star className="w-12 h-12 text-cyan-300 mx-auto animate-spin-slow" />
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                Do you wanna see what I made?
              </h2>
              <div className="flex gap-6 justify-center">
                <button
                  onClick={handleYes}
                  className="px-10 py-4 bg-gradient-to-r from-emerald-400 to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  Yes! 👆
                </button>
                <button
                  onClick={handleNo}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  No
                </button>
              </div>
              {showSad && (
                <p className="text-2xl text-white animate-bounce">😢 Aww, okay...</p>
              )}
            </div>
          )}

          {/* Step 3: Look at it */}
          {step === 3 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
                <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
                  Have a look at it!
                </h2>
                <button
                  onClick={handleLights}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-teal-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 mb-8"
                >
                  Lights On ✨
                </button>
                <div
                  onClick={handleSurprise}
                  className="inline-block p-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl cursor-pointer transform hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50"
                >
                  <Gift className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Music */}
          {step === 4 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-gradient-to-br from-teal-500/30 to-cyan-500/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
                <Music className="w-20 h-20 text-white mx-auto mb-8 animate-pulse" />
                <button
                  onClick={handleMusic}
                  className="px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-teal-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  Play Music 🎵
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Happy Birthday Banner */}
          {step === 5 && (
            <div className="text-center space-y-8 animate-fade-in">
              <button
                onClick={handleBalloons}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 mb-8"
              >
                Fly the Balloons 🎈
              </button>
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
                <div className="flex flex-wrap justify-center gap-3">
                  {['H', 'A', 'P', 'P', 'Y'].map((letter, i) => (
                    <span
                      key={i}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-600 text-white text-2xl font-bold rounded-2xl shadow-lg animate-bounce-delay"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {['B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y'].map((letter, i) => (
                    <span
                      key={i}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-600 text-white text-2xl font-bold rounded-2xl shadow-lg animate-bounce-delay"
                      style={{ animationDelay: `${(i + 5) * 100}ms` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Cake */}
          {step === 6 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-gradient-to-br from-teal-400/30 to-cyan-500/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
                <button
                  onClick={handleCake}
                  className="px-10 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-teal-500/50 transform hover:scale-110 transition-all duration-300 mb-8"
                >
                  Let's Cut the Cake 🎂
                </button>
                {step >= 7 && (
                  <div className="inline-block p-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl shadow-2xl animate-bounce-slow">
                    <Cake className="w-24 h-24 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 7: Message Button */}
          {step === 7 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-gradient-to-br from-cyan-500/30 to-teal-500/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
                <button
                  onClick={handleMessage}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  Well, I Have a Message for You 💌
                </button>
              </div>
            </div>
          )}

          {/* Step 8: Final Message */}
          {step === 8 && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-gray-800">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Dear SweetHeart 💖
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  Stay Blessed. Have many many more years of success, joy, love, laughter and smiles.
                </p>
                <p className="text-lg leading-relaxed font-semibold">
                  And on your special day, I wish you the happiest birthday! 🎉🎂🎈
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Heart className="w-8 h-8 text-cyan-500 animate-pulse" />
                  <Sparkles className="w-8 h-8 text-teal-500 animate-spin-slow" />
                  <Heart className="w-8 h-8 text-cyan-500 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes effect-float {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(-20vh) scale(1);
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
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

        @keyframes bounce-delay {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float-up {
          animation: float-up 6s ease-in-out infinite;
        }

        .animate-effect-float {
          animation: effect-float 4s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-bounce-delay {
          animation: bounce-delay 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BirthdayCelebration;