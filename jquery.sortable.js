/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 * 
 * Update by mytharcher(http://github.com/mytharcher) @2014-07-11:
 * Add support for delegating usage (#59).
 * Any dynamic children could be dragged by using this edition.
 */
(function($) {
var dragging, placeholders = $();
$.fn.sortable = function(options) {
	var method = String(options);
	options = $.extend({
		connectWith: false
	}, options);
	return this.each(function() {
		var items;
		if (/^enable|disable|destroy$/.test(method)) {
			items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		options.items = options.items || '> *';
		var isHandle, index, $this = $(this);
		var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
		placeholders = placeholders.add(placeholder);
		if (options.connectWith) {
			$(options.connectWith).add(this).data('connectWith', options.connectWith);
		}
		$this.children(options.items).attr('draggable', 'true');
		$this.data('items', options.items
		).on('mousedown',options.items,function() {
			isHandle = true;
		}).on('mouseup',options.items,function() {
			isHandle = false;
		}).on('dragstart.h5s',options.items,function(e) {
			if (options.handle && !isHandle) {
				return false;
			}
			isHandle = false;
			items = $this.children(options.items);
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			index = (dragging = $(this)).addClass('sortable-dragging').index();
		}).on('dragend.h5s',options.items,function() {
			if (!dragging) {
				return;
			}
			dragging.removeClass('sortable-dragging').show();
			placeholders.detach();
			if (index != dragging.index()) {
				dragging.parent().trigger('sortupdate', {item: dragging});
			}

			dragging = null;
		}).not(options.items + ' a[href],'+ options.items+' img').on('selectstart.h5s',options.items,function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end();
		$this.on('dragover.h5s dragenter.h5s drop.h5s',options.items+', .sortable-placeholder', function(e) {
			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				dragging.trigger('dragend.h5s');
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';

			if (items.is(this)) {
				if (options.forcePlaceholderSize) {
					placeholder.height(dragging.outerHeight());
				}
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
				placeholders.detach();
				$(this).append(placeholder);
			}
			return false;
		});
	});
};
})(jQuery);