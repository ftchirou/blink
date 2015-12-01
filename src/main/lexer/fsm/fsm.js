import { Output } from './output'

export const InvalidFsmState = -1;

export class Fsm {

    constructor(states, startState, finalStates, transition) {
        this.states = states instanceof Set ? states : new Set();
        this.startState = startState;
        this.transition = transition;
        this.finalStates = finalStates instanceof Set ? finalStates : new Set();
    }

    run(input) {
        var buffer = '';
        var state = this.startState;

        for (var i = 0, length = input.length; i < length; ++i) {
            var symbol = input.charAt(i);

            var tmpState = this.transition(state, symbol);
            if (tmpState === InvalidFsmState) {
                break;
            }

            state = tmpState;
            
            buffer += symbol;
        }

        return { recognized: this.finalStates.has(state), value: buffer };
    }
}