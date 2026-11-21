# DNS Recovery & Email Authentication — aubadecounselling.com

**Dates:** November 14–15, 2026
**Context:** Preparing to move hosting from WordPress on SiteGround to a self-hosted Nuxt application (this repo). During preparation we discovered the domain's DNS was not under our control and recovered it.

---

## 1. Starting situation

| Fact | Detail |
|---|---|
| Domain registration | GoDaddy (`aubadecounselling.com`) |
| DNS zone | Hosted at **Cloudflare** — nameservers `jim.ns.cloudflare.com` / `meadow.ns.cloudflare.com` |
| Cloudflare access | **None.** No account login existed for the domain's zone (likely set up by a previous provider/person) |
| Web hosting | WordPress on **SiteGround**, origin IP hidden behind Cloudflare's proxy |
| Email | **Google Workspace** (MX records point at Google; mailboxes at Gmail) |
| DNSSEC | Not enabled (no DS record at the registrar) — simplified the switch |

## 2. Zone capture before the switch

Because the Cloudflare zone was still live and publicly readable, the full record set was captured with `dig` before any change. This snapshot became the recovery source. Captured:

- `A` `mail` → `35.209.67.34` (this was the only leak of the real SiteGround origin IP — the root and www records were proxied to Cloudflare IPs `104.21.10.49` / `172.67.189.241`)
- `MX` ×5 → Google Workspace (`aspmx.l.google.com` prio 1; `alt1`/`alt2` prio 5; `alt3`/`alt4` prio 10)
- `TXT` ×3 → two `google-site-verification=` tokens + SPF `v=spf1 +a +mx include:aubadecounselling.com.spf.auto.dnssmarthost.net ~all`
- No DKIM record existed for the domain (see §5)

## 3. Nameserver transfer (Nov 14, 2026)

In GoDaddy Domain Portfolio → Edit nameservers, switched from the Cloudflare pair to **GoDaddy nameservers** (`ns29` / `ns30.domaincontrol.com`). Verified via the .com TLD servers that the delegation had updated.

Consequence (expected): the GoDaddy zone started as a fresh default zone — site parked, no MX/SPF. The WordPress site and email were offline-at-the-record-level until the records below were recreated.

## 4. Records recreated at GoDaddy (Nov 14–15, 2026)

Current zone at GoDaddy (verified live via `dig @ns29.domaincontrol.com` and public resolvers):

| Type | Name | Value | Priority | TTL |
|---|---|---|---|---|
| A | @ | 35.209.67.34 (SiteGround origin) | — | 600s |
| A | mail | 35.209.67.34 | — | 1 h |
| CNAME | www | aubadecounselling.com | — | 1 h |
| CNAME | autodiscover | ghs.google.com | — | 1 h |
| MX | @ | aspmx.l.google.com | 1 | 1 h |
| MX | @ | alt1.aspmx.l.google.com | 5 | 1 h |
| MX | @ | alt2.aspmx.l.google.com | 5 | 1 h |
| MX | @ | alt3.aspmx.l.google.com | 10 | 1 h |
| MX | @ | alt4.aspmx.l.google.com | 10 | 1 h |
| TXT | @ | `v=spf1 include:_spf.google.com include:aubadecounselling.com.spf.auto.dnssmarthost.net ~all` | — | 1 h |
| TXT | @ | `google-site-verification=Sd1uSBBiw_4ZegHIZUS5iGg2AJsupzKNKylDeocEfZE` | — | 1 h |
| TXT | @ | `google-site-verification=lCPw-Hoccuni5-YGGbZ5MwQWKhUSYVEEGGXVAZUM-Uo` | — | 1 h |
| TXT | _dmarc | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:info@aubadecounselling.com;` | — | 1 h |
| TXT | google._domainkey | `v=DKIM1; k=rsa; p=MIIBIjANBgkq...` (Google Workspace 2048-bit key) | — | 1 h |
| TXT | _domainconnect | _domainconnect.gd.domaincontrol.com | — | 1 h |
| NS / SOA | @ | ns29 / ns30.domaincontrol.com (GoDaddy infrastructure — do not touch) | — | 1 h |

Left in place from GoDaddy defaults: `NS` ×2, `SOA`, `_domainconnect`, `_dmarc` (policy updated, see §5).

## 5. Email authentication hardening (Nov 15, 2026)

**Problem:** test mail from `info@aubadecounselling.com` landed in the recipient's Spam with Gmail's "isn't authenticated" banner.

**Root causes found:**

1. The legacy SPF (`+a +mx`) no longer covers Google Workspace's sending IPs. Google sends from `mail-sor.*` servers (e.g. `209.85.220.65`), which the MX-hostname lookup misses — producing `SPF: SOFTFAIL`.
2. **No DKIM key existed.** Google signed outgoing mail with its generic legacy signer (`d=aubadecounselling-com.20260707.gappssmtp.com`), which does not align with the From domain, so DMARC depended entirely on SPF — and broke whenever DNS hiccupped (as during the migration window).
3. A stale "User suspended" alert for `info@` was confirmed stale — the user is Active.

**Fixes applied:**

- Enabled proper DKIM: Google Admin console → Apps → Google Workspace → Gmail → **Authenticate email** → generated a 2048-bit key (selector `google`) → published the `google._domainkey` TXT at GoDaddy → clicked **Start authentication**. Verified live at GoDaddy, Google DNS (8.8.8.8) and Cloudflare DNS (1.1.1.1).
- Updated SPF to `v=spf1 include:_spf.google.com include:aubadecounselling.com.spf.auto.dnssmarthost.net ~all` (Google's official sending pool + SiteGround while WordPress still sends from there; dropped the obsolete `+a`/`+mx`).
- Updated `_dmarc` so reports go to `info@aubadecounselling.com` instead of GoDaddy's generic `dmarc_rua@onsecureserver.net`.

**Verified results (Show original, test mail):** `DKIM: PASS (d=aubadecounselling.com, s=google)`, `DMARC: PASS`. First test showed `SPF: SOFTFAIL` due to the legacy record; the updated SPF should turn that to PASS on the next test.

## 6. Rules established for the Nuxt cutover

Email is independent of web hosting (MX → Google). The cutover therefore only touches web records:

1. **Only edit `A @`** (www follows via its CNAME) — point it at the new self-hosted server IP *after* the Nuxt app is verified working over HTTPS on its raw IP.
2. **Never delete or edit** MX / SPF / DKIM / DMARC / verification TXT records during a web-hosting migration.
3. Keep SiteGround active 1–2 weeks after cutover as a fallback.
4. At SiteGround cancellation: trim SPF to `v=spf1 include:_spf.google.com ~all`; delete the `mail` A record (after confirming no mail client uses `mail.aubadecounselling.com` for IMAP/SMTP); consider deleting `autodiscover` only if Workspace support isn't needed.
5. The Nuxt app must never send raw SMTP from its own server IP — use Google Workspace SMTP (`smtp.gmail.com`) or a transactional service (Postmark/SES/Resend) so SPF stays valid.
6. Optional later: review DMARC policy (`p=quarantine` → eventually `p=reject` once reports confirm no legitimate unauthenticated senders).

## 7. Lesson / post-mortem

The domain's registrar and its DNS provider were separated, and the DNS provider account had been lost — a single point of failure for the entire domain. Best practice going forward: keep registration + DNS in accounts the client owns, enable two-factor access, and keep a periodic export of the zone (GoDaddy DNS → Actions → Export zone file works now that the zone is at GoDaddy).

---

*Zone snapshot source: live `dig` queries of the Cloudflare zone on Nov 14, 2026, before the nameserver switch. All post-change verification done against `ns29/ns30.domaincontrol.com`, `8.8.8.8`, and `1.1.1.1`.*
