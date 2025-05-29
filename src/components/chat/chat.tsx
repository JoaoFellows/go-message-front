import { Message, UserData } from "../../app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import useChatStore from "../../hooks/use-chat-store";
import ChatBottombar from "./chat-bottombar";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ChatProps {
  messages: {
    receiverId: number;
    senderId: number;
    name: string;
    text: string;
    isLoading?: boolean;
    time?: string;
  }[];
  selectedUser: {
    name: string;
    avatar: string;
    messages: {
      receiverId: number;
      senderId: number;
      name: string;
      text: string;
      isLoading?: boolean;
      time?: string;
    }[];
  };
  isMobile: boolean;
  currentUserId: number;
  receiver: {
    id: number;
    name: string;
    avatar: string;
  };
  loading?: boolean;
}

export function Chat({ messages, selectedUser, isMobile, currentUserId, receiver, loading }: ChatProps) {
  const messagesState = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const { sendMessage: sendWebSocketMessage } = useChatSocket(receiver.id);

  // Initialize messages when component mounts or messages prop changes
  useEffect(() => {
    const convertedMessages = messages.map(msg => ({
      id: msg.senderId,
      avatar: msg.senderId === currentUserId ? selectedUser.avatar : receiver.avatar,
      name: msg.senderId === currentUserId ? "You" : receiver.name,
      message: msg.text,
      isLoading: msg.isLoading,
      timestamp: new Date(msg.time || new Date()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isSender: msg.senderId === currentUserId
    }));
    setMessages(() => convertedMessages);
  }, [messages, currentUserId, selectedUser.avatar, receiver.avatar, receiver.name, setMessages]);

  const sendMessage = (newMessage: Message) => {
    // Add message to local state
    setMessages((prev) => [...prev, newMessage]);

    // Send message through WebSocket
    if (newMessage.message) {
      sendWebSocketMessage(newMessage.message);
    }
  };

  const convertedUser: UserData = {
    id: receiver.id,
    name: receiver.name,
    avatar: receiver.avatar,
    messages: messagesState
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={convertedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={convertedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
        currentUserId={currentUserId}
      />

      <ChatBottombar isMobile={isMobile} />
    </div>
  );
}
