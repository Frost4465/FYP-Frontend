<script setup lang="ts">
import type { Ref } from "vue";
import type { IContact, IConversation } from "@src/types";
import { computed, ref } from "vue";
import ConversationInfoTab from "@src/components/shared/modals/ConversationInfoModal/ConversationInfoTab/ConversationInfoTab.vue";
import EditGroupInfoTab from "@src/components/shared/modals/ConversationInfoModal/EditGroupInfoTab.vue";
import ConversationMembersTab from "@src/components/shared/modals/ConversationInfoModal/ConversationMembersTab.vue";
import SharedMediaTab from "@src/components/shared/modals/ConversationInfoModal/SharedMediaTab/SharedMediaTab.vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";

const props = defineProps<{
  open: boolean;
  conversation: IConversation | null;
  closeModal: () => void;
}>();

const selectedMember: Ref<IContact | undefined> = ref();
const animation = ref("slide-left");
const activePageName = ref("conversation-info");

const ActiveTab = computed((): any => {
  if (activePageName.value === "conversation-info") return ConversationInfoTab;
  else if (activePageName.value === "members") return ConversationMembersTab;
  else if (activePageName.value === "group-member") return ConversationInfoTab;
  else if (activePageName.value === "shared-media") return SharedMediaTab;
  else if (activePageName.value === "edit-group") return EditGroupInfoTab;
});

const handleChangeActiveTab = (event: {
  tabName: string;
  animationName: string;
  contact?: IContact;
  removeContact?: boolean;
}) => {
  animation.value = event.animationName;
  activePageName.value = event.tabName;
  if (event.contact) {
    selectedMember.value = event.contact;
  }
  if (event.removeContact) {
    selectedMember.value = undefined;
  }
};
</script>

<template>
  <Modal :open="props.open" :close-modal="props.closeModal">
    <template v-slot:content>
      <div class="overflow-x-hidden">
        <div class="w-75 bg-white dark:bg-gray-800 rounded py-6">
          <SlideTransition :animation="animation">
            <component
              @active-page-change="handleChangeActiveTab"
              :is="ActiveTab"
              :conversation="props.conversation"
              :close-modal="props.closeModal"
              :key="activePageName"
              :contact="selectedMember"
            />
          </SlideTransition>
        </div>
      </div>
    </template>
  </Modal>
</template>
