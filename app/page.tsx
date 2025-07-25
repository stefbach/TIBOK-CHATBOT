"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, Bot, User, Clock, MapPin, Shield, Pill, Phone, Timer, Users, Globe } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isRedirect?: boolean
  showWaitTime?: boolean
}

interface Language {
  name: string
  flag: string
  welcome: string
}

const TeleconsultationChatbot = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [waitTime, setWaitTime] = useState<string | null>(null)
  const [isCheckingWaitTime, setIsCheckingWaitTime] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages: Record<string, Language> = {
    mf: {
      name: "Kreol Morisien",
      flag: "🇲🇺",
      welcome:
        "👋 Bonzour! Mo TIBOK assistant! Mo la pou ede ou ek nou service téléconsultation 100% morisien. Mo capav explik ou tout bagay lor nou service, prix, livraison médicament, ek mo pou ede ou commence enn consultation. Ki manyer mo capav ede ou zordi?",
    },
    fr: {
      name: "Français",
      flag: "🇫🇷",
      welcome:
        "👋 Bienvenu dan TIBOK ! Mo enn assistant pou nou service téléconsultation 100% Maurice. Mo capav renseign ou lor nou service, tarifs, livraison médicaments, ek mo pou ede ou commence enn consultation. Couma mo capav ede ou zordi ?",
    },
    en: {
      name: "English",
      flag: "🇬🇧",
      welcome:
        "👋 Welcome to TIBOK! I am your assistant for our 100% Mauritian teleconsultation service. I can provide information about our service, pricing, medication delivery, and help you start a consultation. How can I help you today?",
    },
  }

  useEffect(() => {
    if (selectedLanguage && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: languages[selectedLanguage].welcome,
          timestamp: new Date(),
        },
      ])
    }
  }, [selectedLanguage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  // Écran de sélection de langue
  if (!selectedLanguage) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <div className="bg-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">TIBOK</h1>
              <p className="text-gray-600 text-sm">Service Téléconsultation 100% Morisien</p>
              <div className="text-xs text-blue-600 mt-2">Dokter Morisien • 8h-minwi 7/7</div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Choisir ou lang / Choisissez votre langue / Choose your language
              </h2>

              <div className="space-y-3">
                {(["mf", "fr", "en"] as const).map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLanguage(code)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-200 flex items-center justify-between group transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{languages[code].flag}</span>
                      <span className="font-medium">{languages[code].name}</span>
                    </div>
                    <div className="text-blue-200 group-hover:text-white transition-colors">→</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500">🇲🇺 Service médical morisien disponib astere</div>
          </div>
        </div>
      </div>
    )
  }

  const getTranslations = (lang: string) => {
    const translations: Record<string, any> = {
      fr: {
        // Interface
        headerTitle: "TIBOK Assistant",
        headerSubtitle: "Docteurs mauriciens • 8h-minuit 7j/7 • 100% disponible",
        waitTimeBtn: "Temps d'attente",
        consultBtn: "Consulter",
        checkingWait: "Vérification...",
        sendBtn: "Envoyer",
        placeholder: "Posez votre question sur TIBOK - service 100% mauricien...",
        footerText:
          "Pour toute question médicale, consultez directement un docteur TIBOK • 100% mauricien • 8h-minuit 7j/7",

        // Service info
        service: "TIBOK",
        hours: "8h-minuit 7j/7",
        price: "1150 rs",
        doctors: "Docteurs 100% mauriciens",
        coverage: "Maurice + Rodrigues",
        delivery: "Livraison incluse",
        security: "100% sécurisé",

        // Medical redirect
        medicalAlert:
          "🚨 **ATTENTION : Question médicale détectée**\n\nJe ne peux pas répondre aux questions médicales. Pour toute question concernant votre santé :\n\n🩺 **PRENEZ UNE CONSULTATION AVEC UN DOCTEUR TIBOK**\n\n✅ Diagnostic professionnel par un docteur 100% mauricien\n💰 Tarif unique : 1150 rs\n⏰ 100% disponible maintenant\n\nComment puis-je vous aider concernant notre **service** ?",

        // Wait time
        currentWaitTime: "Temps d'attente actuel TIBOK :",
        whyTibok: "Pourquoi TIBOK est un bon choix ?",
        availableNow: "Docteurs mauriciens disponibles",
        noAppointment: "Service premier arrivé, premier servi",
        tip: "Plus tôt vous demandez, plus vite vous serez servi !",
        readyConsult: "Prêt(e) pour votre consultation ?",
        consultNow: "Consulter maintenant",
        refreshTime: "Actualiser temps",

        // Consultation alert
        consultAlert:
          "🩺 Redirection vers TIBOK consultation...\n\n🇲🇺 Vous allez être mis en relation avec un docteur 100% mauricien\n💰 Tarif : 1150 rs\n⏰ Service 100% disponible maintenant\n🚀 Premier arrivé, premier servi !",
      },

      en: {
        // Interface
        headerTitle: "TIBOK Assistant",
        headerSubtitle: "Mauritian doctors • 8am-midnight 7/7 • 100% available",
        waitTimeBtn: "Wait time",
        consultBtn: "Consult",
        checkingWait: "Checking...",
        sendBtn: "Send",
        placeholder: "Ask your question about TIBOK - 100% Mauritian service...",
        footerText: "For any medical question, consult directly a TIBOK doctor • 100% Mauritian • 8am-midnight 7/7",

        // Service info
        service: "TIBOK",
        hours: "8am-midnight 7/7",
        price: "1150 rs",
        doctors: "100% Mauritian doctors",
        coverage: "Mauritius + Rodrigues",
        delivery: "Delivery included",
        security: "100% secure",

        // Medical redirect
        medicalAlert:
          "🚨 **ATTENTION: Medical question detected**\n\nI cannot answer medical questions. For any question about your health:\n\n🩺 **TAKE A CONSULTATION WITH A TIBOK DOCTOR**\n\n✅ Professional diagnosis by a 100% Mauritian doctor\n💰 Unique price: 1150 rs\n⏰ 100% available now\n\nHow can I help you with our **service**?",

        // Wait time
        currentWaitTime: "Current TIBOK wait time:",
        whyTibok: "Why TIBOK is a good choice?",
        availableNow: "Mauritian doctors available",
        noAppointment: "First come, first served",
        tip: "The earlier you ask, the faster you'll be served!",
        readyConsult: "Ready for your consultation?",
        consultNow: "Consult now",
        refreshTime: "Refresh time",

        // Consultation alert
        consultAlert:
          "🩺 Redirecting to TIBOK consultation...\n\n🇲🇺 You will be connected with a 100% Mauritian doctor\n💰 Price: 1150 rs\n⏰ Service 100% available now\n🚀 First come, first served!",
      },

      mf: {
        // Interface
        headerTitle: "TIBOK Assistant",
        headerSubtitle: "Dokter morisien • 8h-minwi 7/7 • 100% disponib",
        waitTimeBtn: "Tan atann",
        consultBtn: "Consulte",
        checkingWait: "Pe verifie...",
        sendBtn: "Anvoy",
        placeholder: "Demann ou kestion lor TIBOK - service 100% morisien...",
        footerText: "Pou tout kestion medical, al consulte enn dokter TIBOK direct • 100% morisien • 8h-minwi 7/7",

        // Service info
        service: "TIBOK",
        hours: "8h-minwi 7/7",
        price: "1150 rs",
        doctors: "Dokter 100% morisien",
        coverage: "Moris + Rodrigues",
        delivery: "Livraison compris",
        security: "100% sekirite",

        // Medical redirect
        medicalAlert:
          "🚨 **ATANSION: Kestion medical detekte**\n\nMo pa capav repond kestion medical. Pou tout kestion lor ou lasante:\n\n🩺 **AL CONSULTE ENN DOKTER TIBOK**\n\n✅ Diagnostic profesionel par enn dokter 100% morisien\n💰 Prix innik: 1150 rs\n⏰ 100% disponib astere\n\nKi manyer mo capav ede ou ek nou **service**?",

        // Wait time
        currentWaitTime: "Tan atann TIBOK astere:",
        whyTibok: "Kifer TIBOK enn bon chwa?",
        availableNow: "Dokter morisien disponib",
        noAppointment: "Premie arive, premie servi",
        tip: "Pli bonner ou demann, pli vit ou pou servi!",
        readyConsult: "Pare pou ou consultation?",
        consultNow: "Consulte astere",
        refreshTime: "Refresh tan",

        // Consultation alert
        consultAlert:
          "🩺 Redirection ver TIBOK consultation...\n\n🇲🇺 Ou pou konekte ek enn dokter 100% morisien\n💰 Prix: 1150 rs\n⏰ Service 100% disponib astere\n🚀 Premie arive, premie servi!",
      },
    }

    return translations[lang] || translations.fr
  }

  const t = getTranslations(selectedLanguage)

  const detectMedicalQuestion = (message: string) => {
    const medicalKeywords = [
      // Français
      "symptôme", "symptome", "douleur", "mal", "maladie", "traitement", "médicament", "medicament",
      "diagnostic", "fièvre", "fievre", "toux", "migraine", "allergie", "infection", "virus",
      "bactérie", "bacterie", "prescription", "ordonnance", "posologie", "effet secondaire",
      "analyse", "examen", "radiographie", "scanner", "IRM", "prise de sang", "tension",
      "diabète", "diabete", "hypertension", "cholestérol", "cholesterol", "cardiaque",
      "respiratoire", "digestif", "neurologique", "dermatologique", "gynécologique", "gynecologique",

      // English
      "symptom", "symptoms", "pain", "sick", "illness", "disease", "treatment", "medication",
      "medicine", "diagnosis", "fever", "cough", "headache", "allergy", "infection", "virus",
      "bacteria", "prescription", "dosage", "side effect", "analysis", "examination", "x-ray",
      "scan", "blood test", "pressure", "diabetes", "hypertension", "cholesterol", "cardiac",
      "respiratory", "digestive", "neurological", "dermatological", "gynecological",

      // Créole mauricien
      "malad", "doulèr", "fièv", "latous", "mizer", "trètman", "medikaman", "preskrisyon",
      "ordonans", "egzamine", "dantèr", "lestoma", "lasante", "malèr", "bobo",
    ]

    const lowerMessage = message.toLowerCase()
    return medicalKeywords.some((keyword) => lowerMessage.includes(keyword))
  }

  const detectWaitTimeQuestion = (message: string) => {
    const waitTimeKeywords = [
      // Français
      "temps d'attente", "temps attente", "attendre", "combien de temps", "délai", "attente",
      "disponible quand", "libre quand",

      // English
      "wait time", "waiting time", "how long", "wait", "delay", "available when", "free when",

      // Créole mauricien
      "tan atann", "tan pou atann", "konbien tan", "atann", "disponib kan", "libre kan",
    ]

    const lowerMessage = message.toLowerCase()
    return waitTimeKeywords.some((keyword) => lowerMessage.includes(keyword))
  }

  const checkWaitTime = async () => {
    setIsCheckingWaitTime(true)
    // Simulation d'appel API pour vérifier le temps d'attente
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulation temps d'attente réaliste
    const waitTimes = ["2-3 minutes", "5-7 minutes", "10-12 minutes", "Immédiat", "3-5 minutes"]
    const randomWaitTime = waitTimes[Math.floor(Math.random() * waitTimes.length)]

    setWaitTime(randomWaitTime)
    setIsCheckingWaitTime(false)

    return randomWaitTime
  }

  // Fonction pour appeler l'API OpenAI sécurisée
  const callOpenAIAPI = async (userMessage: string, language: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erreur API Response:', response.status, errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      if (!data.response) {
        throw new Error('Réponse API invalide')
      }
      
      return data.response
    } catch (error) {
      console.error('Erreur API OpenAI:', error)
      throw error
    }
  }

  const generateResponse = async (userMessage: string) => {
    // Vérifier si c'est une question médicale - toujours rediriger
    if (detectMedicalQuestion(userMessage)) {
      return {
        content: t.medicalAlert,
        isRedirect: true,
      }
    }

    // Vérifier si c'est une question sur le temps d'attente
    if (detectWaitTimeQuestion(userMessage)) {
      const waitTimes = ["2-3 minutes", "5-7 minutes", "10-12 minutes", "Immédiat", "3-5 minutes", "1-2 minutes"]
      const currentWaitTime = waitTimes[Math.floor(Math.random() * waitTimes.length)]

      const waitTimeContent: Record<string, string> = {
        fr: `⏱️ **${t.currentWaitTime}**\n\n🔄 **${currentWaitTime}**\n\n✅ **${t.whyTibok}**\n- ${t.availableNow}\n- ${t.noAppointment}\n- Pas besoin rendez-vous\n- 100% disponible 8h à minuit\n\n💡 **Conseil :** ${t.tip}\n\n🩺 **${t.readyConsult}** Click "${t.consultNow}"\n\n⚡ **Service 100% disponible zordi !**`,
        en: `⏱️ **${t.currentWaitTime}**\n\n🔄 **${currentWaitTime}**\n\n✅ **${t.whyTibok}**\n- ${t.availableNow}\n- ${t.noAppointment}\n- No appointment needed\n- 100% available 8am to midnight\n\n💡 **Tip:** ${t.tip}\n\n🩺 **${t.readyConsult}** Click "${t.consultNow}"\n\n⚡ **Service 100% available today!**`,
        mf: `⏱️ **${t.currentWaitTime}**\n\n🔄 **${currentWaitTime}**\n\n✅ **${t.whyTibok}**\n- ${t.availableNow}\n- ${t.noAppointment}\n- Pa bizin randevu\n- 100% disponib 8h-minwi\n\n💡 **Konsey:** ${t.tip}\n\n🩺 **${t.readyConsult}** Click "${t.consultNow}"\n\n⚡ **Service 100% disponib zordi!**`,
      }

      return {
        content: waitTimeContent[selectedLanguage] || waitTimeContent.fr,
        showWaitTime: true,
        waitTime: currentWaitTime,
      }
    }

    // Pour toutes les autres questions, utiliser l'API OpenAI sécurisée
    try {
      const aiResponse = await callOpenAIAPI(userMessage, selectedLanguage)
      return {
        content: aiResponse,
      }
    } catch (error) {
      console.error('Erreur OpenAI API:', error)
      const errorMessages: Record<string, string> = {
        fr: "Désolé, une erreur est survenue. Veuillez réessayer ou consulter directement un docteur TIBOK.",
        en: "Sorry, an error occurred. Please try again or consult a TIBOK doctor directly.",
        mf: "Pardon, ena enn problem. Essayer encore ou consulte enn dokter TIBOK direct.",
      }
      return {
        content: errorMessages[selectedLanguage] || errorMessages.fr,
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      role: "user" as const,
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await generateResponse(inputMessage)

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        isRedirect: response.isRedirect || false,
        showWaitTime: response.showWaitTime || false,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer ou consulter directement un docteur TIBOK.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startConsultation = () => {
    alert(t.consultAlert)
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>{t.headerTitle}</span>
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">🇲🇺 100% Maurice</span>
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">🤖 IA</span>
              </h1>
              <p className="text-sm text-gray-600">{t.headerSubtitle}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedLanguage(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{languages[selectedLanguage].flag}</span>
            </button>
            <button
              onClick={() =>
                checkWaitTime().then((time) => {
                  const waitMessage: Message = {
                    role: "assistant",
                    content: `⏱️ **${t.currentWaitTime} ${time}**\n\n✅ ${t.availableNow} !\n🚀 ${t.tip}`,
                    timestamp: new Date(),
                    showWaitTime: true,
                  }
                  setMessages((prev) => [...prev, waitMessage])
                })
              }
              disabled={isCheckingWaitTime}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
            >
              <Timer className="w-4 h-4" />
              <span>{isCheckingWaitTime ? t.checkingWait : t.waitTimeBtn}</span>
            </button>
            <button
              onClick={startConsultation}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t.consultBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Info Bar */}
      <div className="bg-blue-500 text-white p-3">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center space-x-1">
            <span className="font-bold">{t.service}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{t.hours}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💰</span>
            <span>{t.price}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{t.doctors}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{t.coverage}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Pill className="w-4 h-4" />
            <span>{t.delivery}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>{t.security}</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : message.isRedirect
                    ? "bg-red-50 border-2 border-red-200 text-gray-800"
                    : "bg-white text-gray-800 shadow-md"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === "assistant" && (
                  <div className={`p-1 rounded-full ${message.isRedirect ? "bg-red-100" : "bg-blue-100"}`}>
                    <Bot className={`w-4 h-4 ${message.isRedirect ? "text-red-500" : "text-blue-500"}`} />
                  </div>
                )}
                {message.role === "user" && <User className="w-4 h-4 text-white mt-1" />}
                <div className="flex-1">
                  <div className="whitespace-pre-line text-sm leading-relaxed">{message.content}</div>
                  {message.isRedirect && (
                    <button
                      onClick={startConsultation}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      🩺 {t.consultBtn}
                    </button>
                  )}
                  {message.showWaitTime && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={startConsultation}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        🩺 {t.consultNow}
                      </button>
                      <button
                        onClick={() => checkWaitTime()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        🔄 {t.refreshTime}
                      </button>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-md max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors"
            title={t.sendBtn}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">{t.footerText}</div>
      </div>
    </div>
  )
}

export default TeleconsultationChatbot
