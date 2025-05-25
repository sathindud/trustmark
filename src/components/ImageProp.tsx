import { useEffect, useRef, useState } from "react";
import { loadImage } from "../utils/ImageLoader";

type LazyImageProps = {
  imageName: string;
  alt?: string;
};

export default function LazyImage({ imageName, alt = "" }: LazyImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && isMounted) {
            const url = await loadImage(imageName);
            objectUrl = url;
            setImgSrc(url);
            obs.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      observer.disconnect();
    };
  }, [imageName]);

  return (
    <img
      ref={imgRef}
      src={imgSrc ?? ""}
      alt={alt}
      loading="lazy"
      style={{ width: "100%", height: "auto", opacity: imgSrc ? 1 : 0.5 }}
    />
  );
}
