import 'package:flutter/material.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/PurdueHCR_main.dart';

import 'Config.dart';
import 'env/dev.dart';


void main() => runApp(
    new ConfigWrapper(config: Config.fromJson(config), child: new PurdueHCR()));