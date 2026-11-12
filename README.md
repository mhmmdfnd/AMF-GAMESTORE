# AMF GAMESTORE — Production-oriented starter

Marketplace storefront for PUBG Mobile, Mobile Legends, Free Fire and eFootball.
Stack: Next.js 15 App Router + Supabase Auth/Postgres/Private Storage + Vercel.
Payment: manual bank transfer / WhatsApp confirmation. Delivery: admin handled manually.

## Included
- Public storefront and active product catalogue backed by Supabase.
- Supabase email/password sign-in.
- Customer order creation and order history.
- Private payment-proof uploads (5 MB max, JPG/PNG/WEBP/PDF).
- Admin order queue with proof preview via short-lived signed URLs.
- Admin status workflow with allowed transitions and audit events.
- Product creation screen.
- Role model: owner, admin, staff, customer.
- RLS policies and private storage bucket.

## Important production boundary
This is a production-oriented code foundation, not a security-audited turnkey commerce system. Before accepting real orders, run the deployment checklist and test with separate customer/staff/owner accounts. Manual transfer details and WhatsApp number are intentionally not hardcoded. Admin manually verifies funds in their bank/e-wallet account; an uploaded screenshot alone is never proof of settled funds. Admin sends game-account credentials through a controlled handover process outside this starter. Do not put game passwords, recovery codes, or OTPs into public product fields, browser storage, logs, or customer-visible notes.

## 1. Supabase setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/migrations/001_initial.sql`.
3. In Authentication > Providers, enable Email. Configure email confirmation and SMTP for production.
4. In Storage, verify the `payment-proofs` bucket exists and is **private**.
5. Create first owner via Authentication > Users > Add user. Confirm email as appropriate.
6. Copy that user's UUID and run:
   `update public.profiles set role='owner' where id='YOUR_AUTH_USER_UUID';`
7. Add admin/staff users via Supabase Auth. Their profile rows are automatically created as `customer`. Owner changes roles using SQL, e.g.:
   `update public.profiles set role='admin' where id='USER_UUID';`
   `update public.profiles set role='staff' where id='USER_UUID';`
   Staff can view orders and proof files but cannot add products or change order status through this starter's API. Admin can manage products and orders. Owner controls privileged role assignment.
8. Configure Auth > URL Configuration: Site URL and redirect URLs for localhost and the production Vercel domain.

## 2. Local development
- Install Node.js 20+.
- Copy `.env.example` to `.env.local`.
- Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Keep service role key server-only. Never use `NEXT_PUBLIC_` for it; never commit `.env.local`.
- Run `npm install`, `npm run dev`, open `http://localhost:3000`.

## 3. Deploy to Vercel
1. Push this folder to a private GitHub repository.
2. Import it in Vercel as a Next.js project.
3. Add all environment variables from `.env.example` in Vercel Project Settings > Environment Variables (Production, Preview, Development as needed).
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
5. Deploy. Redeploy after changing environment variables.
6. Configure Supabase Auth Site URL and redirect allowlist to the Vercel domain.
7. Test the production domain with a customer account and each staff role.

## 4. Order operations
- Customer signs in, selects an active product and creates an order.
- Customer uploads transfer receipt from My Orders.
- Admin opens Admin > Orders and reviews receipt. Verify the actual incoming transfer in the financial account independently.
- Admin changes status to `paid`, then `processing`, then `delivered` after manual handover.
- `payment_rejected` allows customer to submit a corrected receipt. Cancelled and delivered orders are terminal in this starter.
- Contact customer using the phone number stored with the order. WhatsApp deep links can be added after the official support number is configured.

## 5. Multi-admin role model
- `owner`: role assignment via trusted Supabase SQL; full authority.
- `admin`: product management and order status management.
- `staff`: view order queue and payment proof; no product/status mutation through app API.
- `customer`: own orders and own payment proof only.
Never create public admin registration. Disable accounts promptly when staff leave.

## 6. Security checklist before launch
- [ ] Rotate any keys that were ever committed or shared.
- [ ] Enable MFA for all owner/admin accounts.
- [ ] Configure SMTP, email confirmation, password reset, and rate limits.
- [ ] Add CAPTCHA / abuse protection to public-facing sign-in and order creation if exposed to abuse.
- [ ] Add customer sign-up/onboarding if desired; currently accounts are provisioned by admin in Supabase Auth.
- [ ] Review SQL RLS policies against your business rules with a separate test account.
- [ ] Keep service-role key only in Vercel server environment; it bypasses RLS.
- [ ] Add rate limiting for order/proof endpoints (e.g. Upstash Redis or an edge WAF).
- [ ] Add file malware scanning and stricter image/PDF validation if risk warrants.
- [ ] Add transactional stock reservation, order expiry, and concurrency-safe inventory decrement before enabling high-volume sales.
- [ ] Add immutable audit log coverage for product edits, role changes, and all order changes.
- [ ] Add backup/PITR plan and incident response contact.
- [ ] Publish Terms, Privacy, Refund/Dispute and delivery policies.
- [ ] Confirm account transfers comply with each game publisher's terms and platform rules.
- [ ] Do not claim guaranteed recovery-proof, ban-proof, or absolute account security.

## 7. Known implementation limits to address
- The product schema uses stock display; this starter does not reserve/decrement inventory atomically.
- Payment proof upload creates a record, but the admin must verify bank receipt manually.
- The current owner role bootstrap and role changes use Supabase SQL, not an in-app role editor.
- No public sign-up, password reset screen, email notifications, WhatsApp API integration, shipping automation, or payment gateway.
- Admin proof links expire after 5 minutes.
- No account credential vault is implemented by design. Handover should be manual and follow least-privilege practices.

## 8. Useful SQL
List team members:
`select id, display_name, role, is_active from public.profiles order by created_at;`
Deactivate an account:
`update public.profiles set is_active=false where id='USER_UUID';`
Change a user's role:
`update public.profiles set role='staff' where id='USER_UUID';`
Add sample product:
`insert into public.products(title,game,short_description,price,stock,is_active) values ('Contoh akun PUBG','PUBG Mobile','Deskripsi publik tanpa kredensial.',250000,1,true);`
