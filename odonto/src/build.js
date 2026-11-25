// Monta o index.html final a partir do template + dados
const fs = require("fs"), path = require("path");
const dir = __dirname;
const rd = f => fs.readFileSync(path.join(dir, f), "utf8");
global.D = [];
for (const f of ["o1.js", "o2.js", "o3.js", "o4.js"]) eval(rd(f));
const GT={"Dipirona (Metamizol)":20,"Paracetamol (Acetaminofeno)":15,"Ibuprofeno":10,"Diclofenaco (Sódico/Potássico)":30};D.forEach(d=>{if(GT[d.n])d.gt=GT[d.n]});
const dupN=D.map(d=>d.n).filter((x,i,a)=>a.indexOf(x)!==i);if(dupN.length)throw new Error("Duplicados: "+dupN);
const TOX = eval(rd("urg.js") + ";TOX");
const CASES = eval(rd("cases.js") + ";CASES");
eval(rd("inter.js")+";global.IG=IG;global.INTER=INTER");
const names=new Set(D.map(d=>d.n));
for(const [g,l] of Object.entries(IG))for(const n of l)if(!names.has(n))throw new Error("Grupo "+g+": fármaco inexistente '"+n+"'");
for(const r of INTER){for(const k of ["a","b"])if(!IG[r[k]]&&!names.has(r[k]))throw new Error("Interação inválida: "+r[k]);}
const PROF=["ad","ped","ges","lac","ido","ren","hep"];
for(const d of D){for(const k of Object.keys(d.d||{}))if(!PROF.includes(k))throw new Error("Perfil inválido "+k+" em "+d.n);for(const k of Object.keys(d.x||{}))if(!PROF.includes(k))throw new Error("x inválido "+k+" em "+d.n);}
const DIAG = eval(rd("diag.js") + ";DIAG");
for(const d of DIAG)for(const f of d.far||[])if(!names.has(f))throw new Error("Diagnóstico "+d.id+": fármaco inexistente "+f);
const data = { diag: DIAG, drugs: D, ig: IG, inter: INTER, tox: TOX, cases: CASES, reg: [] };
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
  tooth: "M7 3c2 0 3 1 5 1s3-1 5-1c3 0 4 3 4 6 0 3-1 5-2 8-1 3-1 6-3 6s-2-4-3-7c-1 3-1 7-3 7s-2-3-3-6c-1-3-2-5-2-8 0-3 1-6 4-6z",
  shield: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z M9 12l2 2 4-4",
  chart: "M3 3v18h18 M7 15l4-4 3 3 5-6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"
};
const logo = rd("logo.uri").trim();
const svg = n => `<svg class="i" viewBox="0 0 24 24"><path d="${ICONS[n]}"/></svg>`;
let html = rd("app.html").replace("/*__FEAT__*/", () => rd("feat_diag_perio.js"));
const FBKEY=(()=>{try{return JSON.parse(rd("firebase.json")).apiKey||""}catch(e){return ""}})();
html=html.replace("__FB_KEY__",FBKEY);
const json = JSON.stringify(data).replace(/<\/(script)/gi, "<\\/$1").replace(new RegExp("[\\u2028\\u2029]","g"), " ");
html = html.split("__LOGO__").join(logo)
  .replace("__ICONS__", JSON.stringify(ICONS))
  .split("__I_BACK__").join(svg("back")).split("__I_SEARCH__").join(svg("search")).split("__I_MOON__").join(svg("moon")).split("__I_LOGOUT__").join(svg("logout"))
  .replace("/*__DATA__*/null", () => json);
const out = process.argv[2] || path.join(dir, "index.html");
fs.writeFileSync(out, html);
console.log("ok", out, (html.length / 1024).toFixed(0) + " KB", "drugs", D.length, "tox", TOX.length, "cases", data.cases.length);
