(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[2],{117:function(t,n,e){"use strict";var i=e(97);e.n(i).a},118:function(t,n,e){(t.exports=e(11)(!1)).push([t.i,"\ntr.equip-slot[data-v-4284ca61] {\r\n\tdisplay:flex;\r\n\tmargin: 2px 0px;\r\n\tmax-width: 30%;\n}\ntr.equip-slot button[data-v-4284ca61] {\r\n\tmargin-left: 10px;\r\n\tpadding: 6px;\n}\ntd.slot-item[data-v-4284ca61] {\r\n\tflex-basis:35%;\r\n\tflex-shrink: 1;\r\n\tmin-width: 42px;\n}\ntr.equip-slot[data-v-4284ca61] {\r\n\theight:42px;\n}\ntd.slot-name[data-v-4284ca61] {\r\n\tfont-weight: bold;\n}\r\n\r\n",""])},153:function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("table",{staticClass:"equip"},t._l(t.equip.slots,(function(n,i){return e("tr",{key:i,staticClass:"equip-slot"},[e("td",{staticClass:"slot-name"},[t._v(t._s(n.name+":"))]),t._v(" "),n.empty()?e("td",{staticClass:"slot-item"}):n.multi?e("td",{staticClass:"slot-item"},t._l(n.item,(function(i){return e("div",{key:i.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.emit("itemover",n,i)}}},[e("span",{staticClass:"item-name"},[t._v(t._s(i.name))]),t._v(" "),e("button",{on:{click:function(e){return t.emit("unequip",n,i)}}},[t._v("Unequip")])])})),0):e("td",{staticClass:"slot-item"},[e("div",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.emit("itemover",e,n.item)}}},[e("span",{staticClass:"item-name"},[t._v(t._s(n.item.name))]),e("button",{on:{click:function(e){return t.emit("unequip",n,n.item)}}},[t._v("Unequip")])])])])})),0)};i._withStripped=!0;var s={props:["equip"],methods:{}},a=(e(117),e(3)),o=Object(a.a)(s,i,[],!1,null,"4284ca61",null);o.options.__file="src/ui/sections/equip.vue";n.default=o.exports},97:function(t,n,e){var i=e(118);"string"==typeof i&&(i=[[t.i,i,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};e(12)(i,s);i.locals&&(t.exports=i.locals)}}]);