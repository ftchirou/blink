# Blink Programming Language

Blink is a tiny programming language whose sole purpose is to learn how to design and implement a programming language. Blink is an interpreted class-based, object-oriented programming language featuring a strong static type system. Its syntax and semantics are inspired by the programming languages Scala, Clojure and Kotlin.

This repository contains the tokenizer, the parser, the type checker, the interpreter and the standard library.

# Getting starting

## How to setup

Blink is implemented in ES6 and the interpreter requires Node.js >= 4.2.2 to run.

With Node.js installed, type the following commands in a prompt to setup Blink.

1. ```$ git clone https://github.com/andela-ftchirou/blink.git```
2. ```$ cd blink```
3. ```$ npm install```

### How to build

Run ```npm run build``` to build.

### How to run

Run ```npm run repl``` to start an interactive shell for writing Blink programs. Just type your expressions in the interpreter to have them evaluated.

## First steps with Blink

### How to use the Blink interpreter

```
$ npm run repl

Welcome to Blink 0.0.1
Type in expressions to have them evaluated.
Type :quit to quit.


blink> 
```

Type an expression e.g ```1 + 2``` and hit ```Enter```

```blink> 1 + 2```

The interpreter should respond with

```res0: Int = 3```

* ```res0``` is a name you can use to refer to this result in later expressions
* ```Int``` is the type of the result
* ```3``` is the value of the result.

#### Multiline expressions

Expressions can span multiple lines in the interpreter. When pressing ```Enter```, if Blink detects that the expression typed is not yet complete, it will allow you to continue the expression on the next line. Once a complete expression is detected, Blink will automatically evaluate it.

```
Welcome to Blink 0.0.1
Type in expressions to have them evaluated.
Type :quit to quit.


blink> 1 +
      | 2 +
      | 3 +
      | 4 +
      | 5
res1: Int = 15
```

#### Cancelling the current expression

Type ```Enter``` twice (consecutively) to cancel the current expression and start a new one.

```
blink> 1 +
      | 
      | 
Two blank lines typed. Starting a new expression.
```

#### Define a variable

Variables are declared using the ```var``` keyword.

```
blink> var message: String = "Hello, World!"
message: String = Hello, World!
```

Indicating the type of the variable is optional when the variable is initialized at its declaration. This is because Blink is capable of inferring the type of a variable according to its assigned value. The previous example could have been written like the following.

```
blink> var message = "Hello, World!"
message: String = Hello, World!
```

#### Define a function

Functions are declared using the ```func``` keyword.

```
blink> func add(a: Int, b: Int): Int = {
      |     a + b
      | }
add(a: Int, b: Int): Int
```

After the ```func``` keyword, comes the name of the function, the list of parameters separated by commas and enclosed in parentheses (the type of each parameter must be explicitely provided, preceded by a ```:```), a ```:```, the return type of the function, an ```=``` and the body of the function which is a list of expressions enclosed in curly braces.

Once a function is defined, you can call it in the traditional way.

```
blink> add(2, 3)
res4: Int = 5
```

##### Unit functions

If a function does not return any value, its return type must be ```Unit```. However, the ```Unit``` return type declaration is optional, you can then write methods like

```
blink> func greet() = {
      |     Console.println("Hello, World!")
      | }
greet()
```

##### Single-Expression functions

If the body of the function is made up of only one expression, the curly braces can be omitted.

```
blink> func add(a: Int, b: Int): Int = a + b
add(a: Int, b: Int): Int
```

##### No return keyword

There is no ```return``` keyword in Blink. The last expression of the body of a function **is** the return value of the function.

#### Define a class

Classes in Blink are declared using the ```class``` keyword.

```
blink> class Person {
      | }
defined class Person
```
