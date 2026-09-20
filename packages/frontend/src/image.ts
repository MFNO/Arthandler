const MAX_EDGE = 2560;
const QUALITY = 0.82;
const MAX_INPUT_BYTES = 40 * 1024 * 1024;

export const UPLOAD_CONTENT_TYPE = "image/webp";

/**
 * Downscales to a web-sized long edge and re-encodes as WebP, in the browser,
 * so originals never reach S3. `imageOrientation` applies EXIF rotation, which
 * canvas would otherwise drop.
 */
export async function compressImage(file: File): Promise<Blob> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Image is too large to process");
  }

  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a canvas context");

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, UPLOAD_CONTENT_TYPE, QUALITY),
  );

  if (!blob) throw new Error("Could not encode image");

  return blob;
}
