<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import ContactItem from "@src/components/shared/blocks/ContactItem.vue";
import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import NoContacts from "@src/components/states/empty-states/NoContacts.vue"
import type { IContact } from "@src/types";

const emit = defineEmits<{
  (e: 'selected', ids: number[]): void
}>();

const contacts = ref<IContact[]>([]);
const loading = ref(false);
const keyword = ref("");
const selectedUserId = ref<number | null>(null);

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const ADD_FRIEND_LIST = import.meta.env.VITE_BASE_ADD_FRIENDSLIST;
const ADD_FRIEND_LIST_ENDPOINT = BASE_URL + ADD_FRIEND_LIST;
const ADD_FRIEND = import.meta.env.VITE_BASE_ADD_FRIEND;
const ADD_FRIEND_ENDPOINT = BASE_URL + ADD_FRIEND;

const token = localStorage.getItem("token");

async function handleAddFriend(id: number) {
  try {
    await axios.post(
      ADD_FRIEND_ENDPOINT + id,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    contacts.value = contacts.value.filter(c => c.id !== id);
  } catch (err) {
    console.error("Failed to add friend", err);
  }
}


onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      ADD_FRIEND_LIST_ENDPOINT,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    contacts.value = response.data; 
  } catch (err) {
    contacts.value = [];
  } finally {
    loading.value = false;
  }
});

const filteredContacts = computed(() =>
  contacts.value.filter(contact =>
    contact.userName.toLowerCase().includes(keyword.value.toLowerCase())
  )
);

</script>

<template>
  <div class="pb-6">
    <!-- Search bar -->
    <SearchInput
      :value="keyword"
      @valueChanged="val => keyword = val"
      placeholder="Search contacts"
    />

    <!-- Scrollable contacts list -->
    <ScrollBox class="overflow-y-scroll max-h-50">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-10 text-gray-400">
        Loading...
      </div>
      <!-- Show contacts with Add button -->
      <template v-else-if="filteredContacts.length > 0">
        <div v-for="contact in filteredContacts" :key="contact.id" class="flex items-center gap-2">
          <ContactItem
            :contact="{ id: contact.id, userName: contact.userName }"
            :selected="contact.id === selectedUserId"
            @click="selectedUserId = contact.id"
          />
          <button
            class="ml-2 px-3 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-700"
            @click="handleAddFriend(contact.id)"
          >
            Add
          </button>
        </div>
      </template>
      <NoContacts v-else vertical />
    </ScrollBox>
  </div>
</template>