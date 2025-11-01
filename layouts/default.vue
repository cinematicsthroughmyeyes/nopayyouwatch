<template>
    <div>   
        <v-app class="bg-grey-darken-4"> 
            <v-app-bar :elevation="0" color="orange-darken-2">
                <template v-slot:append>
                <v-btn text="Home" to="/" class="rounded-lg"></v-btn>
                 <v-btn text="My Folder" to="/myfolder/" class="rounded-lg"></v-btn>
            </template>
        <!-- <v-app-bar-title class="font-weight-bold text-center text-uppercase text-white text-white">No Pay. You Watch.</v-app-bar-title> -->
    </v-app-bar>
        <slot />
    </v-app>
    </div>
    
</template>