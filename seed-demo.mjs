import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_ANON_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Identifiants Supabase manquants dans .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────────
//  SEED DATA  —  All images from Unsplash (free CDN)
// ─────────────────────────────────────────────────────

const AVATAR_URL = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face";

const BANNER_URL = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=600&fit=crop";

const LOGO_URL = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop";

const SERVICES = [
  {
    name: "Coupe & Brushing Signature",
    price_usd: 45,
    price_htg: 5800,
    duration: "1h",
    deposit_type: "percentage",
    deposit_percentage: 50,
    image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop",
    category: "Coupe",
    description: "Une coupe sur mesure adaptée à la morphologie de votre visage, suivie d'un brushing volumineux ou lisse selon vos envies. \n\nIdéal pour rafraîchir votre style ou changer complètement de look. Shampoing et soin hydratant inclus.",
  },
  {
    name: "Coloration — Balayage Californien",
    price_usd: 130,
    price_htg: 16500,
    duration: "3h",
    deposit_type: "fixed",
    deposit_fixed_usd: 40,
    deposit_fixed_htg: 5000,
    image_url: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop",
    category: "Coloration",
    description: "Le balayage californien apporte une lumière naturelle à vos cheveux, comme un effet \"retour de plage\". \n\nCette technique fondue évite l'effet racine et demande très peu d'entretien. \n\nInclus : technique d'éclaircissement, patine sur mesure, shampoing traitant et coiffage.",
  },
  {
    name: "Soin Kératine Professionnel",
    price_usd: 95,
    price_htg: 12000,
    duration: "2h30",
    deposit_type: "fixed",
    deposit_fixed_usd: 25,
    deposit_fixed_htg: 3000,
    image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
    category: "Soin",
    description: "Un traitement profond à la kératine qui répare la fibre capillaire de l'intérieur, élimine les frisottis et apporte une brillance miroir intense.\n\nCe soin détend légèrement la boucle et facilite le coiffage quotidien pendant 3 à 4 mois.\n\n*Supplément possible de 20$ pour les cheveux très longs ou très épais.*",
  },
  {
    name: "Manucure & Pédicure Gel",
    price_usd: 55,
    price_htg: 7000,
    duration: "1h30",
    deposit_type: "none",
    image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    category: "Ongles",
    description: "Soin complet des mains et des pieds. \n\nComprend le nettoyage des cuticules, la mise en forme des ongles, une hydratation légère, et l'application d'un vernis gel (semi-permanent) de la couleur de votre choix.\n\nTenue garantie jusqu'à 3 semaines.",
  },
  {
    name: "Maquillage Événementiel",
    price_usd: 80,
    price_htg: 10000,
    duration: "1h30",
    deposit_type: "percentage",
    deposit_percentage: 30,
    image_url: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop",
    category: "Maquillage",
    description: "Maquillage professionnel complet pour toutes vos grandes occasions (mariages, anniversaires, séances photos).\n\nDu look naturel (soft glam) au plus sophistiqué (full glam). Les faux-cils sont inclus dans la prestation. \n\nMerci de venir avec une peau propre et hydratée.",
  },
  {
    name: "Tresses Box Braids",
    price_usd: 150,
    price_htg: 19000,
    duration: "4h",
    deposit_type: "fixed",
    deposit_fixed_usd: 50,
    deposit_fixed_htg: 6000,
    image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop",
    category: "Tresses",
    description: "Tresses classiques (Box Braids) taille moyenne, longueur dos. \n\nUn style protecteur parfait pour laisser reposer vos cheveux naturels tout en gardant une coiffure soignée pendant plusieurs semaines.\n\n*NB: Les mèches ne sont pas fournies. Veuillez prévoir 3 paquets de mèches X-pression.*",
  },
];

const PORTFOLIO = [
  {
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop",
    category: "Coupe",
    caption: "Coupe stylisée avec brushing parfait ✨",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&h=800&fit=crop",
    category: "Coloration",
    caption: "Balayage californien lumineux 🌟",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=800&fit=crop",
    category: "Soin",
    caption: "Soin kératine — résultat lisse et brillant 💆‍♀️",
    ig_link: null,
  },
  {
    image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=800&fit=crop",
    category: "Ongles",
    caption: "Manucure gel rose nacré 💅",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&h=800&fit=crop",
    category: "Maquillage",
    caption: "Look soirée — maquillage complet 💋",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=800&fit=crop",
    category: "Tresses",
    caption: "Box braids longues — protection maximale 🌿",
    ig_link: null,
  },
  {
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    category: "Maquillage",
    caption: "Maquillage naturel pour mariage 👰",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=800&fit=crop",
    category: "Coupe",
    caption: "Bob carré tendance — élégance minimaliste",
    ig_link: "https://instagram.com",
  },
  {
    image_url: "https://images.unsplash.com/photo-1614867818972-e4a83d98a234?w=800&h=800&fit=crop",
    category: "Coloration",
    caption: "Ombré hair chocolat caramel 🍫",
    ig_link: "https://instagram.com",
  },
];

// ─────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────

const formatDate = (d) => d.toISOString().split('T')[0];

const addDays = (base, n) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const CLIENTS = [
  { name: "Marie Claire Dupont", phone: "+509 3812-4567", email: "marie@example.com" },
  { name: "Sophie Jean-Louis",   phone: "+509 4432-8899", email: "sophie@example.com" },
  { name: "Isabelle Beaumont",   phone: "+509 3755-1122", email: "isa@example.com" },
  { name: "Nadège Pierre",       phone: "+509 4870-3344", email: "nadege@example.com" },
  { name: "Chantal Moreau",      phone: "+1 305-555-0192", email: "chantal@example.com" },
  { name: "Fabiola Étienne",     phone: "+509 3610-7788", email: "fabi@example.com" },
  { name: "Rose-Marie Alexis",   phone: "+1 954-555-0171", email: "rosemarie@example.com" },
  { name: "Claudette Georges",   phone: "+509 4921-6655", email: "claudette@example.com" },
];

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

// ─────────────────────────────────────────────────────
//  MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────

async function seed() {
  console.log("🌸 ═══════════════════════════════════════════");
  console.log("   BELLA ELEGANCE — DÉMO COMPLÈTE (FR/CRÉOLE)");
  console.log("🌸 ═══════════════════════════════════════════\n");

  const email = "demo@koulakay.com";
  const password = "password123";

  // ── STEP 1: Authenticate ───────────────────────────
  console.log("ÉTAPE 1 ▸ Authentification de l'utilisateur démo...");
  let authRes = await supabase.auth.signInWithPassword({ email, password });

  if (authRes.error) {
    console.log("   ⚡ L'utilisateur n'existe pas encore, création en cours...");
    authRes = await supabase.auth.signUp({ email, password });
    if (authRes.error) {
      console.error("   ❌ Échec de l'authentification:", authRes.error.message);
      process.exit(1);
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { console.error("   ❌ Aucune session."); process.exit(1); }
  console.log("   ✅ Connecté en tant que:", user.id);

  // ── STEP 2: Set profile name + avatar on auth user ─
  console.log("\nÉTAPE 2 ▸ Configuration du profil propriétaire...");
  await supabase.auth.updateUser({
    data: {
      name: "Isabella Laurent",
      avatar_url: AVATAR_URL,
    }
  });
  console.log("   ✅ Profil: Isabella Laurent");

  // ── STEP 3: Create or find tenant ─────────────────
  console.log("\nÉTAPE 3 ▸ Création / récupération du salon (tenant)...");
  let { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!tenant) {
    const { data: newTenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({ owner_id: user.id, subdomain: 'demo', subscription_status: 'active' })
      .select('id')
      .single();
    if (tenantErr) { console.error("   ❌ Échec de la création du salon:", tenantErr.message); process.exit(1); }
    tenant = newTenant;
  } else {
    // Make sure subdomain is set to 'demo'
    await supabase.from('tenants').update({ subdomain: 'demo' }).eq('id', tenant.id);
  }

  const tenantId = tenant.id;
  console.log("   ✅ ID du Salon:", tenantId);

  // ── STEP 4: Upsert Salon Settings ─────────────────
  console.log("\nÉTAPE 4 ▸ Configuration des paramètres du salon...");

  const { data: existingSettings } = await supabase
    .from('salon_settings')
    .select('id')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  const settingsPayload = {
    tenant_id: tenantId,
    salon_name: "Bella Elegance",
    theme: "soft",
    custom_theme_color: "#C97B6D",
    show_availability: true,
    buffer_minutes: 15,
    moncash_number: "47-22-1234",
    natcash_number: "37-22-5678",
    zelle_info: "bella@elegance.com",
    instagram_url: "https://instagram.com",
    facebook_url: "https://facebook.com",
    whatsapp_number: "50947221234",
    banner_url: BANNER_URL,
    logo_url: LOGO_URL,
    working_hours: {
      mon: { enabled: true,  start: "09:00", end: "18:00" },
      tue: { enabled: true,  start: "09:00", end: "18:00" },
      wed: { enabled: true,  start: "09:00", end: "18:00" },
      thu: { enabled: true,  start: "09:00", end: "18:00" },
      fri: { enabled: true,  start: "09:00", end: "19:00" },
      sat: { enabled: true,  start: "10:00", end: "16:00" },
      sun: { enabled: false, start: "09:00", end: "17:00" },
    },
  };

  if (existingSettings) {
    await supabase.from('salon_settings').update(settingsPayload).eq('tenant_id', tenantId);
  } else {
    await supabase.from('salon_settings').insert(settingsPayload);
  }
  console.log("   ✅ Paramètres appliqués (thème, horaires, paiements, réseaux, bannière, logo)");

  // ── STEP 5: Clear old data ─────────────────────────
  console.log("\nÉTAPE 5 ▸ Nettoyage des anciennes données démo...");
  await supabase.from('reviews').delete().eq('tenant_id', tenantId);
  await supabase.from('staff').delete().eq('tenant_id', tenantId);
  await supabase.from('appointments').delete().eq('tenant_id', tenantId);
  await supabase.from('services').delete().eq('tenant_id', tenantId);
  await supabase.from('portfolio').delete().eq('tenant_id', tenantId);
  console.log("   ✅ Anciennes données supprimées");

  // ── STEP 6: Seed Services ──────────────────────────
  console.log("\nÉTAPE 6 ▸ Ajout de 6 Services avec images...");
  const { data: insertedServices, error: svcErr } = await supabase
    .from('services')
    .insert(SERVICES.map(s => ({ ...s, tenant_id: tenantId })))
    .select();

  if (svcErr) { console.error("   ❌ Échec de l'ajout des services:", svcErr.message); process.exit(1); }
  console.log(`   ✅ ${insertedServices.length} services ajoutés`);

  // ── STEP 7: Seed Portfolio ─────────────────────────
  console.log("\nÉTAPE 7 ▸ Ajout de 9 photos au Portfolio...");
  const { error: portErr } = await supabase
    .from('portfolio')
    .insert(PORTFOLIO.map(p => ({ ...p, tenant_id: tenantId })));
  if (portErr) { console.error("   ❌ Échec de l'ajout au portfolio:", portErr.message); process.exit(1); }
  console.log(`   ✅ ${PORTFOLIO.length} photos ajoutées au portfolio`);

  // ── STEP 8: Seed Appointments ──────────────────────
  console.log("\nÉTAPE 8 ▸ Ajout de rendez-vous réalistes...");
  const today = new Date();

  const appointments = [
    // ──── PENDING (upcoming) ────────────────────────
    {
      client_name: CLIENTS[0].name,
      client_phone: CLIENTS[0].phone,
      client_email: CLIENTS[0].email,
      service_id: insertedServices[0].id,
      date: formatDate(addDays(today, 1)),
      time: "10:00",
      status: "pending",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[1].name,
      client_phone: CLIENTS[1].phone,
      client_email: CLIENTS[1].email,
      service_id: insertedServices[4].id,  // Maquillage
      date: formatDate(addDays(today, 2)),
      time: "14:00",
      status: "pending",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[7].name,
      client_phone: CLIENTS[7].phone,
      client_email: CLIENTS[7].email,
      service_id: insertedServices[5].id,  // Tresses
      date: formatDate(addDays(today, 3)),
      time: "09:00",
      status: "pending",
      deposit_receipt_url: "",
    },
    // ──── APPROVED (upcoming) ───────────────────────
    {
      client_name: CLIENTS[2].name,
      client_phone: CLIENTS[2].phone,
      client_email: CLIENTS[2].email,
      service_id: insertedServices[1].id,  // Coloration
      date: formatDate(addDays(today, 2)),
      time: "11:00",
      status: "approved",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[4].name,
      client_phone: CLIENTS[4].phone,
      client_email: CLIENTS[4].email,
      service_id: insertedServices[2].id,  // Kératine
      date: formatDate(addDays(today, 5)),
      time: "13:00",
      status: "approved",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[3].name,
      client_phone: CLIENTS[3].phone,
      client_email: CLIENTS[3].email,
      service_id: insertedServices[3].id,  // Manucure
      date: formatDate(addDays(today, 6)),
      time: "15:00",
      status: "approved",
      deposit_receipt_url: "",
    },
    // ──── PAST / REJECTED ───────────────────────────
    {
      client_name: CLIENTS[5].name,
      client_phone: CLIENTS[5].phone,
      client_email: CLIENTS[5].email,
      service_id: insertedServices[0].id,
      date: formatDate(addDays(today, -3)),
      time: "10:00",
      status: "approved",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[6].name,
      client_phone: CLIENTS[6].phone,
      client_email: CLIENTS[6].email,
      service_id: insertedServices[4].id,
      date: formatDate(addDays(today, -5)),
      time: "16:00",
      status: "rejected",
      deposit_receipt_url: "",
    },
    {
      client_name: CLIENTS[7].name,
      client_phone: CLIENTS[7].phone,
      client_email: CLIENTS[7].email,
      service_id: insertedServices[2].id,
      date: formatDate(addDays(today, -7)),
      time: "09:00",
      status: "approved",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      client_name: CLIENTS[1].name,
      client_phone: CLIENTS[1].phone,
      client_email: CLIENTS[1].email,
      service_id: insertedServices[5].id,
      date: formatDate(addDays(today, -10)),
      time: "14:00",
      status: "approved",
      deposit_receipt_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
  ].map(a => ({ ...a, tenant_id: tenantId }));

  const { data: insertedAppointments, error: apptErr } = await supabase.from('appointments').insert(appointments).select();
  if (apptErr) { console.error("   ❌ Échec de l'ajout des rendez-vous:", apptErr.message); process.exit(1); }
  console.log(`   ✅ ${appointments.length} rendez-vous ajoutés (3 en attente, 3 confirmés, 4 passés)`);

  // ── STEP 9: Seed Staff ─────────────────────────────
  console.log("\nÉTAPE 9 ▸ Ajout de l'équipe (Staff)...");
  const staff = [
    { name: "Isabella Laurent", role: "Propriétaire & Coloriste", image_url: AVATAR_URL, tenant_id: tenantId },
    { name: "Sophie Jean", role: "Coiffeuse Visagiste", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop", tenant_id: tenantId },
    { name: "Marc Olivier", role: "Spécialiste Tresses", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", tenant_id: tenantId },
  ];
  const { error: staffErr } = await supabase.from('staff').insert(staff);
  if (staffErr) { console.error("   ❌ Échec de l'ajout de l'équipe:", staffErr.message); process.exit(1); }
  console.log(`   ✅ 3 membres d'équipe ajoutés`);

  // ── STEP 10: Seed Reviews ──────────────────────────
  console.log("\nÉTAPE 10 ▸ Ajout des avis (Reviews)...");
  
  // Assign reviews to some past appointments
  const pastAppointments = insertedAppointments.filter(a => a.status === 'approved' && new Date(a.date) < today);
  
  if (pastAppointments.length >= 3) {
    const reviews = [
      {
        tenant_id: tenantId,
        appointment_id: pastAppointments[0].id,
        rating: 5,
        comment: "Prestation au top ! J'adore ma nouvelle coupe, le salon est magnifique et l'équipe très accueillante.",
        is_anonymous: false,
        image_url: "https://picsum.photos/600/400?random=1", 
        video_url: null
      },
      {
        tenant_id: tenantId,
        appointment_id: pastAppointments[1].id,
        rating: 4,
        comment: "Très bon service, résultat à la hauteur de mes attentes. Je recommande vivement.",
        is_anonymous: true,
        image_url: null,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        tenant_id: tenantId,
        appointment_id: pastAppointments[2].id,
        rating: 5,
        comment: "Sèvis la te vrèman bon. Mwen renmen fason yo akeyi moun. M ap tounen ankò!",
        is_anonymous: false,
        image_url: null,
        video_url: null
      }
    ];
    const { error: revErr } = await supabase.from('reviews').insert(reviews);
    if (revErr) { console.error("   ❌ Échec de l'ajout des avis:", revErr.message); process.exit(1); }
    console.log(`   ✅ 3 avis clients ajoutés`);
  }

  // ── DONE ───────────────────────────────────────────
  console.log("\n🎉 ═══════════════════════════════════════════");
  console.log("   DÉMO PRÊTE — Tout a été configuré avec succès !");
  console.log("🎉 ═══════════════════════════════════════════\n");
  console.log("  📍 Site web public :  http://demo.localhost:3000");
  console.log("  🔑 Espace Admin    :  http://demo.localhost:3000/admin");
  console.log("  📧 Email           :  demo@koulakay.com");
  console.log("  🔒 Mot de passe    :  password123");
  console.log("  👤 Propriétaire    :  Isabella Laurent");
  console.log("\n  Services ajoutés   :  6 (avec images & descriptions)");
  console.log("  Photos Portfolio   :  9");
  console.log("  Rendez-vous        :  10 (en attente, confirmés, passés)");
  console.log("  Membres d'équipe   :  3");
  console.log("  Avis clients       :  2");
  console.log("  Réseaux sociaux    :  Instagram, Facebook, WhatsApp");
  console.log("  Paiements          :  MonCash, NatCash, Zelle");
  console.log("\n═══════════════════════════════════════════════\n");
}

seed().catch(err => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
