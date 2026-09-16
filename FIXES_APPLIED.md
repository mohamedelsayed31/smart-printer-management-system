# Smart Printer System - Review Fixes

## AI / Waste
- Replaced the obsolete `gemini-pro-vision` usage with the current Gemini REST `generateContent` flow and removed the deprecated `@google/generative-ai` dependency.
- Default Gemini model: `gemini-2.5-flash` (configurable through `GEMINI_MODEL`).
- Added optional Groq Vision fallback using the existing `groq-sdk` dependency.
- Added JSON parsing/validation, timeout handling, image type validation, and 8 MB upload limit.
- Added `faultType`, `aiExplanation`, `aiProvider`, and `aiStatus` to the Waste schema so AI results are actually persisted.
- AI failure now produces `Unknown` instead of incorrectly blaming the employee.

## Functional fixes
- Added the missing `/dashboard/profile/me` backend API used by the React Profile page.
- Fixed attendance status so a completed day cannot be checked in again after refresh.
- Fixed React inventory field from `item.name` to `item.itemName`.
- Print price now comes from the server-side inventory selling price, not a hard-coded client value.
- Fixed the broken attendance admin render target.
- Enabled the `/auth/signup` route used by the existing signup form.

## Security/configuration fixes
- Removed the hard-coded MongoDB URI from source code and moved it to `MONGO_URI`.
- Removed hard-coded JWT secret usage and made JWT configuration environment-based.
- Protected material, employee, and EJS print-job admin routes; main dashboard is now admin-only.
- Frontend API URL and backend CORS origin are now configurable by environment variables.
- Secrets in the uploaded project were intentionally blanked in the fixed copy. Rotate the old MongoDB password and Gemini key before reuse.
