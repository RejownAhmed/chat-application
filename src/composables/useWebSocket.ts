import { ref, onMounted, onUnmounted } from 'vue';

export function useWebSocket(token: string) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const error = ref<string | null>(null);

  const connect = () => {
    ws.value = new WebSocket(`ws://localhost:3000?token=${token}`);

    ws.value.onopen = () => {
      isConnected.value = true;
      error.value = null;
      
      // Start heartbeat
      startHeartbeat();
    };

    ws.value.onclose = (event) => {
      isConnected.value = false;
      if (event.code === 4001) {
        error.value = 'Authentication required';
      } else if (event.code === 4002) {
        error.value = 'Invalid token';
      } else {
        error.value = 'Connection closed';
      }
    };

    ws.value.onerror = () => {
      error.value = 'WebSocket error occurred';
    };
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  const send = (message: object) => {
    if (ws.value && isConnected.value) {
      ws.value.send(JSON.stringify(message));
    }
  };

  const startHeartbeat = () => {
    const interval = setInterval(() => {
      if (ws.value && isConnected.value) {
        ws.value.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000);

    onUnmounted(() => {
      clearInterval(interval);
    });
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    error,
    send,
    disconnect,
    connect
  };
}