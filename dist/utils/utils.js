"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("lodash/get"));
// TODO: define types
function defaultIndexer(data, path) {
    if (path) {
        return get_1.default(data, path);
    }
    return JSON.stringify(data);
}
function defaultReducer(data) {
    return data;
}
function indexArray(arr = [], { path, indexer, reducer } = {}) {
    if (typeof indexer !== "function") {
        if (typeof path !== "string") {
            console.error(new Error("Path must be provided if an indexer is not provided"));
            return {};
        }
        indexer = defaultIndexer;
    }
    reducer = reducer || defaultReducer;
    const result = arr.reduce((accumulator, current, index) => {
        accumulator[indexer(current, path, arr, index)] = reducer(current, arr, index);
        return accumulator;
    }, {});
    return result;
}
exports.indexArray = indexArray;
// update all types to see if they are correct
function getIndex(list, item, notFoundError) {
    const itemIndex = list.indexOf(item);
    if (itemIndex === -1) {
        throw notFoundError;
    }
    return itemIndex;
}
exports.getIndex = getIndex;
function move(list, item, dropPosition, notFoundError, getItemIndex = getIndex) {
    const itemIndex = getItemIndex(list, item, notFoundError);
    list = [...list];
    list.splice(itemIndex, 1);
    list.splice(dropPosition, 0, item);
    return list;
}
exports.move = move;
function update(list, item, updateItem, notFoundError, getItemIndex = getIndex) {
    const itemIndex = getItemIndex(list, item, notFoundError);
    list = [...list];
    list[itemIndex] = updateItem;
    return list;
}
exports.update = update;
function remove(list, item, notFoundError, getItemIndex = getIndex) {
    const itemIndex = getItemIndex(list, item, notFoundError);
    list = [...list];
    list.splice(itemIndex, 1);
    return list;
}
exports.remove = remove;
function add(list, item, dropPosition) {
    list = [...list];
    list.splice(dropPosition, 0, item);
    return list;
}
exports.add = add;
//# sourceMappingURL=utils.js.map