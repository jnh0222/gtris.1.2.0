(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var scrollprogress = {

		progress_bar: 'progress_bar',

		init: function(obj) {
			if(!obj.height) obj.height = '5px';
			if(!obj.barColor) obj.barColor = '#2598e7';
			this.progress_bar = $(obj.target);
			this.progress_bar.css('height', obj.height);
			this.progress_bar.css('background-color', obj.barColor);
			this.progress_bar.css('top', obj.top);
			this.progress_bar.css('bottom', obj.bottom);
			this.addEvent(this.progress_bar);
			this.updateProgress();
		},

		updateProgress: function(event) {
			var scroll_top = $(window).scrollTop(); //current vertical position of the scroll bar
			var bottom_page = $(document).height() - $(window).height(); //(height of HTML document - height of browser viewport)
			var bar_xpos = scrollprogress.calculatePercent(scroll_top, bottom_page);
			scrollprogress.progress_bar.css({"transform": "translate3d("+bar_xpos+"%, 0px, 0px)"});
		},

		calculatePercent: function(n1, n2) {
			var percent = Math.ceil(( n1 / n2 * 100 ) - 100);
			return percent;
		},

		addEvent: function(progress_bar) {
			$(document).on('scroll', this.updateProgress);
			$(window).on('resize', this.updateProgress);
		}
	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);
