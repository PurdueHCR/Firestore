// Copyright 2019 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'package:flutter/material.dart';

enum DisplayType {
  desktop_large,
  desktop_small,
  mobile,
}

const _desktopBreakpoint = 700.0;
const _smallDesktopMaxWidth = 900.0;

/// Returns the [DisplayType] for the current screen. This app only supports
/// mobile and desktop layouts, and as such we only have one breakpoint.
DisplayType displayTypeOf(BuildContext context) {
  if (MediaQuery.of(context).size.width > _smallDesktopMaxWidth ) {
    return DisplayType.desktop_large;
  }
  else if(MediaQuery.of(context).size.width > _desktopBreakpoint ){
    return DisplayType.desktop_small;
  }
  else {
    return DisplayType.mobile;
  }
}


/// Returns a boolean if we are in a display of [DisplayType.desktop]. Used to
/// build adaptive and responsive layouts.
bool isDisplayDesktop(BuildContext context) {
  return displayTypeOf(context) != DisplayType.mobile;
}
