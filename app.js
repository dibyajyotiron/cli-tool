#!/usr/bin/env node

require("dotenv").config();
const program = require("commander");

require("./services/commander")(program);
