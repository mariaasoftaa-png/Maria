/**
 * Utility to get a direct view URL for a Google Drive image.
 * The pattern is https://drive.google.com/uc?export=view&id={id}
 */
export function getDriveUrl(input: string): string | null {
  if (!input || input === 'ID_HERE' || input.includes('...')) return null;
  
  let id = input;

  // Extraction d'ID plus rigoureuse
  if (input.includes('drive.google.com')) {
    // Si c'est un lien de dossier, on ne peut pas l'afficher comme une image
    if (input.includes('/drive/folders/')) {
      console.error("Désolé, un lien de DOSSIER ne peut pas être utilisé comme image : " + input);
      return null;
    }

    const matches = input.match(/[-\w]{25,}/);
    if (matches) {
      id = matches[0];
    } else {
      return null;
    }
  }
  
  // Nettoyage final
  id = id.trim();
  if (id.includes('/') || id.includes('?') || id.includes(':')) {
    return null;
  }

  // Format haute performance de Google (souvent plus fiable que /uc?export=view)
  return `https://lh3.googleusercontent.com/d/${id}`;
}

/**
 * Mapping of section/product to Google Drive file IDs.
 * USER: Please replace 'ID_HERE' with the actual Google Drive IDs for your images.
 * You can find the ID in the shareable link: https://drive.google.com/file/d/[ID_HERE]/view
 */
export const DRIVE_MAPPING = {
  // Hero & Story sections
  hero: "1fEgCn0uiLMzSSdTecTI4ZBrgFAQvgECc", 
  livre: "1ck8QeaMoCGWr-hg18FfXj4beudDfBr6g",
  story1: "1OlHQ3EyM4eWhCY65yTsa2X32Dl7-fnRy",
  story2: "1aGNx7e_jxvwg7-T6Xhnst5qYSfk_0xF1",
  story3: "1Pp1HyRgVt5VNY94zMcpW5LkTy0E_-3ps",
  // Journal gallery
  journalGallery: [
    "1YIQDaPn-NYyT4Ki13k33JytGSuQvdjDp",
    "1hFCPTLup2xKiYBaP1a8x26SC8K8OYGlU"
  ],

  // Book gallery images
  bookGallery: [
    "19HQBH-ckXy2dCCvGnbMaFtjGbKXBL7Zb",
    "19k-qyfNQIYY6Qw_uA5hhN2Nu3M7yf3Li",
    "1Dfx87YsmkjS70MrXUFdHubJBDj647jU-",
    "1Ea0_z5xsWJD5lGEvWDlw-brFjtl8Wjf-",
    "1JGk0jlWJIt1djWITfpzPeJGezwmOobZz",
    "1QT9TVt-3YfTFClFaCEs3TDa6iXLbKVFf",
    "1rAG0anCl4ttffpR4FvI7DVNUOjQkXJXd",
    "1vPZEjelN3FbfafodT2x2u1QEO8MO-Xd0",
    "1zWgo0aFzxmIr8kQfZzzLwgSPRA2AW10N"
  ],

  // Atelier gallery
  atelierGallery: [
    "1b_oBpbvaD8Go-rIVQ-YRR_MeiIO_lnjh",
    "12aJzkYbAZHmrXa-ZdDlwKV7ubV3u7Rl8",
    "1YVMc0WA6G7EqaxoE9m4C4rrrZidsR2hn",
    "1ldA6N1Y3I5GlxXtKwWepPACNzO6U-ONk",
    "1r8WctGWGBCZPl2c9-ZHjNoCx2v3o3Ceu"
  ],

  // Recommendations
  recommendations: [
    {
      productTitle: "Robe de Nuit Collection Mariage",
      recommendationTitle: "Priscilla",
      recommendationType: "Film",
      author: "Sofia Coppola",
      description: "L'esthétique vaporeuse et mélancolique du film de Sofia Coppola fait écho à la délicatesse de notre soie laiteuse.",
      imageId: "1AZSqOJrNDVVqROnrZ5YB4ynIOHvmpdE-",
      productImageId: "1I0og3VaG6c-cmjHC7GqagkB4VklwJZZe"
    },
    {
      productTitle: "Corset noir dentelle",
      recommendationTitle: "Black Swan",
      recommendationType: "Film",
      author: "Darren Aronofsky",
      description: "La dualité entre la grâce et l'obscurité, soulignée par la structure rigoureuse et la finesse de notre dentelle noire.",
      imageId: "1b-5YtbfCoIEKk-o2t9q2W8uoQuFuUp72",
      productImageId: "1EAlIrzdwRx6se2En8T84rULCs_xQmDrV"
    },
    {
      productTitle: "Nuisette Pétale",
      recommendationTitle: "Caraval",
      recommendationType: "Livre",
      author: "Stephanie Garber",
      description: "Un univers onirique où la magie et le mystère se mêlent, parfaitement incarné par la légèreté de la Nuisette Pétale.",
      imageId: "1QHysJdR6xYl2ci6Uv0yCGEVbEd2-tcqk",
      productImageId: "12QM2igjPdpNhFtJ04ZojpK9S1UYDWFat"
    },
    {
      productTitle: "La Classique Dress Dentelle",
      recommendationTitle: "Pride & Prejudice",
      recommendationType: "Film / Livre",
      author: "Jane Austen",
      description: "L'élégance intemporelle et les sentiments retenus, un miroir de la structure classique de nos dentelles.",
      imageId: "18fciXDOAR9Gh-u3b-skEarBm1j8C2Lub",
      productImageId: "1D_fFdSLP41I4DkP5b9v-oeM7KJxomzR3"
    },
    {
      productTitle: "Robe de printemps poudré",
      recommendationTitle: "Alice in Wonderland",
      recommendationType: "Livre",
      author: "Lewis Carroll",
      description: "L'innocence éthérée et la curiosité sans fin, portées par une douceur poudrée.",
      imageId: "1NcWTsrsUYKSiKLD5FEuoAYuNfZ3qF3fi",
      productImageId: "1Wo_Q6GbuiDtNhGM-mVAuyCGutFT1KYPG"
    },
    {
      productTitle: "Ensemble Nuit d'Or",
      recommendationTitle: "Marie Antoinette",
      recommendationType: "Film",
      author: "Sofia Coppola",
      description: "Une explosion de pastels et de décadence romantique, célébrant la préciosité de nos ensembles dorés.",
      imageId: "1hqSjloPIo6j1adl-saJm_s-Gouwx-TMK",
      productImageId: "1ao-8uE2CtM6iBZE9p0MALLJrRUaXJBQ2"
    }
  ],

  // Product Collection
  products: [
    { 
      title: "Nuisette Pétale", 
      price: "€165", 
      id: "12QM2igjPdpNhFtJ04ZojpK9S1UYDWFat", 
      category: "nuisette",
      description: "Une pièce d'une légèreté absolue, confectionnée dans un satin de soie délicat aux reflets poudrés. Ses finitions en dentelle fine soulignent délicatement la silhouette."
    },
    { 
      title: "Robe de nuit dentelle poudré", 
      price: "€185", 
      id: "162_8VX9XiBGaB_xuwZW3Ft2L1mH42Yir", 
      category: "robe",
      description: "L'élégance du poudré alliée à la noblesse de la dentelle. Une robe de nuit fluide qui accompagne vos mouvements avec grâce et douceur."
    },
    { 
      title: "Jupe dentelle", 
      price: "€145", 
      id: "1ARFmfjpQsC1kRNfjzWdr4EH80t5Fwbn0", 
      category: "jupe",
      description: "Une jupe aérienne en dentelle travaillée, idéale pour superposer et créer des jeux de transparence sophistiqués."
    },
    { 
      title: "Soutien-gorge Pétale", 
      price: "€95", 
      id: "1BN4_Jqk5FIOirUQWBJrDJLq2uzBaUkOD", 
      category: "soutien-gorge",
      description: "Confort et raffinement se rencontrent dans cette pièce sans armatures, ornée de motifs floraux en dentelle de Calais."
    },
    { 
      title: "La Classique Dress Dentelle", 
      price: "€175", 
      id: "1D_fFdSLP41I4DkP5b9v-oeM7KJxomzR3", 
      category: "robe",
      description: "Inspirée des silhouettes d'antan, cette robe en dentelle structurée offre une allure intemporelle et majestueuse."
    },
    { 
      title: "Collant en dentelle", 
      price: "€35", 
      id: "1E3gBmUUOXmOZHOFlyw7L12cntWveYKw3", 
      category: "accessoire",
      description: "L'accessoire ultime pour parfaire une tenue Boudoir. Une maille fine et des motifs complexes pour habiller vos jambes de poésie."
    },
    { 
      title: "Corset noir dentelle", 
      price: "€210", 
      id: "1EAlIrzdwRx6se2En8T84rULCs_xQmDrV", 
      category: "top",
      description: "Une pièce de caractère sculptante, mêlant satin noir profond et dentelle ajourée. Un contraste saisissant entre force et délicatesse."
    },
    { 
      title: "Robe de Nuit Collection Mariage", 
      price: "€380", 
      id: "1I0og3VaG6c-cmjHC7GqagkB4VklwJZZe", 
      category: "robe",
      description: "L'excellence de notre savoir-faire. Soie laiteuse, dentelle à la main et détails perlés pour une nuit d'exception."
    },
    { 
      title: "Ensemble Matin", 
      price: "€180", 
      id: "1NLYg6yeDNGygFH7G87cJPqSiUBQugw-X", 
      category: "ensemble",
      description: "Un ensemble deux pièces en coton ultra-souple et dentelle, pensé pour la douceur des premiers instants du jour."
    },
    { 
      title: "Robe de printemps poudré", 
      price: "€195", 
      id: "1Wo_Q6GbuiDtNhGM-mVAuyCGutFT1KYPG", 
      category: "robe",
      description: "Une robe légère aux teintes printanières, ornée de broderies délicates évoquant le réveil de la nature."
    },
    { 
      title: "Haut Dentelle Fine", 
      price: "€130", 
      id: "1XqGyRXw91-xMbutUfIPemb17PPnrb5Aq", 
      category: "top",
      description: "Un haut tout en transparence et en finesse, à porter à fleur de peau ou en superposition."
    },
    { 
      title: "Ensemble Nuit d'Or", 
      price: "€290", 
      id: "1ao-8uE2CtM6iBZE9p0MALLJrRUaXJBQ2", 
      category: "ensemble",
      description: "L'opulence du doré mariée à la soie noire. Un ensemble luxueux pour celles qui cherchent l'éclat dans l'obscurité."
    },
    { 
      title: "Nuisette poudré", 
      price: "€95", 
      id: "1bt8RGUPcx5hmYTw3RQIPfo6vzmh3IK-T", 
      category: "nuisette",
      description: "Une nuisette courte et épurée, mettant en avant la qualité exceptionnelle de notre satin de soie."
    },
    { 
      title: "Haut Tradition", 
      price: "€95", 
      id: "1ieLE6fMF8tm3cTJ5kZuOS7RpWlJW-Spd", 
      category: "top",
      description: "Un haut classique aux finitions impeccables, incarnant l'héritage et la tradition de la maison Boudoir."
    }
  ]
};
