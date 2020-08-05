import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/RouteGenerator.dart';


import 'package:purduehcr_web/authentication/authentication.dart';

import 'Utilities/ThemeNotifier.dart';



class PurdueHCR extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    return PurdueHCRState();
  }
}

class PurdueHCRState extends State<PurdueHCR>{
  AuthenticationBloc _authenticationBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _authenticationBloc = AuthenticationBloc(config: ConfigWrapper.of(context));
    _authenticationBloc.add(AppStarted());
  }
  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    return BlocProvider<AuthenticationBloc>(
      builder: (context) => _authenticationBloc,
      child: MaterialApp(
        title: 'Purdue HCR',
        theme: themeNotifier.getTheme(),
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