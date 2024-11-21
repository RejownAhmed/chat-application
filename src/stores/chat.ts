import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Message {
  id: number;
  senderId: string;
  content: string;
  timestamp: number;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Record<string, Message[]>>({});
  const activeChat = ref<string | null>(null);

  const addMessage = (recipientId: string, message: Message) => {
    if (!messages.value[recipientId]) {
      messages.value[recipientId] = [];
    }
    messages.value[recipientId].push(message);
  };

  const getMessages = (userId: string) => {
    return messages.value[userId] || [];
  };

  const setActiveChat = (userId: string) => {
    activeChat.value = userId;
  };

  return {
    messages,
    activeChat,
    addMessage,
    getMessages,
    setActiveChat
  };
});