"use strict";
exports.__esModule = true;
var toPascal = function (_text) {
    var margin = '**';
    var text = _text + margin;
    return (text.slice(0, 1).toUpperCase() + text.slice(1)).slice(0, -2);
};
exports["default"] = toPascal;
