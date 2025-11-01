<template>
    <v-main>
        <v-container v-if="folderStore.folderCount > 0">
            <h1 class="text-h4 font-weight-bold py-3"> <v-icon icon="mdi-folder-home" size="sm"></v-icon> My Folder</h1>
            <v-chip>{{ folderStore.folderCount }} of 20 Documents</v-chip>
            <section id="folderDocs" class="mt-4">

                <v-row>
                    <v-col cols="4" md="3" sm="3" v-for="(doc,d) in folderStore.myFolder" :key="d">
                        
                            <v-card class="rounded-lg">
                                <v-card-actions class="bg-grey-darken-4 pa-1">
                                            <v-spacer></v-spacer>
                                            <v-menu>
                                                <template v-slot:activator="{ props }">
                                                <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"></v-btn>
                                                </template>

                                                <v-list>
                                                <v-list-item
                                                    v-for="(item, i) in cardItems"
                                                    :key="i"
                                                    :value="i"
                                                    @click="item.action(doc, i)"
                                                >
                                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                                </v-list-item>
                                                </v-list>
                                            </v-menu>
                                          </v-card-actions>
                                          <nuxt-link :to="doc.type === 'movie' ? `/movie/${doc.id}/` : `/tv/${doc.id}/`">
                                <v-img :src="`https://image.tmdb.org/t/p/w500/${doc.poster_path}`">
                                    <v-card flat class="bg-transparent text-white text-decoration-none">
                                        <!-- {{ doc.vote_average.toFixed(1) }} -->
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-chip size="small" color="orange-darken-4" variant="elevated"><v-icon icon="mdi-star"> </v-icon> {{doc.vote_average.toFixed(1) }} </v-chip>
                                          </v-card-actions>
                                          
                                          
                                    </v-card>
                                </v-img>
                                </nuxt-link>
                            </v-card>
                        
                        
                    </v-col>
                </v-row>
            </section>
        </v-container>
        <v-container v-else>
                <h1 class="text-h4 font-weight-bold py-3"> <v-icon icon="mdi-folder-home" size="sm"></v-icon> My Folder</h1>
                <p class="text-body-2">Your folder is empty! Start watching!</p>
        </v-container>
        <v-dialog v-model="confirmDelete" max-width="500">
            
                <v-card theme="dark" class="rounded-lg">
                    <v-container>
                    <v-card-title>
                        <h4>Delete this document?</h4>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-body-1">This document will be deleted from your folder.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" text="Delete" @click="deleteDocument"></v-btn>
                    </v-card-actions>
                    </v-container>
                </v-card>
            
        </v-dialog>
    </v-main>
</template>

<script setup>
    import {
    useMyFolderStore
} from '~/stores/myfolder'
const arr = ref([])


const folderStore = useMyFolderStore()
const confirmDelete = ref(false)
const deleteIndex = ref(0)
const deleteData = ref()
const cardItems = ref([{
    title: 'Remove',
    action: (data, index) => {
        confirmDelete.value = true
        deleteIndex.value = index
        deleteData.value = data
    }
}])
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
const deleteDocument = () => {
    folderStore.removeDocument(deleteData.value, deleteIndex.value)
    confirmDelete.value = false
}
</script>
<style scoped>
a{
    text-decoration: none;
}
</style>