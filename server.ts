import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client (using gemini-3.8-flash as standard)
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: AI Doubt Solver for rural students (Vidya Mitra)
app.post('/api/gemini/doubt-solver', async (req, res) => {
  try {
    const { query, language = 'English', grade = '6', subject = 'General' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        text: getLocalRuralDoubtAnswer(query, language),
        analogy: 'Rural life analogy provided via offline wisdom bank.',
        source: 'offline_knowledge_base'
      });
    }

    const systemPrompt = `You are "Vidya Mitra" (విద్యా మిత్ర / विद्या मित्र), a warm, encouraging, culturally grounded mentor for rural Indian students aged 8-14 in Class ${grade}.
The student is learning ${subject} in ${language}.
Always explain scientific, mathematical, and language concepts using relatable rural analogies from daily Indian village life:
- Math/Fractions: sharing rotis/chapatis, measuring lentils/rice, bullock cart wheel rotations, market mangoes.
- Science: monsoon clouds, banyan tree roots, well water pulley systems, seed germination, sunlight on neem leaves.
- English: simple vocabulary games, connecting to mother tongue sounds.

Guidelines:
1. Provide the response primarily in ${language} (if Telugu or Hindi, use natural, friendly colloquial language that an 8-14 year old student understands easily, with Latin transliteration or clear key English terms in brackets if helpful).
2. Keep it concise, friendly, and structured into:
   - 🌟 Simple Concept (2-3 sentences)
   - 🌾 Village Analogy / Real-world Example (relatable story)
   - 💡 Quick Memory Tip or "Did you know?"
   - 🎯 Quick Check Question (one simple question to test their understanding).
3. Be immensely encouraging! Never use complex academic jargon without explaining it immediately.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Student Question: "${query}"\nSubject: ${subject}\nLanguage: ${language}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const answer = response.text || 'I am thinking about your wonderful question!';
    return res.json({
      text: answer,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in doubt-solver endpoint:', error);
    // Graceful fallback to offline logic on network or quota issues
    const { query, language = 'English' } = req.body;
    return res.json({
      fallback: true,
      text: getLocalRuralDoubtAnswer(query, language),
      source: 'offline_knowledge_base',
      note: 'Offline rural wisdom base responded.',
    });
  }
});

// Endpoint: AI Teacher Intervention Generator
app.post('/api/teacher/intervention-plan', async (req, res) => {
  try {
    const { topic, subject, doubtCount, strugglingStudents, language = 'English' } = req.body;

    if (!ai) {
      return res.json({
        plan: `Recommended Action for ${topic}:\n1. 15-Minute Hands-on Chalkboard & Physical Object Demonstration using clay marbles or dried tamarind seeds.\n2. Peer Learning Circle: Pair top scorers with struggling students.\n3. Send 3 offline practice flashcards to students' tablets.`,
        source: 'offline_curriculum_guide'
      });
    }

    const prompt = `You are an experienced rural education pedagogical advisor assisting a government school teacher.
Topic: ${topic} (${subject})
Number of student doubts logged: ${doubtCount}
Struggling students count: ${strugglingStudents?.length || 4}
Language: ${language}

Provide a practical, low-resource 3-step intervention plan:
1. "Concrete-to-Abstract" Reteaching Activity (using locally available materials like sticks, seeds, stones, village maps, or chalk).
2. Peer Buddy pairing strategy.
3. Rapid 2-question diagnostic test to verify understanding.
Keep the advice realistic for rural classrooms with intermittent power.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return res.json({
      plan: response.text,
      source: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Teacher intervention error:', error);
    return res.json({
      plan: `Recommended Action for ${req.body.topic || 'the topic'}:\n1. Concrete demonstration using pebbles/chalk.\n2. Peer-guided practice session.\n3. 5-minute oral review check.`,
      source: 'offline_curriculum_guide'
    });
  }
});

// Fallback intelligent offline explanation generator with rural analogies
function getLocalRuralDoubtAnswer(query: string, language: string): string {
  const q = query.toLowerCase();
  
  if (language === 'Telugu') {
    if (q.includes('భిన్నం') || q.includes('fraction') || q.includes('math')) {
      return `🌟 **భిన్నాలు (Fractions) అంటే ఏమిటి?**
భిన్నం అంటే ఒక పూర్తి వస్తువులోని సమాన భాగాలు!

🌾 **గ్రామీణ ఉదాహరణ (Village Analogy):**
మీ అమ్మ ఒక రుచికరమైన రొట్టె లేదా దోశను తయారు చేసింది అనుకుందాం. నువ్వు మరియు నీ సోదరుడు సమానంగా పంచుకోవాలి. మీరు దాన్ని సరిగ్గా 2 సమాన ముక్కలు చేస్తారు. నీకు వచ్చే ఒక ముక్కను గణితంలో **1/2 (సగం)** అంటారు! నలుగురు స్నేహితులు పంచుకుంటే ఒక్కొక్కరికి **1/4** వస్తుంది.

💡 **చిట్కా:** పైన ఉండే సంఖ్య (లవము - Numerator) మీకు ఎన్ని ముక్కలు వచ్చాయో చెబుతుంది, కింద ఉండే సంఖ్య (హారము - Denominator) మొత్తం ఎన్ని ముక్కలు చేశారో చెబుతుంది!

🎯 **నీకోసం ప్రశ్న:** 6 మామిడి పండ్లలో 3 పండ్లు తింటే, తిన్న భాగం ఎంత? (సమాధానం: 3/6 లేదా 1/2!)`;
    }
    if (q.includes('కిరణజన్య') || q.includes('photosynthesis') || q.includes('సైన్స్') || q.includes('ఆకు')) {
      return `🌟 **కిరణజన్య సంయోగక్రియ (Photosynthesis):**
మొక్కలు తమ ఆహారాన్ని తామే తయారు చేసుకునే అద్భుతమైన ప్రక్రియ!

🌾 **గ్రామీణ ఉదాహరణ:**
ఆకు ఒక "చిన్న వంటిల్లు" లాంటిది! 
- సూర్యరశ్మి = పొయ్యి మంట
- వేర్ల నుండి నీరు = బియ్యం ఉడకబెట్టే నీరు
- గాలిలోని కార్బన్ డయాక్సైడ్ = వంటింటి దినుసులు
ఆకు పచ్చగా ఉండేందుకు పత్రహరితం (Chlorophyll) సహాయపడుతుంది. ఇవన్నీ కలిసి మొక్కకు ఆహారాన్ని (గ్లూకోజ్), మనకు పీల్చుకునే ప్రాణవాయువును (ఆక్సిజన్) ఇస్తాయి!

💡 **గుర్తుంచుకో:** పగటిపూట సూర్యుని వెలుగు ఉన్నప్పుడే ఈ వంటిల్లు పనిచేస్తుంది!`;
    }
    return `🌟 **విద్య మిత్ర సమాధానం:**
నీ ప్రశ్న చాలా బాగుంది! గ్రామాల్లో ప్రతి విషయాన్ని ప్రయోగాల ద్వారా సులభంగా నేర్చుకోవచ్చు. మన ఉపాధ్యాయులు చెప్పినట్లుగా అడుగుల వారీగా ఆలోచించండి. 

💡 ఏ సందేహం వచ్చినా నిర్భయంగా అడగండి, జ్ఞానానికి హద్దులు లేవు!`;
  }

  if (language === 'Hindi') {
    if (q.includes('भिन्न') || q.includes('fraction') || q.includes('गणित')) {
      return `🌟 **भिन्न (Fractions) क्या हैं?**
भिन्न का मतलब है किसी पूरी चीज़ का एक बराबर हिस्सा!

🌾 **गाँव का उदाहरण (Village Analogy):**
मान लो आपकी माँ ने एक गोल रोटी बनाई। आपको और आपके भाई को बराबर बाँटना है। आपने रोटी के 2 बराबर टुकड़े किए। आपके हिस्से का एक टुकड़ा गणित में **1/2 (आधा)** कहलाएगा! अगर 4 दोस्त बाँटें तो हर एक को **1/4 (चौथाई)** मिलेगा।

💡 **याद रखने की ट्रिक:** ऊपर वाला अंक (अंश) बताता है आपको कितने हिस्से मिले, और नीचे वाला अंक (हर) बताता है कुल कितने हिस्से हुए!

🎯 **सवाल:** यदि 8 जामुन में से 4 खा लिए, तो कितना हिस्सा खाया? (उत्तर: 4/8 या 1/2!)`;
    }
    if (q.includes('प्रकाश') || q.includes('photosynthesis') || q.includes('पत्ता') || q.includes('पौधे')) {
      return `🌟 **प्रकाश संश्लेषण (Photosynthesis):**
वह प्रक्रिया जिससे पौधे अपना भोजन खुद बनाते हैं!

🌾 **गाँव का उदाहरण:**
पत्ता पौधे की "रसोई" है!
- सूरज की धूप = चूल्हे की आँच
- जड़ों से पानी = खाना बनाने का पानी
- हवा से कार्बन डाइऑक्साइड = सामग्री
पत्ते का हरा रंग (क्लोरोफिल) धूप को पकड़ता है। इससे पौधे को खाना मिलता है और हमें शुद्ध ऑक्सीजन (प्राणवायु)!

💡 **याद रखें:** सूरज की रोशनी में ही पौधे अपना भोजन बनाते हैं!`;
    }
    return `🌟 **विद्या मित्र उत्तर:**
आपका प्रश्न बहुत अच्छा है! गाँव के परिवेश में विज्ञान और गणित हर जगह मौजूद हैं। अभ्यास करते रहिए और बिना झिझक के सीखिए!`;
  }

  // English default
  return `🌟 **What is this Concept?**
Every big idea in science and math can be understood through things we see right around our village!

🌾 **Village Analogy:**
Think of math and science like farming or cooking:
- When we share 1 sweet (ladoo) between 2 friends, each gets 1/2!
- Just like a tree drinks groundwater through its roots, capillary action pulls water upwards against gravity!
- When you pedal a bicycle on gravel vs smooth road, the friction changes how fast you go!

💡 **Golden Rule:** Learning with curiosity turns every everyday object into a science lab! Feel free to test with our interactive lessons and quizzes.`;
}

// Dev server or Production static handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VidyaSetu server running on port ${PORT}`);
  });
}

startServer();
