import 'dart:html';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/RewardsPage/rewards_bloc/rewards.dart';
import 'package:purduehcr_web/Utilities/UploadNotifier.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:firebase/firebase.dart' as fb;

import '../Config.dart';
import '../ConfigWrapper.dart';

class RewardCreationForm extends StatefulWidget{

  RewardCreationForm();

  @override
  State<StatefulWidget> createState() {
    return _RewardCreationFormState();
  }

}

class _RewardCreationFormState extends State<RewardCreationForm> {

  TextEditingController nameController = TextEditingController();
  TextEditingController pprController = TextEditingController();
  UploadNotifier uploadNotifier = UploadNotifier();

  Config config;

  String name = "";
  String ppr = "0";
  bool isUploading = false;
  bool isLoading = false;
  fb.UploadTask _uploadTask;
  Image image;

  final _formKey = GlobalKey<FormState>();

  // ignore: close_sinks
  RewardsBloc _rewardsBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_rewardsBloc == null){
      config = ConfigWrapper.of(context);
      _rewardsBloc = BlocProvider.of<RewardsBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if( isUploading){
      return StreamBuilder<fb.UploadTaskSnapshot>(
        stream: _uploadTask?.onStateChanged,
        builder: (context, snapshot) {
          final event = snapshot?.data;
          if(snapshot.connectionState == ConnectionState.done && event?.state == fb.TaskState.SUCCESS){
            WidgetsBinding.instance.addPostFrameCallback((_) async {
              String url = (await _uploadTask.snapshot.ref.getDownloadURL()).toString();
              isUploading = false;
              isLoading = true;
              _rewardsBloc.add(CreateReward(
                  name: nameController.text,
                  fileName: uploadNotifier.fileName,
                  pointsPerResident: int.parse(pprController.text),
                  downloadURL: url));
            });
            return SizedBox(
              width: 100,
              height: 100,
              child: Column(
                children: [
                  Expanded(child: LoadingWidget()),
                  Expanded(child: Text("Saving Reward"))
                ],
              ),
            );
          }
          else{
            switch (event?.state) {
              case fb.TaskState.RUNNING:
                return SizedBox(
                  width: 100,
                  height: 100,
                  child: Column(
                    children: [
                      Expanded(child: LoadingWidget()),
                      Expanded(child: Text("Uploading Image"))
                    ],
                  ),
                );
              case fb.TaskState.SUCCESS:
                return Text('Success 🎊');

              case fb.TaskState.ERROR:
                return Text('Has error 😢');

              default:
              // Show empty when not uploading
                return SizedBox();
            }
          }
        },
      );
    }
    else if(isLoading){
      return LoadingWidget();
    }
    else{
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8.0),
        child: Builder(
            builder: (context) => Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    child: Text('Reward Image'),
                  ),

                  FormField(
                    initialValue: null,
                    builder: (FormFieldState<Image> state){
                      return Column(
                        children: [
                          Visibility(
                            visible: uploadNotifier.errorText != null,
                            child: Center(child:Text( uploadNotifier.errorText != null? uploadNotifier.errorText : ""))
                          ),
                          Visibility(
                            visible: image != null,
                            child: Center(child: image != null ? Container( width: 100, height:100, child: image) : Text('No Image Selected ...')
                            ),
                          ),
                          Center(
                            child: RaisedButton(
                              child: Text("Select Image"),
                              onPressed: (){
                                uploadNotifier.startFilePickerWeb();
                                uploadNotifier.addListener(() {
                                  setState(() {
                                    image = uploadNotifier.image;
                                  });
                                });
                              },
                            ),
                          ),
                          Visibility(
                            visible: state.errorText != null ,
                            child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),),
                          )
                        ],
                      );
                    },
                    validator: (Image value){
                      if(image == null){
                        return "Please select an icon for this reward";
                      }
                      else{
                        return null;
                      }
                    },
                  ),

                  Container(
                    padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                    child: Text('Details', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  TextFormField(
                    decoration:
                    InputDecoration(labelText: 'Enter a name for this reward.'),
                    maxLines: null,
                    maxLength: 100,
                    controller: nameController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter a name for this reward.';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration:
                    InputDecoration(labelText: 'How many points per resident is required?'),
                    maxLines: null,
                    maxLength: 4,
                    keyboardType: TextInputType.numberWithOptions(),
                    controller: pprController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter how many points this is worth.';
                      }
                      var points = int.tryParse(value);
                      if(points == null){
                        return "Points Per resident must be an integer.";
                      }
                      if(points == 0){
                        return 'Please enter how many points per resident are required.';
                      }
                      if(points < 0){
                        return 'Please enter a positive value.';
                      }
                      return null;
                    },
                  ),
                  Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 16.0, horizontal: 16.0),
                      child: RaisedButton(
                          onPressed: () {
                            final form = _formKey.currentState;
                            if (form.validate()) {
                              print("Did validate");
                              setState(() {
                                isUploading = true;
                                _uploadTask = uploadNotifier.uploadToFirebase();
                              });
                            }
                          },
                          child: Text('Create Reward')
                      )
                  ),
                ],
              ),
            )
        ),
      );
    }
  }
}
