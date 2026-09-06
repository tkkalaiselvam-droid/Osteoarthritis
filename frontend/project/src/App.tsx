import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Bluetooth,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Cloud,
  Download,
  Eraser,
  FileText,
  HeartPulse,
  Home,
  Languages,
  LockKeyhole,
  MapPin,
  Menu,
  MoreHorizontal,
  Network,
  PenLine,
  Play,
  RefreshCw,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  WifiOff,
  Zap,
} from 'lucide-react';

type Screen = 'login' | 'dashboard' | 'register' | 'consent' | 'questionnaire' | 'sensor' | 'gait' | 'review' | 'result' | 'pdf' | 'sync';
type Lang = 'en' | 'hi';
type SyncStatus = 'synced' | 'pending' | 'failed';
type Risk = 'Low' | 'Moderate' | 'High';

type Patient = {
  id: string;
  name: string;
  age: number;
  area: string;
  status: 'Registered' | 'Screening in progress' | 'Completed' | 'Referred';
  risk: Risk;
  score: number;
  synced: SyncStatus;
  date: string;
};

const ui: Record<Lang, Record<string, string>> = {
  en: {
    appTitle: 'OsteoScreen Mobile',
    appSubtitle: 'Community knee screening',
    loginTitle: 'Sign in to begin',
    loginBody: 'Use your ASHA worker ID to access today’s screening camp.',
    ashaId: 'ASHA worker ID',
    pin: '4-digit PIN',
    login: 'Sign in securely',
    loginFooter: 'Works offline. Your records stay on this device until sync.',
    language: 'Language',
    online: 'Online',
    offline: 'Offline',
    dashboard: 'Dashboard',
    home: 'Home',
    sync: 'Sync',
    syncCenter: 'Sync center',
    newPatient: 'New patient screening',
    registerPatient: 'Register patient',
    campSettings: 'Camp settings',
    goodMorning: 'Good morning, Nabanita',
    campReady: 'Ready for today’s community screening camp?',
    todayFocus: 'Today’s focus',
    heroTitle: 'Move with confidence.',
    heroBody: 'Screen earlier. Refer with clarity. Every conversation helps a knee move better.',
    campOverview: 'Camp overview',
    atAGlance: 'At a glance',
    openSyncCenter: 'Open sync center',
    screeningsToday: 'Screenings today',
    highRiskFlags: 'High risk flags',
    pendingSync: 'Pending sync',
    fromYesterday: '+3 from yesterday',
    needsReferral: 'Needs referral',
    onThisDevice: 'On this device',
    recentPatients: 'Recent patients',
    campDirectory: 'Camp directory',
    patientLabel: 'Patient',
    statusLabel: 'Status',
    riskLabel: 'Risk',
    syncLabel: 'Sync',
    patientName: 'Patient name',
    enterName: 'Enter full name',
    age: 'Age',
    gender: 'Gender',
    female: 'Female',
    male: 'Male',
    other: 'Other',
    phone: 'Phone number',
    phonePlaceholder: '10-digit phone',
    district: 'District',
    state: 'State',
    consent: 'Consent',
    patientRegistration: 'Patient registration',
    regIntro: 'Keep it simple. You can add details later if needed.',
    offlineSafe: 'Offline safe',
    offlineSafeNote: 'This record will be saved on this device and synced when connectivity returns.',
    saveContinue: 'Save & continue',
    consentTitle: 'Before we begin',
    consentBody: 'Explain that this is a simple knee health screening, not a diagnosis. The patient can stop at any time.',
    consentItem1: 'Non-invasive and takes about 8 minutes',
    consentItem2: 'Results are shared with the patient',
    consentItem3: 'Data stays on this device until synced',
    consentCheck: 'I have explained the screening and the patient has given consent.',
    dpdpConsent: 'DPDP Act consent',
    dpdpBody: 'Under the Digital Personal Data Protection Act, the patient’s data will be collected for screening purposes only. Please sign below to record consent.',
    signaturePad: 'Signature pad',
    signHere: 'Sign here',
    clear: 'Clear',
    signed: 'Signed',
    startScreening: 'Start screening',
    questionnaire: 'Questionnaire',
    howKnee: 'How is your knee feeling?',
    askEach: 'Ask each question in the patient’s preferred language.',
    answered: 'answered',
    subtotal: 'Subtotal',
    next: 'Next',
    back: 'Back',
    sensor: 'Knee sensor',
    sensorConnected: 'Sensor connected',
    sensorPlace: 'Place the strap near the knee',
    sensorConnectedBody: 'Signal is strong. We are ready to read both knees.',
    sensorScanBody: 'Turn on the knee strap and keep the phone within arm’s reach.',
    connect: 'Connect device',
    continue: 'Continue',
    retryScan: 'Retry scan',
    scanning: 'Scanning for nearby sensor...',
    battery: 'Battery',
    signal: 'Signal excellent',
    liveAngle: 'Live knee angle',
    leftKnee: 'Left knee',
    rightKnee: 'Right knee',
    flexion: 'Flexion',
    extension: 'Extension',
    gait: 'Gait capture',
    placePhone: 'Place phone here',
    recording: 'Recording',
    captureComplete: 'Capture complete',
    walkToward: 'Walk toward the phone',
    walkBody: 'Take 5 comfortable steps. Bend your knee fully, then straighten.',
    startRecording: 'Start recording',
    finishRecording: 'Finish recording',
    continueReview: 'Continue to review',
    needHelp: 'Need help?',
    gaitSpeed: 'Gait speed',
    cadence: 'Cadence',
    sitToStand: 'Sit-to-stand',
    normal: 'Normal',
    watch: 'Watch',
    review: 'Review',
    readyInference: 'Ready for local inference',
    checkDetails: 'Check the details once',
    editable: 'Everything stays editable until you submit.',
    edit: 'Edit',
    preview: 'Preview',
    estimatedTier: 'Estimated screening tier',
    runInference: 'Run screening inference',
    result: 'Risk result',
    screeningComplete: 'Screening complete · Just now',
    oaRiskScore: 'OA risk score',
    riskTier: 'risk tier',
    resultBody: 'The screening suggests signs that deserve a closer look. Share the advice below and consider referral.',
    explainability: 'Explainability',
    whatShaped: 'What shaped this result?',
    factorPain: 'Pain during walking',
    factorFlexion: 'Knee flexion range',
    factorSitStand: 'Sit-to-stand duration',
    clinicalReferral: 'Clinical referral',
    referTo: 'Refer to PHC–KMR-04',
    priorityUrgent: 'Priority: URGENT · Bring this report',
    todaysAdvice: 'Today’s advice',
    advice1: 'Use a warm compress for 10 minutes',
    advice2: 'Avoid deep squats and low seating',
    advice3: 'Walk gently for 15 minutes, if comfortable',
    generate: 'Generate PDF report',
    saveReturn: 'Save & return to dashboard',
    backToResult: 'Back to result',
    save: 'Save',
    share: 'Share',
    screeningReport: 'SCREENING REPORT',
    patientReport: 'Patient report',
    years: 'years',
    summary: 'Summary',
    riskTierLabel: 'Risk tier',
    questionnaireLabel: 'Questionnaire',
    captured: 'Captured',
    recommendation: 'Recommendation',
    referToPdf: 'Refer to PHC–KMR-04',
    pdfBody: 'Priority: URGENT. Please carry this report for the care team.',
    preventiveAdvice: 'Preventive advice',
    advice1Pdf: 'Use a warm compress for 10 minutes.',
    advice2Pdf: 'Avoid deep squats and low seating.',
    advice3Pdf: 'Walk gently for 15 minutes, if comfortable.',
    generatedOn: 'Generated on device · ASHA-NE-042',
    page: 'Page 1 of 1',
    dataManagement: 'Data management',
    syncCenterTitle: 'Sync center',
    syncBody: 'Your records are safe here. Sync is always background and non-blocking.',
    localQueue: 'Local queue',
    recordsWaiting: 'records waiting',
    allUpToDate: 'Everything is up to date',
    connectionGood: 'Connection looks good. You can sync now.',
    offlineWait: 'You are offline. Records will wait on this device.',
    networkStatus: 'Network status',
    onlineStable: 'Online · stable connection',
    offlinePaused: 'Offline · sync paused',
    forceSync: 'Force sync all',
    syncing: 'Syncing records...',
    privateQueue: 'Private on-device queue',
    privateBody: 'Only the minimum screening data is held locally. It leaves this device when you choose to sync.',
    synced: 'Synced',
    pending: 'Pending',
    failed: 'Failed',
    patients: 'Patients',
    more: 'More',
    step: 'Step',
    of: 'of',
    register: 'Register',
    assess: 'Assess',
    capture: 'Capture',
    reviewStep: 'Review',
    consentRecorded: 'Consent recorded',
    needConsent: 'Please record patient consent',
    gaitDone: 'Gait capture complete',
    newPatientRecord: 'New patient',
    yrs: 'yrs',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    registered: 'Registered',
    screeningProgress: 'Screening in progress',
    completed: 'Completed',
    referred: 'Referred',
    justNow: 'Just now',
    ashaToolkit: 'ASHA field toolkit',
    communityHealth: 'COMMUNITY HEALTH',
    buildLabel: 'OsteoScreen Mobile · prototype v0.8',
    bothKnees: 'Both knees · captured',
    metricsReady: '3 metrics ready',
    skipped: 'Skipped',
    patientCol: 'Patient',
    newPatientShort: 'New patient',
    woman: 'Woman',
    man: 'Man',
    selectDistrict: 'Select district',
    selectState: 'Select state',
    assam: 'Assam',
    meghalaya: 'Meghalaya',
    tripura: 'Tripura',
    kamrup: 'Kamrup Metropolitan',
    guwahati: 'Guwahati',
    dispur: 'Dispur',
    jalukbari: 'Jalukbari',
    none: 'None',
    mild: 'Mild',
    severe: 'Severe',
    extreme: 'Extreme',
    painWalking: 'Pain during walking',
    painStairs: 'Pain on stairs',
    morningStiff: 'Morning stiffness',
    jointGrind: 'Joint grinding feeling',
    sitStandDiff: 'Difficulty rising from sit-to-stand',
    degree: '°',
    flex: 'Flex',
    ext: 'Ext',
  },
  hi: {
    appTitle: 'ऑस्टियोस्क्रीन मोबाइल',
    appSubtitle: 'सामुदायिक घुटना जांच',
    loginTitle: 'शुरू करने के लिए साइन इन करें',
    loginBody: 'आज के जांच शिविर के लिए अपना आशा कार्यकर्ता आईडी उपयोग करें।',
    ashaId: 'आशा कार्यकर्ता आईडी',
    pin: '4 अंकों का पिन',
    login: 'सुरक्षित साइन इन',
    loginFooter: 'ऑफलाइन काम करता है। सिंक होने तक आपके रिकॉर्ड इस डिवाइस पर रहते हैं।',
    language: 'भाषा',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    dashboard: 'डैशबोर्ड',
    home: 'होम',
    sync: 'सिंक',
    syncCenter: 'सिंक केंद्र',
    newPatient: 'नए मरीज की जांच',
    registerPatient: 'मरीज पंजीकृत करें',
    campSettings: 'शिविर सेटिंग्स',
    goodMorning: 'शुभ प्रभात, नबनिता',
    campReady: 'आज के सामुदायिक जांच शिविर के लिए तैयार?',
    todayFocus: 'आज का ध्यान',
    heroTitle: 'आत्मविश्वास के साथ चलें।',
    heroBody: 'जल्दी जांच करें। स्पष्टता के साथ रेफर करें। हर वार्तालाप किसी के घुटने को बेहतर चलने में मदद करता है।',
    campOverview: 'शिविर कुल सार',
    atAGlance: 'एक नजर में',
    openSyncCenter: 'सिंक केंद्र खोलें',
    screeningsToday: 'आज की जांच',
    highRiskFlags: 'उच्च जोखिम चिन्ह',
    pendingSync: 'लंबित सिंक',
    fromYesterday: 'कल से +3',
    needsReferral: 'रेफर चाहिए',
    onThisDevice: 'इस डिवाइस पर',
    recentPatients: 'हाल के मरीज',
    campDirectory: 'शिविर निर्देशिका',
    patientLabel: 'मरीज',
    statusLabel: 'स्थिति',
    riskLabel: 'जोखिम',
    syncLabel: 'सिंक',
    patientName: 'मरीज का नाम',
    enterName: 'पूरा नाम दर्स करें',
    age: 'उम्र',
    gender: 'लिंग',
    female: 'महिला',
    male: 'पुरुष',
    other: 'अन्य',
    phone: 'फोन नंबर',
    phonePlaceholder: '10-अंक फोन',
    district: 'जिला',
    state: 'राज्य',
    consent: 'सहमति',
    patientRegistration: 'मरीज पंजीकरण',
    regIntro: 'इसे सरल रखें। आप बाद में विवरण जोड़ सकते हैं।',
    offlineSafe: 'ऑफलाइन सुरक्षित',
    offlineSafeNote: 'यह रिकॉर्ड इस डिवाइस पर सहेजा जाएगा और कनेक्टिविटी लौटने पर सिंक हो जाएगा।',
    saveContinue: 'सहेजें और आगे बढ़ें',
    consentTitle: 'शुरू करने से पहले',
    consentBody: 'समझाएं कि यह एक सरल घुटना स्वास्थ्य जांच है, निर्णय नहीं। मरीज किसी भी समय रुक सकता है।',
    consentItem1: 'गैर-वास्तव और लगभग 8 मिनट में होता है',
    consentItem2: 'परिणाम मरीज के साथ साझा जाता है',
    consentItem3: 'सिंक होने तक डेटा इस डिवाइस पर रहता है',
    consentCheck: 'मैंने जांच की व्याख्या की है और मरीज ने सहमति दी है।',
    dpdpConsent: 'डीपीडीपी अधिनियम सहमति',
    dpdpBody: 'डिजिटल पर्सनल डेटा सुरक्षा अधिनियम के तहत, मरीज का डेटा केवल जांच प्रयोजनों के लिए जमा किया जाएगा। कृपया सहमति दर्स करने के लिए नीचे हस्ताक्षर करें।',
    signaturePad: 'हस्ताक्षर पैड',
    signHere: 'यहाँ हस्ताक्षर करें',
    clear: 'साफ़ करें',
    signed: 'हस्ताक्षरित',
    startScreening: 'जांच शुरू करें',
    questionnaire: 'प्रश्नावली',
    howKnee: 'आपके घुटने की कैसी स्थिति है?',
    askEach: 'प्रत्येक प्रश्न मरीज की पसंदीदा भाषा में पूछें।',
    answered: 'उत्तर दिए',
    subtotal: 'कुल योग',
    next: 'आगे',
    back: 'पीछे',
    sensor: 'घुटना सेंसर',
    sensorConnected: 'सेंसर जुड़ा',
    sensorPlace: 'पट्टी को घुटने के पास रखें',
    sensorConnectedBody: 'सिग्नल मजबूत है। हम दोनों घुटनों को पढ़ने के लिए तैयार हैं।',
    sensorScanBody: 'घुटना पट्टी ऑन करें और फोन को हाथ की पहुंच में रखें।',
    connect: 'डिवाइस कनेक्ट करें',
    continue: 'आगे बढ़ें',
    retryScan: 'स्कैन पुनः प्रयास',
    scanning: 'नजदीकि सेंसर की तलाश हो रही है...',
    battery: 'बैटरी',
    signal: 'सिग्नल उत्तम',
    liveAngle: 'लाइव घुटना कोण',
    leftKnee: 'बांदा घुटना',
    rightKnee: 'दाएँ घुटना',
    flexion: 'मोड़',
    extension: 'फैलाव',
    gait: 'चलने की जांच',
    placePhone: 'फोन यहाँ रखें',
    recording: 'रिकॉर्डिंग',
    captureComplete: 'कैप्चर पूरा',
    walkToward: 'फोन की ओर चलें',
    walkBody: '5 आरामदायक कदम उठाएं। अपने घुटने को पूरी मोड़ें, फिर सीधा करें।',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    finishRecording: 'रिकॉर्डिंग समाप्त',
    continueReview: 'समीक्षा में आगे',
    needHelp: 'मदद चाहिए?',
    gaitSpeed: 'चाल गति',
    cadence: 'कैडेंस',
    sitToStand: 'बैठे से उठना',
    normal: 'सामान्य',
    watch: 'ध्यान',
    review: 'समीक्षा',
    readyInference: 'स्थानीय अनुमान के लिए तैयार',
    checkDetails: 'विवरणों की एक बार जाँच करें',
    editable: 'जब तक आप सबमिट नहीं करते, वह संपादनीय रहता है।',
    edit: 'संपादन',
    preview: 'पूर्वावलोकन',
    estimatedTier: 'अनुमानित जांच श्रेणी',
    runInference: 'जांच अनुमान चलाएं',
    result: 'जोखिम परिणाम',
    screeningComplete: 'जांच पूरी · अभी',
    oaRiskScore: 'ओव् ए जोखिम स्कोर',
    riskTier: 'जोखिम श्रेणी',
    resultBody: 'जांच ने ऐसे संकेत दिखाए हैं जिन्हें गहरा देखना चाहिए। नीचे की सलाह साझा करें और रेफर पर विचार करें।',
    explainability: 'व्याख्याता',
    whatShaped: 'इस परिणाम को किसने आकार दिया?',
    factorPain: 'चलते समय दर्द',
    factorFlexion: 'घुटना मोड़ रेंज',
    factorSitStand: 'बैठे से उठने का समय',
    clinicalReferral: 'चिकित्सीय रेफर',
    referTo: 'PHC–KMR-04 को रेफर करें',
    priorityUrgent: 'प्राथमिकता: अत्यन्त · यह रिपोर्ट लाएं',
    todaysAdvice: 'आज की सलाह',
    advice1: '10 मिनट के लिए गर्म सुंडी लगाएं',
    advice2: 'गहरे बैठक और नीचे सीट से बचें',
    advice3: 'आरामदायक हो तो 15 मिनट धीरे-धीरे चलें',
    generate: 'पीडीएफ रिपोर्ट बनाएं',
    saveReturn: 'सहेजें और डैशबोर्ड पर लौटें',
    backToResult: 'परिणाम पर वापस',
    save: 'सहेजें',
    share: 'साझा करें',
    screeningReport: 'जांच रिपोर्ट',
    patientReport: 'मरीज रिपोर्ट',
    years: 'वर्ष',
    summary: 'सारांश',
    riskTierLabel: 'जोखिम श्रेणी',
    questionnaireLabel: 'प्रश्नावली',
    captured: 'कैप्चर किया',
    recommendation: 'अनुशीरणा',
    referToPdf: 'PHC–KMR-04 को रेफर करें',
    pdfBody: 'प्राथमिकता: अत्यन्त। कृपया देखभाल टीम के लिए यह रिपोर्ट लाएं।',
    preventiveAdvice: 'रोकथाम सलाह',
    advice1Pdf: '10 मिनट के लिए गर्म सुंडी लगाएं।',
    advice2Pdf: 'गहरे बैठक और नीचे सीट से बचें।',
    advice3Pdf: 'आरामदायक हो तो 15 मिनट धीरे-धीरे चलें।',
    generatedOn: 'डिवाइस पर बनाए गए · ASHA-NE-042',
    page: 'पृष्ठ 1 of 1',
    dataManagement: 'डेटा प्रबंधन',
    syncCenterTitle: 'सिंक केंद्र',
    syncBody: 'आपके रिकॉर्ड यहाँ सुरक्षित हैं। सिंक हमेशा पृष्ठभूमि और नॉन-ब्लॉकिंग है।',
    localQueue: 'स्थानीय कतार',
    recordsWaiting: 'रिकॉर्ड लंबित',
    allUpToDate: 'सब अपडेट है',
    connectionGood: 'कनेक्शन अच्छा है। आप अब सिंक कर सकते हैं।',
    offlineWait: 'आप ऑफलाइन हैं। रिकॉर्ड इस डिवाइस पर रुकेंगे।',
    networkStatus: 'नेटवर्क स्थिति',
    onlineStable: 'ऑनलाइन · स्थिर कनेक्शन',
    offlinePaused: 'ऑफलाइन · सिंक रोका',
    forceSync: 'सभी को सिंक करें',
    syncing: 'रिकॉर्ड सिंक हो रहे हैं...',
    privateQueue: 'निजी डिवाइस कतार',
    privateBody: 'केवल न्यूनतम जांच डेटा स्थानीय रूप से रखा जाता है। जब आप सिंक करते हैं तब यह इस डिवाइस से बाहर जाता है।',
    synced: 'सिंक्ड',
    pending: 'लंबित',
    failed: 'विफल',
    patients: 'मरीज',
    more: 'अधिक',
    step: 'चरण',
    of: 'में से',
    register: 'पंजीकरण',
    assess: 'मूल्यांकन',
    capture: 'कैप्चर',
    reviewStep: 'समीक्षा',
    consentRecorded: 'सहमति दर्स',
    needConsent: 'कृपया मरीज की सहमति दर्स करें',
    gaitDone: 'गेट कैप्चर पूरा',
    newPatientRecord: 'नए मरीज',
    yrs: 'वर्ष',
    low: 'कम',
    moderate: 'मध्यम',
    high: 'उच्च',
    registered: 'पंजीकृत',
    screeningProgress: 'जांच चल रहा',
    completed: 'पूर्ण',
    referred: 'रेफर',
    justNow: 'अभी',
    ashaToolkit: 'आशा क्षेत्र टूलकिट',
    communityHealth: 'सामुदायिक स्वास्थ्य',
    buildLabel: 'ऑस्टियोस्क्रीन मोबाइल · प्रोटोटाइप v0.8',
    bothKnees: 'दोनों घुटनों · कैप्चर किया',
    metricsReady: '3 मेट्रिक्स तैयार',
    skipped: 'छोड़ा',
    patientCol: 'मरीज',
    newPatientShort: 'नए मरीज',
    woman: 'महिला',
    man: 'पुरुष',
    selectDistrict: 'जिला चुनें',
    selectState: 'राज्य चुनें',
    assam: 'असम',
    meghalaya: 'मेघालय',
    tripura: 'त्रिपुरा',
    kamrup: 'कामरूप मेट्रोपलिटन',
    guwahati: 'गुवाहाटी',
    dispur: 'दिसपुर',
    jalukbari: 'जलुकबारी',
    none: 'कोई नहीं',
    mild: 'हल्का',
    severe: 'गंभीर',
    extreme: 'अत्यंत',
    painWalking: 'चलते समय दर्द',
    painStairs: 'सीढ़ियों पर दर्द',
    morningStiff: 'सुबह की अठानपन',
    jointGrind: 'जोड़ घसारे का अहसास',
    sitStandDiff: 'बैठे से उठने में कष्टता',
    degree: '°',
    flex: 'मोड़',
    ext: 'फैलाव',
  },
};

const initialPatients: Patient[] = [
  { id: 'P-2408', name: 'Jahnu Barua', age: 62, area: 'Kamrup Metropolitan', status: 'Referred', risk: 'High', score: 78, synced: 'pending', date: 'Today, 10:42 AM' },
  { id: 'P-2407', name: 'Mina Das', age: 55, area: 'Guwahati', status: 'Completed', risk: 'Moderate', score: 54, synced: 'synced', date: 'Today, 09:18 AM' },
  { id: 'P-2406', name: 'Ranjit Kalita', age: 47, area: 'Dispur', status: 'Screening in progress', risk: 'Low', score: 24, synced: 'failed', date: 'Yesterday, 04:20 PM' },
  { id: 'P-2405', name: 'Asha Begum', age: 60, area: 'Jalukbari', status: 'Registered', risk: 'Low', score: 12, synced: 'synced', date: 'Yesterday, 02:09 PM' },
];

const questionKeys = ['painWalking', 'painStairs', 'morningStiff', 'jointGrind', 'sitStandDiff'];
const scaleKeys = ['none', 'mild', 'moderate', 'severe', 'extreme'];

function App() {
  const [screen, setScreen] = useState<any>('login');
  const [lang, setLang] = useState<Lang>('en');
  const [patients, setPatients] = useState(initialPatients);
  const [patient, setPatient] = useState({ name: '', age: '62', gender: 'F', phone: '', district: 'Kamrup Metropolitan', state: 'Assam' });
  const [consented, setConsented] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [answers, setAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [kneeAngle, setKneeAngle] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [captureDone, setCaptureDone] = useState(false);
  const [networkOnline, setNetworkOnline] = useState(true);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const t = (key: string) => ui[lang][key] ?? key;
  const subtotal = answers.reduce((sum, value) => sum + value, 0);
  const score = Math.min(94, 28 + subtotal * 3 + (captureDone ? 8 : 0));
  const risk: Risk = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low';
  const syncCount = patients.filter((item) => item.synced !== 'synced').length;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const go = (next: any) => {
    setScreen(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger FastAPI whenever navigating to the report screen
    if (next === 'report' || next === 'results') {
      KneeSenseAPI.submitAssessment(patient.name || "PAT-2026-8831", null, {
        Q_BASE_1: answers[0]?.toString() || "Stiffness",
        Q_BASE_2: answers[1]?.toString() || "Pain during walking",
        Q_AI_CONTEXT_1: answers[2]?.toString() || "Severe stiffness"
      })
      .then((data) => {
        console.log("✅ Live Response from FastAPI:", data);
      })
      .catch((err) => {
        console.error("❌ Submission Error:", err);
      });
    }
  };

  const createPatient = () => {
    const nextPatient: Patient = {
      id: `P-${2409 + patients.length}`,
      name: patient.name || t('newPatientRecord'),
      age: Number(patient.age) || 0,
      area: patient.district,
      status: 'Screening in progress',
      risk: 'Low',
      score: 0,
      synced: networkOnline ? 'synced' : 'pending',
      date: t('justNow'),
    };
    setPatients((current) => [nextPatient, ...current]);
    go('consent');
  };

  const finishCapture = () => {
    setCapturing(false);
    setCaptureDone(true);
    showToast(t('gaitDone'));
  };

  const completeScreening = () => {
    const updated = patients.map((item, index) =>
      index === 0
        ? { ...item, name: patient.name || item.name, status: risk === 'High' ? ('Referred' as const) : ('Completed' as const), risk, score, synced: networkOnline ? ('synced' as const) : ('pending' as const) }
        : item
    );
    setPatients(updated);
    go('result');
  };

  const statusKey = (status: Patient['status']) =>
    status === 'Registered' ? 'registered' : status === 'Screening in progress' ? 'screeningProgress' : status === 'Completed' ? 'completed' : 'referred';
  const riskKey = (r: Risk) => (r === 'Low' ? 'low' : r === 'Moderate' ? 'moderate' : 'high');
  const syncKey = (s: SyncStatus) => (s === 'synced' ? 'synced' : s === 'pending' ? 'pending' : 'failed');

  return (
    <div className="app-shell">
      {screen !== 'login' && (
        <Header lang={lang} setLang={setLang} onMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} onNavigate={go} syncCount={syncCount} networkOnline={networkOnline} t={t} />
      )}
      {screen === 'login' && <LoginScreen lang={lang} setLang={setLang} pin={pin} setPin={setPin} onLogin={() => go('dashboard')} t={t} />}
      {screen === 'dashboard' && <Dashboard patients={patients} onNew={() => go('register')} onSync={() => go('sync')} onPatient={(item) => showToast(`${item.name}`)} t={t} syncCount={syncCount} lang={lang} />}
      {screen === 'register' && <Registration patient={patient} setPatient={setPatient} onBack={() => go('dashboard')} onContinue={createPatient} t={t} lang={lang} />}
      {screen === 'consent' && <Consent consented={consented} setConsented={setConsented} hasSignature={hasSignature} setHasSignature={setHasSignature} onBack={() => go('register')} onContinue={() => (consented && hasSignature ? go('questionnaire') : showToast(t('needConsent')))} t={t} />}
      {screen === 'questionnaire' && <Questionnaire answers={answers} setAnswers={setAnswers} onBack={() => go('consent')} onContinue={() => go('sensor')} t={t} />}
      {screen === 'sensor' && <SensorScreen connected={sensorConnected} setConnected={setSensorConnected} kneeAngle={kneeAngle} setKneeAngle={setKneeAngle} onBack={() => go('questionnaire')} onContinue={() => go('gait')} t={t} />}
      {screen === 'gait' && <GaitScreen capturing={capturing} captureDone={captureDone} setCapturing={setCapturing} onFinish={finishCapture} onBack={() => go('sensor')} onContinue={() => go('review')} t={t} />}
      {screen === 'review' && <ReviewScreen patient={patient} answers={answers} captureDone={captureDone} score={score} risk={risk} onBack={() => go('gait')} onSubmit={completeScreening} t={t} />}
      {screen === 'result' && <ResultScreen score={score} risk={risk} onPdf={() => go('pdf')} onReturn={() => go('dashboard')} t={t} />}
      {screen === 'pdf' && <PdfScreen patient={patient} score={score} risk={risk} onBack={() => go('result')} onReturn={() => go('dashboard')} t={t} />}
      {screen === 'sync' && <SyncScreen patients={patients} setPatients={setPatients} networkOnline={networkOnline} setNetworkOnline={setNetworkOnline} onBack={() => go('dashboard')} t={t} />}
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </div>
  );
}

function Header({ lang, setLang, onMenu, menuOpen, onNavigate, syncCount, networkOnline, t }: { lang: Lang; setLang: (l: Lang) => void; onMenu: () => void; menuOpen: boolean; onNavigate: (s: Screen) => void; syncCount: number; networkOnline: boolean; t: (k: string) => string }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Menu"><Menu size={22} /></button>
      <button className="brand-mark" onClick={() => onNavigate('dashboard')}><Activity size={20} /><span>OsteoScreen</span></button>
      <div className="topbar-actions">
        <span className={`network-pill ${networkOnline ? 'online' : 'offline'}`}><span className="status-dot" />{networkOnline ? t('online') : t('offline')}</span>
        <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="Language"><option value="en">EN</option><option value="hi">हि</option></select>
        <button className="icon-button" onClick={() => onNavigate('sync')} aria-label="Sync"><Cloud size={19} /><span className="notification-dot">{syncCount}</span></button>
        <button className="avatar" onClick={() => onNavigate('dashboard')}>NB</button>
      </div>
      {menuOpen && (
        <div className="mobile-nav">
          <button onClick={() => onNavigate('dashboard')}><Home size={17} />{t('dashboard')}</button>
          <button onClick={() => onNavigate('sync')}><Cloud size={17} />{t('syncCenter')}</button>
          <button onClick={() => onNavigate('register')}><UsersRound size={17} />{t('newPatient')}</button>
        </div>
      )}
    </header>
  );
}

function LoginScreen({ lang, setLang, pin, setPin, onLogin, t }: { lang: Lang; setLang: (l: Lang) => void; pin: string; setPin: (v: string) => void; onLogin: () => void; t: (k: string) => string }) {
  return (
    <main className="login-page">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-tile"><Activity size={29} /></div>
          <span>{t('appTitle')}<small>{t('communityHealth')}</small></span>
        </div>
        <div className="login-copy">
          <span className="eyebrow">{t('ashaToolkit')}</span>
          <h1>{t('loginTitle')}</h1>
          <p>{t('loginBody')}</p>
        </div>
        <div className="language-row">
          <Languages size={16} /><span>{t('language')}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}><option value="en">English</option><option value="hi">हिन्दी</option></select>
        </div>
        <label>{t('ashaId')}<div className="input-with-icon"><UserRound size={18} /><input value="ASHA-NE-042" readOnly /></div></label>
        <label>{t('pin')}<div className="pin-input"><LockKeyhole size={18} />{[0, 1, 2, 3].map((i) => <input key={i} maxLength={1} value={pin[i] || ''} onChange={(e) => setPin(`${pin.slice(0, i)}${e.target.value.replace(/\D/g, '').slice(0, 1)}${pin.slice(i + 1)}`)} />)}</div></label>
        <button className="primary-button full" onClick={onLogin}><ShieldCheck size={18} />{t('login')}<ArrowRight size={18} /></button>
        <div className="login-footer"><WifiOff size={15} />{t('loginFooter')}</div>
      </div>
      <p className="build-label">{t('buildLabel')}</p>
    </main>
  );
}

function ScreenTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className="screen-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{body && <p>{body}</p>}</div>;
}

function Dashboard({ patients, onNew, onSync, onPatient, t, syncCount, lang }: { patients: Patient[]; onNew: () => void; onSync: () => void; onPatient: (p: Patient) => void; t: (k: string) => string; syncCount: number; lang: Lang }) {
  const quickStats = useMemo(() => ({ today: patients.length + 4, highRisk: patients.filter((i) => i.risk === 'High').length }), [patients]);
  const statusKey = (s: Patient['status']) => s === 'Registered' ? 'registered' : s === 'Screening in progress' ? 'screeningProgress' : s === 'Completed' ? 'completed' : 'referred';
  const riskKey = (r: Risk) => r === 'Low' ? 'low' : r === 'Moderate' ? 'moderate' : 'high';
  const syncKey = (s: SyncStatus) => s === 'synced' ? 'synced' : s === 'pending' ? 'pending' : 'failed';
  return (
    <main className="page">
      <div className="page-inner">
        <div className="welcome-row">
          <ScreenTitle eyebrow="Wednesday · 06 Sep 2026" title={t('goodMorning')} body={t('campReady')} />
          <button className="soft-button desktop-only"><Settings size={17} />{t('campSettings')}</button>
        </div>
        <div className="hero-panel">
          <div>
            <span className="eyebrow light">{t('todayFocus')}</span>
            <h2>{t('heroTitle')}</h2>
            <p>{t('heroBody')}</p>
            <button className="primary-button" onClick={onNew}><UsersRound size={18} />{t('newPatient')}<ArrowRight size={18} /></button>
          </div>
          <div className="hero-illustration">
            <div className="circle-orbit orbit-one" /><div className="circle-orbit orbit-two" />
            <HeartPulse size={52} /><span>OA<br />SCREEN</span>
          </div>
        </div>
        <section className="section-block">
          <div className="section-heading">
            <div><span className="eyebrow">{t('campOverview')}</span><h2>{t('atAGlance')}</h2></div>
            <button className="text-button" onClick={onSync}>{t('openSyncCenter')} <ArrowRight size={15} /></button>
          </div>
          <div className="stat-grid">
            <StatCard label={t('screeningsToday')} value={String(quickStats.today).padStart(2, '0')} change={t('fromYesterday')} icon={<ClipboardList size={19} />} tone="blue" />
            <StatCard label={t('highRiskFlags')} value={String(quickStats.highRisk).padStart(2, '0')} change={t('needsReferral')} icon={<HeartPulse size={19} />} tone="red" />
            <StatCard label={t('pendingSync')} value={String(syncCount).padStart(2, '0')} change={t('onThisDevice')} icon={<Cloud size={19} />} tone="amber" />
          </div>
        </section>
        <section className="section-block">
          <div className="section-heading">
            <div><span className="eyebrow">{t('recentPatients')}</span><h2>{t('campDirectory')}</h2></div>
            <button className="outline-button" onClick={onNew}><UsersRound size={16} />{t('registerPatient')}</button>
          </div>
          <div className="patient-table">
            <div className="table-header">
              <span>{t('patientLabel')}</span><span>{t('statusLabel')}</span><span>{t('riskLabel')}</span><span>{t('syncLabel')}</span><span />
            </div>
            {patients.map((item) => (
              <button className="patient-row" key={item.id} onClick={() => onPatient(item)}>
                <div className="patient-person">
                  <div className="patient-avatar">{item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                  <div><strong>{item.name}</strong><small>{item.id} · {item.age} {t('yrs')} · {item.area}</small></div>
                </div>
                <span className={`status-chip ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{t(statusKey(item.status))}</span>
                <span className={`risk-pill ${item.risk.toLowerCase()}`}>{t(riskKey(item.risk))}<small>{item.score}/100</small></span>
                <SyncBadge status={item.synced} t={t} />
                <ChevronDown className="row-arrow" size={18} />
              </button>
            ))}
          </div>
        </section>
      </div>
      <BottomNav active="home" onNavigate={(s) => (s === 'sync' ? onSync() : s === 'register' ? onNew() : undefined)} t={t} />
    </main>
  );
}

function StatCard({ label, value, change, icon, tone }: { label: string; value: string; change: string; icon: React.ReactNode; tone: string }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{change}</small></div>;
}

function SyncBadge({ status, t }: { status: SyncStatus; t: (k: string) => string }) {
  const label = t(status === 'synced' ? 'synced' : status === 'pending' ? 'pending' : 'failed');
  return <span className={`sync-badge ${status}`}><span />{label}</span>;
}

function FlowHeader({ step, title, onBack, t }: { step: number; title: string; onBack: () => void; t: (k: string) => string }) {
  return (
    <>
      <div className="flow-header">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t('back')}</button>
        <span>{t('step')} {step} {t('of')} 4</span>
        <button className="icon-button"><MoreHorizontal size={20} /></button>
      </div>
      <div className="progress-rail"><span style={{ width: `${step * 25}%` }} /></div>
      <div className="flow-title">
        <h1>{title}</h1>
        <div className="flow-steps">
          <span className={step >= 1 ? 'active' : ''}>{t('register')}</span>
          <span className={step >= 2 ? 'active' : ''}>{t('assess')}</span>
          <span className={step >= 3 ? 'active' : ''}>{t('capture')}</span>
          <span className={step >= 4 ? 'active' : ''}>{t('reviewStep')}</span>
        </div>
      </div>
    </>
  );
}

function Registration({ patient, setPatient, onBack, onContinue, t, lang }: { patient: { name: string; age: string; gender: string; phone: string; district: string; state: string }; setPatient: (p: typeof patient) => void; onBack: () => void; onContinue: () => void; t: (k: string) => string; lang: Lang }) {
  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={1} title={t('newPatient')} onBack={onBack} t={t} />
        <div className="form-card">
          <div className="card-intro">
            <div className="icon-tile blue"><UserRound size={22} /></div>
            <div><h2>{t('patientRegistration')}</h2><p>{t('regIntro')}</p></div>
          </div>
          <div className="form-grid">
            <label className="wide">{t('patientName')}<input autoFocus placeholder={t('enterName')} value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} /></label>
            <label>{t('age')}<input type="number" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} /></label>
            <label>{t('gender')}<select value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })}><option value="F">{t('female')}</option><option value="M">{t('male')}</option><option value="O">{t('other')}</option></select></label>
            <label>{t('phone')}<input placeholder={t('phonePlaceholder')} value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} /></label>
            <label>{t('district')}<select value={patient.district} onChange={(e) => setPatient({ ...patient, district: e.target.value })}><option>{t('kamrup')}</option><option>{t('guwahati')}</option><option>{t('dispur')}</option><option>{t('jalukbari')}</option></select></label>
            <label>{t('state')}<select value={patient.state} onChange={(e) => setPatient({ ...patient, state: e.target.value })}><option>{t('assam')}</option><option>{t('meghalaya')}</option><option>{t('tripura')}</option></select></label>
          </div>
          <div className="save-note"><WifiOff size={16} /><span>{t('offlineSafe')}</span><p>{t('offlineSafeNote')}</p></div>
          <button className="primary-button full" onClick={onContinue}>{t('saveContinue')}<ArrowRight size={18} /></button>
        </div>
      </div>
    </main>
  );
}

function Consent({ consented, setConsented, hasSignature, setHasSignature, onBack, onContinue, t }: { consented: boolean; setConsented: (v: boolean) => void; hasSignature: boolean; setHasSignature: (v: boolean) => void; onBack: () => void; onContinue: () => void; t: (k: string) => string }) {
  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={1} title={t('consent')} onBack={onBack} t={t} />
        <div className="consent-card">
          <div className="consent-icon"><ShieldCheck size={31} /></div>
          <span className="eyebrow">{t('ashaToolkit')}</span>
          <h2>{t('consentTitle')}</h2>
          <p>{t('consentBody')}</p>
          <div className="consent-items">
            <div><Check size={18} /><span>{t('consentItem1')}</span></div>
            <div><Check size={18} /><span>{t('consentItem2')}</span></div>
            <div><Check size={18} /><span>{t('consentItem3')}</span></div>
          </div>
          <div className="dpdp-block">
            <div className="dpdp-header"><PenLine size={18} /><span className="eyebrow">{t('dpdpConsent')}</span></div>
            <p>{t('dpdpBody')}</p>
            <SignaturePad onSignatureChange={setHasSignature} t={t} />
          </div>
          <label className={`consent-check ${consented ? 'checked' : ''}`}>
            <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
            <span className="check-box">{consented && <Check size={15} />}</span>
            <span>{t('consentCheck')}</span>
          </label>
          <button className="primary-button full" onClick={onContinue}>{t('startScreening')}<ArrowRight size={18} /></button>
        </div>
      </div>
    </main>
  );
}

function SignaturePad({ onSignatureChange, t }: { onSignatureChange: (hasInk: boolean) => void; t: (k: string) => string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a4a5c';
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    drawing.current = true;
    last.current = getPos(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    last.current = pos;
    onSignatureChange(true);
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange(false);
  };

  return (
    <div className="signature-pad">
      <canvas ref={canvasRef} width={680} height={160} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} />
      {!hasSignature && <span className="signature-hint">{t('signHere')}</span>}
      <div className="signature-actions">
        <button className="text-button" onClick={clear}><Eraser size={15} />{t('clear')}</button>
        {hasSignature && <span className="signed-badge"><Check size={14} />{t('signed')}</span>}
      </div>
    </div>
  );
}

function Questionnaire({ answers, setAnswers, onBack, onContinue, t }: { answers: number[]; setAnswers: (a: number[]) => void; onBack: () => void; onContinue: () => void; t: (k: string) => string }) {
  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={2} title={t('questionnaire')} onBack={onBack} t={t} />
        <div className="assessment-card">
          <div className="assessment-top">
            <div>
              <span className="eyebrow">WOMAC-Mini-OA</span>
              <h2>{t('howKnee')}</h2>
              <p>{t('askEach')}</p>
            </div>
            <div className="question-count">{answers.filter((v) => v > 0).length}<small>/ 5 {t('answered')}</small></div>
          </div>
          <div className="question-list">
            {questionKeys.map((qKey, index) => (
              <div className="question-item" key={qKey}>
                <div className="question-number">0{index + 1}</div>
                <div className="question-content">
                  <strong>{t(qKey)}</strong>
                  <div className="segmented-control">
                    {scaleKeys.map((sKey, value) => (
                      <button key={sKey} className={answers[index] === value ? 'selected' : ''} onClick={() => setAnswers(answers.map((a, ai) => (ai === index ? value : a)))}>
                        {t(sKey)}<small>{value}</small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="assessment-footer">
            <span>{t('subtotal')} <strong>{answers.reduce((s, v) => s + v, 0)} / 20</strong></span>
            <button className="primary-button" onClick={onContinue}>{t('next')}<ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SensorScreen({ connected, setConnected, kneeAngle, setKneeAngle, onBack, onContinue, t }: { connected: boolean; setConnected: (v: boolean) => void; kneeAngle: number; setKneeAngle: (v: number) => void; onBack: () => void; onContinue: () => void; t: (k: string) => string }) {
  useEffect(() => {
    if (!connected) return;
    const id = window.setInterval(() => {
      setKneeAngle(Math.round(45 + Math.random() * 80));
    }, 900);
    return () => window.clearInterval(id);
  }, [connected, setKneeAngle]);

  const angle = kneeAngle;
  const needleRotation = -90 + (angle / 180) * 180;

  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={3} title={t('sensor')} onBack={onBack} t={t} />
        <div className="sensor-card">
          <div className={`sensor-visual ${connected ? 'connected' : ''}`}>
            <div className="scan-ring ring-a" /><div className="scan-ring ring-b" />
            <div className="device-drawing"><Bluetooth size={35} /><span>IMU</span></div>
          </div>
          <div className="sensor-status">
            {connected ? <><span className="status-dot" />ESP32_BLE_IMU_V1</> : <><RefreshCw className="spin" size={16} />{t('scanning')}</>}
          </div>
          <h2>{connected ? t('sensorConnected') : t('sensorPlace')}</h2>
          <p>{connected ? t('sensorConnectedBody') : t('sensorScanBody')}</p>
          {connected && (
            <>
              <div className="battery-row"><BatteryCharging size={18} />{t('battery')} 86% <span /> {t('signal')}</div>
              <div className="gauge-section">
                <span className="eyebrow">{t('liveAngle')}</span>
                <div className="gauge-dial">
                  <svg viewBox="0 0 200 120" className="gauge-svg">
                    <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#e2ecea" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#1a9e87" strokeWidth="10" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (angle / 180) * 251} className="gauge-arc" />
                    <line x1="100" y1="110" x2="100" y2="40" stroke="#1a4a5c" strokeWidth="3" strokeLinecap="round" transform={`rotate(${needleRotation} 100 110)`} className="gauge-needle" />
                    <circle cx="100" cy="110" r="6" fill="#1a4a5c" />
                  </svg>
                  <div className="gauge-readout">
                    <strong>{angle}{t('degree')}</strong>
                    <span>{t('flexion')}</span>
                  </div>
                </div>
                <div className="knee-tabs">
                  <button className="active">{t('leftKnee')}</button>
                  <button>{t('rightKnee')}</button>
                </div>
              </div>
            </>
          )}
          <button className="primary-button full" onClick={() => (connected ? onContinue() : setConnected(true))}>
            {connected ? t('continue') : t('connect')}<ArrowRight size={18} />
          </button>
          {!connected && <button className="text-button centered" onClick={() => setConnected(true)}><RotateCcw size={15} />{t('retryScan')}</button>}
        </div>
      </div>
    </main>
  );
}

function GaitScreen({ capturing, captureDone, setCapturing, onFinish, onBack, onContinue, t }: { capturing: boolean; captureDone: boolean; setCapturing: (v: boolean) => void; onFinish: () => void; onBack: () => void; onContinue: () => void; t: (k: string) => string }) {
  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={3} title={t('gait')} onBack={onBack} t={t} />
        <div className="gait-card">
          <div className="camera-frame">
            <div className="pose-outline">
              <div className="head" /><div className="body" /><div className="leg left" /><div className="leg right" />
            </div>
            <div className="camera-corner tl" /><div className="camera-corner tr" /><div className="camera-corner bl" /><div className="camera-corner br" />
            <span className="camera-hint"><Camera size={16} />{t('placePhone')}</span>
            {capturing && <div className="recording-pill"><span />{t('recording')} · 00:08</div>}
            {captureDone && <div className="capture-complete"><Check size={30} /><strong>{t('captureComplete')}</strong></div>}
          </div>
          <div className="gait-instruction">
            <div className="icon-tile mint"><ArrowRight size={21} /></div>
            <div><strong>{t('walkToward')}</strong><p>{t('walkBody')}</p></div>
          </div>
          {captureDone ? (
            <div className="metrics-grid">
              <Metric label={t('gaitSpeed')} value="0.82" unit="m/s" status={t('normal')} />
              <Metric label={t('cadence')} value="88" unit="steps/min" status={t('normal')} />
              <Metric label={t('sitToStand')} value="14.2" unit="s" status={t('watch')} />
            </div>
          ) : (
            <button className="primary-button full" onClick={() => (capturing ? onFinish() : setCapturing(true))}>
              {capturing ? t('finishRecording') : <><Play size={17} />{t('startRecording')}</>}<ArrowRight size={18} />
            </button>
          )}
          {captureDone && <button className="primary-button full" onClick={onContinue}>{t('continueReview')}<ArrowRight size={18} /></button>}
          <button className="text-button centered" onClick={() => setCapturing(false)}><CircleHelp size={15} />{t('needHelp')}</button>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, unit, status }: { label: string; value: string; unit: string; status: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}<small>{unit}</small></strong><em>{status}</em></div>;
}

function ReviewScreen({ patient, answers, captureDone, score, risk, onBack, onSubmit, t }: { patient: { name: string; age: string }; answers: number[]; captureDone: boolean; score: number; risk: Risk; onBack: () => void; onSubmit: () => void; t: (k: string) => string }) {
  const riskKey = risk === 'Low' ? 'low' : risk === 'Moderate' ? 'moderate' : 'high';
  return (
    <main className="page">
      <div className="page-inner narrow">
        <FlowHeader step={4} title={t('review')} onBack={onBack} t={t} />
        <div className="review-card">
          <div className="review-banner">
            <div className="icon-tile blue"><ClipboardList size={22} /></div>
            <div><span className="eyebrow">{t('readyInference')}</span><h2>{t('checkDetails')}</h2><p>{t('editable')}</p></div>
          </div>
          <ReviewRow label={t('patientLabel')} value={`${patient.name || t('newPatientRecord')}, ${patient.age} ${t('yrs')}`} t={t} />
          <ReviewRow label={t('questionnaire')} value={`${answers.reduce((s, v) => s + v, 0)} / 20`} t={t} />
          <ReviewRow label={t('sensor')} value={t('bothKnees')} t={t} />
          <ReviewRow label={t('gait')} value={captureDone ? t('metricsReady') : t('skipped')} t={t} />
          <div className="prediction-preview">
            <div><span className="eyebrow">{t('preview')}</span><h3>{t('estimatedTier')}</h3></div>
            <span className={`risk-pill ${risk.toLowerCase()}`}>{t(riskKey)} · {score}/100</span>
          </div>
          <button className="primary-button full" onClick={onSubmit}><Zap size={18} />{t('runInference')}<ArrowRight size={18} /></button>
        </div>
      </div>
    </main>
  );
}

function ReviewRow({ label, value, t }: { label: string; value: string; t: (k: string) => string }) {
  return <div className="review-row"><div><span>{label}</span><strong>{value}</strong></div><button className="text-button">{t('edit')}</button></div>;
}

function ResultScreen({ score, risk, onPdf, onReturn, t }: { score: number; risk: Risk; onPdf: () => void; onReturn: () => void; t: (k: string) => string }) {
  const circumference = 2 * Math.PI * 74;
  const offset = circumference - (score / 100) * circumference;
  const riskKey = risk === 'Low' ? 'low' : risk === 'Moderate' ? 'moderate' : 'high';
  return (
    <main className="page">
      <div className="page-inner narrow">
        <div className="result-header">
          <button className="back-button" onClick={onReturn}><ArrowLeft size={18} />{t('dashboard')}</button>
          <button className="icon-button"><MoreHorizontal size={20} /></button>
        </div>
        <div className="result-card">
          <span className="eyebrow">{t('screeningComplete')}</span>
          <h1>{t('oaRiskScore')}</h1>
          <div className="score-ring">
            <svg viewBox="0 0 180 180">
              <circle className="ring-track" cx="90" cy="90" r="74" />
              <circle className={`ring-value ${risk.toLowerCase()}`} cx="90" cy="90" r="74" strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
            <div><strong>{score}</strong><span>/100</span></div>
          </div>
          <span className={`risk-label ${risk.toLowerCase()}`}>{t(riskKey)} {t('riskTier')}</span>
          <p className="result-copy">{t('resultBody')}</p>
          <div className="shap-card">
            <div className="section-heading">
              <div><span className="eyebrow">{t('explainability')}</span><h2>{t('whatShaped')}</h2></div>
              <SlidersHorizontal size={18} />
            </div>
            <Factor label={t('factorPain')} value="+22" width="86%" color="red" />
            <Factor label={t('factorFlexion')} value="−14" width="55%" color="mint" />
            <Factor label={t('factorSitStand')} value="+9" width="38%" color="amber" />
          </div>
          <div className="referral-card">
            <MapPin size={21} />
            <div><span className="eyebrow">{t('clinicalReferral')}</span><strong>{t('referTo')}</strong><p>{t('priorityUrgent')}</p></div>
            <ArrowRight size={18} />
          </div>
          <div className="advice-list">
            <span className="eyebrow">{t('todaysAdvice')}</span>
            <div><Check size={16} />{t('advice1')}</div>
            <div><Check size={16} />{t('advice2')}</div>
            <div><Check size={16} />{t('advice3')}</div>
          </div>
          <button className="primary-button full" onClick={onPdf}><FileText size={18} />{t('generate')}<ArrowRight size={18} /></button>
          <button className="text-button centered" onClick={onReturn}>{t('saveReturn')}</button>
        </div>
      </div>
    </main>
  );
}

function Factor({ label, value, width, color }: { label: string; value: string; width: string; color: string }) {
  return (
    <div className="factor">
      <div><span>{label}</span><strong className={color}>{value}</strong></div>
      <div className="factor-track"><span className={color} style={{ width }} /></div>
    </div>
  );
}

function PdfScreen({ patient, score, risk, onBack, onReturn, t }: { patient: { name: string; age: string; district: string; state: string }; score: number; risk: Risk; onBack: () => void; onReturn: () => void; t: (k: string) => string }) {
  const riskKey = risk === 'Low' ? 'low' : risk === 'Moderate' ? 'moderate' : 'high';
  return (
    <main className="page">
      <div className="page-inner narrow">
        <div className="result-header">
          <button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t('backToResult')}</button>
          <div className="pdf-actions">
            <button className="outline-button"><Download size={16} />{t('save')}</button>
            <button className="outline-button"><Send size={16} />{t('share')}</button>
          </div>
        </div>
        <div className="pdf-preview">
          <div className="pdf-paper">
            <div className="pdf-brand">
              <Activity size={22} />
              <div><strong>OsteoScreen</strong><span>{t('communityHealth')}</span></div>
              <span className="pdf-id">OS-2026-0906</span>
            </div>
            <div className="pdf-heading">
              <div>
                <span>{t('screeningReport')}</span>
                <h1>{patient.name || t('patientReport')}</h1>
                <p>{patient.age} {t('years')} · {patient.district}, {patient.state}</p>
              </div>
              <div className={`pdf-score ${risk.toLowerCase()}`}><strong>{score}</strong><span>{t('oaRiskScore')}</span></div>
            </div>
            <div className="pdf-section">
              <span className="eyebrow">{t('summary')}</span>
              <div className="pdf-summary">
                <div><span>{t('riskTierLabel')}</span><strong>{t(riskKey)}</strong></div>
                <div><span>{t('questionnaireLabel')}</span><strong>WOMAC-Mini-OA</strong></div>
                <div><span>{t('captured')}</span><strong>06 Sep 2026</strong></div>
              </div>
            </div>
            <div className="pdf-section">
              <span className="eyebrow">{t('recommendation')}</span>
              <div className="pdf-recommendation">
                <MapPin size={19} />
                <div><strong>{t('referToPdf')}</strong><p>{t('pdfBody')}</p></div>
              </div>
            </div>
            <div className="pdf-section">
              <span className="eyebrow">{t('preventiveAdvice')}</span>
              <ul>
                <li>{t('advice1Pdf')}</li>
                <li>{t('advice2Pdf')}</li>
                <li>{t('advice3Pdf')}</li>
              </ul>
            </div>
            <div className="pdf-footer">
              <span>{t('generatedOn')}</span>
              <span>{t('page')}</span>
            </div>
          </div>
        </div>
        <button className="primary-button full" onClick={onReturn}>{t('saveReturn')}<ArrowRight size={18} /></button>
      </div>
    </main>
  );
}

function SyncScreen({ patients, setPatients, networkOnline, setNetworkOnline, onBack, t }: { patients: any[]; setPatients: any; networkOnline: boolean; setNetworkOnline: any; onBack: () => void; t: any }) {
  const [syncing, setSyncing] = useState(false);
  const pending = patients.filter((p) => p.synced !== 'synced').length;

  const syncAll = async () => {
    setSyncing(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/assessments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: "PAT-2026-8831",
          q1_answer: "Morning stiffness present",
          q2_answer: "Pain while walking",
          q3_answer: "Knee swelling reported"
        })
      });
      const data = await response.json();
      console.log("✅ Live API Response from FastAPI:", data);

      setPatients((prev: any[]) => prev.map((p) => ({ ...p, synced: 'synced' as const })));
    } catch (err) {
      console.error("❌ Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="page">
      <div className="page-inner narrow">
        <div className="card">
          <h2>Sync Center</h2>
          <p>Pending Patients: {pending}</p>
          <button 
            className="btn btn-primary" 
            onClick={syncAll} 
            disabled={syncing}
          >
            {syncing ? "Syncing..." : "Sync All Data"}
          </button>
        </div>
      </div>
    </main>
  );
}

function BottomNav({ active, onNavigate, t }: { active: string; onNavigate: (s: any) => void; t?: any }) {
  const translate = (key: string) => (typeof t === 'function' ? t(key) : key);

  return (
    <nav className="bottom-nav">
      <button className={active === 'home' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
        <Home size={19} />
      </button>
      <button className={active === 'sync' ? 'active' : ''} onClick={() => onNavigate('sync')}>
        <Cloud size={19} />
      </button>
      <button onClick={() => onNavigate('register')}>
        <UsersRound size={19} />
        <span>{translate('patients')}</span>
      </button>
      <button onClick={() => onNavigate('dashboard')}>
        <Settings size={19} />
        <span>{translate('more')}</span>
      </button>
    </nav>
  );
}

export default App;
