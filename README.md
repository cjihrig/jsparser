jsparser
========

An ECMAScript 5.1 parser, written in JavaScript. The ECMAScript grammar was created using [Jison](https://github.com/zaach/jison).

A blog post describing the project is available [here](http://cjihrig.com/blog/creating-a-javascript-parser/). You can also test the parser online [here](http://www.cjihrig.com/development/jsparser/).

# Node Usage

Require the `jsparser` module, then simply call the parser's `parse()` method on a string of JavaScript source code. On success, an AST is returned. On failure, an error is thown.

```
var parser = require("jsparser");
var source = "console.log('Hello World!');";
var ast;

try {
  ast = parser.parse(source);
  console.log(ast);
} catch (exception) {
  console.log("Parse Error:  " + exception.message);
}
```
