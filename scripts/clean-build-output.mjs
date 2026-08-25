#!/usr/bin/env node

import { rmSync } from "node:fs";

// Vercel restores build caches between deployments. Always remove compiled
// output before Next runs so source changes cannot ship with an older CSS or
// JavaScript chunk. Development uses .next-dev and is intentionally untouched.
rmSync(".next", { recursive: true, force: true });
console.log("Cleared stale .next production output.");
