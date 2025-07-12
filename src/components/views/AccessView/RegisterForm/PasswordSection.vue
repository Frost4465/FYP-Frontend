<script setup lang="ts">
import { ref, computed } from "vue";
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import axios from "axios";
import { useRouter } from "vue-router"

const props = defineProps<{
  email: string,
  firstName: string,
  lastName: string,
  userName: string,
  password: string;
  warningMessage?: string;
}>();

const emit = defineEmits([
  "update:password",
  "active-section-change",
  "show-warning",
  "fields-cleared"
]);

const router = useRouter();
const confirmPassword = ref("");
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const REGISTER = import.meta.env.VITE_BASE_REGISTER;
const REGISTER_ENDPOINT = BASE_URL + REGISTER;

const passwordsMatch = computed(() =>
  props.password !== "" && confirmPassword.value !== "" && props.password === confirmPassword.value
);

async function handleSignUp() {
  console.log("handleSignUp called");
  if (!passwordsMatch.value) {
    emit("show-warning", "Passwords do not match.");
    return;
  }
  try {
    const response = await axios.post(REGISTER_ENDPOINT, {
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      password: props.password,
      userName: props.userName,
    });
    emit('fields-cleared');
    router.push('/access/sign-in/');
  } catch (error) {
    console.error("Registration failed:", error);
    emit("show-warning", "Registration failed. Please try again.");
  }
}

function handlePasswordInput(val: string) {
  emit("update:password", val);
  if (props.warningMessage) emit("show-warning", "");
}

function handleConfirmPasswordInput(val: string) {
  confirmPassword.value = val;
  if (props.warningMessage) emit("show-warning", "");
}
</script>

<template>
  <div>
    <div class="mb-5">
      <PasswordInput :modelValue="props.password" label="Password" placeholder="Enter your password" class="mb-4"
        @update:modelValue="handlePasswordInput" />
      <PasswordInput :modelValue="confirmPassword" label="Confirm Password" placeholder="Enter your password again"
        @update:modelValue="handleConfirmPasswordInput" />
      <div v-if="confirmPassword && !passwordsMatch" class="text-red-500 text-xs mb-2">
        Passwords do not match.
      </div>
      <div v-if="props.warningMessage && passwordsMatch" class="text-red-500 text-xs mb-2">
        {{ props.warningMessage }}
      </div>
    </div>

    <div class="mb-5">
      <Button class="contained-primary contained-text w-full mb-4" :disabled="!passwordsMatch"
        @click="handleSignUp">Sign up</Button>
      <Button class="outlined-primary outlined-text w-full" @click="
        emit('active-section-change', {
          sectionName: 'personal-section',
          animationName: 'slide-right',
        })
        ">Back</Button>
    </div>
  </div>
</template>
