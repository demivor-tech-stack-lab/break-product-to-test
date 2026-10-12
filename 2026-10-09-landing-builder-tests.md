# Test Cases: Landing Builder Editor (Updated: 2026-10-09)

Tài liệu này chứa danh sách các trường hợp kiểm thử (Test Cases) tập trung vào logic và các lỗi tiềm ẩn (Edge Cases / Bug risks) trong trang Landing Page Builder. Các test case này được thiết kế để "phá" (break) tính năng xem nó có chịu đựng được không.

## 1. Chức năng Chọn & Điều hướng Block (Navigation & Selection)
**Logic:** Click vào màn Preview (giữa) thì Outline (trái) cuộn tới vị trí, Inspector (phải) hiển thị cấu hình.
* **TC 1.1:** Click vào một Button có chứa link (`<a>`) trong màn Preview. 
  * *Mong đợi:* Không bị chuyển trang (chuyển hướng URL), nhưng block vẫn phải được chọn (highlight) ở cột phải và cột trái.
* **TC 1.2:** Click vào nền trống của Canvas (không thuộc block nào).
  * *Mong đợi:* Bỏ chọn (Deselect) block hiện tại, cột phải quay về cài đặt Page Settings (hoặc báo không có block nào được chọn).
* **TC 1.3:** Khi có > 20 blocks, Outline bên trái xuất hiện thanh cuộn. Click vào block thứ 20 ở Preview.
  * *Mong đợi:* Cột Outline bên trái phải tự động cuộn xuống đúng mục thứ 20 và làm sáng (highlight).

## 2. Chức năng Inline Editing (Sửa text trực tiếp trên Canvas)
**Logic:** Các text hiển thị trên block đều là thẻ `contentEditable`.
* **TC 2.1 - Vượt quá số ký tự:** Copy một đoạn văn bản dài 2000 ký tự và Paste (Ctrl+V) vào một thẻ Tiêu đề (Heading - vốn có giới hạn ngắn).
  * *Mong đợi:* Component `Editable` phải tự động cắt bớt (truncate) độ dài phần thừa để không làm vỡ layout.
* **TC 2.2 - HTML Injection rác:** Copy một đoạn văn có chứa In đậm, In nghiêng, Bảng (Table), Ảnh từ Microsoft Word và Paste vào Tiêu đề.
  * *Mong đợi:* Chỉ nhận `plaintext`, tự động lọc bỏ (strip) tất cả các thẻ HTML, giữ nguyên định dạng của Landing Page.
* **TC 2.3 - Xuống dòng trái phép:** Chọn một nút bấm (Button) hoặc Tiêu đề nhỏ không cho phép `multiline`, và nhấn phím `Enter`.
  * *Mong đợi:* Không bị rớt dòng chữ trong nút. Phím `Enter` phải bị chặn và thoát focus (blur).
* **TC 2.4 - Undo trong lúc đang gõ:** Đang gõ chữ dở dang (chưa blur chuột ra ngoài) và nhấn `Ctrl + Z`.
  * *Mong đợi:* Chữ đang gõ không bị mất hết một cách vô lý, lịch sử undo phải hoạt động bình thường.

## 3. Chức năng Cột phải (Inspector) - Thêm sửa Items / Layout
**Logic:** Cấu hình Layout, Ảnh, và danh sách Item của block.
* **TC 3.1 - Thêm quá số lượng Item:** Bấm nút "+ Thêm 항목" (Add Item) liên tục cho đến khi đạt mức tối đa (`maxItems` của block đó).
  * *Mong đợi:* Nút thêm bị mờ đi (disabled) khi đạt giới hạn. Không cho phép vượt quá.
* **TC 3.2 - Xóa hết Item:** Bấm nút xóa (Thùng rác) từng item cho đến khi không còn item nào trong block.
  * *Mong đợi:* Giao diện Preview không bị crash (vỡ trắng màn hình), hiện layout rỗng hoặc tự báo lỗi bắt buộc có ít nhất 1 item.
* **TC 3.3 - Đổi Layout thiếu Item:** Block hiện tại đang có 1 item. Đổi Layout sang dạng "Hiển thị 4 cột / 4 items".
  * *Mong đợi:* Các chỗ trống của 3 items thiếu phải được tự động lấp đầy bằng item mẫu (dummy), hoặc không bị lỗi UI.
* **TC 3.4 - Upload File sai định dạng:** Mục tải ảnh lên (ImageField), chọn upload một file `.pdf` hoặc `.exe` hoặc file ảnh rất nặng (> 20MB).
  * *Mong đợi:* Có thông báo lỗi rõ ràng (Toast message: "Định dạng không hỗ trợ" / "File quá lớn").

## 4. Chức năng Cột trái (Outline) - Sắp xếp & Thao tác Block
**Logic:** Quản lý các block hiện có (Kéo thả, xóa, clone).
* **TC 4.1 - Xóa block cuối cùng:** Trang chỉ còn 1 block duy nhất, bấm nút Xóa.
  * *Mong đợi:* Vẫn xóa được, màn hình Preview báo "Trang chưa có nội dung, hãy thêm block mới", không được vỡ trắng trang.
* **TC 4.2 - Kéo thả (Drag & Drop) siêu tốc:** Dùng chuột kéo block số 1 xuống số 10 một cách liên tục và thả ra lúc đang cuộn.
  * *Mong đợi:* Thứ tự block trong `doc.blocks` phải cập nhật đúng với giao diện nhìn thấy.
* **TC 4.3 - Giới hạn 30 Blocks:** Thêm liên tục block cho đến khi đạt 30.
  * *Mong đợi:* Nút "+ 구역 추가" (Add zone) bên dưới Outline phải bị vô hiệu hóa (disabled).

## 5. Chức năng Lead Form (Form thu thập thông tin khách hàng)
**Logic:** Cho phép chỉnh sửa cấu trúc các câu hỏi form khảo sát.
* **TC 5.1 - Thay đổi Select Options:** Trong câu hỏi dạng Dropdown (Select), xóa hết các lựa chọn (options).
  * *Mong đợi:* Cảnh báo lỗi hoặc tự động thêm option mặc định, người xem bên ngoài (Publish) không bị crash khi sổ dropdown xuống.
* **TC 5.2 - Đổi loại câu hỏi (Type):** Đang là câu hỏi Email, đổi sang câu hỏi dạng Số (Number).
  * *Mong đợi:* Placeholder và validate của Preview Form lập tức cập nhật tương ứng.

## 6. Lịch sử (Undo/Redo - Ctrl+Z / Ctrl+Y)
* **TC 6.1 - History Stack:** Thêm 1 block -> Xóa block đó -> Sửa màu nền trang. Nhấn Ctrl+Z 3 lần.
  * *Mong đợi:* Màu nền trả về cũ -> Block hiện lại -> Block biến mất (Quay về đúng điểm bắt đầu).
* **TC 6.2 - Spam Click Undo:** Giữ lỳ phím Ctrl+Z.
  * *Mong đợi:* Editor không bị crash do state cập nhật quá nhanh.

---
*(Ghi chú: File test này chỉ chứa các hạng mục liên quan đến ngày làm việc hôm nay: Landing Builder, Inline Editable, Outline và Inspector. Các phần test cũ không hiển thị ở đây theo yêu cầu).*
