import 'package:flutter/material.dart';

import 'Config.dart';

class ConfigWrapper extends StatelessWidget {
  ConfigWrapper({Key key, this.config, this.child});

  @override
  Widget build(BuildContext context) {
    return new _InheritedConfig(config: this.config, child: this.child);
  }

  static Config of(BuildContext context) {
    final _InheritedConfig inheritedConfig =
    context.dependOnInheritedWidgetOfExactType(aspect: _InheritedConfig);
    return inheritedConfig.config;
  }

  final Config config;
  final Widget child;
}

class _InheritedConfig extends InheritedWidget {
  const _InheritedConfig(
      {Key key, @required this.config, @required Widget child})
      : assert(config != null),
        assert(child != null),
        super(key: key, child: child);
  final Config config;

  @override
  bool updateShouldNotify(_InheritedConfig oldWidget) =>
      config != oldWidget.config;
}