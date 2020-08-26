
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_And_User_Pages/Account_Login_Creation/CreateAccountCard.dart';
import 'package:purduehcr_web/Account_And_User_Pages/Account_Login_Creation/LoginCard.dart';
import 'package:purduehcr_web/Account_And_User_Pages/Account_Login_Creation/account_bloc/account.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';




class AccountPage extends StatefulWidget {

  final String houseCode;
  AccountPage({Key key, this.houseCode}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _AccountPageState();
  }

}
class _AccountPageState extends State<AccountPage> {
  AccountBloc _loginBloc;

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
    if(_loginBloc == null){
      _loginBloc = AccountBloc(
        config: ConfigWrapper.of(context),
        authenticationBloc: _authenticationBloc,
        houseCode: widget.houseCode
      );
      _loginBloc.add(AccountInitialize());
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 16),
          alignment: Alignment.center,
          child: BlocBuilder<AccountBloc, AccountState>(
            bloc: _loginBloc,
            builder: (BuildContext context, AccountState state) {
              checkStateForSnackMessage(context, state);
              return Column(
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
                      child: buildBody(state)
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }


  Widget buildBody(AccountState state){
    Widget child;
    if(state is AccountError){
      child = BlocProvider(
        builder: (BuildContext context) => _loginBloc,
        child: LoginCard(
            error: state.message
        )
      );
    }
    else if(state is CreateAccountError){
      child = BlocProvider(
          builder: (BuildContext context) => _loginBloc,
          child: CreateAccountCard(error: state.message)
      );
    }
    else if(state is CreateAccountInitial){
      child = BlocProvider(
        builder: (BuildContext context) => _loginBloc,
          child: CreateAccountCard()
      );
    }
    else if(state is AccountInitial){
      child = BlocProvider(
          builder: (BuildContext context) => _loginBloc,
          child: LoginCard()
      );
    }
    else if(state is AccountPageLoading){
      child = BlocProvider(
          builder: (BuildContext context) => _loginBloc,
          child: LoginCard()
      );
    }
    else{
      child = Text("There was a big problem");
    }
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: 500),
      child: child,
    );
  }

  checkStateForSnackMessage(BuildContext context, AccountState state){
    if(state is SendEmailSuccess){
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content:
        Text('If the account exists, an email has been sent.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _loginBloc.add(DisplayedMessage());
      });
    }
    else if(state is SendEmailError){
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content:
        Text('There was a problem sending the email. Please try again.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _loginBloc.add(DisplayedMessage());
      });
    }
  }

  Widget _createLoadingCard(){
    return Card (
      child: LoadingWidget(),
    );
  }

  @override
  void dispose() {
    super.dispose();
    print("close bloc");
    _loginBloc.close();
  }
}