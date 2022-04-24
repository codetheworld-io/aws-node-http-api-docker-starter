import { manageMovies } from '@functions/movies';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'aws-node-http-api-docker-starter',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    manageMovies,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: 'inline',
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      tsconfig: 'tsconfig.build.json',
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: [
          'src/**/*.spec.ts',
          'src/**/*.router.ts',
          'src/functions/**/index.ts',
        ],
      },
    },
    'serverless-offline': {
      httpPort: 4000,
      noAuth: true,
      noPrependStageInUrl: true,
    },
  },
};

module.exports = serverlessConfiguration;
