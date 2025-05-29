import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserData } from "../../app/data";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";

interface ChatTopbarProps {
  selectedUser: UserData;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
        </div>
      </div>

    </ExpandableChatHeader>
  );
}
