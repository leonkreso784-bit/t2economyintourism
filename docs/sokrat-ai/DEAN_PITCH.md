# Sokrat AI — Prezentacija dekanu (rok: 10. mjesec 2026.)

> **Strateška ocjena:** ovo je **najvrjednija poluga cijelog projekta** — vrjednija od bilo koje arhitekture.
> Model može svatko istrenirati; **pristup akademskim podacima s dokazanim porijeklom ne može se kupiti.**

## 1. Cilj prezentacije

**Ne** tražimo novac. Tražimo **partnerstvo i pristup podacima.**

| Tražimo | Nudimo |
|---|---|
| Pristup **otvorenim** akademskim materijalima | Prvo hrvatsko sveučilište s **vlastitim jezičnim resursom** |
| Kanal prema profesorima za **dobrovoljni pristanak** | Suvlasništvo nad korpusom i rezultatima |
| Institucionalni status (**otključava TDM iznimku**, v. [LEGAL_GDPR.md](./LEGAL_GDPR.md) §5) | Materijal za EU/nacionalne natječaje |
| Kontakt s DPO-om i pravnom službom | Vidljivost i prvenstvo — *„prvi u Hrvatskoj"* |
| Kasnije: širenje na druga sveučilišta | Studentski rad koji **donosi**, a ne traži uslugu |

## 2. Zlatno pravilo prezentacije

> **Ne ide se s idejom. Ide se s radećom stvari koja se pokaže uživo.**

Razlika između *„htio bih napraviti AI"* i *„evo modela koji sam napisao od nule, radi offline na ovom laptopu,
govori hrvatski, evo koda"* je razlika između studenta koji sanja i partnera kojeg se shvaća ozbiljno.

**Zato je prioritet do 10. mjeseca: mali, ali STVARAN i POKAZIV model.**

## 3. Struktura prezentacije (5 dijelova)

### ① Dokaz da isporučujem — Sokrat Study
Živa platforma, stvarni studenti, 21 predmet, hrvatski sadržaj, admin-editor, testovi, CI/CD.
**Poruka:** *„Ne pričam — gradim i isporučujem."*

### ② Teza — zašto je ovo važno baš sada
- Internet se ubrzano puni AI-generiranim sadržajem
- **Model collapse** (Nature, 2024): modeli trenirani na generiranom sadržaju **degradiraju**
- Analogija **„low-background steel"**: tekst prije ~2022. je nekontaminiran i postaje **iscrpiv resurs**
- **Akademski, ljudski, hrvatski tekst postaje strateški resurs — a sveučilište sjedi na njemu**

### ③ Demo — model uživo
Mali hrvatski model, **napisan od nule**, koji radi **na laptopu bez interneta** i u pregledniku.
Pokazati: tokenizer-usporedbu (koliko GPT-2 lomi hrvatski vs. naš), generiranje teksta, sokratsko pitanje.
**Ovo je trenutak koji odlučuje.**

### ④ Pravna i etička ozbiljnost
Pokazati da **znam za GDPR i autorska prava PRIJE nego me itko pita**:
- osobni podaci **nikad** u težine modela (arhitektura: znanje u bazi → izbrisivo)
- privola specifična i opoziva; registar izvora; DPIA planirana
- TDM iznimka za znanstveno istraživanje kroz istraživačku organizaciju

> **Institucija te podržava samo ako vidi da si o riziku već razmišljao.**
> Ovaj dio pretvara „rizičan studentski projekt" u „ozbiljan istraživački prijedlog".

### ⑤ Prijedlog — konkretno što tražim
Jasan, ograničen, izvediv prvi korak (ne „dajte mi sve podatke Hrvatske").

## 4. Što NE raditi

- ❌ **Ne obećavati ChatGPT.** Obećaj malen, specifičan, provjerljiv model. Preobećanje ubija kredibilitet.
- ❌ **Ne tražiti odmah nacionalnu razinu.** Kreni s FMTU / Sveučilištem u Rijeci; širenje je **faza 2**.
- ❌ **Ne izbjegavati pravna pitanja.** Otvori ih sam, prvi.
- ❌ **Ne dolaziti praznih ruku** — bez demoa je ovo samo ideja.
- ❌ **Ne predstavljati se kao konkurencija OpenAI-u.** Predstavi se kao **doprinos hrvatskom jeziku i akademiji**.

## 5. Saveznici — nabavi ih prije prezentacije

**Surađuj, ne dupliciraj.** U Hrvatskoj i regiji već postoji ozbiljna zajednica za slavenski/hrvatski NLP
(krug oko **CLASSLA** i **hrWaC** korpusa, akademski istraživači jezičnih tehnologija).

> **Jedan e-mail toj zajednici vrijedi šest mjeseci samostalnog lutanja.**
> A pred dekanom rečenica *„surađujem s postojećom hrvatskom NLP zajednicom"* zvuči **deset puta**
> ozbiljnije od *„radim sam"*.

Također korisno prije prezentacije: **SRCE** (drže DABAR i Hrčak) — oni su vlasnici infrastrukture podataka.

## 6. Financiranje (spomenuti, ne tražiti)

Ne traži novac od dekana. **Ali pokaži da znaš gdje novac postoji** — to čini prijedlog održivim:

- **Suvereni AI za europske jezike** je trenutno prioritet EU financiranja; postoje europske inicijative
  usmjerene baš na jezične podatke i modele **manjih europskih jezika**
- Hrvatski model **s institucionalnom podrškom sveučilišta** je točno profil koji takvi natječaji traže
- Nacionalni istraživački i digitalizacijski programi

**Poruka:** *„Ovo nije trošak za fakultet — ovo je materijal s kojim fakultet može aplicirati."*

## 7. Plan do 10. mjeseca

| Mjesec | Fokus | Ishod za prezentaciju |
|---|---|---|
| **8. mj** | Temelji: BPE tokenizer na hrvatskom, sićušni modeli, cjevovod podataka | **Tokenizer-usporedba** = prvi mjerljivi rezultat (v. RESEARCH.md §4) |
| **8.–9. mj** | Prikupljanje **otvorenih** izvora (Wikipedija, Hrčak, hrWaC), čišćenje, deduplikacija | Statistika korpusa + registar izvora |
| **9. mj** | Prvi pravi trening-run (iznajmljen GPU, ~10–20 €) | **Model koji generira hrvatski** |
| **9.–10. mj** | Kvantizacija → laptop + preglednik; pravni okvir; slajdovi i proba | **Demo uživo + pravni dokument** |

⚠️ **Sokrat Study je ZASEBAN projekt** (Leonova odluka): Sokrat AI se **ne ugrađuje u platformu**.
Platforma se pred dekanom samo **spominje kao dokaz isporuke** (točka ①) i ide svojim tempom.

## 8. Kontrolna lista spremnosti

- [ ] Sokrat Study stabilan i pokaziv (risk-sprint dovršen, editor u upotrebljivom stanju)
- [ ] Tokenizer-usporedba: mjerljiv rezultat s brojkama
- [ ] Model generira hrvatski i **radi offline na laptopu**
- [ ] Demo u pregledniku — **samostalna stranica**, izvan platforme
- [ ] Registar izvora s licencama
- [ ] Pravni dokument (sažetak GDPR/autorskog pristupa) — **1 stranica, čitljiva ne-tehničaru**
- [ ] Kontakt uspostavljen s hrvatskom NLP zajednicom
- [ ] Slajdovi: max 10, više demoa nego teksta
- [ ] Jasan, ograničen **„tražim ovo"** na kraju
