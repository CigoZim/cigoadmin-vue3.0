"use strict";
exports.__esModule = true;
exports.apiSign = void 0;
var locutus_1 = require("locutus");
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
