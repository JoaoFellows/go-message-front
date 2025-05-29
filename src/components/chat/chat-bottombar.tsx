import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData } from "@/app/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChatInput } from "@/components/ui/chat/chat-input";
import useChatStore from "@/hooks/use-chat-store";
import { useChatSocket } from "@/hooks/use-chat-socket";

interface ChatBottombarProps {
  isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ isMobile }: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const setMessages = useChatStore((state) => state.setMessages);
  const hasInitialResponse = useChatStore((state) => state.hasInitialResponse);
  const setHasInitialResponse = useChatStore(
    (state) => state.setHasInitialResponse,
  );
  const [isLoading, setisLoading] = useState(false);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { sendMessage: sendWebSocketMessage } = useChatSocket(selectedChat?.receiver_id || 0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    const newMessage: Message = {
      id: Date.now(),
      name: loggedInUserData.name,
      avatar: loggedInUserData.avatar,
      message: "👍",
      timestamp: new Date().toLocaleTimeString(),
      isSender: true
    };
    setMessages((prev) => [...prev, newMessage]);
    sendWebSocketMessage("👍");
    setMessage("");
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        name: loggedInUserData.name,
        avatar: loggedInUserData.avatar,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString(),
        isSender: true
      };
      setMessages((prev) => [...prev, newMessage]);
      sendWebSocketMessage(message.trim());
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Escreva uma mensagem..."
            className="rounded-md max-h-2"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
