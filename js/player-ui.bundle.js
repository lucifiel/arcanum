"use strict";(self.webpackChunk_name_=self.webpackChunk_name_||[]).push([[812],{9382:(t,e,n)=>{n.d(e,{Z:()=>l});var a=n(4015),r=n.n(a),s=n(3645),i=n.n(s)()(r());i.push([t.id,"\ndiv.allupgrades[data-v-0f3fdedc] {\n\tdisplay:flex;\n\tflex-flow: column nowrap;\n\theight:100%;\n}\ndiv.up-list[data-v-0f3fdedc] {\n\tmargin-bottom:1rem;\n\toverflow-x:visible;\n}\n\n","",{version:3,sources:["webpack://./src/ui/panes/allupgrades.vue"],names:[],mappings:";AA2CA;CACA,YAAA;CACA,wBAAA;CACA,WAAA;AACA;AACA;CACA,kBAAA;CACA,kBAAA;AACA",sourcesContent:['<script>\nimport Game from \'game\';\nimport {alphasort} from \'util/util\';\n\nexport default {\n\n\tmethods:{\n\n\t\tcount(it){\n\t\t\treturn it.value > 1 ? ( \' (\' + Math.floor(it.value) + \')\' ) : \'\';\n\t\t}\n\t},\n\tcomputed:{\n\t\tclasses() {\n\t\t\treturn Game.state.classes.filter(v=>!v.disabled&&v.value>=1);\n\t\t},\n\t\ttasks() {\n\t\t\treturn Game.state.tasks.filter(v=>v.max==1&&!v.disabled&&v.value>=1).sort(alphasort);\n\t\t},\n\t\tupgrades(){\n\t\t\treturn Game.state.upgrades.filter(v=>!v.disabled&&v.value>=1).sort(alphasort);\n\t\t}\n\t}\n\n}\n<\/script>\n\n\n<template>\n<div class="allupgrades">\n\t<div class="up-list">\n\t<div v-if="classes.length != 0" class="div-hr">Classes</div>\n\t<div v-for="it in classes" :key="it.id" @mouseenter.capture.stop="itemOver( $event,it)">{{it.name.toTitleCase() + count(it) }}</div>\n\t<div v-if="tasks.length != 0" class="div-hr">Tasks</div>\n\t<div v-for="it in tasks" :key="it.id" @mouseenter.capture.stop="itemOver( $event,it)">{{it.name.toTitleCase() + count(it) }}</div>\n\t<div v-if="upgrades.length != 0" class="div-hr">Upgrades</div>\n\t<div v-for="it in upgrades" :key="it.id" @mouseenter.capture.stop="itemOver( $event,it)">{{it.name.toTitleCase() + count(it) }}</div>\n\t</div>\n</div>\n</template>\n\n<style scoped>\n\ndiv.allupgrades {\n\tdisplay:flex;\n\tflex-flow: column nowrap;\n\theight:100%;\n}\ndiv.up-list {\n\tmargin-bottom:1rem;\n\toverflow-x:visible;\n}\n\n</style>'],sourceRoot:""}]);const l=i},1084:(t,e,n)=>{n.d(e,{Z:()=>l});var a=n(4015),r=n.n(a),s=n(3645),i=n.n(s)()(r());i.push([t.id,"\ndiv.player-view[data-v-6ceabf00] {\n\tdisplay:flex;\n\tflex-direction: row;\n\theight:100%;\n\tpadding-left:1rem;\n\tjustify-content: space-between;\n}\ndiv.player-view div.player-tables[data-v-6ceabf00] {\n\tdisplay:flex;\n\tflex-flow: row wrap;\n\talign-content:flex-start;\n\tflex-grow: 1;\n}\ndiv.player-tables div[data-v-6ceabf00] {\n\tmargin-top:var(--md-gap);\n\tflex-basis: 50%;\n}\ndiv.player-view input[type=text].fld-name[data-v-6ceabf00] { margin: 0;\n}\ndiv.player-view input[type=text][data-v-6ceabf00] {\n\tborder: none; background: transparent; font-size: 1em; cursor: text; position: relative;\n}\ntd[data-v-6ceabf00], th[data-v-6ceabf00] {\n\tpadding:var(--tiny-gap) var(--sm-gap);\n\tvertical-align: text-top;\n}\ntd[data-v-6ceabf00] {\n\ttext-align:right;\n}\nth[data-v-6ceabf00] { text-align: left;\n}\n\n","",{version:3,sources:["webpack://./src/ui/sections/player.vue"],names:[],mappings:";AA2MA;CACA,YAAA;CACA,mBAAA;CACA,WAAA;CACA,iBAAA;CACA,8BAAA;AACA;AAEA;CACA,YAAA;CACA,mBAAA;CACA,wBAAA;CACA,YAAA;AACA;AAEA;CACA,wBAAA;CACA,eAAA;AACA;AAEA,6DAAA,SAAA;AAAA;AAEA;CACA,YAAA,EAAA,uBAAA,EAAA,cAAA,EAAA,YAAA,EAAA,kBAAA;AACA;AAEA;CACA,qCAAA;CACA,wBAAA;AACA;AAEA;CACA,gBAAA;AACA;AAEA,sBAAA,gBAAA;AAAA",sourcesContent:['<script>\nimport Game from \'game\';\nimport { floor, lowFixed, precise } from \'util/format\';\n\nimport AllUpgrades from \'../panes/allupgrades.vue\';\nimport SlotPick from \'../components/slotpick.vue\';\nimport Profile from \'modules/profile\';\n\nexport default {\n\n\tcomponents:{\n\t\tupgrades:AllUpgrades,\n\t\tslotpick:SlotPick,\n\t\thall:()=>import( /* webpackChunkName: "hall-ui" */ \'ui/hall/hall.vue\')\n\t},\n\tdata(){\n\n\t\treturn {\n\t\t\thallOpen:false\n\t\t}\n\n\t},\n\tbeforeCreate(){\n\t\tthis.player = Game.state.player;\n\t},\n\tcomputed:{\n\n\t\twizName:{\n\t\t\tget(){ return this.player.name },\n\t\t\tset(v){\n\t\t\t\tif ( v ) this.player.setName(v);\n\t\t\t}\n\t\t},\n\n\n\t\thallUnlocked(){ return Profile.hasHall(); },\n\t\thallName(){ return Profile.hall.name; },\n\n\t\ttitle(){ return this.player.title; },\n\t\tspeed() {\n\t\t\treturn this.player.speed.value\n\t\t},\n\n\t\t/**\n\t\t * @note intentionally GData. make clearer.\n\t\t */\n\t\tstamina() { return this.player.stamina; },\n\t\thp() {return this.player.hp; },\n\n\t\tbonusNames(){\n\t\t\treturn Object.keys( this.player.bonuses );\n\t\t},\n\t\thitNames(){\n\t\t\treturn Object.keys( this.player.hits );\n\t\t},\n\n\t\tlevel() {return this.player.level.value },\n\n\t\tdefense() {return this.player.defense },\n\t\tdodge(){ return Math.floor(this.player.dodge.valueOf()) },\n\t\tluck(){return Math.floor(this.player.luck.valueOf()) },\n\t\tdamage() { return this.player.damage.valueOf() },\n\t\ttohit() {return this.player.tohit.value; },\n\t\texp() {return this.floor( this.player.exp.value ); },\n\t\tnext() {return this.floor( this.player.next ); },\n\t\tmount() { return Game.state.getSlot(\'mount\'); },\n\t\tdist() { return this.player.dist; },\n\n\t\tsp() { return this.player.sp; },\n\t\tspStr(){return lowFixed( this.player.sp ); }\n\n\n\t},\n\tmethods:{\n\n\t\tfloor:floor,\n\t\tprecise:precise,\n\n\t\topenHall(){ this.hallOpen = true; },\n\n\t\tcloseHall(){this.hallOpen = false;},\n\n\t\tpickTitle($evt){\n\n\t\t\tthis.emit( \'choice\', this.player.titles, {\n\t\t\t\tcb:(p)=>{\n\n\t\t\t\t\tif ( p ) {\n\t\t\t\t\t\tthis.player.setTitle(p);\n\t\t\t\t\t}\n\n\t\t\t\t},\n\t\t\t\telm:$evt.target,\n\t\t\t\tstrings:true\n\t\t\t});\n\n\t\t}\n\n\t}\n\n}\n<\/script>\n\n\n<template>\n\n\t<div class="player-view">\n\n\t\t<hall v-if="hallOpen" @close="closeHall" />\n\n\t\t<div class="player-tables">\n\n\t\t<div>\n\t\t<table>\n\t\t<tr><td>Name</td><th class="text-entry">\n\t\t\t<input class="fld-name" type="text" v-model="wizName"></th></tr>\n\n\t\t<tr v-if="hallUnlocked"><td></td><th><button @click="openHall">{{ hallName }}</button></th></tr>\n\n\t\t<tr @mouseenter.capture.stop="itemOver( $event, player.titles, null, \'Titles\')">\n\t\t\t<td><span v-if="player.titles.length>0"><button class="config" @click="pickTitle($event)"></button></span>Title</td><th> {{ title}}</th></tr>\n\t\t<tr><td>Notoriety</td><th>{{ Math.floor(player.fame.valueOf() ) }}</th></tr>\n\t\t<tr><td>Level</td><th> {{ level }}</th></tr>\n\t\t<tr><td>Experience</td><th> {{ exp }} / {{ next }} </th></tr>\n\t\t<tr><td>Virtue : Evil</td><th> {{ Math.floor(player.virtue.valueOf()) }} : {{Math.floor(player.evilamt.valueOf())}}</th></tr>\n\t\t<tr><td @mouseenter.capture.stop="itemOver( $event,sp)">Skill Points</td><th> {{spStr }}</th></tr>\n\n\n\t\t<tr><td>Rest</td><th><slotpick pick="rest" /></th></tr>\n\t\t<tr><td>Mount</td><th><slotpick pick="mount" /></th></tr>\n\t\t<tr><td @mouseenter.capture.stop="itemOver( $event,dist)">Distance</td><th>{{ dist.current }}</th></tr>\n\t\t</table>\n\t\t</div>\n\n\t\t<div>\n\t\t<table>\n\t\t\t<tr><td @mouseenter.capture.stop="itemOver( $event, hp)">Life</td><th>\n\t\t\t{{ floor( hp.valueOf() ) }} / {{ floor( hp.max.value ) }}</th></tr>\n\n\t\t\t<tr><td>Stamina</td><th>\n\t\t\t{{ floor( stamina.valueOf() ) }} / {{ floor(stamina.max.value )}}</th></tr>\n\n\t\t\t<tr><td>Defense</td><th>{{ defense }}</th></tr>\n\t\t\t<tr><td>Dodge</td><th>{{ dodge }}</th></tr>\n\t\t\t<tr><td>Luck</td><th>{{ luck }}</th></tr>\n\t\t\t<tr><td>Damage Bonus</td><th>{{ damage }}</th></tr>\n\t\t\t<tr><td>Hit Bonus</td><th>{{ precise( tohit ) }}</th></tr>\n\n\t\t\t<tr><td>Speed</td><th>{{ speed }}</th></tr>\n\n\t\t\t<tr @mouseenter.capture.stop="itemOver( $event,player.weapon)">\n\t\t\t\t<td>Weapon</td><th>{{ player.weapon ? player.weapon.name.toTitleCase() : \'None\' }}</th></tr>\n\n\n\t\t</table>\n\t\t</div>\n\n\t\t<div>\n\t\t<table class="resists">\n\t\t\t<tr><th>Resists</th></tr>\n\t\t\t<tr v-for="(r,k) in player.resist" :key="k">\n\t\t\t\t<td>{{ k.toString().toTitleCase() }}</td><td class="num-align">{{ precise( r.value ) }}%</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t</div>\n\n\t\t<div>\n\t\t<table class="bonuses">\n\t\t\t<tr><th>Bonus Damage</th></tr>\n\t\t\t<tr v-for="(r,k) in player.bonuses" :key="k">\n\t\t\t\t<td v-if="r.valueOf()!==0">{{ k.toString().toTitleCase() }}: {{ r.valueOf() }}</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t</div>\n\n\t\t<div>\n\t\t<table class="hits">\n\t\t\t<tr><th>Hit Bonus</th></tr>\n\t\t\t<tr v-for="(r,k) in player.hits" :key="k">\n\t\t\t\t<td v-if="r.valueOf()!==0">{{ k.toString().toTitleCase() }}: {{ r.valueOf() }}</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t</div>\n\n\t\t<div>\n\t\t<table class="immunities">\n\t\t\t<tr><th>Immunities</th></tr>\n\t\t\t<tr v-for="(r,k) in player.immunities" :key="k">\n\t\t\t\t<td v-if="r>0">{{ k.toString().toTitleCase() }}</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t</div>\n\n\t\t</div>\n\n\t\t<upgrades></upgrades>\n\n\t</div>\n\n</template>\n\n<style scoped>\n\ndiv.player-view {\n\tdisplay:flex;\n\tflex-direction: row;\n\theight:100%;\n\tpadding-left:1rem;\n\tjustify-content: space-between;\n}\n\ndiv.player-view div.player-tables {\n\tdisplay:flex;\n\tflex-flow: row wrap;\n\talign-content:flex-start;\n\tflex-grow: 1;\n}\n\ndiv.player-tables div {\n\tmargin-top:var(--md-gap);\n\tflex-basis: 50%;\n}\n\ndiv.player-view input[type=text].fld-name { margin: 0; }\n\ndiv.player-view input[type=text] {\n\tborder: none; background: transparent; font-size: 1em; cursor: text; position: relative;\n}\n\ntd, th {\n\tpadding:var(--tiny-gap) var(--sm-gap);\n\tvertical-align: text-top;\n}\n\ntd {\n\ttext-align:right;\n}\n\nth { text-align: left; }\n\n</style>\n'],sourceRoot:""}]);const l=i},4481:(t,e,n)=>{n.d(e,{Z:()=>p});var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return!t.hideEmpty||t.avail.length>0?n("div",[t.title?n("span",[t._v(t._s(t.title)+":")]):t._e(),t._v(" "),t.avail.length>0?n("button",{staticClass:"task-btn",on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.cur)},click:t.select}},[t._v(t._s(t.cur?t.cur.name:"None"))]):t._e()]):t._e()};a._withStripped=!0;var r=n(7112),s=n(9736),i=n(4478);const l={props:["pick","title","choices","pickEvent","hideEmpty","mustPay"],mixins:[s.Z],data(){return{pEvent:this.pickEvent||i.bp,cur:r.ZP.state.getSlot(this.pick)}},methods:{toggleChange(){this.changing=!this.changing},select(){this.emit("choice",this.avail,{cb:t=>{t&&(this.emit(this.pEvent,t),this.cur=r.ZP.state.getSlot(this.pick))},elm:this.$el,title:this.title||this.pick,mustPay:this.mustPay})}},computed:{avail(){return this.choices?this.choices:r.ZP.state.filterItems((t=>t.slot===this.pick&&!t.disabled&&!t.locks&&!t.locked&&(t.owned||!t.buy)))}}};var o=(0,n(1900).Z)(l,a,[],!1,null,null,null);o.options.__file="src/ui/components/slotpick.vue";const p=o.exports},1832:(t,e,n)=>{n.r(e),n.d(e,{default:()=>Z});var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"player-view"},[t.hallOpen?n("hall",{on:{close:t.closeHall}}):t._e(),t._v(" "),n("div",{staticClass:"player-tables"},[n("div",[n("table",[n("tr",[n("td",[t._v("Name")]),n("th",{staticClass:"text-entry"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.wizName,expression:"wizName"}],staticClass:"fld-name",attrs:{type:"text"},domProps:{value:t.wizName},on:{input:function(e){e.target.composing||(t.wizName=e.target.value)}}})])]),t._v(" "),t.hallUnlocked?n("tr",[n("td"),n("th",[n("button",{on:{click:t.openHall}},[t._v(t._s(t.hallName))])])]):t._e(),t._v(" "),n("tr",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.player.titles,null,"Titles")}}},[n("td",[t.player.titles.length>0?n("span",[n("button",{staticClass:"config",on:{click:function(e){return t.pickTitle(e)}}})]):t._e(),t._v("Title")]),n("th",[t._v(" "+t._s(t.title))])]),t._v(" "),n("tr",[n("td",[t._v("Notoriety")]),n("th",[t._v(t._s(Math.floor(t.player.fame.valueOf())))])]),t._v(" "),n("tr",[n("td",[t._v("Level")]),n("th",[t._v(" "+t._s(t.level))])]),t._v(" "),n("tr",[n("td",[t._v("Experience")]),n("th",[t._v(" "+t._s(t.exp)+" / "+t._s(t.next)+" ")])]),t._v(" "),n("tr",[n("td",[t._v("Virtue : Evil")]),n("th",[t._v(" "+t._s(Math.floor(t.player.virtue.valueOf()))+" : "+t._s(Math.floor(t.player.evilamt.valueOf())))])]),t._v(" "),n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.sp)}}},[t._v("Skill Points")]),n("th",[t._v(" "+t._s(t.spStr))])]),t._v(" "),n("tr",[n("td",[t._v("Rest")]),n("th",[n("slotpick",{attrs:{pick:"rest"}})],1)]),t._v(" "),n("tr",[n("td",[t._v("Mount")]),n("th",[n("slotpick",{attrs:{pick:"mount"}})],1)]),t._v(" "),n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.dist)}}},[t._v("Distance")]),n("th",[t._v(t._s(t.dist.current))])])])]),t._v(" "),n("div",[n("table",[n("tr",[n("td",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.hp)}}},[t._v("Life")]),n("th",[t._v("\n\t\t"+t._s(t.floor(t.hp.valueOf()))+" / "+t._s(t.floor(t.hp.max.value)))])]),t._v(" "),n("tr",[n("td",[t._v("Stamina")]),n("th",[t._v("\n\t\t"+t._s(t.floor(t.stamina.valueOf()))+" / "+t._s(t.floor(t.stamina.max.value)))])]),t._v(" "),n("tr",[n("td",[t._v("Defense")]),n("th",[t._v(t._s(t.defense))])]),t._v(" "),n("tr",[n("td",[t._v("Dodge")]),n("th",[t._v(t._s(t.dodge))])]),t._v(" "),n("tr",[n("td",[t._v("Luck")]),n("th",[t._v(t._s(t.luck))])]),t._v(" "),n("tr",[n("td",[t._v("Damage Bonus")]),n("th",[t._v(t._s(t.damage))])]),t._v(" "),n("tr",[n("td",[t._v("Hit Bonus")]),n("th",[t._v(t._s(t.precise(t.tohit)))])]),t._v(" "),n("tr",[n("td",[t._v("Speed")]),n("th",[t._v(t._s(t.speed))])]),t._v(" "),n("tr",{on:{"!mouseenter":function(e){return e.stopPropagation(),t.itemOver(e,t.player.weapon)}}},[n("td",[t._v("Weapon")]),n("th",[t._v(t._s(t.player.weapon?t.player.weapon.name.toTitleCase():"None"))])])])]),t._v(" "),n("div",[n("table",{staticClass:"resists"},[t._m(0),t._v(" "),t._l(t.player.resist,(function(e,a){return n("tr",{key:a},[n("td",[t._v(t._s(a.toString().toTitleCase()))]),n("td",{staticClass:"num-align"},[t._v(t._s(t.precise(e.value))+"%")])])}))],2)]),t._v(" "),n("div",[n("table",{staticClass:"bonuses"},[t._m(1),t._v(" "),t._l(t.player.bonuses,(function(e,a){return n("tr",{key:a},[0!==e.valueOf()?n("td",[t._v(t._s(a.toString().toTitleCase())+": "+t._s(e.valueOf()))]):t._e()])}))],2)]),t._v(" "),n("div",[n("table",{staticClass:"hits"},[t._m(2),t._v(" "),t._l(t.player.hits,(function(e,a){return n("tr",{key:a},[0!==e.valueOf()?n("td",[t._v(t._s(a.toString().toTitleCase())+": "+t._s(e.valueOf()))]):t._e()])}))],2)]),t._v(" "),n("div",[n("table",{staticClass:"immunities"},[t._m(3),t._v(" "),t._l(t.player.immunities,(function(e,a){return n("tr",{key:a},[e>0?n("td",[t._v(t._s(a.toString().toTitleCase()))]):t._e()])}))],2)])]),t._v(" "),n("upgrades")],1)};a._withStripped=!0;var r=n(7112),s=n(5720),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"allupgrades"},[n("div",{staticClass:"up-list"},[0!=t.classes.length?n("div",{staticClass:"div-hr"},[t._v("Classes")]):t._e(),t._v(" "),t._l(t.classes,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.itemOver(n,e)}}},[t._v(t._s(e.name.toTitleCase()+t.count(e)))])})),t._v(" "),0!=t.tasks.length?n("div",{staticClass:"div-hr"},[t._v("Tasks")]):t._e(),t._v(" "),t._l(t.tasks,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.itemOver(n,e)}}},[t._v(t._s(e.name.toTitleCase()+t.count(e)))])})),t._v(" "),0!=t.upgrades.length?n("div",{staticClass:"div-hr"},[t._v("Upgrades")]):t._e(),t._v(" "),t._l(t.upgrades,(function(e){return n("div",{key:e.id,on:{"!mouseenter":function(n){return n.stopPropagation(),t.itemOver(n,e)}}},[t._v(t._s(e.name.toTitleCase()+t.count(e)))])}))],2)])};i._withStripped=!0;var l=n(6802);const o={methods:{count:t=>t.value>1?" ("+Math.floor(t.value)+")":""},computed:{classes:()=>r.ZP.state.classes.filter((t=>!t.disabled&&t.value>=1)),tasks:()=>r.ZP.state.tasks.filter((t=>1==t.max&&!t.disabled&&t.value>=1)).sort(l.dy),upgrades:()=>r.ZP.state.upgrades.filter((t=>!t.disabled&&t.value>=1)).sort(l.dy)}};var p=n(3379),v=n.n(p),u=n(7795),d=n.n(u),h=n(569),c=n.n(h),m=n(3565),A=n.n(m),f=n(9216),_=n.n(f),y=n(4589),g=n.n(y),k=n(9382),C={};C.styleTagTransform=g(),C.setAttributes=A(),C.insert=c().bind(null,"head"),C.domAPI=d(),C.insertStyleElement=_(),v()(k.Z,C),k.Z&&k.Z.locals&&k.Z.locals;var b=n(1900),x=(0,b.Z)(o,i,[],!1,null,"0f3fdedc",null);x.options.__file="src/ui/panes/allupgrades.vue";const w=x.exports;var O=n(4481),T=n(2025);const E={components:{upgrades:w,slotpick:O.Z,hall:()=>n.e(102).then(n.bind(n,4760))},data:()=>({hallOpen:!1}),beforeCreate(){this.player=r.ZP.state.player},computed:{wizName:{get(){return this.player.name},set(t){t&&this.player.setName(t)}},hallUnlocked:()=>T.Z.hasHall(),hallName:()=>T.Z.hall.name,title(){return this.player.title},speed(){return this.player.speed.value},stamina(){return this.player.stamina},hp(){return this.player.hp},bonusNames(){return Object.keys(this.player.bonuses)},hitNames(){return Object.keys(this.player.hits)},level(){return this.player.level.value},defense(){return this.player.defense},dodge(){return Math.floor(this.player.dodge.valueOf())},luck(){return Math.floor(this.player.luck.valueOf())},damage(){return this.player.damage.valueOf()},tohit(){return this.player.tohit.value},exp(){return this.floor(this.player.exp.value)},next(){return this.floor(this.player.next)},mount:()=>r.ZP.state.getSlot("mount"),dist(){return this.player.dist},sp(){return this.player.sp},spStr(){return(0,s.qC)(this.player.sp)}},methods:{floor:s.GW,precise:s.Yk,openHall(){this.hallOpen=!0},closeHall(){this.hallOpen=!1},pickTitle(t){this.emit("choice",this.player.titles,{cb:t=>{t&&this.player.setTitle(t)},elm:t.target,strings:!0})}}};var P=n(1084),S={};S.styleTagTransform=g(),S.setAttributes=A(),S.insert=c().bind(null,"head"),S.domAPI=d(),S.insertStyleElement=_(),v()(P.Z,S),P.Z&&P.Z.locals&&P.Z.locals;var N=(0,b.Z)(E,a,[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("th",[t._v("Resists")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("th",[t._v("Bonus Damage")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("th",[t._v("Hit Bonus")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("th",[t._v("Immunities")])])}],!1,null,"6ceabf00",null);N.options.__file="src/ui/sections/player.vue";const Z=N.exports}}]);
//# sourceMappingURL=player-ui.bundle.js.map