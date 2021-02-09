// ignore: avoid_web_libraries_in_flutter
import 'dart:html';

import 'package:datetime_picker_formfield/datetime_picker_formfield.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:purduehcr_web/Main_App_Pages/MyEventsPage/my_events_bloc/my_events.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/rewards_bloc/rewards.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utilities/UploadNotifier.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:firebase/firebase.dart' as fb;

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

class EventCreationForm extends StatefulWidget{

  EventCreationForm();

  @override
  State<StatefulWidget> createState() {
    return _EventCreationFormState();
  }

}

class _EventCreationFormState extends State<EventCreationForm> {

  TextEditingController nameController = TextEditingController();
  TextEditingController locationController = TextEditingController();
  TextEditingController hostController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  TextEditingController virtualLinkController = TextEditingController();

  Config config;

  String name = "";
  String location = "";
  String host = "";
  String virtualLink = "";
  String description = "";
  DateTime startDateTime;
  DateTime endDateTime;
  PointType pointType;
  List<String> floorIds = new List<String>();
  List<String> temporarySelectedIds = new List<String>();
  bool isPublicEvent = false;
  bool isAllFloors = false;
  Future<List<PointType>> getPointTypes;

  bool isLoading = false;

  final _formKey = GlobalKey<FormState>();

  // ignore: close_sinks
  MyEventsBloc _myEventsBloc;
  // ignore: close_sinks
  AuthenticationBloc _authenticationBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_myEventsBloc == null){
      config = ConfigWrapper.of(context);
      _myEventsBloc = BlocProvider.of<MyEventsBloc>(context);
    }
    if(_authenticationBloc == null){
      config = ConfigWrapper.of(context);
      _authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
      floorIds = (_authenticationBloc.state as Authenticated).house.floorIds;
      print(displayIds(this.floorIds));
    }
    if(_myEventsBloc != null && this.getPointTypes == null){
      this.getPointTypes = _myEventsBloc.getPointTypes();
    }
  }

  @override
  Widget build(BuildContext context) {
    if(isLoading){
      return LoadingWidget();
    }
    else{
      return Container(
          padding:
          const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
          child: Builder(
              builder: (context) => Form(
                  key: _formKey,
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Container(
                          padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                          child: Text('Event Details', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: 'What is the name of your event?'),
                          maxLines: null,
                          maxLength: 250,
                          controller: nameController,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'Please enter a name';
                            }
                            return null;
                          },
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: 'What is your event about?'),
                          maxLines: null,
                          maxLength: 250,
                          controller: descriptionController,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'Please enter a description.';
                            }
                            return null;
                          },
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: 'Who is hosting your event?'),
                          maxLines: null,
                          maxLength: 250,
                          controller: hostController,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'Please enter a name for the host.';
                            }
                            return null;
                          },
                        ),
                        Container(
                          padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                          child: Text('Time and Location', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                        FormField(
                          builder: (FormFieldState<DateTime> state ){
                            return Container(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Text("Start Date"),
                                    ButtonTheme(
                                      child: FlatButton(
                                        shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
                                        onPressed: () async {
                                          final date = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(Duration(days:365)));
                                          final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(DateTime(DateTime.now().year,DateTime.now().month, DateTime.now().day, DateTime.now().hour) ));
                                          setState(() {
                                            startDateTime = combine(date, time);
                                            state.didChange(startDateTime);
                                          });
                                        },
                                        child: startDateTime == null? Text(""):
                                        Text( DateFormat("MMM d, h:mm a").format(startDateTime),
                                          textAlign: TextAlign.start,),
                                      ),
                                    ),
                                    Visibility(
                                      visible: state.errorText != null && state.errorText.isNotEmpty,
                                      child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),),
                                    )
                                  ],
                                )
                            );
                          },
                          validator: (DateTime value){
                            if(value == null){
                              return 'Please select a start date';
                            }
                            else if(value.compareTo(DateTime.now().subtract(Duration(hours:DateTime.now().hour, minutes:DateTime.now().minute))) <= 0){
                              return 'Today is the earliest start date allowed';
                            }
                            else{
                              return null;
                            }
                          },
                        ),
                        FormField(
                          builder: (FormFieldState<DateTime> state ){
                            return Container(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Text("End Date"),
                                    ButtonTheme(
                                      child: FlatButton(
                                        shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
                                        onPressed: () async {
                                          final date = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(Duration(days:365)));
                                          final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(DateTime(DateTime.now().year,DateTime.now().month, DateTime.now().day, DateTime.now().hour) ));
                                          endDateTime = combine(date, time);
                                          state.didChange(endDateTime);
                                        },
                                        child: state.value == null? Text(""):
                                        Text( DateFormat("MMM d, h:mm a").format(endDateTime),
                                          textAlign: TextAlign.start,),
                                      ),
                                    ),
                                    Visibility(
                                      visible: state.errorText != null && state.errorText.isNotEmpty,
                                      child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),),
                                    )
                                  ],
                                )
                            );
                          },
                          validator: (DateTime value){
                            if(value == null){
                              return 'Please select an end date';
                            }
                            else if(value.compareTo(this.startDateTime) <= 0){
                              return 'The end date has to come after the start date';
                            }
                            else{
                              return null;
                            }
                          },
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: 'What is the location of your event?'),
                          maxLines: null,
                          maxLength: 250,
                          controller: locationController,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'Please enter a location.';
                            }
                            return null;
                          },
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: '(Optional) What is the virtual meeting link?'),
                          maxLines: null,
                          maxLength: 250,
                          controller: virtualLinkController,
                          validator: (value) {
                            return null;
                          },
                        ),
                        Container(
                          padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                          child: Text('Competition Details', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                        FormField(
                          builder: (FormFieldState<PointType> state ){
                            return Container(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.fromLTRB(16, 0, 0, 0),
                                          child: Text('Point Category', style: TextStyle(fontSize: 16),),
                                        ),
                                        OutlineButton(
                                            onPressed: () async {
                                              PointType pt = await showDialog<PointType>(
                                                  context: context,
                                                  builder: (BuildContext context) {
                                                    return AlertDialog(
                                                      title: Text("Choose a Point Category"),
                                                      shape: RoundedRectangleBorder(
                                                          borderRadius: BorderRadius.all(Radius.circular(10.0))
                                                      ),
                                                      content: SingleChildScrollView(
                                                        child: SizedBox(
                                                          width: 500,
                                                          height: 400,
                                                          child: FutureBuilder(
                                                              future: this.getPointTypes,
                                                              builder: ( context, snapshot) {
                                                                if(snapshot.connectionState == ConnectionState.done) {
                                                                  return PointTypeList(pointTypes: snapshot.data as List<PointType>, onPressed: (BuildContext context, PointType pt){
                                                                    Navigator.pop(context, pt);
                                                                  });
                                                                }
                                                                else {
                                                                  return LoadingWidget();
                                                                }
                                                              }
                                                          ),
                                                        ),
                                                      ),
                                                    );
                                                  }
                                              );
                                              setState(() {
                                                state.didChange(pt);
                                                this.pointType = pt;
                                              });

                                            },
                                            child: Text(this.pointType != null ? this.pointType.name : 'Select')
                                        ),
                                      ],
                                    ),
                                    Visibility(
                                      visible: state.errorText != null && state.errorText.isNotEmpty,
                                      child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),textAlign: TextAlign.end),
                                    )
                                  ],
                                )
                            );
                          },
                          validator: (value){
                            if(value == null){
                              return 'Select a category';
                            }
                            else{
                              return null;
                            }
                          },
                        ),
                        SwitchListTile(
                            title: const Text('Public Event'),
                            value: this.isPublicEvent,
                            onChanged: (bool setIsPublic){
                              setState(() {
                                this.isPublicEvent = setIsPublic;
                            });
                          }
                        ),
                        Visibility(
                          visible: !this.isPublicEvent,
                          child: SwitchListTile(
                            title: const Text('Invite All Floors'),
                            value: this.isAllFloors,
                            onChanged: (bool val) =>
                                setState(() => this.isAllFloors = val)
                          ),
                        ),
                        Visibility(
                          visible: !(this.isPublicEvent || this.isAllFloors),
                          child: FormField(
                            builder: (FormFieldState<List<String>> state ){
                              return Container(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.stretch,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(16, 0, 0, 0),
                                            child: Text('Invited Floors', style: TextStyle(fontSize: 16),),
                                          ),
                                          OutlineButton(
                                              onPressed: () async {
                                                this.temporarySelectedIds = this.floorIds;
                                                List<String> ids = await showDialog<List<String>>(
                                                    context: context,
                                                    builder: (BuildContext context) {
                                                      List<String> allFloorIds = (_authenticationBloc.state as Authenticated).preferences.floorIds;
                                                      return StatefulBuilder(
                                                        builder: (context, setState){
                                                          return AlertDialog(
                                                            title: Text("Choose floors to invite"),
                                                            actions: <Widget>[
                                                              FlatButton(
                                                                onPressed: () {
                                                                  Navigator.pop(context, this.floorIds);
                                                                },
                                                                child: Text("Cancel"),
                                                              ),
                                                              FlatButton(
                                                                onPressed: () {
                                                                  Navigator.pop(context, this.temporarySelectedIds);
                                                                },
                                                                child: Text("Select"),
                                                              ),
                                                            ],
                                                            shape: RoundedRectangleBorder(
                                                                borderRadius: BorderRadius.all(Radius.circular(10.0))
                                                            ),
                                                            content: SingleChildScrollView(
                                                              child: SizedBox(
                                                                  width: 500,
                                                                  height: 400,
                                                                  child: ListView.builder(
                                                                    itemCount: allFloorIds.length,
                                                                    itemBuilder: (BuildContext context, int index){
                                                                      return ListTile(
                                                                        title: Text(allFloorIds[index]),
                                                                        trailing: this.temporarySelectedIds.contains(allFloorIds[index]) ? Icon(Icons.group_add) : null,
                                                                        onTap: (){
                                                                          if(this.temporarySelectedIds.contains(allFloorIds[index])){
                                                                            setState((){
                                                                              this.temporarySelectedIds.remove(allFloorIds[index]);
                                                                            });
                                                                          }
                                                                          else{
                                                                            setState((){
                                                                              this.temporarySelectedIds.add(allFloorIds[index]);
                                                                            });
                                                                          }
                                                                        },
                                                                      );
                                                                    },
                                                                  )
                                                              ),
                                                            ),
                                                          );
                                                        }
                                                      );
                                                    }
                                                );
                                                setState(() {
                                                  this.floorIds = ids;
                                                  this.floorIds.sort((a,b)=> a.compareTo(b));
                                                  state.didChange(this.floorIds);
                                                });
                                              },
                                              child: Text(this.floorIds.length != 0 ? displayIds(this.floorIds) : 'Invite Floors')
                                          ),
                                        ],
                                      ),
                                      Visibility(
                                        visible: state.errorText != null && state.errorText.isNotEmpty,
                                        child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),textAlign: TextAlign.end),
                                      )
                                    ],
                                  )
                              );
                            },
                            validator: (value){
                              if(!(this.isPublicEvent || this.isAllFloors) && (value == null || value.length == 0)){
                                return 'Select at least one floor to invite';
                              }
                              else{
                                return null;
                              }
                            },
                          ),
                        ),
                        Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 16.0, horizontal: 16.0),
                            child: RaisedButton(
                                onPressed: () {
                                  final form = _formKey.currentState;
                                  if (form.validate()) {

                                    _myEventsBloc.add(new CreateEvent(name: nameController.text, details: descriptionController.text, startDate: startDateTime, endDate: endDateTime, location: locationController.text, pointTypeId: pointType.id, floorIds: floorIds, isPublicEvent: isPublicEvent, isAllFloors: isAllFloors, host: hostController.text, virtualLink: virtualLinkController.text));
                                    setState(() {
                                      isLoading = true;
                                    });
                                  }
                                },
                                child: Text('Create')
                            )
                        ),
                      ]
                  )
              )
          )
      );
    }
  }

  DateTime combine(DateTime date, TimeOfDay time) => DateTime(date.year, date.month, date.day, time?.hour ?? 0, time?.minute ?? 0);
  String displayIds(List<String> floorIds) => floorIds.length < 5 ? floorIds.toString().substring(1, floorIds.toString().length-1): floorIds.sublist(0, 4).toString().substring(1, floorIds.sublist(0, 4).toString().length-1) +", ...";
}
