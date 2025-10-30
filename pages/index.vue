<template>
<div>
    <v-main class="">
        <!-- <div class="py-5">
            <h1 class="text-h4 font-weight-bold">No Pay. You Watch.</h1>
        </div> -->

        <v-card class="pa-8 d-flex justify-center bg-orange-darken-2 flex-wrap" min-height="400">
            <v-container class="text-center">
                <h1 class="text-h2 text-xs-h6 text-md-h2 text-white font-weight-black my-4">No Pay. You Watch.</h1>
                <v-row justify="center" dense>
                    <v-col cols="12">
                        <v-autocomplete label="Type in movie or TV show name..." auto-select-first rounded :items="searchedMovies" return-object item-title="original_title" theme="dark" variant="solo" v-model:search-input="searchMovies" :key="searchedMovies.id" @update:search="onInput" v-model="selectedMovie" prepend-inner-icon="mdi-magnify" menu-icon="" :hide-no-data="true" :loading="loadingMovie">

                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :prepend-avatar="`https://image.tmdb.org/t/p/w100_and_h100_bestv2/${item.raw.poster_path}`" :subtitle="item.raw.release_date" :title="item.raw.original_title"></v-list-item>
                            </template>
                        </v-autocomplete>
                        <p class="text-caption ">This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.</p>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <client-only>
            <SlidersTrending/>
            <SlidersPopularMovies/>
            <SlidersTopRatedMovies/>
        </client-only>
        

    </v-main>

</div>
</template>

<script setup>
import {
    MovieDb
} from 'moviedb-promise'
// const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('73ae87f4ead565385079a234d8d1e7a6')

const search = ref()
const loadingMovie = ref(false)
const searchedMovies = ref([])
const selectedMovie = ref(null)
const router = useRouter()
onMounted(() => {
    testcall()
    //gettWeeklyTrending()
    
})
useHead({
    title: `No Pay. You Watch.`,
    meta: [{
        name: 'description',
        content: `Browse movies and Tv shows`
    }, ],
})
const testcall = async (movieString) => {
    if (movieString) {
        let englishMovies = []
        try {
            const movie = await moviedb
                .searchMulti({
                    query: movieString,
                    include_adult: true,
                    region: 'NA',
                    language: 'en-US'
                })
            movie.results.forEach(element => {
                if (element.original_language === 'en' && element.backdrop_path && element.release_date != '') {
                    console.log(element)
                    if (element.name) {
                        element.original_title = element.name
                    }
                    englishMovies.push(element)
                }
            });

            return searchedMovies.value = englishMovies
        } catch (error) {
            console.log(error)
        }
    }

}
const onInput = val => {
    if (!val) return false
    if (val.length > 1) {
        testcall(val.toLowerCase())
    }
    if (selectedMovie.value) {
        if (selectedMovie.value.media_type === 'tv') {
            return router.push({
                path: `/tv/${selectedMovie.value.id}/`
            })
        } else {
            return router.push({
                path: `/movie/${selectedMovie.value.id}/`
            })
        }

    }
    //router.push({ path: `/movie/${selectedMovie.value.id}/`})
    // Do Fetching Data Here
    // val is search value
}
const searchMovies = val => {
    console.log(val)
}
</script>
