import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class AccountEvent extends Equatable {
  const AccountEvent();
}

class AccountInitialize extends AccountEvent {
  const AccountInitialize();
  @override
  List<Object> get props => [];
}

class Login extends AccountEvent {

  final String email;
  final String password;
  const Login({
    @required this.email,
    @required this.password,
  });
  @override
  List<Object> get props => [email, password];

}

class CreateAccountInitialize extends AccountEvent {
  const CreateAccountInitialize();
  @override
  List<Object> get props => [];
}

class CreateAccount extends AccountEvent {
  final String email;
  final String password;
  final String verifyPassword;
  const CreateAccount({
    @required this.email,
    @required this.password,
    @required this.verifyPassword
  });
  @override
  List<Object> get props => [email, password, verifyPassword];
}