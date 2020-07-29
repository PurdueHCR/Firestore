import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class HouseDescription extends StatefulWidget {
  final House house;
  final UserPermissionLevel permissionLevel;

  const HouseDescription({Key key, this.house, this.permissionLevel})
      : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HouseDescription();
  }
}

class _HouseDescription extends State<HouseDescription> {
  // ignore: close_sinks
  OverviewBloc _overviewBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_overviewBloc == null) {
      _overviewBloc = BlocProvider.of<OverviewBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
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
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(widget.house.description),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(0, 8, 4, 0),
              child: Text("Details",
                  style:
                      TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ),
            Container(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 4),
                child: Column(
                  children: [
                    Visibility(
                      visible: widget.permissionLevel ==
                          UserPermissionLevel.PROFESSIONAL_STAFF,
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
                      visible: widget.permissionLevel ==
                          UserPermissionLevel.PROFESSIONAL_STAFF,
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
              visible: widget.permissionLevel ==
                  UserPermissionLevel.PROFESSIONAL_STAFF,
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RaisedButton(
                    child: Text("Give Award"),
                    onPressed: () {
                      showDialog(
                        barrierDismissible: false,
                          context: context,
                          child: SimpleDialog(
                            title: Text(
                                "Give Award to ${widget.house.name} House"),
                            children: [
                              BlocProvider(
                                builder: (BuildContext context) => _overviewBloc,
                                child: GiveAwardDialogContent(house: widget.house, key: UniqueKey(),),
                              )
                            ],
                          ));
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

}

class GiveAwardDialogContent extends StatefulWidget {
  final House house;

  const GiveAwardDialogContent({Key key, this.house}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _GiveAwardDialogContentState();
  }

}

class _GiveAwardDialogContentState extends State<GiveAwardDialogContent>{

  bool isLoading = false;
  final _formKey = GlobalKey<FormState>();
  TextEditingController nameController = TextEditingController();
  TextEditingController pprController = TextEditingController();
  OverviewBloc _overviewBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_overviewBloc == null) {
      _overviewBloc = BlocProvider.of<OverviewBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if(isLoading){
      return Center(
        child: SizedBox(
            width: 100,
            height: 100,
            child: LoadingWidget()
        ),
      );
    }
    else{
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Builder(
            builder: (context) => Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    decoration: InputDecoration(
                        labelText: 'Enter a description for the award.'),
                    maxLines: null,
                    maxLength: 100,
                    controller: nameController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter a description for the award.';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: InputDecoration(
                        labelText: 'How many points per resident?'),
                    maxLines: null,
                    maxLength: 4,
                    keyboardType: TextInputType.numberWithOptions(),
                    controller: pprController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter how many points this is worth.';
                      }
                      var points = int.tryParse(value);
                      if (points == null) {
                        return "Points per resident must be an integer.";
                      }
                      if (points == 0) {
                        return 'Please enter how many points per resident are required.';
                      }
                      if (points < 0) {
                        return 'Please enter a positive value.';
                      }
                      return null;
                    },
                  ),
                  Row(
                    children: [
                      RaisedButton(
                        child: Text("Cancel"),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                      ),
                      RaisedButton(
                        child: Text("Submit"),
                        onPressed: () {
                          final form = _formKey.currentState;
                          if (form.validate()) {
                            setState(() {
                              isLoading = true;
                            });
                            _overviewBloc.add(GrantAward(
                                nameController.text,
                                widget.house,
                                double.parse(pprController.text)));
                          }
                        },
                      )
                    ],
                  )
                ],
              ),
            )),
      );
    }
  }

}