(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  let lang=localStorage.getItem('vive-lang')||'es';

  function setLang(next){
    lang=next; localStorage.setItem('vive-lang',lang); document.documentElement.lang=lang;
    $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(siteContent[lang][key]!==undefined)el.textContent=siteContent[lang][key]});
    $$('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(siteContent[lang][key]!==undefined)el.placeholder=siteContent[lang][key]});
    $$('.lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang)); renderDynamic(); initHomeFilters();
  }
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function sectionLabel(section){return siteContent[lang][section]||section}
  function preliminaryText(){return siteContent[lang].preliminary}
  function normalizeItem(item){return typeof item==='string'?{name:item}:item}
  function imageFor(item){return photoLibrary[item.image||'panorama']||photoLibrary.panorama}
  const categoryPages={nature:'miradores.html',coffee:'cafe.html',culture:'artesanias.html',events:'eventos.html'};
  function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function card(raw){
    const item=normalizeItem(raw);
    const img=imageFor(item), title=esc(item.name), sec=sectionLabel(item.section), search=encodeURIComponent((item.address?item.name+', '+item.address:item.name+', Pitalito, Huila, Colombia'));
    const desc=item['description_'+lang] || preliminaryText();
    const badge=item.verified?`<span class="verified">✓ ${lang==='es'?'Investigado':'Researched'}</span>`:'';
    const address=item.address?`<div class="meta-line">⌖ ${esc(item.address)}</div>`:'';
    const detail=item.location_detail?`<div class="meta-line detail">${esc(item.location_detail)}</div>`:'';
    const source=item.source?`<small class="source-note">${lang==='es'?'Fuente':'Source'}: ${item.source_url?`<a href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">${esc(item.source)}</a>`:esc(item.source)}</small>`:'';
    const page=categoryPages[item.section]||'index.html';
    const anchor=slug(item.name);
    const fichaLabel=lang==='es'?'Ver ficha':'View details';
    return `<article class="card reveal" id="${anchor}" data-name="${title.toLowerCase()}" data-section="${esc(item.section)}">
      <div class="visual"><img loading="lazy" src="${img.url}" alt="${title} — Pitalito, Huila" referrerpolicy="no-referrer"><span class="photo-credit">${esc(img.credit)}</span>${badge}</div>
      <div class="card-body"><span class="pill">${esc(sec)}</span><h3>${title}</h3><p>${esc(desc)}</p>${address}${detail}${source}
      <div class="card-actions"><a class="btn secondary" href="${page}#${anchor}">${fichaLabel}</a><a class="btn secondary" target="_blank" rel="noopener noreferrer" href="${item.maps_url || `https://www.google.com/maps/search/?api=1&query=${search}`}">${siteContent[lang].openMaps}</a></div></div>
    </article>`;
  }
  function renderDynamic(){
    const grid=$('#experience-grid');
    if(grid){
      const sub=document.body.dataset.sub, found=experiences.find(x=>x.sub===sub);
      if(found){grid.innerHTML=found.names.map(name=>card(Object.assign({}, normalizeItem(name), {section:found.section,image:found.image}))).join('');const titles=subTitles[sub];$('#page-title').textContent=titles[lang==='es'?0:1];observeReveal();focusExperience()}
    }
    const featured=$('#featured-grid');
    if(featured){const all=[];experiences.forEach(x=>x.names.forEach(n=>all.push(Object.assign({}, normalizeItem(n), {section:x.section,image:x.image}))));featured.innerHTML=all.slice(0,6).map(card).join('');observeReveal()}
  }
  function focusExperience(){
    const id=location.hash.slice(1);
    if(id){setTimeout(()=>{const el=document.getElementById(id);if(el){el.classList.add('focus-card');el.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>el.classList.remove('focus-card'),1800)}},250)}
  }
  function initHomeFilters(){
    const search=$('#experience-search'), grid=$('#featured-grid'); if(!search||!grid)return;
    const buttons=$$('.filter');
    const apply=()=>{const q=search.value.toLowerCase().trim(),active=$('.filter.active')?.dataset.filter||'all';$$('.card',grid).forEach(c=>{const matchName=c.dataset.name.includes(q),matchSec=active==='all'||c.dataset.section===active;c.style.display=matchName&&matchSec?'':'none'})};
    if(!search.dataset.bound){search.addEventListener('input',apply);buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');apply()}));search.dataset.bound='1'}
    apply();
  }
  function observeReveal(){const els=$$('.reveal');if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('visible'));return}const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>{if(!e.classList.contains('visible'))io.observe(e)})}
  $$('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  const toggle=$('#mobile-toggle'),menu=$('#menu');if(toggle)toggle.addEventListener('click',()=>menu.classList.toggle('open'));
  setLang(lang); observeReveal();
})();
