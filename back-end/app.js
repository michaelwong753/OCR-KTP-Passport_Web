var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('winston')
var fs = require('fs');
var multer  = require('multer');
var dir;
var params;
var upload = multer({ dest: 'uploads/' });
var fs = require('fs')
  , gm = require('gm');
var cors = require('cors')
var tesseract = require('node-tesseract');
var options = {
	l: 'Latin',
	psm: 6,
	oem: 3,
	binary: 'tesseract'
};
var options2 = {
        l: 'ind',
        psm: 6,
        oem: 3,
        binary: 'tesseract'
};

var mongoose = require('mongoose')

mongoose.Promise = global.Promise
con = mongoose.createConnection('mongodb://michael753:michael3@ds219532.mlab.com:19532/ocrproject')
con2 = mongoose.createConnection('mongodb://michael753:michael3@ds219532.mlab.com:19532/ocrproject')
var HasilPassport = con2.model("HasilPassport",new mongoose.Schema({
	Jenis: String,
	Kode_Negara: String,
	Nama_Lengkap: String,
	No_Paspor:String,
	Tgl_Lahir:String,
	Jenis_Kelamin:String,
	Tgl_Pengeluaran:String,
	Tgl_Habis_Berlaku:String,
}))
var HasilKTP = con.model("HasilKTP",new mongoose.Schema({
  Provinsi: String,
  Kota: String,
  NIK: String,
  Nama: String,
  Tempat_Tgl_Lahir: String,
  Jenis_Kelamin: String,
  Gol_Darah: String,
  Alamat: String,
  RT_RW: String,
  Kel_Desa: String,
  Kecamatan: String,
  Agama: String,
  Status_Perkawinan: String,
  Pekerjaan: String,
  Kewarganegaraan: String,
  Berlaku_Hingga: String
}))


app.use(cors())
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.post('/upload',upload.single('fileData'), (req, res,next) => {
  logger.info(req.file);
  logger.info(req.body);
  fs.readFile(req.file.path,(err, contents)=> {
   if (err) {
   console.log('Error: ', err);
  }else{
   console.log('File contents ',contents);
  }
 });

 //for KTP
 if(req.headers.name == 'KTP'){
   gm(req.file.path)
   .density(600,600)
   .resizeExact(1200, 755)
   .quality(100)
   .crop(569,647, 266, 5)
   .autoOrient()
   .quality(100)
   .colorspace('GRAY')
   .threshold('40','Threshold-White')
   .quality(100)
   .write(__dirname + "/HasilGambarKTP.png", function(err){

     tesseract.process(__dirname + '/HasilGambarKTP.png',options,function(err, text) {
       if(err) {
         console.error(err);
       } else {
	 var result = ''
         var arrayfill = '';
         var array = [17];
         array[16]= ''
         var o = 0
	  console.log(text)
	 if(text.length < 150 || text.length > 400){
		let db_data = {
               Provinsi: '',
               Kota:'',
               NIK:'',
               Nama:'',
               Tempat_Tgl_Lahir:'',
               Jenis_Kelamin:'',
               Gol_Darah: '',
               Alamat: '',
               RT_RW: '',
               Kel_Desa: '',
               Kecamatan: '',
               Agama:  '',
               Status_Perkawinan: '',
               Pekerjaan: '',
               Kewarganegaraan: '',
               Berlaku_Hingga: '',
               data: 3
          }
		res.json(db_data) 
	 }
	    else{
	       
         for(var i =0;i<text.length;i++){
           result += text[i]
           if(text[i+1] == '\n' && text[i+2] == '\n'){
             i += 2
             result += '\n'
            }
         }
         var apa = ''
         for(var i =0;i<text.length;i++){
           arrayfill += result[i]
              if(o == 5){
                if(result[i+1] + result[i+2] == "Go"){
                array[o] = arrayfill
                arrayfill = ''
                o += 1
                i += 10
                }
              }

           else if(result[i+1]== '\n'){
             array[o] = arrayfill
             arrayfill = ''
             i += 1
             o += 1
            }
            if( result[i] == '=' || result[i] == '©' || result[i] == '[' || result[i] == ']' ||result[i] == ':' || result[i] == '+' || result[i] == ';'|| result[i] == "“" || result[i] == "|" ){
		    if(arrayfill.length < 7)
		    arrayfill = ' '
            }
         }
         if(array[16].length > 5){
           array[7] = array[7] + array[8]
           array[8] = array[9]
           array[9] = array[10]
           array[10]=array[11]
           array[11]=array[12]
           array[12]=array[13]
           array[13]=array[14]
           array[14]=array[15]
           array[15]=array[16]
         }
	if(array[15] == undefined || array[15] == ''){
		array.fill(' ',0,15)
		text = '  '
	}
         let db_data = {
               Provinsi: array[0],
               Kota: array[1],
               NIK: array[2],
               Nama: array[3],
               Tempat_Tgl_Lahir: array[4],
               Jenis_Kelamin: array[5],
               Gol_Darah: array[6],
               Alamat: array[7],
               RT_RW: array[8],
               Kel_Desa: array[9],
               Kecamatan: array[10],
               Agama: array[11],
               Status_Perkawinan: array[12],
               Pekerjaan: array[13],
               Kewarganegaraan: array[14],
               Berlaku_Hingga: array[15],
               data: text.length
          };
	console.log(db_data)		    
         res.json(db_data)
	 HasilKTP(db_data).save(function(err,data){
                  if(err) throw err
          })
	    }
	  fs.unlink(__dirname + "/HasilGambarKTP.png", (err) => {
    if (err) {
        console.log("failed to delete processed image:"+err);
    } else {
        console.log('successfully deleted processed image');
    }
	  });
       }
     });
      fs.unlink(req.file.path, (err) => {
    if (err) {
        console.log("failed to delete uploaded image:"+err);
    } else {
        console.log('successfully deleted uploaded image');
    }
	});   
     if (err) return console.dir(arguments)
     console.log(this.outname + " created  ::  " + arguments[3])
   });
}

// for Passport
else{
  gm(req.file.path)
  .resizeExact(1400, 1000)
  .quality(100)
  .crop(1370, 500, 0, 770)
  .autoOrient()
  .quality(100)
  .colorspace('GRAY')
  .quality(100)
  .write(__dirname + "/HasilGambarPas.png", function(err){
    tesseract.process(__dirname + '/HasilGambarPas.png',options,function(err, text) {
      if(err) {
        console.error(err);
      }
	else{
	var array= [10];
        var arrayfill ='';
        array[0] = 'P'
        array[1] = 'IDN'
        var o =2;
        var bool = 0
        var temp;
        for(var i =5;i<text.length;i++){
              if(text[i] != '<' && text[i] != '\n' ){
                  arrayfill += text[i]
                      if(arrayfill.length<4 && text[i+1] == '<'){
                        arrayfill = ''
                      }
                    else if(text[i+1] == '<'){
                        array[o] = arrayfill
                        arrayfill = ''
                        o += 1
                        if(bool == 1){
                          temp = i
                          break
                        }
                      }
            }

            else if(text[i] == '\n'){
                    if(o == 5){
                      array[2] = array[3] + ' '+ array[4] + ' ' + array[2]
                      o -= 2
                      bool = 1
                    }
                    else if(o == 4){
                      array[2] = array[3] + ' '+ array[2]
                      o -= 1
                      bool = 1
                    }
            }

        }
        for(var i = temp+2;i<text.length;i++){
          if(text[i-1] == 'N'){
            array[o] = text[i+4]+text[i+5] + '-' + text[i+2]+text[i+3] + '-' + '19'+text[i]+text[i+1]
            i += 6
            o += 1
          }
          else if(text[i] == 'M' || text[i] == 'F'){
            array[o] = text[i]
            array[o+1] = text[i+5] + text[i+6] + '-' +text[i+3] + text[i+4] + '-' + '20'+ text[i+1] +text[i+2]
            var a = text[i+1] + text[i+2]
            var b = parseInt(a)
            b -= 5
            var num = b.toString()
            array[o+2] = text[i+5] + text[i+6] + '-' +text[i+3] + text[i+4] + '-' + '20'+ num
          }
        }

          if(array[7] == undefined || array[7] == ''){
                array.fill(' ',0,7)
                text = '  '
        }

	let db_data = {
              Jenis: array[0],
              Kode_Negara: array[1],
              Nama_Lengkap: array[2],
              No_Paspor: array[3],
                Tgl_Lahir: array[4],
              Jenis_Kelamin: array[5],
              Tgl_Pengeluaran: array[6],
              Tgl_Habis_Berlaku: array[7],
              data: text.length
         };
        res.json(db_data) 
	HasilPassport(db_data).save(function(err,data){
                  if(err) throw err
          })
	fs.unlink(__dirname + "/HasilGambarPas.png", (err) => {
    if (err) {
        console.log("failed to delete processed image:"+err);
    } else {
        console.log('successfully deleted processed image');
    }
	});

      }
    });
  fs.unlink(req.file.path, (err) => {
    if (err) {
        console.log("failed to delete uploaded image:"+err);
    } else {
        console.log('successfully deleted uploaded image');
    }
	});

    if (err) return console.dir(arguments)
    console.log(this.outname + " created  ::  " + arguments[3])
  });
}


});

app.get('/', function(req, res, next) {
 res.render('index.ejs');
});
app.listen(3000);

console.log('Running on port 3000');

