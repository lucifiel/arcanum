(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[7],{104:function(t,e,n){"use strict";var i=n(88);n.n(i).a},105:function(t,e,n){(t.exports=n(8)(!1)).push([t.i,"\ndiv.potions[data-v-7ac2a2de] {\r\n\tpadding: 0px 16px;\r\n\theight:100%;\r\n\toverflow-y:auto;\n}\r\n\r\n",""])},129:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"potions"},[n("filterbox",{attrs:{items:t.potions,"min-items":"7"},model:{value:t.filtered,callback:function(e){t.filtered=e},expression:"filtered"}}),t._v(" "),n("div",{staticClass:"flex-row separate"},[n("div",{staticClass:"flex-col"},t._l(t.filtered,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[t._v("\r\n\r\n\t\t\t"+t._s(e.name)+"\r\n\r\n\t\t\t"),e.buy&&!e.owned?n("button",{attrs:{disabled:!t.buyable(e)},on:{click:function(n){return t.dispatch("buy",e)}}},[t._v("Unlock")]):n("button",{attrs:{disabled:!t.usable(e)},on:{click:function(n){return t.dispatch("brew",e)}}},[t._v("Brew")])])})),0)])],1)};i._withStripped=!0;var o=n(3),r=n(38),s={mixins:[n(7).a],data:()=>({filtered:null}),components:{inv:()=>n.e(0).then(n.bind(null,127)),filterbox:r.a},beforeCreate(){this.game=o.b},methods:{},computed:{potions(){return o.b.state.potions.filter(t=>!this.locked(t))}}},a=(n(104),n(0)),l=Object(a.a)(s,i,[],!1,null,"7ac2a2de",null);l.options.__file="src/ui/potions.vue";e.default=l.exports},88:function(t,e,n){var i=n(105);"string"==typeof i&&(i=[[t.i,i,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};n(9)(i,o);i.locals&&(t.exports=i.locals)}}]);