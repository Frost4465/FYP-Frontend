<script setup lang="ts">
import type { IConversation } from "@src/types";
import { inject, ref } from "vue";
import router from "@src/router";
import { getName } from "@src/utils";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  handleOpenInfo: () => void;
  handleOpenSearch: () => void;
}>();

const status = ref('');
const activeConversation = <IConversation>inject("activeConversation");

const showDropdown = ref(false);

const handleCloseDropdown = async () => {
  showDropdown.value = false;
  // router.push('/access/sign-in/');
};

const handleClickOutside = (event: Event) => {
  let target = event.target as HTMLElement;
  let parentElement = target.parentElement as HTMLElement;
  if (
    target &&
    !(target.classList as Element["classList"]).contains("open-top-menu") &&
    parentElement &&
    !(parentElement.classList as Element["classList"]).contains("open-top-menu")
  ) {
    handleCloseDropdown();
  }
};

const handleCloseConversation = () => {
  router.push({ path: "/chat/" });
};
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <div class="group mr-4 md:hidden">
      <IconButton class="ic-btn-ghost-primary w-7 h-7" @click="handleCloseConversation" title="close conversation"
        aria-label="close conversation">
        <ChevronLeftIcon class="w-[1.25rem] h-[1.25rem]" />
      </IconButton>
    </div>
    <div v-if="status !== 'loading'" class="flex-1 flex items-center">
      <button class="mr-5 outline-none" @click="props.handleOpenInfo" aria-label="profile avatar"></button>
      <p class="whitespace-nowrap text-xl font-semibold m-0">
        {{ getName(activeConversation).replace(/\s+/g, ' ') }}
      </p>
    </div>
    <div class="flex items-center" :class="{ hidden: status === 'loading' }">
      <IconButton title="search messages" aria-label="search messages" @click="props.handleOpenSearch"
        class="ic-btn-ghost-primary w-7 h-7 mr-3">
        <MagnifyingGlassIcon class="w-[1.25rem] h-[1.25rem] text-gray-400 group-hover:text-indigo-300" />
      </IconButton>
      <div class="relative">
        <IconButton id="open-conversation-menu" class="ic-btn-ghost-primary open-top-menu group w-7 h-7"
          @click="showDropdown = !showDropdown" :aria-expanded="showDropdown" tabindex="0"
          aria-controls="conversation-menu" title="toggle conversation menu" aria-label="toggle conversation menu">
          <EllipsisVerticalIcon class="open-top-menu w-[1.25rem] h-[1.25rem]" />
        </IconButton>
        <Dropdown id="conversation-menu" :close-dropdown="() => (showDropdown = false)" :show="showDropdown"
          :position="['right-0']" :handle-click-outside="handleClickOutside" aria-labelledby="open-conversation-menu">
          <button class="dropdown-link dropdown-link-primary" aria-label="Show profile information" role="menuitem"
            @click="
              () => {
                handleCloseDropdown();
                props.handleOpenInfo();
              }
            ">
            <InformationCircleIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Profile Information
          </button>
          <button class="dropdown-link dropdown-link-primary" aria-label="start a voice call with this contact"
            role="menuitem" @click="handleCloseDropdown">
            <PhoneIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Voice call
          </button>
          <button class="dropdown-link dropdown-link-primary" aria-label="share this contact" role="menuitem"
            @click="handleCloseDropdown">
            <ShareIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
            Shared media
          </button>
          <button class="dropdown-link dropdown-link-danger" aria-label="block this contact" role="menuitem"
            @click="handleCloseDropdown">
            <NoSymbolIcon class="h-5 w-5 mr-3" />
            Block contact
          </button>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
