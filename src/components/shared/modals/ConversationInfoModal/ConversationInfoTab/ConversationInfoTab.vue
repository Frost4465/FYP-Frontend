<script setup lang="ts">
import type { IContact, IConversation } from "@src/types";
import { computed, ref } from "vue";
import { getName } from "@src/utils";
import {
  ArrowLeftOnRectangleIcon,
  AtSymbolIcon,
  BellIcon,
  NoSymbolIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/solid";
import IconAndText from "@src/components/shared/blocks/IconAndText.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

const props = defineProps<{
  conversation?: IConversation; // now optional
  contact?: IContact;
  closeModal: () => void;
}>();

const openImageViewer = ref(false);

const imageUrl = computed(() => {
  // if (props.contact) {
  //   return props.contact.avatar;
  // } else if (props.conversation) {
  //   return getAvatar(props.conversation);
  // }
  // return undefined;
});
</script>

<template>
  <div>
    <div class="mb-6 px-5 flex justify-between items-center">
      <!--title-->
      <p class="heading-1 text-black/70 dark:text-white/70" id="modal-title" tabindex="0">
        <span v-if="(props.conversation && props.conversation.type === 'couple') || props.contact">
          Contact
        </span>
        <span v-else-if="props.conversation && props.conversation.type === 'group'">Group</span>
        <span v-else-if="props.conversation && props.conversation.type === 'broadcast'">Broadcast</span>
        Info
      </p>

      <!--close button-->
      <Button v-if="!props.contact" @click="props.closeModal" class="outlined-danger ghost-text py-2 px-4">
        esc
      </Button>

      <!--return button-->
      <IconButton v-else @click="
        $emit('active-page-change', {
          tabName: 'members',
          animationName: 'slide-right',
        })
        " class="ic-btn-outlined-danger p-2">
        <ArrowUturnLeftIcon
          class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-70 group-focus:text-red-500 dark:group-focus:text-white group-hover:text-red-500 group-hover:opacity-100 dark:group-hover:text-white" />
      </IconButton>
    </div>

    <!--top-->
    <div class="w-full p-5 pb-6">
      <div class="flex">
        <!--avatar-->
        <div class="mr-5">
          <button @click="openImageViewer = true" class="outline-none" aria-label="view avatar">
            <!-- <div
              :style="{
                backgroundImage: `url(${imageUrl.value})`,
              }"
              class="w-9.5 h-9.5 rounded-full bg-cover bg-center"
            ></div> -->
          </button>
        </div>

        <!--name-->
        <div class="w-full flex justify-between">
          <div>
            <p class="heading-2 text-black/70 dark:text-white/70 mb-3 mr-5 text-start">
              <span>
                {{ getName(props.conversation) }}
              </span>
            </p>

            <p class="body-2 text-black/70 dark:text-white/70 font-extralight text-start">
              <!--last seen-->
              <!--or number of group members-->
              <template v-if="props.conversation">
                {{
                  props.conversation.type === "couple" || props.contact
                    ? "Last seen Dec 16, 2019"
                    : (props.conversation.contacts
                        ? props.conversation.contacts.length + ' Contacts'
                        : '')
                }}
              </template>
            </p>
          </div>

          <IconButton
            title="edit group"
            v-if="props.conversation && ['group', 'broadcast'].includes(props.conversation.type)"
            class="ic-btn-ghost-primary w-7 h-7"
            @click="
              $emit('active-page-change', {
                tabName: 'edit-group',
                animationName: 'slide-left',
              })
            "
          >
            <PencilIcon class="w-5 h-5" />
          </IconButton>
        </div>
      </div>
    </div>

    <!--middle-->
    <div class="w-full py-5 border-t border-gray-100 dark:border-gray-700">
      <!--(contact) email-->
      <div
        v-if="props.conversation && (props.conversation.type === 'couple' || props.contact)"
        class="flex px-5 pb-5 items-center"
      >
        <!-- <IconAndText
          :icon="AtSymbolIcon"
          :title="getOddContact(props.conversation)?.email"
        /> -->
      </div>

      <!--(group) members-->
      <div
        v-if="
          props.conversation &&
          ['group', 'broadcast'].includes(props.conversation.type) && !props.contact
        "
        class="px-5 flex items-center pb-5"
      >
        <IconAndText
          :icon="UserIcon"
          title="members"
          link
          chevron
          @click="
            $emit('active-page-change', {
              tabName: 'members',
              animationName: 'slide-left',
            })
          "
        />
      </div>

      <!--(both) notifications-->
      <div class="px-5 flex items-center">
        <IconAndText :icon="BellIcon" title="notifications" switch />
      </div>

      <!--(both) shared media-->
      <div class="px-5 pt-5 flex items-center">
        <IconAndText
          :icon="ShareIcon"
          title="shared media"
          link
          chevron
          @click="
            $emit('active-page-change', {
              tabName: 'shared-media',
              animationName: 'slide-left',
            })
          "
        />
      </div>
    </div>

    <!--bottom-->
    <div class="w-full border-t border-gray-100 dark:border-gray-700">
      <!--(contact) block contact-->
      <div
        v-if="props.conversation && (props.conversation.type === 'couple' || props.contact)"
        class="px-5 pt-5 group"
      >
        <IconAndText :icon="NoSymbolIcon" title="block contact" link />
      </div>

      <!--(contact) delete contact-->
      <div
        v-if="props.conversation && (props.conversation.type === 'couple' || props.contact)"
        class="px-5 pt-5 group"
      >
        <IconAndText :icon="TrashIcon" title="delete contact" link />
      </div>

      <!--(group) exit group-->
      <div
        v-if="
          props.conversation &&
          ['group', 'broadcast'].includes(props.conversation.type) && !props.contact
        "
        class="px-5 pt-5 flex items-center group"
      >
        <IconAndText :icon="ArrowLeftOnRectangleIcon" title="exit group" link />
      </div>
    </div>
  </div>
</template>
