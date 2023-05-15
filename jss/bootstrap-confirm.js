/*!
 * =================================================
 *  bootstrap-confirm
 * =================================================
 *
 * Description: Modal dialog confirmation and message based on bootstrap v3.
 * Url: https://github.com/hugosbg/bootstrap-confirm
 * Version: 1.0
 * License: MIT
 * Author: Hugo Sóstenes <hugo.msn@msn.com>
 */
  
;(function($) {
	'use strict';
	$.confirm = function(options) {
		if ($.fn.modal === undefined) 
 			throw new Error('bootstrap-confirm JavaScript requires Bootstrap.js');
 		
		var settings = $.extend({
				onInit: function() {},
				onOk: function() {},
				onCancel: function() {}
			}, $.confirm.defaults, options),
			dialogClose = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
			buttonOk = '<button type="button" class="btn btn-'+ settings.templateOk +'" data-confirm="Ok">'+ settings.labelOk +'</button>',
			buttonCancel = '<button type="button" class="btn btn-'+ settings.templateCancel +'" data-confirm="Cancel">'+ settings.labelCancel +'</button>',
			dialogFooter = '<div class="modal-footer">' + (settings.buttonOk ? buttonOk : '') + (settings.buttonCancel ? buttonCancel : '') + '</div>',
			$dialog = $('<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">' +
				'<div class="modal-dialog modal-sm" role="document">' +
				'<div class="modal-content">' +
				'<div class="modal-header bg-'+ settings.template +'">' +
				'<h4 class="modal-title">' +
				(!settings.buttonOk && !settings.buttonCancel ? dialogClose : '') +
				'<i class="' + settings.titleIcon + '"></i> '+ settings.title +'</h4>' +
				'</div>' +
				'<div class="modal-body">'+ settings.message +'</div>' +
				(settings.buttonOk || settings.buttonCancel ? dialogFooter : '') +
				'</div>' +
				'</div>'
			);

		$dialog.on('hidden.bs.modal', function(event) {
			$(this).remove();
		});

		$dialog.on('shown.bs.modal', function(event) {
			$(this).next('.modal-backdrop').css('z-index', 2040);
		});

		$dialog.find('.modal-header').css({
			'-webkit-border-top-left-radius': '6px',
			'-webkit-border-top-right-radius': '6px',
			'-moz-border-radius-topleft': '6px',
			'-moz-border-radius-topright': '6px',
			'border-top-left-radius': '6px',
			'border-top-right-radius': '6px'
		});

		$dialog.find('button[data-confirm="Ok"]').click(function(event) {
			event.preventDefault();
			if(!settings.doNotHide) $dialog.modal('hide');
			settings.onOk.call(this, $dialog);
		});

		$dialog.find('button[data-confirm="Cancel"]').click(function(event) {
			event.preventDefault();
			$dialog.modal('hide');
			settings.onCancel.call(this, $dialog);
		});

		$dialog.css('z-index', 2050);
		$dialog.appendTo('body');
		$dialog.modal('show');
      settings.onInit.call(this, $dialog);
	};
	
	$.confirm.defaults = {
		message: 'You message',
		buttonOk: true,
		buttonCancel: true,
		template: 'danger',
		title: 'Confirm',
		titleIcon: 'glyphicon glyphicon-question-sign',
		labelOk: 'Confirm',
		labelCancel: 'Cancel',
		templateOk: 'danger',
		templateCancel: 'default'
	};

})(jQuery);
