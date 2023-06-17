import { SSTConfig } from "sst";
import { DevStack } from "./stacks/DevStack";

export default {
  config(_input) {
    return {
      name: "ArtHandler",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(DevStack);
  }
} satisfies SSTConfig;
