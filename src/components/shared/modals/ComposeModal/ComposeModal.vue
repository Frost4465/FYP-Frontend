<script setup lang="ts">
import { ref, computed, watch } from "vue";
import axios from "axios";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import Tabs from "@src/components/ui/navigation/Tabs/Tabs.vue";
import Tab from "@src/components/ui/navigation/Tabs/Tab.vue";

// Props from parent (open/close modal)
const props = defineProps<{
  open: boolean;
  closeModal: () => void;
}>();

// Emits an event when chat is created
const emit = defineEmits(["create-chat"]);

// Active tab state
const activeTabName = ref("contacts"); // "contacts" or "group"

// API URLs
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const FRIEND_LIST = import.meta.env.VITE_BASE_FRIEND_LIST;
const CREATE_CHAT = import.meta.env.VITE_BASE_CREATE_CHAT;
const FRIEND_LIST_ENDPOINT = BASE_URL + FRIEND_LIST;
const CREATE_CHAT_ENDPOINT = BASE_URL + CREATE_CHAT;

// States
const contacts = ref<{ id: number; userName: string }[]>([]); // Contact list
const selectedContacts = ref<number[]>([]); // Selected contact(s) for creating a chat or group
const loading = ref(false);

// Switch between tabs
const handleSwitchTab = (tabName: string) => {
  activeTabName.value = tabName;
};

// Fetch contacts (same list for both tabs)
const fetchContacts = async () => {
  loading.value = true;
  try {
    const response = await axios.get(FRIEND_LIST_ENDPOINT, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    contacts.value = response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
  } finally {
    loading.value = false;
  }
};

// When the modal is opened or the tab is switched, fetch contacts
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      fetchContacts();
    }
  }
);

// Handle selecting users in both tabs
const handleSelectContact = (contactId: number, userName: string) => {
  if (activeTabName.value === "contacts") {
    const groupName = selectedContacts.value.length > 1
      ? selectedContacts.value.map(id => contacts.value.find(contact => contact.id === id)?.userName).join(", ")
      : userName;
    selectedContacts.value = [contactId];
    handleCreateChat(selectedContacts.value, groupName);
  } else {
    if (selectedContacts.value.includes(contactId)) {
      selectedContacts.value = selectedContacts.value.filter(
        (id) => id !== contactId
      );
    } else {
      selectedContacts.value.push(contactId);
    }
  }
};

const handleDoubleClick = (contactId: number, userName: string) => {
  selectedContacts.value = [contactId];
  const groupName = selectedContacts.value.length > 1
    ? selectedContacts.value.map(id => contacts.value.find(contact => contact.id === id)?.userName).join(", ")
    : userName;

  handleCreateChat(selectedContacts.value, groupName);
};

const handleCreateChat = async (selectedUserIds: number[], userName: string) => {
  try {
    const response = await axios.post(CREATE_CHAT_ENDPOINT, {
      memberIds: selectedUserIds,
      isGroup: selectedUserIds.length > 1,
      groupName: userName,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    emit("create-chat", response.data);
  } catch (error) {
    console.error("Failed to create chat", error);
  } finally {
    props.closeModal();
  }
};
</script>

<template>
  <Modal :open="props.open" :close-modal="props.closeModal">
    <template v-slot:content>
      <div class="w-75 bg-white dark:bg-gray-800 rounded pt-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 px-5">
          <p id="modal-title" class="heading-1 text-black/70 dark:text-white/70" tabindex="0">
            Compose
          </p>
        </div>

        <!-- Tabs -->
        <div class="px-5 pb-5">
          <Tabs>
            <Tab @click="handleSwitchTab('contacts')" name="Contacts" :active="activeTabName === 'contacts'" />
            <Tab @click="handleSwitchTab('group')" name="Group" :active="activeTabName === 'group'" />
          </Tabs>
        </div>

        <FadeTransition>
          <div v-if="loading" class="px-5 py-2">Loading...</div>
          <div v-else>
            <div v-if="activeTabName === 'contacts'" class="px-7">
              <div v-for="contact in contacts" :key="contact.id"
                class="flex items-center justify-between py-2 border-b border-gray-200"
                @dblclick="handleDoubleClick(contact.id, contact.userName)" style="padding-bottom: 16px;">
                <span class="text-gray-800 dark:text-white">{{ contact.userName }}</span>
              </div>
              <!-- Add 'No users found' message here -->
              <div v-if="contacts.length === 0" class="text-gray-400 py-6 text-center">
                No users found.
              </div>
            </div>

            <div v-if="activeTabName === 'group'" class="px-7">
              <div v-for="contact in contacts" :key="contact.id"
                class="flex items-center justify-between py-2 border-b border-gray-200" style="padding-bottom: 16px;">
                <span class="text-gray-800 dark:text-white">{{ contact.userName }}</span>
                <Button class="contained-primary py-1 px-3"
                  :class="{ 'bg-blue-500': selectedContacts.includes(contact.id) }"
                  @click="handleSelectContact(contact.id, contact.userName)">
                  Select
                </Button>
              </div>
              <!-- Add 'No users found' message here as well -->
              <div v-if="contacts.length === 0" class="text-gray-400 py-6 text-center">
                No users found.
              </div>
            </div>
          </div>
        </FadeTransition>
      </div>
    </template>
  </Modal>
</template>

<!-- Add custom styles -->
<style scoped>
/* Styling for contact list and buttons */
button:focus {
  outline: none;
}

button.contained-primary {
  background-color: #4c51bf;
  /* Tailwind blue color */
  color: white;
}

button.contained-primary.bg-blue-500 {
  background-color: #3182ce;
}

button.contained-primary:hover {
  background-color: #3b82f6;
}

button.contained-primary:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}

span {
  font-size: 16px;
  font-weight: 500;
}
</style>
