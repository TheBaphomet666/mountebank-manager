# MounteBank Manager

A small TypeScript library to manage Mountebank test doubles. Packaged as `@moka1177/mountebank-manager` and built to `dist`.

## Overview

MounteBank Manager provides a programmatic interface to start/stop a local Mountebank server and create, delete, or clear imposters for HTTP testing. It is written in TypeScript and tested with Jest.

## Installation

Install from npm:

```bash
npm install @moka1177/mountebank-manager
```
Usage
Example (TypeScript):

```typescript
import { mounteBankManager } from '@moka1177/mountebank-manager';

async function run() {
await mounteBankManager.startMountebank();
const stubs = [ /* stub definitions */ ];
await mounteBankManager.createImposter(stubs, '4545');
// run tests against http://localhost:4545
await mounteBankManager.stopMountebank();
}

run();
```
Public API (high level)
startMountebank(): Promise<void> — starts Mountebank process.
createImposter(stubs, servicePort: string): Promise<any> — posts a new imposter.
deleteImposter(servicePort: string): Promise<void> — deletes a specific imposter.
clearAllImposters(): Promise<void> — removes all imposters.
stopMountebank(): Promise<void> — clears imposters and stops Mountebank.