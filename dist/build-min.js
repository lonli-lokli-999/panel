"use strict";var panel={render(){let e=document.createElement("div");return e.classList.add("panel-wrap"),e.innerHTML='<div class="b-panel"></div>',document.body.appendChild(e),this.panel_wrap=e,document.addEventListener("keydown",function(e){e.shiftKey&&"Space"==e.code&&(e.preventDefault(),panel.switched())}),this},switched(){this.panel_wrap.classList.toggle("panel-wrap--active")},add(e){return this.panel_wrap.querySelector(".b-panel").appendChild(e),this}},villages_maneger={render(){let e=this.dataLoad(),a=document.createElement("div");return a.classList.add("villages"),a.innerHTML=`<h2>Деревни</h2><hr><div class="villages-list">${this.villages_list_render(e)}</div>`,a},reload(){let e=document.querySelector(".b-panel .villages"),a=this.render();e.innerHTML=a.innerHTML},villages_list_render:e=>e.map(e=>`<div class="village" ><a href="${e.href}">${e.label}</a><div>Дерево: ${e.wood}; Глина:${e.stone}; Сталь:${e.iron}</div><div class="village__builds"> ${builds.getBuildsInfo(e.id)} </div</div>`).join(""),dataLoad(){let e=getPageInBox(url_map.villages),a=[];return(e=e.querySelectorAll("#production_table .nowrap")).forEach(function(e){let n=e.querySelector(".quickedit-content a:not(.rename-icon)"),r=e.querySelector(".wood").innerHTML,t=e.querySelector(".stone").innerHTML,l=e.querySelector(".iron").innerHTML,i=e.querySelector(".quickedit-vn").getAttribute("data-id");a.push({href:n.href,label:n.innerHTML,wood:r,stone:t,iron:l,id:i})}),a}},builds={getBuildsInfo(e){let a=this.getBuildsHtml(e),n=this.buildsInfoExtract(a);return n?this.render(n):""},getBuildsHtml:e=>getPageInBox(url_map.villageBuilds(e)).querySelectorAll('[class*=" buildorder"]'),buildsInfoExtract:e=>(e.map=[].map,e.map(function(e){return{name:e.querySelectorAll(".lit-item")[0].innerText,time:e.querySelectorAll(".lit-item")[1].innerText}})),render:e=>e.map(e=>`<span>${e.name}; Завершение: ${e.time};</span>`).join("")},bookmarks={render(){let e=document.createElement("div"),a=`<a href="${url_map.areaPage}">Площадь</a><a href="${url_map.villageBuilds()}">Ратуша</a>`;return e.classList.add("bookmarks"),e.innerHTML=a,e}};const url_map={get location(){return window.location},get villages(){let e=this.location;return`${e.origin}${e.pathname}?screen=overview_villages`},get idCurrentVillage(){let e=this.location;return new URLSearchParams(e).get("village")},villageBuilds(e){let a=this.location;return`${a.origin}${a.pathname}?village=${e||this.idCurrentVillage}&screen=main`},get areaPage(){let e=this.location;return`${e.origin}${e.pathname}?village=${this.idCurrentVillage}&screen=place`}};function requestSync(e){let a=new XMLHttpRequest;return a.open("GET",e,!1),a.send(),200!=a.status?`${a.status}: ${a.statusText}`:a.responseText}function getPageInBox(e,a){let n=document.createElement("div");return n.innerHTML=requestSync(e),a?n.querySelector(a):n}function watcher(){villages_maneger.reload()}panel.render().add(bookmarks.render()).add(villages_maneger.render()),setInterval(watcher,3e3),function(){let e=document.createElement("style");e.innerHTML=":root {--main-bg: #fff;--main-color: #999;--dbl-bg: #eee;--dbl-color: #977;}.panel-wrap {position: fixed;top: 0;left: 0;background: var( --main-bg );box-shadow: 0 0 .5rem var( --main-color );height: 100%;transition: 500ms;  width: .2rem;  opacity: 0; overflow-x: hidden;overflow-y: auto;  z-index: 12324242;}.panel-wrap:hover,.panel-wrap--active {width: 30rem;opacity: 1;}.b-panel,.b-panel * {border: 0;padding: 0;margin:0;outline: none;font-size: 16px;box-sizing: border-box;color: var( --main-color );}.b-panel h2,.b-panel h3,.b-panel p {  padding: .5rem 1rem;}.b-panel hr {border: .1rem solid var( --main-color );margin: .5rem 0;}.b-panel input,.b-panel textarea,.b-panel button {display: block;width: 100%;background: var( --main-bg );padding: 1rem;margin: .5rem 0;transition: 500ms;}.b-panel input:hover,.b-panel textarea:hover,.b-panel button:hover {background: var( --dbl-bg );}.b-panel a {font-style: italic;transition: 500ms;text-decoration: none;}.b-panel a:hover {color: var( --main-color )}.villages-list {margin: .5rem 0;}.villages-list .village {padding: .5rem;}.villages-list .village:nth-child(even) {background: var( --dbl-bg );}.village__builds span {display: block;padding: .2rem 0;}.bookmarks {padding: .5rem 0;}.bookmarks a {display: inline-block;padding: .5rem;}.bookmarks a:hover {background: var( --dbl-bg );}",document.head.appendChild(e)}();