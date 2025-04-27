import type { Message } from "@/app/page";
import MessageBubble from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  username: string;
}

export default function MessageList({ messages, loading, username }: MessageListProps) {
  return (
    <div className="space-y-4 py-2">
      {messages.map((message) => (
        // Ensure that message.id is unique, if not, use a combination of fields to make it unique
        <MessageBubble
          key={`${message.id}-${message.timestamp}`}  // Ensure uniqueness
          message={message}
          isOwnMessage={message.sender === username}
        />
      ))}

      {loading && (
        <div className="flex items-center space-x-2 text-gray-400 pl-2">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="text-sm">Nyx is typing...</span>
        </div>
      )}
    </div>
  );
}
