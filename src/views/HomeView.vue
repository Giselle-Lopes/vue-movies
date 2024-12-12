<script setup lang="ts">
  import Scene from '@/components/Scene.vue';
  import { useDark, useToggle } from '@vueuse/core';

  const isDark = useDark();
  const toggleDark = useToggle(isDark);
</script>

<template>
  
  <div class="flex flex-row overflow-hidden">
    <div @click="toggleDark()" class="bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] w-14 h-7 flex items-center px-1 rounded-2xl transition-all duration-300 cursor-pointer mr-5 absolute right-0 top-5" :class="isDark ? 'justify-start' : 'justify-end'">
      <div class="bg-primaryPink dark:bg-primaryDarkPurple h-5 w-5 rounded-xl flex justify-center items-center cursor-pointer">
      </div>
    </div>
    <div class="w-[50%] h-screen cursor-pointer">
        <Scene/>
    </div>
    <div class="flex flex-col justify-center items-center w-[50%] dark:bg-black border-solid border-8 dark:border-primaryYellow border-primaryPink gap-10">
        <h1 class="dark:text-primaryYellow text-primaryPink font-mono text-6xl italic font-semibold">Vue Movies</h1>
        <a href="/dashboard" class="dark:text-primaryYellow text-primaryPink border-solid border-4 dark:border-primaryYellow border-primaryPink px-4 py-2 rounded-full font-mono dark:hover:text-primaryPink hover:text-primaryYellow dark:hover:border-primaryPink hover:border-primaryYellow hover:shadow-lg dark:hover:shadow-pink-400 hover:shadow-yellow-200">Explore!</a>
    </div>
  </div>
</template>