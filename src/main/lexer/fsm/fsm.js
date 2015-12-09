export const InvalidFsmState = -1;

export class Fsm {

    constructor(states, startState, finalStates, transition) {
        this.states = states instanceof Set ? states : new Set();
        this.startState = startState;
        this.transition = transition;
        this.finalStates = finalStates instanceof Set ? finalStates : new Set();
    }

    run(input) {
        let buffer = '';
        let state = this.startState;

        for (let i = 0, length = input.length; i < length; ++i) {
            let symbol = input.charAt(i);

            let tmpState = this.transition(state, symbol);
            if (tmpState === InvalidFsmState) {
                break;
            }

            state = tmpState;
            
            buffer += symbol;
        }

        return { recognized: this.finalStates.has(state), value: buffer };
    }
}