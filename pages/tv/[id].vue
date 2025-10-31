<template>
<v-main class="bg-grey-darken-4">
    <div v-if="movieData">
        <v-parallax :src="`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`" aspect-ratio="16/9" min-height="550" max-height="550" cover>
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
                        <v-btn color="orange-darken-4" class="text-white rounded-lg mr-2" :loading="loaodingMovie" :disabled="loaodingMovie" @click="playEpisode( 1,1, 1, movieData.created_by, movieData)">
                            <v-icon icon="mdi-play" class="text-white" color="black"></v-icon> Play S1 Epi: 1
                        </v-btn>
                        <ActionsWatchlist :data="movieData"/>
                        <v-btn class="text-white  mr-2" color="grey-darken-2" variant="outlined" @click="collectionSheet = true" v-if="collectionData">
                            <v-icon icon="mdi-group" class="text-white" color="black"></v-icon>
                        </v-btn>
                    </section>
                </div>

            </v-card>
        </v-parallax>
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
                            <v-list-item v-for="(episodes, epikey) in episodeData.episodes" :key="episodes.id" :subtitle="episodes.overview || 'No description available for this episode.'" :title="`Episode ${epikey + 1} - ${episodes.name}`" @click="playEpisode(episodes.id, episodes.season_number, episodes.episode_number, episodes.crew,episodes)">
                                <template v-slot:prepend>
                                    <v-avatar color="grey-lighten-1" :image="`https://image.tmdb.org/t/p/w100_and_h100_bestv2/${episodes.still_path}`" v-if="episodes.still_path"></v-avatar>
                                    <v-avatar icon="mdi-skull" v-else></v-avatar>
                                </template>
                            </v-list-item>
                        </v-list>

                    </v-card>
                </div>
            </section>
            <v-container class="mt-3 px-5" v-if="movieData.created_by.length > 0">
                    <h4 class="text-body-1 pb-4 text-orange-darken-4  font-weight-bold">Created By</h4>
                    <v-row class="text-center">
                        <v-col cols="4" md="2" sm="3" xs="3" v-for="(tvhome,cbh) in movieData.created_by" :key="cbh">
                            <v-card flat class="bg-grey-darken-4" v-if="tvhome.profile_path">
                                <v-avatar :image="`https://image.tmdb.org/t/p/w200/${tvhome.profile_path}`" size="80"></v-avatar>
                                <p class="text-caption py-2">{{ tvhome.name }}</p>
                            </v-card>
                            <v-card v-else>
                                <p class="text-caption py-2">{{ tvhome.name }}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            <section id="youMayLike" class="py-3">
                <!-- <SlidersPopularMovies/> -->
                <SlidersTvSimilar :tvID="movieData.id"/>
            </section>
        </v-container>
        
    </div>
    <div v-else>
        <h1>loading...</h1>
    </div>
    <v-dialog v-model="movieDialog" transition="dialog-bottom-transition" fullscreen theme="dark">

        <v-card flat max-height="400" style="overflow-y: scroll; position: relative;">
            <div class="bg-black" style="position: sticky; top: 0; left: 0; width: 100%; z-index: 100;">
                <v-card-actions class="bg-black py-1">
                    <v-spacer></v-spacer>

                    <v-btn icon="mdi-close" size="sm" @click="movieDialog = false"></v-btn>
                </v-card-actions>
                <div id="videoPlayer">
                    <iframe :src="iframsrc" width="100%" :height="$vuetify.display.mobile ? '240': '440'" frameborder="0" allowfullscreen> </iframe>
                </div>
            </div>
            <div class="bg-black">
                <v-container>
                    <div class="py-3" @click="showTV = !showTV">
                        <v-row v-if="tvDialogData.season_number">
                            <v-col cols="10" md="10" sm="10">
                                <h2 class="text-h4 font-weight-bold text-orange-darken-4 text-truncate">{{ tvDialogData.name }}</h2>
                                <p class="text-body-2 py-1 text-truncate">Season: {{tvDialogData.season_number}} - Episode:{{ tvDialogData.episode_number }}</p>
                            </v-col>
                            <v-col cols="2" md="2" class="text-right" sm="2">
                                <v-btn :icon="showTV ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"></v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="10" md="10" sm="10">
                                <h2 class="text-h4 font-weight-bold text-orange-darken-4 text-truncate">{{ episodeData.episodes[0].name }}</h2>
                                <p class="text-body-2 py-1 text-truncate">Season: {{episodeData.episodes[0].season_number}} - Episode:{{ episodeData.episodes[0].episode_number }}</p>
                            </v-col>
                            <v-col cols="2" md="2" class="text-right" sm="2">
                                <v-btn :icon="showTV ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"></v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <v-btn-toggle rounded="lg" border divided class="mb-3 bg-black" color="black">
                        <v-btn value="right" color="black">
                            <!-- <span class="hidden-sm-and-down">Left</span> -->
                            <span>0</span>
                            <v-icon end>
                                mdi-thumb-up-outline
                            </v-icon>
                        </v-btn>
                        <v-btn icon="mdi-thumb-down-outline" size="small"></v-btn>
                        <v-btn icon="mdi-information-outline" size="small" @click="infoDialogTV = true"></v-btn>
                    </v-btn-toggle>
                    <v-expand-transition>
                        <div v-show="showTV" class="pa-2 ">
                            <v-row class="bg-grey-darken-4 ">
                                <v-col cols="6" md="2" xs="2" class="py-4">
                                    <!-- {{ tvDialogData }} -->
                                    <v-img :src="`https://image.tmdb.org/t/p/w200/${tvDialogData.poster_path}`" min-height="150" class="bg-black rounded-lg" v-if="tvDialogData.poster_path"></v-img>
                                    <v-img :src="`https://image.tmdb.org/t/p/w200/${tvDialogData.still_path}`" min-height="150" class="bg-black rounded-lg" v-else></v-img>

                                </v-col>
                                <v-col cols="6" md="9" sm="9" class="pl-0">
                                    <div class="">
                                        <p class="text-caption py-3 rounded-lg">{{ tvDialogData.overview.substring(0, 200) }}</p>
                                        <v-chip v-for="(cm,cmk) in tvDialogData.genres" :key="cmk" density="compact" variant="flat" color="orange-darken-4" class="mr-1 mb-2">{{ cm.name }}</v-chip>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-expand-transition>
                    <v-divider class="mt-2"></v-divider>
                </v-container>
                <v-container class="mt-3 px-5" v-if="tvDialogData.crew">
                    <h4 class="text-body-1 pb-4 text-orange-darken-4  font-weight-bold">Crew</h4>
                    <v-row class="text-center">
                        <v-col cols="3" md="2" sm="3" xs="3" v-for="(tvcreateby,cb) in tvDialogData.crew" :key="cb">
                            <v-card flat class="bg-black" v-if="tvcreateby.profile_path">
                                <v-avatar :image="`https://image.tmdb.org/t/p/w200/${tvcreateby.profile_path}`" size="80"></v-avatar>
                                <p class="text-caption py-2">{{ tvcreateby.name }}</p>
                            </v-card>
                            <v-card v-else class="bg-black">
                                <p class="text-caption py-2">{{ tvcreateby.name }}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2"></v-divider>
                </v-container>
                <v-container class="mt-3 px-5" v-else>
                    <h4 class="text-body-1 pb-4 text-orange-darken-4  font-weight-bold">Created By</h4>
                    <v-row class="text-center">
                        <v-col cols="3" md="2" sm="3" xs="3" v-for="(tvcreateby,cb) in tvDialogData.created_by" :key="cb">
                            <v-card flat class="bg-black" v-if="tvcreateby.profile_path">
                                <v-avatar :image="`https://image.tmdb.org/t/p/w200/${tvcreateby.profile_path}`" size="80"></v-avatar>
                                <p class="text-caption py-2">{{ tvcreateby.name }}</p>
                            </v-card>
                            <v-card v-else class="bg-black">
                                <p class="text-caption py-2">{{ tvcreateby.name }}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2"></v-divider>
                </v-container>
                <SlidersTvSimilar :tvID="movieData.id"/>
                
            </div>
        </v-card>
    </v-dialog>
    <v-dialog width="400" v-model="infoDialogTV">
        <v-card theme="dark" class="rounded-lg">
            <v-card-actions class="py-1">
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="infoDialogTV = !infoDialogTV" variant="text"></v-btn>
            </v-card-actions>
            <v-container class="pt-0">
                <h4 class="text-h5 py-3 text-orange-darken-4 font-weight-bold">Information</h4>
                <div class="px-2">
                    <p class="text-body-2 py-1"><span class="font-weight-bold">Number of Season(s) :</span> {{ movieData.number_of_seasons }}</p>
                    <p class="text-body-2 py-1"><span class="font-weight-bold">Season 1 aired:</span> {{ movieData.first_air_date }}</p>
                <p class="text-body-2 py-1"><span class="font-weight-bold">Status:</span> {{ movieData.status }}</p>
                <p class="text-body-2 py-1"><span class="font-weight-bold">Type:</span> {{ movieData.type }}</p>
                </div>
                <div id="productionCompanies" v-if="movieData.production_companies" class="ml-2">
                    <h5 class="text-subtitle-1 text-orange-darken-4 font-weight-bold">Production Companies</h5>
                    <p class="text-caption ml-2" v-for=" (pct,pkt) in movieData.production_companies" :key="pkt">{{ pct.name }}</p>
                </div>
            </v-container>
            
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
const showTV = ref(false)
const tvDialogData = ref()
const infoDialogTV = ref(false)
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
const playEpisode = (id, season, episode, crew,data) => {
    loaodingMovie.value = true
    ///embed/tv/{tmdbId}/{season}/{episode}
    console.log(data)
    tvDialogData.value = data
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
