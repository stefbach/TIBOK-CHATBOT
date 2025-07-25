// Créez ce fichier : test-openai.js
// Exécutez avec : node test-openai.js

const testOpenAI = async () => {
  const apiKey = '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'
  
  console.log('🧪 Test de la clé OpenAI...')
  console.log('Clé:', apiKey.substring(0, 20) + '...')
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, just testing the API. Respond with "API works!"',
          },
        ],
      }),
    })

    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Succès!')
      console.log('Réponse:', data.choices?.[0]?.message?.content)
    } else {
      const errorText = await response.text()
      console.log('❌ Erreur HTTP:', response.status)
      console.log('Détails:', errorText)
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message)
  }
}

testOpenAI()
