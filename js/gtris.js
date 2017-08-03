(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var makeDimmed = function(className, opacity, bgColor, zIndex) {

		var dimmed = document.createElement('div');
		dimmed.style.position = 'fixed';
		dimmed.style.top = 0;
		dimmed.style.left = 0;
		dimmed.style.width = '100%';
		dimmed.style.height = '100%';

		if(className === undefined) {
			className = 'gtrisDimmed';
		}else{
			className = className;
		}

		if(opacity === undefined) {
			opacity = 0.5;
		}else{
			opacity = opacity;
		}

		if(bgColor === undefined) {
			bgColor = '#000';
		}else{
			bgColor = bgColor;
		}

		if(zIndex === undefined) {
			zIndex = 1010;
		}else{
			zIndex = zIndex;
		}

		dimmed.setAttribute('class', className);
		dimmed.style.opacity = opacity;
		dimmed.style.background = bgColor;
		dimmed.style.zIndex = zIndex;

		return dimmed;
	};

	gtris.util.makeDimmed = makeDimmed;

})(window.gtris);

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
		escKeyArr : [],
		clonedArr : [],

		open: function(obj) {
			var _obj = obj;
			var _position = _obj.position;
			var _overlayOpacity = _obj.overlayOpacity;
			var _overlayClose = _obj.overlayClose;
			var _overlayColor = _obj.overlayColor;
			var _escKey = _obj.escKey;
			var _selector = _obj.target.charAt(0);

			//set option
			if(_position === undefined) _position = ['center','center'];
			if(_overlayOpacity === undefined) _overlayOpacity = 0.5;
			if(_overlayColor === undefined) _overlayColor = '#000000';
			if(_overlayClose === undefined) _overlayClose = false;
			if(_escKey === undefined) {
				this.escKeyArr.push(true);
			}else{
				this.escKeyArr.push(_obj.escKey);
			}

			this.options = {
				position : _position,
				overlayOpacity : _overlayOpacity,
				overlayColor : _overlayColor,
				overlayClose : _overlayClose
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
			var $overlay = $(gtris.util.makeDimmed('gt-overlay', 0, this.options.overlayColor));
			$overlay.css('opacity', this.options.overlayOpacity);

			//append overlay, modal
			$overlay.appendTo(this.wrapperArr[this.wrapperArr.length - 1]);
			$target.appendTo(this.wrapperArr[this.wrapperArr.length - 1]);

			//add event
			$target.find('[data-modal="hide"]').on('click', function(event) {
				modal.hideModal(_obj);
			});

			if(this.options.overlayClose) {
				$overlay.on('click', function(event) {
					modal.hideModal(_obj);
				});
			}

			//completed event return
			if(_obj.completed) {
				return _obj.completed($target);
			}
		},

		hideModal: function(_obj) {
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

(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var collapse = {

		init: function(obj) {
			var _obj = obj;
			if(!_obj.expandable) _obj.expandable = false;
			if(!_obj.slideTime) _obj.slideTime = 250;
			this.addEvent(_obj);
		},

		collapseContent: function(event) {
			event.preventDefault();
			var obj = event.data.obj;
			var $target = $(obj.target);
			var $collapseHeader = $(event.target);
			var $thisContent = $collapseHeader.closest('.gt-collapse-item').find('[data-collapse="content"]');
			var $collapseContent = $target.find('[data-collapse="content"]');
			
			//expandable
			if(!obj.expandable) {
				$collapseContent.parent().removeClass('gt-active');
				$collapseContent.slideUp(obj.slideTime);
			}
			//show & hide
			if($thisContent.is(':hidden')) {
				$thisContent.slideDown(obj.slideTime);
				$collapseHeader.closest('.gt-collapse-item').addClass('gt-active');
			}else{
				$thisContent.slideUp(obj.slideTime);
				$collapseHeader.parent().removeClass('gt-active');
			}
		},

		addEvent: function(obj) {
			var $acd_head = $(obj.target).find('[data-collapse="header"]');
			$acd_head.on('click', { obj: obj }, this.collapseContent);
		}
	};

	gtris.ui.collapse = collapse;

})(window.gtris);