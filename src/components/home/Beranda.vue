<template>
    <div class="beranda">
        <h2>Home</h2>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'Beranda',
    data(){
        return{

        }
    },
    mounted(){
        //munculkan user sekarang
        //console.log(firebase.auth().currentUser)
    }
}
</script>

<style>

</style>