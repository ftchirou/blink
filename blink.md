# Blink

## Features

* Object-oriented language.
* Statically (manifestly) typed language with type inference where possible.
* All object properties are _private_ by default.
* All object methods are _public_ by default.
* Supports auto-properties (automatic generation of getters and setters for properties).
* Supports anonymous functions.

## Syntax

### Condition

```
    if (cond_expr) expr
```

or

```
    if (cond_expr) then_expr else else_expr
```

### Loops

#### For loop

```
    for (var_name <- start_expr to end_expr) expr
```

#### While loop

```
    while (cond_expr) expr
```

### Variable declaration

Variables are declared using a **let binding** and can only be used in the body of the let.

```
    let a = 1, b = 2 in { // Type inferred
        a + b
    }
```

or 

```
    let a: Int = 1, b: Int = 2 in { // Explicit typing
        a + b
    }
```

### Method definition

```
    def add(a: Int, b: Int): Int = { // Return types and explicit typing for parameters compulsory.
        a + b
    }
```

### Class definition

#### Property

##### Normal property

```
    def name: String
```

##### Auto property

```
    auto def name: String
```

Getter ```name()``` and setter ```name(String)``` automatically generated.

### Class

```
    class Complex(num: Int, den: Int) {
    
        auto def numerator: Int = num
        
        auto def denominator: Int = den
        
        def gcd(): Int = {
            let a = numerator, b = denominator in {
                if (b == 0) a else gcd(b, a % b)
            }
        }
    }
```