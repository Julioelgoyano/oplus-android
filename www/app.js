// O-PLUS TV · comportamiento exclusivo de la app de Android
(()=>{
const g=id=>document.getElementById(id),P=(window.Capacitor&&Capacitor.Plugins)||{};
const IC={
  home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>',
  guide:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>',
  find:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  enter:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  exit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
};
document.documentElement.classList.add("app");

// ---- Intro
const sp=document.createElement("div");sp.id="splash";
sp.innerHTML='<div class="sp-ring"></div><img src="icon-512.png" alt=""><b>O-PLUS TV</b><small>Tu tele, donde quieras</small>';
document.body.append(sp);
setTimeout(()=>{sp.classList.add("out");setTimeout(()=>sp.remove(),600)},1700);

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
const sc=document.querySelector(".screen"),fb=document.createElement("button");
fb.id="appfs";fb.setAttribute("aria-label","Pantalla completa");fb.innerHTML=IC.enter;sc.append(fb);
let isFs=false;
async function setFs(on){
  isFs=on;sc.classList.toggle("appfs",on);document.body.classList.toggle("fs-on",on);fb.innerHTML=on?IC.exit:IC.enter;
  try{on?await P.Immersive.enter():await P.Immersive.exit()}catch{}
}
fs=()=>setFs(!isFs);fb.onclick=()=>setFs(!isFs);

// ---- Botón "atrás" del celular
if(P.App)P.App.addListener("backButton",()=>{
  const d=document.querySelector("dialog[open]");
  if(d)return d.close();
  if(isFs)return setFs(false);
  if(document.body.classList.contains("searching")){closeSearch();mark(cat==="Favoritos"?"fav":"home");return apply()}
  P.App.exitApp();
});
})();
