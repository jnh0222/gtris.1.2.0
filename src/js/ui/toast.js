(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var toast = {

		$toast_container: 'toast-container',
		timer: 'toast-delete-time',
		removeSecond: 'remove-second',

		open: function(obj) {

			if( $('.gt-toast-container').length === 0 ) {

				//set options
				if(!obj.direction) obj.direction = 'right-top';
				if(!obj.removeSecond) {
					this.removeSecond = 5000;
				}else{
					this.removeSecond = obj.removeSecond;
				}

				//toast container
				this.$toast_container = $(document.createElement('div'));
				this.$toast_container.addClass('gt-toast-container');
				this.$toast_container.attr('data-direction', obj.direction);
				this.$toast_container.appendTo('body');
				this.$toast_container.animate({opacity: 0}, 0);
				this.$toast_container.animate({opacity: 0.8}, 30);

				//toast
				var $toast = $(document.createElement('div'));
				$toast.addClass('gt-toast');
				$toast.html(obj.message);
				$toast.appendTo(this.$toast_container);

				//set colors
				this.setColors(obj, $toast);

				//add event
				$toast.on('mouseover', toast.mouseoverToast);
				$toast.on('mouseout', toast.mouseoutToast);
				$toast.on('click', toast.deleteToast);
				this.timer = setInterval(this.timerHandler, this.removeSecond);
			}
		},

		setColors: function(obj, $toast) {
			switch(obj.type) {
				case 'primary':
				$toast.addClass('gt-toast-primary');
				break;

				case 'success':
				$toast.addClass('gt-toast-success');
				break;

				case 'info':
				$toast.addClass('gt-toast-info');
				break;

				case 'warning':
				$toast.addClass('gt-toast-warning');
				break;

				case 'danger':
				$toast.addClass('gt-toast-danger');
				break;
			}
		},

		timerHandler: function() {
			toast.$toast_container.remove();
			clearInterval(toast.timer);
		},

		deleteToast: function() {
			toast.$toast_container.remove();
			clearInterval(toast.timer);
		},

		mouseoverToast: function() {
			toast.$toast_container.css('opacity', '1');
			clearInterval(toast.timer);
		},

		mouseoutToast: function() {
			toast.$toast_container.css('opacity', '0.8');
			toast.timer = setInterval(toast.timerHandler, toast.removeSecond);
		}

	};

	gtris.ui.toast = toast;

})(window.gtris);
