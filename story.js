(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const models={
 geo:{steps:['Watch','Gate','Fuse','Reason'],captions:['Encode vision + geometry.','Semantics guide the gate.','Fuse geometry with gated attention.','Reason with geometry.'],source:'3D encoder · geometry features',start:0,end:8,key:4,poster:'real-scene-keyframe.jpg',answer:'The bowl is left of the board.'},
 fast:{steps:['Watch','Predict','Fuse','Reason'],captions:['Encode the video.','Predict features internally.','Inject geometry + temporal features.','Skip the external 3D encoder.'],source:'Internal prediction · no external 3D encoder',start:0,end:8,key:4,poster:'real-scene-keyframe.jpg',answer:'The bowl is left of the board.'},
 dyn:{steps:['Watch','Gate','Fuse','Reason'],captions:['Encode spatial + dynamic cues.','Semantics gate both streams.','Add the gated features.','Reason about change.'],source:'Dynamic geometry · spatial + temporal priors',start:8,end:17.8,key:12,poster:'real-scene-dynamic.jpg',answer:'The bowl is lifted, then set down.'}
};
for(const root of document.querySelectorAll('.model-card')) setup(root);
function setup(root){
 const mode=root.dataset.model,m=models[mode],video=root.querySelector('video'),still=root.querySelector('.keyframe'),svg=root.querySelector('.card-diagram'),caption=root.querySelector('.card-caption'),controls=root.querySelector('.card-steps'),toggle=root.querySelector('.card-toggle'),bar=root.querySelector('.card-progress i');
 const prefix='card-'+mode+'-',geo=mode==='geo',fast=mode==='fast',dyn=mode==='dyn';
 let time=reduced.matches?11:0,step=reduced.matches?3:0,held=reduced.matches,hover=false,keyFocus=false,visible=false,raf=0,last=0,pending=false,failed=false,previousFreeze=false,particles=[];
 still.src='assets/'+m.poster;
 controls.innerHTML=m.steps.map((s,i)=>`<button aria-label="${m.steps[i]}: ${root.querySelector('h2').textContent}" aria-pressed="false" data-step="${i}">${s}</button>`).join('');
 const buttons=[...controls.querySelectorAll('button')];
 const text=(x,y,s,c='')=>`<text x="${x}" y="${y}" text-anchor="middle" class="${c}">${s}</text>`;
 const rect=(x,y,w,h,c='layer',r=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${c}"/>`;
 function path(id,d,c,on=true){return `<path id="${prefix+id}" d="${d}" class="flow ${c} ${on?'':'muted'}" marker-end="url(#${prefix}arrow-${c})"/>`;}
 function draw(){
  let a='<defs>';for(const[c,col]of Object.entries({input:'#a4b8aa',query:'#bc8a37',geometry:'#238d80',temporal:'#8060b0'}))a+=`<marker id="${prefix}arrow-${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 L9 5 L1 9 Z" fill="${col}"/></marker>`;
  a+=`<clipPath id="${prefix}clip"><rect width="360" height="240" rx="7"/></clipPath></defs><title>${root.querySelector('h2').textContent}: ${m.captions[step]}</title>`;
  if(!fast&&(step===1||step===2)){
   a+=`<g clip-path="url(#${prefix}clip)">`;
   for(let i=0;i<12;i++)a+=`<path d="M${i*30} 0 V240 M0 ${i*30} H360" stroke="#73dec2" opacity=".2"/>`;
   const boxes=dyn?[[.34,.62,.31,.25]]:[[.03,.65,.18,.19],[.37,.73,.34,.25]];
   for(const[x,y,w,h]of boxes){a+=rect(x*360,y*360-120,w*360,h*360,'outline');for(let k=0;k<4;k++)a+=`<rect x="${(x+w*k/4)*360}" y="${(y+(k%2)*h*.8)*360-120}" width="9" height="9" rx="2" fill="#4be1ba"/>`;}
   a+='</g>';
  }
  a+=path('vision-in','M54 240 V252','input');
  a+=rect(8,253,92,38,'encoder')+text(54,269,'Vision','strong')+text(54,283,'encoder');
  if(!fast){
   a+=path('geometry-in','M278 240 V252','geometry');
   a+=rect(204,253,148,38,'encoder geometry-encoder')+text(278,269,dyn?'Dynamic geometry':'Geometry','strong')+text(278,283,'encoder');
  }
  a+='<g transform="translate(0 36)">';
  a+=path('input','M54 255 V312 Q54 322 40 322 V345','input');
  a+=path('early','M73 371 H116','input');a+=path('late','M244 371 H285','input');
  a+=rect(8,345,65,52)+text(40,367,'Early','strong')+text(40,383,'layers');
  a+=rect(116,340,128,62,'middle')+text(180,333,'VLM middle layers','strong');
  a+=rect(285,345,67,52)+text(318,367,'Later','strong')+text(318,383,'layers');
  for(let i=0;i<3;i++){const color=step>=2?(fast&&i===1?'#8060b0':'#238d80'):'#afc4b6';a+=`<rect x="${126+i*38}" y="350" width="31" height="42" rx="3" fill="white" stroke="${color}"/><path d="M${133+i*38} 360 h17 m-17 8 h17 m-17 8 h17" stroke="${color}" stroke-width="2"/>`;}
  if(fast){
   a+=rect(204,217,148,38,'middle')+text(278,241,'LFP → SGT','strong');
   a+=path('semantic','M142 340 V282 Q142 268 159 268 H218 Q229 268 229 255','query',step>=1);
   a+=path('geo','M298 255 V307 Q298 320 279 320 H219 V350','geometry',step>=2);
   a+=path('temporal','M273 255 V293 Q273 307 253 307 H180 V350','temporal',step>=2);
  }else{
   a+=path('semantic','M142 340 V303 Q142 295 156 295 H267','query',step>=1);
   a+=text(185,286,dyn?'Semantic gates':'Semantic gate','route-label');
   a+=path('geo','M272 255 Q283 263 286 278','geometry',step>=2);
   if(dyn)a+=path('temporal','M297 255 Q314 263 306 279','temporal',step>=2);
   a+=`<circle cx="290" cy="297" r="20" class="gate"/>`+text(290,301,dyn?'SDF':'SGF','strong');
   a+=path('inject','M290 317 V323 Q290 329 276 329 H219 V350','geometry',step>=2);
  }
  if(step===3)a+=text(180,438,m.answer,'answer');
  a+='<g class="particles"></g></g>';svg.innerHTML=a;
  const ids=step===0?['input','early']:step===1?['semantic']:step===2?(fast?['geo','temporal']:dyn?['geo','temporal','inject']:['geo','inject']):['late'];
  particles=[];let bits='';for(const id of ids){const p=svg.querySelector('#'+prefix+id);if(!p)continue;for(let n=0;n<2;n++){const index=particles.length;particles.push({path:p,length:p.getTotalLength(),offset:n*.5,index});bits+=`<circle id="${prefix}p${index}" r="3" fill="${id==='semantic'?'#bc8a37':id==='temporal'?'#8060b0':'#238d80'}" stroke="white" stroke-width="1"/>`;}}
  svg.querySelector('.particles').innerHTML=bits;caption.textContent=m.captions[step];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(step===i)));move();sync();
 }
 function move(){for(const p of particles){const q=p.path.getPointAtLength(((time*.3+p.offset)%1)*p.length);svg.querySelector('#'+prefix+'p'+p.index).setAttribute('transform',`translate(${q.x},${q.y})`);}bar.style.transform=`scaleX(${time/14})`;}
 function running(){return visible&&!hover&&!held&&!keyFocus&&!document.hidden&&!document.querySelector("dialog[open]");}
 function seek(t){if(Number.isFinite(video.duration))video.currentTime=Math.min(t,video.duration-.05);}
 function sync(){const freeze=step===1||step===2||failed||(reduced.matches&&held);still.hidden=!freeze;if(freeze){video.pause();if(!previousFreeze)seek(m.key);}else if(!running())video.pause();else if(video.paused&&!pending&&!failed){pending=true;video.play().then(()=>{pending=false;if(!running()||step===1||step===2)video.pause();}).catch(e=>{pending=false;if(e.name!=='AbortError'){failed=true;still.hidden=false;}});}previousFreeze=freeze;}
 function schedule(){root.dataset.playing=String(running());root.dataset.held=String(held);toggle.textContent=held?'▷':'Ⅱ';toggle.setAttribute('aria-label',`${held?'Play':'Pause'} ${root.querySelector('h2').textContent}`);sync();if(running()&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}else if(!running()&&raf){cancelAnimationFrame(raf);raf=0;}}
 function tick(now){raf=0;if(!running())return;time+=Math.min((now-last)/1000,.08);last=now;if(time>=14){time=0;seek(m.start);}const next=time<3?0:time<6?1:time<9?2:3;if(next!==step){step=next;draw();}else move();raf=requestAnimationFrame(tick);}
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;schedule();}});root.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;keyFocus=false;if(root.contains(document.activeElement))document.activeElement.blur();schedule();}});
 root.addEventListener('focusin',()=>{if(root.matches(':focus-visible')||root.querySelector(':focus-visible')){keyFocus=true;schedule();}});root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){keyFocus=false;schedule();}});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){held=false;keyFocus=false;root.blur();schedule();}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();keyFocus=true;select((step+(e.key==='ArrowRight'?1:3))%4);}});
 function select(i){time=[1.5,4.5,7.5,11][i];step=i;seek(i===0?m.start:m.key);previousFreeze=false;draw();schedule();}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{if(matchMedia('(hover:none)').matches)held=true;select(i);}));
 toggle.addEventListener('click',()=>{held=!held;if(!held&&failed){failed=false;}schedule();});
 video.addEventListener('loadedmetadata',()=>{seek(step===1||step===2?m.key:m.start);sync();});video.addEventListener('timeupdate',()=>{if(video.currentTime>=m.end&&step!==1&&step!==2)seek(m.start);});
 const fail=()=>{failed=true;video.pause();still.hidden=false;};video.addEventListener('error',fail);video.querySelector('source').addEventListener('error',fail);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:0}).observe(root);document.addEventListener('visibilitychange',schedule);document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(schedule).observe(dialog,{attributes:true,attributeFilter:['open']}));
 reduced.addEventListener('change',()=>{held=reduced.matches;draw();schedule();});draw();schedule();
}
})();
