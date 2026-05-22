# Hướng dẫn cài đặt và chạy

## Yêu cầu hệ thống

- **Node.js** >= 18 ([tải tại nodejs.org](https://nodejs.org))
- **npm** >= 9 (đi kèm với Node.js)

Kiểm tra phiên bản hiện tại:

```bash
node --version
npm --version
```

---

## Cài đặt

**1. Clone hoặc tải source code về máy:**

```bash
git clone <url-repo> GhiChepGiaoDich
cd GhiChepGiaoDich
```

Hoặc nếu đã có thư mục:

```bash
cd GhiChepGiaoDich
```

**2. Cài dependencies:**

```bash
npm install
```

---

## Chạy ứng dụng

### Dùng script (khuyến nghị)

Thư mục `scripts/` cung cấp 2 file tiện lợi để quản lý dev server mà không chiếm terminal.

**Khởi động:**

```bash
./scripts/start.sh
```

- Chạy dev server ngầm (background), không chiếm terminal.
- Nếu server đã chạy rồi, script báo ngay và thoát — không chạy thêm.
- Log được ghi ra `/tmp/ghichep-dev.log`.

**Dừng:**

```bash
./scripts/stop.sh
```

- Dừng process theo PID đã lưu, sau đó dọn sạch mọi process còn sót trên port 5173.

---

### Chạy trực tiếp trong terminal

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:5173**

Vite hỗ trợ Hot Module Replacement (HMR) — chỉnh sửa file sẽ tự cập nhật ngay trên trình duyệt mà không cần reload.

Dừng bằng **Ctrl + C** trong terminal đang chạy.

### Build production

```bash
npm run build
```

File output nằm trong thư mục `dist/`. Có thể deploy thư mục này lên bất kỳ static hosting nào (Nginx, Vercel, Netlify, GitHub Pages...).

### Xem trước bản build

```bash
npm run preview
```

Truy cập: **http://localhost:4173**

---

## Các lệnh hữu ích khác

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server tại localhost:5173 |
| `npm run build` | Build production ra thư mục `dist/` |
| `npm run preview` | Xem trước bản build production |
| `npm run type-check` | Kiểm tra lỗi TypeScript |
| `npm run lint` | Kiểm tra lỗi ESLint |

---

## Dữ liệu

Ứng dụng **không cần backend hay database**. Toàn bộ dữ liệu giao dịch được lưu trong **localStorage** của trình duyệt với key `ghichep_transactions`.

- Dữ liệu tồn tại giữa các lần mở trình duyệt.
- Xóa dữ liệu: mở DevTools (F12) → Console → chạy lệnh:

```js
localStorage.removeItem('ghichep_transactions')
```

Sau đó reload trang để ứng dụng load lại dữ liệu mẫu mặc định.

---

## Cấu trúc thư mục

```
GhiChepGiaoDich/
├── docs/                  # Tài liệu
├── scripts/
│   ├── start.sh           # Khởi động dev server ngầm
│   └── stop.sh            # Dừng dev server
├── src/
│   ├── components/
│   │   ├── dashboard/     # StatCard, ProfitChart
│   │   ├── layout/        # Header, Layout wrapper
│   │   └── transaction/   # TransactionForm, TransactionCard
│   ├── hooks/             # useTransactions, useStats, chart data hooks
│   ├── lib/               # utils, zod schemas, seed data
│   ├── pages/             # Dashboard, Transactions
│   ├── store/             # Zustand store (localStorage persist)
│   └── types/             # TypeScript types
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Tính năng

- **Dashboard**: thống kê lợi nhuận theo ngày / tháng / năm kèm biểu đồ
- **Danh sách giao dịch**: nhóm theo ngày, lọc theo tháng/năm/loại/kết quả, tìm kiếm
- **Thêm / sửa / xóa** giao dịch
- **Hai loại lệnh**:
  - *Trading*: nhập cơ bản (lệnh, tiền, lợi nhuận, lý do)
  - *Bet Game*: thêm các trường tỉ lệ, lệnh cắt, tiền cắt
- Kết quả (Thắng / Thua / Hòa) tự động tính từ lợi nhuận
