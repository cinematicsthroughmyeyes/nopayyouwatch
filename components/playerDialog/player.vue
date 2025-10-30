<template>
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
                    <v-toolbar :title="movieDialogData.original_title" density="compact" color="grey-darken-4" :elevation="4" class="border-b-md" @click="show = !show">
                <template v-slot:append>
        <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" ></v-btn>
      </template>
            </v-toolbar>
            </div>
            
            <v-expand-transition>
                <div v-show="show" class="pa-2 ">
                    <v-row class="bg-grey-darken-4 ">
                        <v-col cols="6" md="2" xs="2" class="py-4">
                            <v-img :src="`https://image.tmdb.org/t/p/w200/${movieDialogData.poster_path}`" min-height="150" class="bg-black rounded-lg"></v-img>
                        </v-col>
                        <v-col cols="6" md="9" sm="9" class="pl-0">
                            <div class="">
                         <p class="text-body-2 py-3 rounded-lg">{{ movieDialogData.overview.substring(0, 200) }}</p>
                          <v-chip v-for="(cm,cmk) in movieDialogData.genres" :key="cmk" density="compact" variant="flat" color="orange-darken-4" class="mr-1 mb-2">{{ cm.name }}</v-chip>
                    </div>
                        </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
            <div class="bg-black">
                <v-container class="mt-3 px-5 ">
                <h4 class="text-body-1 pb-4 text-orange-darken-4  font-weight-bold">Cast</h4>
                <v-row class="text-center">
                <v-col cols="3" md="2" sm="2" xs="2" v-for="(castDia,cadk) in imdbData.stars" :key="cadk">
                    <!-- {{ castDia }} -->
                      <v-card v-if="castDia.primaryImage" flat class="bg-black">
                            <v-avatar :image="castDia.primaryImage.url" size="80" ></v-avatar>
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
                            <v-avatar :image="castDir.primaryImage.url" size="80" ></v-avatar>
                            <p class="text-caption py-2">{{ castDir.displayName }}</p>
                      </v-card>
                    
                </v-col>
            </v-row>
            </v-container>
            <v-divider class="mt-2"></v-divider>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup>
const movieDialog = ref(false)
const iframsrc = ref('')
    const props =  defineProps({
        movieDialogData: Object,
        imdbData: Object

    })
</script>
<style scoped>
    #videoPlayer{
    min-height: 240px;
    max-height: 450px;
}
</style>