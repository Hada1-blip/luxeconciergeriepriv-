'use strict';

/* CURSOR */
const CUR=document.getElementById('CUR'),CURR=document.getElementById('CURR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;CUR.style.left=mx+'px';CUR.style.top=my+'px';});
setInterval(()=>{rx+=(mx-rx)*.12;ry+=(my-ry)*.12;CURR.style.left=rx+'px';CURR.style.top=ry+'px';},14);
function bH(){document.querySelectorAll('button,a,.srv-card,.dfc,.tcard,.rcard,.trf,.sfull,.tmcard,.val-card,.num-item,.pstep').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));});}
bH();

/* NAV SCROLL */
window.addEventListener('scroll',()=>{
  const n=document.getElementById('NAV'),s=window.scrollY>60;
  n.classList.toggle('scrolled',s);n.classList.toggle('top',!s);
  const f=document.getElementById('FCTA');
  if(f)f.classList.toggle('show',window.scrollY>500);
});

/* MOBILE MENU */
function openMob(){document.getElementById('MOB').classList.add('open');}
function closeMob(){document.getElementById('MOB').classList.remove('open');}

/* REVEAL */
function iRev(){
  const ob=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});},{threshold:.1,rootMargin:'0px 0px -36px 0px'});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>{if(!el.classList.contains('in'))ob.observe(el);});
}

/* COUNTERS */
function aC(el){
  const t=parseInt(el.dataset.t),s=el.dataset.s||'';
  let c=0;const dur=1900,steps=60,inc=t/steps;
  const tm=setInterval(()=>{c+=inc;if(c>=t){el.textContent=t.toLocaleString()+s;clearInterval(tm);}else el.textContent=Math.floor(c).toLocaleString()+(s||'');},dur/steps);
}
function iCnt(){
  const ob=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){aC(e.target);ob.unobserve(e.target);}});},{threshold:.55});
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent='0';ob.observe(el);});
}

/* CAROUSEL */
function initCarousel(){
  const TRACK=document.getElementById('DTRACK');
  if(!TRACK)return;
  const CARDS=Array.from(TRACK.querySelectorAll('.dfc'));
  const DOTS=document.getElementById('DDOTS');
  const PROG=document.getElementById('DPROG');
  let cidx=0,isDrag=false,dX=0,dSL=0,autoT=null;
  CARDS.forEach((_,i)=>{const d=document.createElement('div');d.className='dndot'+(i===0?' on':'');d.onclick=()=>{goCard(i);resetAuto();};DOTS&&DOTS.appendChild(d);});
  function goCard(i){
    cidx=((i%CARDS.length)+CARDS.length)%CARDS.length;
    const tr=TRACK.getBoundingClientRect(),cr=CARDS[cidx].getBoundingClientRect();
    const off=TRACK.scrollLeft+(cr.left-tr.left)-(tr.width/2-cr.width/2);
    TRACK.scrollTo({left:off,behavior:'smooth'});
    updCar();
  }
  window.carNext=()=>{goCard(cidx+1);resetAuto();}
  window.carPrev=()=>{goCard(cidx-1);resetAuto();}
  function updCar(){
    const tr=TRACK.getBoundingClientRect(),cx=tr.left+tr.width/2;
    let best=0,bd=Infinity;
    CARDS.forEach((c,i)=>{const r=c.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-cx);if(d<bd){bd=d;best=i;}});
    cidx=best;
    CARDS.forEach((c,i)=>c.classList.toggle('act',i===best));
    DOTS&&DOTS.querySelectorAll('.dndot').forEach((d,i)=>d.classList.toggle('on',i===best));
    if(PROG){const p=14+((best/(CARDS.length-1))*86);PROG.style.width=p+'%';}
  }
  function startAuto(){autoT=setInterval(()=>goCard(cidx+1),3400);}
  function resetAuto(){clearInterval(autoT);startAuto();}
  TRACK.addEventListener('scroll',()=>requestAnimationFrame(updCar));
  TRACK.addEventListener('mousedown',e=>{isDrag=true;dX=e.pageX-TRACK.offsetLeft;dSL=TRACK.scrollLeft;TRACK.style.cursor='grabbing';clearInterval(autoT);});
  TRACK.addEventListener('mousemove',e=>{if(!isDrag)return;e.preventDefault();TRACK.scrollLeft=dSL-(e.pageX-TRACK.offsetLeft-dX)*1.3;});
  ['mouseup','mouseleave'].forEach(ev=>TRACK.addEventListener(ev,()=>{if(isDrag){isDrag=false;TRACK.style.cursor='grab';setTimeout(()=>{updCar();resetAuto();},150);}}));
  TRACK.addEventListener('touchstart',()=>clearInterval(autoT),{passive:true});
  TRACK.addEventListener('touchend',()=>setTimeout(()=>{updCar();resetAuto();},200));
  setTimeout(()=>{CARDS[0]&&CARDS[0].classList.add('act');startAuto();},300);
}

/* FAQ */
function togFaq(el){const it=el.closest('.faq-item'),was=it.classList.contains('op');document.querySelectorAll('.faq-item.op').forEach(i=>i.classList.remove('op'));if(!was)it.classList.add('op');}

/* FILTERS */
document.querySelectorAll('.rft').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.rft').forEach(x=>x.classList.remove('on'));b.classList.add('on');});});

/* POPUP */
function openPop(){document.getElementById('POP_OV').classList.add('open');document.getElementById('POP').classList.add('open');document.body.style.overflow='hidden';}
function closePop(){document.getElementById('POP_OV').classList.remove('open');document.getElementById('POP').classList.remove('open');document.body.style.overflow='';}
function subPop(e){e.preventDefault();const b=document.getElementById('POPBTN');b.textContent='✓ Envoyé — Réponse sous 24h !';b.style.background='#16a34a';setTimeout(()=>{b.textContent='✦ Recevoir mon estimation gratuite';b.style.background='';closePop();},3200);}
function subMain(e){e.preventDefault();const b=document.getElementById('MBTN');b.textContent='✓ Reçu — On vous rappelle sous 24h !';b.style.background='#16a34a';setTimeout(()=>{b.textContent='✦ Recevoir mon estimation gratuite — Sans engagement';b.style.background='';},5000);}

/* INIT */
window.addEventListener('load',()=>{iRev();iCnt();initCarousel();});
