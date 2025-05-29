// hooks/use-chat-socket.ts
import { useEffect, useRef } from "react";
import useChatStore from "@/hooks/use-chat-store";
import { Message } from "@/app/data";

export const useChatSocket = (receiverId: number) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setMessages = useChatStore((state) => state.setMessages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const addUnreadMessage = useChatStore((state) => state.addUnreadMessage);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }
    const wsUrl = `wss://go-messenger.onrender.com/chats?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔌 WebSocket conectado!");
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        console.log("📥 Mensagem recebida:", data);

        const newMessage: Message = {
          id: data.senderId,
          avatar: data.senderId === data.receiverId ? data.senderAvatar : data.receiverAvatar,
          name: data.senderId === data.receiverId ? "You" : data.senderName,
          message: data.text,
          timestamp: new Date().toLocaleTimeString(),
          isSender: data.senderId === data.receiverId
        };

        if (selectedChat && data.senderId === selectedChat.receiver_id) {
          setMessages((prev) => [...prev, newMessage]);
        } else {
          addUnreadMessage(data.senderId);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem recebida:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket erro:", error);
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket desconectado.");
    };

    return () => {
      socket.close();
    };
  }, [receiverId, setMessages, selectedChat, addUnreadMessage]);

  const sendMessage = (text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket não está conectado.");
      return;
    }

    const message = {
      text,
      receiverId,
    };

    socketRef.current.send(JSON.stringify(message));
    console.log("📤 Mensagem enviada:", message);
  };

  return { sendMessage };
};