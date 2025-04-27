"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface UserProfileModalProps {
  onSubmit: (username: string) => void
}

export default function UserProfileModal({ onSubmit }: UserProfileModalProps) {
  const [username, setUsername] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when the modal appears
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSubmit(username)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Welcome to Nyx Chat</h2>
        <p className="text-gray-300 mb-6">Please enter your name to get started.</p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full bg-black text-white rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-white border border-gray-800"
          />

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed border border-white"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  )
}
