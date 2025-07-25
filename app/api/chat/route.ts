import { NextRequest, NextResponse } from 'next/server'

// Interface pour la requête
interface ChatRequest {
  message: string
  language: string
}

// Configuration des prompts système par langue
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

    // 🔍 DIAGNOSTIC COMPLET
    console.log('🚀 === DIAGNOSTIC COMPLET API TIBOK ===')
    console.log('📥 Message reçu:', message.substring(0, 100))
    console.log('🌍 Langue:', language)
    
    // Vérification de la variable d'environnement
    const apiKey = process.env.OPENAI_API_KEY
    console.log('🔑 Variable d\'environnement:')
    console.log('  - OPENAI_API_KEY définie:', !!apiKey)
    console.log('  - Longueur de la clé:', apiKey?.length || 0)
    console.log('  - Format clé:', apiKey ? `${apiKey.substring(0, 15)}...` : 'AUCUNE')
    console.log('  - Type clé:', apiKey?.startsWith('sk-svcacct-') ? 'Service Account' : 
                                apiKey?.startsWith('sk-proj-') ? 'Project' :
                                apiKey?.startsWith('sk-') ? 'Standard' : 'INVALIDE')

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY non configurée')
      return NextResponse.json(
        { error: 'Configuration API manquante' },
        { status: 500 }
      )
    }

    // Vérification du format de la clé API
    if (!apiKey.startsWith('sk-')) {
      console.error('❌ Format de clé API OpenAI invalide')
      return NextResponse.json(
        { error: 'Format de clé API invalide' },
        { status: 500 }
      )
    }

    // 🧪 TEST AVEC DIFFÉRENTS MODÈLES
    const modelsToTry = [
      'gpt-3.5-turbo',      // Le plus stable et accessible
      'gpt-4o-mini',        // Version mini plus accessible  
      'gpt-4-turbo',        // Si accessible
      'gpt-4o'              // En dernier recours
    ]

    for (const modelName of modelsToTry) {
      try {
        console.log(`🧪 Test du modèle: ${modelName}`)
        
        // Préparer la requête
        const requestBody = {
          model: modelName,
          max_tokens: 500,  // Réduit pour éviter les limites
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
        
        console.log('📦 Body de la requête:', JSON.stringify(requestBody, null, 2).substring(0, 500))

        // Appel à l'API OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        })

        console.log(`📡 Réponse API pour ${modelName}:`)
        console.log('  - Status:', response.status)
        console.log('  - Status Text:', response.statusText)
        console.log('  - Headers:', Object.fromEntries(response.headers.entries()))

        if (response.ok) {
          const data = await response.json()
          console.log('📊 Données reçues:', {
            choices: data.choices?.length || 0,
            usage: data.usage || 'non disponible'
          })
          
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('❌ Structure de réponse invalide:', data)
            continue
          }

          const assistantResponse = data.choices[0].message.content
          console.log('✅ SUCCÈS avec', modelName)
          console.log('📝 Réponse:', assistantResponse.substring(0, 100) + '...')

          return NextResponse.json({ response: assistantResponse })
          
        } else {
          // Récupérer les détails de l'erreur
          const errorText = await response.text()
          console.error(`❌ Erreur avec ${modelName}:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          })
          
          // Si c'est un 401, on peut arrêter car ça ne changera pas avec d'autres modèles
          if (response.status === 401) {
            console.error('🚫 Erreur 401 - Problème d\'authentification détecté')
            console.error('📋 Vérifications à faire:')
            console.error('  1. Clé API correcte ?')
            console.error('  2. Clé non expirée ?')
            console.error('  3. Permissions suffisantes ?')
            console.error('  4. Facturation à jour ?')
            
            return NextResponse.json({
              error: 'Erreur d\'authentification OpenAI',
              details: {
                status: response.status,
                message: errorText,
                suggestions: [
                  'Vérifiez votre clé API sur platform.openai.com',
                  'Vérifiez votre facturation',
                  'Régénérez une nouvelle clé API'
                ]
              }
            }, { status: 401 })
          }
          
          // Pour les autres erreurs, on continue avec le modèle suivant
          continue
        }

      } catch (modelError) {
        console.error(`💥 Exception avec ${modelName}:`, modelError)
        continue
      }
    }

    // Si tous les modèles échouent
    console.error('❌ Tous les modèles OpenAI ont échoué')
    throw new Error('Tous les modèles OpenAI ont échoué')

  } catch (error) {
    console.error('💥 Erreur générale dans l\'API chat:', error)
    
    // Messages d'erreur par langue
    const errorMessages: Record<string, string> = {
      fr: `Désolé, je rencontre une difficulté technique. 🔧\n\n🇲🇺 **TIBOK reste disponible !**\n\n✅ Docteurs mauriciens 8h-minuit 7j/7\n💰 Tarif unique : 1150 rs\n🩺 Service 100% opérationnel\n\nVoulez-vous consulter directement un docteur ?`,
      en: `Sorry, I'm experiencing technical difficulties. 🔧\n\n🇲🇺 **TIBOK remains available!**\n\n✅ Mauritian doctors 8am-midnight 7/7\n💰 Unique price: 1150 rs\n🩺 Service 100% operational\n\nWould you like to consult a doctor directly?`,
      mf: `Pardon, mo ena enn problem teknik. 🔧\n\n🇲🇺 **TIBOK reste disponib!**\n\n✅ Dokter morisien 8h-minwi 7/7\n💰 Prix innik: 1150 rs\n🩺 Service 100% operasionel\n\nOu anvi consulte enn dokter direct?`,
    }

    const { language } = await request.json().catch(() => ({ language: 'fr' }))
    const errorMessage = errorMessages[language] || errorMessages.fr

    return NextResponse.json({ 
      response: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? {
        error: error.message,
        timestamp: new Date().toISOString()
      } : undefined
    })
  }
}
