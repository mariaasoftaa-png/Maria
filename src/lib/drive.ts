/**
 * Utility to get a direct view URL for a Google Drive image.
 * The pattern is https://drive.google.com/uc?export=view&id={id}
 */
export function getDriveUrl(input: string): string | null {
  if (!input || input === 'ID_HERE') return null;
  
  // If it's already a simple ID (no slashes or dots)
  if (!input.includes('/') && !input.includes('.')) {
    return `https://drive.google.com/uc?export=view&id=${input}`;
  }
  
  // Try to extract ID from various Drive URL formats
  // Format 1: https://drive.google.com/file/d/[ID]/view...
  const fileMatch = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }
  
  // Format 2: https://drive.google.com/open?id=[ID] or similar query match
  const openMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch && openMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  // Folders and other links that aren't direct files
  if (input.includes('/drive/folders/')) {
    console.warn("Google Drive folder links cannot be used as image sources directly. Please use a direct file link.");
    return null;
  }

  return null;
}

/**
 * Mapping of section/product to Google Drive file IDs.
 * USER: Please replace 'ID_HERE' with the actual Google Drive IDs for your images.
 * You can find the ID in the shareable link: https://drive.google.com/file/d/[ID_HERE]/view
 */
export const DRIVE_MAPPING = {
  // Hero & Story sections
  hero: "https://drive.google.com/drive/folders/1zxtG3X0Tz-8SJ6FHIzm_iUMui5klFHS6?usp=sharing", // was /photos/7833524ccd60122d479dd82a90b757b3.jpg
  livre: "https://drive.google.com/file/d/1ck8QeaMoCGWr-hg18FfXj4beudDfBr6g/view?usp=drive_link", // was /photos/letstakepicswecanneverpost1_png.webp
  story1: "https://drive.google.com/file/d/1OlHQ3EyM4eWhCY65yTsa2X32Dl7-fnRy/view?usp=drive_link", // was /photos/6e4f1afda0523518c38ceb20e11cacac.jpg
  story2: "https://drive.google.com/file/d/1aGNx7e_jxvwg7-T6Xhnst5qYSfk_0xF1/view?usp=drive_link", // was /photos/aa038866ad65d1589879b24afc507b70.jpg
  story3: "https://drive.google.com/file/d/1Pp1HyRgVt5VNY94zMcpW5LkTy0E_-3ps/view?usp=drive_link", // was /photos/d106a100bba2f00bf050180bdc357564.jpg

  // Product Collection
  products: [
    { title: "Soutien-gorge Nude", price: "€95", id: "ID_HERE" },
    { title: "Top Dentelle", price: "€140", id: "ID_HERE" },
    { title: "Nuisette Soie", price: "€210", id: "ID_HERE" },
    { title: "Robe de Nuit Collection Mariage", price: "€380", id: "ID_HERE" },
    { title: "Top de Nuit", price: "€85", id: "ID_HERE" },
    { title: "Collant en dentelle", price: "€35", id: "ID_HERE" },
    { title: "Ensemble pyjama ivoire", price: "€245", id: "ID_HERE" },
    { title: "Ensemble Matin", price: "€180", id: "ID_HERE" },
    { title: "Haut coton fin", price: "€75", id: "ID_HERE" }
  ]
};
