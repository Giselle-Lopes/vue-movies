<script setup lang="ts">
    import { type Movie } from '@/types/movie';
    import axios from 'axios';
    import { ref, watch } from 'vue';
    import { useDark, useToggle } from '@vueuse/core';

    const inputAction = ref(false);
    const isLoading = ref(true);
    const searchText = ref("");
    const searchResults = ref<Movie[]>([]);
    const selectedMovie = ref<number | null>(null);
    
    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    const emit = defineEmits<{
        (e: 'movieSelected', movieId: number): void
    }>();

    const selectedMovieId = (movieId: number): void => {
        selectedMovie.value = movieId;
        emit('movieSelected', movieId);
        inputAction.value = false;
        searchText.value = "";
    }

    const searchMovies = async (): Promise<void> => {
        if (!searchText.value.trim()) return;
        isLoading.value = true;

        try {
            const response = await axios.get<{ results: Movie[] }>('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: import.meta.env.VITE_API_URL,
                    query: searchText.value,
                    language: 'pt_BR'
                }
            });
            searchResults.value = response.data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            searchResults.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    let searchTimeout: number;

    watch(searchText, () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchMovies();
        }, 500);
    });

    const openInput = (): void => {
        inputAction.value = !inputAction.value;
        if (!inputAction.value) {
            searchText.value = "";
            searchResults.value = [];
        }
    };
</script>

<template>
    <div class="dark:bg-primaryDarkYellow bg-primaryPink h-16 flex flex-row items-center justify-between">
        <a href="/">
            <img src="../assets/icons/logo.svg" alt="VueMovies icon, the letter V designed with a movie roll tape as part of the letter" class="h-16 w-16 ml-2">
        </a>
        <div class="flex flex-row justify-center items-center">
            <div>
                <i v-on:click="openInput()" class="pi pi-search absolute top-6 transition-all duration-600 text-primaryDarkPurple cursor-pointer" :class="{'right-[108px]': !inputAction, 'right-[331px]': inputAction}"></i>
                <input 
                    type="text" 
                    class="h-8 mr-5 rounded-full transition-all duration-600 pl-8" 
                    :class="{'w-64': inputAction, 'w-8': !inputAction}"
                    v-model="searchText"
                />
            </div>
            <div v-if="searchResults.length && inputAction" class="absolute top-16 right-24 w-64 bg-white shadow-lg rounded-lg mt-2 max-h-96 overflow-y-auto z-[999]">
                <div @click="selectedMovieId(movie.id)" v-for="movie in searchResults" :key="movie.id" class="p-2 hover:bg-gray-100 cursor-pointer">
                    {{ movie.title }}
                </div>
            </div>
            <div @click="toggleDark()" class="bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] w-[60px] h-8 flex items-center px-1 rounded-2xl transition-all duration-300 cursor-pointer mr-5" :class="isDark ? 'justify-start' : 'justify-end'">
                <div class="bg-primaryPink dark:bg-primaryDarkPurple h-6 w-6 rounded-xl flex justify-center items-center cursor-pointer">
                    <i class="pi pi-lightbulb" style="color: white"></i>
                </div>
            </div>
        </div>
    </div>
</template>