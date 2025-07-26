import { NextRequest, NextResponse } from 'next/server'

// Interface pour la requête
interface ChatRequest {
  message: string
  language: string
}

// Interface pour les résultats de diagnostic
interface DiagnosticResult {
  test: string
  result: boolean
  details: string
  timestamp: string
}

// 🔍 FONCTION DE DIAGNOSTIC OPENAI AVANCÉE
const diagnosticOpenAI = async (apiKey: string): Promise<DiagnosticResult[]> => {
  const tests: DiagnosticResult[] = []
  const timestamp = new Date().toISOString()
  
  // Test 1: Vérifier le format de la clé
  const formatTest = {
    test: "Format clé API",
    result: !!(apiKey && apiKey.startsWith('sk-') && apiKey.length > 50),
    details: `Longueur: ${apiKey?.length || 0}, Préfixe: ${apiKey?.substring(0, 7) || 'N/A'}`,
    timestamp
  }
  tests.push(formatTest)
  console.log('🔍 Test format:', formatTest)

  if (!formatTest.result) {
    return tests // Arrêter si le format est incorrect
  }

  // Test 2: Test de connectivité API avec gestion d'erreurs détaillée
  try {
    console.log('🌐 Test de connectivité vers OpenAI...')
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TIBOK-App/1.0'
      },
      signal: AbortSignal.timeout(10000) // Timeout de 10 secondes
    })
    
    console.log('📡 Réponse OpenAI status:', response.status)
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      
      tests.push({
        test: "Connectivité API",
        result: true,
        details: `Status: ${response.status} OK - ${data.data?.length || 0} modèles disponibles`,
        timestamp
      })

      // Test 3: Vérifier la disponibilité des modèles GPT
      const gptModels = data.data?.filter((model: any) => 
        model.id.includes('gpt') && 
        (model.id.includes('3.5') || model.id.includes('4'))
      ) || []

      const hasGPT35 = gptModels.some((m: any) => m.id.includes('gpt-3.5-turbo'))
      const hasGPT4 = gptModels.some((m: any) => m.id.includes('gpt-4'))

      tests.push({
        test: "Modèles GPT disponibles",
        result: gptModels.length > 0,
        details: `GPT-3.5: ${hasGPT35 ? '✅' : '❌'}, GPT-4: ${hasGPT4 ? '✅' : '❌'}, Total: ${gptModels.length}`,
        timestamp
      })

      console.log('🤖 Modèles GPT trouvés:', gptModels.map((m: any) => m.id).slice(0, 5))

    } else {
      const errorText = await response.text()
      let errorDetails = `Status: ${response.status}`
      
      // Analyse spécifique des erreurs
      switch (response.status) {
        case 401:
          errorDetails += " - Clé API invalide, expirée ou révoquée"
          break
        case 403:
          errorDetails += " - Accès interdit - vérifiez les permissions"
          break
        case 429:
          errorDetails += " - Quota dépassé ou limite de taux atteinte"
          break
        case 500:
          errorDetails += " - Erreur serveur OpenAI"
          break
        default:
          errorDetails += ` - ${errorText.substring(0, 100)}`
      }

      tests.push({
        test: "Connectivité API",
        result: false,
        details: errorDetails,
        timestamp
      })

      console.log('❌ Erreur OpenAI HTTP:', response.status, errorText)
    }

  } catch (error: any) {
    let errorDetails = "Erreur réseau"
    
    if (error.name === 'AbortError') {
      errorDetails = "Timeout - OpenAI ne répond pas dans les délais"
    } else if (error.message.includes('fetch')) {
      errorDetails = "Erreur de connectivité réseau"
    } else {
      errorDetails = `Erreur: ${error.message}`
    }

    tests.push({
      test: "Connectivité API",
      result: false,
      details: errorDetails,
      timestamp
    })

    console.log('❌ Erreur réseau OpenAI:', error)
  }

  return tests
}

// 🤖 RÉPONSES INTELLIGENTES TIBOK (avec FAQ intégrées)
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
      fr: "🚨 **ATTENTION : Question médicale détectée**\n\nJe ne peux pas répondre aux questions médicales. Pour toute question concernant votre santé :\n\n🩺 **PRENEZ UNE CONSULTATION AVEC UN DOCTEUR TIBOK**\n\n✅ Diagnostic professionnel par un docteur mauricien qualifié\n💰 Tarif unique : 1150 rs tout compris\n⏰ Disponible 8h-minuit, 7j/7\n🇲🇺 Médecins inscrits au Medical Council de Maurice\n\n**📍 Service disponible :** Maurice + Rodrigues\n\nComment puis-je vous aider concernant notre **service** ?",
      en: "🚨 **ATTENTION: Medical question detected**\n\nI cannot answer medical questions. For any question about your health:\n\n🩺 **TAKE A CONSULTATION WITH A TIBOK DOCTOR**\n\n✅ Professional diagnosis by a qualified Mauritian doctor\n💰 Unique price: 1150 rs all inclusive\n⏰ Available 8am-midnight, 7/7\n🇲🇺 Doctors registered with Medical Council of Mauritius\n\n**📍 Service available:** Mauritius + Rodrigues\n\nHow can I help you with our **service**?",
      mf: "🚨 **ATANSION: Kestion medical detekte**\n\nMo pa capav repond kestion medical. Pou tout kestion lor ou lasante:\n\n🩺 **AL CONSULTE ENN DOKTER TIBOK**\n\n✅ Diagnostic profesionel par enn dokter morisien kalifie\n💰 Prix innik: 1150 rs tout compris\n⏰ Disponib 8h-minwi, 7/7\n🇲🇺 Dokter anrezistre kot Medical Council Moris\n\n**📍 Servis disponib:** Moris + Rodrigues\n\nKi manyer mo capav ede ou ek nou **servis**?"
    }
    return medicalResponses[language] || medicalResponses.fr
  }

  // ... (garder toutes les autres réponses intelligentes du code original)

  // 🌍 Réponse générale par défaut
  const defaultResponses = {
    fr: "🇲🇺 **TIBOK - Votre santé, notre priorité !**\n\n✨ **Service téléconsultation 100% mauricien**\n💰 **1150 rs tout compris** (consultation + livraison)\n⏰ **8h-minuit, 7j/7** - Même weekends et jours fériés\n🩺 **Médecins mauriciens** inscrits au Medical Council\n🚚 **Livraison gratuite** médicaments à domicile\n🚫 **Sans rendez-vous** - Premier arrivé, premier servi\n🔒 **100% sécurisé** et confidentiel\n\n❓ **Questions fréquentes :**\n• \"Quels sont vos tarifs et ce qui est inclus ?\"\n• \"Comment consulter un médecin maintenant ?\"\n• \"Quels sont vos horaires de disponibilité ?\"\n• \"Comment fonctionne la livraison de médicaments ?\"\n• \"Mes données sont-elles sécurisées ?\"\n• \"Quelles sont les limites du service ?\"\n\n🩺 **Prêt(e) pour une consultation avec un médecin mauricien ?**",
    en: "🇲🇺 **TIBOK - Your health, our priority!**\n\n✨ **100% Mauritian teleconsultation service**\n💰 **1150 rs all inclusive** (consultation + delivery)\n⏰ **8am-midnight, 7/7** - Even weekends and holidays\n🩺 **Mauritian doctors** registered with Medical Council\n🚚 **Free delivery** medications at home\n🚫 **No appointments** - First come, first served\n🔒 **100% secure** and confidential\n\n❓ **Frequent questions:**\n• \"What are your prices and what's included?\"\n• \"How to consult a doctor now?\"\n• \"What are your availability hours?\"\n• \"How does medication delivery work?\"\n• \"Is my data secure?\"\n• \"What are the service limits?\"\n\n🩺 **Ready for a consultation with a Mauritian doctor?**",
    mf: "🇲🇺 **TIBOK - Ou lasante, nou priorite !**\n\n✨ **Servis téléconsultation 100% morisien**\n💰 **1150 rs tout compris** (konsultasion + livrezon)\n⏰ **8h-minwi, 7/7** - Mem weekend ek zour konze\n🩺 **Dokter morisien** anrezistre kot Medical Council\n🚚 **Livrezon gratui** medikaman lakaz\n🚫 **San randevou** - Premie arive, premie servi\n🔒 **100% sekirize** ek konfidansiel\n\n❓ **Kestion frekant :**\n• \"Ki nou prix ek sa ki compris ?\"\n• \"Kouma konsulte enn dokter astere ?\"\n• \"Ki nou ler disponibilite ?\"\n• \"Kouma livrezon medikaman marse ?\"\n• \"Eski mo done sekirize ?\"\n• \"Ki limit servis-la ?\"\n\n🩺 **Pare pou enn konsultasion avek enn dokter morisien ?**"
  }
  
  return defaultResponses[language] || defaultResponses.fr
}

// Configuration des prompts système par langue
const getSystemPrompt = (language: string): string => {
  const systemPrompts: Record<string, string> = {
    fr: `Tu es un assistant pour TIBOK, un service de téléconsultation médicale 100% mauricien.

INFORMATIONS IMPORTANTES SUR TIBOK :
- Service 100% mauricien avec des docteurs mauriciens inscrits au Medical Council
- Disponible 8h à minuit, 7 jours sur 7 (même weekends et jours fériés)
- Tarif unique : 1150 rs tout compris (consultation + livraison)
- Couverture : Maurice + Rodrigues
- Livraison de médicaments incluse et souvent gratuite (8h-17h)
- Service premier arrivé, premier servi, pas de rendez-vous
- Consultation immédiate via plateforme web sécurisée
- Médecins parlent français, anglais et créole mauricien
- Données 100% sécurisées et confidentielles

TON RÔLE :
- Renseigner sur le service TIBOK uniquement avec les FAQ détaillées
- Ne JAMAIS donner de conseils médicaux
- Rediriger vers une consultation pour toute question médicale
- Identifier et rediriger les urgences vers le 114/999
- Être chaleureux, professionnel et utiliser des emojis appropriés
- Clarifier les limites du service (pas pour urgences, fractures, examens physiques)`,

    en: `You are an assistant for TIBOK, a 100% Mauritian medical teleconsultation service.

IMPORTANT INFORMATION ABOUT TIBOK:
- 100% Mauritian service with Mauritian doctors registered with Medical Council
- Available 8am to midnight, 7 days a week (even weekends and holidays)
- Unique price: 1150 rs all inclusive (consultation + delivery)
- Coverage: Mauritius + Rodrigues
- Medication delivery included and often free (8am-5pm)
- First come, first served service, no appointments needed
- Immediate consultation via secure web platform
- Doctors speak French, English and Mauritian Creole
- 100% secure and confidential data`,

    mf: `Ou enn assistant pou TIBOK, enn servis téléconsultation medical 100% morisien.

INFORMASION IMPORTAN LOR TIBOK:
- Servis 100% morisien ek dokter morisien anrezistre kot Medical Council
- Disponib 8h-minwi, 7 zour lor 7 (mem weekend ek zour konze)
- Prix innik: 1150 rs tout compris (konsultasion + livrezon)
- Kouvertur: Moris + Rodrigues  
- Livrezon medikaman compris ek souvan gratui (8h-17h)
- Servis premie arive premie servi, pa bizin randevou
- Konsultasion imedia travei platform web sekirize
- Dokter koz franse, angle ek kreol morisien
- Done 100% sekirize ek konfidansiel`
  }

  return systemPrompts[language] || systemPrompts.fr
}

// 🔧 FONCTION PRINCIPALE DE L'API
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { message, language }: ChatRequest = await request.json()

    // Validation des données
    if (!message || !language) {
      return NextResponse.json(
        { error: 'Message et langue requis' },
        { status: 400 }
      )
    }

    console.log('🚀 TIBOK API v3.0 - Diagnostic avancé')
    console.log('📥 Message:', message.substring(0, 50) + '...')
    console.log('🌍 Langue:', language)

    // Récupération et vérification de la clé API
    const apiKey = process.env.OPENAI_API_KEY
    
    console.log('🔍 Variables d\'environnement:')
    console.log('  - OPENAI_API_KEY présente:', !!apiKey)
    console.log('  - NODE_ENV:', process.env.NODE_ENV)
    
    // 🔧 TENTATIVE OPENAI AVEC DIAGNOSTIC AVANCÉ
    if (apiKey && apiKey.startsWith('sk-')) {
      console.log('🧪 Lancement du diagnostic OpenAI...')
      
      const diagnosticResults = await diagnosticOpenAI(apiKey)
      const isOpenAIReady = diagnosticResults.every(test => test.result)
      
      console.log('📊 Résultats diagnostic:')
      diagnosticResults.forEach(test => {
        console.log(`  ${test.result ? '✅' : '❌'} ${test.test}: ${test.details}`)
      })

      if (isOpenAIReady) {
        console.log('🎯 OpenAI opérationnel - Tentative de génération...')
        
        try {
          const requestBody = {
            model: 'gpt-3.5-turbo',
            max_tokens: 800,
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
          }

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(30000) // Timeout de 30 secondes
          })

          console.log('📤 Réponse génération OpenAI:', response.status)

          if (response.ok) {
            const data = await response.json()
            
            if (data.choices?.[0]?.message?.content) {
              const processingTime = Date.now() - startTime
              console.log(`✅ OpenAI réussi en ${processingTime}ms`)
              
              return NextResponse.json({ 
                response: data.choices[0].message.content,
                mode: 'openai_success',
                diagnostics: diagnosticResults,
                processingTime,
                timestamp: new Date().toISOString(),
                version: '3.0_with_advanced_diagnostics'
              })
            } else {
              console.log('⚠️ OpenAI réponse sans contenu')
            }
          } else {
            const errorText = await response.text()
            console.log('❌ OpenAI erreur génération:', response.status, errorText)
          }
        } catch (generationError: any) {
          console.log('❌ Erreur génération OpenAI:', generationError.message)
        }
      } else {
        console.log('❌ OpenAI non opérationnel - Diagnostic échoué')
      }
    } else {
      console.log('⚠️ Clé OpenAI manquante ou format invalide')
    }
    
    // 🤖 FALLBACK VERS MODE INTELLIGENT
    console.log('✨ Fallback vers mode intelligent avec FAQ détaillées')
    const intelligentResponse = getTibokResponse(message, language)
    const processingTime = Date.now() - startTime
    
    return NextResponse.json({ 
      response: intelligentResponse,
      mode: 'intelligent_fallback',
      processingTime,
      timestamp: new Date().toISOString(),
      version: '3.0_intelligent_fallback',
      diagnostics: apiKey ? await diagnosticOpenAI(apiKey) : []
    })

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error('💥 Erreur générale:', error)
    
    // Messages d'erreur par langue
    const errorMessages: Record<string, string> = {
      fr: `🇲🇺 **TIBOK reste disponible !**\n\n✅ **Service opérationnel :**\n👨‍⚕️ Médecins mauriciens disponibles 8h-minuit 7j/7\n💰 Tarif unique : 1150 rs tout compris\n🚚 Livraison médicaments incluse\n🔒 100% sécurisé et confidentiel\n\n🩺 **Voulez-vous consulter directement ?**\n📞 Support technique disponible si besoin`,
      en: `🇲🇺 **TIBOK remains available!**\n\n✅ **Service operational:**\n👨‍⚕️ Mauritian doctors available 8am-midnight 7/7\n💰 Unique price: 1150 rs all inclusive\n🚚 Medication delivery included\n🔒 100% secure and confidential\n\n🩺 **Would you like to consult directly?**\n📞 Technical support available if needed`,
      mf: `🇲🇺 **TIBOK reste disponib!**\n\n✅ **Servis operasionel:**\n👨‍⚕️ Dokter morisien disponib 8h-minwi 7/7\n💰 Prix innik: 1150 rs tout compris\n🚚 Livrezon medikaman compris\n🔒 100% sekirize ek konfidansiel\n\n🩺 **Ou anvi konsulte direct?**\n📞 Sipor teknik disponib si bizin`,
    }

    const { language } = await request.json().catch(() => ({ language: 'fr' }))
    const errorMessage = errorMessages[language] || errorMessages.fr

    return NextResponse.json({ 
      response: errorMessage,
      mode: 'error_fallback',
      error: error.message,
      processingTime,
      timestamp: new Date().toISOString(),
      version: '3.0_error_handling'
    })
  }
}
