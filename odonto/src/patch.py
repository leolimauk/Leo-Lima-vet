#!/usr/bin/env python3
# Transforma o template do app veterinário no app odontológico (executar uma vez sobre a cópia de app.html)
import re, sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()

def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    assert n == cnt, f"[{n}x] {a[:80]}"
    s = s.replace(a, b)

def section(start_marker, end_marker, new):
    global s
    i = s.index(start_marker); j = s.index(end_marker, i)
    s = s[:i] + new + s[j:]

# ---------- identidade ----------
s = s.replace("Clínica Vet Pro", "Clínica Odonto Pro")
rep('content="Bulário veterinário, calculadoras clínicas, toxicologia, casos clínicos e receituário para médicos-veterinários."',
    'content="Bulário odontológico, anestésicos locais, calculadoras, urgências, odontograma, casos clínicos e receituário para cirurgiões-dentistas e estudantes."')
rep('<b>Clínica Vet <span>Pro</span></b><small id="topSub">Farmacologia &amp; Clínica Veterinária</small>',
    '<b>Clínica Odonto <span>Pro</span></b><small id="topSub">Farmacologia &amp; Clínica Odontológica</small>')
# cores: azul-celeste/índigo
s = s.replace("--royal:#0f766e;--royal-2:#14b8a6;--copper:#d97706;--copper-2:#14b8a6;", "--royal:#0369a1;--royal-2:#0ea5e9;--copper:#d97706;--copper-2:#0ea5e9;")
s = s.replace("--accent:#0f766e;--accent-soft:#e6f6f4;", "--accent:#0369a1;--accent-soft:#e0f2fe;")
s = s.replace("--accent:#2dd4bf;--accent-soft:#11302d;", "--accent:#38bdf8;--accent-soft:#0c2a3d;")

# ---------- base: perfis, classes ----------
section("const SP = [", "const SPM =", '''const SP = [
  {id:"ad",n:"Adulto",e:"🧑",w:70,k:10,ml:0,mlExp:1},
  {id:"ped",n:"Criança",e:"🧒",w:20,k:10,ml:0,mlExp:1},
  {id:"ges",n:"Gestante",e:"🤰",w:65,k:10,ml:0,mlExp:1},
  {id:"lac",n:"Lactante",e:"🤱",w:65,k:10,ml:0,mlExp:1},
  {id:"ido",n:"Idoso",e:"🧓",w:65,k:10,ml:0,mlExp:1},
  {id:"ren",n:"Doença renal",e:"🫘",w:70,k:10,ml:0,mlExp:1},
  {id:"hep",n:"Hepatopata",e:"🩺",w:70,k:10,ml:0,mlExp:1}
];
''')
section("const CLS = {", "const CTL = {", '''const CLS = {
  anest:{n:"Anestésicos locais",c:"c1"},analg:{n:"Analgésicos",c:"c5"},aine:{n:"Anti-inflamatórios (AINEs)",c:"c2"},cort:{n:"Corticoides",c:"c2"},
  atb:{n:"Antibióticos",c:"c4"},afung:{n:"Antifúngicos",c:"c4"},avir:{n:"Antivirais",c:"c4"},antis:{n:"Antissépticos e uso clínico",c:"c6"},
  hemo:{n:"Hemostáticos",c:"c3"},fluor:{n:"Flúor e dessensibilizantes",c:"c6"},seda:{n:"Ansiolíticos e sedação",c:"c5"},emerg:{n:"Emergências",c:"c3"},
  dtm:{n:"Dor orofacial e DTM",c:"c7"},sup:{n:"Suporte (antieméticos, IBP, antialérgicos)",c:"c8"},endo:{n:"Endodontia",c:"c1"},clar:{n:"Clareamento",c:"c7"},
  sist:{n:"Fármacos do paciente (sistêmicos)",c:"c8"}
};
''')
rep('C1:{s:"C1 · 2 vias",c:"t-c1",l:"Lista C1 — Receita de Controle Especial em 2 vias (1ª retida na farmácia). Validade 30 dias. Para produtos de uso veterinário, segue normas do MAPA."}',
    'C1:{s:"C1 · 2 vias",c:"t-c1",l:"Lista C1 — Receita de Controle Especial em 2 vias (1ª retida na farmácia). Validade 30 dias. O cirurgião-dentista prescreve para uso odontológico."}')
s = re.sub(r'CTL:\{s:"Controlado",c:"t-ctl",l:"[^"]*"\}', 'CTL:{s:"Controlado",c:"t-ctl",l:"Substância sujeita a controle especial (Portaria SVS/MS 344/98) — confirme a lista vigente; em geral Receita de Controle Especial em 2 vias."}', s)
s = re.sub(r'ATB:\{s:"Antimicrobiano",c:"t-atb",l:"[^"]*"\}', 'ATB:{s:"Antibiótico",c:"t-atb",l:"Antimicrobiano — receita em 2 vias com retenção da 1ª via na farmácia, validade 10 dias (RDC ANVISA 471/2021). Prescreva só quando houver infecção com sinais sistêmicos ou disseminação, sempre com remoção da causa."}', s)
rep('const EVL={B:"Bula/consenso veterinário",V:"Estudos/relatos veterinários",H:"Extrapolado de dados humanos"};',
    'const EVL={B:"Bula/diretriz",V:"Estudos clínicos",H:"Farmacologia/relatos"};')
s = re.sub(r'const GLBL=\{[^\n]*\};', 'const GLBL={VASO_EPI:"Anestésicos com epinefrina",AINE:"AINEs",CORT:"Corticoides",ANTICOAG:"Anticoagulantes/antiagregantes",BZD:"Benzodiazepínicos",OPIOIDE:"Opioides",SEROT:"Serotoninérgicos",TRICICL:"Tricíclicos",CYP3A_INIB:"Inibidores do CYP3A4",AZOL_SIST:"Azóis",MACRO:"Macrolídeos",QT:"Prolongadores de QT",METHB:"Indutores de meta-hemoglobina",SEDATIVO:"Sedativos",IMUNOSSUP:"Imunossupressores",DIABET:"Antidiabéticos"};', s)

# ---------- labInfo neutro ----------
s = re.sub(r'function labInfo\(d,sp\)\{[^\n]*\n', 'function labInfo(d,sp){return{on:true,tag:"",why:""}}\n', s)
rep("'<div class=\"note '+(labInfo(d,sp).on?'ok':'warn')+'\" style=\"margin-top:12px\">'+labInfo(d,sp).tag+'<div style=\"margin-top:6px\">'+esc(labInfo(d,sp).why)+'</div></div><div class=\"out\"",
    "'<div class=\"out\"")

# ---------- casos: grupo por perfil ----------
section("function spGroup(s){", "const CASES =", '''function spGroup(s){s=norm(s);if(/crian/.test(s))return"ped";if(/gestan/.test(s))return"ges";if(/idos/.test(s))return"ido";return"ad";}
''')

# ---------- estado ----------
rep('calcSp:store.get("calcSp","dog")', 'calcSp:store.get("calcSp","ped")')
rep('doc:store.get("doc",{nome:"",crmv:"",clinica:"",end:"",tel:""})', 'doc:store.get("doc",{nome:"",crmv:"",clinica:"",end:"",tel:""}),tooth:"",odSet:"perm"')

# ---------- router ----------
rep('const NAV=[["#/","Início","home"],["#/bulario","Bulário","pill"],["#/calc","Cálculos","calc"],["#/tox","Toxicologia","alert"],["#/casos","Casos","book"]];',
    'const NAV=[["#/","Início","home"],["#/bulario","Bulário","pill"],["#/calc","Cálculos","calc"],["#/tox","Urgências","alert"],["#/casos","Casos","book"]];')
rep('const SIDE=NAV.concat([["#/receita","Receituário","file"]', 'const SIDE=NAV.concat([["#/odontograma","Odontograma","tooth"],["#/receita","Receituário","file"]')
rep('let html="",sub="Farmacologia & Clínica Veterinária",isSub=false;', 'let html="",sub="Farmacologia & Clínica Odontológica",isSub=false;')
rep('sub="Bulário Veterinário"', 'sub="Bulário Odontológico"')
rep('case "tox":if(arg){html=vToxD(arg);isSub=true;sub="Toxicologia"}else{html=vTox();sub="Toxicologia & Interações"}break;',
    'case "tox":if(arg){html=vToxD(arg);isSub=true;sub="Urgências médicas"}else{html=vTox();sub="Urgências no Consultório"}break;\n    case "odontograma":html=vOdonto();sub="Odontograma";break;')

# ---------- componentes ----------
rep('title="Espécies com dose"', 'title="Perfis com posologia"')

# ---------- home ----------
section("function vHome(){", "function tile(", r'''function vHome(){
  const day=Math.floor(Date.now()/864e5);const cd=CASES[day%CASES.length];
  const fav=[...S.favs].map(id=>DM[id]).filter(Boolean).slice(0,6);
  const rec=S.recent.map(id=>DM[id]).filter(Boolean).slice(0,6);
  return '<section class="hero"><img src="'+LOGO+'" alt="" /><div style="flex:1;min-width:0;width:100%"><h1>Clínica Odonto Pro</h1><p>Bulário odontológico, anestésicos, urgências, odontograma e casos clínicos — funciona offline.</p>'+
  '<div class="search">'+ic("search")+'<input class="inp" placeholder="Buscar: articaína, amoxicilina, alveolite, anafilaxia..." onfocus="openSearch(this.value);this.blur()" readonly /></div></div></section>'+
  '<div class="stats"><div class="stat"><b>'+DRUGS.length+'</b><span>fármacos e produtos</span></div><div class="stat"><b>'+TOX.length+'</b><span>urgências médicas</span></div><div class="stat"><b>'+INTER.length+'</b><span>regras de interação</span></div><div class="stat"><b>'+CASES.length+'</b><span>casos clínicos</span></div></div>'+
  '<div class="sec-title"><h2>Ferramentas</h2></div><div class="tiles">'+
  tile("#/calc/anest","calc","c1","Anestésicos locais","Dose máxima em tubetes")+tile("#/odontograma","tooth","c6","Odontograma","Anatomia e anestesia por dente")+
  tile("#/calc/profi","shield","c4","Profilaxia antibiótica","Endocardite (AHA)")+tile("#/calc/emerg","heart","c3","Kit de emergência","Doses por peso")+
  tile("#/calc/dose","drop","c5","Doses pediátricas","mg/kg → mL e gotas")+tile("#/calc/inter","alert","c2","Interações","Varfarina, epinefrina, AINEs...")+
  tile("#/tox","alert","c3","Urgências","Síncope, anafilaxia, LAST")+tile("#/receita","file","c8","Receituário","Com CRO e 2 vias")+'</div>'+
  '<div class="sec-title"><h2>Bulário por perfil de paciente</h2></div><div class="sp-grid">'+SP.slice(0,5).map(s=>'<a class="sp-btn" href="#/bulario" onclick="setMedSp(\''+s.id+'\')"><em>'+s.e+'</em>'+s.n+'</a>').join("")+'</div>'+
  (fav.length?'<div class="sec-title"><h2>Favoritos</h2><a class="btn sm ghost" href="#/favoritos">Ver todos</a></div><div class="list">'+fav.map(drugItem).join("")+'</div>':"")+
  (rec.length?'<div class="sec-title"><h2>Vistos recentemente</h2></div><div class="list">'+rec.map(drugItem).join("")+'</div>':"")+
  '<div class="sec-title"><h2>Caso do dia</h2><a class="btn sm ghost" href="#/casos">Todos</a></div><a class="item" href="#/casos/'+cd.id+'"><div class="xs muted" style="font-weight:800">'+esc(cd.sp)+' · '+esc(cd.spec)+'</div><div class="t" style="margin-top:4px">'+esc(cd.title)+'</div><div class="sm muted" style="margin-top:6px">'+esc(cd.ctx.slice(0,170))+'…</div></a>'+
  disclaimer();
}
''')
s = re.sub(r"function disclaimer\(\)\{return '<p class=\"disc\">[^']*(?:\\'[^']*)*'\}",
    "function disclaimer(){return '<p class=\"disc\">Ferramenta de apoio à decisão clínica para cirurgiões-dentistas e estudantes. Conteúdo baseado em referências de terapêutica odontológica (ex.: Andrade — Terapêutica Medicamentosa em Odontologia; Malamed — Manual de Anestesia Local; diretrizes AHA/ADA) e pode variar entre fontes — confira a bula, a legislação vigente e o julgamento clínico. Não substitui avaliação profissional.</p>'}", s)

# ---------- bulário ----------
rep(">Todas espécies</button>", ">Todos os perfis</button>")
rep('<h2 style="margin-bottom:4px">Doses por espécie</h2>', '<h2 style="margin-bottom:4px">Posologia por perfil de paciente</h2>')
rep("'<div class=\"note info\">Uso tópico/inalatório ou dose conforme produto — veja as observações abaixo.</div>'", "'<div class=\"note info\">Uso conforme técnica/produto — veja as observações abaixo.</div>'")
s = s.replace("Dica: busque por princípio ativo, nome comercial (ex.: <b>Apoquel</b>, <b>Cerenia</b>), indicação (<b>esporotricose</b>), toxina (<b>chocolate</b>) ou caso (<b>piometra</b>).",
              "Dica: busque por princípio ativo, nome comercial (ex.: <b>Septanest</b>, <b>Clavulin</b>), indicação (<b>alveolite</b>), urgência (<b>anafilaxia</b>) ou caso (<b>terceiro molar</b>).")

# ---------- calculadoras ----------
rep('const TOOLS=[["dose","Doses","calc"],["inter","Interações","alert"],["cri","Infusão contínua","clock"],["fluido","Fluidoterapia","drop"],["rcp","RCP/Emergência","heart"],["transf","Transfusão","blood"],["energia","Energia/Dieta","flame"],["kcl","Potássio (KCl)","bolt"],["bic","Bicarbonato","flask"],["bsa","Superfície m²","ruler"],["conv","Diluições","swap"]];',
    'const TOOLS=[["anest","Anestésicos","calc"],["dose","Doses pediátricas","drop"],["profi","Profilaxia ATB","shield"],["emerg","Emergências","heart"],["inter","Interações","alert"],["cortic","Corticoides","flask"],["conv","Diluições","swap"]];')
rep('function vCalc(tool,arg){', 'function vCalc(tool,arg){if(tool==="dose"&&!arg)tool=tool;if(!CALC[tool])tool="anest";')
rep("return '<h2>Calculadora de doses</h2><p class=\"muted sm\" style=\"margin:4px 0 12px\">Escolha espécie, peso e fármaco.",
    "return '<h2>Doses por peso</h2><p class=\"muted sm\" style=\"margin:4px 0 12px\">Para crianças (e emergências). Escolha o perfil, o peso e o fármaco.")
rep("'<div class=\"grid g2m\"><div class=\"field\"><label>Espécie</label>'+spSelect(\"cSp\"", "'<div class=\"grid g2m\"><div class=\"field\"><label>Perfil</label>'+spSelect(\"cSp\"")
rep("'<div class=\"field\" style=\"margin-top:12px\"><label>Fármaco ('+list.length+' com dose para '+SPM[sp].n+')</label>",
    "'<div class=\"field\" style=\"margin-top:12px\"><label>Fármaco ('+list.length+' com dose por kg para '+SPM[sp].n+')</label>")
rep("':'<div class=\"empty\">Sem fármacos com dose calculável para esta espécie.</div>');",
    "':'<div class=\"empty\">Para adultos as doses são fixas (veja cada monografia). Selecione <b>Criança</b> para calcular por peso.</div>');")
rep("const CALC={\n", r'''const CALC={
anest(){calcRun=calcAnest;const w=S.calcW.ad!=null?S.calcW.ad:70;
  return '<h2>Dose máxima de anestésico local</h2><p class="muted sm" style="margin:4px 0 12px">Calcula o máximo seguro em mg e em tubetes de 1,8 mL pelo peso, considerando também o limite do vasoconstritor. Use sempre a MENOR dose eficaz, com aspiração.</p><div class="grid g2m">'+
  '<div class="field"><label>Anestésico</label><select class="inp" id="aA" onchange="calcRun()">'+AN.map((a,i)=>'<option value="'+i+'">'+a.n+'</option>').join("")+'</select></div>'+
  f("aW","Peso do paciente (kg)",w)+'<div class="field"><label>Condição cardiovascular</label><select class="inp" id="aC" onchange="calcRun()"><option value="0.2">Saudável (ASA I/II) — máx. 0,2 mg de epinefrina</option><option value="0.04">Cardiopata/hipertenso controlado/betabloqueador — máx. 0,04 mg</option></select></div>'+
  f("aU","Tubetes já utilizados nesta sessão",0)+'</div><div class="out" id="aOut" style="margin-top:14px"></div>'},
profi(){calcRun=calcProfi;
  return '<h2>Profilaxia antibiótica — endocardite infecciosa</h2><p class="muted sm" style="margin:4px 0 12px">Diretriz AHA 2021. Indicada apenas para condições cardíacas de ALTO risco + procedimentos que manipulam gengiva, região periapical ou perfuram mucosa. Dose única 30–60 min antes (até 2 h depois se esquecida).</p>'+
  '<div class="card" style="background:var(--surface-2)"><b>Alto risco:</b> prótese valvar (inclusive transcateter) ou material protético em reparo valvar; endocardite prévia; cardiopatia congênita cianótica não corrigida ou corrigida com defeito residual/material protético (primeiros 6 meses); transplante cardíaco com valvopatia.<br/><span class="muted sm">NÃO indicada: prolapso de valva mitral, sopro inocente, marca-passo, stent coronário, cirurgia de revascularização.</span></div>'+
  '<div class="grid g2m" style="margin-top:12px">'+f("pW","Peso (kg)",S.calcW.ped!=null?S.calcW.ped:20)+'<div class="field"><label>Situação</label><select class="inp" id="pS" onchange="calcRun()"><option value="vo">Via oral — sem alergia à penicilina</option><option value="al">Alérgico à penicilina — via oral</option><option value="al2">Alérgico com história de anafilaxia/angioedema/urticária</option><option value="iv">Não consegue tomar VO</option></select></div></div><div class="out" id="pOut" style="margin-top:14px"></div>'},
emerg(){calcRun=calcEmerg;
  return '<h2>Kit de emergência do consultório</h2><p class="muted sm" style="margin:4px 0 12px">Doses calculadas pelo peso. Em qualquer emergência grave: chamar SAMU (192), O2 e monitorar sinais vitais.</p><div class="grid g2m">'+f("eW","Peso (kg)",S.calcW.ad!=null?S.calcW.ad:70)+'</div><div class="scroll-x" style="margin-top:12px"><div id="eOut"></div></div>'},
cortic(){calcRun=calcCort;
  return '<h2>Equivalência de corticoides</h2><p class="muted sm" style="margin:4px 0 12px">Doses equipotentes em efeito glicocorticoide.</p><div class="grid g2m"><div class="field"><label>Corticoide de origem</label><select class="inp" id="kO" onchange="calcRun()">'+CO.map((c,i)=>'<option value="'+i+'" '+(i===4?"selected":"")+'>'+c[0]+'</option>').join("")+'</select></div>'+f("kD","Dose (mg)",8)+'</div><div id="kOut" style="margin-top:12px"></div>'},
''')
# funções novas de cálculo (antes de stepW)
rep("function stepW(dir){", r'''const AN=[{n:"Lidocaína 2% c/ epinefrina 1:100.000",mg:36,max:7,abs:500,epi:0.018},{n:"Lidocaína 2% c/ epinefrina 1:200.000",mg:36,max:7,abs:500,epi:0.009},{n:"Lidocaína 2% sem vasoconstritor",mg:36,max:4.4,abs:300,epi:0},
 {n:"Mepivacaína 3% sem vasoconstritor",mg:54,max:6.6,abs:400,epi:0},{n:"Mepivacaína 2% c/ epinefrina 1:100.000",mg:36,max:6.6,abs:400,epi:0.018},{n:"Articaína 4% c/ epinefrina 1:100.000",mg:72,max:7,abs:500,epi:0.018},
 {n:"Articaína 4% c/ epinefrina 1:200.000",mg:72,max:7,abs:500,epi:0.009},{n:"Prilocaína 3% c/ felipressina",mg:54,max:8,abs:600,epi:0},{n:"Bupivacaína 0,5% c/ epinefrina 1:200.000",mg:9,max:1.3,abs:90,epi:0.009}];
function calcAnest(){const a=AN[num(document.getElementById("aA").value)],w=gv("aW"),lim=num(document.getElementById("aC").value),used=gv("aU");const o=document.getElementById("aOut");if(!o)return;
  S.calcW.ad=w;store.set("calcW",S.calcW);
  const mg=Math.min(a.max*w,a.abs),tubAn=mg/a.mg,tubEpi=a.epi?lim/a.epi:Infinity,tub=Math.min(tubAn,tubEpi),rest=tub-used;
  const lim2=tubEpi<tubAn;
  o.innerHTML='<div class="lbl">Máximo nesta sessão</div><div class="big">'+fmt(Math.floor(tub*10)/10,1)+' tubetes</div><div class="sm muted">'+(lim2?"Limitado pelo vasoconstritor":"Limitado pelo anestésico")+'</div>'+
  '<div class="res-grid" style="margin-top:10px"><div class="res"><b>'+fmt(mg,0)+' mg</b><span>dose máxima ('+fmt(a.max)+' mg/kg; teto '+a.abs+' mg)</span></div><div class="res"><b>'+fmt(tubAn,1)+'</b><span>tubetes pelo anestésico ('+a.mg+' mg/tubete)</span></div>'+
  (a.epi?'<div class="res"><b>'+fmt(tubEpi,1)+'</b><span>tubetes pelo vasoconstritor ('+fmt(a.epi,3)+' mg/tubete; máx. '+lim+' mg)</span></div>':'<div class="res"><b>—</b><span>sem epinefrina</span></div>')+
  '<div class="res"><b style="color:'+(rest<0?"var(--bad)":"inherit")+'">'+fmt(Math.max(rest,0),1)+'</b><span>tubetes restantes ('+fmt(used)+' usados)</span></div></div>'+
  (rest<0?'<div class="note bad" style="margin-top:10px"><b>Dose máxima ULTRAPASSADA</b> — observe sinais de toxicidade (gosto metálico, zumbido, tremores, convulsão).</div>':"")+
  (/Prilocaína/.test(a.n)?'<div class="note warn" style="margin-top:10px">Evitar em gestantes (felipressina) e em risco de meta-hemoglobinemia.</div>':"")+(/Articaína/.test(a.n)&&w<20?'<div class="note warn" style="margin-top:10px">Articaína: uso a partir de 4 anos.</div>':"")+(/Bupivacaína/.test(a.n)&&w<40?'<div class="note bad" style="margin-top:10px">Bupivacaína não é recomendada em crianças.</div>':"")+
  '<div class="sm" style="margin-top:10px">Referência: Malamed. Doses máximas são limites, não alvos — idosos, hepatopatas e pacientes debilitados toleram menos.</div>';}
function calcProfi(){const w=gv("pW"),s=document.getElementById("pS").value,o=document.getElementById("pOut");const kid=w<40;
  const R={vo:[["Amoxicilina","2 g VO","50 mg/kg VO (máx. 2 g)",50]],al:[["Azitromicina","500 mg VO","15 mg/kg (máx. 500 mg)",15],["Claritromicina","500 mg VO","15 mg/kg (máx. 500 mg)",15],["Doxiciclina","100 mg VO","< 45 kg: 2,2 mg/kg (máx. 100 mg)",2.2],["Cefalexina (sem anafilaxia/angioedema/urticária)","2 g VO","50 mg/kg (máx. 2 g)",50]],
   al2:[["Azitromicina","500 mg VO","15 mg/kg (máx. 500 mg)",15],["Claritromicina","500 mg VO","15 mg/kg (máx. 500 mg)",15],["Doxiciclina","100 mg VO","< 45 kg: 2,2 mg/kg (máx. 100 mg)",2.2]],
   iv:[["Ampicilina","2 g IM/IV","50 mg/kg IM/IV",50],["Cefazolina ou ceftriaxona","1 g IM/IV","50 mg/kg IM/IV (máx. 1 g)",50]]}[s];
  const cap={Amoxicilina:2000,Azitromicina:500,Claritromicina:500,Doxiciclina:100,Ampicilina:2000};
  o.innerHTML='<div class="lbl">'+(kid?"Dose pediátrica (peso "+fmt(w)+" kg)":"Adulto")+'</div><table class="tbl" style="margin-top:6px"><thead><tr><th>Fármaco</th><th>Dose única</th></tr></thead><tbody>'+R.map(([n,ad,pd,k])=>{let d=ad;if(kid){const c=cap[n.split(" ")[0]]||(/Cef/.test(n)?(/cefazolina/i.test(n)?1000:2000):2000);d=fmt(Math.min(k*w,c),0)+' mg — '+pd}return '<tr><td><b>'+n+'</b></td><td class="n">'+d+'</td></tr>'}).join("")+'</tbody></table>'+
  '<div class="sm" style="margin-top:10px">Clindamicina NÃO é mais recomendada (AHA 2021). Paciente já em uso de antibiótico da mesma classe: escolher classe diferente. Prótese articular: profilaxia de rotina não recomendada (ADA/AAOS) — decidir com o ortopedista em imunossuprimidos.</div>';}
function calcEmerg(){const w=gv("eW"),o=document.getElementById("eOut");const kid=w<40;
  const L=[["Adrenalina 1 mg/mL (anafilaxia)","IM coxa",Math.min(0.01*w,kid?0.3:0.5),"mg",1,"repetir a cada 5–15 min"],["Glucagon (hipoglicemia, inconsciente)","IM",w<25?0.5:1,"mg",1,"pó 1 mg reconstituído"],["Glicose 50% (hipoglicemia, IV)","IV",kid?0.5*w:25,"g",0.5,"g → mL na concentração 0,5 g/mL"],
   ["Midazolam 5 mg/mL (convulsão > 5 min)","IM/IN",w>40?10:(w>=13?5:0.2*w),"mg",5,""],["Salbutamol 100 mcg/jato (asma)","inalatório",null,"",0,kid?"2–4 jatos com espaçador a cada 20 min":"4–8 jatos com espaçador a cada 20 min"],
   ["AAS (dor torácica)","mastigar",kid?null:"160–325","mg",0,kid?"não indicado":"sem alergia/sangramento"],["Isossorbida 5 mg SL (angina)","sublingual",kid?null:5,"mg",0,"se PAS > 90 e sem sildenafila; até 3 doses"],
   ["Difenidramina 50 mg/mL (alergia)","IM",Math.min(1*w,50),"mg",50,"após adrenalina se anafilaxia"],["Hidrocortisona (crise adrenal/anafilaxia)","IV/IM",kid?Math.min(2*w,100):100,"mg",50,"pó 100 mg/2 mL"],
   ["Flumazenil 0,1 mg/mL (excesso de BZD)","IV",kid?Math.min(0.01*w,0.2):0.2,"mg",0.1,"repetir a cada 1 min"],["Naloxona 0,4 mg/mL (opioides)","IV/IM",kid?Math.min(0.1*w,0.4):0.4,"mg",0.4,""],["Atropina 0,5 mg/mL (bradicardia)","IV/IM",kid?Math.max(0.1,Math.min(0.02*w,0.5)):0.5,"mg",0.5,""]];
  o.innerHTML='<table class="tbl"><thead><tr><th>Fármaco</th><th>Dose</th><th>Volume</th></tr></thead><tbody>'+L.map(([n,v,d,u,c,ob])=>{const dn=typeof d==="number";const vol=dn&&c?(u==="g"?d/c:d/c):null;
   return '<tr><td><b>'+n+'</b><div class="xs muted">'+v+(ob?" · "+ob:"")+'</div></td><td class="n">'+(d==null?"—":(dn?fmt(d):d)+" "+u)+'</td><td class="n">'+(vol!=null?fmt(vol)+" mL":"—")+'</td></tr>'}).join("")+'</tbody></table>'+
  '<div class="note warn" style="margin-top:10px">RCP: compressões 100–120/min, 5–6 cm (adulto), 30:2; DEA assim que disponível. O2 10–15 L/min por máscara.</div>';}
const CO=[["Hidrocortisona",20],["Prednisona/prednisolona",5],["Metilprednisolona",4],["Triancinolona",4],["Dexametasona",0.75],["Betametasona",0.75]];
function calcCort(){const i=num(document.getElementById("kO").value),d=gv("kD"),o=document.getElementById("kOut");const eq=d/CO[i][1];
  o.innerHTML='<table class="tbl"><thead><tr><th>Corticoide</th><th>Dose equivalente</th></tr></thead><tbody>'+CO.map(([n,x],j)=>'<tr'+(j===i?' style="background:var(--accent-soft)"':'')+'><td>'+n+'</td><td class="n">'+fmt(eq*x)+' mg</td></tr>').join("")+'</tbody></table><div class="sm muted" style="margin-top:8px">Equivalência glicocorticoide aproximada (dexametasona 0,75 mg ≈ prednisona 5 mg ≈ hidrocortisona 20 mg).</div>';}
function stepW(dir){''')

# ---------- urgências ----------
rep("'<div class=\"stack\"><div class=\"row between\"><h1>Toxicologia</h1>", "'<div class=\"stack\"><div class=\"row between\"><h1>Urgências médicas</h1>")
s = re.sub(r"'<div class=\"note bad\"><b>Emergência toxicológica\?</b>[^']*</div>'", "'<div class=\"note bad\"><b>Emergência grave?</b> Ligue <b>SAMU 192</b> (ou Bombeiros 193), ofereça O2 e monitore os sinais vitais. Tenha o kit de emergência e um DEA acessíveis.</div><a class=\"btn sm\" href=\"#/calc/emerg\">Doses do kit de emergência</a>'", s)
rep("(t.ant&&t.ant!==\"—\"&&!/^N[aã]o h[aá]/.test(t.ant)?'<span class=\"tag t-ok\">Antídoto</span>':\"\")", "''")
rep('kv("Dose tóxica / exposição",t.dose)+kv("Mecanismo",t.mech)+kv("Sinais clínicos",t.sx)', 'kv("Grupo de risco",t.sp)+kv("Fatores desencadeantes",t.dose)+kv("Fisiopatologia",t.mech)+kv("Como reconhecer",t.sx)')
rep('kv("Tratamento",t.tx)', 'kv("Conduta",t.tx)')
rep("'<div class=\"note ok\"><b>Antídoto:</b> '", "'<div class=\"note ok\"><b>Ponto-chave:</b> '")
rep('placeholder="Buscar por doença, espécie, especialidade"', 'placeholder="Buscar por doença, perfil, especialidade"')

# ---------- receituário ----------
rep("Cadastre seu nome e CRMV em", "Cadastre seu nome e CRO em")
s = s.replace('inp(P,"nome","Nome do animal")+\'<div class="field"><label>Espécie</label>', 'inp(P,"nome","Nome do paciente")+\'<div class="field"><label>Perfil</label>')
s = s.replace('inp(P,"raca","Raça")', 'inp(P,"raca","CPF")')
s = s.replace('\'<div class="card"><h3>Tutor</h3><div class="grid g2m" style="margin-top:10px">\'+inp(T,"nome","Nome completo")+inp(T,"cpf","CPF/RG")', '\'<div class="card"><h3>Endereço e responsável</h3><div class="grid g2m" style="margin-top:10px">\'+inp(T,"nome","Responsável (se menor)")+inp(T,"cpf","RG/convênio")')
s = s.replace('"\\nMV "+D.nome+(D.crmv?" — CRMV "+D.crmv:"")', '"\\nCD "+D.nome+(D.crmv?" — CRO "+D.crmv:"")')
s = s.replace('" | Espécie: "+(P.sp||"")+" | Raça: "+(P.raca||"")', '" | CPF: "+(P.raca||"")')
s = s.replace('L.push("Tutor: "+', 'L.push("Responsável: "+')
s = s.replace("esc(D.clinica||\"Receituário Veterinário\")", "esc(D.clinica||\"Receituário Odontológico\")")
s = s.replace("esc(D.nome?\"Médico(a)-Veterinário(a): \"+D.nome:\"\")+(D.crmv?\" — CRMV \"+esc(D.crmv):\"\")", "esc(D.nome?\"Cirurgião(ã)-Dentista: \"+D.nome:\"\")+(D.crmv?\" — CRO \"+esc(D.crmv):\"\")")
s = s.replace("' &nbsp; <b>Espécie:</b> '+esc(P.sp||\"\")+' &nbsp; <b>Raça:</b> '+esc(P.raca||\"\")", "' &nbsp; <b>CPF:</b> '+esc(P.raca||\"\")")
s = s.replace("<br/><b>Tutor:</b> '+esc(T.nome||\"\")", "<br/><b>Responsável:</b> '+esc(T.nome||\"\")")
s = s.replace("(D.crmv?\" — CRMV \"+esc(D.crmv):\"\")+(two?", "(D.crmv?\" — CRO \"+esc(D.crmv):\"\")+(two?")
s = s.replace('"Receita "+((P.nome||"").trim()||"veterinaria")', '"Receita "+((P.nome||"").trim()||"odontologica")')
s = s.replace("Inclua endereço completo do tut", "Inclua endereço completo do pacien")
s = s.replace("'</b></p>':\"\")+\n   '<p><b>Paciente:", "'</b></p>':\"\")+'<p style=\"font-size:12px\">USO ODONTOLÓGICO</p>'+\n   '<p><b>Paciente:")

# ---------- legislação ----------
i = s.index("function vReg(){"); j = s.index("/* ================= Ajustes", i)
s = s[:i] + r'''function vReg(){return '<div class="stack"><h1>Legislação & receituário</h1>'+
  '<div class="card"><h3>O que o cirurgião-dentista pode prescrever</h3><ul class="pts sm" style="margin-top:8px">'+
  '<li><b>Lei 5.081/1966 (art. 6º):</b> compete ao cirurgião-dentista prescrever e aplicar especialidades farmacêuticas de uso interno e externo indicadas em Odontologia.</li>'+
  '<li>Pode prescrever <b>controlados</b> (Portaria SVS/MS 344/98) e <b>antimicrobianos</b> — sempre para <b>uso odontológico</b>.</li>'+
  '<li>Prescrições fora da área odontológica (ex.: anti-hipertensivo, antidepressivo para depressão) não são de competência do dentista: encaminhe ao médico.</li>'+
  '<li>Sedação com óxido nitroso exige habilitação específica reconhecida pelo CFO; anestesia geral é ato médico (anestesiologista).</li></ul></div>'+
  '<div class="card scroll-x"><h3>Qual receita usar?</h3><table class="tbl" style="margin-top:8px"><thead><tr><th>Tipo</th><th>Exemplos odontológicos</th><th>Documento</th></tr></thead><tbody>'+
  '<tr><td>'+ctlTag("A1")+'</td><td>Morfina, oxicodona (raro)</td><td>Notificação de Receita A (amarela) — talonário da Vigilância Sanitária; validade 30 dias.</td></tr>'+
  '<tr><td>'+ctlTag("B1")+'</td><td>Midazolam, diazepam, lorazepam, alprazolam, clonazepam</td><td>Notificação de Receita B (azul) — numeração fornecida pela Vigilância Sanitária; validade 30 dias.</td></tr>'+
  '<tr><td>'+ctlTag("C1")+'</td><td>Carbamazepina, gabapentina, pregabalina, amitriptilina, nortriptilina</td><td>Receita de Controle Especial em 2 vias; validade 30 dias.</td></tr>'+
  '<tr><td>'+ctlTag("CTL")+'</td><td>Tramadol, codeína (associações)</td><td>Em geral Receita de Controle Especial em 2 vias — confirme a lista vigente.</td></tr>'+
  '<tr><td>'+ctlTag("ATB")+'</td><td>Amoxicilina, clindamicina, azitromicina, metronidazol</td><td>Receita em 2 vias com retenção, validade 10 dias (RDC 471/2021).</td></tr>'+
  '<tr><td><span class="tag t-ok">Simples</span></td><td>Analgésicos, AINEs, corticoides, antissépticos</td><td>Receita simples com nome, CRO, endereço, data e assinatura (Código de Ética Odontológica).</td></tr></tbody></table>'+
  '<div class="note warn" style="margin-top:10px">Listas e prazos mudam com atualizações da ANVISA. Confirme sempre a versão vigente da Portaria 344/98 e orientações do CRO do seu estado.</div></div>'+
  '<div class="card"><h3>Boas práticas de prescrição odontológica</h3><ul class="pts sm" style="margin-top:8px">'+
  '<li>Antibiótico só com sinais de infecção disseminada/sistêmica ou em profilaxia indicada — nunca substitui drenagem/remoção da causa (diretriz ADA 2019).</li>'+
  '<li>Registre no prontuário: anamnese, alergias, medicamentos em uso, dose anestésica utilizada (tubetes) e prescrições.</li>'+
  '<li>Pacientes especiais: consulte o médico assistente (anticoagulação, antirreabsortivos, quimioterapia, transplante).</li></ul></div></div>';}
''' + s[j:]

# ---------- ajustes ----------
s = s.replace('inp("crmv","CRMV (nº/UF)","12345/SP")', 'inp("crmv","CRO (nº/UF)","12345/SP")')
s = re.sub(r"'<div class=\"card\"><h3>Sobre</h3><p class=\"sm\" style=\"margin:6px 0 0\">Clínica Odonto Pro — [^\n]*", "'<div class=\"card\"><h3>Sobre</h3><p class=\"sm\" style=\"margin:6px 0 0\">Clínica Odonto Pro — '+DRUGS.length+' fármacos e produtos, '+TOX.length+' urgências, '+INTER.length+' interações e '+CASES.length+' casos clínicos. Funciona 100% offline.</p></div>'+disclaimer()+'</div>';}", s)

# ---------- odontograma ----------
rep("/* ================= Receituário ================= */", r'''/* ================= Odontograma ================= */
const TT={ // tipos de dente
 IC:{n:"Incisivo central",r:"1 raiz",ca:"1 canal",an:{s:"Infiltrativa (supraperiosteal) vestibular + nasopalatino para a palatina",i:"Infiltrativa vestibular (articaína é eficaz) ou bloqueio do nervo incisivo/mentual"}},
 IL:{n:"Incisivo lateral",r:"1 raiz",ca:"1 canal (inferior: 2 canais em ~20–40%)",an:{s:"Infiltrativa vestibular + nasopalatino/infiltração palatina",i:"Infiltrativa vestibular ou bloqueio incisivo"}},
 C:{n:"Canino",r:"1 raiz (a mais longa da arcada)",ca:"1 canal (inferior: 2 em ~5%)",an:{s:"Infiltrativa vestibular (alveolar superior anterior) + palatina",i:"Bloqueio incisivo/mentual ou alveolar inferior"}},
 PM1:{n:"1º pré-molar",r:"sup.: 2 raízes (V e P) · inf.: 1 raiz",ca:"sup.: 2 canais · inf.: 1 (2 em ~25%)",an:{s:"Infiltrativa vestibular (alveolar superior médio) + palatino maior/infiltração palatina",i:"Bloqueio do alveolar inferior ou mentual/incisivo"}},
 PM2:{n:"2º pré-molar",r:"1 raiz",ca:"sup.: 1–2 canais · inf.: 1 canal",an:{s:"Infiltrativa vestibular + palatino maior",i:"Bloqueio do alveolar inferior ou mentual/incisivo"}},
 M1:{n:"1º molar",r:"sup.: 3 raízes (MV, DV, P) · inf.: 2 raízes (M e D)",ca:"sup.: 3–4 canais (MV2 em ~60–90%) · inf.: 3 canais (4 em ~30%)",an:{s:"Alveolar superior posterior (ou infiltrativa) + palatino maior; raiz MV pode exigir infiltração adicional",i:"Bloqueio do alveolar inferior + bucal; complementar com infiltração vestibular de articaína 4%"}},
 M2:{n:"2º molar",r:"sup.: 3 raízes · inf.: 2 raízes (podem ser fusionadas)",ca:"sup.: 3–4 canais · inf.: 3 canais (C-shaped em asiáticos)",an:{s:"Alveolar superior posterior + palatino maior",i:"Bloqueio do alveolar inferior + bucal"}},
 M3:{n:"3º molar (siso)",r:"Variável, frequentemente fusionadas/dilaceradas",ca:"Variável",an:{s:"Alveolar superior posterior + palatino maior",i:"Bloqueio do alveolar inferior + lingual + bucal (Gow-Gates/Vazirani-Akinosi como alternativas)"}}
};
const ERUP={ // erupção dentes permanentes (anos) sup / inf
 1:["7–8","6–7"],2:["8–9","7–8"],3:["11–12","9–10"],4:["10–11","10–12"],5:["10–12","11–12"],6:["6–7","6–7"],7:["12–13","11–13"],8:["17–21","17–21"]};
const DTT={1:"Incisivo central decíduo",2:"Incisivo lateral decíduo",3:"Canino decíduo",4:"1º molar decíduo",5:"2º molar decíduo"};
const DERUP={1:["~10 meses","~8 meses"],2:["~11 meses","~13 meses"],3:["~19 meses","~20 meses"],4:["~16 meses","~16 meses"],5:["~29 meses","~27 meses"]};
function toothType(n){return ["","IC","IL","C","PM1","PM2","M1","M2","M3"][n]}
function toothSVG(num,sel,up){const d=num%10;const w=d>=6||(num>50&&d>=4)?34:d>=4?28:26;const crown=d>=6||(num>50&&d>=4)?'M2 14 Q2 2 10 3 Q'+(w/2)+' 6 '+(w-10)+' 3 Q'+(w-2)+' 2 '+(w-2)+' 14 Z':'M3 14 Q3 2 '+(w/2)+' 2 Q'+(w-3)+' 2 '+(w-3)+' 14 Z';
  const roots=(d>=6||(num>50&&d>=4))?'M5 14 L7 34 L11 34 L12 16 M'+(w-12)+' 16 L'+(w-11)+' 34 L'+(w-7)+' 34 L'+(w-5)+' 14':'M'+(w/2-4)+' 14 L'+(w/2-2)+' 36 L'+(w/2+2)+' 36 L'+(w/2+4)+' 14';
  return '<svg viewBox="0 0 '+w+' 40" width="'+w+'" height="40" style="transform:'+(up?"scaleY(-1)":"none")+'"><path d="'+roots+'" fill="'+(sel?"var(--accent-soft)":"var(--surface-2)")+'" stroke="var(--muted)" stroke-width="1.2"/><path d="'+crown+'" fill="'+(sel?"var(--accent)":"var(--surface)")+'" stroke="'+(sel?"var(--accent)":"var(--ink)")+'" stroke-width="1.4"/></svg>'}
function vOdonto(){const perm=S.odSet!=="dec";const Q=perm?[[18,17,16,15,14,13,12,11],[21,22,23,24,25,26,27,28],[48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38]]:[[55,54,53,52,51],[61,62,63,64,65],[85,84,83,82,81],[71,72,73,74,75]];
  const btn=n=>'<button onclick="S.tooth='+n+';rerender()" style="background:none;border:0;padding:2px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:var(--ink)" aria-label="Dente '+n+'">'+(String(n)[0]<"3"||String(n)[0]==="5"||String(n)[0]==="6"?'<span class="xs" style="font-weight:800">'+n+'</span>'+toothSVG(n,S.tooth==n,true):toothSVG(n,S.tooth==n,false)+'<span class="xs" style="font-weight:800">'+n+'</span>')+'</button>';
  const row=(a,b)=>'<div style="display:flex;justify-content:center;gap:2px"><div style="display:flex;gap:1px;padding-right:6px;border-right:2px solid var(--line-2)">'+a.map(btn).join("")+'</div><div style="display:flex;gap:1px;padding-left:6px">'+b.map(btn).join("")+'</div></div>';
  let info='<div class="empty">Toque em um dente para ver anatomia, erupção e técnica anestésica.</div>';const t=+S.tooth;
  if(t){const q=Math.floor(t/10),d=t%10,sup=[1,2,5,6].includes(q);
    if(q<=4){const T=TT[toothType(d)];info='<div class="card"><div class="xs muted" style="font-weight:800">DENTE '+t+' · '+(sup?"SUPERIOR":"INFERIOR")+' '+([1,4,5,8].includes(q)?"DIREITO":"ESQUERDO")+'</div><h2 style="margin-top:4px">'+T.n+(sup?" superior":" inferior")+'</h2><div class="kv" style="margin-top:10px">'+kv("Raízes",T.r)+kv("Canais (mais comum)",T.ca)+kv("Erupção",ERUP[d][sup?0:1]+" anos")+kv("Anestesia indicada",sup?T.an.s:T.an.i)+'</div></div>';}
    else{info='<div class="card"><div class="xs muted" style="font-weight:800">DENTE '+t+' · DECÍDUO '+(sup?"SUPERIOR":"INFERIOR")+'</div><h2 style="margin-top:4px">'+DTT[d]+'</h2><div class="kv" style="margin-top:10px">'+kv("Erupção (média)",DERUP[d][sup?0:1])+kv("Esfoliação",{1:"6–7 anos",2:"7–8 anos",3:"9–12 anos",4:"9–11 anos",5:"10–12 anos"}[d])+kv("Sucessor permanente",String((q===5?1:q===6?2:q===7?3:4))+d)+kv("Anestesia",sup?"Infiltrativa vestibular (osso fino); palatina com técnica indolor":"Infiltrativa costuma bastar em molares decíduos; bloqueio do alveolar inferior se necessário (forame mais baixo na criança)")+'</div><a class="btn sm" style="margin-top:10px" href="#/calc/anest">Calcular dose máxima pelo peso</a></div>';}}
  return '<div class="stack"><div class="row between"><h1>Odontograma</h1><div class="row" style="gap:6px"><button class="chip '+(perm?"on":"")+'" onclick="S.odSet=\'perm\';S.tooth=\'\';rerender()">Permanente</button><button class="chip '+(!perm?"on":"")+'" onclick="S.odSet=\'dec\';S.tooth=\'\';rerender()">Decíduo</button></div></div>'+
  '<div class="card scroll-x" style="padding:12px 4px"><div style="min-width:'+(perm?"560":"360")+'px" class="stack">'+row(Q[0],Q[1])+'<div style="height:2px;background:var(--line-2);margin:4px 8px"></div>'+row(Q[2],Q[3])+'</div></div><p class="xs muted" style="text-align:center;margin:0">Notação FDI · arraste para os lados no celular</p>'+info+'</div>';}

/* ================= Receituário ================= */''')

open(p, "w", encoding="utf-8").write(s)
print("patch ok")
