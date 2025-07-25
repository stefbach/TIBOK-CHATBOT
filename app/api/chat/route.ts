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

    // Configuration de l'API OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY non configurée')
      return NextResponse.json(
        { error: 'Configuration API manquante' },
        { status: 500 }
      )
    }

    // Appel à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Modèle moins cher
        max_tokens: 700,
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

    if (!response.ok) {
      console.error('Erreur API OpenAI:', response.status, response.statusText)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    const assistantResponse = data.choices[0].message.content

    return NextResponse.json({ response: assistantResponse })

  } catch (error) {
    console.error('Erreur dans l\'API chat:', error)
    
    // Messages d'erreur par langue
    const errorMessages: Record<string, string> = {
      fr: `Désolé, je rencontre une difficulté technique. 🔧\n\n🇲🇺 **TIBOK reste disponible !**\n\n✅ Docteurs mauriciens 8h-minuit 7j/7\n💰 Tarif unique : 1150 rs\n🩺 Service 100% opérationnel\n\nVoulez-vous consulter directement un docteur ?`,
      en: `Sorry, I'm experiencing technical difficulties. 🔧\n\n🇲🇺 **TIBOK remains available!**\n\n✅ Mauritian doctors 8am-midnight 7/7\n💰 Unique price: 1150 rs\n🩺 Service 100% operational\n\nWould you like to consult a doctor directly?`,
      mf: `Pardon, mo ena enn problem teknik. 🔧\n\n🇲🇺 **TIBOK reste disponib!**\n\n✅ Dokter morisien 8h-minwi 7/7\n💰 Prix innik: 1150 rs\n🩺 Service 100% operasionel\n\nOu anvi consulte enn dokter direct?`,
    }

    const { language } = await request.json().catch(() => ({ language: 'fr' }))
    const errorMessage = errorMessages[language] || errorMessages.fr

    return NextResponse.json({ response: errorMessage })
  }
}
