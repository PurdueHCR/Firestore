import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/FindUsersPage/find_users_bloc/find_users.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utility_Views/HouseCodeList.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class EditUserForm extends StatefulWidget {
  final User user;

  const EditUserForm({Key key, this.user}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _EditUserForm();
  }
}

class _EditUserForm extends State<EditUserForm> {
  FindUsersBloc _findUsersBloc;

  bool isEditingFirstName = false;
  bool isEditingLastName = false;

  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

  bool isEnabled = true;
  String firstName = "";
  String lastName = "";
  UserPermissionLevel permissionLevel = UserPermissionLevel.RESIDENT;
  String house = "";
  String floorId = "";

  @override
  void initState() {
    super.initState();
    if (widget.user != null) {
      isEnabled = widget.user.enabled;
      firstName = widget.user.firstName;
      lastName = widget.user.lastName;
      permissionLevel = widget.user.permissionLevel;
      house = widget.user.house;
      floorId = widget.user.floorId;
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_findUsersBloc == null) {
      _findUsersBloc = BlocProvider.of<FindUsersBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.user == null) {
      return Center(
        child: Text("Select a User"),
      );
    } else {
      return SingleChildScrollView(
          child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text("Name", style: TextStyle(fontWeight: FontWeight.bold)),
            Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                child: this.isEditingFirstName
                    ? TextField(
                        controller: firstNameController,
                        maxLines: null,
                        maxLength: 100,
                        textCapitalization: TextCapitalization.words,
                        onEditingComplete: () {
                          FocusScope.of(context).unfocus();
                          setState(() {
                            isEditingFirstName = false;
                            firstName = firstNameController.text;
                            _findUsersBloc.add(UpdateUser(widget.user,
                                first: firstNameController.text));
                          });
                        },
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Flexible(
                            child: Text(
                              firstName,
                              maxLines: null,
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.edit),
                            onPressed: () {
                              setState(() {
                                firstNameController =
                                    TextEditingController(text: firstName);
                                isEditingFirstName = true;
                              });
                            },
                          )
                        ],
                      )),
            Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                child: this.isEditingLastName
                    ? TextField(
                        controller: lastNameController,
                        maxLines: null,
                        maxLength: 100,
                        textCapitalization: TextCapitalization.words,
                        onEditingComplete: () {
                          FocusScope.of(context).unfocus();
                          setState(() {
                            isEditingLastName = false;
                            lastName = lastNameController.text;
                            _findUsersBloc.add(UpdateUser(widget.user,
                                last: lastNameController.text));
                          });
                        },
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Flexible(
                            child: Text(
                              lastName,
                              maxLines: null,
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.edit),
                            onPressed: () {
                              setState(() {
                                lastNameController =
                                    TextEditingController(text: lastName);
                                isEditingLastName = true;
                              });
                            },
                          )
                        ],
                      )),
            Container(
              padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
              child: Text('Permissions and House Details',
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            buildPermissionAndHouse(context),
            Container(
              padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
              child: Text('Controls',
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            SwitchListTile(
                title: const Text('Account is Enabled'),
                value: isEnabled,
                onChanged: (bool val) {
                  if (!val) {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        // return object of type Dialog
                        return AlertDialog(
                          title: new Text(
                              "Are You Sure You Want To Disable This User?"),
                          content: new Text(
                              "If you disable this user, they will not be able to submit points until they are re-enabled."),
                          actions: <Widget>[
                            // usually buttons at the bottom of the dialog
                            new FlatButton(
                              child: new Text("Cancel"),
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                            new FlatButton(
                              child: new Text("Disable"),
                              onPressed: () {
                                Navigator.of(context).pop();
                                setState(() {
                                  isEnabled = val;
                                  _findUsersBloc.add(UpdateUser(widget.user,
                                      enabled: isEnabled));
                                });
                              },
                              textColor: Colors.red,
                            ),
                          ],
                        );
                      },
                    );
                  } else {
                    setState(() {
                      isEnabled = val;
                      _findUsersBloc
                          .add(UpdateUser(widget.user, enabled: isEnabled));
                    });
                  }
                }),
          ],
        ),
      ));
    }
  }

  Widget buildPermissionAndHouse(BuildContext context) {
    return GestureDetector(
      onTap: () {
        showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text("Select A New Permission Level and House"),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10.0))),
                content: SizedBox(
                  width: 500,
                  height: 400,
                  child: FutureBuilder(
                    future: _findUsersBloc.getHouseCodes(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState ==
                          ConnectionState.done) {
                        return HouseCodeList(
                            houseCodes: snapshot.data as List<HouseCode>,
                            onPressed:
                                (BuildContext context, HouseCode code) {
                              Navigator.pop(context);
                              print(code.permissionLevel.toString());
                              print(code.house);
                              print(code.floorId);
                              _findUsersBloc.add(UpdateUser(widget.user,
                                  permissionLevel: code.permissionLevel,
                                  house: code.house,
                                  floorId: code.floorId));
                            });
                      } else {
                        return LoadingWidget();
                      }
                    },
                  ),
                ),
                actions: [
                  FlatButton(
                    child: new Text("Cancel"),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                  ),
                ],
              );
            });
      },
      child: Column(
        children: [
          Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Permission Level"),
              Text(UserPermissionLevelConverter.convertPermissionToString(
                  widget.user.permissionLevel))
            ],
          ),
          ([
            UserPermissionLevel.RESIDENT,
            UserPermissionLevel.RHP,
            UserPermissionLevel.PRIVILEGED_RESIDENT
          ].contains(widget.user.permissionLevel))
              ? Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("House"),
                    Text(widget.user.floorId + '' + widget.user.house)
                  ],
                )
              : SizedBox.shrink()
        ],
      ),
    );
  }
}
