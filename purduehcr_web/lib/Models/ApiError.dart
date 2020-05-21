class ApiError extends Error{
  int errorCode;
  String message;

  ApiError(int errorCode, String message){
    this.errorCode = errorCode;
    this.message = message;
  }

  @override
  String toString() {
    return this.errorCode.toString()+": "+this.message;
  }
}