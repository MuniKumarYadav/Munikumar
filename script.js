const themeBtn=document.getElementById('themeBtn');const themeIcon=document.getElementById('themeIcon');
function applyTheme(dark){document.documentElement.classList.toggle('dark',dark);document.documentElement.classList.toggle('light',!dark);if(themeIcon)themeIcon.className=dark?'fa-solid fa-moon':'fa-solid fa-sun';localStorage.setItem('theme',dark?'dark':'light')}
applyTheme(localStorage.getItem('theme')!=='light');themeBtn?.addEventListener('click',()=>applyTheme(document.documentElement.classList.contains('light')));
const form=document.getElementById('agentForm'),input=document.getElementById('agentInput'),terminal=document.getElementById('terminal');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function addLine(text,cls='text-cyan-300'){if(!terminal)return;const p=document.createElement('p');p.className=`terminal-line ${cls} mb-2`;p.textContent=text;terminal.appendChild(p);terminal.scrollTop=terminal.scrollHeight}
form?.addEventListener('submit',async e=>{e.preventDefault();const q=input.value.trim();if(!q)return;const button=form.querySelector('button');button.disabled=true;input.disabled=true;addLine(`$ growth-agent simulate --task "${q}"`,'text-slate-200');const steps=['[research] Identifying audience, intent and funnel stage...','[strategy] Mapping the request to SEO → AEO → GEO opportunities...','[content] Selecting useful evidence, entities and answer structures...','[measurement] Defining visibility, engagement and conversion signals...','[done] Strategy simulation complete. Connect a backend to execute real agents.'];for(let i=0;i<steps.length;i++){await sleep(i===0?450:650);addLine(steps[i],i===4?'text-emerald-400 font-semibold':'text-cyan-300')}input.value='';button.disabled=false;input.disabled=false;input.focus()});
setInterval(()=>{const el=document.getElementById('latency');if(el)el.textContent=`${130+Math.floor(Math.random()*31)}ms`},3000);

/* Premium marketing motion layer: subtle, fast and accessibility-aware. */
(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style=document.createElement('style');
  style.textContent=`
    html{scroll-behavior:smooth}
    @keyframes floatIn{from{opacity:0;transform:translate3d(0,28px,0) scale(.985)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.0)}50%{box-shadow:0 0 34px 2px rgba(34,211,238,.13)}}
    @keyframes drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-9px,0)}}
    .motion-ready{opacity:0;transform:translate3d(0,28px,0);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
    .motion-ready.is-visible{opacity:1;transform:none}
    .hero-float{animation:drift 6s ease-in-out infinite}
    .shine{position:relative;overflow:hidden}
    .shine:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.09) 50%,transparent 65%);background-size:200% 100%;animation:shimmer 5s linear infinite}
    .magnetic{transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s ease}
    .magnetic:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(34,211,238,.14)}
    .section-progress{position:fixed;top:0;left:0;height:2px;width:0;z-index:100;background:linear-gradient(90deg,#22d3ee,#60a5fa,#818cf8);box-shadow:0 0 12px rgba(34,211,238,.55)}
    .cursor-glow{position:fixed;width:260px;height:260px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(34,211,238,.08),transparent 68%);transform:translate(-50%,-50%);opacity:0;transition:opacity .3s ease}
    .count-up{font-variant-numeric:tabular-nums}
    @media(max-width:767px){.cursor-glow{display:none}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.motion-ready{opacity:1;transform:none}}
  `;
  document.head.appendChild(style);

  const progress=document.createElement('div');progress.className='section-progress';document.body.appendChild(progress);
  const glow=document.createElement('div');glow.className='cursor-glow';document.body.appendChild(glow);
  if(!reduce){document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='1'});document.addEventListener('pointerleave',()=>glow.style.opacity='0');}

  const sections=[...document.querySelectorAll('main section')];
  sections.forEach((el,i)=>{el.querySelectorAll(':scope > div > h2, :scope > div > p, :scope article, :scope > div > div').forEach((node,j)=>{if(j<12){node.classList.add('motion-ready');node.style.transitionDelay=reduce?'0ms':`${Math.min(j*55,330)}ms`}})});
  if(reduce){document.querySelectorAll('.motion-ready').forEach(x=>x.classList.add('is-visible'))}
  else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -45px'});document.querySelectorAll('.motion-ready').forEach(x=>observer.observe(x));}

  document.querySelectorAll('section:first-of-type .glass').forEach(x=>x.classList.add('hero-float','shine'));
  document.querySelectorAll('a[href^="#"],a[href="blogs.html"],button').forEach(x=>x.classList.add('magnetic'));
  window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=max>0?`${Math.min(100,window.scrollY/max*100)}%`:'0%'},{passive:true});

  // Gentle card tilt on pointer devices; never used on touch/reduced-motion.
  if(!reduce && window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('article.glass').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*2.5).toFixed(2)}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>{card.style.transform=''})})}
})();