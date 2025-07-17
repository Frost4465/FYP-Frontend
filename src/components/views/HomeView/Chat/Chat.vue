<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { IConversation, CurrentConversation } from "@src/types"; 

import NoChatSelected from "@src/components/states/empty-states/NoChatSelected.vue";
import Spinner from "@src/components/states/loading-states/Spinner.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";
import { text } from "stream/consumers";

const route = useRoute();
const activeConversations = ref<CurrentConversation[]>([]);
const selectMode = ref(false);
const selectAll = ref(false);
const selectedMessages = ref<number[]>([]);
const loading = ref(true);
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const CHAT = import.meta.env.VITE_BASE_CHAT;
const CHAT_ENDPOINT = BASE_URL + CHAT;

let cancelFetch = false;

const fetchConversation = async () => {
  console.log("WE FINALLY CALLING FUCKING FETCH CONVO ALREADY");
  const conversationId: string= route.params.id as string;
  console.log(conversationId)
  try {
    const response = await axios.get(CHAT_ENDPOINT + conversationId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("response ", response.data);
    activeConversations.value = response.data; 
    loading.value = false;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  cancelFetch = true;
});

watch(() => route.params.id, (newId, oldId) => {
  if (route.path.startsWith('/chat/')) {
    console.log('route change id', newId);
    if (newId !== oldId) {
      loading.value = true;
      fetchConversation();
    }
  }
}, { immediate: true });

const handleSelectMessage = (messageId: number) => {
  selectedMessages.value.push(messageId);
  if (activeConversation.value && selectedMessages.value.length === activeConversation.value.messages.length) {
    selectAll.value = true;
  }
  if (!selectMode.value) {
    selectMode.value = true;
  }
};

const handleDeselectMessage = (messageId: number) => {
  selectAll.value = false;
  selectedMessages.value = selectedMessages.value.filter(item => item !== messageId);
  if (activeConversation.value && selectedMessages.value.length === 0) {
    selectMode.value = false;
  }
};

const handleSelectAll = () => {
  if (activeConversation.value) {
    const messages = activeConversation.value.text.map(text => text.id);
    selectedMessages.value = messages;
    selectAll.value = true;
  }
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

  <div v-else-if="activeConversations && activeConversations.length" class="h-full flex flex-col scrollbar-hidden">
    <div v-for="conv in activeConversations" :key="conv.id" class="mb-6">
      <ChatTop
        :select-all="selectAll"
        :select-mode="selectMode"
        :handle-select-all="handleSelectAll"
        :handle-deselect-all="handleDeselectAll"
        :handle-close-select="handleCloseSelect"
      />
      <ChatMiddle
        :selected-messages="selectedMessages"
        :handle-select-message="handleSelectMessage"
        :handle-deselect-message="handleDeselectMessage"
      />
      <ChatBottom />
    </div>
  </div>

  <NoChatSelected v-else />
</template>
