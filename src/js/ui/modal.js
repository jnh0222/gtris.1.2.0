(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var modal = {

		wrapperArr : [],
		options : {},
		clonedArr : [],

		open: function(obj) {
			var _obj = obj;
			var _overlayOpacity = _obj.overlayOpacity;
			var _overlayColor = _obj.overlayColor;
			var _selector = _obj.target.charAt(0);

			//set option
			if(_overlayOpacity === undefined) _overlayOpacity = 0.5;
			if(_overlayColor === undefined) _overlayColor = '#333';

			this.options = {
				overlayOpacity : _overlayOpacity,
				overlayColor : _overlayColor
			};

			if ( _selector === '#' ||  _selector === '.' ) {
				//no ajax
				if( $(_obj.target).length ) {
					var $target = $(_obj.target);
					$target.css({display: 'block'});
					this.clonedArr.push($target);
					this.showModal( _obj, $target );
				}else{
					this.clonedArr.some(function(item, index, array) {
						item.filter(function(index) {
							if( _selector === '#' ) {
								if( $(this).attr('id') === _obj.target.substring(1) ) {
									modal.showModal( _obj, $(this) );
								}
							}else if( _selector === '.' ) {
								for(var i=0; i<$(this).attr('class').split(' ').length; i++) {
									if( $(this).attr('class').split(' ')[i] === _obj.target.substring(1) ) {
										modal.showModal( _obj, $(this) );
									}
								}
							}
						});
					});
				}
			}else{
				//ajax
				this.ajaxCall(_obj);
			}
		},

		ajaxCall: function(_obj) {
			$.ajax({
				context: this,
				url: _obj.target,
				error : function(xhr, status, error) {
					//console.log('ajax error');
				},
				beforeSend : function() {
					//console.log('loading...');
				},
				success: function(response) {
					var $target = $(response);
					$target.show();
					//$target.css('opacity', '0');
					//show modal
					this.showModal(_obj, $target);
				},
				complete: function() {
					//setPosition();
				}
			}).done(function(data) {
				//console.log('done');
			});
		},

		showModal: function(_obj, $target) {
			//create wrapper
			var gtModalWrapper = $(document.createElement('div'));
			gtModalWrapper.addClass('gt-modal-wrapper');
			gtModalWrapper.appendTo('body');
			this.wrapperArr.push(gtModalWrapper);

			//create overlay
			var $overlay = $(gtris.util.makeDimmed('gt-overlay gt-animate-overlay', this.options.overlayOpacity, this.options.overlayColor, 1050));

			//append overlay, modal
			$overlay.appendTo(this.wrapperArr[this.wrapperArr.length - 1]);
			$target.appendTo(this.wrapperArr[this.wrapperArr.length - 1]);

			var	focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
			var	focusedElementBeforeWindow = $(':focus');
			var o = $target.find('*');
			o.filter(focusableElementsString).filter(':visible').first().focus();

			//add modal hide event(focusout)
			$target.find('[data-modal="hide"]').on('click', function(event) {
				event.preventDefault();
				modal.hideModal(_obj);
				focusedElementBeforeWindow.focus();
			});

			//completed event return
			if(_obj.completed) {
				return _obj.completed($target);
			}
		},

		hideModal: function(_obj, focusedElementBeforeWindow) {
			var lastModalIdx = modal.wrapperArr.length - 1;
			modal.wrapperArr[lastModalIdx].remove();
			modal.wrapperArr.pop();
			//return closed function
			if(_obj && _obj.closed) return _obj.closed();
		},

		closeModal: function() {

		},

		closeModalAll: function() {

		}
	};
    gtris.ui.modal = modal;
})(window.gtris);
