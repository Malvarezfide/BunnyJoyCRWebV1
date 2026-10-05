import imageCompression from "browser-image-compression";

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


/*
  Todas las imágenes nuevas se suben como WebP (≈25-35 % más livianas que
  JPEG a calidad equivalente, con soporte de transparencia como PNG) y a un
  máximo de 1280 px: la galería de producto se muestra a ≤ 600 px de alto,
  así que 1280 cubre pantallas de alta densidad sin enviar 1920 px.
  AVIF se descartó: el canvas del navegador no sabe codificarlo.
*/
export async function compressImage(file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.6,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.82,
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "imagen";

  return new File([compressed], `${baseName}.webp`, {
    type: "image/webp",
  });
}

export function getImageUrl(filename){

  if(!filename){
    return null;
  }

  return `/media/${filename}`;

}

export function validateImage(file) {

  if (!ALLOWED_TYPES.includes(file.type)) {

    return {
      valid: false,
      error: `${file.name}: formato no permitido.`,
    };

  }


  if (file.size > MAX_FILE_SIZE) {

    return {
      valid: false,
      error: `${file.name}: supera el tamaño máximo permitido.`,
    };

  }


  return {
    valid: true,
  };

}

export async function prepareImages(files) {

  const images = [];
  const errors = [];


  for (const file of files) {

    const validation = validateImage(file);


    if (!validation.valid) {

      errors.push(validation.error);
      continue;

    }


    const compressed = await compressImage(file);

    images.push({

	  id: crypto.randomUUID(),

	  file: compressed,

	  preview: URL.createObjectURL(compressed),

	  filename: null,

	  status: "new",

	  position: 0

	});


  }


  return {
    images,
    errors,
  };

}

export function mapExistingImages(images, baseUrl){

  if(!images || images.length === 0){
    return [];
  }


  return images.map((filename,index)=>({

    id:crypto.randomUUID(),

    filename,

    preview:`${baseUrl}/${filename}`,

    file:null,

    position:index,

    status:"existing"

}));

}

export function revokeImagePreview(image){

  if(
    image.preview &&
    image.preview.startsWith("blob:")
  ){

    URL.revokeObjectURL(image.preview);

  }

}

export function extractImageNames(images){

  return images
    .filter(img => img.filename)
    .map(img => img.filename);

}

export function getPendingUploads(images){

  return images.filter(
    img =>
      img.file &&
      !img.uploaded
  );

}