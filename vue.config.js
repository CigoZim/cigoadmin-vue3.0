module.exports = {
	lintOnSave: false,
	devServer: {
		disableHostCheck: true,
		// proxy: {
		// 	'/v1': {
		// 		target: 'http://api.douban.com/v1',
		// 		changeOrigin: true,
		// 		ws: true,
		// 		pathRewrite: {
		// 			'^/v1': ''
		// 		}
		// 	}
		// }
	}
};
