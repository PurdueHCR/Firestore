import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/PurdueHCR_main.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Utilities/ThemeNotifier.dart';

import 'Configuration/Config.dart';
import 'Configuration/env/dev.dart';


class SimpleBlocObserver extends BlocObserver {
  @override
  void onTransition(Bloc bloc, Transition transition) {
//    print("Trainsition to: "+transition.toString());
    super.onTransition(bloc, transition);
  }

}
void main(){
  Bloc.observer = SimpleBlocObserver();
  runApp(
      ChangeNotifierProvider<ThemeNotifier>(
        create: (_) => ThemeNotifier(ThemeData.light(), ThemeData.dark()),
        child: ConfigWrapper(
            config: Config.fromJson(config),
            child: new PurdueHCR()),
      )
  );
}