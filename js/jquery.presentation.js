/**
 * jquery.presentation.js
 * ~~~~~~~~~~~~~~~~~~~~~~
 * 
 * Turn your (X)HTML page into a presentation.
 *
 * :copyright: 2010, Pascal Hartig <phartig@rdrei.net>
 * :license: GPL v3, see doc/LICENSE for more details.
 */

/*global $ */
/*jslint white: true, onevar: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true */
"use strict";

(function ($) {
    $.fn.presentation = function (options) {
        function debug() {
            if (window.console) {
                window.console.log.apply(window.console, arguments);
            }
        }
        return this.each(function () {
            var $this = $(this),
                $slides = $(this).find(".slide"),
                $current;

            function nextSlide() {
                var $new = $current.hide().next();
                if ($new.hasClass("slide")) {
                    debug("Showing next.");
                    $current = $new.show();
                } else {
                    $current.show();
                }
            }

            function prevSlide() {
                var $new = $current.hide().prev();
                if ($new.hasClass("slide")) {
                    debug("Showing prev.");
                    $current = $new.show();
                } else {
                    $current.show();
                }
            }

            function goToSlide(index) {
                var $new;
                if (index < 0) {
                    index = $slides.length + (index);
                }
                
                debug("Going to index ", index);
                $new = $slides.eq(index);
                if ($new.hasClass("slide")) {
                    $current.hide();
                    $current = $new.show();
                }
            }

            function handleKey(keyCode) {
                switch (keyCode) {
                    case 32: // space
                    case 39: // rightkey
                    case 40: // downkey
                        nextSlide();
                        break;
                    case 37: // left
                    case 39: // up
                    case 80: // p
                        prevSlide();
                        break;
                    case 36: // home
                        goToSlide(0);
                        break;
                    case 35: // end
                        goToSlide(-1);
                        break;
                    default:
                        return true;
                }
                return false;
            }

            $(document).bind('keyup', function (event) {
                handleKey(event.keyCode);
            });
        
            // Show the first slide
            $current = $slides.hide().first().show();
        });
    };
}(jQuery));
