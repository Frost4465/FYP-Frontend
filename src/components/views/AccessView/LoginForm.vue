<script setup lang="ts">
import { ref } from "vue";

import Button from "@src/components/ui/inputs/Button.vue";
import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";
import { useRouter, RouterLink } from "vue-router";
import axios from "axios";


const router = useRouter();
const loading = ref(false);
const email = ref("");
const password = ref("");

const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;
const LOGIN = import.meta.env.VITE_BASE_LOGIN;
const LOGIN_ENDPOINT = BASE_URL + LOGIN;

const login = async () => {
  loading.value = true;
  try {
    const response = await axios.post(LOGIN_ENDPOINT, {
      email: email.value,
      password: password.value,
    })
    console.log(response)
    localStorage.setItem('token', response.data)

    router.push('/chat/no-chat/')
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <div class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center">
    <div class="w-full md:px-[26%] xs:px-[10%]">
      <!--header-->
      <div class="mb-6 flex flex-col">
        <img src="@src/assets/vectors/BIGCATTO.png" class="w-5.5 h-4.5 mb-4 opacity-70" alt="bird logo" />
        <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
          Welcome back
        </p>
        <p class="body-3 text-black/75 dark:text-white/70 font-light">
          Create an account a start messaging now!
        </p>
      </div>

      <form @submit.prevent="login">
        <div class="mb-6">
          <LabeledTextInput label="Email" placeholder="Enter your email" class="mb-5" v-model="email"/>
          <PasswordInput v-model="password" label="Password" placeholder="Enter your password" />
        </div>

        <!--local controls-->
        <div class="mb-6">
          <Button class="contained-primary contained-text w-full mb-4" :loading="loading">Sign in</Button>
        </div>
      </form>

      <!--divider-->
      <div class="mb-6 flex items-center">
        <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
        <p class="body-3 text-black/75 dark:text-white/70 px-4 font-light">
          or
        </p>
        <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
      </div>

      <!--oauth controls-->
      <div>
        <!--bottom text-->
        <div class="flex justify-center">
          <p class="body-2 text-black/70 dark:text-white/70">
            Don’t have an account?
            <RouterLink to="/access/sign-up/" class="text-indigo-400 opacity-100">
              Sign up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
