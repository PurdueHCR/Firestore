
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:purduehcr_web/Main_App_Pages/MyEventsPage/my_events_bloc/my_events.dart';
import 'package:purduehcr_web/Models/Event.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utility_Views/EditTextField.dart';
import 'package:purduehcr_web/Utility_Views/FormSection.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

class EditEventForm extends StatefulWidget{
  final Event event;
  EditEventForm({Key key, this.event}):super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _EditEventFormState();
  }

}

class _EditEventFormState extends State<EditEventForm> {

  Config config;

  DateTime startDateTime;
  DateTime endDateTime;
  PointType pointType;
  List<String> floorIds = new List<String>();
  List<String> temporarySelectedIds = new List<String>();
  bool isPublicEvent = false;
  bool isAllFloors = false;
  Future<List<PointType>> getPointTypes;

  bool isLoading = false;


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
      floorIds = (_authenticationBloc.state as Authenticated).house != null ? (_authenticationBloc.state as Authenticated).house.floorIds : [];
      this.floorIds.sort((a,b)=> a.compareTo(b));
    }
    if(_myEventsBloc != null && this.getPointTypes == null){
      this.getPointTypes = _myEventsBloc.getPointTypes();
    }
    if(widget.event != null){
      this.startDateTime =  widget.event.startDate;
      print('START DATE TIME: '+this.widget.event.startDate.toIso8601String());
      this.endDateTime =  widget.event.endDate;
      this.pointType =  widget.event.getPointType();
      this.floorIds = widget.event.floorIds;
      this.isPublicEvent = widget.event.isPublicEvent;
      this.isAllFloors = widget.event.floorIds.length == _authenticationBloc.state.preferences.floorIds.length;
    }
  }

  @override
  Widget build(BuildContext context) {
    if(isLoading){
      return LoadingWidget();
    }
    else if(widget.event == null){
      return Center(
        child: Text("Select an event to view")
      );
    }
    else{
      return Container(
          padding:
          const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FormSection(
                  key: UniqueKey(),
                  label: "Event Details",
                  children: [
                    EditTextField(
                      maxLength: 250,
                      initialText: widget.event.name,
                      label: "Event Name",
                      onSubmit: (value){
                        _myEventsBloc.add(UpdateEvent(widget.event, name:value));
                      },
                    ),
                    EditTextField(
                      maxLength: 250,
                      initialText: widget.event.details,
                      label: "Event Description",
                      onSubmit: (value){
                        _myEventsBloc.add(UpdateEvent(widget.event, details:value));
                      },
                    ),
                    EditTextField(
                      maxLength: 250,
                      initialText: widget.event.host,
                      label: "Event Host",
                      onSubmit: (value){
                        _myEventsBloc.add(UpdateEvent(widget.event, host:value));
                      },
                    ),
                  ],
                ),
                FormSection(
                  key: UniqueKey(),
                  label: "Time and Location",
                  children: [
                    Container(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text("Start Date", style: TextStyle(fontWeight: FontWeight.bold)),
                            ButtonTheme(
                              child: FlatButton(
                                shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
                                onPressed: () async {
                                  final date = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: endDateTime);
                                  final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(DateTime(DateTime.now().year,DateTime.now().month, DateTime.now().day, DateTime.now().hour) ));
                                  setState(() {
                                    startDateTime = combine(date, time);
                                    _myEventsBloc.add(UpdateEvent(widget.event, startDate:startDateTime));
                                  });
                                },
                                child: startDateTime == null ? Text(""):
                                Text( DateFormat("MMM d, h:mm a").format(startDateTime),
                                  textAlign: TextAlign.start,),
                              ),
                            ),
                          ],
                        )
                    ),
                    Container(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text("End Date", style: TextStyle(fontWeight: FontWeight.bold)),
                            ButtonTheme(
                              child: FlatButton(
                                shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
                                onPressed: () async {
                                  final date = await showDatePicker(context: context, initialDate: startDateTime.add(Duration(hours:1)), firstDate: startDateTime.add(Duration(hours:1)), lastDate: DateTime.now().add(Duration(days:365)));
                                  final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(DateTime(DateTime.now().year,DateTime.now().month, DateTime.now().day, DateTime.now().hour) ));
                                  endDateTime = combine(date, time);
                                  _myEventsBloc.add(UpdateEvent(widget.event, endDate:endDateTime));
                                },
                                child: endDateTime == null ? Text(""):
                                Text( DateFormat("MMM d, h:mm a").format(endDateTime),
                                  textAlign: TextAlign.start,),
                              ),
                            ),
                          ],
                        )
                    ),
                    EditTextField(
                      maxLength: 250,
                      initialText: widget.event.location,
                      label: "Event Location",
                      onSubmit: (value){
                        _myEventsBloc.add(UpdateEvent(widget.event, location:value));
                      },
                    ),
                    EditTextField(
                      maxLength: 250,
                      initialText: widget.event.virtualLink,
                      label: "Event Virtual Link",
                      onSubmit: (value){
                        _myEventsBloc.add(UpdateEvent(widget.event, virtualLink:value));
                      },
                    )
                  ],
                ),
                FormSection(
                  key: UniqueKey(),
                  label: "Competition Details",
                  children: [
                    Container(
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
                                        if(pt != null){
                                          this.pointType = pt;
                                          _myEventsBloc.add(UpdateEvent(widget.event, pointTypeId:pointType.id));
                                        }
                                      });

                                    },
                                    child: Text(this.pointType != null ? this.pointType.name : 'Select')
                                ),
                              ],
                            )
                          ],
                        )
                    ),
                    SwitchListTile(
                        title: const Text('Public Event'),
                        value: this.isPublicEvent,
                        onChanged: (bool val) async {
                          this.isPublicEvent = val;
                          if(!val){
                            List<String> ids = await getFloorIds(_authenticationBloc.state.preferences.floorIds);
                            setState(() {
                              if(ids != null && ids.length > 0){
                                this.floorIds = ids;
                                if(this.floorIds.length == _authenticationBloc.state.preferences.floorIds.length){
                                  this.isAllFloors = true;
                                }
                                else{
                                  this.isAllFloors = false;
                                }
                                _myEventsBloc.add(UpdateEvent(widget.event, floorIds:this.floorIds, isPublicEvent: val, isAllFloors:this.isAllFloors));
                                this.isPublicEvent = val;
                              }
                              else{
                                this.isPublicEvent = !val;
                              }
                            });
                          }
                          else{
                            setState(() {
                              this.isAllFloors = val;
                            });
                            _myEventsBloc.add(UpdateEvent(widget.event, isPublicEvent:val));
                          }
                        }
                    ),
                    Visibility(
                      visible: !this.isPublicEvent,
                      child: SwitchListTile(
                          title: const Text('Invite All Floors'),
                          value: this.isAllFloors,
                          onChanged: (bool val) async {
                            if(!val){
                              List<String> ids = await getFloorIds([]);
                              setState(() {
                                if(ids != null && ids.length > 0){
                                  this.floorIds = ids;
                                  _myEventsBloc.add(UpdateEvent(widget.event, floorIds:this.floorIds, isAllFloors: val));
                                  this.isAllFloors = val;
                                }
                                else{
                                  this.isAllFloors = !val;
                                }
                              });
                            }
                            else{
                              setState(() {
                                this.isAllFloors = val;
                              });
                              _myEventsBloc.add(UpdateEvent(widget.event, isAllFloors:val));
                            }
                          }
                      ),
                    ),
                    Visibility(
                        visible: !(this.isPublicEvent || this.isAllFloors),
                        child: Container(
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
                                          List<String> ids = await getFloorIds(this.floorIds);
                                          setState(() {
                                            if(ids != null && ids.length > 0){
                                              this.floorIds = ids;
                                              this.floorIds.sort((a,b)=> a.compareTo(b));
                                              _myEventsBloc.add(UpdateEvent(widget.event, floorIds:this.floorIds));
                                            }
                                          });
                                        },
                                        child: Text(this.floorIds.length != 0 ? displayIds(this.floorIds) : 'Invite Floors')
                                    ),
                                  ],
                                )
                              ],
                            )
                        )
                    )
                  ],
                )
              ]
          )
      );
    }
  }

  Future<List<String>> getFloorIds(List<String> initialIds) async{
    this.temporarySelectedIds = cloneArray(initialIds);
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
                        Navigator.pop(context, initialIds);
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
    ids.sort((a,b)=> a.compareTo(b));
    return ids;
  }

  DateTime combine(DateTime date, TimeOfDay time) => DateTime(date.year, date.month, date.day, time?.hour ?? 0, time?.minute ?? 0);
  String displayIds(List<String> floorIds) => floorIds.length < 5 ? floorIds.toString().substring(1, floorIds.toString().length-1): floorIds.sublist(0, 4).toString().substring(1, floorIds.sublist(0, 4).toString().length-1) +", ...";
  List<String> cloneArray(List<String> list){
    List<String> items = new List<String>();
    list.forEach((element) {items.add(element);});
    return items;
  }
}
