
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/RouteGenerator.dart';


import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';

import 'package:purduehcr_web/Utilities/ThemeNotifier.dart';



class PurdueHCR extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    return PurdueHCRState();
  }
}

class PurdueHCRState extends State<PurdueHCR>{
  AuthenticationBloc _authenticationBloc;
  ThemeNotifier _themeNotifier;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_authenticationBloc == null){
      _themeNotifier = Provider.of<ThemeNotifier>(context);
      _authenticationBloc = AuthenticationBloc(config: ConfigWrapper.of(context), themeNotifier: _themeNotifier);
      _authenticationBloc.add(AppStarted());
    }
  }
  @override
  Widget build(BuildContext context) {

    return BlocProvider<AuthenticationBloc>(
      builder: (context) => _authenticationBloc,
      child: MaterialApp(
        title: 'Purdue HCR',
        theme: _themeNotifier.getTheme(),
        initialRoute: '/',
        onGenerateRoute: (settings) => RouteGenerator.generateRoute(settings),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _authenticationBloc.close();
  }
}