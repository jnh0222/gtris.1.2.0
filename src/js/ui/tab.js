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

				//초기 탭 활성화
				if(gtris.util.getParameterByName('init')) {
					var initActiveTabs = [];
					initActiveTabs = gtris.util.getParameterByName('init').split(',');
					initActiveTabs.forEach(function(v) {
						if( $.inArray('#' + v, $tab_head.target_id) > -1 ) {
							var initIdx = $.inArray('#' + v, $tab_head.target_id);
							$tab_head.find('[data-id]').eq(initIdx).trigger(_obj.event);
						}
					});
				}
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
