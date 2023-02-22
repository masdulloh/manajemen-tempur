<template>
    <div class="buycomplete">
        <h2>Buy Complete</h2>
        <p class="text-center" v-if="orderdata">Pesanan Berhasil!<br></p>
        <p class="text-center">Silahkan kakak <b>{{ orderdata.name }}</b> melakukan pembayaran sebesar <big><b>Rp. {{ orderdata.gross }}</b></big></p>
        <p class="text-center" v-if="bankdata">pada nomor rekening <b>{{ bankdata.bank_type }}</b> dibawah ini</p>
        <p class="text-center">
        Atas Nama<br><big><b>{{bankdata.atas_nama}}</b></big><br>
        Nomor Rekening<br><big><b>{{ bankdata.account_number }}</b></big><br>
        Untuk konfirmasi otomatis, silahkan tuliskan <b>{{ orderdata.verif }}</b> pada berita transfer.</p>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
    name: 'BuyComplete',
    data(){
        return{
            orderdata:null,
            bankdata:null
        }
    },

    created(){
        //digunakan pihak ke 3 untuk request API raja ongkir karena jika menggunakan vue tidak dapat langsung request api
        axios.get('https://apikp.masdulloh.xyz/api/raja-ongkir/mootabank')
        .then(response => {
            // handle success
            this.bankdata= response.data.body[0];
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        let ref = db.collection('orders')
        //get current product
        ref.doc(this.$route.params.id).get()
        .then(doc => {
            if (!doc.exists) {
                // Jika produk yang mau di edit tidak ditemukan
                console.log('No such order id!');
            } else {
                //console.log('Order data:', doc.data());
                this.orderdata=doc.data();
            }
        })
        .catch(err => {
            console.log('Error getting order documents', err);
        })
    },
    mounted(){
        //munculkan user sekarang
        //console.log(firebase.auth().currentUser)
    }
}
</script>

<style>

</style>