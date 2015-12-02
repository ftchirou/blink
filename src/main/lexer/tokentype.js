export var TokenType = {

    // Keywords
    Abstract: 'abstract',
    Class: 'class',
    Def: 'def',
    Else: 'else',
    Extends: 'extends',
    False: 'false',
    Final: 'final',
    For: 'for',
    If: 'if',
    In: 'in',
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

    // Literals
    Identifier: '$Identifier',
    Boolean: '$Boolean',
    Double: '$Double',
    Integer: '$Integer',
    Decimal: '$Decimal',
    String: '$String',

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