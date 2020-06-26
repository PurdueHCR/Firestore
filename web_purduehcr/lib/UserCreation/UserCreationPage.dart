import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/UserCreation/user_creation/user_creation.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/authentication/authentication.dart';

import '../ConfigWrapper.dart';

class UserCreationPage extends StatefulWidget{

  @override
  State<StatefulWidget> createState() {
    return _UserCreationPageState();
  }

}

class _UserCreationPageState extends State<UserCreationPage>{
  UserCreationBloc _userCreationBloc;

  //Ignore close sink because it will be closed elsewhere
  // ignore: close_sinks
  AuthenticationBloc _authenticationBloc;

  @override
  void initState() {
    _authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _userCreationBloc = UserCreationBloc(
      config: ConfigWrapper.of(context),
      authenticationBloc: _authenticationBloc,
    );
    _userCreationBloc.add(UserCreationPageInitialize());
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
              return _createDesktop(state);
            }
            else{
              return _createMobile(state);
            }
          },
        ),
      ),
    );
  }

  Widget _createDesktop( UserCreationState state){
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
          Expanded(child: Center(child: _createMobile(state)))
        ],
      ),
    );
  }

  Widget _createMobile(UserCreationState state){
    return Text("Unimplemented Mobile View");
  }

  @override
  void dispose() {
    super.dispose();
    //_userCreationBloc.close();
  }

}