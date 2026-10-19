# Auto Bhaiya by NAKPRC — Setup & Configuration Guide

This guide covers the technical setup, environment configuration, Appwrite Cloud integration, and payment configuration for **Auto Bhaiya by NAKPRC**.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v9+)
- **Appwrite Account**: Free or Pro tier at [cloud.appwrite.io](https://cloud.appwrite.io) (or self-hosted v1.4+)

---

## 2. Environment Setup

Copy `.env.example` to `.env` in the root of your project:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_APPWRITE_ENDPOINT` | Appwrite REST/Realtime API endpoint | `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project identifier | `66a...` |
| `VITE_APPWRITE_DATABASE_ID` | Database ID containing collections | `autobhaiya_db` |
| `VITE_APPWRITE_BOOKINGS_COLLECTION_ID` | Collection ID for ride bookings | `bookings` |
| `VITE_APPWRITE_AUTOS_COLLECTION_ID` | (Optional) Collection ID for auto fleet | `autos` |

> **Graceful Fallback**: If Appwrite environment variables are omitted or invalid, the app automatically runs in **Offline/Local-First Mode** using browser `localStorage`. No runtime errors will be thrown to riders.

---

## 3. Appwrite Backend Setup

### Step 3.1: Create Web Platform
1. Log in to the Appwrite Console.
2. Select your project and navigate to **Platforms** -> **Add Platform** -> **Web App**.
3. Set **Name**: `Auto Bhaiya Web`.
4. Set **Hostname**: `localhost` (for development) and your production domains (e.g., `autobhaiya.nakprc.com`).

### Step 3.2: Create Database
1. Navigate to **Databases** -> **Create Database**.
2. **Database ID**: `autobhaiya_db` (or custom ID matching `VITE_APPWRITE_DATABASE_ID`).
3. **Name**: `Auto Bhaiya DB`.

### Step 3.3: Create `bookings` Collection
1. Inside `autobhaiya_db`, click **Create Collection**.
2. **Collection ID**: `bookings` (matching `VITE_APPWRITE_BOOKINGS_COLLECTION_ID`).
3. **Name**: `Bookings`.
4. Add the following **Attributes**:

| Attribute Key | Type | Size / Format | Required | Default |
|---|---|---|---|---|
| `bookingId` | String | 64 | Yes | - |
| `autoId` | String | 32 | Yes | - |
| `autoNumber` | String | 32 | Yes | - |
| `driverName` | String | 128 | Yes | - |
| `fare` | Integer | - | Yes | - |
| `status` | String | 32 | Yes | `confirmed` |
| `pickup` | String | 255 | No | `N/A` |
| `drop` | String | 255 | No | `N/A` |
| `date` | String | 32 | No | - |
| `time` | String | 32 | No | - |
| `passengerName` | String | 128 | No | `Guest` |
| `passengerPhone` | String | 32 | No | `N/A` |
| `createdAt` | String | 64 | No | - |

5. Configure **Permissions**:
   - Go to **Settings** -> **Permissions**.
   - Add Role `Any`: check **Create**, **Read**, **Update**.
   - (For production security, restrict Create/Update to authenticated users or API keys).

### Step 3.4: Real-time Event Subscription Flow
The client subscribes to real-time events via Appwrite Web SDK:
```javascript
// Located in src/lib/appwrite.js
client.subscribe(`databases.${DATABASE_ID}.collections.${BOOKINGS_COLLECTION_ID}.documents`, response => {
  // Dispatches local custom event 'autobhaiya:booking-update'
  // UI automatically refreshes without requiring page reload
});
```

---

## 4. Payment Configuration (`public/data/payment.json`)

Direct UPI payments are configured via `public/data/payment.json`.

```json
{
  "upiId": "autobhaiya@upi",
  "payeeName": "Auto Bhaiya NAKPRC",
  "merchantCode": "5499",
  "currency": "INR",
  "note": "Auto Bhaiya Ride Fare"
}
```

### Payment Handling & Safety:
- **Direct UPI Intent**: Mobile devices launch installed UPI apps (Google Pay, PhonePe, Paytm, BHIM) with `upi://pay?pa=...&pn=...&am=...&cu=INR`.
- **Dynamic QR Code**: Rendered via standard QR canvas for desktop or cross-device scan.
- **Config Validation**: If `upiId` is absent or set to empty, the UI displays a clear configuration warning notice instead of breaking.
- **Driver Confirmation Call**: Riders are prompted to call Auto Bhaiya first to confirm real availability before completing payment.
- **Self-Confirmation Disclaimer**: Because static UPI peer-to-peer transfers do not support server-side settlement webhooks without a merchant aggregator gateway, riders explicitly self-confirm payment status.

---

## 5. Local Development & Testing

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
App will be served at `http://localhost:5173`.

### Run Test Suite
```bash
node test-suite.mjs
```
Validates:
- Route registry & navigation structure
- Auto dataset (categories, fuel types, verification hashes)
- Search filter integrity
- Booking persistence & Appwrite integration hooks
- Fare calculation and boundary verification

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Troubleshooting

### Issue: "AppwriteException: General Error (Invalid Hostname)"
- **Cause**: Domain is not registered under Appwrite Web Platforms.
- **Fix**: Open Appwrite Console -> Platforms -> Add `localhost` (and port if non-standard).

### Issue: Realtime events not triggering
- **Cause**: WebSocket port blocked or collection permissions set to private.
- **Fix**: Ensure permissions on the `bookings` collection allow `Any` (or current user session) to read documents. The app will fallback to local storage updates automatically.

### Issue: QR Code not scanning on test phone
- **Cause**: Invalid UPI ID format in `payment.json`.
- **Fix**: Verify `upiId` matches `<username>@<bank/provider>`.
