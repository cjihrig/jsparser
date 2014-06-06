var parser = require("../ecmascript");
var source = "console.log('Hello World!');";
var ast;

try {
  ast = parser.parse(source);
  console.log(ast);
} catch (exception) {
  console.log("Parse Error:  " + exception.message);
}
