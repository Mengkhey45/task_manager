"use client"

import { useState } from "react"

interface ProfileAvatarProps {
  src?: string
  alt: string
  fallback: string
  className?: string
}

export default function ProfileAvatar({ src, alt, fallback, className = "" }: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center ${className}`}
      >
        {fallback}
      </div>
    )
  }

  return <img src={src || "/placeholder.svg"} alt={alt} className={className} onError={() => setImageError(true)} />
}
