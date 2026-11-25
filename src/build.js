// Monta o index.html final a partir do template + dados
const fs = require("fs"), path = require("path");
const dir = __dirname;
const rd = f => fs.readFileSync(path.join(dir, f), "utf8");
global.D = [];
for (const f of ["d1.js", "d2.js", "d3.js", "d4.js", "d5.js", "d6.js"]) eval(rd(f));
const dupN=D.map(d=>d.n).filter((x,i,a)=>a.indexOf(x)!==i);if(dupN.length)throw new Error("Fármacos duplicados: "+dupN);
const TOX = eval(rd("tox.js") + ";TOX");
const CASES_NEW = eval(rd("cases_new.js") + ";CASES_NEW");
const orig = JSON.parse(rd("orig_cases.json"));
const casesOrig = orig.cases.map(c => ({ sp: c.species, spec: c.specialty, title: c.title, ctx: c.context, q: "Qual a sua conduta diagnóstica e terapêutica?", pts: c.points, take: "" }));
// corrige número da IN MAPA de controlados (2017)
const reg = orig.reg.map(r => r.id === "REG-01" ? { ...r, title: "IN MAPA nº 35/2017 — Comercialização de Substâncias Sujeitas a Controle Especial para Uso Veterinário (SIPEAGRO)" } : r);
eval(rd("lab.js")+";global.LAB=LAB;global.GT=GT");
const miss=Object.keys(LAB).filter(k=>!D.find(d=>d.n===k));if(miss.length)throw new Error("LAB sem fármaco: "+miss);
D.forEach(d=>{d.lab=LAB[d.n]||[];if(GT[d.n])d.gt=GT[d.n];});
eval(rd("usual.js")+";global.USUAL=USUAL");
for(const [n,m] of Object.entries(USUAL)){const d=D.find(x=>x.n===n);if(!d)throw new Error("USUAL sem fármaco: "+n);
 for(const [sp,v] of Object.entries(m)){const e=d.d[sp];if(!e||e[0]==null)throw new Error("USUAL sem dose: "+n+" "+sp);if(v<e[0]||v>e[1])throw new Error("USUAL fora da faixa: "+n+" "+sp+" "+v);e[5]=v;}}
eval(rd("inter.js")+";global.IG=IG;global.INTER=INTER");
const names=new Set(D.map(d=>d.n));
for(const [g,l] of Object.entries(IG))for(const n of l)if(!names.has(n))throw new Error("Grupo "+g+": fármaco inexistente '"+n+"'");
for(const r of INTER){for(const k of ["a","b"])if(!IG[r[k]]&&!names.has(r[k]))throw new Error("Interação com referência inválida: "+r[k]);if(!["Grave","Moderada","Leve"].includes(r.sev)||!["B","V","H"].includes(r.ev)||!r.mech||!r.eff||!r.cond)throw new Error("Interação incompleta: "+r.a+" x "+r.b);}
eval(rd("vet_diag.js")+";global.QX=QX;global.DERM=DERM");
for(const x of [...QX,...DERM])for(const f of x.far||[])if(!names.has(f))throw new Error((x.id)+": fármaco inexistente "+f);
const X = eval(rd("vet_extra.js")+";({LABREF,VAC,GEST,ASA,JEJUM,CHECK,MONIT})");
for(const x of X.LABREF){if(x.length!==8||!(x[3][0]<=x[3][1])||!(x[4][0]<=x[4][1]))throw new Error("LABREF inválido: "+x[0])}
for(const [k,g] of Object.entries(X.GEST))if(!(g[2][0]<=g[1]&&g[1]<=g[2][1]))throw new Error("GEST inválido: "+k);
const QB = eval(rd("quiz_bank.js")+";QB");
const AREAS=["farm","leg","sp","clin","grandes","anest","repro"];const seenQ=new Set();
for(const q of QB){if(!AREAS.includes(q[0])||typeof q[1]!=="string"||!Array.isArray(q[2])||q[2].length<3||new Set(q[2]).size!==q[2].length)throw new Error("Questão inválida: "+q[1]);if(seenQ.has(q[1]))throw new Error("Questão duplicada: "+q[1]);seenQ.add(q[1])}
const data = { v: Date.now(), qx: QX, derm: DERM, drugs: D, ig: IG, inter: INTER, tox: TOX, cases: casesOrig.concat(CASES_NEW), reg, labref: X.LABREF, vac: X.VAC, gest: X.GEST, asa: X.ASA, jejum: X.JEJUM, check: X.CHECK, monit: X.MONIT, qb: QB };
const ICONS = {
  back: "M15 18l-6-6 6-6", search: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M20 20l-4-4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z", sun: "M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4",
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  pill: "M10.5 20.5a5 5 0 0 1-7.07-7.07l10-10a5 5 0 0 1 7.07 7.07z M8.5 8.5l7 7",
  calc: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M8 6h8v4H8z M8.5 14h.01 M12 14h.01 M15.5 14h.01 M8.5 18h.01 M12 18h.01 M15.5 18h.01",
  alert: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h6",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z", starf: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  scale: "M12 3v18 M7 21h10 M5 7h14 M5 7l-3 7a3 3 0 0 0 6 0z M19 7l-3 7a3 3 0 0 0 6 0z",
  gear: "M4 6h10 M18 6h2 M4 12h4 M12 12h8 M4 18h12 M20 18h0 M16 4v4 M10 10v4 M16 16v4",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z M3 12h5l2-3 3 6 2-3h6",
  drop: "M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z",
  clock: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7v5l3 3",
  plus: "M12 5v14 M5 12h14", copy: "M9 9h11v11H9z M5 15H4V4h11v1",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6", print: "M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7 M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  blood: "M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z M9 14h6 M12 11v6", flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.9 1.4 2.8 2.5 2.8z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9z", flask: "M9 3h6 M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3 M7 15h10",
  ruler: "M3 17L17 3l4 4L7 21z M7 13l2 2 M10 10l2 2 M13 7l2 2", swap: "M7 4L3 8l4 4 M3 8h14 M17 20l4-4-4-4 M21 16H7",
  flask: "M9 3h6 M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3 M7 15h10",
  syringe: "M18 2l4 4 M17 7l3-3 M19 9l-8 8-4 1 1-4 8-8z M9 13l2 2 M2 22l5-5",
  clip: "M9 3h6v3H9z M9 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3 M8 11h8 M8 15h6",
  venus: "M12 3a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M12 13v8 M9 18h6",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  barn: "M3 21V10l9-6 9 6v11z M9 21v-6h6v6 M3 10h18",
  quiz: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17.5v.5",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  paw: "M7 9a2 2 0 1 0 0-4a2 2 0 1 0 0 4z M12 7a2 2 0 1 0 0-4a2 2 0 1 0 0 4z M17 9a2 2 0 1 0 0-4a2 2 0 1 0 0 4z M12 11c-4 0-6 4-6 6.5S8 21 12 19c4 2 6 1 6-1.5S16 11 12 11z",
  gauge: "M12 14l4-4 M3 14a9 9 0 0 1 18 0 M5 18h14",
  tooth: "M7 3c2 0 3 1 5 1s3-1 5-1c3 0 4 3 4 6 0 3-1 5-2 8-1 3-1 6-3 6s-2-4-3-7c-1 3-1 7-3 7s-2-3-3-6c-1-3-2-5-2-8 0-3 1-6 4-6z"
};
const logo = rd("logo.uri").trim();
const svg = n => `<svg class="i" viewBox="0 0 24 24"><path d="${ICONS[n]}"/></svg>`;
let html = rd("app.html").replace("/*__FEAT__*/", () => rd("feat_vet.js")+"\n"+rd("feat_vet2.js")+"\n"+rd("feat_vet3.js"));
const FBKEY=(()=>{try{return JSON.parse(rd("firebase.json")).apiKey||""}catch(e){return ""}})();
html=html.replace("__FB_KEY__",FBKEY);
const json = JSON.stringify(data).replace(/<\/(script)/gi, "<\\/$1").replace(new RegExp("[\\u2028\\u2029]","g"), " ");
html = html.split("__LOGO__").join(logo)
  .replace("__ICONS__", JSON.stringify(ICONS))
  .split("__I_BACK__").join(svg("back")).split("__I_SEARCH__").join(svg("search")).split("__I_MOON__").join(svg("moon")).split("__I_LOGOUT__").join(svg("logout"))
  .replace("/*__DATA__*/null", () => json);
const out = process.argv[2] || path.join(dir, "index.html");
fs.writeFileSync(out, html);
if(!process.argv[3]||process.argv[3]!=="--no-json")fs.writeFileSync(path.join(path.dirname(path.resolve(out)),"data.json"),JSON.stringify(data));
console.log("ok", out, (html.length / 1024).toFixed(0) + " KB", "drugs", D.length, "tox", TOX.length, "cases", data.cases.length);
