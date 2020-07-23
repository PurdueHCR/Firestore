import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';
import 'package:purduehcr_web/PointTypesPage/point_type_control_bloc/point_type_control.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';

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

  bool isEditingDescription = false;
  bool isEditingName = false;
  bool isEditingValue = false;

  TextEditingController descriptionController = TextEditingController();
  TextEditingController nameController = TextEditingController();
  TextEditingController valueController = TextEditingController();

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
              Text("Name",
                  style: TextStyle(fontWeight: FontWeight.bold)
              ),
              Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                  child: this.isEditingName ?
                  TextField(
                    controller: nameController,
                    maxLines: null,
                    maxLength: 100,
                    onEditingComplete: (){
                      FocusScope.of(context).unfocus();
                      setState(() {
                        isEditingName = false;
                        name = nameController.text;
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, name: nameController.text));
                      });
                    },
                  ) :
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Flexible(child: Text(name, maxLines: null,),),
                      IconButton(
                        icon: Icon(Icons.edit),
                        onPressed: (){
                          setState(() {
                            nameController = TextEditingController(text: widget.pointType.name);
                            isEditingName = true;
                          });
                        },
                      )
                    ],
                  )
              ),
              Text(
                  "Description",
                  style: TextStyle(fontWeight: FontWeight.bold)
              ),
              Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                  child: this.isEditingDescription ?
                  TextField(
                    controller: descriptionController,
                    maxLines: null,
                    maxLength: 400,
                    onEditingComplete: (){
                      FocusScope.of(context).unfocus();
                      setState(() {
                        isEditingDescription = false;
                        description = descriptionController.text;
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, description: descriptionController.text));
                      });
                    },
                  ) :
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Flexible(child: Text(description, maxLines: null,)),
                      IconButton(
                        icon: Icon(Icons.edit),
                        onPressed: (){
                          setState(() {
                            descriptionController = TextEditingController(text: widget.pointType.description);
                            isEditingDescription = true;
                          });
                        },
                      )
                    ],
                  )
              ),
              Text("How Many Points is This Worth",
                  style: TextStyle(fontWeight: FontWeight.bold)
              ),
              Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                  child: this.isEditingValue ?
                  TextField(
                    controller: valueController,
                    maxLines: null,
                    maxLength: 4,
                    keyboardType: TextInputType.numberWithOptions(),
                    onEditingComplete: (){
                      FocusScope.of(context).unfocus();
                      setState(() {
                        isEditingValue = false;
                        value = int.parse(valueController.text);
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, value: value));
                      });
                    },
                  ) :
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Flexible(child: Text("$value", maxLines: null,)),
                      IconButton(
                        icon: Icon(Icons.edit),
                        onPressed: (){
                          setState(() {
                            valueController = TextEditingController(text: widget.pointType.value.toString());
                            isEditingValue = true;
                          });
                        },
                      )
                    ],
                  )
              ),
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
              Container(
                padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                child: Text('Controls', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              SwitchListTile(
                  title: const Text('Residents have to scan this through a QR Code, Link, or Event'),
                  value: !residentsCanSubmit,
                  onChanged: (bool val) =>
                      setState(() {
                        residentsCanSubmit = !val;
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, residentsCanSubmit: residentsCanSubmit));
                      }
                      )
              ),
              SwitchListTile(
                  title: const Text('Enabled'),
                  value: isEnabled,
                  onChanged: (bool val) =>
                      setState(() {
                        isEnabled = val;
                        _pointTypeControlBloc.add(UpdatePointType(widget.pointType, isEnabled: isEnabled));
                      })
              ),
            ],
          ),
        ),
      );
    }
  }

}