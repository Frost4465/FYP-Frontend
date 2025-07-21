<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import Spinner from "@src/components/states/loading-states/Spinner.vue";
import NoChatSelected from "@src/components/states/empty-states/NoChatSelected.vue";
import type { IConversation, MessageVo } from "@src/types";


const route = useRoute();
const messages = ref<MessageVo[]>([]);
const selectMode = ref(false);
const selectAll = ref(false);
const selectedMessages = ref<string[]>([]);
const loading = ref(true);

const conversation = ref<IConversation | null>(null);

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const WS = import.meta.env.VITE_WS_ENDPOINT;
const WS_ENDPOINT = BASE_URL + WS;
const CHAT = import.meta.env.VITE_BASE_CHAT;
const CONVERSATION = import.meta.env.VITE_BASE_GET_CHAT;
const CHAT_ENDPOINT = BASE_URL + CHAT;
const CONVERSATION_ENDPOINT = BASE_URL + CONVERSATION;

let stompClient: Client | null = null;
let subscription: any = null;

const connectWebSocket = (conversationId: string) => {
  if (stompClient) {
    if (subscription) subscription.unsubscribe();
    stompClient.deactivate();
    stompClient = null;
  }
  stompClient = new Client({
    brokerURL: undefined, 
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    debug: function () {},
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    subscription = stompClient!.subscribe(`/topic/messages.${conversationId}`, (message) => {
      const body = JSON.parse(message.body);
      const idx = messages.value.findIndex((msg) => msg.id === body.id);
      if (idx === -1) {
        messages.value.push(body);
      } else {
        messages.value[idx] = body;
      }
    });
  };
  stompClient.activate();
};

const fetchMessages = async () => {
  messages.value = [];
  conversation.value = null;
  selectMode.value = false;
  selectAll.value = false;
  selectedMessages.value = [];

  const conversationId: string = route.params.id as string;
  loading.value = true;
  try {
    const response = await axios.get(CHAT_ENDPOINT + conversationId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    messages.value = response.data;
    await fetchConversation(conversationId);
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    loading.value = false;
  }
};

const fetchConversation = async (conversationId: string) => {
  try {
    const response = await axios.get(CONVERSATION_ENDPOINT + conversationId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    conversation.value = response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
  }
};

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (route.path.startsWith("/chat/")) {
      if (newId !== oldId) {
        fetchMessages();
        connectWebSocket(newId as string);
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  const conversationId = route.params.id as string;
  fetchMessages();
  connectWebSocket(conversationId);
});
onUnmounted(() => {
  if (stompClient) stompClient.deactivate();
});

onBeforeUnmount(() => {});

const conversationName = computed(() =>
  conversation.value ? conversation.value.groupName || "Chat" : "Chat"
);

const handleSelectMessage = (messageId: string) => {
  selectedMessages.value = [messageId];
  if (!selectMode.value) selectMode.value = true;
  selectAll.value = false;
};

const handleDeselectMessage = (messageId: string) => {
  selectedMessages.value = selectedMessages.value.filter((item) => item !== messageId);
  if (!selectedMessages.value.length) selectMode.value = false;
  selectAll.value = false;
};

const handleSelectAll = () => {
  selectedMessages.value = messages.value.map((msg) => msg.id);
  selectAll.value = true;
};

const handleDeselectAll = () => {
  selectAll.value = false;
  selectedMessages.value = [];
};

const handleCloseSelect = () => {
  selectMode.value = false;
  selectAll.value = false;
  selectedMessages.value = [];
};
</script>

<template>
  <Spinner v-if="loading" />
  <div v-else-if="!conversation" class="h-full flex flex-col">
    <NoChatSelected />
  </div>
  <div v-else class="h-full flex flex-col scrollbar-hidden">
    <ChatTop
      :select-all="selectAll"
      :select-mode="selectMode"
      :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll"
      :handle-close-select="handleCloseSelect"
      :conversation-name="conversationName"
      :conversation="conversation"
      :selected-messages="selectedMessages"
    />
    <template v-if="messages.length === 0">
      <div class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <span class="text-3xl mb-3">💬</span>
        <p>No messages yet. Start the conversation!</p>
      </div>
    </template>
    <template v-else>
      <ChatMiddle
        :messages="messages"
        :selected-messages="selectedMessages"
        :handle-select-message="handleSelectMessage"
        :handle-deselect-message="handleDeselectMessage"
      />
    </template>
    <ChatBottom :conversation-id="conversation.id" :on-message-sent="fetchMessages" />
  </div>
</template>
