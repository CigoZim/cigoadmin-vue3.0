/**
 * 上传文件类型过滤标识
 */
export const makeFileExtFilter = () => {
	let fileExtFilter = new Map();
	fileExtFilter.set("jpeg", "/9j/4");
	fileExtFilter.set("gif", "R0lGOD");
	fileExtFilter.set("png", "iVBORw");
	return fileExtFilter;
};

/**
 * 后端保存文件信息
 */
export interface FileSaved {
	id: number;
	type?: string;
	name?: string;
	prefix?: string;
	ext?: string;
	name_saved?: string;
	mime?: string;
	size?: number;
	path?: string;
	path_cover?: string;
	thumb_small?: string;
	thumb_middle?: string;
	md5?: string;
	sha1?: string;
	hash?: string;
	platform?: string;
	platform_bucket?: string;
	platform_key?: string;
	status?: number;
	create_time?: number;
}
