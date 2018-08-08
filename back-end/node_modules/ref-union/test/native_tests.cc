#include <stdlib.h>
#include "nan.h"

#ifdef _WIN32
  #define __alignof__ __alignof
#endif

using namespace node;

namespace {

typedef union _test1 {
  char a;
  short b;
} test1;

typedef union _test2 {
  char a;
  int b;
} test2;

typedef union _test3 {
  char a;
  short b;
  int c;
} test3;

typedef union _test4 {
  struct {
    char a;
    short b;
    int c;
  } a;
  int b;
} test4;

typedef union _test5 {
  double a;
  char b;
} test5;

typedef union _test6 {
  test1 a;
  char b;
} test6;

typedef union _test7 {
  char a;
  char b[2];
  short c;
  char d;
} test7;

typedef union _test8 {
  int a;
  double b;
  int c;
} test8;


void Initialize(v8::Handle<v8::Object> target) {
  Nan::HandleScope scope;

  Nan::Set(target, Nan::New<v8::String>("test1 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test1)));
  Nan::Set(target, Nan::New<v8::String>("test1 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test1)));
  Nan::Set(target, Nan::New<v8::String>("test1 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test1, a)));
  Nan::Set(target, Nan::New<v8::String>("test1 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test1, b)));

  Nan::Set(target, Nan::New<v8::String>("test2 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test2)));
  Nan::Set(target, Nan::New<v8::String>("test2 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test2)));
  Nan::Set(target, Nan::New<v8::String>("test2 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test2, a)));
  Nan::Set(target, Nan::New<v8::String>("test2 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test2, b)));

  Nan::Set(target, Nan::New<v8::String>("test3 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test3)));
  Nan::Set(target, Nan::New<v8::String>("test3 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test3)));
  Nan::Set(target, Nan::New<v8::String>("test3 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test3, a)));
  Nan::Set(target, Nan::New<v8::String>("test3 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test3, b)));
  Nan::Set(target, Nan::New<v8::String>("test3 offsetof c").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test3, c)));

  Nan::Set(target, Nan::New<v8::String>("test4 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test4)));
  Nan::Set(target, Nan::New<v8::String>("test4 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test4)));
  Nan::Set(target, Nan::New<v8::String>("test4 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test4, a)));
  Nan::Set(target, Nan::New<v8::String>("test4 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test4, b)));

  Nan::Set(target, Nan::New<v8::String>("test5 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test5)));
  Nan::Set(target, Nan::New<v8::String>("test5 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test5)));
  Nan::Set(target, Nan::New<v8::String>("test5 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test5, a)));
  Nan::Set(target, Nan::New<v8::String>("test5 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test5, b)));

  Nan::Set(target, Nan::New<v8::String>("test6 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test6)));
  Nan::Set(target, Nan::New<v8::String>("test6 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test6)));
  Nan::Set(target, Nan::New<v8::String>("test6 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test6, a)));
  Nan::Set(target, Nan::New<v8::String>("test6 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test6, b)));

  Nan::Set(target, Nan::New<v8::String>("test7 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test7)));
  Nan::Set(target, Nan::New<v8::String>("test7 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test7)));
  Nan::Set(target, Nan::New<v8::String>("test7 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test7, a)));
  Nan::Set(target, Nan::New<v8::String>("test7 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test7, b)));
  Nan::Set(target, Nan::New<v8::String>("test7 offsetof c").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test7, c)));
  Nan::Set(target, Nan::New<v8::String>("test7 offsetof d").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test7, d)));

  Nan::Set(target, Nan::New<v8::String>("test8 sizeof").ToLocalChecked(), Nan::New<v8::Number>(sizeof(test8)));
  Nan::Set(target, Nan::New<v8::String>("test8 alignof").ToLocalChecked(), Nan::New<v8::Number>(__alignof__(test8)));
  Nan::Set(target, Nan::New<v8::String>("test8 offsetof a").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test8, a)));
  Nan::Set(target, Nan::New<v8::String>("test8 offsetof b").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test8, b)));
  Nan::Set(target, Nan::New<v8::String>("test8 offsetof c").ToLocalChecked(), Nan::New<v8::Number>(offsetof(test8, c)));
}

} // anonymous namespace

NODE_MODULE(native_tests, Initialize);
