import { TokenType } from './lexer/tokentype'
import { Token } from './lexer/token'
import { Fsm, InvalidFsmState } from './lexer/fsm/fsm'
import { Lexer } from './lexer/lexer'

var lexer = new Lexer('3 - 2');

var tokens = lexer.tokenize();

console.log(tokens);


