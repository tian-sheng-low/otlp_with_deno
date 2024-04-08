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
import { NodeSDK } from "npm:@opentelemetry/sdk-node"
import { W3CTraceContextPropagator } from "npm:@opentelemetry/core"

const exporter = new OTLPTraceExporter()
export const tracer = () => {
  // opentelemetry.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  return opentelemetry.trace.getTracer("luna-tracer-main");
}

const sdk = new NodeSDK({
  resource: new Resource({
    "service.name": "test-service",
    "process.runtime.name": "deno",
    "service.instance.id": Deno.hostname(),
    "process.pid": Deno.pid,
  }),
  spanProcessor: new SimpleSpanProcessor(exporter),
  traceExporter: exporter,
  instrumentation: [
    new GraphQLInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    // new FetchInstrumentation(),
    new SocketIoInstrumentation(),
    new NetInstrumentation(),
  ],
  // textMapPropagator: new W3CTraceContextPropagator(),
})

sdk.start()
