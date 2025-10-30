<template>
    <v-fab color="grey-lighten-1" icon="mdi-plus" size="small" class="mr-2" @click="watchlistDialog = !watchlistDialog"></v-fab>
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
    const props = defineProps({
      data: Object
    });
    const watchlistDialog = ref(false)
    console.log(props.data)
</script>