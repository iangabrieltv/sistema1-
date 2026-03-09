import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Coffee, Pizza, ArrowRight, ArrowLeft, Flower2, Stethoscope, GraduationCap } from 'lucide-react';

type Phase = 'WELCOME' | 'NAME' | 'FOOD' | 'FUTURE' | 'LOADING' | 'SUSPENSE' | 'CONFIRMATION' | 'FINAL';

const Petal = ({ delay, left, duration }: { delay: number; left: string; duration: number; key?: React.Key }) => (
  <motion.div
    className="petal text-lavender-accent opacity-0"
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{ 
      y: '110vh', 
      opacity: [0, 0.4, 0.4, 0],
      rotate: 360 
    }}
    transition={{ 
      duration, 
      delay, 
      ease: "linear",
      repeat: Infinity
    }}
    style={{ left, fontSize: Math.random() * 12 + 8 }}
  >
    🪻
  </motion.div>
);

export default function App() {
  const [phase, setPhase] = useState<Phase>('WELCOME');
  const [input, setInput] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [showLocation, setShowLocation] = useState(false);

  const errorMessages = [
    "Acho que você não é a pessoa certa",
    "Sera mesmo que é você?",
    "Isso é exclusivo para uma pessoa só.",
    "Cuidadoo!! Não é para você.",
    "ERRO: Tentativa de invasão em um sistema único. Isso não é para você.",
    "Acho que você não é a pessoa certa... Onde está a verdadeira dona disso?",
    "Sera mesmo que é você? O sistema não reconheceu esse nome na lista de 'Pessoas Inesquecíveis'",
    "Ei! Por que está tentando ser outra pessoa? Só uma pessoa tem a chave daqui... e o nome dela começa com R",
    "Não adianta fingir. O sistema conhece cada detalhe dela, e você ainda não chegou lá"
  ];

  const foodOptions = [
    { label: '🍕 Pizza', value: 'pizza' },
    { label: '🍛 Almoço', value: 'almoco' },
    { label: '🥭 Manga', value: 'manga' },
    { label: '🍫 Chocolate Branco', value: 'chocolate' }
  ];

  const futureOptions = [
    { label: '🩺 Dra. Rebeca', value: 'dra_rebeca' },
    { label: '✨ Rebeca', value: 'rebeca' },
    { label: '🏥 Dra. Rebeca Herculano', value: 'dra_herculano' },
    { label: '🤷‍♂️ Nada', value: 'nada' }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (phase === 'LOADING') {
      const duration = 3000; // 3 seconds
      const intervalTime = 30;
      const step = 100 / (duration / intervalTime);
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase('SUSPENSE'), 500);
            return 100;
          }
          return Math.min(prev + step, 100);
        });
      }, intervalTime);
      return () => clearInterval(interval);
    }

    if (phase === 'SUSPENSE') {
      const timer = setTimeout(() => {
        setPhase('CONFIRMATION');
      }, 4000); // 4 seconds delay
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    setError('');

    if (phase === 'NAME') {
      if (val === 'rebeca' || val === 'rebeca herculano') {
        setPhase('FOOD');
        setInput('');
      } else {
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        setError(randomError);
      }
    } else if (phase === 'FOOD') {
      if (val.includes('pizza')) {
        setPhase('FUTURE');
        setInput('');
      } else {
        setError('Resposta incorreta. Dica: Redonda e italiana...');
      }
    } else if (phase === 'FUTURE') {
      if (val.includes('dra') || val.includes('doutora')) {
        setPhase('LOADING');
        setInput('');
      } else {
        setError('Você sonha mais alto que isso. Como o mundo vai te chamar?');
      }
    }
  };

  const handleFoodChoice = (choice: string) => {
    setError('');
    if (choice === 'pizza') {
      setPhase('FUTURE');
    } else {
      setError('Tem certeza? O sistema lembra de um gosto diferente...');
    }
  };

  const handleFutureChoice = (choice: string) => {
    setError('');
    if (choice === 'dra_rebeca' || choice === 'dra_herculano') {
      setPhase('LOADING');
    } else if (choice === 'nada') {
      setError('Impossível. Você nasceu para brilhar. Tente de novo! 🩺');
    } else {
      setError('Você sonha mais alto que isso. Como o mundo vai te chamar?');
    }
  };

  const handleBack = () => {
    setError('');
    if (phase === 'NAME') setPhase('WELCOME');
    if (phase === 'FOOD') setPhase('NAME');
    if (phase === 'FUTURE') setPhase('FOOD');
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Oi Ian, pare de me perturbar por favor. mas aceito! mas você precisa me conquistar primeiro");
    window.open(`https://wa.me/5582982312031?text=${message}`, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center ${phase === 'FINAL' ? 'justify-start py-12' : 'justify-center'} px-6 relative bg-white overflow-y-auto`}>
      
      {/* Subtle petals in the background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Petal 
          key={i} 
          delay={Math.random() * 10} 
          left={`${Math.random() * 100}%`} 
          duration={Math.random() * 5 + 8} 
        />
      ))}

      <AnimatePresence mode="wait">
        {phase === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-lg text-center space-y-10 relative z-10"
          >
            <div className="space-y-6">
              <Flower2 className="mx-auto text-purple-deep opacity-20" size={32} />
              <h1 className="text-4xl md:text-5xl font-serif text-purple-deep tracking-tight">
                Sobre incertezas e 1% de chance
              </h1>
              <p className="text-base text-gray-400 font-sans font-light tracking-wide max-w-xs mx-auto">
                Olá. Para acessar este conteúdo exclusivo, precisamos confirmar sua identidade.
              </p>
            </div>
            <motion.button
              id="btn-start-validation"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPhase('NAME')}
              className="px-12 py-4 bg-purple-deep text-white font-sans text-sm font-medium rounded-full shadow-sm transition-all hover:bg-purple-800 relative z-20 pointer-events-auto"
            >
              Iniciar Validação
            </motion.button>
          </motion.div>
        )}

        {(phase === 'NAME' || phase === 'FOOD' || phase === 'FUTURE') && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white p-12 rounded-[2rem] card-shadow space-y-12 border border-lavender-accent/30">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-purple-deep/40 hover:text-purple-deep transition-colors font-bold"
                  >
                    <ArrowLeft size={10} /> Voltar
                  </button>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-purple-deep/30 font-bold">
                    Etapa {phase === 'NAME' ? '01' : phase === 'FOOD' ? '02' : '03'} / 03
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-purple-deep leading-tight">
                  {phase === 'NAME' && "Como você se chama?"}
                  {phase === 'FOOD' && "Para confirmar que não é um robô, o que você comeria agora mesmo se pudesse?"}
                  {phase === 'FUTURE' && "Como o mundo vai te chamar daqui a 10 anos, salvando vidas na Itália?"}
                </h2>
              </div>

              {phase === 'FOOD' || phase === 'FUTURE' ? (
                <div className="grid grid-cols-1 gap-4">
                  {(phase === 'FOOD' ? foodOptions : futureOptions).map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(107, 70, 193, 0.05)' }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => phase === 'FOOD' ? handleFoodChoice(option.value) : handleFutureChoice(option.value)}
                      className="w-full py-4 px-6 text-left border border-purple-deep/10 rounded-2xl text-lg font-sans font-light text-purple-deep transition-colors hover:border-purple-deep/30"
                    >
                      {option.label}
                    </motion.button>
                  ))}
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-red-400 text-[11px] font-sans text-center mt-4 px-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full bg-transparent border-b border-purple-deep/10 py-4 px-1 outline-none focus:border-purple-deep transition-colors text-xl font-sans font-light"
                      placeholder="Sua resposta..."
                    />
                    <button 
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-deep opacity-40 hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-red-400 text-[11px] font-sans text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'LOADING' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center space-y-10 relative z-10"
          >
            <div className="space-y-3">
              <p className="font-sans text-[10px] tracking-[0.3em] text-purple-deep/40 uppercase">
                Carregando dados para identificar se você é a Rebeca...
              </p>
            </div>
            <div className="w-full h-[2px] bg-purple-deep/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-deep"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <p className="font-sans text-[9px] text-purple-deep/30">{Math.round(loadingProgress)}%</p>
          </motion.div>
        )}

        {phase === 'SUSPENSE' && (
          <motion.div
            key="suspense"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center space-y-8 relative z-10"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-6 h-6 border-2 border-purple-deep/20 border-t-purple-deep rounded-full animate-spin" />
              <p className="font-sans text-[10px] tracking-[0.3em] text-purple-deep/60 uppercase animate-pulse">
                Finalizando verificação biométrica...
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'CONFIRMATION' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white p-12 rounded-[2.5rem] card-shadow space-y-10 border border-lavender-accent/30 text-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-purple-deep leading-tight">
                  Agora sim, tenho certeza que você é a Rebeca.
                </h2>
                <p className="text-sm text-gray-400 font-sans font-light">
                  Confirme se deseja continuar para o destino final:
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase('FINAL')}
                    className="flex-1 py-4 bg-purple-deep text-white rounded-2xl font-sans font-medium text-sm shadow-sm"
                  >
                    SIM
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmationError("Ops! Parece que estamos com um problema técnico no botão 'Não'. Por favor, tente a outra opção disponível.")}
                    className="flex-1 py-4 border border-purple-deep/10 text-purple-deep/40 rounded-2xl font-sans font-medium text-sm"
                  >
                    NÃO
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {confirmationError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-red-400 font-sans leading-relaxed"
                    >
                      {confirmationError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'FINAL' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl text-center space-y-12 pb-20 relative z-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex justify-center"
              >
                <Heart className="text-purple-deep opacity-10" size={48} />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-serif text-purple-deep tracking-tight">
                Oi, Rebeca.
              </h1>
            </div>

            <div className="bg-white p-8 md:p-16 pb-[50px] rounded-[2.5rem] card-shadow space-y-8 text-left leading-relaxed text-gray-600 border border-lavender-accent/20 min-h-[400px] h-auto max-h-[70vh] overflow-y-auto custom-scrollbar relative z-20 pointer-events-auto">
              <div className="space-y-6 text-lg md:text-xl font-light font-sans">
                <p>
                  Eu sei que o clima entre a gente está estranho, e tudo bem. Não quero fingir que nada aconteceu, mas também não quero que o silêncio seja a única coisa que reste entre nós dois.
                </p>
                <p>
                  Parei para pensar no quanto a gente se perdeu em discussões e estresse ultimamente, e percebi que isso acabou escondendo a leveza que a gente já teve um dia. Por isso, queria te propor algo diferente: uma chance da gente se ver sem o peso dessas brigas, sem expectativas e sem cobranças. Apenas um momento para a gente ser a gente, em paz, como há muito tempo não somos.
                </p>
                <p>
                  O que você acha de sairmos no dia <span className="text-purple-deep font-medium italic">16/03 às 19:00</span>? Seria apenas para mudar o roteiro e respirar um ar mais leve. Queria muito saber se você estaria disponível e com vontade de ir.
                </p>
                <p className="pt-4">
                  O que você me diz?
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!showLocation ? (
                <motion.button
                  key="reveal-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLocation(true)}
                  className="px-12 py-5 border border-purple-deep/20 text-purple-deep/60 rounded-full font-sans font-medium hover:border-purple-deep/40 hover:text-purple-deep transition-all"
                >
                  Ver o que você pensou... ✨
                </motion.button>
              ) : (
                <motion.div
                  key="location-revealed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  <div className="bg-lavender-accent/10 p-12 md:p-16 rounded-[2.5rem] space-y-8 text-left leading-relaxed text-gray-600 border border-purple-deep/5">
                    <div className="space-y-6 text-lg md:text-xl font-light font-sans">
                      <p>
                        Pensei em irmos ao <span className="text-purple-deep font-semibold italic">Martinez (Bella Cucina)</span>.
                      </p>
                      <p>
                        É um lugar com um ambiente tranquilo e eu queria que a gente tivesse esse momento. Não precisa se preocupar com nada, a ideia é só você chegar, a gente sentar e aproveitar a noite. Eu valorizo muito a sua companhia e adoraria ver você lá.
                      </p>
                      <p className="pt-4 font-medium text-purple-deep">
                        Topa esse momento comigo?
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openWhatsApp}
                      className="px-14 py-5 bg-purple-deep text-white font-sans font-semibold rounded-full shadow-md hover:bg-purple-800 transition-all flex items-center gap-3 text-lg"
                    >
                      Confirmar no WhatsApp <ArrowRight size={22} />
                    </motion.button>

                    <button 
                      onClick={() => {
                        setPhase('WELCOME');
                        setShowLocation(false);
                      }}
                      className="text-purple-deep/30 hover:text-purple-deep text-xs underline underline-offset-4 transition-colors font-sans"
                    >
                      Reiniciar Validação
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-16 opacity-5 text-purple-deep pt-10">
              <Coffee size={24} />
              <Heart size={24} />
              <Pizza size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
