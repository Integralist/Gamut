/*

jQuery sIFR Plugin
	* Version 2.0 Beta 3
	* 2008-09-25 05:49:32
	* URL: http://jquery.thewikies.com/sifr
	* Description: jQuery Sifr Plugin replaces traditional text in a web page with flash text (sIFR).
	* Author: Jonathan Neal
	* Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
	* JSLint: This javascript file passes JSLint verification.
*//*jslint
	bitwise: true,
	browser: true,
	eqeqeq: true,
	forin: true,
	passfail: true,
	regexp: true,
	undef: true,
	white: true
*//*global
		jQuery
*/

(function ($) {
	$.fn.sifr = function (prefs) {

		/* == load our preferences == */
		var t = true, u = undefined, s, p;
		s = arguments.callee.prefs = arguments.callee.prefs || {
			asHex: function (x) {
				var d = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
				return isNaN(x) ? '00' : d[(x - x % 16) / 16] + d[x % 16];
			},
			colors: {
				aqua: [0, 255, 255],
				azure: [240, 255, 255],
				beige: [245, 245, 220],
				black: [0, 0, 0],
				blue: [0, 0, 255],
				brown: [165, 42, 42],
				cyan: [0, 255, 255],
				darkblue: [0, 0, 139],
				darkcyan: [0, 139, 139],
				darkgrey: [169, 169, 169],
				darkgreen: [0, 100, 0],
				darkkhaki: [189, 183, 107],
				darkmagenta: [139, 0, 139],
				darkolivegreen: [85, 107, 47],
				darkorange: [255, 140, 0],
				darkorchid: [153, 50, 204],
				darkred: [139, 0, 0],
				darksalmon: [233, 150, 122],
				darkviolet: [148, 0, 211],
				fuchsia: [255, 0, 255],
				gold: [255, 215, 0],
				green: [0, 128, 0],
				indigo: [75, 0, 130],
				khaki: [240, 230, 140],
				lightblue: [173, 216, 230],
				lightcyan: [224, 255, 255],
				lightgreen: [144, 238, 144],
				lightgrey: [211, 211, 211],
				lightpink: [255, 182, 193],
				lightyellow: [255, 255, 224],
				lime: [0, 255, 0],
				magenta: [255, 0, 255],
				maroon: [128, 0, 0],
				navy: [0, 0, 128],
				olive: [128, 128, 0],
				orange: [255, 165, 0],
				pink: [255, 192, 203],
				purple: [128, 0, 128],
				violet: [128, 0, 128],
				red: [255, 0, 0],
				silver: [192, 192, 192],
				white: [255, 255, 255],
				yellow: [255, 255, 0],
				transparent:  [255, 255, 255]
			},
			toHex: function (color) {
				var rgb;
				if (!color) {
					return u;
				}
				return (rgb = color.match(/rgb\(([0-9]+),\s([0-9]+),\s([0-9]+)\)/)) ? '#' + this.asHex(rgb[1]) + this.asHex(rgb[2]) + this.asHex(rgb[3]) : (rgb = this.colors[color]) ? '#' + this.asHex(rgb[0]) + this.asHex(rgb[1]) + this.asHex(rgb[2]) : (color.length === 4) ? color.replace(/\#([0-9a-z])([0-9a-z])([0-9a-z])/, '#$1$1$2$2$3$3') : color;
			}
		};

		/* == lock our preferences == */
		p = $.extend({}, s, (prefs === false) ? {
			unsifr: true
		} : prefs);

		/* == if necessary, save our prefs == */
		if (p.save === t) {
			arguments.callee.prefs = $.extend(p, { save: false });
		}

		/* == we're done if there's no sIFR specified == */
		if (this[0] === document) {
			return;
		}
		
		/* == if necessary, run a custom function before we begin == */
		if (!p.unsifr && typeof p.before === 'function') {
			p.before.apply(this, [p]);
		}

		/* == do this function on every element we've selected == */
		this.each(function () {
			var ele = $(this), txt, alt, fir, embedOptions;

			/* == 'a' will mean the possible '.sIFR-alternate' child of 't' == */
			fir = ele.children('.sIFR-alternate');

			/* == if 'a' exists, then it's time to unSifr == */
			if (fir) {
				ele.html(fir.html());
	
				/* == if unsifr was called, then it's time to go == */
				if (p.unsifr) {
					return;
				}
			}

			/* == if necessary, run a custom function before we begin this one == */
			if (typeof p.beforeEach === 'function') {
				p.beforeEach.apply(this, [t, p]);
			}

			fir = ele.addClass('sIFR-replaced').wrapInner('<span class="sIFR-alternate" style="position: absolute; "></span>').children('.sIFR-alternate');
			alt = ele.append('<span class="sIFR-jquery" style="position: absolute; ">' + $.trim(fir.text()) + '</span>').children('.sIFR-jquery');
			txt = $.trim(fir.html()).replace(/(>)\s+|\s+(<)/g, '$1$2').replace(/(id|name)=[A-Za-z0-9]+/g, '');

			if (p.textTransform) {
				p.textTransform = p.textTransform.toLowerCase();

				if (p.textTransform === 'uppercase') {
					txt = txt.toUpperCase();
				}
				if (p.textTransform === 'lowercase') {
					txt = txt.html().toLowerCase();
				}
				if (p.textTransform === 'capitalize') {
					var cap = txt.split(/(\s|\>)/);
					txt = '';

					for (var i in cap) {
						txt += cap[i].charAt(0).toUpperCase() + cap[i].substr(1);
					}
				}
			}

			txt = ele.attr('href') ? '<a href="' + ele.attr('href') + '">' + txt + '</a>' : txt;

			/* == flash plugin embedOptions == */
			embedOptions = {
				flashvars: $.extend({
					h: alt.height() * (p.zoom || 1),
					offsetLeft: p.offsetLeft || u,
					offsetTop: p.offsetTop || u,
					textAlign: p.textAlign || ele.css('textAlign').match(/left|center|right/) || 'center',
					textColor: p.toHex(p.color || ele.css('color')) || u,
					txt: p.content || txt,
					underline: (p.underline === t || ele.css('textDecoration') === 'underline') ? t : u,
					w: alt.width() * (p.zoom || 1)
				}, p.flashvars),
				height: p.height || alt.height(),
				src: (p.path || '').replace(/([^\/])$/, '$1/') + (p.font || ele.css('fontFamily').replace(/^\s+|\s+$|,[\S|\s]+|'|"|(,)\s+/g, '$1')).replace(/([^\.][^s][^w][^f])$/, '$1.swf'),
				style: 'margin: 1px 0 0; position: absolute; vertical-align: text-top;',
				width: p.width || alt.width(),
				wmode: 'transparent'
			};

			/* == make some more flash plugin embedoptions (color) == */
			embedOptions.flashvars.linkColor = p.toHex(p.link || ele.find('a').css('color')) || embedOptions.flashvars.textColor;
			embedOptions.flashvars.hoverColor = p.toHex(p.hover) || embedOptions.flashvars.linkColor;

			/* == make some more flash plugin embedoptions (zoom) == */
			if (p.zoom) {
				embedOptions.flashvars.offsetTop = ((p.offsetTop || 0) + ((alt.height() - (alt.height() * p.zoom)) / 2)) * (p.zoomTop || 1);
				embedOptions.flashvars.offsetLeft = ((p.offsetLeft || 0) + ((alt.width() - (alt.width() * p.zoom)) / 2)) * (p.zoomLeft || 1);
			}

			/* == execute flash plugin == */
			$().flash($.extend(embedOptions, p.embedOptions), $.extend({
				expressInstall: p.expressInstall || false,
				version: p.version || 7,
				update: p.update || false
			}, p.pluginOptions), function (options) {
				fir.attr('style', 'visibility: hidden;');
				alt.remove();
				ele.prepend($.fn.flash.transform(options));
			});

			/* == if necessary, run a custom function before we begin this one == */
			if (typeof p.afterEach === 'function') {
				p.afterEach.apply(this, [t, p]);
			}
		});

		/* == if necessary, run a custom function after we're done == */
		if (!p.unsifr && typeof p.after === 'function') {
			p.after.apply(this, [p]);
		}
	};

	/* == jQuery Sifr Plugin (as unSifr) == */
	$.fn.unsifr = function () {
		return this.each(function () {
			$(this).sifr(false);
		});
	};

	/* == jQuery Sifr Plugin (without selectors) == */
	$.sifr = function (prefs) {
		$(document).sifr($.extend({
			save: true
		}, prefs));
	};

	/* == preload this == */
	$.sifr();
})(jQuery);