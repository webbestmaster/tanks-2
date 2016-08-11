/*global require */
var gulp = require('gulp'),
// clean = require('gulp-rimraf'),
	minifyHTML = require('gulp-minify-html'),
	minifyCss = require('gulp-minify-css'),
	rjs = require('gulp-requirejs'),
	uglify = require('gulp-uglify'),
	findReplace = require('./my_node_modules/find-replace');

gulp.task('default', function () {
	return gulp.start('copy-assets', 'html', 'css', 'js');
});

gulp.task('watch', ['html', 'css', 'js-watch', 'copy-assets'], function () {
	gulp.watch('./www/*.html', ['html']);
	gulp.watch('./www/css/**/*', ['css']);
	gulp.watch('./www/js/**/*', ['js-watch']);
	gulp.watch('./www/src/**/*', ['copy-assets']);
});

gulp.task('html', function () {
	return gulp.src('./www/*.html')
		.pipe(minifyHTML({
			conditionals: true,
			spare: true
		}))
		.pipe(gulp.dest('./dist/www/'));
});

gulp.task('css', function () {
	return gulp.src('./www/css/main.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('./dist/www/css'));
});

// JS
gulp.task('js', function () {
	return gulp.start('collect-js', 'find-replace', 'uglify-js');
});

gulp.task('js-watch', function () {
	return gulp.start('collect-js');
});

gulp.task('collect-js', function () {

	return gulp
		.src('js')
		.pipe(rjs({
			name: 'main',
			baseUrl: './www/js/',
			out: 'main.js',
			// copy paths from main.js
			paths: {

				// load libs
				libLoad: 'lib/lib-load',
				// external libs
				// Deferred: 'lib/external/deferred',
				es5Sham: 'lib/external/es5-sham',
				es5Shim: 'lib/external/es5-shim',

				FPSMeter: 'lib/external/fpsmeter',
				PIXI: 'lib/external/pixi',
				TweenMax: 'lib/external/TweenMax',
				promise: 'lib/external/promise',
				sound: 'lib/external/sound',
				// internal libs
				EndlessArray: 'lib/internal/endless-array',
				// fontLoader: 'lib/internal/font-loader',
				util: 'lib/internal/util',
				Counter: 'lib/internal/Counter',

				// init services, all services are internal
				log: 'services/log',
				device: 'services/device',
				deviceKeys: 'services/device-keys',
				mediator: 'services/mediator',

				// core
				// sources
				loader: 'core/loader',
				textureMaster: 'core/texture/texture-master',
				textureSources: 'core/texture/texture-sources',

				// rendering
				renderer: 'core/renderer/renderer',
				rendererKeys: 'core/renderer/renderer-keys',

				// objects/helpers
				DisplayObject: 'core/display-object/DisplayObject',
				displayObjectKeys: 'core/display-object/display-object-keys',

				// view's core
				View: 'view/view-core/View',
				Layer: 'view/view-core/Layer',

				// other views
				TownView: 'view/town/TownView',
				// TownView's objects
				townViewKeys: 'view/town/town-view-keys',
				TownLayer: 'view/town/layer/TownLayer',
				HeartLayer: 'view/town/layer/HeartLayer',
				heartLayerKeys: 'view/town/layer/heartLayerKeys',
				FlyLayer: 'view/town/layer/FlyLayer',
				flyLayerKeys: 'view/town/layer/flyLayerKeys'

			}
		}))
		.pipe(gulp.dest('./dist/www/js/'));

});

// and remove all marked as remove
gulp.task('find-replace', ['collect-js'], function () {
	return gulp.src('./dist/www/js/main.js')

		// remove all -> [some code] // remove
		.pipe(findReplace({
			list: [
				{
					find: /\n[^\n]*?\/\/\s?remove(?=\n)/g,
					replace: ''
				}
			]
		}))
		.pipe(gulp.dest('./dist/www/js'));
});

gulp.task('uglify-js', ['find-replace'], function () {
	return gulp.src('./dist/www/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/www/js/'));
});

// copy data
gulp.task('copy-assets', function () {

	// folders
	['src', 'sound'].forEach(function (dir) {
		return gulp.src('./www/' + dir + '/**/*')
			.pipe(gulp.dest('./dist/www/' + dir));
	});

	// files
	['favicon.ico', 'js/require.js'].forEach(function (pathToFile) {

		// remove file's name from the path
		var pathToFileFolders = pathToFile.indexOf('/') === -1 ? '' : pathToFile.replace(/\/[^\/]+?$/, '');

		return gulp.src('./www/' + pathToFile)
			.pipe(gulp.dest('./dist/www/' + pathToFileFolders));

	});

});



























