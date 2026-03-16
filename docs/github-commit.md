# GitHub Commit Log — Destinity vButler

> This file is updated every time changes are pushed to GitHub.
> Repository: https://github.com/AnuradhaKD/vButler

---

## 2026-03-17

| # | Short ID | Full Commit ID | Date & Time | Commit Message |
|---|----------|----------------|-------------|----------------|
| 1 | `74bb3d2` | `74bb3d24fc5bb102bfd3cb8c9ec2fba1325b3165` | 2026-03-17 00:14 +0530 | feat: add loyalty & rewards feature — loyalty card, tier benefits, redeem points, points history |
| 2 | `566692e` | `566692e2ef6594d0610dbcc02e826561e5245e1e` | 2026-03-16 23:51 +0530 | feat: document scanning with OCR for profile — passport, NIC, driving licence |
| 3 | `2e9afd6` | `2e9afd6f3eac15e1464cd9646f623672ccc03b64` | 2026-03-16 23:29 +0530 | fix: move hamburger out of dark brand block onto white header background |
| 4 | `48280d1` | `48280d1c69070342683246bb5d7d29445336fa08` | 2026-03-16 23:14 +0530 | feat: unified header brand bar with sidebar color and active page indicator |
| 5 | `f35d294` | `f35d294d32d29dabecb15c0644f79661810376bc` | 2026-03-16 23:01 +0530 | feat: sidebar dark brand color with active page indicator |
| 6 | `e9a5351` | `e9a5351b79344d52de8b8ad0ca8a2cc7830c3362` | 2026-03-16 22:58 +0530 | fix: move hamburger to right of logo/brand, add tooltip on desktop |
| 7 | `efb26b0` | `efb26b0b4e26e501c00f5774b262913713d4dadc` | 2026-03-16 22:55 +0530 | feat: collapsible desktop sidebar with hamburger toggle |
| 8 | `0539729` | `0539729069f71daa91f7ee6fa007574b4991f75d` | 2026-03-16 22:50 +0530 | feat: make 8 profile fields required with validation |
| 9 | `2b046dc` | `2b046dc5f5b47cfd02cffdf804161cf3bbb794d1` | 2026-03-16 22:46 +0530 | feat: restrict past reservation actions to Set Active, View Bill, Add Feedback |
| 10 | `dc42d52` | `dc42d52b8daabb951d15d580d5fa839b58e2f2f2` | 2026-03-16 22:40 +0530 | fix: move logo+brand back to header aligned with sidebar width |
| 11 | `653d177` | `653d177c706a5fc88e59bc0c8b7ded2d149c2a15` | 2026-03-16 22:29 +0530 | feat: add confirmation dialogs and fix validation across all request forms |
| 12 | `d7bd017` | `d7bd0172935790b5908c89a34e731b566968ac13` | 2026-03-16 22:17 +0530 | fix: render step indicator circles in pre-arrival page |
| 13 | `cddfb57` | `cddfb57594e9f7cbfb63e1887c3f539b77d9e3e8` | 2026-03-16 22:01 +0530 | feat: add carousel arrows to Exclusive Offers and align section padding |
| 14 | `8a0e9af` | `8a0e9af081d6309a3cc974ce0e81a4f7471f56ce` | 2026-03-16 21:57 +0530 | feat: remove max-width constraint on dashboard and reservations pages |
| 15 | `16f4452` | `16f44528c92dd68c9ec1f86b042fc10da41f4751` | 2026-03-16 21:53 +0530 | revert: restore hero banner to original style (rounded, padded, max-w) |
| 16 | `9605af3` | `9605af371bc1724c6c5dfeb16db8e1af8d6f49d3` | 2026-03-16 21:49 +0530 | feat: move logo to sidebar, full-width hero banner, center promotions |
| 17 | `becffd7` | `becffd70b19f2fbd859433bbb256ff9dda34b6a9` | 2026-03-16 17:54 +0530 | fix: lock header and sidebar in place — only main content scrolls |
| 18 | `5bd7800` | `5bd7800d9f5e2ac67305de1ad18c72d87d602e13` | 2026-03-16 17:35 +0530 | fix: remove duplicate logo block from desktop sidebar |
| 19 | `60ceea7` | `60ceea741552ee17a8358a6320d22eccc758b637` | 2026-03-16 17:26 +0530 | feat: center all page content on desktop with appropriate max-widths |
| 20 | `023735c` | `023735cf424efbd140a8734662c3707a2813c42d` | 2026-03-16 17:12 +0530 | fix: make desktop sidebar sticky below header while content scrolls |
| 21 | `d7c3c56` | `d7c3c56e...` | 2026-03-16 | feat: add hamburger menu with full slide-in drawer on mobile |

---

### Push #1 — 2026-03-17 00:14 +0530
**What was pushed:** Loyalty & Rewards feature (5 files changed, 420 insertions)

**Files changed:**
- `loyalty.html` *(new)* — Full rewards page with tier card, benefits, redeem options, points history
- `data/mock/points-history.json` *(new)* — Transaction history for demo guests (guest-001, guest-002)
- `profile.html` — Added compact loyalty card section between avatar and personal info
- `js/app.js` — Added "Rewards" nav item to sidebar; fixed sidebar render active page logic
- `data/chain.json` — Enabled `loyaltyPoints: true` feature flag
