"use strict";
exports.__esModule = true;
exports.apiSign = exports.apiRequest = void 0;
var locutus_1 = require("locutus");
var axios_1 = require("axios");
// 网络请求
exports.apiRequest = {
    v1: axios_1["default"].create({
        baseURL: "http://api-admin.cigoadmin.com" /* apiDomain */ + "/v1"
    })
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
