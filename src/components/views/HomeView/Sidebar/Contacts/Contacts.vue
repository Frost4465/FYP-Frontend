<script setup lang="ts">
import { UserPlusIcon } from "@heroicons/vue/24/outline";
import type { IContactGroup } from "@src/types";
import type { Ref } from "vue";
import { ref, watch, onMounted } from "vue";
import axios from "axios";

import AddContactModal from "@src/components/shared/modals/AddContactModal.vue";
import NoContacts from "@src/components/states/empty-states/NoContacts.vue";
import MultipleLines from "@src/components/states/loading-states/MultipleLines.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import SortedContacts from "@src/components/views/HomeView/Sidebar/Contacts/SortedContacts.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

const searchText: Ref<string> = ref("");
const openModal = ref(false);
const contactContainer: Ref<HTMLElement | null> = ref(null);

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const FRIENDLIST = import.meta.env.VITE_BASE_FRIEND_LIST;
const FRIEND_ENDPOINT = BASE_URL + FRIENDLIST;
const ADD_FRIEND = import.meta.env.VITE_BASE_ADD_FRIEND;
const ADD_FRIEND_ENDPOINT = BASE_URL + ADD_FRIEND;
const token = localStorage.getItem("token");
const loading = ref(true);

const fullContactGroups = ref<IContactGroup[]>([]);
const filteredContactGroups = ref<IContactGroup[]>([]);

async function contactListing() {
  loading.value = true;
  try {
    const response = await axios.get(FRIEND_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log(response.data);
    const groupedContacts = groupContacts(response.data);
    fullContactGroups.value = groupedContacts;
    filteredContactGroups.value = groupedContacts;
  } catch (err) {
    console.error("Error fetching contacts:", err);
    fullContactGroups.value = [];
    filteredContactGroups.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(contactListing);

function groupContacts(contacts: { id: number; userName: string }[]) {
  const groups: { [key: string]: IContactGroup } = {};

  contacts.forEach(contact => {
    const firstLetter = contact.userName.charAt(0).toUpperCase();

    if (!groups[firstLetter]) {
      groups[firstLetter] = { letter: firstLetter, contacts: [] };
    }
    groups[firstLetter].contacts.push(contact);
  });

  return Object.values(groups);
}

watch(searchText, () => {
  if (!searchText.value) {
    filteredContactGroups.value = fullContactGroups.value;
    return;
  }
  filteredContactGroups.value = fullContactGroups.value
    ?.map((group) => {
      let newGroup = { ...group };
      newGroup.contacts = newGroup.contacts.filter((contact) => {
        const name = `${contact.userName}`.toLowerCase();
        return name.includes(searchText.value.toLowerCase());
      });
      return newGroup;
    })
    .filter((group) => group.contacts.length > 0);
});

const handleContactDeleted = () => {
  console.log("Contact deleted, refreshing the contact list");
  contactListing(); 
};

const handleAddContact = (userId: number) => {
  console.log(`Adding user with ID: ${userId}`);
  axios.post(
    ADD_FRIEND_ENDPOINT + userId,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  )
    .then(response => {
      contactListing();
    })
    .catch(error => {
      console.error("Error adding contact:", error);
    });
};
</script>

<template>
  <div>
    <SidebarHeader>
      <template v-slot:title>Contacts</template>
      <template v-slot:actions>
        <IconButton @click="openModal = true" class="ic-btn-ghost-primary w-7 h-7" title="add contacts"
          aria-label="add contacts">
          <UserPlusIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>
      </template>
    </SidebarHeader>

    <div class="px-5 xs:pb-6 md:pb-5">
      <SearchInput v-model="searchText" />
    </div>

    <div ref="contactContainer" class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll">
      <MultipleLines v-if="loading" v-for="item in 5" :key="item" />

      <SortedContacts v-else-if="filteredContactGroups.length > 0" :contactGroups="filteredContactGroups" @contact-deleted="handleContactDeleted"
        :bottom-edge="(contactContainer as HTMLElement)?.getBoundingClientRect().bottom" />

      <NoContacts v-else />
    </div>

    <AddContactModal v-if="openModal" :open-modal="openModal" :close-modal="() => (openModal = false)"
      @add-contact="handleAddContact" />
  </div>
</template>