# GhiChepGiaoDich — Transaction Journal Web App

## Mục tiêu dự án

Ứng dụng web ghi chép giao dịch cá nhân (bet game / trading), có dashboard thống kê lợi nhuận theo ngày, tháng, năm.

## Tech stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State / data**: Zustand + localStorage (không cần backend, dữ liệu lưu trên máy client)
- **Charts**: Recharts
- **Form**: React Hook Form + Zod

## Cấu trúc thư mục

```
src/
  components/
    dashboard/       # Biểu đồ, thống kê tổng quan
    transaction/     # Form thêm/sửa, danh sách giao dịch
    layout/          # Header, Sidebar, Layout wrapper
    ui/              # shadcn/ui components
  hooks/             # Custom hooks (useTransactions, useStats, ...)
  store/             # Zustand stores
  types/             # TypeScript types/interfaces
  lib/               # Helpers, formatters, zod schemas
  pages/             # Dashboard, TransactionList, TransactionDetail
```

## Kiểu dữ liệu cốt lõi

```ts
type OrderType = 'bet_game' | 'trading'
type Result    = 'win' | 'lose' | 'draw'

interface Transaction {
  id:          string        // uuid
  entryTime:   string        // ISO datetime, giờ vào lệnh
  order:       string        // tên lệnh / ký hiệu
  orderType:   OrderType     // loại lệnh
  amount:      number        // tiền vào (VNĐ hoặc USD)
  rate?:       number        // tỉ lệ — chỉ khi orderType === 'bet_game'
  cutOrder?:   string        // lệnh cắt — chỉ khi orderType === 'bet_game'
  cutAmount?:  number        // tiền cắt — chỉ khi orderType === 'bet_game'
  profit:      number        // lợi nhuận (âm = lỗ)
  result:      Result        // tự động tính từ profit (>0 win, <0 lose, =0 draw)
  reason:      string        // lý do vào lệnh
  createdAt:   string        // ISO datetime, thời điểm tạo record
}
```

## Tính năng chính

### 1. Dashboard (`/`)
- Tổng lợi nhuận hôm nay / tháng này / năm nay
- Biểu đồ lợi nhuận theo ngày trong tháng (bar chart)
- Biểu đồ lợi nhuận theo tháng trong năm (line chart)
- Bộ lọc nhanh: Ngày / Tháng / Năm
- Thống kê: tổng giao dịch, số thắng, thua, hòa, win rate

### 2. Danh sách giao dịch (`/transactions`)
- Nhóm theo ngày (accordion/timeline)
- Lọc theo: tháng, năm, loại lệnh, kết quả
- Tìm kiếm theo tên lệnh, lý do
- Thêm / sửa / xóa giao dịch

### 3. Form giao dịch
- Trường bắt buộc: entryTime, order, orderType, amount, profit, reason
- Trường có điều kiện (chỉ hiện khi `orderType === 'bet_game'`): rate, cutOrder, cutAmount
- `result` tự động tính từ `profit`, không cho nhập tay
- Validate bằng Zod trước khi lưu

## Quy tắc tính toán

- `result = profit > 0 ? 'win' : profit < 0 ? 'lose' : 'draw'`
- Khi `orderType === 'trading'`: ẩn hoàn toàn các trường rate, cutOrder, cutAmount
- Lợi nhuận hiển thị: số dương màu xanh, số âm màu đỏ

## Lưu trữ dữ liệu

Dùng localStorage key `ghichep_transactions` (JSON array). Zustand persist middleware đồng bộ tự động. Không có backend, không cần đăng nhập.

## Quy ước code

- Mọi component dùng TypeScript strict, không dùng `any`
- Tên file component: PascalCase (`TransactionForm.tsx`)
- Tên file hook: camelCase bắt đầu bằng `use` (`useTransactions.ts`)
- Không viết comment giải thích WHAT, chỉ viết khi WHY không rõ từ code
- Không tạo abstraction sớm — chỉ tách component/hook khi logic dùng lại ≥ 2 lần
- Format tiền: `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- Format ngày: `date-fns` với locale `vi`

## Lệnh phát triển

```bash
npm install          # cài dependencies
npm run dev          # dev server tại localhost:5173
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Thứ tự implement

1. Scaffold Vite + React + TS + Tailwind + shadcn/ui
2. Định nghĩa types (`src/types/transaction.ts`)
3. Zustand store + localStorage persist (`src/store/transactionStore.ts`)
4. Form thêm giao dịch với conditional fields
5. Danh sách giao dịch nhóm theo ngày
6. Dashboard + biểu đồ Recharts
7. Lọc / tìm kiếm / sửa / xóa
