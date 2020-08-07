import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/PurdueHCR_main.dart';

import 'Config.dart';
import 'Utilities/ThemeNotifier.dart';
import 'env/prod.dart';


void main() => runApp(
    ChangeNotifierProvider<ThemeNotifier>(
      create: (_) => ThemeNotifier(ThemeData.light(), ThemeData.dark()),
      child: ConfigWrapper(
          config: Config.fromJson(config),
          child: new PurdueHCR()),
    )
);