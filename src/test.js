const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+'/home/user/Leo-Lima-vet/index.html');
 const routes=['#/','#/bulario','#/bulario/meloxicam','#/calc/dose','#/calc/cri','#/calc/fluido','#/calc/rcp','#/calc/transf','#/calc/energia','#/calc/kcl','#/calc/bic','#/calc/bsa','#/calc/conv','#/tox','#/tox/t0','#/casos','#/casos/c1','#/casos/c40','#/receita','#/favoritos','#/legislacao','#/ajustes'];
 for(const r of routes){await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(120);
   const t=await p.evaluate(()=>{const o=document.querySelector('.out');return (o?o.innerText:document.querySelector('#app').innerText).slice(0,170).replace(/\n/g,' | ')});console.log(r,'=>',t)}
 const bad=await p.evaluate(()=>{const out=[];for(const d of DRUGS){for(const sp of Object.keys(d.d)){const e=d.d[sp];if(!SPM[sp])out.push('badsp '+d.n+' '+sp);if(e[0]!=null&&(!(e[1]>=e[0])))out.push('range '+d.n+' '+sp);if(e[0]!=null&&!UNIT[d.u||'mg'])out.push('unit '+d.n)}for(const k of Object.keys(d.x))if(!SPM[k])out.push('badx '+d.n+' '+k);if(!CLS[d.c])out.push('cls '+d.n);if(d.ctl&&!CTL[d.ctl])out.push('ctl '+d.n)};return out});
 console.log('bad',bad);
 const r2=await p.evaluate(()=>{const res=[];let n=0;for(const d of DRUGS){for(const sp of Object.keys(d.d)){if(d.d[sp][0]==null)continue;n++;S.calcSp=sp;S.calcDrug=d.id;location.hash='#/calc/dose/'+d.id;route();const t=document.getElementById('cOut').innerText;if(/NaN|undefined|Infinity/.test(t)||!t.trim())res.push(d.n+' '+sp+': '+t.slice(0,90).replace(/\n/g,' '))}}return [n,res]});
 console.log('calc tested',r2[0],'issues',r2[1].length,r2[1].slice(0,30));
 // search
 await p.evaluate(()=>{openSearch('cerenia')});await p.waitForTimeout(100);console.log('search:',(await p.evaluate(()=>document.getElementById('gres').innerText)).slice(0,120).replace(/\n/g,' | '));
 console.log('errors',errs);
 await b.close();})();
