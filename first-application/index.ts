import { startSpan, startSpanWith } from "./opentelemetry.ts";
// import { tracer } from "./node-sdk.ts";
import { TraceFlags } from "npm:@opentelemetry/api@1.4.1"

// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
// import data from "./data.json" assert { type: "json" };

const app = express();

app.get("/",  async (_req, res) => {
  // const span = startSpan('root-second')
  // res.send("Welcome to the Dinosaur API!");
  // span.end()
  const span = startSpan('root')
  const { traceId, spanId, traceFlags, traceState } = span.spanContext()
  const resp = await fetch("http://localhost:8080", {
    headers: {
      traceparent: `00-${traceId}-${spanId}-0${Number(traceFlags || TraceFlags.NONE).toString(16)}`,
    },
  });
  const data = await resp.text();
  res.send(data);
  span.end()
});

app.get("/api", async (_req, res) => {
  // const span = startSpan('api-second')
  // res.send(data);
  // span.end()

  const span = startSpan('api')
  const resp = await fetch("http://localhost:8080/api");
  const data = await resp.json();
  res.send(data);
  span.end()
  
});

app.get("/api/:dinosaur", async (req, res) => {
  // const span = startSpan('api/dinosaur-second')
  // if (req?.params?.dinosaur) {
  //   const child = startSpanWith(span, 'child')
  //   const found = data.find((item) =>
  //     item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
  //   );
  //   child.end()
  //   if (found) {
  //     res.send(found);
  //   } else {
  //     res.send("No dinosaurs found.");
  //   }
  // }
  // span.end()

  const span = startSpan('api/dinosaur')
  const resp = await fetch(`http://localhost:8080/api/${req?.params?.dinosaur}`);
  const data = await resp.json();
  res.send(data);
  span.end()
});

app.listen(8000);
