# Fontes do Léo Med Vet

O `index.html` da raiz é GERADO a partir destes arquivos:

- `app.html` — interface e lógica (template)
- `d1.js`–`d4.js` — monografias dos fármacos (doses por espécie)
- `usual.js` — dose inicial usual da calculadora
- `lab.js` — espécies com produto veterinário registrado (on-label) e gotas/mL
- `tox.js` — toxicologia e interações · `cases_new.js` / `orig_cases.json` — casos clínicos
- `firebase.json` (opcional, não versionado) — `{"apiKey":"..."}` ativa o login

Gerar: `node src/build.js index.html` · Testar: `node src/test.js` (requer Playwright)
