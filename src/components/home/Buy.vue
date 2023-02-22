<template>
    <div class="buy">
        <form @submit.prevent="buyProduct">
            <div class="number-input md-number-input">
                <button v-if="oqty >1" v-on:click="oqty -= 1; inputQty()" class="minus">-</button>
                <input class="quantity" min="1" name="quantity" max="99" type="number" v-model="oqty" @change="inputQty">
                <button v-on:click="oqty += 1; inputQty()" class="plus">+</button>
            </div>

            <div class="form-group">
                <label for="text">Nama Lengkap</label> 
                <input id="text2" name="text" type="text" required="required" class="form-control" v-model="oname" placeholder="Nama Lengkap">
            </div>

            <div class="form-group">
                <label for="text">Nomor WhatsApp</label> 
                <input id="text3" name="text" type="number" required="required" class="form-control" v-model="owhatsapp" placeholder="Nomor WhatsApp">
            </div>
            
            <!-- Province -->
            <div class="form-group">
                <label for="select">Provinsi</label> 
                <div>
                    <select id="select" name="select" required="required" @change="selectProvince($event)" class="custom-select" v-model="oprovince">
                        <option v-for="(prov, index) in provinsi" :key="index" :value="prov.province_id">{{ prov.province}}</option>
                    </select>
                </div>
            </div>

            <!-- City -->
            <div class="form-group">
                <label for="select1">Kota/Kabupaten</label> 
                <div>
                <select id="select1" name="select1" required="required" class="custom-select" v-model="ocity" @change="selectCity">
                    <option v-for="(cit, index) in kota" :key="index" :value="cit.city_id">{{ cit.city_name}}</option>
                </select>
                <p v-if="feedbackcity" class="text-danger">{{ feedbackcity }}</p>
                </div>
            </div>

            <div class="form-group">
                <label for="text">Alamat Lengkap</label> 
                <textarea id="text6" name="text-area" type="text" required="required" class="form-control" v-model="oalamat" placeholder="Nama jalan, Nomor Rumah, RT RW, dll"></textarea>
            </div>
            <div class="form-group">

            </div>
            <div class="form-group">
                <p>Rincian pemesanan {{ pname }}</p>
                <p>Ongkos Kirim: Rp. {{ ongkir }}</p>
                <p>Total : Rp. {{ ototal }}</p>
                <p v-if="feedback" class="text-danger">{{ feedback }}</p>
                <button name="submit" type="submit" class="btn btn-primary">Beli Sekarang</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
    name: 'Buy',
    data(){
        return{
            pprovince: null,
            pcity: null,
            plink: null,
            pname:null,
            pweight: 0, 

            provinsi: [],
            kota: [],

            oproduct: null, // product id
            oname: null,
            owhatsapp: null,
            oloc:null,
            oloc:null,
            oprovince: null,
            ocity: null,
            oalamat: null,
            oqty: 1,
            oprice: 0,
            ocourier: null,
            ongkir:0,
            ototal: 0,
            odate: null,
            oweight:0,
            overif: null,
            onet: 0,

            feedback: null,
            feedbackcity: null
        }
    },
    created(){
        //console.log(this.$route.params.id)
        this.plink=this.$route.params.id

        let ref = db.collection('products').where('plink', '==', this.plink)
        //get current product
        ref.get().then(snapshot => {
            if (snapshot.empty) {
                // Jika produk yang mau di edit tidak ditemukan
                console.log('Empty data for product link = ', this.plink)
                return
            }
            snapshot.forEach(doc => {
                this.oproduct = doc.id
                this.pname = doc.data().pname
                this.oprice = doc.data().pprice
                this.pcogs = doc.data().pcogs
                
                this.pprovince = doc.data().ploc.province
                this.pcity = doc.data().ploc.city
                this.pweight = doc.data().pweight
                this.oweight = this.pweight*this.oqty
                
            }); 
        }).catch(err => {
            console.log('Error getting documents', err)
        })

        db.collection('provinces').get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            } 
            snapshot.forEach(doc => {
                this.provinsi.unshift({
                    province_id: doc.data().province_id,
                    province: doc.data().province
                })
                //console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    },
    methods:{
        // SELECT PROVINCE FUNCTION
        selectProvince(event){
            //console.log(event.target.value)
            this.ocity= null
            this.kota= []
            this.feedback=null
            db.collection('citys').where('province_id', '==', this.oprovince).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No city matching documents.');
                    return;
                } 
                snapshot.forEach(doc => {
                    this.kota.unshift({
                        city_id: doc.data().city_id,
                        city_name: doc.data().city_name
                    })
                    //console.log(doc.id, '=>', doc.data());
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });

        },


        // MEMILIH KOTA
        selectCity(){
            if (this.pcity===this.ocity){
                this.ongkir = 7000;
                this.hitung();

            } else {
                axios.post('https://apikp.masdulloh.xyz/api/raja-ongkir/cost',{
                    'origin':this.pcity,
                    'destination':this.ocity,
                    'weight':this.oweight,
                    'courier':'jne'
                }).then(response => {
                    if (response) {
                        // CEK !! apakah pengiriman di daerah tersebut tersedia
                        if (response.data.body.results[0].costs.length!==0){
                            this.feedbackcity=null;

                            this.ongkir = response.data.body.results[0].costs.filter(cari => {
                                return cari.service == 'REG'
                            })
                        
                            this.ongkir = this.ongkir[0].cost[0].value
                            this.hitung();
                        } 
                        else {
                            this.feedbackcity = 'Maaf, untuk lokasi pengiriman pada kota/kabupaten tersebut belum tersedia!'
                            this.ongkir=null;
                            this.hitung();
                        }
                    }
                })
                .catch(error => {
                    console.log('Error When POST RAJAONGKIR', error)
                })
            }
        },

        hitung(){
            this.ototal = this.ongkir + (this.oqty*this.oprice);
        },

        // INPUT JUMLAH PEMBELIAN
        inputQty(){
            this.oweight = this.oqty*this.pweight
            if (this.ocity){
                this.selectCity()
            }
        },

        // BUY PRODUCT
        buyProduct(){
            this.onet= this.ototal - (this.ongkir + this.pcogs)
            
            this.overif = (firebase.firestore.Timestamp.now().seconds.toString()) + (firebase.firestore.Timestamp.now().nanoseconds.toString());
            
            //Cek apakah sudah di isi semua apa belum
            if(this.oqty && this.oname && this.owhatsapp && this.oprovince && this.ocity && this.oalamat && this.ongkir){
                this.feedback=null;
                this.feedbackcity=null;

                let data = {
                    product: this.oproduct, // product id
                    name: this.oname,
                    whatsapp: this.owhatsapp,
                    loc:{
                        province: this.oprovince,
                        city: this.ocity,
                        alamat: this.oalamat,
                    },
                    qty: Number(this.oqty),
                    price: Number(this.oprice),
                    courier: 'jne',
                    ongkir:Number(this.ongkir),
                    gross: Number(this.ototal),
                    date: firebase.firestore.Timestamp.now(),
                    verif: this.overif,
                    weight:Number(this.oweight),
                    status: 'Pending',
                    paystatus: 'Unpaid',
                    net: this.onet
                }

                db.collection('orders').add(data)
                .then(ref => {
                    //console.log('Added document with ID: ', ref.id)
                    this.$router.push({ name: 'BuyComplete', params: {id:ref.id} })
                }).catch(err => {
                    console.log(err)
                    this.feedback=err.message
                })

              
            } else {
                this.feedback='Pastikan semua form sudah terisi'
            }
        
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