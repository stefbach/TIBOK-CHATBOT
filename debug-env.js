// Créez ce fichier : debug-env.js
// Exécutez avec : node debug-env.js

const fs = require('fs')
const path = require('path')

console.log('🔍 Diagnostic du fichier .env.local')
console.log('=====================================')

// Lire le fichier .env.local
const envPath = path.join(process.cwd(), '.env.local')
console.log('📁 Chemin du fichier:', envPath)

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  console.log('✅ Fichier trouvé')
  console.log('📝 Contenu brut:')
  console.log('---')
  console.log(envContent)
  console.log('---')
  
  // Analyser chaque ligne
  const lines = envContent.split('\n')
  console.log('\n🔍 Analyse ligne par ligne:')
  
  lines.forEach((line, index) => {
    console.log(`Ligne ${index + 1}:`)
    console.log(`  Contenu brut: "${line}"`)
    console.log(`  Longueur: ${line.length}`)
    console.log(`  Caractères spéciaux:`, JSON.stringify(line))
    
    if (line.startsWith('OPENAI_API_KEY=')) {
      const key = line.replace('OPENAI_API_KEY=', '')
      console.log(`  🔑 Clé extraite: "${key}"`)
      console.log(`  🔑 Longueur clé: ${key.length}`)
      console.log(`  🔑 Premier caractère: "${key[0]}"`)
      console.log(`  🔑 Dernier caractère: "${key[key.length - 1]}"`)
      console.log(`  🔑 Whitespace au début/fin?:`, /^\s|\s$/.test(key))
      console.log(`  🔑 Format valide sk-?:`, key.startsWith('sk-'))
    }
    console.log('---')
  })
  
} catch (error) {
  console.log('❌ Erreur lecture fichier:', error.message)
}

// Test avec la variable d'environnement Next.js
console.log('\n🔍 Test variable d\'environnement Next.js:')
require('dotenv').config({ path: '.env.local' })
const envKey = process.env.OPENAI_API_KEY
console.log('Clé depuis process.env:', envKey ? `${envKey.substring(0, 15)}...` : 'UNDEFINED')
console.log('Longueur depuis process.env:', envKey ? envKey.length : 0)

// Test API direct
if (envKey) {
  console.log('\n🧪 Test API OpenAI direct...')
  testOpenAIKey(envKey)
}

async function testOpenAIKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
    })

    console.log('Status modèles:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Clé API valide!')
      console.log('Modèles disponibles:', data.data.slice(0, 3).map(m => m.id))
    } else {
      const error = await response.text()
      console.log('❌ Clé API invalide:', error)
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message)
  }
}
