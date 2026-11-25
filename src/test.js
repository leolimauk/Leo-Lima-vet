// Teste automático do app veterinário: node src/test.js
const { chromium } = require('playwright');const path=require('path');
(async()=>{
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});
 await ctx.route(/github\.io/,r=>r.fulfill({status:404,body:""}));await ctx.route(/googleapis/,r=>r.fulfill({json:{id_token:"t",refresh_token:"r",users:[{displayName:"sessao:A|x"}]}}));
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.evaluate(()=>localStorage.setItem("lmv_auth",JSON.stringify({email:"t@t",rt:"r",ok:Date.now(),sid:"A"})));await p.reload();await p.waitForTimeout(400);
 const routes=['#/','#/bulario','#/bulario/meloxicam','#/calc/dose','#/calc/anestv','#/calc/corticv','#/calc/inter','#/calc/rcp','#/calc/fluido','#/tox','#/casos','#/diag','#/diag/vomito','#/derm','#/derm/atlas','#/derm/ddx','#/derm/exames','#/derm/req','#/odontovet','#/escalas/dor-cao','#/escalas/dor-gato','#/escalas/ecc','#/escalas/coma','#/receita','#/legislacao','#/ajustes','#/lab','#/lab/gaso','#/lab/ref','#/docs','#/docs/t-eut','#/docs/obito','#/vacinas','#/vacinas/cat','#/vacinas/horse','#/vacinas/cattle','#/vacinas/cal','#/repro','#/repro/p4','#/repro/distocia','#/anestesia','#/anestesia/jejum','#/anestesia/check','#/anestesia/monit','#/emergencia','#/emergencia/choque','#/emergencia/fast','#/emergencia/transf','#/producao','#/producao/ecc','#/producao/carencia','#/quiz'];
 for(const r of routes){await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(60);const t=await p.evaluate(()=>{const o=document.querySelector('.out');return (o?o.innerText:document.querySelector('#app').innerText).slice(0,110).replace(/\n/g,' | ')});console.log(r,'=>',t)}
 const res=await p.evaluate(()=>{const out={};
  // bulário + calculadora
  let calc=0,bad=[];for(const d of DRUGS){for(const sp of Object.keys(d.d)){if(d.d[sp][0]==null)continue;calc++;S.calcSp=sp;S.calcDrug=d.id;location.hash='#/calc/dose/'+d.id;route();const t=document.getElementById('cOut').innerText;if(/NaN|undefined|Infinity/.test(t)||!t.trim())bad.push(d.n+' '+sp)}}
  out.calc=calc;out.calcBad=bad;
  // interações
  let iok=0,ifail=[];INTER.forEach(r=>{const A=IG[r.a]||[r.a],B=IG[r.b]||[r.b];const x=A[0],y=B.find(n=>n!==x);if(!y){ifail.push(r.a+'x'+r.b);return}if(interPairs([x,y]).some(q=>q.r===r)&&interPairs([y,x]).some(q=>q.r===r))iok++;else ifail.push(r.a+'x'+r.b)});out.inter=iok+'/'+INTER.length;out.ifail=ifail;
  // queixas e dermatologia
  let q=0;for(const x of QXS){location.hash='#/diag/'+x.id;route();if(document.querySelector('#app .figbox svg'))q++}out.queixas=q+'/'+QXS.length;
  let d=0;for(const x of DERMS){location.hash='#/derm/d/'+x.id;route();if(document.querySelectorAll('#app .figbox svg').length===2)d++}out.derm=d+'/'+DERMS.length;
  const wz=(k,v)=>{S.vw=Object.assign({_k:k},v);location.hash='#/diag/w/'+k;route();const o=document.querySelector('#app .out');return o?o.innerText.split('\n').slice(0,3).join(' | '):'(vazio)'};
  out.anemia_hemolitica=wz('anemia',{sp:'dog',ht:'18',ret:'150000',pt:'7',hem:'s'});
  out.anemia_nreg=wz('anemia',{sp:'cat',ht:'14',ret:'10000',ag:'cron'});
  out.diarreia_ig=wz('diarreia',{vol:'ig',freq:'ig',ten:'ig',muco:'ig',sang:'ig'});
  out.iris_gato=wz('iris',{sp:'cat',cr:'3.2',upc:'0.6',pas:'175'});
  out.iris_sdma=wz('iris',{sp:'dog',cr:'1.3',sdma:'40'});
  out.acvim_b2=wz('acvim',{sopro:'s',icc:'n',laao:'1.8',lvidd:'1.9'});
  out.acvim_c=wz('acvim',{sopro:'s',icc:'s',refr:'n'});
  S.ddv={sp:'dog',pru:'2',les:'crosta',reg:['orelhas','cotovelos'],zoo:'s',jovem:'s'};location.hash='#/derm/ddx';route();out.ddx_sarna=document.querySelector('#app .card .list .t')?.innerText;
  S.ddv={sp:'cat',pru:'0',les:'ulcera',reg:['plano-nasal','face'],zoo:'s'};rerender();out.ddx_esporo=document.querySelector('#app .card .list .t')?.innerText;
  S.ddv={sp:'dog',pru:'0',les:'alopecia',reg:['cauda','flancos'],jovem:'n'};rerender();out.ddx_hipot=document.querySelector('#app .card .list .t')?.innerText;
  S.gc={0:1,1:2,2:2,3:3,4:1,5:1};location.hash='#/escalas/dor-cao';route();out.glasgow=document.querySelector('#app .out').innerText.split('\n').slice(0,3).join(' | ');
  S.fg={0:1,1:1,2:1,3:1,4:1};location.hash='#/escalas/dor-gato';route();out.grimace=document.querySelector('#app .out').innerText.split('\n').slice(0,3).join(' | ');
  S.ecc=8;S.eccw='20';location.hash='#/escalas/ecc';route();out.ecc=document.querySelector('#app .out').innerText.split('\n').slice(0,2).join(' | ');
  S.gcs={0:4,1:3,2:2};location.hash='#/escalas/coma';route();out.mgcs=document.querySelector('#app .out').innerText.split('\n').slice(0,3).join(' | ');
  S.ovsp='cat';S.ov={dog:{},cat:{307:{tr:3},309:{pd:4,ext:1}}};S.ovt=307;location.hash='#/odontovet';route();out.odonto_gato=document.querySelector('#app .out').innerText.split('\n').slice(0,6).join(' ');
  location.hash='#/calc/anestv';route();document.getElementById('avS').value='cat';document.getElementById('avW').value='4';document.getElementById('avA').value='2';calcRun();out.anest_bupi_gato=document.getElementById('avO').innerText.split('\n').slice(0,3).join(' | ');
  // laboratório
  const lab=(sp,v)=>{S.lab={sp,v};location.hash='#/lab';route();labRun();return labEval().P.map(p=>p[1].slice(0,70))};
  out.lab_addison=lab('dog',{na:'132',k:'7.1',lin:'3.5',crea:'2.4',usg:'1.020'});
  out.lab_prerenal=lab('cat',{crea:'2.6',usg:'1.045'});
  out.lab_estresse=lab('dog',{seg:'18',lin:'0.6',eos:'0.05',bas:'0.1'});
  out.lab_desvio_deg=lab('dog',{seg:'2',bas:'3.5',leu:'7'});
  out.lab_pif=lab('cat',{alb:'2.2',glob:'6.5'});
  out.lab_ferropriva=lab('dog',{ht:'22',vcm:'55',chcm:'28'});
  const gas=G=>gasEval(G).R.map(r=>r[1].slice(0,80));
  out.gas_acmet_ag=gas({sp:'dog',ph:'7.18',pco2:'26',hco3:'11',na:'145',k:'4.5',cl:'108'});
  out.gas_misto=gas({sp:'dog',ph:'7.05',pco2:'45',hco3:'12'});
  out.gas_alc_hipocl=gas({sp:'dog',ph:'7.55',pco2:'45',hco3:'34',na:'140',k:'3',cl:'88'});
  out.gas_resp_ac=gas({sp:'dog',ph:'7.25',pco2:'60',hco3:'25.5',cr:'a'});
  // documentos
  let dok=0;for(const [k] of DOCS){location.hash='#/docs/'+k;route();const t=docBody(k);if(t&&t.length>200&&!/undefined|NaN/.test(t))dok++}out.docs=dok+'/'+DOCS.length;
  // vacinas
  S.vacc={sp:'dog',nasc:'2026-10-01',risco:'s'};out.vac_cao=vacSchedule(S.vacc).slice(0,4).map(x=>dBR(x[0])+' '+x[1]);
  S.vacc={sp:'cat',nasc:'2026-10-01',risco:'s'};out.vac_gato_felv=vacSchedule(S.vacc).filter(x=>/FeLV/.test(x[1])).map(x=>dBR(x[0])+' '+x[1]);
  // reprodução
  S.rep={sp:'dog',dt:'2026-01-01',ref:'lh',p4:''};location.hash='#/repro';route();out.parto_lh=document.querySelector('#app .out .big').innerText;
  S.rep={sp:'cattle',dt:'2026-01-01',ref:'cob'};rerender();out.parto_vaca=document.querySelector('#app .out .big').innerText;
  S.rep={sp:'dog',p4:'7'};location.hash='#/repro/p4';route();out.p4_7=document.querySelector('#app .out .big').innerText;
  // emergência e produção
  S.sh={sp:'dog',fc:'180',pas:'80'};location.hash='#/emergencia/choque';route();out.indice_choque=document.querySelector('#app .out').innerText.split('\n').slice(0,3).join(' | ');
  const iv=DRUGS.find(d=>/^Ivermectina/.test(d.n)&&d.d.cattle);S.lote={sp:'cattle',drug:iv?iv.id:'',n:'50',w:'400',dose:'',fr:'500'};location.hash='#/producao';route();out.lote_ivermectina=(iv?iv.n:'?')+' | '+document.querySelector('#app .out .res-grid').innerText.replace(/\n/g,' ');
  S.car={dt:'2026-11-20',carne:'35',leite:'',lu:'d'};location.hash='#/producao/carencia';route();out.carencia=document.querySelector('#app .note').innerText;
  // quiz: todas as trilhas geram 10 questões válidas
  out.quiz={};for(const k of Object.keys(QUIZ_T)){newQuiz(k);out.quiz[k]=S.qz.Q.length+(S.qz.Q.every(q=>q.o.length>=2&&q.o.includes(q.a)&&new Set(q.o).size===q.o.length)?' ok':' FALHA')}
  location.hash='#/quiz/farm';route();qAns(0);out.quiz_tela=document.querySelector('#app .note').innerText.slice(0,40);
  out.dataV=DATA.v;
  let mono=0;for(const x of DRUGS){location.hash='#/bulario/'+x.id;route();if(document.querySelector('#app h1'))mono++}out.monografias=mono+'/'+DRUGS.length;
  return out});
 console.log(JSON.stringify(res,null,1));console.log('errors',errs);await b.close()})();
