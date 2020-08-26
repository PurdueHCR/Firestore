import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class AccountEvent  {
  const AccountEvent();
}

class AccountInitialize extends AccountEvent {
  const AccountInitialize();

}

class Login extends AccountEvent {

  final String email;
  final String password;
  const Login({
    @required this.email,
    @required this.password,
  });

}

class CreateAccountInitialize extends AccountEvent {
  const CreateAccountInitialize();
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
}

class SendPasswordResetEmail extends AccountEvent {
  final String email;
  const SendPasswordResetEmail(this.email);

}

class DisplayedMessage extends AccountEvent {
  const DisplayedMessage();
}

class SetAccountPageLoading extends AccountEvent {
  const SetAccountPageLoading();
}