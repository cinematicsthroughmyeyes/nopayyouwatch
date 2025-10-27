<template>
<v-main class="bg-grey-darken-4">
    <div v-if="movieData">
        <v-img :src="`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`" aspect-ratio="16/9" min-height="550" max-height="550" cover>
            <v-card class="movie-header pa-3" :elevation="8">
                <div class="movie-insert pa-3">
                    <!-- <v-avatar :image="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`" height="200"></v-avatar> -->
                    <h1 class="text-h4 text-orange-darken-4 font-weight-bold text-truncate mb-2">{{ movieData.name }}</h1>
                    <p class="text-body-2 text-white">{{ movieData.overview }}</p>

                    <v-row class="py-4">
                        <v-col cols='4' md="1" sm="12">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-calendar-range" color="orange" class="mr-2"></v-icon> {{ movieData.first_air_date }}
                            </p>
                        </v-col>
                        <v-col cols='4' md="1" sm="12">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-star" color="yellow" class="mr-2"></v-icon>{{ movieData.vote_average.toFixed(1) }}
                            </p>
                        </v-col>
                    </v-row>
                    <section class="mb-3">
                        <v-chip v-for="(mChip,mck) in movieData.genres" :key="mck" variant="outlined" color="orange-darken-4" class="mr-1">
                            {{ mChip.name }}
                        </v-chip>
                    </section>
                    <section id="play-button" class="my-2">
                        <v-btn color="orange-darken-4" class="text-white rounded-lg mr-2" :loading="loaodingMovie" :disabled="loaodingMovie" @click="playMovie(movieData.id)">
                            <v-icon icon="mdi-play" class="text-white" color="black"></v-icon> Play
                        </v-btn>
                        <v-btn class="text-white  mr-2" color="grey-darken-2" variant="outlined" @click="collectionSheet = true" v-if="collectionData">
                            <v-icon icon="mdi-group" class="text-white" color="black"></v-icon>
                        </v-btn>
                    </section>
                </div>

            </v-card>
        </v-img>
    </div>
    <div v-else>
        <h1>loading...</h1>
    </div>
    <v-dialog v-model="movieDialog" transition="dialog-bottom-transition" fullscreen theme="dark">

        <v-card flat>
            <v-card-actions class="bg-black">
                <v-spacer></v-spacer>

                <v-btn icon="mdi-close" @click="movieDialog = false"></v-btn>
            </v-card-actions>
            <iframe :src="iframsrc" width="100%" height="600" frameborder="0" allowfullscreen> </iframe>
        </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="collectionSheet" v-if="collectionData">

        <v-card theme="dark">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="collectionSheet = false"></v-btn>
            </v-card-actions>
            <v-card-text>
                <h4 class="text-h5">{{collectionData.name}}</h4>
            </v-card-text>
            <!-- <pre>{{ collectionData }}</pre> -->
            <v-list lines="two">
                <v-list-item v-for="collect in collectionData.parts" :key="collect.title" :subtitle="collect.overview" :title="collect.title" :to="`/movie/${ collect.id }`">
                    <template v-slot:prepend>
                        <v-avatar color="grey-lighten-1" :image="`https://image.tmdb.org/t/p/w100_and_h100_bestv2/${collect.poster_path}`">
                        </v-avatar>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>
    </v-bottom-sheet>
</v-main>
</template>

<script setup>
const params = useRoute().params
import {
    MovieDb
} from 'moviedb-promise'
const moviedb = new MovieDb('73ae87f4ead565385079a234d8d1e7a6')
const movieData = ref()
const movieDialog = ref(false)
const iframsrc = ref('')
const loaodingMovie = ref(false)
const imdbInfo = ref('')
const imdbData = ref(null)
const collectionSheet = ref(false)
const collectionData = ref()
const router = useRouter()
onMounted(() => {
    testcall(params.id)
})
const testcall = async (id) => {
    console.log(id)
    if (id) {
        try {
            const movie = await moviedb
                .tvInfo({
                    id
                })
                if(movie.belongs_to_collection){
                    const collection = await moviedb.collectionInfo({
                        id: movie.belongs_to_collection.id
                    })
                    collectionData.value = collection
                }
            
            useHead({
                title: `${movie.name} | No Pay. You Watch.`,
                meta: [{
                    name: 'description',
                    content: `EVerything about kanoee`
                }, ],
            })
            // console.log(movie)
            if(movie.imdb_id){
                imdbInfo.value = `https://api.imdbapi.dev/titles/${movie.imdb_id}`
                gettIMDBData()
            }
            return movieData.value = movie

        } catch (error) {
            console.log(error)
        }
    }

}
const gettIMDBData = async () => {
    const res = await $fetch(imdbInfo.value, {
        method: 'GET'
    })
    if (res) {
        console.log(res)
        return imdbData.value = res
    }

}
const playMovie = (id) => {
    loaodingMovie.value = true
    ///embed/tv/{tmdbId}/{season}/{episode}
    iframsrc.value = `https://www.vidking.net/embed/tv/${id}/1/1?color=e65100&autoPlay=true`
    setTimeout(() => {
        movieDialog.value = true
        loaodingMovie.value = false
    }, 1000)

}
const searchPerson = async (person) => {
    console.log(person)
    if (person) {
        const personData = await moviedb.searchPerson(person)
        return router.push({
            path: `/actor/${personData.results[0].id}/`
        })
    }

}
</script>

<style scoped>
.movie-header {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    background: rgba(0, 0, 0, .5)
}

.movie-insert {
    width: 100%;
}
</style>
