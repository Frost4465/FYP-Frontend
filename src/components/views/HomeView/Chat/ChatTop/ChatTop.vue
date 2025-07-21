<script setup lang="ts">
import { ref } from "vue";
import ConversationInfoModal from "@src/components/shared/modals/ConversationInfoModal/ConversationInfoModal.vue";
import ConversationInfoSection from "@src/components/views/HomeView/Chat/ChatTop/ConversationInfoSection.vue";
import SelectSection from "@src/components/views/HomeView/Chat/ChatTop/SelectSection.vue";
import type { IConversation } from "@src/types";

const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleCloseSelect: () => void;
  conversationName: string;
  conversation: IConversation | null;
  selectedMessages: string[];
}>();

const openSearch = ref(false);
const openInfo = ref(false);

const handleOpenSearch = () => { openSearch.value = true; };
const handleOpenInfo = () => { openInfo.value = true; };
</script>

<template>
  <div class="w-full border-b">
    <div class="w-full min-h-21 px-5 py-6 flex items-center">
      <h2 v-if="!props.selectMode" class="text-xl font-semibold flex-1">
        {{ props.conversationName }}
      </h2>
      <SelectSection
        v-if="props.selectMode"
        :select-mode="props.selectMode"
        :select-all="props.selectAll"
        :handle-close-select="props.handleCloseSelect"
        :handle-select-all="props.handleSelectAll"
        :handle-deselect-all="props.handleDeselectAll"
        :selected-messages="props.selectedMessages"
      />
      <!-- Conversation Info Section -->
      <ConversationInfoSection
        v-else
        :handle-open-info="handleOpenInfo"
        :handle-open-search="handleOpenSearch"
      />
    </div>
    <!-- Modals -->
    <SearchModal
      :open="openSearch"
      :close-modal="() => (openSearch = false)"
    />
    <ConversationInfoModal
      :open="openInfo"
      :closeModal="() => (openInfo = false)"
      :conversation="props.conversation"
    />
  </div>
</template>
