# React Learning Notes — Virtual Whiteboard Project

---

## `useRef` Hook

### What is it?

`useRef` is a React hook that gives you a way to **directly access a DOM element** from your JavaScript code — without React having to re-render the component.

It returns an object with a single property: `.current`

```js
const canvasRef = useRef(); // canvasRef.current will hold the actual DOM element
```

---

### Why do we need it for the Canvas?

The HTML `<canvas>` element needs to be accessed directly to draw on it (e.g., `canvas.getContext("2d")`). React normally manages the DOM for you and discourages direct access, but for things like `<canvas>`, video players, or input focus — you genuinely need the real DOM element. `useRef` is the React-approved way to do that.

In this project:

```js
const canvasRef = useRef();                    // 1. create the ref
<canvas ref={canvasRef} ... />                 // 2. attach it to the DOM element
const canvas = canvasRef.current;              // 3. now you have the real <canvas> node
const context = canvas.getContext("2d");       // 4. use the Canvas API to draw
```

---

### How is it different from a regular variable?

| Regular variable (`let x = ...`) | `useRef` |
|---|---|
| Reset to its initial value on every re-render | Persists across re-renders |
| Cannot point to a DOM element | Can hold a reference to a DOM element |
| Changing it does NOT trigger re-render | Changing `.current` does NOT trigger re-render |

> **Key insight:** `useRef` is like a box that React won't touch. You can put anything in it and it will stay there for the lifetime of the component.

---

### How is it different from `useState`?

Both `useRef` and `useState` persist values across re-renders, but:

- Changing `useState` **triggers a re-render** (React updates the UI)
- Changing `useRef.current` does **not** trigger a re-render

For the canvas, we don't want React to re-render every time we draw a stroke — that would be very slow. We just want a stable reference to the canvas node. That's why `useRef` is the right choice here.

---

### Common uses of `useRef`

1. **Accessing DOM elements** — like `<canvas>`, `<input>`, `<video>` (our use case)
2. **Storing a mutable value** that shouldn't cause re-renders (e.g., a timer ID, a previous value)
3. **Keeping track of whether a component just mounted**

---

## `useEffect` Hook

### What is it?

`useEffect` is a React hook that lets you run **side effects** after React has rendered (painted) the component to the screen.

A "side effect" is anything that reaches outside of React — like accessing the DOM, fetching data, setting up event listeners, or starting a timer.

```js
useEffect(() => {
  // this code runs AFTER the component is rendered to the screen
}, [/* dependency array */]);
```

---

### Why do we need it for the Canvas?

You cannot safely access `canvasRef.current` the moment the component function runs, because the `<canvas>` element hasn't been added to the page yet. React first runs your component function to figure out what the UI should look like, and only then puts the elements into the DOM.

`useEffect` guarantees that the DOM is ready before your code runs:

```js
useEffect(() => {
  const canvas = canvasRef.current;        // safe to access now — canvas is in the DOM
  const context = canvas.getContext("2d");
  context.fillStyle = "#FF0000";
  context.fillRect(0, 0, 150, 75);         // draws a red rectangle
}, []);
```

Without `useEffect`, `canvasRef.current` would be `null` and your code would crash.

---

### The Dependency Array `[]`

The second argument to `useEffect` is the **dependency array**. It controls *when* the effect re-runs.

| Dependency array | When does the effect run? |
|---|---|
| Not provided | After **every** render |
| `[]` empty array | Only **once**, after the first render (component mounts) |
| `[value]` with values | After first render, and again whenever `value` changes |

In this project, `[]` is used because you only need to set up the canvas once — not every time the component re-renders.

> **Key insight:** Think of the dependency array as React asking you: "What data does this effect depend on?" If the answer is nothing, pass `[]`.

---

### The lifecycle of a component (simplified)

It helps to understand *when* things happen:

```
1. Component function runs  →  React figures out the UI
2. React updates the DOM    →  the <canvas> now exists on the page
3. useEffect runs           →  safe to access canvasRef.current here
```

If state or props change later, steps 1–3 repeat. With `[]`, step 3 only happens once.

---

### Cleanup (bonus concept)

`useEffect` can optionally return a **cleanup function**. React calls it before the component is removed from the page (unmounted), or before the effect runs again.

```js
useEffect(() => {
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    // cleanup: remove the listener when the component unmounts
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, []);
```

This will be relevant later in the whiteboard when you add mouse event listeners for drawing.

---

### Summary: `useRef` vs `useEffect` — how they work together

In this project they solve two different problems and are used together:

- `useRef` gives you a **stable pointer** to the canvas DOM element
- `useEffect` gives you the **right moment** to use that pointer safely

Neither is useful here without the other.

---

## `useCallback` and Memoization

### What is it?

`useCallback` returns **the same function object** on every render, instead of a new one. It only builds a new function when one of its dependencies changes.

```js
const logout = useCallback(() => {
  localStorage.removeItem('token');
  setIsLogin(false);
}, []);     // [] = this function never needs rebuilding
```

Without it, `const logout = () => {...}` creates a brand new function object on every render of `AuthProvider` — same behaviour, different identity.

---

### Why identity matters

JavaScript compares functions and objects **by reference**, not by what they do. Two identical-looking functions are different values:

```js
const a = () => "hi";
const b = () => "hi";
a === b;     // false
```

React compares dependency arrays with `Object.is`, so an unmemoized function in a dep array looks "changed" on every render. In this project that meant the Board's fetch effect would refetch the canvas on every render of `BoardProvider`.

Strings and numbers are compared **by value**, which is why `token` is safe to list as a dependency — if the token hasn't changed, the dep hasn't changed.

---

### The question to ask about any dependency

> **Could this value be different on the next render?**

| Needs to be a dependency | Doesn't |
|---|---|
| props | module imports (`loadCanvas`, `getCanvases`) |
| state (`elements`, `token`) | module constants (`BASE_URL`), globals (`window`, `localStorage`) |
| context values (`logout`, `loadCanvasHandler`) | `useState` setters — React guarantees a stable identity |
| anything computed from them in the component body | `dispatch` from `useReducer` |
| | the object from `useRef` (`.current` changes, the box doesn't) |
| | anything created *inside* the effect |

The lint rule `react-hooks/exhaustive-deps` applies exactly this reasoning: it only tracks identifiers declared inside the component.

---

### `dispatch` is stable — a wrapper around it is not

```js
const loadCanvasHandler = (elements) => {      // NEW object every render
  dispatchBoardState({ ... });                 // the stable thing, inside it
};
```

The dispatch never changes, but the arrow function wrapping it does. React sees the envelope, not the letter. Hence:

```js
const loadCanvasHandler = useCallback((elements) => {
  dispatchBoardState({ type: BOARD_ACTIONS.LOAD_CANVAS, payload: { elements } });
}, []);     // body only uses dispatch → nothing to depend on
```

---

### When to reach for it

Not every function needs `useCallback`. Use it when the function is:

1. listed in a dependency array (effect, `useMemo`, another `useCallback`)
2. passed to a child wrapped in `React.memo`
3. shared through context, where consumers may do either of the above

Otherwise it's noise — memoization isn't free, and a function nobody depends on can be rebuilt harmlessly.

---

### Don't add dependencies just to silence the linter

The warning is about **stale closures**: an effect that captured a value from an old render and kept using it. The professional fix is to make the honest dependency list harmless, not to lie about it:

- move the function **inside** the effect, so it isn't a dependency at all
- memoize it at the source with `useCallback` (what we did for `logout` and `loadCanvasHandler`)
- keep the newest value in a **ref** when the effect should *read* it but not *re-run* for it (`latest.current` in the autosave flush)
- use functional updates `setX(prev => ...)` to drop a state dependency

> **Key insight:** a dependency array is not "what should re-trigger this effect". It is "everything from the render scope this effect uses". You control re-running by controlling what's stable.

---

### The stale closure bug (real example from this project)

```js
useEffect(() => {
  const handlePageHide = () => saveCanvas(token, canvasId, elements);   // captured ONCE
  window.addEventListener('pagehide', handlePageHide);
  ...
}, []);     // never re-subscribes → always the FIRST render's elements (empty array!)
```

The listener is registered once and outlives every later render, so it kept saving an empty canvas over real work. Fixed with a ref that is read *at event time* instead of captured *at subscribe time*:

```js
const latest = useRef({ token, canvasId, elements });
// ...updated whenever a change is committed
const { token, canvasId, elements } = latest.current;   // always current
```

---

## Professional `try...catch` Architecture

### The golden rule

> Only use `try...catch` at layers that can **act** on the error. Never swallow errors in middle layers; let them bubble up to where they matter.

Errors travel up the `await` chain automatically. A layer that catches only to re-throw does nothing, and a layer that catches and re-wraps **destroys information**.

---

### The three tiers

**1. The API layer (`services/`)** — *creates* the error

- checks `res.ok`, because `fetch` does **not** throw on 404 or 500 — only on network failure
- normalises the shape and attaches what callers need (`status`, later `fields`)
- `throw`s it upward; may also report to telemetry (Sentry etc.)

```js
const data = await res.json().catch(() => ({}));
if (!res.ok) {
  const error = new Error(data.message || `Request failed (${res.status})`);
  error.status = res.status;
  throw error;
}
return data;
```

**2. The middle layers (providers, helpers, business logic)** — *no* `try...catch`

They call functions and return data. If something throws, JavaScript skips straight past them to the caller.

```js
const login = async (payload) => {
  const token = await authenticateLogin(payload);   // throws → caller deals with it
  localStorage.setItem("token", token);
  setIsLogin(true);
};
```

**3. The UI layer (components)** — *handles* the error

The only layer that controls the screen, so the only one that can decide what the user sees: stop the spinner, set state, show a banner, redirect.

```js
try {
  await login(payload);
} catch (err) {
  if (err.status === 401) setLoginError("Invalid email or password");
  else if (!err.status)   setLoginError("Unable to connect. Check your internet.");
  else                    setLoginError("Something went wrong. Please try again.");
} finally {
  setSubmitting(false);     // runs on success and failure
}
```

---

### `throw err` vs `throw new Error(err.message)`

An `Error` is just an object, and `error.status = 401` is a property on **that** object.

```js
throw err;                      // same object → status survives
throw new Error(err.message);   // NEW object → only the message is copied, status is lost
```

Re-wrapping was the root of several bugs in this project: the component checked `err.status === 401`, but a middle layer had already thrown it away, so every failure looked like a network error. To wrap while keeping the original, use `new Error("...", { cause: err })`.

> **Key insight:** `catch (err) { throw err }` is a no-op. Delete the `try` entirely — the error propagates on its own.

---

### Success and failure must be unambiguous

A function either **always throws on failure**, or **always returns a result you check** — never a mix. Mixing is what caused `authenticateLogin` to return an `Error` object that `await` happily treated as success.

Once a function always throws, callers need no check at all:

```js
await register(payload);    // reached the next line → it worked
```

---

### The safety net

Two things these three tiers cannot catch:

- **errors thrown during render** → use an **Error Boundary** component to show a fallback instead of a blank page
- **anything you forgot** → `window.addEventListener("unhandledrejection", ...)` wired to logging

Error Boundaries do **not** catch errors inside event handlers or async callbacks — that's what tier 3 is for.

---

## React Router

### The core idea

Without a router, a single-page app decides what to show from state (`showLogin ? <Login/> : <Home/>`). The URL never changes, so refreshing resets everything and nothing can be bookmarked or shared.

A router flips this: **the URL decides what renders.**

---

### Setup

`BrowserRouter` wraps the app once. Any component using a router hook must be inside it.

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

> In React Router v7 everything imports from `react-router`; the separate `react-router-dom` package is no longer needed.

---

### `Routes` and `Route`

`Routes` renders the **one** best match.

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/items/:id" element={<ItemPage />} />
  <Route path="*" element={<Navigate to="/" />} />   {/* catch-all for unknown URLs */}
</Routes>
```

---

### URL parameters

A segment beginning with `:` is a parameter, read by the same name:

```jsx
<Route path="/items/:id" element={<ItemPage />} />
```

```js
const { id } = useParams();     // name must match the route
```

> **Key insight:** if a value decides what the page shows, the URL is usually the right home for it. Provider state disappears on refresh; the URL doesn't.

---

### Three ways to navigate

| Tool | Use for |
|---|---|
| `<Link to="...">` | something the user clicks |
| `<Navigate to="..." />` | a redirect decided while rendering |
| `useNavigate()` | navigating after an action finishes |

```js
const navigate = useNavigate();
navigate('/items/42');                      // push — back button returns here
navigate('/home', { replace: true });       // replace — back button skips this entry
```

Use `replace` when returning to the current page would be wrong, such as after a successful login or form submission.

**`Link` vs `<a href>`:** `Link` is handled by the router — it swaps components and keeps all React state. An `<a>` makes the browser reload the page, destroying and rebuilding the entire app.

---

### Route guards

A guard is just a conditional `element`:

```jsx
<Route path="/private" element={isLoggedIn ? <Private /> : <Navigate to="/login" replace />} />
<Route path="/login"   element={!isLoggedIn ? <Login /> : <Navigate to="/private" replace />} />
```

When the guard reads state from context, changing that state redirects on its own — no `navigate` call required. A route **without** a guard needs an explicit `navigate` instead.

---

### Where providers sit relative to routes

| Placement | State lifetime |
|---|---|
| Above `<Routes>` | lives as long as the app; survives all in-app navigation |
| Inside a `Route`'s element | created on entering the route, destroyed on leaving |

> **Key insight:** a provider's lifetime should match the feature's lifetime. State belonging to one page should live inside that page's route — otherwise stale data from the previous visit is still in memory when the next one mounts.

---

### Same route, different params = no remount

Going from `/items/1` to `/items/2` matches the **same** route, so React reuses the component: state is kept and effects with `[id]` re-run, but nothing unmounts. Only leaving the route unmounts it.

To force a real reset when just a param changes, give the component a `key`:

```jsx
<Provider key={id}>...</Provider>    // new key → unmount + remount
```

---

### Refresh is not navigation

In-app navigation keeps everything mounted above the route. A browser **refresh** destroys the whole JavaScript runtime and rebuilds every provider from its initial state. Only what lives outside React survives: `localStorage`, the server, or the URL itself.

---
