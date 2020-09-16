"use strict";
exports.__esModule = true;
exports.authInstance = exports.Auth = void 0;
var index_1 = require("@/store/index");
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.prototype.init = function (initGuard) {
        this.guard = initGuard;
        return this;
    };
    Auth.prototype.getAuard = function () {
        return this.guard;
    };
    /**
     * 检查登录情况
     */
    Auth.prototype.checkLogin = function (router) {
        //是否登录模块
        if (this.guard.name === "Login") {
            return false;
        }
        //是否登录状态
        if (!index_1.systemStore.getState().userInfo.isLogin) {
            console.log("尚未登录，跳转登录页面...");
            router.push("/login");
            return false;
        }
        return true;
    };
    /**
     * 检查权限
     */
    Auth.prototype.checkAuth = function (router) { };
    return Auth;
}());
exports.Auth = Auth;
var authInstance = new Auth();
exports.authInstance = authInstance;
