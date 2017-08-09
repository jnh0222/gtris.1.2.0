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
    if (!gtris.util) {
        gtris.util = window.gtris.util = {};
    }

    var getParameterByName = function(name) {
        if (name === undefined || name === '') return;
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i=0; i<vars.length; i++) {
            var pair = vars[i].split('=');
            if(pair[0] == name) {
                return pair[1];
            }
        }
    };

    gtris.util.getParameterByName = getParameterByName;

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

(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var tooltip = {
		
		init: function(obj) {
			var $tt = obj.target;
			var event_trigger = obj.event;

			switch(event_trigger) {
				case 'click':
				event_trigger = 'click';
				break;

				case 'mouseover':
				event_trigger = 'mouseover';
				$tt.find('[data-tooltip="button"]').on('mouseleave', this.toggleTT);
				break;

				default:
				event_trigger = 'click';
			}
			
			this.addEvent($tt, event_trigger);
		},

		toggleTT: function(event) {
			var $tt_btn = $(event.target);
			var $tt_cnt = $tt_btn.siblings('[data-tooltip="content"]');
			var placement = $tt_btn.parents('.gt-tooltip').attr('data-placement');

			$tt_cnt.toggleClass('gt-active');
			if($tt_cnt.hasClass('gt-active')) {
				$tt_cnt.show();
			}else{
				$tt_cnt.hide();
			}
			
			var root = tooltip;
			root.setPosition(placement, $tt_btn, $tt_cnt);
		},

		setPosition: function(placement, $tt_btn, $tt_cnt) {
			var btn_width = $tt_btn.outerWidth();
			var btn_height = $tt_btn.outerHeight();
			var cnt_width = $tt_cnt.outerWidth();
			var cnt_height = $tt_cnt.outerHeight();
			var triangle_width = $tt_btn.parents('.gt-tooltip').find('.gt-triangle').outerWidth();
			var triangle_height = $tt_btn.parents('.gt-tooltip').find('.gt-triangle').outerHeight();

			switch(placement) {
				case 'right':
				$tt_cnt.css({
					left: btn_width + triangle_width,
					top: ( btn_height - cnt_height ) / 2
				});
				$tt_cnt.find('.gt-triangle').css({
					left: - triangle_width,
					top: ( cnt_height - triangle_height ) / 2
				});
				break;

				case 'left':
				$tt_cnt.css({
					right: btn_width + triangle_width,
					top: ( btn_height - cnt_height ) / 2
				});
				$tt_cnt.find('.gt-triangle').css({
					right: - triangle_width,
					top: ( cnt_height - triangle_height ) / 2
				});
				break;

				case 'bottom':
				$tt_cnt.css({
					left: ( btn_width - cnt_width ) / 2,
					top: ( btn_height + triangle_height )
				});
				$tt_cnt.find('.gt-triangle').css({
					top: -triangle_height,
					left: ( cnt_width / 2 ) - ( triangle_width / 2 )
				});
				break;

				case 'top':
				$tt_cnt.css({
					left: ( btn_width - cnt_width ) / 2,
					top: - (cnt_height + triangle_height)
				});
				$tt_cnt.find('.gt-triangle').css({
					left: ( cnt_width / 2 ) - ( triangle_width / 2 ),
					top: cnt_height
				});
				break;
			}
		},

		addEvent: function($tt, event_trigger) {
			$tt.find('[data-tooltip="button"]').on(event_trigger, this.toggleTT);
			$tt.find('[data-tooltip="hide"]').on('click', this.hideTT);
		} 
	};

	gtris.ui.tooltip = tooltip;

})(window.gtris);

(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}
	var tab = {
		init: function(obj) {
			var _obj = obj;
			this.attachTabEvent(_obj);		
		},
		getParam: function(paramName) {
			var val = gtris.util.getParameterByName(paramName);
			return val;
		},
		attachTabEvent: function(_obj) {			
			var $target = $(_obj.target);
			var idx = Number(this.getParam('idx'));
			if(idx < 0 || idx > _obj.target.length-1 || window.isNaN(idx)) {
				idx = 0;
			}
			
			if(!_obj.event) {
				_obj.event = 'click';
			}
			
			$target.each(function() {
				var $tab_head = $(this);
				$tab_head.target_id = [];

				$tab_head.find('[data-id]').each(function() {
					var $tab_nav = $(this);
					var this_id = "#" + $(this).attr('data-id');
					$tab_head.target_id.push(this_id);
					$tab_nav.on(_obj.event, function() {
						tab.executeTabEvent.call(this, $tab_head, $(this).index());
					});
				});
				$tab_head.find('.gt-nav-item').eq(idx).find('[data-id]').trigger(_obj.event);
			});
		},
		ajaxCall: function(this_id) {
			$.ajax({
				url: $(this).attr('data-url'),
				beforeSend : function() {
					$(this_id).empty().append('<div style="text-align:center;padding:10px 0;"><img src="https://static.gabia.com/gtris/assets/images/gt-loader.gif"></div>');
				}
			}).done(function(response) {
				$(this_id).empty().append(response);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				window.alert('load failed.');
				$(this_id).empty().append('jqXHR: ' + jqXHR + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
			});
		},
		executeTabEvent: function($tab_head, idx) {			
			var this_id = "#" + $(this).attr('data-id');			
			if((/(http(s)?:\/)?(\/\w+)+(\.[\w.]+)?/g).test($(this).attr('data-url'))) {
				tab.ajaxCall.call(this, this_id);
			}			
			
			$tab_head.find(".gt-nav-item.gt-active").removeClass("gt-active");
			$tab_head.find(".gt-nav-item").eq(idx).addClass("gt-active");
			$($tab_head.target_id.join(", ")).hide();			
			$(this_id).show();
		}
	};
	gtris.ui.tab = tab;

})(window.gtris);

(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var dropdown = {

		init: function(obj) {
			var $dd = $(obj.target);
			this.addEvent($dd);
		},

		toggleDD: function(event) {
			var $dd_button = $(event.target);
			$dd_button.parents('.gt-dropdown').toggleClass('gt-active');
		},

		documentClick: function(event) {
			var $dd_button = $(event.target);
			if( $dd_button.is('.gt-button') || $dd_button.is('.gt-btn') === false ) {
				var dropdownMenu = $('.gt-dd-menu');
				dropdownMenu.parents('.gt-dropdown').removeClass('gt-active');
			}
		},

		addEvent: function($dd) {
			$dd.find('.gt-button').on('click', this.toggleDD);
			$dd.find('.gt-btn').on('click', this.toggleDD);
			$(document).on('click', this.documentClick);
		}

	};

	gtris.ui.dropdown = dropdown;

})(window.gtris);