"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var auth_1 = require("./auth");
var routes = [
    {
        path: "/",
        name: "Home",
        component: function () { return Promise.resolve().then(function () { return require("@/components/cigo-admin-core/Home.vue"); }); }
    },
    {
        path: "/login",
        name: "Login",
        component: function () { return Promise.resolve().then(function () { return require("@/components/cigo-admin-core/Login.vue"); }); }
    },
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(process.env.BASE_URL),
    routes: routes
});
router.beforeEach(function (guard) {
    console.log("beforeEach:", guard);
    var continueFlag = auth_1.authInstance.init(guard).checkLogin(router);
    if (!continueFlag) {
        return;
    }
    auth_1.authInstance.checkAuth(router);
});
exports["default"] = router;
