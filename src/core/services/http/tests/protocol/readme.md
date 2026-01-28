# HTTP Protocol "Negative" Test

## Overview

This folder contains a custom fuzzer designed to test the robustness of the Deadbolt HTTP parser. Unlike standard testing tools (curl, Postman), these tests use raw TCP socket manipulation via PowerShell to send intentionally malformed or "illegal" HTTP requests.

## Why Manual Fuzzing?

Standard HTTP clients are too "safe." They automatically fix line endings, sanitize headers, and ensure protocol compliance. To truly test the server's security and resilience, there's a need to violate the protocol:

- **Byte-Level Control:** Sending Null bytes (`0x00`) or illegal characters (`$`) in header names.
- **Line Ending Precision:** Testing the difference between `LF` and `CRLF`.
- **Incomplete Requests:** Testing how the server handles a client that stops sending data halfway through a header.
- **Timing Attacks:** Introducing artificial delays between request tokens.

## Folder Structure

- `/cases`: Individual `.ps1` scripts, each representing one specific "negative" payload.
- `run_all_tests.ps1`: The master runner that executes all cases with a 5-second timeout.

## How to Run

1. Start the Deadbolt server: `node dist/service.js`
2. Open PowerShell in this directory.
3. Enable script execution (session-only):
   `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process`
4. Execute the runner:
   `.\run_all_tests.ps1`
