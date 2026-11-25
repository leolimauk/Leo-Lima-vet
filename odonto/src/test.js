// Teste automático do app odontológico: node odonto/src/test.js
const {chromium}=require("playwright");const path=require("path");
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900}});await ctx.route(/googleapis/,r=>r.fulfill({json:{id_token:"t",refresh_token:"r",users:[{displayName:"sessao:A|x"}]}}));const p=await ctx.newPage();const errs=[];p.on("pageerror",e=>errs.push(e.message));
await p.goto("file://"+path.resolve(__dirname,"../index.html"));await p.evaluate(()=>localStorage.setItem("lmo_auth",JSON.stringify({email:"t@t",rt:"r",ok:Date.now(),sid:"A"})));await p.reload();await p.waitForTimeout(400);
const routes=["#/","#/bulario","#/calc/anest","#/calc/dose","#/calc/profi","#/calc/emerg","#/calc/inter","#/calc/cortic","#/calc/conv","#/tox","#/tox/t0","#/casos","#/casos/c1","#/odontograma","#/diagnosticos","#/diagnosticos/abscesso-agudo","#/diagnosticos/assistente","#/periograma","#/receita","#/legislacao","#/ajustes","#/favoritos"];
for(const r of routes){await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(80);const t=await p.evaluate(()=>{const o=document.querySelector(".out");return (o?o.innerText:document.querySelector("#app").innerText).slice(0,140).replace(/\n/g," | ")});console.log(r,"=>",t)}
const r=await p.evaluate(()=>{const out={};let mono=0,calc=0,bad=[];
 for(const d of DRUGS){location.hash="#/bulario/"+d.id;route();if(document.querySelector("#app h1"))mono++;
  for(const sp of Object.keys(d.d)){if(d.d[sp][0]==null)continue;S.calcSp=sp;S.calcDrug=d.id;location.hash="#/calc/dose/"+d.id;route();const t=document.getElementById("cOut").innerText;calc++;if(/NaN|undefined|Infinity/.test(t)||!t.trim())bad.push(d.n+" "+sp)}}
 let iok=0,ifail=[];INTER.forEach(rr=>{const A=IG[rr.a]||[rr.a],B=IG[rr.b]||[rr.b];const x=A[0],y=B.find(n=>n!==x);if(!y){ifail.push("sem par "+rr.a+"x"+rr.b);return}if(interPairs([x,y]).some(q=>q.r===rr)&&interPairs([y,x]).some(q=>q.r===rr))iok++;else ifail.push(rr.a+" x "+rr.b)});
 // anestésico: 20 kg lidocaína → 3,9 tubetes
 location.hash="#/calc/anest";route();document.getElementById("aW").value=20;calcRun();out.anest20=document.getElementById("aOut").innerText.split("\n").slice(0,3).join(" ");
 document.getElementById("aW").value=70;document.getElementById("aC").value="0.04";calcRun();out.anest70card=document.getElementById("aOut").innerText.split("\n").slice(0,3).join(" ");
 // odontograma
 location.hash="#/odontograma";route();S.tooth=36;rerender();out.dente36=document.querySelector("#app").innerText.match(/1º molar[^\n]*/)?.[0];
 S.odSet="dec";S.tooth=75;rerender();out.dente75=document.querySelector("#app").innerText.match(/2º molar decíduo/)?.[0];
 out.inter_varf=interPairs(["Miconazol Gel Oral 2%","Varfarina","Ibuprofeno"]).map(q=>q.r.sev+": "+q.x+" + "+q.y);
 let dg=0,dgBad=[];for(const d of DIAGS){location.hash="#/diagnosticos/"+d.id;route();const svg=document.querySelector("#app .figbox svg");if(svg&&svg.innerHTML.length>200)dg++;else dgBad.push(d.id)}
 const W=[["n","n","normal","n","n","n","normal"],["n","n","curta","n","n","n","normal"],["n","s","longa","s","n","n","lp"],["n","n","ausente","n","n","n","lesao"],["n","n","ausente","s","s","n","lesao"],["n","n","ausente","n","n","s","lesao"],["s","n","","n","n","n","lesao"]];
 out.wizard=W.map(([trat,dor,frio,perc,edema,fist,rx])=>{S.wz={trat,dor,frio,perc,edema,fist,rx};location.hash="#/diagnosticos/assistente";route();const o=document.querySelector("#app .out");return o?o.innerText.replace(/\n/g," | ").replace(/Ver .*/,""):"(sem resultado)"});
 S.perio=perioNew();S.perio.idade="40";S.perio.osso="30";S.perio.fumo="2";[16,26,36,46,11].forEach(n=>{const t=pT(n);t.ps=[6,4,5,6,3,5];t.mg=[1,0,1,1,0,0];t.bop=[1,1,0,1,0,1]});[21,31,41,12].forEach(n=>{const t=pT(n);t.ps=[2,2,2,2,2,2];t.mg=[0,0,0,0,0,0]});pT(17).aus=1;
 out.perio=perioCalc();location.hash="#/periograma";route();out.perioSvg=document.querySelectorAll("#app .pchart").length;
 Object.assign(out,{dg,dgTotal:DIAGS.length,dgBad,mono,drugs:DRUGS.length,calc,bad,iok,itotal:INTER.length,ifail});return out});
console.log(JSON.stringify(r,null,1));console.log("errors",errs);await b.close()})();
