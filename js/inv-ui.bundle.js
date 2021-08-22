"use strict";(self.webpackChunk_name_=self.webpackChunk_name_||[]).push([[767],{1430:(t,n,e)=>{e.d(n,{Z:()=>l});var i=e(4015),s=e.n(i),a=e(3645),r=e.n(a)()(s());r.push([t.id,"\nlabel[data-v-6d0e0bec] {\n\tmargin-right:var(--md-gap);\n}\n","",{version:3,sources:["webpack://./src/ui/components/filterbox.vue"],names:[],mappings:";AAqEA;CACA,0BAAA;AACA",sourcesContent:["<script>\nexport default {\n\n\t/**\n\t * @property {object[]} items - items to filter.\n\t * @property {prop} [prop='name'] - target prop of filter test.\n\t *\n\t * @property {number} [minItems=0] - minimum number of items before box is visible.\n\t */\n\tprops:['value', 'items', 'prop', 'minItems'],\n\tdata() {\n\t\treturn {\n\t\t\ttext:'',\n\t\t\tpprop:this.prop||'name'\n\t\t}\n\t},\n\twatch:{\n\t\titems(newVal,oldVal){ this.findText = this.findText; }\n\t},\n\tcreated(){\n\t\tthis.findText = this.text;\n\t},\n\tmethods:{\n\t\tclear(){ this.text = ''; }\n\t},\n\tcomputed:{\n\n\t\tfindText:{\n\n\t\t\tget() { return this.text; },\n\t\t\tset(v){\n\n\t\t\t\tthis.text = v;\n\t\t\t\tlet p = this.pprop;\n\n\t\t\t\tif ( !v ) this.$emit( 'input', this.items );\n\n\t\t\t\tvar txt = v.toLowerCase();\n\n\t\t\t\tif ( typeof p === 'function') {\n\n \t\t\t\t\tthis.$emit( 'input', this.items.filter(\n\t\t\t\t\t\tit=>p(it, txt )\n\t\t\t\t\t));\n\n\t\t\t\t} else this.$emit( 'input', this.items.filter(\n\t\t\t\t\tit=>(typeof it === 'object') &&\n\t\t\t\t\t( (typeof it[p]) === 'string' ) && it[p].toLowerCase().includes( txt )\n\t\t\t\t));\n\n\t\t\t}\n\n\t\t}\n\n\t}\n\n}\n<\/script>\n\n\n<template>\n\t<div class=\"filter-box\" v-if=\"!this.minItems||text||(this.items.length>=this.minItems)\">\n\t\t<label :for=\"elmId('filter')\">Find</label>\n\t\t<input :id=\"elmId('filter')\" v-model=\"findText\" type=\"text\">\n\t</div>\n</template>\n\n\n<style scoped>\nlabel {\n\tmargin-right:var(--md-gap);\n}\n</style>"],sourceRoot:""}]);const l=r},8433:(t,n,e)=>{e.d(n,{Z:()=>l});var i=e(4015),s=e.n(i),a=e(3645),r=e.n(a)()(s());r.push([t.id,"\n.inventory[data-v-9826dde6] {\n\tdisplay:flex;\n\tflex-direction: column;\n\twidth:100%;\n\theight:100%;\n\tmin-height: 0;\n}\n.top[data-v-9826dde6] {\n\tpadding: var(--tiny-gap);\n\tpadding-top: var(--sm-gap);\n}\n.filter-box[data-v-9826dde6] {\n\tdisplay:inline;\n\tfont-size: 0.9rem;\n}\n\n/*.table-div {\n\tdisplay: grid; grid-template-columns: 1fr 1fr;\n\tflex-grow: 1;\n\theight:100%;\n}*/\n.item-table[data-v-9826dde6] {\n\tflex-grow: 1;\n\tflex-shrink: 1;\n\t\toverflow-y: auto;\n\t\tmin-height: 0;\n\t\tmargin: 0;\n\t\tpadding:0;\n\t\tdisplay: grid; grid-template-columns: repeat( auto-fit, minmax( 12rem, 1fr ));\n\t\t grid-auto-rows: min-content;\n}\n.item-name[data-v-9826dde6] {\n\tflex-grow: 1;\n}\n.item-table .item[data-v-9826dde6] {\n\tmargin: var(--sm-gap);\n        padding: var(--sm-gap); align-items: center;\n}\n.item .item-action[data-v-9826dde6] { margin: var(--tiny-gap);\n}\n\n\n","",{version:3,sources:["webpack://./src/ui/sections/inventory.vue"],names:[],mappings:";AAkHA;CACA,YAAA;CACA,sBAAA;CACA,UAAA;CACA,WAAA;CACA,aAAA;AACA;AAEA;CACA,wBAAA;CACA,0BAAA;AACA;AAEA;CACA,cAAA;CACA,iBAAA;AACA;;AAEA;;;;EAIA;AAEA;CACA,YAAA;CACA,cAAA;EACA,gBAAA;EACA,aAAA;EACA,SAAA;EACA,SAAA;EACA,aAAA,EAAA,8DAAA;GACA,2BAAA;AAEA;AAEA;CACA,YAAA;AACA;AAEA;CACA,qBAAA;QACA,sBAAA,EAAA,mBAAA;AACA;AAEA,sCAAA,uBAAA;AAAA",sourcesContent:['<script>\nimport Game from \'../../game\';\nimport FilterBox from \'../components/filterbox.vue\';\nimport { USE } from \'../../events\';\n\nexport default {\n\n\t/**\n\t * @property {Inventory} inv - the inventory object.\n\t * @property {boolean} take - whether to display take button.\n\t * @property {boolean} selecting - inventory is selection only. sell-all & size information hidden.\n\t * @property {string[]} types - item types to display.\n\t */\n\tprops:[\'inv\', \'take\', \'value\', \'selecting\', \'nosearch\', \'types\'],\n\tdata() {\n\t\treturn {\n\t\t\tfiltered:null\n\t\t}\n\t},\n\tcreated() { this.USE = USE; },\n\tcomponents:{\n\t\tfilterbox:FilterBox\n\t},\n\tmethods:{\n\n\t\tsellAll(){\n\n\t\t\tlet items = this.filtered;// this.inv.removeAll();\n\t\t\tfor( let i = items.length-1; i>=0; i-- ){\n\t\t\t\tthis.emit( \'sell\', items[i], this.inv, items[i].value);\n\t\t\t}\n\t\t\t//this.$refs.filter.clear();\n\n\t\t},\n\n\t\tcount(it) { return it.count > 1 ? \' (\' + Math.floor(it.count) + \')\': \'\'; },\n\t\tdrop( it ){ this.inv.remove(it); },\n\n\t\t/**\n\t\t * Test if item can be added to USER inventory.\n\t\t */\n\t\tcanAdd(it) {\n\t\t\treturn Game.state.inventory.canAdd(it);\n\t\t},\n\n\t\tonTake(it) {\n\n\t\t\t//console.log(\'start take: \' + it.id );\n\t\t\tthis.emit(\'take\', it );\n\t\t\tthis.inv.remove(it);\n\n\t\t}\n\n\t},\n\tcomputed:{\n\n\t\tbaseItems(){\n\n\t\t\tlet types = this.types;\n\t\t\tif ( this.types ) {\n\t\t\t\treturn this.inv.items.filter(it=>this.types.includes(it.type));\n\t\t\t}\n\t\t\treturn this.inv.items;\n\n\t\t},\n\n\t\tplayerInv(){ return this.inv === Game.state.inventory; },\n\t\tplayerFull(){ return Game.state.inventory.full(); }\n\t}\n\n}\n<\/script>\n\n\n<template>\n<div class="inventory">\n\n\t<span class="top">\n\t<filterbox ref="filter" v-if="!nosearch" v-model="filtered" :items="baseItems" min-items="7" />\n\t<span v-if="!selecting">\n\t\t<span v-if="inv.max>0">{{ inv.items.length + \' / \' + Math.floor(inv.max.value ) + \' Used\' }}</span>\n\t\t<button v-if="inv.count>0" @click="sellAll">Sell All</button>\n\t</span>\n\t</span>\n\n\t<div class="item-table">\n\n\t<div class="item separate" v-for="it in ( nosearch ? baseItems : filtered )" :key="it.id">\n\t\t<span class="item-name" @mouseenter.capture.stop="itemOver($event,it)">{{ it.name + count(it) }}</span>\n\n\n\t\t<template v-if="!selecting">\n\n\t\t\t<button v-if="it.equippable" class="item-action" @click="emit(\'equip\',it, inv)">Equip</button>\n\t\t\t<button v-if="it.use" class="item-action" @mouseenter.capture.stop="itemOver($event,it)" @click="emit( USE, it, inv)">Use</button>\n\t\t\t<button v-if="take&&canAdd(it)" class="item-action" @click="onTake(it)">Take</button>\n\n\t\t\t<button class="item-action"  @click="emit(\'sell\',it,inv)" @mouseenter.capture.stop="itemOver($event,it)">Sell</button>\n\t\t\t<button v-if="it.value>1" class="item-action"  @click="emit(\'sell\',it,inv, it.value)" @mouseenter.capture.stop="itemOver($event,it)">Sell All</button>\n\n\t\t</template>\n\t\t<template v-else>\n\t\t\t<button class="item-action"  @click="$emit(\'input\', it)">Select</button>\n\t\t</template>\n\t</div>\n</div>\n\n<div v-if="playerFull" class="warn-text">Inventory Full</div>\n</div>\n</template>\n\n\n<style scoped>\n\n.inventory {\n\tdisplay:flex;\n\tflex-direction: column;\n\twidth:100%;\n\theight:100%;\n\tmin-height: 0;\n}\n\n.top {\n\tpadding: var(--tiny-gap);\n\tpadding-top: var(--sm-gap);\n}\n\n.filter-box {\n\tdisplay:inline;\n\tfont-size: 0.9rem;\n}\n\n/*.table-div {\n\tdisplay: grid; grid-template-columns: 1fr 1fr;\n\tflex-grow: 1;\n\theight:100%;\n}*/\n\n.item-table {\n\tflex-grow: 1;\n\tflex-shrink: 1;\n\t\toverflow-y: auto;\n\t\tmin-height: 0;\n\t\tmargin: 0;\n\t\tpadding:0;\n\t\tdisplay: grid; grid-template-columns: repeat( auto-fit, minmax( 12rem, 1fr ));\n\t\t grid-auto-rows: min-content;\n\n    }\n\n.item-name {\n\tflex-grow: 1;\n}\n\n.item-table .item {\n\tmargin: var(--sm-gap);\n        padding: var(--sm-gap); align-items: center;\n    }\n\n.item .item-action { margin: var(--tiny-gap); }\n\n\n</style>'],sourceRoot:""}]);const l=r},4194:(t,n,e)=>{e.d(n,{Z:()=>b});var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return!this.minItems||t.text||this.items.length>=this.minItems?e("div",{staticClass:"filter-box"},[e("label",{attrs:{for:t.elmId("filter")}},[t._v("Find")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.findText,expression:"findText"}],attrs:{id:t.elmId("filter"),type:"text"},domProps:{value:t.findText},on:{input:function(n){n.target.composing||(t.findText=n.target.value)}}})]):t._e()};i._withStripped=!0;const s={props:["value","items","prop","minItems"],data(){return{text:"",pprop:this.prop||"name"}},watch:{items(t,n){this.findText=this.findText}},created(){this.findText=this.text},methods:{clear(){this.text=""}},computed:{findText:{get(){return this.text},set(t){this.text=t;let n=this.pprop;t||this.$emit("input",this.items);var e=t.toLowerCase();"function"==typeof n?this.$emit("input",this.items.filter((t=>n(t,e)))):this.$emit("input",this.items.filter((t=>"object"==typeof t&&"string"==typeof t[n]&&t[n].toLowerCase().includes(e))))}}}};var a=e(3379),r=e.n(a),l=e(7795),o=e.n(l),m=e(569),p=e.n(m),c=e(3565),A=e.n(c),u=e(9216),v=e.n(u),d=e(4589),f=e.n(d),h=e(1430),g={};g.styleTagTransform=f(),g.setAttributes=A(),g.insert=p().bind(null,"head"),g.domAPI=o(),g.insertStyleElement=v(),r()(h.Z,g),h.Z&&h.Z.locals&&h.Z.locals;var y=(0,e(1900).Z)(s,i,[],!1,null,"6d0e0bec",null);y.options.__file="src/ui/components/filterbox.vue";const b=y.exports},6962:(t,n,e)=>{e.r(n),e.d(n,{default:()=>_});var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"inventory"},[e("span",{staticClass:"top"},[t.nosearch?t._e():e("filterbox",{ref:"filter",attrs:{items:t.baseItems,"min-items":"7"},model:{value:t.filtered,callback:function(n){t.filtered=n},expression:"filtered"}}),t._v(" "),t.selecting?t._e():e("span",[t.inv.max>0?e("span",[t._v(t._s(t.inv.items.length+" / "+Math.floor(t.inv.max.value)+" Used"))]):t._e(),t._v(" "),t.inv.count>0?e("button",{on:{click:t.sellAll}},[t._v("Sell All")]):t._e()])],1),t._v(" "),e("div",{staticClass:"item-table"},t._l(t.nosearch?t.baseItems:t.filtered,(function(n){return e("div",{key:n.id,staticClass:"item separate"},[e("span",{staticClass:"item-name",on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,n)}}},[t._v(t._s(n.name+t.count(n)))]),t._v(" "),t.selecting?[e("button",{staticClass:"item-action",on:{click:function(e){return t.$emit("input",n)}}},[t._v("Select")])]:[n.equippable?e("button",{staticClass:"item-action",on:{click:function(e){return t.emit("equip",n,t.inv)}}},[t._v("Equip")]):t._e(),t._v(" "),n.use?e("button",{staticClass:"item-action",on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,n)},click:function(e){return t.emit(t.USE,n,t.inv)}}},[t._v("Use")]):t._e(),t._v(" "),t.take&&t.canAdd(n)?e("button",{staticClass:"item-action",on:{click:function(e){return t.onTake(n)}}},[t._v("Take")]):t._e(),t._v(" "),e("button",{staticClass:"item-action",on:{click:function(e){return t.emit("sell",n,t.inv)},"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,n)}}},[t._v("Sell")]),t._v(" "),n.value>1?e("button",{staticClass:"item-action",on:{click:function(e){return t.emit("sell",n,t.inv,n.value)},"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,n)}}},[t._v("Sell All")]):t._e()]],2)})),0),t._v(" "),t.playerFull?e("div",{staticClass:"warn-text"},[t._v("Inventory Full")]):t._e()])};i._withStripped=!0;var s=e(7112),a=e(4194),r=e(4478);const l={props:["inv","take","value","selecting","nosearch","types"],data:()=>({filtered:null}),created(){this.USE=r.Ut},components:{filterbox:a.Z},methods:{sellAll(){let t=this.filtered;for(let n=t.length-1;n>=0;n--)this.emit("sell",t[n],this.inv,t[n].value)},count:t=>t.count>1?" ("+Math.floor(t.count)+")":"",drop(t){this.inv.remove(t)},canAdd:t=>s.ZP.state.inventory.canAdd(t),onTake(t){this.emit("take",t),this.inv.remove(t)}},computed:{baseItems(){return this.types,this.types?this.inv.items.filter((t=>this.types.includes(t.type))):this.inv.items},playerInv(){return this.inv===s.ZP.state.inventory},playerFull:()=>s.ZP.state.inventory.full()}};var o=e(3379),m=e.n(o),p=e(7795),c=e.n(p),A=e(569),u=e.n(A),v=e(3565),d=e.n(v),f=e(9216),h=e.n(f),g=e(4589),y=e.n(g),b=e(8433),x={};x.styleTagTransform=y(),x.setAttributes=d(),x.insert=u().bind(null,"head"),x.domAPI=c(),x.insertStyleElement=h(),m()(b.Z,x),b.Z&&b.Z.locals&&b.Z.locals;var C=(0,e(1900).Z)(l,i,[],!1,null,"9826dde6",null);C.options.__file="src/ui/sections/inventory.vue";const _=C.exports}}]);
//# sourceMappingURL=inv-ui.bundle.js.map