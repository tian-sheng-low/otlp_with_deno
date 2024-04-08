import { SimpleSpanProcessor } from "npm:@opentelemetry/sdk-trace-base@1.15.0";
import { Resource } from "npm:@opentelemetry/resources@1.15.0";
import * as opentelemetry from "npm:@opentelemetry/api@1.4.1";
import { HttpInstrumentation } from "npm:@opentelemetry/instrumentation-http@0.41.0";
import { ExpressInstrumentation } from "npm:@opentelemetry/instrumentation-express@0.32.4";
import { GraphQLInstrumentation } from "npm:@opentelemetry/instrumentation-graphql@0.34.3";
import { NetInstrumentation } from "npm:@opentelemetry/instrumentation-net@0.31.4";
import { SocketIoInstrumentation } from "npm:@opentelemetry/instrumentation-socket.io@0.33.4";
import { OTLPTraceExporter } from "npm:@opentelemetry/exporter-trace-otlp-http@0.41.0";
import { NodeSDK } from "npm:@opentelemetry/sdk-node"

const exporter = new OTLPTraceExporter()
export const tracer = () => {
  return opentelemetry.trace.getTracer("luna-tracer-main");
}

const sdk = new NodeSDK({
  resource: new Resource({
    "service.name": "test-service",
    "process.runtime.name": "deno",
    "service.instance.id": Deno.hostname(),
    "process.pid": Deno.pid,
  }),
  // @ts-expect-error: Somehow the processor type does not match
  spanProcessor: new SimpleSpanProcessor(exporter),
  traceExporter: exporter,
  instrumentation: [
    new GraphQLInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new SocketIoInstrumentation(),
    new NetInstrumentation(),
  ],
})

sdk.start()
