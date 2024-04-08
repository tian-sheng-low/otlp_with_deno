import { tracer } from "./node-sdk.ts";

// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import data from "./data.json" assert { type: "json" };

const app = express();

app.get("/", (_req, res) => {
  const span = tracer().startSpan('root-second')
  res.send("Welcome to the Dinosaur API!");
  span.end()
});

app.get("/api", (_req, res) => {
  tracer().startActiveSpan('api-second', (span) => {
    res.send(data);
    span.end()
  })
});

app.get("/api/:dinosaur", (req, res) => {
  tracer().startActiveSpan('api/dinosaur-second', (span) => {
    if (req?.params?.dinosaur) {
      const found = data.find((item) =>
        item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
      );
      if (found) {
        res.send(found);
      } else {
        res.status(404).json({"errors": [
          "No dinosaurs found."
        ]})
      }
    }
    span.end()
  })
});

app.listen(8080);
