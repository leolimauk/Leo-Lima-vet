const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:900}});
await c.route(/googleapis/,r=>r.fulfill({json:{id_token:"t",refresh_token:"r",users:[{displayName:"sessao:A|x"}]}}));
const p=await c.newPage();const errs=[];p.on("pageerror",e=>errs.push(e.message));
await p.goto("file:///home/user/Leo-Lima-vet/index.html");await p.evaluate(()=>localStorage.setItem("lmv_auth",JSON.stringify({email:"a@b",rt:"r",ok:Date.now(),sid:"A"})));await p.reload();await p.waitForTimeout(400);
const res=await p.evaluate(()=>{const fail=[];let ok=0;
 INTER.forEach((r,k)=>{const A=IG[r.a]||[r.a],B=IG[r.b]||[r.b];let x=A[0],y=B.find(n=>n!==x);if(!y){fail.push("sem par distinto: "+r.a+" x "+r.b);return}
  const pr=interPairs([x,y]);if(pr.some(q=>q.r===r))ok++;else fail.push(r.a+" x "+r.b+" ("+x+" + "+y+")");
  const pr2=interPairs([y,x]);if(!pr2.some(q=>q.r===r))fail.push("ordem inversa: "+r.a+" x "+r.b)});
 // monographs render
 let mono=0;for(const d of DRUGS){location.hash="#/bulario/"+d.id;route();if(document.querySelector("#app h1").innerText.trim())mono++;}
 // known negatives
 const neg=interPairs(["Cefalexina","Omeprazol"]).length;
 const ex=interPairs(["Meloxicam","Prednisolona / Prednisona","Tramadol","Fluoxetina","Enrofloxacino","Sucralfato"]).map(q=>q.r.sev+": "+q.x+" + "+q.y);
 return {total:INTER.length,ok,fail,mono,drugs:DRUGS.length,neg,ex,cbd:!!DM["canabidiol-cbd-oleo-full-spectrum-isolado"]}});
console.log(JSON.stringify(res,null,1));
await p.evaluate(()=>{S.interSel=["meloxicam","prednisolona-prednisona","tramadol","fluoxetina"];location.hash="#/calc/inter"});await p.waitForTimeout(300);await p.screenshot({path:"/tmp/inter.png"});
await p.evaluate(()=>{location.hash="#/legislacao"});await p.waitForTimeout(200);
console.log("legislação tem cannabis:",await p.evaluate(()=>document.querySelector("#app").innerText.includes("Cannabis medicinal veterinária")),"errs:",errs);await b.close()})();
