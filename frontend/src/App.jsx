import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  RecaptchaVerifier, signInWithPhoneNumber,
  signOut, onAuthStateChanged,
} from "firebase/auth";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyB2KYzCTNeA7Q1M9iwYbE2r1Ow2iLTi4GY",
  authDomain: "medigreen-ace92.firebaseapp.com",
  projectId: "medigreen-ace92",
  storageBucket: "medigreen-ace92.firebasestorage.app",
  messagingSenderId: "591474629186",
  appId: "1:591474629186:web:50d3aef842ae58a9a2abdb",
});
const auth = getAuth(firebaseApp);

// Real Unsplash plant/Ayurveda images
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80", // herbs
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80", // plant leaves
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80", // nature green
];

const PLANT_IMAGES = {
  "Tulsi":              "https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=400&q=80",
  "neem leaf":          "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400&q=80",
  "Aloe Vera":          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80",
  "Mint":               "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80",
  "Zingiber officinale - Ginger": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Turmeric Leaf":      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
  "default":            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80",
};

const PLANTS_DB = [
  {id:1,  name:"Aloe Vera",                       latin:"Aloe barbadensis miller",    family:"Asphodelaceae",  tag:"SKIN",    color:"#111111", symptoms:["skin","burns","digestion"]},
  {id:2,  name:"Arive-Dantu",                      latin:"Amaranthus viridis",         family:"Amaranthaceae",  tag:"BLOOD",   color:"#EF4444", symptoms:["anemia","fatigue","digestion"]},
  {id:3,  name:"Basale",                           latin:"Basella alba",               family:"Basellaceae",    tag:"GUT",     color:"#111111", symptoms:["digestion","skin","inflammation"]},
  {id:4,  name:"Betel Leaf",                       latin:"Piper betle",                family:"Piperaceae",     tag:"ORAL",    color:"#2D6A2D", symptoms:["cough","digestion","pain"]},
  {id:5,  name:"Curry Leaf",                       latin:"Murraya koenigii",           family:"Rutaceae",       tag:"HAIR",    color:"#2D6A2D", symptoms:["diabetes","hair","fatigue"]},
  {id:6,  name:"Drumstick",                       latin:"Moringa oleifera (Fruit)",   family:"Moringaceae",    tag:"JOINTS",  color:"#111111", symptoms:["joint pain","inflammation","fatigue"]},
  {id:7,  name:"Drumstick Leaf",                   latin:"Moringa oleifera (Leaf)",    family:"Moringaceae",    tag:"SUPER",   color:"#111111", symptoms:["anemia","diabetes","inflammation"]},
  {id:8,  name:"Guava Leaf",                       latin:"Psidium guajava",            family:"Myrtaceae",      tag:"SUGAR",   color:"#111111", symptoms:["diabetes","digestion","diarrhea"]},
  {id:9,  name:"Hibiscus Rosa-sinensis",           latin:"Hibiscus rosa-sinensis",     family:"Malvaceae",      tag:"HEART",   color:"#2D6A2D", symptoms:["hair","hypertension","skin"]},
  {id:10, name:"Indian Mustard",                   latin:"Brassica juncea",            family:"Brassicaceae",   tag:"LUNGS",   color:"#2D6A2D", symptoms:["cough","joint pain","pain"]},
  {id:11, name:"Jackfruit Leaf",                   latin:"Artocarpus heterophyllus",   family:"Moraceae",       tag:"SKIN",    color:"#111111", symptoms:["diabetes","skin","wounds"]},
  {id:12, name:"Jamaica Cherry-Gasagase",         latin:"Muntingia calabura",         family:"Muntingiaceae",  tag:"PAIN",    color:"#2D6A2D", symptoms:["headache","hypertension","pain"]},
  {id:13, name:"Jamaica Cherry-Gasagase leaf",    latin:"Muntingia calabura (Leaf)",  family:"Muntingiaceae",  tag:"GUT",     color:"#111111", symptoms:["digestion","pain","inflammation"]},
  {id:14, name:"Jamun Leaf",                       latin:"Syzygium cumini",            family:"Myrtaceae",      tag:"SUGAR",   color:"#111111", symptoms:["diabetes","oral health","digestion"]},
  {id:15, name:"Jasmine Leaf",                     latin:"Jasminum",                   family:"Oleaceae",       tag:"CALM",    color:"#111111", symptoms:["anxiety","skin","stress"]},
  {id:16, name:"Lemon Leaf",                       latin:"Citrus limon",               family:"Rutaceae",       tag:"SLEEP",   color:"#2D6A2D", symptoms:["anxiety","stress","insomnia"]},
  {id:17, name:"Mexican Mint",                     latin:"Coleus amboinicus",          family:"Lamiaceae",      tag:"LUNGS",   color:"#111111", symptoms:["cough","cold","fever"]},
  {id:18, name:"Mint",                             latin:"Mentha",                     family:"Lamiaceae",      tag:"GUT",     color:"#111111", symptoms:["digestion","nausea","headache"]},
  {id:19, name:"Oleander",                        latin:"Nerium oleander",            family:"Apocynaceae",    tag:"⚠TOXIC",  color:"#2D6A2D", symptoms:["skin"]},
  {id:20, name:"Peepal Leaf",                      latin:"Ficus religiosa",            family:"Moraceae",       tag:"SACRED",  color:"#2D6A2D", symptoms:["digestion","cough","inflammation"]},
  {id:21, name:"Phyllanthus emblica-Amla",        latin:"Phyllanthus emblica",        family:"Phyllanthaceae", tag:"IMMUNE",  color:"#2D6A2D", symptoms:["immunity","hair","skin"]},
  {id:22, name:"Pomegranate",                      latin:"Punica granatum",            family:"Lythraceae",     tag:"HEART",   color:"#2D6A2D", symptoms:["anemia","fatigue","hypertension"]},
  {id:23, name:"Pomegranate Leaf",                 latin:"Punica granatum (Leaf)",     family:"Lythraceae",     tag:"SLEEP",   color:"#111111", symptoms:["insomnia","stress","digestion"]},
  {id:24, name:"Rasna Leaf",                       latin:"Pluchea lanceolata",         family:"Asteraceae",     tag:"JOINTS",  color:"#111111", symptoms:["joint pain","inflammation","cough"]},
  {id:25, name:"Sandalwood Leaf",                  latin:"Santalum album",             family:"Santalaceae",    tag:"SKIN",    color:"#2D6A2D", symptoms:["skin","fever","inflammation"]},
  {id:26, name:"Syzygium Cumini -Jamun",           latin:"Syzygium cumini",            family:"Myrtaceae",      tag:"SUGAR",   color:"#111111", symptoms:["diabetes","anemia","digestion"]},
  {id:27, name:"Syzygium Jambos -Rose Apple",      latin:"Syzygium jambos",            family:"Myrtaceae",      tag:"BRAIN",   color:"#111111", symptoms:["fever","headache","fatigue"]},
  {id:28, name:"Tabernaemontana Divaricata- Crape Jasmine",latin:"Tabernaemontana divaricata",family:"Apocynaceae",tag:"EYES",color:"#111111",symptoms:["skin","pain","inflammation"]},
  {id:29, name:"Tinospora cordifolia",             latin:"Tinospora cordifolia",       family:"Menispermaceae", tag:"IMMUNE",  color:"#111111", symptoms:["fever","immunity","diabetes"]},
  {id:30, name:"Trigonella Fenugreek-Fenugreek",  latin:"Trigonella foenum-graecum",  family:"Fabaceae",       tag:"SUGAR",   color:"#2D6A2D", symptoms:["diabetes","digestion","fatigue"]},
  {id:31, name:"Tulsi",                            latin:"Ocimum sanctum",             family:"Lamiaceae",      tag:"QUEEN",   color:"#111111", symptoms:["cough","cold","stress","immunity","fever"]},
  {id:32, name:"Turmeric Leaf",                    latin:"Curcuma longa",              family:"Zingiberaceae",  tag:"ANTI-∞",  color:"#2D6A2D", symptoms:["inflammation","skin","cough"]},
  {id:33, name:"Zingiber officinale - Ginger",     latin:"Zingiber officinale",        family:"Zingiberaceae",  tag:"DIGEST",  color:"#2D6A2D", symptoms:["nausea","digestion","cold","pain"]},
  {id:34, name:"karanda",                          latin:"Carissa carandas",           family:"Apocynaceae",    tag:"GUT",     color:"#2D6A2D", symptoms:["digestion","fever","skin"]},
  {id:35, name:"neem leaf",                        latin:"Azadirachta indica",         family:"Meliaceae",      tag:"DETOX",   color:"#111111", symptoms:["skin","immunity","fever","wounds"]},
  {id:36, name:"roxburgh leaf",                    latin:"Ficus roxburghii",           family:"Moraceae",       tag:"GUT",     color:"#111111", symptoms:["digestion","diarrhea","wounds"]},
  {id:37, name:"tristis -Parijata-",               latin:"Nyctanthes arbor-tristis",   family:"Oleaceae",       tag:"JOINTS",  color:"#111111", symptoms:["joint pain","fever","inflammation"]},
];

const SYMPTOMS = [
  {id:"fever",label:"🌡 Fever"},{id:"cough",label:"😮‍💨 Cough"},{id:"digestion",label:"🫃 Digestion"},
  {id:"skin",label:"✨ Skin"},{id:"diabetes",label:"🩸 Diabetes"},{id:"headache",label:"🤕 Headache"},
  {id:"joint pain",label:"🦴 Joints"},{id:"anemia",label:"💉 Anemia"},{id:"stress",label:"🧘 Stress"},
  {id:"immunity",label:"🛡 Immunity"},{id:"hair",label:"💇 Hair"},{id:"inflammation",label:"🔥 Inflam."},
  {id:"insomnia",label:"😴 Insomnia"},{id:"nausea",label:"🤢 Nausea"},{id:"pain",label:"😣 Pain"},{id:"wounds",label:"🩹 Wounds"},
];

const NAVS = [
  {id:"scanner",  label:"Scanner",    accent:"#2D6A2D"},
  {id:"chat",     label:"AI Chat",    accent:"#1F5C1F"},
  {id:"interact", label:"Interactions",accent:"#2D6A2D"},
  {id:"symptoms", label:"Symptoms",   accent:"#1F5C1F"},
  {id:"database", label:"Encyclopedia",accent:"#2D6A2D"},
  {id:"history",  label:"History",    accent:"#2D6A2D"},
];

export default function App() {
  const [user, setUser]         = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authTab, setAuthTab]   = useState("login");
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const [authErr, setAuthErr]   = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const recaptchaRef            = useRef(null);
  const recaptchaContainer      = useRef(null);

  const [view, setView]         = useState("scanner");
  const [heroImg, setHeroImg]   = useState(0);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [result, setResult]     = useState(null);
  const [scanning, setScanning] = useState(false);
  const [step, setStep]         = useState(0);
  const [searchQ, setSearchQ]   = useState("");
  const fileRef = useRef();

  const [chatMsgs, setChatMsgs]   = useState([]);
  const [chatIn, setChatIn]       = useState("");
  const [chatBusy, setChatBusy]   = useState(false);
  const [chatPlant, setChatPlant] = useState(null);
  const chatEnd = useRef(null);

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mg_h") || "[]"); } catch { return []; }
  });
  const [selPlants, setSelPlants] = useState([]);
  const [ixResult, setIxResult]   = useState(null);
  const [ixBusy, setIxBusy]       = useState(false);
  const [ixMode, setIxMode]       = useState("preset"); // "preset" | "custom"
  const [customPlantsInput, setCustomPlantsInput] = useState("");
  const [selSyms, setSelSyms]     = useState([]);
  const [recs, setRecs]           = useState([]);
  const [symMode, setSymMode]     = useState("preset"); // "preset" | "custom"
  const [customSymInput, setCustomSymInput] = useState("");
  const [aiRemedies, setAiRemedies] = useState(null);
  const [symAiBusy, setSymAiBusy]   = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, u => { setUser(u); setAuthReady(true); });
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setHeroImg(p => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  // ── AUTH ────────────────────────────────────────────────────────────────
  const googleLogin = async () => {
    setAuthBusy(true); setAuthErr("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    }
    catch (e) { setAuthErr(e.message); }
    setAuthBusy(false);
  };

  const emailAuth = async () => {
    setAuthBusy(true); setAuthErr("");
    try {
      if (authTab === "signup") await createUserWithEmailAndPassword(auth, email, pass);
      else await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      setAuthErr(
        e.code === "auth/wrong-password"       ? "Incorrect password." :
        e.code === "auth/user-not-found"       ? "No account found with that email." :
        e.code === "auth/email-already-in-use" ? "Email already registered — try signing in." :
        e.code === "auth/weak-password"        ? "Password must be at least 6 characters." :
        e.code === "auth/invalid-email"        ? "Please enter a valid email address." :
        "Something went wrong. Please try again."
      );
    }
    setAuthBusy(false);
  };

  // Fixed phone auth — properly initialises RecaptchaVerifier once
  const sendOTP = async () => {
    setAuthBusy(true); setAuthErr("");
    const formatted = phone.startsWith("+") ? phone : `+91${phone.replace(/\s/g,"")}`;
    try {
      // Always create a fresh verifier to avoid stale state issues
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
      }
      recaptchaRef.current = new RecaptchaVerifier(auth, "recap-div", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => { setAuthErr("reCAPTCHA expired — please try again."); setAuthBusy(false); }
      });
      await recaptchaRef.current.render();
      const result = await signInWithPhoneNumber(auth, formatted, recaptchaRef.current);
      setConfirmResult(result);
      setOtpSent(true);
    } catch (e) {
      const msg =
        e.code === "auth/invalid-phone-number"   ? "Invalid phone number. Include country code e.g. +91..." :
        e.code === "auth/too-many-requests"       ? "Too many attempts. Please wait a few minutes." :
        e.code === "auth/captcha-check-failed"    ? "reCAPTCHA failed — try again." :
        e.code === "auth/quota-exceeded"          ? "SMS quota exceeded. Try Google or Email login." :
        e.message;
      setAuthErr(msg);
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
    }
    setAuthBusy(false);
  };

  const verifyOTP = async () => {
    setAuthBusy(true); setAuthErr("");
    try { await confirmResult.confirm(otp); }
    catch { setAuthErr("Invalid OTP. Please check and try again."); }
    setAuthBusy(false);
  };

  const logout = () => {
    signOut(auth); setResult(null); setChatMsgs([]); setChatPlant(null);
  };

  // ── SCANNER ─────────────────────────────────────────────────────────────
  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setChatMsgs([]);
  };

  const STEPS = ["Initialising scanner…","Extracting morphology…","Cross-referencing 38 species…","Building Ayurvedic profile…"];

  const upload = async () => {
    if (!file) return;
    setScanning(true); setStep(0);
    const iv = setInterval(() => setStep(p => p < STEPS.length ? p + 1 : p), 750);
    try {
      const fd = new FormData(); fd.append("image", file);
      const { data } = await axios.post("http://localhost:5000/predict", fd);
      const match = PLANTS_DB.find(p => p.name.toLowerCase() === data.name?.toLowerCase());
      const r = {
        name: data.name, scientific_name: data.scientific_name || match?.latin || "",
        family: match?.family || "", confidence: data.confidence ?? 95,
        top3: data.top3 || null, uses: data.uses || "", preparation: data.preparation || "",
        color: match?.color || "#2D6A2D", tag: match?.tag || "PLANT",
        image: PLANT_IMAGES[data.name] || PLANT_IMAGES["default"],
      };
      setResult(r); setChatPlant(r); setChatMsgs([]);
      const entry = { id: Date.now(), name: r.name, scientific: r.scientific_name, confidence: r.confidence, preview, color: r.color, date: new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}), time: new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) };
      const updated = [entry, ...history].slice(0, 20);
      setHistory(updated); localStorage.setItem("mg_h", JSON.stringify(updated));
    } catch { alert("Analysis failed — make sure Flask is running on port 5000."); }
    finally { clearInterval(iv); setScanning(false); }
  };

  const sendChat = async () => {
    if (!chatIn.trim()) return;
    const msg = chatIn.trim(); setChatIn("");
    const updated = [...chatMsgs, { role: "user", text: msg }];
    setChatMsgs(updated); setChatBusy(true);
    try {
      const { data } = await axios.post("http://localhost:5000/chat", {
        plant_name: chatPlant?.name || "", scientific_name: chatPlant?.scientific_name || "",
        uses: chatPlant?.uses || "", preparation: chatPlant?.preparation || "",
        message: msg, messages: updated.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
      });
      setChatMsgs(p => [...p, { role: "assistant", text: data.reply }]);
    } catch { setChatMsgs(p => [...p, { role: "assistant", text: "Connection error — make sure Flask is running on port 5000." }]); }
    finally { setChatBusy(false); }
  };

  const checkIx = async () => {
    if (selPlants.length < 2) return;
    setIxBusy(true); setIxResult(null);
    try {
      const { data } = await axios.post("http://localhost:5000/interactions", { plants: selPlants });
      setIxResult(data);
    } catch { setIxResult([{ level: "safe", msg: "Could not check — make sure Flask is running." }]); }
    finally { setIxBusy(false); }
  };

  // AI-powered custom plant interaction check via chat endpoint
  const checkIxCustom = async () => {
    const plants = customPlantsInput.split(",").map(p => p.trim()).filter(Boolean);
    if (plants.length < 2) return;
    setIxBusy(true); setIxResult(null);
    try {
      const prompt = `I want to check Ayurvedic interactions between these plants: ${plants.join(", ")}.
For each pair, tell me if there are any known interactions, contraindications, or synergies in Ayurvedic medicine.
Format your response as a clear list with each pair on a new line. Use these prefixes:
⛔ DANGER: for serious interactions
⚠️ CAUTION: for mild concerns  
✅ SAFE: for safe combinations
ℹ️ INFO: for beneficial synergies
Be concise — one sentence per pair.`;

      const { data } = await axios.post("http://localhost:5000/chat", {
        plant_name: plants.join(" + "),
        scientific_name: "", uses: "", preparation: "",
        message: prompt,
        messages: [],
      });

      // Parse the AI response into structured results
      const lines = data.reply.split("\n").filter(l => l.trim());
      const parsed = lines.map(line => {
        const level =
          line.includes("⛔") || line.toLowerCase().includes("danger")  ? "warning" :
          line.includes("⚠️") || line.toLowerCase().includes("caution") ? "caution" :
          line.includes("✅") || line.toLowerCase().includes("safe")    ? "safe"    : "info";
        return { level, msg: line.replace(/^[⛔⚠️✅ℹ️]\s*/,"").replace(/^(DANGER|CAUTION|SAFE|INFO):\s*/i,""), plants: [] };
      }).filter(r => r.msg.length > 10);

      setIxResult(parsed.length > 0 ? parsed : [{ level:"info", msg: data.reply, plants:[] }]);
    } catch {
      setIxResult([{ level:"safe", msg:"Could not check — make sure Flask is running on port 5000." }]);
    }
    finally { setIxBusy(false); }
  };

  const findRecs = () => {
    if (!selSyms.length) return;
    setRecs(PLANTS_DB.filter(p => p.id !== 19)
      .map(p => ({ ...p, score: selSyms.filter(s => p.symptoms?.includes(s)).length }))
      .filter(p => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 6));
  };

  const getAiRemedies = async () => {
    setSymAiBusy(true); setAiRemedies(null);
    const symptomsText = symMode === "custom"
      ? customSymInput
      : `symptoms: ${selSyms.join(", ")}`;
    try {
      const prompt = `You are an expert Ayurvedic practitioner. A patient has the following ${symptomsText}.

Recommend exactly 4 Ayurvedic medicinal plants. For each plant, write in this exact format with these exact labels on their own lines:

PLANT: [Common Name] ([Scientific Name])
PRIORITY: [PRIMARY or SECONDARY or SUPPORTIVE]
BENEFITS: [2-3 sentences on how this plant addresses the symptoms]
PREPARATION: [Step by step instructions with quantities and timing]
DOSAGE: [Exact amount, frequency, and duration]
CAUTION: [Any warnings or contraindications]

Separate each plant with a blank line. Write in plain professional English. No JSON, no code, no markdown symbols, no asterisks, no bullet dashes.`;

      const { data } = await axios.post("http://localhost:5000/chat", {
        plant_name: "", scientific_name: "", uses: "", preparation: "",
        message: prompt, messages: [],
      });

      // Parse the plain text response into structured objects
      const raw = data.reply || "";
      const blocks = raw.split(/\n\s*\n/).filter(b => b.trim().length > 20);

      const plants = blocks.map(block => {
        const get = (label) => {
          const match = block.match(new RegExp(`${label}:\\s*(.+?)(?=\\n[A-Z]+:|$)`, 's'));
          return match ? match[1].trim() : "";
        };
        const plantLine = get("PLANT");
        const nameParts = plantLine.match(/^(.+?)\s*\((.+?)\)$/);
        return {
          name:        nameParts ? nameParts[1].trim() : plantLine,
          latin:       nameParts ? nameParts[2].trim() : "",
          priority:    get("PRIORITY"),
          benefits:    get("BENEFITS"),
          preparation: get("PREPARATION"),
          dosage:      get("DOSAGE"),
          caution:     get("CAUTION"),
        };
      }).filter(p => p.name.length > 1);

      if (plants.length > 0) {
        setAiRemedies({ plants });
      } else {
        // Fallback — show the raw text nicely if parsing fails
        setAiRemedies({ rawAdvice: raw, plants: [] });
      }
    } catch {
      setAiRemedies({ rawAdvice: "Connection error — make sure Flask is running on port 5000.", plants: [] });
    }
    finally { setSymAiBusy(false); }
  };

  const filtered = PLANTS_DB.filter(p => p.id !== 38 &&
    [p.name, p.latin, p.family].some(f => f.toLowerCase().includes(searchQ.toLowerCase())));

  const ixStyle = l => ({
    warning: { bg:"rgba(45,106,45,.4)", border:"rgba(45,106,45,.4)", color:"#ff8585", icon:"⛔" },
    caution:  { bg:"rgba(247,183,49,.10)", border:"rgba(247,183,49,.4)",  color:"#2D6A2D", icon:"⚠️" },
    safe:     { bg:"rgba(22,101,52,.10)", border:"rgba(22,101,52,.35)", color:"#111111", icon:"✅" },
    info:     { bg:"rgba(45,106,45,.4)",  border:"rgba(45,106,45,.4)",   color:"#2D6A2D", icon:"ℹ️" },
  }[l] || { bg:"rgba(255,255,255,.05)", border:"rgba(255,255,255,.1)", color:"#aaa", icon:"ℹ️" });

  // ════════════════════════════════════════════
  // GLOBAL CSS
  // ════════════════════════════════════════════
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F8F9F8;color:#0A0A0A;font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden}

    @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.93) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes spinRing{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes barGrow{from{width:0}to{width:var(--bw,90%)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes popIn{0%{transform:scale(0) rotate(-10deg);opacity:0}70%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0);opacity:1}}

    /* Nav links */
    .nl{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
      font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      color:#111111;transition:all .3s;padding:0;position:relative;white-space:nowrap}
    .nl:hover{color:#0A0A0A}
    .nl.on{color:var(--ac,#2D6A2D)}
    .nl.on::after{content:'';position:absolute;bottom:-8px;left:0;right:0;height:2px;
      background:var(--ac,#2D6A2D);border-radius:2px;animation:fadeIn .3s ease}

    /* Drop zone */
    .dz{border:2px dashed rgba(45,106,45,.4);border-radius:28px;
      transition:all .4s cubic-bezier(.34,1.56,.64,1);cursor:pointer;
      background:rgba(45,106,45,.02);position:relative;overflow:hidden;
      aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}
    .dz:hover{border-color:#2D6A2D;background:rgba(45,106,45,.4);
      transform:scale(1.015);box-shadow:0 0 48px rgba(45,106,45,.4)}

    /* Primary button — terracotta */
    .primary{border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:800;
      letter-spacing:.06em;text-transform:uppercase;transition:all .35s cubic-bezier(.34,1.56,.64,1);
      background:#2D6A2D;color:#FFFFFF;border-radius:18px;
      box-shadow:0 8px 32px rgba(45,106,45,.4);position:relative;overflow:hidden}
    .primary::before{content:'';position:absolute;inset:0;
      background:#1F5C1F;opacity:0;transition:opacity .3s}
    .primary:hover:not(:disabled)::before{opacity:1}
    .primary:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 16px 48px rgba(45,106,45,.4)}
    .primary:active:not(:disabled){transform:translateY(0)}
    .primary:disabled{opacity:.3;cursor:not-allowed;transform:none}

    /* Outline button */
    .outline{border:1.5px solid rgba(45,106,45,.4);background:transparent;cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;color:#111111;
      border-radius:14px;transition:all .3s;font-family:'Plus Jakarta Sans',sans-serif}
    .outline:hover{border-color:#0A0A0A;color:#0A0A0A;background:rgba(26,26,26,.04)}

    /* Input */
    .inp{background:#FFFFFF;border:1.5px solid rgba(45,106,45,.4);color:#0A0A0A;
      outline:none;font-family:'Plus Jakarta Sans',sans-serif;border-radius:16px;
      transition:all .3s;width:100%}
    .inp:focus{border-color:#2D6A2D;box-shadow:0 0 0 4px rgba(45,106,45,.4)}
    .inp::placeholder{color:#AAA}

    /* Cards */
    .card{background:#FFFFFF;border:1px solid rgba(45,106,45,.4);border-radius:24px;
      transition:all .4s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden}
    .card:hover{border-color:rgba(45,106,45,.4);transform:translateY(-6px);
      box-shadow:0 24px 64px rgba(45,106,45,.4)}

    .enc-card{background:#FFFFFF;border:1px solid rgba(45,106,45,.4);border-radius:22px;
      overflow:hidden;transition:all .4s cubic-bezier(.34,1.56,.64,1);cursor:default}
    .enc-card:hover{transform:translateY(-8px) scale(1.02);
      box-shadow:0 32px 64px rgba(45,106,45,.4)}

    /* Symptom chips */
    .sym{border:1.5px solid rgba(45,106,45,.4);background:#FFFFFF;color:#666;
      font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;
      padding:10px 18px;border-radius:99px;cursor:pointer;transition:all .3s}
    .sym:hover{border-color:#1F5C1F;color:#1F5C1F;background:rgba(22,101,52,.06)}
    .sym.on{background:#1F5C1F;color:#F5F0E8;border-color:#1F5C1F;font-weight:700;
      box-shadow:0 4px 20px rgba(22,101,52,.3)}

    /* Plant pills */
    .pill{border:1.5px solid rgba(45,106,45,.4);background:#FFFFFF;color:#111111;
      font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;
      padding:7px 14px;border-radius:99px;cursor:pointer;transition:all .25s}
    .pill:hover{border-color:#2D6A2D;color:#2D6A2D}
    .pill.on{background:rgba(45,106,45,.4);color:#2D6A2D;border-color:rgba(45,106,45,.4);font-weight:700}

    /* Auth tabs */
    .atab{flex:1;padding:14px 8px;border:none;background:transparent;cursor:pointer;
      font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      color:#666;border-bottom:2px solid transparent;transition:all .3s;
      font-family:'Plus Jakarta Sans',sans-serif}
    .atab.on{color:#2D6A2D;border-bottom-color:#2D6A2D}

    /* Google button */
    .gbtn{width:100%;padding:16px;border-radius:16px;background:#FFFFFF;
      border:1.5px solid rgba(45,106,45,.4);color:#0A0A0A;
      display:flex;align-items:center;justify-content:center;gap:12px;
      font-size:15px;font-weight:600;cursor:pointer;transition:all .3s;
      font-family:'Plus Jakarta Sans',sans-serif}
    .gbtn:hover{background:#E5DFD5;border-color:rgba(45,106,45,.4);
      box-shadow:0 4px 24px rgba(45,106,45,.4)}

    /* Tag chips */
    .tag{font-family:'Syne',sans-serif;font-size:10px;font-weight:800;
      letter-spacing:.14em;text-transform:uppercase;padding:5px 12px;
      border-radius:99px;display:inline-block}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(45,106,45,.4);border-radius:3px}
  `;

  // ════════════════════════════════════════════
  // LOADING
  // ════════════════════════════════════════════
  if (!authReady) return (
    <div style={{ minHeight:"100vh",background:"#F8F9F8",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <style>{CSS}</style>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:20,animation:"fadeIn .5s ease" }}>
        <div style={{ width:64,height:64,borderRadius:20,background:"#2D6A2D",display:"flex",alignItems:"center",justifyContent:"center",animation:"float 2s ease-in-out infinite",boxShadow:"0 8px 32px rgba(45,106,45,.4)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"#2D6A2D",letterSpacing:".1em",textTransform:"uppercase" }}>Loading MediGreen…</div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════
  // AUTH WALL
  // ════════════════════════════════════════════
  if (!user) return (
    <div style={{ minHeight:"100vh",background:"#F8F9F8",display:"flex",overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* LEFT — clean dark panel, no distracting bg image */}
      <div style={{ flex:"0 0 50%",position:"relative",overflow:"hidden",background:"#FFFFFF",borderRight:"1px solid rgba(45,106,45,.4)" }}>

        {/* Subtle geometric background — grid lines only, very faint */}
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(45,106,45,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(45,106,45,.03) 1px,transparent 1px)",backgroundSize:"72px 72px",pointerEvents:"none" }}/>

        {/* Single soft radial glow at bottom left — not distracting */}
        <div style={{ position:"absolute",bottom:"-15%",left:"-10%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(45,106,45,.4) 0%,transparent 65%)",pointerEvents:"none" }}/>

        {/* Floating botanical icons — subtle, far from text */}
        <div style={{ position:"absolute",top:"12%",right:"8%",opacity:.06,animation:"float 8s ease-in-out infinite",pointerEvents:"none" }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#2D6A2D" strokeWidth=".5">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
        <div style={{ position:"absolute",bottom:"18%",right:"12%",opacity:.04,animation:"float 11s 3s ease-in-out infinite",pointerEvents:"none" }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1F5C1F" strokeWidth=".6">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>

        {/* Content — clearly readable on dark background */}
        <div style={{ position:"relative",zIndex:1,padding:"64px 72px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:"#2D6A2D",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(45,106,45,.4)",animation:"float 3s ease-in-out infinite" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#0A0A0A",letterSpacing:"-.01em" }}>MEDIGREEN</span>
          </div>

          {/* Main copy */}
          <div style={{ animation:"fadeUp .8s ease both" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:99,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",marginBottom:28 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#2D6A2D",animation:"pulse 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"#2D6A2D" }}>38 Ayurvedic Species · AI Powered</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(44px,5vw,68px)",fontWeight:800,lineHeight:.96,letterSpacing:"-.04em",color:"#0A0A0A",marginBottom:22 }}>
              Ancient plants.<br/>
              <span style={{ background:"linear-gradient(90deg,#2D6A2D,#1F5C1F,#1F5C1F)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                Modern answers.
              </span>
            </h1>
            <p style={{ fontSize:18,color:"#111111",lineHeight:1.75,maxWidth:420,marginBottom:44 }}>
              Photograph any medicinal leaf. Get instant AI identification, Ayurvedic preparation guides, and drug interaction warnings.
            </p>

            {/* Feature list — clean rows */}
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {[
                {icon:"🔍",label:"Leaf Scanner",desc:"Instant AI identification from a photo"},
                {icon:"🤖",label:"AI Botanist",desc:"Ask any Ayurvedic question freely"},
                {icon:"🔗",label:"Interaction Checker",desc:"AI-powered custom plant safety checks"},
                {icon:"🌿",label:"Symptom Finder",desc:"Get matched plant remedies"},
              ].map(f=>(
                <div key={f.label} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:16,background:"rgba(255,255,255,.03)",border:"1px solid rgba(45,106,45,.4)" }}>
                  <div style={{ width:38,height:38,borderRadius:11,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:15,fontWeight:700,color:"#111" }}>{f.label}</div>
                    <div style={{ fontSize:13,color:"#111",marginTop:2 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize:12,color:"#222",letterSpacing:".06em" }}>© 2026 MediGreen · Ayurvedic Intelligence</div>
        </div>
      </div>

      {/* RIGHT — auth form */}
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 56px",background:"#F0F4EE" }}>
        <div style={{ width:"100%",maxWidth:440,animation:"fadeUp .6s ease .2s both" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:46,fontWeight:800,color:"#0A0A0A",marginBottom:8,letterSpacing:"-.03em" }}>
            {authTab==="signup"?"Get started":"Welcome back"}
          </h2>
          <p style={{ fontSize:15,color:"#1A1A1A",marginBottom:36 }}>
            {authTab==="signup"?"Create your MediGreen account":"Sign in to continue"}
          </p>

          <div style={{ background:"#FFFFFF",borderRadius:28,padding:36,border:"1px solid rgba(45,106,45,.4)",boxShadow:"0 40px 80px rgba(45,106,45,.4)" }}>
            {/* Tabs */}
            <div style={{ display:"flex",borderBottom:"1px solid rgba(45,106,45,.4)",marginBottom:28 }}>
              {[{id:"login",label:"Sign In"},{id:"signup",label:"Sign Up"},{id:"phone",label:"📱 Phone"}].map(t=>(
                <button key={t.id} className={`atab ${authTab===t.id?"on":""}`} onClick={()=>{setAuthTab(t.id);setAuthErr("");setOtpSent(false);setConfirmResult(null);}}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Email / Google */}
            {authTab !== "phone" && (
              <>
                <button className="gbtn" onClick={googleLogin} disabled={authBusy}>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>
                <div style={{ display:"flex",alignItems:"center",gap:16,margin:"20px 0" }}>
                  <div style={{ flex:1,height:1,background:"rgba(255,255,255,.06)" }}/><span style={{ fontSize:11,color:"#2D6A2D",fontWeight:700,letterSpacing:".1em" }}>OR</span><div style={{ flex:1,height:1,background:"rgba(255,255,255,.06)" }}/>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                  <input className="inp" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&emailAuth()} style={{ padding:"16px 20px",fontSize:15 }}/>
                  <input className="inp" type="password" placeholder="Password (min 6 chars)" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&emailAuth()} style={{ padding:"16px 20px",fontSize:15 }}/>
                  {authErr&&<div style={{ fontSize:13,color:"#ff6b6b",padding:"12px 16px",borderRadius:12,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",lineHeight:1.5 }}>{authErr}</div>}
                  <button className="primary" onClick={emailAuth} disabled={authBusy} style={{ padding:"17px",fontSize:13 }}>
                    <span style={{ position:"relative",zIndex:1 }}>{authBusy?"Please wait…":authTab==="signup"?"Create Account →":"Sign In →"}</span>
                  </button>
                </div>
              </>
            )}

            {/* Phone OTP */}
            {authTab === "phone" && (
              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                {!otpSent ? (
                  <>
                    <div style={{ padding:"14px 16px",borderRadius:14,background:"rgba(45,106,45,.06)",border:"1px solid rgba(45,106,45,.4)",fontSize:13,color:"rgba(45,106,45,.8)",lineHeight:1.6 }}>
                      ℹ️ Enter your number with country code. E.g. <strong>+91 98765 43210</strong>
                    </div>
                    <input className="inp" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} style={{ padding:"16px 20px",fontSize:15 }}/>
                    {/* Invisible recaptcha container */}
                    <div id="recap-div" ref={recaptchaContainer}/>
                    {authErr&&<div style={{ fontSize:13,color:"#ff6b6b",padding:"12px 16px",borderRadius:12,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",lineHeight:1.5 }}>{authErr}</div>}
                    <button className="primary" onClick={sendOTP} disabled={authBusy||!phone.trim()} style={{ padding:"17px",fontSize:13 }}>
                      <span style={{ position:"relative",zIndex:1 }}>{authBusy?"Sending OTP…":"Send OTP →"}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ padding:"14px 16px",borderRadius:14,background:"rgba(22,101,52,.06)",border:"1px solid rgba(22,101,52,.18)",fontSize:13,color:"rgba(22,101,52,.8)",lineHeight:1.6 }}>
                      ✅ OTP sent to <strong>{phone}</strong>. Check your messages.
                    </div>
                    <input className="inp" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verifyOTP()} style={{ padding:"16px 20px",fontSize:15,letterSpacing:".2em",textAlign:"center" }}/>
                    {authErr&&<div style={{ fontSize:13,color:"#ff6b6b",padding:"12px 16px",borderRadius:12,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)" }}>{authErr}</div>}
                    <button className="primary" onClick={verifyOTP} disabled={authBusy||otp.length<6} style={{ padding:"17px",fontSize:13 }}>
                      <span style={{ position:"relative",zIndex:1 }}>{authBusy?"Verifying…":"Verify OTP →"}</span>
                    </button>
                    <button style={{ background:"none",border:"none",color:"#1A1A1A",fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",textDecoration:"underline" }}
                      onClick={()=>{setOtpSent(false);setOtp("");setAuthErr("");setConfirmResult(null);}}>
                      ← Use a different number
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <p style={{ textAlign:"center",fontSize:12,color:"#222",marginTop:20 }}>By continuing you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════
  // MAIN APP
  // ════════════════════════════════════════════
  return (
    <div style={{ minHeight:"100vh",background:"#F8F9F8",color:"#0A0A0A",fontFamily:"'Plus Jakarta Sans',sans-serif",overflowX:"hidden" }}>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav style={{ position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(45,106,45,.4)",background:"rgba(250,250,248,.93)",backdropFilter:"blur(28px)" }}>
        <div style={{ maxWidth:1440,margin:"0 auto",padding:"0 40px",height:72,display:"flex",alignItems:"center",justifyContent:"space-between",gap:20 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:"#2D6A2D",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(45,106,45,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"-.01em" }}>MEDIGREEN</span>
          </div>

          <div style={{ display:"flex",gap:28,alignItems:"center" }}>
            {NAVS.map(n=>(
              <button key={n.id} className={`nl ${view===n.id?"on":""}`} style={{"--ac":n.accent}} onClick={()=>setView(n.id)}>{n.label}</button>
            ))}
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 16px",borderRadius:99,background:"#FFFFFF",border:"1px solid rgba(45,106,45,.4)" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:"#2D6A2D",animation:"pulse 2.5s ease-in-out infinite",boxShadow:"0 0 8px rgba(45,106,45,.6)" }}/>
              <span style={{ fontSize:12,fontWeight:600,color:"#1A1A1A",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                {user.displayName||user.email?.split("@")[0]||"User"}
              </span>
            </div>
            <button onClick={logout} style={{ padding:"8px 18px",borderRadius:99,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"#DC2626",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .25s" }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ SCANNER ═══ */}
      {view==="scanner"&&(
        <main style={{ maxWidth:1440,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:72,animation:"fadeUp .6s ease both" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",marginBottom:24 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:"#2D6A2D",animation:"pulse 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#2D6A2D" }}>AI-Powered · 38 Species</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(64px,9vw,120px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A" }}>
              Identify<br/>
              <span style={{ background:"linear-gradient(135deg,#2D6A2D 0%,#1F5C1F 40%,#1F5C1F 100%)",backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"gradShift 4s ease infinite" }}>Medicinal</span><br/>
              Leaves.
            </h1>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"500px 1fr",gap:36,alignItems:"start" }}>
            {/* Upload */}
            <div style={{ display:"flex",flexDirection:"column",gap:18,animation:"fadeUp .7s ease .1s both" }}>
              <div className="dz" onClick={()=>!preview&&fileRef.current.click()}
                onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(!f)return;setFile(f);setPreview(URL.createObjectURL(f));setResult(null);}}
                onDragOver={e=>e.preventDefault()}>

                {scanning&&(
                  <div style={{ position:"absolute",inset:0,background:"rgba(250,250,248,.96)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,borderRadius:26 }}>
                    <div style={{ position:"relative",width:110,height:110 }}>
                      <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(45,106,45,.4)",animation:"spinRing 4s linear infinite" }}/>
                      <div style={{ position:"absolute",inset:14,borderRadius:"50%",border:"2px solid rgba(45,106,45,.4)",animation:"spinRing 2.5s linear infinite reverse" }}/>
                      <div style={{ position:"absolute",inset:30,borderRadius:"50%",border:"2px solid rgba(45,106,45,.4)",animation:"spinRing 1.5s linear infinite" }}/>
                      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D6A2D" strokeWidth="1.5">
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                        </svg>
                      </div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,letterSpacing:".12em",color:"#2D6A2D",textTransform:"uppercase",animation:"pulse 1.5s ease-in-out infinite",marginBottom:20 }}>
                        {STEPS[Math.min(step-1,STEPS.length-1)]}
                      </div>
                      <div style={{ width:240,height:3,background:"rgba(45,106,45,.4)",borderRadius:2,overflow:"hidden",margin:"0 auto" }}>
                        <div style={{ height:"100%",borderRadius:2,background:"linear-gradient(90deg,#2D6A2D,#1F5C1F,#1F5C1F)",width:`${(step/STEPS.length)*100}%`,transition:"width .8s ease",backgroundSize:"200% 100%",animation:"gradShift 2s ease infinite" }}/>
                      </div>
                    </div>
                  </div>
                )}

                {preview?(
                  <>
                    <img src={preview} style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:26 }}/>
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,8,.9) 0%,transparent 40%)",borderRadius:26,display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:28 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,color:"#2D6A2D",textTransform:"uppercase",letterSpacing:".14em",marginBottom:4 }}>✓ Leaf Ready</div>
                        <div style={{ fontSize:13,color:"rgba(10,10,10,.45)" }}>{file?.name?.slice(0,28)}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();fileRef.current.click();}} style={{ padding:"9px 20px",borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#0A0A0A",fontSize:13,cursor:"pointer",fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",backdropFilter:"blur(12px)",transition:"all .2s" }}>
                        Change
                      </button>
                    </div>
                  </>
                ):(
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:56,textAlign:"center" }}>
                    <div style={{ width:88,height:88,borderRadius:"50%",background:"rgba(45,106,45,.06)",border:"2px dashed rgba(45,106,45,.4)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28,animation:"float 3s ease-in-out infinite" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2D6A2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                      </svg>
                    </div>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,color:"#0A0A0A",marginBottom:10 }}>Drop a leaf photo here</div>
                    <div style={{ fontSize:15,color:"#2D6A2D",marginBottom:26 }}>or click to browse · JPG, PNG, WEBP</div>
                    <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
                      {["Single Leaf","Close-up","Clear BG"].map(t=>(
                        <span key={t} className="tag" style={{ background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",color:"#2D6A2D" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }}/>
              </div>

              <button className="primary" onClick={upload} disabled={!file||scanning} style={{ padding:"22px",fontSize:15 }}>
                <span style={{ position:"relative",zIndex:1 }}>
                  {scanning?"Analysing Leaf…":"⬡  IDENTIFY MEDICINAL LEAF"}
                </span>
              </button>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
                {[["38","Species"],["97%","Accuracy"],["4s","Speed"]].map(([v,l])=>(
                  <div key={l} style={{ padding:"24px 16px",borderRadius:20,background:"#FFFFFF",border:"1px solid rgba(45,106,45,.4)",textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:34,fontWeight:800,background:"#2D6A2D",letterSpacing:"-.02em" }}>{v}</div>
                    <div style={{ fontSize:11,color:"#2D6A2D",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginTop:6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result */}
            <div style={{ display:"flex",flexDirection:"column",gap:22,animation:"fadeUp .7s ease .2s both" }}>
              {result?(
                <>
                  <div style={{ background:"#FFFFFF",borderRadius:28,border:"1px solid rgba(45,106,45,.4)",boxShadow:"0 40px 80px rgba(0,0,0,.12)",overflow:"hidden",animation:"scaleIn .55s cubic-bezier(.34,1.56,.64,1) both" }}>
                    {/* Image header */}
                    <div style={{ height:220,position:"relative",overflow:"hidden" }}>
                      <img src={result.image} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.src=PLANT_IMAGES["default"]}/>
                      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(8,8,8,.2) 0%,rgba(17,17,17,1) 100%)" }}/>
                      <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${result.color},transparent)` }}/>
                      <div style={{ position:"absolute",top:20,left:24 }}>
                        <span className="tag" style={{ background:`${result.color}22`,border:`1px solid ${result.color}44`,color:result.color }}>{result.tag}</span>
                      </div>
                      <div style={{ position:"absolute",top:20,right:24,padding:"6px 16px",borderRadius:99,background:"rgba(250,250,248,.6)",backdropFilter:"blur(12px)",border:"1px solid rgba(45,106,45,.4)" }}>
                        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:result.color }}>{result.confidence}%</span>
                        <span style={{ fontSize:11,color:"#1A1A1A",marginLeft:6,fontWeight:700 }}>MATCH</span>
                      </div>
                    </div>

                    <div style={{ padding:36 }}>
                      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(42px,4vw,64px)",fontWeight:800,color:"#0A0A0A",lineHeight:.95,letterSpacing:"-.03em",marginBottom:8 }}>{result.name}</h2>
                      <p style={{ fontSize:16,color:"#666",fontStyle:"italic",marginBottom:24 }}>{result.scientific_name}</p>

                      {/* Confidence bar */}
                      <div style={{ marginBottom:28 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:"#2D6A2D",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10 }}>
                          <span>Confidence</span><span style={{ color:result.color }}>{result.confidence}%</span>
                        </div>
                        <div style={{ height:6,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden" }}>
                          <div style={{ height:"100%",borderRadius:3,background:`linear-gradient(90deg,${result.color},${result.color}88)`,width:`${result.confidence}%`,transition:"width 1.4s ease",animation:"barGrow 1.4s cubic-bezier(.34,1.56,.64,1) .3s both","--bw":`${result.confidence}%` }}/>
                        </div>
                      </div>

                      {/* Top 3 */}
                      {result.top3&&result.top3.length>1&&(
                        <div style={{ marginBottom:28,padding:22,borderRadius:18,background:"#EDEFEA",border:"1px solid rgba(45,106,45,.4)" }}>
                          <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:16 }}>Model Predictions</div>
                          {result.top3.map((p,i)=>(
                            <div key={i} style={{ marginBottom:i<result.top3.length-1?14:0 }}>
                              <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:7 }}>
                                <span style={{ fontWeight:i===0?700:400,color:i===0?result.color:"#1A1A1A" }}>{p.name}</span>
                                <span style={{ fontWeight:700,color:i===0?result.color:"#1A1A1A" }}>{p.confidence}%</span>
                              </div>
                              <div style={{ height:5,background:"rgba(255,255,255,.04)",borderRadius:3,overflow:"hidden" }}>
                                <div style={{ height:"100%",borderRadius:3,background:i===0?result.color:"rgba(255,255,255,.07)",width:`${p.confidence}%`,transition:"width 1.2s ease" }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:28 }}>
                        {[result.family,"Indian Subcontinent"].map(t=>(
                          <span key={t} className="tag" style={{ background:`${result.color}12`,border:`1px solid ${result.color}28`,color:result.color }}>{t}</span>
                        ))}
                      </div>

                      {/* Uses */}
                      <div style={{ padding:26,borderRadius:20,background:"#EDEFEA",border:"1px solid rgba(45,106,45,.4)",marginBottom:16 }}>
                        <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:14 }}>✦ Medicinal Properties</div>
                        <p style={{ fontSize:15,color:"#1A1A1A",lineHeight:1.8 }}>{result.uses}</p>
                      </div>

                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                        <div style={{ padding:24,borderRadius:20,background:"#EDEFEA",border:"1px solid rgba(45,106,45,.4)" }}>
                          <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:14 }}>✦ Preparation</div>
                          <p style={{ fontSize:15,color:"#111111",lineHeight:1.8,whiteSpace:"pre-line" }}>{result.preparation}</p>
                        </div>
                        <div style={{ padding:24,borderRadius:20,background:"rgba(45,106,45,.06)",border:"1px solid rgba(45,106,45,.4)" }}>
                          <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:14 }}>⚠ Caution</div>
                          <p style={{ fontSize:14,color:"#775555",lineHeight:1.8 }}>Always consult an Ayurvedic practitioner. Do not replace prescribed medication.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat CTA */}
                  <button onClick={()=>{setChatPlant(result);setView("chat");}} style={{ padding:"24px 32px",borderRadius:24,background:"#FFFFFF",border:"1px solid rgba(45,106,45,.4)",color:"#0A0A0A",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:18,transition:"all .35s cubic-bezier(.34,1.56,.64,1)",width:"100%",animation:"fadeUp .5s ease .3s both" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="rgba(162,155,254,.4)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,.1)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.boxShadow=""}}>
                    <div style={{ width:52,height:52,borderRadius:16,background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>🤖</div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"#0A0A0A" }}>Ask AI about {result.name}</div>
                      <div style={{ fontSize:15,color:"#111111",marginTop:4 }}>Dosage, safety, drug interactions and more →</div>
                    </div>
                  </button>
                </>
              ):(
                <div style={{ background:"#FFFFFF",borderRadius:28,padding:80,minHeight:580,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",border:"1px solid rgba(45,106,45,.4)",position:"relative",overflow:"hidden" }}>
                  {/* Background image */}
                  <div style={{ position:"absolute",inset:0,backgroundImage:`url(${HERO_IMAGES[heroImg]})`,backgroundSize:"cover",backgroundPosition:"center",opacity:.05,transition:"opacity 1.5s ease" }}/>
                  {[200,140,80].map((s,i)=>(<div key={i} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",border:"1px solid rgba(45,106,45,.06)" }}/>))}
                  <div style={{ position:"relative",zIndex:1 }}>
                    <div style={{ width:80,height:80,borderRadius:"50%",background:"rgba(45,106,45,.05)",border:"2px dashed rgba(45,106,45,.4)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",animation:"float 3s ease-in-out infinite" }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(45,106,45,.4)" strokeWidth="1.2">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                      </svg>
                    </div>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:700,color:"rgba(10,10,10,.1)",marginBottom:12 }}>Awaiting Botanical Input</div>
                    <div style={{ fontSize:15,color:"#1A1A1A" }}>Upload a leaf photo to begin</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ═══ AI CHAT ═══ */}
      {view==="chat"&&(
        <main style={{ maxWidth:960,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:48,animation:"fadeUp .6s ease both" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(162,155,254,.08)",border:"1px solid rgba(162,155,254,.2)",marginBottom:24 }}>
              <span style={{ fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#111111" }}>🤖 No scan required</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(56px,7vw,96px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A",marginBottom:16 }}>
              AI <span style={{ color:"#111111" }}>Botanist</span>
            </h1>
            <p style={{ fontSize:18,color:"#111111",lineHeight:1.7,maxWidth:540 }}>
              Ask anything about Ayurvedic medicine.{chatPlant&&<span style={{ color:"#111111" }}> Focused on <strong>{chatPlant.name}</strong>.</span>}
            </p>
          </div>

          <div style={{ background:"#FFFFFF",borderRadius:22,padding:20,border:"1px solid rgba(45,106,45,.4)",marginBottom:20 }}>
            <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#1A1A1A",textTransform:"uppercase",marginBottom:14 }}>Plant Context</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,maxHeight:140,overflowY:"auto" }}>
              <button className={`pill ${!chatPlant?"on":""}`} onClick={()=>{setChatPlant(null);setChatMsgs([]);}}>General Ayurveda</button>
              {PLANTS_DB.filter(p=>p.id!==19).map(p=>(
                <button key={p.id} className={`pill ${chatPlant?.name===p.name?"on":""}`}
                  onClick={()=>{setChatPlant({name:p.name,scientific_name:p.latin,uses:"",preparation:""});setChatMsgs([]);}}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background:"#FFFFFF",borderRadius:24,border:"1px solid rgba(45,106,45,.4)",overflow:"hidden",boxShadow:"0 40px 80px rgba(0,0,0,.12)" }}>
            {chatMsgs.length===0&&(
              <div style={{ padding:"22px 28px",borderBottom:"1px solid rgba(45,106,45,.4)" }}>
                <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#222",textTransform:"uppercase",marginBottom:14 }}>Quick Questions</div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {(chatPlant?[`Is ${chatPlant.name} safe during pregnancy?`,`Dosage of ${chatPlant.name}?`,`Children & ${chatPlant.name}?`,`Drug interactions?`]:["Best herb for immunity?","Natural diabetes remedy?","Best for joint pain?","Tulsi + Ginger safe?"]).map(q=>(
                    <button key={q} onClick={()=>setChatIn(q)} style={{ padding:"9px 16px",borderRadius:99,fontSize:13,fontWeight:500,cursor:"pointer",border:"1px solid rgba(45,106,45,.4)",background:"#EDEFEA",color:"#1A1A1A",transition:"all .25s",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ height:440,overflowY:"auto",padding:"28px",display:"flex",flexDirection:"column",gap:18 }}>
              {chatMsgs.length===0&&(
                <div style={{ textAlign:"center",margin:"auto",fontFamily:"'Syne',sans-serif",fontSize:20,fontStyle:"italic",color:"#1a1a1a" }}>
                  {chatPlant?`Ask me about ${chatPlant.name}…`:"Ask me anything…"}
                </div>
              )}
              {chatMsgs.map((m,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:m.role==="user"?"slideLeft .3s ease":"slideRight .3s ease" }}>
                  {m.role==="assistant"&&(
                    <div style={{ width:38,height:38,borderRadius:12,background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.2)",display:"flex",alignItems:"center",justifyContent:"center",marginRight:12,flexShrink:0,fontSize:18 }}>🌿</div>
                  )}
                  <div style={{ maxWidth:"74%",padding:"14px 20px",
                    borderRadius:m.role==="user"?"22px 4px 22px 22px":"4px 22px 22px 22px",
                    background:m.role==="user"?"linear-gradient(135deg,#2D6A2D,#1F5C1F)":"#1a1a1a",
                    color:m.role==="user"?"#080808":"#888",
                    fontSize:15,lineHeight:1.75,fontWeight:m.role==="user"?600:400,
                    border:m.role==="assistant"?"1px solid rgba(255,255,255,.05)":"none",
                    boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatBusy&&(
                <div style={{ display:"flex",gap:7,padding:"14px 20px",background:"#EDEFEA",borderRadius:"4px 22px 22px 22px",width:"fit-content",border:"1px solid rgba(45,106,45,.4)" }}>
                  {[0,1,2].map(i=>(<div key={i} style={{ width:9,height:9,borderRadius:"50%",background:"#333",animation:`pulse 1.3s ${i*.2}s ease-in-out infinite` }}/>))}
                </div>
              )}
              <div ref={chatEnd}/>
            </div>

            <div style={{ padding:"20px 28px",borderTop:"1px solid rgba(45,106,45,.4)",display:"flex",gap:14 }}>
              <input className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                placeholder={chatPlant?`Ask about ${chatPlant.name}…`:"Ask anything…"}
                style={{ flex:1,padding:"17px 22px",fontSize:15 }}/>
              <button onClick={sendChat} disabled={!chatIn.trim()||chatBusy} className="primary"
                style={{ padding:"17px 32px",fontSize:13,opacity:chatIn.trim()&&!chatBusy?1:.35 }}>
                <span style={{ position:"relative",zIndex:1 }}>Send</span>
              </button>
            </div>
          </div>
          <div style={{ marginTop:16,fontSize:13,color:"#222",textAlign:"center" }}>⚕️ For informational purposes only — consult a qualified practitioner.</div>
        </main>
      )}

      {/* ═══ INTERACTIONS ═══ */}
      {view==="interact"&&(
        <main style={{ maxWidth:1000,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:52,animation:"fadeUp .6s ease both" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",marginBottom:24 }}>
              <span style={{ fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#2D6A2D" }}>⚠ Safety Tool</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(52px,7vw,88px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A",marginBottom:16 }}>
              Plant <span style={{ color:"#2D6A2D" }}>Interaction</span> Checker
            </h1>
            <p style={{ fontSize:18,color:"#111111",lineHeight:1.7,maxWidth:620 }}>
              Select from our 38 species <strong style={{ color:"#1A1A1A" }}>or type any plant name</strong> — our AI checks for known Ayurvedic interaction warnings.
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display:"flex",gap:0,marginBottom:24,background:"#FFFFFF",borderRadius:16,padding:5,border:"1px solid rgba(45,106,45,.4)",width:"fit-content",animation:"fadeUp .7s ease .05s both" }}>
            {[{id:"preset",label:"📋 Select from List"},{id:"custom",label:"✏️ Type Custom Plants"}].map(m=>(
              <button key={m.id}
                onClick={()=>{ setIxMode(m.id); setIxResult(null); setCustomPlantsInput(""); setSelPlants([]); }}
                style={{ padding:"10px 22px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,transition:"all .25s",
                  background:ixMode===m.id?"linear-gradient(135deg,#2D6A2D,#2D6A2D)":"transparent",
                  color:ixMode===m.id?"#fff":"#444",
                  boxShadow:ixMode===m.id?"0 4px 16px rgba(45,106,45,.4)":"none" }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* PRESET MODE */}
          {ixMode==="preset"&&(
            <div style={{ background:"#FFFFFF",borderRadius:22,padding:28,border:"1px solid rgba(45,106,45,.4)",marginBottom:22,animation:"fadeUp .7s ease .1s both" }}>
              <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:18 }}>
                Select Plants <span style={{ color:"#2D6A2D" }}>({selPlants.length} selected)</span>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:9,maxHeight:280,overflowY:"auto" }}>
                {PLANTS_DB.filter(p=>p.id!==19).map(p=>(
                  <button key={p.id} className={`pill ${selPlants.includes(p.name)?"on":""}`}
                    onClick={()=>{ setSelPlants(prev=>prev.includes(p.name)?prev.filter(x=>x!==p.name):[...prev,p.name]); setIxResult(null); }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM AI MODE */}
          {ixMode==="custom"&&(
            <div style={{ background:"#FFFFFF",borderRadius:22,padding:28,border:"1px solid rgba(45,106,45,.4)",marginBottom:22,animation:"fadeUp .7s ease .1s both" }}>
              <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:8 }}>Type Plant Names</div>
              <div style={{ fontSize:13,color:"#2D6A2D",marginBottom:18,lineHeight:1.6 }}>
                Enter any plant names separated by commas. Our AI will check interactions using its Ayurvedic knowledge — even for plants not in our 38-species list.
              </div>
              <textarea
                value={customPlantsInput}
                onChange={e=>{ setCustomPlantsInput(e.target.value); setIxResult(null); }}
                placeholder="e.g. Ashwagandha, Brahmi, Shatavari, Triphala..."
                rows={3}
                style={{ width:"100%",background:"#EDEFEA",border:"1.5px solid rgba(45,106,45,.4)",color:"#0A0A0A",outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif",borderRadius:16,padding:"16px 20px",fontSize:15,resize:"vertical",transition:"all .3s",lineHeight:1.6 }}
                onFocus={e=>{ e.target.style.borderColor="#2D6A2D"; e.target.style.boxShadow="0 0 0 4px rgba(45,106,45,.4)"; }}
                onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,.08)"; e.target.style.boxShadow="none"; }}
              />
              {customPlantsInput.trim()&&(
                <div style={{ marginTop:12,display:"flex",flexWrap:"wrap",gap:8 }}>
                  {customPlantsInput.split(",").map(p=>p.trim()).filter(Boolean).map((p,i)=>(
                    <span key={i} style={{ padding:"4px 12px",borderRadius:99,background:"rgba(45,106,45,.4)",border:"1px solid rgba(45,106,45,.4)",color:"#2D6A2D",fontSize:12,fontWeight:700 }}>{p}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display:"flex",gap:14,marginBottom:32,animation:"fadeUp .7s ease .2s both" }}>
            <button
              onClick={ixMode==="preset"?checkIx:checkIxCustom}
              disabled={(ixMode==="preset"?selPlants.length<2:customPlantsInput.split(",").filter(p=>p.trim()).length<2)||ixBusy}
              className="primary" style={{ padding:"17px 32px",fontSize:13 }}>
              <span style={{ position:"relative",zIndex:1 }}>{ixBusy?"Checking…":"Check Interactions"}</span>
            </button>
            <button onClick={()=>{ setSelPlants([]); setIxResult(null); setCustomPlantsInput(""); }} className="outline" style={{ padding:"17px 24px",fontSize:14 }}>Clear</button>
          </div>

          {ixResult&&(
            <div style={{ display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .4s ease both" }}>
              {ixResult.map((r,i)=>{
                const s=ixStyle(r.level);
                return(
                  <div key={i} style={{ padding:28,borderRadius:22,background:s.bg,border:`1px solid ${s.border}`,animation:`fadeUp .4s ease ${i*.08}s both` }}>
                    <div style={{ display:"flex",gap:18,alignItems:"flex-start" }}>
                      <span style={{ fontSize:26,flexShrink:0,animation:"popIn .4s ease both" }}>{s.icon}</span>
                      <div>
                        {r.plants&&<div style={{ fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:s.color,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10 }}>{r.plants.join(" + ")}</div>}
                        <p style={{ fontSize:16,color:s.color,lineHeight:1.75 }}>{r.msg}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ padding:18,borderRadius:16,background:"#FFFFFF",border:"1px solid rgba(45,106,45,.4)",fontSize:14,color:"#2D6A2D",lineHeight:1.6 }}>
                ⚕️ Informational only — always consult a qualified Ayurvedic practitioner before combining herbs.
              </div>
            </div>
          )}
        </main>
      )}

      {/* ═══ SYMPTOMS ═══ */}
      {view==="symptoms"&&(
        <main style={{ maxWidth:1100,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:52,animation:"fadeUp .6s ease both" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(22,101,52,.08)",border:"1px solid rgba(22,101,52,.22)",marginBottom:24 }}>
              <span style={{ fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#111111" }}>🌿 Remedy Finder</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(52px,7vw,88px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A",marginBottom:16 }}>
              Symptom <span style={{ color:"#111111" }}>Recommender</span>
            </h1>
            <p style={{ fontSize:18,color:"#111111",lineHeight:1.7,maxWidth:640 }}>
              Select from preset symptoms <strong style={{ color:"#1A1A1A" }}>or describe your condition in your own words</strong> — our AI generates personalised Ayurvedic remedies and preparation guides.
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display:"flex",gap:0,marginBottom:28,background:"#FFFFFF",borderRadius:16,padding:5,border:"1px solid rgba(45,106,45,.4)",width:"fit-content",animation:"fadeUp .7s ease .05s both" }}>
            {[{id:"preset",label:"📋 Select Symptoms"},{id:"custom",label:"✏️ Describe in Your Words"}].map(m=>(
              <button key={m.id}
                onClick={()=>{ setSymMode(m.id); setRecs([]); setAiRemedies(null); setCustomSymInput(""); setSelSyms([]); }}
                style={{ padding:"10px 22px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,transition:"all .25s",
                  background:symMode===m.id?"linear-gradient(135deg,#1F5C1F,#1F5C1F)":"transparent",
                  color:symMode===m.id?"#080808":"#444",
                  boxShadow:symMode===m.id?"0 4px 16px rgba(22,101,52,.35)":"none" }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* ── PRESET MODE ── */}
          {symMode==="preset"&&(
            <>
              <div style={{ background:"#FFFFFF",borderRadius:22,padding:28,border:"1px solid rgba(45,106,45,.4)",marginBottom:22,animation:"fadeUp .7s ease .1s both" }}>
                <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:18 }}>Select Your Symptoms</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:11 }}>
                  {SYMPTOMS.map(s=>(
                    <button key={s.id} className={`sym ${selSyms.includes(s.id)?"on":""}`}
                      onClick={()=>{ setSelSyms(prev=>prev.includes(s.id)?prev.filter(x=>x!==s.id):[...prev,s.id]); setRecs([]); setAiRemedies(null); }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",gap:14,marginBottom:40,animation:"fadeUp .7s ease .2s both" }}>
                <button onClick={findRecs} disabled={selSyms.length===0} className="primary" style={{ padding:"17px 32px",fontSize:13 }}>
                  <span style={{ position:"relative",zIndex:1 }}>Find Remedies</span>
                </button>
                <button onClick={()=>{ setSelSyms([]); setRecs([]); setAiRemedies(null); }} className="outline" style={{ padding:"17px 24px",fontSize:14 }}>Clear</button>
              </div>

              {/* Preset results — cards */}
              {recs.length>0&&(
                <div>
                  <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:24 }}>🌿 Top Matches from Database</div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:20,marginBottom:32 }}>
                    {recs.map((p,i)=>(
                      <div key={p.id} style={{ background:"#FFFFFF",borderRadius:24,overflow:"hidden",border:"1px solid rgba(45,106,45,.4)",animation:`fadeUp .5s ease ${i*.07}s both`,transition:"all .35s cubic-bezier(.34,1.56,.64,1)" }}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 32px 64px rgba(0,0,0,.12)";}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                        <div style={{ height:72,background:`linear-gradient(135deg,${p.color}22,${p.color}08)`,borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"relative",overflow:"hidden" }}>
                          <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${p.color},transparent)` }}/>
                          <span className="tag" style={{ background:`${p.color}18`,border:`1px solid ${p.color}30`,color:p.color }}>{p.tag}</span>
                          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:p.color }}>{p.score}/{selSyms.length}</span>
                        </div>
                        <div style={{ padding:"22px 24px 26px" }}>
                          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"#0A0A0A",marginBottom:6 }}>{p.name}</div>
                          <div style={{ fontSize:13,fontStyle:"italic",color:"#2D6A2D",marginBottom:16 }}>{p.latin}</div>
                          <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:20 }}>
                            {p.symptoms?.filter(s=>selSyms.includes(s)).map(s=>(
                              <span key={s} style={{ padding:"4px 11px",borderRadius:99,fontSize:11,fontWeight:700,background:"rgba(22,101,52,.1)",color:"#111111",border:"1px solid rgba(22,101,52,.25)" }}>✓ {s}</span>
                            ))}
                          </div>
                          <button onClick={()=>setView("scanner")} style={{ padding:"10px 20px",borderRadius:12,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"#DC2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .25s" }}>
                            Scan this leaf →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Also get AI advice for the selected symptoms */}
                  <button onClick={getAiRemedies} disabled={symAiBusy}
                    style={{ width:"100%",padding:"18px",borderRadius:18,background:"rgba(22,101,52,.06)",border:"1px solid rgba(22,101,52,.2)",color:"#111111",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,letterSpacing:".06em",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                    {symAiBusy
                      ? <><span style={{ animation:"pulse 1s ease-in-out infinite" }}>🤖</span> Generating AI remedies…</>
                      : <>🤖 Get full AI Ayurvedic advice for these symptoms</>
                    }
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── CUSTOM AI MODE ── */}
          {symMode==="custom"&&(
            <>
              <div style={{ background:"#FFFFFF",borderRadius:22,padding:28,border:"1px solid rgba(45,106,45,.4)",marginBottom:22,animation:"fadeUp .7s ease .1s both" }}>
                <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:8 }}>Describe Your Condition</div>
                <div style={{ fontSize:14,color:"#2D6A2D",marginBottom:20,lineHeight:1.7 }}>
                  Write freely — describe your symptoms, duration, severity, or any specific concern. Our AI will generate personalised Ayurvedic plant remedies, preparation methods, and dosage guidance.
                </div>
                <textarea
                  value={customSymInput}
                  onChange={e=>{ setCustomSymInput(e.target.value); setAiRemedies(null); }}
                  placeholder="e.g. I have had a persistent dry cough for 3 days with mild fever, also feeling fatigued and low on energy. Looking for natural Ayurvedic remedies..."
                  rows={5}
                  style={{ width:"100%",background:"#EDEFEA",border:"1.5px solid rgba(45,106,45,.4)",color:"#0A0A0A",outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif",borderRadius:16,padding:"18px 22px",fontSize:15,resize:"vertical",transition:"all .3s",lineHeight:1.75 }}
                  onFocus={e=>{ e.target.style.borderColor="#1F5C1F"; e.target.style.boxShadow="0 0 0 4px rgba(22,101,52,.1)"; }}
                  onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,.08)"; e.target.style.boxShadow="none"; }}
                />
              </div>
              <div style={{ display:"flex",gap:14,marginBottom:36,animation:"fadeUp .7s ease .2s both" }}>
                <button onClick={getAiRemedies} disabled={!customSymInput.trim()||symAiBusy} className="primary" style={{ padding:"17px 32px",fontSize:13 }}>
                  <span style={{ position:"relative",zIndex:1 }}>
                    {symAiBusy?"Generating remedies…":"🤖 Generate AI Remedies"}
                  </span>
                </button>
                <button onClick={()=>{ setCustomSymInput(""); setAiRemedies(null); }} className="outline" style={{ padding:"17px 24px",fontSize:14 }}>Clear</button>
              </div>
            </>
          )}

          {/* ── AI REMEDIES OUTPUT (both modes) ── */}
          {aiRemedies&&(
            <div style={{ animation:"fadeUp .5s ease both" }}>
              <div style={{ fontSize:12,fontWeight:800,letterSpacing:".14em",color:"#111111",textTransform:"uppercase",marginBottom:20,display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:18 }}>🤖</span> AI-Generated Ayurvedic Remedies
              </div>

              {/* Remedy cards */}
              {aiRemedies.plants&&aiRemedies.plants.length>0&&(
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18,marginBottom:24 }}>
                  {aiRemedies.plants.map((p,i)=>(
                    <div key={i} style={{ background:"#FFFFFF",borderRadius:22,overflow:"hidden",border:"1px solid rgba(22,101,52,.12)",animation:`fadeUp .5s ease ${i*.08}s both`,transition:"all .35s cubic-bezier(.34,1.56,.64,1)" }}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.borderColor="rgba(22,101,52,.3)";e.currentTarget.style.boxShadow="0 24px 48px rgba(0,0,0,.1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(22,101,52,.12)";e.currentTarget.style.boxShadow="";}}>
                      <div style={{ padding:"20px 24px 6px",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#0A0A0A" }}>{p.name}</div>
                          {p.priority&&<span style={{ padding:"3px 10px",borderRadius:99,fontSize:10,fontWeight:800,background:"rgba(22,101,52,.12)",color:"#111111",border:"1px solid rgba(22,101,52,.25)",flexShrink:0,marginLeft:8 }}>{p.priority}</span>}
                        </div>
                        {p.latin&&<div style={{ fontSize:12,fontStyle:"italic",color:"#2D6A2D",paddingBottom:16 }}>{p.latin}</div>}
                      </div>
                      <div style={{ padding:"16px 24px 24px",display:"flex",flexDirection:"column",gap:14 }}>
                        {p.benefits&&(
                          <div>
                            <div style={{ fontSize:10,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:8 }}>✦ Benefits</div>
                            <p style={{ fontSize:15,color:"#111111",lineHeight:1.75 }}>{p.benefits}</p>
                          </div>
                        )}
                        {p.preparation&&(
                          <div style={{ padding:"14px 16px",borderRadius:14,background:"rgba(22,101,52,.05)",border:"1px solid rgba(22,101,52,.12)" }}>
                            <div style={{ fontSize:10,fontWeight:800,letterSpacing:".14em",color:"#111111",textTransform:"uppercase",marginBottom:8 }}>✦ Preparation</div>
                            <p style={{ fontSize:14,color:"#111111",lineHeight:1.75,whiteSpace:"pre-line" }}>{p.preparation}</p>
                          </div>
                        )}
                        {p.dosage&&(
                          <div style={{ padding:"12px 16px",borderRadius:14,background:"rgba(247,183,49,.05)",border:"1px solid rgba(247,183,49,.15)" }}>
                            <div style={{ fontSize:10,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:6 }}>⚖ Dosage</div>
                            <p style={{ fontSize:13,color:"#7a6020",lineHeight:1.65 }}>{p.dosage}</p>
                          </div>
                        )}
                        {p.caution&&(
                          <div style={{ padding:"12px 16px",borderRadius:14,background:"rgba(45,106,45,.05)",border:"1px solid rgba(45,106,45,.4)" }}>
                            <div style={{ fontSize:10,fontWeight:800,letterSpacing:".14em",color:"#2D6A2D",textTransform:"uppercase",marginBottom:6 }}>⚠ Caution</div>
                            <p style={{ fontSize:13,color:"#775",lineHeight:1.65 }}>{p.caution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* General AI advice if no structured plants */}
              {aiRemedies.rawAdvice&&(
                <div style={{ padding:28,borderRadius:22,background:"#FFFFFF",border:"1px solid rgba(22,101,52,.15)" }}>
                  <div style={{ fontSize:11,fontWeight:800,letterSpacing:".14em",color:"#111111",textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
                    <span>🌿</span> Ayurvedic Advice
                  </div>
                  <p style={{ fontSize:15,color:"#1A1A1A",lineHeight:1.85,whiteSpace:"pre-line" }}>{aiRemedies.rawAdvice}</p>
                </div>
              )}

              <div style={{ marginTop:16,padding:16,borderRadius:14,background:"#FFFFFF",border:"1px solid rgba(45,106,45,.4)",fontSize:13,color:"#2D6A2D",lineHeight:1.6 }}>
                ⚕️ AI-generated advice is for informational purposes only. Always consult a qualified Ayurvedic practitioner or doctor before starting any herbal remedy.
              </div>
            </div>
          )}
        </main>
      )}

      {/* ═══ ENCYCLOPEDIA ═══ */}
      {view==="database"&&(
        <main style={{ maxWidth:1440,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:60,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:24,animation:"fadeUp .6s ease both" }}>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(56px,7vw,96px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A" }}>
                38 Medicinal<br/><span style={{ background:"linear-gradient(90deg,#2D6A2D,#2D6A2D)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>Species.</span>
              </h1>
              <p style={{ marginTop:20,fontSize:15,color:"#2D6A2D" }}>All species recognized by MediGreen AI · Sourced from Ayurvedic tradition</p>
            </div>
            <div style={{ position:"relative" }}>
              <svg style={{ position:"absolute",left:16,top:"50%",transform:"translateY(-50%)" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="inp" type="text" placeholder="Search plants…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{ padding:"15px 20px 15px 46px",fontSize:15,width:320 }}/>
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:20 }}>
            {filtered.map((plant,i)=>(
              <div key={plant.id} className="enc-card" style={{ animation:`fadeUp .4s ease ${i*.025}s both` }}>
                <div style={{ height:90,background:`linear-gradient(135deg,${plant.color}18,${plant.color}06)`,borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${plant.color},transparent)` }}/>
                  <div style={{ position:"absolute",right:-24,top:-24,width:90,height:90,borderRadius:"50%",background:`${plant.color}08` }}/>
                  <span className="tag" style={{ background:`${plant.color}20`,border:`1px solid ${plant.color}35`,color:plant.color }}>{plant.tag}</span>
                  <div style={{ width:40,height:40,borderRadius:12,background:`${plant.color}15`,border:`1px solid ${plant.color}25`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plant.color} strokeWidth="1.8">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                </div>
                <div style={{ padding:"22px 24px 26px" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"#0A0A0A",marginBottom:6 }}>{plant.name}</div>
                  <div style={{ fontSize:12,fontStyle:"italic",color:"#1A1A1A",marginBottom:16 }}>{plant.latin}</div>
                  <div style={{ display:"inline-block",fontSize:10,fontWeight:800,color:plant.color,textTransform:"uppercase",letterSpacing:".1em",padding:"4px 11px",borderRadius:7,background:`${plant.color}12`,border:`1px solid ${plant.color}24` }}>{plant.family}</div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length===0&&(
            <div style={{ textAlign:"center",padding:100,color:"#222" }}>
              <div style={{ fontSize:60,marginBottom:20 }}>🍃</div>
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:700 }}>No results for "{searchQ}"</div>
            </div>
          )}
        </main>
      )}

      {/* ═══ HISTORY ═══ */}
      {view==="history"&&(
        <main style={{ maxWidth:1300,margin:"0 auto",padding:"80px 40px" }}>
          <div style={{ marginBottom:52,display:"flex",alignItems:"flex-end",justifyContent:"space-between",animation:"fadeUp .6s ease both" }}>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(56px,7vw,96px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.05em",color:"#0A0A0A" }}>
                Scan<br/><span style={{ color:"#2D6A2D" }}>History.</span>
              </h1>
              <p style={{ marginTop:20,fontSize:15,color:"#2D6A2D" }}>{history.length} scans saved on this device</p>
            </div>
            {history.length>0&&(
              <button onClick={()=>{setHistory([]);localStorage.removeItem("mg_h");}} style={{ padding:"13px 26px",borderRadius:16,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"#DC2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Clear All
              </button>
            )}
          </div>

          {history.length===0?(
            <div style={{ textAlign:"center",padding:120,color:"#222",animation:"fadeIn .6s ease both" }}>
              <div style={{ fontSize:64,marginBottom:22,animation:"float 3s ease-in-out infinite" }}>🍃</div>
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:700,marginBottom:14 }}>No scans yet</div>
              <button onClick={()=>setView("scanner")} className="primary" style={{ padding:"17px 36px",fontSize:13,marginTop:8 }}>
                <span style={{ position:"relative",zIndex:1 }}>Go to Scanner →</span>
              </button>
            </div>
          ):(
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:22 }}>
              {history.map((e,i)=>(
                <div key={e.id} style={{ background:"#FFFFFF",borderRadius:24,border:"1px solid rgba(45,106,45,.4)",overflow:"hidden",animation:`fadeUp .4s ease ${i*.05}s both`,transition:"all .35s cubic-bezier(.34,1.56,.64,1)" }}
                  onMouseEnter={el=>{el.currentTarget.style.transform="translateY(-7px)";el.currentTarget.style.boxShadow="0 32px 64px rgba(0,0,0,.12)";el.currentTarget.style.borderColor="rgba(255,255,255,.15)";}}
                  onMouseLeave={el=>{el.currentTarget.style.transform="";el.currentTarget.style.boxShadow="";el.currentTarget.style.borderColor="rgba(255,255,255,.06)";}}>
                  {e.preview&&(
                    <div style={{ height:190,overflow:"hidden",position:"relative" }}>
                      <img src={e.preview} style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s ease" }}/>
                      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,8,.85) 0%,transparent 55%)" }}/>
                      <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${e.color||"#2D6A2D"},transparent)` }}/>
                      <div style={{ position:"absolute",bottom:16,right:16,padding:"6px 14px",borderRadius:99,background:"rgba(0,0,0,.12)",backdropFilter:"blur(12px)",border:"1px solid rgba(45,106,45,.4)",fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:e.color||"#2D6A2D" }}>
                        {e.confidence}%
                      </div>
                    </div>
                  )}
                  <div style={{ padding:"22px 26px 26px" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,color:"#0A0A0A",marginBottom:6 }}>{e.name}</div>
                    <div style={{ fontSize:13,fontStyle:"italic",color:"#1A1A1A",marginBottom:20 }}>{e.scientific}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <div style={{ fontSize:12,color:"#222",fontWeight:500 }}>{e.date} · {e.time}</div>
                      <button onClick={()=>setView("scanner")} style={{ padding:"8px 18px",borderRadius:12,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"#DC2626",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .25s" }}>
                        Scan again →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      <footer style={{ borderTop:"1px solid rgba(45,106,45,.4)",padding:"40px",textAlign:"center",marginTop:40 }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:14,color:"#1a1a1a",letterSpacing:".08em" }}>
          MEDIGREEN © 2026 · AI-POWERED BOTANICAL INTELLIGENCE
        </span>
      </footer>
    </div>
  );
}