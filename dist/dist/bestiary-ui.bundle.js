(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[0],{101:function(t,e,n){var a=n(122);"string"==typeof a&&(a=[[t.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(12)(a,i);a.locals&&(t.exports=a.locals)},121:function(t,e,n){"use strict";var a=n(101);n.n(a).a},122:function(t,e,n){(t.exports=n(11)(!1)).push([t.i,"\ndiv.bestiary[data-v-223367d6] {\r\ndisplay:flex;\r\nflex-direction: column;\r\nmargin-left:12px;\r\nheight:100%;\n}\n.char-list[data-v-223367d6] {\r\n\twidth:100%;\r\n\toverflow-y:auto;\r\n\tmargin-bottom:14px;\n}\ntable[data-v-223367d6] {\r\n\tborder-spacing: 4px 0px;\r\n\tborder-collapse: collapse;\r\n\trow-gap: 4px;\r\n\tcolumn-gap: 10px;\n}\ntr:first-child th[data-v-223367d6] {\r\n\tborder-bottom: 1pt solid black;\r\n\tmargin: 4px 4px;\n}\ntr > th[data-v-223367d6]:first-of-type {\r\n\ttext-align: left;\n}\nth[data-v-223367d6] {\r\n\tpadding: 4px 10px;\n}\ntd.num-align[data-v-223367d6] {\r\n\tpadding: 8px;\n}\r\n\r\n",""])},135:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bestiary"},[n("filterbox",{attrs:{items:t.items,"min-items":"14"},model:{value:t.filtered,callback:function(e){t.filtered=e},expression:"filtered"}}),t._v(" "),n("div",{staticClass:"char-list"},[n("table",{staticClass:"bestiary"},[t._m(0),t._v(" "),t._l(t.filtered,(function(e){return n("tr",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[n("th",[t._v(t._s(e.name))]),t._v(" "),n("td",{staticClass:"num-align"},[t._v(t._s(e.level))]),t._v(" "),n("td",{staticClass:"num-align"},[t._v(t._s(e.value))]),t._v(" "),n("td",{staticClass:"num-align"},[t._v(t._s(t.showHp(e)?t.toNum(e.hp):"??"))]),t._v(" "),n("td",[n("button",{attrs:{disabled:e.unique||!t.buyable(e)||0==t.minions.freeSpace()||e.value<10},on:{click:function(n){return t.dispatch("buy",e)}}},[t._v("Buy")])])])}))],2)])],1)};a._withStripped=!0;var i=n(2),r=n(9),s=n(4),l=n(43),o={mixins:[r.a],data:()=>({filtered:null}),components:{filterbox:l.a},methods:{showHp(t){return this.totalLore>=4*t.level},toNum:t=>("object"==typeof t?t instanceof s.b?t.max:t.value:t).toFixed(0)},computed:{minions:()=>i.b.state.minions,totalLore(){return this.animals.value+this.lore.value+this.demonology.value},animals:()=>i.b.state.getData("animals"),lore:()=>i.b.state.getData("lore"),demonology:()=>i.b.state.getData("demonology"),items:()=>i.b.state.monsters.filter(t=>t.value>=1).sort((t,e)=>t.level-e.level)}},d=(n(121),n(3)),u=Object(d.a)(o,a,[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("th",[this._v("Creature")]),e("th",[this._v("Level")]),e("th",[this._v("Slain")]),e("th",{staticClass:"num-align"},[this._v("Hp")])])}],!1,null,"223367d6",null);u.options.__file="src/ui/bestiary.vue";e.default=u.exports}}]);