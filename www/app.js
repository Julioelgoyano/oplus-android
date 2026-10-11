// O-PLUS TV · comportamiento exclusivo de la app de Android
(()=>{
const g=id=>document.getElementById(id),P=(window.Capacitor&&Capacitor.Plugins)||{};
const IC={
  home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>',
  guide:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>',
  find:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  enter:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  exit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
  prev:'<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>'
};
document.documentElement.classList.add("app");

// ---- Intro: el logo entra desde la izquierda, hace zoom y el "+" se abre para revelar la app
(()=>{
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const PLUS="M-4 -12h8v8h8v8h-8v8h-8v-8h-8v-8h8z";
  const arc=(a,b,r)=>{const p=t=>[(r*Math.cos(t*Math.PI/180)).toFixed(2),(r*Math.sin(t*Math.PI/180)).toFixed(2)],[x1,y1]=p(a),[x2,y2]=p(b);return"M"+x1+" "+y1+"A"+r+" "+r+" 0 "+((b-a)>180?1:0)+" 1 "+x2+" "+y2};
  const sp=document.createElement("div");sp.id="splash";
  sp.innerHTML='<svg viewBox="-50 -50 100 100"><defs><mask id="spm" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#fff"/><path d="'+PLUS+'" fill="#000"/></mask></defs>'
   +'<g id="spz"><g mask="url(#spm)"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#050b12"/><circle id="spn" r="31" fill="#163959"/><circle r="21" fill="#fff"/></g>'
   +'<path id="spp" d="'+PLUS+'" fill="#fff" stroke="#163959" stroke-width=".7" stroke-linejoin="round"/>'
   +'<g id="spr" fill="none" stroke-width="1.7" stroke-linecap="round"><path d="'+arc(180,311,38)+'" stroke="#1fc8d6"/><path d="'+arc(329,493,38)+'" stroke="#b03174"/></g></g></svg>';
  document.body.append(sp);
  const q=id=>sp.querySelector("#"+id),svg=sp.querySelector("svg"),z=q("spz"),rg=q("spr"),pl=q("spp"),nv=q("spn");
  const E=Math.max(innerWidth/16,innerHeight/48)*1.25;          // zoom final: el "+" cubre toda la pantalla
  const IN=.6,ZS=1.55,ZD=.55,t0=performance.now();
  (function f(now){
    const t=(now-t0)/1000;let s=1,x=0;
    if(t<IN){const p=t/IN,e=1-Math.pow(1-p,3);x=-(innerWidth/2+110)*(1-e)}            // entra deslizando desde la izquierda
    else if(t<ZS)s=1+.025*Math.sin((t-IN)*3.4);                                      // respira un instante
    let pz=0;
    if(t>=ZS){pz=Math.min(1,(t-ZS)/ZD);s=Math.exp(Math.log(E)*Math.pow(pz,2.3))}    // zoom acelerado
    svg.style.transform="translateX("+x.toFixed(1)+"px)";
    z.setAttribute("transform","scale("+s.toFixed(4)+")");
    rg.setAttribute("transform","rotate("+(300*(1-Math.pow(1-Math.min(t,1.3)/1.3,3))+t*25).toFixed(1)+")");   // los aros giran y se calman
    pl.style.opacity=t<ZS?1:Math.max(0,1-(t-ZS)/.1);                                  // el "+" se vuelve un hueco
    nv.style.opacity=1-.65*Math.min(1,pz*2.5);
    if(pz<1)requestAnimationFrame(f);else sp.remove();
  })(t0);
})();

// ---- Barra inferior
const apply=()=>{drawChips();drawList()};
const tabs=document.createElement("nav");tabs.id="tabs";
[["home","En vivo",IC.home],["fav","Favoritos",IC.heart],["guide","Guía",IC.guide],["find","Buscar",IC.find]].forEach(([k,t,i])=>{
  const b=document.createElement("button");b.dataset.k=k;b.innerHTML=i+"<span>"+t+"</span>";tabs.append(b);
});
document.body.append(tabs);
const mark=k=>tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
const closeSearch=()=>{document.body.classList.remove("searching");g("q").value=""};
mark("home");
tabs.onclick=e=>{
  const b=e.target.closest("button");if(!b)return;const k=b.dataset.k;
  if(k==="home"){cat="Todos";closeSearch();mark("home");apply();scrollTo({top:0,behavior:"smooth"})}
  else if(k==="fav"){cat="Favoritos";closeSearch();mark("fav");apply()}
  else if(k==="guide")g("gbtn").click();
  else{const on=document.body.classList.toggle("searching");if(on){mark("find");g("q").focus()}else{closeSearch();mark(cat==="Favoritos"?"fav":"home");apply()}}
};

// ---- Pantalla completa propia (la del navegador no funciona dentro de la app)
const de=document.documentElement,sc=document.querySelector(".screen"),vp=document.querySelector('meta[name="viewport"]');
const mkBtn=(id,label,html)=>{const b=document.createElement("button");b.id=id;b.setAttribute("aria-label",label);b.innerHTML=html;return b};
const fb=mkBtn("appfs","Pantalla completa",IC.enter),fbar=document.createElement("div"),ftitle=document.createElement("div");
fbar.id="fsbar";ftitle.id="fstitle";
const fprev=mkBtn("fsprev","Canal anterior",IC.prev),fnext=mkBtn("fsnext","Canal siguiente",IC.next);
fbar.append(ftitle,fprev,fnext);
const ph=document.createElement("div");ph.id="fsph";ph.hidden=true;   // ocupa el lugar del video para que la página no "salte"
sc.before(ph);sc.append(fbar,fb);
const titleEl=g("title"),syncTitle=()=>{ftitle.textContent=titleEl.textContent};
new MutationObserver(syncTitle).observe(titleEl,{childList:true,characterData:true,subtree:true});syncTitle();

let isFs=false,busy=false,savedY=0,idleT=0;
const showUi=()=>{sc.classList.remove("idle");clearTimeout(idleT);idleT=setTimeout(()=>{if(isFs&&g("ov").hidden)sc.classList.add("idle")},3500)};
const hideUi=()=>{clearTimeout(idleT);sc.classList.add("idle")};
fprev.onclick=()=>{play(cur-1);showUi()};fnext.onclick=()=>{play(cur+1);showUi()};
sc.addEventListener("click",e=>{
  if(!isFs)return;
  if(e.target.closest("button,select,input,a,.plyr__controls")){showUi();return}
  sc.classList.contains("idle")?showUi():hideUi();   // toque en el video: muestra u oculta los controles (no pausa)
});
v.addEventListener("playing",()=>{if(isFs)showUi()});

// Espera a que Android termine de girar la pantalla (el WebView avisa con "resize") antes de acomodar el video.
const settle=(max=900)=>new Promise(res=>{
  let q,done=0;
  const fin=()=>{if(done)return;done=1;clearTimeout(q);removeEventListener("resize",bump);setTimeout(res,100)};
  const bump=()=>{clearTimeout(q);q=setTimeout(fin,240)};
  addEventListener("resize",bump);setTimeout(fin,max);
});
// Si el WebView quedó con "zoom" (escala distinta de 1 tras girar), se reinicia.
function resetZoom(){
  try{
    const s=window.visualViewport?visualViewport.scale:1;
    if(vp&&Math.abs(s-1)>.01){const c=vp.content;vp.content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no";requestAnimationFrame(()=>{vp.content=c})}
  }catch{}
}
function applyFs(on){
  if(on){ph.hidden=false}else{ph.hidden=true}
  sc.classList.toggle("appfs",on);de.classList.toggle("fs-on",on);document.body.classList.toggle("fs-on",on);
  fb.innerHTML=on?IC.exit:IC.enter;fb.setAttribute("aria-label",on?"Salir de pantalla completa":"Pantalla completa");
  player.config.clickToPlay=!on;   // en pantalla completa el toque muestra/oculta controles en vez de pausar
  if(on)showUi();else{sc.classList.remove("idle");scrollTo(0,savedY)}
}
async function setFs(on){
  if(on===isFs||busy)return;
  busy=true;isFs=on;
  if(on){savedY=scrollY;ph.style.height=sc.offsetHeight+"px"}
  de.classList.add("fsw");   // cortina negra mientras gira
  try{on?await P.Immersive.enter():await P.Immersive.exit()}catch{}
  await settle();
  applyFs(on);resetZoom();
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  de.classList.remove("fsw");busy=false;
}
fs=()=>setFs(!isFs);fb.onclick=()=>setFs(!isFs);

// Seguro: fuera de pantalla completa la barra inferior y el video SIEMPRE vuelven a su lugar.
const sync=()=>{
  if(isFs||busy)return;
  de.classList.remove("fs-on","fsw");document.body.classList.remove("fs-on");sc.classList.remove("appfs");ph.hidden=true;
};
["resize","orientationchange","pageshow","focus"].forEach(ev=>addEventListener(ev,sync));
document.addEventListener("visibilitychange",()=>{if(!document.hidden)sync()});
addEventListener("resize",resetZoom);

// ---- Botón "atrás" del celular y ciclo de vida de la app
if(P.App){
  P.App.addListener("backButton",()=>{
    const d=document.querySelector("dialog[open]");
    if(d)return d.close();
    if(busy)return;
    if(isFs)return setFs(false);
    if(document.body.classList.contains("searching")){closeSearch();mark(cat==="Favoritos"?"fav":"home");return apply()}
    P.App.exitApp();
  });
  let bgAt=0;
  P.App.addListener("appStateChange",async s=>{
    if(!s.isActive){bgAt=Date.now();return}
    sync();
    if(isFs){try{await P.Immersive.enter()}catch{}}   // las barras del sistema vuelven a esconderse al regresar
    if(bgAt&&Date.now()-bgAt>45000&&cur>=0&&!maint)play(cur);   // la señal en vivo ya está vieja: reconecta
    bgAt=0;
  });
}
})();
