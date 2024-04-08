// import { startSpan, startSpanWith } from "./opentelemetry.ts";
import { tracer } from "./node-sdk.ts";

// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import data from "./data.json" assert { type: "json" };

const app = express();

app.get("/", (_req, res) => {
  // const span = startSpan('root-second')
  // res.send("Welcome to the Dinosaur API!");
  // span.end()
  const span = tracer().startSpan('root-second')
  res.send("Welcome to the Dinosaur API!");
  span.end()
});

app.get("/api", (_req, res) => {
  // const span = startSpan('api-second')
  // res.send(data);
  // span.end()

  tracer().startActiveSpan('api-second', (span) => {
    res.send(data);
    span.end()
  })
});

app.get("/api/:dinosaur", (req, res) => {
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

  tracer().startActiveSpan('api/dinosaur-second', (span) => {
    if (req?.params?.dinosaur) {
      const found = data.find((item) =>
        item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
      );
      if (found) {
        res.send(found);
      } else {
        res.send("No dinosaurs found.");
      }
    }
    span.end()
  })
});

app.listen(8080);
