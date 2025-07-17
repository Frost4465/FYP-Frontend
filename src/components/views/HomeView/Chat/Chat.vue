<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { MessageVo } from "@src/types";
import Spinner from "@src/components/states/loading-states/Spinner.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";

const route = useRoute();
const messages = ref<MessageVo[]>([]);
const selectMode = ref(false);
const selectAll = ref(false);
const selectedMessages = ref<string[]>([]);
const loading = ref(true);

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const CHAT = import.meta.env.VITE_BASE_CHAT;
const CHAT_ENDPOINT = BASE_URL + CHAT;

let cancelFetch = false;

const fetchMessages = async () => {
  const conversationId: string = route.params.id as string;
  loading.value = true;
  try {
    const response = await axios.get(CHAT_ENDPOINT + conversationId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    messages.value = response.data; // List<MessageVo>
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  cancelFetch = true;
});

watch(() => route.params.id, (newId, oldId) => {
  if (route.path.startsWith('/chat/')) {
    if (newId !== oldId) {
      fetchMessages();
    }
  }
}, { immediate: true });

const handleSelectMessage = (messageId: string) => {
  if (!selectedMessages.value.includes(messageId)) {
    selectedMessages.value.push(messageId);
  }
  if (messages.value.length && selectedMessages.value.length === messages.value.length) {
    selectAll.value = true;
  }
  if (!selectMode.value) selectMode.value = true;
};

const handleDeselectMessage = (messageId: string) => {
  selectedMessages.value = selectedMessages.value.filter(item => item !== messageId);
  if (!selectedMessages.value.length) selectMode.value = false;
  selectAll.value = false;
};

const handleSelectAll = () => {
  selectedMessages.value = messages.value.map(msg => msg.id);
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
  <div v-else class="h-full flex flex-col scrollbar-hidden">
    <ChatTop
      :select-all="selectAll"
      :select-mode="selectMode"
      :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll"
      :handle-close-select="handleCloseSelect"
    />
    <ChatMiddle
      :messages="messages"
      :selected-messages="selectedMessages"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
    />
    <ChatBottom />
  </div>
</template>
