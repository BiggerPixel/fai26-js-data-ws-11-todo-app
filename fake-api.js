// Ett låtsas-API för todos. Vi ändrar inte i den här filen.
// Filen svarar på fetch-anrop till /api/todos, så att övningen fungerar utan en riktig server.
// Todos sparas bara så länge sidan är öppen. När vi laddar om sidan är listan tom igen.
// Varje request skrivs ut i Console, till exempel "Låtsas-API:t: POST /api/todos → 201".
//
// Det här kan API:t:
// GET  /api/todos      skickar alla todos.
// POST /api/todos      skapar en ny todo. Body: { "title": "Köpa mjölk", "isCompleted": false }
// PUT  /api/todos/1    ändrar todon med id 1. Body: { "isCompleted": true }

const fakeApiPath = "/api/todos";
const savedTodos = [];
let nextTodoId = 1;
const browserFetch = window.fetch;

const createFakeResponse = (status, data) => {
  return {
    ok: status >= 200 && status < 300,
    status: status,
    json: async () => {
      return JSON.parse(JSON.stringify(data));
    },
  };
};

const readJsonBody = (body) => {
  if (typeof body !== "string") {
    return { error: "Body måste vara JSON-text. Har vi glömt JSON.stringify?" };
  }

  try {
    return { data: JSON.parse(body) };
  } catch {
    return { error: "Body är inte giltig JSON." };
  }
};

const createTodo = (body) => {
  const result = readJsonBody(body);

  if (result.error !== undefined) {
    return createFakeResponse(400, { error: result.error });
  }

  const title = result.data.title;

  if (typeof title !== "string" || title.trim() === "") {
    return createFakeResponse(400, { error: "title saknas eller är tom." });
  }

  if (typeof result.data.isCompleted !== "boolean") {
    return createFakeResponse(400, { error: "isCompleted måste vara true eller false." });
  }

  const todo = { id: nextTodoId, title: title, isCompleted: result.data.isCompleted };
  nextTodoId = nextTodoId + 1;
  savedTodos.push(todo);
  return createFakeResponse(201, todo);
};

const updateTodo = (id, body) => {
  const todo = savedTodos.find((savedTodo) => {
    return savedTodo.id === id;
  });

  if (todo === undefined) {
    return createFakeResponse(404, { error: `Det finns ingen todo med id ${id}.` });
  }

  const result = readJsonBody(body);

  if (result.error !== undefined) {
    return createFakeResponse(400, { error: result.error });
  }

  if (typeof result.data.isCompleted !== "boolean") {
    return createFakeResponse(400, { error: "isCompleted måste vara true eller false." });
  }

  todo.isCompleted = result.data.isCompleted;
  return createFakeResponse(200, todo);
};

const answerRequest = (path, method, body) => {
  if (path === fakeApiPath) {
    if (method === "GET") {
      return createFakeResponse(200, savedTodos);
    }

    if (method === "POST") {
      return createTodo(body);
    }
  }

  if (path.startsWith(`${fakeApiPath}/`)) {
    const id = Number(path.slice(fakeApiPath.length + 1));

    if (method === "PUT") {
      return updateTodo(id, body);
    }
  }

  return createFakeResponse(404, { error: `Låtsas-API:t har ingen endpoint för ${method} ${path}.` });
};

window.fetch = async (url, options) => {
  const path = new URL(String(url), window.location.href).pathname;

  if (path.startsWith(fakeApiPath) === false) {
    return browserFetch(url, options);
  }

  let method = "GET";
  let body;

  if (options !== undefined) {
    if (options.method !== undefined) {
      method = options.method.toUpperCase();
    }

    body = options.body;
  }

  // En riktig server tar lite tid på sig att svara.
  await new Promise((resolve) => {
    setTimeout(resolve, 150);
  });

  const response = answerRequest(path, method, body);
  console.log(`Låtsas-API:t: ${method} ${path} → ${response.status}`);
  return response;
};
