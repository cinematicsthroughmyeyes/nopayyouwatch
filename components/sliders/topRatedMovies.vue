<template>
    <v-container v-if="topRatedMoviesArr" class="my-1">
        <v-row>
            <v-col cols="12" md="12" xs="12">
                <h3 class="text-h5 font-weight-bold text-orange-darken-4">Top Rated Movies</h3>
                <v-slide-group class="pa-1" selected-class="bg-success" show-arrows>
                    <v-slide-group-item v-for="(pn,pk) in topRatedMoviesArr" :key="pk" v-slot="{selectedClass }">
                        <nuxt-link :to="`/movie/${pn.id}`">
                            <v-card :class="['ma-4', selectedClass]" color="grey-lighten-1" height="270" width="210">
                            <v-img :src="`https://image.tmdb.org/t/p/w300/${pn.poster_path}`" cover></v-img>
                        </v-card>
                        </nuxt-link>
                        
                    </v-slide-group-item>
                </v-slide-group>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
    import {
        MovieDb
    } from 'moviedb-promise'
    const moviedb = new MovieDb('73ae87f4ead565385079a234d8d1e7a6')
    const topRatedMoviesArr = ref([])
    onMounted(() => {
        topRatedMovies()
    })
    const topRatedMovies = async () => {
    const topRated = await moviedb.movieTopRated({
        language: 'en-US'
    })
    for (let index = 0; index < 20; index++) {
        const element = topRated.results[index];
        if (element.poster_path) {
            topRatedMoviesArr.value.push(element)
        }

    }
}
</script>