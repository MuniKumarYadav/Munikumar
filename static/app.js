const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rotate = document.getElementById('rotate');
const words = ['grow','rank','convert','scale','get found'];
let wi = 0;
if (rotate && !reduceMotion) setInterval(() => {
  wi = (wi + 1) % words.length;
  rotate.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
  rotate.textContent = words[wi];
}, 1800);

document.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () =>
  document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})
));

async function post(url,payload){
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const d=await r.json(); if(!r.ok) throw new Error(d.error||'Request failed'); return d;
}
function out(id,html){document.getElementById(id).innerHTML=html}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

async function keywordIdeas(){
  const v=document.getElementById('keywordInput').value.trim(); if(!v)return out('keywordResult','Enter a seed keyword.');
  out('keywordResult','Generating intent-led ideas…');
  try{const d=await post('/api/keyword-ideas',{keyword:v});out('keywordResult',d.ideas.map(x=>'<div class="mini"><span>'+esc(x.keyword)+'</span><b>'+esc(x.intent)+'</b></div>').join(''))}catch(e){out('keywordResult',esc(e.message))}
}
async function intentScore(){
  const v=document.getElementById('intentInput').value.trim(); if(!v)return out('intentResult','Enter a query.');
  out('intentResult','Classifying with TensorFlow…');
  try{const d=await post('/api/intent',{query:v});out('intentResult','<div class="score">'+esc(d.intent)+'</div><div class="good">'+d.confidence+'% confidence</div>'+Object.entries(d.scores).map(([k,v])=>'<div class="mini"><span>'+esc(k)+'</span><b>'+v+'%</b></div>').join(''))}catch(e){out('intentResult',esc(e.message))}
}
async function contentScore(){
  const v=document.getElementById('contentInput').value.trim(); if(!v)return out('contentResult','Paste content to score.');
  out('contentResult','Scoring structure and AI-search signals…');
  try{const d=await post('/api/content-score',{content:v});out('contentResult','<div class="score">'+d.overall_score+'/100</div>'+[['Words',d.word_count],['Question coverage',d.question_coverage+'%'],['Entity signal',d.entity_signal+'%'],['Structure',d.structure_signal+'%'],['Readability',d.readability+'%']].map(x=>'<div class="mini"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join(''))}catch(e){out('contentResult',esc(e.message))}
}
async function urlAudit(){
  const v=document.getElementById('urlInput').value.trim(); if(!v)return out('urlResult','Enter a public URL.');
  out('urlResult','Fetching and auditing page…');
  try{const d=await post('/api/url-audit',{url:v});let rec=d.recommendations.length?'<ul>'+d.recommendations.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<div class="good">Core technical checks look healthy.</div>';out('urlResult','<div class="score">'+d.seo_score+'/100</div><div class="mini"><span>Title</span><b>'+esc(d.title||'Missing')+'</b></div><div class="mini"><span>Meta description</span><b>'+(d.description?'Present':'Missing')+'</b></div><div class="mini"><span>H1 count</span><b>'+d.h1s.length+'</b></div><div class="mini"><span>Canonical</span><b>'+(d.canonical?'Present':'Missing')+'</b></div>'+rec)}catch(e){out('urlResult',esc(e.message))}
}
