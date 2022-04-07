(function () {
  var socket = document.createElement('script')
  var script = document.createElement('script')
  socket.setAttribute('src', 'http://127.0.0.1:3001/socket.io/socket.io.js')
  script.type = 'text/javascript'

  socket.onload = function () {
    document.head.appendChild(script)
  }
  script.text = ['window.socket = io("http://127.0.0.1:3001");',
  'socket.on("bundle", function() {',
  'console.log("livereaload triggered")',
  'window.location.reload();});'].join('\n')
  document.head.appendChild(socket)
}());
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
function bjorklund(slots, pulses){
  var pattern = [],
      count = [],
      remainder = [pulses],
      divisor = slots - pulses,
      level = 0,
      build_pattern = function(lv){
        if( lv == -1 ){ pattern.push(0); }
        else if( lv == -2 ){ pattern.push(1); }
        else{
          for(var x=0; x<count[lv]; x++){
            build_pattern(lv-1);
          }

          if(remainder[lv]){
            build_pattern(lv-2);
          }
        }
      }
  ;

  while(remainder[level] > 1){
    count.push(Math.floor(divisor/remainder[level]));
    remainder.push(divisor%remainder[level]);
    divisor = remainder[level];
    level++;
  }
  count.push(divisor);

  build_pattern(level);

  return pattern.reverse();
}


module.exports = function(m, k){
  if(m > k) return bjorklund(m, k);
  else return bjorklund(k, m);
};

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":5,"get-intrinsic":90}],5:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":12,"get-intrinsic":90}],6:[function(require,module,exports){
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.chroma = factory());
})(this, (function () { 'use strict';

    var limit$2 = function (x, min, max) {
        if ( min === void 0 ) min=0;
        if ( max === void 0 ) max=1;

        return x < min ? min : x > max ? max : x;
    };

    var limit$1 = limit$2;

    var clip_rgb$3 = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i=0; i<=3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit$1(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit$1(rgb[i], 0, 1);
            }
        }
        return rgb;
    };

    // ported from jQuery's $.type
    var classToType = {};
    for (var i$1 = 0, list$1 = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i$1 < list$1.length; i$1 += 1) {
        var name = list$1[i$1];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    var type$p = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
    };

    var type$o = type$p;

    var unpack$B = function (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder=null;

    	// if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
    	if (type$o(args[0]) == 'object' && keyOrder) {
    		return keyOrder.split('')
    			.filter(function (k) { return args[0][k] !== undefined; })
    			.map(function (k) { return args[0][k]; });
    	}
    	// otherwise we just return the first argument
    	// (which we suppose is an array of args)
        return args[0];
    };

    var type$n = type$p;

    var last$4 = function (args) {
        if (args.length < 2) { return null; }
        var l = args.length-1;
        if (type$n(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    };

    var PI$2 = Math.PI;

    var utils = {
    	clip_rgb: clip_rgb$3,
    	limit: limit$2,
    	type: type$p,
    	unpack: unpack$B,
    	last: last$4,
    	PI: PI$2,
    	TWOPI: PI$2*2,
    	PITHIRD: PI$2/3,
    	DEG2RAD: PI$2 / 180,
    	RAD2DEG: 180 / PI$2
    };

    var input$h = {
    	format: {},
    	autodetect: []
    };

    var last$3 = utils.last;
    var clip_rgb$2 = utils.clip_rgb;
    var type$m = utils.type;
    var _input = input$h;

    var Color$D = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (type$m(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor) {
            // the argument is already a Color instance
            return args[0];
        }

        // last argument could be the mode
        var mode = last$3(args);
        var autodetect = false;

        if (!mode) {
            autodetect = true;
            if (!_input.sorted) {
                _input.autodetect = _input.autodetect.sort(function (a,b) { return b.p - a.p; });
                _input.sorted = true;
            }
            // auto-detect format
            for (var i = 0, list = _input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }

        if (_input.format[mode]) {
            var rgb = _input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
            me._rgb = clip_rgb$2(rgb);
        } else {
            throw new Error('unknown format: '+args);
        }

        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };

    Color$D.prototype.toString = function toString () {
        if (type$m(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    var Color_1 = Color$D;

    var chroma$k = function () {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	return new (Function.prototype.bind.apply( chroma$k.Color, [ null ].concat( args) ));
    };

    chroma$k.Color = Color_1;
    chroma$k.version = '2.4.2';

    var chroma_1 = chroma$k;

    var unpack$A = utils.unpack;
    var max$2 = Math.max;

    var rgb2cmyk$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$A(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max$2(r,max$2(g,b));
        var f = k < 1 ? 1 / (1-k) : 0;
        var c = (1-r-k) * f;
        var m = (1-g-k) * f;
        var y = (1-b-k) * f;
        return [c,m,y,k];
    };

    var rgb2cmyk_1 = rgb2cmyk$1;

    var unpack$z = utils.unpack;

    var cmyk2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$z(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k === 1) { return [0,0,0,alpha]; }
        return [
            c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
            m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
            y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
            alpha
        ];
    };

    var cmyk2rgb_1 = cmyk2rgb;

    var chroma$j = chroma_1;
    var Color$C = Color_1;
    var input$g = input$h;
    var unpack$y = utils.unpack;
    var type$l = utils.type;

    var rgb2cmyk = rgb2cmyk_1;

    Color$C.prototype.cmyk = function() {
        return rgb2cmyk(this._rgb);
    };

    chroma$j.cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$C, [ null ].concat( args, ['cmyk']) ));
    };

    input$g.format.cmyk = cmyk2rgb_1;

    input$g.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$y(args, 'cmyk');
            if (type$l(args) === 'array' && args.length === 4) {
                return 'cmyk';
            }
        }
    });

    var unpack$x = utils.unpack;
    var last$2 = utils.last;
    var rnd = function (a) { return Math.round(a*100)/100; };

    /*
     * supported arguments:
     * - hsl2css(h,s,l)
     * - hsl2css(h,s,l,a)
     * - hsl2css([h,s,l], mode)
     * - hsl2css([h,s,l,a], mode)
     * - hsl2css({h,s,l,a}, mode)
     */
    var hsl2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hsla = unpack$x(args, 'hsla');
        var mode = last$2(args) || 'lsa';
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1]*100) + '%';
        hsla[2] = rnd(hsla[2]*100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return (mode + "(" + (hsla.join(',')) + ")");
    };

    var hsl2css_1 = hsl2css$1;

    var unpack$w = utils.unpack;

    /*
     * supported arguments:
     * - rgb2hsl(r,g,b)
     * - rgb2hsl(r,g,b,a)
     * - rgb2hsl([r,g,b])
     * - rgb2hsl([r,g,b,a])
     * - rgb2hsl({r,g,b,a})
     */
    var rgb2hsl$3 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$w(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        var l = (max + min) / 2;
        var s, h;

        if (max === min){
            s = 0;
            h = Number.NaN;
        } else {
            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
        }

        if (r == max) { h = (g - b) / (max - min); }
        else if (g == max) { h = 2 + (b - r) / (max - min); }
        else if (b == max) { h = 4 + (r - g) / (max - min); }

        h *= 60;
        if (h < 0) { h += 360; }
        if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
        return [h,s,l];
    };

    var rgb2hsl_1 = rgb2hsl$3;

    var unpack$v = utils.unpack;
    var last$1 = utils.last;
    var hsl2css = hsl2css_1;
    var rgb2hsl$2 = rgb2hsl_1;
    var round$6 = Math.round;

    /*
     * supported arguments:
     * - rgb2css(r,g,b)
     * - rgb2css(r,g,b,a)
     * - rgb2css([r,g,b], mode)
     * - rgb2css([r,g,b,a], mode)
     * - rgb2css({r,g,b,a}, mode)
     */
    var rgb2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$v(args, 'rgba');
        var mode = last$1(args) || 'rgb';
        if (mode.substr(0,3) == 'hsl') {
            return hsl2css(rgb2hsl$2(rgba), mode);
        }
        rgba[0] = round$6(rgba[0]);
        rgba[1] = round$6(rgba[1]);
        rgba[2] = round$6(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
            mode = 'rgba';
        }
        return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
    };

    var rgb2css_1 = rgb2css$1;

    var unpack$u = utils.unpack;
    var round$5 = Math.round;

    var hsl2rgb$1 = function () {
        var assign;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$u(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r,g,b;
        if (s === 0) {
            r = g = b = l*255;
        } else {
            var t3 = [0,0,0];
            var c = [0,0,0];
            var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
            var t1 = 2 * l - t2;
            var h_ = h / 360;
            t3[0] = h_ + 1/3;
            t3[1] = h_;
            t3[2] = h_ - 1/3;
            for (var i=0; i<3; i++) {
                if (t3[i] < 0) { t3[i] += 1; }
                if (t3[i] > 1) { t3[i] -= 1; }
                if (6 * t3[i] < 1)
                    { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                else if (2 * t3[i] < 1)
                    { c[i] = t2; }
                else if (3 * t3[i] < 2)
                    { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
                else
                    { c[i] = t1; }
            }
            (assign = [round$5(c[0]*255),round$5(c[1]*255),round$5(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r,g,b,args[3]];
        }
        return [r,g,b,1];
    };

    var hsl2rgb_1 = hsl2rgb$1;

    var hsl2rgb = hsl2rgb_1;
    var input$f = input$h;

    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
    var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var round$4 = Math.round;

    var css2rgb$1 = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input$f.format.named) {
            try {
                return input$f.format.named(css);
            } catch (e) {
                // eslint-disable-next-line
            }
        }

        // rgb(250,20,0)
        if ((m = css.match(RE_RGB))) {
            var rgb = m.slice(1,4);
            for (var i=0; i<3; i++) {
                rgb[i] = +rgb[i];
            }
            rgb[3] = 1;  // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA))) {
            var rgb$1 = m.slice(1,5);
            for (var i$1=0; i$1<4; i$1++) {
                rgb$1[i$1] = +rgb$1[i$1];
            }
            return rgb$1;
        }

        // rgb(100%,0%,0%)
        if ((m = css.match(RE_RGB_PCT))) {
            var rgb$2 = m.slice(1,4);
            for (var i$2=0; i$2<3; i$2++) {
                rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
            }
            rgb$2[3] = 1;  // default alpha
            return rgb$2;
        }

        // rgba(100%,0%,0%,0.4)
        if ((m = css.match(RE_RGBA_PCT))) {
            var rgb$3 = m.slice(1,5);
            for (var i$3=0; i$3<3; i$3++) {
                rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
            }
            rgb$3[3] = +rgb$3[3];
            return rgb$3;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL))) {
            var hsl = m.slice(1,4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            var rgb$4 = hsl2rgb(hsl);
            rgb$4[3] = 1;
            return rgb$4;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA))) {
            var hsl$1 = m.slice(1,4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$5 = hsl2rgb(hsl$1);
            rgb$5[3] = +m[4];  // default alpha = 1
            return rgb$5;
        }
    };

    css2rgb$1.test = function (s) {
        return RE_RGB.test(s) ||
            RE_RGBA.test(s) ||
            RE_RGB_PCT.test(s) ||
            RE_RGBA_PCT.test(s) ||
            RE_HSL.test(s) ||
            RE_HSLA.test(s);
    };

    var css2rgb_1 = css2rgb$1;

    var chroma$i = chroma_1;
    var Color$B = Color_1;
    var input$e = input$h;
    var type$k = utils.type;

    var rgb2css = rgb2css_1;
    var css2rgb = css2rgb_1;

    Color$B.prototype.css = function(mode) {
        return rgb2css(this._rgb, mode);
    };

    chroma$i.css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$B, [ null ].concat( args, ['css']) ));
    };

    input$e.format.css = css2rgb;

    input$e.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$k(h) === 'string' && css2rgb.test(h)) {
                return 'css';
            }
        }
    });

    var Color$A = Color_1;
    var chroma$h = chroma_1;
    var input$d = input$h;
    var unpack$t = utils.unpack;

    input$d.format.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$t(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    };

    chroma$h.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$A, [ null ].concat( args, ['gl']) ));
    };

    Color$A.prototype.gl = function() {
        var rgb = this._rgb;
        return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
    };

    var unpack$s = utils.unpack;

    var rgb2hcg$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$s(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var c = delta * 100 / 255;
        var _g = min / (255 - delta) * 100;
        var h;
        if (delta === 0) {
            h = Number.NaN;
        } else {
            if (r === max) { h = (g - b) / delta; }
            if (g === max) { h = 2+(b - r) / delta; }
            if (b === max) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, c, _g];
    };

    var rgb2hcg_1 = rgb2hcg$1;

    var unpack$r = utils.unpack;
    var floor$3 = Math.floor;

    /*
     * this is basically just HSV with some minor tweaks
     *
     * hue.. [0..360]
     * chroma .. [0..1]
     * grayness .. [0..1]
     */

    var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$r(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r,g,b;
        _g = _g * 255;
        var _c = c * 255;
        if (c === 0) {
            r = g = b = _g;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;
            var i = floor$3(h);
            var f = h - i;
            var p = _g * (1 - c);
            var q = p + _c * (1 - f);
            var t = p + _c * f;
            var v = p + _c;
            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var hcg2rgb_1 = hcg2rgb;

    var unpack$q = utils.unpack;
    var type$j = utils.type;
    var chroma$g = chroma_1;
    var Color$z = Color_1;
    var input$c = input$h;

    var rgb2hcg = rgb2hcg_1;

    Color$z.prototype.hcg = function() {
        return rgb2hcg(this._rgb);
    };

    chroma$g.hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$z, [ null ].concat( args, ['hcg']) ));
    };

    input$c.format.hcg = hcg2rgb_1;

    input$c.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$q(args, 'hcg');
            if (type$j(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var unpack$p = utils.unpack;
    var last = utils.last;
    var round$3 = Math.round;

    var rgb2hex$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$p(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba': return ("#" + str + hxa);
            case 'argb': return ("#" + hxa + str);
            default: return ("#" + str);
        }
    };

    var rgb2hex_1 = rgb2hex$2;

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb$1 = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = u >> 8 & 0xFF;
            var b = u & 0xFF;
            return [r,g,b,1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = u$1 >> 24 & 0xFF;
            var g$1 = u$1 >> 16 & 0xFF;
            var b$1 = u$1 >> 8 & 0xFF;
            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
            return [r$1,g$1,b$1,a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var hex2rgb_1 = hex2rgb$1;

    var chroma$f = chroma_1;
    var Color$y = Color_1;
    var type$i = utils.type;
    var input$b = input$h;

    var rgb2hex$1 = rgb2hex_1;

    Color$y.prototype.hex = function(mode) {
        return rgb2hex$1(this._rgb, mode);
    };

    chroma$f.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$y, [ null ].concat( args, ['hex']) ));
    };

    input$b.format.hex = hex2rgb_1;
    input$b.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$i(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
                return 'hex';
            }
        }
    });

    var unpack$o = utils.unpack;
    var TWOPI$2 = utils.TWOPI;
    var min$2 = Math.min;
    var sqrt$4 = Math.sqrt;
    var acos = Math.acos;

    var rgb2hsi$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */
        var ref = unpack$o(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min$2(r,g,b);
        var i = (r+g+b) / 3;
        var s = i > 0 ? 1 - min_/i : 0;
        if (s === 0) {
            h = NaN;
        } else {
            h = ((r-g)+(r-b)) / 2;
            h /= sqrt$4((r-g)*(r-g) + (r-b)*(g-b));
            h = acos(h);
            if (b > g) {
                h = TWOPI$2 - h;
            }
            h /= TWOPI$2;
        }
        return [h*360,s,i];
    };

    var rgb2hsi_1 = rgb2hsi$1;

    var unpack$n = utils.unpack;
    var limit = utils.limit;
    var TWOPI$1 = utils.TWOPI;
    var PITHIRD = utils.PITHIRD;
    var cos$4 = Math.cos;

    /*
     * hue [0..360]
     * saturation [0..1]
     * intensity [0..1]
     */
    var hsi2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */
        args = unpack$n(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r,g,b;

        if (isNaN(h)) { h = 0; }
        if (isNaN(s)) { s = 0; }
        // normalize hue
        if (h > 360) { h -= 360; }
        if (h < 0) { h += 360; }
        h /= 360;
        if (h < 1/3) {
            b = (1-s)/3;
            r = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            g = 1 - (b+r);
        } else if (h < 2/3) {
            h -= 1/3;
            r = (1-s)/3;
            g = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            b = 1 - (r+g);
        } else {
            h -= 2/3;
            g = (1-s)/3;
            b = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            r = 1 - (g+b);
        }
        r = limit(i*r*3);
        g = limit(i*g*3);
        b = limit(i*b*3);
        return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
    };

    var hsi2rgb_1 = hsi2rgb;

    var unpack$m = utils.unpack;
    var type$h = utils.type;
    var chroma$e = chroma_1;
    var Color$x = Color_1;
    var input$a = input$h;

    var rgb2hsi = rgb2hsi_1;

    Color$x.prototype.hsi = function() {
        return rgb2hsi(this._rgb);
    };

    chroma$e.hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$x, [ null ].concat( args, ['hsi']) ));
    };

    input$a.format.hsi = hsi2rgb_1;

    input$a.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$m(args, 'hsi');
            if (type$h(args) === 'array' && args.length === 3) {
                return 'hsi';
            }
        }
    });

    var unpack$l = utils.unpack;
    var type$g = utils.type;
    var chroma$d = chroma_1;
    var Color$w = Color_1;
    var input$9 = input$h;

    var rgb2hsl$1 = rgb2hsl_1;

    Color$w.prototype.hsl = function() {
        return rgb2hsl$1(this._rgb);
    };

    chroma$d.hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$w, [ null ].concat( args, ['hsl']) ));
    };

    input$9.format.hsl = hsl2rgb_1;

    input$9.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$l(args, 'hsl');
            if (type$g(args) === 'array' && args.length === 3) {
                return 'hsl';
            }
        }
    });

    var unpack$k = utils.unpack;
    var min$1 = Math.min;
    var max$1 = Math.max;

    /*
     * supported arguments:
     * - rgb2hsv(r,g,b)
     * - rgb2hsv([r,g,b])
     * - rgb2hsv({r,g,b})
     */
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$k(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h,s,v;
        v = max_ / 255.0;
        if (max_ === 0) {
            h = Number.NaN;
            s = 0;
        } else {
            s = delta / max_;
            if (r === max_) { h = (g - b) / delta; }
            if (g === max_) { h = 2+(b - r) / delta; }
            if (b === max_) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, s, v]
    };

    var rgb2hsv$1 = rgb2hsl;

    var unpack$j = utils.unpack;
    var floor$2 = Math.floor;

    var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$j(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r,g,b;
        v *= 255;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;

            var i = floor$2(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r,g,b,args.length > 3?args[3]:1];
    };

    var hsv2rgb_1 = hsv2rgb;

    var unpack$i = utils.unpack;
    var type$f = utils.type;
    var chroma$c = chroma_1;
    var Color$v = Color_1;
    var input$8 = input$h;

    var rgb2hsv = rgb2hsv$1;

    Color$v.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
    };

    chroma$c.hsv = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$v, [ null ].concat( args, ['hsv']) ));
    };

    input$8.format.hsv = hsv2rgb_1;

    input$8.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$i(args, 'hsv');
            if (type$f(args) === 'array' && args.length === 3) {
                return 'hsv';
            }
        }
    });

    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034,  // 4 / 29
        t1: 0.206896552,  // 6 / 29
        t2: 0.12841855,   // 3 * t1 * t1
        t3: 0.008856452,  // t1 * t1 * t1
    };

    var LAB_CONSTANTS$3 = labConstants;
    var unpack$h = utils.unpack;
    var pow$a = Math.pow;

    var rgb2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$h(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r,g,b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow$a((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > LAB_CONSTANTS$3.t3) { return pow$a(t, 1 / 3); }
        return t / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
    };

    var rgb2xyz = function (r,g,b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS$3.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS$3.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS$3.Zn);
        return [x,y,z];
    };

    var rgb2lab_1 = rgb2lab$2;

    var LAB_CONSTANTS$2 = labConstants;
    var unpack$g = utils.unpack;
    var pow$9 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$g(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x,y,z, r,g,b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = LAB_CONSTANTS$2.Yn * lab_xyz(y);
        x = LAB_CONSTANTS$2.Xn * lab_xyz(x);
        z = LAB_CONSTANTS$2.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r,g,b_,args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$9(r, 1 / 2.4) - 0.055)
    };

    var lab_xyz = function (t) {
        return t > LAB_CONSTANTS$2.t1 ? t * t * t : LAB_CONSTANTS$2.t2 * (t - LAB_CONSTANTS$2.t0)
    };

    var lab2rgb_1 = lab2rgb$1;

    var unpack$f = utils.unpack;
    var type$e = utils.type;
    var chroma$b = chroma_1;
    var Color$u = Color_1;
    var input$7 = input$h;

    var rgb2lab$1 = rgb2lab_1;

    Color$u.prototype.lab = function() {
        return rgb2lab$1(this._rgb);
    };

    chroma$b.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$u, [ null ].concat( args, ['lab']) ));
    };

    input$7.format.lab = lab2rgb_1;

    input$7.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$f(args, 'lab');
            if (type$e(args) === 'array' && args.length === 3) {
                return 'lab';
            }
        }
    });

    var unpack$e = utils.unpack;
    var RAD2DEG = utils.RAD2DEG;
    var sqrt$3 = Math.sqrt;
    var atan2$2 = Math.atan2;
    var round$2 = Math.round;

    var lab2lch$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$e(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$3(a * a + b * b);
        var h = (atan2$2(b, a) * RAD2DEG + 360) % 360;
        if (round$2(c*10000) === 0) { h = Number.NaN; }
        return [l, c, h];
    };

    var lab2lch_1 = lab2lch$2;

    var unpack$d = utils.unpack;
    var rgb2lab = rgb2lab_1;
    var lab2lch$1 = lab2lch_1;

    var rgb2lch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$d(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2lab(r,g,b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch$1(l,a,b_);
    };

    var rgb2lch_1 = rgb2lch$1;

    var unpack$c = utils.unpack;
    var DEG2RAD = utils.DEG2RAD;
    var sin$3 = Math.sin;
    var cos$3 = Math.cos;

    var lch2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.

        A saturation multiplier was added by Gregor Aisch
        */
        var ref = unpack$c(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];
        if (isNaN(h)) { h = 0; }
        h = h * DEG2RAD;
        return [l, cos$3(h) * c, sin$3(h) * c]
    };

    var lch2lab_1 = lch2lab$2;

    var unpack$b = utils.unpack;
    var lch2lab$1 = lch2lab_1;
    var lab2rgb = lab2rgb_1;

    var lch2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$b(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab$1 (l,c,h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb (L,a,b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var lch2rgb_1 = lch2rgb$1;

    var unpack$a = utils.unpack;
    var lch2rgb = lch2rgb_1;

    var hcl2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hcl = unpack$a(args, 'hcl').reverse();
        return lch2rgb.apply(void 0, hcl);
    };

    var hcl2rgb_1 = hcl2rgb;

    var unpack$9 = utils.unpack;
    var type$d = utils.type;
    var chroma$a = chroma_1;
    var Color$t = Color_1;
    var input$6 = input$h;

    var rgb2lch = rgb2lch_1;

    Color$t.prototype.lch = function() { return rgb2lch(this._rgb); };
    Color$t.prototype.hcl = function() { return rgb2lch(this._rgb).reverse(); };

    chroma$a.lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['lch']) ));
    };
    chroma$a.hcl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['hcl']) ));
    };

    input$6.format.lch = lch2rgb_1;
    input$6.format.hcl = hcl2rgb_1;

    ['lch','hcl'].forEach(function (m) { return input$6.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$9(args, m);
            if (type$d(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    }); });

    /**
    	X11 color names

    	http://www.w3.org/TR/css3-color/#svg-color
    */

    var w3cx11$1 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflower: '#6495ed',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };

    var w3cx11_1 = w3cx11$1;

    var Color$s = Color_1;
    var input$5 = input$h;
    var type$c = utils.type;

    var w3cx11 = w3cx11_1;
    var hex2rgb = hex2rgb_1;
    var rgb2hex = rgb2hex_1;

    Color$s.prototype.name = function() {
        var hex = rgb2hex(this._rgb, 'rgb');
        for (var i = 0, list = Object.keys(w3cx11); i < list.length; i += 1) {
            var n = list[i];

            if (w3cx11[n] === hex) { return n.toLowerCase(); }
        }
        return hex;
    };

    input$5.format.named = function (name) {
        name = name.toLowerCase();
        if (w3cx11[name]) { return hex2rgb(w3cx11[name]); }
        throw new Error('unknown color name: '+name);
    };

    input$5.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$c(h) === 'string' && w3cx11[h.toLowerCase()]) {
                return 'named';
            }
        }
    });

    var unpack$8 = utils.unpack;

    var rgb2num$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$8(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
    };

    var rgb2num_1 = rgb2num$1;

    var type$b = utils.type;

    var num2rgb = function (num) {
        if (type$b(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
            var r = num >> 16;
            var g = (num >> 8) & 0xFF;
            var b = num & 0xFF;
            return [r,g,b,1];
        }
        throw new Error("unknown num color: "+num);
    };

    var num2rgb_1 = num2rgb;

    var chroma$9 = chroma_1;
    var Color$r = Color_1;
    var input$4 = input$h;
    var type$a = utils.type;

    var rgb2num = rgb2num_1;

    Color$r.prototype.num = function() {
        return rgb2num(this._rgb);
    };

    chroma$9.num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$r, [ null ].concat( args, ['num']) ));
    };

    input$4.format.num = num2rgb_1;

    input$4.autodetect.push({
        p: 5,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (args.length === 1 && type$a(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
                return 'num';
            }
        }
    });

    var chroma$8 = chroma_1;
    var Color$q = Color_1;
    var input$3 = input$h;
    var unpack$7 = utils.unpack;
    var type$9 = utils.type;
    var round$1 = Math.round;

    Color$q.prototype.rgb = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        if (rnd === false) { return this._rgb.slice(0,3); }
        return this._rgb.slice(0,3).map(round$1);
    };

    Color$q.prototype.rgba = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        return this._rgb.slice(0,4).map(function (v,i) {
            return i<3 ? (rnd === false ? v : round$1(v)) : v;
        });
    };

    chroma$8.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$q, [ null ].concat( args, ['rgb']) ));
    };

    input$3.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$7(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

    input$3.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$7(args, 'rgba');
            if (type$9(args) === 'array' && (args.length === 3 ||
                args.length === 4 && type$9(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
                return 'rgb';
            }
        }
    });

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     */

    var log$1 = Math.log;

    var temperature2rgb$1 = function (kelvin) {
        var temp = kelvin / 100;
        var r,g,b;
        if (temp < 66) {
            r = 255;
            g = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log$1(g);
            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log$1(b);
        } else {
            r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log$1(r);
            g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log$1(g);
            b = 255;
        }
        return [r,g,b,1];
    };

    var temperature2rgb_1 = temperature2rgb$1;

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     **/

    var temperature2rgb = temperature2rgb_1;
    var unpack$6 = utils.unpack;
    var round = Math.round;

    var rgb2temperature$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$6(args, 'rgb');
        var r = rgb[0], b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            var rgb$1 = temperature2rgb(temp);
            if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
                maxTemp = temp;
            } else {
                minTemp = temp;
            }
        }
        return round(temp);
    };

    var rgb2temperature_1 = rgb2temperature$1;

    var chroma$7 = chroma_1;
    var Color$p = Color_1;
    var input$2 = input$h;

    var rgb2temperature = rgb2temperature_1;

    Color$p.prototype.temp =
    Color$p.prototype.kelvin =
    Color$p.prototype.temperature = function() {
        return rgb2temperature(this._rgb);
    };

    chroma$7.temp =
    chroma$7.kelvin =
    chroma$7.temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$p, [ null ].concat( args, ['temp']) ));
    };

    input$2.format.temp =
    input$2.format.kelvin =
    input$2.format.temperature = temperature2rgb_1;

    var unpack$5 = utils.unpack;
    var cbrt = Math.cbrt;
    var pow$8 = Math.pow;
    var sign$1 = Math.sign;

    var rgb2oklab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        // OKLab color space implementation taken from
        // https://bottosson.github.io/posts/oklab/
        var ref = unpack$5(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = [rgb2lrgb(r / 255), rgb2lrgb(g / 255), rgb2lrgb(b / 255)];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

        return [
            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
        ];
    };

    var rgb2oklab_1 = rgb2oklab$2;

    function rgb2lrgb(c) {
        var abs = Math.abs(c);
        if (abs < 0.04045) {
            return c / 12.92;
        }
        return (sign$1(c) || 1) * pow$8((abs + 0.055) / 1.055, 2.4);
    }

    var unpack$4 = utils.unpack;
    var pow$7 = Math.pow;
    var sign = Math.sign;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var oklab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$4(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];

        var l = pow$7(L + 0.3963377774 * a + 0.2158037573 * b, 3);
        var m = pow$7(L - 0.1055613458 * a - 0.0638541728 * b, 3);
        var s = pow$7(L - 0.0894841775 * a - 1.291485548 * b, 3);

        return [
            255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
            args.length > 3 ? args[3] : 1
        ];
    };

    var oklab2rgb_1 = oklab2rgb$1;

    function lrgb2rgb(c) {
        var abs = Math.abs(c);
        if (abs > 0.0031308) {
            return (sign(c) || 1) * (1.055 * pow$7(abs, 1 / 2.4) - 0.055);
        }
        return c * 12.92;
    }

    var unpack$3 = utils.unpack;
    var type$8 = utils.type;
    var chroma$6 = chroma_1;
    var Color$o = Color_1;
    var input$1 = input$h;

    var rgb2oklab$1 = rgb2oklab_1;

    Color$o.prototype.oklab = function () {
        return rgb2oklab$1(this._rgb);
    };

    chroma$6.oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$o, [ null ].concat( args, ['oklab']) ));
    };

    input$1.format.oklab = oklab2rgb_1;

    input$1.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$3(args, 'oklab');
            if (type$8(args) === 'array' && args.length === 3) {
                return 'oklab';
            }
        }
    });

    var unpack$2 = utils.unpack;
    var rgb2oklab = rgb2oklab_1;
    var lab2lch = lab2lch_1;

    var rgb2oklch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$2(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2oklab(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch(l, a, b_);
    };

    var rgb2oklch_1 = rgb2oklch$1;

    var unpack$1 = utils.unpack;
    var lch2lab = lch2lab_1;
    var oklab2rgb = oklab2rgb_1;

    var oklch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$1(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var oklch2rgb_1 = oklch2rgb;

    var unpack = utils.unpack;
    var type$7 = utils.type;
    var chroma$5 = chroma_1;
    var Color$n = Color_1;
    var input = input$h;

    var rgb2oklch = rgb2oklch_1;

    Color$n.prototype.oklch = function () {
        return rgb2oklch(this._rgb);
    };

    chroma$5.oklch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$n, [ null ].concat( args, ['oklch']) ));
    };

    input.format.oklch = oklch2rgb_1;

    input.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'oklch');
            if (type$7(args) === 'array' && args.length === 3) {
                return 'oklch';
            }
        }
    });

    var Color$m = Color_1;
    var type$6 = utils.type;

    Color$m.prototype.alpha = function(a, mutate) {
        if ( mutate === void 0 ) mutate=false;

        if (a !== undefined && type$6(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };

    var Color$l = Color_1;

    Color$l.prototype.clipped = function() {
        return this._rgb._clipped || false;
    };

    var Color$k = Color_1;
    var LAB_CONSTANTS$1 = labConstants;

    Color$k.prototype.darken = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lab = me.lab();
    	lab[0] -= LAB_CONSTANTS$1.Kn * amount;
    	return new Color$k(lab, 'lab').alpha(me.alpha(), true);
    };

    Color$k.prototype.brighten = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.darken(-amount);
    };

    Color$k.prototype.darker = Color$k.prototype.darken;
    Color$k.prototype.brighter = Color$k.prototype.brighten;

    var Color$j = Color_1;

    Color$j.prototype.get = function (mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$i = Color_1;
    var type$5 = utils.type;
    var pow$6 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    Color$i.prototype.luminance = function(lum) {
        if (lum !== undefined && type$5(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color$i([0,0,0,this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color$i([255,255,255,this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var mode = 'rgb';
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (cur_lum > lum ? test(new Color$i([0,0,0]), this) : test(this, new Color$i([255,255,255]))).rgb();
            return new Color$i(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
    };


    var rgb2luminance = function (r,g,b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x/12.92 : pow$6((x+0.055)/1.055, 2.4);
    };

    var interpolator$1 = {};

    var Color$h = Color_1;
    var type$4 = utils.type;
    var interpolator = interpolator$1;

    var mix$1 = function (col1, col2, f) {
        if ( f === void 0 ) f=0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!interpolator[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type$4(col1) !== 'object') { col1 = new Color$h(col1); }
        if (type$4(col2) !== 'object') { col2 = new Color$h(col2); }
        return interpolator[mode](col1, col2, f)
            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    };

    var Color$g = Color_1;
    var mix = mix$1;

    Color$g.prototype.mix =
    Color$g.prototype.interpolate = function(col2, f) {
    	if ( f === void 0 ) f=0.5;
    	var rest = [], len = arguments.length - 2;
    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    var Color$f = Color_1;

    Color$f.prototype.premultiply = function(mutate) {
    	if ( mutate === void 0 ) mutate=false;

    	var rgb = this._rgb;
    	var a = rgb[3];
    	if (mutate) {
    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
    		return this;
    	} else {
    		return new Color$f([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
    	}
    };

    var Color$e = Color_1;
    var LAB_CONSTANTS = labConstants;

    Color$e.prototype.saturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lch = me.lch();
    	lch[1] += LAB_CONSTANTS.Kn * amount;
    	if (lch[1] < 0) { lch[1] = 0; }
    	return new Color$e(lch, 'lch').alpha(me.alpha(), true);
    };

    Color$e.prototype.desaturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.saturate(-amount);
    };

    var Color$d = Color_1;
    var type$3 = utils.type;

    Color$d.prototype.set = function (mc, value, mutate) {
        if ( mutate === void 0 ) mutate = false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) {
                if (type$3(value) == 'string') {
                    switch (value.charAt(0)) {
                        case '+':
                            src[i] += +value;
                            break;
                        case '-':
                            src[i] += +value;
                            break;
                        case '*':
                            src[i] *= +value.substr(1);
                            break;
                        case '/':
                            src[i] /= +value.substr(1);
                            break;
                        default:
                            src[i] = +value;
                    }
                } else if (type$3(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color$d(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$c = Color_1;

    var rgb = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color$c(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.rgb = rgb;

    var Color$b = Color_1;
    var sqrt$2 = Math.sqrt;
    var pow$5 = Math.pow;

    var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color$b(
            sqrt$2(pow$5(x1,2) * (1-f) + pow$5(x2,2) * f),
            sqrt$2(pow$5(y1,2) * (1-f) + pow$5(y2,2) * f),
            sqrt$2(pow$5(z1,2) * (1-f) + pow$5(z2,2) * f),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.lrgb = lrgb;

    var Color$a = Color_1;

    var lab = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color$a(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'lab'
        )
    };

    // register interpolator
    interpolator$1.lab = lab;

    var Color$9 = Color_1;

    var _hsx = function (col1, col2, f, m) {
        var assign, assign$1;

        var xyz0, xyz1;
        if (m === 'hsl') {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
        } else if (m === 'hsv') {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
        } else if (m === 'hcg') {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
        } else if (m === 'hsi') {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
            m = 'hcl';
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
        } else if (m === 'oklch') {
            xyz0 = col1.oklch().reverse();
            xyz1 = col2.oklch().reverse();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m.substr(0, 1) === 'h' || m === 'oklch') {
            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
            // both colors have hue
            if (hue1 > hue0 && hue1 - hue0 > 180) {
                dh = hue1 - (hue0 + 360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                dh = hue1 + 360 - hue0;
            } else {
                dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
        } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
        } else {
            hue = Number.NaN;
        }

        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
        lbv = lbv0 + f * (lbv1 - lbv0);
        return m === 'oklch' ? new Color$9([lbv, sat, hue], m) : new Color$9([hue, sat, lbv], m);
    };

    var interpolate_hsx$5 = _hsx;

    var lch = function (col1, col2, f) {
    	return interpolate_hsx$5(col1, col2, f, 'lch');
    };

    // register interpolator
    interpolator$1.lch = lch;
    interpolator$1.hcl = lch;

    var Color$8 = Color_1;

    var num = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color$8(c1 + f * (c2-c1), 'num')
    };

    // register interpolator
    interpolator$1.num = num;

    var interpolate_hsx$4 = _hsx;

    var hcg = function (col1, col2, f) {
    	return interpolate_hsx$4(col1, col2, f, 'hcg');
    };

    // register interpolator
    interpolator$1.hcg = hcg;

    var interpolate_hsx$3 = _hsx;

    var hsi = function (col1, col2, f) {
    	return interpolate_hsx$3(col1, col2, f, 'hsi');
    };

    // register interpolator
    interpolator$1.hsi = hsi;

    var interpolate_hsx$2 = _hsx;

    var hsl = function (col1, col2, f) {
    	return interpolate_hsx$2(col1, col2, f, 'hsl');
    };

    // register interpolator
    interpolator$1.hsl = hsl;

    var interpolate_hsx$1 = _hsx;

    var hsv = function (col1, col2, f) {
    	return interpolate_hsx$1(col1, col2, f, 'hsv');
    };

    // register interpolator
    interpolator$1.hsv = hsv;

    var Color$7 = Color_1;

    var oklab = function (col1, col2, f) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color$7(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'oklab'
        );
    };

    // register interpolator
    interpolator$1.oklab = oklab;

    var interpolate_hsx = _hsx;

    var oklch = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'oklch');
    };

    // register interpolator
    interpolator$1.oklch = oklch;

    var Color$6 = Color_1;
    var clip_rgb$1 = utils.clip_rgb;
    var pow$4 = Math.pow;
    var sqrt$1 = Math.sqrt;
    var PI$1 = Math.PI;
    var cos$2 = Math.cos;
    var sin$2 = Math.sin;
    var atan2$1 = Math.atan2;

    var average = function (colors, mode, weights) {
        if ( mode === void 0 ) mode='lrgb';
        if ( weights === void 0 ) weights=null;

        var l = colors.length;
        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
        // normalize weights
        var k = l / weights.reduce(function(a, b) { return a + b; });
        weights.forEach(function (w,i) { weights[i] *= k; });
        // convert colors to Color objects
        colors = colors.map(function (c) { return new Color$6(c); });
        if (mode === 'lrgb') {
            return _average_lrgb(colors, weights)
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        // initial color
        for (var i=0; i<xyz.length; i++) {
            xyz[i] = (xyz[i] || 0) * weights[0];
            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                var A = xyz[i] / 180 * PI$1;
                dx += cos$2(A) * weights[0];
                dy += sin$2(A) * weights[0];
            }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c,ci) {
            var xyz2 = c.get(mode);
            alpha += c.alpha() * weights[ci+1];
            for (var i=0; i<xyz.length; i++) {
                if (!isNaN(xyz2[i])) {
                    cnt[i] += weights[ci+1];
                    if (mode.charAt(i) === 'h') {
                        var A = xyz2[i] / 180 * PI$1;
                        dx += cos$2(A) * weights[ci+1];
                        dy += sin$2(A) * weights[ci+1];
                    } else {
                        xyz[i] += xyz2[i] * weights[ci+1];
                    }
                }
            }
        });

        for (var i$1=0; i$1<xyz.length; i$1++) {
            if (mode.charAt(i$1) === 'h') {
                var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
                while (A$1 < 0) { A$1 += 360; }
                while (A$1 >= 360) { A$1 -= 360; }
                xyz[i$1] = A$1;
            } else {
                xyz[i$1] = xyz[i$1]/cnt[i$1];
            }
        }
        alpha /= l;
        return (new Color$6(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
    };


    var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0,0,0,0];
        for (var i=0; i < colors.length; i++) {
            var col = colors[i];
            var f = weights[i] / l;
            var rgb = col._rgb;
            xyz[0] += pow$4(rgb[0],2) * f;
            xyz[1] += pow$4(rgb[1],2) * f;
            xyz[2] += pow$4(rgb[2],2) * f;
            xyz[3] += rgb[3] * f;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
        return new Color$6(clip_rgb$1(xyz));
    };

    // minimal multi-purpose interface

    // @requires utils color analyze

    var chroma$4 = chroma_1;
    var type$2 = utils.type;

    var pow$3 = Math.pow;

    var scale$2 = function(colors) {

        // constructor
        var _mode = 'rgb';
        var _nacol = chroma$4('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0,0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function(colors) {
            colors = colors || ['#fff', '#000'];
            if (colors && type$2(colors) === 'string' && chroma$4.brewer &&
                chroma$4.brewer[colors.toLowerCase()]) {
                colors = chroma$4.brewer[colors.toLowerCase()];
            }
            if (type$2(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c=0; c<colors.length; c++) {
                    colors[c] = chroma$4(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1=0; c$1<colors.length; c$1++) {
                    _pos.push(c$1/(colors.length-1));
                }
            }
            resetCache();
            return _colors = colors;
        };

        var getClass = function(value) {
            if (_classes != null) {
                var n = _classes.length-1;
                var i = 0;
                while (i < n && value >= _classes[i]) {
                    i++;
                }
                return i-1;
            }
            return 0;
        };

        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };

        var getColor = function(val, bypassMap) {
            var col, t;
            if (bypassMap == null) { bypassMap = false; }
            if (isNaN(val) || (val === null)) { return _nacol; }
            if (!bypassMap) {
                if (_classes && (_classes.length > 2)) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length-2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t);  // lightness correction
            }

            if (_gamma !== 1) { t = pow$3(t, _gamma); }

            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

            t = Math.min(1, Math.max(0, t));

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type$2(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i=0; i<_pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if ((t >= p) && (i === (_pos.length-1))) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i+1]) {
                            t = (t-p)/(_pos[i+1]-p);
                            col = chroma$4.interpolate(_colors[i], _colors[i+1], t, _mode);
                            break;
                        }
                    }
                } else if (type$2(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) { _colorCache[k] = col; }
            }
            return col;
        };

        var resetCache = function () { return _colorCache = {}; };

        setColors(colors);

        // public interface

        var f = function(v) {
            var c = chroma$4(getColor(v));
            if (_out && c[_out]) { return c[_out](); } else { return c; }
        };

        f.classes = function(classes) {
            if (classes != null) {
                if (type$2(classes) === 'array') {
                    _classes = classes;
                    _domain = [classes[0], classes[classes.length-1]];
                } else {
                    var d = chroma$4.analyze(_domain);
                    if (classes === 0) {
                        _classes = [d.min, d.max];
                    } else {
                        _classes = chroma$4.limits(d, 'e', classes);
                    }
                }
                return f;
            }
            return _classes;
        };


        f.domain = function(domain) {
            if (!arguments.length) {
                return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length-1];
            _pos = [];
            var k = _colors.length;
            if ((domain.length === k) && (_min !== _max)) {
                // update positions
                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                    var d = list[i];

                  _pos.push((d-_min) / (_max-_min));
                }
            } else {
                for (var c=0; c<k; c++) {
                    _pos.push(c/(k-1));
                }
                if (domain.length > 2) {
                    // set domain map
                    var tOut = domain.map(function (d,i) { return i/(domain.length-1); });
                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
                        tMapDomain = function (t) {
                            if (t <= 0 || t >= 1) { return t; }
                            var i = 0;
                            while (t >= tBreaks[i+1]) { i++; }
                            var f = (t - tBreaks[i]) / (tBreaks[i+1] - tBreaks[i]);
                            var out = tOut[i] + f * (tOut[i+1] - tOut[i]);
                            return out;
                        };
                    }

                }
            }
            _domain = [_min, _max];
            return f;
        };

        f.mode = function(_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

        f.range = function(colors, _pos) {
            setColors(colors);
            return f;
        };

        f.out = function(_o) {
            _out = _o;
            return f;
        };

        f.spread = function(val) {
            if (!arguments.length) {
                return _spread;
            }
            _spread = val;
            return f;
        };

        f.correctLightness = function(v) {
            if (v == null) { v = true; }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function(t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + ((L1 - L0) * t);
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                        (function() {
                            if (pol) { L_diff *= -1; }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return L_diff = L_actual - L_ideal;
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        };

        f.padding = function(p) {
            if (p != null) {
                if (type$2(p) === 'number') {
                    p = [p,p];
                }
                _padding = p;
                return f;
            } else {
                return _padding;
            }
        };

        f.colors = function(numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) { out = 'hex'; }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);

            } else if (numColors === 1) {
                result = [f(0.5)];

            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

            } else { // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && (_classes.length > 2)) {
                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        samples.push((_classes[i-1]+_classes[i])*0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma$4[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };

        f.cache = function(c) {
            if (c != null) {
                _useCache = c;
                return f;
            } else {
                return _useCache;
            }
        };

        f.gamma = function(g) {
            if (g != null) {
                _gamma = g;
                return f;
            } else {
                return _gamma;
            }
        };

        f.nodata = function(d) {
            if (d != null) {
                _nacol = chroma$4(d);
                return f;
            } else {
                return _nacol;
            }
        };

        return f;
    };

    function __range__(left, right, inclusive) {
      var range = [];
      var ascending = left < right;
      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
      }
      return range;
    }

    //
    // interpolates between a set of colors uzing a bezier spline
    //

    // @requires utils lab
    var Color$5 = Color_1;

    var scale$1 = scale$2;

    // nth row of the pascal triangle
    var binom_row = function(n) {
        var row = [1, 1];
        for (var i = 1; i < n; i++) {
            var newrow = [1];
            for (var j = 1; j <= row.length; j++) {
                newrow[j] = (row[j] || 0) + row[j - 1];
            }
            row = newrow;
        }
        return row;
    };

    var bezier = function(colors) {
        var assign, assign$1, assign$2;

        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) { return new Color$5(c); });
        if (colors.length === 2) {
            // linear interpolation
            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 3) {
            // quadratic bezier interpolation
            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 4) {
            // cubic bezier interpolation
            var lab3;
            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length >= 5) {
            // general case (degree n bezier)
            var labs, row, n;
            labs = colors.map(function (c) { return c.lab(); });
            n = colors.length - 1;
            row = binom_row(n);
            I = function (t) {
                var u = 1 - t;
                var lab = ([0, 1, 2].map(function (i) { return labs.reduce(function (sum, el, j) { return (sum + row[j] * Math.pow( u, (n - j) ) * Math.pow( t, j ) * el[i]); }, 0); }));
                return new Color$5(lab, 'lab');
            };
        } else {
            throw new RangeError("No point in running bezier with only one color.")
        }
        return I;
    };

    var bezier_1 = function (colors) {
        var f = bezier(colors);
        f.scale = function () { return scale$1(f); };
        return f;
    };

    /*
     * interpolates between a set of colors uzing a bezier spline
     * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
     */

    var chroma$3 = chroma_1;

    var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
            throw new Error('unknown blend mode ' + mode);
        }
        return blend[mode](bottom, top);
    };

    var blend_f = function (f) { return function (bottom,top) {
            var c0 = chroma$3(top).rgb();
            var c1 = chroma$3(bottom).rgb();
            return chroma$3.rgb(f(c0, c1));
        }; };

    var each = function (f) { return function (c0, c1) {
            var out = [];
            out[0] = f(c0[0], c1[0]);
            out[1] = f(c0[1], c1[1]);
            out[2] = f(c0[2], c1[2]);
            return out;
        }; };

    var normal = function (a) { return a; };
    var multiply = function (a,b) { return a * b / 255; };
    var darken = function (a,b) { return a > b ? b : a; };
    var lighten = function (a,b) { return a > b ? a : b; };
    var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
    var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
    var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
    var dodge = function (a,b) {
        if (a === 255) { return 255; }
        a = 255 * (b / 255) / (1 - a / 255);
        return a > 255 ? 255 : a
    };

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b

    blend.normal = blend_f(each(normal));
    blend.multiply = blend_f(each(multiply));
    blend.screen = blend_f(each(screen));
    blend.overlay = blend_f(each(overlay));
    blend.darken = blend_f(each(darken));
    blend.lighten = blend_f(each(lighten));
    blend.dodge = blend_f(each(dodge));
    blend.burn = blend_f(each(burn));
    // blend.add = blend_f(each(add));

    var blend_1 = blend;

    // cubehelix interpolation
    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
    // http://astron-soc.in/bulletin/11June/289392011.pdf

    var type$1 = utils.type;
    var clip_rgb = utils.clip_rgb;
    var TWOPI = utils.TWOPI;
    var pow$2 = Math.pow;
    var sin$1 = Math.sin;
    var cos$1 = Math.cos;
    var chroma$2 = chroma_1;

    var cubehelix = function(start, rotations, hue, gamma, lightness) {
        if ( start === void 0 ) start=300;
        if ( rotations === void 0 ) rotations=-1.5;
        if ( hue === void 0 ) hue=1;
        if ( gamma === void 0 ) gamma=1;
        if ( lightness === void 0 ) lightness=[0,1];

        var dh = 0, dl;
        if (type$1(lightness) === 'array') {
            dl = lightness[1] - lightness[0];
        } else {
            dl = 0;
            lightness = [lightness, lightness];
        }

        var f = function(fract) {
            var a = TWOPI * (((start+120)/360) + (rotations * fract));
            var l = pow$2(lightness[0] + (dl * fract), gamma);
            var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
            var amp = (h * l * (1-l)) / 2;
            var cos_a = cos$1(a);
            var sin_a = sin$1(a);
            var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
            var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
            var b = l + (amp * (+1.97294 * cos_a));
            return chroma$2(clip_rgb([r*255,g*255,b*255,1]));
        };

        f.start = function(s) {
            if ((s == null)) { return start; }
            start = s;
            return f;
        };

        f.rotations = function(r) {
            if ((r == null)) { return rotations; }
            rotations = r;
            return f;
        };

        f.gamma = function(g) {
            if ((g == null)) { return gamma; }
            gamma = g;
            return f;
        };

        f.hue = function(h) {
            if ((h == null)) { return hue; }
            hue = h;
            if (type$1(hue) === 'array') {
                dh = hue[1] - hue[0];
                if (dh === 0) { hue = hue[1]; }
            } else {
                dh = 0;
            }
            return f;
        };

        f.lightness = function(h) {
            if ((h == null)) { return lightness; }
            if (type$1(h) === 'array') {
                lightness = h;
                dl = h[1] - h[0];
            } else {
                lightness = [h,h];
                dl = 0;
            }
            return f;
        };

        f.scale = function () { return chroma$2.scale(f); };

        f.hue(hue);

        return f;
    };

    var Color$4 = Color_1;
    var digits = '0123456789abcdef';

    var floor$1 = Math.floor;
    var random = Math.random;

    var random_1 = function () {
        var code = '#';
        for (var i=0; i<6; i++) {
            code += digits.charAt(floor$1(random() * 16));
        }
        return new Color$4(code, 'hex');
    };

    var type = type$p;
    var log = Math.log;
    var pow$1 = Math.pow;
    var floor = Math.floor;
    var abs$1 = Math.abs;


    var analyze = function (data, key) {
        if ( key === void 0 ) key=null;

        var r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE*-1,
            sum: 0,
            values: [],
            count: 0
        };
        if (type(data) === 'object') {
            data = Object.values(data);
        }
        data.forEach(function (val) {
            if (key && type(val) === 'object') { val = val[key]; }
            if (val !== undefined && val !== null && !isNaN(val)) {
                r.values.push(val);
                r.sum += val;
                if (val < r.min) { r.min = val; }
                if (val > r.max) { r.max = val; }
                r.count += 1;
            }
        });

        r.domain = [r.min, r.max];

        r.limits = function (mode, num) { return limits(r, mode, num); };

        return r;
    };


    var limits = function (data, mode, num) {
        if ( mode === void 0 ) mode='equal';
        if ( num === void 0 ) num=7;

        if (type(data) == 'array') {
            data = analyze(data);
        }
        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a,b) { return a-b; });

        if (num === 1) { return [min,max]; }

        var limits = [];

        if (mode.substr(0,1) === 'c') { // continuous
            limits.push(min);
            limits.push(max);
        }

        if (mode.substr(0,1) === 'e') { // equal interval
            limits.push(min);
            for (var i=1; i<num; i++) {
                limits.push(min+((i/num)*(max-min)));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'l') { // log scale
            if (min <= 0) {
                throw new Error('Logarithmic scales are only possible for values > 0');
            }
            var min_log = Math.LOG10E * log(min);
            var max_log = Math.LOG10E * log(max);
            limits.push(min);
            for (var i$1=1; i$1<num; i$1++) {
                limits.push(pow$1(10, min_log + ((i$1/num) * (max_log - min_log))));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'q') { // quantile scale
            limits.push(min);
            for (var i$2=1; i$2<num; i$2++) {
                var p = ((values.length-1) * i$2)/num;
                var pb = floor(p);
                if (pb === p) {
                    limits.push(values[pb]);
                } else { // p > pb
                    var pr = p - pb;
                    limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
                }
            }
            limits.push(max);

        }

        else if (mode.substr(0,1) === 'k') { // k-means clustering
            /*
            implementation based on
            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
            simplified for 1-d input values
            */
            var cluster;
            var n = values.length;
            var assignments = new Array(n);
            var clusterSizes = new Array(num);
            var repeat = true;
            var nb_iters = 0;
            var centroids = null;

            // get seed values
            centroids = [];
            centroids.push(min);
            for (var i$3=1; i$3<num; i$3++) {
                centroids.push(min + ((i$3/num) * (max-min)));
            }
            centroids.push(max);

            while (repeat) {
                // assignment step
                for (var j=0; j<num; j++) {
                    clusterSizes[j] = 0;
                }
                for (var i$4=0; i$4<n; i$4++) {
                    var value = values[i$4];
                    var mindist = Number.MAX_VALUE;
                    var best = (void 0);
                    for (var j$1=0; j$1<num; j$1++) {
                        var dist = abs$1(centroids[j$1]-value);
                        if (dist < mindist) {
                            mindist = dist;
                            best = j$1;
                        }
                        clusterSizes[best]++;
                        assignments[i$4] = best;
                    }
                }

                // update centroids step
                var newCentroids = new Array(num);
                for (var j$2=0; j$2<num; j$2++) {
                    newCentroids[j$2] = null;
                }
                for (var i$5=0; i$5<n; i$5++) {
                    cluster = assignments[i$5];
                    if (newCentroids[cluster] === null) {
                        newCentroids[cluster] = values[i$5];
                    } else {
                        newCentroids[cluster] += values[i$5];
                    }
                }
                for (var j$3=0; j$3<num; j$3++) {
                    newCentroids[j$3] *= 1/clusterSizes[j$3];
                }

                // check convergence
                repeat = false;
                for (var j$4=0; j$4<num; j$4++) {
                    if (newCentroids[j$4] !== centroids[j$4]) {
                        repeat = true;
                        break;
                    }
                }

                centroids = newCentroids;
                nb_iters++;

                if (nb_iters > 200) {
                    repeat = false;
                }
            }

            // finished k-means clustering
            // the next part is borrowed from gabrielflor.it
            var kClusters = {};
            for (var j$5=0; j$5<num; j$5++) {
                kClusters[j$5] = [];
            }
            for (var i$6=0; i$6<n; i$6++) {
                cluster = assignments[i$6];
                kClusters[cluster].push(values[i$6]);
            }
            var tmpKMeansBreaks = [];
            for (var j$6=0; j$6<num; j$6++) {
                tmpKMeansBreaks.push(kClusters[j$6][0]);
                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
            limits.push(tmpKMeansBreaks[0]);
            for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
                var v = tmpKMeansBreaks[i$7];
                if (!isNaN(v) && (limits.indexOf(v) === -1)) {
                    limits.push(v);
                }
            }
        }
        return limits;
    };

    var analyze_1 = {analyze: analyze, limits: limits};

    var Color$3 = Color_1;


    var contrast = function (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color$3(a);
        b = new Color$3(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
    };

    var Color$2 = Color_1;
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var atan2 = Math.atan2;
    var abs = Math.abs;
    var cos = Math.cos;
    var sin = Math.sin;
    var exp = Math.exp;
    var PI = Math.PI;

    var deltaE = function(a, b, Kl, Kc, Kh) {
        if ( Kl === void 0 ) Kl=1;
        if ( Kc === void 0 ) Kc=1;
        if ( Kh === void 0 ) Kh=1;

        // Delta E (CIE 2000)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
        var rad2deg = function(rad) {
            return 360 * rad / (2 * PI);
        };
        var deg2rad = function(deg) {
            return (2 * PI * deg) / 360;
        };
        a = new Color$2(a);
        b = new Color$2(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var avgL = (L1 + L2)/2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a2, 2) + pow(b2, 2));
        var avgC = (C1 + C2)/2;
        var G = 0.5*(1-sqrt(pow(avgC, 7)/(pow(avgC, 7) + pow(25, 7))));
        var a1p = a1*(1+G);
        var a2p = a2*(1+G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
        var avgCp = (C1p + C2p)/2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b2, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;
        var T = 1 - 0.17*cos(deg2rad(avgHp - 30)) + 0.24*cos(deg2rad(2*avgHp)) + 0.32*cos(deg2rad(3*avgHp + 6)) - 0.2*cos(deg2rad(4*avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
        deltaHp = 2*sqrt(C1p*C2p)*sin(deg2rad(deltaHp)/2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;    
        var sl = 1 + (0.015*pow(avgL - 50, 2))/sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045*avgCp;
        var sh = 1 + 0.015*avgCp*T;
        var deltaTheta = 30*exp(-pow((avgHp - 275)/25, 2));
        var Rc = 2*sqrt(pow(avgCp, 7)/(pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc*sin(2*deg2rad(deltaTheta));
        var result = sqrt(pow(deltaL/(Kl*sl), 2) + pow(deltaCp/(Kc*sc), 2) + pow(deltaHp/(Kh*sh), 2) + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)));
        return max(0, min(100, result));
    };

    var Color$1 = Color_1;

    // simple Euclidean distance
    var distance = function(a, b, mode) {
        if ( mode === void 0 ) mode='lab';

        // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html
        a = new Color$1(a);
        b = new Color$1(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;
        for (var i in l1) {
            var d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d*d;
        }
        return Math.sqrt(sum_sq);
    };

    var Color = Color_1;

    var valid = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
            new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
            return true;
        } catch (e) {
            return false;
        }
    };

    // some pre-defined color scales:
    var chroma$1 = chroma_1;

    var scale = scale$2;

    var scales = {
    	cool: function cool() { return scale([chroma$1.hsl(180,1,.9), chroma$1.hsl(250,.7,.4)]) },
    	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
    };

    /**
        ColorBrewer colors for chroma.js

        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.

        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

        // diverging

        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

        // qualitative

        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
    };

    // add lowercase aliases for case-insensitive matches
    for (var i = 0, list = Object.keys(colorbrewer); i < list.length; i += 1) {
        var key = list[i];

        colorbrewer[key.toLowerCase()] = colorbrewer[key];
    }

    var colorbrewer_1 = colorbrewer;

    var chroma = chroma_1;

    // feel free to comment out anything to rollup
    // a smaller chroma.js built

    // io --> convert colors

















    // operators --> modify existing Colors










    // interpolators












    // generators -- > create new colors
    chroma.average = average;
    chroma.bezier = bezier_1;
    chroma.blend = blend_1;
    chroma.cubehelix = cubehelix;
    chroma.mix = chroma.interpolate = mix$1;
    chroma.random = random_1;
    chroma.scale = scale$2;

    // other utility methods
    chroma.analyze = analyze_1.analyze;
    chroma.contrast = contrast;
    chroma.deltaE = deltaE;
    chroma.distance = distance;
    chroma.limits = analyze_1.limits;
    chroma.valid = valid;

    // scale
    chroma.scales = scales;

    // colors
    chroma.colors = w3cx11_1;
    chroma.brewer = colorbrewer_1;

    var chroma_js = chroma;

    return chroma_js;

}));

},{}],7:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":90}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],9:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],10:[function(require,module,exports){
/**
 * @license Fraction.js v4.2.0 05/03/2022
 * https://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2021, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/


/**
 *
 * This class offers the possibility to calculate fractions.
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
 *
 * Array/Object form
 * [ 0 => <nominator>, 1 => <denominator> ]
 * [ n => <nominator>, d => <denominator> ]
 *
 * Integer form
 * - Single integer value
 *
 * Double form
 * - Single double value
 *
 * String form
 * 123.456 - a simple double
 * 123/456 - a string fraction
 * 123.'456' - a double with repeating decimal places
 * 123.(456) - synonym
 * 123.45'6' - a double with repeating last place
 * 123.45(6) - synonym
 *
 * Example:
 *
 * var f = new Fraction("9.4'31'");
 * f.mul([-4, 3]).div(4.9);
 *
 */

(function(root) {

  "use strict";

  // Maximum search depth for cyclic rational numbers. 2000 should be more than enough.
  // Example: 1/7 = 0.(142857) has 6 repeating decimal places.
  // If MAX_CYCLE_LEN gets reduced, long cycles will not be detected and toString() only gets the first 10 digits
  var MAX_CYCLE_LEN = 2000;

  // Parsed data to avoid calling "new" all the time
  var P = {
    "s": 1,
    "n": 0,
    "d": 1
  };

  function assign(n, s) {

    if (isNaN(n = parseInt(n, 10))) {
      throw Fraction['InvalidParameter'];
    }
    return n * s;
  }

  // Creates a new Fraction internally without the need of the bulky constructor
  function newFraction(n, d) {

    if (d === 0) {
      throw Fraction['DivisionByZero'];
    }

    var f = Object.create(Fraction.prototype);
    f["s"] = n < 0 ? -1 : 1;

    n = n < 0 ? -n : n;

    var a = gcd(n, d);

    f["n"] = n / a;
    f["d"] = d / a;
    return f;
  }

  function factorize(num) {

    var factors = {};

    var n = num;
    var i = 2;
    var s = 4;

    while (s <= n) {

      while (n % i === 0) {
        n/= i;
        factors[i] = (factors[i] || 0) + 1;
      }
      s+= 1 + 2 * i++;
    }

    if (n !== num) {
      if (n > 1)
        factors[n] = (factors[n] || 0) + 1;
    } else {
      factors[num] = (factors[num] || 0) + 1;
    }
    return factors;
  }

  var parse = function(p1, p2) {

    var n = 0, d = 1, s = 1;
    var v = 0, w = 0, x = 0, y = 1, z = 1;

    var A = 0, B = 1;
    var C = 1, D = 1;

    var N = 10000000;
    var M;

    if (p1 === undefined || p1 === null) {
      /* void */
    } else if (p2 !== undefined) {
      n = p1;
      d = p2;
      s = n * d;

      if (n % 1 !== 0 || d % 1 !== 0) {
        throw Fraction['NonIntegerParameter'];
      }

    } else
      switch (typeof p1) {

        case "object":
          {
            if ("d" in p1 && "n" in p1) {
              n = p1["n"];
              d = p1["d"];
              if ("s" in p1)
                n*= p1["s"];
            } else if (0 in p1) {
              n = p1[0];
              if (1 in p1)
                d = p1[1];
            } else {
              throw Fraction['InvalidParameter'];
            }
            s = n * d;
            break;
          }
        case "number":
          {
            if (p1 < 0) {
              s = p1;
              p1 = -p1;
            }

            if (p1 % 1 === 0) {
              n = p1;
            } else if (p1 > 0) { // check for != 0, scale would become NaN (log(0)), which converges really slow

              if (p1 >= 1) {
                z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                p1/= z;
              }

              // Using Farey Sequences
              // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/

              while (B <= N && D <= N) {
                M = (A + C) / (B + D);

                if (p1 === M) {
                  if (B + D <= N) {
                    n = A + C;
                    d = B + D;
                  } else if (D > B) {
                    n = C;
                    d = D;
                  } else {
                    n = A;
                    d = B;
                  }
                  break;

                } else {

                  if (p1 > M) {
                    A+= C;
                    B+= D;
                  } else {
                    C+= A;
                    D+= B;
                  }

                  if (B > N) {
                    n = C;
                    d = D;
                  } else {
                    n = A;
                    d = B;
                  }
                }
              }
              n*= z;
            } else if (isNaN(p1) || isNaN(p2)) {
              d = n = NaN;
            }
            break;
          }
        case "string":
          {
            B = p1.match(/\d+|./g);

            if (B === null)
              throw Fraction['InvalidParameter'];

            if (B[A] === '-') {// Check for minus sign at the beginning
              s = -1;
              A++;
            } else if (B[A] === '+') {// Check for plus sign at the beginning
              A++;
            }

            if (B.length === A + 1) { // Check if it's just a simple number "1234"
              w = assign(B[A++], s);
            } else if (B[A + 1] === '.' || B[A] === '.') { // Check if it's a decimal number

              if (B[A] !== '.') { // Handle 0.5 and .5
                v = assign(B[A++], s);
              }
              A++;

              // Check for decimal places
              if (A + 1 === B.length || B[A + 1] === '(' && B[A + 3] === ')' || B[A + 1] === "'" && B[A + 3] === "'") {
                w = assign(B[A], s);
                y = Math.pow(10, B[A].length);
                A++;
              }

              // Check for repeating places
              if (B[A] === '(' && B[A + 2] === ')' || B[A] === "'" && B[A + 2] === "'") {
                x = assign(B[A + 1], s);
                z = Math.pow(10, B[A + 1].length) - 1;
                A+= 3;
              }

            } else if (B[A + 1] === '/' || B[A + 1] === ':') { // Check for a simple fraction "123/456" or "123:456"
              w = assign(B[A], s);
              y = assign(B[A + 2], 1);
              A+= 3;
            } else if (B[A + 3] === '/' && B[A + 1] === ' ') { // Check for a complex fraction "123 1/2"
              v = assign(B[A], s);
              w = assign(B[A + 2], s);
              y = assign(B[A + 4], 1);
              A+= 5;
            }

            if (B.length <= A) { // Check for more tokens on the stack
              d = y * z;
              s = /* void */
              n = x + d * v + z * w;
              break;
            }

            /* Fall through on error */
          }
        default:
          throw Fraction['InvalidParameter'];
      }

    if (d === 0) {
      throw Fraction['DivisionByZero'];
    }

    P["s"] = s < 0 ? -1 : 1;
    P["n"] = Math.abs(n);
    P["d"] = Math.abs(d);
  };

  function modpow(b, e, m) {

    var r = 1;
    for (; e > 0; b = (b * b) % m, e >>= 1) {

      if (e & 1) {
        r = (r * b) % m;
      }
    }
    return r;
  }


  function cycleLen(n, d) {

    for (; d % 2 === 0;
      d/= 2) {
    }

    for (; d % 5 === 0;
      d/= 5) {
    }

    if (d === 1) // Catch non-cyclic numbers
      return 0;

    // If we would like to compute really large numbers quicker, we could make use of Fermat's little theorem:
    // 10^(d-1) % d == 1
    // However, we don't need such large numbers and MAX_CYCLE_LEN should be the capstone,
    // as we want to translate the numbers to strings.

    var rem = 10 % d;
    var t = 1;

    for (; rem !== 1; t++) {
      rem = rem * 10 % d;

      if (t > MAX_CYCLE_LEN)
        return 0; // Returning 0 here means that we don't print it as a cyclic number. It's likely that the answer is `d-1`
    }
    return t;
  }


  function cycleStart(n, d, len) {

    var rem1 = 1;
    var rem2 = modpow(10, len, d);

    for (var t = 0; t < 300; t++) { // s < ~log10(Number.MAX_VALUE)
      // Solve 10^s == 10^(s+t) (mod d)

      if (rem1 === rem2)
        return t;

      rem1 = rem1 * 10 % d;
      rem2 = rem2 * 10 % d;
    }
    return 0;
  }

  function gcd(a, b) {

    if (!a)
      return b;
    if (!b)
      return a;

    while (1) {
      a%= b;
      if (!a)
        return b;
      b%= a;
      if (!b)
        return a;
    }
  };

  /**
   * Module constructor
   *
   * @constructor
   * @param {number|Fraction=} a
   * @param {number=} b
   */
  function Fraction(a, b) {

    parse(a, b);

    if (this instanceof Fraction) {
      a = gcd(P["d"], P["n"]); // Abuse variable a
      this["s"] = P["s"];
      this["n"] = P["n"] / a;
      this["d"] = P["d"] / a;
    } else {
      return newFraction(P['s'] * P['n'], P['d']);
    }
  }

  Fraction['DivisionByZero'] = new Error("Division by Zero");
  Fraction['InvalidParameter'] = new Error("Invalid argument");
  Fraction['NonIntegerParameter'] = new Error("Parameters must be integer");

  Fraction.prototype = {

    "s": 1,
    "n": 0,
    "d": 1,

    /**
     * Calculates the absolute value
     *
     * Ex: new Fraction(-4).abs() => 4
     **/
    "abs": function() {

      return newFraction(this["n"], this["d"]);
    },

    /**
     * Inverts the sign of the current fraction
     *
     * Ex: new Fraction(-4).neg() => 4
     **/
    "neg": function() {

      return newFraction(-this["s"] * this["n"], this["d"]);
    },

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    "add": function(a, b) {

      parse(a, b);
      return newFraction(
        this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"],
        this["d"] * P["d"]
      );
    },

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    "sub": function(a, b) {

      parse(a, b);
      return newFraction(
        this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"],
        this["d"] * P["d"]
      );
    },

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    "mul": function(a, b) {

      parse(a, b);
      return newFraction(
        this["s"] * P["s"] * this["n"] * P["n"],
        this["d"] * P["d"]
      );
    },

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").inverse().div(3)
     **/
    "div": function(a, b) {

      parse(a, b);
      return newFraction(
        this["s"] * P["s"] * this["n"] * P["d"],
        this["d"] * P["n"]
      );
    },

    /**
     * Clones the actual object
     *
     * Ex: new Fraction("-17.(345)").clone()
     **/
    "clone": function() {
      return newFraction(this['s'] * this['n'], this['d']);
    },

    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    "mod": function(a, b) {

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return new Fraction(NaN);
      }

      if (a === undefined) {
        return newFraction(this["s"] * this["n"] % this["d"], 1);
      }

      parse(a, b);
      if (0 === P["n"] && 0 === this["d"]) {
        throw Fraction['DivisionByZero'];
      }

      /*
       * First silly attempt, kinda slow
       *
       return that["sub"]({
       "n": num["n"] * Math.floor((this.n / this.d) / (num.n / num.d)),
       "d": num["d"],
       "s": this["s"]
       });*/

      /*
       * New attempt: a1 / b1 = a2 / b2 * q + r
       * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
       * => (b2 * a1 % a2 * b1) / (b1 * b2)
       */
      return newFraction(
        this["s"] * (P["d"] * this["n"]) % (P["n"] * this["d"]),
        P["d"] * this["d"]
      );
    },

    /**
     * Calculates the fractional gcd of two rational numbers
     *
     * Ex: new Fraction(5,8).gcd(3,7) => 1/56
     */
    "gcd": function(a, b) {

      parse(a, b);

      // gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)

      return newFraction(gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]), P["d"] * this["d"]);
    },

    /**
     * Calculates the fractional lcm of two rational numbers
     *
     * Ex: new Fraction(5,8).lcm(3,7) => 15
     */
    "lcm": function(a, b) {

      parse(a, b);

      // lcm(a / b, c / d) = lcm(a, c) / gcd(b, d)

      if (P["n"] === 0 && this["n"] === 0) {
        return newFraction(0, 1);
      }
      return newFraction(P["n"] * this["n"], gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]));
    },

    /**
     * Calculates the ceil of a rational number
     *
     * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
     **/
    "ceil": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return newFraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Calculates the floor of a rational number
     *
     * Ex: new Fraction('4.(3)').floor() => (4 / 1)
     **/
    "floor": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return newFraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Rounds a rational numbers
     *
     * Ex: new Fraction('4.(3)').round() => (4 / 1)
     **/
    "round": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return newFraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Gets the inverse of the fraction, means numerator and denominator are exchanged
     *
     * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
     **/
    "inverse": function() {

      return newFraction(this["s"] * this["d"], this["n"]);
    },

    /**
     * Calculates the fraction to some rational exponent, if possible
     *
     * Ex: new Fraction(-1,2).pow(-3) => -8
     */
    "pow": function(a, b) {

      parse(a, b);

      // Trivial case when exp is an integer

      if (P['d'] === 1) {

        if (P['s'] < 0) {
          return newFraction(Math.pow(this['s'] * this["d"], P['n']), Math.pow(this["n"], P['n']));
        } else {
          return newFraction(Math.pow(this['s'] * this["n"], P['n']), Math.pow(this["d"], P['n']));
        }
      }

      // Negative roots become complex
      //     (-a/b)^(c/d) = x
      // <=> (-1)^(c/d) * (a/b)^(c/d) = x
      // <=> (cos(pi) + i*sin(pi))^(c/d) * (a/b)^(c/d) = x         # rotate 1 by 180°
      // <=> (cos(c*pi/d) + i*sin(c*pi/d)) * (a/b)^(c/d) = x       # DeMoivre's formula in Q ( https://proofwiki.org/wiki/De_Moivre%27s_Formula/Rational_Index )
      // From which follows that only for c=0 the root is non-complex. c/d is a reduced fraction, so that sin(c/dpi)=0 occurs for d=1, which is handled by our trivial case.
      if (this['s'] < 0) return null;

      // Now prime factor n and d
      var N = factorize(this['n']);
      var D = factorize(this['d']);

      // Exponentiate and take root for n and d individually
      var n = 1;
      var d = 1;
      for (var k in N) {
        if (k === '1') continue;
        if (k === '0') {
          n = 0;
          break;
        }
        N[k]*= P['n'];

        if (N[k] % P['d'] === 0) {
          N[k]/= P['d'];
        } else return null;
        n*= Math.pow(k, N[k]);
      }

      for (var k in D) {
        if (k === '1') continue;
        D[k]*= P['n'];

        if (D[k] % P['d'] === 0) {
          D[k]/= P['d'];
        } else return null;
        d*= Math.pow(k, D[k]);
      }

      if (P['s'] < 0) {
        return newFraction(d, n);
      }
      return newFraction(n, d);
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "equals": function(a, b) {

      parse(a, b);
      return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"]; // Same as compare() === 0
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "compare": function(a, b) {

      parse(a, b);
      var t = (this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"]);
      return (0 < t) - (t < 0);
    },

    "simplify": function(eps) {

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return this;
      }

      eps = eps || 0.001;

      var thisABS = this['abs']();
      var cont = thisABS['toContinued']();

      for (var i = 1; i < cont.length; i++) {

        var s = newFraction(cont[i - 1], 1);
        for (var k = i - 2; k >= 0; k--) {
          s = s['inverse']()['add'](cont[k]);
        }

        if (s['sub'](thisABS)['abs']().valueOf() < eps) {
          return s['mul'](this['s']);
        }
      }
      return this;
    },

    /**
     * Check if two rational numbers are divisible
     *
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    "divisible": function(a, b) {

      parse(a, b);
      return !(!(P["n"] * this["d"]) || ((this["n"] * P["d"]) % (P["n"] * this["d"])));
    },

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
     **/
    'valueOf': function() {

      return this["s"] * this["n"] / this["d"];
    },

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction(true) => "4 1/3"
     **/
    'toFraction': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str+= '-';
      }

      if (d === 1) {
        str+= n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str+= whole;
          str+= " ";
          n%= d;
        }

        str+= n;
        str+= '/';
        str+= d;
      }
      return str;
    },

    /**
     * Returns a latex representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
     **/
    'toLatex': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str+= '-';
      }

      if (d === 1) {
        str+= n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str+= whole;
          n%= d;
        }

        str+= "\\frac{";
        str+= n;
        str+= '}{';
        str+= d;
        str+= '}';
      }
      return str;
    },

    /**
     * Returns an array of continued fraction elements
     *
     * Ex: new Fraction("7/8").toContinued() => [0,1,7]
     */
    'toContinued': function() {

      var t;
      var a = this['n'];
      var b = this['d'];
      var res = [];

      if (isNaN(a) || isNaN(b)) {
        return res;
      }

      do {
        res.push(Math.floor(a / b));
        t = a % b;
        a = b;
        b = t;
      } while (a !== 1);

      return res;
    },

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    'toString': function(dec) {

      var N = this["n"];
      var D = this["d"];

      if (isNaN(N) || isNaN(D)) {
        return "NaN";
      }

      dec = dec || 15; // 15 = decimal places when no repetation

      var cycLen = cycleLen(N, D); // Cycle length
      var cycOff = cycleStart(N, D, cycLen); // Cycle start

      var str = this['s'] < 0 ? "-" : "";

      str+= N / D | 0;

      N%= D;
      N*= 10;

      if (N)
        str+= ".";

      if (cycLen) {

        for (var i = cycOff; i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
        str+= "(";
        for (var i = cycLen; i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
        str+= ")";
      } else {
        for (var i = dec; N && i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
      }
      return str;
    }
  };

  if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return Fraction;
    });
  } else if (typeof exports === "object") {
    Object.defineProperty(Fraction, "__esModule", { 'value': true });
    Fraction['default'] = Fraction;
    Fraction['Fraction'] = Fraction;
    module['exports'] = Fraction;
  } else {
    root['Fraction'] = Fraction;
  }

})(this);

},{}],11:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],12:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":11}],13:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'abs',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.abs' : Math.abs })

      out = `${ref}abs( ${inputs[0]} )`

    } else {
      out = Math.abs( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let abs = Object.create( proto )

  abs.inputs = [ x ]

  return abs
}

},{"./gen.js":44}],14:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'accum',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        genName = 'gen.' + this.name,
        functionBody

    gen.requestMemory( this.memory )

    gen.memory.heap[ this.memory.value.idx ] = this.initialValue

    functionBody = this.callback( genName, inputs[0], inputs[1], `memory[${this.memory.value.idx}]` )

    //gen.closures.add({ [ this.name ]: this }) 

    gen.memo[ this.name ] = this.name + '_value'
    
    return [ this.name + '_value', functionBody ]
  },

  callback( _name, _incr, _reset, valueRef ) {
    let diff = this.max - this.min,
        out = '',
        wrap = ''
    
    /* three different methods of wrapping, third is most expensive:
     *
     * 1: range {0,1}: y = x - (x | 0)
     * 2: log2(this.max) == integer: y = x & (this.max - 1)
     * 3: all others: if( x >= this.max ) y = this.max -x
     *
     */

    // must check for reset before storing value for output
    if( !(typeof this.inputs[1] === 'number' && this.inputs[1] < 1) ) { 
      if( this.resetValue !== this.min ) {

        out += `  if( ${_reset} >=1 ) ${valueRef} = ${this.resetValue}\n\n`
        //out += `  if( ${_reset} >=1 ) ${valueRef} = ${this.min}\n\n`
      }else{
        out += `  if( ${_reset} >=1 ) ${valueRef} = ${this.min}\n\n`
        //out += `  if( ${_reset} >=1 ) ${valueRef} = ${this.initialValue}\n\n`
      }
    }

    out += `  var ${this.name}_value = ${valueRef}\n`
    
    if( this.shouldWrap === false && this.shouldClamp === true ) {
      out += `  if( ${valueRef} < ${this.max } ) ${valueRef} += ${_incr}\n`
    }else{
      out += `  ${valueRef} += ${_incr}\n` // store output value before accumulating  
    }

    if( this.max !== Infinity  && this.shouldWrapMax ) wrap += `  if( ${valueRef} >= ${this.max} ) ${valueRef} -= ${diff}\n`
    if( this.min !== -Infinity && this.shouldWrapMin ) wrap += `  if( ${valueRef} < ${this.min} ) ${valueRef} += ${diff}\n`

    //if( this.min === 0 && this.max === 1 ) { 
    //  wrap =  `  ${valueRef} = ${valueRef} - (${valueRef} | 0)\n\n`
    //} else if( this.min === 0 && ( Math.log2( this.max ) | 0 ) === Math.log2( this.max ) ) {
    //  wrap =  `  ${valueRef} = ${valueRef} & (${this.max} - 1)\n\n`
    //} else if( this.max !== Infinity ){
    //  wrap = `  if( ${valueRef} >= ${this.max} ) ${valueRef} -= ${diff}\n\n`
    //}

    out = out + wrap + '\n'

    return out
  },

  defaults : { min:0, max:1, resetValue:0, initialValue:0, shouldWrap:true, shouldWrapMax: true, shouldWrapMin:true, shouldClamp:false }
}

module.exports = ( incr, reset=0, properties ) => {
  const ugen = Object.create( proto )
      
  Object.assign( ugen, 
    { 
      uid:    gen.getUID(),
      inputs: [ incr, reset ],
      memory: {
        value: { length:1, idx:null }
      }
    },
    proto.defaults,
    properties 
  )

  if( properties !== undefined && properties.shouldWrapMax === undefined && properties.shouldWrapMin === undefined ) {
    if( properties.shouldWrap !== undefined ) {
      ugen.shouldWrapMin = ugen.shouldWrapMax = properties.shouldWrap
    }
  }

  if( properties !== undefined && properties.resetValue === undefined ) {
    ugen.resetValue = ugen.min
  }

  if( ugen.initialValue === undefined ) ugen.initialValue = ugen.min

  Object.defineProperty( ugen, 'value', {
    get()  { 
      //console.log( 'gen:', gen, gen.memory )
      return gen.memory.heap[ this.memory.value.idx ] 
    },
    set(v) { gen.memory.heap[ this.memory.value.idx ] = v }
  })

  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],15:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'acos',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    

    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'acos': isWorklet ? 'Math.acos' :Math.acos })

      out = `${ref}acos( ${inputs[0]} )` 

    } else {
      out = Math.acos( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let acos = Object.create( proto )

  acos.inputs = [ x ]
  acos.id = gen.getUID()
  acos.name = `${acos.basename}{acos.id}`

  return acos
}

},{"./gen.js":44}],16:[function(require,module,exports){
'use strict'

let gen      = require( './gen.js' ),
    mul      = require( './mul.js' ),
    sub      = require( './sub.js' ),
    div      = require( './div.js' ),
    data     = require( './data.js' ),
    peek     = require( './peek.js' ),
    accum    = require( './accum.js' ),
    ifelse   = require( './ifelseif.js' ),
    lt       = require( './lt.js' ),
    bang     = require( './bang.js' ),
    env      = require( './env.js' ),
    add      = require( './add.js' ),
    poke     = require( './poke.js' ),
    neq      = require( './neq.js' ),
    and      = require( './and.js' ),
    gte      = require( './gte.js' ),
    memo     = require( './memo.js' ),
    utilities= require( './utilities.js' )

module.exports = ( attackTime = 44100, decayTime = 44100, _props ) => {
  const props = Object.assign({}, { shape:'exponential', alpha:5, trigger:null }, _props )
  const _bang = props.trigger !== null ? props.trigger : bang(),
        phase = accum( 1, _bang, { min:0, max: Infinity, initialValue:-Infinity, shouldWrap:false })
      
  let bufferData, bufferDataReverse, decayData, out, buffer

  //console.log( 'shape:', props.shape, 'attack time:', attackTime, 'decay time:', decayTime )
  let completeFlag = data( [0] )
  
  // slightly more efficient to use existing phase accumulator for linear envelopes
  if( props.shape === 'linear' ) {
    out = ifelse( 
      and( gte( phase, 0), lt( phase, attackTime )),
      div( phase, attackTime ),

      and( gte( phase, 0),  lt( phase, add( attackTime, decayTime ) ) ),
      sub( 1, div( sub( phase, attackTime ), decayTime ) ),
      
      neq( phase, -Infinity),
      poke( completeFlag, 1, 0, { inline:0 }),

      0 
    )
  } else {
    bufferData = env({ length:1024, type:props.shape, alpha:props.alpha })
    bufferDataReverse = env({ length:1024, type:props.shape, alpha:props.alpha, reverse:true })

    out = ifelse( 
      and( gte( phase, 0), lt( phase, attackTime ) ), 
      peek( bufferData, div( phase, attackTime ), { boundmode:'clamp' } ), 

      and( gte(phase,0), lt( phase, add( attackTime, decayTime ) ) ), 
      peek( bufferDataReverse, div( sub( phase, attackTime ), decayTime ), { boundmode:'clamp' }),

      neq( phase, -Infinity ),
      poke( completeFlag, 1, 0, { inline:0 }),

      0
    )
  }

  const usingWorklet = gen.mode === 'worklet'
  if( usingWorklet === true ) {
    out.node = null
    utilities.register( out )
  }

  // needed for gibberish... getting this to work right with worklets
  // via promises will probably be tricky
  out.isComplete = ()=> {
    if( usingWorklet === true && out.node !== null ) {
      const p = new Promise( resolve => {
        out.node.getMemoryValue( completeFlag.memory.values.idx, resolve )
      })

      return p
    }else{
      return gen.memory.heap[ completeFlag.memory.values.idx ]
    }
  }

  out.trigger = ()=> {
    if( usingWorklet === true && out.node !== null ) {
      out.node.port.postMessage({ key:'set', idx:completeFlag.memory.values.idx, value:0 })
    }else{
      gen.memory.heap[ completeFlag.memory.values.idx ] = 0
    }
    _bang.trigger()
  }

  return out 
}

},{"./accum.js":14,"./add.js":17,"./and.js":19,"./bang.js":23,"./data.js":30,"./div.js":35,"./env.js":36,"./gen.js":44,"./gte.js":46,"./ifelseif.js":49,"./lt.js":52,"./memo.js":56,"./mul.js":62,"./neq.js":63,"./peek.js":68,"./poke.js":70,"./sub.js":81,"./utilities.js":87}],17:[function(require,module,exports){
'use strict'

const gen = require('./gen.js')

const proto = { 
  basename:'add',
  gen() {
    let inputs = gen.getInputs( this ),
        out='',
        sum = 0, numCount = 0, adderAtEnd = false, alreadyFullSummed = true

    if( inputs.length === 0 ) return 0

    out = `  var ${this.name} = `

    inputs.forEach( (v,i) => {
      if( isNaN( v ) ) {
        out += v
        if( i < inputs.length -1 ) {
          adderAtEnd = true
          out += ' + '
        }
        alreadyFullSummed = false
      }else{
        sum += parseFloat( v )
        numCount++
      }
    })

    if( numCount > 0 ) {
      out += adderAtEnd || alreadyFullSummed ? sum : ' + ' + sum
    }

    out += '\n'

    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  }
}

module.exports = ( ...args ) => {
  const add = Object.create( proto )
  add.id = gen.getUID()
  add.name = add.basename + add.id
  add.inputs = args

  return add
}

},{"./gen.js":44}],18:[function(require,module,exports){
'use strict'

let gen      = require( './gen.js' ),
    mul      = require( './mul.js' ),
    sub      = require( './sub.js' ),
    div      = require( './div.js' ),
    data     = require( './data.js' ),
    peek     = require( './peek.js' ),
    accum    = require( './accum.js' ),
    ifelse   = require( './ifelseif.js' ),
    lt       = require( './lt.js' ),
    bang     = require( './bang.js' ),
    env      = require( './env.js' ),
    param    = require( './param.js' ),
    add      = require( './add.js' ),
    gtp      = require( './gtp.js' ),
    not      = require( './not.js' ),
    and      = require( './and.js' ),
    neq      = require( './neq.js' ),
    poke     = require( './poke.js' )

module.exports = ( attackTime=44, decayTime=22050, sustainTime=44100, sustainLevel=.6, releaseTime=44100, _props ) => {
  let envTrigger = bang(),
      phase = accum( 1, envTrigger, { max: Infinity, shouldWrap:false, initialValue:Infinity }),
      shouldSustain = param( 1 ),
      defaults = {
         shape: 'exponential',
         alpha: 5,
         triggerRelease: false,
      },
      props = Object.assign({}, defaults, _props ),
      bufferData, decayData, out, buffer, sustainCondition, releaseAccum, releaseCondition


  const completeFlag = data( [0] )

  bufferData = env({ length:1024, alpha:props.alpha, shift:0, type:props.shape })

  sustainCondition = props.triggerRelease 
    ? shouldSustain
    : lt( phase, add( attackTime, decayTime, sustainTime ) )

  releaseAccum = props.triggerRelease
    ? gtp( sub( sustainLevel, accum( div( sustainLevel, releaseTime ) , 0, { shouldWrap:false }) ), 0 )
    : sub( sustainLevel, mul( div( sub( phase, add( attackTime, decayTime, sustainTime ) ), releaseTime ), sustainLevel ) ), 

  releaseCondition = props.triggerRelease
    ? not( shouldSustain )
    : lt( phase, add( attackTime, decayTime, sustainTime, releaseTime ) )

  out = ifelse(
    // attack 
    lt( phase,  attackTime ), 
    peek( bufferData, div( phase, attackTime ), { boundmode:'clamp' } ), 

    // decay
    lt( phase, add( attackTime, decayTime ) ), 
    peek( bufferData, sub( 1, mul( div( sub( phase,  attackTime ),  decayTime ), sub( 1,  sustainLevel ) ) ), { boundmode:'clamp' }),

    // sustain
    and( sustainCondition, neq( phase, Infinity ) ),
    peek( bufferData,  sustainLevel ),

    // release
    releaseCondition, //lt( phase,  attackTime +  decayTime +  sustainTime +  releaseTime ),
    peek( 
      bufferData,
      releaseAccum, 
      //sub(  sustainLevel, mul( div( sub( phase,  attackTime +  decayTime +  sustainTime),  releaseTime ),  sustainLevel ) ), 
      { boundmode:'clamp' }
    ),

    neq( phase, Infinity ),
    poke( completeFlag, 1, 0, { inline:0 }),

    0
  )
   
  const usingWorklet = gen.mode === 'worklet'
  if( usingWorklet === true ) {
    out.node = null
    utilities.register( out )
  }

  out.trigger = ()=> {
    shouldSustain.value = 1
    envTrigger.trigger()
  }
 
  // needed for gibberish... getting this to work right with worklets
  // via promises will probably be tricky
  out.isComplete = ()=> {
    if( usingWorklet === true && out.node !== null ) {
      const p = new Promise( resolve => {
        out.node.getMemoryValue( completeFlag.memory.values.idx, resolve )
      })

      return p
    }else{
      return gen.memory.heap[ completeFlag.memory.values.idx ]
    }
  }


  out.release = ()=> {
    shouldSustain.value = 0
    // XXX pretty nasty... grabs accum inside of gtp and resets value manually
    // unfortunately envTrigger won't work as it's back to 0 by the time the release block is triggered...
    if( usingWorklet && out.node !== null ) {
      out.node.port.postMessage({ key:'set', idx:releaseAccum.inputs[0].inputs[1].memory.value.idx, value:0 })
    }else{
      gen.memory.heap[ releaseAccum.inputs[0].inputs[1].memory.value.idx ] = 0
    }
  }

  return out 
}

},{"./accum.js":14,"./add.js":17,"./and.js":19,"./bang.js":23,"./data.js":30,"./div.js":35,"./env.js":36,"./gen.js":44,"./gtp.js":47,"./ifelseif.js":49,"./lt.js":52,"./mul.js":62,"./neq.js":63,"./not.js":65,"./param.js":67,"./peek.js":68,"./poke.js":70,"./sub.js":81}],19:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'and',

  gen() {
    let inputs = gen.getInputs( this ), out

    out = `  var ${this.name} = (${inputs[0]} !== 0 && ${inputs[1]} !== 0) | 0\n\n`

    gen.memo[ this.name ] = `${this.name}`

    return [ `${this.name}`, out ]
  },

}

module.exports = ( in1, in2 ) => {
  let ugen = Object.create( proto )
  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ in1, in2 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],20:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'asin',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'asin': isWorklet ? 'Math.sin' : Math.asin })

      out = `${ref}asin( ${inputs[0]} )` 

    } else {
      out = Math.asin( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let asin = Object.create( proto )

  asin.inputs = [ x ]
  asin.id = gen.getUID()
  asin.name = `${asin.basename}{asin.id}`

  return asin
}

},{"./gen.js":44}],21:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'atan',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'atan': isWorklet ? 'Math.atan' : Math.atan })

      out = `${ref}atan( ${inputs[0]} )` 

    } else {
      out = Math.atan( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let atan = Object.create( proto )

  atan.inputs = [ x ]
  atan.id = gen.getUID()
  atan.name = `${atan.basename}{atan.id}`

  return atan
}

},{"./gen.js":44}],22:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    mul     = require( './mul.js' ),
    sub     = require( './sub.js' )

module.exports = ( decayTime = 44100 ) => {
  let ssd = history ( 1 ),
      t60 = Math.exp( -6.907755278921 / decayTime )

  ssd.in( mul( ssd.out, t60 ) )

  ssd.out.trigger = ()=> {
    ssd.value = 1
  }

  return sub( 1, ssd.out )
}

},{"./gen.js":44,"./history.js":48,"./mul.js":62,"./sub.js":81}],23:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

let proto = {
  gen() {
    gen.requestMemory( this.memory )
    
    let out = 
`  var ${this.name} = memory[${this.memory.value.idx}]
  if( ${this.name} === 1 ) memory[${this.memory.value.idx}] = 0      
      
`
    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  } 
}

module.exports = ( _props ) => {
  let ugen = Object.create( proto ),
      props = Object.assign({}, { min:0, max:1 }, _props )

  ugen.name = 'bang' + gen.getUID()

  ugen.min = props.min
  ugen.max = props.max

  const usingWorklet = gen.mode === 'worklet'
  if( usingWorklet === true ) {
    ugen.node = null
    utilities.register( ugen )
  }

  ugen.trigger = () => {
    if( usingWorklet === true && ugen.node !== null ) {
      ugen.node.port.postMessage({ key:'set', idx:ugen.memory.value.idx, value:ugen.max })
    }else{
      gen.memory.heap[ ugen.memory.value.idx ] = ugen.max 
    }
  }

  ugen.memory = {
    value: { length:1, idx:null }
  }

  return ugen
}

},{"./gen.js":44}],24:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'bool',

  gen() {
    let inputs = gen.getInputs( this ), out

    out = `${inputs[0]} === 0 ? 0 : 1`
    
    //gen.memo[ this.name ] = `gen.data.${this.name}`

    //return [ `gen.data.${this.name}`, ' ' +out ]
    return out
  }
}

module.exports = ( in1 ) => {
  let ugen = Object.create( proto )

  Object.assign( ugen, { 
    uid:        gen.getUID(),
    inputs:     [ in1 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}


},{"./gen.js":44}],25:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'ceil',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.ceil' : Math.ceil })

      out = `${ref}ceil( ${inputs[0]} )`

    } else {
      out = Math.ceil( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let ceil = Object.create( proto )

  ceil.inputs = [ x ]

  return ceil
}

},{"./gen.js":44}],26:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js'),
    floor= require('./floor.js'),
    sub  = require('./sub.js'),
    memo = require('./memo.js')

let proto = {
  basename:'clip',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        out

    out =

` var ${this.name} = ${inputs[0]}
  if( ${this.name} > ${inputs[2]} ) ${this.name} = ${inputs[2]}
  else if( ${this.name} < ${inputs[1]} ) ${this.name} = ${inputs[1]}
`
    out = ' ' + out
    
    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  },
}

module.exports = ( in1, min=-1, max=1 ) => {
  let ugen = Object.create( proto )

  Object.assign( ugen, { 
    min, 
    max,
    uid:    gen.getUID(),
    inputs: [ in1, min, max ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./floor.js":41,"./gen.js":44,"./memo.js":56,"./sub.js":81}],27:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'cos',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    
    const isWorklet = gen.mode === 'worklet'

    const ref = isWorklet ? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'cos': isWorklet ? 'Math.cos' : Math.cos })

      out = `${ref}cos( ${inputs[0]} )` 

    } else {
      out = Math.cos( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let cos = Object.create( proto )

  cos.inputs = [ x ]
  cos.id = gen.getUID()
  cos.name = `${cos.basename}{cos.id}`

  return cos
}

},{"./gen.js":44}],28:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'counter',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        genName = 'gen.' + this.name,
        functionBody
       
    if( this.memory.value.idx === null ) gen.requestMemory( this.memory )
    gen.memory.heap[ this.memory.value.idx ] = this.initialValue
    
    functionBody  = this.callback( genName, inputs[0], inputs[1], inputs[2], inputs[3], inputs[4],  `memory[${this.memory.value.idx}]`, `memory[${this.memory.wrap.idx}]`  )

    gen.memo[ this.name ] = this.name + '_value'
   
    if( gen.memo[ this.wrap.name ] === undefined ) this.wrap.gen()

    return [ this.name + '_value', functionBody ]
  },

  callback( _name, _incr, _min, _max, _reset, loops, valueRef, wrapRef ) {
    let diff = this.max - this.min,
        out = '',
        wrap = ''
    // must check for reset before storing value for output
    if( !(typeof this.inputs[3] === 'number' && this.inputs[3] < 1) ) { 
      out += `  if( ${_reset} >= 1 ) ${valueRef} = ${_min}\n`
    }

    out += `  var ${this.name}_value = ${valueRef};\n  ${valueRef} += ${_incr}\n` // store output value before accumulating  
    
    if( typeof this.max === 'number' && this.max !== Infinity && typeof this.min !== 'number' ) {
      wrap = 
`  if( ${valueRef} >= ${this.max} &&  ${loops} > 0) {
    ${valueRef} -= ${diff}
    ${wrapRef} = 1
  }else{
    ${wrapRef} = 0
  }\n`
    }else if( this.max !== Infinity && this.min !== Infinity ) {
      wrap = 
`  if( ${valueRef} >= ${_max} &&  ${loops} > 0) {
    ${valueRef} -= ${_max} - ${_min}
    ${wrapRef} = 1
  }else if( ${valueRef} < ${_min} &&  ${loops} > 0) {
    ${valueRef} += ${_max} - ${_min}
    ${wrapRef} = 1
  }else{
    ${wrapRef} = 0
  }\n`
    }else{
      out += '\n'
    }

    out = out + wrap

    return out
  }
}

module.exports = ( incr=1, min=0, max=Infinity, reset=0, loops=1,  properties ) => {
  let ugen = Object.create( proto ),
      defaults = Object.assign( { initialValue: 0, shouldWrap:true }, properties )

  Object.assign( ugen, { 
    min:    min, 
    max:    max,
    initialValue: defaults.initialValue,
    value:  defaults.initialValue,
    uid:    gen.getUID(),
    inputs: [ incr, min, max, reset, loops ],
    memory: {
      value: { length:1, idx: null },
      wrap:  { length:1, idx: null } 
    },
    wrap : {
      gen() { 
        if( ugen.memory.wrap.idx === null ) {
          gen.requestMemory( ugen.memory )
        }
        gen.getInputs( this )
        gen.memo[ this.name ] = `memory[ ${ugen.memory.wrap.idx} ]`
        return `memory[ ${ugen.memory.wrap.idx} ]` 
      }
    }
  },
  defaults )
 
  Object.defineProperty( ugen, 'value', {
    get() {
      if( this.memory.value.idx !== null ) {
        return gen.memory.heap[ this.memory.value.idx ]
      }
    },
    set( v ) {
      if( this.memory.value.idx !== null ) {
        gen.memory.heap[ this.memory.value.idx ] = v 
      }
    }
  })
  
  ugen.wrap.inputs = [ ugen ]
  ugen.name = `${ugen.basename}${ugen.uid}`
  ugen.wrap.name = ugen.name + '_wrap'
  return ugen
} 

},{"./gen.js":44}],29:[function(require,module,exports){
'use strict'

let gen  = require( './gen.js' ),
    accum= require( './phasor.js' ),
    data = require( './data.js' ),
    peek = require( './peek.js' ),
    mul  = require( './mul.js' ),
    phasor=require( './phasor.js')

let proto = {
  basename:'cycle',

  initTable() {    
    let buffer = new Float32Array( 1024 )

    for( let i = 0, l = buffer.length; i < l; i++ ) {
      buffer[ i ] = Math.sin( ( i / l ) * ( Math.PI * 2 ) )
    }

    gen.globals.cycle = data( buffer, 1, { immutable:true } )
  }

}

module.exports = ( frequency=1, reset=0, _props ) => {
  if( typeof gen.globals.cycle === 'undefined' ) proto.initTable() 
  const props = Object.assign({}, { min:0 }, _props )

  const ugen = peek( gen.globals.cycle, phasor( frequency, reset, props ))
  ugen.name = 'cycle' + gen.getUID()

  return ugen
}

},{"./data.js":30,"./gen.js":44,"./mul.js":62,"./peek.js":68,"./phasor.js":69}],30:[function(require,module,exports){
'use strict'

const gen  = require('./gen.js'),
      utilities = require( './utilities.js' ),
      peek = require('./peek.js'),
      poke = require('./poke.js')

const proto = {
  basename:'data',
  globals: {},
  memo:{},

  gen() {
    let idx
    //console.log( 'data name:', this.name, proto.memo )
    //debugger
    if( gen.memo[ this.name ] === undefined ) {
      let ugen = this
      gen.requestMemory( this.memory, this.immutable ) 
      idx = this.memory.values.idx
      if( this.buffer !== undefined ) {
        try {
          gen.memory.heap.set( this.buffer, idx )
        }catch( e ) {
          console.log( e )
          throw Error( 'error with request. asking for ' + this.buffer.length +'. current index: ' + gen.memoryIndex + ' of ' + gen.memory.heap.length )
        }
      }
      //gen.data[ this.name ] = this
      //return 'gen.memory' + this.name + '.buffer'
      if( this.name.indexOf('data') === -1 ) {
        proto.memo[ this.name ] = idx
      }else{
        gen.memo[ this.name ] = idx
      }
    }else{
      //console.log( 'using gen data memo', proto.memo[ this.name ] )
      idx = gen.memo[ this.name ]
    }
    return idx
  },
}

module.exports = ( x, y=1, properties ) => {
  let ugen, buffer, shouldLoad = false
  
  if( properties !== undefined && properties.global !== undefined ) {
    if( gen.globals[ properties.global ] ) {
      return gen.globals[ properties.global ]
    }
  }

  if( typeof x === 'number' ) {
    if( y !== 1 ) {
      buffer = []
      for( let i = 0; i < y; i++ ) {
        buffer[ i ] = new Float32Array( x )
      }
    }else{
      buffer = new Float32Array( x )
    }
  }else if( Array.isArray( x ) ) { //! (x instanceof Float32Array ) ) {
    let size = x.length
    buffer = new Float32Array( size )
    for( let i = 0; i < x.length; i++ ) {
      buffer[ i ] = x[ i ]
    }
  }else if( typeof x === 'string' ) {
    //buffer = { length: y > 1 ? y : gen.samplerate * 60 } // XXX what???
    //if( proto.memo[ x ] === undefined ) {
      buffer = { length: y > 1 ? y : 1 } // XXX what???
      shouldLoad = true
    //}else{
      //buffer = proto.memo[ x ]
    //}
  }else if( x instanceof Float32Array ) {
    buffer = x
  }
  
  ugen = Object.create( proto ) 

  Object.assign( ugen, 
  { 
    buffer,
    name: proto.basename + gen.getUID(),
    dim:  buffer !== undefined ? buffer.length : 1, // XXX how do we dynamically allocate this?
    channels : 1,
    onload: null,
    //then( fnc ) {
    //  ugen.onload = fnc
    //  return ugen
    //},
    immutable: properties !== undefined && properties.immutable === true ? true : false,
    load( filename, __resolve ) {
      let promise = utilities.loadSample( filename, ugen )
      promise.then( _buffer => { 
        proto.memo[ x ] = _buffer
        ugen.name = filename
        ugen.memory.values.length = ugen.dim = _buffer.length

        gen.requestMemory( ugen.memory, ugen.immutable ) 
        gen.memory.heap.set( _buffer, ugen.memory.values.idx )
        if( typeof ugen.onload === 'function' ) ugen.onload( _buffer ) 
        __resolve( ugen )
      })
    },
    memory : {
      values: { length:buffer !== undefined ? buffer.length : 1, idx:null }
    }
  },
  properties
  )

  
  if( properties !== undefined ) {
    if( properties.global !== undefined ) {
      gen.globals[ properties.global ] = ugen
    }
    if( properties.meta === true ) {
      for( let i = 0, length = ugen.buffer.length; i < length; i++ ) {
        Object.defineProperty( ugen, i, {
          get () {
            return peek( ugen, i, { mode:'simple', interp:'none' } )
          },
          set( v ) {
            return poke( ugen, v, i )
          }
        })
      }
    }
  }

  let returnValue
  if( shouldLoad === true ) {
    returnValue = new Promise( (resolve,reject) => {
      //ugen.load( x, resolve )
      let promise = utilities.loadSample( x, ugen )
      promise.then( _buffer => { 
        proto.memo[ x ] = _buffer
        ugen.memory.values.length = ugen.dim = _buffer.length

        ugen.buffer = _buffer
        //gen.once( 'memory init', ()=> {
        //  console.log( "CALLED", ugen.memory )
        //  gen.requestMemory( ugen.memory, ugen.immutable ) 
        //  gen.memory.heap.set( _buffer, ugen.memory.values.idx )
        //  if( typeof ugen.onload === 'function' ) ugen.onload( _buffer ) 
        //})
        
        resolve( ugen )
      })     
    })
  }else if( proto.memo[ x ] !== undefined ) {

    gen.once( 'memory init', ()=> {
      gen.requestMemory( ugen.memory, ugen.immutable ) 
      gen.memory.heap.set( ugen.buffer, ugen.memory.values.idx )
      if( typeof ugen.onload === 'function' ) ugen.onload( ugen.buffer ) 
    })

    returnValue = ugen
  }else{
    returnValue = ugen
  }

  return returnValue 
}


},{"./gen.js":44,"./peek.js":68,"./poke.js":70,"./utilities.js":87}],31:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    sub     = require( './sub.js' ),
    add     = require( './add.js' ),
    mul     = require( './mul.js' ),
    memo    = require( './memo.js' )

module.exports = ( in1 ) => {
  let x1 = history(),
      y1 = history(),
      filter

  //History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;
  filter = memo( add( sub( in1, x1.out ), mul( y1.out, .9997 ) ) )
  x1.in( in1 )
  y1.in( filter )

  return filter
}

},{"./add.js":17,"./gen.js":44,"./history.js":48,"./memo.js":56,"./mul.js":62,"./sub.js":81}],32:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    mul     = require( './mul.js' ),
    t60     = require( './t60.js' )

module.exports = ( decayTime = 44100, props ) => {
  let properties = Object.assign({}, { initValue:1 }, props ),
      ssd = history ( properties.initValue )

  ssd.in( mul( ssd.out, t60( decayTime ) ) )

  ssd.out.trigger = ()=> {
    ssd.value = 1
  }

  return ssd.out 
}

},{"./gen.js":44,"./history.js":48,"./mul.js":62,"./t60.js":83}],33:[function(require,module,exports){
'use strict'

const gen  = require( './gen.js'  ),
      data = require( './data.js' ),
      poke = require( './poke.js' ),
      peek = require( './peek.js' ),
      sub  = require( './sub.js'  ),
      wrap = require( './wrap.js' ),
      accum= require( './accum.js'),
      memo = require( './memo.js' )

const proto = {
  basename:'delay',

  gen() {
    let inputs = gen.getInputs( this )
    
    gen.memo[ this.name ] = inputs[0]
    
    return inputs[0]
  },
}

const defaults = { size: 512, interp:'none' }

module.exports = ( in1, taps, properties ) => {
  const ugen = Object.create( proto )
  let writeIdx, readIdx, delaydata

  if( Array.isArray( taps ) === false ) taps = [ taps ]
  
  const props = Object.assign( {}, defaults, properties )

  const maxTapSize = Math.max( ...taps )
  if( props.size < maxTapSize ) props.size = maxTapSize

  delaydata = data( props.size )
  
  ugen.inputs = []

  writeIdx = accum( 1, 0, { max:props.size, min:0 })
  
  for( let i = 0; i < taps.length; i++ ) {
    ugen.inputs[ i ] = peek( delaydata, wrap( sub( writeIdx, taps[i] ), 0, props.size ),{ mode:'samples', interp:props.interp })
  }
  
  ugen.outputs = ugen.inputs // XXX ugh, Ugh, UGH! but i guess it works.

  poke( delaydata, in1, writeIdx )

  ugen.name = `${ugen.basename}${gen.getUID()}`

  return ugen
}

},{"./accum.js":14,"./data.js":30,"./gen.js":44,"./memo.js":56,"./peek.js":68,"./poke.js":70,"./sub.js":81,"./wrap.js":89}],34:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    sub     = require( './sub.js' )

module.exports = ( in1 ) => {
  let n1 = history()
    
  n1.in( in1 )

  let ugen = sub( in1, n1.out )
  ugen.name = 'delta'+gen.getUID()

  return ugen
}

},{"./gen.js":44,"./history.js":48,"./sub.js":81}],35:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

const proto = {
  basename:'div',
  gen() {
    let inputs = gen.getInputs( this ),
        out=`  var ${this.name} = `,
        diff = 0, 
        numCount = 0,
        lastNumber = inputs[ 0 ],
        lastNumberIsUgen = isNaN( lastNumber ), 
        divAtEnd = false

    inputs.forEach( (v,i) => {
      if( i === 0 ) return

      let isNumberUgen = isNaN( v ),
        isFinalIdx   = i === inputs.length - 1

      if( !lastNumberIsUgen && !isNumberUgen ) {
        lastNumber = lastNumber / v
        out += lastNumber
      }else{
        out += `${lastNumber} / ${v}`
      }

      if( !isFinalIdx ) out += ' / ' 
    })

    out += '\n'

    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  }
}

module.exports = (...args) => {
  const div = Object.create( proto )
  
  Object.assign( div, {
    id:     gen.getUID(),
    inputs: args,
  })

  div.name = div.basename + div.id
  
  return div
}

},{"./gen.js":44}],36:[function(require,module,exports){
'use strict'

let gen     = require( './gen' ),
    windows = require( './windows' ),
    data    = require( './data' ),
    peek    = require( './peek' ),
    phasor  = require( './phasor' ),
    defaults = {
      type:'triangular', length:1024, alpha:.15, shift:0, reverse:false 
    }

module.exports = props => {
  
  let properties = Object.assign( {}, defaults, props )
  let buffer = new Float32Array( properties.length )

  let name = properties.type + '_' + properties.length + '_' + properties.shift + '_' + properties.reverse + '_' + properties.alpha
  if( typeof gen.globals.windows[ name ] === 'undefined' ) { 

    for( let i = 0; i < properties.length; i++ ) {
      buffer[ i ] = windows[ properties.type ]( properties.length, i, properties.alpha, properties.shift )
    }

    if( properties.reverse === true ) { 
      buffer.reverse()
    }
    gen.globals.windows[ name ] = data( buffer )
  }

  let ugen = gen.globals.windows[ name ] 
  ugen.name = 'env' + gen.getUID()

  return ugen
}

},{"./data":30,"./gen":44,"./peek":68,"./phasor":69,"./windows":88}],37:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'eq',

  gen() {
    let inputs = gen.getInputs( this ), out

    out = this.inputs[0] === this.inputs[1] ? 1 : `  var ${this.name} = (${inputs[0]} === ${inputs[1]}) | 0\n\n`

    gen.memo[ this.name ] = `${this.name}`

    return [ `${this.name}`, out ]
  },

}

module.exports = ( in1, in2 ) => {
  let ugen = Object.create( proto )
  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ in1, in2 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],38:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'exp',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.exp' : Math.exp })

      out = `${ref}exp( ${inputs[0]} )`

    } else {
      out = Math.exp( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let exp = Object.create( proto )

  exp.inputs = [ x ]

  return exp
}

},{"./gen.js":44}],39:[function(require,module,exports){
/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// originally from:
// https://github.com/GoogleChromeLabs/audioworklet-polyfill
// I am modifying it to accept variable buffer sizes
// and to get rid of some strange global initialization that seems required to use it
// with browserify. Also, I added changes to fix a bug in Safari for the AudioWorkletProcessor
// property not having a prototype (see:https://github.com/GoogleChromeLabs/audioworklet-polyfill/pull/25)
// TODO: Why is there an iframe involved? (realm.js)

const Realm = require( './realm.js' )

const AWPF = function( self = window, bufferSize = 4096 ) {
  const PARAMS = []
  let nextPort

  if (typeof AudioWorkletNode !== 'function' || !("audioWorklet" in AudioContext.prototype)) {
    self.AudioWorkletNode = function AudioWorkletNode (context, name, options) {
      const processor = getProcessorsForContext(context)[name];
      const outputChannels = options && options.outputChannelCount ? options.outputChannelCount[0] : 2;
      const scriptProcessor = context.createScriptProcessor( bufferSize, 2, outputChannels);

      scriptProcessor.parameters = new Map();
      if (processor.properties) {
        for (let i = 0; i < processor.properties.length; i++) {
          const prop = processor.properties[i];
          const node = context.createGain().gain;
          node.value = prop.defaultValue;
          // @TODO there's no good way to construct the proxy AudioParam here
          scriptProcessor.parameters.set(prop.name, node);
        }
      }

      const mc = new MessageChannel();
      nextPort = mc.port2;
      const inst = new processor.Processor(options || {});
      nextPort = null;

      scriptProcessor.port = mc.port1;
      scriptProcessor.processor = processor;
      scriptProcessor.instance = inst;
      scriptProcessor.onaudioprocess = onAudioProcess;
      return scriptProcessor;
    };

    Object.defineProperty((self.AudioContext || self.webkitAudioContext).prototype, 'audioWorklet', {
      get () {
        return this.$$audioWorklet || (this.$$audioWorklet = new self.AudioWorklet(this));
      }
    });

    /* XXX - ADDED TO OVERCOME PROBLEM IN SAFARI WHERE AUDIOWORKLETPROCESSOR PROTOTYPE IS NOT AN OBJECT */
    const AudioWorkletProcessor = function() {
      this.port = nextPort
    }
    AudioWorkletProcessor.prototype = {}

    self.AudioWorklet = class AudioWorklet {
      constructor (audioContext) {
        this.$$context = audioContext;
      }

      addModule (url, options) {
        return fetch(url).then(r => {
          if (!r.ok) throw Error(r.status);
          return r.text();
        }).then( code => {
          const context = {
            sampleRate: this.$$context.sampleRate,
            currentTime: this.$$context.currentTime,
            AudioWorkletProcessor,
            registerProcessor: (name, Processor) => {
              const processors = getProcessorsForContext(this.$$context);
              processors[name] = {
                realm,
                context,
                Processor,
                properties: Processor.parameterDescriptors || []
              };
            }
          };

          context.self = context;
          const realm = new Realm(context, document.documentElement);
          realm.exec(((options && options.transpile) || String)(code));
          return null;
        });
      }
    };
  }

  function onAudioProcess (e) {
    const parameters = {};
    let index = -1;
    this.parameters.forEach((value, key) => {
      const arr = PARAMS[++index] || (PARAMS[index] = new Float32Array(this.bufferSize));
      // @TODO proper values here if possible
      arr.fill(value.value);
      parameters[key] = arr;
    });
    this.processor.realm.exec(
      'self.sampleRate=sampleRate=' + this.context.sampleRate + ';' +
      'self.currentTime=currentTime=' + this.context.currentTime
    );
    const inputs = channelToArray(e.inputBuffer);
    const outputs = channelToArray(e.outputBuffer);
    this.instance.process([inputs], [outputs], parameters);
  }

  function channelToArray (ch) {
    const out = [];
    for (let i = 0; i < ch.numberOfChannels; i++) {
      out[i] = ch.getChannelData(i);
    }
    return out;
  }

  function getProcessorsForContext (audioContext) {
    return audioContext.$$processors || (audioContext.$$processors = {});
  }
}

module.exports = AWPF

},{"./realm.js":40}],40:[function(require,module,exports){
/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = function Realm (scope, parentElement) {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:absolute;left:0;top:-999px;width:1px;height:1px;';
  parentElement.appendChild(frame);
  const win = frame.contentWindow;
  const doc = win.document;
  let vars = 'var window,$hook';
  for (const i in win) {
    if (!(i in scope) && i !== 'eval') {
      vars += ',';
      vars += i;
    }
  }
  for (const i in scope) {
    vars += ',';
    vars += i;
    vars += '=self.';
    vars += i;
  }
  const script = doc.createElement('script');
  script.appendChild(doc.createTextNode(
    `function $hook(self,console) {"use strict";
        ${vars};return function() {return eval(arguments[0])}}`
  ));
  doc.body.appendChild(script);
  this.exec = win.$hook.call(scope, scope, console);
}

},{}],41:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'floor',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    if( isNaN( inputs[0] ) ) {
      //gen.closures.add({ [ this.name ]: Math.floor })

      out = `( ${inputs[0]} | 0 )`

    } else {
      out = inputs[0] | 0
    }
    
    return out
  }
}

module.exports = x => {
  let floor = Object.create( proto )

  floor.inputs = [ x ]

  return floor
}

},{"./gen.js":44}],42:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'fold',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        out

    out = this.createCallback( inputs[0], this.min, this.max ) 

    gen.memo[ this.name ] = this.name + '_value'

    return [ this.name + '_value', out ]
  },

  createCallback( v, lo, hi ) {
    let out =
` var ${this.name}_value = ${v},
      ${this.name}_range = ${hi} - ${lo},
      ${this.name}_numWraps = 0

  if(${this.name}_value >= ${hi}){
    ${this.name}_value -= ${this.name}_range
    if(${this.name}_value >= ${hi}){
      ${this.name}_numWraps = ((${this.name}_value - ${lo}) / ${this.name}_range) | 0
      ${this.name}_value -= ${this.name}_range * ${this.name}_numWraps
    }
    ${this.name}_numWraps++
  } else if(${this.name}_value < ${lo}){
    ${this.name}_value += ${this.name}_range
    if(${this.name}_value < ${lo}){
      ${this.name}_numWraps = ((${this.name}_value - ${lo}) / ${this.name}_range- 1) | 0
      ${this.name}_value -= ${this.name}_range * ${this.name}_numWraps
    }
    ${this.name}_numWraps--
  }
  if(${this.name}_numWraps & 1) ${this.name}_value = ${hi} + ${lo} - ${this.name}_value
`
    return ' ' + out
  }
}

module.exports = ( in1, min=0, max=1 ) => {
  let ugen = Object.create( proto )

  Object.assign( ugen, { 
    min, 
    max,
    uid:    gen.getUID(),
    inputs: [ in1 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],43:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'gate',
  controlString:null, // insert into output codegen for determining indexing
  gen() {
    let inputs = gen.getInputs( this ), out
    
    gen.requestMemory( this.memory )
    
    let lastInputMemoryIdx = 'memory[ ' + this.memory.lastInput.idx + ' ]',
        outputMemoryStartIdx = this.memory.lastInput.idx + 1,
        inputSignal = inputs[0],
        controlSignal = inputs[1]
    
    /* 
     * we check to see if the current control inputs equals our last input
     * if so, we store the signal input in the memory associated with the currently
     * selected index. If not, we put 0 in the memory associated with the last selected index,
     * change the selected index, and then store the signal in put in the memery assoicated
     * with the newly selected index
     */
    
    out =

` if( ${controlSignal} !== ${lastInputMemoryIdx} ) {
    memory[ ${lastInputMemoryIdx} + ${outputMemoryStartIdx}  ] = 0 
    ${lastInputMemoryIdx} = ${controlSignal}
  }
  memory[ ${outputMemoryStartIdx} + ${controlSignal} ] = ${inputSignal}

`
    this.controlString = inputs[1]
    this.initialized = true

    gen.memo[ this.name ] = this.name

    this.outputs.forEach( v => v.gen() )

    return [ null, ' ' + out ]
  },

  childgen() {
    if( this.parent.initialized === false ) {
      gen.getInputs( this ) // parent gate is only input of a gate output, should only be gen'd once.
    }

    if( gen.memo[ this.name ] === undefined ) {
      gen.requestMemory( this.memory )

      gen.memo[ this.name ] = `memory[ ${this.memory.value.idx} ]`
    }
    
    return  `memory[ ${this.memory.value.idx} ]`
  }
}

module.exports = ( control, in1, properties ) => {
  let ugen = Object.create( proto ),
      defaults = { count: 2 }

  if( typeof properties !== undefined ) Object.assign( defaults, properties )

  Object.assign( ugen, {
    outputs: [],
    uid:     gen.getUID(),
    inputs:  [ in1, control ],
    memory: {
      lastInput: { length:1, idx:null }
    },
    initialized:false
  },
  defaults )
  
  ugen.name = `${ugen.basename}${gen.getUID()}`

  for( let i = 0; i < ugen.count; i++ ) {
    ugen.outputs.push({
      index:i,
      gen: proto.childgen,
      parent:ugen,
      inputs: [ ugen ],
      memory: {
        value: { length:1, idx:null }
      },
      initialized:false,
      name: `${ugen.name}_out${gen.getUID()}`
    })
  }

  return ugen
}

},{"./gen.js":44}],44:[function(require,module,exports){
'use strict'

/* gen.js
 *
 * low-level code generation for unit generators
 *
 */
const MemoryHelper = require( 'memory-helper' )
const EE = require( 'events' ).EventEmitter

const gen = {

  accum:0,
  getUID() { return this.accum++ },
  debug:false,
  samplerate: 44100, // change on audiocontext creation
  shouldLocalize: false,
  graph:null,
  globals:{
    windows: {},
  },
  mode:'worklet',
  
  /* closures
   *
   * Functions that are included as arguments to master callback. Examples: Math.abs, Math.random etc.
   * XXX Should probably be renamed callbackProperties or something similar... closures are no longer used.
   */

  closures: new Set(),
  params:   new Set(),
  inputs:   new Set(),

  parameters: new Set(),
  endBlock: new Set(),
  histories: new Map(),

  memo: {},

  //data: {},
  
  /* export
   *
   * place gen functions into another object for easier reference
   */

  export( obj ) {},

  addToEndBlock( v ) {
    this.endBlock.add( '  ' + v )
  },
  
  requestMemory( memorySpec, immutable=false ) {
    for( let key in memorySpec ) {
      let request = memorySpec[ key ]

      //console.log( 'requesting ' + key + ':' , JSON.stringify( request ) )

      if( request.length === undefined ) {
        console.log( 'undefined length for:', key )

        continue
      }

      request.idx = gen.memory.alloc( request.length, immutable )
    }
  },

  createMemory( amount=4096, type ) {
    const mem = MemoryHelper.create( amount, type )
    return mem
  },

  createCallback( ugen, mem, debug = false, shouldInlineMemory=false, memType = Float64Array ) {
    let isStereo = Array.isArray( ugen ) && ugen.length > 1,
        callback, 
        channel1, channel2

    if( typeof mem === 'number' || mem === undefined ) {
      this.memory = this.createMemory( mem, memType )
    }else{
      this.memory = mem
    }
    
    this.outputIdx = this.memory.alloc( 2, true )
    this.emit( 'memory init' )

    //console.log( 'cb memory:', mem )
    this.graph = ugen
    this.memo = {} 
    this.endBlock.clear()
    this.closures.clear()
    this.inputs.clear()
    this.params.clear()
    this.globals = { windows:{} }
    
    this.parameters.clear()
    
    this.functionBody = "  'use strict'\n"
    if( shouldInlineMemory===false ) {
      this.functionBody += this.mode === 'worklet' ? 
        "  var memory = this.memory\n\n" :
        "  var memory = gen.memory\n\n"
    }

    // call .gen() on the head of the graph we are generating the callback for
    //console.log( 'HEAD', ugen )
    for( let i = 0; i < 1 + isStereo; i++ ) {
      if( typeof ugen[i] === 'number' ) continue

      //let channel = isStereo ? ugen[i].gen() : ugen.gen(),
      let channel = isStereo ? this.getInput( ugen[i] ) : this.getInput( ugen ), 
          body = ''

      // if .gen() returns array, add ugen callback (graphOutput[1]) to our output functions body
      // and then return name of ugen. If .gen() only generates a number (for really simple graphs)
      // just return that number (graphOutput[0]).
      body += Array.isArray( channel ) ? channel[1] + '\n' + channel[0] : channel

      // split body to inject return keyword on last line
      body = body.split('\n')
     
      //if( debug ) console.log( 'functionBody length', body )
      
      // next line is to accommodate memo as graph head
      if( body[ body.length -1 ].trim().indexOf('let') > -1 ) { body.push( '\n' ) } 

      // get index of last line
      let lastidx = body.length - 1

      // insert return keyword
      body[ lastidx ] = '  memory[' + (this.outputIdx + i) + ']  = ' + body[ lastidx ] + '\n'

      this.functionBody += body.join('\n')
    }
    
    this.histories.forEach( value => {
      if( value !== null )
        value.gen()      
    })

    const returnStatement = isStereo ? `  return [ memory[${this.outputIdx}], memory[${this.outputIdx + 1}] ]` : `  return memory[${this.outputIdx}]`
    
    this.functionBody = this.functionBody.split('\n')

    if( this.endBlock.size ) { 
      this.functionBody = this.functionBody.concat( Array.from( this.endBlock ) )
      this.functionBody.push( returnStatement )
    }else{
      this.functionBody.push( returnStatement )
    }
    // reassemble function body
    this.functionBody = this.functionBody.join('\n')

    // we can only dynamically create a named function by dynamically creating another function
    // to construct the named function! sheesh...
    //
    if( shouldInlineMemory === true ) {
      this.parameters.add( 'memory' )
    }

    let paramString = ''
    if( this.mode === 'worklet' ) {
      for( let name of this.parameters.values() ) {
        paramString += name + ','
      }
      paramString = paramString.slice(0,-1)
    }

    const separator = this.parameters.size !== 0 && this.inputs.size > 0 ? ', ' : ''

    let inputString = ''
    if( this.mode === 'worklet' ) {
      for( let ugen of this.inputs.values() ) {
        inputString += ugen.name + ','
      }
      inputString = inputString.slice(0,-1)
    }

    let buildString = this.mode === 'worklet'
      ? `return function( ${inputString} ${separator} ${paramString} ){ \n${ this.functionBody }\n}`
      : `return function gen( ${ [...this.parameters].join(',') } ){ \n${ this.functionBody }\n}`
    
    if( this.debug || debug ) console.log( buildString ) 

    callback = new Function( buildString )()

    // assign properties to named function
    for( let dict of this.closures.values() ) {
      let name = Object.keys( dict )[0],
          value = dict[ name ]

      callback[ name ] = value
    }

    for( let dict of this.params.values() ) {
      let name = Object.keys( dict )[0],
          ugen = dict[ name ]
      
      Object.defineProperty( callback, name, {
        configurable: true,
        get() { return ugen.value },
        set(v){ ugen.value = v }
      })
      //callback[ name ] = value
    }

    callback.members = this.closures
    callback.data = this.data
    callback.params = this.params
    callback.inputs = this.inputs
    callback.parameters = this.parameters//.slice( 0 )
    callback.out = this.memory.heap.subarray( this.outputIdx, this.outputIdx + 2 )
    callback.isStereo = isStereo

    //if( MemoryHelper.isPrototypeOf( this.memory ) ) 
    callback.memory = this.memory.heap

    this.histories.clear()

    return callback
  },
  
  /* getInputs
   *
   * Called by each individual ugen when their .gen() method is called to resolve their various inputs.
   * If an input is a number, return the number. If
   * it is an ugen, call .gen() on the ugen, memoize the result and return the result. If the
   * ugen has previously been memoized return the memoized value.
   *
   */
  getInputs( ugen ) {
    return ugen.inputs.map( gen.getInput ) 
  },

  getInput( input ) {
    let isObject = typeof input === 'object',
        processedInput

    if( isObject ) { // if input is a ugen... 
      //console.log( input.name, gen.memo[ input.name ] )
      if( gen.memo[ input.name ] ) { // if it has been memoized...
        processedInput = gen.memo[ input.name ]
      }else if( Array.isArray( input ) ) {
        gen.getInput( input[0] )
        gen.getInput( input[1] )
      }else{ // if not memoized generate code  
        if( typeof input.gen !== 'function' ) {
          console.log( 'no gen found:', input, input.gen )
          input = input.graph
        }
        let code = input.gen()
        //if( code.indexOf( 'Object' ) > -1 ) console.log( 'bad input:', input, code )
        
        if( Array.isArray( code ) ) {
          if( !gen.shouldLocalize ) {
            gen.functionBody += code[1]
          }else{
            gen.codeName = code[0]
            gen.localizedCode.push( code[1] )
          }
          //console.log( 'after GEN' , this.functionBody )
          processedInput = code[0]
        }else{
          processedInput = code
        }
      }
    }else{ // it input is a number
      processedInput = input
    }

    return processedInput
  },

  startLocalize() {
    this.localizedCode = []
    this.shouldLocalize = true
  },
  endLocalize() {
    this.shouldLocalize = false

    return [ this.codeName, this.localizedCode.slice(0) ]
  },

  free( graph ) {
    if( Array.isArray( graph ) ) { // stereo ugen
      for( let channel of graph ) {
        this.free( channel )
      }
    } else {
      if( typeof graph === 'object' ) {
        if( graph.memory !== undefined ) {
          for( let memoryKey in graph.memory ) {
            this.memory.free( graph.memory[ memoryKey ].idx )
          }
        }
        if( Array.isArray( graph.inputs ) ) {
          for( let ugen of graph.inputs ) {
            this.free( ugen )
          }
        }
      }
    }
  }
}

gen.__proto__ = new EE()

module.exports = gen

},{"events":8,"memory-helper":221}],45:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'gt',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    out = `  var ${this.name} = `  

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out += `(( ${inputs[0]} > ${inputs[1]}) | 0 )`
    } else {
      out += inputs[0] > inputs[1] ? 1 : 0 
    }
    out += '\n\n'

    gen.memo[ this.name ] = this.name

    return [this.name, out]
  }
}

module.exports = (x,y) => {
  let gt = Object.create( proto )

  gt.inputs = [ x,y ]
  gt.name = gt.basename + gen.getUID()

  return gt
}

},{"./gen.js":44}],46:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

let proto = {
  name:'gte',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    out = `  var ${this.name} = `  

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out += `( ${inputs[0]} >= ${inputs[1]} | 0 )`
    } else {
      out += inputs[0] >= inputs[1] ? 1 : 0 
    }
    out += '\n\n'

    gen.memo[ this.name ] = this.name

    return [this.name, out]
  }
}

module.exports = (x,y) => {
  let gt = Object.create( proto )

  gt.inputs = [ x,y ]
  gt.name = 'gte' + gen.getUID()

  return gt
}

},{"./gen.js":44}],47:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'gtp',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out = `(${inputs[ 0 ]} * ( ( ${inputs[0]} > ${inputs[1]} ) | 0 ) )` 
    } else {
      out = inputs[0] * ( ( inputs[0] > inputs[1] ) | 0 )
    }
    
    return out
  }
}

module.exports = (x,y) => {
  let gtp = Object.create( proto )

  gtp.inputs = [ x,y ]

  return gtp
}

},{"./gen.js":44}],48:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

module.exports = ( in1=0 ) => {
  let ugen = {
    inputs: [ in1 ],
    memory: { value: { length:1, idx: null } },
    recorder: null,

    in( v ) {
      if( gen.histories.has( v ) ){
        let memoHistory = gen.histories.get( v )
        ugen.name = memoHistory.name
        return memoHistory
      }

      let obj = {
        gen() {
          let inputs = gen.getInputs( ugen )

          if( ugen.memory.value.idx === null ) {
            gen.requestMemory( ugen.memory )
            gen.memory.heap[ ugen.memory.value.idx ] = in1
          }

          let idx = ugen.memory.value.idx
          
          gen.addToEndBlock( 'memory[ ' + idx + ' ] = ' + inputs[ 0 ] )
          
          // return ugen that is being recorded instead of ssd.
          // this effectively makes a call to ssd.record() transparent to the graph.
          // recording is triggered by prior call to gen.addToEndBlock.
          gen.histories.set( v, obj )

          return inputs[ 0 ]
        },
        name: ugen.name + '_in'+gen.getUID(),
        memory: ugen.memory
      }

      this.inputs[ 0 ] = v
      
      ugen.recorder = obj

      return obj
    },
    
    out: {
            
      gen() {
        if( ugen.memory.value.idx === null ) {
          if( gen.histories.get( ugen.inputs[0] ) === undefined ) {
            gen.histories.set( ugen.inputs[0], ugen.recorder )
          }
          gen.requestMemory( ugen.memory )
          gen.memory.heap[ ugen.memory.value.idx ] = parseFloat( in1 )
        }
        let idx = ugen.memory.value.idx
         
        return 'memory[ ' + idx + ' ] '
      },
    },

    uid: gen.getUID(),
  }
  
  ugen.out.memory = ugen.memory 

  ugen.name = 'history' + ugen.uid
  ugen.out.name = ugen.name + '_out'
  ugen.in._name  = ugen.name = '_in'

  Object.defineProperty( ugen, 'value', {
    get() {
      if( this.memory.value.idx !== null ) {
        return gen.memory.heap[ this.memory.value.idx ]
      }
    },
    set( v ) {
      if( this.memory.value.idx !== null ) {
        gen.memory.heap[ this.memory.value.idx ] = v 
      }
    }
  })

  return ugen
}

},{"./gen.js":44}],49:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'ifelse',

  gen() {
    let conditionals = this.inputs[0],
        defaultValue = gen.getInput( conditionals[ conditionals.length - 1] ),
        out = `  var ${this.name}_out = ${defaultValue}\n` 

    //console.log( 'conditionals:', this.name, conditionals )

    //console.log( 'defaultValue:', defaultValue )

    for( let i = 0; i < conditionals.length - 2; i+= 2 ) {
      let isEndBlock = i === conditionals.length - 3,
          cond  = gen.getInput( conditionals[ i ] ),
          preblock = conditionals[ i+1 ],
          block, blockName, output

      //console.log( 'pb', preblock )

      if( typeof preblock === 'number' ){
        block = preblock
        blockName = null
      }else{
        if( gen.memo[ preblock.name ] === undefined ) {
          // used to place all code dependencies in appropriate blocks
          gen.startLocalize()

          gen.getInput( preblock )

          block = gen.endLocalize()
          blockName = block[0]
          block = block[ 1 ].join('')
          block = '  ' + block.replace( /\n/gi, '\n  ' )
        }else{
          block = ''
          blockName = gen.memo[ preblock.name ]
        }
      }

      output = blockName === null ? 
        `  ${this.name}_out = ${block}` :
        `${block}  ${this.name}_out = ${blockName}`
      
      if( i===0 ) out += ' '
      out += 
` if( ${cond} === 1 ) {
${output}
  }`

      if( !isEndBlock ) {
        out += ` else`
      }else{
        out += `\n`
      }
    }

    gen.memo[ this.name ] = `${this.name}_out`

    return [ `${this.name}_out`, out ]
  }
}

module.exports = ( ...args  ) => {
  let ugen = Object.create( proto ),
      conditions = Array.isArray( args[0] ) ? args[0] : args

  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ conditions ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],50:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

let proto = {
  basename:'in',

  gen() {
    const isWorklet = gen.mode === 'worklet'

    if( isWorklet ) {
      gen.inputs.add( this )
    }else{
      gen.parameters.add( this.name )
    }

    gen.memo[ this.name ] = isWorklet === true ? this.name + '[i]' : this.name

    return gen.memo[ this.name ]
  } 
}

module.exports = ( name, inputNumber=0, channelNumber=0, defaultValue=0, min=0, max=1 ) => {
  let input = Object.create( proto )

  input.id   = gen.getUID()
  input.name = name !== undefined ? name : `${input.basename}${input.id}`
  Object.assign( input, { defaultValue, min, max, inputNumber, channelNumber })

  input[0] = {
    gen() {
      if( ! gen.parameters.has( input.name ) ) gen.parameters.add( input.name )
      return input.name + '[0]'
    }
  }
  input[1] = {
    gen() {
      if( ! gen.parameters.has( input.name ) ) gen.parameters.add( input.name )
      return input.name + '[1]'
    }
  }


  return input
}

},{"./gen.js":44}],51:[function(require,module,exports){
'use strict'

const library = {
  export( destination ) {
    if( destination === window ) {
      destination.ssd = library.history    // history is window object property, so use ssd as alias
      destination.input = library.in       // in is a keyword in javascript
      destination.ternary = library.switch // switch is a keyword in javascript

      delete library.history
      delete library.in
      delete library.switch
    }

    Object.assign( destination, library )

    Object.defineProperty( library, 'samplerate', {
      get() { return library.gen.samplerate },
      set(v) {}
    })

    library.in = destination.input
    library.history = destination.ssd
    library.switch = destination.ternary

    destination.clip = library.clamp
  },

  gen:      require( './gen.js' ),
  
  abs:      require( './abs.js' ),
  round:    require( './round.js' ),
  param:    require( './param.js' ),
  add:      require( './add.js' ),
  sub:      require( './sub.js' ),
  mul:      require( './mul.js' ),
  div:      require( './div.js' ),
  accum:    require( './accum.js' ),
  counter:  require( './counter.js' ),
  sin:      require( './sin.js' ),
  cos:      require( './cos.js' ),
  tan:      require( './tan.js' ),
  tanh:     require( './tanh.js' ),
  asin:     require( './asin.js' ),
  acos:     require( './acos.js' ),
  atan:     require( './atan.js' ),  
  phasor:   require( './phasor.js' ),
  data:     require( './data.js' ),
  peek:     require( './peek.js' ),
  cycle:    require( './cycle.js' ),
  history:  require( './history.js' ),
  delta:    require( './delta.js' ),
  floor:    require( './floor.js' ),
  ceil:     require( './ceil.js' ),
  min:      require( './min.js' ),
  max:      require( './max.js' ),
  sign:     require( './sign.js' ),
  dcblock:  require( './dcblock.js' ),
  memo:     require( './memo.js' ),
  rate:     require( './rate.js' ),
  wrap:     require( './wrap.js' ),
  mix:      require( './mix.js' ),
  clamp:    require( './clamp.js' ),
  poke:     require( './poke.js' ),
  delay:    require( './delay.js' ),
  fold:     require( './fold.js' ),
  mod :     require( './mod.js' ),
  sah :     require( './sah.js' ),
  noise:    require( './noise.js' ),
  not:      require( './not.js' ),
  gt:       require( './gt.js' ),
  gte:      require( './gte.js' ),
  lt:       require( './lt.js' ), 
  lte:      require( './lte.js' ), 
  bool:     require( './bool.js' ),
  gate:     require( './gate.js' ),
  train:    require( './train.js' ),
  slide:    require( './slide.js' ),
  in:       require( './in.js' ),
  t60:      require( './t60.js'),
  mtof:     require( './mtof.js'),
  ltp:      require( './ltp.js'),        // TODO: test
  gtp:      require( './gtp.js'),        // TODO: test
  switch:   require( './switch.js' ),
  mstosamps:require( './mstosamps.js' ), // TODO: needs test,
  selector: require( './selector.js' ),
  utilities:require( './utilities.js' ),
  pow:      require( './pow.js' ),
  attack:   require( './attack.js' ),
  decay:    require( './decay.js' ),
  windows:  require( './windows.js' ),
  env:      require( './env.js' ),
  ad:       require( './ad.js'  ),
  adsr:     require( './adsr.js' ),
  ifelse:   require( './ifelseif.js' ),
  bang:     require( './bang.js' ),
  and:      require( './and.js' ),
  pan:      require( './pan.js' ),
  eq:       require( './eq.js' ),
  neq:      require( './neq.js' ),
  exp:      require( './exp.js' ),
  process:  require( './process.js' ),
  seq:      require( './seq.js' )
}

library.gen.lib = library

module.exports = library

},{"./abs.js":13,"./accum.js":14,"./acos.js":15,"./ad.js":16,"./add.js":17,"./adsr.js":18,"./and.js":19,"./asin.js":20,"./atan.js":21,"./attack.js":22,"./bang.js":23,"./bool.js":24,"./ceil.js":25,"./clamp.js":26,"./cos.js":27,"./counter.js":28,"./cycle.js":29,"./data.js":30,"./dcblock.js":31,"./decay.js":32,"./delay.js":33,"./delta.js":34,"./div.js":35,"./env.js":36,"./eq.js":37,"./exp.js":38,"./floor.js":41,"./fold.js":42,"./gate.js":43,"./gen.js":44,"./gt.js":45,"./gte.js":46,"./gtp.js":47,"./history.js":48,"./ifelseif.js":49,"./in.js":50,"./lt.js":52,"./lte.js":53,"./ltp.js":54,"./max.js":55,"./memo.js":56,"./min.js":57,"./mix.js":58,"./mod.js":59,"./mstosamps.js":60,"./mtof.js":61,"./mul.js":62,"./neq.js":63,"./noise.js":64,"./not.js":65,"./pan.js":66,"./param.js":67,"./peek.js":68,"./phasor.js":69,"./poke.js":70,"./pow.js":71,"./process.js":72,"./rate.js":73,"./round.js":74,"./sah.js":75,"./selector.js":76,"./seq.js":77,"./sign.js":78,"./sin.js":79,"./slide.js":80,"./sub.js":81,"./switch.js":82,"./t60.js":83,"./tan.js":84,"./tanh.js":85,"./train.js":86,"./utilities.js":87,"./windows.js":88,"./wrap.js":89}],52:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'lt',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    out = `  var ${this.name} = `  

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out += `(( ${inputs[0]} < ${inputs[1]}) | 0  )`
    } else {
      out += inputs[0] < inputs[1] ? 1 : 0 
    }
    out += '\n'

    gen.memo[ this.name ] = this.name

    return [this.name, out]
    
    return out
  }
}

module.exports = (x,y) => {
  let lt = Object.create( proto )

  lt.inputs = [ x,y ]
  lt.name = lt.basename + gen.getUID()

  return lt
}

},{"./gen.js":44}],53:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'lte',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    out = `  var ${this.name} = `  

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out += `( ${inputs[0]} <= ${inputs[1]} | 0  )`
    } else {
      out += inputs[0] <= inputs[1] ? 1 : 0 
    }
    out += '\n'

    gen.memo[ this.name ] = this.name

    return [this.name, out]
    
    return out
  }
}

module.exports = (x,y) => {
  let lt = Object.create( proto )

  lt.inputs = [ x,y ]
  lt.name = 'lte' + gen.getUID()

  return lt
}

},{"./gen.js":44}],54:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'ltp',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    if( isNaN( this.inputs[0] ) || isNaN( this.inputs[1] ) ) {
      out = `(${inputs[ 0 ]} * (( ${inputs[0]} < ${inputs[1]} ) | 0 ) )` 
    } else {
      out = inputs[0] * (( inputs[0] < inputs[1] ) | 0 )
    }
    
    return out
  }
}

module.exports = (x,y) => {
  let ltp = Object.create( proto )

  ltp.inputs = [ x,y ]

  return ltp
}

},{"./gen.js":44}],55:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'max',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) || isNaN( inputs[1] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.max' : Math.max })

      out = `${ref}max( ${inputs[0]}, ${inputs[1]} )`

    } else {
      out = Math.max( parseFloat( inputs[0] ), parseFloat( inputs[1] ) )
    }
    
    return out
  }
}

module.exports = (x,y) => {
  let max = Object.create( proto )

  max.inputs = [ x,y ]

  return max
}

},{"./gen.js":44}],56:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

let proto = {
  basename:'memo',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    out = `  var ${this.name} = ${inputs[0]}\n`

    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  } 
}

module.exports = (in1,memoName) => {
  let memo = Object.create( proto )
  
  memo.inputs = [ in1 ]
  memo.id   = gen.getUID()
  memo.name = memoName !== undefined ? memoName + '_' + gen.getUID() : `${memo.basename}${memo.id}`

  return memo
}

},{"./gen.js":44}],57:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'min',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) || isNaN( inputs[1] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.min' : Math.min })

      out = `${ref}min( ${inputs[0]}, ${inputs[1]} )`

    } else {
      out = Math.min( parseFloat( inputs[0] ), parseFloat( inputs[1] ) )
    }
    
    return out
  }
}

module.exports = (x,y) => {
  let min = Object.create( proto )

  min.inputs = [ x,y ]

  return min
}

},{"./gen.js":44}],58:[function(require,module,exports){
'use strict'

let gen = require('./gen.js'),
    add = require('./add.js'),
    mul = require('./mul.js'),
    sub = require('./sub.js'),
    memo= require('./memo.js')

module.exports = ( in1, in2, t=.5 ) => {
  let ugen = memo( add( mul(in1, sub(1,t ) ), mul( in2, t ) ) )
  ugen.name = 'mix' + gen.getUID()

  return ugen
}

},{"./add.js":17,"./gen.js":44,"./memo.js":56,"./mul.js":62,"./sub.js":81}],59:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

module.exports = (...args) => {
  let mod = {
    id:     gen.getUID(),
    inputs: args,

    gen() {
      let inputs = gen.getInputs( this ),
          out='(',
          diff = 0, 
          numCount = 0,
          lastNumber = inputs[ 0 ],
          lastNumberIsUgen = isNaN( lastNumber ), 
          modAtEnd = false

      inputs.forEach( (v,i) => {
        if( i === 0 ) return

        let isNumberUgen = isNaN( v ),
            isFinalIdx   = i === inputs.length - 1

        if( !lastNumberIsUgen && !isNumberUgen ) {
          lastNumber = lastNumber % v
          out += lastNumber
        }else{
          out += `${lastNumber} % ${v}`
        }

        if( !isFinalIdx ) out += ' % ' 
      })

      out += ')'

      return out
    }
  }
  
  return mod
}

},{"./gen.js":44}],60:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'mstosamps',

  gen() {
    let out,
        inputs = gen.getInputs( this ),
        returnValue

    if( isNaN( inputs[0] ) ) {
      out = `  var ${this.name } = ${gen.samplerate} / 1000 * ${inputs[0]} \n\n`
     
      gen.memo[ this.name ] = out
      
      returnValue = [ this.name, out ]
    } else {
      out = gen.samplerate / 1000 * this.inputs[0]

      returnValue = out
    }    

    return returnValue
  }
}

module.exports = x => {
  let mstosamps = Object.create( proto )

  mstosamps.inputs = [ x ]
  mstosamps.name = proto.basename + gen.getUID()

  return mstosamps
}

},{"./gen.js":44}],61:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'mtof',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: Math.exp })

      out = `( ${this.tuning} * gen.exp( .057762265 * (${inputs[0]} - 69) ) )`

    } else {
      out = this.tuning * Math.exp( .057762265 * ( inputs[0] - 69) )
    }
    
    return out
  }
}

module.exports = ( x, props ) => {
  let ugen = Object.create( proto ),
      defaults = { tuning:440 }
  
  if( props !== undefined ) Object.assign( props.defaults )

  Object.assign( ugen, defaults )
  ugen.inputs = [ x ]
  

  return ugen
}

},{"./gen.js":44}],62:[function(require,module,exports){
'use strict'

const gen = require('./gen.js')

const proto = {
  basename: 'mul',

  gen() {
    let inputs = gen.getInputs( this ),
        out = `  var ${this.name} = `,
        sum = 1, numCount = 0, mulAtEnd = false, alreadyFullSummed = true

    inputs.forEach( (v,i) => {
      if( isNaN( v ) ) {
        out += v
        if( i < inputs.length -1 ) {
          mulAtEnd = true
          out += ' * '
        }
        alreadyFullSummed = false
      }else{
        if( i === 0 ) {
          sum = v
        }else{
          sum *= parseFloat( v )
        }
        numCount++
      }
    })

    if( numCount > 0 ) {
      out += mulAtEnd || alreadyFullSummed ? sum : ' * ' + sum
    }

    out += '\n'

    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  }
}

module.exports = ( ...args ) => {
  const mul = Object.create( proto )
  
  Object.assign( mul, {
      id:     gen.getUID(),
      inputs: args,
  })
  
  mul.name = mul.basename + mul.id

  return mul
}

},{"./gen.js":44}],63:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'neq',

  gen() {
    let inputs = gen.getInputs( this ), out

    out = /*this.inputs[0] !== this.inputs[1] ? 1 :*/ `  var ${this.name} = (${inputs[0]} !== ${inputs[1]}) | 0\n\n`

    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  },

}

module.exports = ( in1, in2 ) => {
  let ugen = Object.create( proto )
  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ in1, in2 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],64:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'noise',

  gen() {
    let out

    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    gen.closures.add({ 'noise' : isWorklet ? 'Math.random' : Math.random })

    out = `  var ${this.name} = ${ref}noise()\n`
    
    gen.memo[ this.name ] = this.name

    return [ this.name, out ]
  }
}

module.exports = x => {
  let noise = Object.create( proto )
  noise.name = proto.name + gen.getUID()

  return noise
}

},{"./gen.js":44}],65:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'not',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    if( isNaN( this.inputs[0] ) ) {
      out = `( ${inputs[0]} === 0 ? 1 : 0 )`
    } else {
      out = !inputs[0] === 0 ? 1 : 0
    }
    
    return out
  }
}

module.exports = x => {
  let not = Object.create( proto )

  not.inputs = [ x ]

  return not
}

},{"./gen.js":44}],66:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' ),
    data = require( './data.js' ),
    peek = require( './peek.js' ),
    mul  = require( './mul.js' )

let proto = {
  basename:'pan', 
  initTable() {    
    let bufferL = new Float32Array( 1024 ),
        bufferR = new Float32Array( 1024 )

    const angToRad = Math.PI / 180
    for( let i = 0; i < 1024; i++ ) { 
      let pan = i * ( 90 / 1024 )
      bufferL[i] = Math.cos( pan * angToRad ) 
      bufferR[i] = Math.sin( pan * angToRad )
    }

    gen.globals.panL = data( bufferL, 1, { immutable:true })
    gen.globals.panR = data( bufferR, 1, { immutable:true })
  }

}

module.exports = ( leftInput, rightInput, pan =.5, properties ) => {
  if( gen.globals.panL === undefined ) proto.initTable()

  let ugen = Object.create( proto )

  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ leftInput, rightInput ],
    left:    mul( leftInput, peek( gen.globals.panL, pan, { boundmode:'clamp' }) ),
    right:   mul( rightInput, peek( gen.globals.panR, pan, { boundmode:'clamp' }) )
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./data.js":30,"./gen.js":44,"./mul.js":62,"./peek.js":68}],67:[function(require,module,exports){
'use strict'

let gen = require('./gen.js')

let proto = {
  basename: 'param',

  gen() {
    gen.requestMemory( this.memory )
    
    gen.params.add( this )

    const isWorklet = gen.mode === 'worklet'

    if( isWorklet ) gen.parameters.add( this.name )

    this.value = this.initialValue

    gen.memo[ this.name ] = isWorklet ? this.name : `memory[${this.memory.value.idx}]`

    return gen.memo[ this.name ]
  } 
}

module.exports = ( propName=0, value=0, min=0, max=1 ) => {
  let ugen = Object.create( proto )
  
  if( typeof propName !== 'string' ) {
    ugen.name = ugen.basename + gen.getUID()
    ugen.initialValue = propName
  }else{
    ugen.name = propName
    ugen.initialValue = value
  }

  ugen.min = min
  ugen.max = max
  ugen.defaultValue = ugen.initialValue

  // for storing worklet nodes once they're instantiated
  ugen.waapi = null

  ugen.isWorklet = gen.mode === 'worklet'

  Object.defineProperty( ugen, 'value', {
    get() {
      if( this.memory.value.idx !== null ) {
        return gen.memory.heap[ this.memory.value.idx ]
      }else{
        return this.initialValue
      }
    },
    set( v ) {
      if( this.memory.value.idx !== null ) {
        if( this.isWorklet && this.waapi !== null ) {
          this.waapi.value = v
        }else{
          gen.memory.heap[ this.memory.value.idx ] = v
        } 
      }
    }
  })

  ugen.memory = {
    value: { length:1, idx:null }
  }

  return ugen
}

},{"./gen.js":44}],68:[function(require,module,exports){

const gen  = require('./gen.js'),
      dataUgen = require('./data.js')

let proto = {
  basename:'peek',

  gen() {
    let genName = 'gen.' + this.name,
        inputs = gen.getInputs( this ),
        out, functionBody, next, lengthIsLog2, idx
    
    idx = inputs[1]
    lengthIsLog2 = (Math.log2( this.data.buffer.length ) | 0)  === Math.log2( this.data.buffer.length )

    if( this.mode !== 'simple' ) {

    functionBody = `  var ${this.name}_dataIdx  = ${idx}, 
      ${this.name}_phase = ${this.mode === 'samples' ? inputs[0] : inputs[0] + ' * ' + (this.data.buffer.length) }, 
      ${this.name}_index = ${this.name}_phase | 0,\n`

    if( this.boundmode === 'wrap' ) {
      next = lengthIsLog2 ?
      `( ${this.name}_index + 1 ) & (${this.data.buffer.length} - 1)` :
      `${this.name}_index + 1 >= ${this.data.buffer.length} ? ${this.name}_index + 1 - ${this.data.buffer.length} : ${this.name}_index + 1`
    }else if( this.boundmode === 'clamp' ) {
      next = 
        `${this.name}_index + 1 >= ${this.data.buffer.length - 1} ? ${this.data.buffer.length - 1} : ${this.name}_index + 1`
    } else if( this.boundmode === 'fold' || this.boundmode === 'mirror' ) {
      next = 
        `${this.name}_index + 1 >= ${this.data.buffer.length - 1} ? ${this.name}_index - ${this.data.buffer.length - 1} : ${this.name}_index + 1`
    }else{
       next = 
      `${this.name}_index + 1`     
    }

    if( this.interp === 'linear' ) {      
    functionBody += `      ${this.name}_frac  = ${this.name}_phase - ${this.name}_index,
      ${this.name}_base  = memory[ ${this.name}_dataIdx +  ${this.name}_index ],
      ${this.name}_next  = ${next},`
      
      if( this.boundmode === 'ignore' ) {
        functionBody += `
      ${this.name}_out   = ${this.name}_index >= ${this.data.buffer.length - 1} || ${this.name}_index < 0 ? 0 : ${this.name}_base + ${this.name}_frac * ( memory[ ${this.name}_dataIdx + ${this.name}_next ] - ${this.name}_base )\n\n`
      }else{
        functionBody += `
      ${this.name}_out   = ${this.name}_base + ${this.name}_frac * ( memory[ ${this.name}_dataIdx + ${this.name}_next ] - ${this.name}_base )\n\n`
      }
    }else{
      functionBody += `      ${this.name}_out = memory[ ${this.name}_dataIdx + ${this.name}_index ]\n\n`
    }

    } else { // mode is simple
      functionBody = `memory[ ${idx} + ${ inputs[0] } ]`
      
      return functionBody
    }

    gen.memo[ this.name ] = this.name + '_out'

    return [ this.name+'_out', functionBody ]
  },

  defaults : { channels:1, mode:'phase', interp:'linear', boundmode:'wrap' }
}

module.exports = ( input_data, index=0, properties ) => {
  let ugen = Object.create( proto )

  //console.log( dataUgen, gen.data )

  // XXX why is dataUgen not the actual function? some type of browserify nonsense...
  const finalData = typeof input_data.basename === 'undefined' ? gen.lib.data( input_data ) : input_data

  Object.assign( ugen, 
    { 
      'data':     finalData,
      dataName:   finalData.name,
      uid:        gen.getUID(),
      inputs:     [ index, finalData ],
    },
    proto.defaults,
    properties 
  )
  
  ugen.name = ugen.basename + ugen.uid

  return ugen
}


},{"./data.js":30,"./gen.js":44}],69:[function(require,module,exports){
'use strict'

let gen   = require( './gen.js' ),
    accum = require( './accum.js' ),
    mul   = require( './mul.js' ),
    proto = { basename:'phasor' },
    div   = require( './div.js' )

const defaults = { min: -1, max: 1 }

module.exports = ( frequency = 1, reset = 0, _props ) => {
  const props = Object.assign( {}, defaults, _props )

  const range = props.max - props.min

  const ugen = typeof frequency === 'number' 
    ? accum( (frequency * range) / gen.samplerate, reset, props ) 
    : accum( 
        div( 
          mul( frequency, range ),
          gen.samplerate
        ), 
        reset, props 
    )

  ugen.name = proto.basename + gen.getUID()

  return ugen
}

},{"./accum.js":14,"./div.js":35,"./gen.js":44,"./mul.js":62}],70:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js'),
    mul  = require('./mul.js'),
    wrap = require('./wrap.js')

let proto = {
  basename:'poke',

  gen() {
    let dataName = 'memory',
        inputs = gen.getInputs( this ),
        idx, out, wrapped
    
    idx = this.data.gen()

    //gen.requestMemory( this.memory )
    //wrapped = wrap( this.inputs[1], 0, this.dataLength ).gen()
    //idx = wrapped[0]
    //gen.functionBody += wrapped[1]
    let outputStr = this.inputs[1] === 0 ?
      `  ${dataName}[ ${idx} ] = ${inputs[0]}\n` :
      `  ${dataName}[ ${idx} + ${inputs[1]} ] = ${inputs[0]}\n`

    if( this.inline === undefined ) {
      gen.functionBody += outputStr
    }else{
      return [ this.inline, outputStr ]
    }
  }
}
module.exports = ( data, value, index, properties ) => {
  let ugen = Object.create( proto ),
      defaults = { channels:1 } 

  if( properties !== undefined ) Object.assign( defaults, properties )

  Object.assign( ugen, { 
    data,
    dataName:   data.name,
    dataLength: data.buffer.length,
    uid:        gen.getUID(),
    inputs:     [ value, index ],
  },
  defaults )


  ugen.name = ugen.basename + ugen.uid
  
  gen.histories.set( ugen.name, ugen )

  return ugen
}

},{"./gen.js":44,"./mul.js":62,"./wrap.js":89}],71:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'pow',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) || isNaN( inputs[1] ) ) {
      gen.closures.add({ 'pow': isWorklet ? 'Math.pow' : Math.pow })

      out = `${ref}pow( ${inputs[0]}, ${inputs[1]} )` 

    } else {
      if( typeof inputs[0] === 'string' && inputs[0][0] === '(' ) {
        inputs[0] = inputs[0].slice(1,-1)
      }
      if( typeof inputs[1] === 'string' && inputs[1][0] === '(' ) {
        inputs[1] = inputs[1].slice(1,-1)
      }

      out = Math.pow( parseFloat( inputs[0] ), parseFloat( inputs[1]) )
    }
    
    return out
  }
}

module.exports = (x,y) => {
  let pow = Object.create( proto )

  pow.inputs = [ x,y ]
  pow.id = gen.getUID()
  pow.name = `${pow.basename}{pow.id}`

  return pow
}

},{"./gen.js":44}],72:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')
const proto = {
  basename:'process',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    gen.closures.add({ [''+this.funcname] : this.func })

    out = `  var ${this.name} = gen['${this.funcname}'](`

    inputs.forEach( (v,i,arr ) => {
      out += arr[ i ]
      if( i < arr.length - 1 ) out += ','
    })

    out += ')\n'

    gen.memo[ this.name ] = this.name

    return [this.name, out]
    
    return out
  }
}

module.exports = (...args) => {
  const process = {}// Object.create( proto )
  const id = gen.getUID()
  process.name = 'process' + id 

  process.func = new Function( ...args )

  //gen.globals[ process.name ] = process.func

  process.call = function( ...args  ) {
    const output = Object.create( proto )
    output.funcname = process.name
    output.func = process.func
    output.name = 'process_out_' + id
    output.process = process

    output.inputs = args

    return output
  }

  return process 
}

},{"./gen.js":44}],73:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    sub     = require( './sub.js' ),
    add     = require( './add.js' ),
    mul     = require( './mul.js' ),
    memo    = require( './memo.js' ),
    delta   = require( './delta.js' ),
    wrap    = require( './wrap.js' )

let proto = {
  basename:'rate',

  gen() {
    let inputs = gen.getInputs( this ),
        phase  = history(),
        inMinus1 = history(),
        genName = 'gen.' + this.name,
        filter, sum, out

    gen.closures.add({ [ this.name ]: this }) 

    out = 
` var ${this.name}_diff = ${inputs[0]} - ${genName}.lastSample
  if( ${this.name}_diff < -.5 ) ${this.name}_diff += 1
  ${genName}.phase += ${this.name}_diff * ${inputs[1]}
  if( ${genName}.phase > 1 ) ${genName}.phase -= 1
  ${genName}.lastSample = ${inputs[0]}
`
    out = ' ' + out

    return [ genName + '.phase', out ]
  }
}

module.exports = ( in1, rate ) => {
  let ugen = Object.create( proto )

  Object.assign( ugen, { 
    phase:      0,
    lastSample: 0,
    uid:        gen.getUID(),
    inputs:     [ in1, rate ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./add.js":17,"./delta.js":34,"./gen.js":44,"./history.js":48,"./memo.js":56,"./mul.js":62,"./sub.js":81,"./wrap.js":89}],74:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'round',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.round' : Math.round })

      out = `${ref}round( ${inputs[0]} )`

    } else {
      out = Math.round( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let round = Object.create( proto )

  round.inputs = [ x ]

  return round
}

},{"./gen.js":44}],75:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' )

let proto = {
  basename:'sah',

  gen() {
    let inputs = gen.getInputs( this ), out

    //gen.data[ this.name ] = 0
    //gen.data[ this.name + '_control' ] = 0

    gen.requestMemory( this.memory )


    out = 
` var ${this.name}_control = memory[${this.memory.control.idx}],
      ${this.name}_trigger = ${inputs[1]} > ${inputs[2]} ? 1 : 0

  if( ${this.name}_trigger !== ${this.name}_control  ) {
    if( ${this.name}_trigger === 1 ) 
      memory[${this.memory.value.idx}] = ${inputs[0]}
    
    memory[${this.memory.control.idx}] = ${this.name}_trigger
  }
`
    
    gen.memo[ this.name ] = `memory[${this.memory.value.idx}]`//`gen.data.${this.name}`

    return [ `memory[${this.memory.value.idx}]`, ' ' +out ]
  }
}

module.exports = ( in1, control, threshold=0, properties ) => {
  let ugen = Object.create( proto ),
      defaults = { init:0 }

  if( properties !== undefined ) Object.assign( defaults, properties )

  Object.assign( ugen, { 
    lastSample: 0,
    uid:        gen.getUID(),
    inputs:     [ in1, control,threshold ],
    memory: {
      control: { idx:null, length:1 },
      value:   { idx:null, length:1 },
    }
  },
  defaults )
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],76:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'selector',

  gen() {
    let inputs = gen.getInputs( this ), out, returnValue = 0
    
    switch( inputs.length ) {
      case 2 :
        returnValue = inputs[1]
        break;
      case 3 :
        out = `  var ${this.name}_out = ${inputs[0]} === 1 ? ${inputs[1]} : ${inputs[2]}\n\n`;
        returnValue = [ this.name + '_out', out ]
        break;  
      default:
        out = 
` var ${this.name}_out = 0
  switch( ${inputs[0]} + 1 ) {\n`

        for( let i = 1; i < inputs.length; i++ ){
          out +=`    case ${i}: ${this.name}_out = ${inputs[i]}; break;\n` 
        }

        out += '  }\n\n'
        
        returnValue = [ this.name + '_out', ' ' + out ]
    }

    gen.memo[ this.name ] = this.name + '_out'

    return returnValue
  },
}

module.exports = ( ...inputs ) => {
  let ugen = Object.create( proto )
  
  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],77:[function(require,module,exports){
'use strict'

let gen   = require( './gen.js' ),
    accum = require( './accum.js' ),
    counter= require( './counter.js' ),
    peek  = require( './peek.js' ),
    ssd   = require( './history.js' ),
    data  = require( './data.js' ),
    proto = { basename:'seq' }

module.exports = ( durations = 11025, values = [0,1], phaseIncrement = 1) => {
  let clock
  
  if( Array.isArray( durations ) ) {
    // we want a counter that is using our current
    // rate value, but we want the rate value to be derived from
    // the counter. must insert a single-sample dealy to avoid
    // infinite loop.
    const clock2 = counter( 0, 0, durations.length )
    const __durations = peek( data( durations ), clock2, { mode:'simple' }) 
    clock = counter( phaseIncrement, 0, __durations )
    
    // add one sample delay to avoid codegen loop
    const s = ssd()
    s.in( clock.wrap )
    clock2.inputs[0] = s.out
  }else{
    // if the rate argument is a single value we don't need to
    // do anything tricky.
    clock = counter( phaseIncrement, 0, durations )
  }
  
  const stepper = accum( clock.wrap, 0, { min:0, max:values.length })
   
  const ugen = peek( data( values ), stepper, { mode:'simple' })

  ugen.name = proto.basename + gen.getUID()
  ugen.trigger = clock.wrap

  return ugen
}

},{"./accum.js":14,"./counter.js":28,"./data.js":30,"./gen.js":44,"./history.js":48,"./peek.js":68}],78:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  name:'sign',

  gen() {
    let out,
        inputs = gen.getInputs( this )

    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ this.name ]: isWorklet ? 'Math.sign' : Math.sign })

      out = `${ref}sign( ${inputs[0]} )`

    } else {
      out = Math.sign( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let sign = Object.create( proto )

  sign.inputs = [ x ]

  return sign
}

},{"./gen.js":44}],79:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'sin',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'sin': isWorklet ? 'Math.sin' : Math.sin })

      out = `${ref}sin( ${inputs[0]} )` 

    } else {
      out = Math.sin( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let sin = Object.create( proto )

  sin.inputs = [ x ]
  sin.id = gen.getUID()
  sin.name = `${sin.basename}{sin.id}`

  return sin
}

},{"./gen.js":44}],80:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    history = require( './history.js' ),
    sub     = require( './sub.js' ),
    add     = require( './add.js' ),
    mul     = require( './mul.js' ),
    memo    = require( './memo.js' ),
    gt      = require( './gt.js' ),
    div     = require( './div.js' ),
    _switch = require( './switch.js' )

module.exports = ( in1, slideUp = 1, slideDown = 1 ) => {
  let y1 = history(0),
      filter, slideAmount

  //y (n) = y (n-1) + ((x (n) - y (n-1))/slide) 
  slideAmount = _switch( gt(in1,y1.out), slideUp, slideDown )

  filter = memo( add( y1.out, div( sub( in1, y1.out ), slideAmount ) ) )

  y1.in( filter )

  return filter
}

},{"./add.js":17,"./div.js":35,"./gen.js":44,"./gt.js":45,"./history.js":48,"./memo.js":56,"./mul.js":62,"./sub.js":81,"./switch.js":82}],81:[function(require,module,exports){
'use strict'

const gen = require('./gen.js')

const proto = {
  basename:'sub',
  gen() {
    let inputs = gen.getInputs( this ),
        out=0,
        diff = 0,
        needsParens = false, 
        numCount = 0,
        lastNumber = inputs[ 0 ],
        lastNumberIsUgen = isNaN( lastNumber ), 
        subAtEnd = false,
        hasUgens = false,
        returnValue = 0

    this.inputs.forEach( value => { if( isNaN( value ) ) hasUgens = true })

    out = '  var ' + this.name + ' = '

    inputs.forEach( (v,i) => {
      if( i === 0 ) return

      let isNumberUgen = isNaN( v ),
          isFinalIdx   = i === inputs.length - 1

      if( !lastNumberIsUgen && !isNumberUgen ) {
        lastNumber = lastNumber - v
        out += lastNumber
        return
      }else{
        needsParens = true
        out += `${lastNumber} - ${v}`
      }

      if( !isFinalIdx ) out += ' - ' 
    })

    out += '\n'

    returnValue = [ this.name, out ]

    gen.memo[ this.name ] = this.name

    return returnValue
  }

}

module.exports = ( ...args ) => {
  let sub = Object.create( proto )

  Object.assign( sub, {
    id:     gen.getUID(),
    inputs: args
  })
       
  sub.name = 'sub' + sub.id

  return sub
}

},{"./gen.js":44}],82:[function(require,module,exports){
'use strict'

let gen = require( './gen.js' )

let proto = {
  basename:'switch',

  gen() {
    let inputs = gen.getInputs( this ), out

    if( inputs[1] === inputs[2] ) return inputs[1] // if both potential outputs are the same just return one of them
    
    out = `  var ${this.name}_out = ${inputs[0]} === 1 ? ${inputs[1]} : ${inputs[2]}\n`

    gen.memo[ this.name ] = `${this.name}_out`

    return [ `${this.name}_out`, out ]
  },

}

module.exports = ( control, in1 = 1, in2 = 0 ) => {
  let ugen = Object.create( proto )
  Object.assign( ugen, {
    uid:     gen.getUID(),
    inputs:  [ control, in1, in2 ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./gen.js":44}],83:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'t60',

  gen() {
    let out,
        inputs = gen.getInputs( this ),
        returnValue

    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ [ 'exp' ]: isWorklet ? 'Math.exp' : Math.exp })

      out = `  var ${this.name} = ${ref}exp( -6.907755278921 / ${inputs[0]} )\n\n`
     
      gen.memo[ this.name ] = out
      
      returnValue = [ this.name, out ]
    } else {
      out = Math.exp( -6.907755278921 / inputs[0] )

      returnValue = out
    }    

    return returnValue
  }
}

module.exports = x => {
  let t60 = Object.create( proto )

  t60.inputs = [ x ]
  t60.name = proto.basename + gen.getUID()

  return t60
}

},{"./gen.js":44}],84:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'tan',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'tan': isWorklet ? 'Math.tan' : Math.tan })

      out = `${ref}tan( ${inputs[0]} )` 

    } else {
      out = Math.tan( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let tan = Object.create( proto )

  tan.inputs = [ x ]
  tan.id = gen.getUID()
  tan.name = `${tan.basename}{tan.id}`

  return tan
}

},{"./gen.js":44}],85:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'tanh',

  gen() {
    let out,
        inputs = gen.getInputs( this )
    
    
    const isWorklet = gen.mode === 'worklet'
    const ref = isWorklet? '' : 'gen.'

    if( isNaN( inputs[0] ) ) {
      gen.closures.add({ 'tanh': isWorklet ? 'Math.tan' : Math.tanh })

      out = `${ref}tanh( ${inputs[0]} )` 

    } else {
      out = Math.tanh( parseFloat( inputs[0] ) )
    }
    
    return out
  }
}

module.exports = x => {
  let tanh = Object.create( proto )

  tanh.inputs = [ x ]
  tanh.id = gen.getUID()
  tanh.name = `${tanh.basename}{tanh.id}`

  return tanh
}

},{"./gen.js":44}],86:[function(require,module,exports){
'use strict'

let gen     = require( './gen.js' ),
    lt      = require( './lt.js' ),
    accum   = require( './accum.js' ),
    div     = require( './div.js' )

module.exports = ( frequency=440, pulsewidth=.5 ) => {
  let graph = lt( accum( div( frequency, 44100 ) ), pulsewidth )

  graph.name = `train${gen.getUID()}`

  return graph
}


},{"./accum.js":14,"./div.js":35,"./gen.js":44,"./lt.js":52}],87:[function(require,module,exports){
'use strict'

const AWPF = require( './external/audioworklet-polyfill.js' ),
      gen  = require( './gen.js' ),
      data = require( './data.js' )

let isStereo = false

const utilities = {
  ctx: null,
  buffers: {},
  isStereo:false,

  clear() {
    if( this.workletNode !== undefined ) {
      this.workletNode.disconnect()
    }else{
      this.callback = () => 0
    }
    this.clear.callbacks.forEach( v => v() )
    this.clear.callbacks.length = 0

    this.isStereo = false

    if( gen.graph !== null ) gen.free( gen.graph )
  },

  createContext( bufferSize = 2048 ) {
    const AC = typeof AudioContext === 'undefined' ? webkitAudioContext : AudioContext
    
    // tell polyfill global object and buffersize
    AWPF( window, bufferSize )

    const start = () => {
      if( typeof AC !== 'undefined' ) {
        this.ctx = new AC({ latencyHint:.0125 })

        gen.samplerate = this.ctx.sampleRate

        if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
          window.removeEventListener( 'touchstart', start )
        }else{
          window.removeEventListener( 'mousedown', start )
          window.removeEventListener( 'keydown', start )
        }

        const mySource = utilities.ctx.createBufferSource()
        mySource.connect( utilities.ctx.destination )
        mySource.start()
      }
    }

    if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
      window.addEventListener( 'touchstart', start )
    }else{
      window.addEventListener( 'mousedown', start )
      window.addEventListener( 'keydown', start )
    }

    return this
  },

  createScriptProcessor() {
    this.node = this.ctx.createScriptProcessor( 1024, 0, 2 )
    this.clearFunction = function() { return 0 }
    if( typeof this.callback === 'undefined' ) this.callback = this.clearFunction

    this.node.onaudioprocess = function( audioProcessingEvent ) {
      var outputBuffer = audioProcessingEvent.outputBuffer;

      var left = outputBuffer.getChannelData( 0 ),
          right= outputBuffer.getChannelData( 1 ),
          isStereo = utilities.isStereo

     for( var sample = 0; sample < left.length; sample++ ) {
        var out = utilities.callback()

        if( isStereo === false ) {
          left[ sample ] = right[ sample ] = out 
        }else{
          left[ sample  ] = out[0]
          right[ sample ] = out[1]
        }
      }
    }

    this.node.connect( this.ctx.destination )

    return this
  },

  // remove starting stuff and add tabs
  prettyPrintCallback( cb ) {
    // get rid of "function gen" and start with parenthesis
    // const shortendCB = cb.toString().slice(9)
    const cbSplit = cb.toString().split('\n')
    const cbTrim = cbSplit.slice( 3, -2 )
    const cbTabbed = cbTrim.map( v => '      ' + v ) 
    
    return cbTabbed.join('\n')
  },

  createParameterDescriptors( cb ) {
    // [{name: 'amplitude', defaultValue: 0.25, minValue: 0, maxValue: 1}];
    let paramStr = ''

    //for( let ugen of cb.params.values() ) {
    //  paramStr += `{ name:'${ugen.name}', defaultValue:${ugen.value}, minValue:${ugen.min}, maxValue:${ugen.max} },\n      `
    //}
    for( let ugen of cb.params.values() ) {
      paramStr += `{ name:'${ugen.name}', automationRate:'k-rate', defaultValue:${ugen.defaultValue}, minValue:${ugen.min}, maxValue:${ugen.max} },\n      `
    }
    return paramStr
  },

  createParameterDereferences( cb ) {
    let str = cb.params.size > 0 ? '\n      ' : ''
    for( let ugen of cb.params.values() ) {
      str += `const ${ugen.name} = parameters.${ugen.name}[0]\n      `
    }

    return str
  },

  createParameterArguments( cb ) {
    let  paramList = ''
    for( let ugen of cb.params.values() ) {
      paramList += ugen.name + '[i],'
    }
    paramList = paramList.slice( 0, -1 )

    return paramList
  },

  createInputDereferences( cb ) {
    let str = cb.inputs.size > 0 ? '\n' : ''
    for( let input of  cb.inputs.values() ) {
      str += `const ${input.name} = inputs[ ${input.inputNumber} ][ ${input.channelNumber} ]\n      `
    }

    return str
  },


  createInputArguments( cb ) {
    let  paramList = ''
    for( let input of cb.inputs.values() ) {
      paramList += input.name + '[i],'
    }
    paramList = paramList.slice( 0, -1 )

    return paramList
  },
      
  createFunctionDereferences( cb ) {
    let memberString = cb.members.size > 0 ? '\n' : ''
    let memo = {}
    for( let dict of cb.members.values() ) {
      const name = Object.keys( dict )[0],
            value = dict[ name ]

      if( memo[ name ] !== undefined ) continue
      memo[ name ] = true

      memberString += `      const ${name} = ${value}\n`
    }

    return memberString
  },

  createWorkletProcessor( graph, name, debug, mem=44100*10 ) {
    //const mem = MemoryHelper.create( 4096, Float64Array )
    const cb = gen.createCallback( graph, mem, debug )
    const inputs = cb.inputs

    // get all inputs and create appropriate audioparam initializers
    const parameterDescriptors = this.createParameterDescriptors( cb )
    const parameterDereferences = this.createParameterDereferences( cb )
    const paramList = this.createParameterArguments( cb )
    const inputDereferences = this.createInputDereferences( cb )
    const inputList = this.createInputArguments( cb )   
    const memberString = this.createFunctionDereferences( cb )

    // change output based on number of channels.
    const genishOutputLine = cb.isStereo === false
      ? `left[ i ] = memory[0]`
      : `left[ i ] = memory[0];\n\t\tright[ i ] = memory[1]\n`

    const prettyCallback = this.prettyPrintCallback( cb )

    /***** begin callback code ****/
    // note that we have to check to see that memory has been passed
    // to the worker before running the callback function, otherwise
    // it can be passed too slowly and fail on occassion

    const workletCode = `
class ${name}Processor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    const params = [
      ${ parameterDescriptors }      
    ]
    return params
  }
 
  constructor( options ) {
    super( options )
    this.port.onmessage = this.handleMessage.bind( this )
    this.initialized = false
  }

  handleMessage( event ) {
    if( event.data.key === 'init' ) {
      this.memory = event.data.memory
      this.initialized = true
    }else if( event.data.key === 'set' ) {
      this.memory[ event.data.idx ] = event.data.value
    }else if( event.data.key === 'get' ) {
      this.port.postMessage({ key:'return', idx:event.data.idx, value:this.memory[event.data.idx] })     
    }
  }

  process( inputs, outputs, parameters ) {
    if( this.initialized === true ) {
      const output = outputs[0]
      const left   = output[ 0 ]
      const right  = output[ 1 ]
      const len    = left.length
      const memory = this.memory ${parameterDereferences}${inputDereferences}${memberString}

      for( let i = 0; i < len; ++i ) {
        ${prettyCallback}
        ${genishOutputLine}
      }
    }
    return true
  }
}
    
registerProcessor( '${name}', ${name}Processor)`

    
    /***** end callback code *****/


    if( debug === true ) console.log( workletCode )

    const url = window.URL.createObjectURL(
      new Blob(
        [ workletCode ], 
        { type: 'text/javascript' }
      )
    )

    return [ url, workletCode, inputs, cb.params, cb.isStereo ] 
  },

  registeredForNodeAssignment: [],
  register( ugen ) {
    if( this.registeredForNodeAssignment.indexOf( ugen ) === -1 ) {
      this.registeredForNodeAssignment.push( ugen )
    }
  },

  playWorklet( graph, name, debug=false, mem=44100 * 60 ) {
    utilities.clear()

    const [ url, codeString, inputs, params, isStereo ] = utilities.createWorkletProcessor( graph, name, debug, mem )

    const nodePromise = new Promise( (resolve,reject) => {
   
      utilities.ctx.audioWorklet.addModule( url ).then( ()=> {
        const workletNode = new AudioWorkletNode( utilities.ctx, name, { outputChannelCount:[ isStereo ? 2 : 1 ] })

        workletNode.callbacks = {}
        workletNode.onmessage = function( event ) {
          if( event.data.message === 'return' ) {
            workletNode.callbacks[ event.data.idx ]( event.data.value )
            delete workletNode.callbacks[ event.data.idx ]
          }
        }

        workletNode.getMemoryValue = function( idx, cb ) {
          this.workletCallbacks[ idx ] = cb
          this.workletNode.port.postMessage({ key:'get', idx: idx })
        }
        
        workletNode.port.postMessage({ key:'init', memory:gen.memory.heap })
        utilities.workletNode = workletNode

        utilities.registeredForNodeAssignment.forEach( ugen => ugen.node = workletNode )
        utilities.registeredForNodeAssignment.length = 0

        // assign all params as properties of node for easier reference 
        for( let dict of inputs.values() ) {
          const name = Object.keys( dict )[0]
          const param = workletNode.parameters.get( name )
      
          Object.defineProperty( workletNode, name, {
            set( v ) {
              param.value = v
            },
            get() {
              return param.value
            }
          })
        }

        for( let ugen of params.values() ) {
          const name = ugen.name
          const param = workletNode.parameters.get( name )
          ugen.waapi = param 
          // initialize?
          param.value = ugen.defaultValue

          Object.defineProperty( workletNode, name, {
            set( v ) {
              param.value = v
            },
            get() {
              return param.value
            }
          })
        }

        if( utilities.console ) utilities.console.setValue( codeString )

        workletNode.connect( utilities.ctx.destination )

        resolve( workletNode )
      })

    })

    return nodePromise
  },
  
  playGraph( graph, debug, mem=44100*10, memType=Float32Array ) {
    utilities.clear()
    if( debug === undefined ) debug = false
          
    this.isStereo = Array.isArray( graph )

    utilities.callback = gen.createCallback( graph, mem, debug, false, memType )
    
    if( utilities.console ) utilities.console.setValue( utilities.callback.toString() )

    return utilities.callback
  },

  loadSample( soundFilePath, data ) {
    const isLoaded = utilities.buffers[ soundFilePath ] !== undefined

    let req = new XMLHttpRequest()
    req.open( 'GET', soundFilePath, true )
    req.responseType = 'arraybuffer' 
    
    let promise = new Promise( (resolve,reject) => {
      if( !isLoaded ) {
        req.onload = function() {
          var audioData = req.response

          utilities.ctx.decodeAudioData( audioData, (buffer) => {
            data.buffer = buffer.getChannelData(0)
            utilities.buffers[ soundFilePath ] = data.buffer
            resolve( data.buffer )
          })
        }
      }else{
        setTimeout( ()=> resolve( utilities.buffers[ soundFilePath ] ), 0 )
      }
    })

    if( !isLoaded ) req.send()

    return promise
  }

}

utilities.clear.callbacks = []

module.exports = utilities

},{"./data.js":30,"./external/audioworklet-polyfill.js":39,"./gen.js":44}],88:[function(require,module,exports){
'use strict'

/*
 * many windows here adapted from https://github.com/corbanbrook/dsp.js/blob/master/dsp.js
 * starting at line 1427
 * taken 8/15/16
*/ 

const windows = module.exports = { 
  bartlett( length, index ) {
    return 2 / (length - 1) * ((length - 1) / 2 - Math.abs(index - (length - 1) / 2)) 
  },

  bartlettHann( length, index ) {
    return 0.62 - 0.48 * Math.abs(index / (length - 1) - 0.5) - 0.38 * Math.cos( 2 * Math.PI * index / (length - 1))
  },

  blackman( length, index, alpha ) {
    let a0 = (1 - alpha) / 2,
        a1 = 0.5,
        a2 = alpha / 2

    return a0 - a1 * Math.cos(2 * Math.PI * index / (length - 1)) + a2 * Math.cos(4 * Math.PI * index / (length - 1))
  },

  cosine( length, index ) {
    return Math.cos(Math.PI * index / (length - 1) - Math.PI / 2)
  },

  gauss( length, index, alpha ) {
    return Math.pow(Math.E, -0.5 * Math.pow((index - (length - 1) / 2) / (alpha * (length - 1) / 2), 2))
  },

  hamming( length, index ) {
    return 0.54 - 0.46 * Math.cos( Math.PI * 2 * index / (length - 1))
  },

  hann( length, index ) {
    return 0.5 * (1 - Math.cos( Math.PI * 2 * index / (length - 1)) )
  },

  lanczos( length, index ) {
    let x = 2 * index / (length - 1) - 1;
    return Math.sin(Math.PI * x) / (Math.PI * x)
  },

  rectangular( length, index ) {
    return 1
  },

  triangular( length, index ) {
    return 2 / length * (length / 2 - Math.abs(index - (length - 1) / 2))
  },

  // parabola
  welch( length, _index, ignore, shift=0 ) {
    //w[n] = 1 - Math.pow( ( n - ( (N-1) / 2 ) ) / (( N-1 ) / 2 ), 2 )
    const index = shift === 0 ? _index : (_index + Math.floor( shift * length )) % length
    const n_1_over2 = (length - 1) / 2 

    return 1 - Math.pow( ( index - n_1_over2 ) / n_1_over2, 2 )
  },
  inversewelch( length, _index, ignore, shift=0 ) {
    //w[n] = 1 - Math.pow( ( n - ( (N-1) / 2 ) ) / (( N-1 ) / 2 ), 2 )
    let index = shift === 0 ? _index : (_index + Math.floor( shift * length )) % length
    const n_1_over2 = (length - 1) / 2

    return Math.pow( ( index - n_1_over2 ) / n_1_over2, 2 )
  },

  parabola( length, index ) {
    if( index <= length / 2 ) {
      return windows.inversewelch( length / 2, index ) - 1
    }else{
      return 1 - windows.inversewelch( length / 2, index - length / 2 )
    }
  },

  exponential( length, index, alpha ) {
    return Math.pow( index / length, alpha )
  },

  linear( length, index ) {
    return index / length
  }
}

},{}],89:[function(require,module,exports){
'use strict'

let gen  = require('./gen.js'),
    floor= require('./floor.js'),
    sub  = require('./sub.js'),
    memo = require('./memo.js')

let proto = {
  basename:'wrap',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        signal = inputs[0], min = inputs[1], max = inputs[2],
        out, diff

    //out = `(((${inputs[0]} - ${this.min}) % ${diff}  + ${diff}) % ${diff} + ${this.min})`
    //const long numWraps = long((v-lo)/range) - (v < lo);
    //return v - range * double(numWraps);   
    
    if( this.min === 0 ) {
      diff = max
    }else if ( isNaN( max ) || isNaN( min ) ) {
      diff = `${max} - ${min}`
    }else{
      diff = max - min
    }

    out =
` var ${this.name} = ${inputs[0]}
  if( ${this.name} < ${this.min} ) ${this.name} += ${diff}
  else if( ${this.name} > ${this.max} ) ${this.name} -= ${diff}

`

    return [ this.name, ' ' + out ]
  },
}

module.exports = ( in1, min=0, max=1 ) => {
  let ugen = Object.create( proto )

  Object.assign( ugen, { 
    min, 
    max,
    uid:    gen.getUID(),
    inputs: [ in1, min, max ],
  })
  
  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}

},{"./floor.js":41,"./gen.js":44,"./memo.js":56,"./sub.js":81}],90:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":12,"has":216,"has-symbols":213}],91:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Analysis = {
  create( Audio ) {
    const analysis = {}

    for( let analysisName in Gibberish.analysis ) {
      const gibberishConstructor = Gibberish.analysis[ analysisName ]

      const methods = Analysis.descriptions[ analysisName ] === undefined ? null : Analysis.descriptions[ analysisName ].methods
      const description = { 
        properties: { type:'analysis' },
        name:analysisName,
        methods,
        category:'analysis'
      }

      const constructor = Ugen( gibberishConstructor, description, Audio, false, true )
      analysis[ analysisName ] = function( ...args ) {
        const ugen = constructor( ...args )
        Gibberish.worklet.ugens.set( ugen.id, ugen )
        ugen.out = ugen.__wrapped__.out
        
        if( analysisName === 'Follow' ) {
          let m = ugen.__wrapped__.multiplier || 1
          Object.defineProperty( ugen, 'multiplier', {
            configurable:true,
            get() { return m },
            set(v) { m = v; ugen.__wrapped__.multiplier = m }
          }) 
          let o = ugen.__wrapped__.offset || 0
          Object.defineProperty( ugen, 'offset', {
            configurable:true,
            get() { return o },
            set(v) { o = v; ugen.__wrapped__.offset = o }
          }) 
        }
        return ugen
      } 

    }
    return analysis
  },

  descriptions: {
    //SSD: { methods:[ 'listen' ] }
    //Chorus:{ methods:[] },
  },
  
}

module.exports = Analysis 

},{"./ugen.js":128,"gibberish-dsp":174}],92:[function(require,module,exports){
const Gibberish   = require( 'gibberish-dsp' )
const Ugen        = require( './ugen.js' )
const Instruments = require( './instruments.js' )
const Oscillators = require( './oscillators.js' )
const Effects     = require( './effects.js' )
const Filters     = require( './filters.js' )
const Binops      = require( './binops.js' )
const Analysis    = require( './analysis.js' )
const Envelopes   = require( './envelopes.js' )
const Busses      = require( './busses.js' )
const Ensemble    = require( './ensemble.js' )
const Utility     = require( './utility.js' )
const Freesound   = require( './freesound.js' )
const Gen         = require( './gen.js' )
const WavePattern = require( './wavePattern.js' )
const WaveObjects = require( './waveObjects.js' )
//const Core        = require( 'gibber.core.lib' )
const AWPF        = require( './external/audioworklet-polyfill.js' )
//const Arp         = require( './arp.js' )

const Audio = {
  Clock: require( './clock.js' ),
  Theory: require( './theory.js' ),
  Presets: require( './presets.js' ),
  __Make: require( './make.js' ),
  initialized:false,
  autoConnect:true,
  shouldDelay:false,
  instruments:{},
  oscillators:{},
  effects:{},
  exportTarget:null,

  export( obj ) {
    if( Audio.initialized ){ 
      Object.assign( 
        obj, 
        this.instruments, 
        this.oscillators,
        this.effects,
        this.filters,
        this.busses, 
        this.envelopes, 
        this.waveObjects, 
        this.binops, 
        this.analysis 
      )
      
      Utility.export( obj )
      this.Gen.export( obj )

      obj.Gibberish = this.Gibberish

      obj.gen = this.Gen.make
      obj.lfo = this.Gen.composites.lfo
      obj.Ensemble = this.Ensemble
      obj.Drums = this.Drums
      obj.EDrums = this.EDrums
      obj.Theory = this.Theory
      obj.Freesound = this.Freesound
      obj.Clock = this.Clock
      obj.Clock.export( obj )
      obj.WavePattern = this.WavePattern
      obj.Gen = this.Gen
      obj.stop = this.stop

      obj.Out = this.Out
      obj.Make = this.Make
      obj.future = this.Gibberish.utilities.future
    }else{
      Audio.exportTarget = obj
    } 
  },

  __defaults : {
    workletPath: '../dist/gibberish_worklet.js',
    ctx:         null,
    bufferSize:  2048,
    latencyHint: .05
  },

  init( options, Gibber  ) {
    let { workletPath, ctx, bufferSize, latencyHint } = Object.assign( {}, this.__defaults, options ) 
    this.Gibber = Gibber
    this.Core = Gibber

    // XXX should probably just call Audio.Core.createProperty to avoid confusion...
    this.createProperty = Gibber.createProperty

    Gibber.Audio = this
    this.Gibberish = Gibberish

    Gibberish.workletPath = workletPath 

    this.createPubSub()

    const AC = typeof AudioContext === 'undefined' ? webkitAudioContext : AudioContext
    window.AudioContext = AC
    AWPF( window, bufferSize ) 

    const p = new Promise( (resolve, reject) => {
      if( ctx === null ) {
        ctx = new AC({ latencyHint })
        //ctx = new AudioContext()
      }

      Gibberish.init( 44100*60*20, ctx ).then( processorNode => {
        // XXX remove once gibber.core.lib has been properly integrated 
        Audio.Core.Audio = Audio.Core.audio = Audio

        Audio.Gibberish = Gibberish

        Audio.initialized = true
        Audio.node = processorNode
        Audio.Ugen = Ugen
        Audio.Make = Audio.__Make( Audio )
        Audio.Gen = Gen( Audio )
        Audio.Gen.init()
        Audio.Gen.export( Audio.Gen.ugens )
        Audio.Theory.init( window.Gibber )
        Audio.Utilities = Utility
        Audio.WavePattern = WavePattern( Audio )
        Audio.ctx = ctx
        Audio.Out = Gibberish.output
        
        // must wait for Gen to be initialized
        Audio.Clock.init( Audio.Gen, Audio )

        Audio.createUgens()
        
        if( Audio.exportTarget !== null ) Audio.export( Audio.exportTarget )

        Gibberish.worklet.port.__postMessage = Gibberish.worklet.port.postMessage

        Gibberish.worklet.port.postMessage = function( dict ) {
          if( Audio.shouldDelay === true ) dict.delay = true

          Gibberish.worklet.port.__postMessage( dict )
        }

        Audio.export( window )

        //const drums = Audio.Drums('x*o-')
        //drums.disconnect()
        //drums.stop()

        // store last location in memory... we can clear everything else in Gibber.clear9)
        const memIdx = Object.keys( Gibberish.memory.list ).reverse()[0]
        this.__memoryEnd = parseInt( memIdx ) + Gibberish.memory.list[ memIdx ]

        // XXX this forces the gibberish scheduler to start
        // running, but it's about as hacky as it can get...
        //const __start = Audio.instruments.Synth().connect()
        //__start.disconnect()

        //Audio.Gibberish.genishi.gen.histories.clear()
        Audio.clear()

        resolve( [Audio,'Audio'] )
      })
    })
    
    return p
  },

  restart() {
    Gibber.clear()
    Gibberish.worklet.port.close()
    window.w = Gibberish.worklet
    Gibberish.worklet.disconnect()

    Gibberish.init( 44100*60*20, undefined, 'worklet', true ).then( processorNode => {
      Audio.out = Gibberish.output
      Audio.node = processorNode

      Audio.Theory.deleteProperties()
      Audio.Theory.init( window.Gibber )

      Audio.initialized = true
      Audio.node = processorNode
      Audio.Out = Gibberish.output

      Audio.Make = Audio.__Make( Audio )
      Audio.Gen = Gen( Audio )
      Audio.Gen.init()
      Audio.Gen.export( Audio.Gen.ugens )

      Audio.WavePattern = WavePattern( Audio )
      Audio.createUgens()
        
      Audio.Clock.init( Audio.Gen, Audio )

      Gibberish.worklet.port.__postMessage = Gibberish.worklet.port.postMessage
      Gibberish.worklet.port.postMessage = function( dict ) {
        if( Audio.shouldDelay === true ) dict.delay = true

        Gibberish.worklet.port.__postMessage( dict )
      }

      Audio.export( window )
      Gibber.export( window )

      const memIdx = Object.keys( Gibberish.memory.list ).reverse()[0]
      this.__memoryEnd = parseInt( memIdx ) + Gibberish.memory.list[ memIdx ]

      // XXX this forces the gibberish scheduler to start
      // running, but it's about as hacky as it can get...
      const __start = Audio.instruments.Synth().connect()
      __start.disconnect()

      //Audio.Gibberish.genishi.gen.histories.clear()

      //Audio.clear()
      console.log( 'audio engine successfully restarted.' )
      Audio.publish( 'restart' )
    })
  },

  // XXX stop clock from being cleared.
  clear() { 
    Gibberish.clear() 
    Audio.Clock.init( Audio.Gen, Audio )

    // the idea is that we only clear memory that was filled after
    // the initial Gibber initialization... this stops objects
    // like Clock and Theory from having their memory cleared and
    // from having to re-initialize them.

    // fill memory with zeros from the end initialization block onwards
    Gibberish.memory.heap.fill( 0, this.__memoryEnd )

    // get locations of all memory blocks
    const memKeys = Object.keys( Gibberish.memory.list )

    // get idx of final initialization block
    const endIdx =  memKeys.indexOf( ''+this.__memoryEnd )

    // loop through all blocks after final initialzation block
    // and delete them in the memory list... they've already
    // been zeroed out.
    for( let i = endIdx; i < memKeys.length; i++ ) {
      delete Gibberish.memory.list[ memKeys[ i ] ]
    }
    
    Audio.publish('clear')
  },

  stop() {
    Gibber.Seq.sequencers.forEach( s => s.stop() )
  },

  start() {
    Gibber.Seq.sequencers.forEach( s => s.start() )
  },
  onload() {},

  createUgens() {
    //Core.export( this, this )

    this.Freesound = Freesound( this )
    this.binops = Binops.create( this )
    this.analysis = Analysis.create( this )
    this.oscillators = Oscillators.create( this )
    this.instruments = Instruments.create( this ) 
    this.envelopes   = Envelopes.create( this )
    this.filters     = Filters.create( this )
    this.effects = Effects.create( this )
    this.busses = Busses.create( this )
    this.Ensemble = Ensemble( this )
    this.waveObjects = WaveObjects( this )

    const Pattern = this.Core.__Pattern
    Pattern.transfer( this, Pattern.toString() )

    
    const drums = require( './drums.js' )( this )
    Object.assign( this, drums )
  },

  printcb() { 
    Gibber.Audio.Gibberish.worklet.port.postMessage({ address:'callback' }) 
  },
  printobj( obj ) {
    Gibber.Audio.Gibberish.worklet.port.postMessage({ address:'print', object:obj.id }) 
  },
  send( msg ){
    Gibber.Audio.Gibberish.worklet.port.postMessage( msg )
  },

  createPubSub() {
    const events = this.pubevents = {}
    this.subscribe = function( key, fcn ) {
      if( typeof events[ key ] === 'undefined' ) {
        events[ key ] = []
      }
      events[ key ].push( fcn )
    }

    this.unsubscribe = function( key, fcn ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.splice( arr.indexOf( fcn ), 1 )
      }
    }

    this.publish = function( key, data ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.forEach( v => v( data ) )
      }
    }
  },

  createMapping( from, to, name, wrappedTo ) {
    if( from.__useMapping === false ) {
      to[ name ].value = from
    }else if( from.type === 'audio' ) {
      const f = to[ '__' + name ].follow = Follow({ input: from })

      let m = f.multiplier
      Object.defineProperty( to[ name ], 'multiplier', {
        get() { return m },
        set(v) { m = v; f.multiplier = m }
      })

      let o = f.offset
      Object.defineProperty( to[ name ], 'offset', {
        get() { return o },
        set(v) { o = v; f.offset = o }
      })

      wrappedTo[ name ] = f
      //to[ '__'+name].value = f

    }else if( from.type === 'gen' ) {
      // gen objects can be referred to without the graphics/audio abstraction,
      // in which case they will have no .render() function, and don't need to be rendered
      const gen = from.render !== undefined ? from.render() : from

      wrappedTo[ name ] = gen
    }
  },

  createGetter( obj, name ) { return () => obj[ '__' + name ] },

  createSetter( obj, name, post, transform=null, isPoly=false ) {
    if( typeof obj.__wrapped__ === 'object' ) {
      let desc = Object.getOwnPropertyDescriptor( obj.__wrapped__, name )

      if( desc !== undefined ) {
        Object.defineProperty( obj.__wrapped__, name,  {
          configurable:true,
          set(v) {
            obj[ '__'+name ].value = v
            if( desc.set ) {
              desc.set( v )
            }else{
              obj.__wrapped__.value = v
            }
          }
        })
      }
    }
    const setter = v => {
      let value, shouldSend = true


      if( typeof v === 'number' || typeof v === 'string' || v === null ) {
        value = transform !== null ? transform( v ) : v

        if( isPoly === true ) {
          const __wrappedObject = obj.__wrapped__
          const voice = __wrappedObject.voices[ __wrappedObject.voiceCount % __wrappedObject.voices.length ]
          voice[ name ] = value

          shouldSend = false

          Gibberish.worklet.port.postMessage({
            address:'property',
            object:voice.id,
            name,
            value
          }) 

        }else{
          obj[ '__'+name].value = v
        }
      }else if( typeof v === 'object' && v !== null && v.type === 'gen' ) {
        // gen objects can be referred to without the graphics/audio abstraction,
        // in which case they will have no .render() function, and don't need to be rendered

        v = transform !== null ? transform( v ) : v       
        const gen = v.render !== undefined ? v.render() : v 

        obj['__'+ name ].value = gen 
        value = { id: gen.id }
      }else if( typeof v === 'object' ) { //&& typeof v !== null ) {
        //if( obj.__useMapping === false || name === 'input' ) {
        //  obj[ '__'+name].value = v
        //  value = v !== null ? { id:v.id } : v
        //}else{
        //  //Audio.createMapping( v, obj, name, obj.__wrapped__ )
        //  const f = obj[ '__' + name ].follow = Follow({ input: v })

        //  let m = f.multiplier
        //  Object.defineProperty( obj[ name ], 'multiplier', {
        //    get() { return m },
        //    set(v) { m = v; f.multiplier = m }
        //  })

        //  let o = f.offset
        //  Object.defineProperty( obj[ name ], 'offset', {
        //    get() { return o },
        //    set(v) { o = v; f.offset = o }
        //  })

          //wrappedTo[ name ] = f
          //obj[ '__'+name ].value = f.__wrapped__
          //value = { id:f.id }
          obj[ '__'+name ].value = v.__wrapped__
          value = { id:v.id }
        //}
               //
        //obj[ '__'+name].value = v
        //value = v !== null ? { id:v.id } : v
      }

      if( Gibberish.mode === 'worklet' && shouldSend === true ) {
        Gibberish.worklet.port.postMessage({
          address:'property',
          object:obj.id,
          name,
          value
        }) 
      }
      if( post !== null ) {
        post.call( obj )
      }     
      if( Gibberish.mode === 'worklet' ) Audio.publish( `property.set:${obj.id}`, obj, v )
    }

    return setter
  },

  createFade( from=null, to=null, time=1, obj, name, delay=0 ) {
    if( from === null ) from = obj[ name ].value
    if( to === null ) to = obj[ name ].value

    time = Audio.Clock.time( time )

    // XXX only covers condition where ramps from fades are assigned...
    // does this need to be more generic?
    if( isNaN( from ) && from.__wrapped__.ugenName.indexOf('ramp') > -1 ) {
      from = from.to.value
    }
    if( isNaN( to ) && to.__wrapped__.ugenName.indexOf('ramp') > -1 ) {
      to = to.to.value
    }

    let ramp = Audio.envelopes.Ramp({ from, to, length:time, shouldLoop:false })
    // this is a key to not use an envelope follower for mapping
    ramp.__useMapping = false

    if( delay === 0 ) {
      obj[ name ] = ramp
    } else {
      future( (obj,name,ramp) => { 
        obj[ name ] = ramp 
      }, delay, { obj, name, ramp:ramp.__wrapped__ } )
    }

    if( ramp.__wrapped__ === undefined ) ramp.__wrapped__ = {}
    ramp.__wrapped__.values = []

    ramp.__wrapped__.output = v => {
      if( ramp.__wrapped__ !== undefined ) {
        ramp.__wrapped__.values.unshift( v )
        while( ramp.__wrapped__.values.length > 60 ) ramp.__wrapped__.values.pop()
      }
    }

    ramp.__wrapped__.finalize = () => {
      const store = ramp.__wrapped__

      // XXX I can't quite figure out why I have to wait to reset the property 
      // value here... if I don't, then the fade ugen stays assigned in the worklet processor.
      // and 0 doesn't work!
      setTimeout( ()=> obj[ name ] = store.to === 0 ? .000001 : store.to, 0 )
      store.widget.clear()
    }

    ramp.__wrapped__.from = from
    ramp.__wrapped__.to = to

    return obj
  },

  // what properties should be automatically (automagickally?)
  // filtered through Audio.Clock.time()?
  timeProps : {
    Synth:[ 'attack', 'decay', 'sustain', 'release' ],
    PolySynth:[ 'attack', 'decay', 'sustain', 'release' ],
    Complex:[ 'attack', 'decay', 'sustain', 'release' ],
    PolyComplex:[ 'attack', 'decay', 'sustain', 'release' ],
    FM:[ 'attack', 'decay', 'sustain', 'release' ],
    PolyFM:[ 'attack', 'decay', 'sustain', 'release' ],
    Monosynth:[ 'attack', 'decay', 'sustain', 'release' ],
    PolyMono:[ 'attack', 'decay', 'sustain', 'release' ],
    Delay:[ 'time' ], 
  }
}

module.exports = Audio

},{"./analysis.js":91,"./binops.js":93,"./busses.js":94,"./clock.js":95,"./drums.js":96,"./effects.js":97,"./ensemble.js":98,"./envelopes.js":99,"./external/audioworklet-polyfill.js":100,"./filters.js":103,"./freesound.js":104,"./gen.js":105,"./instruments.js":106,"./make.js":107,"./oscillators.js":108,"./presets.js":109,"./theory.js":127,"./ugen.js":128,"./utility.js":129,"./waveObjects.js":130,"./wavePattern.js":131,"gibberish-dsp":174}],93:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Binops = {
  create( Audio ) {
    const binops = {}

    for( let binopName in Gibberish.binops ) {
      const gibberishConstructor = Gibberish.binops[ binopName ]

      const methods = Binops.descriptions[ binopName ] === undefined ? null : Binops.descriptions[ binopName ].methods
      const description = { 
        properties:gibberishConstructor.defaults,
        methods:methods,
        name:binopName,
        category:'binops'
      }
      description.properties.type = 'binop'

      const constructor = Ugen( gibberishConstructor, description, Audio, false, true )
      binops[ binopName ] = function( ...args ) {
        const ugen = constructor( ...args )
        ugen[0] = ugen.__wrapped__[0]
        ugen[1] = ugen.__wrapped__[1]

        return ugen
      } 
    }
    return binops
  },

  descriptions: {
    //Chorus:{ methods:[] },
  },
  
}

module.exports = Binops

},{"./ugen.js":128,"gibberish-dsp":174}],94:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Busses = {
  create( Audio ) {
    const busses = {}

    const busDescription = { 
      properties:Gibberish.Bus.defaults,
      methods:null,
      name:'Bus',
      category:'misc'
    }

    busses.Bus = Ugen( Gibberish.Bus, busDescription, Audio )
    busses.__Bus = function( ...args ) {
      let props
      if( args.length > 1 || args.length === 1 && typeof args[0] !== 'string' ) {
        props = { inputs:args }
      }else if( args.length === 1 ) {
        props = args[0]
      }
      
      return props !== undefined ? busses.__Bus( props ) : busses.__Bus()
    }

    const bus2Description = { 
      properties:Gibberish.Bus2.defaults,
      methods:null,
      name:'Bus2',
      category:'misc'
    }

    busses.Bus2 = Ugen( Gibberish.Bus2, bus2Description, Audio )
    busses.__Bus2 = function( ...args ) {
      let props
      if( args.length > 1 || (args.length === 1 && typeof args[0] !== 'string' && args[0].type !== 'ensemble' )) {
        props = { inputs:args }
      }else if( args.length === 1 ) {
        props = args[0]
      }
      
      return props !== undefined ? busses.__Bus2( props ) : busses.__Bus2()
    }

    return busses
  }
}

module.exports = Busses

},{"./ugen.js":128,"gibberish-dsp":174}],95:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const serialize = require( 'serialize-javascript' )

// XXX must use form key:function() {} due to serialization
const Clock = {
  __beatCount:0,
  id:null,
  nogibberish:true,
  bpm:140,
  __lastBPM:140,
  seq:null,

  export:function( obj ) {
    obj.btos = Clock.btos.bind( Clock )
    obj.btoms = Clock.btoms.bind( Clock )
    obj.stob = Clock.stob.bind( Clock )
  },

  store:function() { 
    Gibberish.Clock = this
    this.beatCount = 0
    this.queue = []
    this.init()
  },

  addToQueue:function( ...args ) {
    if( Gibberish.mode === 'processor' ) {
      args = args[0]
      args.forEach( v => Gibberish.Clock.queue.push( v ) )
    }else{
      Gibberish.worklet.port.postMessage({
        address: 'method',
        object: this.id,
        name: 'addToQueue',
        args: serialize( args ),
        functions: true
      }) 
    }
  },

  init:function( Gen, Audio ) {
    // needed so that when the clock is re-initialized (for example, after clearing)
    // gibber won't try and serialized its sequencer
    this.seq = null

    const clockFunc = ()=> {
      Gibberish.worklet.port.postMessage({
        address: 'beat',
        value: this.beatCount
      }) 

      if( this.beatCount++ % 4 === 0 ) {
        Gibberish.processor.playQueue()//.forEach( f => { f() } )
      }
    }

    if( Gibberish.mode === 'worklet' ) {
      this.id = Gibberish.utilities.getUID()
      this.audioClock = null
      this.__rate = null

      Gibberish.worklet.port.postMessage({
        address:'add',
        properties:serialize( Clock ),
        id:this.id,
        post: 'store'    
      })
      
      let bpm = this.__lastBPM
      Object.defineProperty( this, 'bpm', {
        get() { return bpm },
        set(v){ 
          bpm = v
          if( Gibberish.mode === 'worklet' ) {
            this.__lastBPM = v
            if( Audio.Gibber.Tidal !== undefined ) Audio.Gibber.Tidal.cps = bpm/120/2
            Gibberish.worklet.port.postMessage({
              address:'set',
              object:this.id,
              name:'bpm',
              value:bpm 
            }) 
          }
        }
      })

      this.audioClock = Gen.make( Gen.ugens.abs(1) )
      //this.__rate = this.audioClock.__p0 

      Object.defineProperty( this, 'rate', {
        configurable:true,
        get() { return this.audioClock },
        set(v){
          this.audioClock.p0 = v
        }
      })

      //Gibberish.worklet.port.postMessage({
      //  address:'set',
      //  value: Gen.make( Gen.ugens.abs(1) ),
      //  object:this.id,
      //  name:'audioClock'
      //})

      this.bpm = this.__lastBPM
    }

    if( Gibberish.mode === 'processor' )
      this.seq = Gibberish.Sequencer.make( [ clockFunc ], [ ()=>Gibberish.Clock.time( 1/4 ) ] ).start()

  },

  connect: function() {
    if( this.audioClock !== undefined ) {
      Gibberish.analyzers.push( this.audioClock )
      Gibberish.dirty( Gibberish.analyzers )
      console.log( 'clock connected' )
    }
  },

  // time accepts an input value and converts it into samples. the input value
  // may be measured in milliseconds, beats or samples.
  time: function( inputTime = 0 ) {
    let outputTime = inputTime

    // if input is an annotated time value such as what is returned
    // by samples() or ms()...
    // console.log( 'input time:' , inputTime )
    if( isNaN( inputTime ) ) {
      if( typeof inputTime === 'object' ) { 
        if( inputTime.type === 'samples' ) {
          outputTime = inputTime.value
        }else if( inputTime.type === 'ms' ) {
          outputTime = this.mstos( inputTime.value ) 
        }
      } 
    }else{
      // XXX 4 is a magic number, needs to account for the current time signature
      outputTime = this.btos( inputTime * 4 )
    }
    
    return outputTime
  },

  // does not work... says Gibberish can't be found? I guess Gibberish isn't in the
  // global scope of the worklet?
  Time: function( inputTime ) {
    return new Function( `return Gibberish.Clock.time( ${inputTime} )` )
  },

  mstos: function( ms ) {
    return ( ms / 1000 ) * Gibberish.ctx.sampleRate
  },

  // convert beats to samples
  btos: function( beats ) {
    const samplesPerBeat = Gibberish.ctx.sampleRate / (this.bpm / 60 )
    return samplesPerBeat * beats 
  },

  // convert samples to beats (for pattern visualizations)
  stob: function( samples ) {
    const samplesPerBeat = Gibberish.ctx.sampleRate / (this.bpm / 60 )
    return (samples / samplesPerBeat) * .25 // XXX magic number should be denominator of time signature 
  },
  // convert beats to milliseconds
  btoms: function( beats ) {
    const samplesPerMs = Gibberish.ctx.sampleRate / 1000
    return beats * samplesPerMs
  },

  ms: function( value ) {
    return { type:'ms', value }
  },

  samples: function( value ) {
    return { type:'samples', value }
  }
}

module.exports = Clock

},{"gibberish-dsp":174,"serialize-javascript":231}],96:[function(require,module,exports){
const Ugen = require( './ugen.js' )
const Presets = require( './presets.js' )

let Audio = null

const addMethod = ( obj, name, __value = 1, propOverrideName ) => {
  if( propOverrideName === undefined ) propOverrideName = name

  obj[ '__' + name ] = { 
    value: __value,
    isProperty:true,
    sequencers:[],
    mods:[],
    name,

    seq( values, timings, number = 0, delay = 0 ) {
      let prevSeq = obj['__'+name].sequencers[ number ] 
      if( prevSeq !== undefined ) { 
        prevSeq.stop(); prevSeq.clear(); 
        let idx = obj.__sequencers.indexOf( prevSeq )
        obj.__sequencers.splice( idx, 1 )
      }

      // XXX you have to add a method that does all this shit on the worklet. crap.
      obj['__'+name].sequencers[ number ] = obj['__'+name][ number ] = Audio.Core.Seq({ 
        values, 
        timings, 
        target:obj.__wrapped__, 
        key:name,
        rate:Audio.Clock.audioClock
      })
      .start( Audio.Clock.time( delay ) )

      obj.__sequencers.push( obj['__'+name][ number ] )

      // return object for method chaining
      return obj
    },
  }

  Audio.Gibberish.worklet.port.postMessage({
    address:'addMethod',
    key:name,
    function:`function( ${name} ) {
        for( let input of this.inputs ) {
          if( typeof input === 'object' ) input[ '${propOverrideName}' ] = ${name}
        }
      }`,
    id:obj.id,
    delay:Audio.shouldDelay
  })

  Object.defineProperty( obj, name, {
    configurable:true,
    get() { return this[ '__' + name ] },
    set(v){ 
      this[ '__' + name ].value = v
      for( let sampler of this.samplers ) sampler[ propOverrideName ] = this[ '__' + name ].value 
    }
  })
}

module.exports = function( __Audio ) {
  Audio = __Audio

  const Drums = function( score, time, ...args ) { 
    // XXX what url prefix should I be using?

    const temp = Audio.autoConnect
    Audio.autoConnect = false
    const k  = Audio.instruments.Sampler({ filename:'./resources/audiofiles/kick.wav' })
    const s  = Audio.instruments.Sampler({ filename:'./resources/audiofiles/snare.wav' })
    const ch = Audio.instruments.Sampler({ filename:'./resources/audiofiles/hat.wav' })
    const oh = Audio.instruments.Sampler({ filename:'./resources/audiofiles/openhat.wav' })
    Audio.autoConnect = temp

    const drums = Audio.Ensemble({
      'kd': { target:k,  method:'trigger', args:[1], name:'kick' },
      [0]: { target:k,  method:'trigger', args:[1], name:'kick' },
      'sd': { target:s,  method:'trigger', args:[1], name:'snare' },
      'sn': { target:s,  method:'trigger', args:[1], name:'snare' },
      [1]: { target:s,  method:'trigger', args:[1], name:'snare' },
      'ch': { target:ch, method:'trigger', args:[1], name:'closedHat' },
      [2]: { target:ch, method:'trigger', args:[1], name:'closedHat' },
      'oh': { target:oh, method:'trigger', args:[1], name:'openHat' },
      [3]: { target:oh, method:'trigger', args:[1], name:'openHat' },
    })

    if( Audio.autoConnect === true ) drums.connect()

    drums.__sequencers = [ ]
    //if( typeof score === 'string' ) {
    //  drums.seq = Audio.Seq({
    //    target:drums,
    //    key:'play',
    //    values:score.split(''),
    //    timings:time === undefined ? 1 / score.length : time
    //  }).start()
    

    //  drums.values = drums.seq.values
    //  drums.timings = drums.seq.timings

    //  drums.__sequencers.push( drums.seq )
    //}else{
    //  Gibber.addSequencing( drums, 'play', 0 )
    //}

    drums.samplers = [ k,s,ch,oh ]

    addMethod( drums, 'pitch', 1, 'rate' )
    addMethod( drums, 'start', 0 )
    addMethod( drums, 'end', 1 )

    props = Presets.process( { name:'Drums', category:'instruments' }, args, Audio )
    if( props !== undefined && props.__presetInit__ !== undefined ) {
      Object.assign( drums, props )
      if( props.__presetInit__ !== undefined ) props.__presetInit__.call( drums, Audio )
    }

    drums.name = 'Drums'
    return drums
  }

  const EDrums = function(  ...args ) {
    const temp = Audio.autoConnect
    Audio.autoConnect = false
    
    const kd = Audio.instruments.Kick()
    const sd = Audio.instruments.Snare()
    const ch = Audio.instruments.Hat({ decay:.1, gain:.3 })
    const oh = Audio.instruments.Hat({ decay:.5, gain:.3 })
    const cp = Audio.instruments.Clap()
    const cb = Audio.instruments.Cowbell({ gain:.65 })
    
    Audio.autoConnect = temp
    
    const drums = Audio.Ensemble({
      'kd': { target:kd, method:'trigger', args:[1], name:'kick' },
      [0]: { target:kd, method:'trigger', args:[1], name:'kick' },
      [1]: { target:sd, method:'trigger', args:[1], name:'snare' },
      'sd': { target:sd, method:'trigger', args:[1], name:'snare' },
      [2]: { target:ch, method:'trigger', args:[.2], name:'closedHat' },
      'ch': { target:ch, method:'trigger', args:[.2], name:'closedHat' },
      [3]: { target:oh, method:'trigger', args:[.2], name:'openHat' },
      'oh': { target:oh, method:'trigger', args:[.2], name:'openHat' },
      [4]: { target:cp, method:'trigger', args:[.5], name:'clap' },
      'cp': { target:cp, method:'trigger', args:[.5], name:'clap' },
      [5]: { target:cb, method:'trigger', args:[.5], name:'cowbell' },
      'cb': { target:cb, method:'trigger', args:[.5], name:'cowbell' },
    })

    //if( typeof score === 'string' ) {
    //  drums.seq = Audio.Seq({
    //    target:drums,
    //    key:'play',
    //    values:score.split(''),
    //    timings:time === undefined ? 1 / score.length : time,
    //    rate:Audio.Clock.audioClock
    //  }).start()

    //  drums.values = drums.seq.values
    //  drums.timings = drums.seq.timings
    //}

    if( Audio.autoConnect === true ) drums.connect()

    props = Presets.process( { name:'EDrums', category:'instruments' }, args, Audio )
    if( props !== undefined && props.__presetInit__ !== undefined ) {
      props.__presetInit__.call( drums, Audio )
    }

    //drums.tidal = pattern => {
    //  if( drums.__tidal !== undefined ) drums.__tidal.stop()

    //  drums.__tidal = Audio.Tidal({
    //    target:drums,
    //    key:'play',
    //    pattern
    //  }).start()

    //  return drums
    //}

    drums.name = 'EDrums'
    return drums
  }

  return { Drums, EDrums }
}

},{"./presets.js":109,"./ugen.js":128}],97:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Effects = {
  create( Audio ) {
    const effects = {}
    const poolEffects = ['Freeverb', 'Plate', 'BufferShuffler']
    Gibberish.effects = Gibberish.fx

    for( let effectName in Gibberish.effects ) {
      const gibberishConstructor = Gibberish.effects[ effectName ]

      const methods = Effects.descriptions[ effectName ] === undefined ? null : Effects.descriptions[ effectName ].methods

      // XXX how do we make this more generic for any model of reverb / any type of distortion etc.
      const replaceName = effectName === 'Freeverb' ? 'Reverb' : effectName 
      const description = { 
        properties:gibberishConstructor.defaults || {}, 
        methods:methods,
        name:replaceName,
        category:'effects'
      }
      description.properties.type = 'fx'

      const shouldUsePool = poolEffects.indexOf( effectName ) > -1 

      effects[ effectName ] = Ugen( gibberishConstructor, description, Audio, shouldUsePool )
      
      effects[ effectName ].presets = Audio.Presets.effects[ effectName ] 
      if( effects[ effectName ].presets !== undefined ) {
        effects[ effectName ].presets.inspect = function() {
          console.table( this )
        }
      }else{
        effects[ effectName ].presets = { inspect() { console.log( `${effectName} has no presets.` ) } }
      }
    }

    effects.Reverb = function( ...args ) {
      let argprops = null
      if( args.length === 1 ) {
        if( typeof args[0] === 'object' ) argprops = args[0]
      }else if( args.length === 2 ) {
        argprops = args[1]
      }
      const props = Object.assign( {}, { model:0 }, argprops )

      let ugen = null
      switch( props.model ) {
        case 0:
        default:
          ugen = effects.Freeverb(...args )
          break;
      }

      return ugen
    }

    return effects
  },

  descriptions: {
    //Chorus:{ methods:[] },
  },
  
}

module.exports = Effects

},{"./ugen.js":128,"gibberish-dsp":174}],98:[function(require,module,exports){
module.exports = function( Audio ) {
  const Gibberish = Audio.Gibberish
  const Ensemble = function( props ) {
    const cp = {
      shouldAddToUgen:true
    }

    for( let key in props ) {
      const dict = props[ key ]
      const target = dict.target
      const method = dict.method
      const args = dict.args
      cp[ key ] = {
        play: function( ...args ) { 
          Gibberish.worklet.ugens.get( this.target )[ this.method ]( ...args ) 
        },
        target:target.id,
        method,
        args,
        name:dict.name
      }

      //Object.defineProperty( cp[ key ], 'loudness', {
      //  set(v) {
      //    console.log( 'loudness:', v, Gibberish.worklet.ugens.get( this.target ))
      //    Gibberish.worklet.ugens.get( this.target ).loudness = v
      //  }
      //})
      cp[ dict.name ] = target
    }

    cp.play = function( __key ) {
      const key = isNaN(__key) ? __key : parseInt( __key ) 
      if( Gibberish.mode === 'processor' ) {
        Gibberish.worklet.ugens.get( this[ key ].target )[ this[ key ].method ]( ...this[ key ].args )
      }else{
        props[ key ].target[ this[ key ].method ]( ...this[ key ].args )
      }
    }

    const ens = Audio.busses.Bus2( cp )
    ens.__isEnsemble = true

    for( let key in props ) {
      props[ key ].target.connect( ens )
    }
    
    ens.tidals = []

    ens.stop = function() {
      ens.tidals.forEach( t => t.stop() )
      ens.__sequencers.forEach( t => t.stop() )
    }
    ens.start = function() {
      ens.tidals.forEach( t => t.start() )
      ens.__sequencers.forEach( t => t.start() )
    }

    ens.tidal = (pattern,num=0) => {
      const t =  Audio.Gibber.Tidal({
        target:ens,
        key:'play',
        pattern
      })

      if( t !== null ) {
        if( ens.tidals[ num ] !== undefined ) ens.tidals[ num ].stop()

        ens.tidals[ num ] = t
        t.start()
      }

      return ens
    }
    ens.__sequencers = []

    ens.seq = (values,timings,num=0,offset=0) => {
      if( ens.__sequencers[ num ] !== undefined ) ens.__sequencers[ num ].stop()

      ens.__sequencers[ num ] = Audio.Gibber.Seq({
        target:ens,
        key:'play',
        values,timings,offset
      }).start()

      return ens
    }

    return ens
  }

  return Ensemble
}

},{}],99:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Envelopes = {
  create( Audio ) {
    const envelopes = {}

    for( let envelopeName in Gibberish.envelopes ) {
      const gibberishConstructor = Gibberish.envelopes[ envelopeName ]

      const methods = Envelopes.descriptions[ envelopeName ] === undefined ? null : Envelopes.descriptions[ envelopeName ].methods
      const description = { 
        properties:gibberishConstructor.defaults || {}, 
        methods:methods,
        name:envelopeName,
        category:'envelopes'
      }
      description.properties.type = 'envelope'

      envelopes[ envelopeName ] = Ugen( gibberishConstructor, description, Audio )
    }
    return envelopes
  },

  descriptions: {
    //Chorus:{ methods:[] },
  },
  
}

module.exports = Envelopes

},{"./ugen.js":128,"gibberish-dsp":174}],100:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"./realm.js":101,"dup":39}],101:[function(require,module,exports){


/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = function Realm (scope, parentElement) {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:absolute;left:0;top:-999px;width:1px;height:1px;';
  parentElement.appendChild(frame);
  const win = frame.contentWindow;
  const doc = win.document;
  let vars = 'var window,$hook';
  for (const i in win) {
    if (!(i in scope) && i !== 'eval') {
      vars += ',';
      vars += i;
    }
  }
  for (const i in scope) {
    vars += ',';
    vars += i;
    vars += '=self.';
    vars += i;
  }
  const script = doc.createElement('script');
  script.appendChild(doc.createTextNode(
    `function $hook(self,console) {"use strict";
        ${vars};return function() {return eval(arguments[0])}}`
  ));
  doc.body.appendChild(script);
  this.exec = win.$hook.call(scope, scope, console);
}

},{}],102:[function(require,module,exports){

// See all scales at: http://abbernie.github.io/tune/scales.html


const Tune = function(){

	// the scale as ratios
	this.scale = []

	// i/o modes
	this.mode = {
		output: "frequency",
		input: "step"
	}

	// ET major, for reference
	this.etmajor= [ 261.62558,
		293.664764,
		329.627563,
		349.228241,
		391.995422,
		440,
		493.883301,
		523.25116
	]

  
  this.TuningList = null
	// Root frequency.
	this.tonic = 440

	console.log("{{{{ Tune.js v0.1 Loaded }}}}");

}

/* Set the tonic frequency */

Tune.prototype.tonicize = function(newTonic) {
	this.tonic = newTonic
}

/* Return data in the mode you are in (freq, ratio, or midi) */

Tune.prototype.note = function(input,octave){

	var newvalue;

	if (this.mode.output == "frequency") { 
		newvalue = this.frequency(input,octave)
	} else if (this.mode.output == "ratio") { 
		newvalue = this.ratio(input,octave)
	} else if (this.mode.output == "MIDI") { 
		newvalue = this.MIDI(input,octave)
	} else {
		newvalue = this.frequency(input,octave)
	}

	
	return newvalue;

}


/* Return freq data */

Tune.prototype.frequency = function(stepIn, octaveIn) {

	if (this.mode.input == "midi" || this.mode.input == "MIDI" ) {
		this.stepIn += 60
	}
	
	// what octave is our input
	var octave = Math.floor(stepIn/this.scale.length)

	if (octaveIn) { 
		octave += octaveIn
	}
	
	// which scale degree (0 - scale length) is our input
	var scaleDegree = stepIn % this.scale.length

	while (scaleDegree < 0) {
		scaleDegree += this.scale.length
	}
	
	var freq = this.tonic*this.scale[scaleDegree]
	
	freq = freq*(Math.pow(2,octave))
	
	// truncate irrational numbers
	freq = Math.floor(freq*100000000000)/100000000000
	
	return freq

}

/* Force return ratio data */

Tune.prototype.ratio = function(stepIn, octaveIn) {

	if (this.mode.input == "midi" || this.mode.input == "MIDI" ) {
		this.stepIn += 60
	}
	
	// what octave is our input
	var octave = Math.floor(stepIn/this.scale.length)

	if (octaveIn) { 
		octave += octaveIn
	}
	
	// which scale degree (0 - scale length) is our input
	var scaleDegree = stepIn % this.scale.length

	// what ratio is our input to our key
	var ratio = Math.pow(2,octave)*this.scale[scaleDegree]

	ratio = Math.floor(ratio*100000000000)/100000000000

	return ratio

}

/* Force return adjusted MIDI data */

Tune.prototype.MIDI = function(stepIn,octaveIn) {

	var newvalue = this.frequency(stepIn,octaveIn)

	var n = 69 + 12*Math.log(newvalue/440)/Math.log(2)

	n = Math.floor(n*1000000000)/1000000000

	return n

}

/* Load a new scale */

Tune.prototype.loadScale = function(name){

	/* load the scale */
	var freqs = this.TuningList[name].frequencies
	this.scale = []
	for (var i=0;i<freqs.length-1;i++) {
		this.scale.push(freqs[i]/freqs[0])
	}

	/* visualize in console */
	//console.log(" ");
	//console.log("LOADED "+name);
	//console.log(this.TuningList[name].description);
	//console.log(this.scale);
	//var vis = [];
	//for (var i=0;i<100;i++) {
	//  vis[i] = " ";
	//}
	//for (var i=0;i<this.scale.length;i++) {
	//  var spot = Math.round(this.scale[i] * 100 - 100);
	//  if (i<10) {
	//    vis.splice(spot,1,i+1);
	//  } else {
	//    vis.splice(spot,5,i+1);
	//  }
	//}
	//var textvis = "";
	//for (var i=0;i<vis.length;i++) {
	//  textvis += vis[i];
	//}
	//console.log(name)
	//console.log(textvis)
	//// ET scale vis
	//var vis = [];
	//for (var i=0;i<100;i++) {
	//  vis[i] = " ";
	//}
	//for (var i=0;i<this.etmajor.length;i++) {
	//  var spot = Math.round(this.etmajor[i]/this.etmajor[0] * 100 - 100);
	//  if (i<10) {
	//    vis.splice(spot,1,i+1);
	//  } else {
	//    vis.splice(spot,5,i+1);
	//  }
		
	//}
	//var textvis = "";
	//for (var i=0;i<vis.length;i++) {
	//  textvis += vis[i];
	//}
	//console.log(textvis)
	//console.log("equal-tempered major (reference)")
}

/* Search the names of tunings
	 Returns an array of names of tunings */

Tune.prototype.search = function(letters) {
	var possible = []
	for (var key in this.TuningList) {
		if (key.toLowerCase().indexOf(letters.toLowerCase())!=-1) {
			possible.push(key)
		}
	}
	return possible
}

/* Return a collection of notes as an array */

Tune.prototype.chord = function(midis) {
	var output = []
	for (var i=0;i<midis.length;i++) {
		output.push(this.note(midis[i]))
	}
	return output;
}


/* Change the tonic frequency? */

Tune.prototype.root = function(newmidi, newfreq) {
	this.rootFreq = newfreq
	// not working now ... needs much work.
	// setKey is not transposing now, either.
}

module.exports = Tune

},{}],103:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const filterNames = [
  "none", "Filter24Moog", "Filter24TB303", "Filter12SVF", "Filter12Biquad", "Filter24Classic"
]

const Filters = {
  create( Audio ) {
    const filters = {}

    for( let filterName in Gibberish.filters ) {
      const gibberishConstructor = Gibberish.filters[ filterName ]

      const methods = Filters.descriptions[ filterName ] === undefined ? null : Filters.descriptions[ filterName ].methods
      const description = { 
        properties:gibberishConstructor.defaults || {}, 
        methods:methods,
        name:filterName,
        category:'effects'
      }
      description.__defaults__ = { isStereo : true }
      description.properties.isStereo = true
      description.properties.type = 'fx'

      filters[ filterName ] = Ugen( gibberishConstructor, description, Audio, false )
    }

    filters.LPF = filters.Filter24Moog

    filters.Filter = function( props ) {
      if( props === undefined ) props = { model: 1 }
      if( props.model === undefined ) props.model = 1

      const name = filterNames[ props.model ]

      delete props.model

      return filters[ name ]( props ) 
    }

    const description = { 
      properties: Object.assign( {}, Gibberish.filters[ 'Filter12Biquad' ].defaults, { mode:1 } ),
      methods:null,
      name:'HPF',
      category:'effects',
      __defaults__: { mode:1 }
    }
   
    filters.HPF = Ugen( Gibberish.filters[ 'Filter12Biquad' ], description, Audio, false )

    return filters
  },

  descriptions: {
    //Chorus:{ methods:[] },
  },
  
}

module.exports = Filters

},{"./ugen.js":128,"gibberish-dsp":174}],104:[function(require,module,exports){
module.exports = function( Audio ) {
  const token = '6a00f80ba02b2755a044cc4ef004febfc4ccd476'

  const Freesound = function( query, options ) {
    const props = Object.assign( { count:1, maxVoices:1, panVoices:true }, typeof query === 'object' ? query : options )
    const sampler = Audio.instruments.Multisampler( props )
    setTimeout( ()=>queries[ typeof query ]( query, sampler, props.count ), 0 )
 
    return sampler
  }

  Freesound.loaded = {}
  Freesound.queries = {}

  Freesound.defaults = {
    sort: 'downloads',
    single:true,
    filename:false,
    min: 0,
    max: .5,
    reverse:false,
    count:15
  }

  // add Freesound[5] notation...
  for( let i = 0; i < 20; i++ ) {
    Freesound[ i ] = function( ...args ) {
      if( args.length > 0 ) {
        if( typeof args[0] === 'string' ) {
          if( args.length > 1 ) {
            if( typeof args[1] === 'object' ) {
              args[1].maxVoices = i || 1
            } 
          }else{
            args[1] = { maxVoices:i || 1 }
          }
        }else if( typeof args[0] === 'object' ) {
          args[0].maxVoices = i || 1
        }
      }else{
        args[0] = { maxVoices:i || 1 }
      } 

      return Freesound( ...args ) 
    }
  }

  const queries = {
    number( id, sampler, num=0 ) {
      if (typeof Freesound.loaded[ id ] === 'undefined') {
        fetch( `https://freesound.org/apiv2/sounds/${id}/?&format=json&token=${token}` )
          .then( response => response.json() )
          .then( json => {
            const path = json.previews[ 'preview-hq-mp3' ]
            
            sampler.loadSample( path )
            //console.log( 'loading:', path )
          }) 
      }else{
        if( Audio.Gibberish.mode === 'worklet' ) {
          sampler.samplers[ num ].loadBuffer( Freesound.loaded[ id ] )
        }
      }
    },

    // search for text query, and then use returned id to 
    // fetch by number 
    string( query, sampler, count, originalQuery ) {
      sampler.length = count
      let queryString ='https://freesound.org/apiv2/search/text/?'

      console.group('Querying Freesound for: ' + originalQuery || query )
      if( query.indexOf( 'query' ) > -1 ) {
        queryString += query
        queryString += `&token=${token}&fields=name,id,previews,username,license&page_size=${count} `
      }else{
        queryString += `query=${query}&token=${token}&fields=name,id,previews,username,license&filter=original_filename:${query.split(' ')[0]} ac_single_event:true&sort=downloads_desc&page_size=${count}`

      }

      fetch( queryString )
        .then( data => data.json() )
        .then( sounds => {
          if( sounds.results.length > 0 ) {
            if( sounds.results.length > count ) sounds.results = sounds.results.slice(0,count)
            console.log(`%c${sounds.results.length} sounds found. Starting downloads:`, `background:black;color:white`)
          }else{
            console.log(`%cNo sounds were found for this query!`, `background:red;color:white`)
          }
          sampler.length = count < sounds.results.length ? count : sounds.results.length
          console.table( sounds.results.map( r=>({file:r.name,author:r.username,license:'CC/'+r.license.split('/').slice(4).join('/')}) ) )
          for( let i = 0; i < sampler.length; i++ ) {
            const result = sounds.results[i]
            if( result !== undefined ) {
              const filename = result.name,
                    id = result.id,
                    url = result.previews[ 'preview-hq-mp3' ] 

              if( Freesound.loaded[ url ] === undefined ) {
                //console.log( `%c${filename}`, `color:white;background:#333333;` )

                sampler.loadSample( url, (__sampler,buffer) => {
                  Freesound.loaded[ url ] = buffer.data.buffer
                })

              }else{
                // XXX memoing the files causes an error
                if( Gibberish.mode === 'worklet' ) {
                  //console.log( 'reusing freesound file:', filename )
                  sampler.loadSample( url, null, Freesound.loaded[ url ] )
                }
              }
            }
          }
          console.groupEnd()
        })
    },

    object( queryObj, sampler ) {
      const q = Object.assign( {}, Freesound.defaults, queryObj )
 
      let query = `query=${q.query}&format=json`
  
      query += `&filter=duration:[${q.min} TO ${q.max}]`
      if( q.single ) query += ` ac_single_event:true`
      if( q.filename ) query += ` original_filename:${q.query}`

      let sort = q.sort

      // user error check
      if( sort === 'ratings' ) sort = 'rating'

      sort += q.reverse ? '_asc' : '_desc'

      query += `&sort=${sort}`

      queries.string( query, sampler, q.count, q.query )
    }
  }

  return Freesound
}

},{}],105:[function(require,module,exports){
module.exports = function( Audio ) {
  
const binops = [ 
  'min','max','add','sub','mul','div','rdiv','mod',
  'and','or','gt','eq','eqp','gte','gtep','gtp','lt','lte','ltep','ltp','neq',
  'step' 
]

const monops = [
  'abs','acos','acosh','asin','asinh','atan','atan2','atanh','cos','cosh',
  'sin','sinh','tan','tanh', 'floor',
  'ceil', 'round', 'sign', 'trunc', 'fract', 'param', 'in',
]

const noops = [
  'noise'
]

const Gen  = {
  lastConnected:[],
  names:[],
  connected: [],

  isGen:true,
  debug:false,

  wavetable( frequency, props ) {
    const g = Audio.Gibberish.genish 
    let dataProps = { immutable:true }

    // use global references if applicable
    if( props.name !== undefined ) dataProps.global = props.name

    const buffer = Gen.ugens.data( props.buffer, 1, dataProps )

    return Gen.ugens.peek( buffer, Gen.ugens.phasor( frequency, 0, { min:0 } ) )
  },

  init() {
    Gen.ugens.wavetable = Gen.__wavetable
    Gen.createBinopFunctions()
    Gen.createMonopFunctions()

    Gen.names.push( ...binops )
    Gen.names.push( ...monops )
    Gen.names.push( ...Object.keys( Gen.constants ) )
    Gen.names.push( ...Object.keys( Gen.functions ) )
    //Gen.names.push( ...Object.keys( Gen.composites ) )
    Gen.names.push( 'gen' )
    Gen.names.push( 'lfo' )
    Gen.names.push( 'sine' )
    Gen.names.push( 'square' )
    Gen.names.push( 'tri' )
    Gen.names.push( 'saw' )

    //Gibber.subscribe( 'clear', ()=> Gen.lastConnected.length = 0 )
  },

  // if property is !== ugen (it's a number) a Param must be made using a default
  create( name ) {
    // rate needs custom function to skip sequencing input and only sequence rate adjustment

    const params = Array.prototype.slice.call( arguments, 1 )

    if( name === 'rate' ) return Gen.createRate( name, ...params )

    const obj = Object.create( this )
    let count = 0
    
    obj.name = name
    obj.active = false
    
    for( let key of Gen.functions[ name ].properties ) { 
      let value = params[ count++ ] || 0
      obj[ key ] = v => {
        if( v === undefined ) {
          return value
        }else{
          value = v
          if( obj.active ) {
            if( obj.__client === 'live' ) {
              Gibber.Communication.send( `genp ${obj.paramID} ${obj[ key ].uid} ${v}` ) 
            }else if( obj.__client === 'max' ) {
              Gibber.Communication.send( `sig ${obj.paramID} param ${obj[ key ].uid} ${v}`, 'max' ) 
            }
          }
        }
      }
      obj[ key ].uid = Gen.getUID()
 
      // XXX Gibber.addSequencingToMethod( obj, key )
    }

    // accomodate non-audio-rate options. during codegen the compiler
    // will check for the options property; if it exists it will write
    // the options into the generated code.
    if( params.length > Gen.functions[ name ].properties.length ) {
      obj.options = params[ Gen.functions[ name ].properties.length ]
    }

    return obj
  },

  createRate( name ) {
    let obj = Object.create( this ),
        count = 0,
        param = arguments[1] 
    
    obj.name = 'rate' 
    obj.active = false
    
    let value = param
    //console.log( 'value:', value, 'args:', arguments )
    obj[ 0 ] = v => {
      if( v === undefined ) {
        return value
      }else{
        value = v
        if( obj.active ) {
          Gibber.Communication.send( `genp ${obj.paramID} ${obj[ 0 ].uid} ${v}` ) 
        }
      }
    }

    Gen.getUID() // leave 0 behind...
    obj[ 0 ].uid = Gen.getUID()

    Gibber.addSequencingToMethod( obj, '0' )

    return obj
  },
 
  createBinopFunctions() {
    for( let key of binops ) {
      Gen.functions[ key ] = {
        properties:['0','1'], str:key
      }
    }
  },

  createMonopFunctions() {
    for( let key of monops ) {
      Gen.functions[ key ] = {
        properties:['0'], str:key
      }
    }
  },

  assignTrackAndParamID: function( track, id ) {
    this.paramID = id
    this.track = track

    let count = 0, param
    while( param = this[ count++ ] ) {
      if( typeof param() === 'object' ) {
        param().assignTrackAndParamID( track, id )
      }
    }
  },

  clear() {
    for( let ugen of Gen.connected ) {
      Gibber.Communication.send( `ungen ${ugen.paramID}` )
    }

    Gen.connected.length = 0
  },

  constants: {
    degtorad: Math.PI / 180,
    E :       Math.E,
    halfpi:   Math.PI / 2,
    invpi :   Math.PI * - 1,
    ln10  :   Math.LN10,
    ln2   :   Math.LN2,
    log10e:   Math.LOG10E,
    log2e :   Math.LOG2E,
    pi    :   Math.PI,  
    sqrt2 :   Math.SQRT2,
    sqrt1_2:  Math.SQRT1_2,
    twopi :   Math.PI * 2,
    samplerate: 'samplerate'
  },

  functions: {
    phasor: { properties:[ '0','1' ],  str:'phasor' },
    cycle:  { properties:[ '0' ],  str:'cycle' },
    phasorN:{ properties:[ '0','1' ],  str:'phasorN' },
    cycleN: { properties:[ '0' ],  str:'cycleN' },
    train:  { properties:[ '0','1' ],  str:'train' },
    rate:   { properties:[ '0' ], str:'rate' },
    noise:  { properties:[], str:'noise' },
    accum:  { properties:[ '0','1' ], str:'accum' },
    counter:{ properties:[ '0','1' ], str:'counter' },
    scale:  { properties: ['0', '1', '2', '3'], str:'scale' },
    sah:    { properties: ['0', '1', '2'], str:'sah' },
    clamp:  { properties: ['0', '1', '2'], str:'clamp' },
    ternary:{ properties: ['0', '1', '2'], str:'switch' },
    selector:{ properties: ['0', '1', '2'], str:'selector' },
    peek:   { properties:['0','1'], str:'peek' },
    data:   { properties:[], str:'data' }
  },

  _count: 0,

  getUID() {
    return 'p' + Gen._count++
  },

  time: 'time',

  out() {
    let paramArray = [],
        body, out
    
    body = this.gen( paramArray )

    out = paramArray.join( ';' )

    if( paramArray.length ) {
      out += ';'
    }
    
    out += 'out1='
    out += body + ';'
    
    if( Gen.debug ) console.log( out )

    return out
  },

  genMax( paramArray ) {
    let def = Gen.functions[ this.name ],
        str = def.str + '(',
        count = 0
    
    // tell Gibber that this gen object is part of an active gen graph
    // so that changes to it are forwarded to m4l
    this.active = true

    if( this.name === 'rate' ) {
      str += 'in1, '
      let pName = this[ 0 ].uid
      str += pName
      paramArray.push( `Param ${pName}(${this[0]()})` )
    }else{
      for( let property of def.properties ) {
        let p = this[ property ](),
            uid = this[ property ].uid
        
        //console.log( this.name, property, def.properties, uid )
        if( Gen.isPrototypeOf( p ) ) {
          str += p.gen( paramArray )
        }else if( typeof p === 'number' ) {
          let pName = uid
          str += pName
          paramArray.push( `Param ${pName}(${p})` )
        }else if( p === Gen.time ) {
          str += p
        }else if( typeof p === 'string' ) {
          str += p
        }else{
          console.log( 'CODEGEN ERROR:', p )
        }

        if( count++ < def.properties.length - 1 ) str += ','
      }
    }
    
    str += ')'

    return str
  },

  gen( paramArray ) {
    let def = Gen.functions[ this.name ],
        str = `g.${def.str}(`,
        count = 0
    
    // tell Gibber that this gen object is part of an active gen graph
    // so that changes to it are forwarded to m4l
    this.active = true

    for( let property of def.properties ) {
      let p = this[ property ](),
          uid = this[ property ].uid
      
      //console.log( this.name, property, def.properties, uid )
      if( Gen.isPrototypeOf( p ) ) {
        str += p.gen( paramArray )
      }else if( typeof p === 'number' ) {
        let pName = 'p'+paramArray.length
        //str += pName
        paramArray.push( [`${pName}`, p ] )
        str += `g.in('${pName}')`
      }else if( p === Gen.time ) {
        str += p
      }else if( typeof p === 'string' ) {
        str += p
      }else{
        console.log( 'CODEGEN ERROR:', p )
      }

      if( count++ < def.properties.length - 1 ) str += ','
    }

    if( this.options !== undefined ) {
      str += ',' + JSON.stringify( this.options )
    }
    
    str += ')'

    return str
  },

  composites: { 
    sine( frequency=2, amp=4, center=0, shouldRound=false ) {
      return Gen.composites.lfo( 'sine', frequency, amp, center, shouldRound )
    },
    siner( frequency=2, amp=4, center=0 ) {
      return Gen.composites.lfo( 'sine', frequency, amp, center, true )
    },
    square( frequency=2, amp=4, center=0 ) {
      return Gen.composites.lfo( 'square', frequency, amp, center )
    },
    saw( frequency=2, amp=4, center=0 ) {
      return Gen.composites.lfo( 'saw', frequency, amp, center )
    },
    tri( frequency=2, amp=4, center=0 ) {
      return Gen.composites.lfo( 'tri', frequency, amp, center )
    },
    lfo( type = 'sine', frequency = 2, amp = .5, center = .5, shouldRound = false ) {
      const g = Gen.ugens 
      const gibberish= Audio.Gibberish
      let osc

      switch( type ) {
        case 'saw':
          osc = g.phasor( frequency )
          break
        case 'square':
          osc = g.add( g.mul( g.gt( g.phasor( frequency ), 0 ), 2 ), -1 )
          break
        case 'noise':
          osc = g.sub( g.mul( g.noise(), 2 ), 1 )
          break
        case 'triangle':
        case 'tri':
          const p = g.phasor( frequency )
          osc = g.sub(
            1, 
            g.mul( 
              4, 
              g.abs(
                g.sub( 
                  g.round( p ),
                  p
                )
              )
            )
          )
            
          break
        case 'sine':
        default:
          osc = g.cycle( frequency )
          break
      }

      const _mul   = g.mul( osc, amp ),
            _add   = g.add( center, _mul ) 

      const lfo = shouldRound ? Gen.make( g.round( _add ) ) : Gen.make( _add )

      Object.defineProperties( lfo, {
        frequency: {
          set(v) { lfo.p1 = v },
          get()  { return lfo.p1 }
        },
        gain: {
          set(v) { lfo.p2 = v },
          get()  { return lfo.p2 }
        },
        bias: {
          set(v) { lfo.p0 = v },
          get()  { return lfo.p0 }
        }
      })

      lfo.copy = function() {
        return Gen.composites.lfo( type, this.frequency.value, this.gain.value, this.bias.value )
      }

      return lfo
    },

    fade( time = 1, from = 1, to = 0 ) {
      let g = Gen.ugens
      let fade, amt, beatsInSeconds = time * ( 60 / Gibber.Live.LOM.bpm )
     
      if( from > to ) {
        amt = from - to

        fade = g.gtp( g.sub( from, g.accum( g.div( amt, g.mul(beatsInSeconds, g.samplerate ) ), 0 ) ), to )
      }else{
        amt = to - from
        fade = g.add( from, g.ltp( g.accum( g.div( amt, g.mul( beatsInSeconds, g.samplerate ) ), 0 ), to ) )
      }
      
      // XXX should this be available in ms? msToBeats()?
      let numbeats = time / 4
      fade.shouldKill = {
        after: numbeats, 
        final: to
      }
      
      return fade
    },
    
    //beats( num ) {
    //  return Gen.ugens.rate( num )
    //  // beat( n ) => rate(in1, n)
    //  // final string should be rate( in1, num )
    //}
    beats( b ) {
      return Gen.ugens.phasor( Audio.Utilities.btof( b ), 0, { min:0 } )
    }, 
    beats2( b ) {
      return Gen.ugens.phasor( 
        Audio.Utilities.btof( b ), 
        0, 
        { min:0 } )
    }, 
  },

  ugens:{},

  export( obj ) {
    for( let key in Gen.functions ) {
      this.ugens[ key ] = Gen.create.bind( Gen, key )
    }

    Object.assign( this.ugens, Gen.constants )
    Object.assign( this.ugens, Gen.composites )

    const __in = this.ugens.in
    delete this.ugens.in
    Object.assign( obj, this.ugens )
    this.ugens.in = __in
  },


  // defer creating genish object until we know whether
  // this will be used by an audio or visual object
  make( graph, propertyNames ) {
    const defer = { 
      graph, 
      __graph:graph,
      propertyNames,
      type:'gen',
      id: Audio.Gibberish.utilities.getUID(),
      rendered:null,
      copy() {
        return Gen.make( this.__graph )
      },
      render( samplerate=44100, type='audio' ) {
        if( type === 'audio' ) {
          if( this.rendered === null ) { 
            this.rendered = Gen.__make( this.graph, this.propertyNames, defer )
            const props = this.rendered.__wrapped__.__properties__
            for( let key in props ) { 
              Object.defineProperty( this, key, {
                configurable:true,
                get() { return this.rendered[ key] },
                set(v){
                  this.rendered[ key ] = v 
                }
              })
            } 
            this.rendered.widget = this.widget
            this.rendered.__graph = graph
          }

          return this.rendered
        }

        const store = Audio.Gibberish.genish.samplerate
        const g = Audio.Gibberish.genish

        Audio.Gibberish.genish.gen.samplerate = samplerate
        const params = []
        const __graph = eval( graph.gen( params ) )
        const callback = g.gen.createCallback( __graph )
        Audio.Gibberish.genish.gen.samplerate = store      

        const out = callback.bind( null, ...params.map( v => v[1] ), g.memory )

        // annotations can be added to the original defer, so store the defer
        // to access the annotations later
        out.pre = defer 

        return out
      },

      // XXX connecting gen objects to audio properties no longer seems
      // to work... must be assigned. FIX
      connect( target ) {
        if( target.type === 'audio' ) {
          if( this.rendered === null ) { 
            this.rendered = Gen.__make( this.graph, this.propertyNames, defer )
          }
          this.rendered.connect( target )
        }
      }
    }

    return defer
  },

  __make( graph, propertyNames, target ) {
    const ugen = Audio.Gibberish.prototypes.Ugen
    const g = Audio.Gibberish.genish

    // store properties of our gen object in this array
    // they will then become properties of our Gibber object
    const paramArray = []

    // get genish.js codelet for our graph
    const genCode = graph.gen( paramArray )

    // create a properties object out of our paramArray
    const params = {}
    for( let param of paramArray ) {
      params[ param[0] ] = param[1]
    } 

    const id = Gen.getUID()

    params.id = Audio.Gibberish.utilities.getUID()

    // pass a constructor to our worklet processor
    Audio.Gibberish.worklet.port.postMessage({ 
      address:'addMethod', 
      id:-1,
      key:'Gen' + id,
      function:`function() { 
        const g = Gibberish.genish; 
        const mymod = Object.create( Gibberish.prototypes.Ugen ); 
        Gibberish.factory( mymod, ${genCode}, 'Gen${id}', ${JSON.stringify(params)}, null, true ); 
        return mymod; 
      }`
    })

    // create a worklet-side Gibberish constructor
    const make = function() {
      const mymod = Object.create( ugen )
      // the second parameter doesn't matter in the worklet, only in the processor
      // so we can just input zeroes. hmmmm... I gues it probably matters for
      // sequencing?
      
      return Audio.Gibberish.factory( mymod, g.add(0,0), 'Gen'+id, params )
    }

    // XXX do I really have to make a Gibberish constructor and a Gibber constructor to
    // turn a genish graph into a Gibber ugen? Is there a shortcut to take? Is it worth
    // writing custom code for?

    // create a Gibber constructor using our Gibberish constructor
    let temp = params.id
    //delete params.id
    const Make = Audio.Ugen( make, { name:'Gen'+id, properties:params, methods:[]}, Audio )

    // create Gibber ugen and pass in properties dictionary to initailize
    const out = Make({ params })
    out.__wrapped__.id = temp 
    out.__wrapped__.connected = []

    let count = 0
    out.__wrapped__.output = out.output = function( v ) {
      //if( Audio.Gibber.Environment !== undefined ) {
        // XXX should these be averaged instead of only taking every sixth sample (roughly
        // corresponds to 58 frames a second)
        if( count++ % 6 === 0 ) {
          // XXX this shouldn't happen here, should happen when the annotation is created.
          if( Audio.Gibber.Environment.Annotations.waveform.widgets[ temp ] === undefined ) {
            Audio.Gibber.Environment.Annotations.waveform.widgets[ temp ] = out.widget
          }
          Audio.Gibber.Environment.Annotations.waveform.updateWidget( out.widget, v, false )
        }
      //}

      out.output.value = v
    }

    // optionally map user provided names to p values for better control / sequencing
    if( Array.isArray( propertyNames )) {
      for( let i = 0; i < propertyNames.length; i++ ){
        const propertyName = propertyNames[ i ]
        if( out[ 'p'+i ] !== undefined && propertyName !== null && propertyName !== undefined ){
          out[ '__'+propertyName ] = out[ 'p'+i ]
          Object.defineProperty( out, propertyName, {
            get() { return out[ '__' + propertyName ] },
            set(v){
              if( v === undefined || v === null ) return
              out[ '__' + propertyName ].value = v
            }
          })
          Object.defineProperty( target, propertyName, {
            get() { return out[ '__' + propertyName ] },
            set(v){
              if( v === undefined || v === null ) return
              out[ '__' + propertyName ].value = v
            }
          })

        } 
      }
    }


    out.id = temp
    out.__isGen = out.__wrapped__.__isGen = true
    out.type = 'gen'

    return out
  }
}

Gen.init()

return Gen 
}

},{}],106:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Instruments = {
  create( Audio ) {
    const instruments = {}
    //const pooledInstruments = ['Synth','Monosynth','FM']
    for( let instrumentName in Gibberish.instruments ) {
      const gibberishConstructor = Gibberish.instruments[ instrumentName ]
      if( typeof gibberishConstructor.defaults === 'object' ) gibberishConstructor.defaults.octave = 0

      const methods = Instruments.descriptions[ instrumentName ] === undefined ? null : Instruments.descriptions[ instrumentName ].methods
      const description = { 
        properties:gibberishConstructor.defaults, 
        methods:methods,
        name:instrumentName,
        category:'instruments'
      }

      //const shouldPool = pooledInstruments.indexOf( instrumentName ) > -1
      instruments[ instrumentName ] = Ugen( gibberishConstructor, description, Audio, false ) 

      // for poly notation like Synth[3]()
      // create or extend dictionary with maxVoices property
      for( let i = 0; i < 20; i++ ) {
        instruments[ instrumentName ][i] = function( ...args ) {
          if( args.length > 0 ) {
            if( typeof args[0] === 'string' ) {
              if( args.length > 1 ) {
                if( typeof args[1] === 'object' ) {
                  args[1].maxVoices = i || 1
                } 
              }else{
                args[1] = { maxVoices:i || 1 }
              }
            }else if( typeof args[0] === 'object' ) {
              args[0].maxVoices = i || 1
            }
          }else{
            args[0] = { maxVoices:i || 1 }
          } 

          // use monophonic version if voice count is 1 or less
          let name
          if( i > 1 ) {
            name = instrumentName === 'Sampler' ? 'Multisampler' : 'Poly'+instrumentName
            if( name === 'PolyMonosynth' ) name = 'PolyMono' 
          }else{
            name = instrumentName
          }

          return instruments[ name ]( ...args )
        }
      }


      instruments[ instrumentName ].presets = Audio.Presets.instruments[ instrumentName ] 
      if( instruments[ instrumentName ].presets !== undefined ) {
        instruments[ instrumentName ].presets.inspect = function() {
          console.table( this )
        }
      }else{
        instruments[ instrumentName ].presets = { inspect() { console.log( `${instrumentName} has no presets.` ) } }
      }
    }
    instruments.Pluck = instruments.Karplus
    return instruments
  },

  descriptions: {
    Clap:{
      methods:[ 'trigger' ],
    },   
    Conga:{
      methods:[ 'note','trigger' ],
    },
    Clave:{
      methods:[ 'note','trigger' ],
    },
    Cowbell:{
      methods:[ 'note','trigger' ],
    },
    FM:{
      methods:[ 'note','trigger' ],
    },
    Hat:{
      methods:[ 'note','trigger' ],
    },
    Karplus:{
      methods:[ 'note','trigger' ],
    },
    Kick:{
      methods:[ 'note','trigger' ],
    },
    Monosynth:{
      methods:[ 'note','trigger' ],
    },
    Sampler:{
      methods:[ 'note', 'trigger', 'loadFile', 'loadBuffer' ],
    },
    Multisampler:{
      methods:[ 'note', 'trigger', 'pick', 'pickFile', 'pickplay', 'loadSample', 'setpan', 'setrate' ], 
    },
    Soundfont:{
      methods:[ 'note', 'trigger', 'midinote', 'midichord', 'chord', 'load', 'setpan', 'setrate' ], 
    },
    Snare:{
      methods:[ 'note','trigger' ],
    },
    Synth:{
      methods:[ 'note','trigger' ],
    },
    Complex:{
      methods:[ 'note','trigger' ],
    },
    Tom:{
      methods:[ 'note','trigger' ],
    },
    PolySynth:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyComplex:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyFM:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyKarplus:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyMono:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyConga:{
      methods:[ 'chord','note','trigger' ],
    },
    PolyTom:{
      methods:[ 'chord','note','trigger' ],
    },
  },
  
}

module.exports = Instruments

},{"./ugen.js":128,"gibberish-dsp":174}],107:[function(require,module,exports){
module.exports = function( Audio ) {
  const Gibberish = Audio.Gibberish

  const fnc = function( props ){
    const name = props.name
    const type = props.type
    const properties = props.properties || {}
    const block = `
    const ugen = Object.create( Gibberish.prototypes[ '${type}' ] )
    const graphfnc = ${props.constructor.toString()}

    const proxy = Gibberish.factory( ugen, graphfnc(), '${name}', ${JSON.stringify(properties)} )
    return proxy`

    Gibberish[ name ] = new Function( block )

    Gibberish.worklet.port.postMessage({
      name,
      address:'addConstructor',
      constructorString:`function( Gibberish ) {
      const fnc = ${Gibberish[ name ].toString()}

      return fnc
    }`
    })

    const out = Audio.Ugen( 
      Gibberish[ name  ],
      { properties, methods:[], name, category:'instruments'},
      Audio 
    )
    return out
  }

  return fnc
}

/* example use:
def = {
  name:'Mysine',
  type:'Ugen',
  properties:{ frequency:220 },
  constructor: function() {
    const gen = Gibberish.genish
    const graph = gen.cycle( gen.in('frequency') )
    return graph
  }
}
 
Mysine = Make( def )
sine = S()
sine.frequency.seq( [110,220,330], 1/8 )
sine.connect()
*/

},{}],108:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const Ugen      = require( './ugen.js' )

const Oscillators = {
  create( Audio ) {
    const oscillators = {}
    const defaults = {
      frequency:220, gain:.25, pulsewidth:.5
    }
    for( let oscillatorName in Gibberish.oscillators ) {
      const gibberishConstructor = Gibberish.oscillators[ oscillatorName ]

      //const methods = Oscillators.descriptions[ oscillatorName ] === undefined ? null : Oscillators.descriptions[ oscillatorName ].methods
      const description = { 
        properties:defaults, 
        methods:[],
        name:oscillatorName,
        category:'oscillators'
      }

      oscillators[ oscillatorName ] = Ugen( gibberishConstructor, description, Audio )

    }
    return oscillators
  },

  descriptions: {},
  
}

module.exports = Oscillators

},{"./ugen.js":128,"gibberish-dsp":174}],109:[function(require,module,exports){
const Presets = {
  process( description, args, Audio ) {
    let output

    // if the constructor arugment is not a string then no preset is being used
    if( typeof args[0] === 'object' ) {
      output = args[ 0 ]  
    }else if( typeof args[0] === 'string' ){
      if( args[0] === 'inspect' ) return null
      output = {}
      const preset = Presets[ description.category ][ description.name ][ args[0] ]

      if( preset !== undefined ) {
        for( let key in preset ) {
          if( key === 'presetInit' ) continue
          let value = preset[ key ]

          // if a value is a function, run the function to get the new value. these
          // preset functions are passed the main audio object, which they can typically
          // use, for example, to query the current sample rate.
          output[ key ] = typeof value === 'function' ? value( Audio ) : value
        }
        
        if( preset.presetInit !== undefined ) {
          output.__presetInit__ = preset.presetInit 
        } 
      }else{
        console.warn( `The preset ${args[0]} for the ${description.category.slice(0,-1)} ${description.name} does not exist.` )
      }
      // if there is an extra argument to modify the preset...
      if( args.length > 1 ) {
        Object.assign( output, args[1] )
      }
    }else{
      output = {}
    }
    
    if( description.__defaults__ !== undefined ) {
      console.log( 'defaults:', description.__defaults__ )
      Object.assign( output, description.__defaults__ )
    }

    return output
  },

  instruments: {
    Complex: require( './presets/complex_presets.js' ),
    Synth: require( './presets/synth_presets.js' ),
    FM:    require( './presets/fm_presets.js' ),
    Monosynth: require( './presets/monosynth_presets.js' ),
    PolyMono: require( './presets/monosynth_presets.js' ),
    Snare: require( './presets/snare_presets.js' ),
    Kick: require( './presets/kick_presets.js' ),
    Hat: require( './presets/hat_presets.js' ),

    EDrums: require( './presets/edrums_presets.js' ),
    Drums:  require( './presets/drums_presets.js' ),
    Multisampler: require( './presets/multisampler.js' ),
    Soundfont:    require( './presets/soundfont_presets.js' )
  },

  effects: {
    Chorus: require( './presets/chorus_presets.js' ),
    Distortion: require( './presets/distortion_presets.js' ),
    Flanger: require( './presets/flanger_presets.js' ),
    Reverb: require( './presets/reverb.js' ),
    Delay: require( './presets/delay_presets.js' ),
  },

  misc: {
    Bus2: require( './presets/bus2_presets.js' )
  }

}

Presets.instruments.Sampler   = Presets.instruments.Multisampler
Presets.instruments.PolySynth = Presets.instruments.Synth
Presets.instruments.PolyFM = Presets.instruments.FM
Presets.instruments.PolyMono = Presets.instruments.Monosynth

module.exports = Presets

},{"./presets/bus2_presets.js":110,"./presets/chorus_presets.js":111,"./presets/complex_presets.js":112,"./presets/delay_presets.js":113,"./presets/distortion_presets.js":114,"./presets/drums_presets.js":115,"./presets/edrums_presets.js":116,"./presets/flanger_presets.js":117,"./presets/fm_presets.js":118,"./presets/hat_presets.js":119,"./presets/kick_presets.js":120,"./presets/monosynth_presets.js":121,"./presets/multisampler.js":122,"./presets/reverb.js":123,"./presets/snare_presets.js":124,"./presets/soundfont_presets.js":125,"./presets/synth_presets.js":126}],110:[function(require,module,exports){
module.exports = {

  'spaceverb': {
    presetInit: function( audio ) {
      this.fx.verb = audio.effects.Freeverb({ roomSize:.985, dry:1 })
      this.fx.add( this.fx.verb )
    }
  },
  'echoverb.1/3': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/3, feedback:.35, wetdry:.5 })
      this.fx.reverb  = audio.effects.Freeverb({ roomSize:.985, dry:1 })
      this.fx.add( this.fx.delay )
      this.fx.add( this.fx.reverb )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
      this.roomSize = this.fx.reverb.roomSize
    }
  },
  'echoverb.1/6': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/6, feedback:.35, wetdry:.5 })
      this.fx.verb  = audio.effects.Freeverb({ roomSize:.985, dry:1 })
      this.fx.add( this.fx.delay, this.fx.reverb )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
      this.roomSize = this.fx.reverb.roomSize
    }
  },
  'delay.1/6': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/6, feedback:.35, wetdry:.5 })
      this.fx.add( this.fx.delay )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
    }
  },
  'delay.1/3': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/3, feedback:.35, wetdry:1 })
      this.fx.add( this.fx.delay )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
    }
  }, 
  'delay.1/6.fb': {
    presetInit: function( audio ) {
      this.delay = audio.effects.Delay({ time:1/6, feedback:.825, wetdry:1 })
      this.fx.add( this.delay ) 
    }
  },
  'delay.1/3.fb': {
    presetInit: function( audio ) {
      this.delay = audio.effects.Delay({ time:1/3, feedback:.825, wetdry:1 })
      this.fx.add( this.delay )
    }
  },
  'delay.1/5': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/5, feedback:.35, wetdry:1 })
      this.fx.add( this.fx.delay )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
    }
  },
  'delay.1/8': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/8, feedback:.35, wetdry:1 })
      this.fx.add( this.fx.delay )
      this.feedback = this.fx.delay.feedback
      this.time = this.fx.delay.time
    }
  },
  'delay.1/9': {
    presetInit: function( audio ) {
      this.fx.delay = audio.effects.Delay({ time:1/9, feedback:.35, wetdry:1 })
      this.fx.add( this.fx.delay )
    }
  },
}

},{}],111:[function(require,module,exports){
module.exports = {

  lush: {
    fastFrequency:4,
    fastGain:.425,
    slowGain:3.5,
    slowFrequency:1,
    presetInit: function( audio ) {
      const gen = audio.Gen.ugens
      this.mod1 = audio.Gen.make( audio.Gen.ugens.cycle(.1) ).connect( this.fastFrequency )
      //this.fastGain =  audio.Gen.make( gen.add( .425, gen.cycle(.1) ) )
      this.mod2 = audio.Gen.make( audio.Gen.ugens.cycle(.05) ).connect( this.slowGain )
      //this.slowGain = audio.Gen.make( gen.add( 4.5, gen.cycle(.05) ) )
    }
  },

  warbly: {
    fastFrequency:4,
    slowGain:3,
    slowFrequency:1,
    fastGain:1.5,
    presetInit: function( audio ) {
      this.mod1 = audio.Gen.make( audio.Gen.ugens.cycle(.1) ).connect( this.fastFrequency )
      this.mod2 = audio.Gen.make( audio.Gen.ugens.cycle(.05) ).connect( this.slowGain )
    }
  }

}

},{}],112:[function(require,module,exports){
module.exports = {
  'plucked': {
    bias:.35,
    gain:1,
    decay:1/5,
    pregain:4,
    description:'a short, clean sounding preset with a minimum of distortion/wavefolding.'
  },
  
  'perc': {
    bias:.35,
    gain:1,
    decay:1/5,
    pregain:5,
    description:'a short, clean sounding preset with a minimum of distortion/wavefolding.'
  },

  stab: {
    waveform:'saw', 
    decay:1/4, 
    bias:.1, 
    filterMult:0, 
    cutoff:.8, 
    Q:.15, 
    pregain:10, 
    postgain:.25, 
    filterModel:2, 
    saturation:50,
    presetInit( audio ) {
      this.fx.push( audio.effects.Distortion('earshred') )
    },
    description:'a short, heavily distorted and filtered sound. in addition to the standard Complex wavefolding, this preset also adds an additional Distortion effect (preset earsred).'
  }

}

},{}],113:[function(require,module,exports){
module.exports = {
  '1/3' : {
    time:1/3, feedback:.35, wetdry:1 
  },
  '1/6' : {
    time:1/6, feedback:.35, wetdry:1
  },
  '1/8' : {
    time:1/8, feedback:.35, wetdry:1
  },
  '1/9' : {
    time:1/9, feedback:.35, wetdry:1
  },
  '1/3.fb' : {
    time:1/3, feedback:.85, wetdry:1 
  },
  '1/6.fb' : {
    time:1/6, feedback:.85, wetdry:1
  },
  '1/8.fb' : {
    time:1/8, feedback:.85, wetdry:1
  },
  '1/9.fb' : {
    time:1/9, feedback:.85, wetdry:1
  },
  '1/3.dry' : {
    time:1/3, feedback:.35, wetdry:.5 
  },
  '1/6.dry' : {
    time:1/6, feedback:.35, wetdry:.5
  },
  '1/8.dry' : {
    time:1/8, feedback:.35, wetdry:.5
  },
  '1/9.dry' : {
    time:1/9, feedback:.35, wetdry:.5
  },
  '1/3.dry.fb' : {
    time:1/3, feedback:.85, wetdry:.5 
  },
  '1/6.dry.fb' : {
    time:1/6, feedback:.35, wetdry:.5
  },
  '1/8.dry.fb' : {
    time:1/8, feedback:.85, wetdry:.5
  },
  '1/9.dry.fb' : {
    time:1/9, feedback:.85, wetdry:.5
  }
}

},{}],114:[function(require,module,exports){
module.exports = {

  crunch: {
    pregain:10, 
    postgain:.35
  },

  earshred: {
   pregain: 500,
   postgain: .06,
   shape1: .001,
   shape2: -3
  },

  bass: {
    pregain:10,
    postgain:.35,
    shape1:3,
    shape2:10
  },

  medium: {
    pregain:40,
    postgain:.125/4
  }
}

},{}],115:[function(require,module,exports){
module.exports = {

  earshred: {
    // unfortunately you can't write normal presets for
    // Drums and EDrums, because they don't go through
    // the Ugen constructor in the typical way (they are
    // processed as busses). It would also
    // be difficult to define properties for the individual
    // drum components (snare,kick etc.) using the standard
    // preset format. For these reasons, all property assignment
    // must be performed after initialization. 
    presetInit( audio ) {
      this.fx.add( audio.effects.Distortion('earshred') )
    }
  },

  hpf: {
    presetInit( audio ) {
      // XXX have to specify input because of filter errors...
      const hpf = audio.filters.Filter12Biquad({ input:this, mode:1, cutoff:.25, Q:.5, isStereo:true })
      this.fx.add( hpf )
      this.hpf = hpf
   }
  },
  lpf: {
    presetInit( audio ) {
      // XXX have to specify input because of filter errors...
      const lpf = audio.filters.Filter24Moog({ input:this, mode:0, cutoff:.25, Q:.75, isStereo:true })
      this.fx.add( lpf )
      this.lpf = lpf
    }
  }

}

},{}],116:[function(require,module,exports){
module.exports = {

  earshred: {
    // unfortunately you can't write normal presets for
    // Drums and EDrums, because they don't go through
    // the Ugen constructor in the typical way (they are
    // processed as busses). It would also
    // be difficult to define properties for the individual
    // drum components (snare,kick etc.) using the standard
    // preset format. For these reasons, all property assignment
    // must be performed after initialization. 
    presetInit( audio ) {
      this.fx.add( audio.effects.Distortion('earshred') )

      this.kick.frequency = 55
      this.kick.decay = .975

      this.snare.tune = .25
      this.snare.snappy = 1.5
    }
  },

  warbly: {
    presetInit( audio ) {
      const bc = audio.effects.BitCrusher({ input:this, sampleRate:.35, bitDepth:.5, isStereo:true })
      this.fx.add( bc )
      this.bitcrusher = bc
      const flanger = audio.effects.Flanger({ input:this, frequency:.8, feedback:.935, isStereo:true })
      this.fx.add( flanger )
      this.flanger = flanger
      this.gain.value *= 1.35
   }
  },
  hpf: {
    presetInit( audio ) {
      const hpf = audio.filters.Filter12Biquad({ input:this, mode:1, cutoff:.35, isStereo:true })
      this.fx.add( hpf )
      this.hpf = hpf
   }
  },
  lpf: {
    presetInit( audio ) {
      const lpf = audio.filters.Filter24Moog({ input:this, mode:1, cutoff:.35, isStereo:true })
      this.fx.add( lpf )
      this.lpf = lpf
    }
  },
  short: {
    presetInit( audio ) {
      this.kick.decay = .8
      this.snare.decay = .05
      this.closedHat.decay = .05
      this.openHat.decay = .2
      this.cowbell.decay = .1
    }
  },
  long: {
    presetInit( audio ) {
      this.kick.decay = .975
      this.snare.decay = .1
      this.closedHat.decay = .1
      this.openHat.decay = .25
    }
  }

}

},{}],117:[function(require,module,exports){
module.exports = {
  moderate: {
    feedback: .25,
    frequency:.5,
    offset:.1
  },

  extreme: {
    feedback:.85,
    offset:.05,
    frequency:4
  },

}

},{}],118:[function(require,module,exports){
module.exports = {

  bass : {
    cmRatio:1,
    index:3,
    attack:1/256,
    decay:1/16,
    octave:-2
  },
  deepbass : {
    cmRatio:1,
    index:3,
    attack:1/256,
    decay:1/2,
    octave:-3,
    feedback:.005
  },
  kick:{
    attack : 1/4096,
    index : 5,
    cmRatio : 4/3,
    decay : 1/4,
    octave : -3,
    shape:'exponential'
  },

  perc:{
    attack : 1/4096,
    index : .5,
    cmRatio : 4/3,
    decay : 1/8,
    shape:'exponential',
    presetInit: function( audio ) {
      if( this.voices && this.voices.length > 1 ) {
        this.spread( .99 )
      }
    }
  },

  'bass.electro' : {
    cmRatio:1,
    index:3,
    attack:1/256,
    decay:1/16,
    octave:-2,
    filterModel:2,
    saturation:200,
    Q:.25,
    cutoff:.6835
  },

  glockenspiel : {
    cmRatio	: 3.5307,
    index 	: 1,
    attack	: audio => audio.Clock.ms( 1 ),
    decay	: audio => audio.Clock.ms( 1000 ),
  },

  'glockenspiel.short' : {
    cmRatio	: 3.5307,
    index 	: 1,
    attack	: audio => audio.Clock.ms( 1 ),
    decay	  : 1/12,
    octave  : 1,
    gain    :.05 
  },

  frog : { //ljp
    cmRatio: 0.1,
    index: 2.0,
    attack: audio => audio.Clock.ms( 300 ), 
    decay: audio => audio.Clock.ms( 5 )
  },

  gong : {
    cmRatio: 1.4,
	  index: .95,
	  attack: 1/256,
	  decay: 2,
	},

  drum : {
	  cmRatio: 1.40007,
	  index: 2,
	  attack: 1/2048,
    decay: audio => audio.Clock.ms(1000) 
	},

	drum2: {
		cmRatio: 1 + Math.sqrt(2),
		index: .2,
		attack: 1/256,
		decay: audio => audio.Clock.ms(20) 
  },

	brass : {
    maxVoices:4,
	  cmRatio : 1 / 1.0007,
		index	: 5,
		attack: audio => audio.Clock.ms(100),
		decay	: 1,
    gain:.5,
  },

	clarinet : {
		cmRatio	: 3 / 2,
		index	: 1.5,
		attack: audio => audio.Clock.ms( 50 ), 
		decay:  audio => audio.Clock.ms( 200 )
  },

  fun : {
    decay:1/2,
    feedback: .0015,
    gain:.1
  },

  chirp: {
		attack: audio => audio.Clock.ms( 1 ), 
    index : 1.15,
    glide : 1,
    feedback : .5,
    cmRatio : 1.5,
    decay : 1/4,
    octave : 1,
    shape:'exponential'
  }
}

},{}],119:[function(require,module,exports){
module.exports = {
  short: {
    decay:.01
  }
}

},{}],120:[function(require,module,exports){
module.exports = {

  deep: {
    frequency:55,
    decay:.96,
  },

  tight: {
    frequency:80, 
    decay:.85,
    tone:.5
  },

  long: {
    frequency:80,
    decay:.975,
  },

  boom: {
    frequency:55,
    decay:.99,
    tone:.05
  }


}

},{}],121:[function(require,module,exports){
module.exports = {

  'short.dry' : { 
    attack: audio => audio.Clock.ms(.25), 
    decay: 1/12,
    cutoff:.3,
    filterModel:1,
    filterMult:3
  },

  arpy : {
    antialias:true,
    attack: audio => audio.Clock.ms(.5),
    decay: 1/16, 
    gain:0.2,
    cutoff:.15,
    filterMult:1,
    Q:.3,
    filterModel:1,
    filterMode:1
  },

  lead : {
    presetInit : function( audio ) { this.fx.push( audio.effects.Delay({ time:1/6, feedback:.65 }) )  },
    attack: audio => audio.Clock.ms(.5),
    decay: 1/2, 
    octave3:0,
    cutoff:1,
    filterMult:2.5,
    Q:.975,
    filterModel:1,
    filterMode:1
  },
  // not as bright / loud
  lead2 : {
    presetInit : function( audio ) { this.fx.push( audio.effects.Delay({ time:1/6, feedback:.65 }) )  },
    attack: audio => audio.Clock.ms(.5),
    decay: 1/2, 
    octave3:0,
    cutoff:1,
    filterMult:2.5,
    Q:.8,
    gain:.175,
    filterModel:1,
    filterMode:1
  },

  dirty: { 
    gain:.325,
    filterModel:2,
    attack:1/2048, 
    decay:1/4, 
    cutoff:1.5, 
    filterMult:4, 
    saturation:10000, 
    Q:.225, 
    detune2:-.505,
    detune3:-.5075,
    octave:-2,
    waveform:'pwm', 
    pulsewidth:.15 
  },

  winsome : {
    presetInit : function( audio ) { 
      this.lfo = audio.oscillators.Sine({ frequency:2, gain:.075 })
      this.lfo.connect( this.cutoff )
      this.lfo.connect( this.detune2 )
      this.lfo.connect( this.detune3 )
    },
    attack: audio => audio.Clock.ms(1), 
    decay:1,
    cutoff:.2,
  },

  pluckEcho: {
    presetInit : function( audio ) { this.fx.push( audio.effects.Delay({ time:1/6, feedback:.65 }) )  },
    attack: audio => audio.Clock.ms(.1),
    decay: 1/16, 
    octave3:0,
    cutoff:.15,
    filterMult:1,
    Q:.5,
    filterModel:1,
    filterMode:1,
    panVoices:true
  },

  bassPad : { 
    attack: audio => audio.Clock.ms(.1),
    decay: 2,	
    octave:-4,
    cutoff: .225,
    filterMult:3.5,
    Q:.5,
    detune2:1.0125,
    detune3:1-.0125
  },

  warble : { 
    attack: audio => audio.Clock.ms(1),
    decay: 1/2,	
    octave: -3,
    octave2 : -1,
    cutoff: .8,
    filterMult:3,
    Q:.75,
    detune2:.0275,
    detune3:-.0275
  }, 
  dark: { 
    attack: audio => audio.Clock.ms(1),
    decay: 1,	
    octave: -3,
    octave2 : -1,
    cutoff: 1.5,
    filterMult:3,
    Q:.75,
    detune2:.0125,
    detune3:-.0125
  },
  bass: { 
    attack: audio => audio.Clock.ms(1),
    decay: 1/4,	
    octave: -3,
    cutoff: .35,
    filterMult:3,
    Q:.15,
    glide:1250,
    waveform:'pwm',
    pulsewidth:.45,
    detune2:.005,
    detune3:-.005
  },
  bass2 : {
    attack: audio => audio.Clock.ms(1), 
    decay:	1/6,
    octave: -2,
    octave2 : 0,
    octave3 : 0,      
    cutoff: .5,
    filterMult:2,
    Q:.5,
    gain:.35
  },
  
  edgy: {
    decay:1/8,
    attack:1/1024,
    octave: -2,
    octave2: -1,
    cutoff: .5,
    filterMult:3,
    Q:.75, 
    waveform:'pwm', 
    pulsewidth:.2,
    detune2:0,
    gain:.2
  },

  easy : {
    attack: audio=> audio.Clock.ms(1),
    decay:2,
    cutoff:.3,
    glide:.9995,
  },
  
  easyfx : {
    attack: audio=> audio.Clock.ms(1),
    decay:2,
    presetInit: function( audio ) {
      this.fx.add( audio.effects.Delay( Clock.time(1/6), .3) )
    },
    cutoff:.125,
    glide:1000,
    detune2:.001,
    detune3:-.001,
    filterModel:1,
    filterMult:4,
    Q:.5,
  },
  chords: {
    attack: audio=> audio.Clock.ms(1),
    decay:1/2,
    presetInit: function( audio ) {
      this.fx.add( audio.effects.Delay( Clock.time(1/6), .5) )
    },
    amp:.3,
    octave2:0,
    octave3:0,
    cutoff:.5,
    glide:.9995,
    filterModel:1,
    filterMult:3,
    Q:.75,
  },

  wander: {
    attack: 1/2,
    decay:  2,
    presetInit: function( audio ) {},
    amp:.2,
    detune2:.501,
    detune3:-.501,
    cutoff:.2,
    glide:5000,
    filterModel:1,
    filterMult:1.5,
    Q:.25,
  },

  'chords.short': {
    attack: audio=> audio.Clock.ms(1),
    decay:1/8,
    presetInit: function( audio ) {
      this.delay = audio.effects.Delay({ delay:audio.Clock.time(1/8), feedback:.5, wetdry:.25 }) 
      this.fx.push( this.delay )
    },
    amp:.3,
    octave2:0,
    octave3:0,
    cutoff:.35,
    glide:1,
    filterModel:1,
    filterMult:3,
    Q:.5,
  },

  jump: { 
    decay:1/2048, 
    useADSR:true, 
    sustain:1/4, 
    release:1/1024,  
    maxVoices:3, 
    cutoff:35, 
    filterMult:0,
    detune2:.01,
    detune3:-.01 
  },

  shinybass2: {
    Q:.125,
    cutoff:35,
    useADSR:true,
    decay:1/10,
    sustain:1/4,
    filterMult:0,
    release:1/1024,
    octave:-3,
    panVoices:true
  },
  shinybass: {
    Q:.125,
    cutoff:5,
    useADSR:false,
    attack:1/1024,
    decay:1/10,
    filterMult:0,
    octave:-3,
    panVoices:true
  },

  'bass.muted': {
    Q:.45,
    cutoff:.5,
    useADSR:true,
    shape:'exponential',
    decay:1/8,
    sustain:1/4,
    release:1/1024,
    octave:-3,
    panVoices:true,
    filterMult:.5
  },
  'bass.stab': {
    Q:.35,
    detune2:1.5,
    detune3:.5,
    cutoff:.5,
    useADSR:true,
    shape:'exponential',
    decay:1/10,
    sustain:1/4,
    release:1/1024,
    octave:-3,
    filterMult:1.85,
    gain:.75
  },
  short: { 
    attack:1/4096,
    decay:1/16, 
    maxVoices:3, 
    cutoff:1.5, 
    filterMult:0,
    useADSR:false,
    gain:.5
  },

  noise: {
    decay:1/2,
    cutoff:.3,
    glide:10000,
    detune3:0,
    detune2:0,
    filterMult:0,
    presetInit: function( audio ) { this.fx.add( audio.effects.Gain(.1), audio.effects.Delay(1/6,.75) ) }
  },

}

},{}],122:[function(require,module,exports){
module.exports = {

  drums: { 
    files:[
      'resources/audiofiles/kick.wav',
      'resources/audiofiles/hat.wav',
      'resources/audiofiles/snare.wav',
      'resources/audiofiles/openhat.wav'
    ],
    presetInit() {
      this.length = 4
    }
  },
  test: {
    files:[
      'resources/audiofiles/kick.wav',
      'resources/audiofiles/openhat.wav'
    ],
    presetInit() {
      this.length = 2
    }
  },
  beatbox: {
    files:[
      'resources/audiofiles/beatbox/^k.wav',
      'resources/audiofiles/beatbox/^p.wav',
      'resources/audiofiles/beatbox/^tss.wav',
      'resources/audiofiles/beatbox/8.wav',
      'resources/audiofiles/beatbox/a.wav',
      'resources/audiofiles/beatbox/b.wav',
      'resources/audiofiles/beatbox/d.wav',
      'resources/audiofiles/beatbox/dot.wav',
      'resources/audiofiles/beatbox/duf.wav',
      'resources/audiofiles/beatbox/f.wav',
      'resources/audiofiles/beatbox/k.wav',
      'resources/audiofiles/beatbox/h.wav',
      'resources/audiofiles/beatbox/m.wav',
      'resources/audiofiles/beatbox/n.wav',
    ],
    presetInit() {
      this.length = 14
    }
  },
  bleeps: {
    files:[
      'resources/audiofiles/bent-bleeps/51063__stamperadam__bleep1.wav',
      'resources/audiofiles/bent-bleeps/51064__stamperadam__bleep2.wav',
      'resources/audiofiles/bent-bleeps/51065__stamperadam__clap.wav',
      'resources/audiofiles/bent-bleeps/51066__stamperadam__click.wav',
      'resources/audiofiles/bent-bleeps/51067__stamperadam__click1.wav',
      'resources/audiofiles/bent-bleeps/51068__stamperadam__g1.wav',
      'resources/audiofiles/bent-bleeps/51069__stamperadam__g2.wav',
      'resources/audiofiles/bent-bleeps/51070__stamperadam__g3.wav',
      'resources/audiofiles/bent-bleeps/51071__stamperadam__g4.wav',
      'resources/audiofiles/bent-bleeps/51072__stamperadam__g5.wav',
      'resources/audiofiles/bent-bleeps/51073__stamperadam__g6.wav',
      'resources/audiofiles/bent-bleeps/51074__stamperadam__g7.wav',
      'resources/audiofiles/bent-bleeps/51075__stamperadam__g8.wav',
      'resources/audiofiles/bent-bleeps/51076__stamperadam__g9.wav',
      'resources/audiofiles/bent-bleeps/51077__stamperadam__glitch.wav',
      'resources/audiofiles/bent-bleeps/51078__stamperadam__hatt.wav',
      'resources/audiofiles/bent-bleeps/51079__stamperadam__hit.wav',
      'resources/audiofiles/bent-bleeps/51080__stamperadam__hitt.wav',
      'resources/audiofiles/bent-bleeps/51081__stamperadam__hum.wav',
      'resources/audiofiles/bent-bleeps/51082__stamperadam__kik.wav',
      'resources/audiofiles/bent-bleeps/51083__stamperadam__snar.wav',
      'resources/audiofiles/bent-bleeps/51084__stamperadam__wa.wav',
    ],
    presetInit() {
      this.length = 22
    }
  },
  cr7030: {
    files:[
      'resources/audiofiles/cr7030/68602__birdflu__bongo7030.wav',
      'resources/audiofiles/cr7030/68603__birdflu__clave7030.wav',
      'resources/audiofiles/cr7030/68606__birdflu__hatclosed7030.wav',
      'resources/audiofiles/cr7030/68607__birdflu__hatopen7030.wav',
      'resources/audiofiles/cr7030/68608__birdflu__kick7030.wav',
      'resources/audiofiles/cr7030/68609__birdflu__snare7030.wav',
      'resources/audiofiles/cr7030/68610__birdflu__tom7030.wav',
    ],
    presetInit(){
      this.length = 7
    }
  },
  kicks: {
    files:[
      'resources/audiofiles/kicks/249200__netr-si__kick-32.wav',
      'resources/audiofiles/kicks/249201__netr-si__kick-33.wav',
      'resources/audiofiles/kicks/249202__netr-si__kick-27.wav',
      'resources/audiofiles/kicks/249203__netr-si__kick-28.wav',
      'resources/audiofiles/kicks/249204__netr-si__kick-25.wav',
      'resources/audiofiles/kicks/249205__netr-si__kick-26.wav',
      'resources/audiofiles/kicks/249206__netr-si__kick-30.wav',
      'resources/audiofiles/kicks/249207__netr-si__kick-31.wav',
      'resources/audiofiles/kicks/249208__netr-si__kick-29.wav',
      'resources/audiofiles/kicks/249209__netr-si__kick-3.wav',
      'resources/audiofiles/kicks/249211__netr-si__kick-42.wav',
      'resources/audiofiles/kicks/249212__netr-si__kick-41.wav',
      'resources/audiofiles/kicks/249213__netr-si__kick-35.wav',
      'resources/audiofiles/kicks/249214__netr-si__kick-34.wav',
      'resources/audiofiles/kicks/249215__netr-si__kick-37.wav',
      'resources/audiofiles/kicks/249216__netr-si__kick-36.wav',
      'resources/audiofiles/kicks/249217__netr-si__kick-39.wav',
      'resources/audiofiles/kicks/249218__netr-si__kick-38.wav',
      'resources/audiofiles/kicks/249219__netr-si__kick-40.wav',
      'resources/audiofiles/kicks/249220__netr-si__kick-4.wav',
      'resources/audiofiles/kicks/249222__netr-si__kick-87.wav',
      'resources/audiofiles/kicks/249223__netr-si__kick-9.wav',
      'resources/audiofiles/kicks/249224__netr-si__kick-83.wav',
      'resources/audiofiles/kicks/249225__netr-si__kick-84.wav',
      'resources/audiofiles/kicks/249226__netr-si__kick-85.wav',
      'resources/audiofiles/kicks/249227__netr-si__kick-86.wav',
      'resources/audiofiles/kicks/249228__netr-si__kick-8.wav',
      'resources/audiofiles/kicks/249229__netr-si__kick-80.wav',
      'resources/audiofiles/kicks/249230__netr-si__kick-81.wav',
      'resources/audiofiles/kicks/249231__netr-si__kick-82.wav',
      'resources/audiofiles/kicks/249232__netr-si__kick-20.wav',
      'resources/audiofiles/kicks/249233__netr-si__kick-2.wav',
      'resources/audiofiles/kicks/249234__netr-si__kick-19.wav',
      'resources/audiofiles/kicks/249235__netr-si__kick-18.wav',
      'resources/audiofiles/kicks/249236__netr-si__kick-24.wav',
      'resources/audiofiles/kicks/249237__netr-si__kick-23.wav',
      'resources/audiofiles/kicks/249238__netr-si__kick-22.wav',
      'resources/audiofiles/kicks/249239__netr-si__kick-21.wav',
      'resources/audiofiles/kicks/249240__netr-si__kick-25-2.wav',
      'resources/audiofiles/kicks/249241__netr-si__kick-25-1.wav',
      'resources/audiofiles/kicks/249242__netr-si__kick-12.wav',
      'resources/audiofiles/kicks/249243__netr-si__kick-11.wav',
      'resources/audiofiles/kicks/249244__netr-si__kick-10.wav',
      'resources/audiofiles/kicks/249245__netr-si__kick-1.wav',
      'resources/audiofiles/kicks/249246__netr-si__kick-15.wav',
      'resources/audiofiles/kicks/249247__netr-si__kick-14.wav',
      'resources/audiofiles/kicks/249248__netr-si__kick-14-1.wav',
      'resources/audiofiles/kicks/249249__netr-si__kick-13.wav',
      'resources/audiofiles/kicks/249250__netr-si__kick-17.wav',
      'resources/audiofiles/kicks/249251__netr-si__kick-16.wav',
      'resources/audiofiles/kicks/249252__netr-si__kick-67.wav',
      'resources/audiofiles/kicks/249253__netr-si__kick-68.wav',
      'resources/audiofiles/kicks/249254__netr-si__kick-65.wav',
      'resources/audiofiles/kicks/249255__netr-si__kick-66.wav',
      'resources/audiofiles/kicks/249256__netr-si__kick-63.wav',
      'resources/audiofiles/kicks/249257__netr-si__kick-64.wav',
      'resources/audiofiles/kicks/249258__netr-si__kick-61.wav',
      'resources/audiofiles/kicks/249259__netr-si__kick-62s.wav',
      'resources/audiofiles/kicks/249260__netr-si__kick-69.wav',
      'resources/audiofiles/kicks/249261__netr-si__kick-7.wav',
      'resources/audiofiles/kicks/249262__netr-si__kick-75.wav',
      'resources/audiofiles/kicks/249263__netr-si__kick-74.wav',
      'resources/audiofiles/kicks/249264__netr-si__kick-77.wav',
      'resources/audiofiles/kicks/249265__netr-si__kick-76.wav',
      'resources/audiofiles/kicks/249266__netr-si__kick-71.wav',
      'resources/audiofiles/kicks/249267__netr-si__kick-70.wav',
      'resources/audiofiles/kicks/249268__netr-si__kick-73.wav',
      'resources/audiofiles/kicks/249269__netr-si__kick-72.wav',
      'resources/audiofiles/kicks/249270__netr-si__kick-79.wav',
      'resources/audiofiles/kicks/249271__netr-si__kick-78.wav',
      'resources/audiofiles/kicks/249272__netr-si__kick-43.wav',
      'resources/audiofiles/kicks/249273__netr-si__kick-44.wav',
      'resources/audiofiles/kicks/249274__netr-si__kick-45.wav',
      'resources/audiofiles/kicks/249275__netr-si__kick-46.wav',
      'resources/audiofiles/kicks/249276__netr-si__kick-47.wav',
      'resources/audiofiles/kicks/249277__netr-si__kick-48.wav',
      'resources/audiofiles/kicks/249278__netr-si__kick-49.wav',
      'resources/audiofiles/kicks/249279__netr-si__kick-5.wav',
      'resources/audiofiles/kicks/249280__netr-si__kick-50.wav',
      'resources/audiofiles/kicks/249281__netr-si__kick-51.wav',
      'resources/audiofiles/kicks/249282__netr-si__kick-60.wav',
      'resources/audiofiles/kicks/249283__netr-si__kick-6.wav',
      'resources/audiofiles/kicks/249284__netr-si__kick-59.wav',
      'resources/audiofiles/kicks/249285__netr-si__kick-58.wav',
      'resources/audiofiles/kicks/249286__netr-si__kick-57.wav',
      'resources/audiofiles/kicks/249287__netr-si__kick-56.wav',
      'resources/audiofiles/kicks/249288__netr-si__kick-55.wav',
      'resources/audiofiles/kicks/249289__netr-si__kick-54.wav',
      'resources/audiofiles/kicks/249290__netr-si__kick-53.wav',
      'resources/audiofiles/kicks/249291__netr-si__kick-52.wav',
    ],
    presetInit() { this.length = 90 }
  }
}

},{}],123:[function(require,module,exports){
module.exports = {

  'space': {
    roomSize:.985, 
    dry:1 
  }
}

},{}],124:[function(require,module,exports){
module.exports = {

  snappy: {
    decay:.125,
    snappy:1.5,
    tune:.1
  },

  dull: {
    snappy:.15,
    decay:.15,
    tune:-.1
  }

}

},{}],125:[function(require,module,exports){
 const names = [
    "Acoustic Grand Piano",
    "Bright Acoustic Piano",
    "Electric Grand Piano",
    "Honky-tonk Piano",
    "Electric Piano 1",
    "Electric Piano 2",
    "Harpsichord",
    "Clavi",
    "Celesta",
    "Glockenspiel",
    "Music Box",
    "Vibraphone",
    "Marimba",
    "Xylophone",
    "Tubular Bells",
    "Dulcimer",
    "Drawbar Organ",
    "Percussive Organ",
    "Rock Organ",
    "Church Organ",
    "Reed Organ",
    "Accordion",
    "Harmonica",
    "Tango Accordion",
    "Acoustic Guitar (nylon)",
    "Acoustic Guitar (steel)",
    "Electric Guitar (jazz)",
    "Electric Guitar (clean)",
    "Electric Guitar (muted)",
    "Overdriven Guitar",
    "Distortion Guitar",
    "Guitar harmonics",
    "Acoustic Bass",
    "Electric Bass (finger)",
    "Electric Bass (pick)",
    "Fretless Bass",
    "Slap Bass 1",
    "Slap Bass 2",
    "Synth Bass 1",
    "Synth Bass 2",
    "Violin",
    "Viola",
    "Cello",
    "Contrabass",
    "Tremolo Strings",
    "Pizzicato Strings",
    "Orchestral Harp",
    "Timpani",
    "String Ensemble 1",
    "String Ensemble 2",
    "SynthStrings 1",
    "SynthStrings 2",
    "Choir Aahs",
    "Voice Oohs",
    "Synth Voice",
    "Orchestra Hit",
    "Trumpet",
    "Trombone",
    "Tuba",
    "Muted Trumpet",
    "French Horn",
    "Brass Section",
    "SynthBrass 1",
    "SynthBrass 2",
    "Soprano Sax",
    "Alto Sax",
    "Tenor Sax",
    "Baritone Sax",
    "Oboe",
    "English Horn",
    "Bassoon",
    "Clarinet",
    "Piccolo",
    "Flute",
    "Recorder",
    "Pan Flute",
    "Blown Bottle",
    "Shakuhachi",
    "Whistle",
    "Ocarina",
    "Lead 1 (square)",
    "Lead 2 (sawtooth)",
    "Lead 3 (calliope)",
    "Lead 4 (chiff)",
    "Lead 5 (charang)",
    "Lead 6 (voice)",
    "Lead 7 (fifths)",
    "Lead 8 (bass + lead)",
    "Pad 1 (new age)",
    "Pad 2 (warm)",
    "Pad 3 (polysynth)",
    "Pad 4 (choir)",
    "Pad 5 (bowed)",
    "Pad 6 (metallic)",
    "Pad 7 (halo)",
    "Pad 8 (sweep)",
    "FX 1 (rain)",
    "FX 2 (soundtrack)",
    "FX 3 (crystal)",
    "FX 4 (atmosphere)",
    "FX 5 (brightness)",
    "FX 6 (goblins)",
    "FX 7 (echoes)",
    "FX 8 (sci-fi)",
    "Sitar",
    "Banjo",
    "Shamisen",
    "Koto",
    "Kalimba",
    "Bag pipe",
    "Fiddle",
    "Shanai",
    "Tinkle Bell",
    "Agogo",
    "Steel Drums",
    "Woodblock",
    "Taiko Drum",
    "Melodic Tom",
    "Synth Drum",
    "Reverse Cymbal",
    "Guitar Fret Noise",
    "Breath Noise",
    "Seashore",
    "Bird Tweet",
    "Telephone Ring",
    "Helicopter",
    "Applause",
    "Gunshot"
  ]

module.exports = {}

for( let name of names ) {
  module.exports[ name ] = {
    presetInit( audio, props ) {
      this.load( names.indexOf( name ), props === undefined ? 0 : props.bank || 0 )
    }
  }
}


},{}],126:[function(require,module,exports){
module.exports = {

  acidBass: {
    Q:.9,
    filterModel:2,
    filterMult:4,
    cutoff:1.25,
    saturation:3.5,
    attack:1/8192,
    decay:1/10,
    octave:-3,
    glide:2000,
    description:`A sawtooth feeding a TB303-style lowpass filter, with high Q settings and a short envelope.`
  },

  acidBass2: {
    Q:.7,
    filterModel:2,
    filterMult:3.5,
    cutoff:.5,
    saturation:10,
    attack:1/8192,
    decay:1/10,
    octave:-2,
    glide:100
  },

  'bass.hollow': {
    Q:.2,
    filterModel:2,
    filterMult:4,
    cutoff:1.25,
    saturation:20,
    attack:1/8192,
    decay:1/4,
    octave:-3,
    glide:1000
  },

  'bleep.dry': { 
    attack:1/256, decay:1/32, 
    waveform:'sine' 
  },
  'bleep': { 
    attack:1/256, decay:1/32, 
    waveform:'sine' 
  },

  'bleep.echo': { 
    waveform:'sine', 
    attack:1/256, decay:1/32, 
    gain:.25,
    presetInit: function( audio ) {
      this.fx.push( audio.effects.Delay({ feedback:.5, time:1/12 }) )
    }
  },

  shimmer: {
    attack:1/128, decay:2,
    waveform:'pwm',
    filterModel:1,
    cutoff:1,
    filterMult:1,
    Q:.6,
    maxVoices:3,
    gain:.1,
    antialias:false,
    presetInit: function( audio ) {
      this.fx.add( audio.effects.Chorus('warbly') )
      this.pwmod = audio.Gen.make( audio.Gen.ugens.mul( audio.Gen.ugens.cycle(8), .275 ) )
      this.pwmod.connect( this.pulsewidth )
    }
  },

  stringPad: {
    attack:1/2, decay:1.5, gain:.015,
    presetInit: function( audio ) {
      this.fx.chorus = audio.effects.Chorus('lush')
      this.fx.add( this.fx.chorus  )
    }
  },

  cry: {
    attack:1/2, decay:1.5, gain:.045,
    panVoices:true,
    presetInit: function( audio ) {
      this.chorus = audio.effects.Chorus('lush', { isStereo:true })
      this.fx.add( this.chorus  )
      this.bitCrusher = audio.effects.BitCrusher({ bitDepth:.5, isStereo:true })
      this.fx.add( this.bitCrusher )
      //// gen( .5 + cycle( btof(16) ) * .35
      this.srmod = audio.Gen.make( audio.Gen.ugens.add( .5, audio.Gen.ugens.mul( audio.Gen.ugens.cycle(.125/2), .35 ) ) )
      this.bitCrusher.sampleRate = this.srmod
      this.delay = audio.effects.Delay({ time:1/6, feedback:.75 })
      this.fx.add( this.delay )
    }
  },

  brass: {
    attack:1/6, decay:1.5, gain:.05,
    filterModel:1, Q:.5575, cutoff:2,
    presetInit: function( audio ) {
      this.fx.add( audio.effects.Chorus('lush') )
      this.chorus = this.fx[0]
    }
  },

  'brass.short':{
    gain:.75,
    filterModel:1,
    antialias:true,
    attack:1/32,
    decay:1/16,
    filterMult:3,
    cutoff:.175,
    Q:.6
  },

  'pwm.squeak':{
    waveform:'pwm',
    attack:1/4096,
    decay:1/16,
    Q:.8,
    cutoff:.65,
    saturation:5,
    filterModel:2,
    glide:500
  },

  'pwm.short':{
    attack:1/1024,
    decay:1/8,
    antialias:true,
    waveform:'pwm'
  },

  chirp: { filterModel:2, cutoff:.325, decay:1/16 }, 

  'square.perc': { 
    waveform:'square', 
    shape:'exponential', 
    antialias:true, 
    filterModel:2, 
    cutoff:.25, 
    decay:1/8,
    panVoices:true
  },

  'square.perc.long': { 
    waveform:'square', 
    shape:'exponential', 
    antialias:true, 
    filterModel:2, 
    cutoff:.25, 
    decay:2,
    panVoices:true
  },

  rhodes:{
    waveform:'sine',
    presetInit( audio ) {
      this.tremolo = audio.effects.Tremolo()
      this.fx.add( this.tremolo )
    },
    decay:4,
    gain:.125,
    shape:'exponential'
  },

  blank: {
    filterModel:0,
    waveform:'sine',
    antialias:false
  }
}

},{}],127:[function(require,module,exports){
const Gibberish = require( 'gibberish-dsp' )
const serialize = require( 'serialize-javascript' )
const Tune      = require( './external/tune-api-only.js' )

let Gibber = null

const Theory = {
  // needed to force library to be serialized for transport to 
  // worklet processor, must use key:function() {} format
  // for methods for serialize to work
  __Tune:Tune,

  Tune:null,
  id:null,
  type: 'Audio',
  nogibberish:true,
  quality:'minor',
  baseNumber:60,
  __tuning:'et',
  __mode: 'aeolian',
  __root:440,
  __offset:0,
  __degree:'i',
  __loadingPrefix:'js/external/tune.json/', 
  __tunings:{
    et: {
      root:'60',
      mode:'absolute',
      frequencies:[
        261.62558,
        277.182617,
        293.664764,
        311.126984,
        329.627563,
        349.228241,
        369.994415,
        391.995422,
        415.304688,
        440,
        466.163757,
        493.883301,
        523.251083727363
      ],
      description:'equal tempered (edo)'
    }
  },  

  modes: {
    ionian:     [0,2,4,5,7,9,11],
    dorian:     [0,2,3,5,7,9,10],
    phrygian:   [0,1,3,5,7,8,10],
    lydian:     [0,2,4,6,7,9,11],
    mixolydian: [0,2,4,5,7,9,10],
    aeolian:    [0,2,3,5,7,8,10],
    locrian:    [0,1,3,5,6,8,10],
    melodicminor:[0,2,3,5,7,8,11],
    wholeHalf:  [0,2,3,5,6,8,9,11],
    halfWhole:  [0,1,3,4,6,7,9,10],
    chromatic:  [0,1,2,3,4,5,6,7,8,9,10,11],
  },

  store:function() { 
    Gibberish.Theory = this

    this.Tune.TuningList = this.__tunings

    this.initProperties()
  },

  setup( tuning='et', mode='aeolian' ) {
    this.tuning = tuning
    this.mode = mode
  }, 

  // adapted from https://gist.github.com/stuartmemo/3766449
  __noteToFreq( note ) {
    note = note.toUpperCase() 

    let notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        octave,
        keyNumber

    if (note.length === 3) {
      octave = note.charAt(2)
    } else {
      octave = note.charAt(1)
    }
    keyNumber = notes.indexOf(note.slice(0, -1))
    if (keyNumber < 3) {
      keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1
    } else {
      keyNumber = keyNumber + ((octave - 1) * 12) + 1
    }

    return 440 * Math.pow(2, (keyNumber- 49) / 12)
  },

  deleteProperties: function() {
    if( Gibberish.mode === 'worklet' ) {
      delete this.__root
      delete this.__tuning
      delete this.__mode
      delete this.__offset
      delete this.__degree

      Theory.markup = {
        textMarkers : {},
        cssClasses: {}
      }

      this.__root = 440
      this.__tuning = 'et'
      this.__offset = 0
      this.__degree = 'i'
      this.__mode = 'aeolian'
    }
  },

  initProperties: function() {
    if( Gibberish.mode === 'worklet' ) {
      Gibber.createProperty( 
        this, 'root', 440, function() {
          if( typeof Theory.__root.value === 'string' ) {
            Theory.root = Theory.__noteToFreq( Theory.__root.value )
          } 
        },
        
        1
      )

      Gibber.createProperty( 
        this, 'tuning', 'et', 
        function() { // XXX why doesn't this work??? duplicated below... 
          this.loadScale( this.__tuning.value ) 
        },
        1
      )

      Gibber.createProperty( this, 'mode', 'aeolian', null, 0 )
      Gibber.createProperty( this, 'offset', 0, null, 0 )
      Gibber.createProperty( this, 'degree', 'i', null, 0 )

      //setTimeout( ()=> Theory.tuning = 'et', 250 )
      this.tuning = 'et'
      //this.loadScale('et')
    }else{
      this.__initDegrees()

      Object.defineProperty( this, 'root', {
        get() { return this.__root },
        set(v) {
          if( typeof v=== 'string' ) {
            v = this.__noteToFreq( v )
          } 
          this.__root = v
          this.Tune.tonicize( this.__root )
        }
      })

      Object.defineProperty( this, 'tuning', {
        get() { return this.__tuning },
        set(v) {
          this.__tuning = v
          //this.loadScale( v )
        }
      })

      Object.defineProperty( this, 'mode', {
        get()  { return this.__mode },
        set(v) { 
          if( this.modes[ v ] !== undefined || v === null ) {
            this.__mode = v 
          }else{
            console.error( `The mode "${v}" is not valid. Valid modes include ${Object.keys(this.modes).toString()}, and null. No change to Theory.mode was applied.` )
          }
        }
      })

      Object.defineProperty( this, 'offset', {
        get()  { return this.__offset },
        set(v) { this.__offset = v }
      })

      Object.defineProperty( this, 'degree', { 
        get() { return this.__degree },
        set( __degree ) {
          if( typeof __degree  === 'string' ) {
            const degree = this.__degrees[ this.quality ][ __degree ]
        
            this.__degree = degree
            //this.rootNumber = degree.offset + this.baseNumber
            this.mode = degree.mode
          }
        }
      })

      this.degree = 'i'
    }
  },

  __degrees: { major:{}, minor:{} },

  __initDegrees:function() {
    const base = [ 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii' ]

    const scales = [ { name:'minor', values:this.modes.aeolian }, { name:'major', values:this.modes.ionian } ]

    for( let scale of scales ) {
      let name = scale.name
      let values = scale.values

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ]
        this.__degrees[ name ][ chord ] = { mode:'aeolian', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'aeolian', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'aeolian', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'aeolian', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'aeolian', offset: values[i] + 24 }
      }

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ].toUpperCase()
        this.__degrees[ name ][ chord ] = { mode:'ionian', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'ionian', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'ionian', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'ionian', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'ionian', offset: values[i] + 24 }
      }

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ] + '7'
        this.__degrees[ name ][ chord ] = { mode:'dorian', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'dorian', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'dorian', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'dorian', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'dorian', offset: values[i] + 24 }
      }

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ].toUpperCase() + '7'
        this.__degrees[ name ][ chord ] = { mode:'mixolydian', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'mixolydian', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'mixolydian', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'mixolydian', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'mixolydian', offset: values[i] + 24 }
      }

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ] + 'o'
        this.__degrees[ name ][ chord ] = { mode:'locrian', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'locrian', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'locrian', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'locrian', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'locrian', offset: values[i] + 24 }
      }

      for( let i = 0; i < base.length; i++ ) {
        const chord = base[ i ] + 'M7'
        this.__degrees[ name ][ chord ] = { mode:'melodicminor', offset: values[i] }
        this.__degrees[ name ][ '-'+chord ] = { mode:'melodicminor', offset: values[i] - 12 }
        this.__degrees[ name ][ '--'+chord ] = { mode:'melodicminor', offset: values[i] - 24 }
        this.__degrees[ name ][ '+'+chord ] = { mode:'melodicminor', offset: values[i] + 12 }
        this.__degrees[ name ][ '++'+chord ] = { mode:'melodicminor', offset: values[i] + 24 }
      }
    }
  },

  init:function( __Gibber ) {
    Gibber = __Gibber

    this.Tune = new this.__Tune()
    this.Tune.TuningList = this.__tunings

    if( Gibberish.mode === 'worklet' ) {
      this.id = Gibberish.utilities.getUID()

      // can't send prototype methods of Tune over processor
      // so they need to be explicitly assigned
      this.Tune.loadScale = this.Tune.__proto__.loadScale
      this.Tune.note = this.Tune.__proto__.note
      this.Tune.frequency = this.Tune.__proto__.frequency
      this.Tune.tonicize = this.Tune.__proto__.tonicize
      this.Tune.ratio = this.Tune.__proto__.ratio
      this.Tune.MIDI = this.Tune.__proto__.MIDI
      
      Gibberish.worklet.port.postMessage({
        address:'add',
        properties:serialize( Theory ),
        id:this.id,
        post:'store'
      })

      Gibber.subscribe( 'clear', () => this.reset() )
      this.initProperties()
    }

    this.__initDegrees()
  },

  reset:function() {
    Theory.root = 440
    Theory.mode = 'aeolian'
    Theory.tuning = 'et'
    Theory.degree = 'i'
    Theory.offset = 0
  },

  freeze:function() {
    if( Gibberish.mode === 'worklet' ) {
      Gibber.Theory.degree.sequencers.forEach( s => s.stop() )  
      Gibber.Theory.offset.sequencers.forEach( s => s.stop() )  
      Gibber.Theory.mode.sequencers.forEach( s => s.stop() )  
      Gibber.Theory.root.sequencers.forEach( s => s.stop() )  
    }
  },

  thaw:function() {
    if( Gibberish.mode === 'worklet' ) {
      this.degree.sequencers.forEach( s => s.start() )  
      this.offset.sequencers.forEach( s => s.start() )  
      this.mode.sequencers.forEach( s => s.start() )  
      this.root.sequencers.forEach( s => s.start() )  
    }
  },

  loadScale: function( name ) {
    if( Gibberish.mode === 'worklet' ) {
      // if the scale is already loaded...
      if( this.__tunings[ name ] !== undefined ) {
        this.__tuning.value = name
        this.Tune.loadScale( name )

        Gibberish.worklet.port.postMessage({
          address:'method',
          object:this.id,
          name:'loadScale',
          args:[name]
        })
        return
      }

      const path = this.__loadingPrefix + name + '.js' 
      fetch( path )
        .catch( console.err )
        .then( data => {
          if( data.ok ) {
            return data.json()
          }else{
            console.error( `The tuning ${name} wasn't found. Please visit http://abbernie.github.io/tune/scales.html to find the names of valid tunings.`) 
          } 
        })
        .then( json => {
          this.__tuning.value = name
          Gibberish.worklet.port.postMessage({
            address:'addToProperty',
            object:this.id,
            name:'__tunings',
            key:name,
            value:json
          })

          Gibberish.worklet.port.postMessage({
            address:'method',
            object:this.id,
            name:'loadScale',
            args:[name]
          })

          this.__tunings[ name ] = json
          this.Tune.loadScale( name )
        })
    }else{
      this.Tune.loadScale( name )
    }
  },

  // REMEMBER THAT THE .note METHOD IS ALSO MONKEY-PATCHED
  // IN ugen.js, THIS IS WHERE MOST OF THE AWPROCESSOR NOTE
  // METHOD IS IMPLEMENTED.
  note: function( __idx, octave=0, round=true ) {
    let finalIdx, mode = null, __float = __idx % 1, baseOctave, nextOctave

    let isInt = __float === 0
    if( !isInt && round===true ) {
      __idx = Math.round( __idx )
      isInt = true
    }
    
    let baseIndex = __idx < 0 ? Math.ceil( __idx ) : Math.floor( __idx ),
        nextIndex = __idx >= 0 ? baseIndex + 1 : baseIndex - 1

    baseIndex += Gibberish.Theory.__offset
    nextIndex += Gibberish.Theory.__offset

    if( Gibberish.Theory.mode !== 'chromatic' && Gibberish.Theory.mode !== null ) {
      mode = Gibberish.Theory.modes[ Gibberish.Theory.mode ]
      baseOctave = Math.floor( baseIndex / mode.length )
      nextOctave = Math.floor( nextIndex / mode.length )
      
      // XXX this looks crazy ugly but works with negative note numbers...
      baseIndex = baseIndex < 0 
        ? mode[ (mode.length - (Math.abs( baseIndex ) % mode.length)) % mode.length ] 
        : mode[ Math.abs( baseIndex ) % mode.length ]

      if( !isInt ) {
        nextIndex = nextIndex < 0 
          ? mode[ (mode.length - (Math.abs( nextIndex ) % mode.length)) % mode.length ] 
          : mode[ Math.abs( nextIndex ) % mode.length ]
      }
    }else{
      // null mode also means to use 'chromatic' mode
      mode = Gibberish.Theory.modes[ 'chromatic' ]
      const l = Gibberish.Theory.Tune.scale.length 
      baseOctave = Math.floor( baseIndex / l )
      nextOctave = Math.floor( baseIndex / l )

      baseIndex = baseIndex < 0 
        ? mode[ (l - (Math.abs( baseIndex ) % l)) % l ] 
        : mode[ Math.abs( baseIndex ) % l ]

      if( !isInt ) {
        nextIndex = nextIndex < 0 
          ? mode[ (l - (Math.abs( nextIndex ) % l)) % l ] 
          : mode[ Math.abs( nextIndex ) % l ]
      }
    }

    baseIndex += this.__degree.offset
    nextIndex += this.__degree.offset

    let outputFreq = 0
    if( !isInt ) {
      const freq0 = Gibberish.Theory.Tune.note( baseIndex, baseOctave )
      const freq1 = Gibberish.Theory.Tune.note( nextIndex, nextOctave )
      let   diff  = freq1 - freq0
      if( __idx < 0 ) diff *= -1
      outputFreq = freq0 + (diff*__float)
    }else{
      outputFreq = Gibberish.Theory.Tune.note( baseIndex, baseOctave )
    }

    return outputFreq 
  },
}

module.exports = Theory

},{"./external/tune-api-only.js":102,"gibberish-dsp":174,"serialize-javascript":231}],128:[function(require,module,exports){
const Presets = require( './presets.js' )
const Theory  = require( './theory.js' )
const Gibberish = require( 'gibberish-dsp' )

// Gibber ugens are essentially wrappers around underlying gibberish 
// ugens, providing convenience methods for rapidly sequencing
// and modulating them.

const poolSize = 12

// DRY method for removing a sequence and its associated annotations.
const removeSeq = function( obj, seq ) {
  const idx = obj.__sequencers.indexOf( seq )
  obj.__sequencers.splice( idx, 1 )
  seq.stop()
  seq.clear()
}

const createMapping = function( from, to, name, wrappedTo ) {
  if( from.__useMapping === false ) {
    wrappedTo[ name ] = from
  }else if( from.type === 'audio' ) {
    const f = to[ '__' + name ].follow = Follow({ input: from })

    let m = f.multiplier
    Object.defineProperty( to[ name ], 'multiplier', {
      get() { return m },
      set(v) { m = v; f.multiplier = m }
    })

    let o = f.offset
    Object.defineProperty( to[ name ], 'offset', {
      get() { return o },
      set(v) { o = v; f.offset = o }
    })

    wrappedTo[ name ] = f
  }else if( from.type === 'gen' ) {
    // gen objects can be referred to without the graphics/audio abstraction,
    // in which case they will have no .render() function, and don't need to be rendered
    const gen = from.render !== undefined ? from.render() : from

    wrappedTo[ name ] = gen
  }
}

const Ugen = function( gibberishConstructor, description, Audio, shouldUsePool = false, isBinop = false ) {

  let   poolCount = poolSize
  const pool = []

  const constructor = function( ...args ) {
    const properties = Presets.process( description, args, Audio ) 
    const timeProps = Audio.timeProps[ description.name ] === undefined ? [] : Audio.timeProps[ description.name ]

    if( timeProps.length > 0 ) {
      for( let key in properties ) {
        if( timeProps.indexOf( key ) > -1 ) {
          properties[ key ] = Audio.Clock.time( properties[ key ] )
        }
      }
    }

    // XXX if you want to use pooling you must also uncomment near the bottom of this file...
    // Pooling could work for reverbs IF:
    // 1. There would have to be separate mono and stereo pools.2
    // 2. Reverbs would need to run with 0 input for a while so that the functions are JIT'd

    //if( shouldUsePool && poolCount < pool.length ) {
    //  pool[ poolCount ].inUse = true
    //  const poolUgen = pool[ poolCount ].ugen
    //  poolCount++
    //  Object.assign( poolUgen, properties, args )
    //  console.log( 'pool ugen:', poolUgen )
    //  return poolUgen
    //}

    let __wrappedObject
    if( isBinop === true ) {
      __wrappedObject = gibberishConstructor( ...args ) 
    }else{
      __wrappedObject = gibberishConstructor( properties )
    }
    
    const obj = { 
      __wrapped__ :__wrappedObject,
      __sequencers : [], 
      __tidals: [],
      name:description.name,
      type:'audio',

      stop( time=null ) {
        if( time === null ) {
          for( let seq of this.__sequencers ) seq.stop()
          for( let seq of this.__tidals ) seq.stop()
        }else{
          time = Audio.Clock.time( time )
          for( let seq of this.__sequencers ) {
            future( seq => seq.stop(), time, { seq })
          }

          for( let seq of this.__tidals ) {
            future( seq => seq.stop(), time, { seq })
          }
        }
        return this
      },
      play( time=null ) {
        if( time === null ) {
          for( let seq of this.__sequencers ) seq.start()
          for( let seq of this.__tidals ) seq.start()
        }else{
          time = Audio.Clock.time( time )
          for( let seq of this.__sequencers ) {
            future( seq => seq.start(), time, { seq })
          }

          for( let seq of this.__tidals ) {
            future( seq => seq.start(), time, { seq })
          }
        }

        return this
      },
      clear() {
        for( let seq of this.__sequencers ) {
          seq.clear()
        }
        for( let seq of this.__tidals ) {
          seq.clear()
        }
        //console.log( Gibberish.mode, __wrappedObject.connected )
        if( __wrappedObject.connected !== undefined ) {
          for( let connection of __wrappedObject.connected ) {
            if( this.fx.indexOf( connection[ 0 ] ) === -1 ) {
              this.disconnect( connection[ 0 ] )
            }else{
              this.disconnect()
            }
          }
        }
        if( this.__onclear !== undefined ) {
          this.__onclear()
        }
      }
    }

    // add poly methods
    if( description.name.indexOf('Poly') > -1 || description.name.indexOf('Multi') > -1 || description.name.indexOf('Soundfont') > -1 ) {
      let useProp = description.name.indexOf('Poly') > -1
      obj.spread = function( amt=1 ) {
        if( amt === 0 ) {
          children.forEach( (c,i) => { 
            if( useProp ) 
              c.pan = .5 
            else 
              if( obj.maxVoices.value > 1 ) obj.setpan(i,.5) 
          })
          return obj
        }
        const children = this.__wrapped__.voices
        const incr = 1/(children.length-1) * amt
        children.forEach( (c,i) => {
          if( useProp ) 
            c.pan = (.5 - amt/2) + i * incr
          else
            if( obj.maxVoices.value > 1 ) obj.setpan( i, (.5-amt/2) + i * incr )
        })

        return obj
      }
      obj.voices = obj.__wrapped__.voices
      obj.inspect = function() {
        console.group( 'Inspecting ' + description.name )
        console.table( Object.assign({}, obj.voices[0].__wrapped__.__properties__, obj.__wrapped__.__properties__ ) )
        console.groupEnd()
      }
      for( let i = 0; i < 20; i++ ) {
        Object.defineProperty( obj, i, { get() { return obj.voices[i] } })
      }
    }
//btos: function( beats ) {
//    const samplesPerBeat = Gibberish.ctx.sampleRate / (this.bpm / 60 )
//    return samplesPerBeat * beats 
//  }
    // transform beat values to samples
    // in the case of a gen graph convert to a new gen object
    const timetransform = function( v ) {
      const out = typeof v === 'number' 
        ? Audio.Clock.time( v ) 
        : v.type === 'gen' 
          ? Gen.make( 
              genish.mul( 
                genish.div( 44100, genish.div( Clock.bpm, 60 ) ),
                v.graph
              ) 
            )
          : v

      return out
    }

    // wrap properties and add sequencing to them
    for( let propertyName in description.properties ) {
      if( __wrappedObject.__requiredRecompilation && __wrappedObject.__requiresRecompilation.indexOf( propertyName ) > -1 ) continue
      // XXX we have to pass id in the values dictionary under 
      // certain conditions involoving gen ugens, but we don't 
      // want .id to be sequencable!
      if( propertyName !== 'id' && propertyName !== 'type' ){
        const transform = timeProps.indexOf( propertyName ) > -1 
          ? timetransform
          : null 

        const value = __wrappedObject[ propertyName ] === undefined 
          ? __wrappedObject.__properties__[ propertyName ]
          : __wrappedObject[ propertyName ]

        Audio.createProperty( obj, propertyName, value, null, 0, transform )

        // create per-voice version of property... what properties should be excluded?
        if( description.name.indexOf('Poly') > -1 || description.name.indexOf('Multi') > -1 || description.name.indexOf('Soundfont') > -1 ) {
          Audio.createProperty( obj, propertyName+'V', value, null, 0, transform, true )//, timeProps, Audio, true )

          //createProperty( obj, propertyName, __wrappedObject, timeProps, Audio, true )
          // we don't have a way to add properties to objects in the processor thread
          // so we'll just add a method... sequencing will still work the same.
          Gibberish.worklet.port.postMessage({
            address:'addMethod',
            id:__wrappedObject.id,
            key:propertyName+'V',
            function:`function( v ) {this.voices[ this.voiceCount % this.voices.length ][ '${propertyName}' ] = v }`
          })
        }
      }
    }

    if( description.methods !== null && description.methods.indexOf( 'note' ) > -1 ) { 
      description.methods.push( 'notef' )
      description.methods.push( 'notec' )
    }

    // wrap methods and add sequencing to them
    if( description.methods !== null ) {
      for( let methodName of description.methods ) {
        if( methodName !== 'note' || description.name.indexOf('Sampler') > -1 || description.name.indexOf('Multisampler') > -1 ) { //|| description.name.indexOf('Soundfont') > -1 ) {
          //obj[ methodName ] = __wrappedObject[ methodName ].bind( __wrappedObject )
          obj[ methodName ] = function( ...args ) {
            if( args.length === 0 ) {
              __wrappedObject[ methodName ]()
            }else{ //if( args.length === 1 ) {
              //if( Array.isArray( args[0] ) ) {
              //  obj[ methodName ].seq( args[0], 1/args[0].length )
              //}else if( typeof args[0] === 'string' ) {
              //  obj[ methodName ].tidal( args[0] )
              //}else{
                __wrappedObject[ methodName ]( ...args )
              //}
            }/*else{
              // could be a .tidal or a seq 
              if( typeof args[0] === 'string' ) { // must be tidal with tidal id #
                obj[ methodName ].tidal( ...args )
              }else{
                obj[ methodName ].seq( ...args )  // must be sequence
              }
            }*/
            return obj
          }
        }else{
          // in this block we are monkey patching the note method of Gibberish synths so that
          // they use Gibber's harmonic system inside the AudioWorkletProcessor.

          obj[ methodName ] = function( ...args ) {
            let shouldSendNoteNow = false
            if( args.length === 0 ) {
               shouldSendNoteNow = true
            }else if( args.length === 1 ) {
              if( Array.isArray( args[0] ) ) {
                obj[ methodName ].seq( args[0], 1/args[0].length )
              }else if( typeof args[0] === 'string' ) {
                obj[ methodName ].tidal( args[0] )
              }else{
                shouldSendNoteNow = true
              }
            }else{
              /*
              // could be a .tidal or a seq 
              if( typeof args[0] === 'string' ) { // must be tidal with tidal id #
                obj[ methodName ].tidal( ...args )
              }else{
                obj[ methodName ].seq( ...args )  // must be sequence
              }
              */
            }

            // this should only be for direct calls from the IDE
            if( shouldSendNoteNow && Gibberish.mode === 'worklet' ) {
              Gibberish.worklet.port.postMessage({
                address:'method',
                object:__wrappedObject.id,
                name:methodName,
                args
              })
            }

            return obj
          }

          Gibberish.worklet.port.postMessage({
            address:'addMethod',
            id:__wrappedObject.id,
            key:'notef',
            function:`function( note, __loudness=null ){
              const loudness = __loudness = null ? this.__triggerLoudness : __loudness
              this.___note( note, loudness ) 
            }`
          })
          Gibberish.worklet.port.postMessage({
            address:'addMethod',
            id:__wrappedObject.id,
            key:'notec',
            function:`function( note, __loudness=null ){
              const loudness = __loudness = null ? this.__triggerLoudness : __loudness
              this.note( note, loudness, false ) 
            }`
          })
          // when a message is received at the address 'monkeyPatch',
          // Gibberish will create a copy of the method identified by
          // the 'key' field, and then assign it back to the object prefaced
          // with double underscores (e.g. __note). The function that is being
          // patched in can then call the original function using the prefaced 
          // name, as is done in the last line of the argument function below.
          Gibberish.worklet.port.postMessage({
            address:'monkeyPatch',
            id:__wrappedObject.id,
            key:'note',
            function:`function( note, __loudness, round=true ){ 
              const octave = this.octave || 0
              let notesInOctave = 7
              const mode = Gibberish.Theory.mode

              if( mode !== null ) {
                notesInOctave = mode !== 'chromatic' ? Gibberish.Theory.modes[ mode ].length : Gibberish.Theory.Tune.scale.length
              }else{
                notesInOctave = Gibberish.Theory.Tune.scale.length
              }

              const offset = octave * notesInOctave
              let __note = Gibberish.Theory.note( note + offset, 0, round )

              const loudness = __loudness = null ? this.__triggerLoudness : __loudness
              this.___note( __note, loudness ) 
            }`
          })
          
        }

        if( methodName === 'notef' ) {
          obj.notef = function( ...args ) {
            __wrappedObject.frequency = args[0]
            __wrappedObject.trigger( __wrappedObject.__triggerLoudness )

            return obj
          }
        }

        if( methodName === 'notec' ) {
          obj.notec = function( ...args ) {
            //__wrappedObject.frequency = args[0]
            //__wrappedObject.trigger( __wrappedObject.__triggerLoudness )
            Gibberish.worklet.port.postMessage({
              address:'method',
              object:__wrappedObject.id,
              name:'notec',
              args
            })
            return obj
          }
        }
        obj[ methodName ].sequencers = []
        obj[ methodName ].tidals = []

        obj[ methodName ].seq = function( values, timings, number=0, delay=0, priority=10000 ) {
          console.log( 'method seq:', methodName, number )
          let prevSeq = obj[ methodName ].sequencers[ number ] 
          if( prevSeq !== undefined ) { 
            const idx = obj.__sequencers.indexOf( prevSeq )
            obj.__sequencers.splice( idx, 1 )
            //prevSeq.stop()
            prevSeq.clear()
            // removeSeq( obj, prevSeq )
          }

          let s = Audio.Core.Seq({ values, timings, target:obj/*__wrappedObject*/, key:methodName, priority })
          
          if( typeof delay !== 'function' ) {
            s.start( Audio.Clock.time( delay ) )
          }else{
            delay.seqs.push( s )
          }
          obj[ methodName ].sequencers[ number ] = obj[ methodName ][ number ] = s 
          obj.__sequencers.push( s )

          // return object for method chaining
          return obj
        }
        obj[ methodName ].tidal= function( pattern, number=0, delay=0 ) {
          let prevSeq = obj[ methodName ].tidals[ number ] 
          let s = Audio.Core.Tidal({ pattern, target:__wrappedObject, key:methodName })
          if( s !== null ) {
            if( prevSeq !== undefined ) { 
              const idx = obj.__tidals.indexOf( prevSeq )
              obj.__tidals.splice( idx, 1 )
              prevSeq.stop()
              prevSeq.clear()
              // removeSeq( obj, prevSeq )
            }

            s.start( Audio.Clock.time( delay ) )
            obj[ methodName ].tidals[ number ] = obj[ methodName ][ number ] = s 
            obj.__tidals.push( s )

            // XXX need to clean this up! this is solely here for annotations, and to 
            // match what I did for ensembles... 
            obj[ methodName ].__tidal = s
          }

          // return object for method chaining
          return obj
        }

        
      }
    }


    let id = __wrappedObject.id
    Object.defineProperty( __wrappedObject, 'id', {
      configurable:false,
      get() { return id },
      set(v) {
        //console.log( 'tried to change id:', obj )
        //debugger
      }
    })
    obj.id = __wrappedObject.id

    obj.__follow = null

    const followcheck = ()=> {

    }

    Object.defineProperty( obj, '__out', {
      configurable:false,
      get() {
        if( obj.__follow === null ) {
          obj.__follow = Audio.analysis.Follow({ input:obj }) 
        }

        const output = obj.__follow.output
         
        // will take a few buffers to initialize...
        if( output === undefined ) return 0

        return output[1] === undefined ? output[0] : output[0] + output[1] 
      },
      set(v) {}
    })

    obj.inspect = ()=> {
      console.group( 'Inspecting ' + description.name )
      const keys = Object.keys( obj.__wrapped__.__properties__ )
      const props = {}
      keys.forEach( key => {
        if( key[0] !== '_' ) {
          if( obj[ key ] !== null && obj[ key ] !== undefined ) {
            props[ key ] = obj[ key ].value
          }
        }
      })
      console.table( props ) 
      //console.table( obj.__wrapped__.__properties__ )
      console.groupEnd()
    }

    obj.out = function( scale=1, offset=0, bufferSize=null ) {
      // if the buffer size changes...
      if( bufferSize !== null ) {
        if( obj.__follow !== null ) {
          if( bufferSize !== obj.__follow.__wrapped__.bufferSize ) {
            //console.log( 'prev follow', bufferSize, obj.__follow.__wrapped__.bufferSize, obj.__follow )
            
            const tmp = obj.__follow
            // XXX need to remove the previous follow from the graph...
            obj.__follow = Audio.analysis.Follow({ input:Audio.Gibberish.worklet.ugens.get( obj.__follow.__wrapped__.input.id ), bufferSize })

            Audio.Gibberish.worklet.port.postMessage({
              address:'eval',
              code:`const idx = Gibberish.analyzers.findIndex( ugen => ugen.id === ${tmp.id} )
                    if( idx > -1 ) {
                      Gibberish.analyzers.splice(idx,1)
                      Gibberish.dirty( Gibberish.analyzers )
                    }`
            })
          }
        }
      }

      if( Ugen.OUTPUT === Ugen.OUTPUT_FUNCTION )
        return ()=> obj.__out * scale + offset
      else
        return Math.abs( obj.__out * scale ) + offset 
    }

    // XXX where does shouldAddToUgen come from? Not from presets.js...
    if( properties !== undefined && properties.shouldAddToUgen ) Object.assign( obj, properties )

    // create fx chaining api. e.g. synth.fx.add( Chorus(), Freeverb() )
    // we use the 'add' method to enable method chaining alongside instrument calls to
    // .connect() and .seq()

    const __fx = []
    __fx.__push = __fx.push.bind( __fx )
    __fx.add = function( ...args ) {
      args.forEach( fx => obj.__fx.push( fx ) )
      console.log( `added ${args.length} effect(s) to ${obj.name}` )
      return obj
    }
    __fx.inspect = function() {
      if( __fx.length > 0 )
        console.table( __fx.map( fx=>fx.name ) )
      else
        console.log( `there are no effects on ${obj.name} to inspect.` )
    }
    __fx.remove = function( effect=null ) {
      if( effect === null ) {
        obj.__fx.length = 0
        console.log( `all effects from ${obj.name} were removed.` )
      }else if( typeof effect === 'number' ) {
        // XXX broken for indices that !== 0
        const del = obj.__fx.splice( effect, 1 )
        console.log( `${del[0].name} at fx slot ${effect} was removed from ${obj.name}.` ) 
      }else if( typeof effect === 'string' ) {
        const indexesToErase = []
        __fx.forEach( (__effect,i) => { if( effect === __effect.name ) indexesToErase.push( i ) })
        console.log( `${indexesToErase.length} effect(s) were removed from ${obj.name}.` ) 
        for( let i = __fx.length - 1; i >= 0; i-- ) {
          if( indexesToErase.includes( i ) ) __fx.splice( i, 1 )
        }   
      } else if( typeof effect === 'object' ) {
        const idx = __fx.indexOf( effect )
        __fx.splice( idx, 1 )
        console.log( `effect ${effect.name} was removed from ${obj.name}.` ) 
      }
    }
    obj.__fx = new Proxy( __fx, {
      set( target, property, value, receiver ) {

        const lengthCheck = target.length
        const old = target.slice(0)
        target[ property ] = value
        
        if( property === 'length' ) { 
          if( target.length > 1 ) {
            // XXX need to store and reassign to end connection
            target[ target.length - 2 ].disconnect()
            target[ target.length - 2 ].connect( target[ target.length - 1 ] )
            target[ target.length - 1 ].connect()
          }else if( target.length === 1 ) {
            const connected = __wrappedObject.connected !== undefined ?__wrappedObject.connected.slice(0) : null
            __wrappedObject.disconnect()
            __wrappedObject.connect( target[ 0 ] )

            if( connected !== null ) {
              for( let connection of connected ) {
                // 0 is bus, 1 is ugen adding the fx, 2 is send amount
                target[0].connect( connection[0], connection[2] )
              }
            }else{
              target[0].connect( Audio.Master )
            }
          }else if( value === 0 && lengthCheck !== 0 ) {
            // ugh...
            if( __wrappedObject.connected !== undefined ) {
              if( __wrappedObject.connected[0] !== undefined ) {
                __wrappedObject.connect( 
                  __wrappedObject.connected[ 0 ][ 0 ].__wrapped__.connected[ 0 ][ 0 ], 
                  __wrappedObject.connected[ 0 ][ 0 ].__wrapped__.connected[ 0 ][ 2 ] 
                )

                __wrappedObject.connected[ 0 ][ 0 ].disconnect()
              }
            }
          }

        }

        return true
      }
    })

    Object.defineProperty( obj, 'fx', {
      get() { return obj.__fx },
      set(v) {
        const tmpLength = obj.__fx.length
        obj.__fx.length = 0
        if( Array.isArray( v ) ) {
          v.forEach( effect => obj.__fx.push( effect ) ) 
        }else{
          obj.__fx.push( v ) 
        }

        if( tmpLength > 0 ) {

            console.log( `${tmpLength} effect(s) were replaced with ${obj.__fx.length} effect(s) on ${obj.name}` )
        }else{

          if( Array.isArray( v ) ) {
            console.log( `${v.length} effect(s) were added to the fx chain of ${obj.name}` )
          }else{
            console.log( `a ${v.name} was added to the fx chain  of ${obj.name}` )
          }
        }
      }
    })

    obj.connect = (dest,level=1) => {
      if( typeof dest !== 'number' ) {
        if( dest !== undefined && dest.isProperty === true ) {
          // if first modulation for property, store it's initial
          // value before modulating it.
          if( dest.preModValue === undefined ) { 
            dest.preModValue = dest.value
          }

          dest.mods.push( obj )

          const sum = dest.mods.concat( dest.preModValue )
          const add = Audio.binops.Add( ...sum ) 
          // below works for oscillators, above works for instruments...
          //const add = Gibber.Gibberish.binops.Add( ...sum ) 
          add.__useMapping = false
          dest.__owner[ dest.name ] = add

          obj.__wrapped__.connected.push( [ dest.__owner[ dest.name ], obj ] )
        }else{
          // if no fx chain, connect directly to output
          if( obj.fx.length === 0 ) {
            __wrappedObject.connect( dest, level )
          }else{
            // otherwise, connect last effect in chain to output
            obj.fx[ obj.fx.length - 1 ].__wrapped__.connect( dest, level )
          }
        }
      }else{
        console.log( '%cYou cannot connect to a number; perhaps you meant this to be the level for your connection?', 'color:white;background:#900' )
      }

      return obj 
    } 

    obj.disconnect = dest => { 
      // if there's an effect chain, we disconnect that in addition
      // to disconnecting the ugen itself.
      if( dest === undefined && obj.fx.length > 0 ) {
        obj.fx[ obj.fx.length - 1 ].disconnect()
      }

      __wrappedObject.disconnect(); 
      
      return obj 
    } 

    Object.defineProperty( obj, '_', { get() { obj.disconnect(); return obj } })

    // presetInit is a function in presets that triggers actions after the ugen
    // has been instantiated... it is primarily used to add effects and modulations
    // to a preset.
    if( properties !== undefined && properties.__presetInit__ !== undefined ) {
      properties.__presetInit__.call( obj, Audio, args[1] )
    }

    // only connect if shouldNotConneect does not equal true (for LFOs and other modulation sources)
    if( obj.__wrapped__.type === 'instrument' || obj.__wrapped__.type === 'oscillator' || description.name.indexOf('Poly') > -1 ) {
      if( typeof properties !== 'object' || properties.shouldNotConnect !== true ) {
        
        if( Audio.autoConnect === true ) {
          // ensure that the ugen hasn't already been connected through the fx chain,
          // possibly through initialization of a preset
          if( obj.fx.length === 0 ) obj.connect( Audio.Master )
        }
      }

    }else if( obj.__wrapped__.type === 'effect' ) {
      obj.bus = function() {
        const b = Audio.busses.Bus2()
        b.fx.add( obj )

        const p = new Proxy( b, {
          set( target, property, value, receiver ) {
            // console.log( 'set:', target, property, value, receiver )
            if( b[ property ] === undefined && property !== 'input' ) {
              obj[ property ] = value
            }else{
              b[ property ] = value
            }
          },
          get( target, property, value, receiver ) {
            if( b[ property ] === undefined && property !== 'input' ) {
              return obj[ property ]
            }else{
              return b[ property ]
            }
          }
        })

        p.inspect = function() {
          console.group( 'Inspecting ' + description.name + ' ' + 'Bus' )

          const objKeys = Object.keys( obj.__wrapped__.__properties__ )
          const __obj = {}
          objKeys.forEach( key => {
            //console.log( 'key:', key, obj.__wrapped__ )
            if( key[0] !== '_' && key !== 'bypass' && obj[key] !== undefined ) {
              __obj[ key ] = obj[ key ].value !== undefined
                ? obj[ key ].value
                : obj.__wrapped__.__properties__[ key ].value
            }
          })
          console.group( description.name.toLowerCase() )
          console.table( __obj )
          console.groupEnd()

          console.group('bus')
          console.table( b.__wrapped__.__properties__ )
          console.groupEnd()

          console.groupEnd()
        }

        return p
      }
    }
    //console.log( `%c${description.name} created.`, 'color:white;background:#009' )
    Audio.publish( 'new ugen', description.name + ' created'  )

    return obj
  }

  //if( shouldUsePool ) {
  //  for( let i=0; i < poolSize; i++ ) {
  //    pool[ i ] = {
  //      inUse:false,
  //      ugen: constructor()
  //    }
  //  } 

  //  poolCount = 0
  //}
  
  //Ugen.createProperty = createProperty

  return constructor
}

Ugen.OUTPUT_FUNCTION = 0
Ugen.OUTPUT_SCALAR = 1
Ugen.OUTPUT = 1


module.exports = Ugen

},{"./presets.js":109,"./theory.js":127,"gibberish-dsp":174}],129:[function(require,module,exports){
const Utility = {
  rndf( min=0, max=1, number, canRepeat=true ) {
    let out = 0
  	if( number === undefined ) {
  		let diff = max - min,
  		    r = Math.random(),
  		    rr = diff * r

  		out =  min + rr;
  	}else{
      let output = [],
  		    tmp = []

  		for( let i = 0; i < number; i++ ) {
  			let num
        if( canRepeat ) {
          num = Utility.rndf(min, max)
        }else{
          num = Utility.rndf( min, max )
          while( tmp.indexOf( num ) > -1) {
            num = Utility.rndf( min, max )
          }
          tmp.push( num )
        }
  			output.push( num )
  		}

  		out = output
  	}

    return out
  },

  Rndf( _min = 0, _max = 1, quantity, canRepeat=true ) {
    // have to code gen function to hard code min / max values inside, as closures
    // or bound values won't be passed through the worklet port.XXX perhaps there should
    // be a way to transfer a function and its upvalues through the worklet? OTOH,
    // codegen works fine.

    const fncString = `const min = ${_min}
    const max = ${_max} 
    const range = max - min
    const canRepeat = ${quantity} > range ? true : ${ canRepeat }

    let out

    if( ${quantity} > 1 ) { 
      out = []
      for( let i = 0; i < ${quantity}; i++ ) {
        let num = min + Math.random() * range

        if( canRepeat === false ) {
          while( out.indexOf( num ) > -1 ) {
            num = min + Math.random() * range
          }
        }
        out[ i ] = num
      }
    }else{
      out = min + Math.random() * range 
    }

    return out;`
    
    return new Function( fncString )
  },

  rndi( min = 0, max = 1, number, canRepeat = true ) {
    let range = max - min,
        out
    
    if( range < number ) canRepeat = true

    if( typeof number === 'undefined' ) {
      range = max - min
      out = Math.round( min + Math.random() * range )
    }else{
  		let output = [],
  		    tmp = []

  		for( let i = 0; i < number; i++ ) {
  			let num
  			if( canRepeat ) {
  				num = Utility.rndi( min, max )
  			}else{
  				num = Utility.rndi( min, max )
  				while( tmp.indexOf( num ) > -1 ) {
  					num = Utility.rndi( min, max )
  				}
  				tmp.push( num )
  			}
  			output.push( num )
  		}
  		out = output
    }
    return out
  },

  Rndi( _min = 0, _max = 1, quantity=1, canRepeat = false ) {
    // have to code gen function to hard code min / max values inside, as closures
    // or bound values won't be passed through the worklet port.XXX perhaps there should
    // be a way to transfer a function and its upvalues through the worklet? OTOH,
    // codegen works fine.

    const fncString = `const min = ${_min}
    const max = ${_max} 
    const range = max - min
    const canRepeat = ${quantity} > range ? true : ${ canRepeat }

    let out

    if( ${quantity} > 1 ) { 
      out = []
      for( let i = 0; i < ${quantity}; i++ ) {
        let num = min + Math.round( Math.random() * range );

        if( canRepeat === false ) {
          while( out.indexOf( num ) > -1 ) {
            num = min + Math.round( Math.random() * range );
          }
        }
        out[ i ] = num
      }
    }else{
      out = min + Math.round( Math.random() * range ); 
    }

    return out;`
    
    return new Function( fncString )
  },

  time( v ) { return Gibber.Audio.Clock.time( v ) },
  btof( beats ) { return 1 / (beats * ( 60 / Gibber.Audio.Clock.bpm )) },

  random() {
    this.randomFlag = true
    this.randomArgs = Array.prototype.slice.call( arguments, 0 )

    return this
  },

  elementArray: function( list ) {
    let out = []

    for( var i = 0; i < list.length; i++ ) {
      out.push( list.item( i ) )
    }

    return out
  },
  
  __classListMethods: [ 'toggle', 'add', 'remove' ],

  create( query ) {
    let elementList = document.querySelectorAll( query ),
        arr = Utility.elementArray( elementList )
    
    for( let method of Utility.__classListMethods ) { 
      arr[ method ] = style => {
        for( let element of arr ) { 
          element.classList[ method ]( style )
        }
      } 
    }

    return arr
  },

  chord( ptrn, offsets ) {
    // gotta codegen function for worklet processor... similar to Rndi etc.
    let fncstr = `args.override = args[0]
    const values = []\n`

    for( let i = 0; i < offsets.length; i++ ) {
      fncstr += `values[${i}] = args[0] + ${offsets[i]}\n`
    }

    fncstr += `args[0] = values\n  return args`

    const fnc = new Function( 'args', fncstr )

    ptrn.addFilter( fnc )

    return ptrn
  },

  export( obj ) {
    obj.rndi = this.rndi
    obj.rndf = this.rndf
    obj.Rndi = this.Rndi
    obj.Rndf = this.Rndf
    obj.btof = this.btof
    obj.chord = this.chord
    obj.time = this.time

    Array.prototype.rnd = this.random
  }
}

module.exports = Utility

},{}],130:[function(require,module,exports){
module.exports = function( Gibber ) {
   const gen = Gibber.Gen.make  

   // will use this in a few places...
   const beats = b => {
     return phasor( Gibber.Utilities.btof( b ), 0, { min:0 } )
   }

   // needs to support changing values in more than one place
   // in the graph, hence the array of __params.
   const addProp = ( obj, prop, __params, __value ) => {
     let value = __value
     Object.defineProperty( obj, prop, {
       configurable:true,
       get() { return value },
       set(v) {
         value = v
         for( let __param of __params ) {
           __param.value = value
         }
       }
     })
   }

   const WavePatterns = {
     Beats( numBeats ) {
       const ugen = gen( beats( numBeats ) )
       ugen.isGen = ugen.__wrapped__.isGen = true
       
       return ugen 
     },

     SineR( period, gain, bias=0 ) {
       const ugen =  gen( floor( add( bias, mul( cycle( Gibber.Utilities.btof( period ) ), gain ) ) ), ['bias', 'period', 'gain'] )
       ugen.isGen = ugen.__wrapped__.isGen = true

       return ugen
     },

     LineR( period, from=0, to=1 ) {
       const b = beats( period )

       const diff = sub( to, from )
       const mult = mul( b, diff )
       const adder = add( from, mult )
       const ugen = gen( round( adder ) )
       
       addProp( ugen, 'from', [ ugen.p0, ugen.p4 ], from )
       addProp( ugen, 'to', [ ugen.p3 ], to )
       addProp( ugen, 'period', [ ugen.p1 ], period )

       const oldSetter = Object.getOwnPropertyDescriptor( ugen, 'period' ).set
       const oldGetter = Object.getOwnPropertyDescriptor( ugen, 'period' ).get

       Object.defineProperty( ugen, 'period', {
         get() { return oldGetter() },
         set(v) {
           oldSetter( btof(v) )
         }

       })
       
       ugen.isGen = ugen.__wrapped__.isGen = true

       return ugen
     },

     Line( period, from=0, to=1 ) {
       const b = beats( period )

       const diff = sub( to, from )
       const mult = mul( b, diff )
       const adder = add( from, mult )
       const ugen = gen( adder )
       
       addProp( ugen, 'from', [ ugen.p0, ugen.p4 ], from )
       addProp( ugen, 'to', [ ugen.p3 ], to )
       addProp( ugen, 'period', [ ugen.p1 ], period )

       const oldSetter = Object.getOwnPropertyDescriptor( ugen, 'period' ).set
       const oldGetter = Object.getOwnPropertyDescriptor( ugen, 'period' ).get

       Object.defineProperty( ugen, 'period', {
         get() { return oldGetter() },
         set(v) {
            oldSetter( btof(v) )
         }

       })

       ugen.isGen = ugen.__wrapped__.isGen = true

       return ugen
     }
   }

   // stores names so that annotations will correctly interpret this as a gen object
   for( let key in WavePatterns ) {
     Gibber.Gen.names.push( key )
   }

  return WavePatterns
}

},{}],131:[function(require,module,exports){
module.exports = function( Gibber ) {

  const WavePattern = function( ugen ) {
    
    const fnc = function() {
      return fnc.ugen.__wrapped__.callback.out[0] 
    }

    fnc.ugen = ugen

    return Gibber.Pattern( fnc )
  }

  return WavePattern
}

},{}],132:[function(require,module,exports){
module.exports = function( Gibber ) {

let Pattern = Gibber.Pattern

let flatten = function(){
   let flat = []
   for ( let i = 0, l = this.length; i < l; i++ ){
     let type = Object.prototype.toString.call( this[ i ]).split(' ').pop().split( ']' ).shift().toLowerCase()

     if (type) { 
       flat = flat.concat( /^(array|collection|arguments|object)$/.test( type ) ? flatten.call( this[i] ) : this[i]) 
     }
   }
   return flat
}

let createStartingArray = function( length, ones ) {
  let out = []
  for( let i = 0; i < ones; i++ ) {
    out.push( [1] )
  }
  for( let j = ones; j < length; j++ ) {
    out.push( 0 )
  }
  return out
}

let printArray = function( array ) {
  let str = ''
  for( let i = 0; i < array.length; i++ ) {
    let outerElement = array[ i ]
    if( Array.isArray( outerElement ) ) {
      str += '['
      for( let j = 0; j < outerElement.length; j++ ) {
        str += outerElement[ j ]
      }
      str += '] '
    }else{
      str += outerElement + ''
    }
  }

  return str
}

let arraysEqual = function( a, b ) {
  if ( a === b ) return true
  if ( a == null || b == null ) return false
  if ( a.length != b.length ) return false

  for ( let i = 0; i < a.length; ++i ) {
    if ( a[ i ] !== b[ i ] ) return false
  }

  return true
}

let getLargestArrayCount = function( input ) {
  let length = 0, count = 0

  for( let i = 0; i < input.length; i++ ) {
    if( Array.isArray( input[ i ] ) ) { 
      if( input[ i ].length > length ) {
        length = input[ i ].length
        count = 1
      }else if( input[ i ].length === length ) {
        count++
      }
    }
  }

  return count
}

let Euclid = function( ones, length, time, rotation ) {
  let count = 0,
      out = createStartingArray( length, ones ),
      onesAndZeros

 	function Inner( n,k ) {
    let operationCount = count++ === 0 ? k : getLargestArrayCount( out ),
        moveCandidateCount = out.length - operationCount,
        numberOfMoves = operationCount >= moveCandidateCount ? moveCandidateCount : operationCount

    if( numberOfMoves > 1 || count === 1 ) {
      for( let i = 0; i < numberOfMoves; i++ ) {
        let willBeMoved = out.pop(), isArray = Array.isArray( willBeMoved )
        out[ i ].push( willBeMoved )
        if( isArray ) { 
          flatten.call( out[ i ] )
        }
      }
    }

    if( n % k !== 0 ) {
      return Inner( k, n % k )
    }else {
      return flatten.call( out )
    }
  }
  
  onesAndZeros = Inner( length, ones )

  let pattern = Gibber.Pattern( ...onesAndZeros )

  if( isNaN( time ) || time === null ) time = 1 / onesAndZeros.length

  pattern.onrender = function( rendered ) {
    rendered.type = 'Euclid'

    rendered.time = time

    rendered.output = { time, shouldExecute: 0 }

    rendered.addFilter( ( args, ptrn ) => {
      let val = args[ 0 ]

      ptrn.output.time = Gibberish.Clock.time( ptrn.time )
      ptrn.output.shouldExecute = val 

      args[ 0 ] = ptrn.output 

      return args
    })
  }

  pattern.reseed = ( ...args )=> {
    let n, k
    
    if( Array.isArray( args[0] ) ) {
      k = args[0][0]
      n = args[0][1]
    }else{
      k = args[0]
      n = args[1]
    }

    if( n === undefined ) n = 16
    
    out = createStartingArray( n,k )
    let _onesAndZeros = Inner( n,k )
    
    pattern.set( _onesAndZeros )
    pattern.time = 1 / n

    // this.checkForUpdateFunction( 'reseed', pattern )

    return pattern
  }

  //Gibber.addSequencingToMethod( pattern, 'reseed' )

  // out = calculateRhythms( onesAndZeros, dur )
  // out.initial = onesAndZeros
  if( typeof rotation === 'number' ) pattern.rotate( rotation )
  return pattern //out
}
// E(5,8) = [ .25, .125, .25, .125, .25 ]
let calculateRhythms = function( values, dur ) {
  let out = []
  
  if( typeof dur === 'undefined' ) dur = 1 / values.length

  let idx = 0,
      currentDur = 0
  
  while( idx < values.length ) {
    idx++
    currentDur += dur
    
    if( values[ idx ] == 1 || idx === values.length ) {
      out.push( currentDur )
      currentDur = 0
    } 
  }
  
  return out
}

let answers = {
  '1,4' : '1000',
  '2,3' : '101',
  '2,5' : '10100',
  '3,4' : '1011',
  '3,5' : '10101',
  '3,7' : '1010100',
  '3,8' : '10010010',
  '4,7' : '1010101',
  '4,9' : '101010100',
  '4,11': '10010010010',
  '5,6' : '101111',
  '5,7' : '1011011',
  '5,8' : '10110110',
  '5,9' : '101010101',
  '5,11': '10101010100',
  '5,12': '100101001010',
  '5,16': '1001001001001000',
  '7,8' : '10111111',
  '11,24': '100101010101001010101010'
}

Euclid.test = function( testKey ) {
  let failed = 0, passed = 0

  if( typeof testKey !== 'string' ) {
    for( let key in answers ) {
      let expectedResult = answers[ key ],
          result = flatten.call( Euclid.apply( null, key.split(',') ) ).join('')

      console.log( result, expectedResult )

      if( result === expectedResult ) {
        console.log("TEST PASSED", key )
        passed++
      }else{
        console.log("TEST FAILED", key )
        failed++
      }
    }
    console.log("*****************************TEST RESULTS - Passed: " + passed + ", Failed: " + failed )
  }else{
    let expectedResult = answers[testKey],
				result = flatten.call( Euclid.apply( null, testKey.split(',') ) ).join('')

    console.log( result, expectedResult )

    if( result == expectedResult ) {
      console.log("TEST PASSED FOR", testKey)
    }else{
      console.log("TEST FAILED FOR", testKey)
    }
  }
}

return Euclid
}

},{}],133:[function(require,module,exports){
module.exports = function( Gibber ) {

const Pattern = Gibber.Pattern

const Hex = function( hexString, time = 1/16, rotation ) {
  let count = 0,
      onesAndZeros = ''

  if( typeof hexString === 'string' ) {
    for( let chr of hexString ) {
      let num = Number( '0x'+chr )

      onesAndZeros += (num & 8) > 0 ? 1 : 0
      onesAndZeros += (num & 4) > 0 ? 1 : 0
      onesAndZeros += (num & 2) > 0 ? 1 : 0
      onesAndZeros += (num & 1) > 0 ? 1 : 0
    }
  }else{
    onesAndZeros = hexString.toString(2)
    while( onesAndZeros.length < 16 ) {
      onesAndZeros = '0'+onesAndZeros
    }
  }

  let __onesAndZeros = onesAndZeros.split('') 

  const pattern = Gibber.Pattern( ...__onesAndZeros ) 
  
  pattern.onrender = function( rendered ) {
    rendered.type = 'Hex'

    rendered.time = time

    rendered.output = { time, shouldExecute: 0 }

    rendered.addFilter( ( args, ptrn ) => {
      let val = args[ 0 ]

      ptrn.output.time = Gibberish.Clock.time( ptrn.time )
      ptrn.output.shouldExecute = parseInt(val) 

      args[ 0 ] = ptrn.output 

      return args
    })
  }

  pattern.reseed = ( ...args )=> {
    let n, k
    
    if( Array.isArray( args[0] ) ) {
      k = args[0][0]
      n = args[0][1]
    }else{
      k = args[0]
      n = args[1]
    }

    if( n === undefined ) n = 16
    
    out = createStartingArray( n,k )
    let _onesAndZeros = Inner( n,k )
    
    pattern.set( _onesAndZeros )
    pattern.time = 1 / n

    // this.checkForUpdateFunction( 'reseed', pattern )

    return pattern
  }

  //Gibber.addSequencingToMethod( pattern, 'reseed' )

  if( typeof rotation === 'number' ) pattern.rotate( rotation )

  return pattern
}

return Hex

}

},{}],134:[function(require,module,exports){
const Gibber = {
  initialized: false,
  exportTarget: null,
  plugins: [],
  // needed so audio plugin can transfer pattern function string to worklet
  __Pattern: require( './pattern.js' ),

  /* 
   * const promises = Gibber.init([
   *   {
   *     plugin:Audio, // Audio is required, imported, or grabbed via <script>
   *     options: { workletPath:'../dist/gibberish_worklet.js' }
   *   },
   *   {
   *     plugin:Graphics,
   *     options:{ canvas:document.querySelector('canvas' ) }
   *   }
   * ])
  */

  init( plugins ) { 
    this.createPubSub( this )
    this.plugins = plugins

    const promises = []

    // init each plugin and collect promises
    for( let plugin of plugins ) {
      promises.push( 
        plugin.plugin.init( plugin.options, this ) 
      )
    }

    const p = new Promise( (resolve,reject) => {
      const finishedInitPromise = Promise.all( promises ).then( values => {
        
        this.Pattern = this.__Pattern( this )
        this.Seq      = require( './seq.js'      )( this )
        this.Tidal    = require( './tidal.js'    )( this )
        this.Euclid   = require( './euclid.js'   )( this )
        this.Hex      = require( './hex.js'      )( this ) 
        this.Triggers = require( './triggers.js' )( this )
        this.Steps    = require( './steps.js'    )( this )

        values.forEach( v => {
          if( Array.isArray( v ) ) 
            this[ v[1] ] = v[0]
        })

        Gibber.publish( 'init' )
        
        resolve()
      })
    })
  
    return p
  },

  log( ...args ) {
    if( Gibber.Environment ) {
      Gibber.Environment.log( ...args )
    }else{
      console.log( ...args )
    }
  },

  error( ...args ) {
    if( Gibber.Environment ) {
      Gibber.Environment.error( ...args )
    }else{
      console.error( ...args )
    }
  },

  export( obj ) {
    // XXX must keep reference to main pattern function
    // so it can be serialized and transferred to audioworklet  
    obj.Pattern  = this.Pattern
    obj.Seq = this.Seq
    obj.Tidal = this.Tidal
    obj.Euclid = this.Euclid
    obj.Hex = this.Hex
    obj.Triggers = this.Triggers
    obj.Steps = this.Steps

    this.plugins.forEach( p => {
      p.plugin.export( obj, Gibber ) 
    })

    //obj.Clock = this.Clock
    //obj.WavePattern = this.WavePattern
  },

  // XXX stop clock from being cleared.
  clear() { 
    for( let plugin of Gibber.plugins ) {
      plugin.plugin.clear()
    }

    this.Seq.clear()
    this.Tidal.clear()

    this.publish( 'clear' )
  },

  onload() {},

  createPubSub( obj ) {
    const events = {}
    obj.subscribe = function( key, fcn ) {
      if( typeof events[ key ] === 'undefined' ) {
        events[ key ] = []
      }
      events[ key ].push( fcn )
    }

    obj.unsubscribe = function( key, fcn ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.splice( arr.indexOf( fcn ), 1 )
      }
    }

    obj.publish = function( key, data ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.forEach( v => v( data ) )
      }
    }
  },

  // When a property is created, a proxy-ish object is made that is
  // prefaced by a double underscore. This object holds the value of the 
  // property, sequencers for the property, and modulations for the property.
  // Alternative getter/setter methods can be passed as arguments.
  createProperty( obj, name, value, post=null, priority=0, transform=null, isPoly=false ) {
    obj[ '__' + name ] = { 
      value,
      isProperty:true,
      sequencers:[],
      tidals:[],
      mods:[],
      name,
      type:obj.type,
      __owner:obj,

      fade( from=0, to=1, time=4, delay=0 ) {
        Gibber[ obj.type ].createFade( from, to, time, obj, name, delay )
        return obj
      }
    }

    Gibber.addSequencing( obj, name, priority, value, '__' )

    Object.defineProperty( obj, name, {
      configurable:true,
      get: Gibber[ obj.type ].createGetter( obj, name ),
      set: Gibber[ obj.type ].createSetter( obj, name, post, transform, isPoly )
    })
  },

  getType( obj ) {
    let type
    switch( from.type ) {
      case 'audio':
      case 'Audio':
        type = Gibber.Audio
        break
      case 'graphics':
      case 'Graphics':
        type = Gibber.Graphics
        break
      case 'gen':
        type = 'gen'
        break
    }

    return type
  },

  mappings: {},
  
  createMapping( from, to, name, wrappedTo ) {
    const fromlib = this.getType( from ),
          tolib   = this.getType( to )


    if( mappings[ tolib ] !== undefined &&
      mappings[ tolib ][ fromlib ] !== undefined ) {
      
      const mapper = mappings[ tolib ][ fromlib ]

      mapper( name, to, from )
    }

  
    //if( from.type === 'audio' ) {
    //  const f = to[ '__' + name ].follow = Follow({ input: from, bufferSize:4096 })

    //  Marching.callbacks.push( time => {
    //    if( f.output !== undefined ) {
    //      to[ name ] = f.output
    //    }
    //  })

    //  let m = f.multiplier
    //  Object.defineProperty( to[ name ], 'multiplier', {
    //    configurable:true,
    //    get() { return m },
    //    set(v) { m = v; f.multiplier = m }
    //  })

    //  let o = f.offset
    //  Object.defineProperty( to[ name ], 'offset', {
    //    configurable:true,
    //    get() { return o },
    //    set(v) { o = v; f.offset = o }
    //  })
    //}else if( from.type === 'gen' ) {
    //  const gen = from.render( 60, 'graphics' )

    //  // needed for annotations
    //  to[ name ].value.id = to[ name ].value.varName

    //  // XXX fix the two possible locations for the callback
    //  if( to[ name ].value.callback !== undefined ) {
    //    const idx = Marching.callbacks.indexOf( to[ name ].value.callback )
    //    Marching.callbacks.splice( idx, 1 )
    //  }else if( to[ '__'+name ].callback !== undefined ) {
    //    const idx = Marching.callbacks.indexOf( to[ '__'+name ].callback )
    //    Marching.callbacks.splice( idx, 1 )
    //  }

    //  // XXX fix the two possible locations for the callback
    //  if( typeof to[ name ].value === 'object' ) {
    //    to[ name ].value.callback = t => {
    //      const val = gen()
    //      to[ name ] = val
    //      //console.log( 'val:', val, to[ name ].value.widget !== undefined )
    //      let target = to[ name ].value.widget !== undefined ? to[ name ].value.widget : from.widget

    //      if( target === undefined && to[ name ].value.mark !== undefined ) 
    //        target = to[ name ].value.mark.replacedWith

    //      Gibber.Environment.codeMarkup.waveform.updateWidget( target, val, false )
    //    }
    //  }else{
    //    // assignment hack while DOM creation is taking place,
    //    // only needed for mappings to individual vector elements.
    //    if( to[ '__'+name ].widget === undefined ) {
    //      setTimeout( ()=> to[ '__'+name ].widget = gen.pre.widget, 150 )
    //    }

    //    to[ '__'+name ].callback = t => {
    //      const val = gen()
    //      to[ name ] = val
    //      Gibber.Environment.codeMarkup.waveform.updateWidget( to[ '__'+name ].widget, val, false )
    //    }
    //  }

    //  if( typeof to[ name ].value !== 'object' ) {
    //    Marching.callbacks.push( to[ '__'+name ].callback )
    //  }else{
    //    Marching.callbacks.push( to[ name ].value.callback )
    //  }
    //}
  },

  addSequencing( obj, name, priority, value, prefix='' ) {
    if( obj[ prefix+name ] === undefined ) obj[ prefix+name ] = {}

    obj[ prefix+name ].sequencers = []
    obj[ prefix+name ].seq = function ( values, timings, number = 0, delay = 0 ) {
      if( value !== undefined && typeof value === 'object' ) value.name = obj.name
      const type = obj.type === 'gen' ? 'audio' : obj.type
      Gibber.Seq({ 
        values, 
        timings, 
        target:obj,
        key:name,
        priority,
        delay,
        number,
        standalone:false,
        name:obj.name
      })

      return obj
    }

    obj[ prefix+name ].tidal = function( pattern,  number = 0, delay = 0 ) {
      if( value !== undefined ) value.name = obj.name
      const type = obj.type === 'gen' ? 'audio' : obj.type
      const s = Gibber.Tidal({ 
        pattern, 
        target:obj, 
        key:name,
        number,
        delay,
        standalone:false
      })

      // return object for method chaining
      return obj
    }
  }
  
}

module.exports = Gibber 

},{"./euclid.js":132,"./hex.js":133,"./pattern.js":135,"./seq.js":136,"./steps.js":137,"./tidal.js":138,"./triggers.js":139}],135:[function(require,module,exports){
const patternWrapper = function( Gibber ) {
  "use strict"

  // hack to pass Gibberish to pattern generator from within worklet processor
  let Gibberish
  if( Gibber.Gibberish === undefined ) {
    Gibberish = Gibber.Audio !== undefined ? Gibber.Audio.Gibberish : Gibber 
  }else{
    Gibberish = Gibber.Gibberish
  }

  let PatternProto = Object.create( function(){} )

  // this prototype is somewhat limited, as we want to be able to add
  // .seq() methods to everything. This means that every pattern needs its own
  // copy of each method. One alternative would be to use a more comprehensive
  // prototype and then place proxies on each method of each pattern that access
  // object-specific sequencers... but just making copies of all functions is certainly
  // simpler.
  Object.assign( PatternProto, {
    type:'pattern',
    DNR: -987654321,
    concat( _pattern ) { this.values = this.values.concat( _pattern.values ) },  
    //toString() { return this.values.toString() },
    //valueOf() { return this.values },

    __message(  key, args ) {
      if( this.category === 'audio' ) {
        if( Gibberish.mode === 'processor' )
          Gibberish.processor.messages.push( this.id, key, args )
      } 
    },

    getLength() {
      let l
      if( this.start <= this.end ) {
        l = this.end - this.start + 1
      }else{
        l = this.values.length + this.end - this.start + 1
      }
      return l
    },

    runFilters( val, idx ) {
      let args = [ val, 1, idx ] // 1 is phaseModifier

      for( let filter of this.filters ) {
        const __args = args
        try {
          args = filter( args, this ) 
        } catch( e ) {
          console.error( e )
          console.log( 'filter problem?' )
          console.log( `removing bad filter from pattern: ${filter.toString()}` ) 
          const idx = this.filters.indexOf( filter )
          this.filters.splice( idx, 1 )
          args = __args
        }
      }

      // XXX why is this one off from the worklet-side pattern id?
      this.__message( 'update.value', args.override === undefined ? args[0] : args.override ) 
      this.__message( 'update.currentIndex', args[2] ) 
      if( this.isGen === true ) {
        this.__message( 'waveformPoint', args.override === undefined ? args[0] : args.override ) 
      }

      return args
    },

    checkForUpdateFunction( name, ...args ) {
      if( this.__delayAnnotations === true ) {
        setTimeout( ()=> {
          if( this.listeners[ name ] ) {
            this.listeners[ name ].apply( this, args )
          }else if( Pattern.listeners[ name ] ) {
            Pattern.listeners[ name ].apply( this, args )
          }
        }, 5 )
      }else{
        if( this.listeners[ name ] ) {
          this.listeners[ name ].apply( this, args )
        }else if( Pattern.listeners[ name ] ) {
          Pattern.listeners[ name ].apply( this, args )
        }
      }
    },

    // used when _onchange has not been assigned to individual patterns
    _onchange() {},

    // XXX it would be nice if filters used a similar style to fx chains...
    // pattern.filters.add( ) etc.
    addFilter( filter, name=null ) {
      if( name !== null ) {
        filter.__name = name
        const idx = this.filters.findIndex( f => f.__name === name )
        this.filters.splice( idx, 1 )  
      }
      this.filters.push( filter )
      return this
    },

    removeFilter( idx=null ) {
      if( idx !== null ) {
        this.filters.splice( idx, 1 )  
      }else{
        this.filters.length = 0
      }

      return this
    },

    inspect() {
      if( Gibberish.mode === 'processor' ) 
        console.table({ values:this.values.toString(), 'number of filters':this.filters.length, phase:this.phase })
    },

    render( cat='Audio' ) {
      this.category = cat
      if( typeof Gibber[ cat ] === 'object' && typeof Gibber[ cat ].patternRender === 'function' ) {
        Gibber[ cat ].patternRender( this )
      }
      if( typeof this.onrender === 'function' ) {
        this.onrender()
      }
    },

    copy() {
      const p = Pattern( ...this.values )
      //this.filters.forEach( f => p.addFilter( f ) )
      p.start = this.start
      p.end   = this.end
      p.phase = this.phase

      return p
    },

    __methodNames:  [
      'rotate','switch','invert','flip',
      'transpose','reverse','shuffle','scale',
      'store', 'range', 'set', 'freeze', 'thaw', 'double'
    ]

  })

  const Pattern = function( ...args ) {
    //console.log( 'args[0]:', args[0].isPattern, args[0] )
    //if( typeof args[0] === 'function' && args[0] !== null && args[0].isPattern === true ) {
    //  console.log( 'got pattern' )
    //  return args[0]
    //}

    const isFunction = args.length === 1 && typeof args[0] === 'function',
          isGen = typeof args[0] === 'object' && args[0].__isGen

    //if( isGen === true ) { 
    //  // must have a priority or it screws us codegen for analysis
    //  args[0].priority = 0
    //  Gibberish.analyzers.push( args[0] )
    //  Gibberish.dirty( Gibberish.analyzers )
    //}


    const fnc = function() {
      let len = fnc.getLength(),
          idx, val, args

      if( len === 1 ) { 
        idx = 0 
      }else{
        idx = fnc.phase > -1 ? Math.floor( fnc.start + (fnc.phase % len ) ) : Math.floor( fnc.end + (fnc.phase % len ) )
      }

      if( isFunction ) {
        val = fnc.values[ 0 ]()
        args = fnc.runFilters( val, idx )
        val = args[0]
      } else if( isGen === true ) {
        val = fnc.values[ 0 ].callback.out[0]

        args = fnc.runFilters( val, idx )
        val = args[0]
      }else{
        val = fnc.values[ Math.floor( idx % fnc.values.length ) ]
        args = fnc.runFilters( val, idx )
      
        fnc.phase += fnc.stepSize * args[ 1 ]


        val = args[ 0 ]
      }
      // check to see if value is a function, and if so evaluate it
      //if( typeof val === 'function' ) {
        //val = val()
      //}
      /*else if ( Array.isArray( val ) ) {
        // if val is an Array, loop through array and evaluate any functions found there. TODO: IS THIS SMART?

        for( let i = 0; i < val.length; i++ ){
          if( typeof val[ i ] === 'function' ) {
            val[ i ] = val[ i ]()
          }
        }
      }
      */

      //XXX is this needed? Adding it interferes with Steps
      //if( val === fnc.DNR ) val = null

      return val
    }



    let out 
    Object.assign( fnc, {
      category:'audio',
      start : 0,
      end   : 0,
      phase : 0,
      values : args, 
      isPattern: true,
      __frozen:false,
      // wrap annotation update in setTimeout( func, 0 )
      __delayAnnotations:false,
      //values : typeof arguments[0] !== 'string' || arguments.length > 1 ? Array.prototype.slice.call( arguments, 0 ) : arguments[0].split(''),    
      original : null,
      storage : [],
      stepSize : 1,
      integersOnly : false,
      filters : [],
      __listeners: [],
      onchange : null,
      isop:true,
      isGen,

      freeze( shouldFreezeTheory = true ) {
        fnc.__frozen = true
      },
      thaw() {
        fnc.__frozen = false
        Gibber.Theory.thaw()
      },

      setSeq( seq ) {
        this.seq = seq
      },

      range(...args) {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.range( ...args )
          return this
        }

        if( !fnc.__frozen ) {
          let start, end
          
          if( Array.isArray( arguments[0] ) ) {
            start = arguments[0][0]
            end   = arguments[0][1]
          }else{
            start = arguments[0]
            end   = arguments[1]
          }
          
          if( start < end ) {
            fnc.start = start
            fnc.end = end
          }else{
            fnc.start = end
            fnc.end = start
          }

          this.checkForUpdateFunction( 'range', fnc )
        }

        return fnc
      },
      double(...args) {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.double(...args)
          return this
        }
        if( !fnc.__frozen ) {

          fnc.values.push( ...fnc.values ) 
          
          fnc.end = fnc.values.length - 1
          
          // if( fnc.end > fnc.values.length - 1 ) {
          //   fnc.end = fnc.values.length - 1
          // }else if( fnc.end < )
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }
          fnc._onchange()
        }
        
        return fnc
      },   

      set(...args) {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.set(...args)
          return this
        }
        if( !fnc.__frozen ) {
          let args = Array.isArray( arguments[ 0 ] ) ? arguments[ 0 ] : arguments
          
          fnc.values.length = 0

          const tmp = [] 
          
          for( let i = 0; i < args.length; i++ ) {
            const val = args[i].isPattern === true ? args[ i ].original.slice(0) : args[ i ] 
            tmp.push( val )
          }
          fnc.values = tmp
          
          fnc.end = fnc.values.length - 1
          
          // if( fnc.end > fnc.values.length - 1 ) {
          //   fnc.end = fnc.values.length - 1
          // }else if( fnc.end < )
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }
          fnc._onchange( 'set', fnc.values ) //args )
        }
        
        return fnc
      },
       
      reverse() {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.reverse()
          return this
        }
        if( !fnc.__frozen ) {
          let array = fnc.values,
              left = null,
              right = null,
              length = array.length,
              temporary;
              
          for ( left = 0, right = length - 1; left < right; left += 1, right -= 1 ) {
            temporary = array[ left ]
            array[ left ] = array[ right ]
            array[ right ] = temporary;
          }
          
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', array ) 
            fnc.__message( '_onchange', true ) 
          }

          fnc._onchange( 'reverse', null )
        }
        
        return fnc
      },
      // humanize: function( randomMin, randomMax ) {
   //      let lastAmt = 0
   //
   //      for( let i = 0; i < this.filters.length; i++ ) {
   //        if( this.filters[ i ].humanize ) {
   //          lastAmt = this.filters[ i ].lastAmt
   //          this.filters.splice( i, 1 )
   //          break;
   //        }
   //      }
   //
   //      let filter = function( args ) {
   //        console.log( filter.lastAmt, args[0])
   //        args[ 0 ] -= filter.lastAmt
   //        filter.lastAmt = Gibber.Clock.time( Gibber.Utilities.rndi( randomMin, randomMax ) )
   //
   //        console.log( "LA", filter.lastAmt )
   //        args[0] += filter.lastAmt
   //
   //        return args
   //      }
   //      filter.lastAmt = lastAmt
   //      filter.humanize = true
   //
   //      this.filters.push( filter )
   //
   //      return this
   //    },
      repeat() {
        let counts = {}
      
        for( let i = 0; i < arguments.length; i +=2 ) {
          counts[ arguments[ i ] ] = {
            phase: 0,
            target: arguments[ i + 1 ]
          }
        }
        
        let repeating = false, repeatValue = null, repeatIndex = null
        let filter = function( args ) {
          let value = args[ 0 ], phaseModifier = args[ 1 ], output = args
          
          //console.log( args, counts )
          if( repeating === false && counts[ value ] ) {
            repeating = true
            repeatValue = value
            repeatIndex = args[2]
          }
          
          if( repeating === true ) {
            if( counts[ repeatValue ].phase !== counts[ repeatValue ].target ) {
              output[ 0 ] = repeatValue            
              output[ 1 ] = 0
              output[ 2 ] = repeatIndex
              //[ val, 1, idx ]
              counts[ repeatValue ].phase++
            }else{
              counts[ repeatValue ].phase = 0
              output[ 1 ] = 1
              if( value !== repeatValue ) { 
                repeating = false
              }else{
                counts[ repeatValue ].phase++
              }
            }
          }
        
          return output
        }
      
        fnc.filters.push( filter )
      
        return fnc
      },
    
      reset() { 
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.reset()
          return this
        }
        if( !fnc.__frozen ) {
          // XXX replace with some type of standard deep copy
          if( Array.isArray( fnc.original[0] ) ) {
            const arr = []
            for( let i = 0; i < fnc.original.length; i++ ) {
              const chord = fnc.original[ i ]
              arr[ i ] = []
              for( let j = 0; j < chord.length; j++ ) {
                arr[ i ][ j ] = chord[ j ] 
              }
            }
            fnc.values = arr
          }else{
            fnc.values = fnc.original.slice(0)
          }
          //fnc.set( fnc.original.slice( 0 ) );
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }  
          fnc._onchange( 'reset', null )
        }

        return fnc 
      },

      store( pos ) { fnc.storage[ pos || fnc.storage.length ] = fnc.values.slice( 0 ); return fnc; },

      transpose( amt ) { 
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.transpose( amt )
          return this
        }
        if( !fnc.__frozen ) {
          for( let i = 0; i < fnc.values.length; i++ ) { 
            let val = fnc.values[ i ]
            
            if( Array.isArray( val ) ) {
              for( let j = 0; j < val.length; j++ ) {
                if( typeof val[ j ] === 'number' ) {
                  val[ j ] = fnc.integersOnly ? Math.round( val[ j ] + amt ) : val[ j ] + amt
                }
              }
            }else{
              if( typeof val === 'number' ) {
                fnc.values[ i ] = fnc.integersOnly ? Math.round( fnc.values[ i ] + amt ) : fnc.values[ i ] + amt
              }
            }
          }
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', ['transpose', amt] ) 
          }      
          //fnc._onchange( 'transpose', amt )
        }
        
        return fnc
      },

      shuffle() { 
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.shuffle( )
          return this
        }
        if( !fnc.__frozen ) {
          Gibber.Utility.shuffle( fnc.values )
          fnc._onchange( 'shuffule', null )
        }
        
        return fnc
      },

      scale( amt ) { 
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.scale( amt )
          return this
        }
        if( !fnc.__frozen ) {
          fnc.values.map( (val, idx, array) => {
            if( Array.isArray( val ) ) {
              array[ idx ] = val.map( inside  => {
                if( typeof inside === 'number' ) {
                  return fnc.integersOnly ? Math.round( inside * amt ) : inside * amt
                } else {
                  return inside
                }
              })
            }else{
              if( typeof val === 'number' ) {
                array[ idx ] = fnc.integersOnly ? Math.round( val * amt ) : val * amt
              }
            }
          })
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }
          fnc._onchange( 'scale', amt )
        }
        
        return fnc
      },

      flip() {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.flip( )
          return this
        }
        if( !fnc.__frozen ) {
          let start = [],
              ordered = null
        
          ordered = fnc.values.filter( function(elem) {
            let shouldPush = start.indexOf( elem ) === -1
            if( shouldPush ) start.push( elem )
            return shouldPush
          })
        
          ordered = ordered.sort( function( a,b ){ return a - b } )
        
          for( let i = 0; i < fnc.values.length; i++ ) {
            let pos = ordered.indexOf( fnc.values[ i ] )
            fnc.values[ i ] = ordered[ ordered.length - pos - 1 ]
          }
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }       
          fnc._onchange( 'flip', null )
        }
      
        return fnc
      },
      
      invert() {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.invert( )
          return this
        }
        if( !fnc.__frozen ) {
          let prime0 = fnc.values[ 0 ]
          
          for( let i = 1; i < fnc.values.length; i++ ) {
            if( typeof fnc.values[ i ] === 'number' ) {
              let inverse = prime0 + (prime0 - fnc.values[ i ])
              fnc.values[ i ] = inverse
            }
          }
          
          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }

          fnc._onchange( 'invert', null )
        }
        
        return fnc
      },
    
      switch( to ) {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.switch( to )
          return this
        }
        if( !fnc.__frozen ) {
          if( fnc.storage[ to ] ) {
            fnc.values = fnc.storage[ to ].slice( 0 )
          }
          
          fnc._onchange( 'switch', to )
        }
        
        return fnc
      },
    
      rotate( amt ) {
        if( this.__rendered !== undefined && this.__rendered !== this ) {
          this.__rendered.rotate( amt )
          return this
        }
        if( !fnc.__frozen ) {
          if( amt > 0 ) {
            while( amt > 0 ) {
              let end = fnc.values.pop()
              fnc.values.unshift( end )
              amt--
            }
          }else if( amt < 0 ) {
            while( amt < 0 ) {
              let begin = fnc.values.shift()
              fnc.values.push( begin )
              amt++
            }
          }

          if( Gibberish.mode === 'processor' ) {
            fnc.__message( 'values', fnc.values ) 
            fnc.__message( '_onchange', true ) 
          }

          fnc._onchange( 'rotate', amt )
        }
        
        return fnc
      },

      clear() {
        if( Gibberish.mode === 'worklet' ) {
          for( let key of PatternProto.__methodNames ) {
            for( let i = 0; i < out[ key ].sequencers.length; i++ ) {
              // this can most certainly be optimized, but I had real problems
              // getting this clearing to work, perhaps related to proxy behaviors?
              const __seq = Gibber.Seq.sequencers.find( s => s.id === out[ key ][ i ].id )
              if( __seq !== undefined ) {
                Gibber.Audio.Gibberish.worklet.port.postMessage({ address:'method', object:__seq.id, name:'stop', args:[] })
              
                __seq.stop()
                __seq.clear()

                const idx = Gibber.Seq.sequencers.indexOf( __seq )
                Gibber.Seq.sequencers.splice( idx, 1 )
                __seq.target[ __seq.key ][0].stop()
              }
            }
          } 
        }else{
          // genish-based patterns are connected as analyzers so that they
          // don't have to feed into a bus to get rendered. we must remove them
          // from the analysis array to finalize clearing.
          if( out.isGen === true ) {
            const idx = Gibberish.analyzers.indexOf( args[0] )
            if( idx !== -1 ) {
              Gibberish.analyzers.splice( idx, 1 )
              Gibberish.analyzers.dirty = true
            }
          }
        }
      }
    })
    
    if( Gibberish.mode === 'worklet' ) {
      fnc.id = Gibberish.utilities.getUID()

      if( isGen === true ) {
        fnc.waveformPoint = val => {
          // accounts for annoying edge case where wave pattern is
          // inlined to a call to .seq
          // XXX fix in parsing or somehow figure out how to only do this once
          if( fnc.widget !== undefined ) fnc.values[0].widget = fnc.widget
          if( fnc.values[0].widget !== undefined ) {

            // convert samples to beats
            if( fnc.__patternType === 'timings' ) {
              val = Gibber.Clock.stob( val )
            }
            fnc.values[0].widget.values[ fnc.values[0].widget.values.length - 1 ] = { value:val } 
          }
        }
      }
    }
    //fnc.filters.pattern = fnc
    // can I resotre this without making the object non-serializable?
    //fnc.retrograde = fnc.reverse.bind( fnc )
    
    fnc.end = fnc.values.length - 1
    
    /*
    fnc.filters.test = function() { console.log( 'test' ) }
    
    fnc.filters.add = function( f ) {
      this.filters.push( f )
    }.bind(fnc)
    fnc.filters.remove = function( idx ) {
      console.log( 'filter:', this )
      this.filters.splice( idx, 1 )
    }.bind( fnc )
    fnc.filters.inspect = function() {
      console.log( `there are currenly ${this.length} filters on this pattern` )
    }.bind(fnc)
    */

    if( Array.isArray( fnc.values[0] ) ) {
      const arr = []
      for( let i = 0; i < fnc.values.length; i++ ) {
        const chord = fnc.values[ i ]
        arr[ i ] = []
        for( let j = 0; j < chord.length; j++ ) {
          arr[ i ][ j ] = chord[ j ] 
        }
      }
      fnc.original = arr
    }else{
      fnc.original = fnc.values.slice(0)
    }

    fnc.storage[ 0 ] = fnc.original.slice( 0 )
    fnc.integersOnly = fnc.values.every( function( n ) { return n === +n && n === (n|0); })
    
    fnc.listeners = {}
    fnc.sequences = {}

    if( Gibberish.mode === 'worklet' ) {

      for( let key of PatternProto.__methodNames ) { 
        Gibber.addSequencing( fnc,key,2,undefined )
      }
      //for( let key of PatternProto.__methodNames ) { 
      //  fnc.sequencers[ key ] = Gibber.Core !== undefined 
      //    ? Gibber.Core.addSequencing( fnc, key, 2 ) 
      //    : Gibber.addSequencing( fnc,key,2 )
      //}
      fnc.sequences.reset = Gibber.addSequencing( fnc, 'reset', 1 )
    }
    
    // TODO: Gibber.createProxyProperties( fnc, { 'stepSize':0, 'start':0, 'end':0 })
    
    fnc.__proto__ = PatternProto 

    let pn = ''
    Object.defineProperty( fnc, 'patternName', {
      get() { return pn },
      set(__pn) {
        pn = __pn
      }
    })

    fnc.render = function( mode='audio' ) {
      if( mode === 'audio' ) {
        // 'isPattern' is a hack to force pattern initialization arguments to be submitted as
        // a list, instead of in a property dictionary. When 'isPattern' is true, gibberish
        // looks for an 'inputs' property and then passes its value (assumed to be an array)
        // using the spread operator to the constructor. 
        out = Gibberish.Proxy( 'pattern', { inputs:fnc.values, isPattern:true, filters:fnc.filters, id:fnc.id }, fnc ) 

        if( isGen === true ) { 
          // must have a priority or it screws up codegen for analysis
          args[0].priority = 0
          Gibberish.analyzers.push( args[0] )
          Gibberish.dirty( Gibberish.analyzers )
        }
      }

      if( args.filters ) {
        args.filters.forEach( f => out.addFilter( f ) )
      }else if( typeof args[0] === 'object' && args[0].filters ) {
        args[0].filters.forEach( f => out.addFilter( f ) )
      }

      Pattern.children.push( out )

      if( fnc.onrender ) fnc.onrender( out )

      fnc.__rendered = out

      return out
    }
    if( Gibberish.mode === 'processor' ) return fnc.render()

    return fnc 
  }

  Pattern.listeners = {}
  Pattern.children = []
  Pattern.__isFrozen = false
  Pattern.freeze = function( shouldFreezeTheory = true ) {
    Pattern.children.forEach( p => p.freeze() ) 
    if( shouldFreezeTheory === true ) {
      Gibber.Theory.freeze()
      Pattern.__isFrozen = true
    }
  }
  Pattern.thaw = ()=> {
    Pattern.children.forEach( p => p.thaw() )
    if( Pattern.__isFrozen === true ) {
      Gibber.Theory.thaw()
      Pattern.__isFrozen = false
    }
  }

  Pattern.export = function( obj ) {
    obj.freeze = Pattern.freeze
    obj.thaw   = Pattern.thaw
  }

  Pattern.listeners.range = function( fnc ) {
    //if( !Notation.isRunning ) return
    
    if( Gibberish.mode === 'processor' ) return

    // TODO: don't use Gibber.currentTrack, store the object in the pattern
    let rangeStart = fnc.markers[ fnc.start ].find(),
        rangeEnd   = fnc.markers[ fnc.end ].find()

    if( !fnc.range.init ) {
      fnc.range.init = true
      var ptrnStart = fnc.markers[ 0 ].find(),
          ptrnEnd = fnc.markers[ fnc.markers.length - 1 ].find()

      //fnc.column.editor.markText( ptrnStart.from, ptrnEnd.to, { className:'rangeOutside' })
      Gibber.Environment.editor.markText( ptrnStart.from, ptrnEnd.to, { className:'rangeOutside' })//className:'pattern-update-range-outside' })
      if( !Pattern.listeners.range.initialzied ) Pattern.listeners.range.init()
    }

    if( fnc.range.mark ) fnc.range.mark.clear()
    //fnc.range.mark = fnc.column.editor.markText( rangeStart.from, rangeEnd.to, { className:'rangeInside' })
    // TODO: Dont use GE.codemirror... how else do I get this? stored in pattern is created?
    fnc.range.mark = Gibber.Environment.editor.markText( rangeStart.from, rangeEnd.to, { className:'rangeInside' })
  }

  Pattern.listeners.range.init = function() {
    //$.injectCSS({ 
    //  '.rangeOutside': {
    //    'color':'#666 !important'
    //  },
    //  '.rangeInside': {
    //    'color':'rgba(102, 153, 221, 1) !important'
    //  }
    //})
    Pattern.listeners.range.initialized = true
  }

  //Pattern.prototype = PatternProto*/

  return Pattern

}

// helper function to pass the pattern constructor to the gibberish worklet processor.
patternWrapper.transfer = function( Audio, constructorString ) {
  if( Audio.Gibberish !== undefined && Audio.Gibberish.mode === 'worklet' ) {
    Audio.Gibberish.worklet.port.postMessage({
      address:'addConstructor',
      name:'Pattern',
      constructorString
    })
  }
}


module.exports = patternWrapper

},{}],136:[function(require,module,exports){
module.exports = function( Gibber ) {
  const addValuesFilters = (seq,key,target) => {
    const values = seq.values
    const __values = seq.values

    if( __values.randomFlag ) {
      values.addFilter( ( args,ptrn ) => {
        const range = ptrn.values.length - 1
        const idx = Math.round( Math.random() * range )
        return [ ptrn.values[ idx ], 1, idx ] 
      })
      //for( let i = 0; i < this.values.randomArgs.length; i+=2 ) {
      //  valuesPattern.repeat( this.values.randomArgs[ i ], this.values.randomArgs[ i + 1 ] )
      //}
    }

    // trigger autotrig patterns
    if( key === 'note' || key === 'chord' || key === 'trigger' || key === 'notef' || key === 'pickplay' ) {
      values.addFilter( ( args,ptrn ) => {
        if( ptrn.seq.target.autotrig !== undefined ) {
          for( let s of ptrn.seq.target.autotrig ) {
            s.fire()
          }
        }
        return args
      })
    } 
  }

  const addTimingFilters = function( seq,key,renderMode ) {
    const __timings = seq.timings
    if( __timings.randomFlag ) {
      __timings.addFilter( ( args,ptrn ) => {
        const range = ptrn.values.length - 1
        const idx = Math.round( Math.random() * range )
        return [ ptrn.values[ idx ], 1, idx ] 
      })
      //for( let i = 0; i < this.values.randomArgs.length; i+=2 ) {
      //  valuesPattern.repeat( this.values.randomArgs[ i ], this.values.randomArgs[ i + 1 ] )
      //}
    }

    const filter = renderMode === 'Audio' 
      ? (args,ptrn) => {
        if( typeof args[0] === 'number' ) {
          args[0] = Gibberish.Clock.time( args[0] )
        }
        return args
      }
      : (args,ptrn) => {
        if( typeof args[0] === 'number' ) {
          args[0] = Gibber.Clock.time( args[0] )
        }
        return args
      }  

    seq.timings.addFilter( (args,ptrn)=>{
      if( args[0] === 0 ) {
        ptrn.seq.stop()
        console.warn( 'sequencer attempting to fire with a time of zero; this will result in an infinite loop, so the sequencer has been stopped.' )
      }
      return args
    })
    seq.timings.addFilter( filter ) 
  }

  const Seq = function( props ) { 
    let   __values  = props.values
    const __timings = props.timings
    const delay     = props.delay
    const target    = props.target
    const key       = props.key
    const priority  = props.priority
    let   rate      = props.rate || 1
    let   density   = props.density || 1
    let   autotrig  = false
    const render    = props.render || 'Audio'

    const Gibberish = Gibber.Audio.Gibberish !== undefined ? Gibber.Audio.Gibberish : null

    if( __values.type === 'gen' ) {
      __values = __values.render()
    }

    if( Array.isArray( __values ) && __values.length <= 0 ) throw Error('arrays passed to sequences must have at least one value inside of them')
    // convert to pattern if needed and render
    const values = Array.isArray( __values ) 
      ? Gibber.Pattern( ...__values ).render()
      : typeof __values === 'function' && __values.isPattern 
        ? __values.render()
        : __values.requiresRender 
          ? __values
          : Gibber.Pattern( __values ).render()

    // if an array of values is passed, let users call pattern method on that array, for example:
    // a.note.seq( b=[0,1,2,3], 1/4 )
    // b.transpose.seq( 1,1 )
    if( Array.isArray( __values ) ) {
      Object.assign( __values, values )
      __values.addFilter = values.addFilter.bind( values )
      __values.removeFilter = values.removeFilter.bind( values )
      __values.inspect = values.inspect.bind( values )
    } else if( typeof __values === 'object' && __values.type==='gen' ) {
      props.values.addFilter = values.addFilter.bind( values )
      props.values.removeFilter = values.removeFilter.bind( values )
      props.values.inspect = values.inspect.bind( values )
    }

    // process time values
    if( target !== undefined ) {
      if( Gibber[ render ].timeProps[ target.name ] !== undefined 
        && Gibber[ render ].timeProps[ target.name ].indexOf( key ) !== -1  ) {

        const filter = render === 'Audio' 
          ? (args,ptrn) => {
              args[0] = Gibberish.Clock.time( args[0] )
              return args
            }
          : (args,ptrn) => {
              args[0] = Gibber.Audio.Clock.time( args[0] )
              return args
            }

        values.addFilter( filter )
      }
    }
 
    const timings = Array.isArray( __timings ) 
      ? Gibber.Pattern( ...__timings ).render()
      : typeof __timings === 'function' && __timings.isPattern 
        ? __timings.render()
        : __timings === undefined || __timings === null 
          ? null
          : __timings.requiresRender
            ? __timings
            : Gibber.Pattern( __timings ).render()


    if( timings === null ) autotrig = true

    if( Array.isArray( __timings ) ) {
      Object.assign( __timings, timings )
      __timings.addFilter = timings.addFilter.bind( timings )
    }
    if( autotrig === false ) {
      timings.output = { time:'time', shouldExecute:0 }
      timings.density = 1

      // XXX delay annotations so that they occur after values annotations have occurred. There might
      // need to be more checks for this flag in the various annotation update files... right now
      // the check is only in createBorderCycle.js.
      timings.__delayAnnotations = true
    }

    // if an array is passed to the seq, enable users to call pattern methods on array
    //if( Array.isArray( __timings ) ) Object.assign( __timings, timings )

    const clear = render === 'Audio'
      ? function() {
          this.stop()
          
          if( this.values !== undefined && this.values.clear !== undefined  ) {
            this.values.clear()
          }
          if( this.timings !== undefined && this.timings !== null && this.timings.clear !== undefined ) this.timings.clear()

          
          if( Gibberish.mode === 'worklet' ) {
            const idx = Seq.sequencers.indexOf( seq )
            seq.stop()
            const __seq = Seq.sequencers.splice( idx, 1 )[0]
            if( __seq !== undefined ) {
              __seq.stop()
            }
          }
        }
      : function() {
          this.stop()
          
          if( this.values !== undefined && this.values.clear !== undefined  ) this.values.clear()
          if( this.timings !== undefined && this.timings !== null && this.timings.clear !== undefined ) this.timings.clear()

          const idx = Seq.sequencers.indexOf( seq )
          const __seq = Seq.sequencers.splice( idx, 1 )[0]
          if( __seq !== undefined ) {
            __seq.stop()
          }
        }

    values.__patternType = 'values'
    if( timings !== null ) timings.__patternType = 'timings'

    //const offsetRate = Gibberish.binops.Mul(rate, Gibber.Clock.AudioClock )

    // XXX need to fix so that we can use the clock rate as the base
    // XXX need to abstract this so that a graphics sequencer could also be called...
    const seq = Gibber.Audio.Gibberish.Sequencer({ values, timings, density, target, key, priority, rate:1/*Gibber.Clock.AudioClock*/, clear, autotrig, mainthreadonly:props.mainthreadonly })

    if( values.setSeq ) values.setSeq( seq )

    addValuesFilters( seq,key )

    if( autotrig === false ) {
      addTimingFilters( seq,key,render )
      if( timings.setSeq ) timings.setSeq( seq )
    }else{
      if( target !== undefined ) {
        if( target.autotrig === undefined ) {
          target.autotrig = []
          Gibber.Audio.Gibberish.worklet.port.postMessage({
            address:'property',
            name:'autotrig',
            value:[],
            object:target.id
          })

        }
        // object name key value
        if( Gibber.Audio.Gibberish.mode === 'worklet' ) {
          Gibber.Audio.Gibberish.worklet.port.postMessage({
            address:'addObjectToProperty',
            name:'autotrig',
            object:target.id,
            key:target.autotrig.length,
            value:seq.id
          })
          target.autotrig.push( seq )
        }
      }else{
        throw Error('you must define timings for any sequence without a target')
      }
    } 

    //Gibberish.proxyEnabled = false
    //Gibber.Ugen.createProperty( seq, 'density', timings, [], Gibber )
    //Gibberish.proxyEnabled = true

    Seq.sequencers.push( seq )

    // if x.y.seq() etc. 
    // standalone === false is most common use case
    if( props.standalone === false ) { 
      // required ternary because pattern methods don't have __ prefix 
      const targetProp = target[ '__' + key ] === undefined 
        ? target[ key ] 
        : target[ '__' + key ]
      
      const prevSeq = targetProp.sequencers[ props.number ] 
      if( prevSeq !== undefined ) { 
        prevSeq.clear();
      }


      // XXX you have to add a method that does all this shit on the worklet. crap.
      targetProp.sequencers[ props.number ] = seq
      targetProp[ props.number ] = seq 
      //target.__sequencers.push( seq )
      if( typeof delay !== 'function' ) { 
        seq.start( Gibber.Audio.Clock.time( delay ) )
      } else {
        delay.seqs.push( seq )
      }
    }

    Gibber.publish( 'new sequence', seq )

    return seq
  }

  Seq.sequencers = []
  Seq.clear = function() {
    Seq.sequencers.forEach( seq => seq.clear() )
    //for( let i = Seq.sequencers.length - 1; i >= 0; i-- ) {
    //  Seq.sequencers[ i ].clear()
    //}
    Seq.sequencers = []
  }
  Seq.DNR = -987654321

  return Seq

}

},{}],137:[function(require,module,exports){
module.exports = function( Gibber ) {
 
const Steps = {
  type:'Steps',
  create( _steps, target ) {
    const stepseq = Object.create( Steps )
    
    stepseq.seqs = {}

    for( let _key in _steps ) {
      let values = _steps[ _key ]
      const parsedKey = parseInt( _key )
      const key = isNaN( parsedKey ) ? _key : parsedKey

      let usesStringValues = false
      if( values.isPattern !== true ) {
        if( Array.isArray( values ) ) {
          values = Gibber.Pattern( ...values )
        }else if( typeof values === 'string' ) {
          values = values.split('')
          usesStringValues = true
        }else{
          values = Gibber.Pattern( values )
        }
      }

      const seq = Gibber.Seq({
        values: usesStringValues ? values : key,
        timings: usesStringValues ?  [ 1  / values.length ] : values,
        'key': target.__isEnsemble !== true ? 'note' : 'trigger', 
        target: target.__isEnsemble ? target[ target[ key ].name ] : target, 
        priority:0
      })

      const onlyUsesVelocity = typeof key === 'string'


      if( usesStringValues ) {
        seq.values.addFilter( new Function( 'args', 'ptrn', 
         `let sym = args[ 0 ],
              velocity = parseInt( sym, 16 ) / 15

          if( isNaN( velocity ) ) {
            velocity = sym === 'x' 
              ? 1
              : sym === 'X'
                ? 1.5
                : 0
          }

          // TODO: is there a better way to get access to beat, beatOffset and scheduler?
          if( velocity !== 0 ) {
            ${ onlyUsesVelocity ? '' :'ptrn.seq.target.__triggerLoudness = velocity' }
          }

          args[ 0 ] = sym === '.' ? -987654321 : ${typeof key === 'string' ? 'velocity' : key }

          return args
        `) )
      }

      stepseq.seqs[ _key ] = seq
      stepseq[ _key ] = usesStringValues ? seq.values : seq.timings
    }

    stepseq.start()
    stepseq.addPatternMethods()

    return stepseq
  },
  
  /* two parts:
   * 1. The easy part, make methods that can be called from the main thread
   *    and run over every seq instance in the step sequencer
   * 2. The hard part, make an object that lives in the audio thread
   *    and can be sequenced. It needs references to all sequencers in the 
   *    step sequencer.
   */
  addPatternMethods() {
    // XXX shouldn't use audio id by default... sigh
    const id = Gibber.Audio.Gibberish.utilities.getUID()

    // store ids of all controlled sequencers
    const seqIds = []
    for( let key in this.seqs ) {
      seqIds.push( this.seqs[ key ].id )
    }

    // this object will be transferred to audio thread
    const obj = { id, seqIds }

    groupMethodNames.forEach( name => {
      // EASY PART 
      this[ name ] = function( ...args ) { 
        for( let key in this.seqs ) { 
          this.seqs[ key ].values[ name ].apply( this, args ) 
        } 
      }

      this[ name ].sequencers = []
      this[ name ].seq = ( values, timings, number = 0, delay = 0 ) => {
        const s = Gibber.Seq({ 
          values, 
          timings, 
          target:this.__wrapped,
          key:name,
          priority:1,
        }).start()
        
        this[ name ].sequencers.push( s )

        // needed for annotations
        this[ name ][ number ] = s

        return this 
      } 

      // store function body to create function in audio thread representation of steps
      // needs to be one line for stringify / parsing
      // XXX ugh arguments? is there ever more than one argument?
      obj[ name ] = `for( let seq of this.seqs ) { seq.values.${name}.apply( this, arguments ); seq.timings.${name}.apply( this, arguments )}`
    })

    // HARD PART
    // code to be evaluated in audio thread
    // 1. create a new object, steps, bassed on stringifying obj
    // 2. add all of the transform methods
    // 3. store all controlled sequencers in steps.seqs after getting references
    //    from Gibberish.ugens 
    const code = `const steps = JSON.parse( \`${JSON.stringify(obj)}\` )
      const methods = ${JSON.stringify( groupMethodNames ) }
      steps.seqs = steps.seqIds.map( id => Gibberish.ugens.get( id ) )
      for( let method of methods ) {
        steps[ method ] = new Function( steps[ method ] ) 
      }
      Gibberish.ugens.set( steps.id, steps )`
 
    Gibber.Audio.Gibberish.worklet.port.postMessage({
      address:'eval',
      code
    }) 

    this.__wrapped = obj
  },

  start() {
    for( let key in this.seqs ) { 
      this.seqs[ key ].start()
    }
  },

  stop() {
    for( let key in this.seqs ) { 
      this.seqs[ key ].stop()
    }
  },

  clear() { 
    this.stop() 

    for( let key in this.seqs ) {
      this.seqs[ key ].timings.clear()
    }
  }

}

const groupMethodNames = [ 
  'rotate', 'reverse', 'transpose', 'range',
  'shuffle', 'scale', 'repeat', 'store', 
  'reset','flip', 'invert', 'set', 'double'
]

return Steps.create

}

},{}],138:[function(require,module,exports){
module.exports = function( Gibber ) {

  const Seq = function( props ) { 
    const pattern   = props.pattern
    const target    = props.target
    const key       = props.key
    const number    = props.number
    const delay     = props.delay
    const priority  = props.priority || 0
    let   rate      = props.rate || 1
    let   density   = props.density || 1
    let   autotrig  = false


    const render    = target.type !== undefined ? target.type.toLowerCase() : 'audio'
    //const Gibber.Audio.Gibberish = Gibber.Gibber.Audio.Gibberish !== undefined ? Gibber.Gibber.Audio.Gibberish : null

    const clear = render === 'audio'
      ? function() {
          this.stop()
          
          if( Gibber.Audio.Gibberish.mode === 'worklet' ) {
            const idx = Seq.sequencers.indexOf( seq )
            seq.stop()
            const __seq = Seq.sequencers.splice( idx, 1 )[0]
            if( __seq !== undefined ) {
              __seq.stop()
            }
          }
        }
      : function() {
          this.stop()
          
          const idx = Seq.sequencers.indexOf( seq )
          const __seq = Seq.sequencers.splice( idx, 1 )[0]
          if( __seq !== undefined ) {
            __seq.stop()
          }
      }

    const filters = [
      // report back triggered tokens for annotations
      function( val, tidal, uid ) {
        if( Gibberish.mode === 'processor' ) {
          Gibberish.processor.messages.push( tidal.id, 'update.uid', uid )   
          Gibberish.processor.messages.push( tidal.id, 'update.value', val )   
        }
        return val
      } 
    ]

    if( key === 'note' || key === 'chord' || key === 'trigger' ) {
      filters.push( ( args,tidal ) => {
        if( tidal.target.autotrig !== undefined ) {
          for( let s of tidal.target.autotrig ) {
            s.fire()
          }
        }
        return args
      })
    }

    let p
    try {
      p = Gibber.Audio.Gibberish.Tidal.Pattern( pattern ) 
    } catch(e) {
      Gibber.publish( 'error', `\nYour Tidal pattern ${pattern} used invalid syntax.\n` )
      //console.log(`%c\nYour Tidal pattern ${pattern} used invalid syntax.\n`, `color:white;background:#900` )
      return null
    }

    if( key !== 'degree' ) {
      const tokens = [...pattern.matchAll(/[a-zA-Z]+/g)].map( v=>v[0] )
      let tokenNotFound = false
      tokens.forEach( t => {
        if( target[ t ] === undefined ) {
          //console.error(
          //  `%c\nYour Tidal pattern is using a token (${t}) that can't be found on the targeted instrument.`, 
          //  `color:white;background:#900` 
          //  ) 
          
          Gibber.publish( 'error', `\nYour Tidal pattern is using a token (${t}) that can't be found on the targeted instrument.\n` )
          tokenNotFound = true
        }
      })

      if( tokenNotFound === true ) return null
    }

    const seq = Gibber.Audio.Gibberish.Tidal({ pattern, target, key, priority, filters, mainthreadonly:props.mainthreadonly })
    seq.clear = clear
    seq.uid = Gibber.Audio.Gibberish.Tidal.getUID()
    
    //Gibber.Audio.Gibberish.proxyEnabled = false
    //Audio.Ugen.createProperty( seq, 'density', timings, [], Audio )
    //Gibber.Audio.Gibberish.proxyEnabled = true

    Gibber.addSequencing( seq, 'rotate', 1 )

    Seq.sequencers.push( seq )

    Gibber.subscribe( 'clear', ()=> seq.clear() )

    // if x.y.tidal() etc. 
    // standalone === false is most common use case
    if( props.standalone === false ) {
      let prevSeq = target[ '__' + key ].tidals[ number ] 
      if( prevSeq !== undefined ) {
        if( target.__sequencers !== undefined ) {
          const idx = target.__sequencers.indexOf( prevSeq )
          target.__sequencers.splice( idx, 1 )
        }
        // XXX stop() destroys an extra sequencer for some reason????
        prevSeq.stop()
        prevSeq.clear()
        //removeSeq( obj, prevSeq )
      }

      seq.start( Gibber.Audio.Clock.time( delay ) )

      target[ '__' + key ].tidals[ number ] = target[ '__' + key ][ number ] = seq
    }

    Gibber.publish( 'new tidal', seq )
    return seq
  }

  Seq.sequencers = []
  Seq.clear = function() {
    Seq.sequencers.forEach( seq => seq.clear() )
    //for( let i = Seq.sequencers.length - 1; i >= 0; i-- ) {
    //  Seq.sequencers[ i ].clear()
    //}
    Seq.sequencers = []
  }
  Seq.DNR = -987654321

  let val = 1 
  Object.defineProperty( Seq, 'cps', {
    get() { return val },
    set(v) {
      val = v
      Gibber.Audio.Gibberish.Tidal.cps = v
    }
  })

  return Seq

}

},{}],139:[function(require,module,exports){
module.exports = function( Gibber ) {

const Pattern = Gibber.Pattern

const Triggers = function( __values ) {
  const values = __values.split('')
  const pattern = Pattern( ...values ) 
  pattern.isPattern = true
  pattern.type = 'Triggers'
  // need to define custom function to use key as value
  pattern.onrender = function( rendered ) {
    rendered.addFilter( new Function( 'args', 'ptrn', 
     `let sym = args[ 0 ],
          velocity = parseInt( sym, 16 ) / 15

      if( isNaN( velocity ) ) {
        velocity = 0
      }

      if( velocity !== 0 ) {
        ptrn.seq.target.__triggerLoudness = velocity
      }

      ptrn.output = {
        time : Gibberish.Clock.time( ${1/values.length} ),
        shouldExecute: sym !== '.' ? 1 : 0
      }

      args[0] = ptrn.output

      return args`
    ))
  }

  return pattern
}

return Triggers

}

},{}],140:[function(require,module,exports){
let ugen = require( '../ugen.js' )

let analyzer = Object.create( ugen )

Object.assign( analyzer, {
  __type__: 'analyzer',
  priority:0
})

module.exports = analyzer

},{"../ugen.js":210}],141:[function(require,module,exports){
module.exports = function( Gibberish ) {
  const { In, Out, SSD } = require( './singlesampledelay.js'  )( Gibberish )

  const analyzers = {
    SSD,
    SSD_In: In,
    SSD_Out: Out, 
    Follow: require( './follow.dsp.js'  )( Gibberish )
  }
  analyzers.Follow_out = analyzers.Follow.out
  analyzers.Follow_in  = analyzers.Follow.in
  
  analyzers.export = target => {
    for( let key in analyzers ) {
      if( key !== 'export' ) {
        target[ key ] = analyzers[ key ]
      }
    }
  }

  return analyzers

}

},{"./follow.dsp.js":142,"./singlesampledelay.js":143}],142:[function(require,module,exports){
const g = require( 'genish.js' ),
      analyzer = require( './analyzer.js' ),
      ugen = require( '../ugen.js' )

const genish = g

module.exports = function( Gibberish ) {

  const Follow = function( __props ){
    const props = Object.assign( {}, Follow.defaults, __props )

    let isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false

    let out = props 

    /* if we are in the main thread,
     * only send a command to make a Follow instance
     * to the processor thread and include the id #
     * of the input ugen.
     */

    //console.log( 'isStereo:', Gibberish.mode, isStereo, props.input )
    if( Gibberish.mode === 'worklet' ) {
      // send obj to be made in processor thread
      props.input = { id: props.input.id }
      props.isStereo = isStereo

      // creates clashes in processor thread unless
      // we skip a number here... nice
      Gibberish.utilities.getUID()

      props.overrideid = Gibberish.utilities.getUID()

      // XXX seems like this id gets overridden somewhere
      // hence .overrideid
      props.id = props.overrideid

      Gibberish.worklet.port.postMessage({
        address:'add',

        properties:JSON.stringify( props ),

        name:['analysis','Follow']
      })

      Gibberish.worklet.ugens.set( props.overrideid, out )

      let mult = props.multiplier

      Object.defineProperty( out, 'multiplier', {
        get() { return mult },
        set(v){
          mult = v
          Gibberish.worklet.port.postMessage({ 
            address:'set', 
            object:props.overrideid,
            name:'multiplier',
            value:mult
          })
        }
      })

      let offset = props.offset
      Object.defineProperty( out, 'offset', {
        get() { return offset },
        set(v){
          offset = v
          Gibberish.worklet.port.postMessage({ 
            address:'set', 
            object:props.overrideid,
            name:'offset',
            value:offset
          })
        }
      })
    }else{
      //isStereo = props.isStereo

      const buffer = g.data( props.bufferSize, 1 )
      const input  = g.in( 'input' )
      const multiplier = g.in( 'multiplier' )
      const offset     = g.in( 'offset' )
      
      const follow_out = Object.create( analyzer )
      follow_out.id = props.id = __props.overrideid

      let avg = g.data( 1,1, { meta:true } ) // output; make available outside jsdsp block
      const idx = avg.memory.values.idx
  
      const callback = function( memory ) {
        return avg[0]
      }

      const out = {
        callback,
        input:props.input,
        isStereo,
        dirty:true,
        inputNames:[ 'input', 'memory' ],
        inputs:[ props.input ],
        id: Gibberish.utilities.getUID(),

        __properties__: { input:props.input },
      }

      // nonsense to make our custom function work
      out.callback.ugenName = out.ugenName = `follow_out_${follow_out.id}`
      out.id = __props.overrideid

      // begin input tracker
      const follow_in = Object.create( ugen )

      if( isStereo === true ) {
        if( props.outputStereo === false ) {
          { 
            "use jsdsp"
            // phase to write to follow buffer
            const bufferPhaseOut = g.accum( 1,0,{ max:props.bufferSize, min:0 })

            // hold running sum
            const sum = g.data( 1, 1, { meta:true })

            const mono = props.abs === true ? g.abs( input[0] + input[1] ) : input[0] + input[1]

            sum[0] = sum[0] + mono - g.peek( buffer, bufferPhaseOut, { mode:'simple' })

            g.poke( buffer, g.abs( mono ), bufferPhaseOut )

            avg = (sum[0] / props.bufferSize) * multiplier + offset
          }
        }else{
          const bufferL = buffer
          const bufferR = g.data( props.bufferSize, 1 )

          { 
            "use jsdsp"
            // phase to write to follow buffer
            const bufferPhaseOut = g.accum( 1,0,{ max:props.bufferSize, min:0 })

            // hold running sum
            const sumL = g.data( 1, 1, { meta:true })
            const sumR = g.data( 1, 1, { meta:true })

            const left = props.abs === true  ? g.abs( input[0] ) : input[0]
            const right = props.abs === true ? g.abs( input[1] ) : input[1]

            sumL[0] = sumL[0] + left - g.peek( bufferL, bufferPhaseOut, { mode:'simple' })
            sumR[0] = sumR[0] + right- g.peek( bufferR, bufferPhaseOut, { mode:'simple' })

            g.poke( bufferL, g.abs( left  ), bufferPhaseOut )
            g.poke( bufferR, g.abs( right ), bufferPhaseOut )

            avg = [
              (sumL[0] / props.bufferSize) * multiplier + offset,
              (sumR[0] / props.bufferSize) * multiplier + offset,
            ]
          }
        }
      }else{
        {
          "use jsdsp"
          // phase to write to follow buffer
          const bufferPhaseOut = g.accum( 1,0,{ max:props.bufferSize, min:0 })

          // hold running sum
          const sum = g.data( 1, 1, { meta:true })

          const __input = props.abs === true ? g.abs( input ) : input

          sum[0] = sum[0] + __input - g.peek( buffer, bufferPhaseOut, { mode:'simple' })
          
          g.poke( buffer, g.abs( input ), bufferPhaseOut )

          avg = (sum[0] / props.bufferSize) * multiplier + offset
        }
      }
      Gibberish.utilities.getUID()

      props.isStereo = false
      const record = Gibberish.factory( 
        follow_in,
        avg, 
        ['analysis', 'follow_in'], 
        props
      )

      // nonsense to make our custom function work
      record.callback.ugenName = record.ugenName = `follow_in_${follow_out.id}`

      if( Gibberish.analyzers.indexOf( record ) === -1 ) Gibberish.analyzers.push( record )

      Gibberish.dirty( Gibberish.analyzers )

      Gibberish.ugens.set( __props.overrideid, record )

      out.record = record
    }

    return out

  }
 
  Follow.defaults = {
    input:0,
    bufferSize:1024,
    multiplier:1,
    abs: true,
    outputStereo:false,
    offset:0
  }

  return Follow

}

},{"../ugen.js":210,"./analyzer.js":140,"genish.js":51}],143:[function(require,module,exports){
const g = require( 'genish.js' ),
      analyzer = require( './analyzer.js' ),
      proxy    = require( '../workletProxy.js' ),
      ugen     = require( '../ugen.js' )

module.exports = function( Gibberish ) {
 
// an SSD ugen is in effect two-in-one,
// one for input and one for output.  
  
const SSD = inputProps => {
  const ssd = Object.create( analyzer )

  const props = Object.assign({}, SSD.defaults, inputProps )
  const isStereo = props.isStereo 
  const input    = g.in( 'input' )
  const historyL = g.history(0)
  const historyR = g.history(0)

  ssd.out = Out( [historyL,historyR], props )
  ssd.in  =  In( [historyL,historyR], props )

  ssd.listen = ssd.in.listen

  return ssd 
}

const Out = ( histories,props ) => {
  let history
  // if we don't find our history ugen in the processor thread,
  // just go ahead and make a new one, they're cheap...
  if( Gibberish.mode === 'processor' ) {
    const id = Array.isArray( histories ) ? histories[0].id : histories.id
    history = Gibberish.ugens.get( id )
    if( history === undefined ) {
      history = g.history( 0 )
      Gibberish.ugens.set( id, history )
    }
    if( props === undefined ) props = { id }
  }else{
    history = histories[0]
  }

  return Gibberish.factory( Object.create( ugen ), history.out, ['analysis','SSD_Out'], props, null )
}

const In = histories => {
  const input = g.in( 'input' )
  let historyL, historyR
  
  if( Gibberish.mode === 'processor' ) {
    // for some reason the proessor id is always one off from the main thread id
    historyL = Gibberish.ugens.get( histories.id - 1 )
    historyR = Gibberish.ugens.get( histories.id )
  }else{
    historyL = histories[0]
    historyR = histories[1]
  }

  // deliberate let
  let ssdin = Object.create( ugen )
  
  ssdin.listen = function( input ) {
    ssdin.input = input
    // changing the input must trigger codegen
    Gibberish.dirty( Gibberish.analyzers ) 

    let isStereo = input.isStereo
    if( input.isStereo === undefined && input.isop === true ) {
      isStereo = input.inputs[0].isStereo === true || input.inputs[1].isStereo === true 
    }
    if( isStereo === true && Gibberish.mode === 'processor' ) {
      const idx = historyL.graph.memory.value.idx     
      ssdin.callback = function( input, memory ) {
        memory[ idx ] = input[ 0 ]
        memory[ idx + 1 ] = input[ 1 ]
        return 0     
      }

      // when each ugen callback is passed to the master callback function
      // it needs to have a ugenName property; we'll just copy this over
      ssdin.callback.ugenName = ssdin.ugenName
    }
  }

  ssdin = Gibberish.factory( ssdin, input, ['analysis','SSD_In'], { 'input':0 } )

  // overwrite the callback function in the processor thread...
  if( Gibberish.mode === 'processor' ) {
    const idx = historyL.graph.memory.value.idx
    
    ssdin.callback = function( input, memory ) {
      memory[ idx ] = input
      return 0     
    }

    // when each ugen callback is passed to the master callback function
    // it needs to have a ugenName property; we'll just copy this over
    ssdin.callback.ugenName = ssdin.ugenName
  }

  ssdin.type = 'analysis'
  Gibberish.analyzers.push( ssdin )

  return ssdin
}

SSD.defaults = {
  input:0,
  isStereo:false
}

return { In, Out, SSD }

}

},{"../ugen.js":210,"../workletProxy.js":212,"./analyzer.js":140,"genish.js":51}],144:[function(require,module,exports){
const ugen = require( '../ugen.js' ),
      g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const AD = function( argumentProps ) {
    const ad = Object.create( ugen ),
          attack  = g.in( 'attack' ),
          decay   = g.in( 'decay' )

    const props = Object.assign( {}, AD.defaults, argumentProps )

    const graph = g.ad( attack, decay, { shape:props.shape, alpha:props.alpha })

    ad.trigger = graph.trigger
    
    const __out = Gibberish.factory( ad, graph, ['envelopes','AD'], props )

    return __out
  }

  AD.defaults = { attack:44100, decay:44100, shape:'exponential', alpha:5 } 

  return AD

}

},{"../ugen.js":210,"genish.js":51}],145:[function(require,module,exports){
const ugen = require( '../ugen.js' ),
      g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const ADSR = function( argumentProps ) {
    const adsr  = Object.create( ugen ),
          attack  = g.in( 'attack' ),
          decay   = g.in( 'decay' ),
          sustain = g.in( 'sustain' ),
          release = g.in( 'release' ),
          sustainLevel = g.in( 'sustainLevel' )

    const props = Object.assign( {}, ADSR.defaults, argumentProps )

    Object.assign( adsr, props )

    const graph = g.adsr( 
      attack, decay, sustain, sustainLevel, release, 
      { triggerRelease: props.triggerRelease, shape:props.shape, alpha:props.alpha } 
    )

    adsr.trigger = graph.trigger
    adsr.advance = graph.release

    const __out = Gibberish.factory( adsr, graph, ['envelopes','ADSR'], props )

    return __out 
  }

  ADSR.defaults = { 
    attack:22050, 
    decay:22050, 
    sustain:44100, 
    sustainLevel:.6, 
    release: 44100, 
    triggerRelease:false,
    shape:'exponential',
    alpha:5 
  } 

  return ADSR
}

},{"../ugen.js":210,"genish.js":51}],146:[function(require,module,exports){
const g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const Envelopes = {
    AD     : require( './ad.js' )( Gibberish ),
    ADSR   : require( './adsr.js' )( Gibberish ),
    Ramp   : require( './ramp.js' )( Gibberish ),

    export : target => {
      for( let key in Envelopes ) {
        if( key !== 'export' && key !== 'factory' ) {
          target[ key ] = Envelopes[ key ]
        }
      }
    },

    factory( useADSR, shape, attack, decay, sustain, sustainLevel, release, triggerRelease=false ) {
      let env

      // deliberate use of single = to accomodate both 1 and true
      if( useADSR != true ) {
        env = g.ad( attack, decay, { shape }) 
      }else {
        env = g.adsr( attack, decay, sustain, sustainLevel, release, { shape, triggerRelease })
        env.advance = env.release
      }

      return env
    }
  } 

  return Envelopes
}

},{"./ad.js":144,"./adsr.js":145,"./ramp.js":147,"genish.js":51}],147:[function(require,module,exports){
const ugen = require( '../ugen.js' ),
      g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const Ramp = function( argumentProps ) {
    const ramp   = Object.create( ugen ),
          length = g.in( 'length' ),
          from   = g.in( 'from' ),
          to     = g.in( 'to' )

    const props = Object.assign({}, Ramp.defaults, argumentProps )

    const reset = g.bang()

    const phase = g.accum( g.div( 1, length ), reset, { shouldWrap:props.shouldLoop, shouldClamp:true }),
          diff = g.sub( to, from ),
          graph = g.add( from, g.mul( phase, diff ) )
        
    ramp.trigger = reset.trigger

    const out = Gibberish.factory( ramp, graph, ['envelopes','ramp'], props )


    return out
  }

  Ramp.defaults = { from:0, to:1, length:g.gen.samplerate, shouldLoop:false }

  return Ramp

}

},{"../ugen.js":210,"genish.js":51}],148:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"./realm.js":150,"dup":39}],149:[function(require,module,exports){
/*
 * https://github.com/antimatter15/heapqueue.js/blob/master/heapqueue.js
 *
 * This implementation is very loosely based off js-priority-queue
 * by Adam Hooper from https://github.com/adamhooper/js-priority-queue
 *
 * The js-priority-queue implementation seemed a teensy bit bloated
 * with its require.js dependency and multiple storage strategies
 * when all but one were strongly discouraged. So here is a kind of
 * condensed version of the functionality with only the features that
 * I particularly needed.
 *
 * Using it is pretty simple, you just create an instance of HeapQueue
 * while optionally specifying a comparator as the argument:
 *
 * var heapq = new HeapQueue();
 *
 * //IF NEGATIVE, RETURN A
 *
 * var customq = new HeapQueue(function(a, b){
 *   // if b > a, return negative
 *   // means that it spits out the smallest item first
 *   return a - b;
 * });
 *
 * Note that in this case, the default comparator is identical to
 * the comparator which is used explicitly in the second queue.
 *
 * Once you've initialized the heapqueue, you can plop some new
 * elements into the queue with the push method (vaguely reminiscent
 * of typical javascript arays)
 *
 * heapq.push(42);
 * heapq.push("kitten");
 *
 * The push method returns the new number of elements of the queue.
 *
 * You can push anything you'd like onto the queue, so long as your
 * comparator function is capable of handling it. The default
 * comparator is really stupid so it won't be able to handle anything
 * other than an number by default.
 *
 * You can preview the smallest item by using peek.
 *
 * heapq.push(-9999);
 * heapq.peek(); // ==> -9999
 *
 * The useful complement to to the push method is the pop method,
 * which returns the smallest item and then removes it from the
 * queue.
 *
 * heapq.push(1);
 * heapq.push(2);
 * heapq.push(3);
 * heapq.pop(); // ==> 1
 * heapq.pop(); // ==> 2
 * heapq.pop(); // ==> 3
 */
const HeapQueue = function(cmp){
  this.cmp = (cmp || function(a, b){ return a - b; });
  this.length = 0;
  this.data = [];
}
HeapQueue.prototype.peek = function(){
  return this.data[0];
};
HeapQueue.prototype.push = function(value){
  this.data.push(value);

  var pos = this.data.length - 1,
  parent, x;

  while(pos > 0){
    parent = (pos - 1) >>> 1;
    if(this.cmp(this.data[pos], this.data[parent]) < 0){
      x = this.data[parent];
      this.data[parent] = this.data[pos];
      this.data[pos] = x;
      pos = parent;
    }else break;
  }
  return this.length++;
};
HeapQueue.prototype.pop = function(){
  var last_val = this.data.pop(),
  ret = this.data[0];
  if(this.data.length > 0){
    this.data[0] = last_val;
    var pos = 0,
    last = this.data.length - 1,
    left, right, minIndex, x;
    while(1){
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if(left <= last && this.cmp(this.data[left], this.data[minIndex]) < 0) minIndex = left;
      if(right <= last && this.cmp(this.data[right], this.data[minIndex]) < 0) minIndex = right;
      if(minIndex !== pos){
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      }else break;
    }
  } else {
    ret = last_val;
  }
  this.length--;
  return ret;
};

module.exports = HeapQueue

},{}],150:[function(require,module,exports){

/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = function Realm (scope, parentElement) {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:absolute;left:0;top:-999px;width:1px;height:1px;';
  parentElement.appendChild(frame);
  const win = frame.contentWindow;
  const doc = win.document;
  let vars = 'var window,$hook';
  for (const i in win) {
    if (!(i in scope) && i !== 'eval') {
      vars += ',';
      vars += i;
    }
  }
  for (const i in scope) {
    vars += ',';
    vars += i;
    vars += '=self.';
    vars += i;
  }
  const script = doc.createElement('script');
  script.appendChild(doc.createTextNode(
    `function $hook(self,console) {"use strict";
        ${vars};return function() {return eval(arguments[0])}}`
  ));
  doc.body.appendChild(script);
  this.exec = win.$hook.call(scope, scope, console);
}

},{}],151:[function(require,module,exports){
const __proxy = require( './workletProxy.js' )
const effectProto = require( './fx/effect.js' )

module.exports = function( Gibberish ) {
  const proxy = __proxy( Gibberish )
  
  const factory = function( ugen, graph, __name, values, cb=null, shouldProxy = true ) {
    if( Gibberish.mode === 'processor' )
      ugen.callback = cb === null ? Gibberish.genish.gen.createCallback( graph, Gibberish.memory, false, true ) : cb
    else
      ugen.callback = { out:[] }

    let name = Array.isArray( __name ) ? __name[ __name.length - 1 ] : __name

    Object.assign( ugen, {
      //type: 'ugen',
      id: values.id || Gibberish.utilities.getUID(), 
      ugenName: name + '_',
      graph: graph,
      inputNames: ugen.inputNames || new Set( Gibberish.genish.gen.parameters ),
      isStereo: Array.isArray( graph ),
      dirty: true,
      __properties__:values,
      __addresses__:{}
    })

    ugen.ugenName += ugen.id
    if( Gibberish.mode === 'processor' ) {
      ugen.callback.ugenName = ugen.ugenName // XXX hacky
      ugen.callback.id = ugen.id
    }

    //console.log( 'ugen name/id:', ugen.ugenName, ugen.id )
    //console.log( 'callback name/id:', ugen.callback.ugenName, ugen.callback.id )

    for( let param of ugen.inputNames ) {
      if( param === 'memory' ) continue

      let value = values[ param ],
          isNumber = typeof value === 'object' || isNaN( value ) ? false : true,
          idx

      if( isNumber ) { 
        idx = Gibberish.memory.alloc( 1 )
        Gibberish.memory.heap[ idx ] = value
        ugen.__addresses__[ param ] = idx
      }

      // TODO: do we need to check for a setter?
      let desc = Object.getOwnPropertyDescriptor( ugen, param ),
          setter

      if( desc !== undefined ) {
        setter = desc.set
      }

      Object.defineProperty( ugen, param, {
        configurable:true,
        get() { 
          if( isNumber ) {
            return Gibberish.memory.heap[ idx ]
          }else{
            return value 
          }
        },
        set( v ) {
          //if( param === 'input' ) console.log( 'INPUT:', v, isNumber )
          if( value !== v ) {
            if( setter !== undefined ) setter( v )
            if( typeof v === 'number' ) {
              Gibberish.memory.heap[ idx ] = value = v
              if( isNumber === false ) Gibberish.dirty( ugen )
              isNumber = true
            }else{
              value = v
              /*if( isNumber === true )*/ Gibberish.dirty( ugen )
              //console.log( 'switching from number:', param, value )
              isNumber = false
            }
          }
        }
      })
    }

    // add bypass 
    if( effectProto.isPrototypeOf( ugen ) ) {
      let value = ugen.bypass
      Object.defineProperty( ugen, 'bypass', {
        configurable:true,
        get() { return value },
        set( v ) {
          if( value !== v ) {
            Gibberish.dirty( ugen )
            value = v
          }
        }
      })

    }

    if( ugen.__requiresRecompilation !== undefined ) {
      ugen.__requiresRecompilation.forEach( prop => {
        let value = values[ prop ]
        let isNumber = !isNaN( value )

        Object.defineProperty( ugen, prop, {
          configurable:true,
          get() { 
            if( isNumber ) {
              let idx = ugen.__addresses__[ prop ]
              return Gibberish.memory.heap[ idx ]
            }else{
              //console.log( 'returning:', prop, value, Gibberish.mode )
              return value 
            }
          },
          set( v ) {
            if( value !== v ) {
              if( typeof v === 'number' ) {
                let idx = ugen.__addresses__[ prop ]
                if( idx === undefined ){
                  idx = Gibberish.memory.alloc( 1 )
                  ugen.__addresses__[ prop ] = idx
                }
                value = values[ prop ] = Gibberish.memory.heap[ idx ] = v
                isNumber = true
              }else{
                value = values[ prop ] = v
                isNumber = false
                //console.log( 'setting ugen', value, Gibberish.mode )
                Gibberish.dirty( ugen )
              }

              //console.log( 'SETTING REDO GRAPH', prop, Gibberish.mode )
              
              // needed for filterType at the very least, becauae the props
              // are reused when re-creating the graph. This seems like a cheaper
              // way to solve this problem.
              //values[ prop ] = v

              this.__redoGraph()
            }
          }
        })
      })
    }

    // will only create proxy if worklets are being used
    // otherwise will return unaltered ugen

    if( values.shouldAddToUgen === true ) Object.assign( ugen, values )

    return shouldProxy ? proxy( __name, values, ugen ) : ugen
  }

  factory.getUID = () => { return Gibberish.utilities.getUID() }

  return factory
}

},{"./fx/effect.js":166,"./workletProxy.js":212}],152:[function(require,module,exports){
let g = require( 'genish.js' )
 
// constructor for schroeder allpass filters
let allPass = function( _input, length=500, feedback=.5 ) {
  let index  = g.counter( 1,0,length ),
      buffer = g.data( length ),
      bufferSample = g.peek( buffer, index, { interp:'none', mode:'samples' }),
      out = g.memo( g.add( g.mul( -1, _input), bufferSample ) )
                
  g.poke( buffer, g.add( _input, g.mul( bufferSample, feedback ) ), index )
 
  return out
}

module.exports = allPass

},{"genish.js":51}],153:[function(require,module,exports){
let g = require( 'genish.js' ),
    filter = require( './filter.js' )

module.exports = function( Gibberish ) {

  const genish = g
  Gibberish.genish.biquad = ( input, __cutoff, __Q, mode, isStereo ) => {
    'use jsdsp'
    let in1a0,x0a1,x1a2,y0b0,y1b1,
        in1a0_r,x0a1_r,x1a2_r,y0b0_r,y1b1_r,
        c

    let returnValue
    
    const x = genish.data([ 0,0 ], 1, { meta:true })
    const y = genish.data([ 0,0 ], 1, { meta:true })
    const a = genish.data([ 0,0,0 ], 1, { meta:true })
    const b = genish.data([ 0,0 ], 1, { meta:true })
    
    const Q = g.min( .5 + __Q * 22, 22.5 ) 
    const cutoff = g.max( .005, g.min( __cutoff,.995 ) ) * g.gen.samplerate / 4 
    //let w0 = g.memo( g.mul( 2 * Math.PI, g.div( g.max(.005, g.min(cutoff,.995)),  g.gen.samplerate ) ) ),
    let w0 =  (2 * Math.PI) * (cutoff / g.gen.samplerate),
        sinw0 = g.sin( w0 ),
        cosw0 = g.cos( w0 ),
        alpha = sinw0 / ( 2 * Q )

    //let w0 = g.memo( g.mul( 2 * Math.PI, g.div( cutoff,  g.gen.samplerate ) ) ),
      
    let oneMinusCosW = 1 - cosw0

    /******** process coefficients ********/
    switch( mode ) {
      case 1:
        a[0] = (1 + cosw0) / 2
        a[1] = (1 + cosw0) * -1
        a[2] = a[0]
        c    = 1 + alpha
        b[0] = -2 * cosw0
        b[1] = 1 - alpha
        break;
      case 2:
        a[0] = Q * alpha
        a[1] = 0
        a[2] = a[0] * -1
        c    = 1 + alpha
        b[0] = -2 * cosw0
        b[1] = 1 - alpha
        break;
      default: // LP
        a[0] = oneMinusCosW / 2
        a[1] = oneMinusCosW
        a[2] = a[0]
        c    = 1 + alpha
        b[0] = -2 * cosw0
        b[1] = 1 - alpha
    }

    a[0] = a[0] / c; a[1] = a[1] / c; a[2] = a[2] / c
    b[0] = b[0] / c; b[1] = b[1] / c

    /******** end coefficients ********/

    /****** left / mono output ********/

    let l = isStereo === true ? input[0] : input
    in1a0 = l * a[0]
    x0a1  = x[0] * a[1]
    x1a2  = x[1] * a[2]

    x[1] = x[0] 
    x[0] = l

    let sumLeft = in1a0 + x0a1 + x1a2

    y0b0 = y[0] * b[0]
    y1b1 = y[1] * b[1]
    y[1] = y[0] 

    let sumRight = y0b0 + y1b1

    let diff = sumLeft - sumRight

    y[0] = diff
    
    /******** end left/mono **********/

    if( isStereo ) {
      const xr = genish.data([ 0,0 ], 1, { meta:true })
      const yr = genish.data([ 0,0 ], 1, { meta:true })
      //let x1_1 = g.history(), x2_1 = g.history(), y1_1 = g.history(), y2_1 = g.history()

      const r = input[1] 
      in1a0_r = r * a[0] //g.mul( x1_1.in( input[1] ), a0 )
      x0a1_r  = xr[0] * a[1]//g.mul( x2_1.in( x1_1.out ), a1 )
      x1a2_r  = xr[1] * a[2]//g.mul( x2_1.out,            a2 )

      xr[1]   = xr[0]
      xr[0] = r

      const sumLeft_r = in1a0_r + x0a1_r + x1a2_r

      y0b0_r = yr[0] * b[0]//g.mul( y2_1.in( y1_1.out ), b1 )
      y1b1_r = yr[1] * b[1]//g.mul( y2_1.out, b2 )
      yr[1] = yr[0]

      const sumRight_r = y0b0_r + y1b1_r

      const diff_r = sumLeft_r - sumRight_r

      yr[0] = diff_r
      
      returnValue = [ diff, diff_r ]
    }else{
      returnValue = diff
    }

    return returnValue
  }

  let Biquad = inputProps => {
    const biquad = Object.create( filter )
    const props = Object.assign( {}, Biquad.defaults, inputProps ) 
    let __out

    Object.assign( biquad, props )

    biquad.__createGraph = function() {
      let isStereo = false
      if( __out === undefined ) {
        isStereo = props.input !== undefined && props.input.isStereo !== undefined ? props.input.isStereo : false 
      }else{
        isStereo = __out.input.isStereo
        __out.isStereo = isStereo
      }
      biquad.graph = Gibberish.genish.biquad( g.in('input'), g.in('cutoff'),  g.in('Q'), biquad.mode, isStereo )
    }

    biquad.__createGraph()
    biquad.__requiresRecompilation = [ 'mode', 'input' ]

    __out = Gibberish.factory(
      biquad,
      biquad.graph,
      ['filters','Filter12Biquad'], 
      props
    )

    return __out
  }

  Biquad.defaults = {
    input:0,
    Q: .15,
    cutoff:.05,
    mode:0
  }

  return Biquad

}


},{"./filter.js":156,"genish.js":51}],154:[function(require,module,exports){
let g = require( 'genish.js' )

let combFilter = function( _input, combLength, damping=.5*.4, feedbackCoeff=.84 ) {
  let lastSample   = g.history(),
  	  readWriteIdx = g.counter( 1,0,combLength ),
      combBuffer   = g.data( combLength ),
	    out          = g.peek( combBuffer, readWriteIdx, { interp:'none', mode:'samples' }),
      storeInput   = g.memo( g.add( g.mul( out, g.sub( 1, damping)), g.mul( lastSample.out, damping ) ) )
      
  lastSample.in( storeInput )
 
  g.poke( combBuffer, g.add( _input, g.mul( storeInput, feedbackCoeff ) ), readWriteIdx )
 
  return out
}

module.exports = combFilter

},{"genish.js":51}],155:[function(require,module,exports){
const g = require( 'genish.js' ),
      filter = require( './filter.js' )

const genish = g
module.exports = function( Gibberish ) {
  Gibberish.genish.diodeZDF = ( input, __Q, __freq, saturation, isStereo=false ) => {
    const iT = 1 / g.gen.samplerate,
          kz1 = g.history(0),
          kz2 = g.history(0),
          kz3 = g.history(0),
          kz4 = g.history(0)

    let   ka1 = 1.0,
          ka2 = 0.5,
          ka3 = 0.5,
          ka4 = 0.5,
          kindx = 0   

    const freq = g.mul( g.max(.005, g.min( __freq, .995)),  genish.gen.samplerate / 2 )
    //const freq = g.max(.005, g.min( __freq, .995))

    // XXX this is where the magic number hapens for Q...
    const Q = g.memo( g.add( .5, g.mul( __Q, g.add( 5, g.sub( 5, g.mul( g.div( freq, 20000  ), 5 ) ) ) ) ) )
    // kwd = 2 * $M_PI * acf[kindx]
    const kwd = g.memo( g.mul( Math.PI * 2, freq ) )

    // kwa = (2/iT) * tan(kwd * iT/2) 
    const kwa =g.memo( g.mul( 2/iT, g.tan( g.mul( kwd, iT/2 ) ) ) )

    // kG  = kwa * iT/2 
    const kg = g.memo( g.mul( kwa, iT/2 ) )
    
    const kG4 = g.memo( g.mul( .5, g.div( kg, g.add( 1, kg ) ) ) )
    const kG3 = g.memo( g.mul( .5, g.div( kg, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG4 ) ) ) ) )
    const kG2 = g.memo( g.mul( .5, g.div( kg, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG3 ) ) ) ) )
    const kG1 = g.memo( g.div( kg, g.sub( g.add( 1, kg ), g.mul( kg, kG2 ) ) ) )

    const kGAMMA = g.memo( g.mul( g.mul( kG4, kG3 ) , g.mul( kG2, kG1 ) ) )

    const kSG1 = g.memo( g.mul( g.mul( kG4, kG3 ), kG2 ) ) 

    const kSG2 = g.memo( g.mul( kG4, kG3) )  
    const kSG3 = kG4 
    let kSG4 = 1.0 
    // kk = 4.0*(kQ - 0.5)/(25.0 - 0.5)
    const kalpha = g.memo( g.div( kg, g.add(1.0, kg) ) )

    const kbeta1 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( kg, kG2 ) ) ) )
    const kbeta2 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG3 ) ) ) )
    const kbeta3 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG4 ) ) ) )
    const kbeta4 = g.memo( g.div( 1.0, g.add( 1, kg ) ) ) 

    const kgamma1 = g.memo( g.add( 1, g.mul( kG1, kG2 ) ) )
    const kgamma2 = g.memo( g.add( 1, g.mul( kG2, kG3 ) ) )
    const kgamma3 = g.memo( g.add( 1, g.mul( kG3, kG4 ) ) )

    const kdelta1 = kg
    const kdelta2 = g.memo( g.mul( 0.5, kg ) )
    const kdelta3 = g.memo( g.mul( 0.5, kg ) )

    const kepsilon1 = kG2
    const kepsilon2 = kG3
    const kepsilon3 = kG4

    const klastcut = freq

    //;; feedback inputs 
    const kfb4 = g.memo( g.mul( kbeta4 , kz4.out ) ) 
    const kfb3 = g.memo( g.mul( kbeta3, g.add( kz3.out, g.mul( kfb4, kdelta3 ) ) ) )
    const kfb2 = g.memo( g.mul( kbeta2, g.add( kz2.out, g.mul( kfb3, kdelta2 ) ) ) )

    //;; feedback process

    const kfbo1 = g.memo( g.mul( kbeta1, g.add( kz1.out, g.mul( kfb2, kdelta1 ) ) ) ) 
    const kfbo2 = g.memo( g.mul( kbeta2, g.add( kz2.out, g.mul( kfb3, kdelta2 ) ) ) ) 
    const kfbo3 = g.memo( g.mul( kbeta3, g.add( kz3.out, g.mul( kfb4, kdelta3 ) ) ) ) 
    const kfbo4 = kfb4

    const kSIGMA = g.memo( 
      g.add( 
        g.add( 
          g.mul( kSG1, kfbo1 ), 
          g.mul( kSG2, kfbo2 )
        ), 
        g.add(
          g.mul( kSG3, kfbo3 ), 
          g.mul( kSG4, kfbo4 )
        ) 
      ) 
    )

    //const kSIGMA = 1
    //;; non-linear processing
    //if (knlp == 1) then
    //  kin = (1.0 / tanh(ksaturation)) * tanh(ksaturation * kin)
    //elseif (knlp == 2) then
    //  kin = tanh(ksaturation * kin) 
    //endif
    //
    //const kin = input 
    let kin = isStereo === true ? g.add( input[0], input[1] ) : input//g.memo( g.mul( g.div( 1, g.tanh( saturation ) ), g.tanh( g.mul( saturation, input ) ) ) )
    kin = g.tanh( g.mul( saturation, kin ) )

    const kun = g.div( g.sub( kin, g.mul( Q, kSIGMA ) ), g.add( 1, g.mul( Q, kGAMMA ) ) )
    //const kun = g.div( 1, g.add( 1, g.mul( Q, kGAMMA ) ) )
        //(kin - kk * kSIGMA) / (1.0 + kk * kGAMMA)

    //;; 1st stage
    let kxin = g.memo( g.add( g.add( g.mul( kun, kgamma1 ), kfb2), g.mul( kepsilon1, kfbo1 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    let kv = g.memo( g.mul( g.sub( g.mul( ka1, kxin ), kz1.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    let klp = g.add( kv, kz1.out )
    //klp = kv + kz1
    kz1.in( g.add( klp, kv ) ) 
    //kz1 = klp + kv

        //;; 2nd stage
    //kxin = (klp * kgamma2 + kfb3 + kepsilon2 * kfbo2)
    //kv = (ka2 * kxin - kz2) * kalpha 
    //klp = kv + kz2
    //kz2 = klp + kv

    kxin = g.memo( g.add( g.add( g.mul( klp, kgamma2 ), kfb3), g.mul( kepsilon2, kfbo2 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka2, kxin ), kz2.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz2.out ) 
    //klp = kv + kz1
    kz2.in( g.add( klp, kv ) ) 
    //kz1 = klp + kv

    //;; 3rd stage
    //kxin = (klp * kgamma3 + kfb4 + kepsilon3 * kfbo3)
    //kv = (ka3 * kxin - kz3) * kalpha 
    //klp = kv + kz3
    //kz3 = klp + kv

    kxin = g.memo( g.add( g.add( g.mul( klp, kgamma3 ), kfb4), g.mul( kepsilon3, kfbo3 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka3, kxin ), kz3.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz3.out )
    //klp = kv + kz1
    kz3.in( g.add( klp, kv ) )
    //kz1 = klp + kv

    //;; 4th stage
    //kv = (ka4 * klp - kz4) * kalpha 
    //klp = kv + kz4
    //kz4 = klp + kv

    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka4, kxin ), kz4.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz4.out )
    //klp = kv + kz1
    kz4.in( g.add( klp, kv ) )

    //kz1 = klp + kv
    if( isStereo ) {
      //let polesR = g.data([ 0,0,0,0 ], 1, { meta:true }),
      //    rezzR = g.clamp( g.mul( polesR[3], rez ) ),
      //    outputR = g.sub( input[1], rezzR )         

      //polesR[0] = g.add( polesR[0], g.mul( g.add( g.mul(-1, polesR[0] ), outputR   ), cutoff ))
      //polesR[1] = g.add( polesR[1], g.mul( g.add( g.mul(-1, polesR[1] ), polesR[0] ), cutoff ))
      //polesR[2] = g.add( polesR[2], g.mul( g.add( g.mul(-1, polesR[2] ), polesR[1] ), cutoff ))
      //polesR[3] = g.add( polesR[3], g.mul( g.add( g.mul(-1, polesR[3] ), polesR[2] ), cutoff ))

      //let right = g.switch( isLowPass, polesR[3], g.sub( outputR, polesR[3] ) )

      //returnValue = [left, right]
    }else{
     // returnValue = klp
    }
    //returnValue = klp
    
    return klp
 }

  const DiodeZDF = inputProps => {
    const zdf      = Object.create( filter )
    const props    = Object.assign( {}, DiodeZDF.defaults, filter.defaults, inputProps )
    const isStereo = props.input.isStereo 

    Object.assign( zdf, props )

    const __out = Gibberish.factory(
      zdf, 
      Gibberish.genish.diodeZDF( g.in('input'), g.in('Q'), g.in('cutoff'), g.in('saturation'), isStereo ), 
      ['filters','Filter24TB303'],
      props
    )

    return __out 
  }

  DiodeZDF.defaults = {
    input:0,
    Q: .65,
    saturation: 1,
    cutoff:.5 
  }

  return DiodeZDF

}

},{"./filter.js":156,"genish.js":51}],156:[function(require,module,exports){
let ugen = require( '../ugen.js' )()

let filter = Object.create( ugen )

Object.assign( filter, {
  defaults: { bypass:false } 
})

module.exports = filter

},{"../ugen.js":210}],157:[function(require,module,exports){
let g = require( 'genish.js' ),
    filter = require( './filter.js' )

module.exports = function( Gibberish ) {

  Gibberish.genish.filter24 = ( input, _rez, _cutoff, isLowPass, isStereo=false ) => {
    let returnValue,
        polesL = g.data([ 0,0,0,0 ], 1, { meta:true }),
        peekProps = { interp:'none', mode:'simple' },
        rez = g.memo( g.mul( _rez, 5 ) ),
        cutoff = g.memo( g.div( _cutoff, 11025 ) ),
        rezzL = g.clamp( g.mul( polesL[3], rez ) ),
        outputL = g.sub( isStereo ? input[0] : input, rezzL ) 

    polesL[0] = g.add( polesL[0], g.mul( g.add( g.mul(-1, polesL[0] ), outputL   ), cutoff ))
    polesL[1] = g.add( polesL[1], g.mul( g.add( g.mul(-1, polesL[1] ), polesL[0] ), cutoff ))
    polesL[2] = g.add( polesL[2], g.mul( g.add( g.mul(-1, polesL[2] ), polesL[1] ), cutoff ))
    polesL[3] = g.add( polesL[3], g.mul( g.add( g.mul(-1, polesL[3] ), polesL[2] ), cutoff ))
    
    let left = g.switch( isLowPass, polesL[3], g.sub( outputL, polesL[3] ) )

    if( isStereo ) {
      let polesR = g.data([ 0,0,0,0 ], 1, { meta:true }),
          rezzR = g.clamp( g.mul( polesR[3], rez ) ),
          outputR = g.sub( input[1], rezzR )         

      polesR[0] = g.add( polesR[0], g.mul( g.add( g.mul(-1, polesR[0] ), outputR   ), cutoff ))
      polesR[1] = g.add( polesR[1], g.mul( g.add( g.mul(-1, polesR[1] ), polesR[0] ), cutoff ))
      polesR[2] = g.add( polesR[2], g.mul( g.add( g.mul(-1, polesR[2] ), polesR[1] ), cutoff ))
      polesR[3] = g.add( polesR[3], g.mul( g.add( g.mul(-1, polesR[3] ), polesR[2] ), cutoff ))

      let right = g.switch( isLowPass, polesR[3], g.sub( outputR, polesR[3] ) )

      returnValue = [left, right]
    }else{
      returnValue = left
    }

    return returnValue
  }

  let Filter24 = inputProps => {
    let filter24   = Object.create( filter )
    let props    = Object.assign( {}, Filter24.defaults, filter.defaults, inputProps )
    let isStereo = props.input.isStereo 

    const __out = Gibberish.factory(
      filter24, 
      Gibberish.genish.filter24( g.in('input'), g.in('Q'), g.in('cutoff'), g.in('isLowPass'), isStereo ), 
      ['filters','Filter24Classic'],
      props
    )

    return __out
  }


  Filter24.defaults = {
    input:0,
    Q: .25,
    cutoff: 880,
    isLowPass:1
  }

  return Filter24

}


},{"./filter.js":156,"genish.js":51}],158:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const g = Gibberish.genish

  const filters = {
    Filter24Classic : require( './filter24.js'  )( Gibberish ),
    Filter24Moog    : require( './ladder.dsp.js' )( Gibberish ),
    Filter24TB303   : require( './diodeFilterZDF.js' )( Gibberish ),
    Filter12Biquad  : require( './biquad.dsp.js'    )( Gibberish ),
    Filter12SVF     : require( './svf.js'       )( Gibberish ),
    
    // not for use by end-users
    genish: {
      Comb        : require( './combfilter.js' ),
      AllPass     : require( './allpass.js' )
    },

    factory( input, cutoff, saturation, _props, isStereo = false ) {
      let filteredOsc 

      let props = Object.assign({}, filters.defaults, _props )

      switch( props.filterModel ) {
        case 1:
          filteredOsc = g.zd24( input, g.min( g.in('Q'), .9999 ), cutoff, 0 ) // g.max(.005, g.min( cutoff, 1 ) ) )
          break;
        case 2:
          filteredOsc = g.diodeZDF( input, g.min( g.in('Q'), .9999 ), cutoff, saturation, isStereo ) 
          break;
        case 3:
          filteredOsc = g.svf( input, cutoff, g.sub( 1, g.in('Q')), props.filterMode, isStereo, true ) 
          break; 
        case 4:
          filteredOsc = g.biquad( input, cutoff,  g.in('Q'), props.filterMode, isStereo ) 
          break; 
        case 5:
          //isLowPass = g.param( 'lowPass', 1 ),
          filteredOsc = g.filter24( input, g.in('Q'), cutoff, props.filterMode, isStereo )
          break;
        default:
          // return unfiltered signal
          filteredOsc = input //g.filter24( oscWithGain, g.in('resonance'), cutoff, isLowPass )
          break;
      }

      return filteredOsc
    },

    defaults: { filterMode: 0, filterModel:0 }
  }

  filters.export = target => {
    for( let key in filters ) {
      if( key !== 'export' && key !== 'genish' ) {
        target[ key ] = filters[ key ]
      }
    }
  }

return filters

}

},{"./allpass.js":152,"./biquad.dsp.js":153,"./combfilter.js":154,"./diodeFilterZDF.js":155,"./filter24.js":157,"./ladder.dsp.js":159,"./svf.js":160}],159:[function(require,module,exports){
const genish = require( 'genish.js' ),
      filterProto = require( './filter.js' )

module.exports = function( Gibberish ) {

  const makeChannel = function( input, _Q, _freq ) {
    'use jsdsp'
    const iT = 1 / genish.gen.samplerate,
          z  = genish.data([ 0,0,0,0 ], 1, { meta:true })

    const freq = genish.max(.005, genish.min( _freq, 1 ) ) 
    const Q = .5 + _Q * 23
    // kwd = 2 * $M_PI * acf[kindx]
    const kwd = ( Math.PI * 2 ) * freq * genish.gen.samplerate / 2

    // kwa = (2/iT) * tan(kwd * iT/2) 
    const kwa = 2/iT * genish.tan( kwd * iT/2 )

    // kG  = kwa * iT/2 
    const kg = kwa * iT/2

    // kk = 4.0*(kQ - 0.5)/(25.0 - 0.5)
    const kk = 4 * (Q - .5) / 24.5

    // kg_plus_1 = (1.0 + kg)
    const kg_plus_1 = 1 + kg

    // kG = kg / kg_plus_1 
    const kG     = kg / kg_plus_1,
          kG_2   = kG * kG,
          kG_3   = kG_2 * kG,
          kGAMMA = kG_2 * kG_2

    const kS1 = z[0] / kg_plus_1,
          kS2 = z[1] / kg_plus_1,
          kS3 = z[2] / kg_plus_1,
          kS4 = z[3] / kg_plus_1

    //kS = kG_3 * kS1  + kG_2 * kS2 + kG * kS3 + kS4 
    const kS = kG_3 * kS1 + kG_2 * kS2 + kG * kS3 + kS4

    //ku = (kin - kk *  kS) / (1 + kk * kGAMMA)
    const ku  = (input - kk * kS) / (1 + kk * kGAMMA)

    let kv =  ( ku - z[0] ) * kG
    let klp = kv + z[0]
    z[0] = klp + kv

    kv  = ( klp - z[1] ) * kG
    klp = kv + z[1]
    z[1] = klp + kv

    kv  = (klp - z[2] ) * kG
    klp = kv + z[2]
    z[2] = klp + kv

    kv  = (klp - z[3] ) * kG
    klp = kv + z[3]
    z[3] = klp + kv

    return klp
  }

  Gibberish.genish.zd24 = ( input, _Q, freq, isStereo=false ) => {
    const leftInput = isStereo === true ? input[0] : input
    const left = makeChannel( leftInput, _Q, freq )

    let out
    if( isStereo === true ) {
      const right = makeChannel( input[1], _Q, freq )
      out = [ left, right ]
    }else{
      out = left
    }

    return out
  }

  const Zd24 = inputProps => {
    const filter   = Object.create( filterProto )
    const props    = Object.assign( {}, Zd24.defaults, filter.defaults, inputProps )
    let out

    filter.__requiresRecompilation = [ 'input' ]
    filter.__createGraph = function() {
      let isStereo = false
      if( out === undefined ) {
        isStereo = props.input !== undefined && props.input.isStereo !== undefined ? props.input.isStereo : false 
      }else{
        isStereo = out.input.isStereo
        out.isStereo = isStereo
      }

      filter.graph = Gibberish.genish.zd24( genish.in('input'), genish.in('Q'), genish.in('cutoff'), isStereo ) 
    } 

    filter.__createGraph()

    out = Gibberish.factory(
      filter, 
      filter.graph, 
      ['filters','Filter24Moog'],
      props
    )

    return out
  }

  Zd24.defaults = {
    input:0,
    Q: .75,
    cutoff: .25,
  }

  return Zd24

}


},{"./filter.js":156,"genish.js":51}],160:[function(require,module,exports){
const g = require( 'genish.js' ),
      filter = require( './filter.js' )

module.exports = function( Gibberish ) {
  Gibberish.genish.svf = ( input, cutoff, Q, mode, isStereo=false, shouldConvertFreqQ=false ) => {
    let d1 = g.data([0,0], 1, { meta:true }), d2 = g.data([0,0], 1, { meta:true }),
        peekProps = { mode:'simple', interp:'none' }

    if( shouldConvertFreqQ === true ) {
      //Q = g.min( g.add(.01 , __Q), 1 ) 
      cutoff = g.mul( g.max( .005, g.min( cutoff,.995 ) ), g.div( g.gen.samplerate, 4 ) )
    }

    let f1 = g.memo( g.mul( 2 * Math.PI, g.div( cutoff, g.gen.samplerate ) ) )
    let oneOverQ = g.memo( g.div( 1, Q ) )
    let l = g.memo( g.add( d2[0], g.mul( f1, d1[0] ) ) ),
        h = g.memo( g.sub( g.sub( isStereo ? input[0] : input, l ), g.mul( Q, d1[0] ) ) ),
        b = g.memo( g.add( g.mul( f1, h ), d1[0] ) ),
        n = g.memo( g.add( h, l ) )

    d1[0] = b
    d2[0] = l

    let out = g.selector( mode, l, h, b, n )

    let returnValue
    if( isStereo ) {
      let d12 = g.data([0,0], 1, { meta:true }), d22 = g.data([0,0], 1, { meta:true })
      let l2 = g.memo( g.add( d22[0], g.mul( f1, d12[0] ) ) ),
          h2 = g.memo( g.sub( g.sub( input[1], l2 ), g.mul( Q, d12[0] ) ) ),
          b2 = g.memo( g.add( g.mul( f1, h2 ), d12[0] ) ),
          n2 = g.memo( g.add( h2, l2 ) )

      d12[0] = b2
      d22[0] = l2

      let out2 = g.selector( mode, l2, h2, b2, n2 )

      returnValue = [ out, out2 ]
    }else{
      returnValue = out
    }

    return returnValue
  }

  let SVF = inputProps => {
    const svf = Object.create( filter )
    const props = Object.assign( {}, SVF.defaults, filter.defaults, inputProps ) 

    const isStereo = props.input.isStereo
    
    // XXX NEEDS REFACTORING
    const __out = Gibberish.factory( 
      svf,
      //Gibberish.genish.svf( g.in('input'), g.mul( g.in('cutoff'), g.gen.samplerate / 5 ), g.sub( 1, g.in('Q') ), g.in('mode'), isStereo ), 
      Gibberish.genish.svf( g.in('input'), g.mul( g.in('cutoff'), g.gen.samplerate / 5 ), g.sub( 1, g.in('Q') ), g.in('mode'), isStereo, true ), 
      ['filters','Filter12SVF'], 
      props
    )

    return __out
  }


  SVF.defaults = {
    input:0,
    Q: .65,
    cutoff:.25,
    mode:0
  }

  return SVF

}


},{"./filter.js":156,"genish.js":51}],161:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let BitCrusher = inputProps => {
  const  props = Object.assign( { bitCrusherLength: 44100 }, BitCrusher.defaults, effect.defaults, inputProps ),
         bitCrusher = Object.create( effect )

  let out

  bitCrusher.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }

    let input = g.in( 'input' ),
        inputGain = g.in( 'inputGain' ),
        bitDepth = g.in( 'bitDepth' ),
        sampleRate = g.in( 'sampleRate' ),
        leftInput = isStereo ? input[ 0 ] : input,
        rightInput = isStereo ? input[ 1 ] : null
    
    let storeL = g.history(0)
    let sampleReduxCounter = g.counter( sampleRate, 0, 1 )

    let bitMult = g.pow( g.mul( bitDepth, 16 ), 2 )
    let crushedL = g.div( g.floor( g.mul( g.mul( leftInput, inputGain ), bitMult ) ), bitMult )

    let outL = g.switch(
      sampleReduxCounter.wrap,
      crushedL,
      storeL.out
    )

    if( isStereo ) {
      let storeR = g.history(0)
      let crushedR = g.div( g.floor( g.mul( g.mul( rightInput, inputGain ), bitMult ) ), bitMult )

      let outR = g.switch( 
        sampleReduxCounter.wrap,
        crushedR,
        storeL.out
      )

      bitCrusher.graph = [ outL, outR ]
    }else{
      bitCrusher.graph = outL
    }
  }

  bitCrusher.__createGraph()
  bitCrusher.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( 
    bitCrusher,
    bitCrusher.graph,
    ['fx','bitCrusher'], 
    props 
  )
  return out 
}

BitCrusher.defaults = {
  input:0,
  bitDepth:.5,
  sampleRate: .5
}

return BitCrusher

}

},{"./effect.js":166,"genish.js":51}],162:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
  let proto = Object.create( effect )

  let Shuffler = inputProps => {
    let bufferShuffler = Object.create( proto ),
        bufferSize = 88200

    const props = Object.assign( {}, Shuffler.defaults, effect.defaults, inputProps )
    
    let out
    bufferShuffler.__createGraph = function() {
      let isStereo = false
      if( out === undefined ) {
        isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : true 
      }else{
        isStereo = out.input.isStereo
        //out.isStereo = isStereo
      }      
      
      const phase = g.accum( 1,0,{ shouldWrap: false })

      const input = g.in( 'input' ),
            inputGain = g.in( 'inputGain' ),
            __leftInput = isStereo ? input[ 0 ] : input,
            __rightInput = isStereo ? input[ 1 ] : null,
            leftInput = g.mul( __leftInput, inputGain ),
            rightInput = g.mul( __rightInput, inputGain ),
            rateOfShuffling = g.in( 'rate' ),
            chanceOfShuffling = g.in( 'chance' ),
            reverseChance = g.in( 'reverseChance' ),
            repitchChance = g.in( 'repitchChance' ),
            repitchMin = g.in( 'repitchMin' ),
            repitchMax = g.in( 'repitchMax' )

      let pitchMemory = g.history(1)

      let shouldShuffleCheck = g.eq( g.mod( phase, rateOfShuffling ), 0 )
      let isShuffling = g.memo( g.sah( g.lt( g.noise(), chanceOfShuffling ), shouldShuffleCheck, 0 ) ) 

      // if we are shuffling and on a repeat boundary...
      let shuffleChanged = g.memo( g.and( shouldShuffleCheck, isShuffling ) )
      let shouldReverse = g.lt( g.noise(), reverseChance ),
          reverseMod = g.switch( shouldReverse, -1, 1 )

      let pitch = g.ifelse( 
        g.and( shuffleChanged, g.lt( g.noise(), repitchChance ) ),
        g.memo( g.mul( g.add( repitchMin, g.mul( g.sub( repitchMax, repitchMin ), g.noise() ) ), reverseMod ) ),
        reverseMod
      )
      
      // only switch pitches on repeat boundaries
      pitchMemory.in( g.switch( shuffleChanged, pitch, pitchMemory.out ) )

      let fadeLength = g.memo( g.div( rateOfShuffling, 100 ) ),
          fadeIncr = g.memo( g.div( 1, fadeLength ) )

      const bufferL = g.data( bufferSize )
      const bufferR = isStereo ? g.data( bufferSize ) : null
      let readPhase = g.accum( pitchMemory.out, 0, { shouldWrap:false }) 
      let stutter = g.wrap( g.sub( g.mod( readPhase, bufferSize ), 22050 ), 0, bufferSize )

      let normalSample = g.peek( bufferL, g.accum( 1, 0, { max:88200 }), { mode:'simple' })

      let stutterSamplePhase = g.switch( isShuffling, stutter, g.mod( readPhase, bufferSize ) )
      let stutterSample = g.memo( g.peek( 
        bufferL, 
        stutterSamplePhase,
        { mode:'samples' }
      ) )
      
      let stutterShouldFadeIn = g.and( shuffleChanged, isShuffling )
      let stutterPhase = g.accum( 1, shuffleChanged, { shouldWrap: false })

      let fadeInAmount = g.memo( g.div( stutterPhase, fadeLength ) )
      let fadeOutAmount = g.div( g.sub( rateOfShuffling, stutterPhase ), g.sub( rateOfShuffling, fadeLength ) )
      
      let fadedStutter = g.ifelse(
        g.lt( stutterPhase, fadeLength ),
        g.memo( g.mul( g.switch( g.lt( fadeInAmount, 1 ), fadeInAmount, 1 ), stutterSample ) ),
        g.gt( stutterPhase, g.sub( rateOfShuffling, fadeLength ) ),
        g.memo( g.mul( g.gtp( fadeOutAmount, 0 ), stutterSample ) ),
        stutterSample
      )
      
      let outputL = g.mix( normalSample, fadedStutter, isShuffling ) 

      let pokeL = g.poke( bufferL, leftInput, g.mod( g.add( phase, 44100 ), 88200 ) )

      let panner = g.pan( outputL, outputL, g.in( 'pan' ) )
      
      bufferShuffler.graph = [ panner.left, panner.right ]
    }

    bufferShuffler.__createGraph()
    bufferShuffler.__requiresRecompilation = [ 'input' ]
    
    out = Gibberish.factory( 
      bufferShuffler,
      bufferShuffler.graph,
      ['fx','shuffler'], 
      props 
    )

    return out 
  }
  
  Shuffler.defaults = {
    input:0,
    rate:22050,
    chance:.25,
    reverseChance:.5,
    repitchChance:.5,
    repitchMin:.5,
    repitchMax:2,
    pan:.5,
    mix:.5
  }

  return Shuffler 
}

},{"./effect.js":166,"genish.js":51}],163:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )
  
module.exports = function( Gibberish ) {
 
let __Chorus = inputProps => {
  const props = Object.assign({}, __Chorus.defaults, effect.defaults, inputProps )
  let out
  
  const chorus = Object.create( effect )

  chorus.__createGraph = function() {
    const input = g.in('input'),
          inputGain = g.in( 'inputGain' ),
          freq1 = g.in('slowFrequency'),
          freq2 = g.in('fastFrequency'),
          amp1  = g.in('slowGain'),
          amp2  = g.in('fastGain')

    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }

    const leftInput = isStereo ? g.mul( input[0], inputGain ) : g.mul( input, inputGain )

    const win0   = g.env( 'inversewelch', 1024 ),
          win120 = g.env( 'inversewelch', 1024, 0, .333 ),
          win240 = g.env( 'inversewelch', 1024, 0, .666 )
    
    const slowPhasor = g.phasor( freq1, 0, { min:0 }),
          slowPeek1  = g.mul( g.peek( win0,   slowPhasor ), amp1 ),
          slowPeek2  = g.mul( g.peek( win120, slowPhasor ), amp1 ),
          slowPeek3  = g.mul( g.peek( win240, slowPhasor ), amp1 )
    
    const fastPhasor = g.phasor( freq2, 0, { min:0 }),
          fastPeek1  = g.mul( g.peek( win0,   fastPhasor ), amp2 ),
          fastPeek2  = g.mul( g.peek( win120, fastPhasor ), amp2 ),
          fastPeek3  = g.mul( g.peek( win240, fastPhasor ), amp2 )


    let sampleRate = Gibberish.ctx.sampleRate
     
    const ms = sampleRate / 1000 
    const maxDelayTime = 1000 * ms

    //console.log( 'sr:', sampleRate, 'ms:', ms, 'maxDelayTime:', maxDelayTime )

    const time1 =  g.mul( g.add( slowPeek1, fastPeek1, 5 ), ms ),
          time2 =  g.mul( g.add( slowPeek2, fastPeek2, 5 ), ms ),
          time3 =  g.mul( g.add( slowPeek3, fastPeek3, 5 ), ms )

    const delay1L = g.delay( leftInput, time1, { size:maxDelayTime }),
          delay2L = g.delay( leftInput, time2, { size:maxDelayTime }),
          delay3L = g.delay( leftInput, time3, { size:maxDelayTime })

    
    const leftOutput = g.add( delay1L, delay2L, delay3L )
    if( isStereo ) {
      const rightInput = g.mul( input[1], inputGain )
      const delay1R = g.delay(rightInput, time1, { size:maxDelayTime }),
            delay2R = g.delay(rightInput, time2, { size:maxDelayTime }),
            delay3R = g.delay(rightInput, time3, { size:maxDelayTime })

      // flip a couple delay lines for stereo effect?
      const rightOutput = g.add( delay1R, delay2L, delay3R )
      chorus.graph = [ g.add( delay1L, delay2R, delay3L), rightOutput ]
    }else{
      chorus.graph = leftOutput
    }
  }

  chorus.__createGraph()
  chorus.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( chorus, chorus.graph, ['fx','chorus'], props )

  return out 
}

__Chorus.defaults = {
  input:0,
  slowFrequency: .18,
  slowGain:3,
  fastFrequency:6,
  fastGain:1,
  inputGain:1
}

return __Chorus

}

},{"./effect.js":166,"genish.js":51}],164:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Delay = inputProps => {
  let props = Object.assign( { delayLength: 88200 }, effect.defaults, Delay.defaults, inputProps ),
      delay = Object.create( effect )

  let out
  delay.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }    

    const input      = g.in( 'input' ),
          inputGain  = g.in( 'inputGain' ),
          delayTime  = g.in( 'time' ),
          wetdry     = g.in( 'wetdry' ),
          leftInput  = isStereo ? g.mul( input[ 0 ], inputGain ) : g.mul( input, inputGain ),
          rightInput = isStereo ? g.mul( input[ 1 ], inputGain ) : null
      
    const feedback = g.in( 'feedback' )

    // left channel
    const feedbackHistoryL = g.history()
    const echoL = g.delay( g.add( leftInput, g.mul( feedbackHistoryL.out, feedback ) ), delayTime, { size:props.delayLength })
    feedbackHistoryL.in( echoL )
    const left = g.mix( leftInput, echoL, wetdry )

    if( isStereo ) {
      // right channel
      const feedbackHistoryR = g.history()
      const echoR = g.delay( g.add( rightInput, g.mul( feedbackHistoryR.out, feedback ) ), delayTime, { size:props.delayLength })
      feedbackHistoryR.in( echoR )
      const right = g.mix( rightInput, echoR, wetdry )

      delay.graph = [ left, right ]
    }else{
      delay.graph = left 
    }
  }

  delay.__createGraph()
  delay.__requiresRecompilation = [ 'input' ]
  
  out = Gibberish.factory( 
    delay,
    delay.graph, 
    ['fx','delay'], 
    props 
  )

  return out
}

Delay.defaults = {
  input:0,
  feedback:.5,
  time: 11025,
  wetdry: .5
}

return Delay

}

},{"./effect.js":166,"genish.js":51}],165:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

const genish = g

// taken from csound: http://manual.freeshell.org/csound5/distort1.html
/*

         exp(asig * (shape1 + pregain)) - exp(asig * (shape2 - pregain))
  aout = ---------------------------------------------------------------
         exp(asig * pregain)            + exp(-asig * pregain)

*/

module.exports = function( Gibberish ) {

  let Distortion = inputProps => {
    let props = Object.assign( {}, effect.defaults, Distortion.defaults, inputProps ),
        distortion= Object.create( effect ),
        out

    distortion.__createGraph = function() {
      let isStereo = false
      if( out === undefined ) {
        isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
      }else{
        isStereo = out.input.isStereo
        out.isStereo = isStereo
      }

      const input = g.in( 'input' ),
            inputGain = g.in( 'inputGain' ),
            shape1 = g.in( 'shape1' ),
            shape2 = g.in( 'shape2' ),
            pregain = g.in( 'pregain' ),
            postgain = g.in( 'postgain' )

      let lout
      {
        'use jsdsp'
        const linput = isStereo ? g.mul( input[0], inputGain ) : g.mul( input, inputGain )
        const ltop = g.exp( linput * (shape1 + pregain) ) - g.exp( linput * (shape2 - pregain) )
        const lbottom = g.exp( linput * pregain ) + g.exp( -1 * linput * pregain )
        lout = ( ltop / lbottom ) * postgain
      }

      if( isStereo ) {
        let rout
        {
          'use jsdsp'
          const rinput = isStereo ? g.mul( input[1], inputGain ) : g.mul( input, inputGain )
          const rtop = g.exp( rinput * (shape1 + pregain) ) - g.exp( rinput * (shape2 - pregain) )
          const rbottom = g.exp( rinput * pregain ) + g.exp( -1 * rinput * pregain )
          rout = ( rtop / rbottom ) * postgain
        }

        distortion.graph = [ lout, rout ]
      }else{
        distortion.graph = lout 
      }
    }

    distortion.__createGraph()
    distortion.__requiresRecompilation = [ 'input' ]

    out = Gibberish.factory( 
      distortion,
      distortion.graph, 
      [ 'fx','distortion' ], 
      props 
    )
    return out 
  }

  Distortion.defaults = {
    input:0,
    shape1:.1,
    shape2:.1,
    pregain:5,
    postgain:.5,
  }

  return Distortion

}

},{"./effect.js":166,"genish.js":51}],166:[function(require,module,exports){
let ugen = require( '../ugen.js' )()

let effect = Object.create( ugen )

Object.assign( effect, {
  defaults: { bypass:false, inputGain:1 },
  type:'effect'
})

module.exports = effect

},{"../ugen.js":210}],167:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const effects = {
    Freeverb    : require( './freeverb.js'  )( Gibberish ),
    //Plate       : require( './dattorro.dsp.js' )( Gibberish ),
    Flanger     : require( './flanger.js'   )( Gibberish ),
    Vibrato     : require( './vibrato.js'   )( Gibberish ),
    Delay       : require( './delay.js'     )( Gibberish ),
    BitCrusher  : require( './bitCrusher.js')( Gibberish ),
    Distortion  : require( './distortion.dsp.js')( Gibberish ),
    RingMod     : require( './ringMod.js'   )( Gibberish ),
    Tremolo     : require( './tremolo.js'   )( Gibberish ),
    Chorus      : require( './chorus.js'    )( Gibberish ),
    Wavefolder  : require( './wavefolder.dsp.js')( Gibberish )[0],
    Shuffler    : require( './bufferShuffler.js'  )( Gibberish ),
    //Gate        : require( './gate.js'      )( Gibberish ),
  }

  effects.export = target => {
    for( let key in effects ) {
      if( key !== 'export' ) {
        target[ key ] = effects[ key ]
      }
    }
  }

return effects

}

},{"./bitCrusher.js":161,"./bufferShuffler.js":162,"./chorus.js":163,"./delay.js":164,"./distortion.dsp.js":165,"./flanger.js":168,"./freeverb.js":169,"./ringMod.js":170,"./tremolo.js":171,"./vibrato.js":172,"./wavefolder.dsp.js":173}],168:[function(require,module,exports){
let g = require( 'genish.js' ),
    proto = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Flanger = inputProps => {
  let props   = Object.assign( { delayLength:44100 }, Flanger.defaults, proto.defaults, inputProps ),
      flanger = Object.create( proto ),
      out

  flanger.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }

    const input = g.in( 'input' ),
          inputGain = g.in( 'inputGain' ),
          delayLength = props.delayLength,
          feedbackCoeff = g.in( 'feedback' ),
          modAmount = g.in( 'offset' ),
          frequency = g.in( 'frequency' ),
          delayBufferL = g.data( delayLength )

    const writeIdx = g.accum( 1,0, { min:0, max:delayLength, interp:'none', mode:'samples' })
    
    const offset = g.mul( modAmount, 500 )

    const mod = props.mod === undefined ? g.cycle( frequency ) : props.mod
    
    const readIdx = g.wrap( 
      g.add( 
        g.sub( writeIdx, offset ), 
        mod//g.mul( mod, g.sub( offset, 1 ) ) 
      ), 
      0, 
      delayLength
    )

    const leftInput = isStereo ? input[0] : input

    const delayedOutL = g.peek( delayBufferL, readIdx, { interp:'linear', mode:'samples' })
    
    g.poke( delayBufferL, g.add( leftInput, g.mul( delayedOutL, feedbackCoeff ) ), writeIdx )

    const left = g.add( leftInput, delayedOutL )

    if( isStereo === true ) {
      const rightInput = input[1]
      const delayBufferR = g.data( delayLength )
      
      let delayedOutR = g.peek( delayBufferR, readIdx, { interp:'linear', mode:'samples' })

      g.poke( delayBufferR, g.add( rightInput, g.mul( delayedOutR, feedbackCoeff ) ), writeIdx )
      const right = g.add( rightInput, delayedOutR )

      flanger.graph = [ left, right ]

    }else{
      flanger.graph = left
    }
  }

  flanger.__createGraph()
  flanger.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( 
    flanger,
    flanger.graph, 
    ['fx','flanger'], 
    props 
  ) 

  return out 
}

Flanger.defaults = {
  input:0,
  feedback:.81,
  offset:.125,
  frequency:1
}

return Flanger

}

},{"./effect.js":166,"genish.js":51}],169:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

module.exports = function( Gibberish ) {
  
const allPass = Gibberish.filters.genish.AllPass
const combFilter = Gibberish.filters.genish.Comb

const tuning = {
  combCount:	  	8,
  combTuning: 		[ 1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617 ],                    
  allPassCount: 	4,
  allPassTuning:	[ 225, 556, 441, 341 ],
  allPassFeedback:0.5,
  fixedGain: 		  0.015,
  scaleDamping: 	0.4,
  scaleRoom: 		  0.28,
  offsetRoom: 	  0.7,
  stereoSpread:   23
}

const Freeverb = inputProps => {
  const props = Object.assign( {}, effect.defaults, Freeverb.defaults, inputProps ),
        reverb = Object.create( effect ) 

  let out 
  reverb.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
    }    

    const combsL = [], combsR = []

    const input = g.in( 'input' ),
          inputGain = g.in( 'inputGain' ),
          wet1 = g.in( 'wet1'),
          wet2 = g.in( 'wet2' ),  
          dry = g.in( 'dry' ), 
          roomSize = g.in( 'roomSize' ), 
          damping = g.in( 'damping' )
    
    const __summedInput = isStereo === true ? g.add( input[0], input[1] ) : input,
          summedInput = g.mul( __summedInput, inputGain ),
          attenuatedInput = g.memo( g.mul( summedInput, tuning.fixedGain ) )
    
    // create comb filters in parallel...
    for( let i = 0; i < 8; i++ ) { 
      combsL.push( 
        combFilter( 
          attenuatedInput, 
          tuning.combTuning[i], 
          g.mul(damping,.4),
          g.mul( tuning.scaleRoom + tuning.offsetRoom, roomSize ) 
        ) 
      )
      combsR.push( 
        combFilter( 
          attenuatedInput, 
          tuning.combTuning[i] + tuning.stereoSpread, 
          g.mul(damping,.4), 
          g.mul( tuning.scaleRoom + tuning.offsetRoom, roomSize ) 
        ) 
      )
    }
    
    // ... and sum them with attenuated input, use of let is deliberate here
    let outL = g.add( attenuatedInput, ...combsL )
    let outR = g.add( attenuatedInput, ...combsR )
    
    // run through allpass filters in series
    for( let i = 0; i < 4; i++ ) { 
      outL = allPass( outL, tuning.allPassTuning[ i ] + tuning.stereoSpread )
      outR = allPass( outR, tuning.allPassTuning[ i ] + tuning.stereoSpread )
    }
    
    const outputL = g.add( g.mul( outL, wet1 ), g.mul( outR, wet2 ), g.mul( isStereo === true ? input[0] : input, dry ) ),
          outputR = g.add( g.mul( outR, wet1 ), g.mul( outL, wet2 ), g.mul( isStereo === true ? input[1] : input, dry ) )

    reverb.graph = [ outputL, outputR ]
  }

  reverb.__createGraph()
  reverb.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( reverb, reverb.graph, ['fx','freeverb'], props )

  return out
}


Freeverb.defaults = {
  input: 0,
  wet1: 1,
  wet2: 0,
  dry: .5,
  roomSize: .925,
  damping:  .5,
}

return Freeverb 

}


},{"./effect.js":166,"genish.js":51}],170:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let RingMod = inputProps => {
  let props   = Object.assign( {}, RingMod.defaults, effect.defaults, inputProps ),
      ringMod = Object.create( effect ),
      out

  ringMod.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }    

    const input = g.in( 'input' ),
          inputGain = g.in( 'inputGain' ),
          frequency = g.in( 'frequency' ),
          gain = g.in( 'gain' ),
          mix = g.in( 'mix' )
    
    const leftInput = isStereo ? g.mul( input[0], inputGain ) : g.mul( input, inputGain ),
          sine = g.mul( g.cycle( frequency ), gain )
   
    const left = g.add( g.mul( leftInput, g.sub( 1, mix )), g.mul( g.mul( leftInput, sine ), mix ) ) 
        
    if( isStereo === true ) {
      const rightInput = g.mul( input[1], inputGain ),
            right = g.add( g.mul( rightInput, g.sub( 1, mix )), g.mul( g.mul( rightInput, sine ), mix ) ) 
      
      ringMod.graph = [ left, right ]
    }else{
      ringMod.graph = left
    }
  }

  ringMod.__createGraph() 
  ringMod.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( 
    ringMod,
    ringMod.graph, 
    [ 'fx','ringMod'], 
    props 
  )
  
  return out 
}

RingMod.defaults = {
  input:0,
  frequency:220,
  gain: 1, 
  mix:1
}

return RingMod

}

},{"./effect.js":166,"genish.js":51}],171:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
const Tremolo = inputProps => {
  const props   = Object.assign( {}, Tremolo.defaults, effect.defaults, inputProps ),
        tremolo = Object.create( effect )
  
  let out
  tremolo.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }    

    const input = g.in( 'input' ),
          inputGain = g.in( 'inputGain' ),
          frequency = g.in( 'frequency' ),
          amount = g.in( 'amount' )
    
    const leftInput = isStereo ? g.mul( input[0], inputGain ) : g.mul( input, inputGain )

    let osc
    if( props.shape === 'square' ) {
      osc = g.gt( g.phasor( frequency ), 0 )
    }else if( props.shape === 'saw' ) {
      osc = g.gtp( g.phasor( frequency ), 0 )
    }else{
      osc = g.cycle( frequency )
    }

    const mod = g.mul( osc, amount )
   
    const left = g.sub( leftInput, g.mul( leftInput, mod ) )

    if( isStereo === true ) {
      const rightInput = g.mul( input[1], inputGain ),
            right = g.mul( rightInput, mod )

      tremolo.graph = [ left, right ]
    }else{
      tremolo.graph = left
    }
  }
  
  tremolo.__createGraph()
  tremolo.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( 
    tremolo,
    tremolo.graph,
    ['fx','tremolo'], 
    props 
  ) 
  return out 
}

Tremolo.defaults = {
  input:0,
  frequency:2,
  amount: 1, 
  shape:'sine'
}

return Tremolo

}

},{"./effect.js":166,"genish.js":51}],172:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
const Vibrato = inputProps => {
  const props   = Object.assign( {}, Vibrato.defaults, effect.defaults, inputProps ),
        vibrato = Object.create( effect )

  let out
  vibrato.__createGraph = function() {
    let isStereo = false
    if( out === undefined ) {
      isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
    }else{
      isStereo = out.input.isStereo
      out.isStereo = isStereo
    }    

    const input = g.in( 'input' ),
          inputGain = g.in( 'inputGain' ),
          delayLength = 44100,
          feedbackCoeff = g.in( 'feedback' ),
          modAmount = g.in( 'amount' ),
          frequency = g.in( 'frequency' ),
          delayBufferL = g.data( delayLength )

    const writeIdx = g.accum( 1,0, { min:0, max:delayLength, interp:'none', mode:'samples' })
    
    const offset = g.mul( modAmount, 500 )
    
    const readIdx = g.wrap( 
      g.add( 
        g.sub( writeIdx, offset ), 
        g.mul( g.cycle( frequency ), g.sub( offset, 1 ) ) 
      ), 
      0, 
      delayLength
    )

    const leftInput = isStereo ? g.mul( input[0], inputGain ) : g.mul( input, inputGain )

    const delayedOutL = g.peek( delayBufferL, readIdx, { interp:'linear', mode:'samples' })
    
    g.poke( delayBufferL, g.add( leftInput, g.mul( delayedOutL, feedbackCoeff ) ), writeIdx )

    const left = delayedOutL

    if( isStereo === true ) {
      const rightInput = g.mul( input[1], inputGain )
      const delayBufferR = g.data( delayLength )
      
      const delayedOutR = g.peek( delayBufferR, readIdx, { interp:'linear', mode:'samples' })

      g.poke( delayBufferR, g.add( rightInput, mul( delayedOutR, feedbackCoeff ) ), writeIdx )
      const right = delayedOutR

      vibrato.graph = [ left, right ]
    }else{
      vibrato.graph = left 
    }
  }

  vibrato.__createGraph()
  vibrato.__requiresRecompilation = [ 'input' ]

  out = Gibberish.factory( 
    vibrato,
    vibrato.graph,    
    [ 'fx', 'vibrato' ], 
    props 
  ) 
  return out 
}

Vibrato.defaults = {
  input:0,
  feedback:.01,
  amount:.5,
  frequency:4
}

return Vibrato

}

},{"./effect.js":166,"genish.js":51}],173:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

const genish = g

const RL = 7.5e3,
       R = 15e3, 
      VT = 26e-3,
      Is = 10e-16,
       a = 2*RL/R,
       b = (R+2*RL)/(VT*R),
       d = (RL*Is)/VT

// Antialiasing error threshold
const thresh = 10e-10;

const wavestage = in1 => {
  const body = `  const thresh = 10e-10;

  let w = Ln1;
  let expw, p, r, s;

  const e = Math.E
  const pow = Math.pow
  const abs = Math.abs
  for(let i=0; i<1000; i++) {
    expw = pow(e,w);

    p = w*expw - x;
    r = (w+1)*expw;
    s = (w+2)/(2*(w+1));        
    err = (p/(r-(p*s)));

    if (abs(err)<thresh) {
      break;
    }

    w = w - err;
  }

  return w;`

  const Lambert_W = g.process( 'x','Ln1', body )

  const Ln1 = g.history(0),
        Fn1 = g.history(0),
        xn1 = g.history(0)

  {
    'use jsdsp'
    // Compute Antiderivative
    const l = g.sign(in1); 
    let u = d * g.pow( Math.E, l * b * in1 )
    let Ln = Lambert_W.call(u,Ln1.out)
    const Fn = (0.5 * VT/b ) * (Ln * (Ln + 2)) - 0.5*a*in1*in1

    let xn = 0.5 * ( in1 + xn1.out )
    u = d * g.pow( Math.E, l * b * xn )
    Ln = Lambert_W.call( u, Ln1.out )

    //out1 = ;
    // Check for ill-conditioning
    const out1 = g.ifelse(
      g.lt( g.abs( in1 - xn1.out ), thresh), 
      (l * VT * Ln) - ( a * xn ),
      (Fn - Fn1.out) / (in1 - xn1.out)
    )

    // Update States
    Ln1.in( Ln )
    Fn1.in( Fn )
    xn1.in( in1 )

    return out1
  }
}

module.exports = function( Gibberish ) {

  const Wavefolder = inputProps => {

    let props = Object.assign( {}, effect.defaults, Wavefolder.defaults, inputProps ),
        wavefolder = Object.create( effect ),
        out

    wavefolder.__createGraph = function() {
      let isStereo = false
      if( out === undefined ) {
        isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : false 
      }else{
        isStereo = out.input.isStereo
        out.isStereo = isStereo
      }

      const input = g.in( 'input' ),
            gain  = g.in( 'gain' ),
            postgain = g.in( 'postgain' )

      let lout
      {
        'use jsdsp'

        const linput = isStereo ? input[0] * gain : input * gain
        lout = linput * .333
        lout = wavestage( wavestage( wavestage( wavestage( lout ) ) ) )
        lout = lout * .6
        lout = g.tanh( lout ) * postgain
      }

      wavefolder.graph = lout

      if( isStereo ) {
        let rout
        {
          'use jsdsp'
          const rinput = isStereo ? input[1] * gain : input * gain
          rout = rinput * .333
          rout = wavestage( wavestage( wavestage( wavestage( rout ) ) ) )
          rout = rout * .6
          rout = g.tanh( rout ) * postgain
        }

        wavefolder.graph = [ lout, rout ]
      }
    }

    wavefolder.__createGraph()
    wavefolder.__requiresRecompilation = [ 'input' ]

    out = Gibberish.factory( 
      wavefolder,
      wavefolder.graph, 
      [ 'fx','wavefolder' ], 
      props 
    )

    return out 
  }

  Wavefolder.defaults = {
    input:0,
    gain:2,
    postgain:1
  }

  return [ Wavefolder, wavestage ]

}

},{"./effect.js":166,"genish.js":51}],174:[function(require,module,exports){
let MemoryHelper = require( 'memory-helper' ),
    genish       = require( 'genish.js' )
    
let Gibberish = {
  blockCallbacks: [], // called every block
  dirtyUgens: [],
  callbackUgens: [],
  callbackNames: [],
  analyzers: [],
  graphIsDirty: false,
  ugens: {},
  debug: false,
  id: -1,
  preventProxy:false,
  proxyEnabled: true,

  output: null,

  memory : null, // 20 minutes by default?
  factory: null, 
  genish,
  scheduler: require( './scheduling/scheduler.js' ),
  //workletProcessorLoader: require( './workletProcessor.js' ),
  workletProcessor: null,

  memoed: {},
  mode:'scriptProcessor',

  prototypes: {
    ugen: null,//require('./ugen.js'),
    instrument: require( './instruments/instrument.js' ),
    effect: require( './fx/effect.js' ),
    analyzer: require( './analysis/analyzer.js' )
  },

  mixins: {
    polyinstrument: require( './instruments/polyMixin.js' )
  },

  workletPath: './gibberish_worklet.js',

  init( memAmount, ctx, mode='worklet' ) {
    let numBytes = isNaN( memAmount ) ? 20 * 60 * 44100 : memAmount

    // regardless of whether or not gibberish is using worklets,
    // we still want genish to output vanilla js functions instead
    // of audio worklet classes; these functions will be called
    // from within the gibberish audioworklet processor node.
    this.genish.gen.mode = 'scriptProcessor'

    this.memory = MemoryHelper.create( numBytes, Float64Array )

    this.mode = mode

    const startup = this.utilities.createWorklet

    this.scheduler.init( this )
    
    this.analyzers.dirty = false

    if( this.mode === 'worklet' ) {

      const p = new Promise( (resolve, reject ) => {

        const pp = new Promise( (__resolve, __reject ) => {
          this.utilities.createContext( ctx, startup.bind( this.utilities ), __resolve )
        }).then( ()=> {
          Gibberish.preventProxy = true
          Gibberish.load()
          Gibberish.preventProxy = false
          Gibberish.output = this.Bus2()

          // Gibberish.output needs to be assign so that ugens can
          // connect to it by default. There's no other way to assign it
          // outside of evaling code at this point.
          Gibberish.worklet.port.postMessage({ 
            address:'eval', 
            code:`Gibberish.output = this.ugens.get(${Gibberish.output.id});` 
          })

          resolve()
        })

      })
      
      return p

    }else if( this.mode === 'processor' ) {
      Gibberish.load()
    }
  },

  load() {
    this.factory      = require( './factory.js' )( this )
    
    this.Panner       = require( './misc/panner.js' )( this )
    this.PolyTemplate = require( './instruments/polytemplate.js' )( this )
    this.oscillators  = require( './oscillators/oscillators.js' )( this )
    this.filters      = require( './filters/filters.js' )( this )
    this.binops       = require( './misc/binops.js' )( this )
    this.monops       = require( './misc/monops.js' )( this )
    this.Bus          = require( './misc/bus.js' )( this )
    this.Bus2         = require( './misc/bus2.js' )( this )
    this.instruments  = require( './instruments/instruments.js' )( this )
    this.fx           = require( './fx/effects.js' )( this )
    this.Sequencer    = require( './scheduling/sequencer.js' )( this )
    this.Sequencer2   = require( './scheduling/seq2.js' )( this )
    this.Tidal        = require( './scheduling/tidal.js' )( this )
    this.envelopes    = require( './envelopes/envelopes.js' )( this )
    this.analysis     = require( './analysis/analyzers.js' )( this )
    this.time         = require( './misc/time.js' )( this )
    this.Proxy        = require( './workletProxy.js' )( this )
  },

  export( target, shouldExportGenish=false ) {
    if( target === undefined ) throw Error('You must define a target object for Gibberish to export variables to.')

    if( shouldExportGenish ) this.genish.export( target )

    this.instruments.export( target )
    this.fx.export( target )
    this.filters.export( target )
    this.oscillators.export( target )
    this.binops.export( target )
    this.monops.export( target )
    this.envelopes.export( target )
    this.analysis.export( target )
    target.Sequencer = this.Sequencer
    target.Sequencer2 = this.Sequencer2
    target.Bus = this.Bus
    target.Bus2 = this.Bus2
    target.Scheduler = this.scheduler
    target.Tidal = this.Tidal
    this.time.export( target )
    this.utilities.export( target )
  },

  printcb() { 
    Gibberish.worklet.port.postMessage({ address:'callback' }) 
  },
  printobj( obj ) {
    Gibberish.worklet.port.postMessage({ address:'print', object:obj.id }) 
  },
  send( msg ){
    Gibberish.worklet.port.postMessage( msg )
  },

  dirty( ugen ) {
    if( ugen === this.analyzers ) {
      this.graphIsDirty = true
      this.analyzers.dirty = true
    } else {
      this.dirtyUgens.push( ugen )
      this.graphIsDirty = true
      if( this.memoed[ ugen.ugenName ] ) {
        delete this.memoed[ ugen.ugenName ]
      }
    } 
  },

  clear() {
    // do not delete the gain and the pan of the master bus 
    this.output.inputs.splice( 0, this.output.inputs.length - 2 )
    //this.output.inputNames.length = 0
    this.analyzers.length = 0
    this.scheduler.clear()
    this.dirty( this.output )
    if( this.mode === 'worklet' ) {
      this.worklet.port.postMessage({ 
        address:'method', 
        object:this.id,
        name:'clear',
        args:[]
      })
    }
    // clear memory... XXX should this be a MemoryHelper function?
    //this.memory.heap.fill(0)
    //this.memory.list = {}

    Gibberish.genish.gen.removeAllListeners('memory init')
    Gibberish.genish.gen.histories.clear()

    //Gibberish.output = this.Bus2()
    
  },

  // used to sort analysis ugens by priority.
  // higher priorities mean lower ordering in the array,
  // which means they will run first in the callback function.
  // by defult, analysis ugens are assigned a priority of 0 in the
  // analysis prototype.
  analysisCompare( a,b ) {
    return (isNaN(b.priority) ? 0 : b.priority) - (isNaN(a.priority) ? 0: a.priority )
  },

  generateCallback() {
    if( this.mode === 'worklet' ) {
      Gibberish.callback = function() { return 0 }
      Gibberish.callback.out = []
      return Gibberish.callback
    }
    let uid = 0,
        callbackBody, lastLine, analysis=''

    this.memoed = {}

    callbackBody = this.processGraph( this.output )
    lastLine = callbackBody[ callbackBody.length - 1]
    callbackBody.unshift( "\t'use strict'" )

    this.analyzers
      .sort( this.analysisCompare )
      .forEach( v=> {
        const analysisBlock = Gibberish.processUgen( v )
        //if( Gibberish.mode === 'processor' ) {
        //  console.log( 'analysis:', analysisBlock, v  )
        //}
        let analysisLine

        if( typeof analysisBlock === 'object' ) {
          analysisLine = analysisBlock.pop()

          analysisBlock.forEach( v => {
            callbackBody.splice( callbackBody.length - 1, 0, v )
          })
        }else{
          analysisLine = analysisBlock
        }

        callbackBody.push( analysisLine )
      })

    this.analyzers.forEach( v => {
      if( this.callbackUgens.indexOf( v.callback ) === -1 )
        this.callbackUgens.push( v.callback )
    })

    this.callbackNames = this.callbackUgens.map( v => v.ugenName )

    callbackBody.push( '\n\treturn ' + lastLine.split( '=' )[0].split( ' ' )[1] )

    if( this.debug === true ) console.log( 'callback:\n', callbackBody.join('\n') )
    
    this.callbackNames.push( 'mem' )
    this.callbackUgens.push( this.memory.heap )
    this.callback = Function( ...this.callbackNames, callbackBody.join( '\n' ) )//.bind( null, ...this.callbackUgens )
    this.callback.out = []

    if( this.oncallback ) this.oncallback( this.callback )

    return this.callback 
  },

  processGraph( output ) {
    this.callbackUgens.length = 0
    this.callbackNames.length = 0

    this.callbackUgens.push( output.callback )

    let body = this.processUgen( output )
    

    this.dirtyUgens.length = 0
    this.graphIsDirty = false

    return body
  },
  proxyReplace( obj ) {
    if( typeof obj === 'object' && obj !== null ) {
      if( obj.id !== undefined ) {
        const __obj = Gibberish.processor.ugens.get( obj.id )
        //console.log( 'retrieved:', __obj.name )

        //if( obj.prop !== undefined ) console.log( 'got a ssd.out', obj )
        return obj.prop !== undefined ? __obj[ obj.prop ] : __obj
      }else if( obj.isFunc === true ) {
        let func =  eval( '(' + obj.value + ')' )

        //console.log( 'replacing function:', func )

        return func
      }
    }

    return obj
  },

  processUgen( ugen, block ) {
    if( block === undefined ) block = []
    if( ugen === undefined ) return block


    let dirtyIdx = Gibberish.dirtyUgens.indexOf( ugen )

    let memo = Gibberish.memoed[ ugen.ugenName ]

    if( memo !== undefined ) {
      return memo
    } else if( ugen === true || ugen === false ) {
      throw "Why is ugen a boolean? [true] or [false]";
    } else if( ugen.block === undefined || dirtyIndex !== -1 ) {
      // weird edge case with analysis (follow) ugen
      if( ugen.id === undefined ) {
        ugen.id = ugen.__properties__.overrideid
      }

      let line = `\tconst v_${ugen.id} = ` 
      if( !ugen.isop ) line += `${ugen.ugenName}( `

      // must get array so we can keep track of length for comma insertion
      const keys = ugen.isop === true || ugen.type === 'bus'  
        ? Object.keys( ugen.inputs ) 
        : [...ugen.inputNames ] 

      line = ugen.isop === true 
        ? Gibberish.__processBinop( ugen, line, block, keys ) 
        : Gibberish.__processNonBinop( ugen, line, block, keys )

      line = Gibberish.__addLineEnding( line, ugen, keys )

      block.push( line )
      
      Gibberish.memoed[ ugen.ugenName ] = `v_${ugen.id}`

      if( dirtyIdx !== -1 ) {
        Gibberish.dirtyUgens.splice( dirtyIdx, 1 )
      }

    }else if( ugen.block ) {
      return ugen.block
    }

    return block
  }, 

  __processBinop( ugen, line, block, keys ) {
    //__getInputString( line, input, block, key, ugen ) {
    const isLeftStereo = Gibberish.__isStereo( ugen.inputs[0] ), 
          isRightStereo = Gibberish.__isStereo( ugen.inputs[1] ),
          left = Gibberish.__getInputString( line, ugen.inputs[0], block, '0', keys ),
          right= Gibberish.__getInputString( line, ugen.inputs[1], block, '1', keys ),
          op = ugen.op
        
    let graph, out

    if( isLeftStereo === true && isRightStereo === false ) {
      line += `[ ${left}[0] ${op} ${right}, ${left}[1] ${op} ${right} ]`
      //graph = [ g.add( args[0].graph[0], args[1] ), g.add( args[0].graph[1], args[1] )]
    }else if( isLeftStereo === false && isRightStereo === true ) {
      //graph = [ g.add( args[0], args[1].graph[0] ), g.add( args[0], args[1].graph[1] )]
      line += `[ ${left} ${op} ${right}[0], ${left} ${op} ${right}[1] ]`
    }else if( isLeftStereo === true && isRightStereo === true ) {
      //graph = [ g.add( args[0].graph[0], args[1].graph[0] ), g.add( args[0].graph[1], args[1].graph[1] )]
      line += `[ ${left}[0] ${op} ${right}[0], ${left}[1] ${op} ${right}[1] ]`
    }else{
      // XXX important, must re-assign when calling processNonBinop
      line = Gibberish.__processNonBinop( ugen, line, block, keys )
    }
    
    return line
  },

  __processNonBinop( ugen, line, block, keys ) {
    for( let i = 0; i < keys.length; i++ ) {
      let key = keys[ i ]
      // binop.inputs is actual values, not just property names
      let input 
      if( ugen.isop || ugen.type ==='bus' ) {
        input = ugen.inputs[ key ]
      }else{
        input = ugen[ key ] 
      }

      if( input !== undefined ) { 
        input = Gibberish.__getBypassedInput( input )
        line += Gibberish.__getInputString( line, input, block, key, ugen )
        line  = Gibberish.__addSeparator( line, input, ugen, i < keys.length - 1 )
      }
    }

    return line
  },

  // determine if a ugen is stereo
  __isStereo( ugen ) {
    let isStereo = false

    if( ugen === undefined || ugen === null ) return false

    if( ugen.isStereo === true ) return true

    if( ugen.isop === true ) {
      return Gibberish.__isStereo( ugen.inputs[0] ) || Gibberish.__isStereo( ugen.inputs[1] )
    }
    
    return isStereo
  },

  // if an effect is bypassed, get next one in chain (or output destination)
  __getBypassedInput( input ) {
    if( input.bypass === true ) {
      // loop through inputs of chain until one is found
      // that is not being bypassed

      let found = false

      while( input.input !== 'undefined' && found === false ) {
        if( typeof input.input.bypass !== 'undefined' ) {
          input = input.input
          if( input.bypass === false ) found = true
        }else{
          input = input.input
          found = true
        }
      }
    }

    return input
  },

  // get a string representing a ugen for insertion into callback.
  // if a ugen contains other ugens, trigger codegen for those ugens as well.
  __getInputString( line, input, block, key, ugen ) {
    let value = ''
    if( typeof input === 'number' ) {
      if( isNaN(key) ) {
        value += `mem[${ugen.__addresses__[ key ]}]`//input
      }else{
        value += input
      }
    } else if( typeof input === 'boolean' ) {
      value += '' + input
    }else{
      //console.log( 'key:', key, 'input:', ugen.inputs, ugen.inputs[ key ] ) 
      // XXX not sure why this has to be here, but somehow non-processed objects
      // that only contain id numbers are being passed here...

      if( input !== undefined ) {
        if( Gibberish.mode === 'processor' ) {
          if( input.ugenName === undefined && input.id !== undefined  ) {
            if( ugen === undefined  ) {
              input = Gibberish.processor.ugens.get( input.id )
            }else{
              if( ugen.type !== 'seq' ) {
                input = Gibberish.processor.ugens.get( input.id )
              }
            }
          }
        }

        Gibberish.processUgen( input, block )

        if( !input.isop ) {
          // check is needed so that graphs with ssds that refer to themselves
          // don't add the ssd in more than once
          if( Gibberish.callbackUgens.indexOf( input.callback ) === -1 ) {
            Gibberish.callbackUgens.push( input.callback )
          }
        }

        value += `v_${input.id}`
        input.__varname = value
      }
    }

    return value
  },

  // add separators for function calls and handle binops (mono only)
  __addSeparator( line, input, ugen, isNotEndOfLine ) {
    if( isNotEndOfLine === true ) {
      if( ugen.isop === true ) {
        if( ugen.op === '*' || ugen.op === '/' ) {
          if( input !== 1 ) {
            line += ' ' + ugen.op + ' '
          }else{
            line = line.slice( 0, -1 * (''+input).length )
          }
        }else{
          line += ' ' + ugen.op + ' '
        }
      }else{
        line += ', '
      }
    }

    return line
  },

  // add memory to end of function calls and close parenthesis 
  __addLineEnding( line, ugen, keys ) {
    if( (ugen.type === 'bus' && keys.length > 0) ) line += ', '
    if( !ugen.isop && ugen.type !== 'seq' ) line += 'mem'
    line += ugen.isop ? '' : ' )'

    return line
  },

}

Gibberish.prototypes.Ugen = Gibberish.prototypes.ugen = require( './ugen.js' )( Gibberish )
Gibberish.utilities = require( './utilities.js' )( Gibberish )

module.exports = Gibberish

},{"./analysis/analyzer.js":140,"./analysis/analyzers.js":141,"./envelopes/envelopes.js":146,"./factory.js":151,"./filters/filters.js":158,"./fx/effect.js":166,"./fx/effects.js":167,"./instruments/instrument.js":181,"./instruments/instruments.js":182,"./instruments/polyMixin.js":187,"./instruments/polytemplate.js":188,"./misc/binops.js":194,"./misc/bus.js":195,"./misc/bus2.js":196,"./misc/monops.js":197,"./misc/panner.js":198,"./misc/time.js":199,"./oscillators/oscillators.js":202,"./scheduling/scheduler.js":206,"./scheduling/seq2.js":207,"./scheduling/sequencer.js":208,"./scheduling/tidal.js":209,"./ugen.js":210,"./utilities.js":211,"./workletProxy.js":212,"genish.js":51,"memory-helper":221}],175:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

const genish = g
  
module.exports = function( Gibberish ) {

  const Clap = argumentProps => {
    'use jsdsp' 

    const clap = Object.create( instrument ),
          decay = g.in( 'decay' ), // 0-1 input value
          scaledDecay = decay * (g.gen.samplerate * 2 ),
          gain  = g.in( 'gain' ),
          spacing = g.in( 'spacing' ), // spacing between clap, in Hzs
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          cutoff = g.in('cutoff'),
          Q      = g.in('Q')

    const props = Object.assign( {}, Clap.defaults, argumentProps )

    const eg = g.decay( scaledDecay, { initValue:0 } ), 
          check = g.gt( eg, .0005 ),
          noise = -1 + g.noise() * 2,
          rnd = noise,//g.gtp( noise, 0 ),// * eg,
          b   = g.bang(),
          saw = g.phasor( spacing, b, { min:0 }),
          rsaw = 1 - saw,
          saw_env = g.ad( 0, .035 * g.gen.samplerate, { shape:'linear' }), 
          b2 = g.bang(),
          count = g.accum( 1,b2,{ max:Infinity, min:0, initialValue:0 }),
          delayedNoise = g.switch( g.gte( count, g.gen.samplerate * .035 ), rnd, 0 ),
          bpf1 = g.svf( delayedNoise, 1000, .5, 2, false ),

          scaledOut = ( bpf1 * eg + ( rnd * rsaw * saw_env ) ) * gain * loudness * triggerLoudness,
          out = g.svf( scaledOut, cutoff, Q, 1, false )
    
    // XXX TODO : make this work with ifelse. the problem is that poke ugens put their
    // code at the bottom of the callback function, instead of at the end of the
    // associated if/else block.
    const ife = g.switch( check, out, 0 )
    
    clap.env = {
      trigger( vol ) {
        b.trigger()
        eg.trigger( vol )
        b2.trigger()
        saw_env.trigger()
      }
    } 
    
    return Gibberish.factory( clap, ife, ['instruments','clap'], props  )
  }
  
  Clap.defaults = {
    gain: 1,
    spacing:100,
    decay:.2,
    loudness:1,
    __triggerLoudness:1,
    cutoff:900,
    Q:.85
  }

  return Clap

}

},{"./instrument.js":181,"genish.js":51}],176:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' ),
      __wavefold   = require( '../fx/wavefolder.dsp.js' )

const genish = g

module.exports = function( Gibberish ) {
  const wavefold = __wavefold( Gibberish )[1]

  const Complex = inputProps => {
    const syn = Object.create( instrument )

    const frequency = g.in( 'frequency' ),
          loudness  = g.in( 'loudness' ), 
          triggerLoudness = g.in( '__triggerLoudness' ),
          glide   = g.max( 1, g.in( 'glide' ) ),
          slidingFreq = g.slide( frequency, glide, glide ),
          attack  = g.in( 'attack' ), 
          decay   = g.in( 'decay' ),
          sustain = g.in( 'sustain' ), 
          sustainLevel = g.in( 'sustainLevel' ),
          release = g.in( 'release' ),
          pregain = g.in( 'pregain' ),
          postgain= g.in( 'postgain' ),
          bias    = g.in( 'bias' )

    const props = Object.assign( {}, Complex.defaults, inputProps )
    Object.assign( syn, props )

    syn.__createGraph = function() {
      const osc = Gibberish.oscillators.factory( syn.waveform, slidingFreq, syn.antialias )

      const env = Gibberish.envelopes.factory( 
        props.useADSR, 
        props.shape, 
        attack, decay, 
        sustain, sustainLevel, 
        release, 
        props.triggerRelease
      )

      const saturation = g.in('saturation')

      // below doesn't work as it attempts to assign to release property triggering codegen...
      // syn.release = ()=> { syn.env.release() }

      {
        'use jsdsp'
        let oscWithEnv = osc * env * loudness * triggerLoudness,
            panner

        let foldedOsc = wavefold( wavefold( wavefold( wavefold( bias + oscWithEnv * (pregain * env) * .333 ) ) ) )
        foldedOsc = g.tanh( foldedOsc * .6 ) * postgain
 
        // 16 is an unfortunate empirically derived magic number...
        const baseCutoffFreq = g.in('cutoff') * ( frequency /  ( g.gen.samplerate / 16 ) ) 
        const cutoff = g.min( baseCutoffFreq * g.pow( 2, g.in('filterMult') * loudness * triggerLoudness ) * env, .995 ) 
        const filteredOsc = Gibberish.filters.factory( foldedOsc, cutoff, saturation, props )

        let complexWithGain = filteredOsc * g.in( 'gain' )
        // XXX ugly, ugly hack
        if(  props.filterModel !== 2 ) complexWithGain = complexWithGain * saturation
    
        if( syn.panVoices === true ) { 
          panner = g.pan( complexWithGain, complexWithGain, g.in( 'pan' ) ) 
          syn.graph = [ panner.left, panner.right ]
        }else{
          syn.graph = complexWithGain
        }

        syn.env = env
        syn.osc = osc
        syn.filter = filteredOsc
      }

    }
    
    syn.__requiresRecompilation = [ 'waveform', 'antialias', 'filterModel','filterMode', 'useADSR', 'shape' ]
    syn.__createGraph()

    const out = Gibberish.factory( syn, syn.graph, ['instruments', 'complex'], props  )

    return out
  }
  
  Complex.defaults = {
    waveform:'triangle',
    attack: 44,
    decay: 22050,
    sustain:44100,
    sustainLevel:.6,
    release:22050,
    useADSR:false,
    shape:'exponential',
    triggerRelease:false,
    gain: .5,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    antialias:true,
    panVoices:false,
    loudness:1,
    __triggerLoudness:1,
    glide:1,
    saturation:1,
    filterMult:2,
    Q:.25,
    cutoff:.5,
    //filterType:1,
    filterModel:1,
    filterMode:0,
    isStereo:false,
    pregain:4,
    postgain:1,
    bias:0
  }

  // do not include velocity, which shoudl always be per voice
  let PolyComplex = Gibberish.PolyTemplate( Complex, ['frequency','attack','decay','pulsewidth','pan','gain','glide', 'saturation', 'filterMult', 'Q', 'cutoff', 'resonance', 'antialias', 'filterModel', 'waveform', 'filterMode', '__triggerLoudness', 'loudness', 'pregain', 'postgain', 'bias'] ) 
  PolyComplex.defaults = Complex.defaults

  return [ Complex, PolyComplex ]

}

},{"../fx/wavefolder.dsp.js":173,"./instrument.js":181,"genish.js":51}],177:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Conga = argumentProps => {
    const conga = Object.create( instrument ),
          frequency = g.in( 'frequency' ),
          decay = g.in( 'decay' ),
          gain  = g.in( 'gain' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' )

    const props = Object.assign( {}, Conga.defaults, argumentProps )

    const trigger = g.bang(),
          impulse = g.mul( trigger, 60 ),
          _decay =  g.sub( .101, g.div( decay, 10 ) ), // create range of .001 - .099
          bpf = g.svf( impulse, frequency, _decay, 2, false ),
          out = g.mul( bpf, g.mul( g.mul( triggerLoudness,loudness ), gain ) )
    
    conga.isStereo = false
    conga.env = trigger
    return Gibberish.factory( conga, out, ['instruments','conga'], props  )
  }
  
  Conga.defaults = {
    gain: .125,
    frequency:190,
    decay: .85,
    loudness: 1,
    __triggerLoudness:1
  }

  const PolyConga = Gibberish.PolyTemplate( Conga, ['gain','frequency','decay','loudness','__triggerLoudness' ] ) 
  PolyConga.defaults = Conga.defaults

  return [ Conga, PolyConga ]
}

},{"./instrument.js":181,"genish.js":51}],178:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Cowbell = argumentProps => {
    let cowbell = Object.create( instrument )
    
    const decay   = g.in( 'decay' ),
          gain    = g.in( 'gain' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' )

    const props = Object.assign( {}, Cowbell.defaults, argumentProps )

    const bpfCutoff = g.param( 'bpfc', 1000 ),
          s1 = Gibberish.oscillators.factory( 'square', 560 ),
          s2 = Gibberish.oscillators.factory( 'square', 845 ),
          eg = g.decay( g.mul( decay, g.gen.samplerate * 2 ), { initValue:0 }), 
          bpf = g.svf( g.add( s1,s2 ), bpfCutoff, 3, 2, false ),
          envBpf = g.mul( bpf, eg ),
          out = g.mul( envBpf, g.mul( gain, loudness, triggerLoudness ) )

    cowbell.env = eg 

    cowbell.isStereo = false

    cowbell = Gibberish.factory( cowbell, out, ['instruments', 'cowbell'], props  )
    
    return cowbell
  }
  
  Cowbell.defaults = {
    gain: 1,
    decay:.5,
    loudness:1,
    __triggerLoudness:1
  }

  return Cowbell

}

},{"./instrument.js":181,"genish.js":51}],179:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

const genish = g

module.exports = function( Gibberish ) {

  const FM = inputProps => {
    let syn = Object.create( instrument )

    let frequency = g.in( 'frequency' ),
        glide = g.max( 1, g.in( 'glide' ) ),
        slidingFreq = g.slide( frequency, glide, glide ),
        cmRatio = g.in( 'cmRatio' ),
        index = g.in( 'index' ),
        feedback = g.in( 'feedback' ),
        attack = g.in( 'attack' ), decay = g.in( 'decay' ),
        sustain = g.in( 'sustain' ), sustainLevel = g.in( 'sustainLevel' ),
        release = g.in( 'release' ),
        loudness = g.in( 'loudness' ),
        triggerLoudness = g.in( '__triggerLoudness' ),
        saturation = g.in( 'saturation' )

    const props = Object.assign( {}, FM.defaults, inputProps )
    Object.assign( syn, props )

    syn.__createGraph = function() {
      const env = Gibberish.envelopes.factory( 
        props.useADSR, 
        props.shape, 
        attack, decay, 
        sustain, sustainLevel, 
        release, 
        props.triggerRelease
      )

      syn.advance = ()=> { env.release() }

      const feedbackssd = g.history( 0 )

      const modOsc = Gibberish.oscillators.factory( 
        syn.modulatorWaveform, 
        g.add( g.mul( slidingFreq, cmRatio ), g.mul( feedbackssd.out, feedback, index ) ), 
        syn.antialias 
      )

      {
        'use jsdsp'
        const Loudness = loudness * triggerLoudness
        const modOscWithIndex = modOsc * slidingFreq * index * Loudness
        const modOscWithEnv   = modOscWithIndex * env
        
        const modOscWithEnvAvg =  .5 * ( modOscWithEnv + feedbackssd.out )

        feedbackssd.in( modOscWithEnvAvg )

        const carrierOsc = Gibberish.oscillators.factory( syn.carrierWaveform, g.add( slidingFreq, modOscWithEnvAvg ), syn.antialias )

        // XXX horrible hack below to "use" saturation even when not using a diode filter 
        const carrierOscWithEnv = props.filterModel === 2 ? carrierOsc * env : g.mul(carrierOsc, g.mul(env,saturation) )

        const baseCutoffFreq = g.in( 'cutoff' ) * ( frequency /  ( g.gen.samplerate / 16 ) ) 
        const cutoff = g.min( baseCutoffFreq * g.pow( 2, g.in('filterMult') * Loudness ) * env, .995 ) 
        const filteredOsc = Gibberish.filters.factory( carrierOscWithEnv, cutoff, saturation, syn )
        const synthWithGain = filteredOsc * g.in( 'gain' ) * Loudness
        
        let panner
        if( props.panVoices === true ) { 
          panner = g.pan( synthWithGain, synthWithGain, g.in( 'pan' ) ) 
          syn.graph = [panner.left, panner.right ]
          syn.isStereo = true
        }else{
          syn.graph = synthWithGain
          syn.isStereo = false
        }
      }

      syn.env = env

      return env
    }
    
    syn.__requiresRecompilation = [ 'carrierWaveform', 'modulatorWaveform', 'antialias', 'filterModel', 'filterMode' ]
    const env = syn.__createGraph()

    const out = Gibberish.factory( syn, syn.graph , ['instruments','FM'], props )

    out.env.advance = out.advance 
    return out
  }

  FM.defaults = {
    carrierWaveform:'sine',
    modulatorWaveform:'sine',
    attack: 44,
    feedback: 0,
    decay: 22050,
    sustain:44100,
    sustainLevel:.6,
    release:22050,
    useADSR:false,
    shape:'linear',
    triggerRelease:false,
    gain: .25,
    cmRatio:2,
    index:5,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    antialias:false,
    panVoices:false,
    glide:1,
    saturation:1,
    filterMult:1.5,
    Q:.25,
    cutoff:.35,
    filterModel:0,
    filterMode:0,
    loudness: 1,
    __triggerLoudness:1

  }

  const PolyFM = Gibberish.PolyTemplate( FM, ['glide','frequency','attack','decay','pulsewidth','pan','gain','cmRatio','index', 'saturation', 'filterMult', 'Q', 'cutoff', 'antialias', 'filterModel', 'carrierWaveform', 'modulatorWaveform','filterMode', 'feedback', 'useADSR', 'sustain', 'release', 'sustainLevel', '__triggerLoudness','loudness' ] ) 
  PolyFM.defaults = FM.defaults

  return [ FM, PolyFM ]

}

},{"./instrument.js":181,"genish.js":51}],180:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let Hat = argumentProps => {
    let hat = Object.create( instrument ),
        tune  = g.in( 'tune' ),
        scaledTune = g.memo( g.add( .4, tune ) ),
        decay  = g.in( 'decay' ),
        gain  = g.in( 'gain' ),
        loudness = g.in( 'loudness' ),
        triggerLoudness = g.in( '__triggerLoudness' )

    let props = Object.assign( {}, Hat.defaults, argumentProps )

    let baseFreq = g.mul( 325, scaledTune ), // range of 162.5 - 487.5
        bpfCutoff = g.mul( g.param( 'bpfc', 7000 ), scaledTune ),
        hpfCutoff = g.mul( g.param( 'hpfc', 11000 ), scaledTune ),  
        s1 = Gibberish.oscillators.factory( 'square', baseFreq, false ),
        s2 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.4471 ) ),
        s3 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.6170 ) ),
        s4 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.9265 ) ),
        s5 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,2.5028 ) ),
        s6 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,2.6637 ) ),
        sum = g.add( s1,s2,s3,s4,s5,s6 ),
        eg = g.decay( g.mul( decay, g.gen.samplerate * 2 ), { initValue:0 }), 
        bpf = g.svf( sum, bpfCutoff, .5, 2, false ),
        envBpf = g.mul( bpf, eg ),
        hpf = g.filter24( envBpf, 0, hpfCutoff, 0 ),
        out = g.mul( hpf, g.mul( gain, g.mul( loudness, triggerLoudness ) ) )

    hat.env = eg 
    hat.isStereo = false

    const __hat = Gibberish.factory( hat, out, ['instruments','hat'], props  )
    

    return __hat
  }
  
  Hat.defaults = {
    gain:  .5,
    tune: .6,
    decay:.1,
    loudness:1,
    __triggerLoudness:1
  }

  return Hat

}

},{"./instrument.js":181,"genish.js":51}],181:[function(require,module,exports){
const ugen = require('../ugen.js')();

const instrument = Object.create(ugen);

Object.assign(instrument, {
  type: 'instrument',

  note(freq, loudness = null) {
    // if binop is should be used...
    if (isNaN(this.frequency)) {
      // and if we are assigning binop for the first time...
      let obj = Gibberish.processor.ugens.get(this.frequency.id);
      if (obj === undefined) {
        throw Error(`Incorrect note ${this.frequency} assigned to ${this.ugenName}; this value will be ignored.`);
        return;
      }
      if (obj.isop !== true) {
        obj.inputs[0] = freq;
      } else {
        obj.inputs[1] = freq;
        Gibberish.dirty(this);
      }
      this.frequency = obj;
    } else {
      this.frequency = freq;
    }

    if (loudness !== null) {
      this.__triggerLoudness = loudness;
    }

    this.env.trigger();
  },

  trigger(loudness = 1) {
    if (isNaN(loudness)) {
      throw Error(`A non-number was passed to trigger() on ${this.ugenName}; this value will be ignored and the envelope will not be triggered.`);
    } else {
      this.__triggerLoudness = loudness;
      this.env.trigger();
    }
  }

});

module.exports = instrument

},{"../ugen.js":210}],182:[function(require,module,exports){
module.exports = function( Gibberish ) {

const instruments = {
  Kick        : require( './kick.js' )( Gibberish ),
  Clave       : require( './conga.js' )( Gibberish )[0], // clave is same as conga with different defaults, see below
  Hat         : require( './hat.js' )( Gibberish ),
  Snare       : require( './snare.js' )( Gibberish ),
  Cowbell     : require( './cowbell.js' )( Gibberish ),
  Tom         : require( './tom.js' )( Gibberish ),
  Clap        : require( './clap.dsp.js' )( Gibberish ),
  Multisampler: require( './multisampler.dsp.js' )( Gibberish ),
  Soundfont   : require( './soundfont.js' )( Gibberish )
}

instruments.Clave.defaults.frequency = 2500
instruments.Clave.defaults.decay = .5;

[ instruments.Synth, instruments.PolySynth ]     = require( './synth.dsp.js' )( Gibberish );
[ instruments.Complex, instruments.PolyComplex]  = require( './complex.dsp.js' )( Gibberish );
[ instruments.Monosynth, instruments.PolyMono ]  = require( './monosynth.dsp.js' )( Gibberish );
[ instruments.FM, instruments.PolyFM ]           = require( './fm.dsp.js' )( Gibberish );
[ instruments.Sampler, instruments.PolySampler ] = require( './sampler.js' )( Gibberish );
[ instruments.Karplus, instruments.PolyKarplus ] = require( './karplusstrong.js' )( Gibberish );
[ instruments.Conga, instruments.PolyConga ]     = require( './conga.js' )( Gibberish )

instruments.export = target => {
  for( let key in instruments ) {
    if( key !== 'export' ) {
      target[ key ] = instruments[ key ]
    }
  }
}

return instruments

}

},{"./clap.dsp.js":175,"./complex.dsp.js":176,"./conga.js":177,"./cowbell.js":178,"./fm.dsp.js":179,"./hat.js":180,"./karplusstrong.js":183,"./kick.js":184,"./monosynth.dsp.js":185,"./multisampler.dsp.js":186,"./sampler.js":189,"./snare.js":190,"./soundfont.js":191,"./synth.dsp.js":192,"./tom.js":193}],183:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Karplus = inputProps => {

    const props = Object.assign( {}, Karplus.defaults, inputProps )
    let syn = Object.create( instrument )
    
    let sampleRate = Gibberish.ctx.sampleRate 

    const trigger = g.bang(),
          // high initialValue stops triggering on initialization
          phase = g.accum( 1, trigger, { shouldWrapMax:false, initialValue:1000000 } ),
          env = g.gtp( g.sub( 1, g.div( phase, 200 ) ), 0 ),
          impulse = g.mul( g.noise(), env ),
          feedback = g.history(),
          frequency = g.in('frequency'),
          glide = g.max( 1, g.in( 'glide' ) ),
          slidingFrequency = g.slide( frequency, glide, glide ),
          delay = g.delay( g.add( impulse, feedback.out ), g.div( sampleRate, slidingFrequency )),
          decayed = g.mul( delay, g.t60( g.mul( g.in('decay'), slidingFrequency ) ) ),
          damped =  g.mix( decayed, feedback.out, g.in('damping') ),
          n = g.noise(),
          blendValue = g.switch( g.gt( n, g.in('blend') ), -1, 1 ), 
          withGain = g.mul( g.mul( blendValue, damped ), g.mul( g.mul( g.in('loudness'), g.in('__triggerLoudness') ), g .in('gain') ) )

    feedback.in( damped )

    const properties = Object.assign( {}, Karplus.defaults, props )

    Object.assign( syn, {
      properties : props,

      env : trigger,
      phase,

      getPhase() {
        return Gibberish.memory.heap[ phase.memory.value.idx ]
      },
    })

    if( properties.panVoices ) {  
      const panner = g.pan( withGain, withGain, g.in( 'pan' ) )
      syn = Gibberish.factory( syn, [panner.left, panner.right], ['instruments','karplus'], props  )
      syn.isStereo = true
    }else{
      syn = Gibberish.factory( syn, withGain, ['instruments','karplus'], props )
      syn.isStereo = false 
    }

    return syn
  }
  
  Karplus.defaults = {
    decay: .97,
    damping:.2,
    gain: .15,
    frequency:220,
    pan: .5,
    glide:1,
    panVoices:false,
    loudness:1,
    __triggerLoudness:1,
    blend:1
  }

  let envCheckFactory = ( syn,synth ) => {
    let envCheck = ()=> {
      let phase = syn.getPhase(),
          endTime = synth.decay * sampleRate

      if( phase > endTime ) {
        synth.disconnectUgen( syn )
        syn.isConnected = false
        Gibberish.memory.heap[ syn.phase.memory.value.idx ] = 0 // trigger doesn't seem to reset for some reason
      }else{
        Gibberish.blockCallbacks.push( envCheck )
      }
    }
    return envCheck
  }

  const PolyKarplus = Gibberish.PolyTemplate( Karplus, ['frequency','decay','damping','pan','gain', 'glide','loudness', '__triggerLoudness'], envCheckFactory ) 
  PolyKarplus.defaults = Karplus.defaults

  return [ Karplus, PolyKarplus ]

}

},{"./instrument.js":181,"genish.js":51}],184:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Kick = inputProps => {
    // establish prototype chain
    const kick = Object.create( instrument )

    // define inputs
    const frequency = g.in( 'frequency' ),
          decay = g.in( 'decay' ),
          tone  = g.in( 'tone' ),
          gain  = g.in( 'gain' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          Loudness = g.mul( loudness, triggerLoudness )
    
    // create initial property set
    const props = Object.assign( {}, Kick.defaults, inputProps )
    Object.assign( kick, props )

    // create DSP graph
    const trigger = g.bang(),
          impulse = g.mul( trigger, 60 ),
          scaledDecay = g.sub( 1.005, decay ), // -> range { .005, 1.005 }
          scaledTone = g.add( 50, g.mul( tone, g.mul(4000, Loudness ) ) ), // -> range { 50, 4050 }
          bpf = g.svf( impulse, frequency, scaledDecay, 2, false ),
          lpf = g.svf( bpf, scaledTone, .5, 0, false ),
          graph = g.mul( lpf, g.mul( gain, Loudness ) )
    
    kick.env = trigger
    const out = Gibberish.factory( kick, graph, ['instruments','kick'], props  )

    return out
  }
  
  Kick.defaults = {
    gain: 1,
    frequency:85,
    tone: .25,
    decay:.9,
    loudness:1,
    __triggerLoudness:1
  }

  return Kick

}

},{"./instrument.js":181,"genish.js":51}],185:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' ),
      feedbackOsc = require( '../oscillators/fmfeedbackosc.js' )

module.exports = function( Gibberish ) {

  const Mono = argumentProps => {
    const syn = Object.create( instrument ),
          oscs = [], 
          frequency = g.in( 'frequency' ),
          glide = g.max( 1, g.in( 'glide' ) ),
          slidingFreq = g.memo( g.slide( frequency, glide, glide ) ),
          attack = g.in( 'attack' ), decay = g.in( 'decay' ),
          sustain = g.in( 'sustain' ), sustainLevel = g.in( 'sustainLevel' ),
          release = g.in( 'release' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          Loudness = g.mul( loudness, triggerLoudness ),
          saturation = g.in( 'saturation' )

    const props = Object.assign( {}, Mono.defaults, argumentProps )
    Object.assign( syn, props )

    syn.__createGraph = function() {
      const env = Gibberish.envelopes.factory( 
        props.useADSR, 
        props.shape, 
        attack, decay, 
        sustain, sustainLevel, 
        release, 
        props.triggerRelease
      )

      for( let i = 0; i < 3; i++ ) {
        let osc, freq

        switch( i ) {
          case 1:
            freq = g.add( slidingFreq, g.mul( slidingFreq, g.in('detune2') ) )
            break;
          case 2:
            freq = g.add( slidingFreq, g.mul( slidingFreq, g.in('detune3') ) )
            break;
          default:
            freq = slidingFreq
        }

        osc = Gibberish.oscillators.factory( syn.waveform, freq, syn.antialias )
        
        oscs[ i ] = osc
      }


      //const baseCutoffFreq = g.in('cutoff') * (frequency /  (g.gen.samplerate / 16 ))
      //const cutoff = baseCutoffFreq * g.pow( 2, g.in('filterMult') * loudness ) * env 
      const oscSum = g.add( ...oscs ),
            // XXX horrible hack below to "use" saturation even when not using a diode filter 
            oscWithEnv = props.filterModel=== 2 ? g.mul( oscSum, env ) : g.sub( g.add( g.mul( oscSum, env), saturation ), saturation ),
            baseCutoffFreq = g.mul( g.in('cutoff'), g.div( frequency, g.gen.samplerate / 16 ) ),
            cutoff = g.mul( g.mul( baseCutoffFreq, g.pow( 2, g.mul( g.in('filterMult'), Loudness ) )), env ),
            filteredOsc = Gibberish.filters.factory( oscWithEnv, cutoff, g.in('saturation'), syn )
        
      if( props.panVoices ) {  
        const panner = g.pan( filteredOsc,filteredOsc, g.in( 'pan' ) )
        syn.graph = [ g.mul( panner.left, g.in('gain'), Loudness ), g.mul( panner.right, g.in('gain'), Loudness ) ]
        syn.isStereo = true
      }else{
        syn.graph = g.mul( filteredOsc, g.in('gain'), Loudness )
        syn.isStereo = false
      }

      syn.env = env
    }

    syn.__requiresRecompilation = [ 'waveform', 'antialias', 'filterModel', 'filterMode' ]
    syn.__createGraph()

    const out = Gibberish.factory( syn, syn.graph, ['instruments','Monosynth'], props )

    return out
  } 
  
  Mono.defaults = {
    waveform: 'saw',
    attack: 44,
    decay: 22050,
    sustain:44100,
    sustainLevel:.6,
    release:22050,
    useADSR:false,
    shape:'linear',
    triggerRelease:false,
    gain: .25,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    detune2:.005,
    detune3:-.005,
    cutoff: .5,
    Q: .25,
    panVoices:false,
    glide: 1,
    antialias:false,
    //filterType: 1,
    filterModel: 1,
    filterMode: 0, // 0 = LP, 1 = HP, 2 = BP, 3 = Notch
    saturation:.5,
    filterMult: 2,
    loudness:1,
    __triggerLoudness:1
  }

  let PolyMono = Gibberish.PolyTemplate( Mono, 
    [ 'frequency','attack','decay','cutoff','Q',
      'detune2','detune3','pulsewidth','pan','gain', 
      'glide', 'saturation', 'filterMult',  'antialias', 
      'filterModel', 'waveform', 'filterMode', 'loudness', '__triggerLoudness' ]
  ) 
  PolyMono.defaults = Mono.defaults

  return [ Mono, PolyMono ]
}

},{"../oscillators/fmfeedbackosc.js":201,"./instrument.js":181,"genish.js":51}],186:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

const genish = g

module.exports = function( Gibberish ) {
  const proto = Object.create( instrument )
  const memo = {}
  
  Object.assign( proto, {
    pickFile( sample ) {
      this.currentSample = sample
    },
    pick( __idx ) {
      const idx = Math.floor( __idx )
      const keys = Object.keys( this.samplers )
      const key = keys[ idx ]
      this.currentSample = key
    },
    pickplay( __idx ) {
      const idx = Math.floor( __idx )
      const keys = Object.keys( this.samplers )
      const key = keys[ idx ]
      this.currentSample = key
      return this.trigger()
    },
    note( rate ) {
      //this.rate = rate
      return this.trigger( null, rate )
    },
    setpan( num=0, value=.5 ) {
      if( Gibberish.mode === 'processor' ) {
        const voice = this.voices[ num ]
        // set voice buffer length
        //g.gen.memory.heap.set( [ value ], voice.pan.memory.values.idx )
        voice.pan = value
      }
    },
    setrate( num=0, value=1 ) {
      if( Gibberish.mode === 'processor' ) {
        const voice = this.voices[ num ]
        // set voice buffer length
        //g.gen.memory.heap.set( [ value ], voice.rate.memory.values.idx )
        voice.rate = value
      }
    },
    trigger( volume=null, rate=null ) {
      'no jsdsp'
      if( volume !== null ) this.__triggerLoudness = volume

      let voice = null
      if( Gibberish.mode === 'processor' ) {
        const sampler = this.samplers[ this.currentSample ]

        // if sample isn't loaded...
        if( sampler === undefined ) return

        voice = this.__getVoice__()

        // set voice buffer length
        g.gen.memory.heap[ voice.bufferLength.memory.values.idx ] = sampler.dataLength

        // set voice data index
        g.gen.memory.heap[ voice.bufferLoc.memory.values.idx ] = sampler.dataIdx

        //if( rate !== null ) g.gen.memory.heap[ voice.rate.memory.values.idx ] = rate
        if( rate !== null ) voice.rate = rate
        if( rate > 0 ) {
          voice.trigger()
        }else{
          //console.log( 'reverse?', rate )
          voice.bang.trigger()
          //voice.phase.value = 0
          voice.phase.value = sampler.dataLength - 1
          //console.log( 'phase', voice.phase.value )
        }
        //if( rate < 0 ) {
        //  const phase = sampler.dataIdx + Math.round((sampler.dataLength/2)) - 1
        //  console.log( 'phase:', phase, 'length:', sampler.dataLength, 'start:', sampler.dataIdx )
        //  //voice.phase.value = phase
        //  //g.gen.memory.heap[ voice.phase.memory.value.idx ] = phase
        //}else{
        //  // will reset phase to 0
        //  voice.trigger()
        //}
        
        //voice.trigger()
        //g.gen.memory.heap[ voice.rate.memory.values.idx ] = rate
      }

      return voice
    },
    __getVoice__() {
      return this.voices[ this.voiceCount++ % this.voices.length ]
    },
  })

  const Sampler = inputProps => {
    const syn = Object.create( proto )

    const props = Object.assign( { onload:null, voiceCount:0, files:[] }, Sampler.defaults, inputProps )

    syn.isStereo = props.isStereo !== undefined ? props.isStereo : false

    const start = g.in( 'start' ), end = g.in( 'end' ), 
          rate = g.in( 'rate' ), shouldLoop = g.in( 'loops' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          // rate storage is used to determine whether we're playing
          // the sample forward or in reverse, for use in the 'trigger' method.
          rateStorage = g.data([0], 1, { meta:true })

    Object.assign( syn, props )

    if( Gibberish.mode === 'worklet' ) {
      syn.__meta__ = {
        address:'add',
        name: ['instruments', 'Multisampler'],
        properties: JSON.stringify(props), 
        id: syn.id
      }

      Gibberish.worklet.ugens.set( syn.id, syn )

      Gibberish.worklet.port.postMessage( syn.__meta__ )
    }

    const voices = []
    for( let i = 0; i < syn.maxVoices; i++ ) {
      'use jsdsp'

      const voice = {
        bufferLength: g.data( [1], 1, { meta:true }),
        bufferLoc:    g.data( [1], 1, { meta:true }),
        bang: g.bang(),
        // XXX how do I change this from main thread?
        __pan: g.data( [.5], 1, { meta:true }),
        __rate: g.data( [1], 1, { meta:true }),
        __shouldLoop: g.data( [1], 1, { meta:true }),
        __loudness:  g.data( [1], 1, { meta:true }),
        get loudness() { 
          return g.gen.memory.heap[ this.__loudness.memory.values.idx   ]
        },
        set loudness( v ) {
          g.gen.memory.heap[ this.__loudness.memory.values.idx ] = v
        },
        set pan(v) {
          g.gen.memory.heap[ this.__pan.memory.values.idx ] = v
        },
        set rate(v) {
          g.gen.memory.heap[ this.__rate.memory.values.idx ] = v
        },
      }

      voice.phase = g.counter( 
        rate * voice.__rate[0], 
        start * voice.bufferLength[0],
        end * voice.bufferLength[0], 
        voice.bang,
        shouldLoop, 
        { shouldWrap:false, initialValue:9999999 }
      )

      voice.trigger = voice.bang.trigger

      voice.graph = g.ifelse(
        // if phase is greater than start and less than end... 
        g.and( 
          g.gte( voice.phase, start * voice.bufferLength[0] ), 
          g.lt(  voice.phase, end   * voice.bufferLength[0] ) 
        ),
        // ...read data
        voice.peek = g.peekDyn( 
          voice.bufferLoc[0], 
          voice.bufferLength[0],
          voice.phase,
          { mode:'samples' }
        ),
        // ...else return 0
        0
      ) 
      * loudness 
      * voice.__loudness[0] 

      const pan = g.pan( voice.graph, voice.graph, voice.__pan[0] )
      voice.graph = [ pan.left, pan.right ]

      voices.push( voice )
    }

    // load in sample data
    const samplers = {}

    // bound to individual sampler objects in loadSample function
    syn.loadBuffer = function( buffer, onload ) {
      // main thread: when sample is loaded, copy it over message port
      // processor thread: onload is called via messageport handler, and
      // passed in the new buffer to be copied.
      if( Gibberish.mode === 'worklet' ) {
        const memIdx = Gibberish.memory.alloc( this.data.buffer.length, true )

        Gibberish.worklet.port.postMessage({
          address:'copy_multi',
          id:     syn.id,
          buffer: this.data.buffer,
          filename: this.filename
        })

        if( typeof onload === 'function' ) onload( this, buffer )

      }else if( Gibberish.mode === 'processor' ) {
        this.data.buffer = buffer 

        // set data memory spec before issuing memory request
        this.dataLength = this.data.memory.values.length = this.data.dim = this.data.buffer.length

        // request memory to copy the bufer over
        g.gen.requestMemory( this.data.memory, false )
        g.gen.memory.heap.set( this.data.buffer, this.data.memory.values.idx )

        // set location of buffer (does not work)
        this.dataIdx = this.data.memory.values.idx

        syn.currentSample = this.filename
      }
    }

    syn.loadSample = function( filename, __onload, buffer=null ) {
      'use jsdsp'

      const sampler = samplers[ filename ] = {
        dataLength: null,
        dataIdx: null,
        buffer: null,
        filename
      }

      const onload = syn.loadBuffer.bind( sampler ) 
      // passing a filename to data will cause it to be loaded in the main thread
      // onload will then be called to pass the buffer over the messageport. In the
      // processor thread, make a placeholder until data is available.
      if( Gibberish.mode === 'worklet' ) {
        sampler.data = g.data( buffer !== null ? buffer : filename, 1, { onload })

        // check to see if a promise is returned; a valid
        // data object is only return if the file has been
        // previously loaded and the corresponding buffer has
        // been cached.
        if( sampler.data instanceof Promise ) {
          sampler.data.then( d => {
            sampler.data = d
            memo[ filename ] = sampler.data 
            onload( sampler, __onload )
          })
        }else{
          // using a cached data buffer, no need
          // for asynchronous loading.
          memo[ filename ] = sampler
          onload( sampler, __onload )
        }     
      }else{
        sampler.data = g.data( new Float32Array(), 1, { onload, filename })
        sampler.data.onload = onload
      } 
    }

    props.files.forEach( filename => syn.loadSample( filename ) )

    syn.__createGraph = function() {
      'use jsdsp'
      
      const graphs = voices.map( voice => voice.graph )
      const left = g.add( ...voices.map( voice => voice.graph[0] ) )
      const right = g.add( ...voices.map( voice => voice.graph[1] ) )
      const gain = g.in( 'gain' )
      syn.graph = [ left * gain, right * gain ]

      if( syn.panVoices === true ) { 
        const panner = g.pan( syn.graph[0], syn.graph[1], g.in( 'pan' ) ) 
        syn.graph = [ panner.left, panner.right ]
      }
    }

    syn.__createGraph()

    const out = Gibberish.factory( 
      syn,
      syn.graph,
      ['instruments','multisampler'], 
      props 
    ) 

    Gibberish.preventProxy = true
    Gibberish.proxyEnabled = false

    out.voices = voices
    out.samplers = samplers

    Gibberish.proxyEnabled = true
    Gibberish.preventProxy = false

    return out
  }

  Sampler.defaults = {
    gain: 1,
    pan: .5,
    rate: 1,
    panVoices:false,
    shouldLoop:false,
    loops: 0,
    start:0,
    end:1,
    bufferLength:-999999999,
    loudness:1,
    maxVoices:5, 
    __triggerLoudness:1
  }

  return Sampler
}

},{"./instrument.js":181,"genish.js":51}],187:[function(require,module,exports){
// XXX TOO MANY GLOBAL GIBBERISH VALUES

const Gibberish = require( '../index.js' )

module.exports = {
  note( freq ) {
    // will be sent to processor node via proxy method...
    if( Gibberish.mode !== 'worklet' ) {
      let voice = this.__getVoice__()
      //Object.assign( voice, this.properties )
      //if( gain === undefined ) gain = this.gain
      //voice.gain = gain
      voice.__triggerLoudness = this.__triggerLoudness
      voice.note( freq, this.__triggerLoudness )
      this.__runVoice__( voice, this )
      this.triggerNote = freq
    }
  },

  // XXX this is not particularly satisfying...
  // must check for both notes and chords
  trigger( loudness ) {
    if( this.triggerChord !== null ) {
      this.triggerChord.forEach( v => {
        let voice = this.__getVoice__()
        Object.assign( voice, this.properties )
        voice.note( v, loudness )
        this.__runVoice__( voice, this )
      })
    }else if( this.triggerNote !== null ) {
      let voice = this.__getVoice__()
      Object.assign( voice, this.properties )
      voice.note( this.triggerNote, loudness )
      this.__runVoice__( voice, this )
    }else{
      let voice = this.__getVoice__()
      Object.assign( voice, this.properties )
      voice.trigger( loudness )
      this.__runVoice__( voice, this )
    }
  },

  __runVoice__( voice, _poly ) {
    if( !voice.isConnected ) {
      voice.connect( _poly )
      voice.isConnected = true
    }

    //let envCheck
    //if( _poly.envCheck === undefined ) {
    //  envCheck = function() {
    //    if( voice.env.isComplete() ) {
    //      _poly.disconnectUgen( voice )
    //      voice.isConnected = false
    //    }else{
    //      Gibberish.blockCallbacks.push( envCheck )
    //    }
    //  }
    //}else{
    //  envCheck = _poly.envCheck( voice, _poly )
    //}

    // XXX uncomment this line to turn on dynamically connecting
    // disconnecting individual voices from graph
    //Gibberish.blockCallbacks.push( envCheck )
  },

  __getVoice__() {
    return this.voices[ this.voiceCount++ % this.voices.length ]
  },

  chord( frequencies ) {
    // will be sent to processor node via proxy method...
    if( Gibberish !== undefined && Gibberish.mode !== 'worklet' ) {
      frequencies.forEach( v => this.note( v ) )
      this.triggerChord = frequencies
    }
  },

  free() {
    for( let child of this.voices ) child.free()
  },

  triggerChord:null,
  triggerNote:null
}

},{"../index.js":174}],188:[function(require,module,exports){
/*
 * This files creates a factory generating polysynth constructors.
 */

const g = require( 'genish.js' )
const __proxy = require( '../workletProxy.js' )

module.exports = function( Gibberish ) {
  const proxy = __proxy( Gibberish )

  const TemplateFactory = ( ugen, propertyList, _envCheck ) => {

    const Template = props => {
      const properties = Object.assign( {}, { isStereo:true, maxVoices:4 }, props )

      //const synth = properties.isStereo === true ? Object.create( stereoProto ) : Object.create( monoProto )
      const synth = properties.isStereo === true ? Gibberish.Bus2({ __useProxy__:false }) : Gibberish.Bus({ __useProxy__:false }) 

      Object.assign( 
        synth, 

        {
          maxVoices: properties.maxVoices, 
          voiceCount: 0,
          envCheck: _envCheck,
          dirty: true,
          ugenName: 'poly' + ugen.name + '_' + synth.id + '_' + ( properties.isStereo ? 2 : 1 ),
          properties
        },

        Gibberish.mixins.polyinstrument
      )

      properties.panVoices = true//false//properties.isStereo
      synth.callback.ugenName = synth.ugenName

      const storedId = properties.id
      if( properties.id !== undefined ) delete properties.id 

      const voices = []
      for( let i = 0; i < synth.maxVoices; i++ ) {
        properties.id = synth.id +'_'+i
        voices[i] = ugen( properties )
        if( Gibberish.mode === 'processor' )
          voices[i].callback.ugenName = voices[i].ugenName

        voices[i].isConnected = false
        //synth.__voices[i] = proxy( ['instruments', ugen.name], properties, synth.voices[i] )
      }

      let _propertyList 
      if( properties.isStereo === false ) {
        _propertyList = propertyList.slice( 0 )
        const idx =  _propertyList.indexOf( 'pan' )
        if( idx  > -1 ) _propertyList.splice( idx, 1 )
      }

      properties.id = storedId

      TemplateFactory.setupProperties( synth, ugen, properties.isStereo ? propertyList : _propertyList )
      
      const p = proxy( ['instruments', 'Poly'+ugen.name], properties, synth ) 

      // proxy workaround nightmare... if we include the voices when we create
      // the proxy, they wind up being strangely unaddressable. perhaps they
      // are being overwritting in the Processor.ugens map object?
      // manually adding each one seems to work around the problem
      if( Gibberish.mode === 'worklet' ) {
        p.voices = []
        let count = 0
        for( let v of voices ) {
          Gibberish.worklet.port.postMessage({
            address: 'addObjectToProperty',
            object: synth.id,
            name:'voices',
            key:count,
            value:v.id
          })

          p.voices[ count ] = v
          count++
        }
      }

      return p 
    }

    return Template
  }

  TemplateFactory.setupProperties = function( synth, ugen, props ) {
    for( let property of props ) {
      if( property === 'pan' || property === 'id' ) continue
      Object.defineProperty( synth, property, {
        configurable:true,
        get() {
          return synth.properties[ property ] || ugen.defaults[ property ]
        },
        set( v ) {
          synth.properties[ property ] = v
          for( let child of synth.voices ) {
            child[ property ] = v
          }
        }
      })
    }
  }

  return TemplateFactory

}

},{"../workletProxy.js":212,"genish.js":51}],189:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {
  const proto = Object.create( instrument )
  const memo = {}

  Object.assign( proto, {
    note( rate ) {
      this.rate = rate
      if( rate > 0 ) {
        this.__trigger()
      }else{
        this.__phase__.value = this.end * (this.data.buffer.length - 1)
      }
    },
    trigger( volume ) {
      if( volume !== undefined ) this.gain = volume

      if( Gibberish.mode === 'processor' ) {
        // if we're playing the sample forwards...
        if( Gibberish.memory.heap[ this.__rateStorage__.memory.values.idx ] > 0 ) {
          this.__trigger()
        }else{
          this.__phase__.value = this.end * (this.data.buffer.length - 1)
        }
      }
    },
  })

  const Sampler = inputProps => {
    const syn = Object.create( proto )

    const props = Object.assign( { onload:null }, Sampler.defaults, inputProps )

    syn.isStereo = props.isStereo !== undefined ? props.isStereo : false

    const start = g.in( 'start' ), end = g.in( 'end' ), 
          bufferLength = g.in( 'bufferLength' ), 
          rate = g.in( 'rate' ), shouldLoop = g.in( 'loops' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          // rate storage is used to determine whether we're playing
          // the sample forward or in reverse, for use in the 'trigger' method.
          rateStorage = g.data([0], 1, { meta:true })

    Object.assign( syn, props )

    if( Gibberish.mode === 'worklet' ) {
      syn.__meta__ = {
        address:'add',
        name: ['instruments', 'Sampler'],
        properties: JSON.stringify(props), 
        id: syn.id
      }

      Gibberish.worklet.ugens.set( syn.id, syn )

      Gibberish.worklet.port.postMessage( syn.__meta__ )
    }

    syn.__createGraph = function() {
      syn.__bang__ = g.bang()
      syn.__trigger = syn.__bang__.trigger

      syn.__phase__ = g.counter( 
        rate, 
        g.mul(start,bufferLength), 
        g.mul( end, bufferLength ), 
        syn.__bang__, 
        shouldLoop, 
        { shouldWrap:false, initialValue:9999999 }
      )
      
      syn.__rateStorage__ = rateStorage
      rateStorage[0] = rate

      // XXX we added our recorded 'rate' param and then effectively subtract it,
      // so that its presence in the graph will force genish to actually record the 
      // rate as the input. this is extremely hacky... there should be a way to record
      // value without having to include it in the graph!
      syn.graph = g.add( g.mul( 
        g.ifelse( 
          g.and( g.gte( syn.__phase__, g.mul(start,bufferLength) ), g.lt( syn.__phase__, g.mul(end,bufferLength) ) ),
          g.peek( 
            syn.data, 
            syn.__phase__,
            { mode:'samples' }
          ),
          0
        ), 
        g.mul( g.mul( loudness, triggerLoudness ), g.in('gain') )
      ), rateStorage[0], g.mul( rateStorage[0], -1 ) )
      
      if( syn.panVoices === true ) { 
        const panner = g.pan( syn.graph, syn.graph, g.in( 'pan' ) ) 
        syn.graph = [ panner.left, panner.right ]
      }
    }

    const onload = (buffer,filename) => {
      if( buffer === undefined ) return
      if( Gibberish.mode === 'worklet' ) {
        //const memIdx = memo[ filename ].idx !== undefined ? memo[ filename ].idx : Gibberish.memory.alloc( syn.data.memory.values.length, true )

        const memIdx = Gibberish.memory.alloc( buffer.length, true )
        //memo[ filename ].idx = memIdx

        Gibberish.worklet.port.postMessage({
          address:'copy',
          id:     syn.id,
          idx:    memIdx,
          buffer
        })

      }else if ( Gibberish.mode === 'processor' ) {
        syn.data.buffer = buffer
        syn.data.memory.values.length = syn.data.dim = buffer.length
        syn.__redoGraph() 
      }

      if( typeof syn.onload === 'function' ){  
        syn.onload( buffer || syn.data.buffer )
      }
      if( syn.bufferLength === -999999999 && syn.data.buffer !== undefined ) syn.bufferLength = syn.data.buffer.length - 1
    }

    //if( props.filename ) {
    syn.loadFile = function( filename ) {
      //if( memo[ filename ] === undefined ) {
        if( Gibberish.mode !== 'processor' ) {
          syn.data = g.data( filename, 1, { onload })


          // check to see if a promise is returned; a valid
          // data object is only return if the file has been
          // previously loaded and the corresponding buffer has
          // been cached.
          if( syn.data instanceof Promise ) {
            syn.data.then( d => {
              syn.data = d
              memo[ filename ] = syn.data
              onload( d.buffer, filename )
            })
          }else{
            // using a cached data buffer, no need
            // for asynchronous loading.
            memo[ filename ] = syn.data
            onload( syn.data.buffer, filename )
          }     
        }else{
          syn.data = g.data( new Float32Array(), 1, { onload, filename })
          //memo[ filename ] = syn.data
        }
      //}else{
      //  syn.data = memo[ filename ]
      //  console.log( 'memo data:', syn.data )
      //  onload( syn.data.buffer, filename )
      //}
    }

    syn.loadBuffer = function( buffer ) {
      if( Gibberish.mode === 'processor' ) {
        syn.data.buffer = buffer
        syn.data.memory.values.length = syn.data.dim = buffer.length
        syn.__redoGraph() 
      }
    }

    if( props.filename !== undefined ) {
      syn.loadFile( props.filename )
    }else{
      syn.data = g.data( new Float32Array() )
    }

    if( syn.data !== undefined ) {
      syn.data.onload = onload

      syn.__createGraph()
    }

    const out = Gibberish.factory( 
      syn,
      syn.graph,
      ['instruments','sampler'], 
      props 
    ) 

    return out
  }

  Sampler.defaults = {
    gain: 1,
    pan: .5,
    rate: 1,
    panVoices:false,
    loops: 0,
    start:0,
    end:1,
    bufferLength:-999999999,
    loudness:1,
    __triggerLoudness:1
  }

  const envCheckFactory = function( voice, _poly ) {
    const envCheck = () => {
      const phase = Gibberish.memory.heap[ voice.__phase__.memory.value.idx ]
      if( ( voice.rate > 0 && phase > voice.end ) || ( voice.rate < 0 && phase < 0 ) ) {
        _poly.disconnectUgen.call( _poly, voice )
        voice.isConnected = false
      }else{
        Gibberish.blockCallbacks.push( envCheck )
      }
    }

    return envCheck
  }

  const PolySampler = Gibberish.PolyTemplate( Sampler, ['rate','pan','gain','start','end','loops','bufferLength','__triggerLoudness','loudness'], envCheckFactory ) 

  return [ Sampler, PolySampler ]
}


},{"./instrument.js":181,"genish.js":51}],190:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )
  
module.exports = function( Gibberish ) {

  const Snare = argumentProps => {
    const snare = Object.create( instrument ),
          decay = g.in( 'decay' ),
          scaledDecay = g.mul( decay, g.gen.samplerate * 2 ),
          snappy= g.in( 'snappy' ),
          tune  = g.in( 'tune' ),
          gain  = g.in( 'gain' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in('__triggerLoudness'),
          Loudness = g.mul( loudness, triggerLoudness ),
          eg = g.decay( scaledDecay, { initValue:0 } ), 
          check = g.memo( g.gt( eg, .0005 ) ),
          rnd = g.mul( g.noise(), eg ),
          hpf = g.svf( rnd, g.add( 1000, g.mul( g.add( 1, tune), 1000 ) ), .5, 1, false ),
          snap = g.mul( g.gtp( g.mul( hpf, snappy ), 0 ), Loudness ), // rectify
          bpf1 = g.svf( eg, g.mul( 180, g.add( tune, 1 ) ), .05, 2, false ),
          bpf2 = g.svf( eg, g.mul( 330, g.add( tune, 1 ) ), .05, 2, false ),
          out  = g.memo( g.add( snap, bpf1, g.mul( bpf2, .8 ) ) ), //XXX why is memo needed?
          scaledOut = g.mul( out, g.mul( gain, Loudness ) ),
          ife = g.switch( check, scaledOut, 0 ),
          props = Object.assign( {}, Snare.defaults, argumentProps )

    // XXX TODO : make above switch work with ifelse. the problem is that poke ugens put their
    // code at the bottom of the callback function, instead of at the end of the
    // associated if/else block.
    
    snare.env = eg 
    const __snare = Gibberish.factory( snare, ife, ['instruments','snare'], props  )
    
    return __snare
  }
  
  Snare.defaults = {
    gain: .5,
    tune:0,
    snappy: 1,
    decay:.1,
    loudness:1,
    __triggerLoudness:1
  }

  return Snare

}

},{"./instrument.js":181,"genish.js":51}],191:[function(require,module,exports){
/*fetch( '0000_Aspirin_sf2_file.json' )
.then( res => res.json() )
.then( json => {
  window.zones = json.zones
  console.log( window.zones )
})

ab = Gibberish.utilities..decodeArrayBuffer( zones[0].file )
genish.utilities.ctx.decodeAudioData( ab, buffer => {
  __ab = buffer
  console.log( 'buffer made' )
})


_d = data( __ab )
play( peek( _d, phasor(1,0,{min:0}) ) )
*/

const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

const genish = g

const soundfonts = {}

const banks = [
  'Aspirin',
  'Chaos',
  'FluidR3',
  'GeneralUserGS',
  'JCLive'
]

module.exports = function( Gibberish ) {
  const proto = Object.create( instrument )
  const memo = {}
  
  Object.assign( proto, {
    pickFile( sample ) {
      this.currentSample = sample
    },
    pick( __idx ) {
      const idx = Math.floor( __idx )
      const keys = Object.keys( this.samplers )
      const key = keys[ idx ]
      this.currentSample = key
    },
    pickplay( __idx ) {
      const idx = Math.floor( __idx )
      const keys = Object.keys( this.samplers )
      const key = keys[ idx ]
      this.currentSample = key
      return this.trigger()
    },
    __note( rate, loudness=null ) {
      // soundfont measures pitch in cents
      // originalPitch = findMidiForHz( hz ) * 100 // (100 cents per midi index)
      // rate = Math.pow(2, (100.0 * pitch - originalPitch) / 1200.0) // 1200 cents per octave
      return this.trigger( loudness, rate )
    },
    note( freq, loudness=null ) {
      'no jsdsp'
      const midinote = 69 + 12 * Math.log2( freq/440 )
      this.midinote( midinote, loudness )
    },
    midipick( midinote, loudness ) {
      // loop through zones to find correct sample #
      let idx = 0, pitch = 0
      for( let zone of this.zones ) {
        if( midinote >= zone.keyRangeLow && midinote <= zone.keyRangeHigh ) {
          pitch = zone.originalPitch
          break;
        }
        idx++
      }
      this.pick( idx )
      return pitch
    },
    midinote( midinote, loudness=null ) {
      'no jsdsp'
      const samplePitch = this.midipick( midinote )
      const pitch = Math.pow( 2, (100 * midinote - samplePitch ) / 1200 ) 
      //const pitch = 1//Math.pow( 2, (samplePitch ) ) 
      this.__note( pitch, loudness )
    }, 
    midichord( frequencies ) {
      if( Gibberish !== undefined && Gibberish.mode !== 'worklet' ) {
        frequencies.forEach( v => this.midinote( v ) )
        this.triggerChord = frequencies
      }
    },
    chord( frequencies ) {
      if( Gibberish !== undefined && Gibberish.mode !== 'worklet' ) {
        frequencies.forEach( v => this.note( v ) )
        this.triggerChord = frequencies
      }
    },

    setpan( num=0, value=.5 ) {
      if( Gibberish.mode === 'processor' ) {
        const voice = this.voices[ num ]
        // set voice buffer length
        //g.gen.memory.heap.set( [ value ], voice.pan.memory.values.idx )
        voice.pan = value
      }
    },
    setrate( num=0, value=1 ) {
      if( Gibberish.mode === 'processor' ) {
        const voice = this.voices[ num ]
        // set voice buffer length
        //g.gen.memory.heap.set( [ value ], voice.rate.memory.values.idx )
        voice.rate = value
      }
    },
    trigger( volume=null, rate=null ) {
      'no jsdsp'
      //if( volume !== null ) this.__triggerLoudness = volume

      let voice = null
      if( Gibberish.mode === 'processor' ) {
        const sampler = this.samplers[ this.currentSample ]

        // if sample isn't loaded...
        if( sampler === undefined ) return

        voice = this.__getVoice__()

        // set voice buffer length
        g.gen.memory.heap[ voice.bufferLength.memory.values.idx ] = sampler.dataLength

        // set voice data index
        g.gen.memory.heap[ voice.bufferLoc.memory.values.idx ] = sampler.dataIdx

        g.gen.memory.heap[ voice.__loopStart.memory.values.idx ] = sampler.zone.loopStart
        g.gen.memory.heap[ voice.__loopEnd.memory.values.idx   ] = sampler.zone.loopEnd

        if( volume !== null )
          g.gen.memory.heap[ voice.loudness.memory.values.idx   ] = volume

        if( rate !== null ) voice.rate = rate 
        
        voice.trigger()
      }

      return voice
    },
    __getVoice__() {
      return this.voices[ this.voiceCount++ % this.voices.length ]
    },
  })

  const Soundfont = inputProps => {
    const syn = Object.create( proto )

    const props = Object.assign( { onload:null, voiceCount:0, files:[] }, Soundfont.defaults, inputProps )

    syn.isStereo = props.isStereo !== undefined ? props.isStereo : false

    const start = g.in( 'start' ), end = g.in( 'end' ), 
          rate = g.in( 'rate' ), shouldLoop = g.in( 'loops' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' ),
          // rate storage is used to determine whether we're playing
          // the sample forward or in reverse, for use in the 'trigger' method.
          rateStorage = g.data([0], 1, { meta:true })

    Object.assign( syn, props )

    if( Gibberish.mode === 'worklet' ) {
      syn.__meta__ = {
        address:'add',
        name: ['instruments', 'Soundfont'],
        properties: JSON.stringify(props), 
        id: syn.id
      }

      Gibberish.worklet.ugens.set( syn.id, syn )

      Gibberish.worklet.port.postMessage( syn.__meta__ )
    }

    // create all our vocecs
    const voices = []
    for( let i = 0; i < syn.maxVoices; i++ ) {
      'use jsdsp'

      const voice = {
        bufferLength: g.data( [1], 1, { meta:true }),
        bufferLoc:    g.data( [1], 1, { meta:true }),
        bang: g.bang(),
        // XXX how do I change this from main thread?
        __pan: g.data( [.5], 1, { meta:true }),
        __rate: g.data( [1], 1, { meta:true }),
        __shouldLoop: g.data( [1], 1, { meta:true }),
        __loopStart: g.data( [1], 1, { meta:true }),
        __loopEnd:   g.data( [1], 1, { meta:true }),
        __loudness:  g.data( [1], 1, { meta:true }),
        get loudness() { 
          return g.gen.memory.heap[ this.__loudness.memory.values.idx   ]
        },
        set loudness( v ) {
          g.gen.memory.heap[ this.__loudness.memory.values.idx ] = v
        },
        set pan(v) {
          g.gen.memory.heap[ this.__pan.memory.values.idx ] = v
        },
        set rate(v) {
          g.gen.memory.heap[ this.__rate.memory.values.idx ] = v
        },
      }

      voice.phase = g.counter( 
        rate * voice.__rate[0], 
        start * voice.bufferLength[0],
        end * voice.bufferLength[0], 
        voice.bang,
        shouldLoop, 
        { shouldWrap:false, initialValue:9999999 }
      )

      voice.trigger = voice.bang.trigger

      voice.graph = g.ifelse(
        // if phase is greater than start and less than end... 
        g.and( 
          g.gte( voice.phase, start * voice.bufferLength[0] ), 
          g.lt(  voice.phase, end   * voice.bufferLength[0] ) 
        ),
        // ...read data
        voice.peek = g.peekDyn( 
          voice.bufferLoc[0], 
          voice.bufferLength[0],
          voice.phase,
          { mode:'samples' }
        ),
        // ...else return 0
        0
      ) 
      * loudness 
      * voice.__loudness[0] 

      // start of attempt to loop sustain...
      //voice.graph = g.ifelse(
      //  // if phase is greater than start and less than end... 
      //  g.and( 
      //    g.gte( voice.phase, start * voice.bufferLength[0] ), 
      //    g.lt(  voice.phase, end   * voice.bufferLength[0] ) 
      //  ),
      //  // ...read data
      //  voice.peek = g.peekDyn( 
      //    voice.bufferLoc[0], 
      //    voice.bufferLength[0],
      //    voice.phase,
      //    { mode:'samples' }
      //  ),
      //  // ...else return 0
      //  g.ifelse(
      //    g.and(
      //      voice.__shouldLoop[0],
      //      g.gt( voice.phase, voice.__loopEnd[0] )
      //    ),
      //    g.peekDyn( 
      //      voice.bufferLoc[0], 
      //      voice.bufferLength[0],
      //      g.add( 
      //        voice.__loopStart[0],
      //        g.mod(
      //          voice.phase,
      //          //g.sub( voice.phase, voice.__loopStart[0] ),
      //          g.sub( voice.__loopEnd[0], voice.__loopStart[0] )
      //        )
      //      ),
      //      { mode:'samples' }
      //    ),
      //    0
      //  )
      //) 
      //* loudness 
      //* triggerLoudness 
      
      const pan = g.pan( voice.graph, voice.graph, voice.__pan[0] )
      voice.graph = [ pan.left, pan.right ]

      voices.push( voice )
    }

    // load in sample data
    const samplers = {}

    // bound to individual sampler objects in loadSample function
    syn.loadBuffer = function( buffer, onload ) {
      // main thread: when sample is loaded, copy it over message port
      // processor thread: onload is called via messageport handler, and
      // passed in the new buffer to be copied.
      if( Gibberish.mode === 'worklet' ) {
        const memIdx = Gibberish.memory.alloc( this.data.buffer.length, true )

        Gibberish.worklet.port.postMessage({
          address:'copy_multi',
          id:     syn.id,
          buffer: this.data.buffer,
          filename: this.filename
        })

        if( typeof onload === 'function' ) onload( this, buffer )

      }else if( Gibberish.mode === 'processor' ) {
        this.data.buffer = buffer 

        // set data memory spec before issuing memory request
        this.dataLength = this.data.memory.values.length = this.data.dim = this.data.buffer.length
        this.zone = syn.zones[ this.filename ]

        // request memory to copy the bufer over
        g.gen.requestMemory( this.data.memory, false )
        g.gen.memory.heap.set( this.data.buffer, this.data.memory.values.idx )

        // set location of buffer (does not work)
        this.dataIdx = this.data.memory.values.idx

        syn.currentSample = this.filename
      }
    }

    syn.loadSample = function( filename, __onload, buffer=null ) {
      'use jsdsp'

      const sampler = samplers[ filename ] = {
        dataLength: null,
        dataIdx: null,
        buffer: null,
        filename
      }

      const onload = syn.loadBuffer.bind( sampler ) 
      // passing a filename to data will cause it to be loaded in the main thread
      // onload will then be called to pass the buffer over the messageport. In the
      // processor thread, make a placeholder until data is available.
      if( Gibberish.mode === 'worklet' ) {
        sampler.data = g.data( buffer !== null ? buffer : filename, 1, { onload })

        // check to see if a promise is returned; a valid
        // data object is only return if the file has been
        // previously loaded and the corresponding buffer has
        // been cached.
        if( sampler.data instanceof Promise ) {
          sampler.data.then( d => {
            sampler.data = d
            memo[ filename ] = sampler.data 
            onload( sampler, __onload )
          })
        }else{
          // using a cached data buffer, no need
          // for asynchronous loading.
          memo[ filename ] = sampler
          sampler.dataLength = buffer.length
          onload( sampler, __onload )
        }     
      }else{
        // not sure if first case will happen with soundfonts (it does with regular multisampler)
        if( buffer === null ) {
          sampler.data = g.data( new Float32Array(), 1, { onload, filename })
          sampler.data.onload = onload
        }else{
          sampler.data = g.data( buffer, 1, { onload, filename })
          //sampler.data.onload = onload
          onload( buffer, __onload )
        }
      }

      return sampler
    }

    syn.load = function( soundNumber=0, bankIndex=0 ) {
      'no jsdsp'

      // need to memoize... already storing in soundfonts
      if( Gibberish.mode === 'processor' ) return

      // in case users pass name of soundfont instead of number
      if( typeof soundNumber === 'string' ) {
        let __soundNumber = Soundfont.names.indexOf( soundNumber )
        if( __soundNumber === -1 ) {
          __soundNumber = 0
          console.warn( `The ${soundNumber} Soundfont can't be found. Using Piano instead.` )
        }
        soundNumber = __soundNumber
      }

      let num = (soundNumber) + '0'
      if( soundNumber < 100 ) num = '0'+num
      if( soundNumber < 10 )  num = '0'+num

      fetch( `${Soundfont.resourcePath}${num}_${banks[bankIndex]}.sf2.json` )
        .then( res => res.json() )
        .then( json => {
          const zones = soundfonts[ soundNumber ] = json.zones
          this.zones = zones
          for( let i = 0; i < zones.length; i++) {
            const zone = zones[i]
            const ab = Gibberish.utilities.base64.decodeArrayBuffer( zone.file )
            g.utilities.ctx.decodeAudioData( ab, buffer => {
              zone.sampler = syn.loadSample( i, null, buffer )
            })
          }
        })
    }

    //props.files.forEach( filename => syn.loadSample( filename ) )

    syn.__createGraph = function() {
      'use jsdsp'
      
      const graphs = voices.map( voice => voice.graph )
      const left = g.add( ...voices.map( voice => voice.graph[0] ) )
      const right = g.add( ...voices.map( voice => voice.graph[1] ) )
      const gain = g.in( 'gain' )
      syn.graph = [ left * gain, right * gain ]

      if( syn.panVoices === true ) { 
        const panner = g.pan( syn.graph[0], syn.graph[1], g.in( 'pan' ) ) 
        syn.graph = [ panner.left, panner.right ]
      }
    }

    syn.__createGraph()

    const out = Gibberish.factory( 
      syn,
      syn.graph,
      ['instruments','soundfont'], 
      props 
    ) 

    Gibberish.preventProxy = true
    Gibberish.proxyEnabled = false

    out.voices = voices
    out.samplers = samplers

    Gibberish.proxyEnabled = true
    Gibberish.preventProxy = false

    return out
  }

  Soundfont.defaults = {
    gain: 1,
    pan: .5,
    rate: 1,
    panVoices:false,
    shouldLoop:false,
    loops: 0,
    start:0,
    end:1,
    bufferLength:-999999999,
    loudness:1,
    maxVoices:5, 
    __triggerLoudness:1
  }

  Soundfont.resourcePath = 'resources/soundfonts/'
  Soundfont.names = [
    "Acoustic Grand Piano",
    "Bright Acoustic Piano",
    "Electric Grand Piano",
    "Honky-tonk Piano",
    "Electric Piano 1",
    "Electric Piano 2",
    "Harpsichord",
    "Clavi",
    "Celesta",
    "Glockenspiel",
    "Music Box",
    "Vibraphone",
    "Marimba",
    "Xylophone",
    "Tubular Bells",
    "Dulcimer",
    "Drawbar Organ",
    "Percussive Organ",
    "Rock Organ",
    "Church Organ",
    "Reed Organ",
    "Accordion",
    "Harmonica",
    "Tango Accordion",
    "Acoustic Guitar (nylon)",
    "Acoustic Guitar (steel)",
    "Electric Guitar (jazz)",
    "Electric Guitar (clean)",
    "Electric Guitar (muted)",
    "Overdriven Guitar",
    "Distortion Guitar",
    "Guitar harmonics",
    "Acoustic Bass",
    "Electric Bass (finger)",
    "Electric Bass (pick)",
    "Fretless Bass",
    "Slap Bass 1",
    "Slap Bass 2",
    "Synth Bass 1",
    "Synth Bass 2",
    "Violin",
    "Viola",
    "Cello",
    "Contrabass",
    "Tremolo Strings",
    "Pizzicato Strings",
    "Orchestral Harp",
    "Timpani",
    "String Ensemble 1",
    "String Ensemble 2",
    "SynthStrings 1",
    "SynthStrings 2",
    "Choir Aahs",
    "Voice Oohs",
    "Synth Voice",
    "Orchestra Hit",
    "Trumpet",
    "Trombone",
    "Tuba",
    "Muted Trumpet",
    "French Horn",
    "Brass Section",
    "SynthBrass 1",
    "SynthBrass 2",
    "Soprano Sax",
    "Alto Sax",
    "Tenor Sax",
    "Baritone Sax",
    "Oboe",
    "English Horn",
    "Bassoon",
    "Clarinet",
    "Piccolo",
    "Flute",
    "Recorder",
    "Pan Flute",
    "Blown Bottle",
    "Shakuhachi",
    "Whistle",
    "Ocarina",
    "Lead 1 (square)",
    "Lead 2 (sawtooth)",
    "Lead 3 (calliope)",
    "Lead 4 (chiff)",
    "Lead 5 (charang)",
    "Lead 6 (voice)",
    "Lead 7 (fifths)",
    "Lead 8 (bass + lead)",
    "Pad 1 (new age)",
    "Pad 2 (warm)",
    "Pad 3 (polysynth)",
    "Pad 4 (choir)",
    "Pad 5 (bowed)",
    "Pad 6 (metallic)",
    "Pad 7 (halo)",
    "Pad 8 (sweep)",
    "FX 1 (rain)",
    "FX 2 (soundtrack)",
    "FX 3 (crystal)",
    "FX 4 (atmosphere)",
    "FX 5 (brightness)",
    "FX 6 (goblins)",
    "FX 7 (echoes)",
    "FX 8 (sci-fi)",
    "Sitar",
    "Banjo",
    "Shamisen",
    "Koto",
    "Kalimba",
    "Bag pipe",
    "Fiddle",
    "Shanai",
    "Tinkle Bell",
    "Agogo",
    "Steel Drums",
    "Woodblock",
    "Taiko Drum",
    "Melodic Tom",
    "Synth Drum",
    "Reverse Cymbal",
    "Guitar Fret Noise",
    "Breath Noise",
    "Seashore",
    "Bird Tweet",
    "Telephone Ring",
    "Helicopter",
    "Applause",
    "Gunshot"
  ]

  Soundfont.inspect = function() {
    console.table( Soundfont.names )
  }

  return Soundfont
}

},{"./instrument.js":181,"genish.js":51}],192:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

const genish = g

module.exports = function( Gibberish ) {

  const Synth = inputProps => {
    const syn = Object.create( instrument )

    const frequency = g.in( 'frequency' ),
          loudness  = g.in( 'loudness' ), 
          triggerLoudness = g.in( '__triggerLoudness' ),
          glide = g.max( 1, g.in( 'glide' ) ),
          slidingFreq = g.slide( frequency, glide, glide ),
          attack = g.in( 'attack' ), decay = g.in( 'decay' ),
          sustain = g.in( 'sustain' ), sustainLevel = g.in( 'sustainLevel' ),
          release = g.in( 'release' )

    const props = Object.assign( {}, Synth.defaults, inputProps )
    Object.assign( syn, props )

    syn.__createGraph = function() {
      const osc = Gibberish.oscillators.factory( syn.waveform, slidingFreq, syn.antialias )

      const env = Gibberish.envelopes.factory( 
        props.useADSR, 
        props.shape, 
        attack, decay, 
        sustain, sustainLevel, 
        release, 
        props.triggerRelease
      )


      // syn.env = env
      // below doesn't work as it attempts to assign to release property triggering codegen...
      syn.advance = ()=> { env.release() }

      {
        'use jsdsp'
        let oscWithEnv = osc * env * loudness * triggerLoudness,
            saturation = g.in('saturation'),
            panner

        // 16 is an unfortunate empirically derived magic number...
        const baseCutoffFreq = g.in('cutoff') * ( frequency /  ( g.gen.samplerate / 16 ) ) 
        const cutoff = g.min( baseCutoffFreq * g.pow( 2, g.in('filterMult') * loudness * triggerLoudness ) * env, .995 ) 
        const filteredOsc = Gibberish.filters.factory( oscWithEnv, cutoff, saturation, props )

        let synthWithGain = filteredOsc * g.in( 'gain' )
        
        // XXX This line has to be here for correct code generation to work when
        // saturation is not being used... obviously this should cancel out. 
        if( syn.filterModel !== 2 ) synthWithGain = synthWithGain + saturation - saturation
    
        if( syn.panVoices === true ) { 
          panner = g.pan( synthWithGain, synthWithGain, g.in( 'pan' ) ) 
          syn.graph = [ panner.left, panner.right ]
          syn.isStereo = true
        }else{
          syn.graph = synthWithGain
          syn.isStereo = false
        }

        syn.env = env
        syn.osc = osc
        syn.filter = filteredOsc
      }

      return env

    }
    
    syn.__requiresRecompilation = [ 'waveform', 'antialias', 'filterModel','filterMode', 'useADSR', 'shape' ]
    const env = syn.__createGraph()

    const out = Gibberish.factory( syn, syn.graph, ['instruments', 'synth'], props, null, true, ['saturation']  )

    out.env.advance = out.advance 

    return out
  }
  
  Synth.defaults = {
    waveform:'saw',
    attack: 44,
    decay: 22050,
    sustain:44100,
    sustainLevel:.6,
    release:22050,
    useADSR:false,
    shape:'linear',
    triggerRelease:false,
    gain: .5,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    antialias:false,
    panVoices:false,
    loudness:1,
    __triggerLoudness:1,
    glide:1,
    saturation:1,
    filterMult:2,
    Q:.25,
    cutoff:.5,
    filterModel:1,
    filterMode:0
  }

  // do not include velocity, which shoudl always be per voice
  let PolySynth = Gibberish.PolyTemplate( Synth, ['frequency','attack','decay','pulsewidth','pan','gain','glide', 'saturation', 'filterMult', 'Q', 'cutoff', 'resonance', 'antialias', 'filterModel', 'waveform', 'filterMode', '__triggerLoudness', 'loudness'] ) 
  PolySynth.defaults = Synth.defaults

  return [ Synth, PolySynth ]

}

},{"./instrument.js":181,"genish.js":51}],193:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Tom = argumentProps => {
    let tom = Object.create( instrument )
    
    const decay   = g.in( 'decay' ),
          pitch   = g.in( 'frequency' ),
          gain    = g.in( 'gain' ),
          loudness = g.in( 'loudness' ),
          triggerLoudness = g.in( '__triggerLoudness' )

    const props = Object.assign( {}, Tom.defaults, argumentProps )

    const trigger = g.bang(),
          impulse = g.mul( trigger, 1 ),
          eg = g.decay( g.mul( decay, g.gen.samplerate * 2 ), { initValue:0 } ), 
          bpf = g.mul( g.svf( impulse, pitch, .0175, 2, false ), 10 ),
          noise = g.gtp( g.noise(), 0 ), // rectify noise
          envelopedNoise = g.mul( noise, eg ),
          lpf = g.mul( g.svf( envelopedNoise, 120, .5, 0, false ), 2.5 ),
          out = g.mul( g.add( bpf, lpf ), g.mul( gain, g.mul( loudness, triggerLoudness ) ) )

    tom.env = {
      trigger: function() {
        eg.trigger()
        trigger.trigger()
      }
    }

    tom.isStereo = false

    tom = Gibberish.factory( tom, out, ['instruments', 'tom'], props  )
    
    return tom
  }
  
  Tom.defaults = {
    gain: 1,
    decay:.7,
    frequency:120,
    loudness:1,
    __triggerLoudness:1
  }

  return Tom
}

},{"./instrument.js":181,"genish.js":51}],194:[function(require,module,exports){
const ugenproto = require( '../ugen.js' )(),
     __proxy     = require( '../workletProxy.js' ),
     g = require( 'genish.js' )

module.exports = function( Gibberish ) {
  const proxy = __proxy( Gibberish )

  const createProperties = function( p, id ) {
    for( let i = 0; i < 2; i++ ) {
      Object.defineProperty( p, i, {
        configurable:true,
        get() { return p.inputs[ i ] },
        set(v) {
          p.inputs[ i ] = v
          if( Gibberish.mode === 'worklet' ) {
            if( typeof v === 'number' ) {
              Gibberish.worklet.port.postMessage({ 
                address:'addToProperty', 
                object:id,
                name:'inputs',
                key:i,
                value:v
              })
            }else{
              Gibberish.worklet.port.postMessage({ 
                address:'addObjectToProperty', 
                object:id,
                name:'inputs',
                key:i,
                value:v.id
              })
            }
            Gibberish.worklet.port.postMessage({
              address:'dirty',
              id
            })
          }
        }
      })
    }
  }

  const Binops = {
    export( obj ) {
      for( let key in Binops ) {
        if( key !== 'export' ) {
          obj[ key ] = Binops[ key ]
        }
      }
    },
    
    Add( ...args ) {
      const id = Gibberish.factory.getUID()
      const ugen = Object.create( ugenproto )
      const isStereo = Gibberish.__isStereo( args[0] ) || Gibberish.__isStereo( args[1] )
      Object.assign( ugen, { isop:true, op:'+', inputs:args, ugenName:'add' + id, id, isStereo } )
      
      const p = proxy( ['binops','Add'], { isop:true, inputs:args }, ugen )
      createProperties( p, id )

      return p
    },

    Sub( ...args ) {
      const id = Gibberish.factory.getUID()
      const ugen = Object.create( ugenproto )
      const isStereo = Gibberish.__isStereo( args[0] ) || Gibberish.__isStereo( args[1] )
      Object.assign( ugen, { isop:true, op:'-', inputs:args, ugenName:'sub' + id, id, isStereo } )

      return proxy( ['binops','Sub'], { isop:true, inputs:args }, ugen )
    },

    Mul( ...args ) {
      const id = Gibberish.factory.getUID()
      const ugen = Object.create( ugenproto )
      const isStereo = Gibberish.__isStereo( args[0] ) || Gibberish.__isStereo( args[1] )
      Object.assign( ugen, { isop:true, op:'*', inputs:args, ugenName:'mul' + id, id, isStereo } )

      const p = proxy( ['binops','Mul'], { isop:true, inputs:args }, ugen )
      createProperties( p, id )
      return p
    },

    Div( ...args ) {
      const id = Gibberish.factory.getUID()
      const ugen = Object.create( ugenproto )
      const isStereo = Gibberish.__isStereo( args[0] ) || Gibberish.__isStereo( args[1] )
      Object.assign( ugen, { isop:true, op:'/', inputs:args, ugenName:'div' + id, id, isStereo} )
    
      const p = proxy( ['binops','Div'], { isop:true, inputs:args }, ugen )
      createProperties( p, id )

      return p
    },

    Mod( ...args ) {
      const id = Gibberish.factory.getUID()
      const ugen = Object.create( ugenproto )
      const isStereo = Gibberish.__isStereo( args[0] ) || Gibberish.__isStereo( args[1] )
      Object.assign( ugen, { isop:true, op:'%', inputs:args, ugenName:'mod' + id, id, isStereo} )

      const p = proxy( ['binops','Mod'], { isop:true, inputs:args }, ugen )
      createProperties( p, id )

      return p
    },   
  }

  for( let key in Binops ) {
    Binops[ key ].defaults = { 0:0, 1:0 }
  }

  return Binops
}

},{"../ugen.js":210,"../workletProxy.js":212,"genish.js":51}],195:[function(require,module,exports){
let g = require( 'genish.js' ),
    ugen = require( '../ugen.js' )(),
    __proxy= require( '../workletProxy.js' )

module.exports = function( Gibberish ) {
  const proxy = __proxy( Gibberish )
  const Bus = Object.create( ugen )

  Object.assign( Bus, {
    gain: {
      set( v ) {
        this.mul.inputs[ 1 ] = v
        Gibberish.dirty( this )
      },
      get() {
        return this.mul[ 1 ]
      }
    },

    __addInput( input ) {
      this.sum.inputs.push( input )
      Gibberish.dirty( this )
    },

    create( _props ) {
      const props = Object.assign({}, Bus.defaults, { inputs:[0] }, _props )

      // MUST PREVENT PROXY
      // Othherwise these binops are created in the worklet and sent
      // across the thread to be instantiated, and then instantiated again
      // when the bus is created in the processor thread, messing up the various
      // uids involved. By preventing proxying the binops are only created
      // a single time when the bus is sent across the thread.
      Gibberish.preventProxy = true
      const sum = Gibberish.binops.Add( ...props.inputs )
      const mul = Gibberish.binops.Mul( sum, props.gain )
      Gibberish.preventProxy = false

      const graph = Gibberish.Panner({ input:mul, pan: props.pan })

      graph.sum = sum
      graph.mul = mul
      graph.disconnectUgen = Bus.disconnectUgen

      graph.__properties__ = props

      const out = props.__useProxy__ === true ? proxy( ['Bus'], props, graph ) : graph

      Object.defineProperty( out, 'gain', Bus.gain )

      if( false && Gibberish.preventProxy === false && Gibberish.mode === 'worklet' ) {
        const meta = {
          address:'add',
          name:['Bus'],
          props, 
          id:graph.id
        }
        Gibberish.worklet.port.postMessage( meta )
        Gibberish.worklet.port.postMessage({ 
          address:'method', 
          object:graph.id,
          name:'connect',
          args:[]
        })
      }

      return out 
    },

    disconnectUgen( ugen ) {
      let removeIdx = this.sum.inputs.indexOf( ugen )

      if( removeIdx !== -1 ) {
        this.sum.inputs.splice( removeIdx, 1 )
        Gibberish.dirty( this )
      }
    },

    // can't include inputs here as it will be sucked up by Gibber,
    // instead pass during Object.assign() after defaults.
    defaults: { gain:1, pan:.5, __useProxy__:true }
  })

  const constructor = Bus.create.bind( Bus )
  constructor.defaults = Bus.defaults

  return constructor
}


},{"../ugen.js":210,"../workletProxy.js":212,"genish.js":51}],196:[function(require,module,exports){
const g = require( 'genish.js' ),
      ugen = require( '../ugen.js' )(),
      __proxy = require( '../workletProxy.js' )


module.exports = function( Gibberish ) {
  const Bus2 = Object.create( ugen )
  const proxy = __proxy( Gibberish )

  let bufferL, bufferR
  
  Object.assign( Bus2, { 
    create( __props ) {

      if( bufferL === undefined ) {
        const p = g.pan()
        
        // copy memory... otherwise the wavetables don't have memory indices.
        bufferL = Gibberish.memory.alloc(1024)
        Gibberish.memory.heap.set( Gibberish.genish.gen.globals.panL.buffer, bufferL )

        bufferR = Gibberish.memory.alloc(1024)
        Gibberish.memory.heap.set( Gibberish.genish.gen.globals.panR.buffer, bufferR )
      }

      // XXX must be same type as what is returned by genish for type checks to work correctly
      const output = new Float64Array( 2 ) 

      const bus = Object.create( Bus2 )

      let init = false

      const props = Object.assign({}, Bus2.defaults, __props )

      Object.assign( 
        bus,

        {
          callback() {
            output[ 0 ] = output[ 1 ] = 0
            const lastIdx = arguments.length - 1
            const memory  = arguments[ lastIdx ]
            let pan  = arguments[ lastIdx - 1 ]
            const gain = arguments[ lastIdx - 2 ]

            for( let i = 0; i < lastIdx - 2; i+= 3 ) {
              const input = arguments[ i ],
                    level = arguments[ i + 1 ],
                    isStereo = arguments[ i + 2 ]

              output[ 0 ] += isStereo === true ? input[ 0 ] * level : input * level

              output[ 1 ] += isStereo === true ? input[ 1 ] * level : input * level
            }

            if( pan < 0 ) {
              pan = 0
            }else if( pan > 1 ){
              pan = 1
            }

            const panRawIndex  = pan * 1023,
                  panBaseIndex = panRawIndex | 0,
                  panNextIndex = (panBaseIndex + 1) & 1023,
                  interpAmount = panRawIndex - panBaseIndex,
                  panL = memory[ bufferL + panBaseIndex ] 
                    + ( interpAmount * ( memory[ bufferL + panNextIndex ] - memory[ bufferL + panBaseIndex ] ) ),
                  panR = memory[ bufferR + panBaseIndex ] 
                    + ( interpAmount * ( memory[ bufferR + panNextIndex ] - memory[ bufferR + panBaseIndex ] ) )
            
            output[0] *= gain * panL
            output[1] *= gain * panR

            return output
          },
          id : Gibberish.factory.getUID(),
          dirty : false,
          type : 'bus',
          inputs:[ 1, .5 ],
          isStereo: true,
          __properties__:props
        },

        Bus2.defaults,

        props
      )

      bus.ugenName = bus.callback.ugenName = 'bus2_' + bus.id

      const out = bus.__useProxy__ === true ? proxy( ['Bus2'], props, bus ) : bus


      // we have to include custom properties for these as the argument list for
      // the compiled output function is variable
      // so codegen can't know the correct argument order for the function
      let pan = .5
      Object.defineProperty( out, 'pan', {
        get() { return pan },
        set(v){ 
          pan = v
          out.inputs[ out.inputs.length - 1 ] = pan
          Gibberish.dirty( out )
        }
      })

      let gain = 1
      Object.defineProperty( out, 'gain', {
        get() { return gain },
        set(v){ 
          gain = v
          out.inputs[ out.inputs.length - 2 ] = gain
          Gibberish.dirty( out )
        }
      })

      return out
    },
    
    disconnectUgen( ugen ) {
      let removeIdx = this.inputs.indexOf( ugen )

      if( removeIdx !== -1 ) {
        this.inputs.splice( removeIdx, 3 )
        Gibberish.dirty( this )
      }
    },

    defaults: { gain:1, pan:.5, __useProxy__:true }
  })

  const constructor = Bus2.create.bind( Bus2 )
  constructor.defaults = Bus2.defaults

  return constructor

}

},{"../ugen.js":210,"../workletProxy.js":212,"genish.js":51}],197:[function(require,module,exports){
const  g    = require( 'genish.js'  ),
       ugen = require( '../ugen.js' )()

module.exports = function( Gibberish ) {

  const Monops = {
    export( obj ) {
      for( let key in Monops ) {
        if( key !== 'export' ) {
          obj[ key ] = Monops[ key ]
        }
      }
    },
    
    Abs( input ) {
      const abs = Object.create( ugen )
      const graph = g.abs( g.in('input') )
      
      const __out = Gibberish.factory( abs, graph, ['monops','abs'], Object.assign({}, Monops.defaults, { inputs:[input], isop:true }) )

      return __out
    },

    Pow( input, exponent ) {
      const pow = Object.create( ugen )
      const graph = g.pow( g.in('input'), g.in('exponent') )
      
      Gibberish.factory( pow, graph, ['monops','pow'], Object.assign({}, Monops.defaults, { inputs:[input], exponent, isop:true }) )

      return pow
    },
    Clamp( input, min, max ) {
      const clamp = Object.create( ugen )
      const graph = g.clamp( g.in('input'), g.in('min'), g.in('max') )
      
      const __out = Gibberish.factory( clamp, graph, ['monops','clamp'], Object.assign({}, Monops.defaults, { inputs:[input], isop:true, min, max }) )

      return __out
    },

    Merge( input ) {
      const merger = Object.create( ugen )
      const cb = function( _input ) {
        return _input[0] + _input[1]
      }

      Gibberish.factory( merger, g.in( 'input' ), ['monops','merge'], { inputs:[input], isop:true }, cb )
      merger.type = 'analysis'
      merger.inputNames = [ 'input' ]
      merger.inputs = [ input ]
      merger.input = input
      
      return merger
    },
  }

  Monops.defaults = { input:0 }

  return Monops
}

},{"../ugen.js":210,"genish.js":51}],198:[function(require,module,exports){
const g = require( 'genish.js' )

const ugen = require( '../ugen.js' )()

module.exports = function( Gibberish ) {
 
let Panner = inputProps => {
  const props  = Object.assign( {}, Panner.defaults, inputProps ),
        panner = Object.create( ugen )

  const isStereo = props.input.isStereo !== undefined ? props.input.isStereo : Array.isArray( props.input ) 
  
  const input = g.in( 'input' ),
        pan   = g.in( 'pan' )

  let graph 
  if( isStereo ) {
    graph = g.pan( input[0], input[1], pan )  
  }else{
    graph = g.pan( input, input, pan )
  }

  Gibberish.factory( panner, [ graph.left, graph.right], ['panner'], props )
  
  return panner
}

Panner.defaults = {
  input:0,
  pan:.5
}

return Panner 

}

},{"../ugen.js":210,"genish.js":51}],199:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const Time = {
    bpm: 120,

    export: function(target) {
      Object.assign( target, Time )
    },

    ms : function(val) {
      return val * Gibberish.ctx.sampleRate / 1000;
    },

    seconds : function(val) {
      return val * Gibberish.ctx.sampleRate;
    },

    beats : function(val) {
      return function() { 
        var samplesPerBeat = Gibberish.ctx.sampleRate / ( Gibberish.Time.bpm / 60 ) ;
        return samplesPerBeat * val ;
      }
    }
  }

  return Time
}

},{}],200:[function(require,module,exports){
const genish = require( 'genish.js' ),
      ssd = genish.history,
      noise = genish.noise

module.exports = function() {
  "use jsdsp"

  const last = ssd( 0 )

  const white = ( noise() * 2 ) - 1

  let out = (last.out + (.02 * white)) / 1.02

  last.in( out )

  out *= 3.5
   
  return out
}

},{"genish.js":51}],201:[function(require,module,exports){
let g = require( 'genish.js' )

let feedbackOsc = function( frequency, filter, pulsewidth=.5, argumentProps ) {
  if( argumentProps === undefined ) argumentProps = { type: 0 }

  let lastSample = g.history(),
      // determine phase increment and memoize result
      w = g.memo( g.div( frequency, g.gen.samplerate ) ),
      // create scaling factor
      n = g.sub( -.5, w ),
      scaling = g.mul( g.mul( 13, filter ), g.pow( n, 5 ) ),
      // calculate dc offset and normalization factors
      DC = g.sub( .376, g.mul( w, .752 ) ),
      norm = g.sub( 1, g.mul( 2, w ) ),
      // determine phase
      osc1Phase = g.accum( w, 0, { min:-1 }),
      osc1, out

  // create current sample... from the paper:
  // osc = (osc + sin(2*pi*(phase + osc*scaling)))*0.5f;
  osc1 = g.memo( 
    g.mul(
      g.add(
        lastSample.out,
        g.sin(
          g.mul(
            Math.PI * 2,
            g.memo( g.add( osc1Phase, g.mul( lastSample.out, scaling ) ) )
          )
        )
      ),
      .5
    )
  )

  // store sample to use as modulation
  lastSample.in( osc1 )

  // if pwm / square waveform instead of sawtooth...
  if( argumentProps.type === 1 ) { 
    const lastSample2 = g.history() // for osc 2
    const lastSampleMaster = g.history() // for sum of osc1,osc2

    const osc2 = g.mul(
      g.add(
        lastSample2.out,
        g.sin(
          g.mul(
            Math.PI * 2,
            g.memo( g.add( osc1Phase, g.mul( lastSample2.out, scaling ), pulsewidth ) )
          )
        )
      ),
      .5
    )

    lastSample2.in( osc2 )
    out = g.memo( g.sub( lastSample.out, lastSample2.out ) )
    out = g.memo( g.add( g.mul( 2.5, out ), g.mul( -1.5, lastSampleMaster.out ) ) )
    
    lastSampleMaster.in( g.sub( osc1, osc2 ) )

  }else{
     // offset and normalize
    osc1 = g.add( g.mul( 2.5, osc1 ), g.mul( -1.5, lastSample.out ) )
    osc1 = g.add( osc1, DC )
 
    out = osc1
  }

  return g.mul( out, norm )
}

module.exports = feedbackOsc

},{"genish.js":51}],202:[function(require,module,exports){
const g = require( 'genish.js' ),
      ugen = require( '../ugen.js' )(),
      feedbackOsc = require( './fmfeedbackosc.js' ),
      polyBlep = require( './polyblep.dsp.js' )

//  __makeOscillator__( type, frequency, antialias ) {
    
module.exports = function( Gibberish ) {
  let Oscillators = {
    export( obj ) {
      for( let key in Oscillators ) {
        if( key !== 'export' ) {
          obj[ key ] = Oscillators[ key ]
        }
      }
    },

    genish: {
      Brown: require( './brownnoise.dsp.js' ),
      Pink:  require( './pinknoise.dsp.js'  )
    },

    Wavetable: require( './wavetable.js' )( Gibberish ),
    
    Square( inputProps ) {
      const sqr   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'square', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      const out = Gibberish.factory( sqr, graph, ['oscillators','square'], props )

      return out
    },

    Triangle( inputProps ) {
      const tri= Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'triangle', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      const out = Gibberish.factory( tri, graph, ['oscillators','triangle'], props )

      return out
    },

    PWM( inputProps ) {
      const pwm   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false, pulsewidth:.25 }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'pwm', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      const out = Gibberish.factory( pwm, graph, ['oscillators','PWM'], props )

      return out
    },

    Sine( inputProps ) {
      const sine  = Object.create( ugen )
      const props = Object.assign({}, Oscillators.defaults, inputProps )
      const graph = g.mul( g.cycle( g.in('frequency') ), g.in('gain') )

      const out = Gibberish.factory( sine, graph, ['oscillators','sine'], props )
      
      return out
    },

    Noise( inputProps ) {
      const noise = Object.create( ugen )
      const props = Object.assign( {}, { gain: 1, color:'white' }, inputProps )
      let graph 

      switch( props.color ) {
        case 'brown':
          graph = g.mul( Oscillators.genish.Brown(), g.in('gain') )
          break;
        case 'pink':
          graph = g.mul( Oscillators.genish.Pink(), g.in('gain') )
          break;
        default:
          graph = g.mul( g.noise(), g.in('gain') )
          break;
      }

      const out = Gibberish.factory( noise, graph, ['oscillators','noise'], props )

      return out
    },

    Saw( inputProps ) {
      const saw   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'saw', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      const out = Gibberish.factory( saw, graph, ['oscillators','saw'], props )

      return out
    },

    ReverseSaw( inputProps ) {
      const saw   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = g.sub( 1, Oscillators.factory( 'saw', g.in( 'frequency' ), props.antialias ) )
      const graph = g.mul( osc, g.in( 'gain' ) )

      const out = Gibberish.factory( saw, graph, ['oscillators','ReverseSaw'], props )
      
      return out
    },

    factory( type, frequency, antialias=false ) {
      let osc

      switch( type ) {
        case 'pwm':
          let pulsewidth = g.in('pulsewidth')
          if( antialias == true ) {
            osc = feedbackOsc( frequency, 1, pulsewidth, { type:1 })
          }else{
            let phase = g.phasor( frequency, 0, { min:0 } )
            osc = g.lt( phase, pulsewidth )
          }
          break;
        case 'saw':
          if( antialias == false ) {
            osc = g.phasor( frequency )
          }else{
            osc = polyBlep( frequency, { type })
          }
          break;
        case 'sine':
          osc = g.cycle( frequency )
          break;
        case 'square':
          if( antialias == true ) {
            //osc = feedbackOsc( frequency, 1, .5, { type:1 })
            osc = polyBlep( frequency, { type })
          }else{
            osc = g.wavetable( frequency, { buffer:Oscillators.Square.buffer, name:'square' } )
          }
          break;
        case 'triangle':
          if( antialias == true ) {
            osc = polyBlep( frequency, { type })
          }else{
            osc = g.wavetable( frequency, { buffer:Oscillators.Triangle.buffer, name:'triangle' } )
          }
          break;
        case 'noise':
          osc = g.noise()
          break;
      }

      return osc
    }
  }

  Oscillators.Square.buffer = new Float32Array( 1024 )

  for( let i = 1023; i >= 0; i-- ) { 
    Oscillators.Square.buffer [ i ] = i / 1024 > .5 ? 1 : -1
  }

  Oscillators.Triangle.buffer = new Float32Array( 1024 )

  
  for( let i = 1024; i--; i = i ) { Oscillators.Triangle.buffer[i] = 1 - 4 * Math.abs(( (i / 1024) + 0.25) % 1 - 0.5); }

  Oscillators.defaults = {
    frequency: 440,
    gain: 1
  }

  return Oscillators

}

},{"../ugen.js":210,"./brownnoise.dsp.js":200,"./fmfeedbackosc.js":201,"./pinknoise.dsp.js":203,"./polyblep.dsp.js":204,"./wavetable.js":205,"genish.js":51}],203:[function(require,module,exports){
const genish = require( 'genish.js' ),
      ssd = genish.history,
      data = genish.data,
      noise = genish.noise

module.exports = function() {
  "use jsdsp"

  const b = data( 8, 1, { meta: true })
  const white = noise() * 2 - 1

  b[0] = ( .99886 * b[0] ) + ( white * .0555179 )
  b[1] = ( .99332 * b[1] ) + ( white * .0750579 )
  b[2] = ( .96900 * b[2] ) + ( white * .1538520 )
  b[3] = ( .88650 * b[3] ) + ( white * .3104856 )
  b[4] = ( .55000 * b[4] ) + ( white * .5329522 )
  b[5] = ( -.7616 * b[5] ) - ( white * .0168980 )
 
  const out = ( b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * .5362 ) * .11

  b[6] = white * .115926

  return out

}

},{"genish.js":51}],204:[function(require,module,exports){
const genish = require( 'genish.js' )
const g = genish

// based on http://www.martin-finke.de/blog/articles/audio-plugins-018-polyblep-oscillator/
const polyBlep = function( __frequency, argumentProps ) {
  'use jsdsp'
  if( argumentProps === undefined ) argumentProps = { type: 'saw' }
  
  const mem = g.history(0)
  const type = argumentProps.type
  const frequency = __frequency === undefined ? 220 : __frequency
  const dt = frequency / g.gen.samplerate
  
  const t = g.accum( dt, 0, { min:0 })
  let osc

  // triangle waves are integrated square waves, so the below case accomodates both types
  if( type === 'triangle' || type === 'square' ) {
    // lt NOT gt to get correct phase
    osc = (2 * g.lt(t,.5) ) - 1
  }else{
    osc = 2 * t - 1
  }
  const case1 = g.lt(t,dt)
  const case2 = g.gt(t,1-dt)
  const adjustedT = g.switch( case1, t/dt, g.switch( case2, (t-1)/dt, t ) )
  
  // if/elseif/else with nested ternary operators
  const blep = g.switch(
    case1,
    adjustedT + adjustedT - adjustedT * adjustedT - 1,
    g.switch(
      case2,
      adjustedT * adjustedT + adjustedT + adjustedT + 1,
      // final else case is 0
      0
    )
  )
  
  // triangle waves are integrated square waves, so the below case accomodates both types
  if( type !== 'saw' ) {
    osc = osc + blep
    const t_2 = g.memo( g.mod( t + .5, 1 ) )
    const case1_2 = g.lt(t_2,dt)
    const case2_2 = g.gt(t_2,1-dt)
    const adjustedT_2 = g.switch( case1_2, t_2/dt, g.switch( case2_2, (t_2-1)/dt, t_2 ) )
 
    const blep2 = g.switch(
      case1_2,
      adjustedT_2 + adjustedT_2 - adjustedT_2 * adjustedT_2 - 1,
      g.switch(
        case2_2,
        adjustedT_2 * adjustedT_2 + adjustedT_2 + adjustedT_2 + 1,
        0
      )
    )
    osc = osc - blep2
    
    // leaky integrator to create triangle from square wave
    if( type === 'triangle' ) {
      osc = dt * osc + (1 - dt ) * mem.out
      mem.in( osc )
    }
  }else{
    osc = osc - blep
  }
  
  return osc
}

module.exports = polyBlep 

},{"genish.js":51}],205:[function(require,module,exports){
let g = require( 'genish.js' ),
    ugen = require( '../ugen.js' )()

module.exports = function( Gibberish ) {

  const Wavetable = function( inputProps ) {
    const wavetable = Object.create( ugen )
    const props  = Object.assign({}, Gibberish.oscillators.defaults, inputProps )
    const osc = g.wavetable( g.in('frequency'), props )
    const graph = g.mul( 
      osc, 
      g.in( 'gain' )
    )

    Gibberish.factory( wavetable, graph, 'wavetable', props )

    return wavetable
  }

  g.wavetable = function( frequency, props ) {
    let dataProps = { immutable:true }

    // use global references if applicable
    if( props.name !== undefined ) dataProps.global = props.name

    const buffer = g.data( props.buffer, 1, dataProps )

    return g.peek( buffer, g.phasor( frequency, 0, { min:0 } ) )
  }

  return Wavetable
}

},{"../ugen.js":210,"genish.js":51}],206:[function(require,module,exports){
const Queue = require( '../external/priorityqueue.js' )

let Gibberish = null

const Scheduler = {
  phase: 0,

  queue: new Queue( ( a, b ) => {
    if( a.time === b.time ) { 
      return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
    }else{
      return a.time - b.time //a.time.minus( b.time )
    }
  }),

  init( __Gibberish ) {
    Gibberish = __Gibberish
  },

  clear() {
    this.queue.data.length = 0
    this.queue.length = 0
    this.phase = 0
  },

  add( time, func, priority = 0 ) {
    time += this.phase

    this.queue.push({ time, func, priority })

    return this.phase
  },

  tick( usingSync = false ) {
    if( this.shouldSync === usingSync ) {
      if( this.queue.length ) {
        let next = this.queue.peek()

        if( isNaN( next.time ) ) {
          this.queue.pop()
        }
        
        while( this.phase >= next.time ) {
          next.func( next.priority )
          this.queue.pop()
          next = this.queue.peek()

          // XXX this happens when calling sequencer.stop()... why?
          if( next === undefined ) break
        }
      }

      this.phase++
    }

    return this.phase
  },

  advance( amt ) {
    this.phase += amt
    this.tick( true )
  }
}

let shouldSync = false
Object.defineProperty( Scheduler, 'shouldSync', {
  get() { return shouldSync },
  set(v){ 
    shouldSync = v
    if( Gibberish.mode === 'worklet' ) {
      Gibberish.worklet.port.postMessage({
        address:'eval',
        code:'Gibberish.scheduler.shouldSync = ' + v
      })
    }
  }
})

module.exports = Scheduler

},{"../external/priorityqueue.js":149}],207:[function(require,module,exports){
const g = require( 'genish.js' ),
      __proxy = require( '../workletProxy.js' ),
      ugen = require( '../ugen.js' )()

module.exports = function( Gibberish ) {
  const __proto__ = Object.create( ugen )

  const proxy = __proxy( Gibberish )

  Object.assign( __proto__, {
    start( delay=0 ) {
      if( delay !== 0 ) {
        Gibberish.scheduler.add( delay, ()=> {
          Gibberish.analyzers.push( this )
          Gibberish.dirty( Gibberish.analyzers )
        })
      }else{
        Gibberish.analyzers.push( this )
        Gibberish.dirty( Gibberish.analyzers )
      }
      return this
    },
    stop( delay=0 ) {
      const idx = Gibberish.analyzers.indexOf( this )
      if( delay === 0 ) {
        if( idx > -1 ) {
          Gibberish.analyzers.splice( idx, 1 )
          Gibberish.dirty( Gibberish.analyzers )
        }
        this.phase = 0
        this.nextTime = 0
      }else{
        Gibberish.scheduler.add( delay, ()=> {
          if( idx > -1 ) {
            Gibberish.analyzers.splice( idx, 1 )
            Gibberish.dirty( Gibberish.analyzers )
          }
          this.phase = 0
          this.nextTime = 0
        })
      }

      return this
    },
    fire(){
      let value  = typeof this.values  === 'function' ? this.values  : this.values[ this.__valuesPhase++  % this.values.length  ]
      if( typeof value === 'function' && this.target === undefined ) {
        value()
      }else if( typeof this.target[ this.key ] === 'function' ) {
        if( typeof value === 'function' ) {
          value = value()
        }
        if( value !== this.DNR ) {
          this.target[ this.key ]( value )
        }
      }else{
        if( typeof value === 'function' ) value = value()
        if( value !== this.DNR )
          this.target[ this.key ] = value
      }
    }
  })

  // XXX we need to implement priority, which will in turn determine the order
  // that the sequencers are added to the callback function.
  const Seq2 = { 
    create( inputProps ) {
      const seq = Object.create( __proto__ ),
            properties = Object.assign({}, Seq2.defaults, inputProps )

      seq.phase = 0
      seq.inputNames = [ 'rate', 'density' ]
      seq.inputs = [ 1, 1 ]
      seq.nextTime = 0
      seq.__valuesPhase = 0
      seq.__timingsPhase = 0
      seq.id = Gibberish.factory.getUID()
      seq.dirty = true
      seq.type = 'seq'
      seq.__addresses__ = {}
      seq.DNR = -987654321

      properties.id = Gibberish.factory.getUID()

      Object.assign( seq, properties ) 
      seq.__properties__ = properties

      // support for sequences that are triggered via other means,
      // in Gibber this is when you provide timing to one sequence
      // on an object and want to use that one pattern to trigger
      // multiple sequences.
      if( seq.timings === null ) { seq.nextTime = Infinity } 

      // XXX this needs to be optimized as much as humanly possible, since it's running at audio rate...
      seq.callback = function( rate, density ) {
        while( seq.phase >= seq.nextTime ) {
          let value  = typeof seq.values  === 'function' ? seq.values  : seq.values[ seq.__valuesPhase++  % seq.values.length  ],
              shouldRun = true
          
          let timing = null
          if( seq.timings !== null && seq.timings !== undefined ) { 
            timing = typeof seq.timings === 'function' ? seq.timings : seq.timings[ seq.__timingsPhase++ % seq.timings.length ]
            if( typeof timing === 'function' ) timing = timing()
          }
          
          let shouldIncreaseSpeed = density <= 1 ? false : true

          // XXX this supports an edge case in Gibber, where patterns like Euclid / Hex return
          // objects indicating both whether or not they should should trigger values as well
          // as the next time they should run. perhaps this could be made more generalizable?
          if( timing !== null && typeof timing === 'object' ) {
            if( timing.shouldExecute === 1 ) {
              shouldRun = true
            }else{
              shouldRun = false
            }
            timing = timing.time 
          }else if( timing !== null ) {
            if( Math.random() >= density ) shouldRun = false
          }

          if( shouldRun ) {
            if( seq.mainthreadonly !== undefined ) {
              if( typeof value === 'function' ) {
                value = value()
              }
              Gibberish.processor.messages.push( seq.mainthreadonly, seq.key, value )
            }else if( typeof value === 'function' && seq.target === undefined ) {
              value()
            }else if( typeof seq.target[ seq.key ] === 'function' ) {
              if( typeof value === 'function' ) {
                value = value()
              }
              if( value !== seq.DNR ) {
                seq.target[ seq.key ]( value )
              }
            }else{
              if( typeof value === 'function' ) value = value()
              if( value !== seq.DNR )
                seq.target[ seq.key ] = value
            }
          }

          if( timing === null ) return

          seq.phase -= seq.nextTime

          if( shouldIncreaseSpeed ) {
            timing = Math.random() > (2 - density) ? timing / 2 : timing
          }
          seq.nextTime = timing
        }

        seq.phase += rate

        return 0
      }

      seq.ugenName = seq.callback.ugenName = 'seq_' + seq.id

      // since we're not passing our sequencer through the ugen template, we need
      // to grab a memory address for its rate so it can be sequenced and define
      // a property that manipulates that memory address.
      const idx = Gibberish.memory.alloc( 1 )
      Gibberish.memory.heap[ idx ] = seq.rate
      seq.__addresses__.rate = idx

      let value = seq.rate
      Object.defineProperty( seq, 'rate', {
        get() { return value },
        set( v ) {
          if( value !== v ) {
            if( typeof v === 'number' ) Gibberish.memory.heap[ idx ] = v

            Gibberish.dirty( Gibberish.analyzers )
            value = v
          }
        }
      })

      const didx = Gibberish.memory.alloc( 1 )
      Gibberish.memory.heap[ didx ] = seq.density
      seq.__addresses__.density = didx

      let dvalue = seq.density
      Object.defineProperty( seq, 'density', {
        get() { return dvalue },
        set( v ) {
          if( dvalue !== v ) {
            if( typeof v === 'number' ) Gibberish.memory.heap[ didx ] = v

            Gibberish.dirty( Gibberish.analyzers )
            dvalue = v
          }
        }
      })

      if( Gibberish.mode === 'worklet' ) {
        Gibberish.utilities.createPubSub( seq )
      }

      return proxy( ['Sequencer2'], properties, seq ) 
    }
  }

  Seq2.defaults = { rate: 1, density:1, priority:0, phase:0 }
  Seq2.create.DO_NOT_OUTPUT = -987654321

  return Seq2.create

}


},{"../ugen.js":210,"../workletProxy.js":212,"genish.js":51}],208:[function(require,module,exports){
(function (global){(function (){
const __proxy = require( '../workletProxy.js' )

module.exports = function( Gibberish ) {

const renderFnc = function( pattern ) {
  const keys = Object.keys( pattern.dict )
  const objs = Object.values( pattern.dict )
    .map( v => typeof v === 'object' && !Array.isArray( v )
    ? Gibberish.processor.ugens.get(v.id) 
    : v 
    )

  // we create a new inner function using the function constructor,
  // where every argument is codegen'd as an upvalue to the
  // returned function. after codegen we call the functon
  // to get the inner function with the upvalues andd
  // return that. Store references to globals as upvalues as well.
  let code = 'let Gibberish = __Gibberish, global = __global;\n'
  keys.forEach( k => {
    let line = `let ${k} = `
    const value = pattern.dict[ k ]
    const getter = typeof value === 'object' 
      ? Array.isArray( value )
      ? `[${value.toString()}]`
      : `Gibberish.processor.ugens.get(${ value.id })`
      : value
    line += getter 
    code += line + '\n'

  })  
  code +=`return function() { ${ pattern.fncstr } }` 

  // pass in globals to be used as upvalues in final function
  const fnc = new Function( '__Gibberish', '__global', code )( Gibberish, global )

  return fnc 
}

const proxy = __proxy( Gibberish )

const Sequencer = props => {
  let __seq
  let floatError = 0

  const seq = {
    type:'seq',
    __isRunning:false,
    __valuesPhase:  0,
    __timingsPhase: 0,
    __onlyRunsOnce: false,
    __repeatCount: null,
    DNR : -987654321,

    tick( priority ) {
      let value  = typeof seq.values  === 'function' 
          ? seq.values  
          : seq.values[  seq.__valuesPhase++  % seq.values.length  ],

        timing = typeof seq.timings === 'function' 
          ? seq.timings 
          : seq.timings !== null
            ? seq.timings[ seq.__timingsPhase++ % seq.timings.length ]
            : null,

        shouldRun = true
      
      if( seq.__onlyRunsOnce === true ) {
        if( seq.__valuesPhase === seq.values.length ) {
          seq.stop()
        }
      }else if( seq.__repeatCount !== null ) {
        if( seq.__valuesPhase % seq.values.length === 0 ) {
          seq.__repeatCount--
          if( seq.__repeatCount === 0 ) {
            seq.stop()
            seq.__repeatCount = null
          }
        }
      }

      if( typeof timing === 'function' ) timing = timing()

      // XXX this supports an edge case in Gibber, where patterns like Euclid / Hex return
      // objects indicating both whether or not they should should trigger values as well
      // as the next time they should run. perhaps this could be made more generalizable?
      if( timing !== null ) {
        if( typeof timing === 'object' ) {
          if( timing.shouldExecute === 1 ) {
            shouldRun = true
          }else{
            shouldRun = false
          }
          timing = timing.time 
        }

        timing *= seq.rate
      }else{
        shouldRun = false 
      }

      if( value === Sequencer.DO_NOT_OUTPUT ) shouldRun = false

      if( shouldRun ) {
        try{
          if( seq.mainthreadonly !== undefined ) {
            if( typeof value === 'function' ) {
              value = value()
            }
            //console.log( 'main thread only' )
            Gibberish.processor.messages.push( seq.mainthreadonly, seq.key, value )
          }else if( typeof value === 'function' && seq.target === undefined ) {
            value()
          }else if( typeof seq.target[ seq.key ] === 'function' ) {
            //console.log( seq.key, seq.target )
            if( typeof value === 'function' ) value = value()
            if( value !== seq.DNR )
              seq.target[ seq.key ]( value )
          }else{
            if( typeof value === 'function' ) value = value()
            if( value !== seq.DNR )
              seq.target[ seq.key ] = value
          }

          if( seq.reportOutput === true ) {
            Gibberish.processor.port.postMessage({
              address:'__sequencer',
              id: seq.id,
              name:'output',
              value,
              phase: seq.__valuesPhase,
              length: seq.values.length
            })
          }
        } catch(e) {
          console.error( `A sequence targeting ${seq.target.ugenName}.${seq.key} contains an improper value and will be stopped.` )
          return
        }
      }
      
      if( Gibberish.mode === 'processor' ) {
        if( seq.__isRunning === true && !isNaN( timing ) && seq.autotrig === false ) {
          timing += floatError
          Gibberish.scheduler.add( timing, seq.tick, seq.priority )
          floatError = timing - Math.floor( timing )
        }
      }
    },
    fire(){
      let value  = typeof this.values  === 'function' ? this.values  : this.values[ this.__valuesPhase++  % this.values.length  ]
      if( typeof value === 'function' && this.target === undefined ) {
        value()
      }else if( typeof this.target[ this.key ] === 'function' ) {
        if( typeof value === 'function' ) {
          value = value()
        }
        if( value !== this.DNR ) {
          this.target[ this.key ]( value )
        }
      }else{
        if( typeof value === 'function' ) value = value()
        if( value !== this.DNR )
          this.target[ this.key ] = value
      }
    },

    start( delay = 0 ) {
      if( Gibberish.mode === 'processor' && seq.__isRunning === false ) {
        Gibberish.scheduler.add( 
          delay, 
          priority => {
            seq.tick( priority )
            Gibberish.processor.port.postMessage({
              address:'__sequencer',
              id: seq.id,
              name:'start'
            })
          }, 
          seq.priority 
        )
      }
      seq.__isRunning = true
      seq.__delay = delay
      return __seq
    },

    stop( delay = null ) {
      if( delay === null ) {
        seq.__isRunning = false

        if( Gibberish.mode === 'processor' ) {
          Gibberish.processor.port.postMessage({
            address:'__sequencer',
            id: seq.id,
            name:'stop'
          })
        }
      
      }else{
        Gibberish.scheduler.add( delay, seq.stop )
      }
      return __seq
    },

    once() {
      seq.__onlyRunsOnce = true
      return __seq
    },

    repeat( repeatCount = 2 ) {
      seq.__repeatCount = repeatCount
      return __seq
    }
  }

  props.id = Gibberish.factory.getUID()

  if( Gibberish.mode === 'worklet' ) {
    Gibberish.utilities.createPubSub( seq )
  }else{
    // need a separate reference to the properties for worklet meta-programming
    if( typeof props.values === 'object' && props.values.requiresRender === true ) {
      props.values = renderFnc( props.values )
    }
    if( props.timings !== null && typeof props.timings === 'object' && props.timings.requiresRender === true ) {
      props.timings = renderFnc( props.timings )
    }
  }

  const properties = Object.assign( {}, Sequencer.defaults, props )
  Object.assign( seq, properties ) 
  seq.__properties__ = properties

  __seq =  proxy( ['Sequencer'], properties, seq )

  return __seq
}

Sequencer.defaults = { priority:100, rate:1, reportOutput:false, autotrig:false }

Sequencer.make = function( values, timings, target, key, priority, reportOutput ) {
  return Sequencer({ values, timings, target, key, priority, reportOutput })
}

Sequencer.DO_NOT_OUTPUT = -987654321

return Sequencer

}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../workletProxy.js":212}],209:[function(require,module,exports){
const __proxy = require( '../workletProxy.js' )
const Pattern = require( 'tidal.pegjs' )

module.exports = function( Gibberish ) {

const proxy = __proxy( Gibberish )

const Sequencer = props => {
  let __seq
  const seq = {
    __isRunning:false,

    __phase:  0,
    __type:'seq',
    __pattern: Pattern( props.pattern, { addLocations:true, addUID:true, enclose:true }),
    __events: null,

    tick( priority ) {
      // running for first time, perform a query
      if( seq.__events === null || seq.__events.length === 0 ) {
        seq.__events = seq.__pattern.query( seq.__phase++, 1 )
      }

      // used when scheduling events that are very far apart
      if( seq.__events.length <= 0 ) {
        if( Gibberish.mode === 'processor' ) {
          if( seq.__isRunning === true  ) {
            Gibberish.scheduler.add( Gibberish.ctx.sampleRate / Sequencer.clock.cps, seq.tick, seq.priority )
          }

        }

        return
      }

      const startTime = seq.__events[ 0 ].arc.start

      if( seq.key !== 'chord' ) {
        while( seq.__events.length > 0 && startTime.valueOf() === seq.__events[0].arc.start.valueOf() ) {
          let event  = seq.__events.shift(),
              value  = event.value,
              uid    = event.uid

          // for bjorklund etc.
          if( typeof value === 'object' ) value = value.value

          if( seq.filters !== null ) value = seq.filters.reduce( (currentValue, filter) => filter( currentValue, seq, uid ), value )  
          if( seq.mainthreadonly !== undefined ) {
            if( typeof value === 'function' ) {
              value = value()
            }
            Gibberish.processor.messages.push( seq.mainthreadonly, seq.key, value )
          }else if( typeof seq.target[ seq.key ] === 'function' ) {
            seq.target[ seq.key ]( value )
          }else{
            seq.target[ seq.key ] = value
          }
        }
      }else{
        let value = seq.__events.filter( evt => startTime.valueOf() === evt.arc.start.valueOf() ).map( evt => evt.value )
        let uid = seq.__events[0].uid

        const events = seq.__events.splice( 0, value.length )

        if( seq.filters !== null ) {
          if( value.length === 1 ) {
            value = seq.filters.reduce( (currentValue, filter) => filter( currentValue, seq, uid ), value )  
          }else{
            value.forEach( (v,i) => seq.filters.reduce( (currentValue, filter) => filter( currentValue, seq, events[ i ].uid ), v ) )
          }
        }

        if( typeof seq.target[ seq.key ] === 'function' ) {
          seq.target[ seq.key ]( value )
        }else{
          seq.target[ seq.key ] = value
        }
      }

      if( Gibberish.mode === 'processor' ) {
        let timing
        if( seq.__events.length <= 0 ) {
          let time = 0
          while( seq.__events.length <= 0 ) {
            seq.__events = seq.__pattern.query( seq.__phase++, 1 )
            time++
          }
          //seq.__events.forEach( evt => {
          //  evt.arc.start = evt.arc.start.add( 1 ).sub( startTime ) 
          //  evt.arc.end   = evt.arc.end.add( 1 ).sub( startTime )
          //})

          timing = time - startTime.valueOf() 
        }else{
          timing = seq.__events[0].arc.start.sub( startTime ).valueOf() 
        }
        
        timing *= Math.ceil( Gibberish.ctx.sampleRate / Sequencer.clock.cps ) + 1 

        if( seq.__isRunning === true && !isNaN( timing ) && timing > 0 ) {
          // XXX this supports an edge case in Gibber, where patterns like Euclid / Hex return
          // objects indicating both whether or not they should should trigger values as well
          // as the next time they should run. perhaps this could be made more generalizable?
          
          //if( typeof timing === 'object' ) {
          //  if( timing.shouldExecute === 1 ) {
          //    shouldRun = true
          //  }else{
          //    shouldRun = false
          //  }
          //  timing = timing.time 
          //}

          //timing *= seq.rate

          Gibberish.scheduler.add( timing, seq.tick, seq.priority )
        }
      }


    },

    rotate( amt ) {
      seq.__phase += amt
      return __seq 
    },

    start( delay = 0 ) {
      seq.__isRunning = true
      Gibberish.scheduler.add( delay, seq.tick, seq.priority )
      return __seq
    },

    stop() {
      seq.__isRunning = false
      return __seq
    },

    set( patternString ) {
      seq.__pattern = Pattern( patternString, { addLocations:true, addUID:true, enclose:true })

    }
  }

  props.id = Gibberish.factory.getUID()

  // need a separate reference to the properties for worklet meta-programming
  const properties = Object.assign( {}, Sequencer.defaults, props )
  Object.assign( seq, properties ) 
  seq.__properties__ = properties

  __seq =  proxy( ['Tidal'], properties, seq )

  return __seq
}

Sequencer.defaults = { priority:100000, pattern:'', rate:1, filters:null }

Sequencer.make = function( values, timings, target, key, priority ) {
  return Sequencer({ values, timings, target, key, priority })
}

let __uid = 0
Sequencer.getUID = ()=> {
  return __uid++
}

Sequencer.Pattern = Pattern

Sequencer.clock = { cps: 1 }

Sequencer.id = Gibberish.utilities.getUID()

if( Gibberish.mode === 'worklet' ) {
  Gibberish.worklet.port.postMessage({
    address:'eval',
    code:`Gibberish.Tidal.clock.id = ${Sequencer.id}; Gibberish.ugens.set( ${Sequencer.id}, Gibberish.Tidal.clock )`
  })
  
  let cps = 1
  Object.defineProperty( Sequencer, 'cps', {
    get() { return cps },
    set(v){ 
      cps = v
      if( Gibberish.mode === 'worklet' ) {
        Gibberish.worklet.port.postMessage({
          address:'set',
          object:Sequencer.id,
          name:'cps',
          value:cps 
        }) 
      }
    }
  })
}

return Sequencer

}

},{"../workletProxy.js":212,"tidal.pegjs":233}],210:[function(require,module,exports){
let Gibberish = null

const __ugen = function( __Gibberish ) {
  if( __Gibberish !== undefined && Gibberish == null ) Gibberish = __Gibberish
 
  const replace = obj => {
    if( typeof obj === 'object' ) {
      if( obj.id !== undefined ) {
        return processor.ugens.get( obj.id )
      } 
    }

    return obj
  }

  const ugen = {
    __Gibberish:Gibberish,

    free:function() {
      Gibberish.genish.gen.free( this.graph )
    },

    print:function() {
      console.log( this.callback.toString() )
    },

    connect:function( target, level=1 ) {
      if( this.connected === undefined ) this.connected = []

      //let input = level === 1 ? this : Gibberish.binops.Mul( this, level )
      let input = this

      if( target === undefined || target === null ) target = Gibberish.output 


      // XXX I forgot, where is __addInput found? Can we control the
      // level of the input?
      if( typeof target.__addInput == 'function' ) {
        target.__addInput( input )
      } else if( target.sum && target.sum.inputs ) {
        target.sum.inputs.push( input )
      } else if( target.inputs ) {
        const idx = target.inputs.indexOf( input )

        // if no connection exists...
        if( idx === -1 ) {
          target.inputs.unshift( input, level, input.isStereo )
        }else{
          // ... otherwise update the connection's level, which is stored
          // one index higher in the input list.
          target.inputs[ idx + 1 ] = level
        }
      } else {
        target.input = input
        target.inputGain = level
      }

      Gibberish.dirty( target )

      this.connected.push([ target, input, level ])
      
      return this
    },

    disconnect:function( target ) {
      if( target === undefined ){
        if( Array.isArray( this.connected ) ) {
          for( let connection of this.connected ) {
            if( connection[0].disconnectUgen !== undefined ) {
              connection[0].disconnectUgen( connection[1] )
            }else if( connection[0].input === this ) {
              connection[0].input = 0
            }
          }
          this.connected.length = 0
        }
      }else{
        const connection = this.connected.find( v => v[0] === target )
        // if target is a bus...
        if( target.disconnectUgen !== undefined ) {
          if( connection !== undefined ) {
            target.disconnectUgen( connection[1] )
          }
        }else{
          // must be an effect, set input to 0
          target.input = 0
        }

        const targetIdx = this.connected.indexOf( connection )

        if( targetIdx !== -1 ) {
          this.connected.splice( targetIdx, 1 )
        }
      }
    },

    chain:function( target, level=1 ) {
      this.connect( target,level )

      return target
    },

    __redoGraph:function() {
      let isStereo = this.isStereo
      this.__createGraph()
      this.callback = Gibberish.genish.gen.createCallback( this.graph, Gibberish.memory, false, true )
      this.inputNames = new Set( Gibberish.genish.gen.parameters ) 
      this.callback.ugenName = this.ugenName
      Gibberish.dirty( this )

      // if channel count has changed after recompiling graph...
      if( isStereo !== this.isStereo ) {

        // check for any connections before iterating...
        if( this.connected === undefined ) return
        // loop through all busses the ugen is connected to
        for( let connection of this.connected ) {
          // set the dirty flag of the bus
          Gibberish.dirty( connection[ 0 ] )

          // check for inputs array, which indicates connection is to a bus
          if( connection[0].inputs !== undefined ) {
            // find the input in the busses 'inputs' array
            const inputIdx = connection[ 0 ].inputs.indexOf( connection[ 1 ] )

            // assumiing it is found...
            if( inputIdx !== -1 ) {
              // change stereo field
              connection[ 0 ].inputs[ inputIdx + 2 ] = this.isStereo
            }
          }else if( connection[0].input !== undefined ) {
            if( connection[0].__redoGraph !== undefined ) {
              connection[0].__redoGraph()
            }
          }
        }
      }
    },
  }

  return ugen

}

module.exports = __ugen

},{}],211:[function(require,module,exports){
const genish = require( 'genish.js' ),
      AWPF = require( './external/audioworklet-polyfill.js' )

module.exports = function( Gibberish ) {

let uid = 0
const utilities = {
  Make: function( props ){
    const name = props.name || 'Ugen' + (Math.floor( Math.random()*10000 ) )
    const type = props.type || 'Ugen'
    const properties = props.properties || {}
    const block = `
    const ugen = Object.create( Gibberish.prototypes[ '${type}' ] )
    const graphfnc = ${props.constructor.toString()}

    const proxy = Gibberish.factory( ugen, graphfnc(), '${name}', ${JSON.stringify(properties)} )
    if( typeof props === 'object' ) Object.assign( proxy, props )

    return proxy`

    Gibberish[ name ] = new Function( 'props', block )

    Gibberish.worklet.port.postMessage({
      name,
      address:'addConstructor',
      constructorString:`function( Gibberish ) {
      const fnc = ${Gibberish[ name ].toString()}

      return fnc
    }`
    })

    return Gibberish[ name ]
  },

  createContext( ctx, cb, resolve, bufferSize=2048 ) {
    let AC = typeof AudioContext === 'undefined' ? webkitAudioContext : AudioContext

    AWPF( window, bufferSize )

    const start = () => {
      if( typeof AC !== 'undefined' ) {
        this.ctx = Gibberish.ctx = ctx === undefined ? new AC({ latencyHint:.025 }) : ctx

        genish.gen.samplerate = this.ctx.sampleRate
        genish.utilities.ctx = this.ctx

        if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
          window.removeEventListener( 'touchstart', start )
        }else{
          window.removeEventListener( 'mousedown', start )
          window.removeEventListener( 'keydown', start )
        }

        const mySource = utilities.ctx.createBufferSource()
        mySource.connect( utilities.ctx.destination )
        mySource.start()
      }

      if( typeof cb === 'function' ) cb( resolve )
    }

    if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
      window.addEventListener( 'touchstart', start )
    }else{
      window.addEventListener( 'mousedown', start )
      window.addEventListener( 'keydown', start )
    }

    return Gibberish.ctx
  },
  
  createWorklet( resolve ) {
    Gibberish.ctx.audioWorklet.addModule( Gibberish.workletPath ).then( () => {
      Gibberish.worklet = new AudioWorkletNode( Gibberish.ctx, 'gibberish', { outputChannelCount:[2] } )

      Gibberish.worklet.connect( Gibberish.ctx.destination )
      Gibberish.worklet.port.onmessage = event => {
        const callback = Gibberish.utilities.workletHandlers[ event.data.address ]
        if( typeof callback === 'function' ) callback( event )     
      }
      Gibberish.worklet.ugens = new Map()

      resolve()
    })
  },

  future( fnc, time, dict ) {
    const keys = Object.keys( dict )
    const code = `
      const fnc = ${fnc.toString()}
      const args = [${keys.map( key => typeof dict[key] === 'object' ? dict[ key ].id : `'${dict[ key]}'` ).join(',')}]
      const objs = args.map( v => typeof v === 'number' ? Gibberish.processor.ugens.get(v) : v )
      Gibberish.scheduler.add( ${time}, ()=> fnc( ...objs ), 1 )
    ` 
    Gibberish.worklet.port.postMessage({ 
      address:'eval', 
      code
    })
  },

  workletHandlers: {
    phase( event ) {
      Gibberish.phase = event.data.value
      if( typeof Gibberish.onphaseupdate === 'function' ) {
        Gibberish.onphaseupdate( Gibberish.phase )
      }
    },
    __sequencer( event ) {
      const message = event.data
      const id = message.id
      const eventName = message.name
      const obj = Gibberish.worklet.ugens.get( id )
      if( obj !== undefined && obj.publish !== undefined )
        obj.publish( eventName, message )
    },
    callback( event ) {
      if( typeof Gibberish.oncallback === 'function' ) {
        Gibberish.oncallback( event.data.code )
      }
    },
    get( event ) {
      let name = event.data.name
      let value
      if( name[0] === 'Gibberish' ) {
        value = Gibberish
        name.shift()
      }
      for( let segment of name ) {
        value = value[ segment ]
      }

      Gibberish.worklet.port.postMessage({
        address:'set',
        name:'Gibberish.' + name.join('.'),
        value
      })
    },
    state( event ){
      const messages = event.data.messages
      if( messages.length === 0 ) return

      // XXX is preventProxy actually used?
      Gibberish.preventProxy = true
      Gibberish.proxyEnabled = false

      let i = 0
      while( i < messages.length ) {
        const id = messages[ i ] 
        const propName = messages[ i + 1 ]
        const valueL = messages[ i + 2 ]
        const valueR = messages[ i + 3 ]
        const value = valueL
        const obj = Gibberish.worklet.ugens.get( id )

        if( Gibberish.worklet.debug === true ) {
          if( propName !== 'output' ) console.log( propName, value, id )
        }

        if( typeof propName !== 'string' ) continue
        
        if( obj !== undefined && propName.indexOf('.') === -1 && propName !== 'id' ) { 
          if( obj[ propName ] !== undefined ) {
            if( typeof obj[ propName ] !== 'function' ) {
              if( propName === 'output' ) {
                obj[ propName ] = [ valueL, valueR ]
              }else{
                obj[ propName ] = value
              }
            }else{
              obj[ propName ]( value )
            }
          }else{
            obj[ propName ] = value
          }
        }else if( obj !== undefined ) {
          const propSplit = propName.split('.')
          if( obj[ propSplit[ 0 ] ] !== undefined ) {
            if( propSplit[1] !== undefined ) {
              if( typeof obj[ propSplit[ 0 ] ][ propSplit[ 1 ] ] !== 'function' ) {
                obj[ propSplit[ 0 ] ][ propSplit[ 1 ] ] = value
              }else{
                obj[ propSplit[ 0 ] ][ propSplit[ 1 ] ]( value )
              }
            }
          }else{
            //console.log( 'undefined split property!', id, propSplit[0], propSplit[1], value, obj )
          }
        }
        // XXX double check and make sure this isn't getting sent back to processornode...
        // console.log( propName, value, obj )
        i += propName === 'output' ? 4 : 3
      }
      Gibberish.preventProxy = false
      Gibberish.proxyEnabled = true
    }
  },

  createPubSub( obj ) {
    const events = {}
    obj.on = function( key, fcn ) {
      if( typeof events[ key ] === 'undefined' ) {
        events[ key ] = []
      }
      events[ key ].push( fcn )
      return obj
    }

    obj.off = function( key, fcn ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.splice( arr.indexOf( fcn ), 1 )
      }
      return obj
    }

    obj.publish = function( key, data ) {
      if( typeof events[ key ] !== 'undefined' ) {
        const arr = events[ key ]

        arr.forEach( v => v( data ) )
      }
      return obj
    }
  },

  wrap( func, ...args ) {
    const out = {
      action:'wrap',
      value:func,
      // must return objects containing only the id number to avoid
      // creating circular JSON references that would result from passing actual ugens
      args: args.map( v => { return { id:v.id } })
    }
    return out
  },

  // for wrapping upvalues in a dictionary and passing function across thread
  // to be reconstructed.
  // ex; wrapped = fn( ()=> { return Math.random() * test }, { test:20 })
  // syn.note.seq( wrapped, 1/4 )
  fn( fnc, dict={}) {
    const fncstr = fnc.toString()
    const firstBracketIdx = fncstr.indexOf('{')
    const code = fncstr.slice(firstBracketIdx+1, -1 )
    const s = { requiresRender:true, filters:[], fncstr:code, args:[], dict, addFilter( f ) { this.filters.push(f) } }  
    return s
  },

  run( fnc ) { 
    const str = fnc.tostring()
    const idx = str.indexof('=>') + 2
    const code = str.slice( idx ).trim()
    Gibberish.worklet.port.postMessage({ 
      address:'eval',
      code
    })
  },

  export( obj ) {
    obj.wrap = this.wrap
    obj.future = this.future
    obj.Make = this.Make
  },

  getUID() { return uid++ },

  base64 : {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // will return a  Uint8Array type
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },
    decode: function(input, arrayBuffer) {
      //get last chars to see if are valid
      var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
      var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));		 
      var bytes = (input.length/4) * 3;
      if (lkey1 == 64) bytes--; //padding chars, so skip
      if (lkey2 == 64) bytes--; //padding chars, so skip
      var uarray;
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      var j = 0;
      if (arrayBuffer)
          uarray = new Uint8Array(arrayBuffer);
      else
          uarray = new Uint8Array(bytes);
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      for (i=0; i<bytes; i+=3) {	
          //get the 3 octects in 4 ascii chars
          enc1 = this._keyStr.indexOf(input.charAt(j++));
          enc2 = this._keyStr.indexOf(input.charAt(j++));
          enc3 = this._keyStr.indexOf(input.charAt(j++));
          enc4 = this._keyStr.indexOf(input.charAt(j++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          uarray[i] = chr1;			
          if (enc3 != 64) uarray[i+1] = chr2;
          if (enc4 != 64) uarray[i+2] = chr3;
      }
      return uarray;	
    }
  }
}

return utilities

}

},{"./external/audioworklet-polyfill.js":148,"genish.js":51}],212:[function(require,module,exports){
const serialize = require('serialize-javascript')

module.exports = function( Gibberish ) {

const replaceObj = function( obj, shouldSerializeFunctions = true ) {
  if( typeof obj === 'object' && obj !== null && obj.id !== undefined ) {
    if( obj.__type !== 'seq' ) { // XXX why?
      return { id:obj.id, prop:obj.prop }
    }else{
      // shouldn't I be serializing most objects, not just seqs?
      return serialize( obj )
    }
  }else if( typeof obj === 'function' && shouldSerializeFunctions === true ) {
    return { isFunc:true, value:serialize( obj ) }
  }
  return obj
}

const makeAndSendObject = function( __name, values, obj ) {
  const properties = {}

  // object has already been sent through messageport...

  for( let key in values ) {
    const alreadyProcessed = (typeof values[ key ] === 'object' && values[ key ] !== null && values[ key ].__meta__ !== undefined) ||
      (typeof values[key] === 'function' && values[ key ].__meta__ !== undefined )

    if( alreadyProcessed ) { 
      properties[ key ] = { id:values[ key ].__meta__.id }
    }else if( Array.isArray( values[ key ] ) ) {
      const arr = []
      for( let i = 0; i < values[ key ].length; i++ ) {
        arr[ i ] = replaceObj( values[ key ][i], false  )
      }
      properties[ key ] = arr
    }else if( typeof values[key] === 'object' && values[key] !== null ){
      properties[ key ] = replaceObj( values[ key ], false )
    }else{
      properties[ key ] = values[ key ]
    }
  }

  let serializedProperties = serialize( properties )

  if( Array.isArray( __name ) ) {
    const oldName = __name[ __name.length - 1 ]
    __name[ __name.length - 1 ] = oldName[0].toUpperCase() + oldName.substring(1)
  }else{
    __name = [ __name[0].toUpperCase() + __name.substring(1) ]
  }

  obj.__meta__ = {
    address:'add',
    name:__name,
    properties:serializedProperties, 
    id:obj.id
  }

  Gibberish.worklet.ugens.set( obj.id, obj )

  Gibberish.worklet.port.postMessage( obj.__meta__ )
}

const doNotProxy = [ 'connected', 'input', 'wrap', 'callback', 'inputNames', 'on', 'off','publish' ]
   
const __proxy = function( __name, values, obj ) {

  if( Gibberish.mode === 'worklet' && Gibberish.preventProxy === false ) {
    makeAndSendObject( __name, values, obj )

    // proxy for all method calls to send to worklet
    const proxy = new Proxy( obj, {
      get( target, prop, receiver ) {
        if( typeof target[ prop ] === 'function' && prop.indexOf('__') === -1 && doNotProxy.indexOf( prop ) === -1 ) {
          const proxy = new Proxy( target[ prop ], {
            apply( __target, thisArg, args ) {

              if( Gibberish.proxyEnabled === true ) {
                const __args = args.map( __value => replaceObj( __value, true ) )

                Gibberish.worklet.port.postMessage({ 
                  address:'method', 
                  object:obj.id,
                  name:prop,
                  args:__args
                })
              }

              const temp = Gibberish.proxyEnabled
              Gibberish.proxyEnabled = false
              const out =  __target.apply( thisArg, args )
              Gibberish.proxyEnabled = temp
              return out
            }
          })
          
          return proxy
        }

        return target[ prop ]
      },
      set( target, prop, value, receiver ) {
        if( doNotProxy.indexOf( prop ) === -1 ) { 
          if( Gibberish.proxyEnabled === true ) {
            const __value = replaceObj( value )

            if( __value !== undefined ) {
              Gibberish.worklet.port.postMessage({ 
                address:'set', 
                object:obj.id,
                name:prop,
                value:__value
              })
            }
          }
        }

        target[ prop ] = value

        // must return true for any ES6 proxy setter
        return true
      }
    })

    // XXX XXX XXX XXX XXX XXX
    // REMEMBER THAT YOU MUST ASSIGN THE RETURNED VALUE TO YOUR UGEN,
    // YOU CANNOT USE THIS FUNCTION TO MODIFY A UGEN IN PLACE.
    // XXX XXX XXX XXX XXX XXX

    return proxy
  }else if( Gibberish.mode === 'processor' && Gibberish.preventProxy === false ) {

    const proxy = new Proxy( obj, {
      //get( target, prop, receiver ) { return target[ prop ] },
      set( target, prop, value, receiver ) {
        let valueType = typeof value
        if( prop.indexOf('__') === -1 && valueType !== 'function' && valueType !== 'object' ) {
          if( Gibberish.processor !== undefined ) { 
            Gibberish.processor.messages.push( obj.id, prop, value )
          }
        }
        target[ prop ] = value

        // must return true for any ES6 proxy setter
        return true
      }
    })

    return proxy
  }

  return obj
}

return __proxy

}

},{"serialize-javascript":231}],213:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":214}],214:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],215:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":214}],216:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":12}],217:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],218:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":4,"has-tostringtag/shams":215}],219:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":215}],220:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"available-typed-arrays":1,"call-bind/callBound":4,"es-abstract/helpers/getOwnPropertyDescriptor":7,"foreach":9,"has-tostringtag/shams":215}],221:[function(require,module,exports){
'use strict'

let MemoryHelper = {
  create( sizeOrBuffer=4096, memtype=Float32Array ) {
    let helper = Object.create( this )

    // conveniently, buffer constructors accept either a size or an array buffer to use...
    // so, no matter which is passed to sizeOrBuffer it should work.
    Object.assign( helper, {
      heap: new memtype( sizeOrBuffer ),
      list: {},
      freeList: {}
    })

    return helper
  },

  alloc( size, immutable ) {
    let idx = -1

    if( size > this.heap.length ) {
      throw Error( 'Allocation request is larger than heap size of ' + this.heap.length )
    }

    for( let key in this.freeList ) {
      let candidate = this.freeList[ key ]

      if( candidate.size >= size ) {
        idx = key

        this.list[ idx ] = { size, immutable, references:1 }

        if( candidate.size !== size ) {
          let newIndex = idx + size,
              newFreeSize

          for( let key in this.list ) {
            if( key > newIndex ) {
              newFreeSize = key - newIndex
              this.freeList[ newIndex ] = newFreeSize
            }
          }
        }

        break
      }
    }

    if( idx !== -1 ) delete this.freeList[ idx ]

    if( idx === -1 ) {
      let keys = Object.keys( this.list ),
          lastIndex

      if( keys.length ) { // if not first allocation...
        lastIndex = parseInt( keys[ keys.length - 1 ] )

        idx = lastIndex + this.list[ lastIndex ].size
      }else{
        idx = 0
      }

      this.list[ idx ] = { size, immutable, references:1 }
    }

    if( idx + size >= this.heap.length ) {
      throw Error( 'No available blocks remain sufficient for allocation request.' )
    }
    return idx
  },

  addReference( index ) {
    if( this.list[ index ] !== undefined ) { 
      this.list[ index ].references++
    }
  },

  free( index ) {
    if( this.list[ index ] === undefined ) {
      throw Error( 'Calling free() on non-existing block.' )
    }

    let slot = this.list[ index ]
    if( slot === 0 ) return
    slot.references--

    if( slot.references === 0 && slot.immutable !== true ) {    
      this.list[ index ] = 0

      let freeBlockSize = 0
      for( let key in this.list ) {
        if( key > index ) {
          freeBlockSize = key - index
          break
        }
      }

      this.freeList[ index ] = freeBlockSize
    }
  },
}

module.exports = MemoryHelper

},{}],222:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],223:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":224,"./lib/tychei":225,"./lib/xor128":226,"./lib/xor4096":227,"./lib/xorshift7":228,"./lib/xorwow":229,"./seedrandom":230}],224:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],225:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],226:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],227:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],228:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],229:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],230:[function(require,module,exports){
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":3}],231:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

'use strict';

// Generate an internal UID to make the regexp pattern harder to guess.
var UID                 = Math.floor(Math.random() * 0x10000000000).toString(16);
var PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R|D|M|S)-' + UID + '-(\\d+)__@"', 'g');

var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var IS_PURE_FUNCTION = /function.*?\(/;
var IS_ARROW_FUNCTION = /.*?=>.*?/;
var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

var RESERVED_SYMBOLS = ['*', 'async'];

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
var ESCAPED_CHARS = {
    '<'     : '\\u003C',
    '>'     : '\\u003E',
    '/'     : '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
}

module.exports = function serialize(obj, options) {
    options || (options = {});

    // Backwards-compatibility for `space` as the second argument.
    if (typeof options === 'number' || typeof options === 'string') {
        options = {space: options};
    }

    var functions = [];
    var regexps   = [];
    var dates     = [];
    var maps      = [];
    var sets      = [];

    // Returns placeholders for functions and regexps (identified by index)
    // which are later replaced by their string representation.
    function replacer(key, value) {
        if (!value) {
            return value;
        }

        // If the value is an object w/ a toJSON method, toJSON is called before
        // the replacer runs, so we use this[key] to get the non-toJSONed value.
        var origValue = this[key];
        var type = typeof origValue;

        if (type === 'object') {
            if(origValue instanceof RegExp) {
                return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Date) {
                return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Map) {
                return '@__M-' + UID + '-' + (maps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Set) {
                return '@__S-' + UID + '-' + (sets.push(origValue) - 1) + '__@';
            }
        }

        if (type === 'function') {
            return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
        }

        return value;
    }

    function serializeFunc(fn) {
      var serializedFn = fn.toString();
      if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
          throw new TypeError('Serializing native function: ' + fn.name);
      }

      // pure functions, example: {key: function() {}}
      if(IS_PURE_FUNCTION.test(serializedFn)) {
          return serializedFn;
      }

      // arrow functions, example: arg1 => arg1+5
      if(IS_ARROW_FUNCTION.test(serializedFn)) {
          return serializedFn;
      }

      var argsStartsAt = serializedFn.indexOf('(');
      var def = serializedFn.substr(0, argsStartsAt)
        .trim()
        .split(' ')
        .filter(function(val) { return val.length > 0 });

      var nonReservedSymbols = def.filter(function(val) {
        return RESERVED_SYMBOLS.indexOf(val) === -1
      });

      // enhanced literal objects, example: {key() {}}
      if(nonReservedSymbols.length > 0) {
          return (def.indexOf('async') > -1 ? 'async ' : '') + 'function'
            + (def.join('').indexOf('*') > -1 ? '*' : '')
            + serializedFn.substr(argsStartsAt);
      }

      // arrow functions
      return serializedFn;
    }

    var str;

    // Creates a JSON string representation of the value.
    // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
    if (options.isJSON && !options.space) {
        str = JSON.stringify(obj);
    } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
    }

    // Protects against `JSON.stringify()` returning `undefined`, by serializing
    // to the literal string: "undefined".
    if (typeof str !== 'string') {
        return String(str);
    }

    // Replace unsafe HTML and invalid JavaScript line terminator chars with
    // their safe Unicode char counterpart. This _must_ happen before the
    // regexps and functions are serialized and added back to the string.
    if (options.unsafe !== true) {
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
    }

    if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 && sets.length === 0) {
        return str;
    }

    // Replaces all occurrences of function, regexp, date, map and set placeholders in the
    // JSON string with their string representations. If the original value can
    // not be found, then `undefined` is used.
    return str.replace(PLACE_HOLDER_REGEXP, function (match, type, valueIndex) {
        if (type === 'D') {
            return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
        }

        if (type === 'R') {
            return regexps[valueIndex].toString();
        }

        if (type === 'M') {
            return "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")";
        }

        if (type === 'S') {
            return "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")";
        }

        var fn = functions[valueIndex];

        return serializeFunc(fn);
    });
}

},{}],232:[function(require,module,exports){
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { pattern: peg$parsepattern },
      peg$startRuleFunction  = peg$parsepattern,

      peg$c0 = function(value) {
        let out = value
        if( options.enclose === true && value.type !== 'group' ) {
          out = { type:'group', values:[ value ] }
        }
        
        return out
      },
      peg$c1 = function(_valuesstart, _valuesend) {
        _valuesend.unshift( _valuesstart )
        const values = _valuesend

        let out
        
        if( values.type === undefined ) {
          // getting nested arrays with feet...
          out = {
            values:Array.isArray( values[0] ) ? values[0] : values,
            type:'group' 
          }
        }else{
          out = values
          out.type = 'group'
        }
       
        addLoc( out, location() )

        return out
      },
      peg$c2 = peg$otherExpectation("group"),
      peg$c3 = "[",
      peg$c4 = peg$literalExpectation("[", false),
      peg$c5 = "]",
      peg$c6 = peg$literalExpectation("]", false),
      peg$c7 = function(values) {
        const out = {
          values,
          type:'group' 
        }
        
        return addLoc( out, location() ) 
      },
      peg$c8 = peg$otherExpectation("term"),
      peg$c9 = function(body) {return body},
      peg$c10 = "(",
      peg$c11 = peg$literalExpectation("(", false),
      peg$c12 = ",",
      peg$c13 = peg$literalExpectation(",", false),
      peg$c14 = ")",
      peg$c15 = peg$literalExpectation(")", false),
      peg$c16 = function(value, pulses, slots, rotation) {
        const result = {
          type:'bjorklund',
          pulses, 
          slots, 
          value,
          'rotation': rotation.length > 0 ? rotation[ 0 ] : null
        }
       
        const withLoc = addLoc( result, location() ) 
        //withLoc.value.uid = withLoc.uid
        return withLoc
      },
      peg$c17 = function(body) { return body },
      peg$c18 = "?",
      peg$c19 = peg$literalExpectation("?", false),
      peg$c20 = function(value) {
        const out = { type:'degrade', value }
        return out
        //return addLoc( out, location() )
      },
      peg$c21 = "*",
      peg$c22 = peg$literalExpectation("*", false),
      peg$c23 = function(value, rate) {
        const r =  { type:'speed', rate, value }

        if( options.addLocations === true ) {
          r.location = {
            start:value.location.start,
            end: rate.location.end
          }
        }
        
        return r 
      },
      peg$c24 = "/",
      peg$c25 = peg$literalExpectation("/", false),
      peg$c26 = function(value, rate) {
        /*const r =  { type:'slow', rate, value }*/

        //if( options.addLocations === true ) {
        //  r.location = {
        //    start:value.location.start,
        //    end: rate.location.end
        //  }
        //}
        //const group = value.type === 'group'
        //  ? value
        const group = { type:'group', values:[ value ] }

        const onestep = {
          type:'onestep',
          values:[ group ]
        }

        for( let i = 0; i < rate.value - 1; i++ ) {
          group.values.push({ type:'rest' })
        }

        addLoc( onestep, location() )
        return onestep
        /*return r */
      },
      peg$c27 = "{",
      peg$c28 = peg$literalExpectation("{", false),
      peg$c29 = "}",
      peg$c30 = peg$literalExpectation("}", false),
      peg$c31 = function(left, right) {
        const result = { 
          'left':{
            type:'group',
            values:left
          }, 
          'right':{
            type:'group',
            values:right,
          },
          type: 'polymeter' 
        }

        addLoc( result.left, location() )
        addLoc( result.right, location() )
        addLoc( result, location() )

        return result
      },
      peg$c32 = "~",
      peg$c33 = peg$literalExpectation("~", false),
      peg$c34 = function() {
       return { type:'rest' }
      },
      peg$c35 = function(start, end) {
        const out = {
          type:'group',
          values: start.map( grp => grp[0] )
        }
        out.values.push( end )

        return addLoc( out, location() )
      },
      peg$c36 = function(value) {
        return value
      },
      peg$c37 = function(body, end) {
        const values = body.map( val => val[0] )

        values.push( end )

        const result = {
          type: 'layers',
          values
        }

        return addLoc( result, location() )
      },
      peg$c38 = "<",
      peg$c39 = peg$literalExpectation("<", false),
      peg$c40 = ">",
      peg$c41 = peg$literalExpectation(">", false),
      peg$c42 = function(body, end) {
        const onestep = {
          type:'onestep',
          values:[body]
        }

        if( end !== null ) {
          onestep.values.push( end )
        }

        return addLoc( onestep, location() )
      },
      peg$c43 = peg$otherExpectation("word"),
      peg$c44 = /^[letter number]/,
      peg$c45 = peg$classExpectation(["l", "e", "t", "t", "e", "r", " ", "n", "u", "m", "b", "e", "r"], false, false),
      peg$c46 = function(value) { 
        return addLoc( { type:typeof value, value, }, location() )
      },
      peg$c47 = function(l) {
        return addLoc( { type:'string', value:text().trim() }, location() )
      },
      peg$c48 = /^[^ [\] {} () \t\n\r '*' '\/' '.' '~' '?' ',' '>' '<' ]/,
      peg$c49 = peg$classExpectation([" ", "[", "]", " ", "{", "}", " ", "(", ")", " ", "\t", "\n", "\r", " ", "'", "*", "'", " ", "'", "/", "'", " ", "'", ".", "'", " ", "'", "~", "'", " ", "'", "?", "'", " ", "'", ",", "'", " ", "'", ">", "'", " ", "'", "<", "'", " "], true, false),
      peg$c50 = function(value) {
        return addLoc( {type:'string', value }, location() )
      },
      peg$c51 = ".",
      peg$c52 = peg$literalExpectation(".", false),
      peg$c53 = "-",
      peg$c54 = peg$literalExpectation("-", false),
      peg$c55 = /^[0-9]/,
      peg$c56 = peg$classExpectation([["0", "9"]], false, false),
      peg$c57 = function() {
        return addLoc( { type:'number', value:+text().trim() }, location() )
      },
      peg$c58 = peg$otherExpectation("whitespace"),
      peg$c59 = /^[ \t\n\r ]/,
      peg$c60 = peg$classExpectation([" ", "\t", "\n", "\r", " "], false, false),

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$resultsCache = {},

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsepattern() {
    var s0, s1;

    var key    = peg$currPos * 28 + 0,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsefeet();
    if (s1 === peg$FAILED) {
      s1 = peg$parselist();
      if (s1 === peg$FAILED) {
        s1 = peg$parseterm();
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c0(s1);
    }
    s0 = s1;

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parselist() {
    var s0, s1, s2, s3, s4, s5;

    var key    = peg$currPos * 28 + 1,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseterm();
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseterm();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseterm();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsegroup() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    var key    = peg$currPos * 28 + 2,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 91) {
        s2 = peg$c3;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseterm();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseterm();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s6 = peg$c5;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c6); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c2); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseterm() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 3,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parseeuclid();
    if (s1 === peg$FAILED) {
      s1 = peg$parsespeed();
      if (s1 === peg$FAILED) {
        s1 = peg$parseslow();
        if (s1 === peg$FAILED) {
          s1 = peg$parsedegrade();
          if (s1 === peg$FAILED) {
            s1 = peg$parselayer();
            if (s1 === peg$FAILED) {
              s1 = peg$parsenumber();
              if (s1 === peg$FAILED) {
                s1 = peg$parseletters();
                if (s1 === peg$FAILED) {
                  s1 = peg$parsepolymeter();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parsegroup();
                    if (s1 === peg$FAILED) {
                      s1 = peg$parseletter();
                      if (s1 === peg$FAILED) {
                        s1 = peg$parserest();
                        if (s1 === peg$FAILED) {
                          s1 = peg$parseonestep();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c8); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseeuclid() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

    var key    = peg$currPos * 28 + 4,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenoteuclid();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c11); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseterm();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c12;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c13); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseterm();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parse_();
                    if (s9 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s10 = peg$c14;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c15); }
                      }
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                          s11 = peg$c12;
                          peg$currPos++;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c13); }
                        }
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parse_();
                          if (s12 !== peg$FAILED) {
                            s13 = [];
                            s14 = peg$parseterm();
                            while (s14 !== peg$FAILED) {
                              s13.push(s14);
                              s14 = peg$parseterm();
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parse_();
                              if (s14 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                  s15 = peg$c14;
                                  peg$currPos++;
                                } else {
                                  s15 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c15); }
                                }
                                if (s15 === peg$FAILED) {
                                  s15 = null;
                                }
                                if (s15 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c16(s2, s5, s8, s13);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenoteuclid() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 5,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsegroup();
    if (s1 === peg$FAILED) {
      s1 = peg$parsenumber();
      if (s1 === peg$FAILED) {
        s1 = peg$parseword();
        if (s1 === peg$FAILED) {
          s1 = peg$parseletters();
          if (s1 === peg$FAILED) {
            s1 = peg$parseletter();
            if (s1 === peg$FAILED) {
              s1 = peg$parserest();
              if (s1 === peg$FAILED) {
                s1 = peg$parseonestep();
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsedegrade() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 6,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsenotdegrade();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 63) {
        s2 = peg$c18;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c19); }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c20(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotdegrade() {
    var s0;

    var key    = peg$currPos * 28 + 7,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsenumber();
    if (s0 === peg$FAILED) {
      s0 = peg$parsespeed();
      if (s0 === peg$FAILED) {
        s0 = peg$parseslow();
        if (s0 === peg$FAILED) {
          s0 = peg$parseeuclid();
          if (s0 === peg$FAILED) {
            s0 = peg$parsegroup();
            if (s0 === peg$FAILED) {
              s0 = peg$parseletter();
              if (s0 === peg$FAILED) {
                s0 = peg$parseonestep();
              }
            }
          }
        }
      }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsespeed() {
    var s0, s1, s2, s3, s4, s5, s6;

    var key    = peg$currPos * 28 + 8,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsenotspeed();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s3 = peg$c21;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenotspeed();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c23(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotspeed() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 9,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parseeuclid();
    if (s1 === peg$FAILED) {
      s1 = peg$parsepolymeter();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenumber();
        if (s1 === peg$FAILED) {
          s1 = peg$parselayer();
          if (s1 === peg$FAILED) {
            s1 = peg$parseletters();
            if (s1 === peg$FAILED) {
              s1 = peg$parsegroup();
              if (s1 === peg$FAILED) {
                s1 = peg$parseletter();
                if (s1 === peg$FAILED) {
                  s1 = peg$parserest();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseonestep();
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseslow() {
    var s0, s1, s2, s3, s4, s5, s6;

    var key    = peg$currPos * 28 + 10,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsenotslow();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s3 = peg$c24;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenotslow();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c26(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotslow() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 11,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parseeuclid();
    if (s1 === peg$FAILED) {
      s1 = peg$parsepolymeter();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenumber();
        if (s1 === peg$FAILED) {
          s1 = peg$parselayer();
          if (s1 === peg$FAILED) {
            s1 = peg$parseletters();
            if (s1 === peg$FAILED) {
              s1 = peg$parsegroup();
              if (s1 === peg$FAILED) {
                s1 = peg$parseletter();
                if (s1 === peg$FAILED) {
                  s1 = peg$parserest();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseonestep();
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsepolymeter() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

    var key    = peg$currPos * 28 + 12,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 123) {
        s2 = peg$c27;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseterm();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseterm();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c12;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c13); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$parseterm();
                if (s8 !== peg$FAILED) {
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parseterm();
                  }
                } else {
                  s7 = peg$FAILED;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s9 = peg$c29;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c30); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c31(s4, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parserest() {
    var s0, s1;

    var key    = peg$currPos * 28 + 13,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 126) {
      s1 = peg$c32;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c33); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c34();
    }
    s0 = s1;

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsefeet() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 14,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsefoot();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsefoot();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenotfoot();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c35(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsefoot() {
    var s0, s1, s2, s3;

    var key    = peg$currPos * 28 + 15,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsenotfoot();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsenotfoot();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedot();
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c36(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotfoot() {
    var s0;

    var key    = peg$currPos * 28 + 16,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parselist();
    if (s0 === peg$FAILED) {
      s0 = peg$parsedegrade();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepolymeter();
        if (s0 === peg$FAILED) {
          s0 = peg$parserest();
          if (s0 === peg$FAILED) {
            s0 = peg$parsespeed();
            if (s0 === peg$FAILED) {
              s0 = peg$parseslow();
              if (s0 === peg$FAILED) {
                s0 = peg$parseeuclid();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsenumber();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseletter();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseletters();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseword();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseonestep();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parselayer() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    var key    = peg$currPos * 28 + 17,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 91) {
        s2 = peg$c3;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsenotlayer();
          if (s6 !== peg$FAILED) {
            s7 = peg$parse_();
            if (s7 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s8 = peg$c12;
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c13); }
              }
              if (s8 !== peg$FAILED) {
                s9 = peg$parse_();
                if (s9 !== peg$FAILED) {
                  s6 = [s6, s7, s8, s9];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$parsenotlayer();
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s8 = peg$c12;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parse_();
                    if (s9 !== peg$FAILED) {
                      s6 = [s6, s7, s8, s9];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenotlayer();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s7 = peg$c5;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c6); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c37(s4, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotlayer() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 18,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsespeed();
    if (s1 === peg$FAILED) {
      s1 = peg$parseslow();
      if (s1 === peg$FAILED) {
        s1 = peg$parselist();
        if (s1 === peg$FAILED) {
          s1 = peg$parsenumber();
          if (s1 === peg$FAILED) {
            s1 = peg$parseletters();
            if (s1 === peg$FAILED) {
              s1 = peg$parseeuclid();
              if (s1 === peg$FAILED) {
                s1 = peg$parsepolymeter();
                if (s1 === peg$FAILED) {
                  s1 = peg$parsegroup();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseletter();
                    if (s1 === peg$FAILED) {
                      s1 = peg$parserest();
                      if (s1 === peg$FAILED) {
                        s1 = peg$parseonestep();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseonestep() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    var key    = peg$currPos * 28 + 19,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 60) {
      s1 = peg$c38;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c39); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenotonestep();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c12;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
          }
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenotonestep();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s7 = peg$c40;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c41); }
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c42(s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenotonestep() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 20,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parselist();
    if (s1 === peg$FAILED) {
      s1 = peg$parseeuclid();
      if (s1 === peg$FAILED) {
        s1 = peg$parsepolymeter();
        if (s1 === peg$FAILED) {
          s1 = peg$parseword();
          if (s1 === peg$FAILED) {
            s1 = peg$parsegroup();
            if (s1 === peg$FAILED) {
              s1 = peg$parsenumber();
              if (s1 === peg$FAILED) {
                s1 = peg$parseletter();
                if (s1 === peg$FAILED) {
                  s1 = peg$parserest();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parselayer();
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseword() {
    var s0, s1, s2, s3, s4;

    var key    = peg$currPos * 28 + 21,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      if (peg$c44.test(input.charAt(peg$currPos))) {
        s4 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c44.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c45); }
          }
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s2 = input.substring(s2, peg$currPos);
      } else {
        s2 = s3;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c46(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c43); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseletters() {
    var s0, s1, s2, s3;

    var key    = peg$currPos * 28 + 22,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseletter();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseletter();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c47(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseletter() {
    var s0, s1, s2;

    var key    = peg$currPos * 28 + 23,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (peg$c48.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c49); }
    }
    if (s2 !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c50(s1);
    }
    s0 = s1;

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsedot() {
    var s0;

    var key    = peg$currPos * 28 + 24,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    if (input.charCodeAt(peg$currPos) === 46) {
      s0 = peg$c51;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c52); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsequestion() {
    var s0;

    var key    = peg$currPos * 28 + 25,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    if (input.charCodeAt(peg$currPos) === 63) {
      s0 = peg$c18;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c19); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsenumber() {
    var s0, s1, s2, s3, s4, s5, s6;

    var key    = peg$currPos * 28 + 26,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 45) {
      s1 = peg$c53;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c54); }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      if (peg$c55.test(input.charAt(peg$currPos))) {
        s4 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c55.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c51;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c52); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c55.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c55.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c56); }
            }
          }
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c51;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c52); }
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c55.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c55.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c56); }
              }
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c57();
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    var key    = peg$currPos * 28 + 27,
        cached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    peg$silentFails++;
    s0 = [];
    if (peg$c59.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c60); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$c59.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c58); }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }


    const addLocations = options.addLocations
   
    let uid = 0
    const addLoc = function( value, location ) {
      if( addLocations === true ) {
        value.location = location
      }
      
      if( options.addUID === true ) {
        value.uid = uid++
      }

      return value
    }


  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};

},{}],233:[function(require,module,exports){
const parse = require('../dist/tidal.js').parse
const query = require('./queryArc.js' ).queryArc
const Fraction = require( 'fraction.js' )

/* The Pattern object is used to parse a pattern
 * a single time and then query it repeatedly, assuming
 * different start and end times for each query. A priority
 * queue is used to sort the events... 
*/
const Pattern = ( patternString, opts ) => {
  if( typeof patternString !== 'string' )
    throw 'You must provide a string to generate the pattern from'

  let __data
  try{
    __data = parse( patternString, opts )
  }catch( e ) {
    throw `We were unable to parse the pattern ${patternString}. ${e.toString()}`
  }

  const ptrn = {
    __rawString: patternString,
    __data,

    events: null,

    __sort( a,b ) { return a.arc.start.compare( b.arc.start ) },
    query( start, duration ) {
      if( typeof start !== 'object' ) start = Fraction( start )
      if( typeof duration !== 'object' ) duration = Fraction( duration )

      ptrn.events = query( 
        ptrn.__data, 
        start,
        duration 
      )
      .sort( ptrn.__sort )

      return ptrn.events
    },

    print() {
      if( ptrn.events !== null ) {
        ptrn.events.forEach( v => 
          console.log( 
            `${v.arc.start.toFraction()} - ${v.arc.end.toFraction()}: [ ${v.value.toString()} ]` 
          ) 
        )
      }else{
        console.log( 'No events have been generated from the pattern; have you queried it yet?' )
      }
    }
  }

  return ptrn
}

module.exports = Pattern

},{"../dist/tidal.js":232,"./queryArc.js":234,"fraction.js":10}],234:[function(require,module,exports){
const Fraction = require( 'fraction.js' )
const util     = require( 'util' )
const bjork    = require( 'bjork' ) 
const log      = util.inspect
const srand    = require( 'seedrandom' )

const rnd = function( phase ) {
  //console.log( 'phase', phase.toFraction() )
  return new srand( phase.toFraction() )()
}

/* queryArc
 *
 * Generates events for provided pattern, starting at
 * an initial phase, subdivides queries in individual 
 * cycles if duration of query is greater than 1 cycle.
 * Filters events outside of the the intended range. 
 * Remaps events to be relative to the initial phase.
 */
const queryArc = function( pattern, phase, duration ) {
  const start         = phase.clone(),
        end           = start.add( duration ),
        // get phase offset if scheduling begins in middle of event arc
        adjustedPhase = adjustPhase( phase, getPhaseIncr( pattern ), end )

  let eventList

  // if we're querying an arc that is less than or equal to one cycle in length..
  if( duration.valueOf() <= 1 ) {
    eventList = processPattern( 
      pattern, 
      duration, 
      adjustedPhase, 
      null, 
      null, 
      false//shouldRemap( pattern ) 
    )
  }else{
    // for longer arcs we need to query one cycle at a time
    eventList = []
    let count = 0
    for( let i = adjustedPhase.valueOf(); i < adjustedPhase.add( duration ).valueOf(); i++ ) {
      eventList = eventList.concat( 
        processPattern( 
          pattern, 
          Fraction(1),
          adjustedPhase.add( count++ ), 
          null, 
          null, 
          false
        )
      )
    }
  }

  // prune any events that fall before our start phase or after our end phase
  eventList = eventList.filter( evt => {
    return (evt.arc.start.valueOf() >= start.valueOf() 
        && evt.arc.start.valueOf()  <  end.valueOf() ) 
  })
  // remap events to make their arcs relative to initial phase argument
  .map( evt => {
    evt.arc.start = evt.arc.start.sub( start )
    evt.arc.end   = evt.arc.end.sub( start )
    return evt
  })
 
  //console.log( 'eventList:', log(eventList,{depth:4}) )
  return eventList
}

// if an event is found that represents a pattern (as opposed to a constant) this function
// is called to query the pattern and map any generated events to the appropriate timespan
const processPattern = ( pattern, duration, phase, phaseIncr=null, override = null, shouldRemapArcs=false ) => {
  //if( phaseIncr !== null ) debugger
  const state = []
  state.phase = phase
  let events = handlers[ pattern.type ]( 
    state, 
    pattern, 
    /*shouldReset( pattern ) === true ? Fraction(0) :*/ phase.clone(), 
    // XXX this is confusing. we are getting around a problem
    // with polymeters where duplicate events are generated by
    // not passing a phaseIncr... it's not needed since there's an
    // override. But this doesn't seem like correct way to solve
    // this problem and will probably cause future problems...
    phaseIncr !== null ? duration.div( phaseIncr ) : duration, 
    override 
  )

  // if needed, remap arcs for events
  if( shouldRemapArcs === true ) {
    if( phaseIncr === null ) phaseIncr = getPhaseIncr( pattern )
    events = events.map( v => ({
      value: v.value,
      arc: getMappedArc( v.arc, phase.clone(), phaseIncr )
    }) )
  }
 
  return events 
}
// placeholder for potentially adding more goodies (parent arc etc.) later
const Arc = ( start, end ) => ({ start, end })

const shouldNotRemap = ['polymeter', 'onestep']
const shouldRemap = pattern => shouldNotRemap.indexOf( pattern.type ) === -1

// XXX seems like getMappedArc should be changed to what onestep and group are now using?
// would that change work with how getMappedArc is used in processPattern?

// map arc time values to appropriate durations
const getMappedArc = ( arc, phase, phaseIncr ) => {
  let mappedArc
  
  if( phase.mod( phaseIncr ).valueOf() !== 0 ) {
    mappedArc = Arc( 
      arc.start.mul( phaseIncr ).add( phase ), 
      arc.end.mul( phaseIncr ).add( phaseIncr.mod( phase ) ) 
    )
  }else{
    mappedArc = Arc( 
      arc.start.mul( phaseIncr ).add( phase ), 
      arc.end.mul( phaseIncr ).add( phase ) 
    )
  }
  
  return mappedArc
}

// if initial phase is in the middle of an arc, advance to the end by calculating the difference
// between the current phase and the start of the next arc, and increasing phase accordingly.
const adjustPhase = ( phase, phaseIncr, end ) => phase.valueOf() === 0 
  ? Fraction(0) 
  : phase.sub( phase.mod( phaseIncr ) )

// check to see if phase should advance to next event, or, if next event is too far in the future, to the
// end of the current duration being requested.
const advancePhase = ( phase, phaseIncr, end ) => phase + phaseIncr <= end ? phase.add( phaseIncr ) : end 

// calculate the duration of the current event being processed.
const calculateDuration = ( phase, phaseIncr, end ) => phase + phaseIncr <= end ? phaseIncr : end.sub( phase )

// get an index number for a pattern for a particular phase
const getIndex = ( pattern, phase ) => {
  let idx = 0
  if( pattern.options !== undefined ) {
    if( pattern.options.overrideIncr === true ) {
      idx = phase.div( pattern.options.incr ).mod( pattern.values.length ).floor()
    }
  }else{
    // default list behavior
    idx = phase.mul( Fraction( pattern.values.length ) ).mod( pattern.values.length ).floor()
  }

  return idx.valueOf()
}

// in addition to 'fast', phase resets are also necessary when indexing subpatterns,
// which are currently arrays with no defined .type property, hence the inclusion of
// undefined in the array below
const shouldResetPhase = [ 'repeat', undefined, 'group', 'layers' ] 

// XXX does these need to look at all parents recursively? Right now we're only using one generation...
const shouldReset = pattern => {
  const reset = shouldResetPhase.indexOf( pattern.type ) > -1 
  const parent = pattern.parent !== undefined && shouldResetPhase.indexOf( pattern.parent.type ) > -1

  return reset && parent
}

// I assume this will need to be a switch on pattern.type in the future...
const getPhaseIncr = pattern => {
  let incr

  switch( pattern.type ) {
    case 'polymeter': incr = Fraction( 1, pattern.left.values.length ); break;
    case 'number': case 'string': incr = Fraction( 1 ); break;
    case 'onestep': incr = null; break;
    default:
      if( pattern.values === undefined ){
        incr = Fraction(1)
      } else {
        incr = Fraction( 1, pattern.values.length )
        //let len = 0
        //pattern.values.forEach( v => len += v.type === 'slow' ? v.rate.value : 1 )
        //incr = Fraction( 1, len ) 
      }
      break;

  }

  return incr
}

const handlers = {
  rest( state ) { return state },

  // standard lists e.g. '0 1 2 3' or '[0 1 2]'
  group( state, pattern, phase, duration, overrideIncr=null ) {
    const start     = phase.clone(),
          end       = start.add( duration ),
          phaseIncr = overrideIncr === null 
            ? getPhaseIncr( pattern ) 
            : overrideIncr
          
    let eventList = []

    //console.log( 
    //  'type:',  pattern.type, 
    //  'phase:', phase.toFraction(),
    //  'incr:',  phaseIncr.toFraction(),
    //  'dur:',   duration.toFraction()
    //)
    
    while( phase.compare( end ) < 0 ) {
      // if pattern is a list, read using current phase, else read directly
      const member = Array.isArray( pattern.values ) === true 
        ? pattern.values[ getIndex( pattern, phase ) ] 
        : pattern.value

      // get duration of current event being processed
      const dur = calculateDuration( phase, phaseIncr, end )

      // if value is not a numeric or string constant (if it's a pattern)...
      if( member === undefined || (isNaN( member.value ) && typeof member.value !== 'string') ) {
        // query the pattern and remap time values appropriately 
        if( member !== undefined ) member.parent = pattern
        //console.log( 'processing ', pattern.type, member.type, dur.toFraction(),  phaseIncr.toFraction() )
        const events = processPattern( 
          member, 
          Fraction(1), 
          //member.type !== 'slow' ? Fraction(0) : phase.clone(), 
          Fraction(0),
          null, //getPhaseIncr(member),
          null, 
          false//shouldRemap( member )
        )
        .map( evt => {
          evt.arc.start = evt.arc.start.mul( dur ).add( phase )
          evt.arc.end   = evt.arc.end.mul( dur ).add( phase )
          return evt
        })

        eventList = eventList.concat( events )
      }else{
        // XXX shouldn't we just process all patterns???
        // member does not need further processing, so add to event list
        const evt = { 
          value:member.value, 
          arc:Arc( phase, phase.add( dur ) ),
        }
        if( member.uid !== undefined ) evt.uid = member.uid 

        eventList.push( evt )
      }

      // assuming we are starting / ending at a regular phase increment value...
      
      if( phase.mod( phaseIncr ).valueOf() === 0 ) {
        phase = advancePhase( phase, phaseIncr, end )
      }else{
        // advance phase to next phase increment
        phase = phase.add( phaseIncr.sub( phase.mod( phaseIncr ) ) ) 
      }
    }

    // prune any events that fall before our start phase or after our end phase
    eventList = eventList.filter( evt => {
      return evt.arc.start.valueOf() >= start.valueOf() && evt.arc.start.valueOf() < end.valueOf()
    })
   
    return state.concat( eventList )
  },

  bjorklund( state, pattern, phase, duration ) {
    const onesAndZeros = bjork( pattern.pulses.value, pattern.slots.value )
    let rotation = pattern.rotation !== null ? pattern.rotation.value : 0
    
    // rotate right
    if( rotation > 0 ) {
      while( rotation > 0 ) {
        const right = onesAndZeros.pop()
        onesAndZeros.unshift( right )
        rotation--
      }
    } else if( rotation < 0 ) {
      // rotate left
      while( rotation < 0 ) {
        const left = onesAndZeros.shift()
        onesAndZeros.push( left )
        rotation++
      }
    }
    
    const slotDuration = duration.div( pattern.slots.value )
    const valueIsValue = pattern.value.type === 'number' || pattern.value.type === 'string'

    const events = onesAndZeros.map( ( shouldInclude, i, arr ) => {
      let evt
      // don't process unless an actual event will be included...
      if( shouldInclude === 1 ) {
        const startPhase = phase.add( slotDuration.mul( i ) )
        evt = {
          shouldInclude,
          // XXX is there a case where we should use more than 
          // the first value by querying the value pattern?
          value:valueIsValue ? pattern.value : processPattern( pattern.value, slotDuration, startPhase )[0].value,
          arc:Arc( startPhase, startPhase.add( slotDuration ) ) 
        }
      }else{
        evt = { shouldInclude }
      }

      return evt
    })
    .filter( evt => {
      let shouldInclude = evt.shouldInclude

      // needed to pass tests and is also cleaner...
      delete evt.shouldInclude
      return shouldInclude === 1
    })

    events.forEach( evt => {
      evt.uid = pattern.value.uid
      state.push( evt ) 
    })
    
    return state
  },

  onestep( state, pattern, phase, duration ) {
    pattern.values.forEach( group => {
      // initialize, then increment. this assumes that the pattern will be parsed once,
      // and then the resulting data structure will be queried repeatedly, enabling the use
      // of state.
      group.count = group.count === undefined ? 0 : group.count + 1

      const subpattern = group.values[ group.count % group.values.length ]
      const dur = duration.valueOf() <= 1 ? Fraction(1) : duration 
      const durDiff = duration.mul( dur ) 

      const events = processPattern( 
        subpattern, 
        dur,
        Fraction(0), 
        null,
        null,null,true
      ).map( evt => {
        evt.arc.start = evt.arc.start.mul( duration ).add( phase )
        evt.arc.end = evt.arc.end.mul( duration ).add( phase )

        return evt
      })  

      state.push( ...events )
    })

    return state
  },

  number( state, pattern, phase, duration ) {
    //if( phase.valueOf() === 0 ) {
      const evt = { arc:Arc( phase, phase.add( duration ) ), value:pattern.value }
      if( pattern.uid !== undefined ) evt.uid = pattern.uid
      state.push(evt)
    //}
    return state 
  },

  string( state, pattern, phase, duration ) {
    const evt = { arc:Arc( phase, phase.add( duration ) ), value:pattern.value }
    if( pattern.uid !== undefined ) evt.uid = pattern.uid
    state.push(evt)
    return state 
  },

  degrade( state, pattern, phase, duration ) {
    // attempt to seed random... rnd( state.phase )
    const rnum = Math.random()
    //console.log( 'rnd:', rnum, state.phase.toFraction() )
    if( rnum > .5 ) {
      const evt = { 
        arc:Arc( phase, phase.add( duration ) ), 
        value:pattern.value.value
      }

      //console.log( 'adding', evt )

      if( pattern.uid !== undefined ) evt.uid = pattern.uid

      state.push( evt )
    }

    return state 
  },

  polymeter( state, pattern, phase, duration ) {
    pattern.left.parent = pattern.right.parent = pattern

    const incr  = Fraction( 1, pattern.left.values.length )
    const left  = processPattern( pattern.left, duration, phase.clone(), duration, incr, false )

    pattern.right.options = { overrideIncr: true, incr }
    const right = processPattern( pattern.right, duration, phase.clone(), duration, incr, false ) 

    return state.concat( left ).concat( right )
  },

  layers( state, pattern, phase, duration ) {
    //pattern.left.parent = pattern.right.parent = pattern
    for( const group of pattern.values ) {
      const incr = getPhaseIncr( group )
      const events = processPattern( group, duration.clone(), phase.clone(), duration, null, false)
      // not sure why excess events are generated, but they need to be filtered...
      .filter( evt => 
        evt.arc.start.valueOf() >= phase.valueOf() 
        && evt.arc.start.valueOf() < phase.add( duration ).valueOf()
      )
      
      //console.log( 'group:', util.inspect( group, { depth:3 }) )
      //console.log( 'state:', util.inspect( events, { depth:3 }))
      state = state.concat( events )
    }

    return state
  },

  slow( state, pattern, phase, duration ) {
    const speed = pattern.rate.value

    let events
    //if( phase.valueOf() % speed === 0 ) {
      // XXX why do we need this edge case?
      const phaseDiff = phase.sub( phase.div( speed ) )

      if( pattern.value.type !== 'layers' ) {
        //events = queryArc(
        //  pattern.value,
        //  phase.div( speed ),
        //  duration.div( speed )
        //)
        //console.log( duration, phase, speed )
        //events = processPattern(
        //  pattern.value,
        //  duration.mul( speed ),
        //  phase.div( speed )
        //)       
        events = queryArc(
          pattern.value,
          Fraction(0),
          duration.div( speed ) 
        ).map( evt => {
          const diff = evt.arc.end.sub( evt.arc.start )
          evt.arc.start = evt.arc.start.add( phase )
          evt.arc.end   = evt.arc.start.add( duration.mul( speed ) ).add( phase )
          //console.log( diff, duration.mul( speed ), evt.arc.start, evt.arc.end )
          return evt
        })
      }else{
        events = handlers.layers( state, pattern.value, phase.div( speed ), duration.div( speed ) )
      }

      //console.log( log( events, { depth:3 }), phase.add( duration ).toFraction() )
      //if( pattern.value.type === 'group' ) {
      //  events = events.map( evt => {
      //    evt.arc.start = evt.arc.start.mul( speed )
      //    evt.arc.end   = evt.arc.end.mul( speed )
      //    return evt
      //  })
      //}
      //events = events.map( evt => {
      //  evt.arc.start = evt.arc.start.add( phaseDiff )
      //  evt.arc.end   = evt.arc.end.add( phaseDiff )
      //  //evt.arc.start = evt.arc.start.add( phase )
      //  //evt.arc.end   = evt.arc.end.add( phase )
      //  return evt
      //})
      //.filter( evt => evt.arc.start.valueOf() < phase.add( duration ).valueOf() )
    //}
    //console.log( 'slow:', log( events, { depth:3 }), phase.add( duration ).toFraction() )

    if( events !== undefined ) state = state.concat( events )

    return state
  },

//const processPattern = ( pattern, duration, phase, phaseIncr=null, override = null, shouldRemapArcs=true ) => {
  speed( state, pattern, phase, duration ) {
    // the general process of increasing the speed of a pattern is to query
    // for a longer duration according to the speed, and the scale the resulting
    // events.
    
    // following explanation from yaxu for how subpatterns work with rates...
    // https://talk.lurk.org/channel/tidal?msg=z5ck73H9EvxQwMqq6 
    // re: pattern a*[2 4 8]
    // "Anyway what happens in this kind of situation is that it splits the cycle in three, 
    // each a window on what would have happened if you'd have sped things up by the given number
    // so for the first third you'd get a third of two a's
    // for the second third you'd get the second third of four a's..."
    
    const speed = pattern.rate.value
    const events = queryArc(
      pattern.value,
      Fraction(0),
      duration.mul( speed ) 
    ).map( evt => {
      evt.arc.start = evt.arc.start.div( speed ).add( phase )
      evt.arc.end   = evt.arc.end.div( speed ).add( phase )
      return evt
    })

    // XXX account for having a speeds pattern!!!!
    /*
    
    const incr = Fraction(1, speeds.length)
    const speeds = queryArc( pattern.rate, Fraction(0), Fraction(1) )

    for( let i = 0; i < speeds.length; i++ ) {
      let speed = speeds[ i ].value

      if( pattern.operator === '*' ) {
        //events = queryArc( 
        //  pattern.value,
        //  phase.clone(), //Fraction( 0 ), 
        //  Fraction( speed ).mul( duration )
        //)
        events = processPattern(
          pattern.value,
          duration.mul( speed ),
          phase.clone()//Fraction( speed ).mul( duration )
          //phase.clone() 
        )
          
        // remap events to correct time spans
        .map( evt => {
          evt.arc.start = evt.arc.start.div( speed )//.add( phase )
          evt.arc.end   = evt.arc.end.div( speed )//.add( phase )
          return evt
        })
        //.filter( evt => 
        //  evt.arc.start.compare( incr.mul( i ) ) >= 0 
        //    && evt.arc.start.compare( incr.mul( i+1 ) ) < 0 
        //))
        // add to previous events
        .concat( events )
      }else{
        speed = 1/speed
        //console.log( 'phase:', phase.mul( speed ) )
        events = processPattern( 
          pattern.value, 
          duration.mul( Fraction( speed ) ), 
          phase.mul( speed ),
          getPhaseIncr( pattern ).mul( speed ), null, false
        )
        //console.log( 'events:', log( events, { depth:4 } ) )
        // remap events to correct time spans
        events.map( evt => {
          if( evt.arc.start.valueOf() !== 0 ) {
            // XXX I don't know why this is necessary but it gets rid of a off-by-one error
            evt.arc.start = evt.arc.start.sub( phase.div( 1/speed ) )
          }

          // also, does the event length need to be adjusted? might as well...
          //console.log( 'end:', evt.arc.end.toFraction(), phase.toFraction(), speed )
          evt.arc.end = evt.arc.end.mul( 1/speed )//.mul( 1/speed )
          //evt.arc.end.sub( phase.div( 1/speed ) ).add( 1/speed - 1)

          return evt
        })
        // remove events don't fall in the current window
        .filter( evt => 
          evt.arc.start.compare( incr.mul(i) ) >= 0 && 
          evt.arc.start.compare( incr.mul(i+1) ) <= 0 
        )
        // add to previous events
        .concat( events )
      }
    }*/

    //console.log( 'events:', log( events, { depth:4 }) )
    return state.concat( events )
  },
}

module.exports.queryArc = queryArc

},{"bjork":2,"fraction.js":10,"seedrandom":223,"util":237}],235:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],236:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":218,"is-generator-function":219,"is-typed-array":220,"which-typed-array":238}],237:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))

},{"./support/isBuffer":235,"./support/types":236,"_process":222,"inherits":217}],238:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"available-typed-arrays":1,"call-bind/callBound":4,"es-abstract/helpers/getOwnPropertyDescriptor":7,"foreach":9,"has-tostringtag/shams":215,"is-typed-array":220}],239:[function(require,module,exports){
const Audio = require("gibber.audio.lib"),
  Gibber = require("gibber.core.lib");
chroma = require("chroma-js");
const pallette = chroma.brewer.Set1;
const set1Scale = chroma.scale(pallette);
console.log("pallette: ", pallette);

// console.log('Chroma: ', Chroma);
for (const key in Audio) {
  if (Object.hasOwnProperty.call(Audio, key)) {
    const element = Audio[key];
    // console.log('key: ', key, (typeof element));
  }
}
const contents = document.createElement("div");
document.body.appendChild(contents);
contents.classList.add("contents");

const leftSide = document.createElement("div");
contents.appendChild(leftSide);
leftSide.classList.add("left-side");
const rightSide = document.createElement("div");
contents.appendChild(rightSide);
rightSide.classList.add("right-side");
const rightSide2 = document.createElement("div");
document.body.appendChild(rightSide2);
rightSide2.classList.add("right-side2");

console.log("Audio: ", Audio);
const instrumentsCategories = Audio.Presets.instruments;
console.log("instrumentsCategories: ", instrumentsCategories);
var categoriesSize = Object.keys(instrumentsCategories).length;
let counter = -1;
let counter2 = -1;
const descriptionsDisplays = [];
const instrumentParameters = {};
const allInstrumentParameters = new Set();
const allInstrumentParameters2 = {};
const allInstruments = {};
const allInstruments2 = {};
const colorsPerCategory = {};

const allPosibleInstrumentsDisplay = document.createElement("div");
allPosibleInstrumentsDisplay.style.position = "absolute";
allPosibleInstrumentsDisplay.style.top = "0";
allPosibleInstrumentsDisplay.style.left = "0";

let allPosibleInstruments = [];
document.body.appendChild(allPosibleInstrumentsDisplay);

for (const category in instrumentsCategories) {
  if (Object.hasOwnProperty.call(instrumentsCategories, category)) {
    counter++;
    const instrumentsInCategory = instrumentsCategories[category];
    const instrumentInCategoryKeys = Object.keys(instrumentsInCategory);

    const iLength = instrumentInCategoryKeys.length;
    // console.log('key: ', key);
    // console.log('element: ', Object.keys(element));
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "instrument-category";
    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "category-name";
    categoryTitle.onclick = () => {
      rightSide.innerHTML = "";
      claerAllDescriptions();
    };
    categoryTitle.innerHTML = `${counter}-${category}---${iLength}`;
    categoryDiv.appendChild(categoryTitle);
    const instrumentDescription = document.createElement("div");
    const bgColor = set1Scale(counter / categoriesSize)
      .darken(2)
      .hex();
    colorsPerCategory[category] = bgColor;
    categoryDiv.style.backgroundColor = bgColor;
    const paramsSet = new Set();
    instrumentParameters[category] = paramsSet;
    for (let i = 0; i < iLength; i++) {
      counter2++;
      const instrument = instrumentInCategoryKeys[i];
      const instrumentObject = instrumentsInCategory[instrument];
      const paramDiv = document.createElement("span");
      paramDiv.classList.add("param");
      const uniqueID = category + instrument;
      allPosibleInstruments.push(`s = ${category}('${instrument}')`);
      allInstruments[uniqueID] = {
        category,
        instrument,
        bgColor,
        paramDiv,
      };
      // paramDiv.classList.add(category);
      // paramDiv.classList.add(key);
      const paramName = document.createElement("span");
      paramName.innerHTML = instrument;
      allInstruments2[instrument] = paramDiv;
      paramDiv.appendChild(paramName);
      paramDiv.onclick = () => {
        onParamaClick(category, instrument);
      };
      const paramValue = document.createElement("span");
      for (const property in instrumentObject) {
        if (Object.hasOwnProperty.call(instrumentObject, property)) {
          const value = instrumentObject[property];
          paramsSet.add(property);
          allInstrumentParameters.add(property);
          if (allInstrumentParameters2[property]) {
            allInstrumentParameters2[property].typeof.add(typeof value);
            allInstrumentParameters2[property].categories.add(category);
            allInstrumentParameters2[property].keys.add(instrument);
          } else {
            allInstrumentParameters2[property] = {
              property,
              typeof: new Set([typeof value]),
              categories: new Set([category]),
              keys: new Set([instrument]),
            };
          }

          const propertyDiv = document.createElement("div");
          propertyDiv.className = "property";
          const propertyName = document.createElement("span");
          propertyName.innerHTML = property + ".";
          propertyDiv.appendChild(propertyName);
          const propertyValue = document.createElement("span");
          propertyValue.innerHTML = value;
          propertyDiv.appendChild(propertyValue);
          paramDiv.appendChild(propertyDiv);
        }
      }
      paramDiv.appendChild(paramValue);
      categoryDiv.appendChild(paramDiv);
    }
    categoryDiv.appendChild(instrumentDescription);
    descriptionsDisplays.push(instrumentDescription);
    leftSide.appendChild(categoryDiv);
    // console.log('instrumentDiv: ', instrumentDiv);
  }
}
// console.log("allInstruments: ", allInstruments);
allPosibleInstruments = allPosibleInstruments.join("<br>");
console.log("allPosibleInstruments: ", allPosibleInstruments);
// allPosibleInstrumentsDisplay.innerHTML = allPosibleInstruments;
const claerAllDescriptions = () => {
  descriptionsDisplays.forEach((display) => {
    display.innerHTML = "";
  });
};
const onParamaClick = (category, instrument) => {
  document.querySelectorAll(".property").forEach((element) => {
    element.onclick = null;
  });
  claerAllDescriptions();
  const bgColor = allInstruments[category + instrument].bgColor;
  const properties = instrumentsCategories[category][instrument];
  let indesOfAAAA = Object.keys(instrumentsCategories[category]).indexOf(
    instrument
  );
  let indesOfBBB = Object.keys(instrumentsCategories).indexOf(category);
  let string = `<div style="background-color:${bgColor};"><span>${indesOfBBB}/${
    Object.keys(instrumentsCategories).length
  }-${category}</span>----<span>${indesOfAAAA}/${
    Object.keys(instrumentsCategories[category]).length
  }-${instrument}</span></div>`;
  allInstrumentParameters.forEach((property) => {
    const value = properties[property];
    const element2 = allInstrumentParameters2[property];
    let categoriesColumn = "";
    Object.keys(instrumentsCategories).forEach((category4Property) => {
      const hasCategory4Property = element2.categories.has(category4Property);
      categoriesColumn += `<div style="border:1px solid ${
        category === category4Property && hasCategory4Property && value
          ? "#aaa"
          : "#555"
      };display:inline-block;width:10px;height:10px;color:#555;background-color:${
        hasCategory4Property
          ? colorsPerCategory[category4Property]
          : "transparent"
      };">&nbsp;</div>`;
    });
    const columnProperty2 = `<span class="column tiny">${element2.categories.size}</span>`;
    const columnProperty3 = `<span class="column tiny">${element2.keys.size}</span>`;
    const columnProperty = `<span class="column small property" onclick="onInstrumentParamClick(this)">${property}</span>`;
    const columnTypeOf = `<span class="column small">${
      element2.typeof ? Array.from(element2.typeof).toString() : "-"
    }</span>`;
    const columnElementValue = `<span class="column element">${
      value ? value : ""
    }</span> `;
    string += `<div>${columnProperty} ${columnTypeOf} ${columnElementValue}${categoriesColumn}${columnProperty2}${columnProperty3}</div>`;
  });
  rightSide.innerHTML = string;
};
onParamaClick("Drums", "earshred");

onInstrumentParamClick = function (e) {
  const parameter = e.textContent;
  console.log("parameter: ", parameter);
  const asdasd = allInstrumentParameters2[parameter];

  console.log("asdasd: ", asdasd);
  rightSide2.innerHTML = Array.from(asdasd.categories)
    .map(
      (category) =>
        `<span style="border:1px solid white;background-color:${colorsPerCategory[category]}">${category}</span>`
    )
    .join("");
  for (const key in allInstruments2) {
    if (Object.hasOwnProperty.call(allInstruments2, key)) {
      const element = allInstruments2[key];
      element.classList.remove("highlight");
    }
  }
  Array.from(asdasd.keys).forEach((key) => {
    console.log("key: ", key);
    const asdasdascxxxx = allInstruments2[key];
    console.log("asdasdascxxxx: ", asdasdascxxxx);
    asdasdascxxxx.classList.add("highlight");
  });
};
function one() {
  let aaaaa = Object.keys(allInstruments);

  setInterval(() => {
    const randomIndex = (aaaaa.length * Math.random()) | 0;
    const randomKey = aaaaa.splice(randomIndex, 1);
    if (aaaaa.length === 0) {
      aaaaa = Object.keys(allInstruments);
    }
    const randomElement = allInstruments[randomKey];
    onParamaClick(randomElement.category, randomElement.instrument);
  }, 100);
}

function two() {
  let index = -1;
  const keys = Object.keys(allInstruments);
  const length = keys.length;
  setInterval(() => {
    index++;
    const nextKey = keys[index % length];
    const nextElement = allInstruments[nextKey];
    onParamaClick(nextElement.category, nextElement.instrument);
  }, 100);
}
// two();
// one();
console.log("counter2: ", counter2);
console.log(Object.keys(allInstruments).length);

},{"chroma-js":6,"gibber.audio.lib":92,"gibber.core.lib":134}]},{},[239])

