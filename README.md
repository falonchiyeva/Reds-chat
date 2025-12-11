# Reds-chat# Video Interview Platform — Minimal Working Version

Ushbu paket: **frontend (Vite + React)** va **server (Node.js + Socket.IO)** dan iborat minimal, lekin ishga tushadigan video-call (WebRTC) namunasi (P2P signaling bilan).
Loyiha ta'lim uchun moʻljallangan va haqiqiy ishlab chiqarish darajasidagi TURN/STUN, authentication yoki scaling yechimlarini oʻz ichiga olmaydi. Ammo mahalliy tarmoq yoki `localhost` ustida sinash uchun toʻliq ishlaydi.

## Tuzilishi
```
/frontend      # Vite + React app
/server        # Signaling server (Express + socket.io)
README.md
```

## Talablar
- Node.js v16+ va npm
- Brauzer (Chrome/Edge/Firefox)

## Mahalliy ishga tushirish (qadam-baqadam)
1. Reponi oching va papkaga kiring:
```bash
unzip project.zip
cd video_interview_project
```
2. Frontend va server papkalarida dependenciyalarni o'rnating:
```bash
cd frontend
npm install

# yangi terminalda:
cd ../server
npm install
```

3. Signaling server'ni ishga tushiring:
```bash
cd server
npm run start
# yoki development:
npm run dev
```

Signaling server standart bo'yicha `http://localhost:4000` da ishlaydi.

4. Frontend'ni ishga tushiring:
```bash
cd frontend
npm run dev
```
Frontend odatda `http://localhost:5173` da ochiladi (Vite).

5. Demo uchun bitta browser oynasida yoki ikki xil browserda quyidagi ishni bajaring:
- Bosh sahifada xonani nomini yozing (masalan `testroom`) va "Join Room" bosing.
- Ikkinchi oynada ham shu xonani nomi bilan qo'shiling.
- Video/ovoz almashininuvi boshlanishi kerak.

## Eslatma (muammolar va yechimlar)
- Agar media yo'q bo'lsa (kamera/mikrofon): brauzer ruxsatlarini tekshiring.
- Agar NAT/Firewall muammosi bo'lsa — o'rnatilgan STUN/TURN kerak bo'ladi. Bu loyiha faqat STUN server sifatida umumiy Google STUN-serverini ishlatadi.
- Agar peerlar ulanmasa, server loglarini tekshiring (`server` terminal).

## Fayllar haqida qisqacha:
- `server/index.js` — Socket.IO signaling server, offer/answer va ICE candidate almashinadi.
- `frontend/src/App.jsx` — oddiy UX: login xonasi va Room komponentiga o'tish.
- `frontend/src/components/Room.jsx` — getUserMedia, RTCPeerConnection yaratish, signaling orqali offer/answer.

---

Agar siz xohlasangiz, men bu reponi GitHub uchun tayyor branch shaklida to'liq `.gitignore`, `LICENSE` va GH Actions deploy fayllarini ham qo'shishim mumkin.
