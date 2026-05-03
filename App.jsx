import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, GraduationCap, Info, MessageCircle, X, Send, 
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  School, BookMarked, Calculator, FlaskConical, Briefcase, Palette,
  Compass, Sparkles, BrainCircuit, Loader2, Star, Target, Rocket, SplitSquareHorizontal, Layers, Building2
} from 'lucide-react';

// --- API Configuration ---
const apiKey = ""; // The execution environment provides the key at runtime

// --- System Prompts ---
const CHATBOT_PROMPT = `أنت مساعد ذكي ولطيف لطلاب المرحلة الثانوية في مصر. مهمتك هي الإجابة على أسئلة الطلاب بخصوص الاختيار بين "نظام الثانوية العامة" و"نظام البكالوريا المصرية".
استخدم المعلومات التالية فقط للإجابة، وبسط الإجابة لتكون مفهومة للطلاب:

**قواعد عامة:**
- لا يجوز قانوناً التحويل من نظام الثانوية العامة لنظام شهادة البكالوريا المصرية أو العكس في حال اختيار نظام بعينه.
- لا يوجد أي إجبار للطلاب على اختيار نظام بعينه ومن حقه قانونا اختيار النظام المناسب له.
- عدد المواد الدراسية في الصفين الثاني والثالث بنظام البكالوريا ٦ مواد دراسية فقط بالإضافة لمادة الدين خارج المجموع.
- عدد المواد الدراسية في الصفين الثاني والثالث بنظام الثانوية العامة ١١ مادة دراسية (بالإضافة للمواد خارج المجموع).
- نظام شهادة البكالوريا المصرية يوفر فرصاً امتحانية متعددة في كل مادة بكامل الدرجة.
- نظام الثانوية العامة يوفر فرصة امتحان واحدة فقط بالإضافة لامتحان الدور الثاني بنصف الدرجة.
- قواعد القبول في الجامعات ثابتة لكلا النظامين.

**الصف الأول الثانوي:**
- مواد أساسية داخل المجموع: لغة عربية، لغة أجنبية أولى، رياضيات، علوم متكاملة، تاريخ، فلسفة ومنطق.
- مواد خارج المجموع: تربية دينية (نجاح 70%)، لغة أجنبية ثانية، برمجة وعلوم حاسب.

**الصف الثاني الثانوي:**
* البكالوريا: مواد أساسية (عربي، أجنبية أولى، تاريخ). ومواد تخصصية يختار منها الطالب مادة: (الطب وعلوم الحياة: أحياء/كيمياء)، (الهندسة وعلوم الحاسب: رياضيات أو فيزياء أو برمجة)، (الأعمال: محاسبة/إدارة أعمال)، (الآداب والفنون: علم نفس أو لغة أجنبية ثانية).
* الثانوية العامة: شعبة علمي (عربي، أجنبية أولى، رياضيات، كيمياء، فيزياء). شعبة أدبي (عربي، أجنبية أولى، تاريخ، رياضيات عامة، جغرافيا، علم نفس واجتماع). ومواد خارج المجموع: دين، وطنية، لغة ثانية.

**الصف الثالث الثانوي:**
* البكالوريا: مواد تخصصية حسب المسار (طب: أحياء وكيمياء متقدم)، (هندسة: رياضيات وفيزياء متقدم)، (أعمال: اقتصاد متقدم، رياضيات، إحصاء)، (آداب: جغرافيا متقدم وإحصاء).
* الثانوية: علمي علوم (عربي، أجنبية أولى، أحياء، كيمياء، فيزياء). علمي رياضة (عربي، أجنبية أولى، رياضيات، كيمياء، فيزياء). أدبي (عربي، أجنبية أولى، تاريخ، جغرافيا، إحصاء).

**الكليات والتخصصات المتاحة:**
- مسار الطب/علمي علوم: الطب، الأسنان، الصيدلة، العلاج الطبيعي، الطب البيطري، التمريض، الزراعة، العلوم، الثروة السمكية والمصايد، معهد تكنولوجيا السكر، العلوم الصحية التطبيقية، البنات (علوم واقتصاد منزلي).
- مسار الهندسة/علمي رياضة: الهندسة، التخطيط العمراني، الحاسبات والذكاء الاصطناعي، الفنون التطبيقية، الفنون الجميلة (عمارة)، علوم الملاحة والفضاء، علوم الأرض، البترول والتعدين، التنمية والتكنولوجيا (زراعية)، العلوم والتربية (رياضة)، التعليم الصناعي، الزراعة (هندسة زراعية)، المصرية الصينية التكنولوجية.
- مسار الأعمال: التجارة (الأعمال)، الاقتصاد والعلوم السياسية، التنمية والتكنولوجيا (مالية وإدارية)، تكنولوجيا الإدارة ونظم المعلومات.
- مسار الآداب/أدبي: الحقوق، الآداب (باستثناء الجغرافيا وعلم النفس لمسار الآداب بالبكالوريا)، الألسن (بشرط دراسة لغة ثانية)، الإعلام، الآثار، السياحة والفنادق، الفنون الجميلة (فنون)، كافة كليات التربية (طفولة، إعاقة وتأهيل، احتياجات خاصة، نوعية، فنية، موسيقية، أساسي)، الاقتصاد المنزلي، الخدمة الاجتماعية، دار العلوم، علوم الرياضة.

تحدث بلهجة مصرية ودودة ومبسطة، وشجع الطلاب على اختيار ما يناسب شغفهم. استخدم الإيموجي المناسبة واجعل إجاباتك في نقاط قصيرة لتكون مريحة للعين.
تنبيه هام جداً: إجاباتك يجب أن تنحصر حصرياً بين "البكالوريا المصرية" و"الثانوية العامة". يمنع منعاً باتاً ذكر أو اقتراح أي أنظمة تعليمية أخرى مثل الدبلومة الأمريكية (American Diploma) أو IG أو IB.`;

const ADVISOR_PROMPT = `أنت مستشار تعليمي مصري بمثابة أخ أكبر لطالب في المرحلة الثانوية. أسلوبك ودود جداً، مشجع، محفز، وتستخدم لهجة مصرية شبابية راقية ومريحة.
سيقوم الطالب بإخبارك بمواده المفضلة، طريقة الامتحانات التي يفضلها، وحلم مستقبله.

**معلومات هامة جداً يجب الالتزام بها حرفياً:**
1. دليلك ونصيحتك يجب أن تنحصر **فقط وحصرياً** بين نظامي "البكالوريا المصرية" و"الثانوية العامة".
2. **ممنوع منعاً باتاً** ذكر أو الإشارة إلى أي أنظمة تعليمية دولية أو خارجية.
3. "البكالوريا المصرية": نظام مصري يوفر فرص امتحانية متعددة بكامل الدرجة، يدرس الطالب فيه 6 مواد فقط في الصفين الثاني والثالث.
4. "الثانوية العامة": نظام مصري بفرصة امتحان واحدة، يدرس الطالب فيه 11 مادة.

شروط الرد:
1. ابدأ بترحيب حماسي جداً يشجع الطالب على حلمه بلهجة مصرية 🌟.
2. قسم ردك باستخدام العناوين الواضحة (استخدم ### قبل العنوان)، مثلاً:
   ### 🎯 النظام الأنسب ليك
   ### 🚀 المسار الأكاديمي المقترح
   ### 🎓 كليات المستقبل
3. لا تكتب فقرات طويلة أبداً. استخدم النقاط (-) للسرد.
4. قم بتمييز الكلمات الهامة بوضعها بين نجمتين **مثل هذه الكلمة** لتبدو بخط عريض.`;

const DREAM_ARCHITECT_PROMPT = `أنت "مهندس الأحلام"، مستشار مهني وتعليمي مصري عبقري ومبدع. 
مهمتك هي قراءة "حلم" أو "شغف" الطالب أو هوايته وتحويلها إلى خطة أكاديمية واقعية ومسار مهني واضح داخل نظام التعليم المصري الجديد.

بناءً على الشغف المكتوب، قم بالرد بالتنسيق التالي بدقة:
1. ابدأ برد فعل منبهر ومتحمس جداً لهواية/شغف الطالب بلهجة مصرية شبابية.
2. استخدم العناوين التالية (بوضع ### قبلها):
   ### 🎯 المهنة اللي بتناديك
   ### 🛤️ المسار الأنسب ليك في الثانوي
   ### 🎓 كليات هتوصلك لحلمك

تحدث بلهجة مصرية، استخدم الإيموجي بحيوية، واجعل الرد مختصراً ومنظماً جداً (Bullet points).`;

// --- Generic Gemini Fetcher ---
async function fetchGeminiAPI(userMessage, systemInstruction) {
  const payload = {
    contents: [{ parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  let attempt = 0;
  const delays = [1000, 2000, 4000, 8000, 16000];

  while (attempt < 5) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من استيعاب البيانات. حاول مرة أخرى.";
    } catch (error) {
      if (attempt === 4) return "حدث خطأ في الاتصال بخوادم الذكاء الاصطناعي. يرجى المحاولة لاحقاً.";
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      attempt++;
    }
  }
}

// --- Main Application Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('rules'); 
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Set Favicon and Title on load
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'GMT.png'; // Using the uploaded logo as Favicon
    document.title = "دليل المرحلة الثانوية | GMT Academy";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white py-8 px-4 shadow-lg rounded-b-3xl relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-md">
              <img src="GMT.png" alt="GMT Academy Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">دليلك للمرحلة الثانوية</h1>
              <p className="text-blue-200">المرشد الشامل لاختيار مستقبلك الأكاديمي</p>
            </div>
          </div>
          <div className="bg-blue-800/60 p-4 rounded-xl border border-blue-600/50 max-w-sm flex items-start gap-2 backdrop-blur-sm">
            <Sparkles className="text-yellow-400 shrink-0 mt-1" size={18} />
            <p className="text-sm leading-relaxed text-blue-50">"تصفح القواعد والمقارنات، أو استخدم أدوات الذكاء الاصطناعي ✨ لاكتشاف المسار الأنسب لشغفك."</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Navigation Tabs - Grid Layout on Mobile, Inline Flex on Desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-3 mb-10">
          <TabButton 
            active={activeTab === 'rules'} 
            onClick={() => setActiveTab('rules')} 
            icon={<Info size={18} />} 
            label="القواعد العامة" 
          />
          <TabButton 
            active={activeTab === 'compare'} 
            onClick={() => setActiveTab('compare')} 
            icon={<Layers size={18} />} 
            label="مقارنة المراحل" 
            specialTheme="blue"
          />
          <TabButton 
            active={activeTab === 'colleges'} 
            onClick={() => setActiveTab('colleges')} 
            icon={<Building2 size={18} />} 
            label="دليل الكليات" 
          />
          <TabButton 
            active={activeTab === 'dream'} 
            onClick={() => setActiveTab('dream')} 
            icon={<Star size={18} />} 
            label="مهندس الأحلام ✨" 
            specialTheme="pink"
          />
          <TabButton 
            active={activeTab === 'advisor'} 
            onClick={() => setActiveTab('advisor')} 
            icon={<Compass size={18} />} 
            label="المستشار الذكي ✨" 
            specialTheme="indigo"
            className="col-span-2 md:col-auto"
          />
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'dream' && <DreamArchitect />}
          {activeTab === 'advisor' && <SmartAdvisor />}
          {activeTab === 'rules' && <GeneralRules />}
          {activeTab === 'compare' && <CompareAllStages />}
          {activeTab === 'colleges' && <Colleges />}
        </div>
      </main>

      {/* Footer Powered By & Developer Info */}
      <footer id="main-footer" className="shrink-0 mt-8 bg-white border-t border-slate-200 pt-8 pb-10 px-4 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Powered By GMT Academy */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Powered & Operated By</span>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl hover:shadow-md transition duration-300">
              <img src="GMT.png" alt="GMT Academy" className="h-10 object-contain drop-shadow-sm" />
              <div className="flex flex-col border-r-2 border-slate-200 pr-3 mr-1">
                <span className="font-extrabold text-[#1e3a8a] text-lg leading-tight tracking-wide">GMT Academy</span>
              </div>
            </div>
          </div>

          {/* Developer Portfolio */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-xs font-bold text-slate-400">تم التصميم والتطوير بواسطة</span>
            <a 
              href="https://zaroscript.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 group bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-bold text-sm" dir="ltr">Eng. Andrew Nashaat</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                <img 
                  src="https://zaroscript.vercel.app/favicon.ico" 
                  alt="ZaroScript Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=AN&backgroundColor=1e3a8a&textColor=white';
                  }} 
                />
              </div>
            </a>
          </div>
          
        </div>
      </footer>

      {/* Chatbot Floating Button & Window */}
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

// --- Components ---

function TabButton({ active, onClick, icon, label, specialTheme, className = '' }) {
  let themeClasses = 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-200';
  
  if (active) {
    if (specialTheme === 'pink') {
      themeClasses = 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md border-transparent';
    } else if (specialTheme === 'indigo') {
      themeClasses = 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md border-transparent';
    } else if (specialTheme === 'blue') {
      themeClasses = 'bg-gradient-to-r from-blue-600 to-[#1e3a8a] text-white shadow-md border-transparent';
    } else {
      themeClasses = 'bg-[#f59e0b] text-white shadow-md border-transparent';
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 md:px-6 md:py-3 rounded-2xl md:rounded-full font-bold text-[13px] md:text-sm transition-all duration-300 active:scale-95 ${active ? 'md:scale-105' : ''} ${themeClasses} ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function CompareAllStages() {
  const core10 = ["اللغة العربية", "اللغة الأجنبية الأولى", "الرياضيات", "العلوم المتكاملة", "التاريخ", "الفلسفة والمنطق"];
  const extra10 = ["التربية الدينية", "اللغة الأجنبية الثانية", "البرمجة وعلوم الحاسب"];

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">رحلة الطالب في المرحلة الثانوية</h2>
        <p className="text-slate-600">مقارنة شاملة توضح خطتك الدراسية من الصف الأول حتى التخرج في النظامين</p>
      </div>

      {/* --- GRADE 10 --- */}
      <section className="relative">
        <div className="absolute top-8 left-1/2 -ml-0.5 w-1 h-full bg-blue-100 -z-10 hidden md:block"></div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-5 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md border border-slate-200">1</div>
            <h3 className="text-2xl font-bold mt-2">الصف الأول الثانوي</h3>
            <p className="text-slate-300 text-sm mt-1">مرحلة التأسيس (عام مشترك لكلا النظامين)</p>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <BookMarked size={18} /> مواد أساسية (داخل المجموع)
              </h4>
              <div className="flex flex-wrap gap-2">
                {core10.map((sub, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">{sub}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-slate-600 bg-slate-100 p-2 rounded-lg border border-slate-200">
                <Info size={18} /> مواد إضافية (خارج المجموع)
              </h4>
              <div className="flex flex-wrap gap-2">
                {extra10.map((sub, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-md text-sm shadow-sm">{sub}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRADE 11 --- */}
      <section className="relative">
        <div className="absolute top-8 left-1/2 -ml-0.5 w-1 h-full bg-blue-100 -z-10 hidden md:block"></div>
        <div className="text-center mb-6 relative">
          <div className="inline-block bg-white text-[#1e3a8a] w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md border border-blue-200 text-xl mx-auto z-10 relative">2</div>
          <h3 className="text-2xl font-bold text-[#1e3a8a] mt-3">الصف الثاني الثانوي (بداية التشعيب)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baccalaureate G11 */}
          <div className="bg-white rounded-3xl shadow-sm border border-blue-200 overflow-hidden relative">
            <div className="bg-blue-600 text-white p-4 text-center">
              <h4 className="text-lg font-bold flex justify-center items-center gap-2"><GraduationCap size={20}/> البكالوريا المصرية</h4>
            </div>
            <div className="p-6">
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">مواد مشتركة (3 مواد):</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">عربي</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">إنجليزي</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">تاريخ</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">مواد المسار (يختار الطالب مادة واحدة):</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2"><span className="text-slate-700">مسار الطب:</span> <strong className="text-blue-800">أحياء أو كيمياء</strong></div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2"><span className="text-slate-700">مسار الهندسة:</span> <strong className="text-blue-800">رياضيات، فيزياء أو برمجة</strong></div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2"><span className="text-slate-700">مسار الأعمال:</span> <strong className="text-blue-800">محاسبة أو إدارة أعمال</strong></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-slate-700">مسار الآداب:</span> <strong className="text-blue-800">علم نفس أو لغة ثانية</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Thanaweya G11 */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden relative">
            <div className="bg-slate-700 text-white p-4 text-center">
              <h4 className="text-lg font-bold flex justify-center items-center gap-2"><BookOpen size={20}/> الثانوية العامة</h4>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase block mb-2 border-b pb-1">شعبة علمي</span>
                <ul className="text-sm space-y-1.5 text-slate-600">
                  <li>عربي وإنجليزي</li>
                  <li className="font-medium text-slate-800">رياضيات</li>
                  <li className="font-medium text-slate-800">كيمياء</li>
                  <li className="font-medium text-slate-800">فيزياء</li>
                </ul>
              </div>
              <div>
                <span className="text-xs font-bold text-purple-500 uppercase block mb-2 border-b pb-1">شعبة أدبي</span>
                <ul className="text-sm space-y-1.5 text-slate-600">
                  <li>عربي وإنجليزي</li>
                  <li>تاريخ وجغرافيا</li>
                  <li>رياضيات عامة</li>
                  <li>علم نفس واجتماع</li>
                </ul>
              </div>
              <div className="col-span-2 mt-2 pt-3 border-t border-slate-100">
                 <p className="text-xs text-slate-500 text-center">مواد خارج المجموع: دين، وطنية، لغة ثانية.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRADE 12 --- */}
      <section className="relative">
        <div className="text-center mb-6 relative">
          <div className="inline-block bg-[#f59e0b] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md border border-amber-200 text-xl mx-auto z-10 relative">3</div>
          <h3 className="text-2xl font-bold text-[#1e3a8a] mt-3">الصف الثالث الثانوي (سنة التخصص)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baccalaureate G12 */}
          <div className="bg-white rounded-3xl shadow-sm border-2 border-blue-300 overflow-hidden relative">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 text-center">
              <h4 className="text-lg font-bold flex justify-center items-center gap-2"><GraduationCap size={20}/> البكالوريا (مواد تخصصية فقط)</h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="bg-blue-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-blue-400 block">مسار الطب وعلوم الحياة:</span>
                <strong className="text-sm text-blue-900 block mt-1">الأحياء (متقدم) ، الكيمياء (متقدم)</strong>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-blue-400 block">مسار الهندسة وعلوم الحاسب:</span>
                <strong className="text-sm text-blue-900 block mt-1">الرياضيات (متقدم) ، الفيزياء (متقدم)</strong>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-amber-500 block">مسار الأعمال:</span>
                <strong className="text-sm text-amber-900 block mt-1">اقتصاد (متقدم) ، رياضيات ، إحصاء</strong>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-purple-400 block">مسار الآداب والفنون:</span>
                <strong className="text-sm text-purple-900 block mt-1">جغرافيا (متقدم) ، إحصاء</strong>
              </div>
            </div>
          </div>

          {/* Thanaweya G12 */}
          <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-300 overflow-hidden relative">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 text-center">
              <h4 className="text-lg font-bold flex justify-center items-center gap-2"><BookOpen size={20}/> الثانوية العامة (نظام الشعب)</h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-4 items-center">
                <span className="text-sm font-bold text-slate-700 w-24 shrink-0">علمي علوم:</span>
                <span className="text-sm text-slate-600">عربي، إنجليزي، <strong className="text-emerald-700">أحياء، كيمياء، فيزياء</strong></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-4 items-center">
                <span className="text-sm font-bold text-slate-700 w-24 shrink-0">علمي رياضة:</span>
                <span className="text-sm text-slate-600">عربي، إنجليزي، <strong className="text-blue-700">رياضيات، كيمياء، فيزياء</strong></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-4 items-center">
                <span className="text-sm font-bold text-slate-700 w-24 shrink-0">أدبي:</span>
                <span className="text-sm text-slate-600">عربي، إنجليزي، <strong className="text-purple-700">تاريخ، جغرافيا، إحصاء</strong></span>
              </div>
              <div className="pt-2 text-center text-xs text-slate-400">
                + المواد غير المضافة للمجموع حسب اللائحة.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- ✨ UPDATED FEATURE: Dream Architect (LLM Powered) ---
function DreamArchitect() {
  const [dreamText, setDreamText] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const resultRef = useRef(null);

  const validateInput = () => {
    const text = dreamText.trim();
    const words = text.split(/\s+/);
    
    // Check for gibberish and very short inputs
    if (words.length < 2 || text.length < 8) {
      return "يا بطل، الإجابة قصيرة جداً ومش واضحة. ياريت تشرح حلمك أو شغفك بكلمات حقيقية وواضحة (جملة على الأقل) عشان الذكاء الاصطناعي يقدر يحللها صح!";
    }
    
    // Prevent repeated character gibberish like "شسيشسيشسي"
    const uniqueChars = new Set(text.replace(/\s/g, '')).size;
    if (text.length > 8 && uniqueChars < 4) {
      return "عذراً! يبدو أن الكلام المكتوب عبارة عن حروف عشوائية. يرجى كتابة شغفك بكلمات حقيقية.";
    }
    return "";
  };

  const handleAnalyze = async () => {
    if (!dreamText) return;
    
    const validationError = validateInput();
    if (validationError) {
      setErrorMsg(validationError);
      setRecommendation('');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setRecommendation('');

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    const prompt = `شغفي واهتماماتي هي: "${dreamText}". ما هو مساري الأكاديمي والمهني؟`;
    const aiResponse = await fetchGeminiAPI(prompt, DREAM_ARCHITECT_PROMPT);
    
    setRecommendation(aiResponse);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center bg-rose-100 text-rose-600 p-4 rounded-full mb-4 shadow-sm border border-rose-200">
          <Rocket size={40} />
        </div>
        <h2 className="text-3xl font-bold text-rose-600 mb-3 flex justify-center items-center gap-2">
           مهندس الأحلام <Star className="text-yellow-500 fill-yellow-500" />
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
          مش عارف إيه المواد اللي بتحبها؟ مش مشكلة! اكتب لي هنا إيه أكتر حاجة بتستمتع بتعملها في يومك (حتى لو لعب، رسم، تصوير، أو تجميع أجهزة) وسأقوم بتحليل شغفك لاكتشاف مسارك الأكاديمي.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Target size={18} className="text-rose-500"/> أوصف لي شغفك بحرية:
          </label>
          <textarea 
            rows="4"
            placeholder="مثال: أنا بحب جداً أسمع مشاكل صحابي وأحلها، وبحب أقرا عن لغة الجسد... أو بحب ألعب جيمنج ونفسي أصمم شخصيات..."
            value={dreamText}
            onChange={(e) => {
              setDreamText(e.target.value);
              setErrorMsg(''); 
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
          </div>
        )}
        
        <button 
          onClick={handleAnalyze}
          disabled={!dreamText || isAnalyzing}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            (!dreamText) 
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:from-pink-600 hover:to-rose-700'
          }`}
        >
          {isAnalyzing ? (
            <><Loader2 className="animate-spin" size={20} /> جاري اكتشاف مستقبلك...</>
          ) : (
            <><Star size={20} className="fill-white" /> ارسم لي مستقبلي ✨</>
          )}
        </button>
      </div>

      <div ref={resultRef} className="scroll-mt-6">
        {(isAnalyzing || recommendation) && (
          <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
            recommendation ? 'bg-gradient-to-br from-rose-50 to-white border-rose-200 shadow-lg' : 'bg-white border-slate-200 shadow-sm flex items-center justify-center min-h-[200px]'
          }`}>
            
            {isAnalyzing && (
              <div className="text-center space-y-4 text-rose-500 mt-6">
                <Rocket size={48} className="mx-auto animate-bounce" />
                <p className="animate-pulse font-bold text-lg">مهندس الأحلام يربط بين شغفك والمستقبل...</p>
              </div>
            )}

            {recommendation && !isAnalyzing && (
              <div className="space-y-4 animate-fade-in text-slate-800">
                <div 
                  className="leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(recommendation, 'rose') }} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ✨ UPDATED FEATURE 1: Smart Advisor (LLM Powered) ---
function SmartAdvisor() {
  const [formData, setFormData] = useState({
    subjects: '',
    testStyle: '',
    dreamJob: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const resultRef = useRef(null);

  const validateInputs = () => {
    const subjects = formData.subjects.trim();
    const job = formData.dreamJob.trim();
    
    // Force user to write at least two words for real input
    const subWords = subjects.split(/\s+/).length;
    const jobWords = job.split(/\s+/).length;

    if (subjects.length < 4 || job.length < 4 || subWords < 1 || jobWords < 1) {
      return "عذراً! يبدو أن إجاباتك قصيرة جداً أو غير واضحة. يرجى كتابة موادك المفضلة وحلمك بكلمات حقيقية وواضحة لكي الذكاء الاصطناعي يقدر يساعدك.";
    }
    
    // Prevent random character spam (e.g. "شسيشسيشسيشسي")
    const uniqueCharsJob = new Set(job.replace(/\s/g, '')).size;
    const uniqueCharsSub = new Set(subjects.replace(/\s/g, '')).size;
    
    if ((job.length > 6 && uniqueCharsJob <= 3) || (subjects.length > 6 && uniqueCharsSub <= 3)) {
       return "عذراً! الكلمات المدخلة تبدو وكأنها حروف عشوائية. أرجوك اكتب بيانات حقيقية لضمان نتيجة دقيقة.";
    }
    return ""; 
  };

  const handleAnalyze = async () => {
    if (!formData.subjects || !formData.testStyle || !formData.dreamJob) return;
    
    const validationError = validateInputs();
    if (validationError) {
      setErrorMsg(validationError);
      setRecommendation('');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setRecommendation('');

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    const prompt = `بياناتي هي:
    - المواد التي أتفوق فيها وأحبها: ${formData.subjects}
    - طريقتي المفضلة في الامتحانات والتقييم: ${formData.testStyle}
    - حلمي ومستقبلي المهني: ${formData.dreamJob}
    أرجو تحليل هذه البيانات وإخباري أي نظام (بكالوريا أم ثانوية عامة) هو الأنسب لي وما هو مساري المستقبلي.`;

    const aiResponse = await fetchGeminiAPI(prompt, ADVISOR_PROMPT);
    
    setRecommendation(aiResponse);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 p-4 rounded-full mb-4 shadow-sm border border-indigo-200">
          <BrainCircuit size={40} />
        </div>
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3 flex justify-center items-center gap-2">
           المستشار الأكاديمي <Sparkles className="text-yellow-500" />
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
          أجب عن الأسئلة الثلاثة البسيطة التالية بوضوح، وسيقوم مستشارنا الذكي بتحليل شخصيتك الأكاديمية لاقتراح النظام والمسار الأمثل لك.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6 relative overflow-hidden">
        <div className="mt-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">1. ما هي المواد التي تشعر أنك متميز فيها وتحب دراستها؟</label>
          <input 
            type="text" 
            placeholder="مثال: الرياضيات والفيزياء، أو التاريخ واللغات..."
            value={formData.subjects}
            onChange={(e) => {
              setFormData({...formData, subjects: e.target.value});
              setErrorMsg('');
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">2. كيف تفضل أن يتم تقييمك وامتحانك؟</label>
          <select 
            value={formData.testStyle}
            onChange={(e) => setFormData({...formData, testStyle: e.target.value})}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="" disabled>اختر طريقة التقييم المفضلة...</option>
            <option value="أفضل وجود أكثر من فرصة لتحسين المجموع (نظام المحاولات المتعددة)">أفضل وجود أكثر من فرصة لتحسين المجموع (فرص متعددة)</option>
            <option value="أفضل التركيز والمذاكرة لامتحان نهائي واحد يحدد مصيري">أفضل التركيز والمذاكرة لامتحان نهائي واحد يحدد مصيري</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">3. ما هو حلمك الأكبر أو الوظيفة التي تتمناها؟</label>
          <input 
            type="text" 
            placeholder="مثال: مهندس برمجيات، طبيب جراح، محامي دولي..."
            value={formData.dreamJob}
            onChange={(e) => {
              setFormData({...formData, dreamJob: e.target.value});
              setErrorMsg('');
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
          </div>
        )}
        
        <button 
          onClick={handleAnalyze}
          disabled={!formData.subjects || !formData.testStyle || !formData.dreamJob || isAnalyzing}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            (!formData.subjects || !formData.testStyle || !formData.dreamJob) 
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-blue-700'
          }`}
        >
          {isAnalyzing ? (
            <><Loader2 className="animate-spin" size={20} /> جاري تحليل البيانات وصياغة النصيحة...</>
          ) : (
            <><Sparkles size={20} /> اكتشف مسارك الأنسب ✨</>
          )}
        </button>
      </div>

      <div ref={resultRef} className="scroll-mt-6">
        {(isAnalyzing || recommendation) && (
          <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
            recommendation ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-lg' : 'bg-white border-slate-200 shadow-sm flex items-center justify-center min-h-[200px]'
          }`}>
            
            {isAnalyzing && (
              <div className="text-center space-y-4 text-indigo-600 mt-6">
                <BrainCircuit size={48} className="mx-auto animate-pulse" />
                <p className="animate-pulse font-bold text-lg">المستشار الذكي يقرأ أفكارك ويجهز نصيحته الآن...</p>
              </div>
            )}

            {recommendation && !isAnalyzing && (
              <div className="space-y-4 animate-fade-in text-slate-800">
                <div 
                  className="leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(recommendation, 'indigo') }} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Global Helper to roughly parse markdown from the LLM output with theme support
function formatMarkdown(text, theme = 'indigo') {
  if (!text) return "";
  
  let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  // Theme Colors setup
  const headerBg = theme === 'rose' ? 'bg-rose-50/70 border-rose-100 text-rose-700' : 'bg-indigo-50/70 border-indigo-100 text-indigo-700';
  const mainTitleColor = theme === 'rose' ? 'text-rose-600 border-rose-200' : 'text-[#1e3a8a] border-blue-100';
  const boldBg = theme === 'rose' ? 'bg-rose-50 text-rose-900' : 'bg-indigo-50 text-indigo-900';
  const iconColor = theme === 'rose' ? 'text-rose-500' : 'text-purple-500';
  const numBg = theme === 'rose' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200';

  // Headers styling
  html = html.replace(/^### (.*$)/gim, `<h4 class="text-lg font-bold mt-6 mb-4 flex items-center gap-2 p-2 px-4 rounded-xl w-fit border shadow-sm ${headerBg}">$1</h4>`);
  html = html.replace(/^## (.*$)/gim, `<h3 class="text-xl font-bold mt-6 mb-3 border-b-2 pb-2 inline-block ${mainTitleColor}">$1</h3>`);
  html = html.replace(/^# (.*$)/gim, `<h2 class="text-2xl font-bold mt-6 mb-4 ${mainTitleColor}">$1</h2>`);

  // Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, `<strong class="px-1.5 py-0.5 rounded-md ${boldBg}">$1</strong>`);
  html = html.replace(/\*(.*?)\*/g, '<em class="text-slate-600">$1</em>');

  // Bullet Lists
  html = html.replace(/^(?:-|\*)\s+(.*$)/gim, `<div class="flex items-start gap-3 mb-3 leading-relaxed"><span class="font-bold shrink-0 text-lg leading-none mt-1 ${iconColor}">✨</span><span class="text-slate-700">$1</span></div>`);
  
  // Numbered Lists
  html = html.replace(/^(\d+)\.\s+(.*$)/gim, `<div class="flex items-start gap-3 mb-3 leading-relaxed"><span class="font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5 shadow-sm border ${numBg}">$1</span><span class="text-slate-700">$2</span></div>`);

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p class="mb-4 text-slate-700 leading-relaxed text-[15px]">');
  html = html.replace(/\n/g, '<br/>');

  return `<div class="text-base text-slate-700 font-medium"><p class="mb-4 leading-relaxed text-[15px]">${html}</p></div>`;
}

function formatChatMarkdown(text) {
  if (!text) return "";
  let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

// --- Information Components ---

function GeneralRules() {
  const rules = [
    { title: "حرية الاختيار", desc: "لا يوجد إجبار على اختيار نظام بعينه، ومن حقك اختيار النظام الأنسب لقدراتك.", icon: <CheckCircle2 className="text-green-500" /> },
    { title: "التحويل بين الأنظمة", desc: "لا يجوز قانوناً التحويل من الثانوية العامة للبكالوريا أو العكس بعد اختيار النظام.", icon: <AlertCircle className="text-red-500" /> },
    { title: "تنسيق الجامعات", desc: "قواعد القبول في الجامعات الحكومية والخاصة ثابتة لكلا النظامين دون تفرقة.", icon: <School className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-[#1e3a8a] mb-6">أهم القواعد والأسس</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              {rule.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{rule.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{rule.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          <GraduationCap className="w-12 h-12 text-[#1e3a8a] mb-4" />
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">نظام البكالوريا المصرية</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-[#f59e0b] shrink-0" /> <span><strong>٦ مواد دراسية فقط</strong> في الصفين الثاني والثالث.</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-[#f59e0b] shrink-0" /> <span>التربية الدينية خارج المجموع.</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-[#f59e0b] shrink-0" /> <span>يوفر <strong>فرصاً امتحانية متعددة</strong> في كل مادة بكامل الدرجة لتحسين المجموع.</span></li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-slate-200 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-4">نظام الثانوية العامة</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-slate-500 shrink-0" /> <span><strong>١١ مادة دراسية</strong> في الصفين الثاني والثالث.</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-slate-500 shrink-0" /> <span>مواد خارج المجموع (دين، وطنية، لغة ثانية).</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 size={20} className="text-slate-500 shrink-0" /> <span>يوفر <strong>فرصة امتحان واحدة فقط</strong> بالإضافة لدور ثاني بنصف الدرجة.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- ✨ UPDATED FEATURE: Separated Colleges Directory ---
function Colleges() {
  const [activeSystemView, setActiveSystemView] = useState('baccalaureate');
  const [openAccordions, setOpenAccordions] = useState({ 0: true });

  const toggle = (idx) => {
    setOpenAccordions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const baccalaureateData = [
    {
      track: "مسار الطب وعلوم الحياة",
      colleges: [
        "الطب البشري", "طب الأسنان", "الصيدلة", "العلاج الطبيعي", "الطب البيطري", 
        "التمريض", "العلوم (علوم)", "الزراعة", "كليات الثروة السمكية والمصايد والاستزراع المائي", 
        "معهد دراسات وبحوث تكنولوجيا السكر", "تكنولوجيا العلوم الصحية التطبيقية", 
        "البنات (علوم)", "البنات (اقتصاد منزلي)"
      ],
      color: "blue"
    },
    {
      track: "مسار الهندسة وعلوم الحاسب",
      colleges: [
        "الهندسة", "التخطيط العمراني", "الحاسبات والمعلومات والذكاء الاصطناعي", 
        "الفنون التطبيقية", "الفنون الجميلة (عمارة)", "علوم الملاحة وتكنولوجيا الفضاء", 
        "علوم الأرض", "علوم البترول والتعدين", "التنمية والتكنولوجيا (زراعية)", 
        "العلوم (رياضة)", "التربية (رياضة)", "التعليم الصناعي", "الزراعة (هندسة زراعية)", 
        "المصرية الصينية التكنولوجية"
      ],
      color: "amber"
    },
    {
      track: "مسار الأعمال",
      colleges: [
        "التجارة (الأعمال)", "الاقتصاد والعلوم السياسية", 
        "التنمية والتكنولوجيا (مالية وإدارية)", "تكنولوجيا الإدارة ونظم المعلومات"
      ],
      color: "green"
    },
    {
      track: "مسار الآداب والفنون",
      colleges: [
        "الحقوق", "الآداب (باستثناء الجغرافيا وعلم النفس لمسار الآداب بالبكالوريا)", 
        "الألسن (بشرط دراسة لغة أجنبية ثانية)", "الإعلام", "الآثار", "السياحة والفنادق", 
        "الفنون الجميلة (فنون)", "التربية للطفولة المبكرة", "علوم ذوي الإعاقة والتأهيل", 
        "علوم ذوي الاحتياجات الخاصة", "التربية النوعية", "التربية الفنية", "التربية الموسيقية", 
        "التربية (أدبي)", "التربية (طفولة)", "التربية (تعليم أساسي الحلقة الابتدائية)", 
        "الاقتصاد المنزلي", "الخدمة الاجتماعية", "دار العلوم", "علوم الرياضة (التربية الرياضية سابقا)", 
        "البنات (آداب - تربية - طفولة)"
      ],
      color: "purple"
    }
  ];

  const thanaweyaData = [
    {
      track: "شعبة علمي علوم",
      colleges: [
        "الطب البشري", "طب الأسنان", "الصيدلة", "العلاج الطبيعي", "الطب البيطري", 
        "التمريض", "العلوم (علوم)", "الزراعة", "كليات الثروة السمكية والمصايد والاستزراع المائي", 
        "معهد دراسات وبحوث تكنولوجيا السكر", "تكنولوجيا العلوم الصحية التطبيقية", 
        "البنات (علوم)", "البنات (اقتصاد منزلي)"
      ],
      color: "emerald"
    },
    {
      track: "شعبة علمي رياضة",
      colleges: [
        "الهندسة", "التخطيط العمراني", "الحاسبات والمعلومات والذكاء الاصطناعي", 
        "الفنون التطبيقية", "الفنون الجميلة (عمارة)", "علوم الملاحة وتكنولوجيا الفضاء", 
        "علوم الأرض", "علوم البترول والتعدين", "التنمية والتكنولوجيا (زراعية)", 
        "العلوم (رياضة)", "التربية (رياضة)", "التعليم الصناعي", "الزراعة (هندسة زراعية)", 
        "المصرية الصينية التكنولوجية"
      ],
      color: "blue"
    },
    {
      track: "شعبة أدبي (تتضمن كليات الآداب والأعمال وغيرها)",
      colleges: [
        "التجارة", "الاقتصاد والعلوم السياسية", "الحقوق", "الآداب (متاح بها الجغرافيا وعلم النفس)", 
        "الألسن", "الإعلام", "الآثار", "السياحة والفنادق", 
        "الفنون الجميلة (فنون)", "التربية للطفولة المبكرة", "علوم ذوي الإعاقة والتأهيل", 
        "علوم ذوي الاحتياجات الخاصة", "التربية النوعية", "التربية الفنية", "التربية الموسيقية", 
        "التربية (أدبي)", "التربية (طفولة)", "التربية (تعليم أساسي الحلقة الابتدائية)", 
        "الاقتصاد المنزلي", "الخدمة الاجتماعية", "دار العلوم", "علوم الرياضة (التربية الرياضية سابقا)", 
        "البنات (آداب - تربية - طفولة)"
      ],
      color: "purple"
    }
  ];

  const currentData = activeSystemView === 'baccalaureate' ? baccalaureateData : thanaweyaData;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">دليل الكليات وفقاً للنظامين</h2>
        <p className="text-slate-600 mb-6">اختر النظام لمعرفة الكليات المتاحة لك بناءً على مسارك أو شعبتك.</p>
        
        {/* Toggle Switch */}
        <div className="inline-flex bg-slate-200 rounded-full p-1 shadow-inner max-w-full overflow-x-auto">
          <button 
            onClick={() => {setActiveSystemView('baccalaureate'); setOpenAccordions({0: true})}}
            className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all whitespace-nowrap ${
              activeSystemView === 'baccalaureate' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            مسارات البكالوريا المصرية
          </button>
          <button 
            onClick={() => {setActiveSystemView('thanaweya'); setOpenAccordions({0: true})}}
            className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all whitespace-nowrap ${
              activeSystemView === 'thanaweya' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            شعب الثانوية العامة
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
        {currentData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 last:mb-0">
            <button 
              onClick={() => toggle(idx)}
              className={`w-full flex justify-between items-center p-5 text-right font-bold transition ${openAccordions[idx] ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap className={`text-${item.color}-500`} size={20} />
                {item.track}
              </span>
              {openAccordions[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openAccordions[idx] && (
              <div className="p-5 border-t border-slate-100 bg-white">
                <div className="flex flex-wrap gap-2">
                  {item.colleges.map((college, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                      {college}
                    </span>
                  ))}
                  <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm italic border border-slate-200">
                    وغيرها من المعاهد العليا...
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl text-center border border-blue-100/50">
          <p className="text-blue-800 text-sm font-medium">ملاحظة هامة: الجامعات التكنولوجية والمعاهد العليا والمتوسطة تقبل الطلاب في نفس التخصصات المناظرة لمساراتهم.</p>
        </div>
      </div>
    </div>
  );
}

// --- Chatbot Component ---
function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { text: "أهلاً بك! أنا المساعد الذكي الخاص بدليل المرحلة الثانوية ✨. هل لديك أي سؤال بخصوص النظامين أو شروط الكليات؟", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Handle scroll to dynamically adjust the chat widget's bottom offset
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('main-footer');
      if (!footer) return;
      
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (footerTop < windowHeight) {
        // Footer is entering the viewport
        const overlap = windowHeight - footerTop;
        setBottomOffset(overlap + 24); // 24px above the footer
      } else {
        // Footer is not in view
        setBottomOffset(24); // Default base offset (24px)
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setIsLoading(true);

    const botResponse = await fetchGeminiAPI(userMsg, CHATBOT_PROMPT);
    
    setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed left-6 md:left-8 bg-[#f59e0b] hover:bg-amber-500 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 group transform hover:scale-110 transition-transform"
          style={{ bottom: `${bottomOffset}px` }}
        >
          <MessageCircle size={28} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold px-1 flex items-center gap-1">
             اسأل المساعد الذكي <Sparkles size={14} />
          </span>
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed left-6 md:left-8 w-[90vw] max-w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-slide-up"
          style={{ 
            bottom: `${bottomOffset}px`,
            maxHeight: `calc(100vh - ${bottomOffset + 24}px)` // Prevents window from cropping at the top
          }}
        >
          <div className="bg-gradient-to-r from-blue-900 to-[#1e3a8a] text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <MessageCircle size={20} />
                <span className="absolute -top-1 -right-1 text-yellow-300"><Sparkles size={12}/></span>
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-1">المساعد الطلابي الذكي</h3>
                <p className="text-xs text-blue-200">مدعوم بـ Gemini LLM</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.isBot 
                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tr-sm shadow-sm' 
                    : 'bg-[#1e3a8a] text-white rounded-tl-sm shadow-md'
                }`}>
                  {msg.isBot ? (
                    <div dangerouslySetInnerHTML={{ __html: formatChatMarkdown(msg.text) }} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-tr-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span className="text-xs">جاري التفكير...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 pr-4">
               <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full transition ${input.trim() ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}
              >
                <Send size={18} className="rotate-180" /> 
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}