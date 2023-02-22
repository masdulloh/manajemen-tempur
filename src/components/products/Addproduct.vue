<template>
    <div class="addproduct">
        <h2>Add Product</h2>
<!-- KODE INPUTAN FORM -->
        

    <form @submit.prevent="addProduct">
    <div class="form-group">
        <label for="text">Product Name</label> 
        <input id="text" name="text" type="text" required="required" class="form-control" v-model="pname">
    </div>
    <div class="form-group">
        <label for="text4">Link</label> 
        <div class="input-group">
        <div class="input-group-prepend">
            <div class="input-group-text">url.my.id/buy/</div>
        </div> 
        <input id="text4" name="text4" type="text" class="form-control" v-model="plink">
        </div>
    </div>
    <div class="form-group">
        <label for="exampleFormControlFile1">Image</label>
        <input type="file" class="form-control-file" id="exampleFormControlFile1" @change="uploadImage">
    </div>
    <div class="form-group">
        <label for="text1">Price</label> 
        <div class="input-group">
        <div class="input-group-prepend">
            <div class="input-group-text">Rp</div>
        </div> 
        <input id="text1" name="text1" type="text" required="required" class="form-control" v-model="pprice">
        </div>
    </div>
    <div class="form-group">
        <label for="text2">COGS</label> 
        <div class="input-group">
        <div class="input-group-prepend">
            <div class="input-group-text">Rp</div>
        </div> 
        <input id="text2" name="text2" type="text" required="required" class="form-control" v-model="pcogs">
        </div>
    </div>
    <div class="form-group">
        <label for="text3">Weight</label> 
        <div class="input-group">
        <input id="text3" name="text3" type="text" required="required" class="form-control" v-model="pweight"> 
        <div class="input-group-append">
            <div class="input-group-text">Gram</div>
        </div>
        </div>
    </div>

    <!-- Province -->
    <div class="form-group">
        <label for="select">Province</label> 
        <div>
            <select id="select" name="select" required="required" @change="selectProvince($event)" class="custom-select" v-model="pprovince">
                <option v-for="(prov, index) in provinsi" :key="index" :value="prov.province_id">{{ prov.province}}</option>
            </select>
        </div>
    </div>

    <!-- City -->
    <div class="form-group">
        <label for="select1">City</label> 
        <div>
        <select id="select1" name="select1" required="required" class="custom-select" v-model="pcity">
            <option v-for="(cit, index) in kota" :key="index" :value="cit.city_id">{{ cit.city_name}}</option>
        </select>
        </div>
    </div>
    
    <div class="form-group">
        <p v-if="feedback" class="text-danger">{{ feedback }}</p>
        <button name="submit" type="submit" class="btn btn-primary">Save</button>
    </div>
    </form>

        
<!-- __________________ end kode inputan form -->
    </div>
</template>

<script>
//import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
    name: 'AddProducts',
    data(){
        return{
            user:null,
            profile:null,
            
            pname:null,
            plink:null,
            pimage: null,
            pprice: 0,
            pcogs: 0,
            pweight: 0,
            plocation: null,
            pprovince: null,
            pcity: null,
            ploc:null,
            
            provinsi: [],
            kota: [],

            feedback: null
        }
    },
    created(){
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


        
        let ref = db.collection('users')
        //get current user
        ref.where('user_id','==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data(),
                this.user.id = doc.id
            })
        })

        /*
        //profile data
        ref.doc(this.$route.params.id).get()
        .then(user => {
            console.log(user.data())
            this.profile = user.data()
        })
        */


    },
    methods:{
        addProduct(){
            if(this.pname && this.plink && this.pweight && this.pprovince && this.pcity){
                this.feedback=null
                let data = {
                    plink: this.plink,
                    pimage: this.pimage,
                    pname: this.pname,
                    pprice: Number(this.pprice),
                    pcogs: Number(this.pcogs),
                    pweight: Number(this.pweight),
                    ploc: {
                        province: this.pprovince,
                        city: this.pcity
                    },
                    pcreatby: this.user.id
                }

                db.collection('products').add(data)
                .then(() => {
                    this.$router.push({ name: 'Products' })
                }).catch(err => {
                    console.log(err)
                    this.feedback=err.message
                })

              
            } else {
                this.feedback="You must enter all form"
            }
        },
        uploadImage(e){
            //Menyimpan gambar
            //pimage=this.pimage;
            let file = e.target.files[0]
            var storageRef = firebase.storage().ref("products/"+file.name)
            // Task save pause / resume / cancel
            let uploadTask = storageRef.put(file)

            // UPLOAD TASK
            uploadTask.on('state_changed', (snapshot) => {
            },error => {
                console.log('Upload Error = ', error)
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.pimage=downloadURL
                });
            });

            //console.log(e.target.files[0])
        },

        // SELECT PROVINCE FUNCTION
        selectProvince(event){
            //console.log(event.target.value)
            this.pcity= null
            this.kota= []
            db.collection('citys').where('province_id', '==', this.pprovince).get()
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