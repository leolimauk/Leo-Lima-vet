/* ================= Ilustrações ================= */
function figDente(o){o=o||{};const W=200,H=300;let s='<svg viewBox="0 0 '+W+' '+H+'" class="fig" role="img" aria-label="Ilustração">';
  const boneTop=o.bone==="perda"?190:o.bone==="perdaGrave"?220:158;
  // osso
  s+='<rect x="0" y="'+boneTop+'" width="200" height="'+(H-boneTop)+'" fill="#e8dcc4"/>';
  s+='<g opacity=".35" stroke="#c9b48c" stroke-width="1.2">'+[0,1,2,3,4,5].map(i=>'<path d="M'+(10+i*35)+' '+(boneTop+20)+' q8 10 0 20 q-8 10 0 20" fill="none"/>').join("")+'</g>';
  if(o.alveolo){s+='<path d="M70 160 Q100 300 130 160 Z" fill="#f4efe6" stroke="#b8a37a" stroke-width="2"/><path d="M78 170 Q100 270 122 170" fill="#ffffff" opacity=".6"/>';
    s+='<path d="M0 150 Q35 140 65 155 L70 160 L130 160 L135 155 Q165 140 200 150 L200 '+(boneTop+4)+' L0 '+(boneTop+4)+' Z" fill="#f1a7a7"/></svg>';return s}
  // lesões periapicais
  if(o.apical==="lesao"||o.apical==="abscesso"||o.apical==="fistula")s+='<ellipse cx="100" cy="278" rx="30" ry="18" fill="#5b4a3a" opacity=".55"/>';
  if(o.apical==="condensante")s+='<ellipse cx="100" cy="280" rx="34" ry="20" fill="#fff8e8" stroke="#d8c8a0" stroke-dasharray="3 3"/>';
  if(o.apical==="lp")s+='<path d="M82 160 L96 276 Q100 286 104 276 L118 160" fill="none" stroke="#5b4a3a" stroke-width="7" opacity=".35"/>';
  if(o.apical==="abscesso")s+='<ellipse cx="150" cy="230" rx="38" ry="30" fill="#f6d365" stroke="#e0a800" stroke-width="2" opacity=".9"/><text x="150" y="234" font-size="11" text-anchor="middle" fill="#7a5a00" font-weight="700">pus</text>';
  if(o.apical==="fistula")s+='<path d="M118 272 Q150 230 160 150" fill="none" stroke="#e0a800" stroke-width="5" stroke-dasharray="6 4"/><circle cx="162" cy="146" r="6" fill="#f6d365" stroke="#e0a800"/>';
  // raiz + coroa
  const tooth='M60 40 Q62 22 78 26 Q90 34 100 30 Q110 34 122 26 Q138 22 140 40 L138 140 Q132 150 124 160 L106 284 Q100 296 94 284 L76 160 Q68 150 62 140 Z';
  s+='<path d="'+tooth+'" fill="#fbf8f0" stroke="#7c7466" stroke-width="2"/>';
  s+='<path d="M60 40 Q62 22 78 26 Q90 34 100 30 Q110 34 122 26 Q138 22 140 40 L138 140 Q100 150 62 140 Z" fill="#ffffff" stroke="#7c7466" stroke-width="2"/>';
  s+='<path d="M70 48 Q100 40 130 48 L128 136 Q100 144 72 136 Z" fill="#f3ead4" opacity=".9"/>';
  // polpa
  const pc=o.pulp==="inflam"?"#e53935":o.pulp==="necrose"?"#7a7a7a":o.pulp==="tratado"?"#f5a623":"#f28b8b";
  s+='<path d="M86 70 Q100 62 114 70 L112 140 L103 276 Q100 282 97 276 L88 140 Z" fill="'+pc+'" stroke="'+(o.pulp==="tratado"?"#c27c00":"#b55")+'" stroke-width="1.2"/>';
  if(o.pulp==="inflam")s+='<g fill="#fff" opacity=".7"><circle cx="96" cy="90" r="2.5"/><circle cx="104" cy="104" r="2"/><circle cx="99" cy="120" r="2"/></g>';
  // cárie
  if(o.caries>=1)s+='<path d="M84 30 Q96 26 100 30 Q104 34 112 30 L110 '+(o.caries===1?38:o.caries===2?62:74)+' Q100 '+(o.caries===1?42:o.caries===2?70:80)+' 88 '+(o.caries===1?38:o.caries===2?62:74)+' Z" fill="'+(o.caries===1?"#f5f0e0":"#3e2c1c")+'" stroke="'+(o.caries===1?"#c8bfa0":"#2a1a0a")+'" stroke-width="1.5" '+(o.caries===1?'stroke-dasharray="3 2"':'')+'/>';
  if(o.fratura)s+='<path d="M104 30 L98 70 L106 100 L99 140 L104 180" fill="none" stroke="#222" stroke-width="2.4"/>';
  if(o.calculus)s+='<path d="M62 132 Q58 146 70 150 L74 142 Z M138 132 Q142 146 130 150 L126 142 Z" fill="#c9b458" stroke="#9a8630"/>';
  // gengiva
  const gTop=o.gum==="recessao"?178:o.gum==="aumento"?110:o.bone==="perda"?150:132;
  const gCol=o.gum==="gengivite"?"#e05a5a":o.gum==="aumento"?"#e98585":"#f1a7a7";
  s+='<path d="M0 '+(gTop+16)+' Q30 '+(gTop+6)+' 58 '+gTop+' Q60 '+(gTop+10)+' 64 '+(gTop+22)+' L64 '+(boneTop+6)+' L0 '+(boneTop+6)+' Z" fill="'+gCol+'" stroke="#c06060" stroke-width="1"/>';
  s+='<path d="M200 '+(gTop+16)+' Q170 '+(gTop+6)+' 142 '+gTop+' Q140 '+(gTop+10)+' 136 '+(gTop+22)+' L136 '+(boneTop+6)+' L200 '+(boneTop+6)+' Z" fill="'+gCol+'" stroke="#c06060" stroke-width="1"/>';
  if(o.gum==="gengivite")s+='<path d="M54 '+(gTop+4)+' q4 8 10 10 M146 '+(gTop+4)+' q-4 8 -10 10" stroke="#b71c1c" stroke-width="3" fill="none"/>';
  if(o.pocket)s+='<path d="M64 '+(gTop+22)+' L72 '+(boneTop-4)+'" stroke="#1565c0" stroke-width="3" stroke-dasharray="4 3"/><text x="18" y="'+(gTop+60)+'" font-size="11" fill="#1565c0" font-weight="700">bolsa</text>';
  if(o.perico)s+='<path d="M56 60 Q100 20 144 60 Q140 80 100 76 Q62 80 56 60 Z" fill="#e05a5a" opacity=".85" stroke="#b71c1c"/><text x="100" y="18" font-size="11" text-anchor="middle" fill="#b71c1c" font-weight="700">capuz (opérculo) inflamado</text>';
  // legenda
  s+='</svg>';return s}
function figMucosa(l){let s='<svg viewBox="0 0 220 180" class="fig" role="img" aria-label="Ilustração de mucosa">';
  if(l==="dtm"){s+='<ellipse cx="110" cy="92" rx="70" ry="80" fill="#f6d5c3" stroke="#c49a84"/><path d="M60 120 Q110 170 160 120" fill="none" stroke="#c49a84" stroke-width="2"/><ellipse cx="62" cy="92" rx="14" ry="26" fill="#e57373" opacity=".7"/><ellipse cx="158" cy="92" rx="14" ry="26" fill="#e57373" opacity=".7"/><ellipse cx="70" cy="40" rx="18" ry="14" fill="#e57373" opacity=".5"/><ellipse cx="150" cy="40" rx="18" ry="14" fill="#e57373" opacity=".5"/><text x="110" y="176" font-size="10" text-anchor="middle" fill="#555">masseter e temporal dolorosos</text></svg>';return s}
  if(l==="herpes"||l==="queilite"){s+='<path d="M20 90 Q110 30 200 90 Q110 150 20 90 Z" fill="#e88a8a" stroke="#b55"/><path d="M28 90 Q110 80 192 90" stroke="#8a3030" stroke-width="2" fill="none"/>';
    if(l==="herpes")s+='<g fill="#fff6d6" stroke="#d4a017">'+[[70,62],[80,58],[76,68],[88,64],[84,72]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="5"/>').join("")+'</g><text x="110" y="170" font-size="10" text-anchor="middle" fill="#555">vesículas agrupadas no lábio</text>';
    else s+='<path d="M22 88 l10 -4 M22 92 l10 4 M198 88 l-10 -4 M198 92 l-10 4" stroke="#b71c1c" stroke-width="3"/><circle cx="24" cy="90" r="9" fill="#e53935" opacity=".35"/><circle cx="196" cy="90" r="9" fill="#e53935" opacity=".35"/><text x="110" y="170" font-size="10" text-anchor="middle" fill="#555">fissuras nas comissuras</text>';
    s+='</svg>';return s}
  // língua/mucosa
  s+='<rect x="0" y="0" width="220" height="180" rx="16" fill="#f3b0b0"/><path d="M60 10 Q110 0 160 10 Q190 90 160 165 Q110 185 60 165 Q30 90 60 10 Z" fill="#e88f8f" stroke="#c46a6a"/><path d="M110 20 L110 150" stroke="#c46a6a" stroke-width="1.5" opacity=".6"/>';
  if(l==="afta")s+='<ellipse cx="150" cy="95" rx="13" ry="10" fill="#f7e7a1" stroke="#e53935" stroke-width="4"/>';
  if(l==="candida")s+=[[80,50],[120,70],[95,110],[140,120],[70,130],[130,40]].map(([x,y])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+(8+(x%7))+'" ry="6" fill="#fffef6" stroke="#ddd"/>').join("");
  if(l==="leuco")s+='<path d="M158 60 Q176 80 170 112 Q160 118 152 104 Q148 80 158 60 Z" fill="#fbfbf3" stroke="#cfcfbf"/>';
  if(l==="liquen")s+='<g stroke="#fffdf2" stroke-width="2.4" fill="none">'+[0,1,2,3,4].map(i=>'<path d="M70 '+(40+i*22)+' q12 -8 24 0 t24 0 t24 0 t24 0"/>').join("")+'</g>';
  if(l==="cec")s+='<ellipse cx="160" cy="100" rx="18" ry="14" fill="#c62828" stroke="#f5f5f5" stroke-width="5"/><ellipse cx="160" cy="100" rx="9" ry="6" fill="#7f1d1d"/>';
  s+='<text x="110" y="176" font-size="10" text-anchor="middle" fill="#5a2a2a">'+({afta:"úlcera com halo eritematoso",candida:"placas brancas removíveis",leuco:"placa branca não removível (borda lateral)",liquen:"estrias brancas rendilhadas",cec:"úlcera endurecida de bordas elevadas"}[l]||"")+'</text></svg>';return s}
function fig(f){return f?(f.t==="mucosa"?figMucosa(f.l):figDente(f)):""}

/* ================= Diagnósticos ================= */
const DIAGS=(DATA.diag||[]).map(d=>{d._s=norm([d.n,d.g,d.sx,d.tst,d.dif].join(" "));return d});
function vDiags(){const g=[...new Set(DIAGS.map(d=>d.g))];const q=norm(S.dq||"");
  const L=DIAGS.filter(d=>(!S.dg||d.g===S.dg)&&(!q||d._s.includes(q)));
  return '<div class="stack"><div class="row between"><h1>Diagnósticos</h1><span class="muted sm">'+L.length+' itens</span></div>'+
  '<a class="item" href="#/diagnosticos/assistente" style="border-color:var(--accent)"><div class="row"><span style="font-size:22px">🧭</span><div><div class="t">Assistente de diagnóstico pulpar e periapical</div><div class="s">Responda aos testes clínicos e receba o diagnóstico (terminologia AAE)</div></div></div></a>'+
  '<div class="search">'+ic("search")+'<input class="inp" value="'+esc(S.dq||"")+'" placeholder="Buscar diagnóstico, sinal ou teste" oninput="S.dq=this.value;clearTimeout(window._dq);window._dq=setTimeout(()=>{rerender();const i=document.querySelector(\'#app .search input\');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)" /></div>'+
  '<div class="chips"><button class="chip '+(!S.dg?"on":"")+'" onclick="S.dg=\'\';rerender()">Todos</button>'+g.map(x=>'<button class="chip '+(S.dg===x?"on":"")+'" onclick="S.dg=\''+x+'\';rerender()">'+x+'</button>').join("")+'</div>'+
  '<div class="dgrid">'+L.map(d=>'<a class="item dcard" href="#/diagnosticos/'+d.id+'"><div class="dthumb">'+fig(d.fig)+'</div><div><div class="xs muted" style="font-weight:800">'+esc(d.g)+'</div><div class="t">'+esc(d.n)+'</div></div></a>').join("")+'</div></div>'+disclaimer()}
function vDiag(id){if(id==="assistente")return vWizard();const d=DIAGS.find(x=>x.id===id);if(!d)return'<div class="empty">Não encontrado.</div>';
  const far=(d.far||[]).map(n=>DRUGS.find(x=>x.n===n)).filter(Boolean);
  return '<div class="stack"><div class="card"><div class="xs muted" style="font-weight:800">'+esc(d.g.toUpperCase())+'</div><h1 style="margin-top:4px;font-size:21px">'+esc(d.n)+'</h1><div class="figbox">'+fig(d.fig)+'</div><p class="xs muted" style="text-align:center;margin:4px 0 0">Ilustração esquemática</p></div>'+
  '<div class="card kv">'+kv("Sinais e sintomas",d.sx)+kv("Testes e exames",d.tst)+kv("Diagnóstico diferencial",d.dif)+'</div>'+
  '<div class="card" style="border-color:var(--ok)"><div class="kv">'+kv("Conduta",d.cd)+'</div></div>'+
  (far.length?'<div class="card"><h3>Fármacos relacionados</h3><div class="list" style="margin-top:8px">'+far.map(drugItem).join("")+'</div></div>':"")+'</div>'+disclaimer()}
function vWizard(){const w=S.wz||(S.wz={dor:"",frio:"",perc:"",edema:"",fist:"",rx:"",trat:""});
  const opt=(k,l,ops)=>'<div class="field"><label>'+l+'</label><div class="row wrapf" style="gap:6px">'+ops.map(([v,t])=>'<button class="chip '+(w[k]===v?"on":"")+'" onclick="S.wz.'+k+'=\''+v+'\';rerender()">'+t+'</button>').join("")+'</div></div>';
  let pulp="—",api="—",pid="",aid="";
  if(w.trat==="s"){pulp="Dente previamente tratado";pid="previamente-tratado"}
  else if(w.frio==="normal"){pulp="Polpa normal";pid="pulpa-normal"}
  else if(w.frio==="curta"){pulp=w.dor==="s"?"Pulpite irreversível sintomática (dor espontânea sugere irreversibilidade)":"Pulpite reversível";pid=w.dor==="s"?"pulpite-irrev-sint":"pulpite-reversivel"}
  else if(w.frio==="longa"){pulp="Pulpite irreversível sintomática";pid="pulpite-irrev-sint"}
  else if(w.frio==="ausente"){pulp="Necrose pulpar";pid="necrose"}
  if(w.edema==="s"){api="Abscesso apical agudo";aid="abscesso-agudo"}
  else if(w.fist==="s"){api="Abscesso apical crônico";aid="abscesso-cronico"}
  else if(w.perc==="s"){api="Periodontite apical sintomática";aid="periodontite-apical-sint"}
  else if(w.rx==="lesao"){api="Periodontite apical assintomática";aid="periodontite-apical-ass"}
  else if(w.rx==="opaco"){api="Osteíte condensante";aid="osteite-condensante"}
  else if(w.perc==="n"&&(w.rx==="normal"||w.rx==="lp")){api="Tecidos apicais normais"+(w.rx==="lp"?" (espessamento do LP — reavaliar)":"")}
  const ready=w.frio||w.trat;
  return '<div class="stack"><h1>Assistente de diagnóstico</h1><p class="muted sm" style="margin:0">Pulpar e periapical — terminologia da Associação Americana de Endodontistas (AAE). Ferramenta de apoio: correlacione sempre com o exame clínico completo.</p>'+
  '<div class="card stack">'+opt("trat","O dente já tem tratamento endodôntico?",[["n","Não"],["s","Sim"]])+
  (w.trat!=="s"?opt("dor","Dor espontânea?",[["n","Não"],["s","Sim"]])+opt("frio","Teste ao frio",[["normal","Resposta normal (passa em 1–2 s)"],["curta","Dor exagerada que passa em < 10 s"],["longa","Dor que persiste > 10 s"],["ausente","Sem resposta"]]):"")+
  opt("perc","Dor à percussão/mastigação?",[["n","Não"],["s","Sim"]])+opt("edema","Edema/flutuação ou sinais sistêmicos?",[["n","Não"],["s","Sim"]])+opt("fist","Fístula?",[["n","Não"],["s","Sim"]])+
  opt("rx","Radiografia periapical",[["normal","Normal"],["lp","Espessamento do ligamento"],["lesao","Radiolucidez apical"],["opaco","Radiopacidade difusa"]])+'</div>'+
  (ready?'<div class="out"><div class="lbl">Diagnóstico pulpar</div><div class="big" style="font-size:20px">'+esc(pulp)+'</div><div class="lbl" style="margin-top:10px">Diagnóstico periapical</div><div class="big" style="font-size:20px">'+esc(api)+'</div>'+
   '<div class="row wrapf" style="gap:6px;margin-top:10px">'+(pid?'<a class="btn sm" href="#/diagnosticos/'+pid+'">Ver '+esc(pulp.split(" (")[0])+'</a>':"")+(aid?'<a class="btn sm" href="#/diagnosticos/'+aid+'">Ver '+esc(api)+'</a>':"")+'</div></div>':'<div class="empty">Responda ao teste ao frio (ou se o dente já é tratado) para ver o resultado.</div>')+
  '<button class="btn" onclick="S.wz=null;rerender()">Limpar respostas</button></div>'}

/* ================= Periograma ================= */
const PT_UP=[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],PT_LO=[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
function perioNew(){return{pac:"",data:new Date().toLocaleDateString("pt-BR"),idade:"",fumo:"0",dm:"0",osso:"",t:{}}}
function perioGet(){if(!S.perio)S.perio=store.get("perio",perioNew());return S.perio}
function perioSave(){store.set("perio",S.perio)}
function pT(n){const P=perioGet();if(!P.t[n])P.t[n]={ps:[0,0,0,0,0,0],mg:[0,0,0,0,0,0],bop:[0,0,0,0,0,0],pl:[0,0,0,0,0,0],mob:0,fur:0,aus:0};return P.t[n]}
function perioCalc(){const P=perioGet();let sites=0,bop=0,pl=0,ps4=0,ps6=0,calSum=0,teeth=0,interMax={};const toothCal=[];
  [...PT_UP,...PT_LO].forEach(n=>{const t=P.t[n];if(!t||t.aus)return;const filled=t.ps.some(x=>x>0);if(!filled)return;teeth++;let tmax=0;
    for(let i=0;i<6;i++){sites++;if(t.bop[i])bop++;if(t.pl[i])pl++;if(t.ps[i]>=4)ps4++;if(t.ps[i]>=6)ps6++;const cal=t.ps[i]+t.mg[i];calSum+=cal;
      if([0,2,3,5].includes(i))tmax=Math.max(tmax,cal);}
    toothCal.push({n,cal:tmax})});
  const ausentes=[...PT_UP,...PT_LO].filter(n=>P.t[n]&&P.t[n].aus).length;
  const maxCal=toothCal.reduce((a,b)=>Math.max(a,b.cal),0);const comCAL=toothCal.filter(t=>t.cal>=2).length;
  let est="—",ext="";
  if(teeth){if(maxCal<=0&&bop/sites>=0.1)est="Gengivite (sem perda de inserção)";else if(maxCal<=0)est="Saúde periodontal (ou gengivite localizada)";
    else if(maxCal<=2)est="Estágio I";else if(maxCal<=4)est="Estágio II";else est=(ausentes>=5?"Estágio IV":"Estágio III")+(ausentes>=5?" (≥ 5 dentes perdidos por periodontite?)":"");
    if(maxCal>0)ext=(comCAL/teeth<0.3?"localizada (< 30% dos dentes)":"generalizada (≥ 30% dos dentes)")}
  let grau="—";const idade=num(P.idade),osso=num(P.osso);
  if(idade>0&&osso>0){const r=osso/idade;grau=r<0.25?"Grau A (progressão lenta)":r<=1?"Grau B (moderada)":"Grau C (rápida)"}
  if(P.fumo==="2"||P.dm==="2")grau=(grau==="—"?"":grau+" → ")+"Grau C por modificador ("+[P.fumo==="2"?"fumo ≥ 10 cig/dia":"",P.dm==="2"?"HbA1c ≥ 7%":""].filter(Boolean).join(", ")+")";
  else if((P.fumo==="1"||P.dm==="1")&&!/C/.test(grau))grau=(grau==="—"?"":grau+" → ")+"pelo menos Grau B por modificador";
  return{sites,teeth,bopP:sites?bop/sites*100:0,plP:sites?pl/sites*100:0,ps4,ps6,calM:sites?calSum/sites:0,maxCal,est,ext,grau,ausentes}}
function perioChart(arr,face){// face: 0 = vestibular (sítios 0,1,2), 1 = lingual/palatina (3,4,5)
  const P=perioGet();const cw=40,top=24,sc=6,H=top+16*sc;let s='<svg viewBox="0 0 '+(arr.length*cw)+' '+(H+18)+'" class="pchart" preserveAspectRatio="none">';
  for(let mm=0;mm<=12;mm+=3)s+='<line x1="0" x2="'+(arr.length*cw)+'" y1="'+(top+mm*sc)+'" y2="'+(top+mm*sc)+'" stroke="var(--line)" stroke-width="'+(mm===0?1.6:0.6)+'"/>';
  const mgPts=[],psPts=[];
  arr.forEach((n,k)=>{const t=P.t[n];const x0=k*cw;s+='<text x="'+(x0+cw/2)+'" y="14" font-size="11" text-anchor="middle" fill="var(--muted)" font-weight="700">'+n+'</text>';
    if(t&&t.aus){s+='<line x1="'+(x0+6)+'" y1="'+top+'" x2="'+(x0+cw-6)+'" y2="'+(H-4)+'" stroke="var(--muted)" stroke-width="1.5"/><line x1="'+(x0+cw-6)+'" y1="'+top+'" x2="'+(x0+6)+'" y2="'+(H-4)+'" stroke="var(--muted)" stroke-width="1.5"/>';return}
    for(let j=0;j<3;j++){const i=face*3+j;const x=x0+8+j*12;const mg=t?t.mg[i]:0,ps=t?t.ps[i]:0;const yM=top+mg*sc,yP=top+(mg+ps)*sc;mgPts.push(x+","+yM);psPts.push(x+","+yP);
      if(ps>0)s+='<line x1="'+x+'" x2="'+x+'" y1="'+yM+'" y2="'+yP+'" stroke="'+(ps>=6?"#c62828":ps>=4?"#ef6c00":"#1e88e5")+'" stroke-width="5" stroke-linecap="round"/>';
      if(t&&t.bop[i])s+='<circle cx="'+x+'" cy="'+(H+8)+'" r="3.5" fill="#d32f2f"/>';if(t&&t.pl[i])s+='<circle cx="'+x+'" cy="'+(H+8)+'" r="3.5" fill="none" stroke="#7b5" stroke-width="1.6" transform="translate(0,0)"/>';}
    if(t&&t.mob)s+='<text x="'+(x0+cw/2)+'" y="'+(H-2)+'" font-size="9" text-anchor="middle" fill="var(--warn)">M'+t.mob+'</text>';if(t&&t.fur)s+='<text x="'+(x0+cw/2)+'" y="'+(top+10)+'" font-size="9" text-anchor="middle" fill="var(--warn)">F'+t.fur+'</text>'});
  s+='<polyline points="'+mgPts.join(" ")+'" fill="none" stroke="#e91e63" stroke-width="1.6"/><polyline points="'+psPts.join(" ")+'" fill="none" stroke="#1e88e5" stroke-width="1.2" stroke-dasharray="3 2"/></svg>';return s}
function vPerio(){const P=perioGet();const c=perioCalc();const sel=S.ptooth||16;const t=pT(sel);const up=PT_UP.includes(+sel);
  const sites=up?["DV","V","MV","DP","P","MP"]:["DV","V","MV","DL","L","ML"];
  const numIn=(arr,i,k)=>'<input class="inp pin" type="number" inputmode="numeric" min="-5" max="15" value="'+(t[arr][i]||"")+'" oninput="pT('+sel+').'+arr+'['+i+']=num(this.value);perioSave();perioRefresh()" aria-label="'+k+'" />';
  const tog=(arr,i,lbl,col)=>'<button class="chip '+(t[arr][i]?"on":"")+'" style="padding:4px 8px;'+(t[arr][i]?"background:"+col+";border-color:"+col:"")+'" onclick="pT('+sel+').'+arr+'['+i+']^=1;perioSave();rerender()">'+lbl+'</button>';
  const grid=arr=>'<div class="tsel">'+arr.map(n=>{const x=P.t[n];const st=x&&x.aus?"aus":x&&x.ps.some(v=>v>=4)?"bad":x&&x.ps.some(v=>v>0)?"ok":"";return '<button class="tb '+st+(n==sel?" on":"")+'" onclick="S.ptooth='+n+';rerender()">'+n+'</button>'}).join("")+'</div>';
  return '<div class="stack"><div class="row between"><h1>Periograma</h1><div class="row" style="gap:6px"><button class="btn sm" onclick="perioPrint()">'+ic("print",16)+' Imprimir</button><button class="btn sm" onclick="if(confirm(\'Iniciar novo periograma? O atual será apagado.\')){S.perio=perioNew();perioSave();rerender()}">Novo</button></div></div>'+
  '<div class="card"><div class="grid g2m">'+
  '<div class="field"><label>Paciente</label><input class="inp" value="'+esc(P.pac)+'" oninput="perioGet().pac=this.value;perioSave()" /></div>'+
  '<div class="field"><label>Data</label><input class="inp" value="'+esc(P.data)+'" oninput="perioGet().data=this.value;perioSave()" /></div>'+
  '<div class="field"><label>Idade</label><input class="inp" type="number" value="'+esc(P.idade)+'" oninput="perioGet().idade=this.value;perioSave();perioRefresh()" /></div>'+
  '<div class="field"><label>% perda óssea (Rx, dente mais afetado)</label><input class="inp" type="number" value="'+esc(P.osso)+'" oninput="perioGet().osso=this.value;perioSave();perioRefresh()" /></div>'+
  '<div class="field"><label>Tabagismo</label><select class="inp" onchange="perioGet().fumo=this.value;perioSave();perioRefresh()"><option value="0" '+(P.fumo==="0"?"selected":"")+'>Não fumante</option><option value="1" '+(P.fumo==="1"?"selected":"")+'>< 10 cigarros/dia</option><option value="2" '+(P.fumo==="2"?"selected":"")+'>≥ 10 cigarros/dia</option></select></div>'+
  '<div class="field"><label>Diabetes</label><select class="inp" onchange="perioGet().dm=this.value;perioSave();perioRefresh()"><option value="0" '+(P.dm==="0"?"selected":"")+'>Não</option><option value="1" '+(P.dm==="1"?"selected":"")+'>HbA1c < 7%</option><option value="2" '+(P.dm==="2"?"selected":"")+'>HbA1c ≥ 7%</option></select></div></div></div>'+
  '<div class="card"><h3>1. Escolha o dente</h3><p class="xs muted" style="margin:4px 0 8px">Verde: registrado · Laranja: bolsa ≥ 4 mm · Cinza: ausente</p>'+grid(PT_UP)+'<div style="height:6px"></div>'+grid(PT_LO)+'</div>'+
  '<div class="card"><div class="row between"><h3>2. Dente '+sel+'</h3><button class="chip '+(t.aus?"on":"")+'" onclick="pT('+sel+').aus^=1;perioSave();rerender()">Ausente</button></div>'+
  (t.aus?'<div class="empty">Dente marcado como ausente.</div>':
  '<div class="scroll-x"><table class="tbl ptbl"><thead><tr><th></th>'+sites.map(x=>'<th>'+x+'</th>').join("")+'</tr></thead><tbody>'+
  '<tr><td><b>PS</b><div class="xs muted">sondagem (mm)</div></td>'+sites.map((_,i)=>'<td>'+numIn("ps",i,"PS "+sites[i])+'</td>').join("")+'</tr>'+
  '<tr><td><b>MG</b><div class="xs muted">recessão + / aumento −</div></td>'+sites.map((_,i)=>'<td>'+numIn("mg",i,"MG "+sites[i])+'</td>').join("")+'</tr>'+
  '<tr><td><b>NIC</b><div class="xs muted">= PS + MG</div></td>'+sites.map((_,i)=>'<td class="n" id="nic'+i+'">'+((t.ps[i]||0)+(t.mg[i]||0))+'</td>').join("")+'</tr>'+
  '<tr><td><b>SS</b></td>'+sites.map((_,i)=>'<td>'+tog("bop",i,"●","#d32f2f")+'</td>').join("")+'</tr>'+
  '<tr><td><b>Placa</b></td>'+sites.map((_,i)=>'<td>'+tog("pl",i,"●","#689f38")+'</td>').join("")+'</tr></tbody></table></div>'+
  '<div class="grid g2m" style="margin-top:10px"><div class="field"><label>Mobilidade</label><select class="inp" onchange="pT('+sel+').mob=num(this.value);perioSave();perioRefresh()">'+[0,1,2,3].map(v=>'<option '+(t.mob==v?"selected":"")+'>'+v+'</option>').join("")+'</select></div><div class="field"><label>Furca</label><select class="inp" onchange="pT('+sel+').fur=num(this.value);perioSave();perioRefresh()">'+[0,1,2,3].map(v=>'<option '+(t.fur==v?"selected":"")+'>'+v+'</option>').join("")+'</select></div></div>'+
  '<div class="row" style="gap:6px;margin-top:10px"><button class="btn sm" onclick="perioNext(-1)">← Anterior</button><button class="btn sm pri" onclick="perioNext(1)">Próximo dente →</button></div>')+'</div>'+
  '<div class="card"><h3>3. Gráfico periodontal</h3><p class="xs muted" style="margin:4px 0 8px"><span style="color:#e91e63">━</span> margem gengival · barras = profundidade de sondagem (azul &lt; 4, laranja 4–5, vermelho ≥ 6 mm) · <span style="color:#d32f2f">●</span> sangramento · arraste o gráfico para o lado</p><div id="pcharts">'+perioCharts()+'</div></div>'+
  '<div class="out" id="psum">'+perioSum(c)+'</div></div>'+disclaimer()}
function perioCharts(){return '<div class="xs muted" style="font-weight:800">SUPERIOR — VESTIBULAR</div><div class="scroll-x">'+perioChart(PT_UP,0)+'</div><div class="xs muted" style="font-weight:800;margin-top:6px">SUPERIOR — PALATINA</div><div class="scroll-x">'+perioChart(PT_UP,1)+'</div><div class="xs muted" style="font-weight:800;margin-top:10px">INFERIOR — VESTIBULAR</div><div class="scroll-x">'+perioChart(PT_LO,0)+'</div><div class="xs muted" style="font-weight:800;margin-top:6px">INFERIOR — LINGUAL</div><div class="scroll-x">'+perioChart(PT_LO,1)+'</div>'}
function perioSum(c){return '<div class="lbl">Resumo</div><div class="big" style="font-size:20px">'+esc(c.est)+(c.ext?" · "+esc(c.ext):"")+'</div><div class="sm" style="margin-top:4px">'+esc(c.grau)+'</div>'+
  '<div class="res-grid" style="margin-top:10px"><div class="res"><b>'+fmt(c.bopP,0)+'%</b><span>sangramento à sondagem</span></div><div class="res"><b>'+fmt(c.plP,0)+'%</b><span>índice de placa</span></div><div class="res"><b>'+c.ps4+'</b><span>sítios PS ≥ 4 mm</span></div><div class="res"><b>'+c.ps6+'</b><span>sítios PS ≥ 6 mm</span></div><div class="res"><b>'+fmt(c.calM,1)+' mm</b><span>NIC médio</span></div><div class="res"><b>'+c.teeth+'</b><span>dentes avaliados ('+c.ausentes+' ausentes)</span></div></div>'+
  '<div class="xs muted" style="margin-top:8px">Estadiamento sugerido pelo maior NIC interproximal (AAP/EFP 2017): I = 1–2 mm, II = 3–4 mm, III/IV ≥ 5 mm (IV se ≥ 5 dentes perdidos por periodontite ou reabilitação complexa). Grau pela razão % perda óssea/idade e modificadores. Confirme com radiografias e o quadro clínico.</div>'}
function perioRefresh(){const c=perioCalc();const a=document.getElementById("psum");if(a)a.innerHTML=perioSum(c);const b=document.getElementById("pcharts");if(b)b.innerHTML=perioCharts();const t=pT(S.ptooth||16);for(let i=0;i<6;i++){const e=document.getElementById("nic"+i);if(e)e.textContent=(t.ps[i]||0)+(t.mg[i]||0)}}
function perioNext(d){const all=[...PT_UP,...PT_LO];let i=all.indexOf(+(S.ptooth||16))+d;if(i<0)i=all.length-1;if(i>=all.length)i=0;S.ptooth=all[i];rerender()}
function perioPrint(){const P=perioGet(),c=perioCalc(),D=S.doc;
  document.getElementById("printArea").innerHTML='<div class="rx-page" style="font-family:system-ui,sans-serif"><div class="rx-h"><b>Periograma — '+esc(D.clinica||"Clínica Odonto Pro")+'</b><br/>'+esc(D.nome?"CD "+D.nome:"")+(D.crmv?" — CRO "+esc(D.crmv):"")+'</div><p><b>Paciente:</b> '+esc(P.pac)+' &nbsp; <b>Data:</b> '+esc(P.data)+' &nbsp; <b>Idade:</b> '+esc(P.idade)+'</p>'+perioCharts().replace(/var\(--line\)/g,"#ccc").replace(/var\(--muted\)/g,"#555").replace(/var\(--warn\)/g,"#b45309")+'<div style="margin-top:12px">'+perioSum(c).replace(/class="lbl"/g,'style="font-weight:700"')+'</div></div>';
  if(window.AndroidPrint&&AndroidPrint.print){setTimeout(()=>{try{AndroidPrint.print("Periograma "+(P.pac||""))}catch(e){}},250);return}try{window.print()}catch(e){}}
