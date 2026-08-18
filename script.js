const deck=document.getElementById('deck');
const slides=[...document.querySelectorAll('.slide')];
const sideNav=document.getElementById('sideNav');
const progress=document.getElementById('progressBar');
const current=document.getElementById('currentSlide');
let index=0,locked=false,wheelAcc=0;

slides.forEach((_,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label',`Ir para slide ${i+1}`);
  b.addEventListener('click',()=>go(i));
  sideNav.appendChild(b);
});

function go(n){
  index=Math.max(0,Math.min(slides.length-1,n));
  deck.style.transform=`translateX(-${index*100}vw)`;
  slides.forEach((s,i)=>s.classList.toggle('active',i===index));
  [...sideNav.children].forEach((b,i)=>b.classList.toggle('active',i===index));
  progress.style.width=`${((index+1)/slides.length)*100}%`;
  current.textContent=String(index+1).padStart(2,'0');
}
go(0);

document.getElementById('prevBtn').onclick=()=>go(index-1);
document.getElementById('nextBtn').onclick=()=>go(index+1);
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(+b.dataset.go));

window.addEventListener('keydown',e=>{
  if(['ArrowRight','PageDown',' '].includes(e.key)) go(index+1);
  if(['ArrowLeft','PageUp'].includes(e.key)) go(index-1);
  if(e.key==='Home') go(0);
  if(e.key==='End') go(slides.length-1);
});

window.addEventListener('wheel',e=>{
  if(locked) return;
  wheelAcc += e.deltaY + e.deltaX;
  if(Math.abs(wheelAcc)>50){
    locked=true;
    go(index+(wheelAcc>0?1:-1));
    wheelAcc=0;
    setTimeout(()=>locked=false,700);
  }
},{passive:true});

let touchX=0;
window.addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});
window.addEventListener('touchend',e=>{
  const d=touchX-e.changedTouches[0].clientX;
  if(Math.abs(d)>45) go(index+(d>0?1:-1));
},{passive:true});

const glow=document.querySelector('.cursor-glow');
window.addEventListener('mousemove',e=>{
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
});

const solutionData={
  caldeiraria:{
    n:'01',title:'Fabricação metálica',
    text:'Fabricação de estruturas metálicas sob medida para obras, fábricas e ambientes industriais.',
    items:['Fabricação sob medida','Aplicação em obras e fábricas','Agilidade na execução dos serviços']
  },
  serralheria:{
    n:'02',title:'Instalação em campo',
    text:'Instalação e montagem em campo com foco em agilidade, segurança e qualidade na execução.',
    items:['Montagem em campo','Agilidade na instalação','Entrega alinhada ao projeto']
  }
};
document.querySelectorAll('.solution-tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.solution-tab').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  const d=solutionData[btn.dataset.solution];
  document.getElementById('solutionCopy').innerHTML=`<span>${d.n}</span><h3>${d.title}</h3><p>${d.text}</p><ul>${d.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
}));

const needs={
  obra:['Demanda em obra','Agilidade para executar serviços de fabricação, montagem e instalação de estruturas metálicas dentro do contexto da obra.'],
  fabrica:['Demanda em fábrica','Agilidade para executar serviços metálicos no ambiente produtivo, respeitando a rotina e o escopo da operação.'],
  industria:['Demanda industrial','Agilidade para executar serviços de estrutura metálica alinhados ao cenário da operação.']
};
document.querySelectorAll('.need-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.need-btn').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  const d=needs[btn.dataset.need];
  const panel=document.getElementById('needPanel');
  panel.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
  panel.innerHTML=`<span class="panel-label">CENÁRIO SELECIONADO</span><h3>${d[0]}</h3><p>${d[1]}</p><div class="flow"><span>Necessidade</span><i>→</i><span>Escopo</span><i>→</i><span>Execução</span><i>→</i><span>Entrega</span></div>`;
}));

document.getElementById('contactModal').addEventListener('click',e=>{
  if(e.target.id==='contactModal') e.currentTarget.classList.remove('open');
});
document.querySelectorAll('.work-thumb').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.work-thumb').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const main=document.getElementById('portfolioMain');
    const caption=document.getElementById('portfolioCaption');
    if(main){main.animate([{opacity:.25,transform:'scale(1.02)'},{opacity:1,transform:'scale(1)'}],{duration:360});main.src=btn.dataset.photo;}
    if(caption) caption.textContent=btn.dataset.caption;
  });
});
