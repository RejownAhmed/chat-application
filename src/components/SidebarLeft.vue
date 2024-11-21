<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsersStore } from '../stores/users';
import { useChatStore } from '../stores/chat';

const usersStore = useUsersStore();
const chatStore = useChatStore();

const emit = defineEmits<{
  (e: 'select-user', user: any): void;
}>();

const handleUserSelect = (user: any) => {
  chatStore.setActiveChat(user.id);
  emit('select-user', user);
};

onMounted(() => {
  usersStore.fetchUsers();
});
</script>

<template>
  <div class="w-72 border-r border-gray-200 h-full flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold">Users</h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-for="user in usersStore.users"
        :key="user.id"
        @click="handleUserSelect(user)"
        :class="[
          'p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50',
          chatStore.activeChat === user.id ? 'bg-blue-50' : '',
        ]"
      >
        <div class="flex-1">
          <h3 class="font-medium">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>
        <div
          :class="[
            'w-2 h-2 rounded-full',
            user.status === 'online' ? 'bg-green-500' : 'bg-gray-300',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>