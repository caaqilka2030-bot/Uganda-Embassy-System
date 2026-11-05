# Somali Embassy Online Services Portal
### Embassy of the Federal Republic of Somalia | Kampala, Uganda
**Location:** Plot 46, Nakasero Road, P.O. Box 2736, Kampala, Uganda  
**Consular Hours:** Monday – Friday: 9:00 AM – 3:00 PM (Appointments Only)

---

## 1. System Overview
The **Somali Embassy Online Services Portal** is a production-grade digital consular application and management platform. It enables Somali citizens, diaspora members, and foreign visa applicants residing in Uganda to:
1. **Apply Online**: Select consular services and complete standardized civil questionnaires.
2. **Upload Documents**: Submit verified identity scans with AI automated quality and authenticity pre-checking.
3. **Pay Consular Fees**: Complete transactions via MTN Mobile Money, Airtel Money, Visa/Mastercard, or Bank Transfer prior to embassy visits.
4. **Schedule Biometrics & Collection**: Select guaranteed appointment time slots (Mon–Fri, 9:00–15:00) with zero waiting queues.
5. **Track Progress in Real Time**: Live status progression from submission to diplomatic seal and document collection.
6. **Digital Receipts & Certificates**: Official PDF payment receipts with QR verification codes and diplomatic approval certificates.

---

## 2. Seeded Demo Staff Accounts & Access Roles
Access the Back Office anytime via the top navigation **"Consular Portal"** or direct navigation to `/admin`. You can also switch between any of these roles with one click using the **Demo Role Switcher bar** at the top of the screen:

| Role | Demo Email | Demo Password | Responsibilities & Authorities |
| :--- | :--- | :--- | :--- |
| **Master User (Super Admin)** | `master@embassy.demo` | `Admin@123` | Full mission authority. Configures service fees (USD & UGX), currency exchange rates, appointment slots, staff accounts, audit trails, and system parameters. |
| **Consular Officer** | `consular@embassy.demo` | `Officer@123` | Vets dossiers, requests additional documentation, approves/rejects applications, issues official approval letters, and adds internal notes. |
| **Verification Officer** | `verification@embassy.demo` | `Verify@123` | Inspects uploaded identity credentials, verifies birth certificates, and triggers AI document pre-checks. |
| **Finance Officer** | `finance@embassy.demo` | `Finance@123` | Reconciles MTN/Airtel Mobile Money transactions, verifies Stanbic Bank deposit slips, issues refunds, and exports revenue audits. |
| **Reception / Front Desk** | `reception@embassy.demo` | `Desk@123` | Checks in arriving citizens, logs attendance, captures biometrics queue numbers, and records collector signatures upon handover. |
| **Auditor / Inspectorate** | `auditor@embassy.demo` | `Audit@123` | Read-only access to immutable audit trails, SLA compliance statistics, and revenue accounting. |

---

## 3. Official Embassy Service & Fee Structure

Derived directly from the official Chancery fees register:

| # | Consular Service | Official USD Fee | Official UGX Fee | Turnaround SLA | Notes |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Somali E-Passport** | **$170 USD** | **UGX 150,000** | 10–14 Days | Standard biometric renewal or new issuance. |
| 2 | **National ID (NIRA)** | *Fee to be confirmed* | **UGX 100,000** | 14–21 Days | USD fee confirmed upon enrollment. |
| 3 | **Power of Attorney (Wakaalad)** | **$200 USD** | Approx. UGX 770,000 | 2–3 Days | **Grantor must appear in person with 2 Somali witnesses.** |
| 4 | **Education Attestation** | *Fee to be confirmed* | **UGX 130,000** | 3–5 Days | Degree/diploma equivalence & Ministry stamp. |
| 5 | **Birth Certificate** | **Child: $50 / Adult: $100** | Auto-converted | 3–5 Days | Auto-calculated from applicant's date of birth. |
| 6 | **Go Home (Emergency Travel)** | **$70 USD** | Approx. UGX 269,500 | 1–2 Days | Urgent one-way travel document to Somalia. |
| 7 | **Death Certificate** | *Fee to be confirmed* | Consular review | 24 Hours | Repatriation permit & medical death notice review. |
| 8 | **Visa to Somalia** | *Fee to be confirmed* | By visa category | 5–7 Days | Business, tourist, humanitarian, transit visas. |
| 9 | **C.I.D Police Good Conduct** | **$100 USD** | Approx. UGX 385,000 | 7–10 Days | Background check clearance (Optional extra). |
| 10 | **Renunciation of Citizenship** | **$70 USD** | Approx. UGX 269,500 | 15–30 Days | Formal diplomatic renunciation affidavit (Optional extra). |

*Note: For any service marked "Fee to be confirmed", citizens can submit documents; staff verify the scope and set the official fee directly in the applicant's dossier to unlock online payment.*

---

## 4. Production Integration Guide

### A. Real Payment Gateways
In this prototype, payment transactions are handled through a clean abstraction layer. To connect live merchant accounts:

1. **MTN Mobile Money (Uganda Open API)**:
   - Create a merchant account on the [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/).
   - Obtain `X-Reference-Id`, `API Key`, and `Subscription-Key`.
   - Implement the `RequestToPay` collection endpoint:
     ```typescript
     POST https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay
     Headers: {
       "Authorization": "Bearer " + token,
       "X-Reference-Id": transactionId,
       "X-Target-Environment": "production",
       "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUB_KEY
     }
     ```
2. **Airtel Money Uganda API**:
   - Register for the Airtel Money Developer portal.
   - Use the `/merchant/v1/payments/` API to initiate USSD push prompts to Ugandan phone numbers (`+256 75...` / `+256 70...`).
3. **Card Payments (Visa / Mastercard)**:
   - Use **Pesapal Uganda** or **DPO Pay** for localized UGX/USD card clearing:
     ```typescript
     const pesapalOrder = {
       Amount: feeUsd,
       Currency: "USD",
       Description: `Consular Fee: ${referenceNumber}`,
       CallbackUrl: `${process.env.APP_URL}/api/payments/pesapal/callback`
     };
     ```
4. **Stanbic Bank Direct Transfer**:
   - For corporate accounts, integrate with Stanbic Bank Uganda Host-to-Host (H2H) or SFTP MT940 daily statement feeds to auto-reconcile reference numbers.

---

### B. Automated SMS & WhatsApp Notifications
To notify citizens at each stage (`Submitted`, `Payment Confirmed`, `Approved`, `Ready for Collection`):
- **Africa's Talking Uganda SMS**:
  ```typescript
  const AfricasTalking = require('africastalking')({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
  });
  await AfricasTalking.SMS.send({
    to: [applicantPhone],
    message: `Embassy of Somalia Kampala: Your dossier ${ref} is approved. Appointment booked for ${date} at ${time}.`,
    from: 'SOMALIEMB'
  });
  ```

---

### C. Real Database Migration (Firebase / PostgreSQL)
All records currently persist in localStorage with instant responsive feedback.
- To use **Firebase Firestore**: replace `AppContext.tsx` state dispatches with `collection(db, 'applications')` and onSnapshot listeners.
- To use **PostgreSQL with Cloud SQL / Drizzle**: run schema migrations with the provided models in `src/types/index.ts`.

---

### D. Gemini AI Assistant & Document Pre-check
The server `server.ts` exposes:
1. `POST /api/gemini/chat`: Bilingual consular chatbot (`gemini-3.8-flash`) with official embassy regulations preloaded.
2. `POST /api/gemini/doc-precheck`: Consular officer vision & metadata assessment analyzing document legibility, identity alignment, and seal authenticity.
Ensure your `GEMINI_API_KEY` is present in the AI Studio Secrets panel.
