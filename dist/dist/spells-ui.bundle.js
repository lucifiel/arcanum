(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[10],{117:function(t,e,i){"use strict";var l=i(91);i.n(l).a},118:function(t,e,i){(t.exports=i(11)(!1)).push([t.i,"\n.spellbook[data-v-6adcb0a2] {\r\n\tpadding: 4px;\r\n\toverflow-y: auto;\r\n\theight:100%;\r\n\tmargin-bottom: 20px;\n}\n.spellbook table[data-v-6adcb0a2] { display: flex; flex-flow: row wrap; justify-content: space-between;\n}\n.spellbook table tr[data-v-6adcb0a2] { display:flex; flex-basis: 48%;\n}\n.spellbook table tr td[data-v-6adcb0a2]:nth-child(1), .spellbook table tr td[data-v-6adcb0a2]:nth-child(3) {\r\n\tflex-basis: 20%; order: 3;\n}\n.spellbook table tr td[data-v-6adcb0a2]:nth-child(2) { flex: 1; order: 1;}\n.spellbook table tr td[data-v-6adcb0a2]:nth-child(3) { flex-basis: 20%; order: 2;\n}\n.spellbook table td[data-v-6adcb0a2] { display: flex;\n}\ndiv.spellbook[data-v-6adcb0a2] { flex-direction: column; padding: 0;\n}\ndiv.spellbook[data-v-6adcb0a2] { margin: 0; padding: var(--medium-gap);\n}\ndiv.spellbook table[data-v-6adcb0a2] {\r\n        display: grid; grid-template-columns: minmax( 256px, 1fr ) repeat( auto-fit, minmax( 256px, 1fr ));\r\n        grid-auto-rows:  1fr;\n}\ndiv.spellbook  table tr[data-v-6adcb0a2] { padding: var(--small-gap); display:flex; align-items:center;\n}\ndiv.spellbook  table tr td[data-v-6adcb0a2]:nth-child(1),\r\n    div.spellbook  table tr td[data-v-6adcb0a2]:nth-child(2){ flex: 1;\n}\ndiv.spellbook  table tr td[data-v-6adcb0a2]:nth-child(2){ flex: 2;\n}\ndiv.spellbook button[data-v-6adcb0a2] { flex: 1; font-size: var(--compact-small-font); margin: 0;\n}\r\n\r\n\r\n",""])},119:function(t,e,i){"use strict";var l=i(92);i.n(l).a},120:function(t,e,i){(t.exports=i(11)(!1)).push([t.i,"\ndiv.spells[data-v-1967362c] {\r\n\r\n\tdisplay:flex;\r\n\tflex-flow: column nowrap;\r\n\tpadding: 8px 14px;\r\n\theight:100%;\n}\ndiv.spells .bottom[data-v-1967362c] {\r\n\tdisplay:flex;\r\n\tflex-flow: row nowrap;\n}\ndiv.spells .spellbook[data-v-1967362c] {\r\n\tflex-grow:1;\n}\ndiv.spells .spelllist[data-v-1967362c] {\r\n\tborder-left: 1px solid var( --separator-color );\r\n\twidth:140px;\r\n\tpadding: var( --tiny-gap );\r\n\tflex-shrink: 1;\n}\ndiv.spells .filters[data-v-1967362c] {\r\n       flex-flow: row wrap; display: flex;\r\n        border-bottom: 1px solid var(--separator-color);\r\n        margin: 0; padding: 4px; line-height: 2em;\n}\ndiv.spells div.filters div[data-v-1967362c] { box-sizing: border-box; margin: 0;\n}\ndiv.spells div.filters div[data-v-1967362c]:nth-child(1),\r\ndiv.spells div.filters div[data-v-1967362c]:nth-child(2) {\r\n        flex-basis: 50%;\n}\ndiv.spells div.filters input[type=text][data-v-1967362c] { padding: 4px 0 4px 0;\n}\ndiv.spells div.filters > div input[type=text][data-v-1967362c],\r\ndiv.spells div.filters > div input[type=number][data-v-1967362c] {\r\n\r\n\t\tflex: 1;\r\n\t\tmargin-right: 1em;\r\n\t\tmargin-left: 1em;\r\n\t\tmin-width: unset;\r\n\t\tmax-width: unset;\r\n\t\tpadding: 4px 0;\r\n\t\tfont-size: 105%;\r\n\t\twidth: 0;\n}\ndiv.spells div.filters > div[data-v-1967362c] { display: flex; align-items: center;\n}\ndiv.spells div.filters > div label[data-v-1967362c] { flex-basis: 20%;\n}\ndiv.spells div.filters > div input[data-v-1967362c] { min-width: 0; padding: 0; text-indent: 4px;\n}\ndiv.spells div.filters div.checks[data-v-1967362c] { margin: 0; flex-basis: 16%;\n}\r\n\r\n\t\t/*div.spellbook .filters {\r\n\t\t\torder: 1; flex-flow: row wrap; display: flex; text-align: center;\r\n\t\t\tborder-bottom: 1px solid var(--separator-color);\r\n\t\t\tmargin: 0; padding: var(--small-gap); line-height: 2em; justify-content: flex-start;\r\n\t\t}\r\n\t\t.div.spellbook div.filters div { box-sizing: border-box; margin: 0; }\r\n\t\tdiv.spellbook div.filters div:nth-child(1),\r\n\t\tdiv.spellbook div.filters div:nth-child(2) {\r\n\t\t\tflex-basis: 50%;\r\n\t\t}\r\n\t\tdiv.spellbook div.filters input[type=text] { padding: var(--small-gap) 0 var(--small-gap) 0; }\r\n\t\tdiv.spellbook div.filters > div input[type=text],\r\n\t\tdiv.spellbook div.filters > div input[type=number] {\r\n\t\t\tflex: 1; margin-right: 1em; margin-left: 1em; min-width: unset; max-width: unset; width: 0;\r\n\t\t}\r\n\t\tdiv.spellbook div.filters > div { display: flex; align-items: center; }\r\n\t\tdiv.spellbook div.filters > div label { flex-basis: 20%; }\r\n\t\tdiv.spellbook div.filters > div input { min-width: 0; padding: 0; text-indent: var(--small-gap); }\r\n\t\tdiv.spellbook div.filters div.checks { margin: 0; padding: 0 0.5em; flex-basis: unset; }*/\r\n\r\n",""])},135:function(t,e,i){"use strict";i.r(e);var l=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"spells"},[i("div",{staticClass:"filters"},[i("filterbox",{attrs:{items:t.spells},model:{value:t.filtered,callback:function(e){t.filtered=e},expression:"filtered"}}),t._v(" "),i("div",[i("label",{staticClass:"level-lbl",attrs:{for:t.elmId("level")}},[t._v("Level")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.minLevel,expression:"minLevel"}],staticClass:"level",attrs:{id:t.elmId("level"),type:"number",min:"0",size:"5"},domProps:{value:t.minLevel},on:{input:function(e){e.target.composing||(t.minLevel=e.target.value)}}})]),t._v(" "),t._l(t.schools,(function(e,l){return i("div",{key:l,staticClass:"checks"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.viewSchools,expression:"viewSchools"}],attrs:{type:"checkbox",id:t.elmId("chk"+l)},domProps:{value:l,checked:Array.isArray(t.viewSchools)?t._i(t.viewSchools,l)>-1:t.viewSchools},on:{change:function(e){var i=t.viewSchools,s=e.target,n=!!s.checked;if(Array.isArray(i)){var a=l,r=t._i(i,a);s.checked?r<0&&(t.viewSchools=i.concat([a])):r>-1&&(t.viewSchools=i.slice(0,r).concat(i.slice(r+1)))}else t.viewSchools=n}}}),t._v(" "),i("label",{attrs:{for:t.elmId("chk"+l)}},[t._v(t._s(l))])])})),t._v(" "),i("button",{on:{click:t.toggle}},[t._v("Memorized")])],2),t._v(" "),i("div",{staticClass:"bottom"},[i("book",{staticClass:"spellbook",attrs:{viewing:t.viewing}}),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showList,expression:"showList"}]},[i("spelllist",{staticClass:"spelllist",attrs:{list:t.list}})],1)],1)])};l._withStripped=!0;var s=i(2),n=i(10),a=i(81),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"spellbook"},[i("table",t._l(t.viewing,(function(e){return i("tr",{key:e.id,on:{"!mouseenter":function(i){return i.stopPropagation(),t.emit("itemover",i,e)}}},[i("td",[e.owned&&t.list.canAdd(e)?i("button",{on:{click:function(i){return t.addList(e)}}},[t._v("Memorize")]):t._e()]),t._v(" "),i("td",[t._v(t._s(e.name))]),t._v(" "),i("td",[e.owned?i("button",{attrs:{disabled:!t.usable(e)},on:{click:function(i){return t.emit("spell",e)}}},[t._v("Cast")]):i("button",{attrs:{disabled:!t.usable(e)},on:{click:function(i){return t.emit("buy",e)}}},[t._v("Learn")])])])})),0)])};r._withStripped=!0;var o={props:["viewing"],mixins:[n.a],methods:{addList(t){this.list.add(t)}},computed:{state:()=>s.b.state,list:()=>s.b.state.spelllist}},d=(i(117),i(3)),v=Object(d.a)(o,r,[],!1,null,"6adcb0a2",null);v.options.__file="src/ui/spellbook.vue";var p=v.exports,c=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"spelllist"},[i("span",[t._v("Max Levels: "+t._s(t.list.used+" / "+Math.floor(t.list.max.value)))]),t._v(" "),t.list.full()?i("span",{staticClass:"warn-text"},[t._v("Spelllist is Full")]):t._e(),t._v(" "),t._l(t.list.items,(function(e,l){return i("div",{key:l,on:{"!mouseenter":function(i){return i.stopPropagation(),t.emit("itemover",i,e)}}},[i("span",[t._v(t._s(e.name))]),i("button",{on:{click:function(i){return t.remove(e)}}},[t._v("Remove")])])}))],2)};c._withStripped=!0;var f={props:["list"],methods:{remove(t){this.list.remove(t)},add(t){this.list.add(t)}},computed:{}},m=Object(d.a)(f,c,[],!1,null,"b96b8a38",null);m.options.__file="src/ui/spelllist.vue";var u=m.exports,b={data:()=>({showList:!1,filtered:null,viewSchools:[],pMin:null,pMax:null}),mixins:[n.a],components:{filterbox:a.a,book:p,spelllist:u},methods:{toggle(){this.showList=!this.showList,console.log("SHOW: "+this.showList)}},computed:{state:()=>s.b.state,list:()=>s.b.state.spelllist,minLevel:{get(){return this.pMin},set(t){this.pMin=Number(t)}},schools(){let t={},e=this.spells;for(let l=e.length-1;l>=0;l--){var i=e[l];i.school&&(t[i.school]=!0)}return t},viewing(){let t=this.filtered,e=this.viewSchools,i=this.minLevel;return e.length>0||i?t.filter(t=>(0===e.length||e.includes(t.school))&&(!i||t.level===i)):t},spells(){return this.state.filterItems(t=>"spell"===t.type&&!this.locked(t))}}},h=(i(119),Object(d.a)(b,l,[],!1,null,"1967362c",null));h.options.__file="src/ui/sections/spells.vue";e.default=h.exports},78:function(t,e,i){var l=i(80);"string"==typeof l&&(l=[[t.i,l,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};i(12)(l,s);l.locals&&(t.exports=l.locals)},79:function(t,e,i){"use strict";var l=i(78);i.n(l).a},80:function(t,e,i){(t.exports=i(11)(!1)).push([t.i,"\nlabel[data-v-6d0e0bec] {\r\n\tmargin-right:8px;\n}\ndiv.filter-box[data-v-6d0e0bec] {\r\n\tfont-size: 105%;\r\n\tvertical-align: middle;\r\n\tline-height: 1.2em;\r\n\tmargin: 8px 4px 8px 12px;\n}\n.filter-box input[type=text][data-v-6d0e0bec] {\r\n\tpadding: 4px;\r\n\tfont-size: 105%;\n}\r\n",""])},81:function(t,e,i){"use strict";var l=function(){var t=this,e=t.$createElement,i=t._self._c||e;return!this.minItems||this.items.length>=this.minItems?i("div",{staticClass:"filter-box"},[i("label",{attrs:{for:t.elmId("filter")}},[t._v("Find")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.findText,expression:"findText"}],attrs:{id:t.elmId("filter"),type:"text"},domProps:{value:t.findText},on:{input:function(e){e.target.composing||(t.findText=e.target.value)}}})]):t._e()};l._withStripped=!0;var s={props:["value","items","prop","minItems"],data(){return{text:"",pprop:this.prop||"name"}},watch:{items(t,e){this.findText=this.findText}},created(){this.findText=this.text},computed:{findText:{get(){return this.text},set(t){this.text=t;let e=this.pprop;t?"function"==typeof e?this.$emit("input",this.items.filter(i=>e(i,t))):this.$emit("input",this.items.filter(i=>"object"==typeof i&&"string"==typeof i[e]&&i[e].includes(t))):this.$emit("input",this.items)}}}},n=(i(79),i(3)),a=Object(n.a)(s,l,[],!1,null,"6d0e0bec",null);a.options.__file="src/ui/components/filterbox.vue";e.a=a.exports},91:function(t,e,i){var l=i(118);"string"==typeof l&&(l=[[t.i,l,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};i(12)(l,s);l.locals&&(t.exports=l.locals)},92:function(t,e,i){var l=i(120);"string"==typeof l&&(l=[[t.i,l,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};i(12)(l,s);l.locals&&(t.exports=l.locals)}}]);