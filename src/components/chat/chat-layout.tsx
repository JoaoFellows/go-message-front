"use client";

import { userData } from "@/app/data";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import api from "@/services/api";
import { Loader2 } from "lucide-react";
import useChatStore from "@/hooks/use-chat-store";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

interface Chat {
  id: number;
  user_id: number;
  name: string;
  variant: 'secondary' | 'ghost';
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
  receiver_id: number;
  receiver: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
  group_id?: number;
  avatar: string;
  messages: {
    receiverId: number;
    senderId: number;
    name: string;
    text: string;
    isLoading?: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const setSelectedChatStore = useChatStore((state) => state.setSelectedChat);

  console.log('selectedChat', selectedChat);

  const handleNewChat = (newChat: Chat) => {
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChat(newChat);
    setSelectedChatStore(newChat);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data: individualChats } = await api.get('/chats/user');
        const mappedIndividualChats = individualChats.map((chat: any) => ({
          id: chat.id,
          user_id: chat.user_id,
          name: chat.user_id === chat.user.id ? chat.receiver.name : chat.user.name,
          avatar: chat.user_id === chat.user.id ? chat.receiver.avatar : chat.user.avatar,
          messages: chat.messages,
          variant: 'secondary',
          user: chat.user,
          receiver_id: chat.receiver_id,
          receiver: chat.receiver,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
        }));
        setChats(mappedIndividualChats);
        if (mappedIndividualChats.length > 0) {
          setSelectedChat(mappedIndividualChats[0]);
          setSelectedChatStore(mappedIndividualChats[0]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setSelectedChatStore]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedChatStore(chat);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          isMobile={isMobile}
          onNewChat={handleNewChat}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {selectedChat ? (
          <Chat
            messages={selectedChat.messages}
            selectedUser={{
              name: selectedChat.user.name,
              avatar: selectedChat.user.avatar,
              messages: selectedChat.messages,
            }}
            isMobile={isMobile}
            currentUserId={selectedChat.user_id}
            receiver={selectedChat.receiver}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Select a chat to start messaging</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
