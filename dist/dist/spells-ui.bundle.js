(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[8],{104:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"spellbook"},[n("table",e._l(e.viewing,(function(t){return n("tr",{key:t.id,on:{"!mouseenter":function(n){return n.stopPropagation(),e.dispatch("itemover",n,t)}}},[n("td",[t.owned&&t.attack?n("button",{on:{click:function(n){return e.dispatch("primary",t)}}},[e._v("\n\t\t\t"+e._s(e.state.player.primary===t?"Unequip":"Primary")+"\n\t\t\t")]):e._e()]),e._v(" "),n("td",[e._v(e._s(t.name))]),e._v(" "),n("td",[t.owned?n("button",{attrs:{disabled:!e.usable(t)},on:{click:function(n){return e.dispatch("spell",t)}}},[e._v("Cast")]):n("button",{attrs:{disabled:!e.usable(t)},on:{click:function(n){return e.dispatch("buy",t)}}},[e._v("Learn")])])])})),0),e._v(" "),n("div",{staticClass:"filters"},[n("filterbox",{attrs:{items:e.spells},model:{value:e.filtered,callback:function(t){e.filtered=t},expression:"filtered"}}),e._v(" "),n("div",[n("label",{staticClass:"level-lbl",attrs:{for:e.elmId("level")}},[e._v("Level")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.minLevel,expression:"minLevel"}],staticClass:"level",attrs:{id:e.elmId("level"),type:"number",min:"0",size:"5"},domProps:{value:e.minLevel},on:{input:function(t){t.target.composing||(e.minLevel=t.target.value)}}})]),e._v(" "),e._l(e.schools,(function(t,i){return n("div",{key:i,staticClass:"checks"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.viewSchools,expression:"viewSchools"}],attrs:{type:"checkbox",id:e.elmId("chk"+i)},domProps:{value:i,checked:Array.isArray(e.viewSchools)?e._i(e.viewSchools,i)>-1:e.viewSchools},on:{change:function(t){var n=e.viewSchools,l=t.target,s=!!l.checked;if(Array.isArray(n)){var r=i,a=e._i(n,r);l.checked?a<0&&(e.viewSchools=n.concat([r])):a>-1&&(e.viewSchools=n.slice(0,a).concat(n.slice(a+1)))}else e.viewSchools=s}}}),e._v(" "),n("label",{attrs:{for:e.elmId("chk"+i)}},[e._v(e._s(i))])])}))],2)])};i._withStripped=!0;var l=n(9),s=n(33),r=(n(1),{props:["state"],mixins:[l.a],data:()=>({filtered:null,viewSchools:[],pMin:null,pMax:null}),components:{filterbox:s.a},computed:{minLevel:{get(){return this.pMin},set(e){this.pMin=Number(e)}},schools(){let e={},t=this.spells;for(let i=t.length-1;i>=0;i--){var n=t[i];n.school&&(e[n.school]=!0)}return e},viewing(){let e=this.filtered,t=this.viewSchools,n=this.minLevel;return t.length>0||n?e.filter(e=>(0===t.length||t.includes(e.school))&&(!n||e.level===n)):e},spells(){return this.state.filterItems(e=>"spell"===e.type&&!this.locked(e))}}}),a=(n(95),n(2)),o=Object(a.a)(r,i,[],!1,null,"6adcb0a2",null);o.options.__file="src/ui/spellbook.vue";t.default=o.exports},77:function(e,t,n){var i=n(96);"string"==typeof i&&(i=[[e.i,i,""]]);var l={hmr:!0,transform:void 0,insertInto:void 0};n(11)(i,l);i.locals&&(e.exports=i.locals)},95:function(e,t,n){"use strict";var i=n(77);n.n(i).a},96:function(e,t,n){(e.exports=n(10)(!1)).push([e.i,"\ndiv.spellbook[data-v-6adcb0a2] {\r\n\tdisplay:flex;\r\n\tpadding: 0px 14px;\r\n\tflex-direction: row;\r\n\tjustify-content: space-between;\n}\n.spellbook table[data-v-6adcb0a2]{\r\n\tmin-width: 50%;\n}\ndiv.filters[data-v-6adcb0a2]{\r\n\tmargin-left: 30px;\r\n\tmargin-top:10px;\r\n\tline-height:30px;\r\n\tfont-size: 1em;\n}\n.filters div.checks[data-v-6adcb0a2] {\r\n\tmargin: 8px 0px;\n}\n.filters input[type=number][data-v-6adcb0a2] {\r\n\tmargin-left: 8px;\r\n\ttext-decoration: none;\r\n\tline-height:28px;\n}\r\n\r\n",""])}}]);