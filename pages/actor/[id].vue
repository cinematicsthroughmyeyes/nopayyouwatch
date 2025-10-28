<template>
<div>
    <v-main>

        <section v-if="personData">
            <v-toolbar title="Profile" color="orange-darken-4" :elevation="0" class="border-b-md"></v-toolbar>
            <div class="actor-image text-center pa-6 bg-orange-darken-3">
                <v-avatar :image="`https://image.tmdb.org/t/p/w500/${personData.profile_path}`" size="180"></v-avatar>
                <h1 class="text-h5 mt-2 font-weight-bold">{{ personData.name || 'Unknown' }}</h1>
                <p class="text-caption">{{ personData.place_of_birth || 'Unknown' }}</p>
                <p class="body-1 font-weight-bold">{{ personData.known_for_department || 'Unknown' }}</p>
                <!-- <pre>{{ personData }}</pre> -->
            </div>
        </section>

        <v-container v-if="personData" class="pt-0">

            <section id="filmography" class="mt-4">
                <v-row>
                    <v-col cols="12" md="6" xs="12">
                        <div class="border-md pa-3 rounded-lg bg-black">
                            <div class="py-2">
                                <h3 class="text-subtitle-1 text-right font-weight-bold" v-if="personData.gender === 1">Actoress <span class="font-italic">({{ actorCreditsNumber }})</span></h3>
                                <h3 class="text-subtitle-1 text-right font-weight-bold" v-else>Actor <span class="font-italic">({{ actorCreditsNumber }})</span></h3>
                            </div>

                            <v-list lines="two" theme="dark" height="400" v-if="actorCredits.length">
                                <v-list-item v-for="folder in actorCredits" :key="folder.title">
                                    <v-list-item-title>{{ folder.original_title || 'Not specified' }}</v-list-item-title>
                                    <v-list-item-subtitle class="mb-1 text-high-emphasis">{{ folder.character || 'Not specified' }}</v-list-item-subtitle>
                                    <v-list-item-subtitle class="text-high-emphasis">{{ folder.release_date }}</v-list-item-subtitle>
                                    <template v-slot:prepend>
                                        <v-avatar :image="`https://image.tmdb.org/t/p/w200/${folder.poster_path}`" v-if="folder.poster_path"></v-avatar>
                                        <v-avatar v-else>
                                            <v-icon icon="mdi-skull" size="large"></v-icon>
                                        </v-avatar>

                                    </template>

                                    <template v-slot:append>
                                        <v-btn color="grey-lighten-1" icon="mdi-information" variant="text" @click="openNaviDrawer(folder)"></v-btn>
                                    </template>
                                </v-list-item>

                            </v-list>
                            <div v-else>
                                <v-card height="400" theme="dark">
                                    <p class="text-center pa-3">No Data</p>
                                </v-card>

                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" xs="12">
                        <div class="border-md pa-3 rounded-lg bg-black">
                            <div class="py-2">
                                <h3 class="text-subtitle-1 text-right font-weight-bold">Other <span class="font-italic">({{ actorCastsNumber }})</span></h3>
                            </div>
                            <v-list lines="two" theme="dark" height="400" class="rounded-lg " v-if="actorCastCredits.length">
                                <v-list-item v-for="folder in actorCastCredits" :key="folder.title">
                                    <v-list-item-title>{{ folder.original_title || 'Not specified' }}</v-list-item-title>
                                    <v-list-item-subtitle class="mb-1 text-high-emphasis">{{ folder.job || 'Not specified' }}</v-list-item-subtitle>
                                    <v-list-item-subtitle class="text-high-emphasis">{{ folder.release_date }}</v-list-item-subtitle>
                                    <template v-slot:prepend>
                                        <v-avatar :image="`https://image.tmdb.org/t/p/w200/${folder.poster_path}`" v-if="folder.poster_path"></v-avatar>
                                        <v-avatar v-else>
                                            <v-icon icon="mdi-skull" size="large"></v-icon>
                                        </v-avatar>

                                    </template>

                                    <template v-slot:append>
                                        <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
                                    </template>
                                </v-list-item>

                            </v-list>
                            <div v-else>
                                <v-card height="400" theme="dark">
                                    <p class="text-center pa-3">No Data</p>
                                </v-card>

                            </div>
                        </div>

                    </v-col>
                </v-row>

                <!-- <pre>{{ actorCredits }}</pre> -->
            </section>

            <!-- <pre>{{ personData }}</pre> -->
        </v-container>
        <client-only>
            <v-navigation-drawer v-model="actorDrawer" temporary color="grey-darken-4" location="right" width="350" v-if="naviDrawerData">
                <v-card flat theme="dark">
                    <v-card-actions class="py-1">
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-close" @click="actorDrawer =false"></v-btn>
                    </v-card-actions>
                    <v-img :src="`https://image.tmdb.org/t/p/w400/${naviDrawerData.poster_path}`" height="300" color="black"></v-img>
                    <v-card-text>
                        <h3 class="text-subtitle-1 py-2 font-weight-bold text-orange-darken-4 text-truncate">{{ naviDrawerData.original_title }}</h3>
                        <div class="ml-2">
                            <p class="text-caption"><span class="font-weight-bold">Character:</span> {{ naviDrawerData.character }}</p>
                            <p class="text-caption"><span class="font-weight-bold">Release Date:</span> {{ naviDrawerData.release_date }}</p>
                        </div>

                        <div class="py-2 px-2 mt-3 bg-grey-darken-3 rounded-lg">
                            <p class="text-subtitle-2 font-weight-bold">Summary:</p>
                            <p class="text-caption">{{ naviDrawerData.overview.substring(0, 300) }}</p>
                        </div>

                    </v-card-text>
                </v-card>
            </v-navigation-drawer>
        </client-only>

    </v-main>
</div>
</template>

<script setup>
const params = useRoute().params
import {
    MovieDb
} from 'moviedb-promise'
const moviedb = new MovieDb('73ae87f4ead565385079a234d8d1e7a6')
const router = useRouter()
const personData = ref()
const actorCredits = ref([])
const actorCastCredits = ref([])
const actorCreditsNumber = ref(0)
const actorCastsNumber = ref(0)
const actorDrawer = ref(false)
const naviDrawerData = ref()
onMounted(() => {
    gettMovieVideos()
})
const gettMovieVideos = async () => {
    if (params.id) {
        const movieVideos = await moviedb.personInfo(`${params.id}`)
        //console.log(movieVideos)
        if (movieVideos) {
            personData.value = movieVideos
            getPersonMovieCredits()
        }
    }
}
const getPersonMovieCredits = async () => {
    //movieVideos
    const movieVideos = await moviedb.personMovieCredits(`${params.id}`)
    let arr = [],
        arrCast = [];
    // console.log(movieVideos)
    actorCreditsNumber.value = movieVideos.cast.length
    actorCastsNumber.value = movieVideos.crew.length
    for (let index = 0; index < movieVideos.cast.length; index++) {
        const element = movieVideos.cast[index];
        arr.push(element)
    }
    for (let index = 0; index < movieVideos.crew.length; index++) {
        const e2 = movieVideos.crew[index];
        arrCast.push(e2)
    }
    //actorCastCredits
    if (arr.length) {
        arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        actorCredits.value = arr
    }
    if (arrCast.length) {
        arrCast.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        actorCastCredits.value = arrCast
    }
}
const openNaviDrawer = async (data) => {
    //console.log(data)
    naviDrawerData.value = data
    actorDrawer.value = true
}
</script>
