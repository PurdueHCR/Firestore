import 'package:firebase/firebase.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/rewards_bloc/rewards.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/Utilities/UploadNotifier.dart';

class EditRewardForm extends StatefulWidget {
  final Reward reward;

  const EditRewardForm({Key key, this.reward}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _EditRewardFormState();
  }
}

class _EditRewardFormState extends State<EditRewardForm> {
  //ignore: close_sinks
  RewardsBloc _rewardsBloc;

  bool isEditingName = false;
  bool isEditingValue = false;
  UploadNotifier uploadNotifier = UploadNotifier();

  TextEditingController nameController = TextEditingController();
  TextEditingController valueController = TextEditingController();

  String name = "";
  double value = 0;
  Image image;

  @override
  void initState() {
    super.initState();
    if (widget.reward != null) {
      value = widget.reward.requiredPPR;
      name = widget.reward.name;
      image = Image.network(widget.reward.downloadURL);
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_rewardsBloc == null) {
      _rewardsBloc = BlocProvider.of<RewardsBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.reward == null) {
      return Center(child: Text("Select a Reward"));
    } else {
      return SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text("Name", style: TextStyle(fontWeight: FontWeight.bold)),
              Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                  child: this.isEditingName
                      ? TextField(
                          controller: nameController,
                          maxLength: 100,
                          onEditingComplete: () {
                            FocusScope.of(context).unfocus();
                            setState(() {
                              isEditingName = false;
                              name = nameController.text;
                              _rewardsBloc.add(UpdateReward(widget.reward,
                                  name: nameController.text));
                            });
                          },
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Flexible(
                              child: Text(
                                name,
                                maxLines: null,
                              ),
                            ),
                            IconButton(
                              icon: Icon(Icons.edit),
                              onPressed: () {
                                setState(() {
                                  nameController = TextEditingController(
                                      text: widget.reward.name);
                                  isEditingName = true;
                                });
                              },
                            )
                          ],
                        )),
              Text("How Many Points Per Resident Are Required?",
                  style: TextStyle(fontWeight: FontWeight.bold)),
              Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                  child: this.isEditingValue
                      ? TextField(
                          controller: valueController,
                          maxLength: 4,
                          keyboardType: TextInputType.numberWithOptions(),
                          onEditingComplete: () {
                            FocusScope.of(context).unfocus();
                            setState(() {
                              isEditingValue = false;
                              value = double.parse(valueController.text);
                              _rewardsBloc.add(UpdateReward(widget.reward,
                                  pointsPerResident: value));
                            });
                          },
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Flexible(
                                child: Text(
                              "$value",
                              maxLines: null,
                            )),
                            IconButton(
                              icon: Icon(Icons.edit),
                              onPressed: () {
                                setState(() {
                                  valueController = TextEditingController(
                                      text:
                                          widget.reward.requiredPPR.toString());
                                  isEditingValue = true;
                                });
                              },
                            )
                          ],
                        )),
              Text("Icon", style: TextStyle(fontWeight: FontWeight.bold)),
              Center(
                  child: image != null
                      ? Container(width: 100, height: 100, child: image)
                      : Text('No Icon ...')),
              Center(
                child: RaisedButton(
                  child: Text("Select New Icon"),
                  onPressed: () {
                    showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: Text("Replace Icon"),
                            content: Text(
                                "Are you sure you want to replace the icon? This will delete the old icon."),
                            actions: [
                              RaisedButton(
                                child: Text("Cancel"),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                },
                              ),
                              RaisedButton(
                                child: Text("Pick New Icon"),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                  uploadNotifier.startFilePickerWeb();
                                  uploadNotifier.addListener(() {
                                    setState(() {
                                      image = uploadNotifier.image;
                                      updateRewardIcon();
                                    });
                                  });
                                },
                              )
                            ],
                          );
                        });
                  },
                ),
              ),
              RaisedButton(
                color: Colors.red,
                child: Text("Delete Reward"),
                onPressed: () {
                  showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: Text("Delete Reward"),
                          content: Text(
                              "Are you sure you want to delete the reward? This can not be undone."),
                          actions: [
                            RaisedButton(
                              child: Text("Cancel"),
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                            RaisedButton(
                              color: Colors.red,
                              child: Text("Delete"),
                              onPressed: () {
                                Navigator.of(context).pop();
                                deleteReward();
                              },
                            )
                          ],
                        );
                      }
                    );
                },
              )
            ],
          ),
        ),
      );
    }
  }

  deleteReward() async {
    showDialog(
        barrierDismissible: false,
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Deleting Reward"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))),
            children: [
              FutureBuilder(
                future: FirebaseUtility.deleteImageFromStorage(widget.reward.fileName),
                builder: (BuildContext context, snapshot){
                  if(snapshot.connectionState != ConnectionState.done){
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          Text("Deleting Image")
                        ],
                      ),
                    );
                  }
                  else{
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      _rewardsBloc.add(DeleteReward(widget.reward));
                    });
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          Text("Deleting Reward")
                        ],
                      ),
                    );
                  }
                },
              )
            ],
          );
        }

    );
  }

  updateRewardIcon() async {
    showDialog(
        barrierDismissible: false,
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Changing Icon"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))),
            children: [
              FutureBuilder(
                future: FirebaseUtility.deleteImageFromStorage(widget.reward.fileName),
                builder: (BuildContext context, snapshot){
                  if(snapshot.connectionState != ConnectionState.done){
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          Text("Deleting Image")
                        ],
                      ),
                    );
                  }
                  else{
                    return FutureBuilder<UploadTaskSnapshot>(
                      future: uploadNotifier.uploadToFirebase().future,
                      builder: (BuildContext context, snapshot){
                        if(snapshot.connectionState != ConnectionState.done){
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(),
                                Text("Uploading Image")
                              ],
                            ),
                          );
                        }
                        else{
                          WidgetsBinding.instance.addPostFrameCallback((_) async {
                            Navigator.of(context).pop();
                            String url = (await snapshot.data.ref.getDownloadURL()).toString();
                            _rewardsBloc.add(UpdateReward(widget.reward, fileName: uploadNotifier.fileName, downloadURL: url));
                          });
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(),
                                Text("Updating Reward")
                              ],
                            ),
                          );
                        }
                      },
                    );
                  }
                },
              )
            ],
          );
        }

    );
  }
}
