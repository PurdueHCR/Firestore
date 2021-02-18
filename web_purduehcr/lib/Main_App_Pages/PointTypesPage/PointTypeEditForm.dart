import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/PointTypesPage/point_type_control_bloc/point_type_control.dart';
import 'package:purduehcr_web/Utility_Views/EditTextField.dart';
import 'package:purduehcr_web/Utility_Views/FormSection.dart';

class PointTypeEditForm extends StatefulWidget{

  final PointType pointType;

  const PointTypeEditForm({Key key, this.pointType}):super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _PointTypeEditFormState();
  }

}

class _PointTypeEditFormState extends State<PointTypeEditForm>{

  // because it is created in another file
  // ignore: close_sinks
  PointTypeControlBloc _pointTypeControlBloc;


  bool isEnabled = false;
  bool residentsCanSubmit = false;
  int value = 0;
  PointTypePermissionLevel permissionLevel = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
  String description = "";
  String name = "";



  @override
  void initState() {
    super.initState();
    if(widget.pointType != null){
      isEnabled = widget.pointType.enabled;
      residentsCanSubmit = widget.pointType.canResidentsSubmit;
      value = widget.pointType.value;
      permissionLevel = widget.pointType.permissionLevel;
      description = widget.pointType.description;
      name = widget.pointType.name;
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_pointTypeControlBloc == null){
      _pointTypeControlBloc = BlocProvider.of<PointTypeControlBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if(widget.pointType == null){
      return Center(
          child: Text("Select a Point Category")
      );
    }
    else {
      return SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              FormSection(
                label: "Point Category Details",
                children: [
                  EditTextField(
                    label: "Name",
                    maxLength: 250,
                    initialText: name,
                    onSubmit: (String name){
                      _pointTypeControlBloc.add(UpdatePointType(widget.pointType, name: name));
                    },
                  ),
                  EditTextField(
                    label: "Description",
                    maxLength: 250,
                    initialText: description,
                    onSubmit: (String description){
                      _pointTypeControlBloc.add(UpdatePointType(widget.pointType, description: description));
                    },
                  ),
                  EditTextField(
                    label: "Point Value",
                    maxLength: 250,
                    initialText: value.toString(),
                    onSubmit: (String value){
                      _pointTypeControlBloc.add(UpdatePointType(widget.pointType, value: int.parse(value)));
                    },
                  ),
                ],
              ),
              FormSection(
                label: "Permissions and Controls",
                children: [
                  Container(
                    padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                    child: Text('Who is allowed to make this into a Link, QR code, or Event?', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  Column(
                    children: [
                      (permissionLevel == PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY)?
                      RaisedButton(
                        child: Text("Professional Staff Only"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      )
                          :
                      OutlineButton(
                        child: Text("Professional Staff Only"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      ),
                      (permissionLevel == PointTypePermissionLevel.PROFESSIONAL_AND_RHPS)?
                      RaisedButton(
                        child: Text("Residential Life Staff Only"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.PROFESSIONAL_AND_RHPS;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      )
                          :
                      OutlineButton(
                        child: Text("Residential Life Staff Only"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.PROFESSIONAL_AND_RHPS;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      ),
                      (permissionLevel == PointTypePermissionLevel.ALL)?
                      RaisedButton(
                        child: Text("All Non Residents"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.ALL;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      )
                          :
                      OutlineButton(
                        child: Text("All Non Residents"),
                        onPressed: (){
                          setState(() {
                            permissionLevel = PointTypePermissionLevel.ALL;
                            _pointTypeControlBloc.add(UpdatePointType(widget.pointType, permissionLevel: permissionLevel));
                          });
                        },
                      ),
                    ],
                  ),
                  SwitchListTile(
                      title: Text('Residents have to scan this through a QR Code, Link, or Event'),
                      value: !residentsCanSubmit,
                      onChanged: (bool val){
                        setState(() {
                          residentsCanSubmit = !val;
                        });
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, residentsCanSubmit: !val));
                      }

                  ),
                  SwitchListTile(
                      title: Text('Enabled'),
                      value: isEnabled,
                      onChanged: (bool val) {
                        setState(() {
                          isEnabled = val;
                        });
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, isEnabled: val));
                      }

                  ),
                ],
              )
            ],
          ),
        ),
      );
    }
  }

}