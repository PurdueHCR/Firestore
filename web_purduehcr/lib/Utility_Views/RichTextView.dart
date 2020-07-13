/// Thanks to putraxor for the base of this file.
/// https://gist.github.com/putraxor/03ad59c117122b74155a77e5c101ff2a

import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart' as launcher;


class LinkTextSpan extends TextSpan {
  LinkTextSpan({TextStyle style, String url, String text})
      : super(
      style: style,
      text: text ?? url,
      recognizer: new TapGestureRecognizer()
        ..onTap = (){
          if(url.contains("http")){
            launcher.launch(url);
          }
          else{
            launcher.launch("http://$url");
          }
        });
}

class RichTextView extends StatelessWidget {
  final String text;
  final TextStyle style;

  RichTextView({@required this.text, this.style});

  bool _isLink(String input) {
    final matcher = new RegExp(
        r"(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)");
    return matcher.hasMatch(input);
  }

  @override
  Widget build(BuildContext context) {
    final _style = (style == null)? Theme.of(context).textTheme.bodyText1 : style;
    final words = text.split(' ');
    List<TextSpan> span = [];
    words.forEach((wordUnclean) {
      final word = wordUnclean.trim();
      if(_isLink(word)){
        span.add(new LinkTextSpan(
            text: '$word',
            url: word,
            style: _style.apply(decoration: TextDecoration.underline))
        );
        span.add(new TextSpan(text: ' ', style: _style));
      }
      else{
        span.add(new TextSpan(text: '$word ', style: _style));
      }
    });

    if (span.length > 0) {
      //The following logic helps us avoid a bug in the framework that occurs when the first word is a link.
      if(span.length == 2 && _isLink(words[0])){
        //If span consists of only 1 link and a space, return a link text
        return new SelectableText.rich(
          new LinkTextSpan(
              text: '${words[0]}',
              url: words[0],
              style: _style.apply(decoration: TextDecoration.underline))
        );
      }
      else if( _isLink(words[0])){
        //If the span consits of multple words but the first is a link, append a space
        return new SelectableText.rich(
            new TextSpan(text: ' ', children: span),
        );
      }
      else{
        return new SelectableText.rich(
          new TextSpan(text: '', children: span),
        );
      }
    } else {
      return new SelectableText(text);
    }
  }
}