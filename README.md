# Nutrixon — AI-Powered Food Product Verification and Nutrition Platform

**Tagline:** Screen Before Launch. Scan Before You Consume.

Nutrixon is a hackathon MVP for food product verification and nutrition transparency.

> **Prototype notice:** Nutrixon is not government-authorized, not legally mandatory, and does not physically test food.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide icons
- React Hook Form + Zod
- Supabase-ready auth/data/storage architecture (demo fallback when env vars are missing)

## Run locally

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run lint
npm run test
npm run build
```

## Demo mode behavior

If Supabase and external service environment variables are not configured:

- Auth runs in clearly labeled local demo role mode.
- Scanner supports manual entry and demo extraction fallback.
- Barcode lookup shows fallback messaging unless endpoint is configured.
- Demo data powers company/reviewer/registry flows.

## Main pages

1. Home
2. Consumer Product Scanner
3. Product Results
4. Company Portal
5. Submit a Product
6. Submission Tracking
7. Reviewer Dashboard
8. Product Verification Registry
9. About Nutrixon
10. Sign In / Sign Up

## Functional highlights

- Role-based protected routes for company/reviewer/admin pages
- Scanner supports image upload, camera capture input, manual nutrition entry, editable extracted fields
- Category-aware prototype Nutrition Quality Score (1–100) with insufficient-data handling
- Rule-based ingredient screening with references and certainty labels
- Laboratory evidence status logic that never marks failed/pending/missing evidence as verified
- Company submission flow with draft/save/submit and file type-size validation
- Reviewer workspace with queues, search, notes, and action controls
- Public registry exposing only safe public fields and evidence limitations

## Security and configuration notes

- Never place Supabase service-role keys in frontend code.
- Use only `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` for client usage.
- Private documents should be stored in Supabase private buckets with signed URLs on authorized access.
- SQL schema and RLS starter policies are included in:
  - `supabase/migrations/0001_init.sql`

## External setup still required for production

- Real Supabase authentication and role provisioning
- Persistent PostgreSQL data writes/reads
- Private storage bucket policies for uploaded files
- Real OCR/barcode integrations
- Full regulatory rule-set and jurisdiction-specific references

## Tests included

- Nutrition score logic
- Ingredient screening logic
- Role permission helper
- Verification-status logic

