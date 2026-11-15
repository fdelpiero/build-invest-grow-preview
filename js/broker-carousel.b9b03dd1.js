(function(){
"use strict";
var carousel=document.querySelector("[data-broker-carousel]");
if(!carousel)return;
var viewport=carousel.querySelector("[data-broker-viewport]");
var track=carousel.querySelector("[data-broker-track]");
var cards=Array.prototype.slice.call(carousel.querySelectorAll("[data-broker-slide]"));
var dots=carousel.querySelector("[data-broker-dots]");
var previous=carousel.querySelector("[data-broker-prev]");
var next=carousel.querySelector("[data-broker-next]");
if(!viewport||!track||!cards.length||!dots||!previous||!next)return;
var current=0, resizeFrame=0;
function gapSize(){var style=window.getComputedStyle(track);return parseFloat(style.columnGap||style.gap)||0;}
function visibleCount(){var width=cards[0].getBoundingClientRect().width;return width?Math.max(1,Math.round((viewport.clientWidth+gapSize())/(width+gapSize()))):1;}
function lastStart(){return Math.max(0,cards.length-visibleCount());}
function isSpanish(){return document.documentElement.lang.toLowerCase().startsWith("es");}
function updateDots(){
 var total=lastStart()+1;
 dots.replaceChildren();
 for(var i=0;i<total;i++){
  var dot=document.createElement("button");
  dot.type="button";
  dot.className="broker-dot";
  dot.setAttribute("aria-label",(isSpanish()?"Mostrar grupo de asesores ":"Show broker group ")+(i+1));
  dot.setAttribute("aria-current",String(i===current));
  dot.addEventListener("click",function(index){return function(){goTo(index);};}(i));
  dots.appendChild(dot);
 }
}
function update(){
 var step=cards[0].getBoundingClientRect().width+gapSize();
 if(step>0)current=Math.max(0,Math.min(lastStart(),Math.round(viewport.scrollLeft/step)));
 previous.disabled=current<=0;
 next.disabled=current>=lastStart();
 Array.prototype.forEach.call(dots.children,function(dot,index){dot.setAttribute("aria-current",String(index===current));});
}
function goTo(index){
 current=Math.max(0,Math.min(lastStart(),index));
 var step=cards[0].getBoundingClientRect().width+gapSize();
 viewport.scrollTo({left:current*step,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 update();
}
previous.addEventListener("click",function(){goTo(current-1);});
next.addEventListener("click",function(){goTo(current+1);});
var scrollPending=false;
viewport.addEventListener("scroll",function(){
 if(scrollPending)return;
 scrollPending=true;
 window.requestAnimationFrame(function(){scrollPending=false;update();});
},{passive:true});
window.addEventListener("resize",function(){
 window.cancelAnimationFrame(resizeFrame);
 resizeFrame=window.requestAnimationFrame(function(){current=Math.min(current,lastStart());updateDots();goTo(current);});
},{passive:true});
new MutationObserver(function(){updateDots();update();}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
updateDots();
update();
})();
