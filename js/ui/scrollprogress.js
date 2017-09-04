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
			if(!obj.height) obj.height = 5;
			if(!obj.bgColor) obj.bgColor = '#2598e7';
			this.progress_bar = $(obj.target);
			this.progress_bar.css('height', obj.height);
			this.progress_bar.css('background-color', obj.bgColor);
			this.addEvent(this.progress_bar);
			this.updateProgress();
		},

		updateProgress: function(event) {
			var scroll_top = $(window).scrollTop(); //current vertical position of the scroll bar
			var bottom_page = $(document).height() - $(window).height(); //(height of HTML document - height of browser viewport)
			scrollprogress.progress_bar.css('width',  scrollprogress.calculatePercent(scroll_top, bottom_page) );
		},

		calculatePercent: function(num1, num2) {
			var percent = Math.ceil( num1 / num2 * 100 ) + '%';
			return percent;
		},

		addEvent: function(progress_bar) {
			$(document).on('scroll', this.updateProgress);
			$(window).on('resize', this.updateProgress);
		}
	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);
