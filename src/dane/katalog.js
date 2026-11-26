// Katalog miejsc: dane startowe tylko do odczytu (DEC-11).
// Przeniesione z prototypu (PLACES, DESTS, PHOTOS) jako dane, nie kod.
// Prawdziwe miejsca, przybliżone współrzędne, bez adresów i nazw firm (DEC-8).
// Zdjęcia: Wikimedia Commons. Autor i licencja odczytane ze strony każdego pliku 25.11.2026 (DEC-13).
// Zdjęcie bez jasnej licencji ma wartość null i karta pokazuje ikonę kategorii (A4).

/** Kategorie miejsc: etykieta, ikona z ikony.js i gradient zastępczy (A4). */
export const KATEGORIE = {
  kultura:   { etykieta: "Kultura",            ikona: "kolumna",   tlo: "linear-gradient(135deg, #c2b29b, #7d6c58)" },
  miasta:    { etykieta: "Miasta i dzielnice", ikona: "budynki",   tlo: "linear-gradient(135deg, #b49c84, #5f5044)" },
  natura:    { etykieta: "Natura",             ikona: "drzewo",    tlo: "linear-gradient(135deg, #8f957c, #55604a)" },
  punkt:     { etykieta: "Punkty widokowe",    ikona: "gora",      tlo: "linear-gradient(135deg, #a3a9a6, #5d6461)" },
  plaza:     { etykieta: "Plaże",              ikona: "parasol",   tlo: "linear-gradient(135deg, #dccaa4, #93a59f)" },
  jedzenie:  { etykieta: "Jedzenie",           ikona: "sztucce",   tlo: "linear-gradient(135deg, #c99a6b, #8c5a36)" },
  kawiarnia: { etykieta: "Kawiarnie",          ikona: "filizanka", tlo: "linear-gradient(135deg, #ad9078, #5e4636)" },
  aktywnosc: { etykieta: "Aktywności",         ikona: "flaga",     tlo: "linear-gradient(135deg, #a58d76, #5b6b5a)" }
};

/** Oznaczenia do sekcji ekranu Odkrywaj. */
export const OZNACZENIA = {
  "popularne": "Popularne",
  "jesien-zima": "Na jesień i zimę",
  "mniej-znane": "Mniej znane"
};

/** 41 miejsc w kolejności z prototypu (ta kolejność służy też do sortowania „Popularne” w F03). */
export const MIEJSCA = [
  {
    id: "rzym-koloseum", nazwa: "Koloseum", miasto: "Rzym", kraj: "Włochy", kategoria: "kultura",
    opis: "Największy amfiteatr starożytnego Rzymu. Najlepiej zwiedzać rano, zanim zrobi się tłoczno.",
    wsp: [41.8902, 12.4922], oznaczenia: ["popularne"],
    zdjecie: { plik: "d/de/Colosseo_2020.jpg", autor: "FeaturedPics", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "rzym-forum", nazwa: "Forum Romanum", miasto: "Rzym", kraj: "Włochy", kategoria: "kultura",
    opis: "Ruiny dawnego centrum życia publicznego, tuż obok Koloseum.",
    wsp: [41.8925, 12.4853], oznaczenia: ["popularne"],
    zdjecie: { plik: "6/6a/Foro_Romano_Musei_Capitolini_Roma.jpg", autor: "Wolfgang Moroder", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "rzym-panteon", nazwa: "Panteon", miasto: "Rzym", kraj: "Włochy", kategoria: "kultura",
    opis: "Antyczna świątynia z kopułą i okrągłym otworem w sklepieniu.",
    wsp: [41.8986, 12.4769], oznaczenia: ["popularne","jesien-zima"],
    zdjecie: { plik: "7/7b/Pantheon_%28Rome%29_-_Right_side_and_front.jpg", autor: "NikonZ7II", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "rzym-trevi", nazwa: "Fontanna di Trevi", miasto: "Rzym", kraj: "Włochy", kategoria: "kultura",
    opis: "Barokowa fontanna, do której tradycyjnie wrzuca się monetę.",
    wsp: [41.9009, 12.4833], oznaczenia: ["popularne"],
    zdjecie: { plik: "c/c7/Trevi_Fountain_-_Roma.jpg", autor: "NikonZ7II", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "rzym-pincio", nazwa: "Taras widokowy Pincio", miasto: "Rzym", kraj: "Włochy", kategoria: "punkt",
    opis: "Widok na dachy i kopuły Rzymu, szczególnie piękny o zachodzie słońca.",
    wsp: [41.9113, 12.4794], oznaczenia: [],
    zdjecie: { plik: "6/6d/Terrazza_del_Pincio_%2846397854832%29.jpg", autor: "Sonse", licencja: "CC BY 2.0" }
  },
  {
    id: "rzym-borghese", nazwa: "Park Villa Borghese", miasto: "Rzym", kraj: "Włochy", kategoria: "natura",
    opis: "Duży park z alejami i stawem, chwila odpoczynku od miasta.",
    wsp: [41.9142, 12.4923], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "f/f9/Ingresso_monumentale_di_Villa_Borghese_a_Roma_su_piazzale_Flaminio_2018-02.jpg", autor: "Oursana", licencja: "CC0" }
  },
  {
    id: "rzym-awentyn", nazwa: "Ogród Pomarańczowy na Awentynie", miasto: "Rzym", kraj: "Włochy", kategoria: "punkt",
    opis: "Spokojny ogród z widokiem na Tyber i kopułę Bazyliki św. Piotra.",
    wsp: [41.8847, 12.4799], oznaczenia: ["mniej-znane","jesien-zima"],
    zdjecie: null
  },
  {
    id: "rzym-zatybrze", nazwa: "Trattoria z domowym makaronem na Zatybrzu", miasto: "Rzym", kraj: "Włochy", kategoria: "jedzenie",
    opis: "Rzymska kuchnia w bocznej uliczce dzielnicy Trastevere.",
    wsp: [41.8894, 12.47], oznaczenia: ["mniej-znane"],
    zdjecie: null
  },
  {
    id: "rzym-espresso", nazwa: "Kawiarnia z espresso przy Panteonie", miasto: "Rzym", kraj: "Włochy", kategoria: "kawiarnia",
    opis: "Szybkie espresso na stojąco, po włosku.",
    wsp: [41.8992, 12.4776], oznaczenia: [],
    zdjecie: null
  },

  {
    id: "dol-tre-cime", nazwa: "Tre Cime di Lavaredo", miasto: "Dolomity", kraj: "Włochy", kategoria: "natura",
    opis: "Trzy charakterystyczne szczyty i pętla szlaku wokół nich.",
    wsp: [46.6187, 12.3022], oznaczenia: ["popularne"],
    zdjecie: { plik: "4/4f/2019_Tre_Cime.jpg", autor: "Tiia Monto", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "dol-braies", nazwa: "Jezioro Braies", miasto: "Dolomity", kraj: "Włochy", kategoria: "natura",
    opis: "Turkusowe jezioro górskie ze ścieżką dookoła brzegu.",
    wsp: [46.6946, 12.0855], oznaczenia: ["popularne"],
    zdjecie: { plik: "3/3e/Pragser_Wildsee_Seekofel_von_Bucht.jpg", autor: "STirol", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "dol-seceda", nazwa: "Seceda", miasto: "Dolomity", kraj: "Włochy", kategoria: "punkt",
    opis: "Grań z widokiem na ostre turnie, dostępna kolejką.",
    wsp: [46.6, 11.724], oznaczenia: ["mniej-znane"],
    zdjecie: null
  },
  {
    id: "dol-siusi", nazwa: "Alpe di Siusi", miasto: "Dolomity", kraj: "Włochy", kategoria: "natura",
    opis: "Ogromna wysokogórska łąka; zimą trasy narciarskie i biegowe.",
    wsp: [46.54, 11.62], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "5/5f/Saslonch_udu_da_Mont_de_Seuc.jpg", autor: "Wolfgang Moroder", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "dol-cortina", nazwa: "Cortina d'Ampezzo", miasto: "Dolomity", kraj: "Włochy", kategoria: "miasta",
    opis: "Górskie miasteczko, baza wypadowa na szlaki i stoki.",
    wsp: [46.5405, 12.1357], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "3/36/Faloria_Cortina_d%27Ampezzo_10.jpg", autor: "kallerna", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "dol-schronisko", nazwa: "Schronisko z kuchnią tyrolską", miasto: "Dolomity", kraj: "Włochy", kategoria: "jedzenie",
    opis: "Knedle i strudel po drodze na szlak wokół Tre Cime.",
    wsp: [46.615, 12.295], oznaczenia: ["mniej-znane"],
    zdjecie: null
  },
  {
    id: "dol-ferrata", nazwa: "Via ferrata dla początkujących", miasto: "Dolomity", kraj: "Włochy", kategoria: "aktywnosc",
    opis: "Ubezpieczona trasa skalna. Wymaga sprzętu i kasku.",
    wsp: [46.523, 12.17], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "2/27/Climber_on_fixed_rope_route_Piz_Mitgel_2.jpg", autor: "Savognin Tourismus", licencja: "CC BY-SA 3.0" }
  },

  {
    id: "lis-belem", nazwa: "Wieża Belém", miasto: "Lizbona", kraj: "Portugalia", kategoria: "kultura",
    opis: "Kamienna wieża nad brzegiem Tagu, symbol epoki odkryć.",
    wsp: [38.6916, -9.216], oznaczenia: ["popularne"],
    zdjecie: { plik: "6/65/Torre_Bel%C3%A9m_April_2009-4a.jpg", autor: "Alvesgaspar", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "lis-hieronimici", nazwa: "Klasztor Hieronimitów", miasto: "Lizbona", kraj: "Portugalia", kategoria: "kultura",
    opis: "Klasztor z bogato zdobionymi krużgankami w stylu manuelińskim.",
    wsp: [38.6979, -9.2068], oznaczenia: ["popularne"],
    zdjecie: { plik: "0/0e/1502_legte_K%C3%B6nig_Manuel_I._den_Grundstein_f%C3%BCr_das_Hieronymus_Kloster_in_Lissabon._06.jpg", autor: "Holger Uwe Schmitt", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "lis-zamek", nazwa: "Zamek św. Jerzego", miasto: "Lizbona", kraj: "Portugalia", kategoria: "kultura",
    opis: "Mury zamku na wzgórzu nad starym miastem.",
    wsp: [38.7139, -9.1335], oznaczenia: ["popularne"],
    zdjecie: { plik: "3/37/Castelo_Sao_Jorge_Lisboa_1.JPG", autor: "Osvaldo Gago", licencja: "CC BY-SA 2.0" }
  },
  {
    id: "lis-senhora", nazwa: "Punkt widokowy Senhora do Monte", miasto: "Lizbona", kraj: "Portugalia", kategoria: "punkt",
    opis: "Najwyżej położony punkt widokowy w centrum, z dala od tłumów.",
    wsp: [38.7193, -9.1325], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "4/41/Lisbon_%2836831596786%29_%28cropped%29.jpg", autor: "Deensel", licencja: "CC BY 2.0" }
  },
  {
    id: "lis-alfama", nazwa: "Alfama", miasto: "Lizbona", kraj: "Portugalia", kategoria: "miasta",
    opis: "Najstarsza dzielnica: strome uliczki, schody i muzyka fado.",
    wsp: [38.7114, -9.13], oznaczenia: ["popularne","jesien-zima"],
    zdjecie: { plik: "0/07/Lisbon_alfalma.jpg", autor: "Arne Müseler", licencja: "CC BY-SA 3.0 de" }
  },
  {
    id: "lis-tramwaj", nazwa: "Przejazd zabytkowym tramwajem nr 28", miasto: "Lizbona", kraj: "Portugalia", kategoria: "aktywnosc",
    opis: "Żółty tramwaj przez wzgórza i najstarsze dzielnice miasta.",
    wsp: [38.716, -9.131], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "1/16/Lisbon-Day3-1_%2834184431096%29.jpg", autor: "Ajay Suresh", licencja: "CC BY 2.0" }
  },
  {
    id: "lis-nata", nazwa: "Cukiernia z pastel de nata w Belém", miasto: "Lizbona", kraj: "Portugalia", kategoria: "kawiarnia",
    opis: "Ciepłe babeczki z kremem, posypane cynamonem.",
    wsp: [38.6975, -9.2033], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "0/0c/Pasteis_de_Belem.jpg", autor: "Mon Œil", licencja: "CC BY 2.0" }
  },
  {
    id: "lis-sardynki", nazwa: "Tasca z grillowanymi sardynkami", miasto: "Lizbona", kraj: "Portugalia", kategoria: "jedzenie",
    opis: "Mała knajpka z rybami z grilla i winem z beczki.",
    wsp: [38.7108, -9.1285], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "b/b1/Sardines_-_%E9%B0%AF%28%E3%81%84%E3%82%8F%E3%81%97%29.jpg", autor: "TANAKA Juuyoh (田中十洋)", licencja: "CC BY 2.0" }
  },
  {
    id: "lis-carcavelos", nazwa: "Plaża Carcavelos", miasto: "Lizbona", kraj: "Portugalia", kategoria: "plaza",
    opis: "Szeroka plaża z falami dla początkujących surferów.",
    wsp: [38.679, -9.336], oznaczenia: [],
    zdjecie: null
  },

  {
    id: "kra-rynek", nazwa: "Rynek Główny i Sukiennice", miasto: "Kraków", kraj: "Polska", kategoria: "kultura",
    opis: "Jeden z największych średniowiecznych placów w Europie.",
    wsp: [50.0617, 19.9373], oznaczenia: ["popularne","jesien-zima"],
    zdjecie: { plik: "1/18/Sukiennice_and_Main_Market_Square_Krakow_Poland.JPG", autor: "Jorge Lascar", licencja: "CC BY 2.0" }
  },
  {
    id: "kra-wawel", nazwa: "Wzgórze Wawelskie", miasto: "Kraków", kraj: "Polska", kategoria: "kultura",
    opis: "Zamek i katedra na wzgórzu nad Wisłą.",
    wsp: [50.054, 19.9354], oznaczenia: ["popularne"],
    zdjecie: { plik: "8/87/Wawel_%284%29.jpg", autor: "Monika Towiańska", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "kra-kazimierz", nazwa: "Kazimierz", miasto: "Kraków", kraj: "Polska", kategoria: "miasta",
    opis: "Dawna dzielnica żydowska, dziś pełna kawiarni i galerii.",
    wsp: [50.051, 19.945], oznaczenia: ["popularne"],
    zdjecie: null
  },
  {
    id: "kra-krakusa", nazwa: "Kopiec Krakusa", miasto: "Kraków", kraj: "Polska", kategoria: "punkt",
    opis: "Prehistoryczny kopiec z panoramą miasta, mało turystów.",
    wsp: [50.038, 19.958], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "6/61/Wsch%C3%B3d_s%C5%82o%C5%84ca_nad_Kopcem_Krakusa_02.jpg", autor: "Piotr Pawelczyk", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "kra-bulwary", nazwa: "Bulwary Wiślane", miasto: "Kraków", kraj: "Polska", kategoria: "natura",
    opis: "Spacer lub rower wzdłuż Wisły, z widokiem na Wawel.",
    wsp: [50.053, 19.93], oznaczenia: [],
    zdjecie: null
  },
  {
    id: "kra-kosciuszko", nazwa: "Kopiec Kościuszki", miasto: "Kraków", kraj: "Polska", kategoria: "punkt",
    opis: "Kopiec na skraju miasta z widokiem po horyzont.",
    wsp: [50.0548, 19.8932], oznaczenia: [],
    zdjecie: null
  },
  {
    id: "kra-bar", nazwa: "Bar mleczny z pierogami", miasto: "Kraków", kraj: "Polska", kategoria: "jedzenie",
    opis: "Tanie, domowe jedzenie: pierogi, zupy i naleśniki.",
    wsp: [50.064, 19.94], oznaczenia: ["mniej-znane","jesien-zima"],
    zdjecie: null
  },
  {
    id: "kra-sernik", nazwa: "Kawiarnia z sernikiem na Kazimierzu", miasto: "Kraków", kraj: "Polska", kategoria: "kawiarnia",
    opis: "Przytulne wnętrze, sernik i grzane wino zimą.",
    wsp: [50.0515, 19.9465], oznaczenia: ["jesien-zima"],
    zdjecie: { plik: "e/ea/Baked_cheesecake_with_raspberries_and_blueberries.jpg", autor: "zingyyellow", licencja: "CC BY 2.0" }
  },

  {
    id: "bcn-sagrada", nazwa: "Sagrada Família", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "kultura",
    opis: "Bazylika Gaudíego, wciąż w budowie od ponad stu lat.",
    wsp: [41.4036, 2.1744], oznaczenia: ["popularne"],
    zdjecie: { plik: "e/ef/SF_maig_2_cropped.jpg", autor: "Canaan", licencja: "CC BY-SA 4.0" }
  },
  {
    id: "bcn-guell", nazwa: "Park Güell", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "natura",
    opis: "Park na wzgórzu z mozaikami Gaudíego i widokiem na miasto.",
    wsp: [41.4145, 2.1527], oznaczenia: ["popularne"],
    zdjecie: { plik: "3/33/Parc_guell_-_panoramio.jpg", autor: "essetefano", licencja: "CC BY 3.0" }
  },
  {
    id: "bcn-gotycka", nazwa: "Dzielnica Gotycka", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "miasta",
    opis: "Wąskie średniowieczne uliczki wokół katedry.",
    wsp: [41.3833, 2.1767], oznaczenia: ["popularne","jesien-zima"],
    zdjecie: { plik: "6/6d/Barcelona_-_Carrer_del_Bisbe.jpg", autor: "Llull", licencja: "CC BY-SA 2.0" }
  },
  {
    id: "bcn-batllo", nazwa: "Casa Batlló", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "kultura",
    opis: "Kamienica o falującej fasadzie, przypominająca smoka.",
    wsp: [41.3917, 2.165], oznaczenia: [],
    zdjecie: { plik: "b/bf/Casa_Batllo_Overview_Barcelona_Spain_cut.jpg", autor: "ChristianSchd", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "bcn-barceloneta", nazwa: "Plaża Barceloneta", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "plaza",
    opis: "Miejska plaża z promenadą, kilka minut od starego miasta.",
    wsp: [41.3784, 2.1925], oznaczenia: ["popularne"],
    zdjecie: null
  },
  {
    id: "bcn-montjuic", nazwa: "Wzgórze Montjuïc", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "punkt",
    opis: "Ogrody, twierdza i widok na port.",
    wsp: [41.3636, 2.1586], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "d/d7/Fale_-_Spain_-_Barcelona_-_8.jpg", autor: "Fabio Alessandro Locati", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "bcn-bunkers", nazwa: "Punkt widokowy Bunkers del Carmel", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "punkt",
    opis: "Dawne stanowiska obrony przeciwlotniczej z panoramą 360°.",
    wsp: [41.419, 2.162], oznaczenia: ["mniej-znane"],
    zdjecie: { plik: "5/5f/Tur%C3%B3_Rovira.jpg", autor: "Canaan", licencja: "CC BY-SA 3.0" }
  },
  {
    id: "bcn-tapas", nazwa: "Bar z tapas w El Born", miasto: "Barcelona", kraj: "Hiszpania", kategoria: "jedzenie",
    opis: "Małe przekąski przy barze, wieczorem pełno ludzi.",
    wsp: [41.385, 2.182], oznaczenia: ["mniej-znane","jesien-zima"],
    zdjecie: { plik: "4/46/TapasenBarcelona.JPG", autor: "Elemaki", licencja: "CC BY 3.0" }
  }
];

/** 5 kierunków na ekranie Odkrywaj i w podpowiedziach formularza podróży. */
export const KIERUNKI = [
  {
    miasto: "Rzym", kraj: "Włochy", tekst: "Antyk, barokowe place i długie kolacje.",
    zdjecie: { plik: "c/c7/Trevi_Fountain_-_Roma.jpg", autor: "NikonZ7II", licencja: "CC BY-SA 4.0" }
  },
  {
    miasto: "Lizbona", kraj: "Portugalia", tekst: "Wzgórza, tramwaje i ocean.",
    zdjecie: { plik: "4/41/Lisbon_%2836831596786%29_%28cropped%29.jpg", autor: "Deensel", licencja: "CC BY 2.0" }
  },
  {
    miasto: "Kraków", kraj: "Polska", tekst: "Rynek, Wawel i klimatyczny Kazimierz.",
    zdjecie: { plik: "a/a3/Krakow_Rynek_Glowny_panorama_2.jpg", autor: "Andrzej Otrębski", licencja: "CC BY-SA 4.0" }
  },
  {
    miasto: "Barcelona", kraj: "Hiszpania", tekst: "Gaudí, plaża i tapas.",
    zdjecie: { plik: "a/a6/Evening_light_over_Barcelona.jpg", autor: "M McBey", licencja: "CC BY 2.0" }
  },
  {
    miasto: "Dolomity", kraj: "Włochy", tekst: "Szczyty, jeziora i górskie łąki.",
    zdjecie: { plik: "4/4f/2019_Tre_Cime.jpg", autor: "Tiia Monto", licencja: "CC BY-SA 3.0" }
  }
];

/**
 * Wikimedia przyjmuje bezpośrednie żądania miniatur tylko w standardowych szerokościach
 * (inne kończą się błędem 429). Aplikacja używa 500 px (karty) i 960 px (okno szczegółów).
 */
export const SZEROKOSCI_ZDJEC = [500, 960];

/** Adres miniatury zdjęcia z Commons w dozwolonej szerokości; null, gdy nie ma zdjęcia. */
export function adresZdjecia(zdjecie, szerokosc = 500) {
  if (!zdjecie) return null;
  if (!SZEROKOSCI_ZDJEC.includes(szerokosc)) {
    throw new Error(`Niedozwolona szerokość zdjęcia: ${szerokosc}. Dozwolone: ${SZEROKOSCI_ZDJEC.join(", ")}.`);
  }
  const nazwaPliku = zdjecie.plik.split("/").pop();
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${zdjecie.plik}/${szerokosc}px-${nazwaPliku}`;
}

/** Adres strony pliku na Commons (do podpisu „Zdjęcie: autor, licencja”, DEC-13). */
export function adresStronyPliku(zdjecie) {
  if (!zdjecie) return null;
  return `https://commons.wikimedia.org/wiki/File:${zdjecie.plik.split("/").pop()}`;
}

/**
 * Teksty licencji zdjęć z katalogu na creativecommons.org (DEC-22, I3 z weryfikacji F01): licencje CC 2.0 i 3.0
 * wymagają podania adresu licencji. Nowa licencja w katalogu musi tu trafić (sprawdza test katalogu).
 */
const ADRESY_LICENCJI = {
  "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 3.0 de": "https://creativecommons.org/licenses/by-sa/3.0/de/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/"
};

/** Adres tekstu licencji; null, gdy nazwa jest nieznana (wtedy podpis pokazuje samą nazwę). */
export function adresLicencji(licencja) {
  return Object.hasOwn(ADRESY_LICENCJI, licencja) ? ADRESY_LICENCJI[licencja] : null;
}

/** Miejsce po identyfikatorze; undefined, gdy miejsca nie ma już w katalogu (plan 5.4). */
const poId = new Map(MIEJSCA.map((m) => [m.id, m]));
export function miejsce(id) {
  return poId.get(id);
}
