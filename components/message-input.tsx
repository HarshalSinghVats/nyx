"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 relative">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={disabled ? "Enter your name to start chatting..." : "Type a message..."}
        disabled={disabled}
        className="w-full bg-black text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-white border border-gray-800"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:hover:text-gray-600 transition-colors p-2"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  )
}
