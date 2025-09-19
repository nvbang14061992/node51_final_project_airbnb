-- Chạy trước để kiểm tra version
SELECT VERSION();

-- Tạo database
CREATE DATABASE IF NOT EXISTS db_airbnb;
USE db_airbnb;

-- Bảng Users
CREATE TABLE `Users` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`ten` VARCHAR(255),
	`mat_khau` VARCHAR(255),
    `so_dien_thoai`  VARCHAR(255),
    `ngay_sinh`  VARCHAR(255),
    `gioi_tinh`  BOOLEAN,
	`vai_tro`  VARCHAR(255),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng ViTri
CREATE TABLE `ViTri` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`ten_vi_tri` VARCHAR(255),
	`tinh_thanh` VARCHAR(255),
    `quoc_gia` VARCHAR(255),
    `hinh_anh`  VARCHAR(255),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Phong
CREATE TABLE `Phong` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`ten_phong` VARCHAR(255),
    `chu_so_huu` INT,
	`khach` INT,
	`phong_ngu` INT,
    `giuong`  INT,
    `phong_tam`  INT,
    `mo_ta` VARCHAR(255),
    `gia_tien`  INT,
    `may_giat`  BOOLEAN,
    `ban_ui`  BOOLEAN,
    `tivi`  BOOLEAN,
    `dieu_hoa`  BOOLEAN,
    `wifi`  BOOLEAN,
    `bep`  BOOLEAN,
    `do_xe`  BOOLEAN,
    `ho_boi`  BOOLEAN,
    `ma_vi_tri` INT,
    `hinh_anh`  VARCHAR(255),
	FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri` (`id`),
    FOREIGN KEY (`chu_so_huu`) REFERENCES `Users`(`id`),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng DatPhong
CREATE TABLE `DatPhong` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`ma_phong` INT NOT NULL,
	`ngay_den` TIMESTAMP NOT NULL,
	`ngay_di` TIMESTAMP NOT NULL,
    `so_luon_khach`  INT,
    `ma_nguoi_dat`  INT,
	FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `Users` (`id`),
    FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng BinhLuan
CREATE TABLE `BinhLuan` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`ma_phong` INT,
	`ma_nguoi_binh_luan` INT,
    `noi_dung` VARCHAR(255),
    `sao_binh_luan`  INT,
	FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `Users` (`id`),
	FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Bảng notification
CREATE TABLE `Notification` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `nguoi_nhan_id` INT NOT NULL, -- Chủ nhà
    `noi_dung` VARCHAR(500) NOT NULL,
    `ma_dat_phong` INT,
    `da_doc` TINYINT(1) NOT NULL DEFAULT 0, -- 0: chưa đọc, 1: đã đọc
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`nguoi_nhan_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`ma_dat_phong`) REFERENCES `DatPhong`(`id`)
);

-- Du lieu mo phong
-- USERS (3 người dùng)
INSERT INTO Users (email, ten, mat_khau, so_dien_thoai, ngay_sinh, gioi_tinh, vai_tro)
VALUES
('user1@gmail.com', 'Nguyen Van A', 'pass123', '0909000001', '1990-01-01', 1, 'user'),
('user2@gmail.com', 'Tran Thi B', 'pass234', '0909000002', '1992-02-02', 0, 'user'),
('user3@gmail.com', 'Le Van C', 'pass345', '0909000003', '1988-03-03', 1, 'user');

-- VITRI (3 vị trí)
INSERT INTO ViTri (ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
VALUES
('Hồ Chí Minh', 'TP.HCM', 'Việt Nam', 'https://img.com/hcm.jpg'),
('Đà Lạt', 'Lâm Đồng', 'Việt Nam', 'https://img.com/dalat.jpg'),
('Phú Quốc', 'Kiên Giang', 'Việt Nam', 'https://img.com/phuquoc.jpg');

-- PHONG (6 phòng, vị trí ID 1 có 2 phòng)
-- PHONG (6 phòng, vị trí ID 1 có 2 phòng)
INSERT INTO Phong (
    ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien,
    may_giat, ban_ui, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi,
    ma_vi_tri, hinh_anh
)
VALUES
-- Vị trí 1 (TP.HCM): 2 phòng
('Căn hộ HCM 1', 2, 1, 1, 1, 'Căn hộ tiện nghi trung tâm HCM', 600000,
 1, 1, 1, 1, 1, 1, 0, 0, 1, 'https://img.com/phong_hcm1.jpg'),

('Căn hộ HCM 2', 4, 2, 2, 1, 'Căn hộ rộng rãi, gần chợ Bến Thành', 900000,
 1, 1, 1, 1, 1, 1, 1, 0, 1, 'https://img.com/phong_hcm2.jpg'),

-- Vị trí 2 (Đà Lạt)
('Biệt thự Đà Lạt', 6, 3, 3, 2, 'Biệt thự có vườn và view rừng thông', 1500000,
 1, 1, 1, 1, 1, 1, 1, 1, 2, 'https://img.com/phong_dalat.jpg'),

('Nhà gỗ Đà Lạt', 2, 1, 1, 1, 'Nhà gỗ nhỏ xinh, không gian ấm cúng', 700000,
 1, 0, 1, 0, 1, 1, 0, 0, 2, 'https://img.com/phong_dalat2.jpg'),

-- Vị trí 3 (Phú Quốc)
('Resort Phú Quốc', 5, 2, 2, 2, 'Resort 5 sao sát biển', 2000000,
 1, 1, 1, 1, 1, 1, 1, 1, 3, 'https://img.com/phong_pq.jpg'),

('Bungalow Phú Quốc', 3, 1, 2, 1, 'Bungalow riêng tư trong resort', 1200000,
 0, 1, 1, 1, 1, 0, 1, 1, 3, 'https://img.com/phong_pq2.jpg');


-- DATPHONG (6 lượt, có 2 lượt cùng phòng ID 1, 2 lượt của user ID 1)
INSERT INTO DatPhong (ma_phong, ngay_den, ngay_di, so_luon_khach, ma_nguoi_dat)
VALUES
(1, '2025-10-01', '2025-10-03', 2, 1),  -- user 1
(1, '2025-10-05', '2025-10-07', 2, 2),  -- user 2 - cùng phòng
(2, '2025-11-01', '2025-11-04', 4, 1),  -- user 1 - đặt lần 2
(3, '2025-09-20', '2025-09-23', 5, 2),
(4, '2025-12-15', '2025-12-20', 2, 3),
(5, '2025-12-25', '2025-12-30', 5, 3);

-- BINHLUAN (3 bình luận)
INSERT INTO BinhLuan (ma_phong, ma_nguoi_binh_luan, noi_dung, sao_binh_luan)
VALUES
(1, 1, 'Phòng sạch sẽ, vị trí thuận tiện.', 5),
(3, 2, 'Không gian yên tĩnh, rất thích.', 4),
(5, 3, 'Resort tuyệt đẹp, nhân viên thân thiện.', 5);


-- Them chuc nang phan quyen

CREATE TABLE VaiTro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vai_tro VARCHAR(255) NOT NULL UNIQUE,
    mo_ta TEXT,
    isActive TINYINT(1) DEFAULT 1,
    deletedBy INT NOT NULL DEFAULT 0,
    isDeleted TINYINT(1) NOT NULL DEFAULT 0,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Quyen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mo_ta TEXT,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    module VARCHAR(255),
    deletedBy INT NOT NULL DEFAULT 0,
    isDeleted TINYINT(1) NOT NULL DEFAULT 0,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE PhanQuyen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_vai_tro INT,
    ma_quyen INT,
    isActive TINYINT(1) DEFAULT 1,
    deletedBy INT NOT NULL DEFAULT 0,
    isDeleted TINYINT(1) NOT NULL DEFAULT 0,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vai_tro) REFERENCES VaiTro(id),
    FOREIGN KEY (ma_quyen) REFERENCES Quyen(id)
);



-- Du lieu mo phong
INSERT INTO VaiTro (id, vai_tro, mo_ta)
VALUES
(1, 'admin', 'Người quản trị hệ thống, có toàn quyền.'),
(2, 'user', 'Người dùng thường, đặt phòng và bình luận.'),
(3, 'host', 'Người cung cấp phòng và địa điểm.');


INSERT INTO Quyen (mo_ta, endpoint, method, module)
VALUES
('Đặt phòng', '/dat-phong', 'POST', 'DatPhong'),
('Xem đặt phòng', '/dat-phong', 'GET', 'DatPhong'),
('xem đặt phòng theo mã đặt phòng', '/dat-phong/:id', 'GET', 'DatPhong'),
('Sửa đặt phòng', '/dat-phong/:id', 'PUT', 'DatPhong'),
('Xóa đặt phòng', '/dat-phong/:id', 'DELETE', 'DatPhong'),
('Tạo bình luận', '/binh-luan', 'POST', 'BinhLuan'),
('Xem bình luận', '/binh-luan', 'GET', 'BinhLuan'),
('Sửa bình luận', '/binh-luan/:id', 'PUT', 'BinhLuan'),
('Xoá bình luận', '/binh-luan/:id', 'DELETE', 'BinhLuan'),
('Xem bình luận theo phong', '/binh-luan/lay-binh-luan-theo-phong/:ma_phong', 'GET', 'BinhLuan'),
('Xem phòng', '/phong', 'GET', 'Phong'),
('Xem một phòng', '/phong/:id', 'GET', 'Phong'),
('Xem phòng theo vị trí', '/phong/lay-phong-theo-vi-tri', 'GET', 'Phong'),
('Xem phòng theo phân trang', '/phong/phan-trang-tim-kiem', 'GET', 'Phong'),
('upload hình phòng', '/phong/upload-hinh-phong', 'POST', 'Phong'),
('Tạo phòng', '/phong', 'POST', 'Phong'),
('Xem vị trí', '/vi-tri', 'GET', 'ViTri'),
('Xem vị trí theo mã vị trí', '/vi-tri/:id', 'GET', 'ViTri'),
('Tạo vị trí', '/vi-tri', 'POST', 'ViTri'),
('Sửa vị trí', '/vi-tri/:id', 'PUT', 'ViTri'),
('Xóa vị trí', '/vi-tri/:id', 'DELETE', 'ViTri'),
('Xem vị trí theo phân trang', '/vi-tri/phan-trang-tim-kiem', 'GET', 'ViTri'),
('upload hình vị trí', '/vi-tri/upload-hinh-phong', 'POST', 'ViTri'),
('Xem người dùng', '/users', 'GET', 'Users'),
('Xem người dùng theo mã người dùng', '/users/:id', 'GET', 'Users'),
('Tạo người dùng', '/users/:id', 'POST', 'Users'),
('Sửa người dùng', '/users/:id', 'PUT', 'Users'),
('Xóa người dùng', '/users/:id', 'DELETE', 'Users'),
('Xem người dùng theo phân trang', '/users/phan-trang-tim-kiem', 'GET', 'Users'),
('Xem người dùng theo mã tên', '/users/search/{TenNguoiDung}', 'GET', 'Users'),
('upload hình đại diện người dùng', '/users/upload-avatar', 'POST', 'Users'),


-- User (vai trò 2)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
VALUES
(2, 1),  -- Đặt phòng
(2, 2),  -- Xem đặt phòng
(2, 3),  -- xem đặt phòng theo mã đặt phòng
(2, 4),  -- Sửa đặt phòng
(2, 5),  -- Xóa đặt phòng
(2, 6),  -- Tạo bình luận
(2, 10),  -- Xem bình luận theo phòng
(2, 8),  -- Sửa bình luận
(2, 9),  -- Xoá bình luận
(2, 11),  -- Xem phòng
(2, 12),  -- Xem một phòng
(2, 13),  -- Xem phòng theo vị trí
(2, 14),  -- Xem phòng phan trang
(2, 17);  -- Xem vị trí
(2, 18);  -- Xem vị trí theo mã vị trí
(2, 22);  -- Xem vị trí phân trang
(2, 25);  -- Xem người dùng theo mã người dùng
(2, 27);  -- Sửa người dùngdùng
(2, 31);  -- upload hình đại diện người dùng

-- Host (vai trò 3)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
VALUES
(3, 2),  -- Xem đặt phòng
(3, 3),  -- xem đặt phòng theo mã đặt phòng
(3, 11),  -- Xem phòng
(3, 16),  -- Tạo phòng
(3, 15)   -- upload hình phòng
(3, 17);  -- Xem vị trí
(3, 18);  -- Xem vị trí theo mã vị trí
(3, 22);  -- Xem vị trí phân trang
(3, 25);  -- Xem người dùng theo mã người dùng
(3, 27);  -- Sửa người dùngdùng
(3, 31);  -- upload hình đại diện người dùng

-- Admin (vai trò 1)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
SELECT 1, id FROM Quyen;
