import { tracer } from "./node-sdk.ts";
import { Span, TraceFlags } from "npm:@opentelemetry/api@1.4.1"

// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const tracercontext = (span: Span) => {
  const { traceId, spanId, traceFlags } = span.spanContext()
  return {
    traceparent: `00-${traceId}-${spanId}-0${Number(traceFlags || TraceFlags.NONE).toString(16)}`,
  }
}

const app = express();

app.get("/",  async (_req, res) => {
  const span = tracer().startSpan('root')
  const resp = await fetch("http://localhost:8080", {
    headers: tracercontext(span),
  });
  const data = await resp.text();
  res.send(data);
  span.end()
});

app.get("/api", async (_req, res) => {
  const span = tracer().startSpan('api')
  const resp = await fetch("http://localhost:8080/api", {
    headers: tracercontext(span),
  });
  const data = await resp.json();
  res.send(data);
  span.end()
  
});

app.get("/api/:dinosaur", async (req, res) => {
  const span = tracer().startSpan('api/dinosaur')
  const resp = await fetch(`http://localhost:8080/api/${req?.params?.dinosaur}`, {
    headers: tracercontext(span),
  });
  const data = await resp.json();
  res.send(data);
  span.end()
});

app.listen(8000);
