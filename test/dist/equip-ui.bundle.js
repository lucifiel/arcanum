(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[2],{102:function(t,n,i){"use strict";var e=i(82);i.n(e).a},103:function(t,n,i){(t.exports=i(11)(!1)).push([t.i,"\ntr.equip-slot[data-v-4284ca61] {\r\n\tdisplay:flex;\r\n\tmargin: 2px 0px;\r\n\tmax-width: 30%;\n}\ntr.equip-slot button[data-v-4284ca61] {\r\n\tmargin-left: 10px;\r\n\tpadding: 6px;\n}\ntd.slot-item[data-v-4284ca61] {\r\n\tflex-basis:35%;\r\n\tflex-shrink: 1;\r\n\tmin-width: 42px;\n}\ntr.equip-slot[data-v-4284ca61] {\r\n\theight:42px;\n}\ntd.slot-name[data-v-4284ca61] {\r\n\tfont-weight: bold;\n}\r\n\r\n",""])},139:function(t,n,i){"use strict";i.r(n);var e=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("table",{staticClass:"equip"},t._l(t.equip.slots,(function(n,e){return i("tr",{key:e,staticClass:"equip-slot"},[i("td",{staticClass:"slot-name"},[t._v(t._s(n.name+":"))]),t._v(" "),n.empty()?i("td",{staticClass:"slot-item"}):n.multi?i("td",{staticClass:"slot-item"},t._l(n.item,(function(e){return i("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.emit("itemover",n,e)}}},[i("span",{staticClass:"item-name"},[t._v(t._s(e.name))]),t._v(" "),i("button",{on:{click:function(i){return t.emit("unequip",n,e)}}},[t._v("Unequip")])])})),0):i("td",{staticClass:"slot-item"},[i("div",{on:{"!mouseenter":function(i){return i.stopPropagation(),t.emit("itemover",i,n.item)}}},[i("span",{staticClass:"item-name"},[t._v(t._s(n.item.name))]),i("button",{on:{click:function(i){return t.emit("unequip",n,n.item)}}},[t._v("Unequip")])])])])})),0)};e._withStripped=!0;var s={props:["equip"]},a=(i(102),i(2)),r=Object(a.a)(s,e,[],!1,null,"4284ca61",null);r.options.__file="src/ui/sections/equip.vue";n.default=r.exports},82:function(t,n,i){var e=i(103);"string"==typeof e&&(e=[[t.i,e,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};i(12)(e,s);e.locals&&(t.exports=e.locals)}}]);