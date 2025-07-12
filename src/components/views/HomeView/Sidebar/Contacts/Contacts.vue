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
const ADD_FRIEND_LIST = import.meta.env.VITE_BASE_ADD_FRIENDSLIST;
const ADD_FRIEND_LIST_ENDPOINT = BASE_URL + ADD_FRIEND_LIST;
const token = localStorage.getItem("token");
const loading = ref(true);

// Store the full list from API for filtering
const fullContactGroups = ref<IContactGroup[]>([]);
const filteredContactGroups = ref<IContactGroup[]>([]);

async function contactListing() {
  loading.value = true;
  console.log(token);
  try {
    const response = await axios.get(
      FRIEND_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    fullContactGroups.value = response.data;
    filteredContactGroups.value = response.data;
  } catch (err) {
    fullContactGroups.value = [];
    filteredContactGroups.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(contactListing);

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

      <SortedContacts v-else-if="filteredContactGroups.length > 0" :contactGroups="filteredContactGroups"
        :bottom-edge="(contactContainer as HTMLElement)?.getBoundingClientRect().bottom" />

      <NoContacts v-else />
    </div>

    <AddContactModal :open-modal="openModal" :close-modal="() => (openModal = false)" @add-contact="contactListing" />
  </div>
</template>
