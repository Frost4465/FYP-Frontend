<script setup lang="ts">
import type { IAttachment, IMessage } from "@src/types";

import useStore from "@src/store/store";
import { getFullName, shorten } from "@src/utils";

const props = defineProps<{
  message: IMessage;
  self?: boolean;
}>();

</script>

<template>
  
  <div
    v-if="props.message"
    class="border-l-2 pl-3 cursor-pointer outline-none duration-200"
    :class="['border-gray-900/50', 'dark:border-white/50']"
    tabindex="0"
    :aria-label="'reply to: ' + props.message.sender"
  >
    <!--name-->
    <p
      class="mb-3 font-semibold text-xs leading-4 tracking-[.01rem]"
      :class="[
        'text-black',
        'opacity-60',
        'dark:text-white',
        'dark:opacity-70',
      ]"
    >
      {{
        store.user && message.sender.id !== store.user.id
          ? getFullName(props.message.sender)
          : "You"
      }}
    </p>

    <!--content-->
    <p
      v-if="props.message.text !== 'recording' && props.message.text"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      {{ shorten(props.message, 60) }}
    </p>

    <!--attachments title-->
    <!-- <p
      v-else-if="hasAttachments(props.message)"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      {{ (props.message?.attachments as IAttachment[])[0].name }}
    </p> -->

    <!--recording title-->
    <!-- <p
      v-else-if="props.message.type === 'recording'"
      class="body-2 text-black opacity-50 dark:text-white dark:opacity-70"
    >
      recording 23s
    </p> -->
  </div>
</template>
