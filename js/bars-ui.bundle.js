"use strict";(self.webpackChunk_name_=self.webpackChunk_name_||[]).push([[398],{6547:(t,e,s)=>{s.r(e),s.d(e,{default:()=>c});var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"statbars"},t._l(t.itemList,(function(e){return s("div",{key:e.key,staticClass:"hidable statbar",attrs:{"data-key":e.id}},[s("span",{staticClass:"name"},[t._v(t._s(e.name))]),s("span",{staticClass:"barspan"},[s("progbar",{class:e.id,attrs:{value:e.valueOf(),max:e.max.value,color:e.color},nativeOn:{"!mouseenter":function(s){return s.stopPropagation(),t.itemOver(s,e)}}})],1)])})),0)};a._withStripped=!0;var r=s(2475),n=s(9899),i=s(7112),l=s(5046);const o={props:["bars"],mixins:[s(9736).Z,l.Z],components:{progbar:r.Z},data(){let t=n.Z.getSubVars("bars");return t.hide||(t.hide={}),{hide:t.hide}},computed:{baseItems(){let t=[],e=this.bars;for(let a=e.length-1;a>=0;a--){var s=i.ZP.getData(e[a]);s&&t.push(s)}return t},itemList(){return this.baseItems.filter((t=>this.show(t)))}}};var u=(0,s(1900).Z)(o,a,[],!1,null,null,null);u.options.__file="src/ui/components/bars.vue";const c=u.exports}}]);