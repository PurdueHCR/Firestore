class HttpError{
  int errorCode;
  String message;

  HttpError(int errorCode, String message){
    this.errorCode = errorCode;
    this.message = message;
  }

  @override
  String toString() {
    return "HTTP Error - httpcode:" + errorCode.toString() + " , message:" + this.message;
  }
}