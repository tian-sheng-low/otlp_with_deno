import { startSpan, startSpanWith } from "./opentelemetry.ts";
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
// import data from "./data.json" assert { type: "json" };


const app = express();

app.get("/", async (_req, res) => {
  const span = startSpan('root')
  const resp = await fetch("http://localhost:8080");
  const data = await resp.text();
  res.send(data);
  span.end()
});

app.get("/api", async (_req, res) => {
  const span = startSpan('api')
  const resp = await fetch("http://localhost:8080/api");
  const data = await resp.json();
  res.send(data);
  span.end()
});

app.get("/api/:dinosaur", async (req, res) => {
  const span = startSpan('api/dinosaur')
  if (req?.params?.dinosaur) {
    const child = startSpanWith(span, 'child')
    const resp = await fetch(`http://localhost:8080/api/${req?.params?.dinosaur}`);
    const data = await resp.json();
    res.send(data);
    child.end()
  }
  span.end()
});

app.listen(8000);
