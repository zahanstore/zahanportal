# Supabase Contact Form Setup Guide
## Zahan Store — contact.html

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Name it `zahan-store`, choose a region close to UAE (e.g. Frankfurt or Mumbai)
4. Save your DB password somewhere safe

---

## Step 2 — Create the `contact_messages` Table

In your Supabase dashboard, go to **SQL Editor** and run this:

```sql
create table contact_messages (
  id          bigserial primary key,
  name        text not null,
  email       text not null,
  department  text not null,
  routed_to   text,
  subject     text not null,
  message     text not null,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table contact_messages enable row level security;

-- Allow anyone to INSERT (public contact form)
create policy "Allow public insert"
  on contact_messages for insert
  to anon
  with check (true);

-- Only authenticated users (you) can SELECT
create policy "Allow auth select"
  on contact_messages for select
  to authenticated
  using (true);
```

---

## Step 3 — Get Your API Credentials

In Supabase dashboard:
1. Go to **Project Settings** → **API**
2. Copy your **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
3. Copy your **anon / public** key (the long JWT string)

---

## Step 4 — Add Credentials to contact.html

Open `contact.html` and find these two lines near the bottom:

```js
const SUPABASE_URL  = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your actual values:

```js
const SUPABASE_URL  = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Step 5 — View Messages in Supabase

Go to **Table Editor** → `contact_messages` — all form submissions will appear here with:

| Column       | Description                              |
|--------------|------------------------------------------|
| `name`       | Sender's name                            |
| `email`      | Sender's email                           |
| `department` | `support` / `store` / `legal` / `hr`    |
| `routed_to`  | Which @mail.zahan.one it was sent to     |
| `subject`    | Subject line                             |
| `message`    | Full message body                        |
| `created_at` | Timestamp                                |

---

## Department → Email Routing

| Department value | Routes to                  |
|------------------|---------------------------|
| `support`        | support@mail.zahan.one    |
| `store`          | store@mail.zahan.one      |
| `legal`          | legal@mail.zahan.one      |
| `hr`             | hr@mail.zahan.one         |

> 💡 **Pro tip**: You can set up Supabase Edge Functions or webhooks later to automatically forward emails to the right inbox when a new row is inserted.

---

## Optional — Enable Email Notifications (Advanced)

Once the basic setup works, you can add auto-email forwarding via:
- **Supabase Edge Functions** (serverless, runs on Deno)
- **Resend** or **Postmark** (transactional email APIs)
- **Zapier / Make** webhook triggered on new Supabase row

Ask me and I'll help set that up! 🚀
