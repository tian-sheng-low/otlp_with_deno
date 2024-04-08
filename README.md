## About this project

This project contains two simple Deno application that uses OpenTelemetry(OTLP) NodeSDK to demostrate the distributed tracing between them.

## Setup

1. Install [Deno](https://deno.com/)
2. Install [Jaeger](https://www.jaegertracing.io/)
3. Launch Jaeger
4. Start first and second application by using `deno task dev` command
5. Send HTTP request to the first application, it will then send another HTTP request the second application
6. Open Jaeger UI to check the distributed tracing
