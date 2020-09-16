"use strict";
exports.__esModule = true;
exports.systemStore = void 0;
var vue_1 = require("vue");
var Store = /** @class */ (function () {
    function Store(initialState) {
        this.state = vue_1.reactive(initialState);
    }
    Store.prototype.getState = function () {
        return this.state;
    };
    Store.prototype.toggleMenu = function () {
        this.state.systemState.sideMenuOpen = !this.state.systemState.sideMenuOpen;
    };
    return Store;
}());
var initialState = function () {
    return ({
        systemState: initialSystemState(),
        userInfo: initialLoginUserInfo()
    });
};
var initialSystemState = function () {
    return ({
        sideMenuOpen: false
    });
};
var initialLoginUserInfo = function () {
    return ({
        isLogin: false
    });
};
var systemStore = new Store(initialState());
exports.systemStore = systemStore;
