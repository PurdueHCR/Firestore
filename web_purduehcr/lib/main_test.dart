import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/PurdueHCR_main.dart';
import 'package:purduehcr_web/Utilities/ThemeNotifier.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/env/test.dart';


void main() => runApp(
    ChangeNotifierProvider<ThemeNotifier>(
      create: (_) => ThemeNotifier(ThemeData.light(), ThemeData.dark()),
      child: ConfigWrapper(
          config: Config.fromJson(config),
          child: new PurdueHCR()),
    )
);