# Blink Programming Language

Blink is a tiny programming language whose sole purpose is to learn how to design and implement a programming language. Blink is an interpreted class-based, object-oriented programming language featuring a strong static type system. Its syntax and semantics are inspired by the programming languages [Scala](https://en.wikipedia.org/wiki/Scala_(programming_language)), [Clojure](https://en.wikipedia.org/wiki/Clojure), [Kotlin](https://en.wikipedia.org/wiki/Kotlin_(programming_language)) and [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)).

This repository contains the tokenizer, the parser, the type checker, the interpreter and the standard library.

# Getting starting

## How to setup

Blink is implemented in [ES6](https://en.wikipedia.org/wiki/ECMAScript#ES6) and the interpreter requires [Node.js](https://nodejs.org/en/) >= 4.2.2 to run.

With Node.js installed, type the following commands in a prompt to setup Blink.

1. ```$ git clone https://github.com/ftchirou/blink.git```
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

#### Cancel the current expression

Type ```Enter``` twice (consecutively) to cancel the current expression and start a new one.

```
blink> 1 +
      | 
      | 
Two blank lines typed. Starting a new expression.
```

#### Load external files

You can define your code in externals files and load them into the interpreter using the ```:load``` command.

```
blink> :load <absoluteFilePath1> [ <absoluteFilePath2>, ...]
```

### What to do in the interpreter

In Blink, everything (a part from global variables, functions and classes which are definitions) is an expression. You can type expressions in the interpreter to have them evaluated.

#### Evaluate literals

Numbers, booleans and strings are all literal expressions and they evaluate to themselves in the interpreter.

```
blink> 42
res0: Int = 42

blink> 3.14
res1: Double = 3.14

blink> true
res2: Bool = true

blink> "Hello, World!"
res3: String = "Hello, World!"
```

#### Compute

You can use the interpreter as a calculator and compute mathematical expressions involving the following operators ```+```, ```-```, ```*```, ```/``` and ```%```.

```
blink> 7 - 4 + 2
res1: Int = 5
```

#### Print

Use ```Console.println()``` to print something in the interpreter.

```
blink> Console.println("Hello, World!")
Hello, World!
```

#### Declare a local variable with let

Block-scoped variables can be defined using a ```let``` expression

```
blink> let message: String = "Hello, World!" in {
      |     Console.println(message)
      | }
Hello, World!
```

In this example, we defined a variable named ```message``` of type ```String``` initialized to ```"Hello, World!```. The part of the expression after the ```in``` keyword is the body of the ```let``` expression. The variable ```message``` is accessible only inside the body of the ```let```.

A ```let``` expression evaluates to the value of the last expression in its body.

##### Omit the type of the variable

If a variable is initialized at its declaration, then its type can be omitted. Blink is able to infer the correct type of a variable according to its value.

```
blink> let message = "Hello, World!" in {
      |     Console.println(message)
      | }
Hello, World!
```

##### Multiple variables

To declare multiple variables at once, separate them with commas.

```
blink> let a = 2, b = 3 in {
      |     a + b
      | }
res1: Int = 5
```

The curly braces around the body can be omitted if the body contains only one expression

```
blink> let a = 2, b = 3 in a + b
res3: Int = 5
```

#### Decide with if

You can use an ```if``` expression to execute one or other expression according to a condition. The condition must evaluate to a ```Bool``` value.

```
blink> if (true) {
      |     "true"
      | } else {
      |     "false"
      | }
res7: String = "true"
```

If the body of the ```if``` or ```else``` branch is made of only one expression, the curly braces can be omitted.

```
blink> if (true) "true" else "false"
res8: String = "true"
```

#### Loop with while

A ```while``` expression is used to execute one or more expressions as long as a condition holds true.

```
blink> let i = 1 in {
      |     while (i <= 10) {
      |         Console.println(i)
      |         i += 1
      |     }
      | }
1
2
3
4
5
6
7
8
9
10
```

#### Define a global variable

Global variables are defined using the ```var``` keyword and are accessible in all expressions in the interpreter.

```
blink> var message: String = "Hello, World!"
message: String = Hello, World!
```

As with ```let``` expressions, indicating the type of the variable is optional when the variable is initialized at its definition.

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

##### Constructor

A class in Blink can only have one constructor which is part of the class header. To define a constructor, add a list of parameters enclosed in parentheses to the name of the class.

```
blink> class Person(firstname: String, lastname: String) {
      | }
defined class Person
```

Objects are then created using the ```new``` keyword

```
blink> new Person("John", "Doe")
res6: Person = Person@8
```

##### Properties

Class properties are declared with the ```var``` keyword

```
blink> class Person {
      |     var firstname: String
      | 
      |     var lastname: String
      | 
      |     var age: Int
      | }
defined class Person
```

Properties can be initialized at declaration. The initialization expression of a property will be evaluated when the object is being created.

*Properties are private*

Properties in Blink are ```private``` and they cannot be made ```public```. If you need to access a property outside of a class, you will need to create a getter and/or a setter for it.

##### Functions

A class can have functions. Functions are declared as normal functions with the ```func``` keyword.

```
blink> class Person(firstname: String, lastname: String) {
      |     var age: Int = 0
      | 
      |     func firstname(): String = {
      |         firstname
      |     }
      | 
      |     func setFirstname(name: String) = {
      |         firstname = name
      |     }
      | 
      |     // ...
      | }
defined class Person
```

Functions can then be called on an object using the ```.``` operator.

```
blink> var person = new Person("John", "Doe")
person: Person = Person@this

blink> person.firstname()
res7: String = "John"
```

*Functions are public by default*

Functions in Blink are ```public``` by default. To make a function ```private```, add the ```private``` modifier to its declaration.

 ```
 blink> class Person {
       |    private func age(): Int = ...
       |}
```

##### Inheritance

A class can inherit another class with the ```extends``` keyword.

```
blink> class Employee(firstname: String, lastname: String, company: String) extends Person(firstname, lastname) {
      |     func company(): String = company
      | 
      |     func setCompany(c: String) = company = c
      | }
defined class Employee

blink> var employee = new Employee("John", "Doe", "ACME")
employee: Employee = Employee@this

blink> employee.firstname()
res8: String = "John"

blink> employee.company()
res9: String = "ACME"
```

When specifying the superclass, you must pass in the parameters required by the constructor of the superclass.

*Object class*

By default, all classes inherit from the ```Object``` class.

##### Override functions

To override a superclass function, use the ```override``` modifier.

```
blink> class Person(firstname: String, lastname: String) {
      |     override func toString(): String = "Person(" + firstname + ", " + lastname + ")"
      | }
defined class Person

blink> new Person("John", "Doe")
res9: Person = Person(John, Doe)
```

*toString()*

The interpreter uses ```toString()``` to display values in the REPL. So, it's always a good idea to override ```toString()``` in your classes to have a more friendly and accurate representation of your values instead of the default
```<className>@<address>``` .

```
blink> new Person("John", "Doe")
res9: Person = Person(John, Doe)
```

instead of

```
blink> new Person("John", "Doe")
res10: Person = Person@12
```

## Next steps

Have a look in the [samples](samples) directory to learn more about the inner details of writing Blink programs.

Domo!
