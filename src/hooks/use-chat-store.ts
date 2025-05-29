import {
    ChatBotMessages,
    Message,
    UserData,
    userData,
    Users,
  } from "../app/data";
  import { create } from "zustand";
  
  export interface Example {
    name: string;
    url: string;
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
  
  interface State {
    selectedExample: Example;
    examples: Example[];
    input: string;
    chatBotMessages: Message[];
    messages: Message[];
    hasInitialAIResponse: boolean;
    hasInitialResponse: boolean;
    selectedChat: Chat | null;
    unreadMessages: Record<number, number>; // chatId -> number of unread messages
  }
  
  interface Actions {
    selectedUser: UserData;
    setSelectedExample: (example: Example) => void;
    setExamples: (examples: Example[]) => void;
    setInput: (input: string) => void;
    handleInputChange: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    setchatBotMessages: (fn: (chatBotMessages: Message[]) => Message[]) => void;
    setMessages: (fn: (messages: Message[]) => Message[]) => void;
    setHasInitialAIResponse: (hasInitialAIResponse: boolean) => void;
    setHasInitialResponse: (hasInitialResponse: boolean) => void;
    setSelectedChat: (chat: Chat | null) => void;
    addUnreadMessage: (chatId: number) => void;
    clearUnreadMessages: (chatId: number) => void;
  }
  
  const useChatStore = create<State & Actions>()((set) => ({
    selectedUser: Users[4],
  
    selectedExample: { name: "Messenger example", url: "/" },
  
    examples: [
      { name: "Messenger example", url: "/" },
      { name: "Chatbot example", url: "/chatbot" },
      { name: "Chatbot2 example", url: "/chatbot2" },
    ],
  
    input: "",
  
    setSelectedExample: (selectedExample) => set({ selectedExample }),
  
    setExamples: (examples) => set({ examples }),
  
    setInput: (input) => set({ input }),
    handleInputChange: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => set({ input: e.target.value }),
  
    chatBotMessages: ChatBotMessages,
    setchatBotMessages: (fn) =>
      set(({ chatBotMessages }) => ({ chatBotMessages: fn(chatBotMessages) })),
  
    messages: userData[0].messages,
    setMessages: (fn) => set(({ messages }) => ({ messages: fn(messages) })),
  
    hasInitialAIResponse: false,
    setHasInitialAIResponse: (hasInitialAIResponse) =>
      set({ hasInitialAIResponse }),
  
    hasInitialResponse: false,
    setHasInitialResponse: (hasInitialResponse) => set({ hasInitialResponse }),

    selectedChat: null,
    setSelectedChat: (chat) => set({ selectedChat: chat }),

    unreadMessages: {},
    addUnreadMessage: (chatId) => 
      set((state) => ({ 
        unreadMessages: {
          ...state.unreadMessages,
          [chatId]: (state.unreadMessages[chatId] || 0) + 1
        }
      })),
    clearUnreadMessages: (chatId) =>
      set((state) => {
        const newUnreadMessages = { ...state.unreadMessages };
        delete newUnreadMessages[chatId];
        return { unreadMessages: newUnreadMessages };
      }),
  }));
  
  export default useChatStore;
  