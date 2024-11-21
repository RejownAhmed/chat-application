<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUsersStore } from '../stores/users';
import { useChatStore } from '../stores/chat';
import { useWebSocket } from '../composables/useWebSocket';
import SidebarLeft from '../components/SidebarLeft.vue';
import ChatBox from '../components/ChatBox.vue';
import SidebarRight from '../components/SidebarRight.vue';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const chatStore = useChatStore();
const selectedUser = ref(null);

const { isConnected, error: wsError, send } = useWebSocket(authStore.token!);

// Handle incoming WebSocket messages
const handleWebSocketMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'message':
      chatStore.addMessage(data.senderId, {
        id: Date.now(),
        senderId: data.senderId,
        content: data.content,
        timestamp: data.timestamp
      });
      break;
    case 'status':
      usersStore.updateUserStatus(data.userId, data.status);
      break;
  }
};

const handleSendMessage = (content: string) => {
  if (selectedUser.value) {
    send({
      type: 'message',
      content,
      recipientId: selectedUser.value.id,
      timestamp: Date.now(),
    });
  }
};

const handleUserSelect = (user: any) => {
  selectedUser.value = user;
};

onMounted(() => {
  if (window.WebSocket) {
    const ws = new WebSocket(`ws://localhost:3000?token=${authStore.token}`);
    ws.onmessage = handleWebSocketMessage;
  }
});

watch(isConnected, (connected) => {
  if (connected) {
    console.log('WebSocket connected');
  }
});
</script>

<template>
  <div class="h-screen flex bg-white">
    <SidebarLeft
      :selected-user="selectedUser"
      @select-user="handleUserSelect"
    />
    <ChatBox
      :selected-user="selectedUser"
      @send-message="handleSendMessage"
    />
    <SidebarRight
      :selected-user="selectedUser"
    />
  </div>
</template>