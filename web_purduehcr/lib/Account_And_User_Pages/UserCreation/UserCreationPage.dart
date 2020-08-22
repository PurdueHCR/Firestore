import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Account_And_User_Pages/UserCreation/user_creation/user_creation.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';

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
  bool agreeTermsAndConditions = false;
  bool agreePrivacyPolicy = false;
  bool termsAndConditionsError = false;
  bool privacyPolicyError = false;
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

    return Scaffold(
      backgroundColor: Color.fromARGB(255, 220, 220, 220),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: BlocBuilder<UserCreationBloc, UserCreationState>(
          bloc: _userCreationBloc,
          builder: (context, state) {
            if(state is LoadingUserCreationInformation ){
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: SizedBox(
                    width: 100,
                    height: 100,
                    child: LoadingWidget(),
                  ),
                ),
              );
            }
            else {
              return SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: SizedBox(
                        width: 200,
                        height: 200,
                        child: Image.asset('assets/main_icon.png'),
                      ),
                    ),
                    Center(
                        child: buildBody(context, state)
                    ),
                  ],
                ),
              );
            }
          },
        ),
      ),
    );
  }


  Widget buildBody(BuildContext context, UserCreationState state){
    Widget child;
    String title = "";
    if(state is EnterHouseCodeState ){
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
    return SingleChildScrollView(
      child: Padding(
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
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _userCreationBloc.close();
  }

  Widget buildCodeInputForm(BuildContext context, EnterHouseCodeState state){
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Builder(
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
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
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
                          (state is EnterHouseCodeStateError)? state.message : "",
                        style: TextStyle(color: Theme.of(context).errorColor),
                        textAlign: TextAlign.center,
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
      ),
    );
  }

  Widget buildNameInputForm(BuildContext context, EnterFirstAndLastNameState state){
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Builder(
          builder: (context) => Form(
            key: _nameKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: TextFormField(
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'First Name',
                        counterText: ''
                    ),
                    textCapitalization: TextCapitalization.sentences,
                    maxLength: 20,
                    controller: firstNameController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter your preferred first name.';
                      }
                      String text = firstNameController.text;
                      firstNameController.text = text.substring(0,1).toUpperCase()+text.substring(1);
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: TextFormField(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Last Name',
                      counterText: ''
                    ),
                    maxLength: 30,
                    textCapitalization: TextCapitalization.words,
                    controller: lastNameController,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'Please enter your preferred last name.';
                      }
                      String text = lastNameController.text;
                      lastNameController.text = text.substring(0,1).toUpperCase()+text.substring(1);
                      return null;
                    },
                  ),
                ),
                Visibility(
                  visible: state is EnterFirstAndLastNameStateError,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Center(
                      child: Text(
                          (state is EnterFirstAndLastNameStateError)?
                          state.message
                              :
                              "",
                        style: TextStyle(color: Theme.of(context).errorColor),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(5),
                      color: (this.termsAndConditionsError)? Colors.red : Theme.of(context).cardColor,
                    ),

                    child: CheckboxListTile(
                      value: this.agreeTermsAndConditions,
                      onChanged: (val){
                        setState(() {
                          this.agreeTermsAndConditions = val;
                          this.termsAndConditionsError = false;
                        });
                      },
                      controlAffinity: ListTileControlAffinity.leading,
                      title: Text("I agree to the Terms & Conditions"),
                      secondary: FlatButton(
                        child: Text("Read"),
                        onPressed: () async {
                          await launch('/terms-and-conditions/');
                        },
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(5),
                      color: (this.privacyPolicyError)? Colors.red : Theme.of(context).cardColor,
                    ),
                    child: CheckboxListTile(
                      value: this.agreePrivacyPolicy,
                      onChanged: (val){
                        setState(() {
                          this.agreePrivacyPolicy = val;
                          this.privacyPolicyError = false;
                        });
                      },
                      controlAffinity: ListTileControlAffinity.leading,
                      title: Text("I have read and understood the privacy policy."),
                      secondary: FlatButton(
                        child: Text("Read"),
                        onPressed: () async {
                          await launch('/privacy/');
                        },
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
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: RaisedButton(
                          child: Text("Enter a Different Code"),
                          onPressed: (){
                            _userCreationBloc.add(ReturnToEnterHouseCode());
                          },
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: RaisedButton(
                          child: Text("Join the House Competition",
                            textAlign: TextAlign.center,
                          ),
                          onPressed: (){
                            if(_nameKey.currentState.validate() && this.agreePrivacyPolicy && this.agreeTermsAndConditions){
                              _userCreationBloc.add(JoinHouse(state.preview.houseCode.code, firstNameController.text, lastNameController.text));
                            }
                            else{
                              print("First: "+firstNameController.text);
                              setState(() {
                                if(!this.agreePrivacyPolicy){
                                  this.privacyPolicyError = true;
                                }
                                if(!this.agreeTermsAndConditions){
                                  this.termsAndConditionsError = true;
                                }
                              });
                            }
                          },
                        ),
                      ),
                    )
                  ],
                )
              ],
            ),
          )
      ),
    );
  }

}
