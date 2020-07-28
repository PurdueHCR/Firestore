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
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 100,
                    height: 100,
                    child: Image.network(widget.house.downloadURL),
                  ),
                ],
              ),
              Text("Description",
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold
                  )
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Text(widget.house.description),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(0, 8, 4, 0),
                child: Text("Details",
                    style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold
                  )
                ),
              ),
              Container(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 4),
                  child: Column(
                    children: [
                      Visibility(
                        visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Number of Residents"),
                            Text(widget.house.numberOfResidents.toString())
                          ],
                        ),
                      ),
                      Visibility(
                        visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Total Points"),
                            Text(widget.house.totalPoints.toString())
                          ],
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("Points Per Resident: "),
                          Text(widget.house.pointsPerResident.toString())
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              Visibility(
                visible: widget.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF,
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    RaisedButton(
                      child: Text("Give Award"),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

}