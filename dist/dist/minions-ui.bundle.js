(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[5],{104:function(t,n,e){var i=e(128);"string"==typeof i&&(i=[[t.i,i,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};e(12)(i,a);i.locals&&(t.exports=i.locals)},127:function(t,n,e){"use strict";var i=e(104);e.n(i).a},128:function(t,n,e){(t.exports=e(11)(!1)).push([t.i,"\ndiv.minions .minion-title[data-v-ee7d6c4a] {\r\n\tdisplay:flex;\r\n\twidth: 380px;\r\n\tjustify-content: space-between;\n}\ndiv.minions[data-v-ee7d6c4a] {\r\n\tpadding-left:16px;\r\n\theight:100%;\n}\n.char-list[data-v-ee7d6c4a] {\r\n\theight:85%;\r\n\toverflow-y:auto;\n}\ntable[data-v-ee7d6c4a] {\r\n\tborder-spacing: 4px 0px;\r\n\tborder-collapse: collapse;\r\n\trow-gap: 4px;\r\n\tcolumn-gap: 10px;\n}\ntr:first-child th[data-v-ee7d6c4a] {\r\n\tborder-bottom: 1pt solid black;\r\n\tmargin: 4px 4px;\n}\ntr > th[data-v-ee7d6c4a]:first-of-type {\r\n\ttext-align: left;\n}\nth[data-v-ee7d6c4a] {\r\n\tpadding: 4px 10px;\n}\ntd.num-align[data-v-ee7d6c4a] {\r\n\tpadding: 8px;\n}\r\n\r\n",""])},138:function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"minions"},[e("filterbox",{attrs:{items:t.items,"min-items":"10"},model:{value:t.filtered,callback:function(n){t.filtered=n},expression:"filtered"}}),t._v(" "),t.inRaid?e("span",{staticClass:"warn-text"},[t._v("Cannot change active minions while adventuring")]):t._e(),t._v(" "),e("div",{staticClass:"minion-title"},[e("span",[t._v(t._s(t.minions.count+" / "+Math.floor(t.minions.max)+" Used"))]),t._v(" "),e("span",[t._v("Allies Power: "+t._s(t.minions.allyTotal.toFixed(2)+" / "+Math.floor(t.minions.maxAllies.value)))])]),t._v(" "),e("div",{staticClass:"char-list"},[e("table",[t._m(0),t._v(" "),t._l(t.filtered,(function(n){return e("tr",{key:n.id,staticClass:"char-row",on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,n)}}},[e("th",[e("input",{directives:[{name:"model",rawName:"v-model",value:n.name,expression:"b.name"}],staticClass:"fld-name",attrs:{type:"text"},domProps:{value:n.name},on:{input:function(e){e.target.composing||t.$set(n,"name",e.target.value)}}})]),t._v(" "),e("td",{staticClass:"num-align"},[t._v(t._s(t.toNum(n.hp))+" / "+t._s(t.toNum(n.maxHp)))]),t._v(" "),n.alive?e("td",[e("button",{attrs:{disabled:t.inRaid||t.levelCap(n)&&!n.active},on:{click:function(e){return t.toggleActive(n)}}},[t._v(t._s(!0===n.active?"Rest":"Activate"))])]):e("td",[t._v("Dead")]),t._v(" "),e("td",[e("confirm",{on:{confirm:function(e){return t.dismiss(n)}}},[t._v(t._s("Dismiss"))])],1)])}))],2)])],1)};i._withStripped=!0;var a=e(1),s={data:()=>({filtered:null}),components:{filterbox:e(43).a},computed:{inRaid:()=>a.b.state.raid.running,minions:()=>a.b.state.minions,items(){return this.minions.filter(t=>t.value>=1)}},methods:{levelCap(t){return t.level+this.minions.allyTotal>this.minions.maxAllies},toggleActive(t){this.minions.setActive(t,!t.active)},dismiss(t){this.minions.remove(t)},toNum:t=>void 0===t?0:(t&&"object"==typeof t?t.value:t).toFixed(1)}},o=(e(127),e(3)),r=Object(o.a)(s,i,[function(){var t=this.$createElement,n=this._self._c||t;return n("tr",[n("th",[this._v("Creature")]),n("th",{staticClass:"num-align"},[this._v("Hp")]),n("th",[this._v("active")])])}],!1,null,"ee7d6c4a",null);r.options.__file="src/ui/minions.vue";n.default=r.exports}}]);