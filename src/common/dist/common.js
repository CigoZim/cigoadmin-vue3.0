"use strict";
exports.__esModule = true;
exports.fileSizeFormat = void 0;
/**
 * 获取文件大小文字
 * @param fileSize
 */
function fileSizeFormat(fileSize) {
    if (fileSize < 1024) {
        return fileSize + "B";
    }
    else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        return temp.toFixed(1) + "KB";
    }
    else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        return temp.toFixed(1) + "MB";
    }
    else {
        var temp = fileSize / (1024 * 1024 * 1024);
        return temp.toFixed(1) + "GB";
    }
}
exports.fileSizeFormat = fileSizeFormat;
