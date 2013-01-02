"use strict";

(function(parser) {
	var ast = parser.ast;

	ast.ProgramNode.prototype.print = function(indent, indentChar) {
		var elements = this.body;
		var str = "";

		for (var i = 0, len = elements.length; i < len; i++) {
			str += elements[i].print(indent, indentChar) + "\n";
		}

		return str;
	};

	ast.EmptyStatementNode.prototype.print = function(indent, indentChar) {
		return indent + ";";
	};

	ast.BlockStatementNode.prototype.print = function(indent, indentChar) {
		var statements = this.body;
		var str = indent + "{\n";
		var newIndent = indent + indentChar;

		for (var i = 0, len = statements.length; i < len; i++) {
			str += statements[i].print(newIndent, indentChar) + "\n";
		}

		return str += indent + "}";
	};

	ast.ExpressionStatementNode.prototype.print = function(indent, indentChar) {
		return indent + this.expression.print(indent, indentChar) + ";";
	};

	ast.IfStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "if (" + this.test.print("", "") + ")\n";
		var consequent = this.consequent;
		var alternate = this.alternate;

		if (consequent.type === "BlockStatement") {
			str += consequent.print(indent, indentChar);
		} else {
			str += consequent.print(indent + indentChar, indentChar);
		}

		if (alternate !== null) {
			str += "\n" + indent + "else\n";

			if (alternate.type === "BlockStatement") {
				str += alternate.print(indent, indentChar);
			} else {
				str += alternate.print(indent + indentChar, indentChar);
			}
		}

		return str;
	};

	ast.LabeledStatementNode.prototype.print = function(indent, indentChar) {
		return indent + this.label.print("", "") + ": " + this.body.print("", "");
	};

	ast.BreakStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "break";
		var label = this.label;

		if (label !== null)
			str += " " + label.print("", "");

		return str + ";";
	};

	ast.ContinueStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "continue";
		var label = this.label;

		if (label !== null)
			str += " " + label.print("", "");

		return str + ";";
	};

	ast.WithStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "with (" + this.object.print("", "") + ")\n";
		var body = this.body;

		if (body.type === "BlockStatement") {
			str += body.print(indent, indentChar);
		} else {
			str += body.print(indent + indentChar, indentChar);
		}

		return str;
	};

	ast.SwitchStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "switch (" + this.discriminant.print("", "") + ")\n" + indent + "{\n";
		var cases = this.cases;
		var newIndent = indent + indentChar;

		for (var i = 0, len = cases.length; i < len; i++) {
			str += cases[i].print(newIndent, indentChar);
		}

		return str + indent + "}";
	};

	ast.ReturnStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "return";
		var argument = this.argument;

		if (argument !== null)
			str += " " + argument.print("", "");

		return str + ";";
	};

	ast.ThrowStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "throw";
		var argument = this.argument;

		if (argument !== null)
			str += " " + argument.print("", "");

		return str + ";";
	};

	ast.TryStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "try\n";
		var handlers = this.handlers;
		var finalizer = this.finalizer;

		str += this.block.print(indent, indentChar);

		if (handlers !== null)
			str += "\n" + handlers.print(indent, indentChar);

		if (finalizer !== null)
			str += "\n" + indent + "finally\n" + finalizer.print(indent, indentChar);

		return str;
	};

	ast.WhileStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "while (" + this.test.print("", "") + ")\n";
		var body = this.body;

		if (body.type === "BlockStatement") {
			str += body.print(indent, indentChar);
		} else {
			str += body.print(indent + indentChar, indentChar);
		}

		return str;
	};

	ast.DoWhileStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "do\n";
		var body = this.body;

		if (body.type === "BlockStatement") {
			str += body.print(indent, indentChar) + "\n";
		} else {
			str += body.print(indent + indentChar, indentChar) + "\n";
		}

		return str + indent + "while (" + this.test.print("", "") + ");";
	};

	ast.ForStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "for (";
		var init = this.init;
		var test = this.test;
		var update = this.update;
		var body = this.body;

		if (init !== null) {
			if (typeof(init.type) === "undefined") {
				str += "var ";

				for (var i = 0, len = init.length; i < len; i++) {
					if (i !== 0)
						str += ", ";

					str += init[i].print("", "");
				}
			} else {
				str += init.print("", "");
			}
		}

		str += "; ";

		if (test !== null)
			str += test.print("", "");

		str += "; ";

		if (update != null)
			str += update.print("", "");

		str += ")\n";

		if (body.type === "BlockStatement") {
			str += body.print(indent, indentChar) + "\n";
		} else {
			str += body.print(indent + indentChar, indentChar) + "\n";
		}

		return str;
	};

	ast.ForInStatementNode.prototype.print = function(indent, indentChar) {
		var str = indent + "for (";
		var left = this.left;
		var body = this.body;

		if (left !== null) {
			if (left.type === "VariableDeclarator") {
				str += "var " + left.print("", "");
			} else {
				str += left.print("", "");
			}
		}

		str += " in " + this.right.print("", "") + ")\n";

		if (body.type === "BlockStatement") {
			str += body.print(indent, indentChar) + "\n";
		} else {
			str += body.print(indent + indentChar, indentChar) + "\n";
		}

		return str;
	};

	ast.DebugggerStatementNode.prototype.print = function(indent, indentChar) {
		return indent + "debugger;"
	};

	ast.FunctionDeclarationNode.prototype.print = function(indent, indentChar) {
		var str = indent + "function " + this.id.print("", "") + "(";
		var params = this.params;
		var body = this.body;
		var newIndent = indent + indentChar;

		for (var i = 0, len = params.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += params[i].print(newIndent, indentChar);
		}

		str += ")\n" + indent + "{\n";

		for (var i = 0, len = body.length; i < len; i++) {
			str += body[i].print(newIndent, indentChar) + "\n";
		}

		return str + indent + "}";
	};

	ast.VariableDeclarationNode.prototype.print = function(indent, indentChar) {
		var str = indent + this.kind + " ";
		var declarations = this.declarations;

		for (var i = 0, len = declarations.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += declarations[i].print("", "");
		}

		return str;
	};

	ast.VariableDeclaratorNode.prototype.print = function(indent, indentChar) {
		var str = this.id.print("", "");
		var init = this.init;

		if (init !== null)
			str += " = " + init.print("", "");

		return str;
	};

	ast.ThisExpressionNode.prototype.print = function(indent, indentChar) {
		return "this";
	};

	ast.ArrayExpressionNode.prototype.print = function(indent, indentChar) {
		var str = "[";
		var elements = this.elements;

		for (var i = 0, len = elements.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += elements[i].print("", "");
		}

		return str + "]";
	};

	ast.ObjectExpressionNode.prototype.print = function(indent, indentChar) {
		var str = "({";
		var properties = this.properties;

		for (var i = 0, len = properties.length; i < len; i++) {
			var prop = properties[i];
			var kind = prop.kind;
			var key = prop.key;
			var value = prop.value;

			if (i !== 0)
				str += ", ";

			if (kind === "init") {
				str += key.print("", "") + ": " + value.print("", "");
			} else {
				var params = value.params;
				var body = value.body;

				str += kind + " " + key.print("", "") + "(";

				for (var j = 0, plen = params.length; j < plen; j++) {
					if (j !== 0)
						str += ", ";

					str += params[j].print("", "");
				}

				str += ") { ";

				for (var j = 0, blen = body.length; j < blen; j++) {
					str += body[j].print("", "") + " ";
				}

				str += "}";
			}
		}

		return str + "})";
	};

	ast.FunctionExpressionNode.prototype.print = function(indent, indentChar) {
		var str = "(function";
		var id = this.id;
		var params = this.params;
		var body = this.body;
		var newIndent = indent + indentChar;

		if (id !== null)
			str += " " + id.print("", "");

		str += "(";

		for (var i = 0, len = params.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += params[i].print(newIndent, indentChar);
		}

		str += ") { ";

		for (var i = 0, len = body.length; i < len; i++) {
			str += body[i].print(newIndent, indentChar) + " ";
		}

		return str + "})";
	};

	ast.SequenceExpressionNode.prototype.print = function(indent, indentChar) {
		var str = "";
		var expressions = this.expressions;

		for (var i = 0, len = expressions.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += expressions[i].print("", "");
		}

		return str;
	};

	ast.UnaryExpressionNode.prototype.print = function(indent, indentChar) {
		var operator = this.operator;

		if (operator === "delete" || operator === "void" || operator === "typeof") {
			return operator + " (" + this.argument.print("", "") + ")";
		} else {
			return operator + "(" + this.argument.print("", "") + ")";
		}
	};

	ast.BinaryExpressionNode.prototype.print = function(indent, indentChar) {
		return "(" + this.left.print("", "") + ") " + this.operator + " (" + this.right.print("", "") + ")";
	};

	ast.AssignmentExpressionNode.prototype.print = function(indent, indentChar) {
		return "(" + this.left.print("", "") + ") " + this.operator + " (" + this.right.print("", "") + ")";
	};

	ast.UpdateExpressionNode.prototype.print = function(indent, indentChar) {
		if (this.prefix) {
			return "(" + this.operator + this.argument.print("", "") + ")";
		} else {
			return "(" + this.argument.print("", "") + this.operator + ")";
		}
	};

	ast.LogicalExpressionNode.prototype.print = function(indent, indentChar) {
		return "(" + this.left.print("", "") + ") " + this.operator + " (" + this.right.print("", "") + ")";
	};

	ast.ConditionalExpressionNode.prototype.print = function(indent, indentChar) {
		return "(" + this.test.print("", "") + ") ? " + this.consequent.print("", "") + " : " + this.alternate.print("", "");
	};

	ast.NewExpressionNode.prototype.print = function(indent, indentChar) {
		var str = "new " + this.callee.print("", "");
		var args = this.arguments;

		if (args !== null) {
			str += "(";

			for (var i = 0, len = args.length; i < len; i++) {
				if (i !== 0)
					str += ", ";

				str += args[i].print("", "");
			}

			str += ")";
		}

		return str;
	};

	ast.CallExpressionNode.prototype.print = function(indent, indentChar) {
		var str = this.callee.print("", "") + "(";
		var args = this.arguments;

		for (var i = 0, len = args.length; i < len; i++) {
			if (i !== 0)
				str += ", ";

			str += args[i].print("", "");
		}

		return str + ")";
	};

	ast.MemberExpressionNode.prototype.print = function(indent, indentChar) {
		if (this.computed) {
			return this.object.print("", "") + "[" + this.property.print("", "") + "]";
		} else {
			return this.object.print("", "") + "." + this.property.print("", "");
		}
	};

	ast.SwitchCaseNode.prototype.print = function(indent, indentChar) {
		var str = indent;
		var test = this.test;
		var consequent = this.consequent;
		var newIndent = indent + indentChar;

		if (test !== null) {
			str += "case " + test.print("", "") + ":\n";
		} else {
			str += "default:\n";
		}

		for (var i = 0, len = consequent.length; i < len; i++) {
			str += consequent[i].print(newIndent, indentChar) + "\n";
		}

		return str;
	};

	ast.CatchClauseNode.prototype.print = function(indent, indentChar) {
		var str = indent + "catch (" + this.param.print("", "") + ")\n";

		str += this.body.print(indent, indentChar);
		return str;
	};

	ast.IdentifierNode.prototype.print = function(indent, indentChar) {
		return this.name;
	};

	ast.LiteralNode.prototype.print = function(indent, indentChar) {
		return this.value;
	};
})(ecmascript);
