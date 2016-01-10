export var TokenType = {

    // Keywords
    Abstract: 'abstract',
    As: 'as',
    Class: 'class',
    Else: 'else',
    Extends: 'extends',
    False: 'false',
    Final: 'final',
    Func: 'func',
    For: 'for',
    If: 'if',
    In: 'in',
    Lazy: 'lazy',
    Let: 'let',
    New: 'new',
    Null: 'null',
    Override: 'override',
    Private: 'private',
    Protected: 'protected',
    Return: 'return',
    Super: 'super',
    To: 'to',
    This: 'this',
    True: 'true',
    Var: 'var',
    While: 'while',

    // Dispatch operators
    Dot: '.',

    // Assignment operators
    LeftArrow: '<-',
    DivEqual: '/=',
    Equal: '=',
    MinusEqual: '-=',
    ModuloEqual: '%=',
    PlusEqual: '+=',
    RightArrow: '->',
    TimesEqual: '*=',

    // Arithmetic operators
    Div: '/',
    Modulo: '%',
    Minus: '-',
    Plus: '+',
    Times: '*',

    // Comparison operators
    DoubleEqual: '==',
    Greater: '>',
    GreaterOrEqual: '>=',
    Less: '<',
    LessOrEqual: '<=',
    NotEqual: '!=',

    // Boolean operators
    And: '&&',
    Not: '!',
    Or: '||',

    // Other operators
    Tilde: '~',
    TildeEqual: '~=',
    Dollar: '$',
    DollarEqual: '$=',
    Caret: '^',
    CaretEqual: '^=',

    // Literals
    Identifier: 'IDENTIFIER',
    Boolean: 'BOOLEAN',
    Double: 'DOUBLE',
    Integer: 'INTEGER',
    Decimal: 'DECIMAL',
    String: 'STRING',

    // Delimiters
    Colon: ':',
    Comma: ',',
    LeftBrace: '{',
    LeftBracket: '[',
    LeftParen: '(',
    Newline: '\n',
    RightBrace: '}',
    RightBracket: ']',
    RightParen: ')',

    EndOfInput: 'EndOfInput',
    Unrecognized: 'Unrecognized'
};