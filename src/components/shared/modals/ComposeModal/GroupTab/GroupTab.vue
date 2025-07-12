<script setup lang="ts">
import { ref } from "vue";
import useStore from "@src/store/store";
import Button from "@src/components/ui/inputs/Button.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";

const store = useStore();
const emit = defineEmits(['selected']);

const selectedUserIds = ref<string[]>([]);

const toggleUser = (userId: string) => {
  if (selectedUserIds.value.includes(userId)) {
    selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId);
  } else {
    selectedUserIds.value.push(userId);
  }
};

const createGroup = () => {
  if (selectedUserIds.value.length > 1) emit('selected', selectedUserIds.value);
};
</script>

<template>
  <div class="pb-6">
    <ScrollBox class="overflow-y-scroll max-h-50">
      <ContactItem
        v-for="(contact, index) in store.user.contacts"
        :key="index"
        :contact="contact"
        :selected="selectedUserIds.includes(contact.id)"
        @click="toggleUser(contact.id)"
      />
    </ScrollBox>
    <Button class="w-full mt-4" :disabled="selectedUserIds.length < 2" @click="createGroup">
      Create Group
    </Button>
  </div>
</template>
