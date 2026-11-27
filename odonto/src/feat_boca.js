/* ================= Desenhos de localização da lesão (5 vistas) e dentes do odontograma ================= */
const BK="#1f2937",BM="#fdecec",BL="#f7c9c9",BT="#ffffff";
function bkTeethArc(cx,cy,rx,ry,a0,a1,n,w,h,upper){let s="";const ws=[];for(let i=0;i<n;i++){const t=i/(n-1);ws.push(t)}
 for(let i=0;i<n;i++){const a=(a0+(a1-a0)*(i+.5)/n)*Math.PI/180,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);const mid=Math.abs(i-(n-1)/2)/((n-1)/2);const tw=w*(0.75+0.55*mid),th=h*(0.8+0.35*mid);const rot=a*180/Math.PI+90;
  s+='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot.toFixed(1)+')"><rect x="'+(-tw/2).toFixed(1)+'" y="'+(-th/2).toFixed(1)+'" width="'+tw.toFixed(1)+'" height="'+th.toFixed(1)+'" rx="'+(tw/3).toFixed(1)+'" fill="'+BT+'" stroke="'+BK+'" stroke-width="1.1"/>'+(mid>0.45?'<path d="M'+(-tw/4).toFixed(1)+' 0 L'+(tw/4).toFixed(1)+' 0 M0 '+(-th/4).toFixed(1)+' L0 '+(th/4).toFixed(1)+'" stroke="'+BK+'" stroke-width=".6" opacity=".6"/>':"")+'</g>'}return s}
function bkProfile(){ // perfil com boca aberta (olhando para a direita)
 return '<path d="M118 4 C121 20 136 38 154 54 C162 61 160 69 148 70 C143 70 139 67 136 66" fill="none" stroke="'+BK+'" stroke-width="1.6" stroke-linecap="round"/>'+
 '<path d="M139 58 C134 56 128 58 127 62" fill="none" stroke="'+BK+'" stroke-width="1.3"/><path d="M134 46 C130 44 124 46 123 51" fill="none" stroke="'+BK+'" stroke-width="1.1" opacity=".7"/>'+
 '<path d="M136 66 C146 70 153 76 151 85 C149 90 145 92 141 92" fill="none" stroke="'+BK+'" stroke-width="1.6" stroke-linecap="round"/>'+
 '<path d="M140 90 C150 100 156 122 154 146 C152 166 146 176 140 178" fill="none" stroke="'+BK+'" stroke-width="1.2" opacity=".35"/>'+
 '<path d="M144 92 C124 84 94 90 80 110 C70 128 72 152 84 168 C98 182 126 182 146 174 C155 150 154 112 144 92 Z" fill="'+BM+'" stroke="'+BK+'" stroke-width="1.6"/><path d="M144 92 C150 96 154 104 154 112 M146 174 C152 170 155 162 155 154" fill="none" stroke="'+BK+'" stroke-width="1.1"/>'+
 '<path d="M80 104 C92 98 110 96 128 98 C138 99 145 101 148 104" fill="none" stroke="'+BK+'" stroke-width="1"/>'+
 bkTeethRow(84,100,148,104,8,true)+bkTeethRow(86,164,146,160,8,false)+
 '<path d="M84 150 C96 132 120 126 140 138 C146 142 146 150 138 154 C120 162 98 162 84 156 Z" fill="'+BL+'" stroke="'+BK+'" stroke-width="1.3"/><path d="M92 146 C108 140 124 140 136 145" fill="none" stroke="'+BK+'" stroke-width=".7" opacity=".6"/>'+
 '<path d="M146 176 C152 182 152 190 149 197 C145 206 136 211 124 213" fill="none" stroke="'+BK+'" stroke-width="1.6" stroke-linecap="round"/><path d="M138 196 C134 199 132 203 133 207" fill="none" stroke="'+BK+'" stroke-width=".9" opacity=".6"/>'+
 '<path d="M124 212 C112 218 104 226 102 238 M124 212 C96 214 64 204 42 186 C30 176 24 160 24 146" fill="none" stroke="'+BK+'" stroke-width="1.6" stroke-linecap="round"/>'+
 '<path d="M74 118 C70 130 70 146 76 160" fill="none" stroke="'+BK+'" stroke-width=".8" opacity=".5"/>'}
function bkTeethRow(x0,y0,x1,y1,n,upper){let s="";for(let i=0;i<n;i++){const t=i/(n-1),x=x0+(x1-x0)*t,y=y0+(y1-y0)*t,w=10-3.5*t,h=upper?11+4*t:10+4*t;s+='<rect x="'+(x-w/2).toFixed(1)+'" y="'+(upper?y:y-h).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="2.5" fill="'+BT+'" stroke="'+BK+'" stroke-width="1"/>'}return s}
function bkFront(){ // boca aberta de frente: arcadas, palato e língua
 return '<path d="M100 6 C152 6 194 56 194 120 C194 186 152 234 100 234 C48 234 6 186 6 120 C6 56 48 6 100 6 Z" fill="#fbe3e3" stroke="'+BK+'" stroke-width="1.6"/>'+
 '<path d="M100 22 C144 22 178 64 178 120 C178 178 144 218 100 218 C56 218 22 178 22 120 C22 64 56 22 100 22 Z" fill="'+BM+'" stroke="'+BK+'" stroke-width="1.4"/>'+
 '<path d="M38 112 C38 60 66 34 100 34 C134 34 162 60 162 112 C140 128 60 128 38 112 Z" fill="#fff4f4" stroke="none"/>'+
 bkTeethArc(100,112,62,72,190,350,14,9,8,true)+
 '<path d="M100 48 L100 104" stroke="'+BK+'" stroke-width=".9"/>'+[0,1,2,3].map(i=>'<path d="M'+(100-4-i*2)+' '+(56+i*7)+' q-'+(9+i*3)+' -3 -'+(16+i*4)+' 3 M'+(100+4+i*2)+' '+(56+i*7)+' q'+(9+i*3)+' -3 '+(16+i*4)+' 3" fill="none" stroke="'+BK+'" stroke-width=".9"/>').join("")+
 '<path d="M70 104 C78 96 90 94 100 96 C110 94 122 96 130 104" fill="none" stroke="'+BK+'" stroke-width="1"/>'+
 '<path d="M95 104 C95 116 105 116 105 104" fill="#f3b0b0" stroke="'+BK+'" stroke-width="1.1"/>'+
 '<path d="M60 112 C64 124 70 128 78 128 M140 112 C136 124 130 128 122 128" fill="none" stroke="'+BK+'" stroke-width="1"/>'+
 '<path d="M54 140 C60 124 80 118 100 118 C120 118 140 124 146 140 C150 160 140 182 100 184 C60 182 50 160 54 140 Z" fill="'+BL+'" stroke="'+BK+'" stroke-width="1.3"/>'+
 '<path d="M100 124 L100 176" stroke="'+BK+'" stroke-width=".8" opacity=".6"/>'+
 bkTeethArc(100,132,60,64,20,160,14,9,8,false)}
function bkTongue(){ // dorso da língua com epiglote e tonsilas
 let pap="";for(let r=0;r<4;r++)for(let c=0;c<6-Math.abs(r-1);c++){const x=58+c*9+Math.abs(r-1)*4.5+(r%2)*2,y=58+r*9;pap+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="#fde2e2" stroke="'+BK+'" stroke-width=".8"/>'}
 let fung="";for(let i=0;i<34;i++){const x=56+((i*37)%52),y=104+((i*53)%96);fung+='<circle cx="'+x+'" cy="'+y+'" r="1" fill="'+BK+'" opacity=".55"/>'}
 return '<path d="M62 6 C62 0 98 0 98 6 L98 26 C98 32 62 32 62 26 Z" fill="#fff4f4" stroke="'+BK+'" stroke-width="1.3"/><path d="M80 4 L80 28" stroke="'+BK+'" stroke-width=".9"/>'+
 '<path d="M44 26 C56 20 104 20 116 26 L120 40 C100 34 60 34 40 40 Z" fill="#fde2e2" stroke="'+BK+'" stroke-width="1.1"/>'+
 '<ellipse cx="24" cy="56" rx="13" ry="18" fill="#fde2e2" stroke="'+BK+'" stroke-width="1.2"/><ellipse cx="136" cy="56" rx="13" ry="18" fill="#fde2e2" stroke="'+BK+'" stroke-width="1.2"/>'+[0,1,2].map(i=>'<circle cx="'+(20+i*4)+'" cy="'+(50+i*6)+'" r="2.5" fill="none" stroke="'+BK+'" stroke-width=".7"/><circle cx="'+(140-i*4)+'" cy="'+(50+i*6)+'" r="2.5" fill="none" stroke="'+BK+'" stroke-width=".7"/>').join("")+
 '<path d="M38 46 C38 38 122 38 122 46 L126 170 C128 214 106 236 80 236 C54 236 32 214 34 170 Z" fill="'+BL+'" stroke="'+BK+'" stroke-width="1.6"/>'+pap+
 '<path d="M44 92 L80 100 L116 92" fill="none" stroke="'+BK+'" stroke-width="1.2"/>'+[0,1,2,3,4,5,6].map(i=>{const x=50+i*10,y=92+(i<=3?i*2.4:(6-i)*2.4);return '<circle cx="'+x+'" cy="'+y+'" r="3.4" fill="#fff" stroke="'+BK+'" stroke-width="1"/>'}).join("")+
 '<path d="M80 104 L80 214" stroke="'+BK+'" stroke-width=".9" opacity=".7"/>'+fung}
function bkVentral(){ // boca aberta com ventre da língua e assoalho
 return '<path d="M100 6 C152 6 194 56 194 120 C194 186 152 234 100 234 C48 234 6 186 6 120 C6 56 48 6 100 6 Z" fill="#fbe3e3" stroke="'+BK+'" stroke-width="1.6"/>'+
 '<path d="M100 22 C144 22 178 64 178 120 C178 178 144 218 100 218 C56 218 22 178 22 120 C22 64 56 22 100 22 Z" fill="'+BM+'" stroke="'+BK+'" stroke-width="1.4"/>'+
 [0,1,2,3,4,5,6,7].map(i=>{const x=58+i*12;return '<rect x="'+(x-5)+'" y="'+(26+Math.abs(i-3.5)*1.6)+'" width="10" height="'+(16-Math.abs(i-3.5)*1.2)+'" rx="2.5" fill="'+BT+'" stroke="'+BK+'" stroke-width="1"/>'}).join("")+
 '<path d="M44 66 C56 46 144 46 156 66 C168 100 160 150 128 172 C116 180 84 180 72 172 C40 150 32 100 44 66 Z" fill="'+BL+'" stroke="'+BK+'" stroke-width="1.5"/>'+
 '<path d="M100 60 L100 176" stroke="'+BK+'" stroke-width="1.2"/><path d="M86 70 C80 100 82 140 90 172 M114 70 C120 100 118 140 110 172" fill="none" stroke="#7c3aed" stroke-width="1.1" opacity=".55"/>'+
 '<path d="M66 82 C60 110 66 140 80 160 M134 82 C140 110 134 140 120 160" fill="none" stroke="'+BK+'" stroke-width=".8" stroke-dasharray="3 3" opacity=".7"/>'+
 '<path d="M64 176 C80 186 120 186 136 176" fill="none" stroke="'+BK+'" stroke-width="1"/><circle cx="94" cy="180" r="2.4" fill="#fff" stroke="'+BK+'" stroke-width="1"/><circle cx="106" cy="180" r="2.4" fill="#fff" stroke="'+BK+'" stroke-width="1"/>'+
 bkTeethArc(100,140,64,64,25,155,12,9,8,false)}
const BOCA_V=[["Perfil direito","0 0 200 240",()=>bkProfile()],["Boca aberta — arcadas e palato","0 0 200 240",()=>bkFront()],["Dorso da língua","0 0 160 240",()=>bkTongue()],["Ventre da língua e assoalho","0 0 200 240",()=>bkVentral()],["Perfil esquerdo","0 0 200 240",()=>'<g transform="translate(200 0) scale(-1 1)">'+bkProfile()+'</g>']];
function bocaSVG(v,marks,inter,h){const V=BOCA_V[v];const M=(marks||[]).map((m,i)=>[m,i]).filter(([m])=>m.v===v);
 return '<svg viewBox="'+V[1]+'" style="width:100%;height:'+(h||220)+'px;display:block'+(inter?";cursor:crosshair;touch-action:manipulation":"")+'" '+(inter?'onclick="bocaClick(event,'+v+')"':"")+' role="img" aria-label="'+V[0]+'">'+V[2]()+
 M.map(([m,i])=>'<g pointer-events="none"><circle cx="'+m.x+'" cy="'+m.y+'" r="8" fill="#dc2626" stroke="#fff" stroke-width="1.5"/><text x="'+m.x+'" y="'+(m.y+3.6)+'" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">'+(i+1)+'</text></g>').join("")+'</svg>'}
function bocaClick(ev,v){const svg=ev.currentTarget,pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());
 const p=prP(S.fcId);if(!p)return;const E=((p.fc||(p.fc={})).ex||(p.fc.ex={}));(E.mk||(E.mk=[])).push({v,x:+q.x.toFixed(1),y:+q.y.toFixed(1),t:""});p.up=Date.now();prSave();rerender()}
function vBocaMap(p){const mk=((p.fc||{}).ex||{}).mk||[];
 return '<div class="card"><h3>Localização da lesão</h3><p class="xs muted" style="margin:4px 0 8px">Toque no ponto exato da lesão no desenho. Cada marcação recebe um número; descreva-a abaixo.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">'+BOCA_V.map((V,i)=>'<div style="border:1px solid var(--line);border-radius:12px;padding:6px;background:#fff">'+bocaSVG(i,mk,1,190)+'<div class="xs" style="text-align:center;font-weight:700;color:#334155;margin-top:2px">'+V[0]+'</div></div>').join("")+'</div>'+
 (mk.length?'<div class="list" style="margin-top:10px">'+mk.map((m,i)=>'<div class="item" style="display:flex;gap:8px;align-items:center"><span style="flex:none;width:24px;height:24px;border-radius:12px;background:#dc2626;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:12px">'+(i+1)+'</span><input class="inp" style="flex:1" data-p="fc.ex.mk.'+i+'.t" value="'+esc(m.t||"")+'" oninput="fcS(this)" placeholder="'+esc(BOCA_V[m.v][0])+' — descreva (ex.: úlcera 5 mm)" /><button class="btn sm ghost" onclick="const p=prP(S.fcId);p.fc.ex.mk.splice('+i+',1);prSave();rerender()">'+ic("trash",14)+'</button></div>').join("")+'</div>':"")+'</div>'}
function bocaPrint(p){const mk=((p.fc||{}).ex||{}).mk||[];return '<div style="display:flex;gap:4px;justify-content:space-between;margin:6px 0">'+BOCA_V.map((V,i)=>'<div style="flex:1;text-align:center">'+bocaSVG(i,mk,0,120)+'</div>').join("")+'</div>'+(mk.length?'<p style="font-size:12px">'+mk.map((m,i)=>'<b>'+(i+1)+'</b> ('+esc(BOCA_V[m.v][0])+'): '+esc(m.t||"—")).join("<br/>")+'</p>':"")}

/* ---------- desenho dos dentes (vista vestibular) para o odontograma ---------- */
function dtType(n){const u=n%10;return u<=2?"inc":u===3?"can":u<=5?"pm":"mol"}
function dtSVG(n,w,h){const up=[1,2,5,6].includes(Math.floor(n/10)),t=dtType(n),dec=Math.floor(n/10)>=5;let crown,root;
 if(t==="inc"){crown="M9 40 L23 40 L25 64 Q16 70 7 64 Z";root="M9 40 Q12 12 16 4 Q20 12 23 40"}
 else if(t==="can"){crown="M8 38 L24 38 L26 58 L16 70 L6 58 Z";root="M8 38 Q12 6 16 0 Q20 6 24 38"}
 else if(t==="pm"){crown="M6 40 L26 40 Q30 54 26 64 Q21 66 16 61 Q11 66 6 64 Q2 54 6 40 Z";root="M7 40 Q11 12 16 4 Q21 12 25 40"}
 else{crown="M2 38 L30 38 Q33 52 29 64 Q24 69 19 63 Q16 67 13 63 Q8 69 3 64 Q-1 52 2 38 Z";root=up?"M4 38 Q2 18 8 6 Q12 18 12 38 M13 38 Q14 14 17 2 Q20 14 20 38 M20 38 Q20 18 25 6 Q31 18 28 38":"M4 38 Q4 16 9 4 Q14 18 14 38 M18 38 Q19 18 23 4 Q29 16 28 38"}
 const g='<path d="'+root+'" fill="#fff" stroke="'+BK+'" stroke-width="1.3" stroke-linejoin="round"/><path d="'+crown+'" fill="#fff" stroke="'+BK+'" stroke-width="1.4" stroke-linejoin="round"/>'+(t==="mol"||t==="pm"?'<path d="M12 52 L16 56 L20 52 M16 56 L16 60" fill="none" stroke="'+BK+'" stroke-width=".8"/>':"");
 const sc=dec?.82:1;return '<svg viewBox="0 0 32 72" width="'+w+'" height="'+h+'"><g transform="'+(up?"":"translate(0 72) scale(1 -1)")+' translate('+(16-16*sc)+' '+(up?72-72*sc:0)+') scale('+sc+')">'+g+'</g></svg>'}
