<script setup lang="ts">
import { computed, ref } from "vue";

import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import PasswordSection from "@src/components/views/AccessView/RegisterForm/PasswordSection.vue";
import PersonalSection from "@src/components/views/AccessView/RegisterForm/PersonalSection.vue";
import { RouterLink } from "vue-router";

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('')
const warningMessage = ref('');
const activeSectionName = ref('personal-section');
const animation = ref('slide-left');

const ActiveSection = computed(() => {
  if (activeSectionName.value === 'personal-section') {
    return PersonalSection;
  } else if (activeSectionName.value === 'password-section') {
    return PasswordSection;
  }
});

const changeActiveSection = (event: { sectionName: string; animationName: string }) => {
  if (event.sectionName === 'password-section') {
    if (!email.value || !firstName.value || !lastName.value) {
      warningMessage.value = 'Please fill in all the fields before proceeding.';
      return;
    }
  }

  warningMessage.value = '';

  animation.value = event.animationName;
  activeSectionName.value = event.sectionName;
};

const showWarning = (message: string) => {
  warningMessage.value = message;
};
const clearFields = () => {
  email.value = '';
  firstName.value = '';
  lastName.value = '';
  password.value = '';
};

</script>

<template>
  <div class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center">
    <div class="w-full md:px-[26%] xs:px-[10%]">

      <div class="mb-6 flex flex-col">
        <img src="@src/assets/vectors/BIGCATTO.png" class="w-5.5 h-4.5 mb-5 opacity-70" />
        <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
          Get started with ZuChat
        </p>
        <p class="body-3 text-black/75 dark:text-white/70 font-light">
          Sign in to start using messaging!
        </p>
      </div>

      <SlideTransition :animation="animation">
        <component @active-section-change="changeActiveSection" 
        @show-warning="showWarning" 
        @fields-cleared="clearFields"
        :is="ActiveSection"
          v-model:email="email" v-model:firstName="firstName" v-model:lastName="lastName" v-model:password="password"
          :warningMessage="warningMessage" />
      </SlideTransition>

      <div class="flex justify-center">
        <p class="body-2 text-black/70 dark:text-white/70">
          Already have an account?
          <RouterLink to="/access/sign-in/" class="text-indigo-400 opacity-100">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
