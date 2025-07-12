<script setup lang="ts">
import { computed } from "vue";
import Button from "@src/components/ui/inputs/Button.vue";
import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";

const props = defineProps({
  email: String,
  firstName: String,
  lastName: String,
  userName: String,
  warningMessage: String,
});
const emit = defineEmits([
  "update:email",
  "update:firstName",
  "update:lastName",
  "update:userName",
  "active-section-change",
  "show-warning",
]);

const isFormValid = computed(() => {
  return props.email && props.firstName && props.lastName;
});

const handleNext = () => {
  if (!isFormValid.value) {
    emit('show-warning', "Please fill in all the fields before proceeding.");
  } else {
    emit('active-section-change', {
      sectionName: 'password-section',
      animationName: 'slide-left',
    });
  }
};

</script>

<template>
  <div>
    <!--form-->
    <div class="mb-5">
      <LabeledTextInput label="Email" placeholder="Enter your email" class="mb-5" :modelValue="email"
        @update:modelValue="(val: string) => emit('update:email', val)" />
      <LabeledTextInput label="Username" placeholder="Enter your Username" class="mb-5" :modelValue="userName"
        @update:modelValue="(val: string) => emit('update:userName', val)" />
      <LabeledTextInput label="First Name" placeholder="Enter your first name" class="mb-5" :modelValue="firstName"
        @update:modelValue="(val: string) => emit('update:firstName', val)" />
      <LabeledTextInput label="Last Name" placeholder="Enter your last name" class="mb-5" :modelValue="lastName"
        @update:modelValue="(val: string) => emit('update:lastName', val)" />
    </div>

    <div class="mb-6">
      <Button class="contained-primary contained-text w-full mb-4" :disabled="!isFormValid"
        @click="handleNext">Next</Button>
    </div>

    <!--divider-->
    <div class="mb-6 flex items-center">
      <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
      <p class="body-3 text-black/75 dark:text-white/70 px-4 font-light">or</p>
      <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
    </div>
  </div>
</template>
