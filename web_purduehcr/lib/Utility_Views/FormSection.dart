import 'package:flutter/material.dart';

class FormSection extends StatelessWidget{
  final List<Widget> children;
  final String label;

  const FormSection({Key key, this.children, this.label}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    List<Widget> childs = [
      Container(
        padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
        child: Text(label, style: TextStyle(fontWeight: FontWeight.w900)),
      )
      ,...children];
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(5),
            border: Border.all(width: 1.0, color: Colors.black)
        ),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: childs
          ),
        ),
      ),
    );
  }

}