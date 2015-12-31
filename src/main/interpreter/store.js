export class Store {

    constructor() {
        this.locations = [];
        this.allocated = [];
    }

    alloc(value) {
        let address = 0;
        let size = this.locations.length;

        while (address < size && this.allocated[address]) {
            address++;
        }

        if (address < size) {
            this.locations[address] = value;

            value.address = address;

            this.allocated[address] = true;

            return address;
        }

        this.locations.push(value);
        this.allocated.push(true);

        value.address = size;

        return size;
    }

    free(address) {
        if (address >= 0 && address < this.allocated.length) {
            this.allocated[address] = false;
        }
    }

    put(address, value) {
        if (address >= 0 && address < this.locations.length) {
            this.locations[address] = value;
        }
    }

    get(address) {
        if (address >= 0 && address < this.locations.length) {
            return this.locations[address];
        }

        return undefined;
    }
}