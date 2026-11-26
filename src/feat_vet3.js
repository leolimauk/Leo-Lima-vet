/* ================= Modo Plantão, protocolos, procedimentos, internação, valores fisiológicos ================= */
function pw(){if(S.pw==null)S.pw=store.get("pw","");return num(S.pw)}
function pwSp(){if(!S.psp)S.psp=store.get("psp","dog");return S.psp}
function pwBar(){return '<div class="card grid g2m" style="position:sticky;top:60px;z-index:5"><div class="field"><label>Peso (kg)</label><input class="inp" type="number" inputmode="decimal" step="any" value="'+esc(S.pw==null?store.get("pw",""):S.pw)+'" onchange="S.pw=this.value;store.set(\'pw\',this.value);rerender()" placeholder="Digite o peso" /></div>'+selF("pwS","Espécie",[["dog","Cão"],["cat","Gato"]],pwSp(),"S.psp=this.value;store.set('psp',this.value);rerender()")+'</div>'}
// dose por peso: a = "x" ou "x-y" (por kg), conc (mg/mL ou U/mL; 0 = sem volume), u = unidade
function dz(a,conc,u){const w=pw();const [lo,hi]=String(a).split("-").map(Number);const r=hi||lo;const U=u||"mg";
 const base=(hi?fmt(lo)+"–"+fmt(hi):fmt(lo))+" "+U+"/kg";if(!w)return base;
 if(U==="mL")return base+" = <b>"+(hi?fmt(lo*w)+"–"+fmt(hi*w):fmt(lo*w))+" mL</b>";
 const t=(hi?fmt(lo*w)+"–"+fmt(hi*w):fmt(lo*w))+" "+U;const v=conc?" = <b>"+(hi?fmt(lo*w/conc)+"–"+fmt(hi*w/conc):fmt(lo*w/conc))+" mL</b>":"";return base+" → <b>"+t+"</b>"+v}
function dzText(s){return esc(s).replace(/\[\[([\d.\-]+)\|([\d.]+)\|([^\]]*)\]\]/g,(m,a,c,u)=>'<span class="dz">'+dz(a,+c,u)+'</span>')}

/* ---------- Modo Plantão ---------- */
// [grupo, nome, dose/kg ("x" ou "x-y"), conc (0 = só massa), unidade, via/observação, gato: null=igual | string=dose diferente | false=evitar]
const PLT=[
["RCP","Adrenalina — baixa dose","0.01",1,"mg","IV/IO a cada 3–5 min (ciclos alternados). Intratraqueal: dobrar/decuplicar e diluir.",null],
["RCP","Adrenalina — alta dose (RCP prolongada > 10 min)","0.1",1,"mg","IV/IO — considerar após RCP prolongada.",null],
["RCP","Vasopressina","0.8",20,"U","IV/IO — pode substituir/alternar com a adrenalina (20 U/mL).",null],
["RCP","Atropina","0.04",0.5,"mg","IV/IO — assistolia/AESP com tônus vagal ou bradicardia. Confira a ampola (0,25 ou 0,5 mg/mL).",null],
["RCP","Amiodarona","5",50,"mg","IV lento — FV/TV sem pulso refratária ao choque.",null],
["RCP","Lidocaína 2%","2",20,"mg","IV — FV refratária (alternativa à amiodarona).",false],
["RCP","Desfibrilação — monofásico","4-6",0,"J","Choque externo único, seguido de 2 min de compressões.",null],
["RCP","Desfibrilação — bifásico","2-4",0,"J","Choque externo único, seguido de 2 min de compressões.",null],
["Reversores","Naloxona","0.04",0.4,"mg","IV/IM/IO — reversão de opioides (efeito curto; repetir).",null],
["Reversores","Flumazenil","0.01",0.1,"mg","IV — reversão de benzodiazepínicos.",null],
["Convulsão","Diazepam","0.5",5,"mg","IV (retal: 1 mg/kg). Repetir até 2–3 vezes.",null],
["Convulsão","Midazolam","0.2-0.3",5,"mg","IV/IM/intranasal.",null],
["Convulsão","Levetiracetam","60",100,"mg","IV em 5 min (ampola humana 100 mg/mL).",null],
["Convulsão","Fenobarbital (ataque)","4",0,"mg","IV/IM a cada 20–30 min até 16–20 mg/kg/24 h. Confira a concentração da ampola.",null],
["Convulsão","Manitol 20%","500-1000",200,"mg","IV em 15–20 min (edema cerebral/TCE).",null],
["Anafilaxia","Adrenalina IM","0.01",1,"mg","IM (máx. 0,5 mg); repetir a cada 5–15 min.",null],
["Anafilaxia","Difenidramina","1-2",50,"mg","IM (nunca IV rápido).",null],
["Anafilaxia","Dexametasona","0.1-0.2",2,"mg","IV — efeito tardio; não substitui a adrenalina. Confira 2 ou 4 mg/mL.",null],
["Metabólico","Glicose 50% (diluir 1:2–1:4)","250-500",500,"mg","IV — hipoglicemia.",null],
["Metabólico","Gluconato de cálcio 10%","50-150",100,"mg","IV lento em 10–20 min com ECG — hipocalcemia/hipercalemia.",null],
["Metabólico","Insulina regular (hipercalemia)","0.25-0.5",100,"U","IV + glicose 2 g por unidade de insulina, depois glicose 2,5% no fluido.",null],
["Metabólico","Bicarbonato de sódio 8,4%","1",1,"mEq","IV lento — RCP > 10–15 min ou hipercalemia grave.",null],
["Cardiorrespiratório","Furosemida","2-4",10,"mg","IV/IM — edema pulmonar; repetir em 1–2 h.","1-2"],
["Cardiorrespiratório","Butorfanol","0.2-0.4",10,"mg","IV/IM — sedação em dispneia.",null],
["Cardiorrespiratório","Terbutalina","0.01",0.5,"mg","SC/IM/IV — broncoespasmo (asma felina).",null],
["Analgesia","Metadona","0.2-0.3",10,"mg","IV/IM.",null],
["Analgesia","Fentanil (bolus)","0.002-0.005",0.05,"mg","IV (2–5 mcg/kg).",null],
["Analgesia","Dexmedetomidina","0.001-0.005",0.5,"mg","IV/IM (1–5 mcg/kg) — evitar em instabilidade cardiovascular.",null],
["Antiemético","Maropitant","1",10,"mg","SC/IV lento q24h.",null],
["Antiemético","Ondansetrona","0.5-1",2,"mg","IV lento q8–12h.",null]];
function vPlantao(){const w=pw(),sp=pwSp();const R=S.rcp||(S.rcp=store.get("rcp",{t0:0,log:[]}));
 const grp=[...new Set(PLT.map(x=>x[0]))];
 const fl=w?'<div class="card"><h3>Fluidos e valores</h3><div class="res-grid" style="margin-top:8px"><div class="res"><b>'+(sp==="cat"?fmt(5*w,0)+"–"+fmt(10*w,0):fmt(15*w,0)+"–"+fmt(20*w,0))+' mL</b><span>bolus de choque ('+(sp==="cat"?"5–10":"15–20")+' mL/kg em 15 min) — reavaliar</span></div><div class="res"><b>'+fmt((sp==="cat"?80:132)*Math.pow(w,0.75)/24,1)+' mL/h</b><span>manutenção (AAHA)</span></div><div class="res"><b>'+fmt(w*(sp==="cat"?60:85),0)+' mL</b><span>volemia estimada</span></div><div class="res"><b>'+fmt(w*(sp==="cat"?1:1),1)+'–'+fmt(w*2,1)+' mL/h</b><span>débito urinário normal</span></div></div><div class="sm muted" style="margin-top:8px">Sonda endotraqueal: '+(sp==="cat"?"3,0–4,5":w<5?"4,0–5,5":w<10?"5,5–7,0":w<20?"7,0–9,0":w<30?"9,0–11":"11–14")+' mm (aproximado — tenha 3 tamanhos).</div></div>':"";
 return '<div class="stack"><h1>Modo Plantão</h1><p class="muted sm" style="margin:0">Digite o peso uma vez: doses e volumes de emergência já calculados. Confira sempre a concentração do frasco disponível.</p>'+pwBar()+
 '<div class="card" id="rcpBox"><div class="row between"><h3>Cronômetro de RCP</h3>'+(R.t0?'<span class="tag t-bad">EM CURSO</span>':'')+'</div><div class="row" style="gap:14px;align-items:baseline;margin-top:6px"><div class="big" id="rcpClock" style="font-variant-numeric:tabular-nums">'+(R.t0?"--:--":"00:00")+'</div><div class="sm" id="rcpCyc">'+(R.t0?"":"Compressões 100–120/min · 1/3–1/2 do tórax · ventilação 10/min · troca de compressor a cada 2 min")+'</div></div>'+
 '<div class="actions" style="margin-top:8px">'+(R.t0?'<button class="btn" onclick="rcpEv(\'Adrenalina\')">💉 Adrenalina</button><button class="btn" onclick="rcpEv(\'Vasopressina\')">Vasopressina</button><button class="btn" onclick="rcpEv(\'Atropina\')">Atropina</button><button class="btn" onclick="rcpEv(\'Choque (desfibrilação)\')">⚡ Choque</button><button class="btn" onclick="rcpEv(\'Intubação/ventilação\')">Intubação</button><button class="btn" onclick="rcpEv(\'Ritmo: FV/TV sem pulso\')">FV/TV</button><button class="btn" onclick="rcpEv(\'Ritmo: assistolia/AESP\')">Assistolia/AESP</button><button class="btn pri" onclick="rcpEv(\'RETORNO DA CIRCULAÇÃO (ROSC)\');rcpStop()">ROSC</button><button class="btn" onclick="if(confirm(\'Encerrar a RCP?\')){rcpEv(\'RCP encerrada\');rcpStop()}">Encerrar</button>':'<button class="btn pri" onclick="rcpStart()">▶ Iniciar RCP</button>')+'</div>'+
 (R.log.length?'<div class="lbl" style="margin-top:10px">Registro</div><div class="sm" style="margin-top:4px">'+R.log.map(l=>'<div><b>'+mmss(l.d)+'</b> — '+esc(l.e)+'</div>').join("")+'</div><div class="actions" style="margin-top:8px"><button class="btn sm" onclick="copy(rcpText())">'+ic("copy",16)+' Copiar registro</button><button class="btn sm" onclick="if(confirm(\'Apagar o registro?\')){S.rcp={t0:0,log:[]};store.set(\'rcp\',S.rcp);rerender()}">Limpar</button></div>':"")+'</div>'+
 fl+grp.map(g=>'<div class="card"><h3>'+g+'</h3><div class="list" style="margin-top:8px">'+PLT.filter(x=>x[0]===g).map(x=>{const cat=sp==="cat";if(cat&&x[6]===false)return '<div class="item"><div class="t">'+esc(x[1])+'</div><div class="s" style="color:var(--bad)">Evitar/usar com extrema cautela em gatos.</div></div>';const d=cat&&typeof x[6]==="string"?x[6]:x[2];return '<div class="item"><div class="t">'+esc(x[1])+'</div><div class="sm" style="margin-top:2px">'+dz(d,x[3],x[4])+'</div><div class="s">'+esc(x[5])+'</div></div>'}).join("")+'</div></div>').join("")+
 '<div class="actions"><a class="btn" href="#/protocolos">Protocolos de emergência</a><a class="btn" href="#/calc/cri">Infusões contínuas</a><a class="btn" href="#/emergencia">Triagem</a></div></div>'+disclaimer()+(AFTER.push(rcpTick),"")}
function mmss(ms){const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function rcpStart(){S.rcp={t0:Date.now(),log:[{d:0,e:"Início da RCP"}],lc:1};store.set("rcp",S.rcp);beep();rerender()}
function rcpStop(){S.rcp.t0=0;store.set("rcp",S.rcp);rerender()}
function rcpEv(e){const R=S.rcp;R.log.push({d:R.t0?Date.now()-R.t0:(R.log.length?R.log[R.log.length-1].d:0),e});store.set("rcp",R);toast(e+" registrado");rerender()}
function rcpText(){return "REGISTRO DE RCP — "+new Date().toLocaleString("pt-BR")+"\nPaciente: "+(pw()?pw()+" kg":"")+"\n"+S.rcp.log.map(l=>mmss(l.d)+" — "+l.e).join("\n")}
function beep(){try{const C=window.AudioContext||window.webkitAudioContext;const a=beep.c||(beep.c=new C());const o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.connect(g);g.connect(a.destination);g.gain.value=0.2;o.start();o.stop(a.currentTime+0.35)}catch(e){}try{navigator.vibrate&&navigator.vibrate([300,100,300])}catch(e){}}
function rcpTick(){const R=S.rcp;const c=document.getElementById("rcpClock");if(!c||!R||!R.t0)return;const el=Date.now()-R.t0,cyc=Math.floor(el/120000)+1,rest=120000-el%120000;
 c.textContent=mmss(el);const lastAdr=[...R.log].reverse().find(l=>/Adrenalina/.test(l.e));const sinceAdr=lastAdr?el-lastAdr.d:null;
 document.getElementById("rcpCyc").innerHTML='Ciclo <b>'+cyc+'</b> · próxima checagem de ritmo em <b>'+mmss(rest)+'</b><br/>'+(sinceAdr==null?'<span style="color:var(--bad)">Adrenalina ainda não registrada</span>':'Última adrenalina há <b>'+mmss(sinceAdr)+'</b>'+(sinceAdr>=180000?' — <span style="color:var(--bad)"><b>DOSE INDICADA</b></span>':""));
 if(cyc>(R.lc||1)){R.lc=cyc;store.set("rcp",R);beep();toast("Ciclo "+cyc+": trocar compressor e checar ritmo (< 10 s)")}}
setInterval(()=>{try{rcpTick()}catch(e){}},1000);

/* ---------- Protocolos de emergência ---------- */
// Tokens [[dose/kg|conc|unid]] são convertidos pelo peso do Modo Plantão.
const PROT=[
{id:"dvg",n:"Dilatação-vólvulo gástrico (DVG)",sp:"Cão",s:"Raça grande/gigante de tórax profundo; distensão abdominal timpânica, ânsia de vômito improdutiva, sialorreia, inquietação, sinais de choque.",p:[
 "Dois acessos venosos calibrosos em membros torácicos. Bolus de cristaloide [[15-20|0|mL]] em 15 min, repetindo conforme perfusão — ou salina hipertônica 7,5% [[4-5|0|mL]] em 5–10 min.",
 "Analgesia: metadona [[0.2-0.3|10|mg]] IV (ou fentanil). Oxigênio.",
 "Exames: lactato (> 6 mmol/L ou que não cai > 50% após fluidos sugere necrose gástrica), Ht/PT, eletrólitos, gasometria, ECG contínuo.",
 "Radiografia em decúbito lateral DIREITO: compartimentalização ('braço de Popeye'/duplo-bolha) confirma vólvulo.",
 "Descompressão: trocarização com cateter 14–18G no ponto de maior timpanismo (percutir; evitar baço) e/ou sonda orogástrica medida do focinho à última costela — nunca forçar.",
 "Cirurgia assim que estabilizado: reposicionamento, avaliação de estômago e baço (gastrectomia parcial/esplenectomia se necrose) e GASTROPEXIA incisional direita.",
 "Arritmias ventriculares (12–36 h pós): lidocaína [[2|20|mg]] IV em bolus e CRI 50–75 mcg/kg/min se FC > 160 sustentada, TV multiforme ou fenômeno R-sobre-T. Corrigir K e Mg."],
 a:"Sem gastropexia, a recidiva passa de 70%. Gastropexia preventiva em raças de risco."},
{id:"obstr",n:"Obstrução uretral felina",sp:"Gato",s:"Macho, tentativas improdutivas de urinar, vocalização, lambedura do pênis, bexiga grande e firme. Bradicardia + hipotermia = hipercalemia grave.",p:[
 "Potássio e ECG IMEDIATOS (bradicardia, T apiculada, ausência de P, QRS largo).",
 "K ≥ 7 mEq/L ou ECG alterado: gluconato de cálcio 10% [[50-150|100|mg]] IV lento em 10 min (cardioproteção por 20–30 min); insulina regular [[0.25-0.5|100|U]] IV + glicose 2 g/U e glicose 2,5% no fluido; ou apenas glicose 50% [[250-500|500|mg]] diluída.",
 "Fluidoterapia: Ringer lactato ou Plasma-Lyte (seguros, não pioram a hipercalemia) [[5-10|0|mL]] em bolus conforme perfusão; cautela em cardiopatas.",
 "Analgesia/sedação: metadona [[0.2-0.3|10|mg]] + midazolam [[0.2|5|mg]] ± cetamina/propofol. Bloqueio sacrococcígeo com lidocaína [[0.1-0.2|20|mg]] reduz a anestesia necessária.",
 "Cistocentese descompressiva (agulha 22G + torneira de 3 vias) facilita a desobstrução e fornece urina para exame.",
 "Desobstrução: tracionar o prepúcio caudodorsalmente (retifica a uretra); cateter 3–3,5 Fr lubrificado; retro-hidropropulsão com salina estéril; nunca forçar.",
 "Sonda de demora em sistema coletor FECHADO e estéril por 24–48 h. Medir débito urinário (diurese pós-obstrutiva pode ultrapassar 5–10 mL/kg/h — repor), K e creatinina a cada 6–12 h.",
 "Alta: analgesia, dieta úmida/urinária, aumento da ingestão de água, enriquecimento ambiental (cistite idiopática é a principal causa)."],
 a:"Recidiva é comum nas primeiras 24–72 h após retirar a sonda. Uretrostomia perineal em recidivas."},
{id:"status",n:"Convulsão / status epilepticus",sp:"Cão e gato",s:"Status: crise ≥ 5 min ou ≥ 2 crises sem recuperação da consciência entre elas.",p:[
 "Via aérea, oxigênio, acesso venoso. Glicemia e cálcio IMEDIATOS (hipoglicemia → glicose 50% [[250-500|500|mg]] diluída; hipocalcemia → gluconato de cálcio).",
 "1ª linha: diazepam [[0.5|5|mg]] IV (retal [[1|5|mg]]) ou midazolam [[0.2-0.3|5|mg]] IV/IM/intranasal. Repetir até 2–3 vezes.",
 "Persistindo: levetiracetam [[60|100|mg]] IV em 5 min e/ou fenobarbital [[4|0|mg]] IV a cada 20–30 min até 16–20 mg/kg (ataque).",
 "Refratário: CRI de midazolam 0,2–0,5 mg/kg/h, ou propofol [[1-2|10|mg]] IV seguido de CRI 0,1–0,6 mg/kg/min (intubar), ou cetamina CRI.",
 "Hipertermia: resfriar até 39,5 °C. Edema cerebral/TCE: manitol [[500-1000|200|mg]] IV em 15–20 min; cabeça elevada 15–30°.",
 "Investigar causa: intoxicações (organofosforados, metaldeído, permetrina em gatos, xilitol, metilxantinas), metabólicas (glicose, Ca, Na, encefalopatia hepática), TCE, neoplasia, epilepsia idiopática (cães 6 meses–6 anos)."],
 a:"Cada crise prolongada aumenta lesão neuronal e hipertermia — tratar rápido. Gatos: fenobarbital é a manutenção de escolha."},
{id:"edema",n:"Edema pulmonar cardiogênico (ICC aguda)",sp:"Cão e gato",s:"Taquipneia/dispneia, FR em repouso > 40, crepitações, tosse (cães), histórico de sopro (cão com DMVM) ou CMH (gato, muitas vezes sem sopro).",p:[
 "Oxigênio (caixa, máscara, cateter nasal) com MANIPULAÇÃO MÍNIMA. Radiografia só após estabilizar.",
 "Furosemida [[2-4|10|mg]] IV/IM (gatos [[1-2|10|mg]]), repetindo a cada 1–2 h até a FR cair; casos graves: CRI 0,66–1 mg/kg/h.",
 "Sedação ansiolítica: butorfanol [[0.2-0.4|10|mg]] IV/IM.",
 "Pimobendan 0,25–0,3 mg/kg VO (cães; gatos com disfunção sistólica).",
 "Baixo débito/hipotensão: dobutamina 2–10 mcg/kg/min. Efusão pleural (gatos): toracocentese.",
 "Monitorar FR, SpO₂, PA, ureia/creatinina e K após diurese."],
 a:"NÃO fazer bolus de fluidos. Em gatos, investigar tromboembolismo associado."},
{id:"cad",n:"Cetoacidose diabética (CAD)",sp:"Cão e gato",s:"Hiperglicemia + cetonemia/cetonúria + acidose metabólica (HCO₃ < 15–16), com vômito, desidratação e apatia.",p:[
 "Fluidoterapia PRIMEIRO (4–6 h antes da insulina): NaCl 0,9% ou Ringer — repor o déficit em 12–24 h + manutenção + perdas.",
 "Potássio conforme o K sérico (ver calculadora de KCl, máx. 0,5 mEq/kg/h). Fósforo se < 1,5 mg/dL (fosfato de potássio 0,01–0,03 mmol/kg/h). Corrigir magnésio.",
 "Insulina regular — protocolo IM intermitente: [[0.2|100|U]] IM inicial e depois [[0.1|100|U]] IM a cada hora conforme glicemia; OU CRI: 2,2 U/kg (cão) / 1,1 U/kg (gato) em 250 mL de NaCl 0,9%, iniciando a 10 mL/h e ajustando.",
 "Meta: queda da glicemia de 50–75 mg/dL por hora. Abaixo de 250 mg/dL, adicionar glicose 2,5–5% ao fluido — NÃO suspender a insulina (ela resolve a cetose).",
 "Glicemia a cada 1–2 h; eletrólitos e gasometria a cada 4–6 h.",
 "Bicarbonato somente se pH < 7,0–7,1 persistente após 1 h de fluidos.",
 "Investigar desencadeantes: pancreatite, ITU, piometra, hiperadrenocorticismo, uso de corticoide."],
 a:"Hipofosfatemia pode causar hemólise (gatos). Transição para insulina de longa ação quando comer e estiver sem cetose."},
{id:"parvo",n:"Parvovirose canina",sp:"Cão",s:"Filhote não vacinado/incompleto; vômito, diarreia hemorrágica, apatia, desidratação, leucopenia.",p:[
 "Isolamento rigoroso. Teste de antígeno fecal (falso-negativo no início; falso-positivo até ~15 dias após vacina viva).",
 "Fluidoterapia: reposição + manutenção + perdas; suplementar K e glicose (2,5–5% se hipoglicemia).",
 "Antieméticos: maropitant [[1|10|mg]] SC/IV q24h ± ondansetrona [[0.5-1|2|mg]] IV q8–12h.",
 "Antimicrobianos (translocação bacteriana/neutropenia): ampicilina-sulbactam [[20-30|0|mg]] IV q8h; associar aminoglicosídeo ou fluoroquinolona se sepse.",
 "Nutrição enteral PRECOCE (sonda nasoesofágica) assim que controlar o vômito — melhora a recuperação.",
 "Analgesia (metadona/buprenorfina); evitar AINEs.",
 "Monitorar Ht/PT, albumina, glicose, K e leucograma (neutrófilos < 1.000/µL = alto risco). Plasma/coloide se albumina < 2 g/dL.",
 "Desinfecção: hipoclorito de sódio 1:30 (o vírus resiste no ambiente por meses)."],
 a:"Atenção à intussuscepção (palpação/US) em filhotes que pioram."},
{id:"hiperterm",n:"Hipertermia / insolação",sp:"Cão e gato",s:"T > 41 °C com histórico de exercício, calor ou confinamento; braquicefálicos e obesos são mais suscetíveis.",p:[
 "Resfriamento ativo IMEDIATO: molhar com água em temperatura ambiente + ventilação. PARAR a 39,5 °C (evitar hipotermia rebote). Não usar gelo.",
 "Oxigênio. Braquicefálico com obstrução: sedação leve (acepromazina [[0.01-0.02|2|mg]] ou butorfanol [[0.2|10|mg]]) e intubação se necessário.",
 "Fluidoterapia criteriosa (risco de edema pulmonar).",
 "Monitorar glicemia (hipoglicemia frequente), coagulação (CID: petéquias, TP/TTPa), creatinina (lesão renal), lactato, ECG, CK (rabdomiólise).",
 "Plasma fresco congelado se coagulopatia."],
 a:"Pior prognóstico: hipoglicemia, CID, chegada > 90 min após o evento, convulsões, coma."},
{id:"hemor",n:"Choque hemorrágico / politrauma",sp:"Cão e gato",s:"Taquicardia (cão) ou bradicardia/hipotermia (gato), mucosas pálidas, TPC > 2 s, pulso fraco, extremidades frias.",p:[
 "Compressão direta de hemorragias externas. Exame A CRASH PLAN.",
 "Cristaloide em alíquotas: cão [[10-20|0|mL]] / gato [[5-10|0|mL]] em 15 min, reavaliando. Hemorragia não controlada: hipotensão permissiva (PAS 80–90 mmHg).",
 "TCE associado: salina hipertônica 7,5% [[3-5|0|mL]] em 5–10 min.",
 "Transfusão (sangue total ou concentrado de hemácias) se Ht < 20–25% agudo ou perda contínua — gatos: TIPAR sempre.",
 "Ácido tranexâmico [[10-15|50|mg]] IV lento (antifibrinolítico).",
 "Analgesia: metadona [[0.2-0.3|10|mg]] ou fentanil.",
 "AFAST/TFAST; hemoabdome: bandagem abdominal compressiva temporária; laparotomia se instável após ressuscitação.",
 "Seriar lactato, Ht e PT (PT cai antes do Ht na hemorragia aguda)."],
 a:"Lactato persistentemente alto após ressuscitação indica hipoperfusão oculta."},
{id:"intox",n:"Intoxicação — descontaminação",sp:"Cão e gato",s:"Ingestão/contato recente com toxina; levar a embalagem.",p:[
 "Emese só se ingestão recente (até 1–2 h), paciente consciente e sem convulsões, e toxina NÃO cáustica nem derivada de petróleo.",
 "Gatos: dexmedetomidina [[0.007-0.01|0.5|mg]] IM ou xilazina [[0.44|20|mg]] IM (reverter com atipamezol após a emese). Cães: apomorfina (onde disponível) ou peróxido de hidrogênio 3% 1–2 mL/kg VO (máx. 45 mL) — risco de gastrite.",
 "Carvão ativado [[1000-2000|0|mg]] VO (1–2 g/kg) ± catártico na 1ª dose; doses repetidas de 0,5 g/kg a cada 4–6 h para toxinas com ciclo entero-hepático. Não adsorve álcoois, xilitol, metais e cáusticos.",
 "Contaminação de pele (permetrina, óleos): banho com detergente neutro e água morna; secar e aquecer.",
 "Toxinas lipofílicas (permetrina, ivermectina, anestésicos locais): emulsão lipídica 20% [[1.5|0|mL]] em bolus, depois 0,25 mL/kg/min por 30–60 min.",
 "Antídotos específicos: ver módulo Toxicologia (vitamina K1, N-acetilcisteína, fomepizol/etanol, atropina + pralidoxima, metocarbamol).",
 "Disque-Intoxicação (ANVISA/CIATox): 0800 722 6001."],
 a:"Nunca induzir emese em coelhos, roedores, equinos e ruminantes."},
{id:"anafil",n:"Anafilaxia",sp:"Cão e gato",s:"Após vacina, fármaco, picada de inseto: urticária/angioedema, vômito, diarreia, colapso, hipotensão; dispneia (gatos — pulmão é o órgão de choque). Cães: congestão hepática (fígado é o órgão de choque).",p:[
 "ADRENALINA IM [[0.01|1|mg]] (máx. 0,5 mg) — repetir a cada 5–15 min; refratária: CRI 0,05–0,5 mcg/kg/min.",
 "Fluidoterapia agressiva (choque distributivo): [[10-20|0|mL]] em bolus, reavaliar.",
 "Oxigênio; edema de laringe: intubação ou traqueostomia.",
 "Difenidramina [[1-2|50|mg]] IM e dexametasona [[0.1-0.2|2|mg]] IV (adjuvantes — não substituem a adrenalina).",
 "Observar por 12–24 h (reação bifásica)."],
 a:"Na ultrassonografia de cães, 'halo' na parede da vesícula biliar sugere anafilaxia."},
{id:"addison",n:"Crise addisoniana (hipoadrenocorticismo)",sp:"Cão",s:"Fraqueza, vômito, diarreia, bradicardia relativa, colapso; Na:K < 27, hipercalemia, hipoglicemia, azotemia, sem leucograma de estresse.",p:[
 "Coletar sangue para cortisol basal ANTES do corticoide. A dexametasona não interfere no teste de ACTH; prednisolona e hidrocortisona interferem.",
 "NaCl 0,9% em bolus [[10-20|0|mL]], repetir conforme perfusão.",
 "Hipercalemia grave: gluconato de cálcio 10% [[50-150|100|mg]] IV lento; insulina regular + glicose.",
 "Glicocorticoide após a coleta: dexametasona [[0.1-0.2|2|mg]] IV, ou hidrocortisona CRI 0,5–0,625 mg/kg/h (também tem efeito mineralocorticoide).",
 "Hipoglicemia: glicose 50% [[250-500|500|mg]] diluída.",
 "Manutenção: DOCP ou fludrocortisona + prednisolona em dose fisiológica (0,1–0,2 mg/kg/dia)."],
 a:"Corrigir a hiponatremia crônica lentamente (≤ 10–12 mEq/L em 24 h) — risco de mielinólise."},
{id:"dispneia",n:"Angústia respiratória felina",sp:"Gato",s:"Respiração de boca aberta, esforço abdominal, cianose, posição ortopneica.",p:[
 "Manipular o mínimo; oxigênio em caixa; butorfanol [[0.2-0.4|10|mg]] IM/IV.",
 "Localizar pelo padrão: inspiratório com estridor (vias superiores); expiratório com sibilos e esforço abdominal (asma); rápido e superficial (efusão pleural/pneumotórax); crepitações (edema/pneumonia).",
 "TFAST: efusão pleural ou pneumotórax → TORACOCENTESE (diagnóstica e terapêutica) antes da radiografia.",
 "Asma: terbutalina [[0.01|0.5|mg]] SC/IM/IV + dexametasona [[0.1-0.2|2|mg]] IV (ou salbutamol inalatório).",
 "Edema (CMH): furosemida [[1-2|10|mg]] IV/IM.",
 "Tromboembolismo (paresia aguda dos posteriores, dor, extremidades frias): analgesia forte (metadona/fentanil), clopidogrel 75 mg/gato VO (ataque), anticoagulante; prognóstico reservado."],
 a:"Gato dispneico pode morrer durante a contenção para exames — estabilizar primeiro."}];
function vProt(id){const P=PROT.find(x=>x.id===id);
 if(!P)return '<div class="stack"><h1>Protocolos de emergência</h1><p class="muted sm" style="margin:0">Passo a passo com doses calculadas pelo peso informado no Modo Plantão.</p>'+pwBar()+'<div class="list">'+PROT.map(p=>'<a class="item" href="#/protocolos/'+p.id+'"><div class="t">'+esc(p.n)+'</div><div class="s">'+esc(p.sp)+'</div></a>').join("")+'</div></div>'+disclaimer();
 return '<div class="stack"><h1>'+esc(P.n)+'</h1><span class="tag t-cls">'+esc(P.sp)+'</span>'+pwBar()+(pw()?"":'<div class="note warn">Informe o peso para ver as doses em mg e mL.</div>')+'<div class="card"><h3>Reconhecimento</h3><p class="sm" style="margin:6px 0 0">'+esc(P.s)+'</p></div><div class="card"><h3>Conduta</h3><ol class="sm" style="margin:8px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:8px">'+P.p.map(t=>'<li>'+dzText(t)+'</li>').join("")+'</ol></div>'+(P.a?'<div class="note warn"><b>Atenção:</b> '+esc(P.a)+'</div>':"")+
 '<div class="actions"><button class="btn" onclick="copy(protText(\''+P.id+'\'))">'+ic("copy",18)+' Copiar</button><a class="btn" href="#/plantao">Modo Plantão</a><a class="btn" href="#/protocolos">Outros protocolos</a></div></div>'+disclaimer()}
function protText(id){const P=PROT.find(x=>x.id===id);const tmp=document.createElement("div");tmp.innerHTML=P.p.map((t,i)=>(i+1)+". "+dzText(t)).join("\n");return P.n+(pw()?" — "+pw()+" kg":"")+"\n\n"+tmp.textContent}

/* ---------- Procedimentos (guia para estagiários) ---------- */
const FIGP={
venoso:'<svg viewBox="0 0 300 120"><rect x="10" y="40" width="280" height="40" rx="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M30 60 C100 52,180 68,280 58" stroke="var(--bad)" stroke-width="4" fill="none"/><rect x="40" y="28" width="22" height="64" rx="4" fill="var(--accent-soft)" stroke="var(--accent)"/><text x="30" y="110" font-size="11" fill="currentColor">garrote (auxiliar)</text><path d="M200 30 L160 56" stroke="currentColor" stroke-width="3"/><rect x="198" y="18" width="40" height="14" rx="3" fill="none" stroke="currentColor"/><text x="170" y="110" font-size="11" fill="currentColor">cateter a 15–30°, bisel para cima</text><text x="110" y="35" font-size="11" fill="var(--bad)">v. cefálica</text></svg>',
cisto:'<svg viewBox="0 0 300 140"><path d="M20 60 Q150 10 280 60 L280 110 Q150 130 20 110 Z" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="200" cy="95" rx="38" ry="24" fill="rgba(234,179,8,.25)" stroke="#ca8a04" stroke-width="2"/><path d="M200 140 L200 100" stroke="var(--accent)" stroke-width="3"/><text x="160" y="95" font-size="11" fill="currentColor">bexiga</text><text x="212" y="136" font-size="11" fill="currentColor">agulha 22G perpendicular</text><text x="30" y="80" font-size="11" fill="currentColor">cranial ←</text></svg>',
toraco:'<svg viewBox="0 0 300 140"><g stroke="currentColor" stroke-width="2" fill="none">'+[0,1,2,3,4,5,6,7].map(i=>'<path d="M'+(60+i*25)+' 20 Q'+(70+i*25)+' 70 '+(60+i*25)+' 125"/>').join("")+'</g><circle cx="222" cy="45" r="7" fill="var(--accent)"/><circle cx="222" cy="105" r="7" fill="var(--bad)"/><text x="232" y="42" font-size="11" fill="currentColor">ar: 1/3 dorsal</text><text x="232" y="110" font-size="11" fill="currentColor">líquido: 1/3 ventral</text><text x="150" y="138" font-size="11" fill="currentColor">7º–9º espaço intercostal, borda cranial da costela</text></svg>',
abdo:'<svg viewBox="0 0 300 140"><ellipse cx="150" cy="70" rx="120" ry="58" fill="none" stroke="currentColor" stroke-width="2"/><path d="M150 12 V128 M30 70 H270" stroke="currentColor" stroke-dasharray="4 4"/><circle cx="150" cy="70" r="5" fill="currentColor"/><g fill="var(--accent)">'+[[115,52],[185,52],[115,88],[185,88]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="7"/>').join("")+'</g><text x="160" y="66" font-size="11" fill="currentColor">umbigo</text><text x="40" y="135" font-size="11" fill="currentColor">4 quadrantes, 2–3 cm do umbigo (técnica dos 4 pontos)</text></svg>',
intub:'<svg viewBox="0 0 300 140"><path d="M20 40 Q120 30 170 60 L280 70" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 100 Q120 110 170 80 L280 75" stroke="currentColor" stroke-width="2" fill="none"/><path d="M160 72 L280 50" stroke="var(--accent)" stroke-width="5"/><path d="M160 76 L280 100" stroke="#999" stroke-width="5"/><text x="210" y="40" font-size="11" fill="var(--accent)">traqueia (ventral)</text><text x="210" y="120" font-size="11" fill="currentColor">esôfago (dorsal)</text><path d="M30 92 L140 80" stroke="var(--bad)" stroke-width="3"/><text x="30" y="125" font-size="11" fill="currentColor">laringoscópio sobre a base da língua (não na epiglote)</text></svg>',
uretral:'<svg viewBox="0 0 300 120"><path d="M30 60 Q120 20 180 60 T280 70" stroke="currentColor" stroke-width="3" fill="none"/><path d="M180 60 L240 30" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3"/><text x="200" y="22" font-size="11" fill="var(--accent)">tração caudodorsal</text><text x="40" y="100" font-size="11" fill="currentColor">bexiga ←— uretra (retificar a flexura antes de avançar o cateter)</text></svg>'};
const PROC=[
{id:"venoso",n:"Acesso venoso periférico (veia cefálica)",ind:"Fluidoterapia, fármacos IV, emergências.",mat:["Cateter 24G (gatos/filhotes), 22–20G (cães pequenos/médios), 18–14G (cães grandes, emergência)","Tricótomo, antisséptico (clorexidina/álcool)","Esparadrapo, tampa/extensor, seringa com salina heparinizada ou salina"],
 p:["Contenção: auxiliar segura o animal e garroteia a veia com o polegar logo abaixo do cotovelo, girando levemente para lateral.","Tricotomia ampla e antissepsia; não tocar no ponto após a antissepsia.","Estabilizar a veia com o polegar (tração da pele) e introduzir o cateter com o bisel para cima, em ângulo de 15–30°, até ver sangue no canhão.","Avançar mais 1–2 mm todo o conjunto, depois deslizar só o cateter sobre o mandril até o fim.","Auxiliar solta o garrote; ocluir a veia acima da ponta do cateter e retirar o mandril.","Conectar a tampa/extensor, lavar com salina (deve fluir sem resistência nem edema).","Fixar com esparadrapo em 'borboleta' sem apertar; identificar data e calibre."],
 e:["Garrote solto antes de avançar → veia colapsa.","Transfixar a veia por ângulo excessivo.","Fixação apertada → edema da pata.","Manter > 72 h sem avaliação → flebite."]},
{id:"jugular",n:"Coleta de sangue pela veia jugular",ind:"Hemograma, bioquímica, gasometria venosa, volumes maiores; gatos e cães pequenos.",mat:["Agulha 22–25G e seringa 3–5 mL","Algodão e álcool","Tubos (EDTA, citrato, sem anticoagulante/gel)"],
 p:["Gato/cão pequeno: decúbito esternal com membros torácicos tracionados na borda da mesa e cabeça estendida para cima; cão maior: sentado.","Ocluir a jugular na entrada do tórax (sulco jugular).","Molhar com álcool para visualizar; puncionar com o bisel para cima, paralelo à veia, direção à cabeça.","Aspirar devagar (pressão excessiva colapsa a veia e causa hemólise).","Soltar a oclusão ANTES de retirar a agulha; comprimir por 1–2 min.","Encher primeiro o tubo de citrato (coagulação), depois EDTA e soro; homogeneizar delicadamente."],
 e:["Gatos estressados: considerar gabapentina pré-consulta ou sedação.","Evitar jugular em coagulopatas (use veia periférica).","Volume máximo seguro de coleta: ~10% da volemia (~7–8 mL/kg em cães)."]},
{id:"cisto",n:"Cistocentese",ind:"Urinálise e urocultura (amostra de eleição), descompressão vesical em obstrução.",mat:["Agulha 22G (25×7 ou 40×7 conforme o porte) e seringa 5–10 mL","Antisséptico","Ultrassom (ideal)"],
 p:["Bexiga com volume suficiente (palpável ou visível ao US).","Decúbito dorsal (ou lateral/em pé em cães grandes); antissepsia na linha média ventral caudal.","Imobilizar a bexiga com a mão (ou guiar por US).","Inserir a agulha na parede ventral/ventrolateral da bexiga, direcionada caudalmente em ângulo de ~45° (ou perpendicular), com movimento único.","Aspirar sem mover a agulha; NÃO comprimir a bexiga durante a punção.","Soltar o êmbolo antes de retirar a agulha."],
 e:["Contraindicado: coagulopatia grave, piometra suspeita, bexiga muito pequena/pouca urina, suspeita de carcinoma de células de transição (risco de semeadura).","Hematúria microscópica leve pode ser iatrogênica."]},
{id:"sondamacho",n:"Sondagem uretral — cão macho",ind:"Coleta de urina, alívio de retenção, monitorar débito urinário.",mat:["Sonda uretral 6–10 Fr (comprimento suficiente)","Luvas estéreis, lidocaína gel, clorexidina 0,05%","Seringa, sistema coletor fechado"],
 p:["Decúbito lateral; auxiliar retrai o prepúcio expondo a glande.","Lavar a glande e o prepúcio com clorexidina diluída.","Medir a sonda até a bexiga (glande → arco isquiático → bexiga).","Lubrificar e introduzir com técnica asséptica, avançando delicadamente; resistência leve no arco isquiático é normal.","Ao fluir urina, avançar mais 1–2 cm; fixar ao prepúcio se de demora e conectar a sistema fechado."],
 e:["Forçar a sonda → ruptura uretral.","Sonda longa demais → nó na bexiga.","Sistema aberto → infecção urinária ascendente."]},
{id:"sondafemea",n:"Sondagem uretral — cadela",ind:"Coleta de urina, monitorar débito urinário.",mat:["Sonda 6–10 Fr (ou Foley)","Espéculo vaginal/otoscópio ou técnica digital","Luvas estéreis, lidocaína gel"],
 p:["Decúbito esternal com membros pélvicos pendentes na borda da mesa (ou em estação).","Antissepsia da vulva.","Técnica digital: dedo indicador estéril no vestíbulo palpa o tubérculo/papila uretral no assoalho, ~3–5 cm cranial à comissura ventral.","Guiar a sonda ventralmente ao dedo para dentro do óstio uretral (evitar a fossa do clitóris, mais caudal).","Avançar até fluir urina; fixar e conectar a sistema fechado se de demora."],
 e:["Entrar na vagina (a sonda segue dorsalmente e não drena urina).","Sedação pode ser necessária em cadelas agitadas."]},
{id:"desobstr",n:"Desobstrução uretral — gato macho",ind:"Obstrução uretral (ver protocolo de emergência — tratar hipercalemia antes).",mat:["Cateter 3–3,5 Fr (tomcat ou de poliuretano)","Seringas, salina estéril, lidocaína gel","Sedação/anestesia, sistema coletor fechado"],
 p:["Estabilizar (K, ECG, fluidos, analgesia) e sedar/anestesiar.","Cistocentese descompressiva prévia facilita.","Expor o pênis e tracionar o prepúcio CAUDODORSALMENTE para retificar a uretra.","Introduzir o cateter lubrificado; ao encontrar o tampão, injetar salina (retro-hidropropulsão) enquanto avança suavemente.","Lavar a bexiga com salina estéril até clarear.","Trocar por sonda de demora macia e fixar ao prepúcio; sistema fechado; colar elizabetano."],
 e:["Força excessiva → laceração/ruptura uretral.","Esquecer de medir o débito urinário (diurese pós-obstrutiva).","Não tratar a hipercalemia antes da anestesia."]},
{id:"toraco",n:"Toracocentese",ind:"Pneumotórax ou efusão pleural com dispneia (diagnóstica e terapêutica).",mat:["Cateter 18–22G ou butterfly 19–23G","Extensor + torneira de 3 vias + seringa 20–60 mL","Tricótomo, antisséptico, recipiente graduado, tubos"],
 p:["Oxigênio e contenção mínima, decúbito esternal ou em estação.","Local: 7º–9º espaço intercostal — terço DORSAL para ar e terço VENTRAL para líquido (guiar por TFAST).","Antissepsia; inserir a agulha na borda CRANIAL da costela (vasos e nervos correm na borda caudal).","Ao entrar no espaço pleural, inclinar a agulha paralela à parede (bisel voltado para o pulmão evita laceração).","Aspirar com torneira de 3 vias e registrar o volume; repetir no hemitórax oposto se necessário.","Enviar amostras: citologia, proteína, contagem celular, cultura."],
 e:["Agulha perpendicular ao pulmão → pneumotórax iatrogênico.","Pneumotórax que recidiva rapidamente → dreno torácico."]},
{id:"abdo",n:"Abdominocentese",ind:"Efusão abdominal, suspeita de hemoabdome, uroabdome, peritonite séptica.",mat:["Agulha 20–22G ou cateter","Seringas, tubos EDTA e secos, lâminas","Ultrassom (ideal)"],
 p:["Esvaziar a bexiga (se possível); decúbito lateral esquerdo (baço à esquerda) ou em estação.","Antissepsia ventral ao redor do umbigo.","Guiado por US no maior bolsão de líquido, OU técnica dos 4 quadrantes a 2–3 cm do umbigo.","Inserir a agulha deixando o líquido gotejar por gravidade antes de aspirar suavemente.","Análises: Ht e PT do líquido; creatinina e K (uroabdome: creatinina > 2× e K > 1,4× o sérico); lactato/glicose (séptica: glicose 20 mg/dL menor que o sangue); bilirrubina; citologia e cultura."],
 e:["Sangue que coagula na seringa = punção vascular/esplênica (efusão hemorrágica verdadeira não coagula).","Aspiração forte aspira omento e obstrui a agulha."]},
{id:"intub",n:"Intubação orotraqueal",ind:"Anestesia geral, RCP, proteção de via aérea.",mat:["Sondas endotraqueais de 3 tamanhos (testar o balonete)","Laringoscópio com lâmina adequada","Lidocaína tópica (gatos), gaze/cadarço, seringa para o balonete"],
 p:["Pré-oxigenar 3–5 min. Medir a sonda: da ponta do focinho até a entrada do tórax.","Decúbito esternal com a cabeça estendida; auxiliar abre a boca e traciona a língua.","Lâmina do laringoscópio na BASE DA LÍNGUA (valécula), pressionando-a ventralmente — não tocar a epiglote.","Gatos: lidocaína tópica na laringe e aguardar 30–60 s (evita laringoespasmo).","Introduzir a sonda entre as cartilagens aritenoides durante a inspiração.","Confirmar: capnografia (padrão-ouro), condensação na sonda, movimento do balão, auscultação bilateral; palpar só UMA estrutura tubular no pescoço.","Fixar e insuflar o balonete até não haver vazamento a 20 cmH₂O (gatos: insuflar com cuidado — risco de ruptura traqueal)."],
 e:["Intubação esofágica (confirmar SEMPRE com capnografia).","Sonda longa demais → intubação brônquica seletiva.","Balonete hiperinsuflado → lesão traqueal."]},
{id:"sne",n:"Sonda nasoesofágica",ind:"Nutrição enteral de curto prazo (< 7–10 dias), parvovirose, lipidose leve, anorexia.",mat:["Sonda 5–8 Fr (gatos/cães pequenos), 8–10 Fr (cães médios)","Colírio anestésico (proparacaína) / lidocaína gel","Fio ou cola para fixação, colar elizabetano"],
 p:["Instilar 2–3 gotas de anestésico tópico na narina e aguardar 2 min.","Medir da narina até o 7º–8º espaço intercostal (terço distal do esôfago) e marcar.","Cabeça em posição normal (não estendida). Direcionar a sonda ventromedialmente na narina; empurrar o plano nasal dorsalmente ajuda a entrar no meato ventral.","Avançar até a marca — o animal costuma deglutir.","Confirmar posição: radiografia (padrão) ou ausência de tosse + injetar 3–5 mL de salina sem tosse; capnografia não deve mostrar CO₂.","Fixar com pontos/cola na lateral do focinho e na fronte, sem tocar os bigodes."],
 e:["Colocação traqueal → aspiração (sempre confirmar).","Usar dietas líquidas (a sonda fina entope com pastosas); lavar com água após cada uso."]},
{id:"pa",n:"Pressão arterial por Doppler",ind:"Hipertensão (DRC, endocrinopatias), hipotensão/choque, monitoração anestésica.",mat:["Doppler vascular com fones","Manguitos (largura ≈ 30–40% da circunferência do membro)","Gel de ultrassom, tricótomo"],
 p:["Ambiente calmo, aclimatação 5–10 min, tutor presente; mesmo membro e posição a cada aferição.","Manguito no membro torácico (acima do carpo) ou na cauda; sonda sobre a artéria digital palmar (ou coccígea) com gel.","Inflar ~30 mmHg acima do ponto em que o som some e desinflar lentamente.","O primeiro retorno do som = pressão SISTÓLICA.","Descartar a 1ª medida; fazer 5–7 aferições consistentes e usar a média.","Hipertensão (ACVIM): PAS 140–159 pré-hipertensão; 160–179 hipertensão; ≥ 180 risco grave de lesão em órgão-alvo."],
 e:["Manguito estreito superestima; largo subestima.","Ansiedade ('efeito do jaleco branco') eleva a PAS — repetir em outro momento antes de tratar."]}];
function vProc(id){const P=PROC.find(x=>x.id===id);
 if(!P)return '<div class="stack"><h1>Procedimentos</h1><p class="muted sm" style="margin:0">Guia prático para estagiários e plantonistas: indicação, material, passo a passo e erros comuns.</p><div class="list">'+PROC.map(p=>'<a class="item" href="#/procedimentos/'+p.id+'"><div class="t">'+esc(p.n)+'</div><div class="s">'+esc(p.ind)+'</div></a>').join("")+'</div></div>';
 return '<div class="stack"><h1>'+esc(P.n)+'</h1>'+(FIGP[P.id]?'<div class="card figbox" style="color:var(--ink)">'+FIGP[P.id]+'</div>':"")+'<div class="card"><h3>Indicação</h3><p class="sm" style="margin:6px 0 0">'+esc(P.ind)+'</p></div><div class="card"><h3>Material</h3><ul class="sm" style="margin:6px 0 0;padding-left:18px">'+P.mat.map(m=>'<li>'+esc(m)+'</li>').join("")+'</ul></div><div class="card"><h3>Passo a passo</h3><ol class="sm" style="margin:8px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px">'+P.p.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol></div><div class="note warn"><b>Erros comuns / cuidados:</b><br/>'+P.e.map(t=>'• '+esc(t)).join("<br/>")+'</div><a class="btn" href="#/procedimentos">Outros procedimentos</a></div>'+disclaimer()}

/* ---------- Internação e passagem de plantão (SBAR) ---------- */
function intL(){if(!S.int)S.int=store.get("intern",[]);return S.int}
function intSave(){store.set("intern",S.int)}
function medNext(m){return m.last?m.last+m.h*3600000:null}
function medSt(m){const n=medNext(m);if(!n)return["warn","não aplicado"];const d=n-Date.now();const mi=Math.floor(-d/60000);return d<0?["bad","ATRASADO "+(mi>=60?Math.floor(mi/60)+"h"+String(mi%60).padStart(2,"0"):mi+" min")]:d<1800000?["warn","em "+Math.ceil(d/60000)+" min"]:["ok",new Date(n).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})]}
function vInt(id){const L=intL();
 if(!id){const due=L.reduce((a,p)=>a+(p.meds||[]).filter(m=>medSt(m)[0]!=="ok").length,0);
  return '<div class="stack"><h1>Internação</h1><p class="muted sm" style="margin:0">Pacientes internados, horários de medicação, parâmetros e passagem de plantão (SBAR). Os dados ficam só neste aparelho.</p>'+(due?'<div class="note bad"><b>'+due+'</b> medicação(ões) atrasada(s) ou não aplicada(s).</div>':"")+
  '<div class="list">'+(L.length?L.map(p=>{const late=(p.meds||[]).filter(m=>medSt(m)[0]==="bad").length;return '<a class="item" href="#/internacao/'+p.id+'"><div class="row between"><div class="t">'+esc(p.nome||"(sem nome)")+' · '+esc(p.sp||"")+' · '+esc(p.peso||"?")+' kg</div>'+(late?'<span class="tag t-bad">'+late+' atrasada(s)</span>':'')+'</div><div class="s">'+esc(p.diag||"")+' — internado em '+new Date(p.adm).toLocaleDateString("pt-BR")+'</div></a>'}).join(""):'<div class="empty">Nenhum paciente internado.</div>')+'</div>'+
  '<div class="card"><h3>Novo paciente</h3><div class="grid g2m" style="margin-top:8px"><div class="field"><label>Nome</label><input class="inp" id="inN" /></div><div class="field"><label>Espécie</label><input class="inp" id="inS" placeholder="Cão, gato..." /></div><div class="field"><label>Peso (kg)</label><input class="inp" id="inW" type="number" step="any" /></div><div class="field"><label>Diagnóstico/motivo</label><input class="inp" id="inD" /></div></div><button class="btn pri" style="margin-top:10px" onclick="intAdd()">'+ic("plus",18)+' Internar</button></div>'+
  (L.length?'<button class="btn" onclick="copy(intAllText())">'+ic("copy",18)+' Copiar passagem de plantão (todos)</button>':"")+'</div>'}
 const p=L.find(x=>x.id===id);if(!p)return '<div class="empty">Paciente não encontrado.</div>';const last=(p.par||[]).slice(-1)[0];
 return '<div class="stack"><div class="row between"><h1 style="margin:0">'+esc(p.nome)+'</h1><a class="btn sm" href="#/internacao">Todos</a></div><div class="sm muted">'+esc(p.sp)+' · '+esc(p.peso)+' kg · '+esc(p.diag)+' · internado em '+new Date(p.adm).toLocaleString("pt-BR")+'</div>'+
 '<div class="card"><h3>Medicações</h3><div class="list" style="margin-top:8px">'+((p.meds||[]).length?p.meds.map((m,i)=>{const s=medSt(m);return '<div class="item"><div class="row between"><div><div class="t">'+esc(m.n)+'</div><div class="s">'+esc(m.d)+' · a cada '+m.h+' h'+(m.last?' · última: '+new Date(m.last).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"")+'</div></div><span class="tag t-'+(s[0]==="bad"?"bad":s[0]==="warn"?"warn":"ok")+'">'+esc(s[1])+'</span></div><div class="actions" style="margin-top:6px"><button class="btn sm pri" onclick="intGive(\''+id+'\','+i+')">✓ Aplicado agora</button><button class="btn sm ghost" onclick="if(confirm(\'Remover '+esc(m.n).replace(/'/g,"")+'?\')){intP(\''+id+'\').meds.splice('+i+',1);intSave();rerender()}">'+ic("trash",14)+'</button></div></div>'}).join(""):'<div class="empty">Sem medicações cadastradas.</div>')+'</div>'+
 '<div class="grid g2m" style="margin-top:10px"><div class="field"><label>Medicação</label><input class="inp" id="imN" placeholder="ex.: Metadona" /></div><div class="field"><label>Dose/via</label><input class="inp" id="imD" placeholder="0,3 mg/kg IV = 0,6 mL" /></div><div class="field"><label>Intervalo (h)</label><input class="inp" id="imH" type="number" value="8" /></div><div class="field"><label>Primeira dose</label><select class="inp" id="imF"><option value="now">Aplicada agora</option><option value="no">Ainda não aplicada</option></select></div></div><button class="btn" style="margin-top:8px" onclick="intMed(\''+id+'\')">'+ic("plus",16)+' Adicionar medicação</button></div>'+
 '<div class="card"><h3>Parâmetros</h3>'+((p.par||[]).length?'<div class="scroll-x"><table class="tbl" style="margin-top:8px"><thead><tr><th>Hora</th><th>FC</th><th>FR</th><th>T °C</th><th>PAS</th><th>DU mL/kg/h</th><th>Dor</th><th>Obs.</th></tr></thead><tbody>'+p.par.slice(-12).reverse().map(r=>'<tr><td>'+new Date(r.t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})+'</td><td>'+esc(r.fc||"")+'</td><td>'+esc(r.fr||"")+'</td><td>'+esc(r.tc||"")+'</td><td>'+esc(r.pas||"")+'</td><td>'+esc(r.du||"")+'</td><td>'+esc(r.dor||"")+'</td><td>'+esc(r.obs||"")+'</td></tr>').join("")+'</tbody></table></div>':'<div class="empty">Sem registros.</div>')+
 '<div class="grid g2m" style="margin-top:10px">'+[["ipFc","FC"],["ipFr","FR"],["ipT","Temperatura"],["ipP","PAS (mmHg)"],["ipU","Débito urinário"],["ipD","Escore de dor"]].map(([k,l])=>'<div class="field"><label>'+l+'</label><input class="inp" id="'+k+'" type="number" step="any" /></div>').join("")+'<div class="field"><label>Observação</label><input class="inp" id="ipO" placeholder="comeu, vomitou, urinou..." /></div></div><button class="btn" style="margin-top:8px" onclick="intPar(\''+id+'\')">'+ic("plus",16)+' Registrar parâmetros</button></div>'+
 '<div class="card"><h3>Pendências / plano</h3><textarea class="inp" style="margin-top:8px" oninput="intP(\''+id+'\').pend=this.value;intSave()" placeholder="Exames a coletar, retorno de resultados, contato com tutor...">'+esc(p.pend||"")+'</textarea></div>'+
 '<div class="card"><h3>Passagem de plantão (SBAR)</h3><pre class="sm" style="white-space:pre-wrap;font-family:inherit;margin:8px 0 0">'+esc(sbar(p))+'</pre><div class="actions" style="margin-top:8px"><button class="btn pri" onclick="copy(sbar(intP(\''+id+'\')))">'+ic("copy",18)+' Copiar SBAR</button><button class="btn" onclick="if(confirm(\'Dar alta/remover este paciente da lista?\')){S.int=intL().filter(x=>x.id!==\''+id+'\');intSave();location.hash=\'#/internacao\'}">Alta / remover</button></div></div></div>'}
function intP(id){return intL().find(x=>x.id===id)}
function intAdd(){const g=k=>document.getElementById(k).value.trim();if(!g("inN")){toast("Informe o nome");return}const p={id:"p"+Date.now(),nome:g("inN"),sp:g("inS"),peso:g("inW"),diag:g("inD"),adm:Date.now(),meds:[],par:[],pend:""};intL().push(p);intSave();location.hash="#/internacao/"+p.id}
function intMed(id){const g=k=>document.getElementById(k).value.trim();if(!g("imN")){toast("Informe a medicação");return}intP(id).meds.push({n:g("imN"),d:g("imD"),h:num(g("imH"))||8,last:g("imF")==="now"?Date.now():0,hist:g("imF")==="now"?[Date.now()]:[]});intSave();rerender()}
function intGive(id,i){const m=intP(id).meds[i];m.last=Date.now();(m.hist||(m.hist=[])).push(m.last);intSave();toast(m.n+" registrado");rerender()}
function intPar(id){const g=k=>document.getElementById(k).value.trim();const r={t:Date.now(),fc:g("ipFc"),fr:g("ipFr"),tc:g("ipT"),pas:g("ipP"),du:g("ipU"),dor:g("ipD"),obs:g("ipO")};if(!Object.values(r).slice(1).some(Boolean)){toast("Preencha algum parâmetro");return}intP(id).par.push(r);intSave();rerender()}
function sbar(p){const P=p.par||[],last=P.slice(-1)[0],prev=P.slice(-2,-1)[0];const tr=(k,l)=>last&&last[k]?l+" "+last[k]+(prev&&prev[k]&&prev[k]!==last[k]?" (antes "+prev[k]+")":""):"";
 const meds=(p.meds||[]).map(m=>{const n=medNext(m);return "- "+m.n+" "+m.d+" q"+m.h+"h — próxima: "+(n?new Date(n).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})+(n<Date.now()?" (ATRASADA)":""):"aplicar")}).join("\n");
 return "S (Situação): "+p.nome+", "+p.sp+", "+p.peso+" kg — "+p.diag+".\nB (Histórico): internado em "+new Date(p.adm).toLocaleString("pt-BR")+" ("+Math.max(1,Math.round((Date.now()-p.adm)/36e5))+" h).\nA (Avaliação): "+([tr("fc","FC"),tr("fr","FR"),tr("tc","T"),tr("pas","PAS"),tr("du","DU"),tr("dor","dor")].filter(Boolean).join(", ")||"sem parâmetros registrados")+(last&&last.obs?". "+last.obs:"")+(last?" (às "+new Date(last.t).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})+")":"")+".\nR (Recomendações):\n"+(meds||"- sem medicações")+(p.pend?"\nPendências: "+p.pend:"")}
function intAllText(){return "PASSAGEM DE PLANTÃO — "+new Date().toLocaleString("pt-BR")+"\n\n"+intL().map(sbar).join("\n\n———\n\n")}
setInterval(()=>{try{const L=store.get("intern",[]);const n=L.reduce((a,p)=>a+(p.meds||[]).filter(m=>m.last&&m.last+m.h*3600000<Date.now()).length,0);if(n>(window._lateN||0)){toast("⏰ "+n+" medicação(ões) atrasada(s) na internação");beep()}window._lateN=n}catch(e){}},60000);

/* ---------- Valores fisiológicos ---------- */
const FISIO=[["Cão","60–160 (filhotes até 220)","10–30","37,5–39,2","110–160","80–90","1–2"],["Gato","140–220","20–30","38,1–39,2","120–170","55–65","1–2"],["Equino","28–44 (potro 80–100)","8–16","37,2–38,3","—","75–80","—"],["Bovino","48–84 (bezerro 100–120)","26–50","37,8–39,2","—","55–65","—"],["Ovino","70–90","16–34","38,3–39,9","—","60–65","—"],["Caprino","70–90","10–30","38,5–39,7","—","60–70","—"],["Suíno","70–120","32–58","38,7–39,8","—","65","—"],["Coelho","180–300","30–60","38,5–40","90–130","55–65","—"],["Porquinho-da-índia","230–380","42–104","37,2–39,5","—","70","—"],["Chinchila","100–150","40–80","36,1–37,8","—","—","—"],["Rato","250–450","70–115","35,9–37,5","—","50–65","—"],["Hamster","250–500","35–135","37–38","—","70–80","—"],["Furão","180–250","33–36","37,8–40","—","~60–80","—"],["Psitacídeos pequenos (~100 g)","250–400","40–60","40–42","—","~100 (10% do peso)","—"],["Répteis","Variável com a temperatura","Variável","= ambiente (manter na zona de temperatura ótima)","—","~60","—"]];
function vFisio(){return '<div class="stack"><h1>Valores fisiológicos</h1><p class="muted sm" style="margin:0">Valores de repouso aproximados (adultos). Variam com raça, idade, porte, estresse e ambiente.</p><div class="card scroll-x"><table class="tbl"><thead><tr><th>Espécie</th><th>FC (bpm)</th><th>FR (mpm)</th><th>T (°C)</th><th>PAS (mmHg)</th><th>Volemia (mL/kg)</th><th>Débito urinário (mL/kg/h)</th></tr></thead><tbody>'+FISIO.map(r=>'<tr>'+r.map((c,i)=>i?'<td>'+c+'</td>':'<td><b>'+c+'</b></td>').join("")+'</tr>').join("")+'</tbody></table></div>'+
 '<div class="card"><h3>Ruminantes</h3><p class="sm" style="margin:6px 0 0">Movimentos ruminais: 1–3 a cada 2 minutos (bovinos). Ausência = hipomotilidade/atonia (acidose, hipocalcemia, dor).</p></div><div class="card"><h3>Outros parâmetros rápidos (cão/gato)</h3><p class="sm" style="margin:6px 0 0">TPC < 2 s · Mucosas róseas · Glicemia 70–120 mg/dL · Lactato < 2,5 mmol/L · SpO₂ > 95% · Ht cão 37–55% / gato 30–45% · Proteínas totais 6–8 g/dL · Densidade urinária > 1,030 (cão) / > 1,035 (gato) · Manutenção hídrica ~50–60 mL/kg/dia.</p></div><div class="actions"><a class="btn" href="#/lab/ref">Valores laboratoriais</a><a class="btn" href="#/repro">Gestação por espécie</a></div></div>'+disclaimer()}

/* ---------- Quiz ampliado: geradores de farmacologia + banco estilo concurso ---------- */
const QB=(DATA.qb||[]);
const SPN={dog:"Cão",cat:"Gato",horse:"Equino",cattle:"Bovino",sr:"Ovino/caprino",pig:"Suíno",rabbit:"Coelho",rodent:"Roedor",bird:"Ave",reptile:"Réptil"};
function fs1(s,m){s=String(s||"").split(/(?<=[.;])\s/)[0].replace(/[.;]$/,"");m=m||150;return s.length>m?s.slice(0,m-1)+"…":s}
const cnm=x=>CLS[x.c]&&CLS[x.c].n;
const kw=t=>new Set(norm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=5));
function qOptsX(right,pool){const K=kw(right);const P=pool.filter(t=>t&&t.length>=20&&![...kw(t)].some(w=>K.has(w)));return qOpts(right,P)}
function qbGen(area){return()=>{const L=area?QB.filter(x=>x[0]===area):QB;const x=pick(L);return {q:x[1],o:shuf(x[2]),a:x[2][0],ex:x[3],src:"Banco"}}}
const QB_AREAS={farm:"Farmacologia",leg:"Legislação e ética",sp:"Saúde pública e defesa sanitária",clin:"Clínica de pequenos animais",grandes:"Grandes animais e produção",anest:"Anestesiologia",repro:"Reprodução"};
Object.assign(QUIZ_T,{
 mec:["Mecanismo de ação",()=>{const d=pick(DRUGS.filter(x=>x.m&&x.m.length>12));const o=qOpts(fs1(d.m),DRUGS.filter(x=>x.c!==d.c&&x.m).map(x=>fs1(x.m)));return o&&{q:"Mecanismo de ação de "+d.n+":",o,a:fs1(d.m),ex:d.i?"Indicações: "+fs1(d.i,200):""}}],
 ae:["Efeitos adversos",()=>{const d=pick(DRUGS.filter(x=>x.ae&&x.ae.length>12));const o=qOptsX(fs1(d.ae),DRUGS.filter(x=>x.c!==d.c&&x.ae).map(x=>fs1(x.ae)));return o&&{q:"Efeitos adversos/alertas característicos de "+d.n+":",o,a:fs1(d.ae),ex:d.ae}}],
 ci:["Contraindicações",()=>{const d=pick(DRUGS.filter(x=>x.ci&&x.ci.length>12));const o=qOptsX(fs1(d.ci),DRUGS.filter(x=>x.c!==d.c&&x.ci).map(x=>fs1(x.ci)));return o&&{q:"Contraindicação/precaução importante de "+d.n+":",o,a:fs1(d.ci),ex:d.ci}}],
 dose:["Doses (mg/kg)",()=>{const sp=pick(["dog","dog","cat","horse","cattle"]);const ds=DRUGS.filter(x=>x.d[sp]&&x.d[sp][0]!=null&&x.d[sp][1]>0);const d=pick(ds);const e=d.d[sp];const f=(a,b)=>a===b?fmt(a):fmt(a)+"–"+fmt(b);const R=f(e[0],e[1]);
   const o=qOpts(R,[f(e[0]*10,e[1]*10),f(e[0]/10,e[1]/10),f(e[0]*4,e[1]*4),f(e[0]/4,e[1]/4)]);return o&&{q:"Dose de referência de "+d.n+" em "+SPN[sp]+" (por kg; "+(e[2]||"")+"; "+(e[3]||"")+"):",o,a:R,ex:(e[4]?e[4]+" ":"")+"Erros de dez vezes (vírgula/concentração) são os mais graves na prática."}}],
 marca:["Nomes comerciais",()=>{const ds=DRUGS.filter(x=>x.b&&x.b.length>2);const d=pick(ds);const br=d.b.split(",")[0].replace(/\(.*?\)/g,"").trim();if(!br||norm(br).includes(norm(d.n.split(/[ (]/)[0]).slice(0,5)))return null;const same=DRUGS.filter(x=>x.c===d.c&&x!==d).map(x=>x.n);const o=qOpts(d.n,same.length>=3?same:DRUGS.map(x=>x.n));return o&&{q:"Qual o princípio ativo de “"+br+"”?",o,a:d.n,ex:d.n+": "+d.b}}],
 onl:["On-label × extra-label",()=>{const d=pick(DRUGS.filter(x=>x.lab&&x.lab.length&&x.lab.length<6));const r=SPN[pick(d.lab)];const wr=Object.keys(SPN).filter(k=>!d.lab.includes(k)).map(k=>SPN[k]);const o=qOpts(r,wr);return o&&{q:"Para qual destas espécies "+d.n+" tem uso aprovado em bula veterinária (on-label)?",o,a:r,ex:"On-label para: "+d.lab.map(k=>SPN[k]).join(", ")+". Nas demais espécies o uso é extrabula (extra-label), sob responsabilidade do MV."}}],
 xl:["Cautelas por espécie",()=>{const ds=DRUGS.filter(x=>x.x&&Object.keys(x.x).length);const d=pick(ds);const sp=pick(Object.keys(d.x));const R=fs1(d.x[sp],170);if(R.length<20)return null;const pool=[];DRUGS.forEach(y=>{if(y!==d&&y.x)Object.entries(y.x).forEach(([k,t])=>{if(k!==sp)pool.push(fs1(t,170))})});const o=qOptsX(R,pool);return o&&{q:"Por que "+d.n+" exige cautela ou é contraindicado(a) em "+(SPN[sp]||sp)+"?",o,a:R,ex:d.x[sp]}}],
 toxs:["Sinais de intoxicação",()=>{const ts=TOX.filter(t=>t.sx);const t=pick(ts);const o=qOptsX(fs1(t.sx,170),ts.filter(x=>x!==t).map(x=>fs1(x.sx,170)));return o&&{q:"Sinais clínicos típicos da intoxicação por "+t.n+":",o,a:fs1(t.sx,170),ex:"Tratamento: "+fs1(t.tx,250)}}],
 qb_farm:["Concurso — Farmacologia",qbGen("farm")],qb_leg:["Concurso — Legislação e ética",qbGen("leg")],qb_sp:["Concurso — Saúde pública e defesa sanitária",qbGen("sp")],qb_clin:["Concurso — Clínica de pequenos",qbGen("clin")],qb_grandes:["Concurso — Grandes animais",qbGen("grandes")],qb_anest:["Concurso — Anestesiologia",qbGen("anest")],qb_repro:["Concurso — Reprodução",qbGen("repro")],
 sim:["Simulado geral (20 questões)",()=>{if(Math.random()<0.6)return qbGen()();const k=pick(["farm","mec","ae","ci","dose","marca","onl","xl","ctl","inter","tox","toxs","derm","lab"]);return QUIZ_T[k][1]()},20],
 simfarm:["Simulado de Farmacologia (20)",()=>{if(Math.random()<0.4)return qbGen("farm")();return QUIZ_T[pick(["farm","mec","ae","ci","dose","marca","onl","xl","ctl","inter"])][1]()},20],
 erros:["Revisar meus erros",null]
});
const QZ_GROUPS=[["Farmacologia",["simfarm","qb_farm","farm","mec","ae","ci","dose","marca","onl","xl","ctl","inter"]],["Estilo concurso / residência",["sim","qb_leg","qb_sp","qb_clin","qb_grandes","qb_anest","qb_repro"]],["Clínica, toxicologia e outros",["tox","toxs","derm","lab","repro","casos"]],["Revisão",["erros"]]];
{const r0=QUIZ_T.repro[1];QUIZ_T.repro=["Reprodução",()=>Math.random()<0.5?qbGen("repro")():r0()];}
