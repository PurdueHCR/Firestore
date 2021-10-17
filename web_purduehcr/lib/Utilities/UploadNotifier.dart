
//import 'dart:html';

import 'dart:io';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';

class UploadNotifier extends ChangeNotifier{
  Image image;
  //using dart.io instead of dart.html
  File imageFile;
  String fileName;
  String errorText;
/*
  startFilePickerWeb() async {
    InputElement uploadInput = FileUploadInputElement();
    uploadInput.click();

    uploadInput.onChange.listen((e) {
      // read file content as dataURL
      final files = uploadInput.files;
      if (files.length == 1) {
        final file = files[0];
        FileReader reader = FileReader();

        reader.onLoadEnd.listen((e) {
          //Here I send the image to my Provider
          image = Image.memory(reader.result);
          imageFile = file;
          notifyListeners();
        });

        reader.onError.listen((fileEvent) {
          print("Some Error occured while reading the file: "+fileEvent.toString());
          errorText = "Sorry. There was an error uploading the file";
          notifyListeners();
        });

        reader.readAsArrayBuffer(file);
      }
    });
  }

  //changed
  fb.UploadTask uploadToFirebase() {
    fileName = '${DateTime.now()}.'+imageFile.toString();
    return FirebaseStorage.instance.ref('/').child(fileName).putFile(imageFile);
  }
*/

}