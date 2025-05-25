import axios from 'axios';

const imageCache = new Map<string, string>();

export async function loadImage(imageName: string): Promise<string> {
  if (imageCache.has(imageName)) {
    return imageCache.get(imageName)!;
  }
  try {
    const response = await axios.get(`/api/image`, {
      params: { filename: imageName },
      responseType: 'blob',
    });

    const blob = response.data;
    const objectURL = URL.createObjectURL(blob);
    imageCache.set(imageName, objectURL);
    return objectURL;
  } catch (error) {
    throw new Error(`Failed to fetch image from backend: ${imageName}`);
  }
}