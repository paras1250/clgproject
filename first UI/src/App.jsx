import React from 'react'
import './index.css'

const Logo = () => (
  <div className="flex items-center gap-1 cursor-pointer relative z-10">
    <svg width="132" height="43" viewBox="0 0 132 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#0A0807" stroke="#0A0807" strokeWidth=".6" d="M11.467 1.645c5.945 0 10.768 4.79 10.768 10.703v11.656H16.66V12.34c0-2.82-2.301-5.11-5.144-5.11h-.096c-2.842 0-5.143 2.29-5.143 5.11v11.664H.7V12.348l.014-.551C1.002 6.14 5.708 1.645 11.467 1.645Zm52.16 23.679c-5.945 0-10.767-4.79-10.767-10.703V2.965h5.576v11.664c0 2.82 2.301 5.11 5.143 5.11h.097c2.842 0 5.142-2.29 5.143-5.11V2.965h5.576V14.62l-.014.55c-.288 5.658-4.995 10.153-10.754 10.153Z"></path>
      <path fill="#0A0807" d="M37.48 2.944c6.185 0 11.2 4.943 11.2 11.04 0 6.097-5.015 11.04-11.2 11.04-6.186 0-11.2-4.942-11.2-11.04 0-6.097 5.014-11.04 11.2-11.04Zm0 4.54a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path>
      <path fill="#0A0807" stroke="#0A0807" strokeWidth=".3" d="M114.946 3.16a11.38 11.38 0 0 1 10.458 2.405l.225.2a11.263 11.263 0 0 1 2.634 3.709l.049.11-.098.072-4.063 2.953h-.001l-9.379 6.8c.285.162.593.304.914.427l.295.093c.298.087.606.158.922.214.417.052.849.077 1.267.058l.316-.024a6.23 6.23 0 0 0 .972-.182c.839-.225 1.589-.59 2.208-1.08l.002-.002.236-.192c.537-.46.982-.998 1.342-1.586a5.409 5.409 0 0 0 .761-2.158l.013-.1 5.193-1.391.005.189c.02.622-.004 1.26-.087 1.865a10.987 10.987 0 0 1-1.426 4.089h-.001c-.742 1.238-1.689 2.363-2.869 3.262h.001c-1.152.915-2.535 1.6-4.041 2.004-.838.225-1.666.353-2.497.39l-.356.01c-.951.014-1.887-.1-2.778-.32a11.486 11.486 0 0 1-2.272-.805l-.308-.15a11.505 11.505 0 0 1-2.268-1.523l-.001-.001a11.217 11.217 0 0 1-2.86-3.909l.001-.001a10.135 10.135 0 0 1-.58-1.613c-1.605-5.99 2.021-12.192 8.071-13.814Zm1.331 4.877c-3.205.859-5.166 4.083-4.509 7.252l9.19-6.666c-1.37-.752-3.046-1.024-4.681-.586Z"></path>
      <path fill="#0A0807" stroke="#0A0807" strokeWidth=".6" d="M93.364 7.882c3.302.885 5.277 4.222 4.42 7.422-.858 3.2-4.237 5.103-7.539 4.219-3.302-.885-5.277-4.223-4.42-7.423.858-3.2 4.237-5.102 7.54-4.218Zm-12.723 2.399-7.109 26.345-.078.29 5.316 1.425 4.542-16.952a11.781 11.781 0 0 0 5.547 3.306c6.216 1.666 12.618-1.913 14.246-7.989 1.628-6.076-2.127-12.375-8.343-14.04-6.076-1.629-12.298 1.753-14.106 7.559l-.004.01v.001l-.011.044Z"></path>
    </svg>
    <svg className="absolute -bottom-1 -left-1 translate-y-[2px] translate-x-[45px]" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.1079 23.4239C28.3199 24.234 28.6599 25.8921 27.6618 26.9546C26.4716 28.2216 25.0787 29.2906 23.5348 30.1148C21.2116 31.355 18.6182 32.0025 15.9847 32C13.3512 31.9975 10.7591 31.345 8.43825 30.1004C6.89591 29.2732 5.50509 28.2016 4.31731 26.9323C3.32124 25.8679 3.66434 24.2104 4.8779 23.4027V23.4027C6.09147 22.595 7.71306 22.9562 8.79221 23.9363C9.43894 24.5236 10.1575 25.032 10.9332 25.448C12.4883 26.2819 14.2252 26.7192 15.9898 26.7208C17.7543 26.7225 19.492 26.2886 21.0487 25.4577C21.8252 25.0431 22.5448 24.5362 23.1926 23.95C24.2736 22.972 25.8959 22.6139 27.1079 23.4239V23.4239Z" fill="#D200D3"></path>
    </svg>
  </div>
)

const BackgroundClouds = () => (
  <div className="absolute top-0 left-0 w-full h-[130%] pointer-events-none -z-10 overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 2269 954" fill="none" preserveAspectRatio="xMidYMid slice">
      <g className="noupe-cloud-1">
        <rect x="1561" y="444" width="328" height="316" rx="158" fill="#FEE4D4" filter="blur(72px)"></rect>
      </g>
      <g className="noupe-cloud-2" opacity="0.7">
        <rect x="1628" y="683.685" width="514" height="207" rx="103.5" transform="rotate(-36.0777 1628 683.685)" fill="#FFB6C5" filter="blur(72px)"></rect>
      </g>
      <g className="noupe-cloud-3" opacity="0.8">
        <rect x="144" y="215" width="353" height="307" rx="130" fill="#FDC6D1" filter="blur(72px)"></rect>
      </g>
    </svg>
  </div>
)

const ChatbotMockup = () => (
  <div className="relative w-full max-w-[420px]">
    <div className="absolute -top-16 -right-12 z-20 hidden md:block rotate-3">
      <div className="bg-[#D200D3] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span className="noupe-bold text-sm whitespace-nowrap">You have 1 new conversation</span>
      </div>
    </div>

    <div className="chatbot-container h-[550px]">
      <div className="chatbot-container-header">
        <img src="/assets/ai_agent_avatar.png" className="w-8 h-8 rounded-full bg-white p-0.5" alt="AI Agent" />
        <span className="noupe-medium text-xs">AI Assistant</span>
        <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>

      <div className="chatbot-container-body flex-1">
        <div className="noupe-message user self-end h-8 w-2/3"></div>

        <div className="noupe-message agent">
          <div className="thinking-dots">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
          <p className="text-gray-800">
            Hello! 🍕 This pizzeria offers a variety of <strong>pizzas, pastas, salads, and desserts.</strong> You can order for delivery, takeaway, or dine in.
          </p>
          <span className="text-[10px] noupe-bold text-blue-600 uppercase mt-1">Noupe AI Answered</span>
        </div>

        <div className="noupe-message user self-end h-8 w-1/2"></div>

        <div className="noupe-message agent">
          <div className="thinking-dots">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
          <p className="text-gray-800">
            Yes, absolutely! 🥦 We offer vegetarian pizzas, pastas with seasonal veggies, and fresh salads.
          </p>
          <span className="text-[10px] noupe-bold text-blue-600 uppercase mt-1">Noupe AI Answered</span>
        </div>
      </div>
    </div>
  </div>
)

const FeatureCard = ({ title, description, image, fullWidth, bgClass = "bg-beige" }) => (
  <div className={`${bgClass} rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center gap-10 text-center ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="max-w-2xl px-4">
      <h3 className="text-3xl md:text-4xl noupe-bold mb-4 text-primary">{title}</h3>
      <p className="text-quaternary text-lg md:text-xl noupe-medium leading-relaxed">{description}</p>
    </div>
    <div className="w-full">
      <img src={`/assets/${image}`} alt={title} className="w-full h-auto rounded-3xl" />
    </div>
  </div>
)

const Hero = () => (
  <section className="relative px-6 md:px-20 py-10 md:py-24 max-w-[1400px] mx-auto min-h-[85vh] flex items-center">
    <BackgroundClouds />

    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center w-full">
      <div className="text-left animate-in fade-in slide-in-from-left-8 duration-700">
        <h1 className="text-5xl md:text-[5.5rem] noupe-semibold leading-[1.05] tracking-tight mb-8 text-primary">
          AI Chatbot for your site
        </h1>
        <p className="text-xl md:text-2xl text-quaternary noupe-medium leading-relaxed mb-12 max-w-xl">
          Noupe AI chatbot instantly learns from your website and uses that knowledge to answer visitor questions — automatically.
        </p>

        <div className="flex flex-col gap-4 max-w-md">
          <button className="noupe-button noupe-button-google py-5 text-xl relative group">
            <span className="absolute left-4 bg-white p-1.5 rounded-full shadow-sm">
              <img src="/assets/google.svg" width="22" alt="Google" />
            </span>
            <span className="flex items-center gap-2">
              Sign Up with Google
              <svg className="w-6 h-6 pt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.707 6.293a1 1 0 1 0-1.414 1.414L16.586 11H5a1 1 0 1 0 0 2h11.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5Z" /></svg>
            </span>
          </button>

          <button className="noupe-button noupe-button-primary py-5 text-xl group">
            <span className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M1 7.52V18a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V7.52l-9.28 6.496a3 3 0 0 1-3.44 0L1 7.521Zm21.881-2.358A3.001 3.001 0 0 0 20 3H4a3.001 3.001 0 0 0-2.881 2.162l10.308 7.216a1 1 0 0 0 1.146 0l10.308-7.216Z" /></svg>
              Sign Up with an email
              <svg className="w-6 h-6 pt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.707 6.293a1 1 0 1 0-1.414 1.414L16.586 11H5a1 1 0 1 0 0 2h11.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5Z" /></svg>
            </span>
          </button>
        </div>
        <p className="mt-8 text-gray-500 font-semibold text-sm">It's free. No credit card required.</p>
      </div>

      <div className="flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000">
        <ChatbotMockup />
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="bg-primary text-white py-20 px-6">
    <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 text-center text-gray-400">
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
        {["Terms & Conditions", "Privacy Policy", "About Us", "Contact Us", "Pricing", "Embed Guide"].map(item => (
          <a key={item} href="#" className="hover:text-tertiary transition-colors font-medium">{item}</a>
        ))}
      </div>
      <div className="max-w-3xl text-sm leading-relaxed text-gray-500">
        Noupe is a <a href="#" className="text-white hover:underline">free AI chatbot builder</a> that creates AI chatbots in minutes, trusted by businesses worldwide. Noupe (Jotform Inc.) 4 Embarcadero Center, Suite 780, San Francisco CA 94111.
      </div>
    </div>
  </footer>
)

const App = () => (
  <div className="min-h-screen selection:bg-tertiary/20">
    <header className="px-6 md:px-12 py-8 flex justify-between items-center relative md:sticky top-0 z-50 noupe-blur-white">
      <Logo />
      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-10 mr-4">
          {["Solutions", "Blog", "Pricing", "Login"].map(item => (
            <a key={item} href="#" className="noupe-medium text-primary hover:text-tertiary transition-colors text-lg">{item}</a>
          ))}
        </nav>
        <button className="noupe-button noupe-button-primary px-6 py-3 text-md hidden md:flex">Sign Up for Free</button>
        <div className="w-10 h-10 bg-primary rounded-full md:flex hidden flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-opacity-80 transition-all">
          <div className="w-4 h-[1px] bg-white"></div>
          <div className="w-4 h-[1px] bg-white my-[1px]"></div>
          <div className="w-4 h-[1px] bg-white"></div>
        </div>
      </div>
    </header>

    <Hero />

    <section className="bg-primary text-white py-32 px-6">
      <div className="max-w-[1100px] mx-auto text-center mb-24">
        <h2 className="text-5xl md:text-[5rem] noupe-semibold leading-[1.05] mb-8">
          Key features that <span className="italic font-normal noupe-color-tertiary">power</span> your business
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto noupe-medium">
          Noupe is packed with customer service–ready features designed to reduce support workload while improving customer experience.
        </p>
      </div>

      <div className="max-w-[1300px] mx-auto grid gap-10 md:grid-cols-2">
        <FeatureCard
          title="Learns from your website content"
          description="Noupe reads your public pages and builds an answer base automatically."
          image="noupe_learn_website_content.png"
          fullWidth
        />
        <FeatureCard
          title="Instant setup, no coding required"
          description="Grab your embed code and drop it into your site. That's all Noupe needs to get to work."
          image="noupe_embed_setup.png"
        />
        <FeatureCard
          title="Knowledge Base"
          description="Train Noupe with your own content. Add documents and Q&A so your Noupe can answer with your knowledge."
          image="noupe_knowledge_base.png"
        />
        <FeatureCard
          title="Customization Options"
          description="Make Noupe fit your site. Adjust size, alignment, color and avatar for a seamless look."
          image="noupe_custom_branding.png"
        />
        <FeatureCard
          title="Custom First Message"
          description="Set a custom first message that greets visitors in your tone. Make Noupe’s first impression feel just like your own."
          image="noupe_custom_first_message.png"
        />
        <FeatureCard
          title="Get conversations"
          description="Every conversation is sent to your inbox in real time. See what customers ask and follow up fast."
          image="noupe_conversation_mail.png"
          bgClass="bg-green-card"
        />
        <FeatureCard
          title="Multi-Language support"
          description="Noupe detects each visitor's language and answers automatically."
          image="noupe_multi_language_support.png"
          bgClass="bg-orange-card"
        />
      </div>
    </section>

    <section className="py-32 px-6 max-w-[1200px] mx-auto text-center">
      <h2 className="text-4xl md:text-6xl noupe-semibold mb-16 tracking-tight">
        Why you will <span className="italic font-normal noupe-color-tertiary">love Noupe</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { text: "Launches in minutes — no code, no training", icon: "rocket" },
          { text: "Works in every language, on any website", icon: "globe" },
          { text: "Sends conversations directly to your inbox", icon: "mail" },
          { text: "100% free until 2026", icon: "gift" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shrink-0 text-primary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            </div>
            <span className="text-xl noupe-bold text-primary">{item.text}</span>
          </div>
        ))}
      </div>
    </section>

    <Footer />
  </div>
)

export default App
