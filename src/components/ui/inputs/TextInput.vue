<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]); // <-- fixed

const props = defineProps<{
  id?: string;
  type?: string;
  modelValue?: string;  // <-- fixed
  name?: string;
  placeholder?: string;
  bordered?: boolean;
}>();

const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <input
    :type="props.type || 'text'"
    :name="props.name"
    :id="props.id"
    class="text-input"
    :class="[props.bordered ? 'bordered-input' : 'ringed-input']"
    @input="handleInput"
    :value="props.modelValue"
    :placeholder="props.placeholder"
  />
</template>
