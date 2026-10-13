import React, { useState } from 'react';
import { sounds } from '../services/audio';
import { Sun, Droplets, Wind, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface InteractiveSimulatorProps {
  type: 'fractions' | 'photosynthesis' | 'pulley' | 'verbs';
  language: Language;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({ type, language }) => {
  if (type === 'fractions') {
    return <FractionsSimulator language={language} />;
  }
  if (type === 'photosynthesis') {
    return <PhotosynthesisSimulator language={language} />;
  }
  if (type === 'pulley') {
    return <PulleySimulator language={language} />;
  }
  return <VerbsSimulator language={language} />;
};

// 1. Fractions Chapati / Watermelon Slicer
const FractionsSimulator: React.FC<{ language: Language }> = ({ language }) => {
  const [totalSlices, setTotalSlices] = useState<number>(4);
  const [selectedSlices, setSelectedSlices] = useState<number>(1);

  const handleTotalChange = (val: number) => {
    sounds.playClick();
    setTotalSlices(val);
    if (selectedSlices > val) setSelectedSlices(val);
  };

  const handleSliceClick = (index: number) => {
    sounds.playClick();
    setSelectedSlices(index + 1);
  };

  const tTitles = {
    en: {
      title: 'Interactive Chapati & Watermelon Slicer',
      totalLabel: 'Cut Chapati into Equal Pieces (Denominator):',
      takeLabel: 'Pieces Eaten / Selected (Numerator):',
      fractionResult: 'Current Fraction:',
      decimalEquiv: 'Decimal Value:',
      percentage: 'Portion of Chapati:',
    },
    te: {
      title: 'రొట్టె & పుచ్చకాయ సమ విభజన ప్రయోగం',
      totalLabel: 'మొత్తం సమాన ముక్కలు (హారము - Denominator):',
      takeLabel: 'తీసుకున్న ముక్కలు (లవము - Numerator):',
      fractionResult: 'ప్రస్తుత భిన్నం:',
      decimalEquiv: 'దశాంశ విలువ:',
      percentage: 'మొత్తంలో శాతం:',
    },
    hi: {
      title: 'रोटी और तरबूज का बराबर हिस्सा प्रयोगशाला',
      totalLabel: 'कुल बराबर टुकड़े (हर - Denominator):',
      takeLabel: 'खाए/चुने गए टुकड़े (अंश - Numerator):',
      fractionResult: 'वर्तमान भिन्न:',
      decimalEquiv: 'दशमलव मान:',
      percentage: 'कुल का प्रतिशत:',
    },
  }[language];

  const anglePerSlice = 360 / totalSlices;

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
            <span className="text-xl">🫓</span> {tTitles.title}
          </h4>
          <p className="text-xs text-amber-800/80">Click the slices below to eat or share pieces!</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">{tTitles.fractionResult}</span>
          <div className="text-2xl font-black text-amber-700 font-mono tracking-tight">
            {selectedSlices}/{totalSlices}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Chapati Circle */}
        <div className="flex flex-col items-center justify-center p-3 bg-white/80 rounded-xl border border-amber-100">
          <div className="relative w-48 h-48 rounded-full border-4 border-amber-400 bg-amber-100 shadow-inner overflow-hidden flex items-center justify-center">
            {/* SVG circle slices */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {Array.from({ length: totalSlices }).map((_, i) => {
                const startAngle = (i * anglePerSlice * Math.PI) / 180;
                const endAngle = (((i + 1) * anglePerSlice) * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);
                const largeArc = anglePerSlice > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const isSelected = i < selectedSlices;

                return (
                  <path
                    key={i}
                    d={pathData}
                    onClick={() => handleSliceClick(i)}
                    className={`cursor-pointer transition-colors duration-200 ${
                      isSelected
                        ? 'fill-amber-500 hover:fill-amber-600 stroke-amber-700'
                        : 'fill-amber-200/50 hover:fill-amber-300 stroke-amber-400'
                    } stroke-[0.8]`}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow-xs border border-amber-200">
                {selectedSlices} of {totalSlices} ({Math.round((selectedSlices / totalSlices) * 100)}%)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-amber-800 mt-2 text-center">
            Gold slices = Eaten ({selectedSlices}) · Light slices = Remaining ({totalSlices - selectedSlices})
          </p>
        </div>

        {/* Controls Deck */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              {tTitles.totalLabel}
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 6, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => handleTotalChange(num)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    totalSlices === num
                      ? 'bg-amber-600 text-white shadow-xs scale-105'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              {tTitles.takeLabel}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max={totalSlices}
                value={selectedSlices}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedSlices(Number(e.target.value));
                }}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="font-mono text-sm font-bold text-amber-900 w-8 text-right">
                {selectedSlices}
              </span>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-amber-100 space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>{tTitles.fractionResult}</span>
              <span className="font-bold text-amber-800 font-mono">{selectedSlices} / {totalSlices}</span>
            </div>
            <div className="flex justify-between">
              <span>{tTitles.decimalEquiv}</span>
              <span className="font-bold text-stone-800 font-mono">{(selectedSlices / totalSlices).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{tTitles.percentage}</span>
              <span className="font-bold text-emerald-700 font-mono">{((selectedSlices / totalSlices) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Photosynthesis Leaf Reactor Simulator
const PhotosynthesisSimulator: React.FC<{ language: Language }> = ({ language }) => {
  const [sunlight, setSunlight] = useState<number>(75);
  const [waterActive, setWaterActive] = useState<boolean>(true);
  const [co2Active, setCo2Active] = useState<boolean>(true);

  const foodProductionRate = Math.round(
    ((sunlight / 100) * (waterActive ? 1 : 0.2) * (co2Active ? 1 : 0.2)) * 100
  );

  const tTitles = {
    en: {
      title: 'Leaf Food Reactor Lab',
      sunlightLabel: 'Sunlight Intensity (Chulha Flame):',
      waterLabel: 'Root Well Water Supply:',
      co2Label: 'Carbon Dioxide Air Supply:',
      foodLabel: 'Food (Glucose) Cooking Rate:',
      oxygenLabel: 'Pure Oxygen Bubbles Released:',
      cookingStatus: foodProductionRate > 50 ? 'Leaf is actively cooking food!' : 'Leaf needs more sunlight or water!',
    },
    te: {
      title: 'ఆకు వంటిల్లు - ఆహార తయారీ ప్రయోగశాల',
      sunlightLabel: 'సూర్యరశ్మి తీవ్రత (పొయ్యి మంట):',
      waterLabel: 'వేర్ల బావి నీరు సరఫరా:',
      co2Label: 'గాలిలోని కార్బన్ డయాక్సైడ్:',
      foodLabel: 'ఆహారం (గ్లూకోజ్) తయారీ వేగం:',
      oxygenLabel: 'విడుదలవుతున్న ప్రాణవాయువు (ఆక్సిజన్):',
      cookingStatus: foodProductionRate > 50 ? 'ఆకు వేగంగా ఆహారం వండుతోంది!' : 'ఆకుకు మరింత ఎండ లేదా నీరు కావాలి!',
    },
    hi: {
      title: 'हरी पत्ती की रसोई प्रयोगशाला',
      sunlightLabel: 'धूप की तीव्रता (चूल्हे की आँच):',
      waterLabel: 'जड़ों से पानी की आपूर्ति:',
      co2Label: 'हवा से कार्बन डाइऑक्साइड:',
      foodLabel: 'भोजन (ग्लूकोज) बनने की दर:',
      oxygenLabel: 'उत्पन्न ऑक्सीजन के बुलबुले:',
      cookingStatus: foodProductionRate > 50 ? 'पत्ती सफलतापूर्वक खाना बना रही है!' : 'पत्ती को और अधिक धूप या पानी चाहिए!',
    },
  }[language];

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="font-bold text-emerald-950 text-base flex items-center gap-2">
            <span className="text-xl">🌿</span> {tTitles.title}
          </h4>
          <p className="text-xs text-emerald-800/80">Adjust the sun, water, and air to see food cooking in the leaf!</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">{tTitles.foodLabel}</span>
          <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
            {foodProductionRate}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Animated Leaf Simulation Stage */}
        <div className="relative h-48 bg-linear-to-b from-sky-100 to-emerald-100 rounded-xl border border-emerald-200 overflow-hidden flex items-center justify-center p-4">
          {/* Sun visual */}
          <div
            className="absolute top-2 right-2 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: Math.max(0.3, sunlight / 100),
              transform: `scale(${0.7 + (sunlight / 100) * 0.4})`,
            }}
          >
            <div className="w-12 h-12 bg-amber-400 rounded-full blur-[1px] shadow-lg shadow-amber-300/60 flex items-center justify-center animate-pulse">
              <Sun className="w-6 h-6 text-amber-800" />
            </div>
          </div>

          {/* Green Leaf Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-20 bg-emerald-500 rounded-tl-full rounded-br-full border-2 border-emerald-600 shadow-md relative flex items-center justify-center">
              {/* Veins */}
              <div className="w-24 h-0.5 bg-emerald-300/80 absolute"></div>
              <div className="text-center">
                <span className="text-[11px] font-bold text-emerald-950 bg-white/80 px-2 py-0.5 rounded-full">
                  🍃 Chlorophyll
                </span>
              </div>
            </div>

            {/* Bubble animations when cooking */}
            {foodProductionRate > 30 && (
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded-full animate-bounce">
                  🫧 O₂ (Oxygen)
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full animate-pulse">
                  🍯 Glucose
                </span>
              </div>
            )}
          </div>

          {/* Status banner */}
          <div className="absolute bottom-1.5 left-2 right-2 text-center">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs ${
              foodProductionRate > 50 ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900'
            }`}>
              {tTitles.cookingStatus}
            </span>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
              <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-500" /> {tTitles.sunlightLabel}</span>
              <span className="font-mono text-amber-700 font-bold">{sunlight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sunlight}
              onChange={(e) => {
                sounds.playClick();
                setSunlight(Number(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setWaterActive(!waterActive);
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                waterActive
                  ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              {waterActive ? 'Water ON (Roots)' : 'Water OFF'}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setCo2Active(!co2Active);
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                co2Active
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              {co2Active ? 'CO₂ Air ON' : 'CO₂ OFF'}
            </button>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs text-stone-700 space-y-1">
            <div className="flex justify-between">
              <span>Reaction Equation:</span>
              <span className="font-mono font-semibold text-emerald-800">CO₂ + Water + Sunlight → Sugar + O₂</span>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              Notice: Turn off water or reduce sunlight, and food production immediately slows down!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Simple Machines Pulley Simulator
const PulleySimulator: React.FC<{ language: Language }> = ({ language }) => {
  const [usePulley, setUsePulley] = useState<boolean>(true);
  const [liftHeight, setLiftHeight] = useState<number>(50);

  return (
    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="font-bold text-blue-950 text-base flex items-center gap-2">
            <span className="text-xl">🪣</span> Village Well Pulley Lab
          </h4>
          <p className="text-xs text-blue-800/80">Compare pulling water directly vs using a grooved wooden pulley wheel!</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Required Effort</span>
          <div className="text-2xl font-black text-blue-700 font-mono tracking-tight">
            {usePulley ? '50 N (Easy)' : '100 N (Hard)'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Well stage */}
        <div className="relative h-48 bg-linear-to-b from-sky-50 to-stone-100 rounded-xl border border-blue-200 flex flex-col items-center justify-between p-3 overflow-hidden">
          {/* Top beam with or without pulley */}
          <div className="w-full flex flex-col items-center">
            <div className="w-40 h-2.5 bg-amber-800 rounded-full"></div>
            {usePulley && (
              <div className="w-8 h-8 rounded-full border-2 border-stone-800 bg-stone-300 flex items-center justify-center shadow-xs -mt-1 animate-spin duration-1000">
                <span className="text-[8px] font-bold">⚙️</span>
              </div>
            )}
          </div>

          {/* Rope & Bucket */}
          <div
            className="flex flex-col items-center transition-all duration-300"
            style={{
              transform: `translateY(${50 - liftHeight * 0.6}px)`,
            }}
          >
            <div className="w-0.5 h-16 bg-stone-700"></div>
            <div className="w-10 h-10 bg-sky-600 rounded-b-xl border-2 border-sky-800 flex items-center justify-center shadow-md">
              <span className="text-[9px] text-white font-bold">H₂O</span>
            </div>
          </div>

          <div className="w-full bg-stone-300 h-6 border-t border-stone-400 flex items-center justify-center">
            <span className="text-[10px] text-stone-700 font-bold">Village Well Opening</span>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setUsePulley(true);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                usePulley ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              With Pulley (Downwards Pull)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setUsePulley(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                !usePulley ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              Without Pulley (Upwards Pull)
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Lift Bucket Height:
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={liftHeight}
              onChange={(e) => {
                sounds.playClick();
                setLiftHeight(Number(e.target.value));
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-blue-100 text-xs text-stone-700 space-y-1">
            <p className="font-medium">
              {usePulley
                ? '💡 With the pulley, you pull downwards! Gravity and your own body weight work with you.'
                : '⚠️ Without a pulley, you must lift 100% of the weight straight up, bending your back!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. English Action Verbs Matching Simulator
const VerbsSimulator: React.FC<{ language: Language }> = ({ language }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);

  const pairs = [
    { verb: 'Harvest', action: '🌾 Cutting ripe paddy crops', emoji: '🌾' },
    { verb: 'Plow', action: '🐂 Tilling soil with bullock cart', emoji: '🐂' },
    { verb: 'Draw', action: '🪣 Pulling water from well', emoji: '🪣' },
    { verb: 'Read', action: '📖 Studying under tree', emoji: '📖' },
  ];

  const handleSelectVerb = (verb: string) => {
    sounds.playClick();
    setSelectedWord(verb);
  };

  const handleMatchAction = (verb: string) => {
    if (selectedWord === verb) {
      sounds.playCorrect();
      setMatches([...matches, verb]);
      setSelectedWord(null);
    } else {
      sounds.playIncorrect();
    }
  };

  return (
    <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="font-bold text-indigo-950 text-base flex items-center gap-2">
            <span className="text-xl">📖</span> Village Action Verbs Matcher
          </h4>
          <p className="text-xs text-indigo-800/80">Match the English action verb on the left with its village picture on the right!</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">Matched</span>
          <div className="text-2xl font-black text-indigo-700 font-mono tracking-tight">
            {matches.length} / {pairs.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Verbs Column */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-600 block mb-1">English Action Verbs:</span>
          {pairs.map((p) => {
            const isDone = matches.includes(p.verb);
            const isSelected = selectedWord === p.verb;
            return (
              <button
                key={p.verb}
                disabled={isDone}
                onClick={() => handleSelectVerb(p.verb)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-800 line-through opacity-70'
                    : isSelected
                    ? 'bg-indigo-600 text-white shadow-xs scale-102'
                    : 'bg-white text-stone-800 border border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                {p.verb}
              </button>
            );
          })}
        </div>

        {/* Actions Column */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-600 block mb-1">Village Action Meanings:</span>
          {pairs.map((p) => {
            const isDone = matches.includes(p.verb);
            return (
              <button
                key={p.action}
                disabled={isDone}
                onClick={() => handleMatchAction(p.verb)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium text-left transition-all ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-800 opacity-70'
                    : selectedWord
                    ? 'bg-white text-stone-800 border-2 border-dashed border-indigo-300 hover:bg-indigo-50 hover:border-indigo-500'
                    : 'bg-white text-stone-800 border border-stone-200'
                }`}
              >
                {p.action}
              </button>
            );
          })}
        </div>
      </div>
      {matches.length === pairs.length && (
        <div className="mt-4 p-2 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-bold animate-pulse">
          🎉 Fantastic! You matched all village action verbs!
        </div>
      )}
    </div>
  );
};
