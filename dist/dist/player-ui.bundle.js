(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[6],{100:function(t,e,n){var a=n(120);"string"==typeof a&&(a=[[t.i,a,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};n(12)(a,r);a.locals&&(t.exports=a.locals)},117:function(t,e,n){"use strict";var a=n(99);n.n(a).a},118:function(t,e,n){(t.exports=n(11)(!1)).push([t.i,"\ndiv.allupgrades[data-v-71795d16] {\r\n\tdisplay:flex;\r\n\tflex-flow: column nowrap;\r\n\theight:100%;\n}\ndiv.up-list[data-v-71795d16] {\r\n\tmargin-bottom:14px;\r\n\toverflow-y: auto;\r\n\toverflow-x:visible;\n}\ndiv.allupgrades .div-hr[data-v-71795d16] { background: var(--header-background-color); padding: var(--small-gap);\n}\r\n\r\n",""])},119:function(t,e,n){"use strict";var a=n(100);n.n(a).a},120:function(t,e,n){(t.exports=n(11)(!1)).push([t.i,"\ndiv.player-view[data-v-427c5533] {\r\n\tdisplay:flex;\r\n\tflex-direction: row;\r\n\theight:100%;\r\n\tpadding-left:14px;\r\n\tjustify-content: space-between;\n}\ndiv.player-view input[type=text].fld-name[data-v-427c5533] { margin: 0;\n}\ntd[data-v-427c5533], th[data-v-427c5533] {\r\n\tpadding: 2px 4px;\r\n\tvertical-align: text-top;\n}\ntd[data-v-427c5533] {\r\n\ttext-align:right;\n}\nth[data-v-427c5533] { text-align: left;\n}\r\n\r\n",""])},129:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"player-view"},[n("table",[n("tr",[n("td",[t._v("name")]),n("th",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"fld-name",attrs:{type:"text"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}})])]),t._v(" "),n("tr",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.player.titles,"Titles")}}},[n("td",[t._v("title")]),n("th",[t._v(" "+t._s(t.title))])]),t._v(" "),n("tr",[n("td",[t._v("level")]),n("th",[t._v(" "+t._s(t.level))])]),t._v(" "),n("tr",[n("td",[t._v("exp")]),n("th",[t._v(" "+t._s(t.exp)+" / "+t._s(t.next)+" ")])]),t._v(" "),n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.sp)}}},[t._v("skill points")]),n("th",[t._v(" "+t._s(t.sp.value.toFixed(2)))])]),t._v(" "),n("tr",[n("td",[t._v("mount")]),n("th",[n("slotpick",{attrs:{pick:"mount"}})],1)]),t._v(" "),n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.dist)}}},[t._v("distance")]),n("th",[t._v(t._s(t.dist.current))])])]),t._v(" "),n("table",[n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.hp)}}},[t._v("life")]),n("th",[t._v("\n\t\t"+t._s(t.floor(t.hp.value))+" / "+t._s(t.floor(t.hp.max.value)))])]),t._v(" "),n("tr",[n("td",[t._v("stamina")]),n("th",[t._v("\n\t\t"+t._s(t.floor(t.stamina.value))+" / "+t._s(t.floor(t.stamina.max.value)))])]),t._v(" "),n("tr",[n("td",[t._v("defense")]),n("th",[t._v(t._s(t.defense))])]),t._v(" "),n("tr",[n("td",[t._v("dodge")]),n("th",[t._v(t._s(t.dodge))])]),t._v(" "),n("tr",[n("td",[t._v("damage bonus")]),n("th",[t._v(t._s(t.damage))])]),t._v(" "),n("tr",[n("td",[t._v("hit bonus")]),n("th",[t._v(t._s(t.tohit))])]),t._v(" "),n("tr",[n("td",[t._v("speed")]),n("th",[t._v(t._s(t.speed.toFixed(2)))])]),t._v(" "),n("tr",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.player.weapon)}}},[n("td",[t._v("weapon")]),n("th",[t._v(t._s(t.player.weapon?t.player.weapon.name:"None"))])]),t._v(" "),n("tr",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.player.primary)}}},[n("td",[t._v("spell")]),n("th",[t._v(t._s(t.player.primary?t.player.primary.name:"None"))])])]),t._v(" "),n("table",{staticClass:"resists"},t._l(t.player.resist,(function(e,a){return n("tr",{key:a},[n("td",[t._v(t._s(a))]),n("td",{staticClass:"num-align"},[t._v(t._s(e)+"%")])])})),0),t._v(" "),n("table",{staticClass:"immunities"},t._l(t.player.immunities,(function(e,a){return n("tr",{key:a},[n("td",[t._v(t._s(a))])])})),0),t._v(" "),n("upgrades")],1)};a._withStripped=!0;var r=n(1),s=n(16),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"allupgrades"},[n("div",{staticClass:"div-hr"},[t._v("upgrades")]),t._v(" "),n("div",{staticClass:"up-list"},[t._l(t.classes,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[t._v(t._s(e.name+t.count(e)))])})),t._v(" "),t._l(t.actions,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[t._v(t._s(e.name+t.count(e)))])})),t._v(" "),t._l(t.upgrades,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[t._v(t._s(e.name+t.count(e)))])}))],2)])};i._withStripped=!0;var o={methods:{count:t=>t.value>1?" ("+Math.floor(t.value)+")":""},computed:{classes:()=>r.b.state.classes.filter(t=>!t.disabled&&t.value>=1),actions:()=>r.b.state.actions.filter(t=>!t.repeat&&!t.disabled&&t.value>=1),upgrades:()=>r.b.state.upgrades.filter(t=>!t.disabled&&t.value>=1)}},l=(n(117),n(3)),p=Object(l.a)(o,i,[],!1,null,"71795d16",null);p.options.__file="src/ui/allupgrades.vue";var v=p.exports,u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.slotName?n("span",[t._v(t._s(t.slotName)+":")]):t._e(),n("span",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.dispatch("itemover",e,t.curItem)}}},[t._v(t._s(t.curItem?t.curItem.name:"None"))]),t._v(" "),t.avail.length>0?n("div",{staticClass:"inline"},[n("button",{on:{click:t.toggleChange}},[t._v(t._s(t.changing?"Done":"Choose"))]),t._v(" "),t.changing?n("div",{staticClass:"upgrade-list"},t._l(t.avail,(function(e){return n("span",{key:e.id,staticClass:"action-btn",on:{"!mouseenter":function(n){return n.stopPropagation(),t.dispatch("itemover",n,e)}}},[n("button",{staticClass:"wrapped-btn",attrs:{disabled:!t.usable(e)},on:{click:function(n){return t.dispatch(t.pEvent,e)}}},[t._v(t._s(e.name||e.id))])])})),0):t._e()]):t._e()])};u._withStripped=!0;var d={props:["pick","slotName","choices","pickEvent"],mixins:[n(9).a],data(){return{changing:!1,pEvent:this.pickEvent||"upgrade"}},methods:{toggleChange(){this.changing=!this.changing}},computed:{curItem(){return r.b.state.getSlot(this.pick)},avail(){return this.choices?this.choices:r.b.state.filterItems(t=>t.slot===this.pick&&!t.locked&&t.owned)}}},c=Object(l.a)(d,u,[],!1,null,"6f6112d4",null);c.options.__file="src/ui/components/slotpick.vue";var _={computed:{name:{get(){return this.player.name},set(t){t&&(this.player.name=t)}},title(){return this.player.title},speed(){let t=this.player.speed.value;return"object"==typeof t?t.value:t},stamina(){return this.player.stamina},level(){return this.player.level},hp(){return this.player.hp},defense(){return this.player.defense.value},dodge(){return this.player.dodge.value},damage(){return this.player.damage||0},tohit(){return this.player.tohit.value},exp(){return this.floor(this.player.exp.value)},next(){return this.floor(this.player.next)},mount:()=>r.b.state.getSlot("mount"),dist(){return this.player.dist},sp(){return this.player.sp}},components:{upgrades:v,slotpick:c.exports},beforeCreate(){this.player=r.b.state.player},methods:{floor:s.b}},h=(n(119),Object(l.a)(_,a,[],!1,null,"427c5533",null));h.options.__file="src/ui/player.vue";e.default=h.exports},99:function(t,e,n){var a=n(118);"string"==typeof a&&(a=[[t.i,a,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};n(12)(a,r);a.locals&&(t.exports=a.locals)}}]);