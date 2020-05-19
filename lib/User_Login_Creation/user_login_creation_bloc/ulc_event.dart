
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class ULCEvent extends Equatable {
  const ULCEvent();
}

class Login extends ULCEvent {

  final String email;
  final String password;
  const Login({
    @required this.email,
    @required this.password,
  });
  @override
  List<Object> get props => [email, password];

  @override
  String toString() =>
      'ULCButtonPressed { username: $email, password: $password }';

}