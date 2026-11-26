# Clínica Odonto Pro — fontes

`odonto/index.html` é GERADO a partir destes arquivos:

- `app.html` — interface (derivada do app veterinário via `patch.py`, já aplicado)
- `o1.js`–`o4.js` — bulário (perfis: ad, ped, ges, lac, ido, ren, hep)
- `urg.js` — urgências médicas · `cases.js` — casos clínicos · `inter.js` — interações
- `logo.svg` / `logo.uri` — logo · `firebase.json` (opcional) — `{"apiKey":"..."}` ativa o login

Gerar: `node odonto/src/build.js odonto/index.html` · Testar: `node odonto/src/test.js`
