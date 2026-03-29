export function convertBufferToBlob(buffer: Buffer, mimeType: string): Blob {
  const uint8Array = new Uint8Array(buffer);
  return new Blob([uint8Array], { type: mimeType });
}
