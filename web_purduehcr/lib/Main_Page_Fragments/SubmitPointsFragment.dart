//import 'package:flutter/cupertino.dart';
//import 'package:flutter/material.dart';
//import 'package:flutter_datetime_picker/flutter_datetime_picker.dart';
//import 'package:purduehcr_web/Models/PointType.dart';
//import 'package:purduehcr_web/Utilities/APIUtility.dart';
//import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
//import 'package:intl/intl.dart';
//
//enum SubmitPointsDisplayState {
//  BOTH,
//  LIST,
//  FORM
//}
//
//class SubmitPointsFragment extends StatefulWidget {
//  @override
//  State<StatefulWidget> createState() {
//
//    return SubmitPointsFragmentState();
//  }
//
//}
//
//class SubmitPointsFragmentState extends State<SubmitPointsFragment> {
//
//  Future<List<PointType>> _getPointTypesFuture;
//  List<PointType> _pointTypes = new List();
//  int _selectedIndex = 0;
//  DateTime _selectedDate;
//  SubmitPointsDisplayState _displayState;
//  TextEditingController _descriptionController =  new TextEditingController();
//  bool shouldRefreshList = true;
//
//  bool _dateSubmissionError = false;
//  bool _descriptionSubmissionError = false;
//
//
//  @override
//  void initState() {
//    super.initState();
//    _getPointTypesFuture = getPointTypes();
//
//    //Without knowing the screen dimensions, default state to LIST
//    _displayState = SubmitPointsDisplayState.LIST;
//  }
//
//
//  Future<List<PointType>> getPointTypes(){
//    setState(() {
//      shouldRefreshList = false;
//    });
//    return APIUtility.getPointTypes().then((pointTypes){
//      setState(() {
//        _pointTypes = pointTypes;
//      });
//      return Future.value(_pointTypes);
//    });
//  }
//
//  @override
//  Widget build(BuildContext context) {
//
//    if(!isDisplaySmallDesktop(context)  && isDisplayDesktop(context)){
//      //If the display is large enough, display state is both
//      _displayState = SubmitPointsDisplayState.BOTH;
//    }
//    else if(_displayState == SubmitPointsDisplayState.BOTH){
//      //If the display is not large enough and the state is BOTH, set to LIST
//      _displayState = SubmitPointsDisplayState.LIST;
//    }
//
//    Widget child;
//    if(_displayState == SubmitPointsDisplayState.LIST){
//      child = buildPointTypeList();
//    }
//    else if(_displayState == SubmitPointsDisplayState.FORM){
//      child = buildPointSubmissionForm(context);
//    }
//    else{
//      child = Row(
//
//        children: <Widget>[
//          Flexible(
//            flex: 6,
//            child: Container(
//              decoration: BoxDecoration(
//                border: Border(
//                  right: BorderSide(
//                    color:Colors.black,
//                    width: 1
//                  )
//                )
//              ),
//              child: buildPointTypeList(),
//            ),
//          ),
//          Flexible(
//            flex: 4,
//            child: buildPointSubmissionForm(context),
//          )
//
//        ],
//      );
//    }
//
//    return SafeArea(
//        child: child
//    );
//  }
//
//  /// Return a widget that has all of the point types in a list
//  Widget buildPointTypeList(){
//    //If _pointTypes is null, then create a future builder to display loading and to query API
//    if(shouldRefreshList){
//      print("Rebuilding");
//      return FutureBuilder(
//        future: _getPointTypesFuture,
//        builder: (context, snapshot) {
//          if(snapshot.hasError){
//            return Text("Error: "+snapshot.error.toString());
//          }
//          else if(snapshot.hasData){
//            return createPointTypeListBuilder(context, snapshot.data);
//          }
//
//          else{
//            return CircularProgressIndicator();
//          }
//        },
//      );
//    }
//    else{
//      //If _pointTypes is not null, create a list using this data
//      return createPointTypeListBuilder(context, _pointTypes);
//    }
//
//  }
//
//  Widget createPointTypeListBuilder(BuildContext context, List<PointType> data){
//    if(data == null){
//      return  CircularProgressIndicator();
//    }
//    else{
//      return ListView.builder(
//          itemCount: data.length,
//          itemBuilder: (context, index){
//            return Card(
//              child: ListTile(
//                title: Text(_pointTypes[index].name),
//                trailing: Text(_pointTypes[index].value.toString()),
//                selected: _displayState == SubmitPointsDisplayState.BOTH && (_selectedIndex == index),
//                onTap: (){
//                  setState(() {
//                    if(_displayState == SubmitPointsDisplayState.LIST){
//                      //if the screen is only display the list
//                      _displayState = SubmitPointsDisplayState.FORM;
//                    }
//                    _selectedDate = null;
//                    _dateSubmissionError = false;
//                    _descriptionSubmissionError = false;
//                    _selectedIndex = index;
//                  });
//                },
//              ),
//            );
//          }
//      );
//    }
//  }
//
//  /// Return a widget that handles submission of a point type
//  Widget buildPointSubmissionForm(context){
//    if(_pointTypes.length <= 0){
//      return Text("Loading");
//    }
//    return Column(
//      mainAxisAlignment: MainAxisAlignment.start,
//      crossAxisAlignment: CrossAxisAlignment.start,
//      children: <Widget>[
//        Padding(
//          padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
//          child: Text(_pointTypes[_selectedIndex].name,
//            textAlign: TextAlign.start,
//            style: TextStyle(
//              fontSize: 24,
//              fontWeight: FontWeight.bold,
//            ),
//          ),
//        ),
//        Padding(
//          padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
//          child: Text(_pointTypes[_selectedIndex].description),
//        ),
//        Padding(
//          padding: EdgeInsets.fromLTRB(8, 0, 8, 8),
//          child: Column(
//            crossAxisAlignment: CrossAxisAlignment.start,
//            children: <Widget>[
//              Text("Date Occurred"),
//              ButtonTheme(
//                minWidth: double.infinity,
//                child: FlatButton(
//                  color: !_dateSubmissionError? Colors.transparent: Color.fromARGB(255, 0xff, 0x72, 0x72),
//                  shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
//                  onPressed: () {
//                    showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime(2019), lastDate: DateTime(2022)).then((date){
//                      setState(() {
//                        _selectedDate = date;
//                      });
//                    });
//                  },
//                  child: _selectedDate == null? null:
//                  Text( DateFormat.yMd('en_US').format(_selectedDate),
//                    textAlign: TextAlign.start,),
//                ),
//              ),
//            ],
//          )
//        ),
//        Padding(
//            padding: EdgeInsets.fromLTRB(8, 0, 8, 8),
//            child: Column(
//              crossAxisAlignment: CrossAxisAlignment.start,
//              children: <Widget>[
//                Text("Description"),
//                TextField(
//                  decoration: InputDecoration(
//                      filled: true,
//                      fillColor: !_descriptionSubmissionError? Colors.transparent: Color.fromARGB(255, 0xff, 0x72, 0x72),
//                      border: OutlineInputBorder(),
//                    ),
//                  keyboardType: TextInputType.multiline,
//                  maxLines: null,
//                  controller: _descriptionController,
//                ),
//              ],
//            )
//        ),
//
//        Padding(
//          padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
//          child: (_displayState == SubmitPointsDisplayState.BOTH) ? ButtonTheme(
//              minWidth: double.infinity,
//              child: RaisedButton(
//                  onPressed: () {
//                    submitPoint();
//                    setState(() {
//                      _displayState  =  SubmitPointsDisplayState.LIST;
//                    });
//                  },
//                  child: Text(
//                    'Submit Point',
//                    style: TextStyle(color: Colors.white),
//                  )
//              )
//          ) :
//              Row(
//                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                children: <Widget>[
//                  RaisedButton(
//                    onPressed: () {
//                      print("Back");
//                      setState(() {
//                        _displayState  =  SubmitPointsDisplayState.LIST;
//                      });
//                    },
//                    child: Text(
//                      'Back',
//                      style: TextStyle(color: Colors.white),
//                    ),
//                    color: Colors.red,
//                  ),
//                  RaisedButton(
//                    onPressed: () {
//                      submitPoint();
//                      setState(() {
//                        _displayState  =  SubmitPointsDisplayState.LIST;
//                      });
//                    },
//                    child: Text(
//                      'Submit Point',
//                      style: TextStyle(color: Colors.white),
//                    ),
//                    color: Colors.blue,
//                  )
//                ],
//              )
//        )
//      ],
//    );
//  }
//
//  void submitPoint(){
//    print("Called point submiission");
//    _dateSubmissionError = false;
//    _descriptionSubmissionError = false;
//
//    if(_selectedDate == null || _descriptionController.text.isEmpty || _descriptionController.text.length > 250){
//      setState(() {
//        _dateSubmissionError = (_selectedDate == null);
//        _descriptionSubmissionError = _descriptionController.text.isEmpty || _descriptionController.text.length > 250;
//        print("Date submission error: "+_dateSubmissionError.toString());
//        print("Description error: "+_descriptionSubmissionError.toString());
//      });
//    }
//    else{
//      APIUtility.submitPoint(_descriptionController.text, _selectedDate, _pointTypes[_selectedIndex].id.toString()).then((value) {
//        print("Success submitting points");
//        setState(() {
//          _selectedDate = null;
//          _descriptionController.text = "";
//        });
//      })
//      .catchError((error){
//        print("error"+error.toString());
//      });
//    }
//  }
//}