import{s as O,a as v,f as M,F as C,d as p,c as $,g as w,h as y,j as _,i as k,r as S,D as I,E as x,o as A}from"../chunks/scheduler.bd64f757.js";import{S as H,i as T,b as W,d as L,m as P,a as V,t as q,e as z}from"../chunks/index.86590fdc.js";import{M as B,S as F,a as R,g as J}from"../chunks/index.60632cc9.js";import{h as K,t as g,o as D}from"../chunks/utils.1c822e9e.js";import{G as N}from"../chunks/GanttOptions.42da2f86.js";const{document:j}=J;function Q(o){let n,a,e,i,s,l;return s=new N({props:{options:o[0]}}),s.$on("change",o[1]),{c(){n=v(),a=M("div"),e=M("div"),i=v(),W(s.$$.fragment),this.h()},l(t){C("svelte-167zng3",j.head).forEach(p),n=$(t),a=w(t,"DIV",{class:!0});var r=y(a);e=w(r,"DIV",{id:!0,class:!0}),y(e).forEach(p),i=$(r),L(s.$$.fragment,r),r.forEach(p),this.h()},h(){j.title="Large dataset - svelte-gantt",_(e,"id","example-gantt"),_(e,"class","svelte-1toa21o"),_(a,"class","container svelte-1toa21o")},m(t,d){k(t,n,d),k(t,a,d),S(a,e),S(a,i),P(s,a,null),l=!0},p(t,[d]){const r={};d&1&&(r.options=t[0]),s.$set(r)},i(t){l||(V(s.$$.fragment,t),l=!0)},o(t){q(s.$$.fragment,t),l=!1},d(t){t&&(p(n),p(a)),z(s)}}}let E=10;function U(o){for(let n=o.length-1;n>0;n--){const a=Math.floor(Math.random()*(n+1)),e=o[n];o[n]=o[a],o[a]=e}}function X(o,n,a){let e;I(o,D,m=>a(0,e=m));let i=0;const s=["blue","green","orange"],l=d();x(D,e={layout:"pack",dateAdapter:new B(K),rows:l.rows,tasks:l.tasks,columnOffset:15,magnetOffset:15,rowHeight:52,rowPadding:6,headers:[{unit:"day",format:"MMMM Do"},{unit:"hour",format:"H:mm"}],fitWidth:!0,minWidth:800,from:g("06:00"),to:g("18:00"),tableHeaders:[{title:"Label",property:"label",width:140,type:"tree"}],tableWidth:240,ganttTableModules:[F]},e);let t;A(()=>{window.gantt=a(2,t=new R({target:document.getElementById("example-gantt"),props:e}))});function d(){const m=[],h=[],u=[...Array(E).keys()];U(u);for(let c=0;c<E;c++){let f=Math.random()<.2;m.push({id:c,label:"Row #"+c,age:Math.random()*80|0,imageSrc:"Content/joe.jpg",classes:f?["row-disabled"]:void 0,enableDragging:!f,generation:i}),f=Math.random()>.5;const b=Math.random()*10|0,G=Math.random()*5|0+1;h.push({type:"task",id:u[c],resourceId:c,label:"Task #"+u[c],from:g(`${7+b}:00`),to:g(`${7+b+G}:00`),classes:s[Math.random()*s.length|0],generation:i})}return i+=1,{rows:m,tasks:h}}function r(m){const h=m.detail;Object.assign(e,h),t.$set(e)}return o.$$.update=()=>{o.$$.dirty&5&&(console.log("options changed",e),t&&t.$set(e))},[e,r,t]}class ot extends H{constructor(n){super(),T(this,n,X,Q,O,{})}}export{ot as component};
