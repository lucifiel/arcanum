(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[3],{105:function(t,n,i){"use strict";i.r(n);var e=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("table",{staticClass:"equip"},t._l(t.equip.slots,(function(n,e){return i("tr",{key:e,staticClass:"equip-slot"},[i("td",{staticClass:"slot-name"},[t._v(t._s(n.name+":"))]),t._v(" "),n.empty()?i("td",{staticClass:"slot-item"}):i("td",{staticClass:"slot-item"},[n.multi?i("div",t._l(n.item,(function(e){return i("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[i("span",{staticClass:"item-name"},[t._v("\n\t\t\t\t\t\t"+t._s(e.name))]),t._v(" "),i("button",{on:{click:function(i){return t.dispatch("unequip",n,e)}}},[t._v("Unequip")])])})),0):i("div",{on:{"!mouseenter":function(i){return i.stopPropagation(),t.dispatch("itemover",i,n.item)}}},[t._v("\n\t\t\t\t"+t._s(n.item.name)),i("button",{on:{click:function(i){return t.dispatch("unequip",n,n.item)}}},[t._v("Unequip")])])])])})),0)};e._withStripped=!0;var s={props:["equip"],methods:{}},a=(i(83),i(2)),o=Object(a.a)(s,e,[],!1,null,"cdff9964",null);o.options.__file="src/ui/equip.vue";n.default=o.exports},71:function(t,n,i){var e=i(84);"string"==typeof e&&(e=[[t.i,e,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};i(11)(e,s);e.locals&&(t.exports=e.locals)},83:function(t,n,i){"use strict";var e=i(71);i.n(e).a},84:function(t,n,i){(t.exports=i(10)(!1)).push([t.i,"\ntr.equip-slot[data-v-cdff9964] {\r\n\tmargin: 2px 0px;\n}\ntr.equip-slot button[data-v-cdff9964] {\r\n\tmargin-left: 10px;\r\n\tpadding: 6px;\n}\ntd.slot-item[data-v-cdff9964] {\r\n\tmin-width: 42px;\n}\ntr.equip-slot[data-v-cdff9964] {\r\n\theight:42px;\n}\ntd.slot-name[data-v-cdff9964] {\r\n\tfont-weight: bold;\n}\r\n\r\n",""])}}]);