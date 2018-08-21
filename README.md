# OCR-KTP-Passport_Web
Web version of OCR Indonesian ID card (KTP) &amp; Indonesian Passport using Tesseract 4.0.0 , ImageMagick and LSTM traineddata

## Requirements

* ImageMagick

  Install Imagemagick from [ImageMagick](https://github.com/aheckmann/gm)

* Tesseract 4.0.0 

  Install tesseract from [Tesseract](https://github.com/tesseract-ocr/tesseract)

## Installation
Changes port number to your desired port in [js](https://github.com/sodagembira/OCR-KTP-Passport_Web/blob/master/back-end/public/static/js/app.c0846f398ddd8ac98391.js)
```
...
{method:"POST",
url:"<YOUR DESIRED PORT(DEFAULT PORT: 3000, IF RAN IN LOCALHOST)>",
headers:{Accept:"application/json",
"Content-Type":"multipart/form-data",name:this.fileName},
...
```
Run the OCR
```
cd back-end && node app.js
```

## Usage
1. Upload Your Picture
2. Choose either KTP/Passport
3. Click on Submit

![alt text](https://github.com/sodagembira/OCR-KTP-Passport_Web/blob/master/example.png)
