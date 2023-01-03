import type { AWS } from "@serverless/typescript";

import fuelPrice from "@functions/fuelPrice";
import { Lift } from "serverless-lift";

const serverlessConfiguration: AWS & Lift = {
  service: "fuel-price-lambda",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-esbuild", "serverless-lift", "serverless-localstack"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    stage: "local",
    region: "ap-southeast-2",
  },
  // import the function via paths
  constructs: {
    fuel_price: {
      type: "queue",
      worker: fuelPrice,
    },
  },
  resources: {
    Resources: {
      fuelPriceTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "fuelPriceTable",
          TableClass: "STANDARD",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "uuid",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "uuid",
              KeyType: "HASH",
            },
          ],
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    localstack: {
      stages: ["local"],
    },
  },
};

module.exports = serverlessConfiguration;
