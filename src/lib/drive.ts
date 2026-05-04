/**
 * Utility to get a direct view URL for a Google Drive image.
 * The pattern is https://drive.google.com/uc?export=view&id={id}
 */
export function getDriveUrl(input: string): string | null {
  if (!input || input === 'ID_HERE') return null;
  
  let id = input;

  // If it's a URL, extract the ID
  if (input.includes('drive.google.com')) {
    // Format 1: /file/d/[ID]/view
    const fileMatch = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      id = fileMatch[1];
    } 
    // Format 2: ?id=[ID]
    else {
      const openMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (openMatch && openMatch[1]) {
        id = openMatch[1];
      }
      // Folders
      else if (input.includes('/drive/folders/')) {
        console.warn("Lien de dossier Google Drive détecté pour une image. Veuillez utiliser le lien de partage d'un FICHIER spécifique.");
        return null;
      }
    }
  }
  
  // Clean up ID just in case it still contains slashes or dots (from invalid input)
  if (id.includes('/') || id.includes('.')) {
    return null;
  }

  // Improved direct link format (less likely to be blocked by Google)
  return `https://lh3.googleusercontent.com/d/${id}`;
}

/**
 * Mapping of section/product to Google Drive file IDs.
 * USER: Please replace 'ID_HERE' with the actual Google Drive IDs for your images.
 * You can find the ID in the shareable link: https://drive.google.com/file/d/[ID_HERE]/view
 */
export const DRIVE_MAPPING = {
  // Hero & Story sections
  // IMPORTANT: Replace the 'folders' link below with a direct link to ONE specific image file
  hero: "https://drive.google.com/file/d/1fEgCn0uiLMzSSdTecTI4ZBrgFAQvgECc/view?usp=drive_link", 
  livre: "1ck8QeaMoCGWr-hg18FfXj4beudDfBr6g",
  story1: "1OlHQ3EyM4eWhCY65yTsa2X32Dl7-fnRy",
  story2: "1aGNx7e_jxvwg7-T6Xhnst5qYSfk_0xF1",
  story3: "1Pp1HyRgVt5VNY94zMcpW5LkTy0E_-3ps",

  // Product Collection
  products: [
    { title: "Soutien-gorge Nude", price: "€95", id: "1_e_f-U2uQnBy9YIDL130yD1n8F-A_y20" },
    { title: "Top Dentelle", price: "€140", id: "1R3m8s9D5_8v6x7zY..." }, // Replace with actual file IDs
    { title: "Nuisette Soie", price: "€210", id: "ID_HERE" },
    { title: "Robe de Nuit Collection Mariage", price: "€380", id: "ID_HERE" },
    { title: "Top de Nuit", price: "€85", id: "ID_HERE" },
    { title: "Collant en dentelle", price: "€35", id: "ID_HERE" },
    { title: "Ensemble pyjama ivoire", price: "€245", id: "ID_HERE" },
    { title: "Ensemble Matin", price: "€180", id: "ID_HERE" },
    { title: "Haut coton fin", price: "€75", id: "ID_HERE" }
  ]
};
