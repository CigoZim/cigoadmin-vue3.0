"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var routes = [
    {
        path: "/",
        name: "Home",
        component: function () { return Promise.resolve().then(function () { return require("@/components/frame/Home.vue"); }); }
    },
    {
        path: "/login",
        name: "Login",
        component: function () { return Promise.resolve().then(function () { return require("@/components/frame/Login.vue"); }); }
    },
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(process.env.BASE_URL),
    routes: routes
});
exports["default"] = router;
