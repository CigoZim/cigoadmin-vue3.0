/**
 * 获取文件大小文字
 * @param fileSize
 */
export function fileSizeFormat(fileSize: number): string {
	if (fileSize < 1024) {
		return fileSize + "B";
	} else if (fileSize < 1024 * 1024) {
		let temp: number = fileSize / 1024;
		return temp.toFixed(1) + "KB";
	} else if (fileSize < 1024 * 1024 * 1024) {
		let temp: number = fileSize / (1024 * 1024);
		return temp.toFixed(1) + "MB";
	} else {
		let temp: number = fileSize / (1024 * 1024 * 1024);
		return temp.toFixed(1) + "GB";
	}
}
