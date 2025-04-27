"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import MessageList from "@/components/message-list"
import MessageInput from "@/components/message-input"
import UserProfileModal from "@/components/user-profile-modal"
import io from "socket.io-client"

// Replace with the deployed backend URL
const socket = io("https://nyx-dp9x.onrender.com") 

export type Message = {
  id: string
  content: string
  sender: string
  timestamp: Date
  isSystem?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Nyx! Please enter your name to get started.",
      sender: "system",
      timestamp: new Date(),
      isSystem: true,
    },
  ])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if username exists in localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
      socket.emit("join", storedUsername) // Emit join event to the backend when a user is set
    } else {
      setShowProfileModal(true)
    }

    // Listen for incoming messages from the backend
    socket.on("chat message", (msg) => {
      console.log("Message received from server:", msg); // Log the incoming message
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    // Listen for the server confirmation (optional)
    socket.on("message_received", (msg) => {
      console.log("Backend acknowledged message:", msg); // Log confirmation
    })

    return () => {
      socket.off("chat message") // Cleanup the listener when component unmounts
      socket.off("message_received")
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: username!,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    console.log("Sending message to backend:", userMessage); // Log the message being sent

    // Emit the message to the backend with timestamp
    socket.emit("chat message", { 
      content, 
      sender: username!,
      timestamp: new Date().toISOString(),  // Include timestamp here as ISO string
    });
  };

  const handleSetUsername = (name: string) => {
    setUsername(name)
    localStorage.setItem("username", name) // Save username to localStorage
    setShowProfileModal(false)

    // Emit the join event to the backend
    socket.emit("join", name)

    // Add system message about user joining
    const joinMessage: Message = {
      id: Date.now().toString(),
      content: `${name} has joined the chat.`,
      sender: "system",
      timestamp: new Date(),
      isSystem: true,
    }

    setMessages((prev) => [...prev, joinMessage])
  }

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100">
      <Header username={username ?? ""} />

      <main className="flex-1 overflow-hidden flex flex-col p-4">
        <div className="flex-1 overflow-y-auto pr-2">
          <MessageList messages={messages} loading={loading} username={username ?? ""} />
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} disabled={!username || loading} />
      </main>

      {showProfileModal && <UserProfileModal onSubmit={handleSetUsername} />}
    </div>
  )
}
