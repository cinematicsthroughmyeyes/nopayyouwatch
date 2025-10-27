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
                        <v-col cols='5' md="1" sm="12">
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
                        <v-btn color="orange-darken-4" class="text-white rounded-lg mr-2" :loading="loaodingMovie" :disabled="loaodingMovie" @click="playEpisode( 1,1, 1, ['1'])">
                            <v-icon icon="mdi-play" class="text-white" color="black"></v-icon> Play S1 Epi: 1
                        </v-btn>
                        <v-btn class="text-white  mr-2" color="grey-darken-2" variant="outlined" @click="collectionSheet = true" v-if="collectionData">
                            <v-icon icon="mdi-group" class="text-white" color="black"></v-icon>
                        </v-btn>
                    </section>
                </div>

            </v-card>
        </v-img>
        <v-container>
            <section id="episodes">

                <h3 class="text-h4 font-weight-bold">Episodes</h3>
                <v-row class="my-2">
                    <v-col cols="6" md="6" xs="6">
                        <v-select v-model="selectedSeason" label="Seasons" :items="seasonNumberArray" item-title="seasonNumber" item-value="1" return-object variant="outlined"></v-select>
                    </v-col>
                    <v-col cols="6" md="6" xs="6">
                        <v-select label="Episode" :items="episodeNumberArray" item-title="episodeName" return-object variant="outlined"></v-select>
                    </v-col>
                </v-row>

                <div id="episodeGroup" v-if="episodeData">
                    <v-card theme="dark" flat>
                        <v-list lines="two">
                            <v-list-item v-for="(episodes, epikey) in episodeData.episodes" :key="episodes.id" :subtitle="episodes.overview || 'No description available for this episode.'" :title="`Episode ${epikey + 1} - ${episodes.name}`" @click="playEpisode(episodes.id, episodes.season_number, episodes.episode_number, episodes.crew)">
                                <template v-slot:prepend>
                                    <v-avatar color="grey-lighten-1" :image="`https://image.tmdb.org/t/p/w100_and_h100_bestv2/${episodes.still_path}`">
                                        
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </v-list>

                    </v-card>
                </div>
            </section>
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
    <v-bottom-sheet v-model="errorPlayingEpisode">

        <v-card theme="dark">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="errorPlayingEpisode = false"></v-btn>
            </v-card-actions>
            <v-card-text>
                <h4 class="text-h6 font-weight-bold text-red">Error Playing Episode</h4>
                <p class="body-1">This episode hasn't aired yet. Please wait until the air date. If it's the release date please give it 12 to 24 hours to update.</p>
            </v-card-text>
            
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
const episodeData = ref()
const getSeasonsData = ref()
const seasonNumberArray = ref([])
const episodeNumberArray = ref([])
const selectedSeason = ref({
    seasonNumber: 1
})
const errorPlayingEpisode = ref(false)
onMounted(() => {
    testcall(params.id)
})
const testcall = async (id) => {
    if (id) {
        try {
            const movie = await moviedb
                .tvInfo({
                    id
                })
            if (movie.belongs_to_collection) {
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
            //console.log(movie)
            getSeasons()
            if (movie.imdb_id) {
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
const playEpisode = (id,season,episode,crew) => {
    loaodingMovie.value = true
    ///embed/tv/{tmdbId}/{season}/{episode}
    if(crew.length){
        iframsrc.value = `https://www.vidking.net/embed/tv/${params.id}/${season}/${episode}?autoPlay=true&color=e65100&episodeSelector=true&nextEpisode=true`
        setTimeout(() => {
            movieDialog.value = true
            loaodingMovie.value = false
        }, 1000)
    }else{
        errorPlayingEpisode.value = true
        loaodingMovie.value = false
    }
    

}
const searchForEpisodes = async (seasonNumber) => {
    if (params.id) {
        let url = `https://api.themoviedb.org/3/tv/${params.id}/season/${seasonNumber}?api_key=73ae87f4ead565385079a234d8d1e7a6`
        const res = await $fetch(url, {
            method: 'GET'
        })

        if (res) {
            //console.log(res)
            episodeNumberArray.value = []
            for (let e = 0; e < res.episodes.length; e++) {
                const el = res.episodes[e];
                episodeNumberArray.value.push({
                    episodeNumber: el.episode_number,
                    id: el.episode_number,
                    episodeName: el.name
                })
            }
            console.log(res)
            return episodeData.value = res
        }
    }

}
const getSeasons = async () => {
    // console.log(person)
    if (params.id) {
        const datad = await moviedb.tvInfo({
            id: params.id
        })
        for (let s = 0; s < datad.seasons.length; s++) {
            const el = datad.seasons[s];
            //console.log(el)
            if (s != 0) {
                seasonNumberArray.value.push({
                    seasonNumber: el.season_number,
                    episodeCount: el.episode_count,
                    id: el.id
                })
            }

        }
        searchForEpisodes('1')
        return getSeasonsData.value = datad
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
