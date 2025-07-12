<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";

const props = defineProps<{
  openModal: boolean;
  closeModal: () => void;
}>();

const emit = defineEmits(["add-contact"]);

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const ADD_FRIEND_LIST = import.meta.env.VITE_BASE_ADD_FRIENDSLIST;
const ADD_FRIEND_LIST_ENDPOINT = BASE_URL + ADD_FRIEND_LIST;

const potentialUsers = ref<{ id: number; userName: string }[]>([]); 
const search = ref("");
const loading = ref(false);
console.log(props.openModal);
watch(
  () => props.openModal,
  async (newVal) => {
    if (newVal) {
      console.log("Modal opened, fetching users...");
      await fetchPotentialUsers();
    }
  },
  { immediate: true } 
);


async function fetchPotentialUsers(){
  loading.value = true; 
  try {
    const response = await fetch(ADD_FRIEND_LIST_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    potentialUsers.value = await response.json();
  } catch (err) {
    console.error("Error fetching users:", err);
    potentialUsers.value = [];
  } finally {
    loading.value = false; 
  }
};

const filteredUsers = computed(() =>
  potentialUsers.value.filter(u =>
    u.userName.toLowerCase().includes(search.value.toLowerCase()) 
  )
);

function handleAdd(userId: number) {
  emit("add-contact", userId); 
  props.closeModal();
}
</script>

<template>
  <Modal :open="props.openModal" :close-modal="props.closeModal">
    <template #content>
      <div class="w-75 bg-white dark:bg-gray-800 rounded py-6">
        <div class="flex justify-between items-center px-5 mb-4">
          <p class="heading-1 text-black/70 dark:text-white/70" tabindex="0">
            Add Contact
          </p>
        </div>

        <div class="px-5 pb-5">
          <SearchInput v-model="search" placeholder="Search by username" />
        </div>

        <div v-if="loading" class="px-5 pb-5">Loading...</div>

        <div v-else class="px-5 max-h-60 overflow-y-auto">
          <div v-for="user in filteredUsers" :key="user.id" class="flex items-center justify-between py-2 border-b border-gray-100">
            <div>{{ user.userName }}</div> 
            <Button class="contained-primary py-1 px-3" @click="handleAdd(user.id)">
              Add
            </Button>
          </div>

          <div v-if="filteredUsers.length === 0" class="text-gray-400 py-6 text-center">
            No users found.
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
