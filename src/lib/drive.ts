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

  // Product Collection
  products: [
    { title: "Nuisette Pétale", price: "€165", id: "12QM2igjPdpNhFtJ04ZojpK9S1UYDWFat" },
    { title: "Robe de nuit dentelle poudré", price: "€185", id: "162_8VX9XiBGaB_xuwZW3Ft2L1mH42Yir" },
    { title: "Jupe dentelle", price: "€145", id: "1ARFmfjpQsC1kRNfjzWdr4EH80t5Fwbn0" },
    { title: "Soutien-gorge Pétale", price: "€95", id: "1BN4_Jqk5FIOirUQWBJrDJLq2uzBaUkOD" },
    { title: "La Classique Dress Dentelle", price: "€175", id: "1D_fFdSLP41I4DkP5b9v-oeM7KJxomzR3" },
    { title: "Collant en dentelle", price: "€35", id: "1E3gBmUUOXmOZHOFlyw7L12cntWveYKw3" },
    { title: "Corset noir dentelle", price: "€210", id: "1EAlIrzdwRx6se2En8T84rULCs_xQmDrV" },
    { title: "Robe de Nuit Collection Mariage", price: "€380", id: "1I0og3VaG6c-cmjHC7GqagkB4VklwJZZe" },
    { title: "Ensemble Matin", price: "€180", id: "1NLYg6yeDNGygFH7G87cJPqSiUBQugw-X" },
    { title: "Robe de printemps poudré", price: "€195", id: "1Wo_Q6GbuiDtNhGM-mVAuyCGutFT1KYPG" },
    { title: "Haut Dentelle Fine", price: "€130", id: "1XqGyRXw91-xMbutUfIPemb17PPnrb5Aq" },
    { title: "Ensemble Nuit d'Or", price: "€290", id: "1ao-8uE2CtM6iBZE9p0MALLJrRUaXJBQ2" },
    { title: "Top poudré", price: "€95", id: "1bt8RGUPcx5hmYTw3RQIPfo6vzmh3IK-T" },
    { title: "Haut Tradition", price: "€95", id: "1ieLE6fMF8tm3cTJ5kZuOS7RpWlJW-Spd" }
  ]
};
