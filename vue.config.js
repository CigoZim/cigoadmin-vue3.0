module.exports = {
	lintOnSave: false,
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: './admin/',
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
