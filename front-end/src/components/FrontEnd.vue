<template>
  <div class="container" >
    <div class="large-12 medium-12 small-12 cell">
      <h1>OCR FOR KTP/PASSPORT WEB VERSION</h1>
      <label >Upload
        <input type="file" id="file" ref="file"  accept="image/*" v-on:change="handleFileUpload()" multiple/>
        </br>
        <p>Please choose type of your image:</p>
        <button v-on:click="ktpFunction()">KTP</button>
        <button v-on:click="passportFunction()">Passport</button>
      </label>
    </br>
    <p v-if ='click'> You Choose : {{this.fileName}} </p>
      <img v-bind:src="imagePreview" v-show="showPreview"/>
    </br></br>
      <button  v-if='click' v-on:click="submitFile()">Submit</button> <br/><br/>
      <p v-if= 'wrongKTP'>{{result}}</p>
      <table align= "center" style="width:50%" v-if='fileName == "KTP"'>
        <tr>
          <th>Provinsi:</th>
          <td>{{result.Provinsi}}</td>
        </tr>
        <tr>
          <th>Kota:</th>
          <td>{{result.Kota}}</td>
        </tr>
        <tr>
          <th>NIK:</th>
          <td>{{result.NIK}}</td>
        </tr>
        <tr>
          <th>Nama:</th>
          <td>{{result.Nama}}</td>
        </tr>
        <tr>
          <th>Tempat/Tgl Lahir:</th>
          <td>{{result.Tempat_Tgl_Lahir}}</td>
        </tr>
        <tr>
          <th>Jenis Kelamin:</th>
          <td>{{result.Jenis_Kelamin}}</td>
        </tr>
        <tr>
          <th>Golongan Darah:</th>
          <td>{{result.Gol_Darah}}</td>
        </tr>
        <tr>
          <th>Alamat:</th>
          <td>{{result.Alamat}}</td>
        </tr>
        <tr>
          <th>RT/RW:</th>
          <td>{{result.RT_RW}}</td>
        </tr>
        <tr>
          <th>Kel/Desa:</th>
          <td>{{result.Kel_Desa}}</td>
        </tr>
        <tr>
          <th>Kecamatan:</th>
          <td>{{result.Kecamatan}}</td>
        </tr>
        <tr>
          <th>Agama:</th>
          <td>{{result.Agama}}</td>
        </tr>
        <tr>
          <th>Status Perkawinan:</th>
          <td>{{result.Status_Perkawinan}}</td>
        </tr>
        <tr>
          <th>Pekerjaan:</th>
          <td>{{result.Pekerjaan}}</td>
        </tr>
        <tr>
          <th>Kewarganegaraan:</th>
          <td>{{result.Kewarganegaraan}}</td>
        </tr>
        <tr>
          <th>Berlaku Hingga:</th>
          <td>{{result.Berlaku_Hingga}}</td>
        </tr>
      </table>
       <p v-if= 'wrongPassport'>{{result}}</p>
       <table align= "center" style="width:50%" v-if='fileName == "Passport"'>
        <tr>
          <th>Jenis:</th>
          <td>{{result.Jenis}}</td>
        </tr>
        <tr>
          <th>Kode Negara:</th>
          <td>{{result.Kode_Negara}}</td>
        </tr>
        <tr>
          <th>Nama Lengkap:</th>
          <td>{{result.Nama_Lengkap}}</td>
        </tr>
        <tr>
          <th>No Paspor:</th>
          <td>{{result.No_Paspor}}</td>
        </tr>
        <tr>
          <th>Tgl Lahir:</th>
          <td>{{result.Tgl_Lahir}}</td>
        </tr>
        <tr>
          <th>Jenis Kelamin:</th>
          <td>{{result.Jenis_Kelamin}}</td>
        </tr>
        <tr>
          <th>Tgl Pengeluaran:</th>
          <td>{{result.Tgl_Pengeluaran}}</td>
        </tr>
        <tr>
          <th>Tgl Habis Berlaku:</th>
          <td>{{result.Tgl_Habis_Berlaku}}</td>
        </tr>
     </table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data(){
      return {
        file: '',
        result: '',
        str: '',
        showPreview: false,
        imagePreview: '',
        click: false,
        wrongKTP: false,
        wrongPassport: false,
        fileName:''
      }
    },

    methods: {

      submitFile(){
            let formData = new FormData();
            console.log(this.fileName)
            formData.append('fileData', this.file);

        var self = this
        axios({
          method: 'POST',
          url: 'http://206.189.159.245:3000/upload',
          headers: {
    		   'Accept': 'application/json',
    		   'Content-Type': 'multipart/form-data',
           'name' : this.fileName
    		  },
          data: formData
        })
        .then(function(response){
          self.result = response.data
          self.wrongKTP = false
          self.wrongPassport = false
          if(   self.fileName == 'KTP' && ( self.result.data <= 200 || self.result.data > 400 )  ){
            self.result = 'IMAGE INVALID, PLEASE CHECK YOUR IMAGE QUALITY AND MAKE SURE IT IS A KTP'
            self.wrongKTP = true
          }
          else if(self.fileName == 'Passport' &&  ( (self.result).data <= 80 || (self.result).data > 100 )  ){
              self.result = 'IMAGE INVALID, PLEASE CHECK YOUR IMAGE QUALITY AND MAKE SURE IT IS A PASSPORT'
              self.wrongPassport = true
          }
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },



      handleFileUpload(){
        this.file = this.$refs.file.files[0];
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this), false);

        if( this.file ){
          if ( /\.(jpe?g|png|gif)$/i.test( this.file.name ) ) {
            reader.readAsDataURL( this.file );
          }
        }

      },

      ktpFunction(){
        this.fileName = 'KTP'
        this.click = 'true'
      },
      passportFunction(){
        this.fileName = 'Passport'
        this.click = 'true'
        this.result = ' '
      }



    }
  }
</script>

<style scoped>
div.container img{
  max-width: 200px;
  max-height: 200px;
}
table, th, td {
    border: 1px solid black;
    width: 50%;
}
</style>

