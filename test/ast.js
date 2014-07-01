var lab = require("lab");
var parser = require("../ecmascript");
var expect = lab.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.experiment;
var it = lab.test;

describe("AST", function() {
  it("parses an empty program", function(done) {
    var source = "";
    var program = parser.parse(source);

    expect(program.type).to.equal("Program");
    expect(program.body.length).to.equal(0);
    done();
  });

  it("parses a single line comment", function(done) {
    var source = "// var foo = 5;";
    var program = parser.parse(source);

    expect(program.type).to.equal("Program");
    expect(program.body.length).to.equal(0);
    done();
  });

  it("parses a multiline comment", function(done) {
    var source = "/* var foo = 5;*/";
    var program = parser.parse(source);

    expect(program.type).to.equal("Program");
    expect(program.body.length).to.equal(0);
    done();
  });

  it("parses an empty statement", function(done) {
    var source = ";";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("EmptyStatement");
    done();
  });

  it("parses an empty block statement", function(done) {
    var source = "{}";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("BlockStatement");
    expect(statement.body.length).to.equal(0);
    done();
  });

  it("parses boolean literals", function(done) {
    var source = "true; false;";
    var program = parser.parse(source);
    var statement1 = program.body[0];
    var statement2 = program.body[1];
    var expr1 = statement1.expression;
    var expr2 = statement2.expression;

    expect(statement1.type).to.equal("ExpressionStatement");
    expect(statement2.type).to.equal("ExpressionStatement");
    expect(expr1.type).to.equal("Literal");
    expect(expr1.value).to.equal(true);
    expect(expr2.type).to.equal("Literal");
    expect(expr2.value).to.equal(false);
    done();
  });

  it("parses null literal", function(done) {
    var source = "null;";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("Literal");
    expect(expr.value).to.equal(null);
    done();
  });

  it("parses a single variable declaration with no assignment", function(done) {
    var source = "var foo;";
    var program = parser.parse(source);
    var decl = program.body[0];
    var decls;

    expect(decl.type).to.equal("VariableDeclaration");
    expect(decl.kind).to.equal("var");
    decls = decl.declarations;
    expect(decls.length).to.equal(1);
    expect(decls[0].type).to.equal("VariableDeclarator");
    expect(decls[0].id.type).to.equal("Identifier");
    expect(decls[0].id.name).to.equal("foo");
    expect(decls[0].init).to.equal(null);
    done();
  });

  it("parses a single variable declaration with numeric assignment", function(done) {
    var source = "var foo = 1;";
    var program = parser.parse(source);
    var decl = program.body[0];
    var decls;

    expect(decl.type).to.equal("VariableDeclaration");
    expect(decl.kind).to.equal("var");
    decls = decl.declarations;
    expect(decls.length).to.equal(1);
    expect(decls[0].type).to.equal("VariableDeclarator");
    expect(decls[0].id.type).to.equal("Identifier");
    expect(decls[0].id.name).to.equal("foo");
    expect(decls[0].init.type).to.equal("Literal");
    expect(decls[0].init.value).to.equal(1);
    done();
  });

  it("parses multiple variable declarations", function(done) {
    var source = "var foo, bar;";
    var program = parser.parse(source);
    var decl = program.body[0];

    expect(decl.type).to.equal("VariableDeclaration");
    expect(decl.kind).to.equal("var");
    expect(decl.declarations.length).to.equal(2);
    done();
  });

  it("parses assignment statement", function(done) {
    var source = "foo = true;";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("AssignmentExpression");
    expect(expr.operator).to.equal("=");
    expect(expr.left.type).to.equal("Identifier");
    expect(expr.left.name).to.equal("foo");
    expect(expr.right.type).to.equal("Literal");
    expect(expr.right.value).to.equal(true);
    done();
  });

  it("parses an if statement with no else", function(done) {
    var source = "if (true) ;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("IfStatement");
    expect(statement.test.type).to.equal("Literal");
    expect(statement.test.value).to.equal(true);
    expect(statement.consequent.type).to.equal("EmptyStatement");
    expect(statement.alternate).to.equal(null);
    done();
  });

  it("parses an if statement with no else and empty block consequent", function(done) {
    var source = "if (true) {}";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("IfStatement");
    expect(statement.test.type).to.equal("Literal");
    expect(statement.test.value).to.equal(true);
    expect(statement.consequent.type).to.equal("BlockStatement");
    expect(statement.consequent.body.length).to.equal(0);
    expect(statement.alternate).to.equal(null);
    done();
  });

  it("parses an if statement with else", function(done) {
    var source = "if (true) ; else ;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("IfStatement");
    expect(statement.test.type).to.equal("Literal");
    expect(statement.test.value).to.equal(true);
    expect(statement.consequent.type).to.equal("EmptyStatement");
    expect(statement.alternate.type).to.equal("EmptyStatement");
    done();
  });

  it("parses an if statement with empty block else", function(done) {
    var source = "if (true) ; else {}";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("IfStatement");
    expect(statement.test.type).to.equal("Literal");
    expect(statement.test.value).to.equal(true);
    expect(statement.consequent.type).to.equal("EmptyStatement");
    expect(statement.alternate.type).to.equal("BlockStatement");
    expect(statement.alternate.body.length).to.equal(0);
    done();
  });

  it("parses a labeled statement", function(done) {
    var source = "foo: ;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("LabeledStatement");
    expect(statement.label.type).to.equal("Identifier");
    expect(statement.label.name).to.equal("foo");
    expect(statement.body.type).to.equal("EmptyStatement");
    done();
  });

  it("parses a break statement with no label", function(done) {
    var source = "break;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("BreakStatement");
    expect(statement.label).to.equal(null);
    done();
  });

  it("parses a break statement with a label", function(done) {
    var source = "break foo;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("BreakStatement");
    expect(statement.label.type).to.equal("Identifier");
    expect(statement.label.name).to.equal("foo");
    done();
  });

  it("parses a continue statement with no label", function(done) {
    var source = "continue;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("ContinueStatement");
    expect(statement.label).to.equal(null);
    done();
  });

  it("parses a continue statement with a label", function(done) {
    var source = "continue foo;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("ContinueStatement");
    expect(statement.label.type).to.equal("Identifier");
    expect(statement.label.name).to.equal("foo");
    done();
  });

  it("parses a debugger statement", function(done) {
    var source = "debugger;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("DebuggerStatement");
    done();
  });

  it("parses a return statement with no argument", function(done) {
    var source = "return;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("ReturnStatement");
    expect(statement.argument).to.equal(null);
    done();
  });

  it("parses a return statement with an argument", function(done) {
    var source = "return null;";
    var program = parser.parse(source);
    var statement = program.body[0];

    expect(statement.type).to.equal("ReturnStatement");
    expect(statement.argument.type).to.equal("Literal");
    expect(statement.argument.value).to.equal(null);
    done();
  });

  it("parses an empty array literal", function(done) {
    var source = "[]";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("ArrayExpression");
    expect(expr.elements.length).to.equal(0);
    done();
  });

  it("parses an empty object literal", function(done) {
    var source = "({})";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("ObjectExpression");
    expect(expr.properties.length).to.equal(0);
    done();
  });

  it("parses typeof expression", function(done) {
    var source = "typeof foo;";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("UnaryExpression");
    expect(expr.operator).to.equal("typeof");
    expect(expr.prefix).to.equal(true);
    expect(expr.argument.type).to.equal("Identifier");
    expect(expr.argument.name).to.equal("foo");
    done();
  });

  it("parses void expression", function(done) {
    var source = "void 0;";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("UnaryExpression");
    expect(expr.operator).to.equal("void");
    expect(expr.prefix).to.equal(true);
    expect(expr.argument.type).to.equal("Literal");
    expect(expr.argument.value).to.equal(0);
    done();
  });

  it("parses logical not expression", function(done) {
    var source = "!foo;";
    var program = parser.parse(source);
    var statement = program.body[0];
    var expr = statement.expression;

    expect(statement.type).to.equal("ExpressionStatement");
    expect(expr.type).to.equal("UnaryExpression");
    expect(expr.operator).to.equal("!");
    expect(expr.prefix).to.equal(true);
    expect(expr.argument.type).to.equal("Identifier");
    expect(expr.argument.name).to.equal("foo");
    done();
  });

  it("parses try...catch...finally statement", function(done) {
    var source = "try {} catch (error) {} finally {}";
    var program = parser.parse(source);
    var statement = program.body[0];
    var block = statement.block;
    var handlers = statement.handlers;
    var finalizer = statement.finalizer;

    expect(statement.type).to.equal("TryStatement");
    expect(block.type).to.equal("BlockStatement");
    expect(block.body.length).to.equal(0);
    expect(handlers.type).to.equal("CatchClause");
    expect(handlers.param.type).to.equal("Identifier");
    expect(handlers.param.name).to.equal("error");
    expect(handlers.guard).to.equal(null);
    expect(handlers.body.type).to.equal("BlockStatement");
    expect(handlers.body.body.length).to.equal(0);
    expect(finalizer.type).to.equal("BlockStatement");
    expect(finalizer.body.length).to.equal(0);
    done();
  });
});
