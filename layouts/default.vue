<template>
    <div>   
        <v-app class="bg-grey-darken-4"> 
            <v-app-bar :elevation="0" :color="color">
                <template v-slot:append>
                <v-btn  to="/" class="rounded-lg"><v-icon icon="mdi-home"></v-icon></v-btn>
                 <v-btn to="/myfolder/" class="rounded-lg"><v-icon icon="mdi-folder-home" class="mr-1"></v-icon> My Folder</v-btn>
            </template>
        <!-- <v-app-bar-title class="font-weight-bold text-center text-uppercase text-white text-white">No Pay. You Watch.</v-app-bar-title> -->
    </v-app-bar>
        <slot />
    </v-app>
    </div>
    
</template>
<script setup>
const color = ref('orange-darken-4')
onMounted( () => {
    // window.onscroll = () => {
    //   changeColor();
    // };
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