import { Subject, Badge, LeaderboardEntry, StrugglingStudent, TopicDoubtMetric } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    title: {
      en: 'Mathematics',
      te: 'గణిత శాస్త్రం',
      hi: 'गणित',
    },
    description: {
      en: 'Fractions, market calculations, decimals, and agricultural measurements.',
      te: 'భిన్నాలు, మార్కెట్ లెక్కలు, దశాంశాలు మరియు పొలం కొలతలు.',
      hi: 'भिन्न, बाज़ार का हिसाब, दशमलव और खेत की नाप-तौल।',
    },
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
    lessons: [
      {
        id: 'math-1-fractions',
        subjectId: 'math',
        grade: 6,
        durationMinutes: 8,
        xpReward: 120,
        coinReward: 25,
        sizeKb: 480,
        icon: 'PieChart',
        title: {
          en: 'Fractions: Sharing the Chapati',
          te: 'భిన్నాలు: రొట్టె పంపకం',
          hi: 'भिन्न: रोटी का बँटवारा',
        },
        subtitle: {
          en: 'Understand halves, quarters, numerator, and denominator with food sharing.',
          te: 'సగం, పావు, లవము మరియు హారములను రొట్టెల ద్వారా సులభంగా అర్థం చేసుకోండి.',
          hi: 'रोटी बाँटकर समझें आधा, चौथाई, अंश और हर।',
        },
        concepts: [
          {
            heading: {
              en: 'What is a Fraction?',
              te: 'భిన్నం అంటే ఏమిటి?',
              hi: 'भिन्न क्या होता है?',
            },
            content: {
              en: 'A fraction represents equal parts of a whole thing. When you divide 1 whole item into parts, each piece is a fraction.',
              te: 'ఒక పూర్తి వస్తువును సమాన భాగాలుగా విభజించినప్పుడు వచ్చే ప్రతి భాగాన్ని భిన్నం అంటారు.',
              hi: 'भिन्न किसी एक पूरी वस्तु के बराबर हिस्सों को दर्शाता है।',
            },
            villageAnalogy: {
              en: 'Imagine your grandmother made a warm, round chapati. You and your sister want to share it equally. You cut it into 2 equal parts. Each of you gets 1/2 (half) of the chapati!',
              te: 'అమ్మ చేసిన వేడి వేడి గుండ్రని రొట్టెను నువ్వు, నీ చెల్లెలు సమానంగా పంచుకోవాలి. సరిగ్గా 2 సమ భాగాలు చేస్తారు. మీరిద్దరికీ ఒక్కొక్కరికి 1/2 (సగం) వస్తుంది!',
              hi: 'दादी ने एक गोल रोटी बनाई। आपको और आपकी बहन को बराबर बाँटना है। आपने 2 बराबर टुकड़े किए। दोनों को 1/2 (आधा) हिस्सा मिला!',
            },
            simulationType: 'fractions',
          },
          {
            heading: {
              en: 'Numerator vs Denominator',
              te: 'లవము మరియు హారము',
              hi: 'अंश और हर',
            },
            content: {
              en: 'In fraction 3/4: Top number (3) is Numerator (parts you take). Bottom number (4) is Denominator (total equal pieces made).',
              te: '3/4 లో: పై సంఖ్య (3) లవము (తీసుకున్న భాగాలు). కింది సంఖ్య (4) హారము (మొత్తం సమాన భాగాలు).',
              hi: '3/4 में: ऊपर की संख्या (3) अंश है (लिए गए टुकड़े)। नीचे की संख्या (4) हर है (कुल बराबर टुकड़े)।',
            },
            villageAnalogy: {
              en: 'If a village farmer cuts a large sweet watermelon into 4 equal slices and serves 3 slices to guests, they served 3 out of 4 slices = 3/4 of the watermelon!',
              te: 'మన ఊరి రైతు ఒక పెద్ద పుచ్చకాయను 4 సమాన ముక్కలు చేసి, 3 ముక్కలు అతిథులకు ఇస్తే, 4 లో 3 ముక్కలు ఇచ్చాడు = 3/4 భాగం!',
              hi: 'गाँव के किसान ने एक तरबूज को 4 बराबर हिस्सों में काटा और 3 हिस्से मेहमानों को दिए = 3/4 भाग!',
            },
            simulationType: 'fractions',
          },
        ],
        quiz: [
          {
            id: 'q-f-1',
            question: {
              en: 'If a chapati is cut into 4 equal pieces and Raju eats 1 piece, what fraction did Raju eat?',
              te: 'ఒక రొట్టెను 4 సమాన ముక్కలుగా చేసి రాజు 1 ముక్క తింటే, రాజు తిన్న భాగం ఎంత?',
              hi: 'एक रोटी को 4 बराबर टुकड़ों में काटा गया और राजू ने 1 टुकड़ा खाया, तो राजू ने कितना हिस्सा खाया?',
            },
            options: {
              en: ['1/4 (One-fourth)', '1/2 (Half)', '3/4 (Three-fourths)', '4/1'],
              te: ['1/4 (పావు భాగం)', '1/2 (సగం భాగం)', '3/4 (ముప్పావు)', '4/1'],
              hi: ['1/4 (चौथाई)', '1/2 (आधा)', '3/4 (तीन चौथाई)', '4/1'],
            },
            correctIndex: 0,
            explanation: {
              en: '1 piece was eaten out of 4 total pieces, so the fraction is 1/4.',
              te: 'మొత్తం 4 ముక్కల్లో రాజు 1 ముక్క తిన్నాడు, కాబట్టి భిన్నం 1/4.',
              hi: 'कुल 4 टुकड़ों में से 1 टुकड़ा खाया, इसलिए भिन्न 1/4 है।',
            },
            ruralAnalogy: {
              en: 'Just like 1 quarter rupee coin (25 paise) out of a full 1 rupee!',
              te: 'రూపాయలో పావలా (25 పైసలు) ఉన్నట్లుగా!',
              hi: 'जैसे 1 रुपये में 25 पैसे (चार आना)!',
            },
            hint: {
              en: 'Put the eaten pieces on top, and total pieces on bottom!',
              te: 'తిన్న ముక్కను పైన, మొత్తం ముక్కలను కింద ఉంచండి!',
              hi: 'खाए गए टुकड़े को ऊपर और कुल टुकड़ों को नीचे रखें!',
            },
          },
          {
            id: 'q-f-2',
            question: {
              en: 'In the fraction 5/8, which number is the denominator (total parts)?',
              te: '5/8 భిన్నంలో హారము (మొత్తం భాగాలు తెలిపే సంఖ్య) ఏది?',
              hi: 'भिन्न 5/8 में हर (कुल हिस्से बताने वाली संख्या) कौन सी है?',
            },
            options: {
              en: ['8 (Bottom number)', '5 (Top number)', '13 (Sum)', '3 (Difference)'],
              te: ['8 (కింది సంఖ్య)', '5 (పై సంఖ్య)', '13 (మొత్తం)', '3 (తేడా)'],
              hi: ['8 (नीचे की संख्या)', '5 (ऊपर की संख्या)', '13', '3'],
            },
            correctIndex: 0,
            explanation: {
              en: 'The bottom number is always the denominator, representing total parts.',
              te: 'కింద ఉండే సంఖ్యే ఎల్లప్పుడూ హారము (Denominator). ఇది మొత్తం భాగాలను సూచిస్తుంది.',
              hi: 'नीचे वाली संख्या हमेशा हर होती है, जो कुल हिस्सों को दर्शाती है।',
            },
            ruralAnalogy: {
              en: 'Like the foundation under a village house—it stays at the bottom!',
              te: 'ఇంటికి పునాది కింద ఉన్నట్లే, హారము కింద ఉంటుంది!',
              hi: 'जैसे घर की नींव नीचे रहती है, वैसे ही हर नीचे रहता है!',
            },
            hint: {
              en: 'Remember: D for Down, D for Denominator!',
              te: 'కింద (Down) ఉండేదే హారము (Denominator)!',
              hi: 'याद रखें: नीचे रहने वाला अंक हर है!',
            },
          },
          {
            id: 'q-f-3',
            question: {
              en: 'Which of the following fractions is equal to 1/2 (one half)?',
              te: 'కింది వాటిలో 1/2 (సగం)కి సమానమైన భిన్నం ఏది?',
              hi: 'निम्नलिखित में से कौन सा भिन्न 1/2 (आधा) के बराबर है?',
            },
            options: {
              en: ['2/4', '1/3', '3/8', '2/5'],
              te: ['2/4', '1/3', '3/8', '2/5'],
              hi: ['2/4', '1/3', '3/8', '2/5'],
            },
            correctIndex: 0,
            explanation: {
              en: '2 pieces out of 4 is the exact same as 1 piece out of 2!',
              te: '4 ముక్కల్లో 2 ముక్కలు తీసుకోవడం అంటే సరిగ్గా సగం (1/2) తీసుకోవడమే!',
              hi: '4 में से 2 टुकड़े लेना बिल्कुल 2 में से 1 टुकड़े (आधे) के बराबर है!',
            },
            ruralAnalogy: {
              en: 'Cutting a dosa into 4 pieces and taking 2 pieces gives you half the dosa!',
              te: 'దోశను 4 ముక్కలు చేసి 2 ముక్కలు తీసుకుంటే సగం దోశ వస్తుంది!',
              hi: 'रोटी के 4 टुकड़ों में से 2 लेने पर भी आधी रोटी ही मिलती है!',
            },
            hint: {
              en: 'Divide both top and bottom by 2!',
              te: 'లవం మరియు హారాలను 2 తో భాగించండి!',
              hi: 'अंश और हर दोनों को 2 से भाग दें!',
            },
          },
        ],
      },
      {
        id: 'math-2-decimals',
        subjectId: 'math',
        grade: 6,
        durationMinutes: 7,
        xpReward: 110,
        coinReward: 20,
        sizeKb: 420,
        icon: 'Coins',
        title: {
          en: 'Decimals & Village Market Money',
          te: 'దశాంశాలు & సంత లెక్కలు',
          hi: 'दशमलव और हाट-बाज़ार का हिसाब',
        },
        subtitle: {
          en: 'Learn paise and rupees, weighing lentils and grains on the balance scale.',
          te: 'పైసలు, రూపాయలు, కందిపప్పు మరియు ధాన్యం తూకాలను సులభంగా నేర్చుకోండి.',
          hi: 'पैसे, रुपये और अनाज की तौल में दशमलव का प्रयोग सीखें।',
        },
        concepts: [
          {
            heading: {
              en: 'Decimals in Currency',
              te: 'డబ్బుల్లో దశాంశాలు',
              hi: 'रुपयों में दशमलव',
            },
            content: {
              en: '100 paise make 1 rupee. So 50 paise is ₹0.50, and 25 paise is ₹0.25.',
              te: '100 పైసలు కలిస్తే 1 రూపాయి. కాబట్టి 50 పైసలు అంటే ₹0.50, 25 పైసలు అంటే ₹0.25.',
              hi: '100 पैसे मिलकर 1 रुपया बनाते हैं। 50 पैसे = ₹0.50, और 25 पैसे = ₹0.25।',
            },
            villageAnalogy: {
              en: 'At the village weekly market (shandy), buying 1 kg jaggery for ₹45 and 50 paise is written as ₹45.50.',
              te: 'మన ఊరి వారపు సంతలో ₹45 మరియు 50 పైసలకు బెల్లం కొంటే దాన్ని ₹45.50 గా రాస్తాం.',
              hi: 'गाँव के बाज़ार में ₹45 और 50 पैसे का गुड़ खरीदा, तो इसे ₹45.50 लिखेंगे।',
            },
          },
        ],
        quiz: [
          {
            id: 'q-d-1',
            question: {
              en: 'How do you write 7 rupees and 75 paise in decimal notation?',
              te: '7 రూపాయల 75 పైసలను దశాంశ రూపంలో ఎలా రాస్తారు?',
              hi: '7 रुपये और 75 पैसे को दशमलव में कैसे लिखेंगे?',
            },
            options: {
              en: ['₹7.75', '₹77.5', '₹0.775', '₹7.075'],
              te: ['₹7.75', '₹77.5', '₹0.775', '₹7.075'],
              hi: ['₹7.75', '₹77.5', '₹0.775', '₹7.075'],
            },
            correctIndex: 0,
            explanation: {
              en: '75 paise is 75/100 of a rupee, so it is written after the decimal point: ₹7.75.',
              te: '75 పైసలు అంటే రూపాయిలో 75/100 భాగం, కాబట్టి చుక్క తర్వాత 75 వస్తుంది: ₹7.75.',
              hi: '75 पैसे रुपये का 75/100 भाग है, इसलिए दशमलव के बाद 75 आता है: ₹7.75।',
            },
            ruralAnalogy: {
              en: 'The dot separates the whole rupees from the small loose coins!',
              te: 'చుక్క అనేది పూర్తి రూపాయలను, చిల్లర పైసలను వేరు చేస్తుంది!',
              hi: 'दशमलव पूरे रुपयों और चिल्लर पैसों को अलग करता है!',
            },
            hint: {
              en: 'Put the rupee before the dot, paise after the dot!',
              te: 'రూపాయలు చుక్కకు ముందు, పైసలు చుక్క తర్వాత రాయండి!',
              hi: 'रुपये दशमलव से पहले, पैसे दशमलव के बाद!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'science',
    title: {
      en: 'General Science',
      te: 'సాధారణ విజ్ఞాన శాస్త్రం',
      hi: 'सामान्य विज्ञान',
    },
    description: {
      en: 'Photosynthesis, simple machines, well pulley, monsoon water cycle.',
      te: 'కిరణజన్య సంయోగక్రియ, సరళ యంత్రాలు, బావి కప్పీ, వర్షం మరియు నీటి చక్రం.',
      hi: 'प्रकाश संश्लेषण, सरल मशीनें, कुएँ की घिरनी और जल चक्र।',
    },
    icon: 'Leaf',
    color: 'from-emerald-500 to-teal-700',
    accentBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    lessons: [
      {
        id: 'sci-1-photosynthesis',
        subjectId: 'science',
        grade: 6,
        durationMinutes: 10,
        xpReward: 140,
        coinReward: 30,
        sizeKb: 510,
        icon: 'Sun',
        title: {
          en: 'Photosynthesis: The Green Leaf Kitchen',
          te: 'కిరణజన్య సంయోగక్రియ: ఆకు వంటిల్లు',
          hi: 'प्रकाश संश्लेषण: हरी पत्ती की रसोई',
        },
        subtitle: {
          en: 'How plants cook food using sunlight, roots water, and carbon dioxide.',
          te: 'మొక్కలు సూర్యరశ్మి, నీరు మరియు గాలిని ఉపయోగించి ఆహారం ఎలా తయారుచేస్తాయో చూడండి.',
          hi: 'जानें कैसे पौधे धूप, पानी और हवा से अपना भोजन बनाते हैं।',
        },
        concepts: [
          {
            heading: {
              en: 'The Leaf as a Solar Kitchen',
              te: 'ఆకు ఒక సూర్య వంటిల్లు',
              hi: 'पत्ती: एक सौर रसोई',
            },
            content: {
              en: 'Plants cannot walk to the market. Instead, leaves use chlorophyll (green pigment), sunlight, water from soil, and carbon dioxide to prepare glucose and oxygen.',
              te: 'మొక్కలు ఆహారం కోసం ఎక్కడికీ వెళ్లలేవు. ఆకులలోని పత్రహరితం సూర్యరశ్మిని పట్టుకుని, వేర్ల నీరు మరియు గాలితో కలిపి గ్లూకోజ్ ఆహారాన్ని తయారుచేస్తుంది.',
              hi: 'पौधे बाज़ार नहीं जा सकते। उनकी पत्तियाँ क्लोरोफिल, धूप, पानी और कार्बन डाइऑक्साइड से अपना भोजन बनाती हैं।',
            },
            villageAnalogy: {
              en: 'Think of how your mother cooks rice in an earthen pot: Sunlight is the firewood flame, water from the village well is the cooking water, and carbon dioxide from the air is the raw grains!',
              te: 'అమ్మ పొయ్యి మీద వంట చేసినట్లే: సూర్యకాంతి పొయ్యిలోని మంట లాంటిది, బావి నీరు వంట నీరు లాంటిది, గాలిలోని వాయువు బియ్యం లాంటిది!',
              hi: 'जैसे माँ चूल्हे पर खाना बनाती हैं: धूप चूल्हे की आग है, कुएँ का पानी खाना पकाने का पानी है, और हवा सामग्री है!',
            },
            simulationType: 'photosynthesis',
          },
        ],
        quiz: [
          {
            id: 'q-p-1',
            question: {
              en: 'What gas do plants absorb from the air during photosynthesis?',
              te: 'కిరణజన్య సంయోగక్రియ సమయంలో మొక్కలు గాలి నుండి ఏ వాయువును పీల్చుకుంటాయి?',
              hi: 'प्रकाश संश्लेषण के दौरान पौधे हवा से कौन सी गैस लेते हैं?',
            },
            options: {
              en: ['Carbon Dioxide (CO2)', 'Oxygen', 'Nitrogen', 'Helium'],
              te: ['కార్బన్ డయాక్సైడ్ (CO2)', 'ఆక్సిజన్', 'నత్రజని', 'హీలియం'],
              hi: ['कार्बन डाइऑक्साइड (CO2)', 'ऑक्सीजन', 'नाइट्रोजन', 'हीलियम'],
            },
            correctIndex: 0,
            explanation: {
              en: 'Plants absorb Carbon Dioxide from the air through tiny openings in leaves called stomata.',
              te: 'మొక్కలు ఆకులపై ఉండే పత్రరంధ్రాల (Stomata) ద్వారా కార్బన్ డయాక్సైడ్ వాయువును పీల్చుకుంటాయి.',
              hi: 'पौधे पत्तियों के छोटे छिद्रों (स्टोमेटा) द्वारा कार्बन डाइऑक्साइड लेते हैं।',
            },
            ruralAnalogy: {
              en: 'Like the smoke holes in a village mud house that let air flow!',
              te: 'గ్రామీణ మట్టి ఇళ్లలోని కిటికీల ద్వారా గాలి వచ్చినట్లే!',
              hi: 'जैसे गाँव के घर के झरोखों से हवा आती है!',
            },
            hint: {
              en: 'It starts with the letter C and humans breathe it out!',
              te: 'మనం బయటకు వదిలే వాయువు ఇదే!',
              hi: 'यह वह गैस है जिसे हम साँस छोड़ते समय बाहर निकालते हैं!',
            },
          },
          {
            id: 'q-p-2',
            question: {
              en: 'What gives leaves their green color and captures sunlight?',
              te: 'ఆకులకు ఆకుపచ్చ రంగును ఇచ్చి, సూర్యకాంతిని గ్రహించే పదార్థం ఏది?',
              hi: 'पत्तियों को हरा रंग देने और धूप को सोखने वाला तत्व कौन सा है?',
            },
            options: {
              en: ['Chlorophyll (పత్రహరితం / क्लोरोफिल)', 'Hemoglobin', 'Soil Clay', 'Melanin'],
              te: ['పత్రహరితం (Chlorophyll)', 'హిమోగ్లోబిన్', 'మట్టి జిగురు', 'మెలనిన్'],
              hi: ['क्लोरोफिल (Chlorophyll)', 'हीमोग्लोबिन', 'मिट्टी', 'मेलेनिन'],
            },
            correctIndex: 0,
            explanation: {
              en: 'Chlorophyll is the green pigment in plant cells that traps solar energy.',
              te: 'పత్రహరితం (Chlorophyll) సూర్యకాంతిని సంగ్రహించి రసాయనిక శక్తిగా మారుస్తుంది.',
              hi: 'क्लोरोफिल पत्तियों का वह हरा वर्णक है जो सूर्य की ऊर्जा को सोखता है।',
            },
            ruralAnalogy: {
              en: 'Like the green neem leaves that stay vibrant under the hot summer sun!',
              te: 'ఎండలో కూడా నిగనిగలాడే వేప ఆకుల పచ్చదనం లాంటిది!',
              hi: 'जैसे कड़ी धूप में भी नीम के पत्तों की ताज़ा हरियाली!',
            },
            hint: {
              en: 'Think of the word "Chloro" which means green!',
              te: 'పత్రం అంటే ఆకు, హరితం అంటే పచ్చదనం!',
              hi: 'पत्तियों की हरियाली में छिपा नाम!',
            },
          },
          {
            id: 'q-p-3',
            question: {
              en: 'What life-giving gas do plants release into the air that humans and animals breathe?',
              te: 'మనుషులు మరియు జంతువులు శ్వాసించడానికి మొక్కలు విడుదల చేసే ప్రాణవాయువు ఏది?',
              hi: 'पौधे हवा में कौन सी जीवनदायिनी गैस छोड़ते हैं जिसे हम साँस में लेते हैं?',
            },
            options: {
              en: ['Oxygen (ఆక్సిజన్ / ऑक्सीजन)', 'Carbon Monoxide', 'Methane', 'Smoke'],
              te: ['ఆక్సిజన్ (ప్రాణవాయువు)', 'కార్బన్ మోనాక్సైడ్', 'మీథేన్', 'పొగ'],
              hi: ['ऑक्सीजन (प्राणवायु)', 'कार्बन मोनोऑक्साइड', 'मीथेन', 'धुआँ'],
            },
            correctIndex: 0,
            explanation: {
              en: 'Plants release Oxygen as a byproduct, which purifies the air and keeps all living creatures alive!',
              te: 'మొక్కలు ఆహారం తయారైన తర్వాత ఆక్సిజన్ వాయువును బయటకు పంపుతాయి, ఇదే మన ప్రాణవాయువు!',
              hi: 'पौधे भोजन बनाने के बाद ऑक्सीजन छोड़ते हैं, जिससे हम सभी जीवित रहते हैं।',
            },
            ruralAnalogy: {
              en: 'Sitting under a huge village banyan tree gives you fresh, cool breeze because of this!',
              te: 'మర్రి చెట్టు కింద కూర్చున్నప్పుడు చల్లని తాజా గాలి రావడానికి కారణం ఇదే!',
              hi: 'बरगद के पेड़ के नीचे बैठकर जो ताज़ी हवा महसूस होती है, वह यही है!',
            },
            hint: {
              en: 'We inhale this every second to live!',
              te: 'మనం బ్రతకడానికి క్షణక్షణం పీల్చే గాలి!',
              hi: 'साँस लेने के लिए सबसे ज़रूरी गैस!',
            },
          },
        ],
      },
      {
        id: 'sci-2-pulley',
        subjectId: 'science',
        grade: 6,
        durationMinutes: 8,
        xpReward: 120,
        coinReward: 25,
        sizeKb: 450,
        icon: 'CircleDot',
        title: {
          en: 'Simple Machines: The Well Pulley',
          te: 'సరళ యంత్రాలు: బావి కప్పీ',
          hi: 'सरल मशीनें: कुएँ की घिरनी',
        },
        subtitle: {
          en: 'How grooved wheels make drawing deep water easy by changing direction.',
          te: 'బావి నుండి నీటి బకెట్ తోడటం కప్పీ (Pulley) ద్వారా ఎందుకు సులభమో తెలుసుకోండి.',
          hi: 'घिरनी की मदद से कुएँ से भारी बाल्टी खींचना कैसे आसान होता है।',
        },
        concepts: [
          {
            heading: {
              en: 'The Village Well Pulley',
              te: 'బావి కప్పీ ఎలా పనిచేస్తుంది?',
              hi: 'कुएँ की घिरनी कैसे काम करती है?',
            },
            content: {
              en: 'A pulley is a grooved wheel with a rope around it. Pulling downwards with your body weight uses gravity to lift the heavy bucket upwards.',
              te: 'కప్పీ అనేది గాడి ఉన్న చక్రం. తాడును కిందికి లాగినప్పుడు మన శరీర బరువు కూడా సహాయపడి, బకెట్ సులభంగా పైకి లేస్తుంది.',
              hi: 'घिरनी एक खांचेदार पहिया होती है। नीचे की ओर रस्सी खींचने से गुरुत्वाकर्षण हमारे पक्ष में काम करता है और बाल्टी आसानी से ऊपर आती है।',
            },
            villageAnalogy: {
              en: 'Without a pulley, drawing water hurts your hands and back. With a smooth wooden or iron pulley, even young children can easily draw water!',
              te: 'కప్పీ లేకపోతే చేతులు రాపిడికి గురై నొప్పి పుడతాయి. కప్పీ ఉంటే పిల్లలు కూడా సులభంగా బావి నీరు తోడవచ్చు!',
              hi: 'बिना घिरनी के पानी खींचने से हाथ छिल सकते हैं, पर घिरनी से बच्चा भी पानी खींच सकता है!',
            },
            simulationType: 'pulley',
          },
        ],
        quiz: [
          {
            id: 'q-pl-1',
            question: {
              en: 'Why is drawing water from a well easier with a pulley than without one?',
              te: 'కప్పీ లేకుండా లాగడం కంటే, కప్పీతో బావి నీరు తోడటం ఎందుకు సులభం?',
              hi: 'बिना घिरनी के पानी खींचने की तुलना में घिरनी से पानी खींचना आसान क्यों है?',
            },
            options: {
              en: [
                'It changes the direction of the pulling force downwards',
                'It makes the water disappear',
                'It increases the weight of the bucket',
                'It makes the rope longer',
              ],
              te: [
                'లాగే బలాన్ని కింది దిశకు మారుస్తుంది (శరీర బరువు సహాయపడుతుంది)',
                'నీరు లేకుండా చేస్తుంది',
                'బకెట్ బరువును పెంచుతుంది',
                'తాడును పెద్దది చేస్తుంది',
              ],
              hi: [
                'यह बल की दिशा को नीचे की ओर बदल देती है (शरीर का वजन मदद करता है)',
                'बाल्टी का वजन बढ़ा देती है',
                'पानी कम कर देती है',
                'रस्सी को लम्बा कर देती है',
              ],
            },
            correctIndex: 0,
            explanation: {
              en: 'By changing direction, you pull down using your own body weight instead of fighting gravity straight up.',
              te: 'కప్పీ బలం యొక్క దిశను మారుస్తుంది. గురుత్వాకర్షణకు వ్యతిరేకంగా నేరుగా పైకి ఎత్తడం కంటే కిందికి లాగడం చాలా తేలిక.',
              hi: 'घिरनी दिशा बदलकर आपको नीचे खींचने देती है, जिससे शरीर का भार काम आता है।',
            },
            ruralAnalogy: {
              en: 'Like stepping on a seesaw to raise the other side!',
              te: 'సీ-సా ఆటలో మనం కిందకు వంగితే ఎదుటివారు పైకి లేచినట్లు!',
              hi: 'जैसे सी-सॉ झूले पर नीचे बैठने से दूसरा सिरा ऊपर उठ जाता है!',
            },
            hint: {
              en: 'Think about pulling downwards versus lifting straight upwards!',
              te: 'పైకి ఎత్తడం సులభమా? కిందికి లాగడం సులభమా?',
              hi: 'सोचें: नीचे खींचना आसान है या ऊपर उठाना?',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'english',
    title: {
      en: 'English Vocabulary',
      te: 'ఆంగ్ల భాషా నైపుణ్యాలు',
      hi: 'अंग्रेज़ी भाषा कौशल',
    },
    description: {
      en: 'Action verbs, sentence construction, daily routines, village stories.',
      te: 'క్రియలు (Verbs), వాక్య నిర్మాణం, దినచర్య మరియు గ్రామ కథలు.',
      hi: 'क्रिया (Verbs), वाक्य रचना, दैनिक दिनचर्या और कहानियाँ।',
    },
    icon: 'BookOpen',
    color: 'from-blue-500 to-indigo-700',
    accentBg: 'bg-blue-500/10 text-blue-700 border-blue-200',
    lessons: [
      {
        id: 'eng-1-verbs',
        subjectId: 'english',
        grade: 6,
        durationMinutes: 7,
        xpReward: 110,
        coinReward: 20,
        sizeKb: 390,
        icon: 'Sparkles',
        title: {
          en: 'Action Words (Verbs) in Village Life',
          te: 'పనిని తెలిపే పదాలు (Verbs)',
          hi: 'गाँव की क्रियाएँ (Action Verbs)',
        },
        subtitle: {
          en: 'Learn doing words: harvest, sow, run, read, water, and draw.',
          te: 'కోయడం, విత్తడం, పరుగెత్తడం, చదవడం వంటి క్రియా పదాలను నేర్చుకోండి.',
          hi: 'दौड़ना, पढ़ना, फसल काटना, पानी देना जैसी क्रियाओं को अंग्रेज़ी में सीखें।',
        },
        concepts: [
          {
            heading: {
              en: 'What is a Verb?',
              te: 'క్రియ (Verb) అంటే ఏమిటి?',
              hi: 'क्रिया (Verb) क्या है?',
            },
            content: {
              en: 'A verb is an action word that tells what a person, animal, or thing is doing.',
              te: 'వ్యక్తి, జంతువు లేదా వస్తువు చేసే పనిని తెలిపే పదాన్ని Verb (క్రియ) అంటారు.',
              hi: 'क्रिया वह शब्द है जो किसी काम के करने या होने को दर्शाता है।',
            },
            villageAnalogy: {
              en: 'When a farmer "plows" the field, birds "fly" in the sky, or students "sing" the prayer at assembly—plow, fly, and sing are verbs!',
              te: 'రైతు పొలం "దున్నుతాడు" (plows), పక్షులు "ఎగురుతాయి" (fly), పిల్లలు ప్రార్థన "చేస్తారు" (sing)—ఇవన్నీ క్రియలే!',
              hi: 'किसान खेत "जोतता है" (plows), चिड़िया "उड़ती है" (flies), बच्चे प्रार्थना "गाते हैं" (sing)—ये सब क्रियाएँ हैं!',
            },
            simulationType: 'verbs',
          },
        ],
        quiz: [
          {
            id: 'q-v-1',
            question: {
              en: 'Find the Action Verb in this sentence: "The farmers harvest the ripe golden paddy."',
              te: '"The farmers harvest the ripe golden paddy" వాక్యంలో Verb (క్రియ) ఏది?',
              hi: '"The farmers harvest the ripe golden paddy" वाक्य में क्रिया (Verb) कौन सी है?',
            },
            options: {
              en: ['harvest (కోయడం / काटना)', 'farmers (రైతులు / किसान)', 'paddy (వరి / धान)', 'golden (బంగారు / सुनहरा)'],
              te: ['harvest (పంట కోయడం)', 'farmers (రైతులు)', 'paddy (వరి ధాన్యం)', 'golden (బంగారు రంగు)'],
              hi: ['harvest (फसल काटना)', 'farmers (किसान)', 'paddy (धान)', 'golden (सुनहरा)'],
            },
            correctIndex: 0,
            explanation: {
              en: '"harvest" is the action being performed by the farmers.',
              te: '"harvest" అనేది రైతులు చేస్తున్న పనిని (కోత) సూచిస్తుంది, కాబట్టి ఇది Verb.',
              hi: '"harvest" एक क्रिया है जो किसानों द्वारा किया जाने वाला काम दर्शाती है।',
            },
            ruralAnalogy: {
              en: 'Harvesting during festival season is a lively physical action!',
              te: 'సంక్రాంతి సమయంలో కోతలు కోయడం శారీరక శ్రమతో కూడిన పని!',
              hi: 'फसल की कटाई एक मुख्य शारीरिक काम है!',
            },
            hint: {
              en: 'Look for the word showing WHAT they are doing!',
              te: 'వారు ఏమి చేస్తున్నారు అనే పనిని వెతకండి!',
              hi: 'खोजें कि किसान क्या कर रहे हैं!',
            },
          },
        ],
      },
    ],
  },
];

export const BADGES: Badge[] = [
  {
    id: 'first_step',
    title: {
      en: 'First Step to Wisdom',
      te: 'జ్ఞాన ప్రవేశం',
      hi: 'ज्ञान का पहला कदम',
    },
    description: {
      en: 'Completed your very first lesson on VidyaSetu!',
      te: 'విద్యాసేతులో మొదటి పాఠాన్ని విజయవంతంగా పూర్తి చేశారు!',
      hi: 'विद्यासेतु पर अपना पहला पाठ सफलतापूर्वक पूरा किया!',
    },
    icon: 'Award',
    category: 'general',
    requirement: 'Complete 1 lesson',
  },
  {
    id: 'math_magician',
    title: {
      en: 'Math Magician',
      te: 'గణిత మేధావి',
      hi: 'गणित के जादूगर',
    },
    description: {
      en: 'Scored 100% on the Fractions & Chapati quiz!',
      te: 'భిన్నాల క్విజ్‌లో నూటికి నూరు శాతం మార్కులు సాధించారు!',
      hi: 'भिन्न के क्विज़ में पूरे 100% अंक प्राप्त किए!',
    },
    icon: 'Calculator',
    category: 'math',
    requirement: '100% on Math quiz',
  },
  {
    id: 'green_scientist',
    title: {
      en: 'Leaf Detective',
      te: 'వృక్ష పరిశోధకుడు',
      hi: 'पत्तियों के जासूस',
    },
    description: {
      en: 'Mastered Photosynthesis and plant biology.',
      te: 'కిరణజన్య సంయోగక్రియను సులభంగా అర్థం చేసుకున్నారు.',
      hi: 'प्रकाश संश्लेषण और पौधों के विज्ञान को समझा।',
    },
    icon: 'Leaf',
    category: 'science',
    requirement: 'Complete Photosynthesis',
  },
  {
    id: 'streak_sun',
    title: {
      en: '7-Day Solar Streak',
      te: 'సూర్య క్రమశిక్షణ (7 రోజులు)',
      hi: '7-दिवसीय सूर्य स्ट्रीक',
    },
    description: {
      en: 'Learned continuously for 7 days without missing!',
      te: 'వరుసగా 7 రోజులు క్రమం తప్పకుండా చదువుకున్నారు!',
      hi: 'बिना चूके लगातार 7 दिन पढ़ाई की!',
    },
    icon: 'Flame',
    category: 'streak',
    requirement: 'Maintain 7-day streak',
  },
  {
    id: 'offline_champion',
    title: {
      en: 'Offline Hero',
      te: 'ఆఫ్‌లైన్ ఛాంపియన్',
      hi: 'ऑफलाइन चैंपियन',
    },
    description: {
      en: 'Downloaded 2 complete lesson packs for studying without internet.',
      te: 'నెట్‌వర్క్ లేకపోయినా చదువుకోవడానికి 2 పాఠాల ప్యాక్‌లు భద్రపరిచారు.',
      hi: 'बिना इंटरनेट पढ़ने के लिए 2 पाठ स्थानीय रूप से डाउनलोड किए।',
    },
    icon: 'HardDriveDownload',
    category: 'offline',
    requirement: 'Save 2 lessons offline',
  },
  {
    id: 'curious_mind',
    title: {
      en: 'Curious Questioner',
      te: 'జిజ్ఞాస గల విద్యార్థి',
      hi: 'जिज्ञासु शिक्षार्थी',
    },
    description: {
      en: 'Asked 3 village-analogy doubts to Vidya Mitra AI.',
      te: 'విద్యా మిత్రను 3 సందేహాలు అడిగి సమాధానాలు తెలుసుకున్నారు.',
      hi: 'विद्या मित्र AI से 3 सवाल पूछकर नई बातें सीखीं।',
    },
    icon: 'HelpCircle',
    category: 'general',
    requirement: 'Ask 3 doubts',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 's-1',
    name: 'Priya K.',
    schoolName: 'Z.P. High School, Ramapuram',
    villageName: 'Ramapuram',
    xp: 840,
    coins: 165,
    streakDays: 8,
    avatar: '👧🏽',
    badgesCount: 5,
  },
  {
    id: 's-2',
    name: 'Raju M. (You)',
    schoolName: 'Z.P. High School, Ramapuram',
    villageName: 'Ramapuram',
    xp: 680,
    coins: 140,
    streakDays: 5,
    avatar: '👦🏽',
    badgesCount: 4,
  },
  {
    id: 's-3',
    name: 'Sai Varun',
    schoolName: 'Z.P. High School, Ramapuram',
    villageName: 'Gollapalli',
    xp: 620,
    coins: 120,
    streakDays: 6,
    avatar: '🧒🏽',
    badgesCount: 3,
  },
  {
    id: 's-4',
    name: 'Ananya Sharma',
    schoolName: 'Government Model School',
    villageName: 'Kothur',
    xp: 590,
    coins: 115,
    streakDays: 4,
    avatar: '👧🏾',
    badgesCount: 3,
  },
  {
    id: 's-5',
    name: 'Kiran Reddy',
    schoolName: 'Z.P. High School, Ramapuram',
    villageName: 'Ramapuram',
    xp: 510,
    coins: 95,
    streakDays: 3,
    avatar: '👦🏾',
    badgesCount: 2,
  },
  {
    id: 's-6',
    name: 'Kavitha M.',
    schoolName: 'Z.P. High School, Ramapuram',
    villageName: 'Peddapalli',
    xp: 380,
    coins: 60,
    streakDays: 2,
    avatar: '👧🏽',
    badgesCount: 1,
  },
];

export const INITIAL_STRUGGLING_STUDENTS: StrugglingStudent[] = [
  {
    id: 'st-1',
    name: 'Kavitha M.',
    avatar: '👧🏽',
    villageName: 'Peddapalli',
    riskLevel: 'high',
    weakTopics: ['Fractions (Math)', 'Plant Cells (Science)'],
    averageScore: 44,
    attendanceRate: 72,
    doubtsLogged: 7,
  },
  {
    id: 'st-2',
    name: 'Mahesh B.',
    avatar: '👦🏾',
    villageName: 'Gollapalli',
    riskLevel: 'high',
    weakTopics: ['Fractions (Math)', 'Action Verbs (English)'],
    averageScore: 48,
    attendanceRate: 68,
    doubtsLogged: 6,
  },
  {
    id: 'st-3',
    name: 'Suma R.',
    avatar: '👧🏾',
    villageName: 'Ramapuram',
    riskLevel: 'medium',
    weakTopics: ['Photosynthesis (Science)'],
    averageScore: 58,
    attendanceRate: 85,
    doubtsLogged: 4,
  },
  {
    id: 'st-4',
    name: 'Naresh T.',
    avatar: '👦🏽',
    villageName: 'Kothur',
    riskLevel: 'medium',
    weakTopics: ['Decimals & Currency (Math)'],
    averageScore: 62,
    attendanceRate: 88,
    doubtsLogged: 3,
  },
];

export const TOPIC_DOUBT_METRICS: TopicDoubtMetric[] = [
  {
    topic: 'Fractions: Numerator & Denominator',
    subject: 'Mathematics',
    doubtCount: 18,
    averageScore: 52,
    strugglingCount: 8,
    reteachRecommended: true,
    ruralMaterialSuggestion: 'Cut circular clay cakes or divide 12 dried tamarind seeds into groups.',
  },
  {
    topic: 'Photosynthesis & Gas Exchange (CO2/O2)',
    subject: 'Science',
    doubtCount: 14,
    averageScore: 58,
    strugglingCount: 6,
    reteachRecommended: true,
    ruralMaterialSuggestion: 'Submerge a fresh green leaf in a glass bowl of water in sunlight to observe oxygen bubbles.',
  },
  {
    topic: 'Action Verbs & Past Tense',
    subject: 'English',
    doubtCount: 11,
    averageScore: 64,
    strugglingCount: 4,
    reteachRecommended: false,
    ruralMaterialSuggestion: 'Charades game: Student acts out farming actions (plowing, watering, carrying).',
  },
  {
    topic: 'Simple Machines: Well Pulley & Force',
    subject: 'Science',
    doubtCount: 5,
    averageScore: 78,
    strugglingCount: 2,
    reteachRecommended: false,
    ruralMaterialSuggestion: 'Hang a thread spool from a wooden bar to simulate a grooved pulley.',
  },
];
