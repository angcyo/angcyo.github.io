$(document).ready(function() {
	$('#fullpage').fullpage({
		'verticalCentered': false,
		//		'sectionsColor': ['#150E1F', '#1BBC9B', '#7E8F7C', '#1bbc9b', '#4BBFC3', '#7BAABE'],
		'navigation': true,
		'navigationPosition': 'right',
		'navigationTooltips': ['个人简介', 'APP-->玩得开心', 'APP-->昂递配送', 'APP-->办公OA系统', 'APP-->省份车标简称查询', 'APP-->下载器', 'APP-->安卓API浏览器', 'APP-->程序锁', 'APP-->圆周率诗歌'],
		'showActiveTooltip': true,
		'afterLoad': function(anchorLink, index) {
			var app_contain, app_img1, app_img2, app_img3, app_img4, app_p, bg_col;
			if (index == 1) {
				move('body').set('background-color', '#150E1F').end(function() {
					$('.intro').textillate('start');
					$('.l_intro p').textillate('start');
					$('.r_intro p').textillate('start');
					move('.intro').set('top', '-80%').end();
					move('.l_intro').set('left', '0%').set('top', '30%').end();
					move('.r_intro').set('right', '0%').set('bottom', '30%').end();
				});
			} else {
				if (index == 2) {
					app_contain = '.s_y2havefun .app_contain';
					app_img1 = '.s_y2havefun .img1';
					app_img2 = '.s_y2havefun .img2';
					app_img3 = '.s_y2havefun .img3';
					app_img4 = '.s_y2havefun .img4';
					app_p = '.s_y2havefun p';
					bg_col = '#1BBC9B';
				} else if (index == 3) {
					app_contain = '.s_ondemand .app_contain';
					app_img1 = '.s_ondemand .img1';
					app_img2 = '.s_ondemand .img2';
					app_img3 = '.s_ondemand .img3';
					app_img4 = '.s_ondemand .img4';
					app_p = '.s_ondemand p';
					bg_col = '#7E8F7C';
				} else if (index == 4) {
					app_contain = '.oaschool .app_contain';
					app_img1 = '.oaschool .img1';
					app_img2 = '.oaschool .img2';
					app_img3 = '.oaschool .img3';
					app_img4 = '.oaschool .img4';
					app_p = '.oaschool p';
					bg_col = '#1bbc9b';
				} else if (index == 5) {
					app_contain = '.s_y2tools .app_contain';
					app_img1 = '.s_y2tools .img1';
					app_img2 = '.s_y2tools .img2';
					app_img3 = '.s_y2tools .img3';
					app_img4 = '.s_y2tools .img4';
					app_p = '.s_y2tools p';
					bg_col = '#927357';
				} else if (index == 6) {
					app_contain = '.s_down .app_contain';
					app_img1 = '.s_down .img1';
					app_img2 = '.s_down .img2';
					app_img3 = '.s_down .img3';
					app_img4 = '.s_down .img4';
					app_p = '.s_down p';
					bg_col = '#9A8005';
				} else if (index == 7) {
					app_contain = '.s_y2androidapi .app_contain';
					app_img1 = '.s_y2androidapi .img1';
					app_img2 = '.s_y2androidapi .img2';
					app_img3 = '.s_y2androidapi .img3';
					app_img4 = '.s_y2androidapi .img4';
					app_p = '.s_y2androidapi p';
					bg_col = '#408080';
				} else if (index == 8) {
					app_contain = '.s_y2lockapp .app_contain';
					app_img1 = '.s_y2lockapp .img1';
					app_img2 = '.s_y2lockapp .img2';
					app_img3 = '.s_y2lockapp .img3';
					app_img4 = '.s_y2lockapp .img4';
					app_p = '.s_y2lockapp p';
					bg_col = '#669801';
				} else if (index == 9) {
					app_contain = '.s_y2pigame .app_contain';
					app_img1 = '.s_y2pigame .img1';
					app_img2 = '.s_y2pigame .img2';
					app_img3 = '.s_y2pigame .img3';
					app_img4 = '.s_y2pigame .img4';
					app_p = '.s_y2pigame p';
					bg_col = '#879393';
				}
				move('body').set('background-color', bg_col).end(function() {
					$(app_p).textillate('start');
					move(app_contain).set('left', '0%').end(function() {
						move(app_img1).set('right', '75%').end(function() {
							move(app_img2).set('right', '55%').end(function() {
								move(app_img3).set('right', '35%').end(function() {
									move(app_img4).set('right', '15%').end();
								});
							});
						});
					});

				});
			}

		},
		'onLeave': function(index, nextIndex, direction) {
			var app_contain, app_img1, app_img2, app_img3, app_img4, app_p;
			if (index == 1) {
				move('.intro').set('top', '0%').end();
				move('.l_intro').set('left', '-100%').set('top', '10%').end();
				move('.r_intro').set('right', '-100%').set('bottom', '10%').end();
			} else {
				if (index == 2) {
					app_contain = '.s_y2havefun .app_contain';
					app_img1 = '.s_y2havefun .img1';
					app_img2 = '.s_y2havefun .img2';
					app_img3 = '.s_y2havefun .img3';
					app_img4 = '.s_y2havefun .img4';
					app_p = '.s_y2havefun p';
				} else if (index == 3) {
					app_contain = '.s_ondemand .app_contain';
					app_img1 = '.s_ondemand .img1';
					app_img2 = '.s_ondemand .img2';
					app_img3 = '.s_ondemand .img3';
					app_img4 = '.s_ondemand .img4';
					app_p = '.s_ondemand p';
				} else if (index == 4) {
					app_contain = '.oaschool .app_contain';
					app_img1 = '.oaschool .img1';
					app_img2 = '.oaschool .img2';
					app_img3 = '.oaschool .img3';
					app_img4 = '.oaschool .img4';
					app_p = '.oaschool p';
				} else if (index == 5) {
					app_contain = '.s_y2tools .app_contain';
					app_img1 = '.s_y2tools .img1';
					app_img2 = '.s_y2tools .img2';
					app_img3 = '.s_y2tools .img3';
					app_img4 = '.s_y2tools .img4';
					app_p = '.s_y2tools p';
				} else if (index == 6) {
					app_contain = '.s_down .app_contain';
					app_img1 = '.s_down .img1';
					app_img2 = '.s_down .img2';
					app_img3 = '.s_down .img3';
					app_img4 = '.s_down .img4';
					app_p = '.s_down p';
				} else if (index == 7) {
					app_contain = '.s_y2androidapi .app_contain';
					app_img1 = '.s_y2androidapi .img1';
					app_img2 = '.s_y2androidapi .img2';
					app_img3 = '.s_y2androidapi .img3';
					app_img4 = '.s_y2androidapi .img4';
					app_p = '.s_y2androidapi p';
				} else if (index == 8) {
					app_contain = '.s_y2lockapp .app_contain';
					app_img1 = '.s_y2lockapp .img1';
					app_img2 = '.s_y2lockapp .img2';
					app_img3 = '.s_y2lockapp .img3';
					app_img4 = '.s_y2lockapp .img4';
					app_p = '.s_y2lockapp p';
				} else if (index == 9) {
					app_contain = '.s_y2pigame .app_contain';
					app_img1 = '.s_y2pigame .img1';
					app_img2 = '.s_y2pigame .img2';
					app_img3 = '.s_y2pigame .img3';
					app_img4 = '.s_y2pigame .img4';
					app_p = '.s_y2pigame p';
				}
				move(app_contain).set('left', '-160%').end();
				move(app_img1).set('left', '0%').end();
				move(app_img2).set('left', '0%').end();
				move(app_img3).set('left', '0%').end();
				move(app_img4).set('left', '0%').end();
			}
		}
	});

	$("img").hover(function() {
		$(this).css({
			'z-index': 200
		});
		move(this).scale(1.3).end();
	}, function() {
		$(this).css({
			'z-index': 0
		});
		move(this).scale(1).end();
	});

});