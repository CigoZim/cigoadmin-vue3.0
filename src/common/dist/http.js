"use strict";
exports.__esModule = true;
exports.apiSign = exports.apiErrorCatch = exports.apiRequest = void 0;
var locutus_1 = require("locutus");
var axios_1 = require("axios");
// 网络请求
exports.apiRequest = {
    v1: axios_1["default"].create({
        baseURL: "http://api-admin.cigoadmin.com" /* apiDomain */ + "/v1"
    })
};
exports.apiErrorCatch = {
    v1: function (error) {
        console.log(500 % 400, 501 % 400, 400 % 400, 405 % 400, 101 % 400);
        console.log("apiError-v1:", error.response.status);
        console.log("apiError-v1:", error.response.status % 400);
        console.log("apiError-v1:", error.response);
    }
};
/**
 * 接口签名
 * @param params 请求参数
 */
function apiSign(params) {
    // 参数排序
    locutus_1.php.array.ksort(params);
    var sign = locutus_1.php.url.http_build_query(params);
    sign = locutus_1.php.strings.md5(sign);
    //封装header
    return {
        "Cigo-Device-Type": "mpWeixin",
        "Cigo-Timestamp": Date.parse(new Date().toString()) / 1000,
        "Cigo-Sign": sign
    };
}
exports.apiSign = apiSign;
