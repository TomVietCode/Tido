//Function to convert .heic to .jpg
export const processImageFile = async (file: File): Promise<File> => {
  const isHeic = file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic"

  if (!isHeic) {
    return file
  }
  if (typeof window === "undefined") return file;

  try {
    const heic2any = (await import("heic2any")).default;

    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8,
    })

    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"
    return new File([blob], newFileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    })
  } catch (error) {
    console.error("Error converting HEIC to JPG:", error)
    return file
  }
}
