import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  memorySize: 256,
  timeout: 15,
  environment: {
    POSITION_STACK_API_KEY: "${env:POSITION_STACK_API_KEY}",
  },
};
