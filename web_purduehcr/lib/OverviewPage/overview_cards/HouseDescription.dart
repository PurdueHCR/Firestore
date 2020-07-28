import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

class HouseDescription extends StatefulWidget{

  final House house;
  final UserPermissionLevel permissionLevel;

  const HouseDescription({Key key, this.house, this.permissionLevel}) : super(key: key);

  
  @override
  State<StatefulWidget> createState() {
    return _HouseDescription();
  }

}

class _HouseDescription extends State<HouseDescription>{
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          SizedBox(
            width: 100,
            height: 100,
            child: Image.network(widget.house.downloadURL),
          ),
          Text("Description"),
          Text("Create a description for all of the houses"),
          Text("Details"),
          Visibility(
            visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
            child: Text("Num Res: "+widget.house.numberOfResidents.toString()),
          ),
          Visibility(
            visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
            child: Text("Total Points: "+widget.house.totalPoints.toString()),
          ),
          Text("Points Per Resident: "+widget.house.pointsPerResident.toString()),
          Visibility(
            visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
            child: RaisedButton(
              child: Text("Give Award"),
            ),
          ),
        ],
      ),
    );
  }

}