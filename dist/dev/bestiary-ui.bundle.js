(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["bestiary-ui"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"\\ntable[data-v-223367d6] {\\r\\n\\tborder-spacing: 4px 0px;\\r\\n\\tborder-collapse: collapse;\\r\\n\\trow-gap: 4px;\\r\\n\\tcolumn-gap: 10px;\\n}\\ntr:first-child th[data-v-223367d6] {\\r\\n\\tborder-bottom: 1pt solid black;\\r\\n\\tmargin: 4px 4px;\\n}\\ntr > th[data-v-223367d6]:first-of-type {\\r\\n\\ttext-align: left;\\n}\\nth[data-v-223367d6] {\\r\\n\\tpadding: 4px 10px;\\n}\\ntd.num-align[data-v-223367d6] {\\r\\n\\tpadding: 8px;\\n}\\r\\n\\r\\n\", \"\"]);\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./src/ui/bestiary.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game */ \"./src/game.js\");\n/* harmony import */ var _components_filterbox_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/filterbox.vue */ \"./src/ui/components/filterbox.vue\");\n\r\n\r\n\r\n\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n\r\n\tdata(){\r\n\t\treturn {\r\n\t\t\tfiltered:null\r\n\t\t};\r\n\t},\r\n\tcomponents:{\r\n\t\tfilterbox:_components_filterbox_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\r\n\t},\r\n\tbeforeCreate(){\r\n\t\tthis.game = _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\r\n\t},\r\n\tmethods:{\r\n\r\n\t\tshowHp(m) {\r\n\t\t\treturn this.totalLore >= 4*m.level;\r\n\t\t},\r\n\r\n\t\ttoNum(v) {\r\n\t\t\treturn ( typeof v === 'object' ? v.value : v ).toFixed(0);\r\n\t\t}\r\n\r\n\t},\r\n\tcomputed:{\r\n\r\n\t\ttotalLore() { return this.animals.value + this.lore.value + this.demonology.value; },\r\n\r\n\t\tanimals() { return _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state.getData('animals');},\r\n\r\n\t\tlore() { return _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state.getData('lore');},\r\n\r\n\t\tdemonology() { return _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state.getData('demonology');},\r\n\r\n\t\titems(){\r\n\t\t\treturn _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state.monsters.filter( v=>v.value>=1 );\r\n\t\t}\r\n\r\n\t}\r\n\r\n});\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    [\n      _c(\"filterbox\", {\n        attrs: { items: _vm.items, \"min-items\": \"10\" },\n        model: {\n          value: _vm.filtered,\n          callback: function($$v) {\n            _vm.filtered = $$v\n          },\n          expression: \"filtered\"\n        }\n      }),\n      _vm._v(\" \"),\n      _c(\n        \"table\",\n        { staticClass: \"bestiary\" },\n        [\n          _vm._m(0),\n          _vm._v(\" \"),\n          _vm._l(_vm.filtered, function(b) {\n            return _c(\"tr\", { key: b.id }, [\n              _c(\n                \"th\",\n                {\n                  on: {\n                    \"!mouseenter\": function($event) {\n                      $event.stopPropagation()\n                      return _vm.dispatch(\"itemover\", $event, b)\n                    }\n                  }\n                },\n                [_vm._v(_vm._s(b.name))]\n              ),\n              _vm._v(\" \"),\n              _c(\"td\", { staticClass: \"num-align\" }, [_vm._v(_vm._s(b.value))]),\n              _vm._v(\" \"),\n              _c(\"td\", { staticClass: \"num-align\" }, [\n                _vm._v(_vm._s(_vm.showHp(b) ? _vm.toNum(b.hp) : \"??\"))\n              ])\n            ])\n          })\n        ],\n        2\n      )\n    ],\n    1\n  )\n}\nvar staticRenderFns = [\n  function() {\n    var _vm = this\n    var _h = _vm.$createElement\n    var _c = _vm._self._c || _h\n    return _c(\"tr\", [\n      _c(\"th\", [_vm._v(\"Creature\")]),\n      _c(\"th\", [_vm._v(\"Slain\")]),\n      _c(\"th\", { staticClass: \"num-align\" }, [_vm._v(\"Hp\")])\n    ])\n  }\n]\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/ui/bestiary.vue":
/*!*****************************!*\
  !*** ./src/ui/bestiary.vue ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bestiary.vue?vue&type=template&id=223367d6&scoped=true& */ \"./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true&\");\n/* harmony import */ var _bestiary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bestiary.vue?vue&type=script&lang=js& */ \"./src/ui/bestiary.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& */ \"./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&\");\n/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(\n  _bestiary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"223367d6\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/ui/bestiary.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?");

/***/ }),

/***/ "./src/ui/bestiary.vue?vue&type=script&lang=js&":
/*!******************************************************!*\
  !*** ./src/ui/bestiary.vue?vue&type=script&lang=js& ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib??vue-loader-options!./bestiary.vue?vue&type=script&lang=js& */ \"./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?");

/***/ }),

/***/ "./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&":
/*!**************************************************************************************!*\
  !*** ./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css& */ \"./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=style&index=0&id=223367d6&scoped=true&lang=css&\");\n/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_style_index_0_id_223367d6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); \n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?");

/***/ }),

/***/ "./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true&":
/*!************************************************************************!*\
  !*** ./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true& ***!
  \************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./bestiary.vue?vue&type=template&id=223367d6&scoped=true& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/ui/bestiary.vue?vue&type=template&id=223367d6&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bestiary_vue_vue_type_template_id_223367d6_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/bestiary.vue?");

/***/ })

}]);