<script setup lang="ts">
import type { MessageVo } from "@src/types";
import { ref, onMounted } from "vue";
const props = defineProps<{
  messages: MessageVo[];
  selectedMessages: string[];
  handleSelectMessage: (id: string) => void;
  handleDeselectMessage: (id: string) => void;
}>();

const container = ref<HTMLElement | null>(null);

onMounted(() => {
  if (container.value) container.value.scrollTop = container.value.scrollHeight;
});


function reformat(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
</script>

<template>
  <div ref="container" class="grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden">
    <div v-for="(message, index) in props.messages" :key="message.id">
      <div
        @click="props.handleSelectMessage(message.text)"
        :class="{ 'bg-blue-50': props.selectedMessages.includes(message.text) }"
      >
        <strong>{{ message.senderName }}:</strong> {{ message.text }}
        <span class="text-xs text-gray-400">{{ reformat(message.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>
