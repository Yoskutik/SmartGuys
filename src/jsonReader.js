import fs from 'fs';

/** @class JSONReader implements I/O with .json files */
export default class JSONReader {
    #jsonPath;

    /**
     * @constructor
     * @param {string} jsonPath Path to needed .json file
     */
    constructor(jsonPath) {
        this.#jsonPath = jsonPath;
        let rowData = fs.readFileSync(jsonPath);
        Object.assign(this, JSON.parse(rowData));
    }

    /**
     * Saves the data existing data and given data
     *
     * @param {Object} data
     */
    save(data = {}) {
        try {
            Object.assign(this, data);
            fs.writeFileSync(this.#jsonPath, JSON.stringify(this, undefined, 2));
            return true;
        } catch {
            return false;
        }
    }
}
