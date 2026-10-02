/** Sample address data for the checkout form; replace with a full administrative-unit API later. */
export const LOCATIONS: Record<string, Record<string, string[]>> = {
  'Đà Nẵng': {
    'Hải Châu': ['Hải Châu 1', 'Hải Châu 2', 'Thạch Thang', 'Thanh Bình', 'Phước Ninh'],
    'Thanh Khê': ['Tân Chính', 'Thạc Gián', 'Vĩnh Trung', 'Chính Gián', 'Xuân Hà'],
    'Sơn Trà': ['An Hải Bắc', 'An Hải Đông', 'Mân Thái', 'Phước Mỹ', 'Thọ Quang'],
    'Ngũ Hành Sơn': ['Mỹ An', 'Khuê Mỹ', 'Hòa Hải', 'Hòa Quý'],
    'Liên Chiểu': ['Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Minh', 'Hòa Hiệp Nam'],
    'Cẩm Lệ': ['Hòa Thọ Đông', 'Hòa Xuân', 'Khuê Trung', 'Hòa An'],
  },
  'Hà Nội': {
    'Ba Đình': ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị', 'Kim Mã'],
    'Hoàn Kiếm': ['Hàng Bạc', 'Hàng Bông', 'Hàng Trống', 'Tràng Tiền', 'Lý Thái Tổ'],
    'Cầu Giấy': ['Dịch Vọng', 'Mai Dịch', 'Nghĩa Đô', 'Quan Hoa', 'Yên Hòa'],
    'Đống Đa': ['Cát Linh', 'Hàng Bột', 'Láng Hạ', 'Ô Chợ Dừa', 'Văn Miếu'],
  },
  'TP. Hồ Chí Minh': {
    'Quận 1': ['Bến Nghé', 'Bến Thành', 'Đa Kao', 'Nguyễn Thái Bình', 'Tân Định'],
    'Quận 3': ['Võ Thị Sáu', 'Phường 4', 'Phường 5', 'Phường 9', 'Phường 14'],
    'Bình Thạnh': ['Phường 1', 'Phường 2', 'Phường 13', 'Phường 25', 'Phường 26'],
    'Thủ Đức': ['Hiệp Bình Chánh', 'Linh Trung', 'Thảo Điền', 'An Phú', 'Bình Thọ'],
  },
  'Thừa Thiên Huế': {
    'TP. Huế': ['Phú Hội', 'Vĩnh Ninh', 'Thuận Thành', 'Phú Nhuận', 'Xuân Phú'],
    'Hương Thủy': ['Phú Bài', 'Thủy Dương', 'Thủy Phương'],
  },
  'Quảng Nam': {
    'Hội An': ['Minh An', 'Sơn Phong', 'Cẩm Phô', 'Cẩm Châu', 'Cửa Đại'],
    'Tam Kỳ': ['An Mỹ', 'An Sơn', 'Hòa Hương', 'Tân Thạnh'],
  },
}

export const PROVINCES = Object.keys(LOCATIONS)
