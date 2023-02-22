<template>
    <div class="users">
        <h2>Users</h2>

        <table class="table table-striped table-hover">
            <thead>
                <tr>
                <th scope="col">Username</th>
                <th scope="col">Type</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>

                <!-- Perulangan menampilkan product dari database -->
                <tr v-for="(pengguna, index) in userdisplay" :key="index">
                    <td class="align-middle">{{ pengguna.username }}</td>
                    <td class="align-middle">{{ pengguna.type }}</td>
                    <td class="align-middle">
                        <div class="btn-group">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Action
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" v-if="pengguna.type!=='admin'" @click="typenya('admin', pengguna.id)" exact :style="{ cursor: 'pointer'}">Set as Admin</a>
                            <a class="dropdown-item" v-if="pengguna.type!=='cs'" @click="typenya('cs', pengguna.id)" exact :style="{ cursor: 'pointer'}">Set as CS</a>
                            
                        </div>
                        </div>
                    </td>
                </tr>
                <!-- END -->

            </tbody>
        </table>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'users',
    data(){
        return{
            userdisplay:[],
            type: null,
            user_id: null,
            username: null,

            usertype: null
        }
    },
    created(){
        //munculkan user sekarang
        //console.log(firebase.auth().currentUser.uid)
        let pengguna = db.collection('users') // Cari type user pada database
        let querypengguna = pengguna.where('user_id', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
            if (snapshot.empty){
                console.log('No matching users documents.');
                return;
            } 
            snapshot.forEach(doc => {
            //console.log(doc.id, '=>', doc.data());
            this.usertype = doc.data().type
            //console.log(this.usertype)
            if (this.usertype!='admin'){
                this.$router.push({ name: 'Beranda' })
            }
        });
        }).catch(err => {
            console.log('Error getting users documents', err);
        });
        
        this.showData()
    },
    methods: {
        showData(){
            let userdisplay=[]
            db.collection('users')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        this.userdisplay.unshift({
                            id: change.doc.id,
                            username: change.doc.data().username,
                            type: change.doc.data().type
                        })
                    }
                    if (change.type === 'removed') {
                        this.$router.push({ name:'Beranda' })
                    }
                })
            })
        },
        typenya(isi, penggunanya){
            db.collection('users').doc(penggunanya).update({type: isi})
        }
    },
    mounted(){

    }
}
</script>

<style>

</style>