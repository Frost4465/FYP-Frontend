<script setup lang="ts">
import Button from "@src/components/ui/inputs/Button.vue";
import Checkbox from "@src/components/ui/inputs/Checkbox.vue";
import axios from "axios";

const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleCloseSelect: () => void;
  handleDeselectAll: () => void;
  handleSelectAll: () => void;
  selectedMessages: string[];
}>();

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const OPENAI = import.meta.env.VITE_BASE_OPENAI;
const OPEN_AI_ENDPOINT = BASE_URL + OPENAI;


const handleCheck = () => {
  if (props.selectAll) {
    props.handleDeselectAll();
  } else {
    props.handleSelectAll();
  }
};

const handleGptMeaning = async () => {
  if (props.selectedMessages.length > 0) {
    const selectedMessageId = props.selectedMessages[0];
    try {
      const response = await axios.post(OPEN_AI_ENDPOINT, {
        userMessage: selectedMessageId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log("GPT Response:", response.data);
      alert(response.data);
      props.handleDeselectAll();
      props.handleCloseSelect();
    } catch (error) {
      console.error("Error calling GPT API:", error);
    }
  } else {
    alert("No message selected!");
  }
};
</script>

<template>
  <div v-if="props.selectMode" class="w-full flex justify-between items-center">
    <div class="flex items-center">
    </div>
    <div class="flex items-center">
      <Button class="ghost-danger ghost-text mr-3" @click="handleGptMeaning">GPT Meaning</Button>
      <Button class="ghost-primary ghost-text" @click="props.handleCloseSelect">
        Cancel
      </Button>
    </div>
  </div>
</template>
