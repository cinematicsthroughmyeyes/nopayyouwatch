<template>
<v-main class="bg-grey-darken-4">
    <div v-if="movieData">
        <v-img :src="`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`" aspect-ratio="16/9" min-height="550" max-height="550" cover>
            <v-card class="movie-header pa-3" :elevation="8">
                <div class="movie-insert pa-3" style="max-width: 1000px;">
                    <!-- <v-img :src="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`" height="200"></v-img> -->
                    <h1 class="text-h3 text-orange-darken-4 font-weight-bold text-truncate mb-2">{{ movieData.name }}</h1>
                    

                    <v-row class="py-4">
                        <div class="py-3 px-3">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-calendar-range" size="large" color="white" class="mr-1"></v-icon> <span class="mr-2">{{ movieData.first_air_date.substring(0,4) }}</span>
                                <v-icon icon="mdi-star" color="yellow" size="large" class="mr-1"></v-icon><span class="mr-2">{{ movieData.vote_average.toFixed(1) }}</span>
                            </p>
                        </div>
                        <!-- <v-col cols='4' md="2" sm="12">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-calendar-range" color="white" class="mr-2"></v-icon> {{ movieData.first_air_date.substring(0,4) }}
                            </p>
                        </v-col>
                        <v-col cols='4' md="2" sm="12">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-star" color="yellow" class="mr-2"></v-icon>{{ movieData.vote_average.toFixed(1) }}
                            </p>
                        </v-col> -->
                    </v-row>
                    <section class="mb-2">
                        <v-chip v-for="(mChip,mck) in movieData.genres" :key="mck" variant="flat" color="grey-darken-3" class="mr-1">
                            {{ mChip.name }}
                        </v-chip>
                    </section>
                    <div class="py-3">
                        <p class="text-body-2 text-white">{{ movieData.overview.substring(0, 200) }}</p>
                    </div>
                    
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

            <section class="bg-grey-darken-3 pa-3 rounded-lg mb-4 border-lg" v-if="movieData.networks">
                <p class="text-subtitle-1 font-weight-bold">Airs on:</p>
                <v-row>
                    <v-col cols="4" md="2" xs="4" v-for="(network,nk) in movieData.networks" :key="nk">
                        <span class="text-caption">{{ network.name }}</span>
                    </v-col>
                </v-row>

            </section>

            <section id="episodes" class="my-3 ">
                <div class="py-2">
                    <h3 class="text-h4 font-weight-bold ">Episodes</h3>
                </div>

                <v-row class="my-2">
                    <v-col cols="6" md="6" xs="6">
                        <v-select v-model="selectedSeason" label="Seasons" :items="seasonNumberArray" item-title="seasonNumber" item-value="1" return-object variant="outlined" @update:modelValue="handleSeasonChange"></v-select>
                    </v-col>
                    <v-col cols="6" md="6" xs="6">
                        <v-select label="Episode" :items="episodeNumberArray" item-title="episodeName" return-object variant="outlined" @update:modelValue="handleEpisodeChange"></v-select>
                    </v-col>
                </v-row>

                <div id="episodeGroup" v-if="episodeData">
                    <v-card theme="dark" flat height="400" id="epiCard">
                        <v-list lines="two">
                            <v-list-item v-for="(episodes, epikey) in episodeData.episodes" :key="episodes.id" :subtitle="episodes.overview || 'No description available for this episode.'" :title="`Episode ${epikey + 1} - ${episodes.name}`" @click="playEpisode(episodes.id, episodes.season_number, episodes.episode_number, episodes.crew)">
                                <template v-slot:prepend>
                                    <v-avatar color="grey-lighten-1" :image="`https://image.tmdb.org/t/p/w100_and_h100_bestv2/${episodes.still_path}`" v-if="episodes.still_path"></v-avatar>
                                    <v-avatar icon="mdi-skull" v-else></v-avatar>
                                </template>
                            </v-list-item>
                        </v-list>

                    </v-card>
                </div>
            </section>
            <section id="youMayLike" class="py-3">
                <div class="my-5">
                    <h4 class="text-h4 font-weight-bold">Popular Shows</h4>
                </div>
                
                <v-row v-if="popularShows.length">
                    <v-slide-group class="pa-1" selected-class="bg-success" show-arrows>
                            <v-slide-group-item v-for="(popular,popKey) in popularShows" :key="popKey" v-slot="{selectedClass }">
                                <nuxt-link :to="`/tv/${popular.id}/`">
                                    <v-card :class="['ma-4', selectedClass]" color="grey-lighten-1" height="270" width="210">
                                    <v-img :src="`https://image.tmdb.org/t/p/w300/${popular.poster_path}`" cover></v-img>
                                </v-card>
                                </nuxt-link>
                                
                            </v-slide-group-item>
                        </v-slide-group>

                </v-row>
                <v-card flat>

                </v-card>
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
    <client-only>
        <v-navigation-drawer v-model="toggleEpisodeInfo" temporary color="grey-darken-4" location="right" width="350" v-if="episodeDrawerInfo">
            <v-card flat theme="dark">
                <v-card-actions class="py-1">
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" @click="episodeDrawerInfo =false"></v-btn>
                </v-card-actions>
                <v-img :src="`https://image.tmdb.org/t/p/original/${episodeDrawerInfo.poster}`" height="300" color="black"></v-img>
                <v-card-text>
                    <h3 class="text-subtitle-1 py-2 font-weight-bold text-orange-darken-4 text-truncate">{{ episodeDrawerInfo.name }}</h3>
                    <div class="ml-2">
                        <p class="text-caption"><span class="font-weight-bold">Episode:</span> {{ episodeDrawerInfo.episodeNumber }}</p>
                        <p class="text-caption"><span class="font-weight-bold">Runtime:</span> {{ episodeDrawerInfo.runtime || "There's no runtime yet." }} <span v-if="episodeDrawerInfo.runtime">minutes</span></p>
                        <p class="text-caption"><span class="font-weight-bold">Air Date:</span> {{ episodeDrawerInfo.airDate }}</p>
                    </div>

                    <div class="py-2 px-2 mt-3 bg-grey-darken-3 rounded-lg">
                        <p class="text-subtitle-2 font-weight-bold">Summary:</p>
                        <p class="text-caption">{{ episodeDrawerInfo.overview.substring(0, 300) }}</p>
                    </div>
                    <div class="mt-3">
                        <v-btn block color="orange-darken-4" :loading="loaodingMovie" :disabled="loaodingMovie || episodeDrawerInfo.crew.length === 0" @click="playEpisode(episodeDrawerInfo.id, episodeDrawerInfo.seasonNumber, episodeDrawerInfo.episodeNumber, episodeDrawerInfo.crew)">play Episode</v-btn>
                    </div>

                </v-card-text>

            </v-card>
        </v-navigation-drawer>
    </client-only>

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
const toggleEpisodeInfo = ref(false)
const errorPlayingEpisode = ref(false)
const episodeDrawerInfo = ref()
const popularShows = ref([])
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
const handleSeasonChange = async (el) => {
    searchForEpisodes(el.seasonNumber)
}
const handleEpisodeChange = async (el) => {
    //console.log(el)
    episodeDrawerInfo.value = el
    toggleEpisodeInfo.value = true
}
const gettIMDBData = async () => {
    const res = await $fetch(imdbInfo.value, {
        method: 'GET'
    })
    if (res) {
        //console.log(res)
        return imdbData.value = res
    }

}
const playEpisode = (id, season, episode, crew) => {
    loaodingMovie.value = true
    ///embed/tv/{tmdbId}/{season}/{episode}
    if (crew.length) {
        iframsrc.value = `https://www.vidking.net/embed/tv/${params.id}/${season}/${episode}?autoPlay=true&color=e65100&episodeSelector=true&nextEpisode=true`
        setTimeout(() => {
            movieDialog.value = true
            loaodingMovie.value = false
        }, 1000)
    } else {
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
                //console.log(el)
                episodeNumberArray.value.push({
                    episodeNumber: el.episode_number,
                    id: el.id,
                    episodeName: el.name,
                    seasonNumber: el.season_number,
                    airDate: el.air_date,
                    name: el.name,
                    poster: el.still_path,
                    voteAverage: el.vote_average,
                    overview: el.overview,
                    crew: el.crew,
                    runtime: el.runtime
                })
            }
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
            console.log(el)
            seasonNumberArray.value.push({
                seasonNumber: el.season_number,
                episodeCount: el.episode_count,
                id: el.id
            })

        }

        searchForEpisodes('1')
        getTvSimilars()
        return getSeasonsData.value = datad
    }

}
const getTvSimilars = async () => {
    const datad = await moviedb.tvPopular()

    if (datad) {
        let arr = []
        for (let index = 0; index < datad.results.length; index++) {
            const pop = datad.results[index];

            if (pop.original_language === 'en' && pop.poster_path && pop.id != params.id) {
                arr.push(pop)
            }
        }
        if (arr.length) {
            arr.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
            popularShows.value = arr
        }

    }
    //console.log(datad)
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

#epiCard {
    overflow-y: scroll;
}

#playButtonDrawer {
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>
