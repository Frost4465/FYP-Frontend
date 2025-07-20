<script setup lang="ts">
import type { Ref } from "vue";
import { ref, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  id?: string;
  type?: string;
  modelValue?: string;
  name?: string;
  placeholder?: string;
  bordered?: boolean;
  autoResize?: boolean;
}>();

const textarea: Ref<HTMLTextAreaElement | null> = ref(null);

const autoResize = () => {
  if (props.autoResize && textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = textarea.value.scrollHeight + "px";
  }
};

const handleInput = (event: any) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
  autoResize();
};

// Ensure resize happens on value change from parent as well
watch(() => props.modelValue, autoResize);

</script>

<template>
  <textarea
    :name="props.name"
    :id="props.id"
    class="text-input"
    :class="[props.bordered ? 'bordered-input' : 'ringed-input']"
    @input="handleInput"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    ref="textarea"
  />
</template>
