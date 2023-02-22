<template>
    <div class="editproduct">
        <h2>Edit Product</h2>
<!-- KODE INPUTAN FORM -->
        

    <form @submit.prevent="editProduct">
    <!-- PRODUCT NAME -->
    <div class="form-group">
        <label for="text">Product Name</label> 
        <input id="text" name="text" type="text" required="required" class="form-control" v-model="pname">
    </div>

    <!-- Link -->
    <div class="form-group">
        <label for="text4">Link</label> 
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">url.my.id/buy/</div>
            </div> 
            <input id="text4" name="text4" type="text" class="form-control" v-model="plink">
        </div>
    </div>

    <!-- Image -->
    <div class="form-group">
        <label for="exampleFormControlFile1">Image</label>
        <div class="input-group">
            <img :src=this.pimage alt="" width="150">
            <input type="file" class="form-control-file" id="exampleFormControlFile1" @change="uploadImage">
        </div>
    </div>

    <!-- Price -->
    <div class="form-group">
        <label for="text1">Price</label> 
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">Rp</div>
            </div> 
            <input id="text1" name="text1" type="text" required="required" class="form-control" v-model="pprice">
        </div>
    </div>

    <!-- COGS -->
    <div class="form-group">
        <label for="text2">COGS</label> 
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">Rp</div>
            </div> 
            <input id="text2" name="text2" type="text" class="form-control" required="required" v-model="pcogs">
        </div>
    </div>

    <!-- Weight -->
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
    <!-- City -->
    <div class="form-group">
        <label for="select1">City</label> 
        <div>
        <select id="select1" name="select1" required="required" class="custom-select" v-model="pcity">
            <option v-for="(cit, index) in kota" :key="index" :value="cit.city_id">{{ cit.city_name}}</option>
        </select>
        </div>
    </div>

    <!-- Feedback -->
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


export default {
    name: 'EditProducts',
    data(){
        return{
            profile:null,
            user:null,

            pname:null,
            plink:null,
            pimage: null,
            pprice: 0,
            pcogs: 0,
            pweight: 0,
            ploc: [],
            pprovince: null,
            pcity: null,

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


        
        // get current user
        /*
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
                console.log(user)
            } else {
                this.user = null
            }
        })
        */


        let ref = db.collection('products')
        //get current product
        ref.doc(this.$route.params.id).get()
        .then(doc => {
            if (!doc.exists) {
                // Jika produk yang mau di edit tidak ditemukan
                console.log('No such product id!');
            } else {
                //console.log('Document data:', doc.data());
                this.pname = doc.data().pname
                this.plink = doc.data().plink
                this.pprice = doc.data().pprice
                this.pcogs = doc.data().pcogs
                this.pimage = doc.data().pimage

                this.pweight = doc.data().pweight

                this.ploc=doc.data().ploc
                this.pprovince = this.ploc.province
                this.pcity = this.ploc.city


                //CITY
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
                //CITY
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        })


        

    },
    methods:{
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
        editProduct(){
            //TODO
            if(this.pname && this.pimage && this.plink && this.pweight && this.pprovince && this.pcity){
                
                //let ref2 = db.collection('products').doc(this.plink)
                //plink=this.plink
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
                    }
                    //pcreatby: this.user.id
                }
                db.collection('products').doc(this.$route.params.id).update(data)
                .then(() => {
                    this.$router.push({ name: 'Products' })
                }).catch(err => {
                    console.log(err)
                    this.feedback=err.message
                })
            } else {
                this.feedback="Please fill the blank form"
            }
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