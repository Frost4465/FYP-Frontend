<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Textarea from "@src/components/ui/inputs/Textarea.vue";
import AttachmentsModal from "@src/components/shared/modals/AttachmentsModal/AttachmentsModal.vue";

const props = defineProps<{
  conversationId: string;
  onMessageSent: () => void;
}>();

const value = ref("");
const recording = ref(false);
const openAttachmentsModal = ref(false);
const sending = ref(false);

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const SEND_MESSAGE = import.meta.env.VITE_BASE_SEND_MESSAGE;
const SEND_MESSAGE_ENDPOINT = BASE_URL + SEND_MESSAGE;

const handleSendMessage = async () => {
  if (!value.value.trim() || sending.value) return;
  sending.value = true;
  try {
    await axios.post(
      SEND_MESSAGE_ENDPOINT,
      {
        chatId: props.conversationId,
        text: value.value.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    value.value = "";
    props.onMessageSent(); 
  } catch (error) {
    console.error("Failed to send message", error);
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="w-full">
    <div class="h-auto min-h-21 p-5 flex items-end" :class="recording ? ['justify-between'] : []">
      <div class="min-h-[2.75rem]">
        <IconButton v-if="!recording" @click="openAttachmentsModal = true" />
        <p v-if="recording" class="body-1 text-indigo-300">00:11</p>
      </div>
      <div class="grow md:mr-5 xs:mr-4 self-end" v-if="!recording">
        <Textarea
          v-model="value"
          class="max-h-[5rem] pr-12.5 resize-none scrollbar-hidden"
          :auto-resize="true"
          cols="30"
          rows="1"
          placeholder="Write your message here"
          aria-label="Write your message here"
          @keydown.enter.exact.prevent="handleSendMessage"
          :disabled="sending"
        />
      </div>
      <div class="min-h-[2.75rem] flex">
        <IconButton v-if="!recording" @click="handleSendMessage" :disabled="sending" />
      </div>
    </div>
    <AttachmentsModal :open="openAttachmentsModal" :close-modal="() => (openAttachmentsModal = false)" />
  </div>
</template>
