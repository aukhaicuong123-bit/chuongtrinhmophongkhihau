# Climate Mission

Nền tảng học tập CK + PK + TK bằng tiếng Việt: khám phá biến đổi khí hậu, dự đoán và mô phỏng kết quả, chọn một vấn đề cộng đồng, xây dựng hành động và phản tư về tác động.

## Chạy dự án

```bash
npm install
npm run dev
npm run build
npm run preview
```

Đưa thư mục `dist/` lên Vercel, Netlify hoặc Cloudflare Pages. Không cần đăng nhập hay backend. Tiến độ được lưu trong `localStorage`; có thể chia sẻ bản demo bằng URL trình duyệt.

## Trình bày trong 5 phút

Mở ứng dụng → **Chế độ trình bày** → dùng nút Tiếp để đi qua Vấn đề, Khái niệm, Mô phỏng, Cộng đồng và Tác động. Hỏi người xem dự đoán trước khi chạy Phòng thí nghiệm, sau đó cho thấy một hành động trong khuôn viên trở thành tác động có thể đo lường.

## CK / PK / TK mapping

- **CK — Nội dung:** các khái niệm và tín hiệu của biến đổi khí hậu toàn cầu.
- **PK — Phương pháp:** học tập phục vụ cộng đồng thông qua nhiệm vụ địa phương và phản tư.
- **TK — Công nghệ:** mô hình hệ thống khí hậu tương tác cho giáo dục, có phản hồi trực quan.

## Notes

Mô phỏng được thiết kế như một mô hình giáo dục, không phải dự báo khoa học. Các giả định nằm rõ trong hàm `calculate()` của `src/App.tsx`: phát thải/hoạt động làm tăng mức ấm lên dự kiến, còn rừng/năng lượng tái tạo làm giảm mức này. Kết quả phục vụ việc dự đoán, so sánh và thảo luận.

## Dữ liệu hiện hành

Climate Lab tải dữ liệu khi mở màn hình và tự làm mới mỗi 15 phút:

- CO₂ khí quyển: NOAA Global Monitoring Laboratory, chuỗi Mauna Loa theo tháng.
- Nhiệt độ: NASA GISTEMP v4, cập nhật theo chu kỳ công bố của NASA.
- Độ che phủ rừng: FAO qua Our World in Data, dữ liệu năm mới nhất.
- Năng lượng tái tạo: Energy Institute / Our World in Data, dữ liệu năm mới nhất.
- Phát thải CO₂: Global Carbon Budget qua Our World in Data, dữ liệu năm mới nhất.

Các chỉ số toàn cầu không có cùng nhịp cập nhật: CO₂ có thể cập nhật theo tháng, còn rừng, phát thải và năng lượng thường là dữ liệu năm đã kiểm định. Khi nguồn không truy cập được, ứng dụng dùng giá trị dự phòng và hiển thị trạng thái nguồn trong code.
