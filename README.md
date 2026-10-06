# break-product-to-test

Checklist test hằng ngày để tự "phá" những gì mình vừa làm.

## Dùng

1. Mở `index.html` bằng Chrome/Edge (double-click, không cần server).
2. Chọn ngày test, đánh dấu từng case **✓ Đạt / ✗ Lỗi / – Bỏ qua**, ghi chú cách tái hiện lỗi.
3. Cuối ngày bấm **Lưu kết quả vào thư mục** → lưu đè `results.json` trong thư mục này.
4. Tác vụ `sync.cmd` chạy mỗi tối 22:00 sẽ commit + push nếu có thay đổi.

Kết quả lưu trong trình duyệt (localStorage) — `results.json` là bản sao lưu; đổi máy thì dùng **Khôi phục JSON**.

## Thêm test case

- Nhanh: nút **+ Thêm test case** trên trang (lưu trong trình duyệt, nằm trong `results.json`).
- Cố định: sửa mảng `GROUPS` trong `<script>` của `index.html`. Không đổi `id` của case cũ.

> Repo public: đừng ghi token, mật khẩu, dữ liệu người dùng hay thông tin nội bộ vào ghi chú.
