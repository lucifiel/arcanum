(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[5],{130:function(t,i,e){"use strict";var n=e(96);e.n(n).a},131:function(t,i,e){(t.exports=e(11)(!1)).push([t.i,"\ndiv.minions .minion-title[data-v-39072fa4] {\r\n\tdisplay:flex;\r\n\twidth: 380px;\r\n\tjustify-content: space-between;\n}\ndiv.minions[data-v-39072fa4] {\r\n\tpadding-left:16px;\r\n\theight:100%;\n}\n.char-list[data-v-39072fa4] {\r\n\theight:85%;\r\n\toverflow-y:auto;\n}\ntable[data-v-39072fa4] {\r\n\tborder-spacing: 4px 0px;\r\n\tborder-collapse: collapse;\r\n\trow-gap: 4px;\r\n\tcolumn-gap: 10px;\n}\ntr:first-child th[data-v-39072fa4] {\r\n\tborder-bottom: 1pt solid black;\r\n\tmargin: 4px 4px;\n}\ntr > th[data-v-39072fa4]:first-of-type {\r\n\ttext-align: left;\n}\nth[data-v-39072fa4] {\r\n\tpadding: 4px 10px;\n}\ntd.num-align[data-v-39072fa4] {\r\n\tpadding: 8px;\n}\r\n\r\n",""])},145:function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"minions"},[e("filterbox",{attrs:{items:t.items,"min-items":"10"},model:{value:t.filtered,callback:function(i){t.filtered=i},expression:"filtered"}}),t._v(" "),t.inRaid?e("span",{staticClass:"warn-text"},[t._v("Cannot change active minions while adventuring")]):t._e(),t._v(" "),e("div",{staticClass:"minion-title"},[e("span",[t._v(t._s(t.minions.count+" / "+Math.floor(t.minions.max)+" Used"))]),t._v(" "),e("span",[t._v("Allies Power: "+t._s(t.minions.allyTotal.toFixed(2)+" / "+Math.floor(t.minions.maxAllies.value)))])]),t._v(" "),e("div",{staticClass:"char-list"},[e("table",[t._m(0),t._v(" "),t._l(t.filtered,(function(i){return e("tr",{key:i.id,staticClass:"char-row",on:{"!mouseenter":function(e){return e.stopPropagation(),t.emit("itemover",e,i)}}},[e("th",[e("input",{directives:[{name:"model",rawName:"v-model",value:i.name,expression:"b.name"}],staticClass:"fld-name",attrs:{type:"text"},domProps:{value:i.name},on:{input:function(e){e.target.composing||t.$set(i,"name",e.target.value)}}})]),t._v(" "),e("td",{staticClass:"num-align"},[t._v(t._s(t.toNum(i.hp))+" / "+t._s(t.toNum(i.maxHp)))]),t._v(" "),i.alive?e("td",[e("button",{attrs:{disabled:t.inRaid||t.levelCap(i)&&!i.active},on:{click:function(e){return t.toggleActive(i)}}},[t._v(t._s(!0===i.active?"Rest":"Activate"))])]):e("td",[t._v("Dead")]),t._v(" "),e("td",[e("confirm",{on:{confirm:function(e){return t.dismiss(i)}}},[t._v(t._s("Dismiss"))])],1)])}))],2)])],1)};n._withStripped=!0;var s=e(3),a={data:()=>({filtered:null}),components:{filterbox:e(79).a},computed:{inRaid:()=>s.b.state.raid.running,minions:()=>s.b.state.minions,items(){return this.minions.filter(t=>t.value>=1)}},methods:{levelCap(t){return t.level+this.minions.allyTotal>this.minions.maxAllies},toggleActive(t){this.minions.setActive(t,!t.active)},dismiss(t){this.minions.remove(t)},toNum:t=>void 0===t?0:(t&&"object"==typeof t?t.value:t).toFixed(1)}},r=(e(130),e(2)),o=Object(r.a)(a,n,[function(){var t=this.$createElement,i=this._self._c||t;return i("tr",[i("th",[this._v("Creature")]),i("th",{staticClass:"num-align"},[this._v("Hp")]),i("th",[this._v("active")])])}],!1,null,"39072fa4",null);o.options.__file="src/ui/sections/minions.vue";i.default=o.exports},76:function(t,i,e){var n=e(78);"string"==typeof n&&(n=[[t.i,n,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};e(12)(n,s);n.locals&&(t.exports=n.locals)},77:function(t,i,e){"use strict";var n=e(76);e.n(n).a},78:function(t,i,e){(t.exports=e(11)(!1)).push([t.i,"\nlabel[data-v-6d0e0bec] {\r\n\tmargin-right:8px;\n}\ndiv.filter-box[data-v-6d0e0bec] {\r\n\tfont-size: 105%;\r\n\tvertical-align: middle;\r\n\tline-height: 1.2em;\r\n\tmargin: 8px 4px 8px 12px;\n}\n.filter-box input[type=text][data-v-6d0e0bec] {\r\n\tpadding: 4px;\r\n\tfont-size: 105%;\n}\r\n",""])},79:function(t,i,e){"use strict";var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return!this.minItems||this.items.length>=this.minItems?e("div",{staticClass:"filter-box"},[e("label",{attrs:{for:t.elmId("filter")}},[t._v("Find")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.findText,expression:"findText"}],attrs:{id:t.elmId("filter"),type:"text"},domProps:{value:t.findText},on:{input:function(i){i.target.composing||(t.findText=i.target.value)}}})]):t._e()};n._withStripped=!0;var s={props:["value","items","prop","minItems"],data(){return{text:"",pprop:this.prop||"name"}},watch:{items(t,i){this.findText=this.findText}},created(){this.findText=this.text},computed:{findText:{get(){return this.text},set(t){this.text=t;let i=this.pprop;t||this.$emit("input",this.items);var e=t.toLowerCase();"function"==typeof i?this.$emit("input",this.items.filter(t=>i(t,e))):this.$emit("input",this.items.filter(t=>"object"==typeof t&&"string"==typeof t[i]&&t[i].toLowerCase().includes(e)))}}}},a=(e(77),e(2)),r=Object(a.a)(s,n,[],!1,null,"6d0e0bec",null);r.options.__file="src/ui/components/filterbox.vue";i.a=r.exports},96:function(t,i,e){var n=e(131);"string"==typeof n&&(n=[[t.i,n,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};e(12)(n,s);n.locals&&(t.exports=n.locals)}}]);