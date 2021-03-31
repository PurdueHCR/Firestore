import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class EditTextField extends StatefulWidget {

  final int maxLength;
  final String initialText;
  final String label;
  final Function(String value) onSubmit;

  const EditTextField({Key key, this.maxLength, this.initialText, this.onSubmit, this.label}) : super(key: key);
  @override
  State<StatefulWidget> createState() {
    return _EditTextFieldState();
  }

}

class _EditTextFieldState extends State<EditTextField> {

  TextEditingController controller = TextEditingController();
  bool isEditing = false;
  String text = "";

  @override
  void initState() {
    super.initState();
    if(widget.initialText != null){
      this.text = widget.initialText;
    }
    else{
      this.text = "";
    }

  }

  @override
  Widget build(BuildContext context) {
    if(isEditing){
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(widget.label, style: TextStyle(fontWeight: FontWeight.bold)),
              FlatButton(
                child: Text('Done'),
                  onPressed: (){
                    FocusScope.of(context).unfocus();
                    setState(() {
                      isEditing = false;
                      text = controller.text;
                      widget.onSubmit(text);
                    });
                }
              )
            ],
          ),
          Padding(
              padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
              child: TextField(
                controller: controller,
                maxLength: widget.maxLength,
                onEditingComplete: () {
                  FocusScope.of(context).unfocus();
                  setState(() {
                    isEditing = false;
                    text = controller.text;
                    widget.onSubmit(text);
                  });
                },
              )
          ),
        ],
      );
    }
    else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.label, style: TextStyle(fontWeight: FontWeight.bold),),
          Padding(
              padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
              child: FlatButton(
                onPressed: (){
                  setState(() {
                    controller = TextEditingController(
                        text: text);
                    isEditing = true;
                  });
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Flexible(
                      child: Text(
                        text,
                        maxLines: null,
                      ),
                    ),
                    Icon(Icons.edit)
                  ],
                ),
              )
          ),
        ],
      );
    }
  }

}