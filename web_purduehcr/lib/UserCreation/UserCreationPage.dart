import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/UserCreation/user_creation/user_creation.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/authentication/authentication.dart';

import '../ConfigWrapper.dart';

class UserCreationPage extends StatefulWidget{

  final String houseCode;

  const UserCreationPage({Key key, this.houseCode}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _UserCreationPageState();
  }

}

class _UserCreationPageState extends State<UserCreationPage>{

  TextEditingController houseCodeController = new TextEditingController();
  TextEditingController firstNameController = new TextEditingController();
  TextEditingController lastNameController = new TextEditingController();


  UserCreationBloc _userCreationBloc;

  //Ignore close sink because it will be closed elsewhere
  // ignore: close_sinks
  AuthenticationBloc _authenticationBloc;
  final _nameKey = GlobalKey<FormState>();
  final _codeKey = GlobalKey<FormState>();
  bool isLoading = false;
  House house;


  @override
  void initState() {
    _authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_userCreationBloc == null){
      _userCreationBloc = UserCreationBloc(
        config: ConfigWrapper.of(context),
        authenticationBloc: _authenticationBloc,
      );
      if(widget.houseCode != null){
        _userCreationBloc.add(EnterHouseCode(widget.houseCode));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isDesktop = isDisplayDesktop(context);

    return Scaffold(
      backgroundColor: Color.fromARGB(255, 220, 220, 220),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: BlocBuilder<UserCreationBloc, UserCreationState>(
          bloc: _userCreationBloc,
          builder: (context, state) {
            if(isDesktop){
              return _createDesktop(context, state);
            }
            else{
              return _createMobile(context, state);
            }
          },
        ),
      ),
    );
  }

  Widget _createDesktop( BuildContext context, UserCreationState state){
    return Scaffold(
      body: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Container(
              color: Colors.blue,
            ),
          ),
          Expanded(child: Center(child: _createMobile(context, state)))
        ],
      ),
    );
  }

  Widget _createMobile(BuildContext context, UserCreationState state){
    Widget child;
    String title = "";
    if(state is LoadingUserCreationInformation ){
      child = Padding(
        padding: const EdgeInsets.all(8.0),
        child: SizedBox(
          width: 100,
            height: 100,
          child: LoadingWidget(),
        ),
      );
    }
    else if(state is EnterHouseCodeState ){
      title = "Join House Competition";
      child = buildCodeInputForm(context, state);
    }
    else if(state is EnterFirstAndLastNameState){
      title = "Enter a Your Preferred Name";
      child = buildNameInputForm(context, state);
    }
    else{
      print("There is a state that the User Creation Page is not handling.");
      child = Center(
        child: Text("There was a problem. Please reload the page."),
      );
    }
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18
                )
              ),
              child
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _userCreationBloc.close();
  }

  Widget buildCodeInputForm(BuildContext context, EnterHouseCodeState state){
    return Builder(
        builder: (context) => Form(
          key: _codeKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: 300),
                  child: TextFormField(
                    decoration:
                    InputDecoration(
                      labelText: 'Please Enter A House Competition Code',
                      labelStyle: TextStyle(
                        fontSize: 14
                      ),
                      counterText: ""
                    ),
                    maxLength: 6,
                    controller: houseCodeController,
                    textCapitalization: TextCapitalization.characters,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please Enter A Code.';
                      }
                      return null;
                    },
                  ),
                ),
              ),
              Visibility(
                visible: state is EnterHouseCodeStateError,
                  child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Center(
                    child: Text(
                        (state is EnterHouseCodeStateError)? state.message : ""
                    ),
                  ),
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: RaisedButton(
                        child: Text("Log Out"),
                        onPressed: (){
                          _authenticationBloc.add(LoggedOut());
                        },
                      ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: RaisedButton(
                        child: Text("Join"),
                        onPressed: (){
                          if(_codeKey.currentState.validate()){
                            _userCreationBloc.add(EnterHouseCode(houseCodeController.text));
                          }
                        },
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        )
    );
  }

  Widget buildNameInputForm(BuildContext context, EnterFirstAndLastNameState state){
    return Builder(
        builder: (context) => Form(
          key: _nameKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                decoration:
                InputDecoration(labelText: 'First Name'),
                textCapitalization: TextCapitalization.words,
                maxLength: 20,
                controller: firstNameController,
                validator: (value) {
                  if (value.isEmpty) {
                    return 'Please enter a name for this reward.';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration:
                InputDecoration(labelText: 'Last Name'),
                maxLength: 30,
                textCapitalization: TextCapitalization.words,
                controller: lastNameController,
                validator: (value) {
                  if (value.isEmpty) {
                    return 'Please enter a name for this reward.';
                  }
                  return null;
                },
              ),
              Visibility(
                visible: state is EnterFirstAndLastNameStateError,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Center(
                    child: Text(
                        (state is EnterFirstAndLastNameStateError)?
                        (state as EnterFirstAndLastNameStateError).message
                            :
                            ""
                    ),
                  ),
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Expanded(
                    child: RaisedButton(
                      child: Text("Enter Different Code"),
                      onPressed: (){
                        _userCreationBloc.add(ReturnToEnterHouseCode());
                      },
                    ),
                  ),
                  Expanded(
                    child: RaisedButton(
                      child: Text("Join the House Competition"),
                      onPressed: (){
                        if(_nameKey.currentState.validate()){
                          _userCreationBloc.add(JoinHouse(state.preview.houseCode.code, firstNameController.text, lastNameController.text));
                        }
                      },
                    ),
                  )
                ],
              )
            ],
          ),
        )
    );
  }

}
