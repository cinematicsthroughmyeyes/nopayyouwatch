<template>
<v-main class="bg-grey-darken-4">
    <div v-if="movieData">
        <v-parallax :src="`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`" aspect-ratio="16/9" min-height="550" max-height="550" cover>
            <v-card class="movie-header pa-3" :elevation="8">
                <div class="movie-insert pa-3">
                    <!-- <v-avatar :image="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`" height="200"></v-avatar> -->
                    <h1 class="text-h3 text-orange-darken-4 font-weight-bold text-truncate mb-2"> {{ movieData.title }}</h1>
                    <v-row class="py-4">
                        <div class="py-3 px-3">
                            <p class="text-body-2 text-white mx-0">
                                <v-icon icon="mdi-calendar-range" size="large" color="white" class="mr-1"></v-icon> <span class="mr-2">{{ movieData.release_date.substring(0,4) }}</span>
                                <v-icon icon="mdi-clock-outline" color="white" size="large" class="mr-1"></v-icon><span class="mr-2">{{ movieData.runtime }} minutes</span>
                                <v-icon icon="mdi-star" color="yellow" size="large" class="mr-1"></v-icon><span class="mr-2">{{ movieData.vote_average.toFixed(1) }}</span>
                            </p>
                        </div>
                    </v-row>
                    <section class="mb-3">
                        <v-chip v-for="(mChip,mck) in movieData.genres" :key="mck" variant="flat" color="grey-darken-3" class="mr-1">
                            {{ mChip.name }}
                        </v-chip>
                    </section>
                    <div class="py-3">
                        <p class="text-body-2 text-white">{{ movieData.overview.substring(0,200) }}</p>
                    </div>
                    <section id="play-button" class="my-2">

                        <v-btn color="orange-darken-4" class="text-white rounded-lg mr-2" :loading="loaodingMovie" v-if="movieData.runtime !== 0" :disabled="loaodingMovie" @click="playMovie(movieData.id, movieData)">
                            <v-icon icon="mdi-play" class="text-white" color="black"></v-icon> Play
                        </v-btn>
                        <v-btn color="orange-darken-4" class="text-white rounded-lg mr-2" v-else :disabled="true">
                            Movie Not Available
                        </v-btn>
                        <ActionsWatchlist :data="movieData" />
                        <!-- <v-fab color="grey-lighten-1" icon="mdi-plus" size="small" ></v-fab> -->
                        <v-fab color="grey-lighten-1" icon="mdi-group" mr-2 size="small" class="mr-2" @click="collectionSheet = true" v-if="collectionData"></v-fab>
                    </section>
                </div>

            </v-card>
        </v-parallax>
        <v-container class="mt-5">
            <v-row>
                <v-col cols="6" md="10" xs="6" class="py-0">
                    <h3 class="text-h5">Trailers</h3>
                </v-col>
                <v-col cols="6" md="2" xs="6" v-if="trailerVideos.length > 1" class="py-0">
                    <p class="text-right mt-1 text-decoration-underline">See More</p>
                </v-col>
            </v-row>

            <v-row v-if="trailerVideos.length > 0">
                <v-col cols="12" md="4" xs="12" v-for=" (yt,ytk) in trailerVideos" :key="ytk">
                    <v-card class="rounded-lg" v-if="ytk < 3">
                        <LiteYouTubeEmbed :id="yt.key" :title="yt.name" />
                    </v-card>
                </v-col>
            </v-row>
            <div v-else>
                <v-container>
                    <p class="text-subtitle-2">There are no trailers for this movie.</p>
                </v-container>

            </div>
        </v-container>
        <v-container>
            <h3 class="text-h5 my-3">Cast</h3>
            <section id="cast" v-if="imdbData">
                <v-row v-if="imdbData.stars.length > 0">
                    <v-col cols="6" md="3" xs="6" v-for="(i, ik) in imdbData.stars" :key="ik">
                        <v-card flat class="rounded-lg bg-orange-darken-4" @click="searchPerson(i.displayName)">
                            <div v-if="i.primaryImage">
                                <v-img :src="i.primaryImage.url" height="200" cover position="top" v-if="i.primaryImage.url"></v-img>
                            </div>
                            <v-card-text>
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
                            <v-card flat class="rounded-lg bg-orange-darken-4">
                                <v-card-text>
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
        </v-container>
    </div>
    <div v-else>
        <h1>loading...</h1>
    </div>
    <!-- <PlayerDialogPlayer :movieDialogData="movieDialogData" :imdbData="imdbData"/> -->
    <v-dialog v-model="movieDialog" transition="dialog-bottom-transition" fullscreen theme="dark">

        <v-card flat max-height="400" style="overflow-y: scroll; position: relative;">

            <div class="bg-black" style="position: sticky; top: 0; left: 0; width: 100%; z-index: 100;">
                <v-card-actions class="bg-black py-1">
                    <v-spacer></v-spacer>

                    <v-btn icon="mdi-close" size="sm" @click="closeMovieDialog"></v-btn>
                </v-card-actions>
                <div id="videoPlayer">
                        <iframe :src="iframsrc" width="100%" :height="$vuetify.display.mobile ? '240': '440'" frameborder="0" allowfullscreen> </iframe>
                    </div>
            </div>

            <div class="bg-black">
                <v-container>
                    <div class="py-3" @click="show = !show">
                        <v-row>
                            <v-col cols="10" md="10" sm="10">
                                <h2 class="text-h4 font-weight-bold text-orange-darken-4 text-truncate">{{ movieDialogData.title }}</h2>
                                <p class="text-body-2 py-1 text-truncate">{{ movieDialogData.tagline }}</p>
                            </v-col>
                            <v-col cols="2" md="2" class="text-right" sm="2">
                                <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"></v-btn>
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
                        <v-btn icon="mdi-information-outline" size="small" @click="infoDialog = !infoDialog"></v-btn>
                    </v-btn-toggle>
                    <!-- <div class="">
                        <v-avatar :image="`https://image.tmdb.org/t/p/w200/${movieDialogData.poster_path}`"></v-avatar> {{ movieDialogData.runtime }} minutes
                    </div> -->
                    <v-expand-transition>
                        <div v-show="show" class="pa-2 ">
                            <v-row class="bg-grey-darken-4 ">
                                <v-col cols="6" md="2" xs="2" class="py-4">
                                    <v-img :src="`https://image.tmdb.org/t/p/w200/${movieDialogData.poster_path}`" min-height="150" class="bg-black rounded-lg"></v-img>
                                </v-col>
                                <v-col cols="6" md="9" sm="9" class="pl-0">
                                    <div class="">
                                        <p class="text-caption py-3 rounded-lg">{{ movieDialogData.overview.substring(0, 200) }}</p>
                                        <v-chip v-for="(cm,cmk) in movieDialogData.genres" :key="cmk" density="compact" variant="flat" color="orange-darken-4" class="mr-1 mb-2">{{ cm.name }}</v-chip>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-expand-transition>
                </v-container>
                <v-container class="mt-3 px-5 ">
                    <h4 class="text-body-1 pb-4 text-orange-darken-4  font-weight-bold">Cast</h4>
                    <v-row class="text-center">
                        <v-col cols="3" md="2" sm="2" xs="2" v-for="(castDia,cadk) in imdbData.stars" :key="cadk">
                            <!-- {{ castDia }} -->
                            <v-card v-if="castDia.primaryImage" flat class="bg-black">
                                <v-avatar :image="castDia.primaryImage.url" size="80"></v-avatar>
                                <p class="text-caption py-2">{{ castDia.displayName }}</p>
                            </v-card>

                        </v-col>
                    </v-row>
                </v-container>
                <v-divider class="mt-2"></v-divider>
                <v-container class="mt-3">
                    <h4 class="text-body-1 pb-4 text-orange-darken-4 font-weight-bold">Director(s)</h4>
                    <v-row class="text-center">
                        <v-col cols="3" md="2" sm="2" xs="2" v-for="(castDir,cadr) in imdbData.directors" :key="cadr">
                            <!-- {{ castDia }} -->
                            <v-card v-if="castDir.primaryImage" flat class="bg-black">
                                <v-avatar :image="castDir.primaryImage.url" size="80"></v-avatar>
                                <p class="text-caption py-2">{{ castDir.displayName }}</p>
                            </v-card>

                        </v-col>
                    </v-row>
                </v-container>
                <v-divider class="mt-2"></v-divider>
            </div>
        </v-card>
    </v-dialog>
    <v-dialog width="400" v-model="infoDialog">
        <v-card theme="dark" class="rounded-lg">
            <v-card-actions class="py-1">
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="infoDialog = !infoDialog" variant="text"></v-btn>
            </v-card-actions>
            <v-container class="pt-0">
                <h4 class="text-h5 py-3 text-orange-darken-4 font-weight-bold">Information</h4>
                <div class="px-2">
                    <p class="text-body-2 py-1"><span class="font-weight-bold">Runtime :</span> {{ movieDialogData.runtime }} minutes</p>
                <p class="text-body-2 py-1"><span class="font-weight-bold">Budget:</span> ${{ movieDialogData.budget.toLocaleString() }}</p>
                <p class="text-body-2 py-1"><span class="font-weight-bold">Revenue:</span> ${{ movieDialogData.revenue.toLocaleString() }}</p>
                </div>
                <div class="pa-2 mt-2 rounded-lg" :class="movieDialogData.budget *2 <= movieDialogData.revenue ? 'bg-green' : 'bg-red'">
                    <p class="text-caption" v-if="movieDialogData.budget * 2 <= movieDialogData.revenue">Revenue beat the budget! Hooray!</p>
                    <p class="text-caption" v-else>Revenue did not beat the budget! That sucks!</p>
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
const infoDialog = ref(false)
const movieDialogData = ref()
const show = ref(false)
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
            if (movie.belongs_to_collection) {
                const collection = await moviedb.collectionInfo({
                    id: movie.belongs_to_collection.id
                })
                collectionData.value = collection
            }

            useHead({
                title: `${movie.title} | No Pay. You Watch.`,
                meta: [{
                    name: 'description',
                    content: `Everything about ${movie.title}`
                }, ],
            })
            imdbInfo.value = `https://api.imdbapi.dev/titles/${movie.imdb_id}`
            // searchPerson()
            gettIMDBData()
            console.log(movie)
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
        if (r.official && r.type === 'Trailer') {
            trailerVideos.value.push(r)
        }
    }
}

//personMovieCredits
const playMovie = (id, data) => {
    loaodingMovie.value = true
    iframsrc.value = ``
    iframsrc.value = `https://www.vidking.net/embed/movie/${id}?color=e65100&autoPlay=true`
    console.log(data)
    movieDialogData.value = data
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
const closeMovieDialog = () => {
    iframsrc.value = ''
    movieDialog.value = false
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

#videoPlayer {
    min-height: 240px;
    max-height: 450px;
}
</style>
