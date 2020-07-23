import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class PointSubmissionForm extends StatefulWidget{
  final PointType pointType;
  final Function(String description,DateTime dateOccurred,int pointTypeId) onSubmit;
  const PointSubmissionForm({Key key, this.pointType, this.onSubmit}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PointSubmissionFormState();
  }

}

class _PointSubmissionFormState extends State<PointSubmissionForm>{
  DateTime _selectedDate;
  bool isLoading = false;
  bool _descriptionSubmissionError = false;
  bool _dateSubmissionError = false;

  TextEditingController _descriptionController = new TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if(widget.pointType == null){
      return Text("Select a Point Category");
    }
    else if( isLoading){
      return LoadingWidget();
    }
    else {
      return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
          child: Text(widget.pointType.name,
            textAlign: TextAlign.start,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
          child: Text(widget.pointType.description),
        ),
        Padding(
            padding: EdgeInsets.fromLTRB(8, 0, 8, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text("Date Occurred"),
                ButtonTheme(
                  minWidth: double.infinity,
                  child: FlatButton(
                    color: !_dateSubmissionError? Colors.transparent: Color.fromARGB(255, 0xff, 0x72, 0x72),
                    shape: RoundedRectangleBorder(side: BorderSide(color: Colors.black, width: 1) ),
                    onPressed: () {
                      DateTime now = DateTime.now();
                      DateTime start;
                      if(now.month >= 8){
                        start = DateTime(now.year, 8);
                      }
                      else{
                        start = DateTime(now.year, 0);
                      }
                      showDatePicker(context: context, initialDate: now, firstDate: start, lastDate: now).then((date){
                        setState(() {
                          _selectedDate = date;
                          _dateSubmissionError = false;
                        });
                      });

                    },
                    child: _selectedDate == null? null:
                    Text( DateFormat.yMd('en_US').format(_selectedDate),
                      textAlign: TextAlign.start,),
                  ),
                ),
              ],
            )
        ),
        Padding(
            padding: EdgeInsets.fromLTRB(8, 0, 8, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text("Description"),
                TextField(
                  maxLength: 100,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: !_descriptionSubmissionError? Colors.transparent: Color.fromARGB(255, 0xff, 0x72, 0x72),
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  controller: _descriptionController,
                  onChanged: (_){
                    setState(() {
                      _descriptionSubmissionError = false;
                    });
                  },
                ),
              ],
            )
        ),

        Padding(
            padding: EdgeInsets.fromLTRB(8, 8, 8, 8),
            child:ButtonTheme(
                minWidth: double.infinity,
                child: RaisedButton(
                    onPressed: _onSubmit,
                    child: Text(
                      'Submit Point',
                      style: TextStyle(color: Colors.white),
                    )
                )
            )
        )
      ],
      );
    }
  }

  _onSubmit(){
    setState(() {
      if(_selectedDate == null || _descriptionController.text.isEmpty){
        _dateSubmissionError = _selectedDate == null;
        _descriptionSubmissionError = _descriptionController.text.isEmpty;
      }
      else{
        isLoading = true;
        widget.onSubmit(_descriptionController.text,_selectedDate, widget.pointType.id);
      }
    });
  }

}