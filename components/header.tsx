import { Moon } from "lucide-react"

interface HeaderProps {
  username: string
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="bg-black border-b border-gray-800 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Moon className="h-5 w-5 text-white" />
        <h1 className="text-xl font-bold text-white">Nyx</h1>
      </div>

      {username && (
        <div className="text-sm text-gray-300">
          Logged in as <span className="font-medium text-white">{username}</span>
        </div>
      )}
    </header>
  )
}
