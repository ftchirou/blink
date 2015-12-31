export class SymbolTable {

    constructor() {
        this.namespaces = new Map();
        this.enterNamespace('default');
    }

    enterNamespace(namespace) {
        if (!this.namespaces.has(namespace)) {
            this.namespaces.set(namespace, []);
        }

        this.scopes = this.namespaces.get(namespace);
        this.currentScopeIndex = -1;
        this.scope = null;
    }

    enterScope() {
        if (this.currentScopeIndex + 1 >= this.scopes.length) {
            this.scopes.push(new Map());
        }

        this.scope = this.scopes[++this.currentScopeIndex];
    }

    add(symbol) {
        if (this.scope !== null) {
            this.scope.set(symbol.identifier, symbol);
        }
    }

    check(identifier) {
        if (this.scope === null) {
            return false;
        }

        return this.scope.has(identifier);
    }

    scopesCount() {
        return this.scopes.length;
    }

    find(identifier) {
        if (this.scope === null) {
            return undefined;
        }

        let symbol = undefined;
        let scope = this.scope;
        let scopeIndex = this.currentScopeIndex;

        while (symbol === undefined && scopeIndex >= 0) {
            symbol = scope.get(identifier);
            scope = this.scopes[--scopeIndex];
        }

        return symbol;
    }

    exitScope() {
        this.scopes.splice(this.currentScopeIndex, 1);

        this.scope = --this.currentScopeIndex >= 0 ? this.scopes[this.currentScopeIndex] : null;
    }

    clear() {
        this.namespaces = new Map();
        this.enterNamespace('default');
    }
}