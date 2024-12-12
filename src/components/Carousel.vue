<script setup lang="ts">
    import { ref, watch, computed } from 'vue';

    interface CarouselProps {
        cards: string[];
        overviews: string[];
        information: (string | number | null)[][];
        trailers: string[];
    }

    const props = defineProps<CarouselProps>();
    const currentIndex = ref(0);
    const containerRef = ref<HTMLElement | null>(null);
    const activeSection = ref('info');

    const totalSlides = computed(() => props.cards.length);

    const next = () => {
        currentIndex.value = (currentIndex.value + 1) % totalSlides.value;
    };

    const prev = () => {
        currentIndex.value = currentIndex.value === 0
         ? totalSlides.value - 1
         : currentIndex.value - 1;
    };

    function showSection(section: any) {
        activeSection.value = activeSection.value === section ? null : section;
    }

    const slideIndicators = computed(() => {
        return Array.from({ length: totalSlides.value }, (_, i) => i);
    });

    const goToSlide = (index: number) => {
        if (index !== currentIndex.value && index >= 0 && index < totalSlides.value) {
            currentIndex.value = index;
        }
    };

    const translateX = computed(() => {
        return `translateX(-${currentIndex.value * 100}%)`;
    });

    watch(() => props.cards, () => {
        currentIndex.value = 0;
    }, { deep: true });

    const getYoutubeEmbedUrl = (trailerKey: string) => {
    return `https://www.youtube.com/embed/${trailerKey}`;
};
</script>

<template>
    <div class="relative w-full h-[80vh] overflow-hidden dark:bg-black">
        <div ref="containerRef" class="flex h-full transition-transform duration-300 ease-in-out" :style="{ transform: translateX }">
            <div v-for="(card, index) in cards" :key="index" class="flex-shrink-0 w-full h-full flex flex-col items-center justify-center rounded-lg dark:bg-[#40011E] bg-[#F2B33D]">
                <div class="absolute top-4">
                    <div class="flex flex-row gap-12">
                        <div v-on:click="showSection('info')" class="dark:text-white cursor-pointer dark:hover:bg-[#7D5266] hover:bg-[#b88a35] py-1 px-2 rounded-lg">Information</div>
                        <div v-on:click="showSection('trailer')" class="dark:text-white cursor-pointer dark:hover:bg-[#7D5266] hover:bg-[#b88a35] py-1 px-2 rounded-lg">Trailer</div>
                    </div>
                </div>
                <div class="w-full h-full mt-5">
                    <img :src="card" alt="Movie poster" class="h-[530px] ml-3 mb-5 rounded-lg" />
                </div>
                <div class="w-96 absolute gap-5 flex flex-col" v-show="activeSection === 'info'">
                    <p class="dark:text-white font-mono"><span class="underline">Name:</span> {{ information[index][1] }}</p>
                    <p class="dark:text-white font-mono"><span class="underline">Release date:</span> {{ information[index][2] }}</p>
                    <p class="dark:text-white font-mono"><span class="underline">Language:</span> {{ information[index][0] }}</p>
                    <p class="dark:text-white font-mono text-justify">{{ overviews[index] }}</p>
                </div>
                <div class="w-96 absolute" v-show="activeSection === 'trailer'">
                    <iframe 
                        v-if="props.trailers[currentIndex]"
                        width="200%"
                        height="400"
                        :src="getYoutubeEmbedUrl(props.trailers[currentIndex])" 
                        frameborder="0"
                        allow="encrypted-media"
                        allowfullscreen
                    ></iframe>
                    <p v-else class="dark:text-white">No trailer available</p>
                </div>
            </div>
        </div>
        <button @click="prev" class="absolute top-1/2 left-4 transform -translate-y-1/2 dark:bg-black bg-white bg-opacity-50 dark:text-white p-4 rounded-full hover:bg-opacity-75 transition-colors duration-300">
            &lt;
        </button>
        <button @click="next" class="absolute top-1/2 right-4 transform -translate-y-1/2 dark:bg-black bg-white bg-opacity-50 dark:text-white p-4 rounded-full hover:bg-opacity-75 transition-colors duration-300">
            &gt;
        </button>
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
                v-for="index in slideIndicators"
                :key="index"
                @click="goToSlide(index)"
                class="w-2 h-2 rounded-full transition-colors duration-300"
                :class="index === currentIndex ? 'bg-white' : 'bg-gray-400'"
            ></button>
        </div>
    </div>
</template>