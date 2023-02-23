<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <router-link :to="{ name: 'Beranda' }" class="navbar-brand" href="#">ORDER ONLINE</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item" v-if="user">
                <router-link :to="{ name: 'Beranda' }" class="nav-link">Home</router-link>
            </li>

            <li class="nav-item" v-if="user">
                <router-link :to="{ name: 'Products' }" class="nav-link">Products</router-link>
            </li>
            <li class="nav-item" v-if="user">
                <router-link :to="{ name: 'Orders' }" class="nav-link">Orders</router-link>
            </li>
            <li class="nav-item" v-if="user && userrole.user_view=='1'">
                <router-link :to="{ name: 'Users' }" class="nav-link">Users</router-link>
            </li>

            </ul>

            <form class="form-inline my-2 my-lg-0">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <!-- jika user null maka akan muncul, v-if="!user" -->
                    <li class="nav-item" v-if="!user">
                        <router-link :to="{ name: 'Login' }" class="nav-link">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="user && usertype=='admin'">
                        <router-link :to="{ name: 'Signup' }" class="nav-link">Add User</router-link>
                    </li>
                    <li class="nav-item" v-if="user">
                        <a class="nav-link" exact :style="{ cursor: 'pointer'}">{{ user.email }}</a>
                    </li>
                    <li class="nav-item" v-if="user">
                        <a class="nav-link" exact :style="{ cursor: 'pointer'}" @click="logout">Logout</a>
                    </li>
                </ul>
                <!--button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button-->
            </form>
        </div>
    </div>
    </nav>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Navbar',
    data(){
        return{
            user: null,
            usertype: null,
            userrole: {}
        }
    },
    methods: {
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login' })
            })
        }
    },
    created(){
        //let user = firebase.auth().currentUser
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
                //console.log(user.uid)

                let pengguna = db.collection('users')
                let querypengguna = pengguna.where('user_id', '==', user.uid).get().then(snapshot => {
                    if (snapshot.empty){
                        console.log('No matching users documents.');
                        return;
                    } 
                    snapshot.forEach(doc => {
                        //console.log(doc.id, '=>', doc.data());
                        this.usertype = doc.data().type;
                        this.userrole = doc.data().role;
                        //console.log(this.usertype)
                    });
                }).catch(err => {
                    console.log('Error getting documents', err);
                });

                
            } else {
                this.user = null
            }
        })
    }
}
</script>