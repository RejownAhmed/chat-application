<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';

const props = defineProps<{
  selectedUser: any;
}>();

const authStore = useAuthStore();
const chatStore = useChatStore();
const newMessage = ref('');

const sendMessage = () => {
  if (newMessage.value.trim() && props.selectedUser) {
    emit('send-message', newMessage.value);
    
    // Add message to local store
    chatStore.addMessage(props.selectedUser.id, {
      id: Date.now(),
      senderId: authStore.user!.id,
      content: newMessage.value,
      timestamp: Date.now()
    });
    
    newMessage.value = '';
  }
};

const emit = defineEmits<{
  (e: 'send-message', message: string): void;
}>();

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <template v-if="selectedUser">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div>
            <h2 class="font-medium">{{ selectedUser.name }}</h2>
            <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="message in chatStore.getMessages(selectedUser.id)"
          :key="message.id"
          :class="[
            'max-w-[70%] p-3 rounded-lg',
            message.senderId === authStore.user?.id
              ? 'ml-auto bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800',
          ]"
        >
          <p>{{ message.content }}</p>
          <span class="text-xs opacity-75">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>

      <div class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            @keyup.enter="sendMessage"
          />
          <button
            @click="sendMessage"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex-1 flex items-center justify-center text-gray-500">
        <p class="text-xl">Select a user to start chatting</p>
      </div>
    </template>
  </div>
</template>