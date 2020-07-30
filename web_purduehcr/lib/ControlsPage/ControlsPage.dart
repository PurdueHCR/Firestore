import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/ControlsPage/control_bloc/control.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';

class ControlsPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _ControlsPageState("Controls");
  }

}

class _ControlsPageState extends BasePageState<ControlBloc, ControlEvent, ControlState>{

  ControlBloc _controlBloc;
  TextEditingController competitionHiddenController = TextEditingController();
  TextEditingController competitionDisabledController = TextEditingController();

  bool isChangingCompetitionHiddenText = false;
  bool isChangingCompetitionDisabledText = false;

  bool isCompetitionVisible;
  bool isCompetitionEnabled;
  bool isShowingRewards;
  String competitionDisabledMessage;
  String competitionHiddenMessage;



  _ControlsPageState(String drawerLabel) : super(drawerLabel);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_controlBloc == null){
      Config config = ConfigWrapper.of(context);
      _controlBloc = new ControlBloc(config: config);
      _controlBloc.add(ControlInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, ControlState state}) {
    return buildBody(context: context, state: state);
  }

  @override
  Widget buildMobileBody({BuildContext context, ControlState state}) {
    return buildBody(context: context, state: state);
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, ControlState state}) {
    return buildBody(context: context, state: state);
  }

  @override
  ControlBloc getBloc() {
    return _controlBloc;
  }

  @override
  bool isLoadingState(ControlState currentState) {
    return currentState is ControlPageLoading;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

  Widget buildBody({BuildContext context, ControlState state}){
    if(state is ControlInitializeError){
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text("Failed to download settings.")
        ],
      );
    }
    else{
      _onChangeState(context, state);
      if(this.competitionDisabledMessage == null){
        this.isCompetitionVisible = state.settings.isCompetitionVisible;
        this.isCompetitionEnabled = state.settings.isCompetitionEnabled;
        this.competitionDisabledMessage = state.settings.competitionDisabledMessage;
        this.competitionHiddenMessage = state.settings.competitionHiddenMessage;
        this.isShowingRewards = state.settings.showRewards;
      }

      return Column(
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("House Settings"),
                  SwitchListTile(
                    title: Text("Competition Enabled"),
                    value: this.isCompetitionEnabled,
                    onChanged: (val){
                      setState(() {
                        this.isCompetitionEnabled = val;
                        _controlBloc.add(UpdateSettings(isCompetitionEnabled: val));
                      });
                    },
                  ),
                  Visibility(
                    visible: !this.isCompetitionEnabled,
                    child: Padding(
                        padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                        child: this.isChangingCompetitionDisabledText ?
                        TextField(
                          controller: competitionDisabledController,
                          maxLength: 250,
                          onEditingComplete: (){
                            FocusScope.of(context).unfocus();
                            setState(() {
                              isChangingCompetitionDisabledText = false;
                              this.competitionDisabledMessage = competitionDisabledController.text;
                              _controlBloc.add(UpdateSettings(competitionDisabledMessage: competitionDisabledController.text));
                            });
                          },
                        ) :
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Flexible(
                              flex: 8,
                              child: Text(this.competitionDisabledMessage)
                            ),
                            Flexible(
                              flex: 1,
                              child: IconButton(
                                icon: Icon(Icons.edit),
                                onPressed: (){
                                  setState(() {
                                    competitionDisabledController = TextEditingController(text: this.competitionDisabledMessage);
                                    isChangingCompetitionDisabledText = true;
                                  });
                                },
                              ),
                            )
                          ],
                        )
                    ),
                  ),
                  SwitchListTile(
                    title: Text("Competition Visible"),
                    value: this.isCompetitionVisible,
                    onChanged: (val){
                      setState(() {
                        this.isCompetitionVisible = val;
                        _controlBloc.add(UpdateSettings(isCompetitionVisible: val));
                      });
                    },
                  ),
                  Visibility(
                    visible: !this.isCompetitionVisible,
                    child: Padding(
                        padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                        child: this.isChangingCompetitionHiddenText ?
                        TextField(
                          controller: competitionHiddenController,
                          maxLength: 250,
                          onEditingComplete: (){
                            FocusScope.of(context).unfocus();
                            setState(() {
                              isChangingCompetitionHiddenText = false;
                              this.competitionHiddenMessage = competitionHiddenController.text;
                              _controlBloc.add(UpdateSettings(competitionHiddenMessage: competitionHiddenController.text));
                            });
                          },
                        ) :
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Flexible(
                              flex: 8,
                              child: Text(this.competitionHiddenMessage)
                            ),
                            Flexible(
                              flex: 1,
                              child: IconButton(
                                icon: Icon(Icons.edit),
                                onPressed: (){
                                  setState(() {
                                    competitionHiddenController = TextEditingController(text: this.competitionHiddenMessage);
                                    isChangingCompetitionHiddenText = true;
                                  });
                                },
                              ),
                            )
                          ],
                        )
                    ),
                  ),
                  SwitchListTile(
                    title: Text("Show Rewards"),
                    value: this.isShowingRewards,
                    onChanged: (val){
                      setState(() {
                        this.isShowingRewards = val;
                        _controlBloc.add(UpdateSettings(isShowingRewards: val));
                      });
                    },
                  ),
                  Text("Suggested IDs: 3,4,5,6")
                ],
              ),
            ),
          ),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Competition Controls"),
                  (displayTypeOf(context) == DisplayType.desktop_large)?
                    largeDesktopButtons()
                    :
                    smallDesktopButtons(),
                ]
              )
            ),
          )
        ],
      );
    }
  }

  Widget largeDesktopButtons(){
    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        RaisedButton(
          child: Text("Backup Competition"),
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("Request Competition Backup"),
                  content: new Text("This will send a backup of the competition to the email linked to your account. "),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(RequestBackup());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
        RaisedButton(
          child: Text("End Semester"),
          color: Colors.orange,
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("End Semester"),
                  content: new Text("An email will be sent to your account to confirm that you want to end the semester. Do you want to proceed?"),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(EndSemester());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
        RaisedButton(
          child: Text("Reset House Competition"),
          color: Colors.red,
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("Reset House Competition"),
                  content: new Text("An email will be sent to your account to confirm that you want to reset the semester. Do you want to proceed?"),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(ResetCompetition());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
      ],
    );
  }

  Widget smallDesktopButtons(){
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        RaisedButton(
          child: Text("Backup Competition"),
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("Request Competition Backup"),
                  content: new Text("This will send a backup of the competition to the email linked to your account. "),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(RequestBackup());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
        RaisedButton(
          child: Text("End Semester"),
          color: Colors.orange,
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("End Semester"),
                  content: new Text("An email will be sent to your account to confirm that you want to end the semester. Do you want to proceed?"),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(EndSemester());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
        RaisedButton(
          child: Text("Reset House Competition"),
          color: Colors.red,
          onPressed: (){
            showDialog(
              context: context,
              builder: (BuildContext context) {
                // return object of type Dialog
                return AlertDialog(
                  title: new Text("Reset House Competition"),
                  content: new Text("An email will be sent to your account to confirm that you want to reset the semester. Do you want to proceed?"),
                  actions: <Widget>[
                    // usually buttons at the bottom of the dialog
                    new FlatButton(
                      child: new Text("Cancel"),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    new RaisedButton(
                      child: new Text("Proceed"),
                      onPressed: () {
                        _controlBloc.add(ResetCompetition());
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
        ),
      ],
    );
  }

  @override
  void dispose() {
    this._controlBloc.close();
    super.dispose();
  }

  _onChangeState(BuildContext context, ControlState state) {
    if (state is ControlUpdateError) {
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text(
            "Sorry. There was a problem updating the settings. Please try again."),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _controlBloc.add(ControlHandledMessage());
      });

    }
    else if (state is ControlEmailError) {
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text(
            '${state.message}'),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _controlBloc.add(ControlHandledMessage());
      });
    }
  }
}

