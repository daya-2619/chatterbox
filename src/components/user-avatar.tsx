"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type User } from "@/types"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: Partial<User>;
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <div className="relative shrink-0">
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture" />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  )
}
