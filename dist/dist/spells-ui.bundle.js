(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[9],{114:function(e,t,l){"use strict";var a=l(93);l.n(a).a},115:function(e,t,l){(e.exports=l(9)(!1)).push([e.i,"\ndiv.spellbook[data-v-6adcb0a2] {\r\n\tdisplay:flex;\r\n\tpadding: 8px 14px;\r\n\tflex-direction: column;\r\n\theight:100%;\n}\n.spell-table[data-v-6adcb0a2] {\r\n\torder: 2; padding: 4px;\r\n\toverflow-y: auto;\r\n\theight:100%;\n}\n.spell-table table[data-v-6adcb0a2] { display: flex; flex-flow: row wrap; justify-content: space-between;\n}\n.spell-table table tr[data-v-6adcb0a2] { display:flex; flex-basis: 48%;\n}\n.spell-table table tr td[data-v-6adcb0a2]:nth-child(1), .spell-table table tr td[data-v-6adcb0a2]:nth-child(3) {\r\n\tflex-basis: 20%; order: 3;\n}\n.spell-table table tr td[data-v-6adcb0a2]:nth-child(2) { flex: 1; order: 1;}\n.spell-table table tr td[data-v-6adcb0a2]:nth-child(3) { flex-basis: 20%; order: 2;\n}\n.spell-table table td[data-v-6adcb0a2] { display: flex;\n}\ndiv.spellbook .filters[data-v-6adcb0a2] {\r\n        order: 1; flex-flow: row wrap; display: flex;\r\n        border-bottom: 1px solid var(--separator-color);\r\n        margin: 0; padding: 4px; line-height: 2em;\n}\ndiv.spellbook div.filters div[data-v-6adcb0a2] { box-sizing: border-box; margin: 0;\n}\ndiv.spellbook div.filters div[data-v-6adcb0a2]:nth-child(1),\r\ndiv.spellbook div.filters div[data-v-6adcb0a2]:nth-child(2) {\r\n        flex-basis: 50%;\n}\ndiv.spellbook div.filters input[type=text][data-v-6adcb0a2] { padding: 4px 0 4px 0;\n}\ndiv.spellbook div.filters > div input[type=text][data-v-6adcb0a2],\r\ndiv.spellbook div.filters > div input[type=number][data-v-6adcb0a2] {\r\n\r\n\t\tflex: 1;\r\n\t\tmargin-right: 1em;\r\n\t\tmargin-left: 1em;\r\n\t\tmin-width: unset;\r\n\t\tmax-width: unset;\r\n\t\tpadding: 4px 0;\r\n\t\tfont-size: 105%;\r\n\t\twidth: 0;\n}\ndiv.spellbook div.filters > div[data-v-6adcb0a2] { display: flex; align-items: center;\n}\ndiv.spellbook div.filters > div label[data-v-6adcb0a2] { flex-basis: 20%;\n}\ndiv.spellbook div.filters > div input[data-v-6adcb0a2] { min-width: 0; padding: 0; text-indent: 4px;\n}\ndiv.spellbook div.filters div.checks[data-v-6adcb0a2] { margin: 0; flex-basis: 16%;\n}\r\n\r\n\r\n",""])},128:function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{staticClass:"spellbook"},[l("div",{staticClass:"spell-table"},[l("table",e._l(e.viewing,(function(t){return l("tr",{key:t.id,on:{"!mouseenter":function(l){return l.stopPropagation(),e.dispatch("itemover",l,t)}}},[l("td",[t.owned&&t.attack?l("button",{on:{click:function(l){return e.dispatch("primary",t)}}},[e._v("\n\t\t\t"+e._s(e.state.player.primary===t?"Unequip":"Primary")+"\n\t\t\t")]):e._e()]),e._v(" "),l("td",[e._v(e._s(t.name))]),e._v(" "),l("td",[t.owned?l("button",{attrs:{disabled:!e.usable(t)},on:{click:function(l){return e.dispatch("spell",t)}}},[e._v("Cast")]):l("button",{attrs:{disabled:!e.usable(t)},on:{click:function(l){return e.dispatch("buy",t)}}},[e._v("Learn")])])])})),0)]),e._v(" "),l("div",{staticClass:"filters"},[l("filterbox",{attrs:{items:e.spells},model:{value:e.filtered,callback:function(t){e.filtered=t},expression:"filtered"}}),e._v(" "),l("div",[l("label",{staticClass:"level-lbl",attrs:{for:e.elmId("level")}},[e._v("Level")]),e._v(" "),l("input",{directives:[{name:"model",rawName:"v-model",value:e.minLevel,expression:"minLevel"}],staticClass:"level",attrs:{id:e.elmId("level"),type:"number",min:"0",size:"5"},domProps:{value:e.minLevel},on:{input:function(t){t.target.composing||(e.minLevel=t.target.value)}}})]),e._v(" "),e._l(e.schools,(function(t,a){return l("div",{key:a,staticClass:"checks"},[l("input",{directives:[{name:"model",rawName:"v-model",value:e.viewSchools,expression:"viewSchools"}],attrs:{type:"checkbox",id:e.elmId("chk"+a)},domProps:{value:a,checked:Array.isArray(e.viewSchools)?e._i(e.viewSchools,a)>-1:e.viewSchools},on:{change:function(t){var l=e.viewSchools,i=t.target,n=!!i.checked;if(Array.isArray(l)){var s=a,r=e._i(l,s);i.checked?r<0&&(e.viewSchools=l.concat([s])):r>-1&&(e.viewSchools=l.slice(0,r).concat(l.slice(r+1)))}else e.viewSchools=n}}}),e._v(" "),l("label",{attrs:{for:e.elmId("chk"+a)}},[e._v(e._s(a))])])}))],2)])};a._withStripped=!0;var i=l(8),n=l(38),s=(l(2),{props:["state"],mixins:[i.a],data:()=>({filtered:null,viewSchools:[],pMin:null,pMax:null}),components:{filterbox:n.a},computed:{minLevel:{get(){return this.pMin},set(e){this.pMin=Number(e)}},schools(){let e={},t=this.spells;for(let a=t.length-1;a>=0;a--){var l=t[a];l.school&&(e[l.school]=!0)}return e},viewing(){let e=this.filtered,t=this.viewSchools,l=this.minLevel;return t.length>0||l?e.filter(e=>(0===t.length||t.includes(e.school))&&(!l||e.level===l)):e},spells(){return this.state.filterItems(e=>"spell"===e.type&&!this.locked(e))}}}),r=(l(114),l(0)),d=Object(r.a)(s,a,[],!1,null,"6adcb0a2",null);d.options.__file="src/ui/spellbook.vue";t.default=d.exports},93:function(e,t,l){var a=l(115);"string"==typeof a&&(a=[[e.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};l(10)(a,i);a.locals&&(e.exports=a.locals)}}]);