<script setup lang="ts">
import { ref } from "vue";
// Props/callbacks for sending message, attachments, etc, if needed.

const value = ref("");
const recording = ref(false);
const openAttachmentsModal = ref(false);
const handleSendMessage = () => {
  value.value = "";
};
</script>

<template>
  <div class="w-full">
    <div class="h-auto min-h-21 p-5 flex items-end" :class="recording ? ['justify-between'] : []">
      <div class="min-h-[2.75rem]">
        <IconButton v-if="!recording" @click="openAttachmentsModal = true">
        </IconButton>
        <p v-if="recording" class="body-1 text-indigo-300">00:11</p>
      </div>
      <div class="grow md:mr-5 xs:mr-4 self-end" v-if="!recording">
        <Textarea v-model="value" class="max-h-[5rem] pr-12.5 resize-none scrollbar-hidden" :auto-resize="true"
          cols="30" rows="1" placeholder="Write your message here" aria-label="Write your message here"
          @keydown.enter.exact.prevent="handleSendMessage" />
      </div>
      <div class="min-h-[2.75rem] flex">
        <IconButton v-if="!recording" @click="handleSendMessage">
        </IconButton>
      </div>
    </div>
    <AttachmentsModal :open="openAttachmentsModal" :close-modal="() => (openAttachmentsModal = false)" />
  </div>
</template>
