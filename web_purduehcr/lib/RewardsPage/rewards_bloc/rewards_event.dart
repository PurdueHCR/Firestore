import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/Reward.dart';

abstract class RewardsEvent extends Equatable {
  const RewardsEvent();
}

class RewardsInitialize extends RewardsEvent {
  const RewardsInitialize();
  @override
  List<Object> get props => [];
}

class DeleteReward extends RewardsEvent {
  final Reward reward;
  const DeleteReward(this.reward);
  @override
  List<Object> get props => [reward];
}

class CreateReward extends RewardsEvent {
  final String name;
  final int pointsPerResident;
  final String downloadURL;
  final String fileName;
  const CreateReward({this.name, this.pointsPerResident, this.fileName, this.downloadURL});
  @override
  List<Object> get props => [name, pointsPerResident, downloadURL, this.fileName];
}

class UpdateReward extends RewardsEvent {
  final Reward reward;
  final String name;
  final double pointsPerResident;
  final String downloadURL;
  final String fileName;
  const UpdateReward(this.reward, {this.name, this.pointsPerResident, this.fileName, this.downloadURL});
  @override
  List<Object> get props => [reward, name, pointsPerResident, downloadURL, fileName];
}

class RewardHandleMessage extends RewardsEvent {
  const RewardHandleMessage();
  @override
  List<Object> get props => [];
}