<template>
<v-fab color="grey-lighten-1" icon="mdi-plus" size="small" class="mr-2" @click="addToWishlist" v-if="!watchlistStore.foundWatchlistItem"></v-fab>
<v-fab color="grey-lighten-1" icon="mdi-check" size="small" class="mr-2" @click="removeFromWishlist" v-else></v-fab>

<v-dialog width="500" v-model="watchlistDialog">
    <v-card flat theme="dark" class="rounded-lg">
        <v-container>
            <v-card-text>
                <p class="text-body-1">Watchlist feature isn't ready yet. But it's coming soon!</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="watchlistDialog = false" class="rounded-lg">Close</v-btn>
            </v-card-actions>
        </v-container>

    </v-card>
</v-dialog>
</template>

<script setup>
    import {useMyWatchlistStore} from '~/stores/watchlist'
    const watchlistStore = useMyWatchlistStore()
    const props = defineProps({
        data: Object,
        type: String
    });
    const watchlistDialog = ref(false)
    //console.log(props.data)
    
    onMounted( () => {
        watchlistStore.foundWatchlistItem = false
        watchlistStore.getByID(props.data.id)
    })
    const addToWishlist = ()=> {
        
        watchlistStore.addToWatchlist(props.data, props.type, props.data.id)
        watchlistStore.foundWatchlistItem = true
    }
    const removeFromWishlist = ()=> {
        watchlistStore.removeFromWishlist(props.data.id)
        //watchlistStore.foundWatchlistItem = true
    }


</script>
