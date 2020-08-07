import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/PurdueHCR_main.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Utilities/ThemeNotifier.dart';

import 'Config.dart';
import 'env/dev.dart';


class SimpleBlocDelegate extends BlocDelegate {
  @override
  void onTransition(Bloc bloc, Transition transition) {
    print("Trainsition to: "+transition.toString());
    super.onTransition(bloc, transition);
  }

}
void main(){
  BlocSupervisor.delegate = SimpleBlocDelegate();
  runApp(
      ChangeNotifierProvider<ThemeNotifier>(
        create: (_) => ThemeNotifier(ThemeData.light(), ThemeData.dark()),
        child: ConfigWrapper(
            config: Config.fromJson(config),
            child: new PurdueHCR()),
      )
  );
}