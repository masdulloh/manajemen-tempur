<template>
    <div class="mutasi">
        <h2>Mutasi</h2>

        <table class="table table-striped table-hover">
            <thead>
                <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Description</th>
                </tr>
            </thead>
            <tbody>

                <!-- Perulangan menampilkan product dari database -->
                <tr v-for="(mutasine, index) in mutasidisplay" :key="index">
                    <td class="align-middle">{{ mutasine.date.substring(0,10) }}</td>
                    <td class="align-middle">Rp.{{ mutasine.amount }}</td>
                    <td class="align-middle">{{ mutasine.description }}</td>
                </tr>
                <!-- END -->

            </tbody>
        </table>
    </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'

export default {
    name: 'users',
    data(){
        return{
            mutasidisplay:[]
        }
    },
    created(){
        axios.get('https://api.url.my.id/api/raja-ongkir/mootamutasi')
        .then(response => {
            // handle success
            this.mutasidisplay= response.data.body
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    },
    methods: {
        
    }
}
</script>

<style>

</style>