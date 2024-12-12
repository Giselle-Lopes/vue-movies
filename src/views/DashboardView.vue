<script setup lang="ts">
    import Navbar from '@/components/Navbar.vue';
    import Carousel from '@/components/Carousel.vue';
    import { ref, computed, watch, type Ref } from 'vue';

    import axios from 'axios';
    import { onMounted } from 'vue';
    import type { Movie } from '@/types/movie';

    const movies: Ref<Movie[]> = ref([]);
    const tranding: Ref<Movie[]> = ref([]);
    const isLoading = ref(true);
    const selectedMovieId: Ref<number | null> = ref(null);
    const selectedSearchMovie: Ref<Movie | null> = ref(null);


    const selectedMovie = computed((): Movie | undefined => 
        movies.value.find(movie => movie.id === selectedMovieId.value)
    );

    const closeSelectedMovie = () => {
        selectedSearchMovie.value = null;
    }

    const showModalDiv = (movieId: number) => {
        selectedMovieId.value = movieId;
        document.body.classList.add('overflow-hidden');
    };

    const closeModalDiv = () => {
        selectedMovieId.value = null;
        document.body.classList.remove('overflow-hidden');
    };

    const fetchMovies = async (): Promise<void> => {
        try {
            const response = await axios.get<{ results: Movie[] }>('https://api.themoviedb.org/3/discover/movie', {
                params: {
                    api_key: import.meta.env.VITE_API_URL,
                    language: 'pt_BR'
                }
            });
            movies.value = response.data.results;

            for (const movie of movies.value) {
                movie.trailerKey = await movieTrailer(movie.id);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTrending = async (): Promise<void> => {
        try {
            const response = await axios.get<{ results: Movie[] }>('https://api.themoviedb.org/3/trending/all/day', {
                params: {
                    api_key: import.meta.env.VITE_API_URL,
                    language: 'pt_BR'
                }
            });
            tranding.value = response.data.results;

            for (const movie of tranding.value) {
                movie.trailerKey = await movieTrailer(movie.id);
            }
        } catch (error) {
            console.error('Error fetching trending:', error);
        }
    };

    const movieTrailer = async (movieId: number): Promise<string | null> => {
        try {
            const response = await axios.get<{
                videos: {
                    results: Array<{
                        type: string;
                        site: string;
                        key: string;
                    }>
                }
            }>(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: {
                    api_key: import.meta.env.VITE_API_URL,
                    append_to_response: 'videos',
                    language: 'pt_BR'
                }
            });
            
            const trailer = response.data.videos.results.find(
                video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return trailer ? trailer.key : null;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    };

    const getImageUrl = (path: string, size: string = 'w500'): string => {
        return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    const trandingTrailers = computed(() => {
        return tranding.value || [];
    })


    const trandingPosters = computed((): string[] => {
        if(!tranding.value) return [];
        return tranding.value.map(movie => 
            movie.poster_path ? getImageUrl(movie.poster_path) : ''
        ).filter(url => url !== '');
    })

    const trandingOverview = computed((): string[] => {
        if (!tranding.value) return [];
        return tranding.value.map(movie => movie.overview || '');
    })

    const trandingInfo = computed((): (string | number | null)[][] => {
        if (!tranding.value) return [];
        return tranding.value.map(movie => [
            movie.original_language || '',
            movie.title || movie.name || '',
            movie.release_date || movie.first_air_date || '',
            movie.vote_average || 0
        ]);
    });

    const handleMovieSelected = async (movieId: number): Promise<void> => {
        try {
            const response = await axios.get<Movie>(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: {
                    api_key: import.meta.env.VITE_API_URL,
                    language: 'pt_BR'
                }
            });
            const movie = response.data;
            movie.trailerKey = await movieTrailer(movie.id);
            selectedSearchMovie.value = movie;
        } catch (error) {
            console.error('Error fetching individual movie:', error);
        }
    };

    onMounted(() => {
        fetchMovies();
        fetchTrending();
    });
</script>

<template>
    <div class="dark:bg-black min-h-screen overflow-hidden">
        <Navbar @movie-selected="handleMovieSelected" />
        <div v-if="isLoading" class="text-white text-center py-10 flex flex-col justify-center items-center w-full h-full mt-[10%] gap-5">
            <p class="font-mono text-2xl text-black dark:text-white">Loading...</p>
            <img src="/src/assets/icons/movieRoll.svg" alt="Movie roll" class="rounded-full w-40">
        </div>
        <div v-else class="container mx-auto px-4">
            <div v-if="selectedSearchMovie" class="bg-[#F2B33D] dark:bg-[#40011E] p-6 rounded-lg my-8 flex flex-col justify-center items-center">
                <i class="pi pi-times cursor-pointer absolute right-8 top-28 z-10 hover:bg-gray-900 rounded-2xl p-2" style="color: white;" @click.stop="closeSelectedMovie()"></i>
                <h2 class="dark:text-white text-2xl font-semibold mb-4 z-10 font-mono">{{ selectedSearchMovie.title }}</h2>
                <div class="absolute w-full h-96 p-4 top-20 rounded-lg blur-md">
                    <img 
                        v-if="selectedSearchMovie.poster_path"
                        :src="getImageUrl(selectedSearchMovie.poster_path)"
                        :alt="selectedSearchMovie.title"
                        class="w-full h-full"
                    > 
                </div>
                <div class="flex flex-col gap-20 justify-center items-center">
                    <img 
                        v-if="selectedSearchMovie.poster_path"
                        :src="getImageUrl(selectedSearchMovie.poster_path)"
                        :alt="selectedSearchMovie.title"
                        class="w-64 h-auto rounded-lg z-10"
                    >
                    <div class="flex flex-row gap-24">
                        <div class="flex flex-col w-[400px] gap-4">
                            <p class="dark:text-white"><span class="font-bold">Language:</span> {{ selectedSearchMovie.original_language }}</p>
                            <p class="dark:text-white"><span class="font-bold">Release Date:</span> {{ selectedSearchMovie.release_date }}</p>
                            <p class="dark:text-white">{{ selectedSearchMovie.overview }}</p>
                        </div>
                        <iframe
                            v-if="selectedSearchMovie.trailerKey"
                            width="560"
                            height="315"
                            :src="`https://www.youtube.com/embed/${selectedSearchMovie.trailerKey}`"
                            frameborder="0"
                            allow="autoplay; encrypted-media"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
            <div v-if="!selectedSearchMovie" class="w-full my-8">
                <Carousel
                    v-if="trandingPosters.length > 0"
                    :cards="trandingPosters"
                    :overviews="trandingOverview"
                    :information="trandingInfo"
                    :trailers="trandingTrailers.map(movie => movie.trailerKey || '')"
                />
            </div>
            <div v-if="!selectedSearchMovie" class="container mx-auto px-4 py-8">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div @click="showModalDiv(movie.id)" v-for="movie in movies" :key="movie.id" class="bg-[#F2B33D] dark:bg-[#40011E] rounded-lg overflow-hidden cursor-pointer">
                        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" class="w-full h-auto">
                        <div class="p-4">
                            <h2 class="dark:text-white text-lg font-semibold">{{ movie.title || movie.name }}</h2>
                        </div>
                        <div class="bg-[#F2B33D] dark:bg-[#40011E] fixed top-[15%] left-[18%] w-[1000px] h-[500px] z-50 cursor-default" :class="selectedMovieId === movie.id ? 'flex' : 'hidden'">
                            <i class="pi pi-times cursor-pointer absolute left-3 top-3 hover:bg-gray-900 rounded-2xl p-2" style="color: white;" @click.stop="closeModalDiv"></i>
                            <div class="flex flex-row justify-center items-center gap-28">
                                <div class="w-56 ml-8 gap-4 flex flex-col">
                                    <p class="dark:text-white text-center font-semibold font-mono">{{ selectedMovie?.title }}</p>
                                    <p class="dark:text-white font-mono">Language: {{ selectedMovie?.original_language }}</p>
                                    <p class="dark:text-white font-mono">Release date: {{ selectedMovie?.release_date }}</p>
                                    <p class="dark:text-white text-justify w-72 font-mono">{{ selectedMovie?.overview }}</p>
                                </div>
                                <div name="footer">
                                    <iframe
                                        width="200%"
                                        height="400" 
                                        :src="`https://www.youtube.com/embed/${selectedMovie?.trailerKey}`" 
                                        frameborder="0"
                                        allow="encrypted-media"
                                        allowfullscreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="fixed inset-0 bg-black bg-opacity-50 backgrop-blur-sm transition-opacity duration-300 ease-in-out cursor-default" :class="selectedMovieId === movie.id ? 'opacity-100 visible z-40' : 'opacity-0 invisible'"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>