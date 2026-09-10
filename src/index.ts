#!/usr/bin/env node
import createProgram from './cli/cli.js';

const program = createProgram();

await program.parseAsync();
