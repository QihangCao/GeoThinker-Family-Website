'use strict';
const viewer=document.querySelector('#figure-viewer');
const image=document.querySelector('#viewer-image');
const scroll=document.querySelector('.viewer-scroll');
const zoom=document.querySelector('#viewer-zoom');
let trigger=null;
document.querySelectorAll('.figure-link').forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!viewer.showModal)return;
  event.preventDefault();
  trigger=link;
  image.src=link.href;
  image.alt=link.querySelector('img')?.alt||link.dataset.title;
  document.querySelector('#viewer-title').textContent=link.dataset.title;
  scroll.classList.remove('zoomed');
  zoom.setAttribute('aria-pressed','false');
  zoom.textContent='Zoom in';
  viewer.showModal();
  scroll.scrollTo(0,0);
}));
zoom.addEventListener('click',()=>{
  const zoomed=scroll.classList.toggle('zoomed');
  zoom.setAttribute('aria-pressed',String(zoomed));
  zoom.textContent=zoomed?'Fit to screen':'Zoom in';
});
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>trigger?.focus());

// Gentle entrance effects keep the default HTML readable without JavaScript.
(()=>{
 const sections=[...document.querySelectorAll('main>section')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if('IntersectionObserver' in window&&!reduce.matches){
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');reveal.unobserve(entry.target);}
  }),{threshold:0,rootMargin:'0px 0px -25px 0px'});
  sections.forEach(section=>{section.classList.add('reveal-target');if(section.getBoundingClientRect().top>innerHeight)section.classList.add('reveal-pending');reveal.observe(section);});
  reduce.addEventListener('change',()=>{if(reduce.matches){sections.forEach(section=>section.classList.remove('reveal-pending'));reveal.disconnect();}});
 }
 const nav=[...document.querySelectorAll('[data-nav-model]')];
 let pending=false;
 function updateNav(){pending=false;let active=null;for(const section of sections)if(section.getBoundingClientRect().top<innerHeight*.45)active=section.id;nav.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateNav);}},{passive:true});updateNav();
})();
