import { NextRequest, NextResponse } from 'next/server'

// Interface pour la requête
interface ChatRequest {
  message: string
  language: string
}

// 🤖 RÉPONSES INTELLIGENTES TIBOK (sans OpenAI)
const getTibokResponse = (message: string, language: string): string => {
  const lowerMessage = message.toLowerCase()
  
  // 🏥 Détection de questions médicales
  const medicalKeywords = [
    'symptôme', 'symptome', 'douleur', 'mal', 'maladie', 'traitement', 'médicament', 'medicament',
    'diagnostic', 'fièvre', 'fievre', 'toux', 'migraine', 'allergie', 'infection', 'virus',
    'symptom', 'pain', 'sick', 'illness', 'disease', 'treatment', 'medication', 'fever', 'cough',
    'malad', 'doulèr', 'fièv', 'latous', 'mizer', 'trètman', 'medikaman', 'lasante'
  ]
  
  if (medicalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const medicalResponses = {
      fr: "🚨 **ATTENTION : Question médicale détectée**\n\nJe ne peux pas répondre aux questions médicales. Pour toute question concernant votre santé :\n\n🩺 **PRENEZ UNE CONSULTATION AVEC UN DOCTEUR TIBOK**\n\n✅ Diagnostic professionnel par un docteur 100% mauricien\n💰 Tarif unique : 1150 rs\n⏰ 100% disponible maintenant\n\nComment puis-je vous aider concernant notre **service** ?",
      en: "🚨 **ATTENTION: Medical question detected**\n\nI cannot answer medical questions. For any question about your health:\n\n🩺 **TAKE A CONSULTATION WITH A TIBOK DOCTOR**\n\n✅ Professional diagnosis by a 100% Mauritian doctor\n💰 Unique price: 1150 rs\n⏰ 100% available now\n\nHow can I help you with our **service**?",
      mf: "🚨 **ATANSION: Kestion medical detekte**\n\nMo pa capav repond kestion medical. Pou tout kestion lor ou lasante:\n\n🩺 **AL CONSULTE ENN DOKTER TIBOK**\n\n✅ Diagnostic profesionel par enn dokter 100% morisien\n💰 Prix innik: 1150 rs\n⏰ 100% disponib astere\n\nKi manyer mo capav ede ou ek nou **service**?"
    }
    return medicalResponses[language] || medicalResponses.fr
  }

  // 💰 Questions sur les prix
  const priceKeywords = ['prix', 'price', 'tarif', 'cout', 'cost', 'combien', 'how much', 'cher', 'expensive']
  if (priceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const priceResponses = {
      fr: "💰 **Tarif TIBOK : 1150 rs tout compris !**\n\n✨ **Ce qui est inclus :**\n🩺 Consultation complète avec docteur mauricien\n💊 Prescription si nécessaire\n🚚 Livraison médicaments (8h-17h)\n📱 Suivi médical\n🇲🇺 Service 100% mauricien\n\n⏰ **Disponible maintenant 8h-minuit 7j/7**\n\nPrêt(e) pour une consultation ?",
      en: "💰 **TIBOK Price: 1150 rs all inclusive!**\n\n✨ **What's included:**\n🩺 Complete consultation with Mauritian doctor\n💊 Prescription if needed\n🚚 Medication delivery (8am-5pm)\n📱 Medical follow-up\n🇲🇺 100% Mauritian service\n\n⏰ **Available now 8am-midnight 7/7**\n\nReady for a consultation?",
      mf: "💰 **Prix TIBOK : 1150 rs tout compris !**\n\n✨ **Sa ki compris :**\n🩺 Consultation complet ek dokter morisien\n💊 Preskrisyon si bizin\n🚚 Livraison medikaman (8h-17h)\n📱 Suivi medical\n🇲🇺 Service 100% morisien\n\n⏰ **Disponib astere 8h-minwi 7/7**\n\nPare pou enn consultation ?"
    }
    return priceResponses[language] || priceResponses.fr
  }

  // ⏰ Questions sur les horaires
  const timeKeywords = ['horaire', 'hour', 'ler', 'temps', 'time', 'quand', 'when', 'kan', 'disponible', 'available', 'ouvert', 'open']
  if (timeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const timeResponses = {
      fr: "⏰ **Horaires TIBOK : 8h à minuit, 7 jours sur 7**\n\n✅ **Toujours disponible :**\n📅 Lundi à dimanche\n🌅 8h du matin à minuit\n🎉 Même les weekends et jours fériés !\n\n🇲🇺 **Docteurs mauriciens toujours prêts**\n⚡ Service premier arrivé, premier servi\n🚫 Pas besoin de rendez-vous\n\n🩺 Consulter maintenant ?",
      en: "⏰ **TIBOK Hours: 8am to midnight, 7 days a week**\n\n✅ **Always available:**\n📅 Monday to Sunday\n🌅 8am to midnight\n🎉 Even weekends and holidays!\n\n🇲🇺 **Mauritian doctors always ready**\n⚡ First come, first served\n🚫 No appointment needed\n\n🩺 Consult now?",
      mf: "⏰ **Ler TIBOK : 8h-minwi, 7 zour lor 7**\n\n✅ **Touzour disponib :**\n📅 Lindi ziska dimans\n🌅 8h matin ziska minwi\n🎉 Meme weekend ek zour feriye !\n\n🇲🇺 **Dokter morisien touzour pare**\n⚡ Premie arive, premie servi\n🚫 Pa bizin randevu\n\n🩺 Consulte astere ?"
    }
    return timeResponses[language] || timeResponses.fr
  }

  // 🚚 Questions sur la livraison
  const deliveryKeywords = ['livraison', 'delivery', 'médicament', 'medicament', 'medication', 'medikaman', 'pharmacie', 'pharmacy']
  if (deliveryKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const deliveryResponses = {
      fr: "🚚 **Livraison TIBOK : Incluse dans le tarif !**\n\n✨ **Service livraison :**\n📦 Médicaments prescrits livrés chez vous\n⏰ Livraison 8h-17h (jours ouvrables)\n🇲🇺 Couverture Maurice + Rodrigues\n💰 Inclus dans les 1150 rs\n🔒 Livraison sécurisée et discrète\n\n📍 **Zones couvertes :**\n✅ Toute l'île Maurice\n✅ Rodrigues\n\n🩺 Consulter et recevoir vos médicaments ?",
      en: "🚚 **TIBOK Delivery: Included in the price!**\n\n✨ **Delivery service:**\n📦 Prescribed medications delivered to you\n⏰ Delivery 8am-5pm (working days)\n🇲🇺 Coverage Mauritius + Rodrigues\n💰 Included in 1150 rs\n🔒 Secure and discreet delivery\n\n📍 **Areas covered:**\n✅ All of Mauritius\n✅ Rodrigues\n\n🩺 Consult and receive your medications?",
      mf: "🚚 **Livraison TIBOK : Compris dan prix !**\n\n✨ **Service livraison :**\n📦 Medikaman preskri livre lakaz ou\n⏰ Livraison 8h-17h (zour travay)\n🇲🇺 Kouvertur Moris + Rodrigues\n💰 Compris dan 1150 rs\n🔒 Livraison sekirite ek diskre\n\n📍 **Zonn kouver :**\n✅ Tout Moris\n✅ Rodrigues\n\n🩺 Consulte ek resevwar ou medikaman ?"
    }
    return deliveryResponses[language] || deliveryResponses.fr
  }

  // 👋 Salutations
  const greetingKeywords = ['bonjour', 'hello', 'hi', 'salut', 'bonsoir', 'bonzour', 'allo']
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const greetingResponses = {
      fr: "👋 **Bonjour et bienvenue sur TIBOK !**\n\n🇲🇺 Je suis votre assistant pour le **premier service de téléconsultation 100% mauricien** !\n\n✨ **Ce que je peux vous expliquer :**\n💰 Nos tarifs (1150 rs tout compris)\n⏰ Nos horaires (8h-minuit 7j/7)\n🚚 Notre service de livraison\n🩺 Comment consulter un docteur\n\n❓ **Que voulez-vous savoir sur TIBOK ?**",
      en: "👋 **Hello and welcome to TIBOK!**\n\n🇲🇺 I'm your assistant for the **first 100% Mauritian teleconsultation service**!\n\n✨ **What I can explain:**\n💰 Our prices (1150 rs all inclusive)\n⏰ Our hours (8am-midnight 7/7)\n🚚 Our delivery service\n🩺 How to consult a doctor\n\n❓ **What would you like to know about TIBOK?**",
      mf: "👋 **Bonzour ek bienveni lor TIBOK !**\n\n🇲🇺 Mo ou assistant pou **premie service téléconsultation 100% morisien** !\n\n✨ **Sa mo capav explik ou :**\n💰 Nou prix (1150 rs tout compris)\n⏰ Nou ler (8h-minwi 7/7)\n🚚 Nou service livraison\n🩺 Kouma consulte enn dokter\n\n❓ **Ki ou anvi kone lor TIBOK ?**"
    }
    return greetingResponses[language] || greetingResponses.fr
  }

  // 📞 Questions sur comment consulter
  const consultKeywords = ['consulter', 'consultation', 'consult', 'doctor', 'docteur', 'dokter', 'rdv', 'appointment']
  if (consultKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const consultResponses = {
      fr: "🩺 **Comment consulter un docteur TIBOK ?**\n\n⚡ **Super simple : Premier arrivé, premier servi !**\n\n🔴 **Étapes :**\n1️⃣ Cliquez sur \"Consulter\" \n2️⃣ Vous êtes mis en relation immédiatement\n3️⃣ Parlez avec un docteur mauricien\n4️⃣ Recevez votre prescription\n5️⃣ Médicaments livrés si nécessaire\n\n💰 **Tarif unique : 1150 rs**\n⏰ **Disponible maintenant !**\n\n🚀 Prêt(e) à consulter ?",
      en: "🩺 **How to consult a TIBOK doctor?**\n\n⚡ **Super simple: First come, first served!**\n\n🔴 **Steps:**\n1️⃣ Click \"Consult\"\n2️⃣ You're connected immediately\n3️⃣ Talk with a Mauritian doctor\n4️⃣ Receive your prescription\n5️⃣ Medications delivered if needed\n\n💰 **Unique price: 1150 rs**\n⏰ **Available now!**\n\n🚀 Ready to consult?",
      mf: "🩺 **Kouma consulte enn dokter TIBOK ?**\n\n⚡ **Super fasil : Premie arive, premie servi !**\n\n🔴 **Etap :**\n1️⃣ Click lor \"Consulte\"\n2️⃣ Ou konekte inmediatman\n3️⃣ Koz ek enn dokter morisien\n4️⃣ Resevwar ou preskrisyon\n5️⃣ Medikaman livre si bizin\n\n💰 **Prix innik : 1150 rs**\n⏰ **Disponib astere !**\n\n🚀 Pare pou consulte ?"
    }
    return consultResponses[language] || consultResponses.fr
  }

  // 🆚 Questions comparatives
  const compareKeywords = ['pourquoi', 'why', 'kifer', 'avantage', 'advantage', 'mieux', 'better', 'choisir', 'choose']
  if (compareKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const compareResponses = {
      fr: "💡 **Pourquoi choisir TIBOK ?**\n\n🇲🇺 **100% MAURICIEN - La différence !**\n\n✨ **Nos avantages uniques :**\n👨‍⚕️ Docteurs mauriciens qui vous comprennent\n💰 Prix fixe et transparent (1150 rs)\n⏰ Disponible 8h-minuit, même weekends\n🚚 Livraison médicaments incluse\n⚡ Pas d'attente, pas de rendez-vous\n🔒 Totalement sécurisé et confidentiel\n\n🏆 **LE service médical mauricien de référence !**\n\n🩺 Prêt(e) à essayer l'excellence mauricienne ?",
      en: "💡 **Why choose TIBOK?**\n\n🇲🇺 **100% MAURITIAN - The difference!**\n\n✨ **Our unique advantages:**\n👨‍⚕️ Mauritian doctors who understand you\n💰 Fixed and transparent price (1150 rs)\n⏰ Available 8am-midnight, even weekends\n🚚 Medication delivery included\n⚡ No waiting, no appointments\n🔒 Completely secure and confidential\n\n🏆 **THE reference Mauritian medical service!**\n\n🩺 Ready to try Mauritian excellence?",
      mf: "💡 **Kifer choisir TIBOK ?**\n\n🇲🇺 **100% MORISIEN - La diferans !**\n\n✨ **Nou avantaz innik :**\n👨‍⚕️ Dokter morisien ki konpran ou\n💰 Prix fiks ek transparent (1150 rs)\n⏰ Disponib 8h-minwi, meme weekend\n🚚 Livraison medikaman compris\n⚡ Pa bizin atann, pa bizin randevu\n🔒 Total sekirite ek konfidansiel\n\n🏆 **SA service medical morisien referans !**\n\n🩺 Pare pou essayer lexselans morisien ?"
    }
    return compareResponses[language] || compareResponses.fr
  }

  // 🌍 Réponse générale par défaut
  const defaultResponses = {
    fr: "🇲🇺 **TIBOK - Votre santé, notre priorité !**\n\n✨ **Service téléconsultation 100% mauricien**\n💰 Tarif unique : 1150 rs tout compris\n⏰ Disponible 8h-minuit, 7j/7\n🩺 Docteurs mauriciens qualifiés\n🚚 Livraison médicaments incluse\n\n❓ **Questions fréquentes :**\n• Quels sont vos tarifs ?\n• Quels sont vos horaires ?\n• Comment consulter ?\n• Service de livraison ?\n\n🩺 **Prêt(e) pour une consultation ?**",
    en: "🇲🇺 **TIBOK - Your health, our priority!**\n\n✨ **100% Mauritian teleconsultation service**\n💰 Unique price: 1150 rs all inclusive\n⏰ Available 8am-midnight, 7/7\n🩺 Qualified Mauritian doctors\n🚚 Medication delivery included\n\n❓ **Frequent questions:**\n• What are your prices?\n• What are your hours?\n• How to consult?\n• Delivery service?\n\n🩺 **Ready for a consultation?**",
    mf: "🇲🇺 **TIBOK - Ou lasante, nou priorite !**\n\n✨ **Service téléconsultation 100% morisien**\n💰 Prix innik : 1150 rs tout compris\n⏰ Disponib 8h-minwi, 7/7\n🩺 Dokter morisien kalifie\n🚚 Livraison medikaman compris\n\n❓ **Kestion frekant :**\n• Ki nou prix ?\n• Ki nou ler ?\n• Kouma consulte ?\n• Service livraison ?\n\n🩺 **Pare pou enn consultation ?**"
  }
  
  return defaultResponses[language] || defaultResponses.fr
}

// Configuration des prompts système par langue (pour OpenAI si disponible)
const getSystemPrompt = (language: string): string => {
  const systemPrompts: Record<string, string> = {
    fr: `Tu es un assistant pour TIBOK, un service de téléconsultation médicale 100% mauricien.

INFORMATIONS IMPORTANTES SUR TIBOK :
- Service 100% mauricien avec des docteurs mauriciens
- Disponible 8h à minuit, 7 jours sur 7
- Tarif unique : 1150 rs tout compris
- Couverture : Maurice + Rodrigues
- Livraison de médicaments incluse (8h-17h)
- Service premier arrivé, premier servi, pas de rendez-vous

TON RÔLE :
- Renseigner sur le service TIBOK uniquement
- Ne JAMAIS donner de conseils médicaux
- Rediriger vers une consultation pour toute question médicale
- Être chaleureux et professionnel
- Utiliser des emojis appropriés

STYLE DE RÉPONSE :
- Réponses courtes et claires
- Mettre en avant les avantages mauriciens
- Utiliser "🇲🇺" pour souligner l'aspect local
- Encourager la consultation avec les docteurs TIBOK`,

    en: `You are an assistant for TIBOK, a 100% Mauritian medical teleconsultation service.

IMPORTANT INFORMATION ABOUT TIBOK:
- 100% Mauritian service with Mauritian doctors
- Available 8am to midnight, 7 days a week
- Unique price: 1150 rs all inclusive
- Coverage: Mauritius + Rodrigues
- Medication delivery included (8am-5pm)
- First come, first served service, no appointments

YOUR ROLE:
- Provide information about TIBOK service only
- NEVER give medical advice
- Redirect to consultation for any medical question
- Be warm and professional
- Use appropriate emojis

RESPONSE STYLE:
- Short and clear responses
- Highlight Mauritian advantages
- Use "🇲🇺" to emphasize local aspect
- Encourage consultation with TIBOK doctors`,

    mf: `Ou enn assistant pou TIBOK, enn service téléconsultation medical 100% morisien.

INFORMASION IMPORTAN LOR TIBOK:
- Service 100% morisien ek dokter morisien
- Disponib 8h-minwi, 7 zour lor 7
- Prix innik: 1150 rs tout compris
- Kouvertur: Moris + Rodrigues  
- Livraison medikaman compris (8h-17h)
- Service premie arive premie servi, pa bizin randevu

OU TRAVAY:
- Donn informasion lor service TIBOK selman
- ZAME donn konsey medical
- Redirect ver consultation pou tout kestion medical
- Reste saler ek profesionel
- Servi emoji apropriaye

STYLE REPONS:
- Repons kour ek kler
- Met devan avantaz morisien
- Servi "🇲🇺" pou montre aspect lokal
- Ankouraz consultation ek dokter TIBOK`,
  }

  return systemPrompts[language] || systemPrompts.fr
}

export async function POST(request: NextRequest) {
  try {
    const { message, language }: ChatRequest = await request.json()

    // Validation des données
    if (!message || !language) {
      return NextResponse.json(
        { error: 'Message et langue requis' },
        { status: 400 }
      )
    }

    console.log('🚀 TIBOK API - Mode intelligent activé')
    console.log('📥 Message:', message.substring(0, 50))
    console.log('🌍 Langue:', language)

    // 🤖 UTILISER LE MODE FALLBACK INTELLIGENT (RECOMMANDÉ)
    console.log('✨ Utilisation du mode intelligent TIBOK')
    const intelligentResponse = getTibokResponse(message, language)
    
    return NextResponse.json({ 
      response: intelligentResponse,
      mode: 'intelligent_fallback',
      timestamp: new Date().toISOString()
    })

    // 🔧 CODE OPENAI (COMMENTÉ - DÉCOMMENTEZ QUAND LA CLÉ SERA FIXÉE)
    /*
    const apiKey = process.env.OPENAI_API_KEY
    
    if (apiKey && apiKey.startsWith('sk-')) {
      console.log('🧪 Tentative OpenAI...')
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            max_tokens: 500,
            temperature: 0.7,
            messages: [
              {
                role: 'system',
                content: getSystemPrompt(language),
              },
              {
                role: 'user',
                content: message,
              },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.choices?.[0]?.message?.content) {
            console.log('✅ OpenAI réussi')
            return NextResponse.json({ 
              response: data.choices[0].message.content,
              mode: 'openai',
              timestamp: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.log('⚠️ OpenAI échoué, utilisation du mode intelligent')
      }
    }
    
    // Fallback en cas d'échec OpenAI
    const intelligentResponse = getTibokResponse(message, language)
    return NextResponse.json({ 
      response: intelligentResponse,
      mode: 'intelligent_fallback',
      timestamp: new Date().toISOString()
    })
    */

  } catch (error) {
    console.error('💥 Erreur générale:', error)
    
    // Messages d'erreur par langue
    const errorMessages: Record<string, string> = {
      fr: `🇲🇺 **TIBOK reste disponible !**\n\n✅ Docteurs mauriciens 8h-minuit 7j/7\n💰 Tarif unique : 1150 rs\n🩺 Service 100% opérationnel\n\nVoulez-vous consulter directement ?`,
      en: `🇲🇺 **TIBOK remains available!**\n\n✅ Mauritian doctors 8am-midnight 7/7\n💰 Unique price: 1150 rs\n🩺 Service 100% operational\n\nWould you like to consult directly?`,
      mf: `🇲🇺 **TIBOK reste disponib!**\n\n✅ Dokter morisien 8h-minwi 7/7\n💰 Prix innik: 1150 rs\n🩺 Service 100% operasionel\n\nOu anvi consulte direct?`,
    }

    const { language } = await request.json().catch(() => ({ language: 'fr' }))
    const errorMessage = errorMessages[language] || errorMessages.fr

    return NextResponse.json({ 
      response: errorMessage,
      mode: 'error_fallback',
      timestamp: new Date().toISOString()
    })
  }
}
