<template>
<v-container v-if="weeklyTrendingArr" class="my-2">
    <v-row>
        <v-col cols="12" md="12" xs="12">
            <h3 class="text-h5 font-weight-bold text-orange-darken-4">Trending</h3>
            <v-slide-group class="pa-1" selected-class="bg-success" show-arrows>
                <v-slide-group-item v-for="(w,wk) in weeklyTrendingArr" :key="wk" v-slot="{selectedClass }">
                    <nuxt-link :to="w.media_type === 'movie' ? `/movie/${w.id}/` : `/tv/${w.id}/`">
                        <v-card :class="['ma-4', selectedClass]" color="grey-lighten-1" height="270" width="210">
                            <v-img :src="`https://image.tmdb.org/t/p/w300/${w.poster_path}`" cover></v-img>
                        </v-card>
                    </nuxt-link>

                </v-slide-group-item>
            </v-slide-group>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup>
const weeklyTrendingArr = ref([])

onMounted(() => {
    gettWeeklyTrending()
})
const gettWeeklyTrending = async () => {
    const url = 'https://api.themoviedb.org/3/trending/all/week?language=en-US';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3M2FlODdmNGVhZDU2NTM4NTA3OWEyMzRkOGQxZTdhNiIsIm5iZiI6MTc2MTQ0MDQyNS40NzMsInN1YiI6IjY4ZmQ3MmE5ZGNhYTQ1NWNmMDlmYWMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uZ8upwOQF1kB3MI8MoQui18cWmqFIOmEpynUM88JBQI'
        }
    };
    const res = await $fetch(url, options)
    if (res) {
        for (let index = 0; index < 20; index++) {
            const element = res.results[index];
            if (element.poster_path != '') {
                weeklyTrendingArr.value.push(element)
            }

        }
    }

}
</script>
