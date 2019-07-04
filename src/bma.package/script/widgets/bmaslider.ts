// Copyright (c) Microsoft Research 2016
// License: MIT. See LICENSE
/// <reference path="..\..\Scripts\typings\jquery\jquery.d.ts"/>
/// <reference path="..\..\Scripts\typings\jqueryui\jqueryui.d.ts"/>

(function ($) {
    $.widget("BMA.bmazoomslider", {
        options: {
            step: 10,
            value: 0,
            min: 0,
            max: 100
        },

        _create: function () {
            var that = this;
            this.element.addClass("zoomslider-container");

            var command = this.element.attr("data-command");

            var zoomplus = $('<img>')
                .attr("id", "zoom-plus")
                .attr("src", "images/zoomplus.svg")
                .addClass("hoverable")
                .appendTo(that.element);

            this.zoomslider = $('<div></div>')
                .appendTo(that.element);

            var zoomminus = $('<img>')
                .attr("id", "zoom-minus")
                .attr("src", "images/zoomminus.svg")
                .addClass("hoverable")
                .appendTo(that.element);

            this.zoomslider.slider({
                min: that.options.min,
                max: that.options.max,
                //step: that.options.step,
                value: that.options.value,
                change: function (event, ui) {
                    var val = that.zoomslider.slider("option", "value");
                    if (command !== undefined && command !== "" && !that.isSilent) {
                        window.Commands.Execute(command, { value: val });
                    }
                }
            });

            this.zoomslider.removeClass().addClass("zoomslider-bar");
            this.zoomslider.find('span').removeClass().addClass('zoomslider-pointer');

            zoomplus.bind("click", function () {
                var command = that.element.attr("data-command");
                var val = Math.max(that.options.min, that.zoomslider.slider("option", "value") - that.options.step);

                if (command !== undefined && command !== "" && !that.isSilent) {
                    window.Commands.Execute(command, { value: val });
                } else {
                    that.zoomslider.slider("option", "value", val);
                }
            });

            zoomminus.bind("click", function () {
                var command = that.element.attr("data-command");
                var val = Math.min(that.options.max, that.zoomslider.slider("option", "value") + that.options.step);

                if (command !== undefined && command !== "" && !that.isSilent) {
                    window.Commands.Execute(command, { value: val });
                } else {
                    that.zoomslider.slider("option", "value", val);
                }
            });
        },

        _destroy: function () {
            var contents;

            // clean up main element
            this.element.removeClass("zoomslider-container");
            this.element.empty();
        },

        _setOption: function (key, value) {
            var that = this;
            switch (key) {
                case "value":
                    if (this.options.value !== value) {
                        this.options.value = value;
                        this.zoomslider.slider("option", "value", value);
                    }
                    break;
                case "min":
                    this.options.min = value;
                    this.zoomslider.slider("option", "min", value);
                    break;
                case "max":
                    this.options.max = value;
                    this.zoomslider.slider("option", "max", value);
                    break;
            }
            this._super(key, value);
        },

        isSilent: false,
        setValueSilently: function (value) {
            if (this.options.value !== value) {
                this.options.value = value;
                this.isSilent = true;
                this.zoomslider.slider("option", "value", Math.max(this.options.min, Math.min(this.options.max, value)));
                this.isSilent = false;
            }
        },

    });
}(jQuery));

interface JQuery {
    bmazoomslider(): JQuery;
    bmazoomslider(settings: any): JQuery;
    bmazoomslider(optionLiteral: string, optionName: string): any;
    bmazoomslider(optionLiteral: string, optionName: string, optionValue: any): JQuery;
}
