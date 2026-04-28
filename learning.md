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
