# Fontes do Léo Med Vet

O `index.html` da raiz é GERADO a partir destes arquivos:

- `app.html` — interface e lógica (template)
- `d1.js`–`d4.js` — monografias dos fármacos (doses por espécie)
- `usual.js` — dose inicial usual da calculadora
- `lab.js` — espécies com produto veterinário registrado (on-label) e gotas/mL
- `tox.js` — toxicologia e interações · `cases_new.js` / `orig_cases.json` — casos clínicos
- `firebase.json` — `{"apiKey":"..."}` (chave pública do Firebase) ativa o login; usuários são gerenciados no console do Firebase

Gerar: `node src/build.js index.html` · Testar: `node src/test.js` (requer Playwright)
- `vet_diag.js` — diagnóstico por queixa principal (QX) e dermatologia (DERM)
- `feat_vet.js` — telas de Diagnósticos, assistentes (anemia, diarreia, IRIS, ACVIM), Dermatologia, Odontograma Triadan, Escalas e calculadoras extras (injetado no lugar de `/*__FEAT__*/`)
