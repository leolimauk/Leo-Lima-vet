/* ================= Conta: controle de acesso, teste grátis, administração, exclusão e novidades ================= */
const APP_VER="1.0";
// Contas criadas no Firebase ANTES desta data continuam liberadas sem cadastro em "usuarios" (assinantes antigos).
const ACC_CUTOFF=Date.parse("2026-11-26T12:00:00Z");
const FS_BASE="https://firestore.googleapis.com/v1/projects/";
const NEWS_V="2026-11c";
const NEWS=[["🐾","Pacientes e prontuário","Ficha do animal, atendimentos, gráfico de peso, vacinas aplicadas e fotos pela câmera."],
 ["💉","Lembrete de vacina no WhatsApp","Gere a mensagem com as próximas doses e envie direto para o tutor."],
 ["📄","Receita em PDF pelo WhatsApp","Compartilhe a receita em PDF (ou texto) sem precisar imprimir."],
 ["🧰","Materiais e instrumentos","Instrumental cirúrgico, insumos e equipamentos com fotos reais, tamanhos e dicas."],
 ["📷","Fotos reais","Dermatologia e radiologia agora com fotos e radiografias reais (com crédito dos autores)."],
 ["👤","Conta e suporte","Alterar senha, excluir conta, política de privacidade e versão do app em Ajustes."]];

/* ---------- utilidades ---------- */
function accGetAuth(){return store.get("auth",null)}
function waNum(t){let d=String(t||"").replace(/\D/g,"");if(!d)return"";if(d.length<=11)d="55"+d.replace(/^0+/,"");return d}
function waLink(tel,txt){return "https://wa.me/"+waNum(tel)+"?text="+encodeURIComponent(txt)}
function openExt(url){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}
function rndPass(){const c="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";const r=new Uint32Array(8);(crypto.getRandomValues?crypto.getRandomValues(r):r.forEach((_,i)=>r[i]=Math.random()*1e9));r.forEach(x=>s+=c[x%c.length]);return s}
function dLong(ms){return new Date(ms).toLocaleDateString("pt-BR")}
async function accPid(){let p=store.get("pid","");if(p)return p;try{const r=await fetch("https://identitytoolkit.googleapis.com/v1/projects?key="+FB.apiKey);const j=await r.json();if(j.projectId){store.set("pid",j.projectId);return j.projectId}}catch(e){}return ""}

/* ---------- verificação de acesso (chamada após validar o login) ---------- */
async function accCreated(){try{const T=await apxTok();const j=await idt("lookup",{idToken:T.tok});return +((j.users&&j.users[0]&&j.users[0].createdAt)||0)}catch(e){return 0}}
async function accCheck(force){const a=accGetAuth();if(!a)return;
 if(!force&&a.accT&&Date.now()-a.accT<30*60e3){accApply();return}
 let acc;
 try{const T=await apxTok();store.set("pid",T.pid);const j=await apxFS("GET","usuarios/"+encodeURIComponent(a.email.toLowerCase()));const f=j.fields||{};
  acc={st:f.ativo&&f.ativo.booleanValue===false?"off":"ok",exp:f.expira&&f.expira.timestampValue?Date.parse(f.expira.timestampValue):0,trial:!!(f.trial&&f.trial.booleanValue)}}
 catch(e){
  if(e.status===404){const c=await accCreated();acc=(!c||c<ACC_CUTOFF)?{st:"ok",legacy:1}:{st:"novo"}}
  else if(e.status===403){acc={st:"ok",legacy:1}} // regras antigas no Firestore: mantém o comportamento anterior
  else{accApply();return}} // sem internet: usa o último estado salvo
 const b=accGetAuth();if(!b||b.email!==a.email)return;b.acc=acc;b.accT=Date.now();store.set("auth",b);
 if(acc.legacy)ownerCheck();
 accApply()}
function accBlockMsg(acc){if(!acc)return"";if(acc.st==="off")return"Seu acesso foi desativado. Fale com o administrador.";
 if(acc.st==="novo")return"Esta conta ainda não foi liberada pelo administrador.";
 if(acc.exp&&acc.exp<Date.now())return acc.trial?"Seu teste grátis terminou em "+dLong(acc.exp)+". Para continuar usando o Clínica Vet Pro, fale com o administrador.":"Seu acesso expirou em "+dLong(acc.exp)+". Fale com o administrador para renovar.";return""}
function accApply(){const a=accGetAuth();if(!a||!a.acc)return;const m=accBlockMsg(a.acc);
 if(m){const em=a.email;store.set("auth",null);S.apx=null;S.apxT=null;showLogin(m,true);const i=document.getElementById("lgE");if(i)i.value=em}}
function accBanner(){const a=accGetAuth();if(!a||!a.acc||!a.acc.exp)return"";const d=Math.ceil((a.acc.exp-Date.now())/864e5);if(d>15)return"";
 return '<div class="note '+(d<=2?"warn":"info")+'">'+(a.acc.trial?"🎁 <b>Teste grátis:</b> ":"⏳ <b>Seu acesso:</b> ")+(d<=0?"termina hoje":"faltam <b>"+d+" dia"+(d>1?"s":"")+"</b>")+" (até "+dLong(a.acc.exp)+").</div>"}
async function ownerCheck(){try{await apxFS("GET","compradores?pageSize=1");if(!store.get("owner",false)){store.set("owner",true);rerender()}}catch(e){if(e.status===403&&store.get("owner",false)){store.set("owner",false);rerender()}}}

/* ---------- login: esqueci a senha e teste grátis ---------- */
async function lgReset(){const em=(document.getElementById("lgE").value||"").trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){showLogin("Digite seu e-mail no campo acima e toque em “Esqueci minha senha”.",true);return}
 try{await idt("sendOobCode",{requestType:"PASSWORD_RESET",email:em});showLogin("Enviamos um link para redefinir a senha para "+em+". Confira também a caixa de spam.")}catch(e){showLogin(e instanceof TypeError?"Sem conexão com a internet.":authMsg(e.message),true)}}
async function lgCfg(){const el=document.getElementById("lgTrial");if(!el)return;let d=7;if(document.getElementById("lgForm").style.display!=="none")el.style.display="block";
 try{const pid=await accPid();if(pid){const r=await fetch(FS_BASE+pid+"/databases/(default)/documents/config/app",{cache:"no-store"});if(r.ok){const j=await r.json();const v=j.fields&&j.fields.trialDias;if(v)d=+(v.integerValue||v.doubleValue||0)}}}catch(e){}
 S.trialD=d;el.style.display=d>0?"block":"none";const t=document.getElementById("lgTrialD");if(t)t.textContent=d}
function lgMode(m){document.getElementById("lgForm").style.display=m==="in"?"":"none";document.getElementById("lgSign").style.display=m==="up"?"":"none";document.getElementById("lgTrial").style.display=m==="in"&&(S.trialD==null?7:S.trialD)>0?"block":"none";document.getElementById("lgErr").style.display="none"}
async function lgSignup(){const g=k=>(document.getElementById(k).value||"").trim();const nome=g("suN"),em=g("suE").toLowerCase(),pw=document.getElementById("suP").value,b=document.getElementById("suBtn");
 if(nome.length<3){showLogin("Informe seu nome.",true);return}if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){showLogin("E-mail inválido.",true);return}if(pw.length<6){showLogin("A senha precisa ter pelo menos 6 caracteres.",true);return}
 if(store.get("trialUsed",0)){showLogin("Este aparelho já usou o teste grátis. Fale com o administrador para assinar.",true);return}
 if(!document.getElementById("suOk").checked){showLogin("Aceite a Política de Privacidade para continuar.",true);return}
 b.disabled=true;b.textContent="Criando conta...";
 try{const j=await idt("signUp",{email:em,password:pw,returnSecureToken:true});const pid=jwt(j.idToken).aud;store.set("pid",pid);const dias=S.trialD||7;
  try{await fetch(FS_BASE+pid+"/databases/(default)/documents/usuarios/"+encodeURIComponent(em)+"?currentDocument.exists=false",{method:"PATCH",headers:{"Authorization":"Bearer "+j.idToken,"Content-Type":"application/json"},
   body:JSON.stringify({fields:{ativo:{booleanValue:true},trial:{booleanValue:true},nome:{stringValue:nome.slice(0,80)},expira:{timestampValue:new Date(Date.now()+dias*864e5).toISOString()}}})})}catch(e){}
  store.set("trialUsed",Date.now());await loginOk(j);toast("Conta criada! Seu teste grátis começou.")}
 catch(e){showLogin(e instanceof TypeError?"Sem conexão com a internet.":(/EMAIL_EXISTS/.test(e.message)?"Este e-mail já tem conta. Use “Entrar”.":/WEAK_PASSWORD/.test(e.message)?"Senha fraca: use pelo menos 6 caracteres.":/OPERATION_NOT_ALLOWED|ADMIN_ONLY/.test(e.message)?"O cadastro de teste está desativado no momento.":authMsg(e.message)),true)}
 finally{b.disabled=false;b.textContent="Criar conta e começar"}}

/* ---------- painel do administrador ---------- */
function vAdmin(){if(!store.get("owner",false)){ownerCheck();return '<div class="empty">Área restrita ao administrador.</div>'}
 AFTER.push(admList);
 return '<div class="stack"><h1>Usuários</h1><p class="muted sm" style="margin:0">Crie logins para assinantes e testadores, defina vencimento e bloqueie quem parar de pagar. Tudo pelo celular.</p>'+
 '<div class="card"><h3>➕ Novo usuário</h3><div class="grid g2m" style="margin-top:8px"><div class="field"><label>Nome</label><input class="inp" id="adN" /></div><div class="field"><label>E-mail (login)</label><input class="inp" id="adE" type="email" autocomplete="off" /></div>'+
 '<div class="field"><label>Senha inicial</label><input class="inp" id="adP" value="'+rndPass()+'" /></div>'+selF("adT","Acesso",[["0","Assinante — sem vencimento"],["30","30 dias"],["90","90 dias"],["365","1 ano"],["14","Testador — 14 dias"],["7","Teste — 7 dias"]],"0","")+'</div>'+
 '<label class="row" style="gap:8px;margin-top:8px;cursor:pointer"><input type="checkbox" id="adA" style="width:20px;height:20px" /><span class="sm">Liberar também a <b>Apostila</b> <span class="xs muted">(não vale para teste/testador)</span></span></label>'+
 '<button class="btn pri block" id="adBtn" style="margin-top:10px" onclick="admCreate()">'+ic("plus",18)+' Criar acesso</button><div id="adOut"></div>'+
 '<p class="xs muted" style="margin:8px 0 0">Se o e-mail já tiver conta, o acesso é apenas liberado/atualizado (a senha atual da pessoa é mantida).</p></div>'+
 '<div class="card"><div class="row between"><h3>Usuários cadastrados</h3><button class="btn sm" onclick="admList()">Atualizar</button></div><div id="adList" class="list" style="margin-top:8px"><div class="empty">Carregando...</div></div>'+
 '<p class="xs muted" style="margin:8px 0 0">Assinantes antigos (criados direto no Firebase antes de 26/11/2026) continuam liberados mesmo sem aparecer aqui. Para controlar o vencimento deles, cadastre o e-mail acima.</p></div>'+
 '<div class="card"><h3>🎁 Teste grátis na tela de login</h3><p class="sm muted" style="margin:6px 0 10px">Quem baixar o app pode criar uma conta de teste sozinho. Use 0 para desligar.</p><div class="row" style="gap:8px"><input class="inp" id="adTD" type="number" min="0" max="7" style="max-width:110px" placeholder="7" /><span class="sm">dias</span><button class="btn" onclick="admTrial()">Salvar</button></div></div>'+
 '<a class="btn" href="#/apostila/admin">📚 Compradores da apostila</a></div>'}
async function admCreate(){const g=k=>(document.getElementById(k).value||"").trim();const nome=g("adN"),em=g("adE").toLowerCase(),pw=g("adP"),dias=+g("adT"),apx=document.getElementById("adA").checked&&!(+document.getElementById("adT").value>0&&+document.getElementById("adT").value<=14),b=document.getElementById("adBtn"),out=document.getElementById("adOut");
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast("E-mail inválido");return}if(pw.length<6){toast("Senha com no mínimo 6 caracteres");return}
 b.disabled=true;b.textContent="Criando...";let nova=true;
 try{try{await idt("signUp",{email:em,password:pw,returnSecureToken:true})}catch(e){if(/EMAIL_EXISTS/.test(e.message))nova=false;else throw e}
  const f={ativo:{booleanValue:true},trial:{booleanValue:dias>0&&dias<=14},nome:{stringValue:nome},criado:{timestampValue:new Date().toISOString()}};
  if(dias>0)f.expira={timestampValue:new Date(Date.now()+dias*864e5).toISOString()};
  await apxFS("PATCH","usuarios/"+encodeURIComponent(em)+(dias>0?"":"?updateMask.fieldPaths=ativo&updateMask.fieldPaths=trial&updateMask.fieldPaths=nome&updateMask.fieldPaths=criado&updateMask.fieldPaths=expira"),{fields:f});
  if(apx)await apxFS("PATCH","compradores/"+encodeURIComponent(em),{fields:{ativo:{booleanValue:true},desde:{timestampValue:new Date().toISOString()}}});
  const msg="Olá"+(nome?", "+nome.split(" ")[0]:"")+"! Seu acesso ao app Clínica Vet Pro está liberado.\n\nE-mail: "+em+(nova?"\nSenha: "+pw:"\nSenha: a mesma que você já usa")+(dias>0?"\nVálido até: "+dLong(Date.now()+dias*864e5):"")+"\n\nBaixe o app e entre com esses dados. Só é permitido um aparelho por vez.";
  S.admMsg=msg;out.innerHTML='<div class="out" style="margin-top:10px"><div class="lbl">'+(nova?"Conta criada":"Acesso liberado (conta já existia)")+'</div><pre class="sm" style="white-space:pre-wrap;margin:6px 0">'+esc(msg)+'</pre><div class="actions"><button class="btn" onclick="copy(S.admMsg)">'+ic("copy",18)+' Copiar</button><button class="btn pri" onclick="openExt(waLink(\'\',S.admMsg))">Enviar no WhatsApp</button></div></div>';
  document.getElementById("adE").value="";document.getElementById("adN").value="";document.getElementById("adP").value=rndPass();admList()}
 catch(e){out.innerHTML='<div class="note bad" style="margin-top:10px">Erro: '+esc(e.message)+(e.status===403?" — atualize as Regras do Firestore (veja as instruções do desenvolvedor).":"")+'</div>'}
 finally{b.disabled=false;b.innerHTML=ic("plus",18)+" Criar acesso"}}
async function admList(){const el=document.getElementById("adList");if(!el)return;
 try{const j=await apxFS("GET","usuarios?pageSize=500");const L=(j.documents||[]).map(d=>{const f=d.fields||{};return{em:decodeURIComponent(d.name.split("/").pop()),nome:(f.nome||{}).stringValue||"",on:!(f.ativo&&f.ativo.booleanValue===false),exp:f.expira&&f.expira.timestampValue?Date.parse(f.expira.timestampValue):0,trial:!!(f.trial&&f.trial.booleanValue)}}).sort((a,b)=>a.em.localeCompare(b.em));
  S.admL=L;const now=Date.now();
  el.innerHTML=L.length?L.map((u,i)=>{const st=!u.on?'<span class="tag t-bad">Bloqueado</span>':u.exp&&u.exp<now?'<span class="tag t-bad">Expirado '+dLong(u.exp)+'</span>':u.exp?'<span class="tag '+(u.trial?"t-info":"t-warn")+'">'+(u.trial?"Teste":"Ativo")+' até '+dLong(u.exp)+'</span>':'<span class="tag t-ok">Assinante</span>';
   return '<div class="item"><div class="row between wrapf" style="gap:6px"><div><div class="t">'+esc(u.nome||u.em)+'</div><div class="xs muted">'+esc(u.em)+'</div></div>'+st+'</div><div class="row wrapf" style="gap:6px;margin-top:8px"><button class="btn sm" onclick="admExt('+i+',30)">+30 dias</button><button class="btn sm" onclick="admExt('+i+',0)">Sem vencimento</button><button class="btn sm" onclick="admOn('+i+')">'+(u.on?"Bloquear":"Desbloquear")+'</button><button class="btn sm ghost" onclick="admReset('+i+')">Redefinir senha</button></div></div>'}).join(""):'<div class="empty">Nenhum usuário cadastrado pelo app ainda.</div>'}
 catch(e){el.innerHTML='<div class="empty">Erro: '+esc(e.message)+(e.status===403?" — atualize as Regras do Firestore.":"")+'</div>'}}
async function admPatch(em,f){const m=Object.keys(f).map(k=>"updateMask.fieldPaths="+k).join("&");await apxFS("PATCH","usuarios/"+encodeURIComponent(em)+"?"+m,{fields:f})}
async function admExt(i,d){const u=S.admL[i];try{if(d===0){await apxFS("PATCH","usuarios/"+encodeURIComponent(u.em)+"?updateMask.fieldPaths=expira&updateMask.fieldPaths=trial",{fields:{trial:{booleanValue:false}}})}
 else{const base=Math.max(Date.now(),u.exp||0);await admPatch(u.em,{expira:{timestampValue:new Date(base+d*864e5).toISOString()},trial:{booleanValue:false}})}toast("Acesso atualizado");admList()}catch(e){toast("Erro: "+e.message)}}
async function admOn(i){const u=S.admL[i];if(u.on&&!confirm("Bloquear "+u.em+"? A pessoa perde o acesso na próxima verificação (até 30 min, ou ao abrir o app)."))return;try{await admPatch(u.em,{ativo:{booleanValue:!u.on}});toast(u.on?"Usuário bloqueado":"Usuário desbloqueado");admList()}catch(e){toast("Erro: "+e.message)}}
async function admReset(i){const u=S.admL[i];try{await idt("sendOobCode",{requestType:"PASSWORD_RESET",email:u.em});toast("E-mail de redefinição enviado para "+u.em)}catch(e){toast("Erro: "+e.message)}}
async function admTrial(){const d=Math.max(0,Math.min(7,Math.round(num(document.getElementById("adTD").value))));try{await apxFS("PATCH","config/app",{fields:{trialDias:{integerValue:String(d)}}});toast(d?"Teste grátis: "+d+" dias":"Teste grátis desligado")}catch(e){toast("Erro: "+e.message)}}

/* ---------- Ajustes: conta e suporte ---------- */
function accStatusTxt(){const a=accGetAuth();if(!a)return"";const c=a.acc||{};if(c.exp)return (c.trial?"Teste grátis até ":"Acesso válido até ")+dLong(c.exp);return store.get("owner",false)?"Administrador":"Assinante"}
function vConta(){const a=accGetAuth();const PAGES="https://leolimauk.github.io/Leo-Lima-vet/legal/";
 return '<div class="card"><h3>Conta e suporte</h3>'+(a?'<p class="sm" style="margin:6px 0 2px">Conectado como <b>'+esc(a.email)+'</b></p><p class="xs muted" style="margin:0 0 10px">'+esc(accStatusTxt())+'</p>'+
  '<div class="row wrapf" style="gap:8px"><button class="btn" onclick="accPwd()">Alterar senha</button><button class="btn" onclick="logout()">Sair da conta</button>'+(store.get("owner",false)?'<a class="btn" href="#/admin">👥 Usuários</a>':"")+'</div>':"")+
 '<div class="list" style="margin-top:12px"><a class="item" href="'+PAGES+'privacidade.html" target="_blank" rel="noopener"><div class="t">Política de Privacidade</div></a><a class="item" href="'+PAGES+'excluir-conta.html" target="_blank" rel="noopener"><div class="t">Como excluir a conta e os dados</div></a><a class="item" href="javascript:void(0)" onclick="newsShow(true)"><div class="t">Novidades desta versão</div></a></div>'+
 (a?'<button class="btn" style="margin-top:12px;color:var(--bad)" onclick="accDelAsk()">'+ic("trash",18)+' Excluir minha conta</button>':"")+
 '<p class="xs muted" style="margin:12px 0 0">Clínica Vet Pro · versão '+APP_VER+'</p></div>'}
async function accPwd(){const a=accGetAuth();if(!a)return;if(!confirm("Enviar um link para "+a.email+" para criar uma nova senha?"))return;try{await idt("sendOobCode",{requestType:"PASSWORD_RESET",email:a.email});toast("Link enviado para "+a.email)}catch(e){toast("Erro: "+(e instanceof TypeError?"sem internet":e.message))}}
function accDelAsk(){const a=accGetAuth();if(!a)return;const ov=document.createElement("div");ov.id="delOv";ov.className="lg show";ov.style.zIndex=200;
 ov.innerHTML='<div class="box"><h2 style="margin:0 0 8px">Excluir minha conta</h2><p class="sm">Isto apaga <b>definitivamente</b> a sua conta ('+esc(a.email)+') e a liberação de acesso. Os dados salvos neste aparelho (pacientes, fotos, receitas, favoritos) também serão apagados. Esta ação não pode ser desfeita.</p><div class="field" style="margin-top:10px"><label>Confirme sua senha</label><input class="inp" id="delP" type="password" autocomplete="current-password" /></div><div class="note bad" id="delErr" style="display:none;margin-top:8px"></div><div class="row" style="gap:8px;margin-top:12px"><button class="btn" style="flex:1" onclick="document.getElementById(\'delOv\').remove()">Cancelar</button><button class="btn pri" id="delBtn" style="flex:1;background:var(--bad);border-color:var(--bad)" onclick="accDel()">Excluir</button></div></div>';
 document.body.appendChild(ov)}
async function accDel(){const a=accGetAuth(),pw=document.getElementById("delP").value,b=document.getElementById("delBtn"),er=document.getElementById("delErr");if(!pw){er.textContent="Digite a senha.";er.style.display="block";return}
 b.disabled=true;b.textContent="Excluindo...";
 try{const j=await idt("signInWithPassword",{email:a.email,password:pw,returnSecureToken:true});const pid=jwt(j.idToken).aud;
  try{await fetch(FS_BASE+pid+"/databases/(default)/documents/usuarios/"+encodeURIComponent(a.email.toLowerCase()),{method:"DELETE",headers:{"Authorization":"Bearer "+j.idToken}})}catch(e){}
  await idt("delete",{idToken:j.idToken});
  try{Object.keys(localStorage).filter(k=>k.startsWith("lmv_")&&k!=="lmv_trialUsed"&&k!=="lmv_data").forEach(k=>localStorage.removeItem(k))}catch(e){}
  try{APXDB.wipe()}catch(e){}try{indexedDB.deleteDatabase("lmv_fotos")}catch(e){}
  document.getElementById("delOv").remove();S.apx=null;S.apxT=null;S.pac=null;location.hash="#/";showLogin("Sua conta foi excluída. Obrigado por usar o Clínica Vet Pro.")}
 catch(e){er.textContent=e instanceof TypeError?"Sem conexão com a internet.":authMsg(e.message);er.style.display="block";b.disabled=false;b.textContent="Excluir"}}

/* ---------- novidades da versão ---------- */
function newsShow(force){if(!force&&(store.get("newsSeen","")===NEWS_V||!accGetAuth()))return;store.set("newsSeen",NEWS_V);if(document.getElementById("newsOv"))return;
 const ov=document.createElement("div");ov.id="newsOv";ov.className="lg show";ov.style.zIndex=150;
 ov.innerHTML='<div class="box"><div class="xs" style="letter-spacing:.2em;font-weight:800;color:var(--accent,#0d9488)">NOVIDADES</div><h2 style="margin:4px 0 12px">O que há de novo</h2><div class="stack" style="gap:10px">'+NEWS.map(([e,t,d])=>'<div class="row" style="gap:12px;align-items:flex-start"><div style="font-size:26px;line-height:1">'+e+'</div><div><b>'+t+'</b><div class="sm muted">'+d+'</div></div></div>').join("")+'</div><button class="btn pri block" style="margin-top:16px" onclick="document.getElementById(\'newsOv\').remove()">Começar a usar</button></div>';
 document.body.appendChild(ov)}
