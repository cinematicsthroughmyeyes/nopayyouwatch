<template>
    <v-container v-if="tvSimilarArr.length" class="my-1">
        <v-row>
            <v-col cols="12" md="12" xs="12">
                <h3 class="text-h5 font-weight-bold text-orange-darken-4">Similar Shows</h3>
                <v-slide-group class="pa-1" selected-class="bg-success" show-arrows>
                    <v-slide-group-item v-for="(tvsim,tvk) in tvSimilarArr" :key="tvk" v-slot="{selectedClass }">
                        <nuxt-link :to="`/tv/${tvsim.id}`">
                            <v-card :class="['ma-4', selectedClass]" color="grey-lighten-1" height="270" width="210">
                            <v-img :src="`https://image.tmdb.org/t/p/w300/${tvsim.poster_path}`" cover></v-img>
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
    const tvSimilarArr = ref([])
    const tvProps = defineProps({
        tvID: Number,
        required: true
    })

    onMounted(() => {
        tvSimilar()
    })
    const tvSimilar = async () => {
        const tvSimCall = await moviedb.tvSimilar(tvProps.tvID)
        for (let index = 0; index < 20; index++) {
            const element = tvSimCall.results[index];
            if (element.poster_path) {
                tvSimilarArr.value.push(element)
            }

        }
    }
    //console.log(tvProps)
</script>