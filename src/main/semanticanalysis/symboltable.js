export class SymbolTable {

    constructor() {
        this.scopes = [];
        this.currentScopeIndex = -1;
        this.scope = null;
    }

    enterScope() {
        if (this.currentScopeIndex + 1 >= this.scopes.length) {
            this.scopes.push([]);
        }

        this.scope = this.scopes[++this.currentScopeIndex];
    }

    add(symbol) {
        this.scope.push(symbol);
    }

    check(identifier) {
        return this.scope.some((symbol) => symbol.identifier === identifier);
    }

    find(identifier) {
        let symbol = undefined;
        let scope = this.scope;
        let scopeIndex = this.currentScopeIndex;

        while (symbol === undefined && scopeIndex >= 0) {
            symbol = scope.find((s) => s.identifier === identifier);
            scope = this.scopes[--scopeIndex];
        }

        return symbol;
    }

    exitScope() {
        if (this.currentScopeIndex > 0) {
            this.scope = this.scopes[--this.currentScopeIndex];
        }
    }
}