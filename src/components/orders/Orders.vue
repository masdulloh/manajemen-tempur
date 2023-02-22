<template>
    <div class="orders">
        <h2>Orders</h2>
        <router-link :to="{ name:'Mutasi' }"><button type="button" class="btn btn-primary">Cek Mutasi</button></router-link>
        <p>&nbsp;</p>
        
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Invoice</th>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Address</th>
                    <th scope="col">Status</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>

                <!-- Perulangan menampilkan product dari database -->
                <tr v-for="(order, index) in orderdisplay" :key="index">
                    <td class="align-middle">{{ order.verif }}

                        <p>Rp. {{ order.gross }}</p>
                    </td>
                    <td class="align-middle">{{ order.name }}<br>{{ order.whatsapp }}</td>
                    <td class="align-middle">{{ order.date.substring(12,17) }}<br>{{ order.date.substring(1,11) }}</td>
                    <td class="align-middle">{{ order.alamat }}</td>
                    <td class="align-middle">
                        <div v-if="order.status==='Pending'" class="alert alert-warning" role="alert">{{ order.status }}</div>
                        <div v-else-if="order.status==='Processing'" class="alert alert-secondary" role="alert">{{ order.status }}</div>
                        <div v-else-if="order.status==='Completed'" class="alert alert-success" role="alert">{{ order.status }}</div>
                        <div v-else-if="order.status==='Cancelled'" class="alert alert-danger" role="alert">{{ order.status }}</div>
                    </td>
                    <td class="align-middle">
                        <div v-if="order.paystatus==='Unpaid'" class="alert alert-warning" role="alert">{{ order.paystatus }}</div>
                        <div v-else-if="order.paystatus==='Paid'" class="alert alert-success" role="alert">{{ order.paystatus }}</div>
                        <div v-else-if="order.paystatus==='Refunded'" class="alert alert-danger" role="alert">{{ order.paystatus }}</div>
                    </td>
                    <td class="align-middle">
                        <div class="btn-group">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Action
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" v-if="order.status!=='Pending'" @click="statusnya('Pending', order.idorder)" exact :style="{ cursor: 'pointer'}">Pending</a>
                            <a class="dropdown-item" v-if="order.status!=='Processing'" @click="statusnya('Processing', order.idorder)" exact :style="{ cursor: 'pointer'}">Processing</a>
                            <a class="dropdown-item" v-if="order.status!=='Completed'" @click="statusnya('Completed', order.idorder)" exact :style="{ cursor: 'pointer'}">Completed</a>
                            <a class="dropdown-item" v-if="order.status!=='Cancelled'" @click="statusnya('Cancelled', order.idorder)" exact :style="{ cursor: 'pointer'}">Cancelled</a>

                            <div class="dropdown-divider"></div>

                            <a class="dropdown-item" v-if="order.paystatus!=='Unpaid'" @click="paystatusnya('Unpaid', order.idorder)" exact :style="{ cursor: 'pointer'}">Unpaid</a>
                            <a class="dropdown-item" v-if="order.paystatus!=='Paid'" @click="paystatusnya('Paid', order.idorder)" exact :style="{ cursor: 'pointer'}">Paid</a>
                            <a class="dropdown-item" v-if="order.paystatus!=='Refunded'" @click="paystatusnya('Refunded', order.idorder)" exact :style="{ cursor: 'pointer'}">Refunded</a>

                            <div class="dropdown-divider"></div>
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
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Orders',
    data(){
        return{
            orderdisplay:[],
            kotane:[]
        }
    },
    created(){
        //view product
        this.showData()
        //console.log(this.productdisplay)
    },
    methods:{
        // FUNGSI TAMPILKAN DATA
        statusnya(isi, prod){
            db.collection('orders').doc(prod).update({status: isi})
        },
        paystatusnya(isi, prod){
            db.collection('orders').doc(prod).update({paystatus: isi})
        },

        showData(){
            let productdisplay=[]
            db.collection('orders').orderBy('date')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        this.orderdisplay.unshift({
                            verif: change.doc.data().verif,
                            name: change.doc.data().name,
                            whatsapp: change.doc.data().whatsapp,
                            date: JSON.stringify(change.doc.data().date.toDate()),
                            gross: change.doc.data().gross,
                            status: change.doc.data().status,
                            paystatus: change.doc.data().paystatus,
                            idorder: change.doc.id,
                            alamat: change.doc.data().loc.alamat,
                            city: change.doc.data().loc.city
                        })
                    }
                    if (change.type === 'removed') {
                        this.$router.push({ name:'Beranda' })
                    }
                })
            })
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