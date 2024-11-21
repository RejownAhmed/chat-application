<script setup lang="ts">
import type { User } from '../types';

defineProps<{
  selectedUser: User | null;
}>();

const emit = defineEmits<{
  (e: 'mark-done'): void;
  (e: 'report-user'): void;
}>();
</script>

<template>
  <div v-if="selectedUser" class="w-72 border-l border-gray-200 p-4">
    <div class="space-y-6">
      <div class="text-center">
        <img
          :src="selectedUser.avatar"
          :alt="selectedUser.name"
          class="w-20 h-20 rounded-full mx-auto"
        />
        <h2 class="mt-2 font-medium text-xl">{{ selectedUser.name }}</h2>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-500">Email</label>
          <p>{{ selectedUser.email }}</p>
        </div>

        <div>
          <label class="text-sm text-gray-500">Phone</label>
          <p>{{ selectedUser.phone }}</p>
        </div>

        <div>
          <label class="text-sm text-gray-500">Last Meeting</label>
          <p>{{ selectedUser.lastMeeting }}</p>
        </div>

        <div>
          <label class="text-sm text-gray-500">Review</label>
          <div class="flex items-center space-x-1">
            <template v-for="i in 5" :key="i">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                :class="[
                  'w-5 h-5',
                  i <= selectedUser.review ? 'text-yellow-400' : 'text-gray-300',
                ]"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            </template>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <button
          @click="emit('mark-done')"
          class="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Mark as Done
        </button>
        <button
          @click="emit('report-user')"
          class="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Report User
        </button>
      </div>
    </div>
  </div>
</template>