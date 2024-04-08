import { SimpleSpanProcessor } from "npm:@opentelemetry/sdk-trace-base@1.15.0";
import { NodeTracerProvider } from "npm:@opentelemetry/sdk-trace-node@1.15.0";
import { SpanKind } from "npm:@opentelemetry/api@1.4.1";
import type { Context, Span, SpanOptions } from "npm:@opentelemetry/api@1.4.1";
import { Resource } from "npm:@opentelemetry/resources@1.15.0";
import * as opentelemetry from "npm:@opentelemetry/api@1.4.1";
import { registerInstrumentations } from "npm:@opentelemetry/instrumentation@0.41.0";
import { HttpInstrumentation } from "npm:@opentelemetry/instrumentation-http@0.41.0";
import { FetchInstrumentation } from "npm:@opentelemetry/instrumentation-fetch@0.41.0";
import { ExpressInstrumentation } from "npm:@opentelemetry/instrumentation-express@0.32.4";
import { GraphQLInstrumentation } from "npm:@opentelemetry/instrumentation-graphql@0.34.3";
import { NetInstrumentation } from "npm:@opentelemetry/instrumentation-net@0.31.4";
import { SocketIoInstrumentation } from "npm:@opentelemetry/instrumentation-socket.io@0.33.4";
import { OTLPTraceExporter } from "npm:@opentelemetry/exporter-trace-otlp-http@0.41.0";
import { B3Propagator } from "npm:@opentelemetry/propagator-b3@1.22.0"

// Monkeypatching to get past FetchInstrumentation's dependence on sdk-trace-web, which depends on some browser-only constructs
Object.assign(globalThis, { location: {} }); // released but doesn't work  https://github.com/open-telemetry/opentelemetry-js/blame/6d13eb437932e46e021c840ac5d327d556eb3c52/packages/opentelemetry-sdk-trace-web/src/utils.ts#L315-L319

// Initialize provider and identify this particular service
// (in this case, we're implementing a federated gateway)
const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      "service.name": "test-service-second",
      "process.runtime.name": "deno",
      "service.instance.id": Deno.hostname(),
      "process.pid": Deno.pid,
    }),
  ),
});

// Do not need to set traceexporter as long as it is set in span processor
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

// Register the provider to begin tracing
provider.register({propagator: new B3Propagator()});

// Register server-related instrumentation
registerInstrumentations({
  tracerProvider: provider,
  // Sorry, there are not active instrumentations...
  instrumentations: [
    new GraphQLInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new FetchInstrumentation(),
    new SocketIoInstrumentation(),
    new NetInstrumentation(),
  ],
});

const tracer = opentelemetry.trace.getTracer("luna-tracer-main");
const context = opentelemetry.context.active();

export const startSpan = (
  spanName = "doWork",
  options: SpanOptions = {},
  ctx = context,
): Span =>
  tracer.startSpan(spanName, { kind: SpanKind.SERVER, ...options }, ctx);

const setSpan = (parent: Span): Context =>
  opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    parent,
  );

export const startSpanWith = (
  parent: Span,
  spanName = "doWork",
  options: SpanOptions = {},
): Span => startSpan(spanName, options, setSpan(parent));
