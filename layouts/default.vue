<template>
    <div>   
        <v-app class="bg-grey-darken-4"> 
            <v-app-bar :elevation="0" :color="color" class="px-3">
                <template v-slot:append>
                <v-btn text="Home" to="/" class="rounded-lg"></v-btn>
                 <v-btn text="My Folder" to="/myfolder/" class="rounded-lg"><v-icon icon="mdi-folder-home" class="mr-1"></v-icon> My Folder</v-btn>
            </template>
        <!-- <v-app-bar-title class="font-weight-bold text-center text-uppercase text-white text-white">No Pay. You Watch.</v-app-bar-title> -->
    </v-app-bar>
        <slot />
    </v-app>
    </div>
    
</template>
<script setup>
const color = ref('transparent')
onMounted( () => {
    window.onscroll = () => {
      changeColor();
    };
})

const changeColor = () => {
    if (
        document.body.scrollTop > 400 ||
        document.documentElement.scrollTop > 400
      ) {
        color.value = 'orange-darken-4';
      } else {
        color.value = 'transparent';
      }
}
</script>