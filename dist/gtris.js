(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*util*/
require('./util/addComma');
require('./util/autoDashDate');
require('./util/autoDashPhoneNumber');
require('./util/browser');
require('./util/cookies');
require('./util/copyToClipboard');
require('./util/getParameterByName');
require('./util/isMobile');
require('./util/isValidateEmail');
require('./util/makeDimmed');
require('./util/os');
require('./util/removeComma');
/*ui*/
require('./ui/collapse');
require('./ui/dropdown');
require('./ui/layer');
require('./ui/modal');
require('./ui/scrollprogress');
require('./ui/tab');
require('./ui/tooltip');
},{"./ui/collapse":2,"./ui/dropdown":3,"./ui/layer":4,"./ui/modal":5,"./ui/scrollprogress":6,"./ui/tab":7,"./ui/tooltip":8,"./util/addComma":9,"./util/autoDashDate":10,"./util/autoDashPhoneNumber":11,"./util/browser":12,"./util/cookies":13,"./util/copyToClipboard":14,"./util/getParameterByName":15,"./util/isMobile":16,"./util/isValidateEmail":17,"./util/makeDimmed":18,"./util/os":19,"./util/removeComma":20}],2:[function(require,module,exports){
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
			if(!obj.slideTime) obj.slideTime = 250;
			if(!obj.isAllExpand) obj.isAllExpand = false;
			if(obj.active !== undefined) this.activeContent(obj);
			this.addEvent(obj);
		},

		activeContent:function(obj) {
			var $accordion = $(obj.target);
			var $acd_content = $accordion.find('.gt-collapse-content');
			$acd_content.eq(obj.active).closest('.gt-collapse-item').addClass('gt-active');
			$acd_content.eq(obj.active).show();
		},

		collapseHeaderClick: function(event) {
			event.preventDefault();
			var obj = event.data.obj;
			var $accordion = $(obj.target);
			var $this_header = $(event.target);
			var $this_content = $this_header.closest('.gt-collapse-item').find('.gt-collapse-content');
			obj.isAllExpand = false;

			//show & hide
			if($this_content.is(':hidden')) {
				$this_content.slideDown(obj.slideTime);
				$this_header.closest('.gt-collapse-item').addClass('gt-active');
			}else{
				$this_content.slideUp(obj.slideTime);
				$this_header.parent().removeClass('gt-active');
			}

			//check all expand
			if( $accordion.find('.gt-collapse-item').length === $accordion.find('.gt-collapse-item.gt-active').length ) {
				obj.isAllExpand = true;
				if(obj.expanded) return obj.expanded($accordion);
			}

			//check all collapse
			if($accordion.find('.gt-collapse-item.gt-active').length === 0) {
				if(obj.expanded) return obj.collapsed($accordion);	
			}
		},

		toggleExpand: function(event) {
			event.preventDefault();
			var obj = event.data.obj;
			var $accordion = $(obj.target);
			var $acd_content = $accordion.find('.gt-collapse-content');
			var $acd_item = $accordion.find('.gt-collapse-item');

			//toggle all contents
			if(!obj.isAllExpand) {
				obj.isAllExpand = true;
				$acd_content.slideDown(obj.slideTime);
				$acd_item.addClass('gt-active');
				if(obj.collapsed) return obj.expanded($accordion);
			}else{
				obj.isAllExpand = false;
				$acd_content.slideUp(obj.slideTime);
				$acd_item.removeClass('gt-active');
				if(obj.collapsed) return obj.collapsed($accordion);
			}
		},

		addEvent: function(obj) {
			$(obj.target).find('.gt-collapse-header').on('click', { obj: obj }, this.collapseHeaderClick);
			$(obj.target).find('[data-toggle="expand"]').on('click', { obj: obj }, this.toggleExpand);
		}
	};

	gtris.ui.collapse = collapse;

})(window.gtris);

},{}],3:[function(require,module,exports){
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
			this.addEvent(obj);
		},

		toggleDD: function(event) {
			event.stopPropagation();
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

		menuClick: function(event) {
			var _obj = event.data.obj;
			var $menu_item = $(event.target);
			if(_obj.changed) return _obj.changed($menu_item);
		},

		addEvent: function(obj) {
			var $dd = $(obj.target);
			$dd.find('button').on('click', this.toggleDD);
			$dd.find('.gt-dd-item').on('click', { obj: obj }, this.menuClick);
			$(document).on('click', this.documentClick);
		}
	};

	gtris.ui.dropdown = dropdown;

})(window.gtris);

},{}],4:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var layer = {

		isHasCnt : false,

		open: function(obj) {
			this.addEvent(obj);
		},

		loadLayer: function(obj) {
			var $target = $(obj.target);
			var url;

			if(obj.id === undefined) {
				url = obj.url;
			}else{
				url = obj.url + '\u0020' + obj.id;
			}

			//check loaded
			if( $target.find('.gt-layer-content').hasClass('gt-active') ) {
				this.isHasCnt = true;
			}else{
				this.isHasCnt = false;
			}

			//load
			if(this.isHasCnt === false) {
				//create gt-layer-content
				var $ly_container = $(document.createElement('div'));
				$ly_container.addClass('gt-layer-content');
				$ly_container.appendTo($target);

				$ly_container.load(url, function(response, status, xhr) {
					if(status === "success") {
						$ly_container.addClass('gt-active');

						//focusabled string
						var	focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
						var	focusedElementBeforeWindow = $(':focus');
						var o = $ly_container.find('*');
						o.filter(focusableElementsString).filter(':visible').first().focus();

						//hide
						$ly_container.find('[data-layer="hide"]').on('click', function(event) {
							event.stopPropagation();
							this.isHasCnt = false;
							$ly_container.remove();
							if(obj.closed) return obj.closed();
						});

						//completed
						if(obj.completed) return obj.completed();
					}
				});
			}
		},

		addEvent: function(obj) {
			layer.loadLayer(obj);
		}

	};

	gtris.ui.layer = layer;
	
})(window.gtris);

},{}],5:[function(require,module,exports){
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

			//focusabled string
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

},{}],6:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var scrollprogress = {

		init: function(obj) {
			if(!obj.height) obj.height = '5px';
			if(!obj.barColor) obj.barColor = '#2598e7';

			//options
			$(obj.target).css('height', obj.height);
			$(obj.target).css('background-color', obj.barColor);
			$(obj.target).css('top', obj.top);
			$(obj.target).css('bottom', obj.bottom);
			
			//add event
			this.addEvent(obj);
		},

		updateProgress: function(event) {
			var obj = event.data.obj;
			var $progress_bar = $(obj.target);
			var scroll_top = $(window).scrollTop(); //current vertical position of the scroll bar
			var bottom_page = $(document).height() - $(window).height(); //(height of HTML document - height of browser viewport)
			var bar_width = scrollprogress.calculatePercent(scroll_top, bottom_page);

			//chagne progress bar
			$progress_bar.css('width',bar_width);
			
			//on progress event
			if(event.data) {
				if(obj.onProgress) return obj.onProgress(bar_width);
			}
		},

		calculatePercent: function(n1, n2) {
			var percent = Math.ceil( n1 / n2 * 100 ) + '%';
			return percent;
		},

		addEvent: function(obj) {
			$(document).on('scroll', {obj: obj}, this.updateProgress);
			$(window).on('resize', {obj: obj}, this.updateProgress);
		}
	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);

},{}],7:[function(require,module,exports){
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
		attachTabEvent: function(_obj) {
			var $target = $(_obj.target);
			var initIdx = Number(gtris.util.getParameterByName('tabIdx'));
			if(initIdx < 0 || initIdx > _obj.target.length-1 || window.isNaN(initIdx)) {
				initIdx = 0;
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
						tab.executeTabEvent.call(this, _obj, $tab_head);
					});
				});
				$tab_head.find('[data-id]').eq(initIdx).trigger(_obj.event);
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
				//window.alert('load failed.');
				$(this_id).empty().append(errorThrown);
			});
		},
		executeTabEvent: function(_obj, $tab_head) {
			var this_id = "#" + $(this).attr('data-id');
			if((/(http(s)?:\/)?(\/\w+)+(\.[\w.]+)?/g).test($(this).attr('data-url'))) {
				tab.ajaxCall.call(this, this_id);
			}
			$tab_head.find(".gt-nav-item.gt-active").removeClass("gt-active");
			$tab_head.find(".gt-nav-item").eq($(this).index()).addClass("gt-active");
			$($tab_head.target_id.join(", ")).hide();
			$(this_id).show();

			if(_obj.completed) {
				return _obj.completed();
			}
		}
	};
	gtris.ui.tab = tab;

})(window.gtris);

},{}],8:[function(require,module,exports){
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
			var $tt_cnt = $tt_btn.siblings('.gt-tt-content');
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

				default:
				$tt_cnt.css({
					left: ( btn_width - cnt_width ) / 2,
					top: - (cnt_height + triangle_height)
				});
				$tt_cnt.find('.gt-triangle').css({
					left: ( cnt_width / 2 ) - ( triangle_width / 2 ),
					top: cnt_height
				});
			}
		},

		addEvent: function($tt, event_trigger) {
			$tt.find('[data-tooltip="button"]').on(event_trigger, this.toggleTT);
			$tt.find('[data-tooltip="hide"]').on('click', this.hideTT);
		} 
	};

	gtris.ui.tooltip = tooltip;

})(window.gtris);

},{}],9:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var addComma = function(num) {
		var _num = String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		return _num;
	};

	gtris.util.addComma = addComma;

})(window.gtris);

},{}],10:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var autoDashDate = function(str) {
		var _str = str.replace(/[^0-9]/g, '');
		var tmp = '';
		if(_str.length < 5) {
			return str;
		}else if(_str.length < 7) {
			tmp += _str.substr(0, 4);
			tmp += '-';
			tmp += _str.substr(4, 5);
			return tmp;
	    }else{
			tmp += _str.substr(0, 4);
			tmp += '-';
			tmp += _str.substr(4, 2);
			tmp += '-';
			tmp += _str.substr(6, 2);
			return tmp;
		}
	};

	gtris.util.autoDashDate = autoDashDate;

})(window.gtris);

},{}],11:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var autoDashPhoneNumber = function(str) {
		var _str = str.replace(/[^0-9]/g, '');
		var tmp = '';
		if(_str.length < 4) {
			return _str;
		}else if(_str.length < 7) {
			tmp += _str.substr(0, 3);
			tmp += '-';
			tmp += _str.substr(3);
			return tmp;
		}else if(_str.length < 11) {
			tmp += _str.substr(0, 3);
			tmp += '-';
			tmp += _str.substr(3, 3);
			tmp += '-';
			tmp += _str.substr(6);
			return tmp;
		}else{
			tmp += _str.substr(0, 3);
			tmp += '-';
			tmp += _str.substr(3, 4);
			tmp += '-';
			tmp += _str.substr(7);
			return tmp;
		}
		return str;
	};

	gtris.util.autoDashPhoneNumber = autoDashPhoneNumber;

})(window.gtris);

},{}],12:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var browser = function() {

		var browserPool = [
			{detectStr: "MSIE", name: "ie"},
			{detectStr: "Trident", name: "ie"},
			{detectStr: "Edge", name: "edge"},
			{detectStr: "Firefox", name: "firefox"},
			{detectStr: "OPR", name: "opera"},
			{detectStr: "Opera mini", name: "opera mini"},
			{detectStr: "Chrome", name: "chrome"},
			{detectStr: "CriOS", name: "chrome"},
			{detectStr: "Safari", name: "safari"}
		];

		var ua = navigator.userAgent;
		var n, v, vOffset;
		for(var i=0; i<browserPool.length; i++) {
			if((vOffset = ua.indexOf(browserPool[i].detectStr)) > -1) {
				n = browserPool[i].name;
				if(browserPool[i].detectStr == 'Trident') { //ie11
					v = ua.substr(ua.indexOf('rv:') + 3);
					v = parseFloat(v.split(')')[0]);
				}
				else if(browserPool[i].detectStr == 'Safari') {
					v = ua.substr(ua.indexOf('Version/') + 8);
					v = parseFloat(v.split('/')[0]);
				}
				else {
					v = ua.substr(vOffset + browserPool[i].detectStr.length + 1);
					v = parseFloat(v.split(' ')[0]);
				}
				break;
			}else{
				n = "unknown";
				v = -1;
			}
		}
		return {name: n, version: v};
	};

	gtris.util.browser = browser();

})(window.gtris);

},{}],13:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}
	
	var setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	};
	
	var getCookie = function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) != -1) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};
	
	gtris.util.setCookie = setCookie;
	gtris.util.getCookie = getCookie;

})(window.gtris);

},{}],14:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var copyToClipboard = function(text) {
		if(text === undefined || text === '') return;
		var _txt = text;
		if(window.clipboardData) {
			window.clipboardData.setData("text", _txt);
		}else{
			var textarea = document.createElement("textarea");
			textarea.textContent = _txt;
			textarea.style.position = "fixed";
			document.body.appendChild(textarea);
			textarea.select();
			try {
				return document.execCommand("copy");
			} catch (ex) {
				return false;
			} finally {
				document.body.removeChild(textarea);
			}
		}
	};

	gtris.util.copyToClipboard = copyToClipboard;

})(window.gtris);

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var isMobile = function() {
		var ua = navigator.userAgent;
		var detectStr = /Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/;
		return detectStr.test(ua);
	};

	gtris.util.isMobile = isMobile();

})(window.gtris);

},{}],17:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var isValidateEmail = function(email) {
		var reg_email = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
		return reg_email.test(email);
	};

	gtris.util.isValidateEmail = isValidateEmail;

})(window.gtris);

},{}],18:[function(require,module,exports){
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
			className = 'gt-overlay';
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
			zIndex = 1000;
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

},{}],19:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var os = function() {
		var ua = navigator.userAgent;
		var aver = navigator.appVersion;
		var osPool = [
			{name:"Windows 10", detectStr:/(Windows 10.0|Windows NT 10.0)/},
			{name:"Windows 8.1", detectStr:/(Windows 8.1|Windows NT 6.3)/},
			{name:"Windows 8", detectStr:/(Windows 8|Windows NT 6.2)/},
			{name:"Windows 7", detectStr:/(Windows 7|Windows NT 6.1)/},
			{name:"Windows Vista", detectStr:/Windows NT 6.0/},
			{name:"Windows Server 2003", detectStr:/Windows NT 5.2/},
			{name:"Windows XP", detectStr:/(Windows NT 5.1|Windows XP)/},
			{name:"Windows 2000", detectStr:/(Windows NT 5.0|Windows 2000)/},
			{name:"Windows ME", detectStr:/(Win 9x 4.90|Windows ME)/},
			{name:"Windows 98", detectStr:/(Windows 98|Win98)/},
			{name:"Windows 95", detectStr:/(Windows 95|Win95|Windows_95)/},
			{name:"Windows NT 4.0", detectStr:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
			{name:"Windows CE", detectStr:/Windows CE/},
			{name:"Windows 3.11", detectStr:/Win16/},
			{name:"Android", detectStr:/Android/},
			{name:"Open BSD", detectStr:/OpenBSD/},
			{name:"Sun OS", detectStr:/SunOS/},
			{name:"Linux", detectStr:/(Linux|X11)/},
			{name:"iOS", detectStr:/iP(hone|od|ad)/},
			{name:"Mac OS X", detectStr:/Mac OS X/},
			{name:"Mac OS", detectStr:/Mac(PPC|Intel|_PowerPC|intosh)/},
			{name:"QNX", detectStr:/QNX/},
			{name:"UNIX", detectStr:/UNIX/},
			{name:"BeOS", detectStr:/BeOS/},
			{name:"OS/2", detectStr:/OS\/2/},
			{name:"Search Bot", detectStr:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
		];
		var n, v;

		for(var i=0; i<osPool.length; i++) {
			if(osPool[i].detectStr.test(ua)) {
				n = osPool[i].name;
				break;
			}else {
				n = "unknown";
			}
		}
		switch (n) {
			case 'Mac OS X':
				v = /Mac OS X (10[\.\_\d]+)/.exec(ua)[1];
				break;
			case 'Android':
				v = /Android ([\.\_\d]+)/.exec(ua)[1];
				break;
			case 'iOS':
				v = /OS (\d+)_(\d+)_?(\d+)?/.exec(aver);
				v = v[1] + '.' + v[2] + '.' + (v[3] | 0);
				break;
			default:
				v = -1;
		}
		if(/Windows/.test(n)) {
			v = /Windows (.*)/.exec(n)[1];
			n = 'Windows';
		}
		return {name: n, version: v};
	};

	gtris.util.os = os();

})(window.gtris);

},{}],20:[function(require,module,exports){
(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.util) {
		gtris.util = window.gtris.util = {};
	}

	var removeComma = function(num) {
		var str = Number(num.replace(/\,/g, ''));
		return str;
	};

	gtris.util.removeComma = removeComma;

})(window.gtris);

},{}]},{},[1]);
