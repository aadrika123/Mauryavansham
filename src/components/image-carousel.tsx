"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/src/lib/utils"

interface ImageCarouselProps {
  images: { src: string; alt: string }[]
  interval?: number // in milliseconds, default to 5000
}

export function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden ">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          fill
          priority={index === 0} // Prioritize loading the first image
          className={cn(
            "absolute inset-0  transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full bg-white transition-all duration-300",
              index === currentIndex ? "w-6" : "opacity-50",
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
