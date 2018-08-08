<template>
  <div class="container" >
    <div class="large-12 medium-12 small-12 cell">
      <h1>OCR FOR KTP/PASSPORT WEB VERSION</h1>
      <label >Upload
        <input type="file" id="file" ref="file"  accept="image/*" v-on:change="handleFileUpload()"/>
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
      <p>Result:</p>
        <pre >{{ result }}</pre>
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
          url: 'http://localhost:3000/upload',
          headers: {
    		   'Accept': 'application/json',
    		   'Content-Type': 'multipart/form-data',
           'name' : this.fileName
    		  },
          data: formData
        })
        .then(function(response){
          self.result = response.data
          console.log(self.result)
          console.log((self.result).length)
          if(   self.fileName == 'KTP' && ( (self.result).length <= 300 || (self.result).length > 450 )  ){
            self.result = 'IMAGE INVALID, PLEASE CHECK YOUR IMAGE QUALITY AND MAKE SURE IT IS A KTP'
          }
          else if(self.fileName == 'Passport' &&  ( (self.result).length <= 250  || (self.result).length > 500 )  ){
              self.result = 'IMAGE INVALID, PLEASE CHECK YOUR IMAGE QUALITY AND MAKE SURE IT IS A PASSPORT'
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
      }



    }
  }
</script>

<style scoped>
div.container img{
  max-width: 200px;
  max-height: 200px;
}
</style>
