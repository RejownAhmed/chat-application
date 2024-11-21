import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

interface User {
  id: string;
  name: string;
  email: string;
  status?: 'online' | 'offline';
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const authStore = useAuthStore();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      users.value = data.map((user: User) => ({
        ...user,
        status: 'offline' // Default status
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserStatus = (userId: string, status: 'online' | 'offline') => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
  };

  return {
    users,
    fetchUsers,
    updateUserStatus
  };
});