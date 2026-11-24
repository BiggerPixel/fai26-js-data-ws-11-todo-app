Föreställ dig en todo-lista där vi skriver tex. `Köpa mjölk`, trycker på Enter och ser todon dyka upp i listan direkt. Det är ofta en av de första "riktiga" apparna man som utvecklare brukar bygga för att få testa på att bygga något själv och precis vad vi ska göra nu.

En "ToDo-app" kan kännas väldigt enkel/simpel men för att det ska fungera fullt ut så är det en hel del saker som sker "bakom kulisserna". Tex. har sidan skickat ToDo:n till en server, fått tillbaka den med ett unikt `id` och "ritat upp" HTML:en för att kunna visa upp den på sidan.

Det är den sidan vi bygger nu. Vi har gjort samma steg i utmaningen [Skicka en todo från formuläret](jd7f0bpz4m95nf57v5yzv94dfx8jrmga) under förra workshoppen, men där var HTML-koden och en stor del av JavaScript-koden redan klar.

**Nu ska vi prova att skriva allt själva**, det innebär:  
formuläret, "event listenern", API-anropet som sparar, hämtar vår ToDo och visa listan.

## Så här börjar vi:

- Öppna övningens filer i VS Code.
- Öppna `index.html` med Live Server.
- Öppna Console: högerklicka på sidan, välj `Inspect` (`Granska`) och klicka på fliken `Console`.
- Du kommer nu att se rubriken "`Todo-lista"` och texten `Inga todos än.`.

## De här filerna finns redan:

- `fake-api.js` är ett "låtsas-API" som fungerar "lokalt" på din egen dator.  
  Det tar emot våra requests till `/api/todos` och svarar som en riktig server.  
  Vi ändrar inget i den filen.
- `show-todos.js` har funktionen `showTodos`.  
  Den tar emot en array med todos och visar dem i listan.  
  Vi ändrar inte heller i den här filen.
- `script.js` importerar `showTodos`.  
  Där finns också "konstanten" "`API_URL"`, som är adressen till vårt låtsas-API:t, och den tomma array:en `todos`. Vi skriver all vår kod under kommentarerna i `script.js`.

En todo från API:t ser ut så här:

```javascript
{ id: 1, title: "Köpa mjölk", isCompleted: false }
```

`isCompleted` säger om ToDo:n är gjord. När vi skapar en ny todo är som standard inte avklarad (`isCompleted: false`).

Låtsas-API:t skriver ut varje request i Console-fliken, till exempel `Låtsas-API:t: POST /api/todos → 201`. Där ser vi vad vi skickade och vilken statuskod servern svarade med. Request:en syns därför inte i Network-fliken, eftersom att vi inte gör ett "riktigt" anrop till en server över internet/HTTP.

---

# Steg 1: Bygg formuläret

Först behöver sidan ett formulär.  
Skriv det i `index.html`, under kommentaren `<!-- Skriv formuläret här -->`.

**Formuläret behöver:**

- ett `form`-element med id:t `todo-form`.
- ett `input`-element inne i formuläret med `type="text"`, id:t `todo-input` och attributet `required`.
- en `button` inne i formuläret med `type="submit"` och texten `Lägg till`.

Ge gärna fältet en placeholder, till exempel `Vad behöver göras?` eller liknande.

Vill vi att formuläret passar ihop med resten av sidan kan vi använda de här Tailwind-klasserna:

- `form`: `mt-6 flex gap-2`.
- `input`: `flex-1 rounded border bg-white p-2`.
- `button`: `rounded bg-slate-900 px-4 py-2 text-white`.

**Du är klar med steg 1 när:**

- Fältet och knappen `Lägg till` syns under rubriken.
- Vi trycker på `Lägg till` när fältet är tomt. Då säger webbläsaren till att fältet måste fyllas i. (det vill säga att "required" attributet fungerat och att vi inte tillåts att spara om vi inte skrivit in något i vårt "ToDo-input-fält")
- Vi skriver något och trycker på `Lägg till`. Sidan laddas om och fältet blir tomt. Det är förväntat just nu eftersom att vi inte skrivit koden för att formuläret ska göra något ännu. Det fixar vi i nästa steg.

---

# Steg 2: "Lyssna" på submit (lägga till en eventListener)

Nu tar vi hand om formuläret i JavaScript. Öppna `script.js`.

1. Hämta formuläret och textfältet med `document.querySelector` under kommentaren `// Formuläret och textfältet`. Spara dem i `todoForm` och `todoInput`.
2. Lyssna på `"submit"` på `todoForm` med `addEventListener` under kommentaren `// Lyssna på submit i formuläret`. Ta emot event-objektet i en parameter som heter `event`.
3. Skriv `event.preventDefault()` först i callback-funktionens kod-block. Detta hindrar sidan från att "ladda om" vilket den annars gör automatiskt när vi "submittar" formuläret.
4. Vi plockar ut texten som skrivits i input-fältet med `todoInput.value` och sparar den i en ny variabel som vi döper till "`title"`. Skriv ut `title` med `console.log` och testa att skicka formuläret och se så att du ser texten i console-fliken

**Kom ihåg:** Vi lyssnar på själva ++formuläret++, inte på ++knappen++. Då fungerar både knappen och Enter i fältet. Vi läser också `value` inne i callbacken i vår eventListener, eftersom det är först då som texten finns i fältet.

**Du är klar med steg 2 när:**

- Vi skriver tex. "`Köpa mjölk"` och trycker på Enter och du ser "`Köpa mjölk" i` Console-fliken.
- Sidan laddas inte om

Om sidan fortfarande laddas om: kontrollera att det står `event` mellan parenteserna i callbacken och att `preventDefault()` har parenteser. Kontrollera också att Console inte visar något fel.

---

# Steg 3: Skicka ToDo:n till "API:et"

Nu ska texten skickas till servern med en POST-request.

Skriv en funktion som heter `createTodo` under kommentaren `// Funktionen som skickar en ny todo till API:et`.

Funktionen tar emot `title` och använder `await`, så den behöver vara `async`.

1. Skapa ett object som heter `newTodo`, med `title` och `isCompleted: false`.
2. Skicka `newTodo` till `API_URL` med `await fetch(...)` och metoden `POST`. Spara svaret i en ny variabel som vi döper till `response`.
3. Om `response.ok` är `false`: gör om svaret till ett object med `await response.json()` och skriv ut dess `error` med `console.log`. Avsluta funktionen med `return`.
4. Gör annars om svaret till ett object med `await response.json()` och spara det i `todo`. Skriv ut `todo` med `console.log`.
5. Byt ut `console.log(title)` i callbacken mot ett anrop av `createTodo` med `title`.

:::spoiler

Det andra argumentet till `fetch` är ett object med tre properties. Det ser ut ungefär så här:

```javascript
{
  method: ...,
  headers: { "Content-Type": "application/json" },
  body: ...,
}
```

`method` bestämmer att vi vill skapa något nytt. `body` är det vi skickar, och en server kan bara ta emot text. Vilken funktion gör om ett object till JSON-text?

:::

**Du är klar med steg 3 när:**

- Vi lägger till `Köpa mjölk`. Console visar `Låtsas-API:t: POST /api/todos → 201`.
- Console visar också ToDo:n från servern: `{id: 1, title: 'Köpa mjölk', isCompleted: false}`.
- Nästa todo vi lägger till får `id` `2, id 3, id 4...` osv.

Om Console visar `GET` i stället för `POST` har vi glömt ange vilken "`method"` vi gör anropet med. Om Console visar `Body måste vara JSON-text` har vi glömt `JSON.stringify`.

---

# Steg 4: Visa ToDos i listan

Till sist ska todon synas på sidan. Det är funktionen `showTodos` som visar listan.

1. Ta bort `console.log(todo)` i `createTodo`. Lägg i stället till `todo` sist i arrayen `todos` med `push`.
2. Visa listan på sidan genom att anropa `showTodos` med `todos`.
3. Töm fältet i callbacken, efter raden där vi anropar `createTodo`.

`showTodos` vill ha hela arrayen, inte en enda todo. Vi använder också todon från svaret, inte `newTodo`, eftersom det är servern som ger todon ett `id`.

**Du är klar med steg 4 när:**

- Vi lägger till `Köpa mjölk`. `Köpa mjölk` syns i listan och fältet blir tomt.
- Vi lägger till `Vattna blommorna`. Nu syns båda i listan.
- Vi laddar om sidan. Listan är tom igen, eftersom låtsas-API:t bara sparar todos medan sidan är öppen.
- Console visar inga fel.

Om servern svarar `title saknas eller är tom.` tömmer vi fältet innan vi läser `value`. Kontrollera ordningen på raderna i "callbacken".

---

# ✨💻🚀 Snyggt jobbat! Nu är du klar!

![ToDo.gif](https://fantastic-newt-291.eu-west-1.convex.site/api/editor-files/kg2bh5j5xxz2xttjwph9sgdcfd8jv52m/ToDo.gif "ToDo.gif")

När du är klar med steg 4 är du också klar med hela uppgiften. Passa på att stana upp en sekund och kika igenom din kod, finns det något du vill/kan förbättra? Finns det saker du "lämnat kvar" under arbetet som kanske inte ska vara kvar? Tex. olika console.log's som du använt för att inspektera/testa/förstå koden som vi nu kan ta bort?

---

# Extrauppgift: Bocka av en todo

Varje todo har en kryssruta, men den gör ingenting än. Nu ska vi kunna bocka av en todo, och servern ska få veta det.

Det här behöver vi veta:

- `showTodos` kan ta emot en callback som andra argument, till exempel `showTodos(todos, toggleTodo)`. Callbacken körs med todon när någon klickar på kryssrutan. Det fungerar som `showCart(cart, cartActions)` i varukorgen.
- Låtsas-API:t ändrar en todo med en PUT-request till todons adress. För todon med `id` `1` är adressen `/api/todos/1`.
- Body är det nya värdet, till exempel `{ "isCompleted": true }`. Svaret är den ändrade todon.
- `showTodos` stryker över en todo när `isCompleted` är `true`.

**Uppgiften:**

1. Skriv en funktion som heter `toggleTodo`, under `createTodo`. Den tar emot `todo`.
2. Skicka det motsatta värdet av `todo.isCompleted` till todons adress med PUT.
3. Ändra `isCompleted` på todon till värdet från svaret och visa listan igen.
4. Skicka med `toggleTodo` som andra argument i alla anrop av `showTodos`.

:::spoiler

Adressen bygger vi med en template literal av `API_URL` och `todo.id`.

`todo.isCompleted === false` blir `true` när todon inte är gjord, och `false` när den är gjord. Det är precis det motsatta värdet.

`todo` som callbacken får är samma object som ligger i `todos`. Ändrar vi `todo.isCompleted` ändras alltså todon i listan också. Sedan räcker det att visa `todos` igen.

:::

**Klart när:**

- Vi klickar på kryssrutan vid `Köpa mjölk`. Texten blir överstruken och Console visar `Låtsas-API:t: PUT /api/todos/1 → 200`.
- Vi klickar igen. Texten är inte överstruken längre.
- Nya todos går fortfarande att bocka av.
