/* Statlix — shared interactions (ported from the Claude Design DCLogic components) */
(function(){
 var D=document, reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function $all(s){return Array.prototype.slice.call(D.querySelectorAll(s));}

 // hover (style-hover -> data-hover)
 $all('[data-hover]').forEach(function(el){var base=el.getAttribute('style')||'',hov=el.getAttribute('data-hover');
   el.addEventListener('mouseenter',function(){el.setAttribute('style',base+';'+hov);});
   el.addEventListener('mouseleave',function(){el.setAttribute('style',base);});});

 // reveal-on-scroll
 var items=$all('[data-reveal]');
 if(reduce||!('IntersectionObserver' in window)){items.forEach(function(el){el.style.opacity='1';el.style.transform='none';});}
 else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target,d=parseFloat(el.getAttribute('data-delay')||'0');el.style.transition='opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)';el.style.transitionDelay=d+'ms';el.style.opacity='1';el.style.transform='none';io.unobserve(el);}});},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
   items.forEach(function(el){io.observe(el);});
   setTimeout(function(){items.forEach(function(el){el.style.opacity='1';el.style.transform='none';});},2800);}

 // count-up
 function ac(el,inst){var t=parseFloat(el.getAttribute('data-count')),dec=parseInt(el.getAttribute('data-dec')||'0'),fmt=function(v){return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});};if(inst){el.textContent=fmt(t);return;}var dur=1400,st=performance.now();function step(now){var p=Math.min(1,(now-st)/dur);p=1-Math.pow(1-p,3);el.textContent=fmt(t*p);if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
 var cs=$all('[data-count]');
 if(reduce||!('IntersectionObserver' in window)){cs.forEach(function(el){ac(el,true);});}
 else{var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){ac(e.target);cio.unobserve(e.target);}});},{threshold:.4});cs.forEach(function(el){cio.observe(el);});}

 // header scroll state
 var header=D.querySelector('[data-header]');
 if(header){var os=function(){if(window.scrollY>16){header.style.background='rgba(15,14,13,.82)';header.style.backdropFilter='blur(14px)';header.style.webkitBackdropFilter='blur(14px)';header.style.borderBottomColor='rgba(255,255,255,.09)';}else{header.style.background='transparent';header.style.backdropFilter='none';header.style.webkitBackdropFilter='none';header.style.borderBottomColor='transparent';}};window.addEventListener('scroll',os,{passive:true});os();}

 // mobile menu
 var mb=D.querySelector('[data-menu-btn]'),mm=D.querySelector('[data-menu]');
 if(mb&&mm){mb.addEventListener('click',function(){var o=mm.getAttribute('data-open')==='1';mm.setAttribute('data-open',o?'0':'1');mm.style.display=o?'none':'flex';});}

 // lead forms -> success + dataLayer
 window.dataLayer=window.dataLayer||[];
 $all('[data-leadform]').forEach(function(f){f.addEventListener('submit',function(ev){ev.preventDefault();var b=f.querySelector('[data-formbody]'),d=f.querySelector('[data-done]');if(b)b.style.display='none';if(d)d.style.display='flex';window.dataLayer.push({event:'lead_captured',source:f.getAttribute('data-src')||(D.body.getAttribute('data-page')||'page'),ts:Date.now()});});});

 // faq accordion
 $all('[data-faq]').forEach(function(q){q.addEventListener('click',function(){var o=q.getAttribute('data-faq')==='1';q.setAttribute('data-faq',o?'0':'1');var p=q.nextElementSibling,ic=q.querySelector('[data-faqic]');if(p)p.style.maxHeight=o?'0':p.scrollHeight+'px';if(ic)ic.style.transform=o?'none':'rotate(45deg)';});});

 // pricing billing toggle
 var bills=$all('[data-bill]');
 if(bills.length){var setBill=function(mode){bills.forEach(function(b){var on=b.getAttribute('data-bill')===mode;b.style.background=on?'var(--orange)':'transparent';b.style.color=on?'#fff':'var(--tdm)';});$all('[data-price]').forEach(function(p){p.textContent=mode==='y'?p.getAttribute('data-y'):p.getAttribute('data-m');});$all('[data-suffix]').forEach(function(s){s.textContent=mode==='y'?'/ปี':'/เดือน';});};bills.forEach(function(b){b.addEventListener('click',function(){setBill(b.getAttribute('data-bill'));});});}

 // cost-per-message calculator (free tools)
 var calcInputs=$all('[data-calc]');
 if(calcInputs.length){var get=function(k){var el=D.querySelector('[data-calc="'+k+'"]');return el?parseFloat(el.value)||0:0;},fmt=function(v){return Math.round(v).toLocaleString('en-US');};
   var compute=function(){var budget=get('budget'),days=get('days'),cpc=get('cpc'),close=get('close'),total=budget*days,chats=cpc>0?total/cpc:0,orders=chats*close/100,cpo=orders>0?total/orders:0;
     var setO=function(k,v){var el=D.querySelector('[data-out="'+k+'"]');if(el)el.textContent=v;};setO('total',fmt(total));setO('chats',fmt(chats));setO('orders',fmt(orders));setO('cpo',fmt(cpo));
     var lab=function(k,v){var el=D.querySelector('[data-calcval="'+k+'"]');if(el)el.textContent=v;};lab('budget','฿'+fmt(budget));lab('days',fmt(days)+' วัน');lab('cpc','฿'+cpc);lab('close',close+'%');};
   calcInputs.forEach(function(i){i.addEventListener('input',compute);});compute();}

 // demo tabs (auto-advancing)
 var tabs=$all('[data-tab]'),panels=$all('[data-panel]');
 if(tabs.length){var auto;var show=function(n){tabs.forEach(function(t){var on=t.getAttribute('data-tab')===n;t.style.background=on?'var(--orange)':'rgba(255,255,255,.04)';t.style.borderColor=on?'var(--orange)':'var(--bdd)';t.style.color=on?'#fff':'var(--tdm)';});panels.forEach(function(p){p.style.display=p.getAttribute('data-panel')===n?'grid':'none';});};
   tabs.forEach(function(t){t.addEventListener('click',function(){show(t.getAttribute('data-tab'));if(auto)clearInterval(auto);});});
   var i=1;if(!reduce)auto=setInterval(function(){i=i%3+1;show(String(i));},3800);}

 // hero chat sequence (homepage)
 var bubbles=$all('[data-bubble]'),typing=D.querySelector('[data-typing]');
 if(bubbles.length){if(reduce){bubbles.forEach(function(b){b.style.opacity='1';b.style.transform='none';});}
   else{(function(){function reset(){bubbles.forEach(function(b){b.style.opacity='0';b.style.transform='translateY(8px)';});if(typing)typing.style.opacity='0';}
     function run(){reset();var i=0;function next(){if(i>=bubbles.length){if(typing)typing.style.opacity='0';setTimeout(run,4200);return;}var b=bubbles[i],wait=parseInt(b.getAttribute('data-bubble'))||600,isReply=b.getAttribute('data-me')==='1';if(typing&&i>0)typing.style.opacity=isReply?'1':'0';setTimeout(function(){if(typing)typing.style.opacity='0';b.style.opacity='1';b.style.transform='none';i++;setTimeout(next,550);},wait);}setTimeout(next,700);}run();})();}}
})();
