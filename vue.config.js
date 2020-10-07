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
	},
	chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: './src/**/css/*.scss'
                })
                .end()
        })
    }
};
