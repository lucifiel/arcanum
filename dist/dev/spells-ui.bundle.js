(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["spells-ui"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& ***!
  \****************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"\\ndiv.spellbook[data-v-6adcb0a2] {\\r\\n\\tdisplay:flex;\\r\\n\\tpadding: 0px 14px;\\r\\n\\theight:100%;\\r\\n\\tflex-direction: row;\\r\\n\\tjustify-content: space-between;\\n}\\n.spell-table[data-v-6adcb0a2] {\\r\\n\\tmin-width: 55%;\\r\\n\\theight:100%;\\r\\n\\toverflow-y: auto;\\n}\\ndiv.filters[data-v-6adcb0a2]{\\r\\n\\tmargin-left: 30px;\\r\\n\\tmargin-top:10px;\\r\\n\\tline-height:30px;\\r\\n\\tfont-size: 1em;\\n}\\n.filters div.checks[data-v-6adcb0a2] {\\r\\n\\tmargin: 8px 0px;\\n}\\n.filters input[type=number][data-v-6adcb0a2] {\\r\\n\\tmargin-left: 8px;\\r\\n\\ttext-decoration: none;\\r\\n\\tline-height:28px;\\n}\\r\\n\\r\\n\", \"\"]);\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./src/ui/spellbook.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _itemsBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./itemsBase */ \"./src/ui/itemsBase.js\");\n/* harmony import */ var _components_filterbox_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/filterbox.vue */ \"./src/ui/components/filterbox.vue\");\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../game */ \"./src/game.js\");\n\r\n\r\n\r\n\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n\r\n\tprops:['state'],\r\n\tmixins:[_itemsBase__WEBPACK_IMPORTED_MODULE_0__[\"default\"]],\r\n\tdata(){\r\n\r\n\t\treturn {\r\n\t\t\tfiltered:null,\r\n\t\t\tviewSchools:[],\r\n\t\t\tpMin:null,\r\n\t\t\tpMax:null\r\n\t\t};\r\n\r\n\t},\r\n\tcomponents:{\r\n\t\tfilterbox:_components_filterbox_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\r\n\t},\r\n\tcomputed:{\r\n\r\n\r\n\r\n\t\tminLevel:{\r\n\r\n\t\t\tget(){ return this.pMin; },\r\n\t\t\tset(v){ this.pMin = Number(v); }\r\n\r\n\t\t},\r\n\r\n\t\t/**\r\n\t\t * @property {Object.<string,string>} schools - schools of all unlocked spells.\r\n\t\t */\r\n\t\tschools() {\r\n\r\n\t\t\tlet res = {};\r\n\r\n\t\t\tlet a = this.spells;\r\n\t\t\tfor( let i = a.length-1; i>= 0; i-- ) {\r\n\t\t\t\tvar s = a[i];\r\n\t\t\t\tif ( s.school ) res[s.school] = true;\r\n\t\t\t}\r\n\r\n\t\t\treturn res;\r\n\r\n\t\t},\r\n\r\n\t\t/**\r\n\t\t * @property {Spell[]} viewing - array of spells actually visible.\r\n\t\t */\r\n\t\tviewing() {\r\n\r\n\t\t\tlet spells = this.filtered;\r\n\t\t\tlet vSchools = this.viewSchools;\r\n\t\t\tlet level = this.minLevel;\r\n\r\n\t\t\tif ( vSchools.length>0 || level ) {\r\n\r\n\t\t\t\treturn spells.filter(v=>{\r\n\t\t\t\t\treturn ((vSchools.length===0||vSchools.includes(v.school)) )\r\n\t\t\t\t\t\t&&(!level||(v.level===level));\r\n\t\t\t\t});\r\n\r\n\t\t\t}\r\n\t\t\treturn spells;\r\n\r\n\t\t},\r\n\r\n\t\t/**\r\n\t\t * @property {Spell} spells - array of spells unlocked.\r\n\t\t */\r\n\t\tspells(){\r\n\t\t\treturn this.state.filterItems(\r\n\t\t\t\tit=>it.type === 'spell' && !this.locked(it) );\r\n\t\t}\r\n\r\n\t}\r\n\r\n});\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"spellbook\" }, [\n    _c(\"div\", { staticClass: \"spell-table\" }, [\n      _c(\n        \"table\",\n        _vm._l(_vm.viewing, function(s) {\n          return _c(\n            \"tr\",\n            {\n              key: s.id,\n              on: {\n                \"!mouseenter\": function($event) {\n                  $event.stopPropagation()\n                  return _vm.dispatch(\"itemover\", $event, s)\n                }\n              }\n            },\n            [\n              _c(\"td\", [\n                s.owned && s.attack\n                  ? _c(\n                      \"button\",\n                      {\n                        on: {\n                          click: function($event) {\n                            return _vm.dispatch(\"primary\", s)\n                          }\n                        }\n                      },\n                      [\n                        _vm._v(\n                          \"\\n\\t\\t\\t\" +\n                            _vm._s(\n                              _vm.state.player.primary === s\n                                ? \"Unequip\"\n                                : \"Primary\"\n                            ) +\n                            \"\\n\\t\\t\\t\"\n                        )\n                      ]\n                    )\n                  : _vm._e()\n              ]),\n              _vm._v(\" \"),\n              _c(\"td\", [_vm._v(_vm._s(s.name))]),\n              _vm._v(\" \"),\n              _c(\"td\", [\n                s.owned\n                  ? _c(\n                      \"button\",\n                      {\n                        attrs: { disabled: !_vm.usable(s) },\n                        on: {\n                          click: function($event) {\n                            return _vm.dispatch(\"spell\", s)\n                          }\n                        }\n                      },\n                      [_vm._v(\"Cast\")]\n                    )\n                  : _c(\n                      \"button\",\n                      {\n                        attrs: { disabled: !_vm.usable(s) },\n                        on: {\n                          click: function($event) {\n                            return _vm.dispatch(\"buy\", s)\n                          }\n                        }\n                      },\n                      [_vm._v(\"Learn\")]\n                    )\n              ])\n            ]\n          )\n        }),\n        0\n      )\n    ]),\n    _vm._v(\" \"),\n    _c(\n      \"div\",\n      { staticClass: \"filters\" },\n      [\n        _c(\"filterbox\", {\n          attrs: { items: _vm.spells },\n          model: {\n            value: _vm.filtered,\n            callback: function($$v) {\n              _vm.filtered = $$v\n            },\n            expression: \"filtered\"\n          }\n        }),\n        _vm._v(\" \"),\n        _c(\"div\", [\n          _c(\n            \"label\",\n            { staticClass: \"level-lbl\", attrs: { for: _vm.elmId(\"level\") } },\n            [_vm._v(\"Level\")]\n          ),\n          _vm._v(\" \"),\n          _c(\"input\", {\n            directives: [\n              {\n                name: \"model\",\n                rawName: \"v-model\",\n                value: _vm.minLevel,\n                expression: \"minLevel\"\n              }\n            ],\n            staticClass: \"level\",\n            attrs: {\n              id: _vm.elmId(\"level\"),\n              type: \"number\",\n              min: \"0\",\n              size: \"5\"\n            },\n            domProps: { value: _vm.minLevel },\n            on: {\n              input: function($event) {\n                if ($event.target.composing) {\n                  return\n                }\n                _vm.minLevel = $event.target.value\n              }\n            }\n          })\n        ]),\n        _vm._v(\" \"),\n        _vm._l(_vm.schools, function(p, k) {\n          return _c(\"div\", { key: k, staticClass: \"checks\" }, [\n            _c(\"input\", {\n              directives: [\n                {\n                  name: \"model\",\n                  rawName: \"v-model\",\n                  value: _vm.viewSchools,\n                  expression: \"viewSchools\"\n                }\n              ],\n              attrs: { type: \"checkbox\", id: _vm.elmId(\"chk\" + k) },\n              domProps: {\n                value: k,\n                checked: Array.isArray(_vm.viewSchools)\n                  ? _vm._i(_vm.viewSchools, k) > -1\n                  : _vm.viewSchools\n              },\n              on: {\n                change: function($event) {\n                  var $$a = _vm.viewSchools,\n                    $$el = $event.target,\n                    $$c = $$el.checked ? true : false\n                  if (Array.isArray($$a)) {\n                    var $$v = k,\n                      $$i = _vm._i($$a, $$v)\n                    if ($$el.checked) {\n                      $$i < 0 && (_vm.viewSchools = $$a.concat([$$v]))\n                    } else {\n                      $$i > -1 &&\n                        (_vm.viewSchools = $$a\n                          .slice(0, $$i)\n                          .concat($$a.slice($$i + 1)))\n                    }\n                  } else {\n                    _vm.viewSchools = $$c\n                  }\n                }\n              }\n            }),\n            _vm._v(\" \"),\n            _c(\"label\", { attrs: { for: _vm.elmId(\"chk\" + k) } }, [\n              _vm._v(_vm._s(k))\n            ])\n          ])\n        })\n      ],\n      2\n    )\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/ui/spellbook.vue":
/*!******************************!*\
  !*** ./src/ui/spellbook.vue ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true& */ \"./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true&\");\n/* harmony import */ var _spellbook_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./spellbook.vue?vue&type=script&lang=js& */ \"./src/ui/spellbook.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& */ \"./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&\");\n/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(\n  _spellbook_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"6adcb0a2\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/ui/spellbook.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?");

/***/ }),

/***/ "./src/ui/spellbook.vue?vue&type=script&lang=js&":
/*!*******************************************************!*\
  !*** ./src/ui/spellbook.vue?vue&type=script&lang=js& ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib??vue-loader-options!./spellbook.vue?vue&type=script&lang=js& */ \"./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?");

/***/ }),

/***/ "./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&":
/*!***************************************************************************************!*\
  !*** ./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib??vue-loader-options!./spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css& */ \"./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=style&index=0&id=6adcb0a2&scoped=true&lang=css&\");\n/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_style_index_0_id_6adcb0a2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); \n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?");

/***/ }),

/***/ "./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true&":
/*!*************************************************************************!*\
  !*** ./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true& ***!
  \*************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/ui/spellbook.vue?vue&type=template&id=6adcb0a2&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_spellbook_vue_vue_type_template_id_6adcb0a2_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/ui/spellbook.vue?");

/***/ })

}]);