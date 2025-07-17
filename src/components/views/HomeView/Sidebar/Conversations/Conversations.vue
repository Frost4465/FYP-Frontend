<script setup lang="ts">
import { ref, onMounted, watch, Ref } from "vue";
import axios from "axios";
import { getActiveConversationId, getName } from "@src/utils";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import ComposeModal from "@src/components/shared/modals/ComposeModal/ComposeModal.vue";
import NoConversation from "@src/components/states/empty-states/NoConversation.vue";
import Circle2Lines from "@src/components/states/loading-states/Circle2Lines.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import ConversationsList from "@src/components/views/HomeView/Sidebar/Conversations/ConversationsList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";

const keyword: Ref<string> = ref("");
const composeOpen = ref(false);

const filteredConversations: Ref<any[]> = ref([]);
const loading = ref(true); 
const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const CHAT_LIST = import.meta.env.VITE_BASE_CHAT_LIST;
const CONVERSATIONS_ENDPOINT = BASE_URL + CHAT_LIST;

const fetchConversations = async () => {
  loading.value = true;
  try {
    const response = await axios.get(CONVERSATIONS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    filteredConversations.value = response.data.map((conversation: any) => ({
      id: conversation.id,  
      type: conversation.group ? "group" : "private",
      userName: conversation.groupName,  
      contacts: conversation.members.map((memberId: string) => ({
        id: parseInt(memberId)
      })),
      messages: [], 
      replyMessage: undefined,  
      unread: 0,  
      draftMessage: "",  
    }));
    console.log("TESTING ->", filteredConversations.value);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    filteredConversations.value = [];
  } finally {
    loading.value = false;
  }
  console.log(filteredConversations);
};

watch([keyword], () => {
  if (!keyword.value) {
    return;
  }
  filteredConversations.value = filteredConversations.value.filter((conversation) =>
    getName(conversation)?.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

// Handle opening compose modal for new chats
const closeComposeModal = () => {
  composeOpen.value = false;
};

const onCreateChat = () => {
fetchConversations(); 
}
onMounted(fetchConversations);

</script>

<template>
  <div>
    <SidebarHeader>
      <template v-slot:title>Messages</template>
      <template v-slot:actions>
        <IconButton class="ic-btn-ghost-primary w-7 h-7" @click="composeOpen = true" aria-label="compose conversation"
          title="compose conversation">
          <PencilSquareIcon class="w-[1.25rem] h-[1.25rem]" />
        </IconButton>
      </template>
    </SidebarHeader>

    <div class="px-5 xs:pb-6 md:pb-5">
      <SearchInput @value-changed="(value) => keyword = value" :value="keyword" />
    </div>

    <div role="list" aria-label="conversations" class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll">
      <Circle2Lines v-if="loading" v-for="item in 6" :key="item" />

      <div v-else>
        <div v-if="filteredConversations.length > 0">
          <FadeTransition>
            <component :is="ConversationsList" :filtered-conversations="filteredConversations" :key="filteredConversations.map(c => c.id).join(',')" />
          </FadeTransition>
        </div>

        <div v-else>
          <NoConversation v-if="filteredConversations.length === 0" />
        </div>
      </div>
    </div>

    <!--compose modal-->
    <ComposeModal :open="composeOpen" :close-modal="closeComposeModal" @create-chat="onCreateChat" />
  </div>
</template>
