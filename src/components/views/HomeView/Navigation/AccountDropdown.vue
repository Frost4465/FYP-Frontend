<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, nextTick } from "vue";
import useStore from "@src/store/store";
import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";

const router = useRouter();
const props = defineProps<{
  showDropdown: boolean;
  handleCloseDropdown: () => void;
  handleShowDropdown: () => void;
  id: string;
}>();

const store = useStore();

const handleLogout = async () => {
  props.handleCloseDropdown();
  await nextTick(); // Wait for dropdown to be removed from DOM
  router.push("/access/sign-in/");
};

const handlePasswordChange = async () => {
  props.handleCloseDropdown();
  await nextTick();
  router.push("/reset/");
};

const handleCloseOnClickOutside = (event: Event) => {
  if (
    !["user-avatar", "profile-menu-button"].includes(
      (event.target as HTMLButtonElement).id,
    )
  ) {
    props.handleCloseDropdown();
  }
};
</script>

<template>
  <div class="relative">
    <!--toggle dropdown button-->
    <button
      :id="props.id + '-button'"
      @click="handleShowDropdown"
      class="bg-white rounded-full active:scale-110 focus:outline-none focus:scale-110 transition duration-200 ease-out"
      :style="{
        'box-shadow': !store.settings.darkMode
          ? '0 .125rem .3125rem rgba(193, 202, 255, 0.5),.125rem 0 .3125rem rgba(193, 202, 255, 0.5),-0.125rem 0 .3125rem rgba(193, 202, 255, 0.5),0 -0.125rem .3125rem rgba(193, 202, 255, 0.5)'
          : '0 .125rem .3125rem rgba(0, 70, 128, 0.5),.125rem 0 .3125rem rgba(0, 70, 128, 0.5),-0.125rem 0 .3125rem rgba(0, 70, 128, 0.5),0 -0.125rem .3125rem rgba(0, 70, 128, 0.5)',
      }"
      :aria-expanded="showDropdown"
      aria-controls="profile-menu"
      aria-label="toggle profile menu"
    >
      <div
        id="user-avatar"
        :style="{ backgroundImage: `url(${store.user?.avatar})` }"
        class="w-7 h-7 rounded-full bg-cover bg-center"
      ></div>
    </button>

    <!--dropdown menu-->
    <Dropdown
      :id="props.id + '-dropdown'"
      :aria-labelledby="props.id + '-button'"
      :show="props.showDropdown"
      :position="[
        'md:bottom-0',
        'md:left-8',
        'md:top-auto',
        'bottom-12.5',
        'left-[-4.8125rem]',
      ]"
      :handle-click-outside="handleCloseOnClickOutside"
      :close-dropdown="props.handleCloseDropdown"
    >
      <button
        class="dropdown-link dropdown-link-primary"
        aria-label="change password"
        role="menuitem"
        @click="handlePasswordChange"
      >
        <ArrowPathIcon
          class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70"
        />
        Password Change
      </button>

      <button
        class="dropdown-link dropdown-link-danger"
        aria-label="logout"
        role="menuitem"
        @click="handleLogout"
      >
        <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-3" />
        Logout
      </button>
    </Dropdown>
  </div>
</template>
