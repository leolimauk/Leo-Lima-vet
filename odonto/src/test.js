// Teste automático do app odontológico: node odonto/src/test.js
const {chromium}=require("playwright");const path=require("path");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on("pageerror",e=>errs.push(e.message));
await p.goto("file://"+path.resolve(__dirname,"../index.html"));await p.waitForTimeout(300);
const routes=["#/","#/bulario","#/calc/anest","#/calc/dose","#/calc/profi","#/calc/emerg","#/calc/inter","#/calc/cortic","#/calc/conv","#/tox","#/tox/t0","#/casos","#/casos/c1","#/odontograma","#/receita","#/legislacao","#/ajustes","#/favoritos"];
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
 Object.assign(out,{mono,drugs:DRUGS.length,calc,bad,iok,itotal:INTER.length,ifail});return out});
console.log(JSON.stringify(r,null,1));console.log("errors",errs);await b.close()})();
