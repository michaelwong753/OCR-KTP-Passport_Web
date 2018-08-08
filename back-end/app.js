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
	l: 'eng',
	psm: 6,
	binary: 'tesseract',
  oem:3
};

app.use(cors())


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
   .crop(805, 585, 8, 55)
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
         res.json(text)
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
  .crop(980, 650, 420, 110)
  .autoOrient()
  .quality(100)
  .colorspace('GRAY')
  .quality(100)
  .write(__dirname + "/HasilGambarPas.png", function(err){
    tesseract.process(__dirname + '/HasilGambarPas.png',options,function(err, text) {
      if(err) {
        console.error(err);
      } else {
        res.json(text)
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
