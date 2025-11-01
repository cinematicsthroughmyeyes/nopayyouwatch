<template>
    <v-main>
        <v-container v-if="folderStore.folderCount > 0">
            <h1 class="text-h4 font-weight-bold py-3"> <v-icon icon="mdi-folder-home" size="sm"></v-icon> My Folder</h1>
            <v-chip>{{ folderStore.folderCount }} of 20 Documents</v-chip>
            <section id="folderDocs" class="mt-4">

                <v-row>
                    <v-col cols="4" md="3" sm="3" v-for="(doc,d) in arr" :key="d">
                        <nuxt-link :to="doc.type === 'movie' ? `/movie/${doc.id}/` : `/tv/${doc.id}/`">
                            <v-card class="rounded-lg">
                                <v-img :src="`https://image.tmdb.org/t/p/w500/${doc.poster_path}`">
                                    <v-card flat class="bg-transparent text-white text-decoration-none">
                                        <!-- {{ doc.vote_average.toFixed(1) }} -->
                                          <v-card-actions style="background: rgba(0,0,0,.3);" class="pa-3">
                                            <v-spacer></v-spacer>
                                            <v-progress-circular
                                            color="white"
                                            :model-value="doc.vote_average.toFixed(1) * 10"
                                            :size="50"
                                            class="text-decoration-none" 
                                            :width="5"
                                            >{{ doc.vote_average.toFixed(1) }}</v-progress-circular>
                                          </v-card-actions>
                                         
                                    </v-card>
                                </v-img>
                            </v-card>
                        </nuxt-link>
                        
                    </v-col>
                </v-row>
            </section>
        </v-container>
        <v-container v-else>
                <h1 class="text-h4 font-weight-bold py-3"> <v-icon icon="mdi-folder-home" size="sm"></v-icon> My Folder</h1>
                <p class="text-body-2">Your folder is empty! Start watching!</p>
        </v-container>
    </v-main>
</template>

<script setup>
    import {
    useMyFolderStore
} from '~/stores/myfolder'
const arr = ref([])

const folderStore = useMyFolderStore()
useHead({
        title: `My Folder | No Pay. You Watch.`,
        meta: [{
            name: 'description',
            content: `View your Folder.`
        }, ],
    })
onMounted( () => {
    folderStore.getFolderDocs()
    arr.value = []
    if(folderStore.myFolder.length > 0){
        arr.value = folderStore.myFolder
    }
    
})
</script>
<style scoped>
a{
    text-decoration: none;
}
</style>