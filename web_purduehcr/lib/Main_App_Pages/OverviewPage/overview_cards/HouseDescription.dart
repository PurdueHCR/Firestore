import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview.dart';
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

  bool isEditingHouseDescription;
  bool isEditingNumberOfResidents;

  TextEditingController descriptionController = TextEditingController();
  TextEditingController numResController = TextEditingController();

  String description;
  int numberOfResidents;

  final _descriptionFormKey = GlobalKey<FormState>();
  final _residentsKey = GlobalKey<FormState>();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_overviewBloc == null) {
      _overviewBloc = BlocProvider.of<OverviewBloc>(context);
      isEditingHouseDescription = false;
      isEditingNumberOfResidents = false;
      description = widget.house.description;
      numberOfResidents = widget.house.numberOfResidents;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: SingleChildScrollView(
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
                child: buildDescriptionEditable(),
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
                  child: buildDetails(),
                ),
              ),
              Visibility(
                visible: widget.permissionLevel ==
                    UserPermissionLevel.PROFESSIONAL_STAFF,
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      child: Text("Give Award"),
                      onPressed: () {
                        showDialog(
                            barrierDismissible: false,
                            context: context,
                            builder: (BuildContext context) {
                              return SimpleDialog(
                                title: Text(
                                    "Give Award to ${widget.house.name} House"),
                                children: [
                                  BlocProvider(
                                    builder: (BuildContext context) =>
                                        _overviewBloc,
                                    child: GiveAwardDialogContent(
                                      house: widget.house,
                                      key: UniqueKey(),
                                    ),
                                  )
                                ],
                              );
                            });
                      },
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

  Widget buildDetails() {
    if (widget.permissionLevel != UserPermissionLevel.PROFESSIONAL_STAFF) {
      return Text(widget.house.description);
    } else if (isEditingNumberOfResidents) {
      return Form(
        key: _residentsKey,
        child: TextFormField(
          decoration: InputDecoration(
              labelText: 'How many residents are in this house?'),
          maxLength: 3,
          keyboardType: TextInputType.numberWithOptions(),
          controller: numResController,
          onEditingComplete: () {
            final form = _residentsKey.currentState;
            if (form.validate()) {
              setState(() {
                isEditingNumberOfResidents = false;
                numberOfResidents = int.parse(numResController.text);
                _overviewBloc.add(UpdateHouse(widget.house,
                    numberOfResidents: numberOfResidents));
              });
            }
          },
          validator: (value) {
            if (value.isEmpty) {
              return 'Please enter how many residents there are.';
            }
            var points = int.tryParse(value);
            if (points == null) {
              return "Number of residents must be an integer.";
            }
            if (points == 0) {
              return 'Please enter how many residents there are.';
            }
            if (points < 0) {
              return 'Please enter a positive value.';
            }
            return null;
          },
        ),
      );
    } else {
      return Row(
        children: [
          Flexible(
            flex: 8,
            child: Column(
              children: [
                Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Number of Residents"),
                    Text(numberOfResidents.toString())
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Total Points"),
                    Text(widget.house.totalPoints.toString())
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Points Per Resident: "),
                    Text(widget.house.pointsPerResident.toStringAsFixed(2))
                  ],
                ),
              ],
            ),
          ),
          Flexible(
            flex: 1,
            child: IconButton(
              icon: Icon(Icons.edit),
              onPressed: () {
                setState(() {
                  isEditingNumberOfResidents = true;
                  numResController.text = numberOfResidents.toString();
                });
              },
            ),
          )
        ],
      );
    }
  }

  Widget buildDescriptionEditable() {
    if (widget.permissionLevel != UserPermissionLevel.PROFESSIONAL_STAFF) {
      return Text(widget.house.description);
    } else if (isEditingHouseDescription) {
      return Form(
        key: _descriptionFormKey,
        child: TextFormField(
          decoration:
              InputDecoration(labelText: 'Enter a description for this house.'),
          maxLength: 250,
          controller: descriptionController,
          onEditingComplete: () {
            final form = _descriptionFormKey.currentState;
            if (form.validate()) {
              setState(() {
                isEditingHouseDescription = false;
                description = descriptionController.text;
                _overviewBloc
                    .add(UpdateHouse(widget.house, description: description));
              });
            }
          },
          validator: (value) {
            if (value.isEmpty) {
              return 'House description can not be empty.';
            }
            return null;
          },
        ),
      );
    } else {
      return Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(flex: 8, child: Text(description)),
          Flexible(
            flex: 1,
            child: IconButton(
              icon: Icon(Icons.edit),
              onPressed: () {
                setState(() {
                  isEditingHouseDescription = true;
                  descriptionController.text = description;
                });
              },
            ),
          )
        ],
      );
    }
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

class _GiveAwardDialogContentState extends State<GiveAwardDialogContent> {
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
    if (isLoading) {
      return Center(
        child: SizedBox(width: 100, height: 100, child: LoadingWidget()),
      );
    } else {
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
