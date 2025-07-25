import { NextRequest, NextResponse } from 'next/server'

// Interface pour la requête
interface ChatRequest {
  message: string
  language: string
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

  // 🚨 Détection d'urgences médicales
  const emergencyKeywords = ['urgence', 'emergency', 'irzans', 'grave', 'serious', 'grav', 'douleur poitrine', 'chest pain', 'difficulté respirer', 'difficulty breathing', 'accident']
  if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const emergencyResponses = {
      fr: "🚨 **URGENCE MÉDICALE DÉTECTÉE**\n\n⚠️ **Tibok n'est PAS un service d'urgence !**\n\nEn cas d'urgence vitale :\n🚑 **Appelez immédiatement le 114 (SAMU) ou 999**\n🏥 **Rendez-vous à l'hôpital le plus proche**\n\n**Tibok est pour :** Problèmes de santé non urgents\n• Fièvre modérée, rhume, suivi médical\n• Conseils santé généraux\n• Renouvellement d'ordonnances simples\n\n🩺 Pour une consultation non urgente, nous sommes disponibles 8h-minuit !",
      en: "🚨 **MEDICAL EMERGENCY DETECTED**\n\n⚠️ **Tibok is NOT an emergency service!**\n\nIn case of life-threatening emergency:\n🚑 **Call immediately 114 (SAMU) or 999**\n🏥 **Go to the nearest hospital**\n\n**Tibok is for:** Non-urgent health issues\n• Moderate fever, cold, medical follow-up\n• General health advice\n• Simple prescription renewals\n\n🩺 For non-urgent consultation, we're available 8am-midnight!",
      mf: "🚨 **IRZANS MEDICAL DETEKTE**\n\n⚠️ **Tibok PA enn servis dirzans !**\n\nDan ka irzans ki menas lavi :\n🚑 **Telefonn deswit 114 (SAMU) ou 999**\n🏥 **Al lopital pli pre**\n\n**Tibok se pou :** Problem lasante ki pa irzans\n• Lafiev modere, freser, swivi medical\n• Konsey lasante zeneral\n• Renouvelman preskripsion sinp\n\n🩺 Pou konsultasion ki pa irzans, nou disponib 8h-minwi !"
    }
    return emergencyResponses[language] || emergencyResponses.fr
  }

  // 💰 Questions sur les prix et tarifs
  const priceKeywords = ['prix', 'price', 'tarif', 'cout', 'cost', 'combien', 'how much', 'cher', 'expensive', 'remboursement', 'assurance', 'insurance']
  if (priceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const priceResponses = {
      fr: "💰 **TARIF TIBOK : 1150 rs tout compris !**\n\n✨ **Ce qui est inclus :**\n🩺 Consultation complète avec docteur mauricien\n💊 Prescription électronique si nécessaire\n🚚 Livraison médicaments (8h-17h)\n📱 Suivi médical possible\n🇲🇺 Service 100% mauricien\n\n💳 **Paiement sécurisé :** Carte bancaire, e-wallet\n📋 **Remboursement :** Vérifiez avec votre assurance privée\n⚠️ Non couvert par le système public mauricien\n\n⏰ **Disponible maintenant 8h-minuit 7j/7**\n\nPrêt(e) pour une consultation ?",
      en: "💰 **TIBOK PRICE: 1150 rs all inclusive!**\n\n✨ **What's included:**\n🩺 Complete consultation with Mauritian doctor\n💊 Electronic prescription if needed\n🚚 Medication delivery (8am-5pm)\n📱 Medical follow-up possible\n🇲🇺 100% Mauritian service\n\n💳 **Secure payment:** Bank card, e-wallet\n📋 **Reimbursement:** Check with your private insurance\n⚠️ Not covered by Mauritian public system\n\n⏰ **Available now 8am-midnight 7/7**\n\nReady for a consultation?",
      mf: "💰 **PRIX TIBOK : 1150 rs tout compris !**\n\n✨ **Sa ki compris :**\n🩺 Konsultasion complet ek dokter morisien\n💊 Preskripsion elektronik si bizin\n🚚 Livrezon medikaman (8h-17h)\n📱 Swivi medical posib\n🇲🇺 Servis 100% morisien\n\n💳 **Peyman sekirize :** Kart labank, e-wallet\n📋 **Ranboursman :** Verifie avek ou lasirans prive\n⚠️ Pa kouver par sistem piblik morisien\n\n⏰ **Disponib astere 8h-minwi 7/7**\n\nPare pou enn konsultasion ?"
    }
    return priceResponses[language] || priceResponses.fr
  }

  // ⏰ Questions sur les horaires et disponibilité
  const timeKeywords = ['horaire', 'hour', 'ler', 'temps', 'time', 'quand', 'when', 'kan', 'disponible', 'available', 'ouvert', 'open', 'rendez-vous', 'appointment', 'randevou']
  if (timeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const timeResponses = {
      fr: "⏰ **HORAIRES TIBOK : 8h à minuit, 7 jours sur 7**\n\n✅ **Toujours disponible :**\n📅 Lundi à dimanche : 8h00 - minuit\n🎉 Même les weekends et jours fériés !\n🚫 **Pas de rendez-vous nécessaire**\n⚡ Service premier arrivé, premier servi\n\n🔄 **Comment ça marche :**\n1️⃣ Connectez-vous à la plateforme\n2️⃣ Remplissez la fiche d'information\n3️⃣ Effectuez votre paiement\n4️⃣ Entrez dans la file d'attente virtuelle\n5️⃣ Connexion automatique avec un médecin\n\n🇲🇺 **Docteurs mauriciens toujours prêts**\n📍 **Service disponible :** Maurice + Rodrigues\n\n🩺 Consulter maintenant ?",
      en: "⏰ **TIBOK HOURS: 8am to midnight, 7 days a week**\n\n✅ **Always available:**\n📅 Monday to Sunday: 8:00 AM - midnight\n🎉 Even weekends and holidays!\n🚫 **No appointment needed**\n⚡ First come, first served\n\n🔄 **How it works:**\n1️⃣ Connect to the platform\n2️⃣ Fill out the information form\n3️⃣ Make your payment\n4️⃣ Enter virtual queue\n5️⃣ Automatic connection with a doctor\n\n🇲🇺 **Mauritian doctors always ready**\n📍 **Service available:** Mauritius + Rodrigues\n\n🩺 Consult now?",
      mf: "⏰ **LER TIBOK : 8h-minwi, 7 zour lor 7**\n\n✅ **Touzour disponib :**\n📅 Lindi ziska dimans : 8:00 - minwi\n🎉 Mem weekend ek zour konze !\n🚫 **Pa bizin randevou**\n⚡ Premie arive, premie servi\n\n🔄 **Kouma li marse :**\n1️⃣ Konekte lor platform-la\n2️⃣ Ranpli fich linformasion\n3️⃣ Fer ou peyman\n4️⃣ Rant dan lake virtiel\n5️⃣ Koneksion otomatik avek enn dokter\n\n🇲🇺 **Dokter morisien touzour pare**\n📍 **Servis disponib :** Moris + Rodrigues\n\n🩺 Konsulte astere ?"
    }
    return timeResponses[language] || timeResponses.fr
  }

  // 🚚 Questions sur la livraison et médicaments
  const deliveryKeywords = ['livraison', 'delivery', 'médicament', 'medicament', 'medication', 'medikaman', 'pharmacie', 'pharmacy', 'ordonnance', 'prescription', 'rodrigues']
  if (deliveryKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const deliveryResponses = {
      fr: "🚚 **LIVRAISON TIBOK : Incluse dans le tarif !**\n\n✨ **Service livraison :**\n📦 Médicaments prescrits livrés chez vous\n⏰ Livraison 8h-17h (jours ouvrables)\n🇲🇺 Couverture Maurice + Rodrigues\n💰 **Inclus dans les 1150 rs**\n🔒 Livraison sécurisée et discrète\n\n📍 **Zones couvertes :**\n✅ Toute l'île Maurice (urbain + rural)\n✅ Rodrigues (délai +1-2 jours)\n\n💊 **Alternative :** Vous pouvez aussi récupérer votre ordonnance électronique dans n'importe quelle pharmacie\n\n🆓 **Livraison souvent gratuite** pour les patients Tibok (selon montant commande)\n\n🩺 Consulter et recevoir vos médicaments ?",
      en: "🚚 **TIBOK DELIVERY: Included in the price!**\n\n✨ **Delivery service:**\n📦 Prescribed medications delivered to you\n⏰ Delivery 8am-5pm (working days)\n🇲🇺 Coverage Mauritius + Rodrigues\n💰 **Included in 1150 rs**\n🔒 Secure and discreet delivery\n\n📍 **Areas covered:**\n✅ All of Mauritius (urban + rural)\n✅ Rodrigues (+1-2 days delay)\n\n💊 **Alternative:** You can also collect your e-prescription at any pharmacy\n\n🆓 **Often free delivery** for Tibok patients (depending on order amount)\n\n🩺 Consult and receive your medications?",
      mf: "🚚 **LIVREZON TIBOK : Compris dan prix !**\n\n✨ **Servis livrezon :**\n📦 Medikaman preskri livre lakaz ou\n⏰ Livrezon 8h-17h (zour travay)\n🇲🇺 Kouvertur Moris + Rodrigues\n💰 **Compris dan 1150 rs**\n🔒 Livrezon sekirite ek diskre\n\n📍 **Zonn kouver :**\n✅ Tout Moris (lavil + lakanpagn)\n✅ Rodrigues (+1-2 zour atard)\n\n💊 **Alternatif :** Ou kapav osi al sers ou preskripsion elektronik dan ninport ki farmasi\n\n🆓 **Livrezon souvan gratui** pou pasian Tibok (depandan lor kantite komann)\n\n🩺 Konsulte ek resevwar ou medikaman ?"
    }
    return deliveryResponses[language] || deliveryResponses.fr
  }

  // 🔒 Questions sur sécurité et confidentialité
  const securityKeywords = ['sécurité', 'security', 'sekirite', 'confidentialité', 'confidential', 'konfidansial', 'données', 'data', 'done', 'privé', 'private', 'enregistrement', 'recorded', 'anrezistre']
  if (securityKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const securityResponses = {
      fr: "🔒 **SÉCURITÉ & CONFIDENTIALITÉ TIBOK**\n\n✅ **Vos données sont protégées :**\n🛡️ Systèmes sécurisés et chiffrés\n👨‍⚕️ Seuls vous et votre médecin ont accès\n🚫 **Aucune vidéo/audio enregistrée**\n📋 Seules les notes médicales importantes conservées\n🇲🇺 Conformité aux lois mauriciennes sur les données\n\n🤐 **Confidentialité totale :**\n• Jamais de partage sans votre consentement\n• Référence à un spécialiste seulement si autorisé\n• Respect du secret médical\n\n💡 **Conseil :** Choisissez un endroit privé pour votre consultation (écouteurs recommandés)\n\n🩺 Prêt(e) pour une consultation en toute sécurité ?",
      en: "🔒 **TIBOK SECURITY & CONFIDENTIALITY**\n\n✅ **Your data is protected:**\n🛡️ Secure and encrypted systems\n👨‍⚕️ Only you and your doctor have access\n🚫 **No video/audio recordings**\n📋 Only important medical notes kept\n🇲🇺 Compliant with Mauritian data protection laws\n\n🤐 **Total confidentiality:**\n• Never shared without your consent\n• Referral to specialist only if authorized\n• Medical confidentiality respected\n\n💡 **Tip:** Choose a private space for consultation (headphones recommended)\n\n🩺 Ready for a secure consultation?",
      mf: "🔒 **SEKIRITE & KONFIDANSIALITE TIBOK**\n\n✅ **Ou bann done proteze :**\n🛡️ Sistem sekirize ek ankripte\n👨‍⚕️ Zis ou ek ou dokter ki ena akse\n🚫 **Okenn video/odio anrezistre**\n📋 Zis bann not medical inportan gard\n🇲🇺 Konforme avek lalwa morisien lor proteksion done\n\n🤐 **Konfidansialite total :**\n• Zame partaz san ou konsantman\n• Referans a spesialis zis si ou otoriz\n• Sekre medical respekte\n\n💡 **Konsey :** Swazir enn plas prive pou ou konsultasion (ekoutetr rekomande)\n\n🩺 Pare pou enn konsultasion an sekirite ?"
    }
    return securityResponses[language] || securityResponses.fr
  }

  // 👨‍⚕️ Questions sur les médecins et spécialistes
  const doctorKeywords = ['médecin', 'doctor', 'dokter', 'spécialiste', 'specialist', 'spesialis', 'qualifié', 'qualified', 'kalifie', 'médecins tibok', 'tibok doctors']
  if (doctorKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const doctorResponses = {
      fr: "👨‍⚕️ **LES MÉDECINS TIBOK**\n\n🇲🇺 **Médecins 100% mauriciens :**\n✅ Diplômés et autorisés à exercer à Maurice\n📋 **Tous inscrits au Medical Council de Maurice**\n🎓 Professionnels expérimentés et bienveillants\n🗣️ Parlent français, anglais et créole mauricien\n\n👥 **Principalement généralistes** pour :\n• Problèmes de santé courants\n• Suivi de maladies chroniques stables\n• Conseils santé généraux\n• Renouvellement d'ordonnances simples\n\n🔄 **Référence vers spécialistes :** Si nécessaire, orientation avec lettre de référence\n\n⚡ **Sans jargon médical** - Communication claire et compréhensible\n\n🩺 Prêt(e) à consulter un médecin mauricien ?",
      en: "👨‍⚕️ **TIBOK DOCTORS**\n\n🇲🇺 **100% Mauritian doctors:**\n✅ Qualified and licensed to practice in Mauritius\n📋 **All registered with Medical Council of Mauritius**\n🎓 Experienced and caring professionals\n🗣️ Speak French, English and Mauritian Creole\n\n👥 **Mainly general practitioners** for:\n• Common health issues\n• Stable chronic disease follow-up\n• General health advice\n• Simple prescription renewals\n\n🔄 **Specialist referral:** If needed, guidance with referral letter\n\n⚡ **No medical jargon** - Clear and understandable communication\n\n🩺 Ready to consult a Mauritian doctor?",
      mf: "👨‍⚕️ **DOKTER TIBOK**\n\n🇲🇺 **Dokter 100% morisien :**\n✅ Kalifie ek otorize pou pratike dan Moris\n📋 **Tou anrezistre kot Medical Council Moris**\n🎓 Profesionel avek lexperyans ek konpasion\n🗣️ Koz franse, angle ek kreol morisien\n\n👥 **Prinsipalman zeneral praktiyen** pou :\n• Problem lasante komen\n• Swivi maladi kronik stab\n• Konsey lasante zeneral\n• Renouvelman preskripsion sinp\n\n🔄 **Referans ver spesialis :** Si bizin, gidans avek let referans\n\n⚡ **San zargon medical** - Kominikasion kler ek konprenabl\n\n🩺 Pare pou konsulte enn dokter morisien ?"
    }
    return doctorResponses[language] || doctorResponses.fr
  }

  // 📱 Questions techniques et assistance
  const techKeywords = ['technique', 'technical', 'teknik', 'problème', 'problem', 'souci', 'aide', 'help', 'assistance', 'support', 'application', 'app', 'internet', 'connexion', 'connection']
  if (techKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const techResponses = {
      fr: "📱 **ASSISTANCE TECHNIQUE TIBOK**\n\n🆘 **Équipe support disponible :**\n📞 Par téléphone, email ou chat\n⏰ Lundi-Dimanche, 8h-20h\n👥 Guide pas à pas pour tous problèmes\n\n💻 **Pas besoin d'application :**\n🌐 Accessible via navigateur web sécurisé\n📱 Optimisé pour smartphone, tablette, ordinateur\n📶 Connexion Internet stable recommandée\n\n🤝 **Aide pour débutants :**\n👴👵 Accompagnement téléphonique disponible\n👨‍👩‍👧‍👦 Demandez l'aide d'un proche si besoin\n📖 Explications étape par étape\n\n✅ **Prérequis consultation :**\n• Endroit calme et privé\n• Appareil chargé\n• Caméra et micro fonctionnels\n\n🆘 Besoin d'aide technique ?",
      en: "📱 **TIBOK TECHNICAL SUPPORT**\n\n🆘 **Support team available:**\n📞 By phone, email or chat\n⏰ Monday-Sunday, 8am-8pm\n👥 Step-by-step guidance for all issues\n\n💻 **No app needed:**\n🌐 Accessible via secure web browser\n📱 Optimized for smartphone, tablet, computer\n📶 Stable Internet connection recommended\n\n🤝 **Help for beginners:**\n👴👵 Phone assistance available\n👨‍👩‍👧‍👦 Ask family/friends for help if needed\n📖 Step-by-step explanations\n\n✅ **Consultation requirements:**\n• Quiet, private space\n• Charged device\n• Working camera and microphone\n\n🆘 Need technical help?",
      mf: "📱 **SIPOR TEKNIK TIBOK**\n\n🆘 **Lekip soutien disponib :**\n📞 Par telefonn, email ou chat\n⏰ Lindi-Dimans, 8h-20h\n👥 Gidans etap par etap pou tou problem\n\n💻 **Pa bizin aplikasion :**\n🌐 Aksesib travei navigater web sekirize\n📱 Optimise pou smartphone, tablet, ordinater\n📶 Koneksion internet stab rekomande\n\n🤝 **Led pou komensan :**\n👴👵 Asistans par telefonn disponib\n👨‍👩‍👧‍👦 Demann led famiy/kamarad si bizin\n📖 Explikasion etap par etap\n\n✅ **Kondision konsultasion :**\n• Plas trankil ek prive\n• Laparey bien sarze\n• Kamera ek mikro ki pe marse\n\n🆘 Bizin led teknik ?"
    }
    return techResponses[language] || techResponses.fr
  }

  // 🦷 Questions dentaires
  const dentalKeywords = ['dentaire', 'dental', 'danter', 'dent', 'tooth', 'ledan', 'dentiste', 'dentist', 'dantis']
  if (dentalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const dentalResponses = {
      fr: "🦷 **SOINS DENTAIRES**\n\n❌ **Tibok ne couvre PAS les urgences dentaires**\n\n🚨 **Pour problèmes dentaires urgents :**\n• Rage de dent sévère\n• Dent cassée ou perdue\n• Abcès dentaire\n• Traumatisme buccal\n\n➡️ **Consultez un dentiste en personne immédiatement**\n\n💡 **Tibok peut vous donner :**\n• Conseils généraux d'hygiène bucco-dentaire\n• Orientation vers un dentiste approprié\n• Conseils d'urgence en attendant le dentiste\n\n🩺 Autre question sur les services Tibok ?",
      en: "🦷 **DENTAL CARE**\n\n❌ **Tibok does NOT cover dental emergencies**\n\n🚨 **For urgent dental issues:**\n• Severe toothache\n• Broken or lost tooth\n• Dental abscess\n• Oral trauma\n\n➡️ **See a dentist in person immediately**\n\n💡 **Tibok can provide:**\n• General oral hygiene advice\n• Referral to appropriate dentist\n• Emergency advice while waiting for dentist\n\n🩺 Other questions about Tibok services?",
      mf: "🦷 **SWIN DANTER**\n\n❌ **Tibok PA okip irzans danter**\n\n🚨 **Pou problem danter irzans :**\n• Gran douler ledan\n• Ledan kase ou perdi\n• Abse danter\n• Trauma dan labous\n\n➡️ **Konsilte enn dantis an personn deswit**\n\n💡 **Tibok kapav donn :**\n• Konsey zeneral lizyen labous-danter\n• Gidans ver enn dantis apropriey\n• Konsey dirzans annatenden dantis\n\n🩺 Lezot kestion lor servis Tibok ?"
    }
    return dentalResponses[language] || dentalResponses.fr
  }

  // ❌ Questions sur limitations
  const limitKeywords = ['limite', 'limits', 'limit', 'pas adapté', 'not suitable', 'pa adapte', 'ne peut pas', 'cannot', 'pa kapav', 'fracture', 'radiographie', 'x-ray', 'analyse', 'examen physique']
  if (limitKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const limitResponses = {
      fr: "⚠️ **LIMITES DU SERVICE TIBOK**\n\n✅ **Tibok CONVIENT pour :**\n• Problèmes de santé courants et non graves\n• Fièvre modérée, rhume, toux\n• Suivi de maladie chronique stable\n• Questions générales de santé\n• Petites blessures sans gravité\n\n❌ **Tibok N'EST PAS adapté pour :**\n🩻 Suspicion de fracture (os cassé)\n🔍 Besoin d'échographie ou radiographie immédiate\n🪡 Points de suture nécessaires\n💉 Injections urgentes\n👁️ Examens physiques approfondis\n\n🏥 **Dans ces cas :** Consultation physique obligatoire\n🔄 **Si le médecin Tibok identifie un besoin de consultation physique, il vous orientera avec une lettre de référence**\n\n🩺 Question sur ce que Tibok peut traiter ?",
      en: "⚠️ **TIBOK SERVICE LIMITS**\n\n✅ **Tibok IS SUITABLE for:**\n• Common, non-serious health issues\n• Moderate fever, cold, cough\n• Stable chronic disease follow-up\n• General health questions\n• Minor injuries without severity\n\n❌ **Tibok IS NOT suitable for:**\n🩻 Suspected fracture (broken bone)\n🔍 Need for immediate ultrasound or X-ray\n🪡 Stitches required\n💉 Urgent injections\n👁️ Thorough physical examinations\n\n🏥 **In these cases:** Physical consultation mandatory\n🔄 **If Tibok doctor identifies need for physical consultation, they'll refer you with a referral letter**\n\n🩺 Questions about what Tibok can treat?",
      mf: "⚠️ **LIMIT SERVIS TIBOK**\n\n✅ **Tibok KONVINK pou :**\n• Problem lasante komen, ki pa grav\n• Lafiev modere, freser, latous\n• Swivi maladi kronik stab\n• Kestion lasante zeneral\n• Ti blesir ki pa grav\n\n❌ **Tibok PA adapte pou :**\n🩻 Soupsonn fraktir (lezo kase)\n🔍 Bizin ultrason ou reyon X imedia\n🪡 Koud neseser\n💉 Pikir irzans\n👁️ Examen fizik aprofondi\n\n🏥 **Dan sa bann ka-la :** Konsultasion fizik obligatwar\n🔄 **Si dokter Tibok idantifie bezwin konsultasion fizik, zot pou refer ou avek enn let referans**\n\n🩺 Kestion lor sa ki Tibok kapav trete ?"
    }
    return limitResponses[language] || limitResponses.fr
  }

  // 🔄 Questions sur le suivi
  const followupKeywords = ['suivi', 'follow-up', 'swivi', 'après consultation', 'after consultation', 'apre konsultasion', 'résultats', 'results', 'rezilta']
  if (followupKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const followupResponses = {
      fr: "🔄 **SUIVI APRÈS CONSULTATION TIBOK**\n\n✅ **Possibilités de suivi :**\n📅 Consultation de suivi programmable\n💬 Messages via la plateforme pour clarifications\n📋 Discussion des résultats d'examens\n👀 Évaluation de l'évolution des symptômes\n\n📞 **Quand recontacter :**\n• Questions sur votre ordonnance\n• Évolution de vos symptômes\n• Résultats d'analyses à discuter\n• Clarifications post-consultation\n\n⚠️ **Si aggravation notable :**\n➡️ Consultation physique recommandée\n🚨 Urgences : Appelez le 114 ou 999\n\n🔄 **Suivi flexible adapté à vos besoins**\n\n🩺 Questions sur le suivi médical ?",
      en: "🔄 **FOLLOW-UP AFTER TIBOK CONSULTATION**\n\n✅ **Follow-up options:**\n📅 Follow-up consultation schedulable\n💬 Messages via platform for clarifications\n📋 Discussion of test results\n👀 Assessment of symptom progression\n\n📞 **When to contact again:**\n• Questions about your prescription\n• Evolution of your symptoms\n• Test results to discuss\n• Post-consultation clarifications\n\n⚠️ **If significant worsening:**\n➡️ Physical consultation recommended\n🚨 Emergencies: Call 114 or 999\n\n🔄 **Flexible follow-up adapted to your needs**\n\n🩺 Questions about medical follow-up?",
      mf: "🔄 **SWIVI APRE KONSULTASION TIBOK**\n\n✅ **Opsion swivi :**\n📅 Konsultasion swivi kapav planifie\n💬 Mesaz travei platform pou leklersisman\n📋 Diskisyon rezilta tes\n👀 Evalyasyon levolision sintom\n\n📞 **Kan pou kontakte anvoy :**\n• Kestion lor ou preskripsion\n• Levolision ou sintom\n• Rezilta analiz pou diskit\n• Leklersisman apre konsultasion\n\n⚠️ **Si agravasion noter :**\n➡️ Konsultasion fizik rekomande\n🚨 Irzans : Telefonn 114 ou 999\n\n🔄 **Swivi flexib adapte a ou bezwin**\n\n🩺 Kestion lor swivi medical ?"
    }
    return followupResponses[language] || followupResponses.fr
  }

  // 👋 Salutations
  const greetingKeywords = ['bonjour', 'hello', 'hi', 'salut', 'bonsoir', 'bonzour', 'allo', 'hey']
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const greetingResponses = {
      fr: "👋 **Bonjour et bienvenue sur TIBOK !**\n\n🇲🇺 Je suis votre assistant pour le **premier service de téléconsultation 100% mauricien** !\n\n✨ **Ce que je peux vous expliquer :**\n💰 Nos tarifs (1150 rs tout compris)\n⏰ Nos horaires (8h-minuit 7j/7)\n🚚 Notre service de livraison gratuit\n🩺 Comment consulter un docteur\n🔒 Sécurité et confidentialité\n👨‍⚕️ Nos médecins mauriciens qualifiés\n⚠️ Limites du service et urgences\n\n🌟 **Tibok c'est :** Médecins mauriciens • Sans rendez-vous • Prix transparent • Livraison incluse\n\n❓ **Que voulez-vous savoir sur TIBOK ?**",
      en: "👋 **Hello and welcome to TIBOK!**\n\n🇲🇺 I'm your assistant for the **first 100% Mauritian teleconsultation service**!\n\n✨ **What I can explain:**\n💰 Our prices (1150 rs all inclusive)\n⏰ Our hours (8am-midnight 7/7)\n🚚 Our free delivery service\n🩺 How to consult a doctor\n🔒 Security and confidentiality\n👨‍⚕️ Our qualified Mauritian doctors\n⚠️ Service limits and emergencies\n\n🌟 **Tibok is:** Mauritian doctors • No appointments • Transparent pricing • Delivery included\n\n❓ **What would you like to know about TIBOK?**",
      mf: "👋 **Bonzour ek bienveni lor TIBOK !**\n\n🇲🇺 Mo ou assistant pou **premie servis téléconsultation 100% morisien** !\n\n✨ **Sa mo kapav explik ou :**\n💰 Nou prix (1150 rs tout compris)\n⏰ Nou ler (8h-minwi 7/7)\n🚚 Nou servis livrezon gratui\n🩺 Kouma konsulte enn dokter\n🔒 Sekirite ek konfidansialite\n👨‍⚕️ Nou dokter morisien kalifie\n⚠️ Limit servis ek irzans\n\n🌟 **Tibok se :** Dokter morisien • San randevou • Prix transparent • Livrezon compris\n\n❓ **Ki ou anvi kone lor TIBOK ?**"
    }
    return greetingResponses[language] || greetingResponses.fr
  }

  // 📞 Questions sur comment consulter
  const consultKeywords = ['consulter', 'consultation', 'consult', 'comment faire', 'how to', 'kouma fer', 'étapes', 'steps', 'etap']
  if (consultKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const consultResponses = {
      fr: "🩺 **COMMENT CONSULTER UN DOCTEUR TIBOK ?**\n\n⚡ **Super simple : Consultations immédiates !**\n\n🔴 **Étapes en 5 minutes :**\n1️⃣ **Connectez-vous** à la plateforme Tibok\n2️⃣ **Remplissez** la fiche d'information rapide\n3️⃣ **Payez** 1150 rs de manière sécurisée\n4️⃣ **Entrez** dans la file d'attente virtuelle\n5️⃣ **Connexion automatique** avec un médecin mauricien\n\n⏱️ **Durée consultation :** 10-15 minutes (selon vos besoins)\n🗣️ **Langues :** Français, anglais, créole mauricien\n📱 **Appareils :** Smartphone, tablette ou ordinateur\n\n💡 **Préparez :** Endroit calme, liste de vos symptômes, médicaments actuels\n\n🚀 **Disponible maintenant** - Prêt(e) à consulter ?",
      en: "🩺 **HOW TO CONSULT A TIBOK DOCTOR?**\n\n⚡ **Super simple: Immediate consultations!**\n\n🔴 **Steps in 5 minutes:**\n1️⃣ **Connect** to Tibok platform\n2️⃣ **Fill out** quick information form\n3️⃣ **Pay** 1150 rs securely\n4️⃣ **Enter** virtual queue\n5️⃣ **Automatic connection** with Mauritian doctor\n\n⏱️ **Consultation duration:** 10-15 minutes (according to your needs)\n🗣️ **Languages:** French, English, Mauritian Creole\n📱 **Devices:** Smartphone, tablet or computer\n\n💡 **Prepare:** Quiet place, list of symptoms, current medications\n\n🚀 **Available now** - Ready to consult?",
      mf: "🩺 **KOUMA KONSULTE ENN DOKTER TIBOK ?**\n\n⚡ **Super fasil : Konsultasion imedia !**\n\n🔴 **Etap dan 5 minit :**\n1️⃣ **Konekte** lor platform Tibok\n2️⃣ **Ranpli** fich linformasion rapid\n3️⃣ **Pey** 1150 rs an sekirite\n4️⃣ **Rant** dan lake virtiel\n5️⃣ **Koneksion otomatik** avek enn dokter morisien\n\n⏱️ **Dire konsultasion :** 10-15 minit (depi ou bezwin)\n🗣️ **Lang :** Franse, angle, kreol morisien\n📱 **Laparey :** Smartphone, tablet ou ordinater\n\n💡 **Prepar :** Plas trankil, lalis ou sintom, medikaman ki pe pran\n\n🚀 **Disponib astere** - Pare pou konsulte ?"
    }
    return consultResponses[language] || consultResponses.fr
  }

  // 🆚 Questions comparatives
  const compareKeywords = ['pourquoi', 'why', 'kifer', 'avantage', 'advantage', 'avantaz', 'mieux', 'better', 'choisir', 'choose', 'swazir', 'différence', 'difference', 'diferans']
  if (compareKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const compareResponses = {
      fr: "💡 **POURQUOI CHOISIR TIBOK ?**\n\n🇲🇺 **L'AVANTAGE 100% MAURICIEN !**\n\n✨ **Nos avantages uniques :**\n👨‍⚕️ **Médecins mauriciens** qui vous comprennent culturellement\n💰 **Prix fixe transparent** : 1150 rs (pas de surprise)\n⏰ **Disponibilité étendue** : 8h-minuit, même weekends\n🚫 **Aucune attente** : Premier arrivé, premier servi\n🚚 **Livraison incluse** : Médicaments à domicile\n🔒 **Totalement sécurisé** et confidentiel\n📋 **Inscrits Medical Council** : Garantie de qualité\n\n🏆 **VS autres services :**\n• Plus accessible que les cliniques privées\n• Plus rapide que le système public\n• Plus personnel que les services étrangers\n\n🩺 **Prêt(e) à essayer l'excellence mauricienne ?**",
      en: "💡 **WHY CHOOSE TIBOK?**\n\n🇲🇺 **THE 100% MAURITIAN ADVANTAGE!**\n\n✨ **Our unique advantages:**\n👨‍⚕️ **Mauritian doctors** who understand you culturally\n💰 **Transparent fixed price**: 1150 rs (no surprises)\n⏰ **Extended availability**: 8am-midnight, even weekends\n🚫 **No waiting**: First come, first served\n🚚 **Delivery included**: Medications at home\n🔒 **Completely secure** and confidential\n📋 **Medical Council registered**: Quality guarantee\n\n🏆 **VS other services:**\n• More accessible than private clinics\n• Faster than public system\n• More personal than foreign services\n\n🩺 **Ready to try Mauritian excellence?**",
      mf: "💡 **KIFER SWAZIR TIBOK ?**\n\n🇲🇺 **AVANTAZ 100% MORISIEN !**\n\n✨ **Nou avantaz innik :**\n👨‍⚕️ **Dokter morisien** ki konpran ou kiltirelman\n💰 **Prix fiks transparent** : 1150 rs (pa gen sirepriz)\n⏰ **Disponibilite long** : 8h-minwi, mem weekend\n🚫 **Pa bizin atann** : Premie arive, premie servi\n🚚 **Livrezon compris** : Medikaman lakaz\n🔒 **Total sekirite** ek konfidansiel\n📋 **Anrezistre Medical Council** : Garanti kalite\n\n🏆 **VS lezot servis :**\n• Pli aksesib ki klinik prive\n• Pli rapid ki sistem piblik\n• Pli personel ki servis etranze\n\n🩺 **Pare pou essaiy lexselans morisien ?**"
    }
    return compareResponses[language] || compareResponses.fr
  }

  // 🌍 Réponse générale par défaut
  const defaultResponses = {
    fr: "🇲🇺 **TIBOK - Votre santé, notre priorité !**\n\n✨ **Service téléconsultation 100% mauricien**\n💰 **1150 rs tout compris** (consultation + livraison)\n⏰ **8h-minuit, 7j/7** - Même weekends et jours fériés\n🩺 **Médecins mauriciens** inscrits au Medical Council\n🚚 **Livraison gratuite** médicaments à domicile\n🚫 **Sans rendez-vous** - Premier arrivé, premier servi\n🔒 **100% sécurisé** et confidentiel\n\n❓ **Questions fréquentes :**\n• \"Quels sont vos tarifs et ce qui est inclus ?\"\n• \"Comment consulter un médecin maintenant ?\"\n• \"Quels sont vos horaires de disponibilité ?\"\n• \"Comment fonctionne la livraison de médicaments ?\"\n• \"Mes données sont-elles sécurisées ?\"\n• \"Quelles sont les limites du service ?\"\n\n🩺 **Prêt(e) pour une consultation avec un médecin mauricien ?**",
    en: "🇲🇺 **TIBOK - Your health, our priority!**\n\n✨ **100% Mauritian teleconsultation service**\n💰 **1150 rs all inclusive** (consultation + delivery)\n⏰ **8am-midnight, 7/7** - Even weekends and holidays\n🩺 **Mauritian doctors** registered with Medical Council\n🚚 **Free delivery** medications at home\n🚫 **No appointments** - First come, first served\n🔒 **100% secure** and confidential\n\n❓ **Frequent questions:**\n• \"What are your prices and what's included?\"\n• \"How to consult a doctor now?\"\n• \"What are your availability hours?\"\n• \"How does medication delivery work?\"\n• \"Is my data secure?\"\n• \"What are the service limits?\"\n\n🩺 **Ready for a consultation with a Mauritian doctor?**",
    mf: "🇲🇺 **TIBOK - Ou lasante, nou priorite !**\n\n✨ **Servis téléconsultation 100% morisien**\n💰 **1150 rs tout compris** (konsultasion + livrezon)\n⏰ **8h-minwi, 7/7** - Mem weekend ek zour konze\n🩺 **Dokter morisien** anrezistre kot Medical Council\n🚚 **Livrezon gratui** medikaman lakaz\n🚫 **San randevou** - Premie arive, premie servi\n🔒 **100% sekirize** ek konfidansiel\n\n❓ **Kestion frekant :**\n• \"Ki nou prix ek sa ki compris ?\"\n• \"Kouma konsulte enn dokter astere ?\"\n• \"Ki nou ler disponibilite ?\"\n• \"Kouma livrezon medikaman marse ?\"\n• \"Eski mo done sekirize ?\"\n• \"Ki limit servis-la ?\"\n\n🩺 **Pare pou enn konsultasion avek enn dokter morisien ?**"
  }
  
  return defaultResponses[language] || defaultResponses.fr
}

// Configuration des prompts système par langue (pour OpenAI si disponible)
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
- Clarifier les limites du service (pas pour urgences, fractures, examens physiques)

STYLE DE RÉPONSE :
- Réponses détaillées basées sur les FAQ officielles
- Mettre en avant les avantages mauriciens avec "🇲🇺"
- Structurer avec des emojis et listes à puces
- Encourager la consultation avec les docteurs TIBOK
- Mentionner le Medical Council pour crédibilité`,

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
- 100% secure and confidential data

YOUR ROLE:
- Provide information about TIBOK service only using detailed FAQ
- NEVER give medical advice
- Redirect to consultation for any medical question
- Identify and redirect emergencies to 114/999
- Be warm, professional and use appropriate emojis
- Clarify service limits (not for emergencies, fractures, physical exams)

RESPONSE STYLE:
- Detailed responses based on official FAQ
- Highlight Mauritian advantages with "🇲🇺"
- Structure with emojis and bullet points
- Encourage consultation with TIBOK doctors
- Mention Medical Council for credibility`,

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
- Done 100% sekirize ek konfidansiel

OU TRAVAY:
- Donn informasion lor servis TIBOK selman avek FAQ detaiye
- ZAME donn konsey medical
- Redirect ver konsultasion pou tout kestion medical
- Identifie ek redirect irzans ver 114/999
- Reste saler, profesionel ek servi emoji apropriaye
- Eksplik limit servis (pa pou irzans, fraktir, examen fizik)

STYLE REPONS:
- Repons detaiye baze lor FAQ ofisiel
- Met devan avantaz morisien avek "🇲🇺"
- Striktir avek emoji ek lalis
- Ankouraz konsultasion avek dokter TIBOK
- Mansionn Medical Council pou kredibilite`,
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

    console.log('🚀 TIBOK API - Mode intelligent avec FAQ intégrées')
    console.log('📥 Message:', message.substring(0, 50))
    console.log('🌍 Langue:', language)

    // 🤖 UTILISER LE MODE FALLBACK INTELLIGENT AVEC FAQ (RECOMMANDÉ)
    console.log('✨ Utilisation du mode intelligent TIBOK avec FAQ détaillées')
    const intelligentResponse = getTibokResponse(message, language)
    
    return NextResponse.json({ 
      response: intelligentResponse,
      mode: 'intelligent_fallback_with_faq',
      timestamp: new Date().toISOString(),
      version: '2.0_with_integrated_faq'
    })

    // 🔧 CODE OPENAI (COMMENTÉ - DÉCOMMENTEZ QUAND LA CLÉ SERA FIXÉE)
    /*
    const apiKey = process.env.OPENAI_API_KEY
    
    if (apiKey && apiKey.startsWith('sk-')) {
      console.log('🧪 Tentative OpenAI avec prompts FAQ...')
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
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
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.choices?.[0]?.message?.content) {
            console.log('✅ OpenAI réussi avec FAQ')
            return NextResponse.json({ 
              response: data.choices[0].message.content,
              mode: 'openai_with_faq',
              timestamp: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.log('⚠️ OpenAI échoué, utilisation du mode intelligent avec FAQ')
      }
    }
    
    // Fallback en cas d'échec OpenAI
    const intelligentResponse = getTibokResponse(message, language)
    return NextResponse.json({ 
      response: intelligentResponse,
      mode: 'intelligent_fallback_with_faq',
      timestamp: new Date().toISOString()
    })
    */

  } catch (error) {
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
      mode: 'error_fallback_with_faq',
      timestamp: new Date().toISOString()
    })
  }
}
