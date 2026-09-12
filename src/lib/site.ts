// Real Hair Secrets Store brand details — single source of truth.
// Sourced from official HSS 2026 policy documents.

export const site = {
  name: "Hair Secrets Store",
  shortName: "HSS",
  tagline: "Raw Human Hair",
  domain: "hairsecretsstore.co",
  url: "https://hairsecretsstore.co",
  email: "info@hairsecretsstore.co",
  phone: "+256 700 775 278",
  phoneLocal: "0700 775 278",
  whatsapp: "+256700775278",
  address: {
    line1: "Archer Road, Plot 14",
    area: "Kololo",
    city: "Kampala",
    country: "Uganda",
  },
  // Ship-from details used for DHL shipment creation.
  shipFrom: {
    name: "Hair Secrets Store",
    addressLine: "Archer Road, Plot 14, Kololo",
    city: "Kampala",
    postalCode: "256",
    countryCode: "UG",
  },
  // Brand promise / voice pulled from HSS community guidelines
  motto: "Where every strand is curated with class.",
  slogan: "Length. Luxury. Legacy.",
  audience: "For the empowered queens who grace our space with elegance.",
  mission:
    "To provide thoughtfully selected and customized human hair solutions through consultation, craftsmanship and a commitment to quality.",
  vision:
    "To establish Hair Secrets Store as a distinguished premium hair house, recognized for refined craftsmanship, considered client experiences and enduring standards of quality.",
  couriers: ["DHL", "FedEx", "UPS"],
  socials: {
    instagram: "https://www.instagram.com/hairsecretsstore",
    instagramHairMastery: "https://www.instagram.com/hairmastery2023",
    tiktok: "https://www.tiktok.com/@hairsecretsstore",
    facebook: "https://www.facebook.com/share/1HfshscBwj/?mibextid=wwXIfr",
    x: "https://x.com/hairsecretstore",
    threads: "https://www.threads.com/@hairsecretsstore",
    snapchat: "https://snapchat.com/t/jMeRtNBN",
    linkedin: "https://www.linkedin.com/company/hair-secrets-store/",
  },
} as const;

// Community values — from HSS Community Guidelines 2026
export const communityValues = [
  {
    letter: "A",
    title: "Respectful",
    text: "We honour diverse opinions and expect all engagement to be grounded in respect.",
  },
  {
    letter: "B",
    title: "Kind",
    text: "Kindness is our signature. We uplift one another through thoughtful words and gestures.",
  },
  {
    letter: "C",
    title: "Honest",
    text: "We value honesty, transparency, and trust — a safe space for authentic conversations.",
  },
  {
    letter: "D",
    title: "Professional",
    text: "We reflect the highest standard of luxury hair and client service, always.",
  },
  {
    letter: "E",
    title: "Curious",
    text: "We welcome your curiosity and creativity. Share a question, idea, or suggestion.",
  },
  {
    letter: "F",
    title: "Private",
    text: "Your privacy is our priority. Client data and imagery stay in strict confidence.",
  },
] as const;

// "Our collection includes" — from the HSS Company Profile §1
export const collectionIncludes = [
  "Human Hair Extensions",
  "Customized Wigs",
  "Closures & HD Lace",
  "Frontals",
  "Bundles & Wefts",
  "Clip-In Extensions",
  "Ponytails",
  "Micro Links",
  "Hair Care Essentials",
  "Wig & Hair Accessories",
] as const;

// Company values — from the HSS Company Profile
export const brandValues = [
  {
    title: "Craftsmanship",
    text: "Quality is found in the details. Every piece and service is approached with care, precision and consideration.",
  },
  {
    title: "Quality",
    text: "A considered approach to hair selection, specifications and presentation — from density to finish.",
  },
  {
    title: "Integrity",
    text: "Honest guidance, clear communication and responsible client service at every step.",
  },
  {
    title: "Client Experience",
    text: "Every interaction is an opportunity to create a considered and memorable HSS experience.",
  },
  {
    title: "Continuous Refinement",
    text: "We remain committed to learning, improving and refining our collections, processes and standards.",
  },
] as const;

// Collections & services — from the HSS Company Profile
export const services = [
  {
    title: "Hair Extensions",
    blurb:
      "Available in a range of textures, lengths and specifications, selected to individual requirements.",
    items: [
      "Straight",
      "Wavy",
      "Curly",
      "Loose Wave",
      "Deep Wave",
      "Kinky Textures",
      "Yaki Textures",
      "Customized Textures & Tones",
    ],
  },
  {
    title: "Customized Hair",
    blurb: "Tailored hair solutions composed around individual preferences.",
    items: [
      "Custom Colour & Tone",
      "Ombré",
      "Bone Straight",
      "Super Double Drawn",
      "Customized Wigs",
      "Lace Customization",
      "Custom Hairlines & Styling",
    ],
  },
  {
    title: "Lace & Wig Craftsmanship",
    blurb: "A refined, beautifully blended finish — approached with precision.",
    items: [
      "HD Lace",
      "Closure Units",
      "Frontal Units",
      "Hairline Refinement",
      "Custom Plucking & Parting",
      "Baby Hair Customization",
      "Lace Replacement & Restoration",
    ],
  },
  {
    title: "Extensions & Installation",
    blurb: "A range of options, offered depending on suitability and consultation.",
    items: [
      "Sew-In Extensions",
      "Clip-In Extensions",
      "Tape-In Extensions",
      "Ponytails",
      "Micro Links",
      "Wefted & Unwefted",
    ],
  },
  {
    title: "Hair Care & Essentials",
    blurb:
      "Carefully selected essentials to support care, maintenance and preservation.",
    items: [
      "Wig Stands & Mannequins",
      "Wig Caps & Bonnets",
      "Wig Combs & Elastic Bands",
      "Styling Essentials",
      "Storage & Presentation",
    ],
  },
] as const;

// Delivery timeframes — from HSS Transportation Policy 2026
export const deliveryTimes = [
  { region: "Within Kampala (Free, 5km radius)", time: "1–2 business days" },
  { region: "Standard East Africa Shipping", time: "4–7 business days" },
  { region: "International Standard", time: "7–15 business days" },
  { region: "International Express (DHL)", time: "2–7 business days" },
  { region: "International Express (FedEx / UPS)", time: "6–12 business days" },
] as const;
