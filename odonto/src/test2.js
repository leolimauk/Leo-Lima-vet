// Teste dos módulos novos: node odonto/src/test2.js
const {chromium}=require("playwright");const path=require("path");
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900}});await ctx.route(/googleapis/,r=>r.fulfill({json:{id_token:"t",refresh_token:"r",users:[{displayName:"sessao:A|x"}]}}));
const p=await ctx.newPage();const errs=[];p.on("pageerror",e=>errs.push(e.message));p.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
await p.goto("file://"+path.resolve(__dirname,"../index.html"));await p.evaluate(()=>localStorage.setItem("lmo_auth",JSON.stringify({email:"t@t",rt:"r",ok:Date.now(),sid:"A"})));await p.reload();await p.waitForTimeout(400);
for(const r of ["#/emergencia","#/emergencia/protocolos","#/emergencia/protocolos/avulsao","#/prontuario","#/imagem","#/imagem/guia","#/imagem/dose","#/materiais","#/materiais/obtura"]){await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(80);console.log(r,"=>",(await p.evaluate(()=>document.querySelector("#app").innerText)).slice(0,120).replace(/\n/g," | "))}
const out=await p.evaluate(()=>{const o={};
 let ok=0,bad=[];for(const P of PROTO){location.hash="#/emergencia/protocolos/"+P.id;route();const t=document.querySelector("#app").innerText;if(/\[\[|NaN|undefined/.test(t))bad.push(P.id);else ok++}o.protocolos=ok+"/"+PROTO.length;o.protBad=bad;
 S.ew="20";S.eage="c";location.hash="#/emergencia/plantao";route();o.adrenalina_crianca20=[...document.querySelectorAll("#app .item")][0].innerText.replace(/\n/g," | ");o.midazolam_crianca=[...document.querySelectorAll("#app .item")].find(e=>/Midazolam/.test(e.innerText)).innerText.replace(/\n/g," | ");
 S.ew="70";S.eage="a";rerender();o.adrenalina_adulto=[...document.querySelectorAll("#app .item")][0].innerText.replace(/\n/g," | ");
 ercpStart();S.ercp.t0-=130000;ercpEv("Adrenalina");ercpTick();o.rcp=document.getElementById("ercpClock").innerText+" | "+document.getElementById("ercpCyc").innerText.replace(/\n/g," ");ercpStop();
 S.ew="20";S.eage="c";location.hash="#/emergencia/protocolos/abscesso";route();o.abscesso_crianca=[...document.querySelectorAll("#app li")][1].innerText.slice(0,200);
 let m=0;for(const x of MAT){location.hash="#/materiais/"+x.id;route();if(document.querySelector("#app .figbox svg"))m++}o.materiais=m+"/"+MAT.length;
 S.ri={pac:"Maria",idade:"45",sel:{panoramica:true,tcfc:true,"tc-perio":true,"tc-bi":true},reg:{tcfc:"região do 46 para implante","tc-perio":"anteriores superiores"},fov:"peq",ind:"Planejamento de implante",ges:"n",obs:"",laudo:"s",fmt:"dicom"};location.hash="#/imagem";route();o.req=imgText();
 o.notaDupla=!!document.querySelector("#app .note.info");return o});
console.log(JSON.stringify(out,null,1));
// prontuário + foto
await p.evaluate(()=>{location.hash="#/prontuario";route();document.getElementById("prN").value="João Teste";document.getElementById("prI").value="58";prAdd()});await p.waitForTimeout(150);
const pid=await p.evaluate(()=>{const id=S.pr[0].id;S.pr[0].an.coag=true;S.pr[0].an.bisf=true;prSave();location.hash="#/prontuario/"+id+"/ev";route();document.getElementById("evP").value="Exodontia simples";document.getElementById("evD").value="46";document.getElementById("evT").value="Lidocaína 2% 1 tubete. Sutura.";prEv(id);return id});
console.log("alertas:",(await p.evaluate(()=>document.querySelector("#app .note.bad").innerText)).replace(/\n/g," | ").slice(0,220));
await p.evaluate(id=>{location.hash="#/prontuario/"+id+"/fotos";route()},pid);
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGP4z8CAFWEXHbQSACj/P8Fu7N9hAAAAAElFTkSuQmCC","base64");
await p.setInputFiles("#galIn",[{name:"a.png",mimeType:"image/png",buffer:png},{name:"b.png",mimeType:"image/png",buffer:png}]);await p.waitForTimeout(1200);
const f=await p.evaluate(()=>({n:S.pr[0].fotos.length,imgs:[...document.querySelectorAll("img[data-fid]")].filter(i=>i.src.startsWith("data:image/jpeg")).length,cam:document.getElementById("camIn").getAttribute("capture")}));console.log("fotos:",JSON.stringify(f));
await p.evaluate(id=>prPrint(id),pid);await p.waitForTimeout(500);console.log("impressão: imagens no PDF =",await p.evaluate(()=>document.querySelectorAll("#printArea img").length),"| evolução:",await p.evaluate(()=>/Exodontia simples/.test(document.getElementById("printArea").innerText)));
await p.reload();await p.waitForTimeout(500);console.log("persistência após recarregar:",await p.evaluate(async()=>{const p=JSON.parse(localStorage.getItem("lmo_pront"))[0];const o=await FOTODB.get(p.fotos[0].id);return p.nome+" | fotos "+p.fotos.length+" | foto no IndexedDB: "+!!(o&&o.data)}));
console.log("errors",errs);await b.close()})();
