// Espécies com produto VETERINÁRIO registrado (bula) — aproximação para o mercado brasileiro.
// Fármaco ausente deste mapa = apenas produto de uso humano → todo uso veterinário é extra-label.
const LAB = {
"Acepromazina":["dog","cat","horse"],"Xilazina":["dog","cat","horse","cattle","sr"],"Dexmedetomidina":["dog","cat"],"Detomidina":["horse","cattle"],"Romifidina":["horse"],
"Cetamina":["dog","cat","horse"],"Tiletamina + Zolazepam":["dog","cat"],"Alfaxalona":["dog","cat"],"Isoflurano":["dog","cat","horse"],"Sevoflurano":["dog","cat"],
"Lidocaína":["dog","cat","horse","cattle","sr","pig"],"Atipamezol":["dog","cat"],"Atropina":["dog","cat","horse","cattle","sr","pig"],"Guaifenesina (Éter gliceril guaiacol)":["horse"],
"Butorfanol":["dog","cat","horse"],"Buprenorfina":["dog","cat"],"Tramadol":["dog","cat"],"Dipirona (Metamizol)":["dog","cat","horse","cattle","sr","pig"],
"Gabapentina":[],"Pregabalina":["cat"],"Bedinvetmab":["dog"],"Frunevetmab":["cat"],
"Meloxicam":["dog","cat","horse","cattle","pig"],"Carprofeno":["dog","cattle"],"Cetoprofeno":["dog","cat","horse","cattle","pig"],"Flunixina Meglumina":["horse","cattle","pig","dog"],
"Fenilbutazona":["horse"],"Firocoxibe":["dog","horse"],"Robenacoxibe":["dog","cat"],"Mavacoxibe":["dog"],"Ácido Tolfenâmico":["dog","cat","cattle"],
"Prednisolona / Prednisona":["dog","cat"],"Dexametasona":["dog","cat","horse","cattle","sr","pig"],"Metilprednisolona":["dog","cat"],"Pivalato de Desoxicorticosterona (DOCP)":["dog"],
"Oclacitinibe":["dog"],"Lokivetmab":["dog"],"Ciclosporina":["dog","cat"],
"Amoxicilina":["dog","cat","cattle","sr","pig"],"Amoxicilina + Clavulanato":["dog","cat","cattle"],"Ampicilina":["dog","cat","cattle","pig"],
"Penicilina G Procaína / Benzatina":["dog","cat","horse","cattle","sr","pig"],"Cefalexina":["dog","cat"],"Cefadroxila":["dog","cat"],"Ceftiofur":["horse","cattle","sr","pig"],
"Cefovecina":["dog","cat"],"Cefquinoma":["cattle","pig","horse"],"Enrofloxacino":["dog","cat","cattle","pig","bird","rabbit"],"Marbofloxacino":["dog","cat","cattle","pig"],
"Pradofloxacino":["dog","cat"],"Doxiciclina":["dog","cat"],"Oxitetraciclina":["cattle","sr","pig"],"Sulfametoxazol/Sulfadiazina + Trimetoprima":["dog","cat","horse","cattle","sr","pig"],
"Metronidazol":["dog","cat"],"Clindamicina":["dog","cat"],"Tilosina":["cattle","pig"],"Tulatromicina":["cattle","pig"],"Florfenicol":["cattle","pig"],
"Gentamicina":["dog","cat","horse","cattle","pig"],"Itraconazol":["cat"],"Cetoconazol":["dog"],"Terbinafina":[],"Griseofulvina":["dog","cat"],
"Ivermectina":["dog","horse","cattle","sr","pig"],"Doramectina":["cattle","pig"],"Moxidectina":["cattle","horse","sr","dog","cat"],"Selamectina":["dog","cat"],
"Milbemicina Oxima":["dog","cat"],"Eprinomectina":["cattle"],"Fluralaner":["dog","cat"],"Afoxolaner":["dog"],"Sarolaner":["dog","cat"],"Lotilaner":["dog","cat"],
"Espinosade":["dog"],"Fipronil":["dog","cat"],"Imidacloprida":["dog","cat"],"Permetrina / Piretroides":["dog"],"Amitraz":["dog","cattle"],
"Praziquantel":["dog","cat","horse"],"Pirantel (Pamoato)":["dog","cat","horse"],"Fembendazol":["dog","cat","horse","cattle","sr","pig"],"Albendazol":["cattle","sr"],
"Levamisol":["cattle","sr","pig"],"Closantel":["sr","cattle"],"Toltrazurila":["cattle","sr","pig","bird"],"Imidocarb (Dipropionato)":["dog","cattle","horse"],
"Aceturato de Diminazeno":["dog","cattle","sr","horse"],"Miltefosina":["dog"],"Nitenpiram":["dog","cat"],"Melarsomina":["dog"],
"Pimobendan":["dog"],"Furosemida":["dog","cat","horse","cattle"],"Torasemida":["dog"],"Espironolactona":["dog"],"Benazepril":["dog","cat"],"Enalapril":["dog"],
"Telmisartana":["cat"],"Clembuterol":["horse"],"Fenilpropanolamina":["dog"],"Estriol":["dog"],
"Citrato de Maropitant":["dog","cat"],"Metoclopramida":["dog","cat"],"Omeprazol":["horse","dog"],"Domperidona":["dog"],
"Insulina Lenta Suína (Caninsulin)":["dog","cat"],"Trilostano":["dog"],"Levotiroxina Sódica":["dog"],"Fenobarbital":[],
"Cianocobalamina (Vitamina B12)":["dog","cat","horse","cattle"],"Adrenalina (Epinefrina)":[],"Bicarbonato de Sódio 8,4%":[],
"Gluconato de Cálcio 10%":["dog","cat","cattle"],"Borogluconato de Cálcio 20–25%":["cattle","sr","horse","pig"],"Sulfato de Magnésio 50%":["cattle"],
"Vitamina K1 (Fitomenadiona)":["dog","cat"],"Carvão Ativado":["dog","cat","horse","cattle"],"Difenidramina":[],"Prometazina":["dog","cat","horse","cattle"],
"Otológicos Combinados":["dog","cat"],"Cabergolina":["dog","cat"],"Aglepristone":["dog","cat"],"Ocitocina":["dog","cat","cattle","horse","pig","sr"],
"Cloprostenol (PGF2-alfa)":["cattle","horse","pig","sr"],"Gonadorelina (GnRH)":["cattle","horse"],"Gonadotrofina Coriônica Equina (eCG)":["cattle","sr","pig"],
"Gonadotrofina Coriônica Humana (hCG)":["horse","cattle"],"Ésteres de Estradiol (Benzoato / Cipionato)":["cattle"],"Fosfato de Toceranibe":["dog"],
"Tiamina (Vitamina B1)":["cattle","sr","horse","pig","dog","cat"],"Ferro Dextrano":["pig"],"Propilenoglicol":["cattle","sr"],"Fanciclovir":[]
};
// gotas por mL específicas de produtos em gotas
const GT = {"Fenobarbital":40,"Clonazepam":25,"Dipirona (Metamizol)":20};
