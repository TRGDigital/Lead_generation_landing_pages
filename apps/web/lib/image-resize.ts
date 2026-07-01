// Client-side image downscaling before upload. Vercel serverless functions reject
// request bodies over ~4.5 MB, and large camera/stock photos are far bigger than a
// web page ever needs. We downscale to a sensible max dimension and re-encode as
// WebP, which keeps every upload well under the limit and makes pages faster.

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}

export async function resizeImage(file: File, maxDim = 1600, quality = 0.85, type: 'image/webp' | 'image/jpeg' = 'image/webp'): Promise<File> {
  // Skip non-images and GIFs (resizing would drop animation). Small files are fine as-is.
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  // Small files are usually fine as-is — but if the caller needs a specific output
  // format (e.g. JPEG for a social image), re-encode anyway to guarantee the format.
  if (file.size < 1_200_000 && file.type === type) return file

  try {
    const img = await loadImage(file)
    let { width, height } = img
    const scale = Math.min(1, maxDim / Math.max(width, height))
    width = Math.max(1, Math.round(width * scale))
    height = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    // JPEG has no alpha — paint white behind transparent PNGs so they don't turn black.
    if (type === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height) }
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality))
    if (!blob) return file
    const ext = type === 'image/jpeg' ? '.jpg' : '.webp'
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + ext, { type })
  } catch {
    return file
  }
}
