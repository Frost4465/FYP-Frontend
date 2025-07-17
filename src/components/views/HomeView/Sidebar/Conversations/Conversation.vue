<script setup lang="ts">
import type { IConversation } from "@src/types";
import type { Ref } from "vue";
import { computed, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router"; 

import {
  getActiveConversationId,
  getConversationIndex,
  getName,
  shorten,
} from "@src/utils";
import router from "@src/router";

const props = defineProps<{
  conversation: IConversation;
}>();

const showContextMenu = ref(false);
const contextMenuCoordinations: Ref<{ x: number; y: number } | undefined> = ref();
const isActiveConversation = computed(() => props.conversation.id === activeConversationId.value);

// open context menu.
const handleShowContextMenu = (event: any) => {
  showContextMenu.value = true;
  contextMenuCoordinations.value = {
    x:
      window.innerWidth - 205 <= event.pageX
        ? window.innerWidth - 220
        : event.pageX,
    y:
      window.innerHeight - 125 <= event.pageY
        ? window.innerHeight - 200
        : event.pageY,
  };
};

onBeforeUnmount(() => {
  showContextMenu.value = false;
});

// (event) closes the context menu
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// (event) select this conversation.
const handleSelectConversation = () => {
  showContextMenu.value = false;
  router.push({ path: `/chat/${props.conversation.id}/` });
};

// last message in conversation to display
const lastMessage = computed(() => {
  return props.conversation.messages.length > 0
    ? props.conversation.messages[props.conversation.messages.length - 1]
    : null; // Return null if no messages are available
});

// (event) remove the unread indicator when opening the conversation
const handleRemoveUnread = () => {
  let index = getConversationIndex(props.conversation.id);
  if (index !== undefined && typeof index === 'number') {
  }
};

// (computed property) determines if this conversation is active.
const route = useRoute(); // <-- ADD THIS
const activeConversationId = computed(() => route.params.id as string | undefined);

const isActive = computed(() => props.conversation.id === activeConversationId.value);

const conversationName = computed(() => {
  return props.conversation.userName;
});
</script>


<template>
  <div class="select-none">
    <button :aria-label="'conversation with' + getName(props.conversation)" tabindex="0"
      @contextmenu.prevent="handleShowContextMenu" @click="
        () => {
          handleRemoveUnread();
          handleSelectConversation();
        }
      "
      class="w-full h-23 px-5 py-6 mb-3 flex rounded focus:bg-indigo-50 dark:active:bg-gray-600 dark:focus:bg-gray-600 dark:hover:bg-gray-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none transition duration-500 ease-out"
      :class="{
        'md:bg-indigo-50': isActive,
        'md:dark:bg-gray-600': isActive,
      }">
      <!--profile image-->
      <div class="mr-4">
        <!-- <div :style="{ backgroundImage: `url(${getAvatar(props.conversation)})` }"
          class="w-7 h-7 rounded-full bg-cover bg-center"></div> -->
      </div>

      <div class="w-full flex flex-col">
        <div class="w-full">
          <!--conversation name-->
          <div class="flex items-start">
            <div class="grow mb-3 text-start">
              <p class="heading-2 text-black/70 dark:text-white/70">
                {{ conversationName }}
              </p>
            </div>

            <!--last message date-->
            <p class="body-1 text-black/70 dark:text-white/70">
              {{ lastMessage?.timestamp ? new Date(lastMessage.timestamp).toLocaleString() : '' }}
            </p>
          </div>
        </div>

        <div class="flex justify-between">
          <div>
            <!--draft Message-->
            <p v-if="
              props.conversation.draftMessage &&
              props.conversation.id !== getActiveConversationId()
            " class="body-2 flex justify-start items-center text-red-400">
              draft: {{ shorten(props.conversation.draftMessage) }}
            </p>
            <p v-else class="body-2 text-black/70 dark:text-white/70 flex justify-start items-center"
              :class="{ 'text-indigo-400': props.conversation.unread }">
              <span :class="{ 'text-indigo-400': props.conversation.unread }">
                {{ shorten(lastMessage == null ? "" : lastMessage) }}
              </span>
            </p>
          </div>

          <div v-if="props.conversation.unread">
            <div class="w-4.5 h-4.5 flex justify-center items-center rounded-[50%] bg-indigo-300">
              <p class="body-1 text-white">
                {{ props.conversation.unread }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>