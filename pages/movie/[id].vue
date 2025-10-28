<template>
<v-main class="bg-grey-darken-4">
    <div v-if="movieData">
        <v-img :src="`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`" aspect-ratio="16/9" min-height="550" max-height="550" cover>
            <v-card class="movie-header pa-3" :elevation="8">
                <div class="movie-insert pa-3">
                    <!-- <v-avatar :image="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`" height="200"></v-avatar> -->
                    <h1 class="text-h4 text-orange-darken-4 font-weight-bold text-truncate mb-2">{{ movieData.title }}</h1>
                    <p class="text-body-2 text-white">{{ movieData.tagline }}</p>

                    <v-row class="py-4">
                        <v-col cols='4' md="1" sm="12">
                            <p class="text-caption text-white mx-0">
                                <v-icon icon="mdi-calendar-range" color="orange" class="mr-2"></v-icon> {{ movieData.release_date }}
                            </p>
                        </v-col>
                        <v-col cols='4' md="1" sm="12">
                            <p class="text-caption text-white mx-0">
                                <v-icon icon="mdi-clock-outline" color="orange" class="mr-2"></v-icon>{{ movieData.runtime }} minutes
                            </p>
                        </v-col>
                        <v-col cols='3' md="1" sm="12">
                            <p class="text-caption text-white mx-0">
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
        <v-container class="mt-5">
            <v-row>
                <v-col cols="6" md="10" xs="6" class="py-0">
                    <h3 class="text-h5">Trailers</h3>
                </v-col>
                <v-col cols="6" md="2" xs="6" v-if="trailerVideos.length > 1" class="py-0">
                    <p class="text-right mt-1 text-decoration-underline">See More</p>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col cols="12" md="4" xs="12" v-for=" (yt,ytk) in trailerVideos" :key="ytk" >
                    <v-card class="rounded-lg" v-if="ytk < 3">
                        <LiteYouTubeEmbed
                        :id="yt.key"
                        :title="yt.name"
                    />
                    </v-card>
                    <!-- {{ yt }} -->
                    
                </v-col>
            </v-row>
            <!-- {{ trailerVideos }}
            <LiteYouTubeEmbed
    id="dQw4w9WgXcQ"
    title="Rick Astley - Never Gonna Give You Up (Official Music Video)"
  /> -->
        </v-container>
        <v-container>
            <h3 class="text-h5 my-3">Cast</h3>

            <section id="cast" v-if="imdbData">
                <v-row>
                    <v-col cols="6" md="3" xs="6" v-for="(i, ik) in imdbData.stars" :key="ik">
                        <!-- {{ i}} -->
                        <v-card flat class="rounded-lg bg-orange-darken-4" @click="searchPerson(i.displayName)">
                            <v-img :src="i.primaryImage.url" height="200" cover position="top"></v-img>
                            <v-card-text>
                                <!-- {{ i }} -->
                                <p class="text-body-2 text-truncate">{{ i.displayName }}</p>
                                <!-- <v-chip v-for=" (chip,ck) in i.primaryProfessions" :key="ck" size="x-small">
                                {{ chip }}
                            </v-chip> -->
                            </v-card-text>

                        </v-card>
                    </v-col>
                </v-row>
            </section>
            <div class="my-4">
                <h3 class="text-subtitle-1 my-3">Director(s)</h3>
                <section id="cast" v-if="imdbData" class="my-2">
                    <v-row>
                        <v-col cols="6" md="3" xs="6" v-for="(di, idk) in imdbData.directors" :key="idk">
                            <!-- {{ i}} -->
                            <v-card flat class="rounded-lg bg-orange-darken-4">
                                <v-card-text>
                                    <!-- {{ i }} -->
                                    <p class="text-body-2 text-truncate">{{ di.displayName }}</p>
                                    <!-- <v-chip v-for=" (chip,ck) in i.primaryProfessions" :key="ck" size="x-small">
                                {{ chip }}
                            </v-chip> -->
                                </v-card-text>

                            </v-card>
                        </v-col>
                    </v-row>
                </section>
            </div>
            <div class="my-4">
                <h3 class="text-subtitle-1 my-3">Writer(s)</h3>
                <section id="cast" v-if="imdbData" class="my-2">
                    <v-row>
                        <v-col cols="6" md="3" xs="6" v-for="(wi, widk) in imdbData.writers" :key="widk">
                            <v-card flat class="rounded-lg bg-orange-darken-4">
                                <v-card-text>
                                    <p class="text-body-2 text-truncate">{{ wi.displayName }}</p>
                                    <!-- <v-chip v-for=" (chip,ck) in i.primaryProfessions" :key="ck" size="x-small">
                                {{ chip }}
                            </v-chip> -->
                                </v-card-text>

                            </v-card>
                        </v-col>
                    </v-row>
                </section>
            </div>
            <!-- {{ movieData }} -->
        </v-container>
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
            <iframe :src="iframsrc" width="100%" height="600" frameborder="0" allowfullscreen > </iframe>
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
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'
import 'vue-lite-youtube-embed/style.css'
const movieData = ref()
const movieDialog = ref(false)
const iframsrc = ref('')
const loaodingMovie = ref(false)
const imdbInfo = ref('')
const imdbData = ref(null)
const collectionSheet = ref(false)
const collectionData = ref()
const trailerVideos = ref([])
const router = useRouter()
onMounted(() => {
    testcall(params.id)
    gettMovieVideos()
})
const testcall = async (id) => {
    if (id) {
        try {
            const movie = await moviedb
                .movieInfo({
                    id
                })
                if(movie.belongs_to_collection){
                    const collection = await moviedb.collectionInfo({
                        id: movie.belongs_to_collection.id
                    })
                    collectionData.value = collection
                }
            
            useHead({
                title: `${movie.title} | No Pay. You Watch.`,
                meta: [{
                    name: 'description',
                    content: `EVerything about kanoee`
                }, ],
            })
            imdbInfo.value = `https://api.imdbapi.dev/titles/${movie.imdb_id}`
            // searchPerson()
            gettIMDBData()
            // console.log(movie)
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
const gettMovieVideos = async () => {
    //personInfo('10297')
    //movieVideos
    const moreVideos = await moviedb.movieVideos(params.id)
    //console.log(movieVideos)
    for (let index = 0; index < moreVideos.results.length; index++) {
        const r = moreVideos.results[index];
        console.log(r)
        if(r.official && r.type === 'Trailer'){
            trailerVideos.value.push(r)
        }
    }
}

//personMovieCredits
const playMovie = (id) => {
    loaodingMovie.value = true
    iframsrc.value = `https://www.vidking.net/embed/movie/${id}?color=e65100&autoPlay=true`
    setTimeout(() => {
        movieDialog.value = true
        loaodingMovie.value = false
    }, 1000)

}
const searchPerson = async (person) => {
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
