<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleCloseSelect: () => void;
  // add conversation or group info as needed, e.g.:
  // groupName?: string;
  // members?: string[];
}>();

const openSearch = ref(false);
const openInfo = ref(false);

const handleOpenSearch = () => { openSearch.value = true; };
const handleOpenInfo = () => { openInfo.value = true; };
</script>

<template>
  <div class="w-full">
    <div class="w-full min-h-21 px-5 py-6">
      <SelectSection
        v-if="props.selectMode"
        :select-mode="props.selectMode"
        :select-all="props.selectAll"
        :handle-close-select="props.handleCloseSelect"
        :handle-select-all="props.handleSelectAll"
        :handle-deselect-all="props.handleDeselectAll"
      />
      <ConversationInfoSection
        v-else
        :handle-open-info="handleOpenInfo"
        :handle-open-search="handleOpenSearch"
      />
    </div>
    <SearchModal
      :open="openSearch"
      :close-modal="() => (openSearch = false)"
    />
    <ConversationInfoModal
      :open="openInfo"
      :closeModal="() => (openInfo = false)"
    />
  </div>
</template>
