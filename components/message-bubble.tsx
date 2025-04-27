import type { Message } from "@/app/page";
import { formatDistanceToNow } from "date-fns";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  // Ensure the timestamp is valid
  const timestamp = new Date(message.timestamp);
  
  // Check if timestamp is invalid
  const formattedTime = isNaN(timestamp.getTime()) 
    ? "Invalid date"  // Fallback if the date is invalid
    : formatDistanceToNow(timestamp, {
        addSuffix: true,
        includeSeconds: true,
      });

  if (message.isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-800 text-gray-400 text-xs py-1 px-3 rounded-full">{message.content}</div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
      {!isOwnMessage && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            {message.sender === "Nyx Assistant" ? (
              <Bot className="h-4 w-4 text-white" />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
      )}

      <div className={`max-w-[75%] ${isOwnMessage ? "order-1" : "order-2"}`}>
        <div className="flex flex-col">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? "bg-black text-white rounded-br-none"
                : message.sender === "Nyx Assistant"
                ? "bg-gray-800 text-white rounded-bl-none"
                : "bg-gray-900 text-white rounded-bl-none"
            }`}
          >
            {message.content}
          </div>

          <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
            <span className="font-medium">{isOwnMessage ? "You" : message.sender}</span> • {formattedTime}
          </div>
        </div>
      </div>

      {isOwnMessage && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
