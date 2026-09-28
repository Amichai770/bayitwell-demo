/* Mishmeret app. No framework, no build step. State lives on the phone. */
(function(){
  var C = window.MISHMERET;
  var $ = function(id){ return document.getElementById(id); };
  var store = {
    get: function(k){ try { return localStorage.getItem('mm.'+k); } catch(e){ return null; } },
    set: function(k,v){ try { localStorage.setItem('mm.'+k, v); } catch(e){} },
    clear: function(){ try { Object.keys(localStorage).filter(function(k){return k.indexOf('mm.')===0;}).forEach(function(k){localStorage.removeItem(k);}); } catch(e){} }
  };
  function toast(msg){ var t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(function(){t.classList.remove('show');},2000); }
  function today(){ return new Date().toDateString(); }
  function isoWeek(d){ var date=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); var day=date.getUTCDay()||7; date.setUTCDate(date.getUTCDate()+4-day); var ys=new Date(Date.UTC(date.getUTCFullYear(),0,1)); return Math.ceil((((date-ys)/86400000)+1)/7); }
  function el(tag, cls, text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }

  /* ---------- Tabs ---------- */
  var tabs=['tamid','duchan','mishmar','learn','ask','me'];
  function showTab(name){
    tabs.forEach(function(t){ var s=$('s-'+t); if(s) s.hidden=(t!==name); });
    document.querySelectorAll('.tabbar button').forEach(function(b){ if(b.dataset.tab===name) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
    window.scrollTo(0,0); store.set('tab',name);
  }
  document.querySelectorAll('[data-tab]').forEach(function(b){ b.addEventListener('click', function(){ showTab(b.dataset.tab); }); });
  var hash=(location.hash||'').replace('#','');
  showTab(tabs.indexOf(hash)>=0?hash:(tabs.indexOf(store.get('tab'))>=0?store.get('tab'):'tamid'));

  /* ---------- Watches ---------- */
  var DUTY=(isoWeek(new Date())-1)%24;
  function mine(){ var v=parseInt(store.get('watch'),10); return isNaN(v)?-1:v; }
  function renderWatches(){
    var m=mine();
    $('duty-name').textContent=C.watches[DUTY][0]; $('duty-name-2').textContent=C.watches[DUTY][0];
    $('mine-name').textContent = m>=0 ? C.watches[m][0] : 'not chosen';
    var wl=$('watches'); wl.innerHTML='';
    C.watches.forEach(function(w,i){
      var b=el('button','watch'+(i===m?' mine':'')+(i===DUTY?' duty':''));
      b.setAttribute('aria-pressed', i===m);
      b.appendChild(el('span','num',String(i+1))); b.appendChild(el('span','',w[0])); b.appendChild(el('span','he',w[1]));
      b.addEventListener('click', function(){ store.set('watch',String(i)); renderWatches(); $('me-watch').value=String(i); toast('Your mishmar is '+w[0]+'.'); });
      wl.appendChild(b);
    });
  }
  renderWatches();
  $('weekly-q').textContent=C.weeklyQuestion;
  $('m-reply').value=store.get('weekly.'+isoWeek(new Date()))||'';
  $('m-keep').addEventListener('click', function(){ store.set('weekly.'+isoWeek(new Date()), $('m-reply').value); toast('Kept on this phone.'); });
  $('m-share').addEventListener('click', function(){ copyText($('m-reply').value, $('m-reply'), 'Copied. Paste it into the group.'); });
  if (C.brand.whatsapp){ $('wa-link').href=C.brand.whatsapp; $('wa-link').hidden=false; $('wa-link').target='_blank'; $('wa-link').rel='noopener'; }
  $('site-link').href=C.brand.site; $('about-site').href=C.brand.site;
  $('fam-text').value='B"H\nI joined something for Kohanim called Mishmeret. Two minutes in the morning and two at sunset, one source and one question, with a mishmar of Kohanim who keep it together. It is free. I want to keep it with you. Here is the link: '+C.brand.site.replace(/^https?:\/\/(www\.)?/,'');
  function copyText(text, ta, okMsg){
    var done=function(){ toast(okMsg); };
    var fallback=function(){ if(ta){ ta.focus(); ta.select(); } toast('Selected. Copy it from the box.'); };
    if(!text){ toast('Nothing to copy yet.'); return; }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(fallback); } else fallback();
  }
  $('fam-copy').addEventListener('click', function(){ copyText($('fam-text').value, $('fam-text'), 'Copied. Send it to one Kohen.'); });

  /* ---------- Tamid ---------- */
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Shabbat'];
  function weekFor(d){
    var iso=new Date(d); var sunday=new Date(iso); sunday.setDate(iso.getDate()-iso.getDay());
    var key=sunday.toISOString().slice(0,10);
    for(var i=0;i<C.weeks.length;i++){ if(C.weeks[i].start===key) return C.weeks[i]; }
    var idx=Math.floor((sunday-new Date('2026-09-27T00:00:00Z'))/(7*86400000)); if(idx<0) idx=0;
    return C.weeks[idx % C.weeks.length];
  }
  var mode=(new Date().getHours()<13)?'morning':'evening';
  var HERO={ morning:{eyebrow:'Boker',title:'The Tamid of the morning',he:'תָּמִיד שֶׁל שַׁחַר'}, evening:{eyebrow:'Bein HaArbayim',title:'The Tamid of the afternoon',he:'תָּמִיד שֶׁל בֵּין הָעַרְבַּיִם'} };
  function renderTamid(m){
    mode=m; var now=new Date(); var week=weekFor(now); var day=week.days[now.getDay()]; var t=(m==='morning')?day.morning:day.afternoon; var h=HERO[m];
    $('hero').className='hero '+m; $('hero-eyebrow').textContent=h.eyebrow+' \u00b7 '+DAYS[now.getDay()]; $('hero-title').textContent=h.title; $('hero-he').textContent=h.he;
    $('tamid-day').textContent=DAYS[now.getDay()]+' · '+week.label+'. One source, one teaching, one question, one thing placed on the altar.';
    $('t-src-he').textContent=t.he; $('t-src-en').textContent=t.en; $('t-src-ref').textContent=t.ref; $('t-teach').textContent=t.teach; $('t-q').textContent=t.q;
    $('seg-morning').setAttribute('aria-pressed',m==='morning'); $('seg-evening').setAttribute('aria-pressed',m==='evening');
    var saved=store.get('tamid.'+m+'.'+today()); $('t-reflect').value=saved||''; $('t-kept').textContent=saved?'Offered today.':'';
  }
  $('seg-morning').addEventListener('click',function(){renderTamid('morning');});
  $('seg-evening').addEventListener('click',function(){renderTamid('evening');});
  $('t-keep').addEventListener('click',function(){
    var v=$('t-reflect').value.trim(); if(!v){ toast('Write one line first.'); return; }
    store.set('tamid.'+mode+'.'+today(), v);
    var days=parseInt(store.get('days')||'0',10); if(store.get('lastday')!==today()){ days+=1; store.set('days',String(days)); store.set('lastday',today()); }
    $('t-kept').textContent='Offered. Day '+days+' of your watch.'; toast('Offered.');
  });
  renderTamid(mode);

  /* ---------- Duchan ---------- */
  var vw=$('verses');
  C.verses.forEach(function(v){
    var row=el('div','verse-row'); var c=el('span','count',v.count); var line=el('div','verse');
    v.words.forEach(function(w){
      var b=el('button','',w[0]); b.setAttribute('aria-pressed','false');
      b.addEventListener('click',function(){
        document.querySelectorAll('.verse button').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true');
        $('kav').hidden=false; $('kav-word').textContent=w[0]; $('kav-plain').textContent=w[1];
        var lab=(w[4]===undefined)?'Rashi':(w[4]||'Source'); $('kav-src-lab').textContent=w[2]?lab:'Source';
        $('kav-src').textContent=w[2]||'No separate gloss on this word. The kavana below carries it.'; $('kav-inner').textContent=w[3];
        $('kav').scrollIntoView({behavior:'smooth',block:'nearest'});
      });
      line.appendChild(b);
    });
    row.appendChild(line); row.appendChild(c); vw.appendChild(row);
  });
  var prep=$('prep'); C.prep.forEach(function(p,i){ var l=el('label'); var cb=el('input'); cb.type='checkbox'; cb.id='p'+i; l.appendChild(cb); l.appendChild(el('span','',p)); prep.appendChild(l); });
  $('kavana60').textContent=C.kavana60;

  /* ---------- Beit Midrash ---------- */
  var current=null;
  function renderPaths(){
    var wrap=$('paths'); wrap.innerHTML='';
    C.paths.forEach(function(p){
      var d=el('div','path'); var head=el('div','pathhead'); head.appendChild(el('h2','',p.title)); head.appendChild(el('span','note',p.sub)); d.appendChild(head);
      d.appendChild(el('p','',p.intro));
      var list=el('div','lessons');
      p.lessons.forEach(function(L){
        var openable=(L.state==='open');
        var row=el(openable?'button':'div', openable?'':'row');
        row.appendChild(el('span','d',String(L.n))); row.appendChild(el('span','t',L.title));
        var tag={open:'Open',soon:'Coming',audio:'Audio on the site',text:'Text on the site'}[L.state]||''; row.appendChild(el('span','tag',tag));
        if(openable) row.addEventListener('click',function(){ openLesson(p,L); });
        list.appendChild(row);
      });
      d.appendChild(list);
      if(p.id==='rambam'){ var a=el('a','btn ghost small','Open the Rambam on kehunacademy.com'); a.href=C.brand.rambam; a.target='_blank'; a.rel='noopener'; d.appendChild(a); }
      wrap.appendChild(d);
    });
  }
  function openLesson(p,L){
    current={p:p,L:L};
    $('learn-index').hidden=true; $('learn-lesson').hidden=false; window.scrollTo(0,0);
    $('l-path').textContent=p.title; $('l-count').textContent='Day '+L.n+' of 30'; $('l-eyebrow').textContent='Day '+L.n; $('l-title').textContent=L.title;
    $('l-src-he').textContent=L.src.he; $('l-src-en').textContent=L.src.en; $('l-src-ref').textContent=L.src.ref;
    var body=$('l-body'); body.innerHTML=''; body.appendChild(el('span','eyebrow','Teaching')); L.body.forEach(function(t){ body.appendChild(el('p','',t)); });
    if(L.link){ var b=el('button','btn ghost small','Open the Duchan'); b.addEventListener('click',function(){ showTab(L.link); }); body.appendChild(b); }
    $('l-q').textContent=L.q; $('l-reflect').value=store.get('lesson.'+p.id+'.'+L.n)||'';
    var next=p.lessons.filter(function(x){return x.n>L.n&&x.state==='open';})[0]; $('l-next').hidden=!next;
  }
  $('l-next').addEventListener('click',function(){ if(!current) return; var next=current.p.lessons.filter(function(x){return x.n>current.L.n&&x.state==='open';})[0]; if(next) openLesson(current.p,next); });
  $('l-back').addEventListener('click',function(){ $('learn-lesson').hidden=true; $('learn-index').hidden=false; window.scrollTo(0,0); });
  $('l-keep').addEventListener('click',function(){ if(!current) return; store.set('lesson.'+current.p.id+'.'+current.L.n, $('l-reflect').value); toast('Kept on this phone.'); });
  $('l-ask').addEventListener('click',function(){ if(!current) return; showTab('ask'); $('ask-input').value='Explain '+current.L.src.ref+' ("'+current.L.src.en.replace(/^"|"$/g,'')+'"). How do the commentaries read it?'; $('ask-input').focus(); });
  renderPaths();

  /* ---------- Ask ---------- */
  var turns=[]; var busy=false; var backend=null; /* 'sample' | 'api' | null */
  var statusEl=$('ask-status');
  function setStatus(live,text){ statusEl.className='status'+(live?' live':''); statusEl.querySelector('span:last-child').textContent=text; }
  function renderAnswer(elm,text){ var i=text.lastIndexOf('Sources:'); elm.textContent=''; if(i>0){ elm.textContent=text.slice(0,i).trim(); var s=el('span','src',text.slice(i).trim()); elm.appendChild(s); } else elm.textContent=text; }
  renderAnswer($('first-answer'), C.prepared[0].a);
  C.chips.forEach(function(c){ var b=el('button','',c[0]); b.addEventListener('click',function(){ ask(c[1]); }); $('chips').appendChild(b); });
  function prepared(q,elm){ for(var i=0;i<C.prepared.length;i++){ if(C.prepared[i].k.test(q)){ renderAnswer(elm,C.prepared[i].a); return; } } elm.textContent='Live answers are not available on this device right now. The prepared answers cover the Kohen’s portion, Birkat Kohanim, the cemetery, and Hod. Try one of those, or come back when you are online.'; }
  var sampleFn=null;
  function detect(){
    if(window.claude&&typeof window.claude.use==='function'){
      window.claude.use('sample').then(function(s){ if(s){ sampleFn=s; backend='sample'; setStatus(true,'Live. Answers are written from the sources as you ask.'); } else detectApi(); }).catch(detectApi);
    } else detectApi();
  }
  function detectApi(){
    if(location.protocol==='file:'){ setStatus(false,'Prepared answers only (offline file).'); return; }
    fetch('api/ask',{method:'GET'}).then(function(r){ return r.ok?r.json():null; }).then(function(j){ if(j&&j.ok){ backend='api'; setStatus(true,'Live. Answers are written from the sources as you ask.'); } else setStatus(false,'Prepared answers only. The live companion is not connected yet.'); }).catch(function(){ setStatus(false,'Prepared answers only. The live companion is not connected yet.'); });
  }
  detect();
  function addBubble(cls,text){ var d=el('div','bubble '+cls,text); $('chat').appendChild(d); return d; }
  function ask(q){
    if(busy) return; q=(q||'').trim(); if(!q){ toast('Type a question first.'); return; }
    addBubble('user',q); $('ask-input').value=''; var elm=addBubble('ai','Thinking…'); elm.scrollIntoView({behavior:'smooth',block:'end'}); busy=true;
    var finish=function(){ busy=false; elm.scrollIntoView({behavior:'smooth',block:'end'}); };
    turns.push({role:'user',content:q}); if(turns.length>8) turns=turns.slice(-8);
    if(backend==='sample'&&sampleFn){
      sampleFn([{role:'user',content:C.rules}].concat(turns),{cache:false,onText:function(ev){ renderAnswer(elm,ev.text); }})
        .then(function(r){ renderAnswer(elm,r.text); turns.push({role:'assistant',content:r.text}); })
        .catch(function(e){ turns.pop(); if(e&&e.text) renderAnswer(elm,e.text); else if(e&&e.code==='not_granted'){ prepared(q,elm); sampleFn=null; backend=null; setStatus(false,'Prepared answers only.'); } else if(e&&e.code==='rate_limited') elm.textContent='Too many questions for the moment. Please wait a little and ask again.'; else elm.textContent='The companion could not answer just now. Please try again.'; })
        .then(finish);
    } else if(backend==='api'){
      fetch('api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:turns})})
        .then(function(r){ if(!r.ok) throw new Error('bad status '+r.status); return r.json(); })
        .then(function(j){ if(j.error) throw new Error(j.error); renderAnswer(elm,j.text); turns.push({role:'assistant',content:j.text}); })
        .catch(function(){ turns.pop(); elm.textContent='The companion could not answer just now. Please try again in a moment.'; })
        .then(finish);
    } else { setTimeout(function(){ turns.pop(); prepared(q,elm); finish(); },350); }
  }
  $('ask-send').addEventListener('click',function(){ ask($('ask-input').value); });
  $('ask-input').addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); ask($('ask-input').value); } });

  /* ---------- You ---------- */
  var sel=$('me-watch'); sel.appendChild(el('option','','Choose your watch')).value='';
  C.watches.forEach(function(w,i){ var o=el('option','',(i+1)+' · '+w[0]); o.value=String(i); sel.appendChild(o); });
  sel.value=mine()>=0?String(mine()):''; $('me-name').value=store.get('name')||''; $('me-kohen').value=store.get('kohen')||'';
  $('me-save').addEventListener('click',function(){ store.set('name',$('me-name').value.trim()); store.set('kohen',$('me-kohen').value); if(sel.value!=='') store.set('watch',sel.value); renderWatches(); toast('Saved.'); });
  $('me-reset').addEventListener('click',function(){ store.clear(); toast('Cleared.'); setTimeout(function(){ location.reload(); },600); });
  if (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches) $('install-hint').hidden=true;

  /* ---------- Service worker ---------- */
  if('serviceWorker' in navigator && location.protocol==='https:' && !(window.claude)){ navigator.serviceWorker.register('sw.js').catch(function(){}); }
})();
