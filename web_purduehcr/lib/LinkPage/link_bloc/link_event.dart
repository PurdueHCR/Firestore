import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class LinkEvent extends Equatable {
  const LinkEvent();
}

class LinkInitialize extends LinkEvent {
  const LinkInitialize();
  @override
  List<Object> get props => [];
}

