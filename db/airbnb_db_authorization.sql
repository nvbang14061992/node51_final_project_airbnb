-- Chạy trước để kiểm tra version
SELECT VERSION();

-- Tạo database
CREATE DATABASE IF NOT EXISTS db_airbnb;
USE db_airbnb;

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


-- Bảng Users
CREATE TABLE `Users` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`ten` VARCHAR(255),
	`password` VARCHAR(255),
    `so_dien_thoai`  VARCHAR(255),
    `ngay_sinh`  VARCHAR(255),
    `gioi_tinh`  BOOLEAN,
	`avatar` VARCHAR(255) DEFAULT NULL,
	`roleId`  INT NOT NULL DEFAULT 2,

    FOREIGN KEY (`roleId`) REFERENCES `VaiTro` (`id`),

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
	FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri` (`id`),
    FOREIGN KEY (`chu_so_huu`) REFERENCES `Users`(`id`),
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE `HinhAnh_Phong` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ma_phong` INT NOT NULL,
	`ma_nguoi_tao` INT NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`ma_nguoi_tao`) REFERENCES `Users`(`id`) ON DELETE CASCADE
);


-- Bảng DatPhong
CREATE TABLE `DatPhong` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	`ma_phong` INT NOT NULL,
	`ngay_den` TIMESTAMP NOT NULL,
	`ngay_di` TIMESTAMP NOT NULL,
    `so_luong_khach`  INT,
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


-- Du lieu mo phong
INSERT INTO VaiTro (id, vai_tro, mo_ta)
VALUES
(1, 'admin', 'Người quản trị hệ thống, có toàn quyền.'),
(2, 'user', 'Người dùng thường, đặt phòng và bình luận.'),
(3, 'host', 'Người cung cấp phòng và địa điểm.');

-- Du lieu mo phong
-- USERS (3 người dùng)
INSERT INTO Users (email, ten, password, so_dien_thoai, ngay_sinh, gioi_tinh, roleId)
VALUES
('user1@gmail.com', 'Nguyen Van A', 'pass123', '0909000001', '1990-01-01', 1, 1),
('user2@gmail.com', 'Tran Thi B', 'pass234', '0909000002', '1992-02-02', 0, 2),
('user3@gmail.com', 'Le Van C', 'pass345', '0909000003', '1988-03-03', 1, 3);

-- VITRI (3 vị trí)
INSERT INTO ViTri (ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
VALUES
('Hồ Chí Minh', 'TP.HCM', 'Việt Nam', 'https://img.com/hcm.jpg'),
('Đà Lạt', 'Lâm Đồng', 'Việt Nam', 'https://img.com/dalat.jpg'),
('Phú Quốc', 'Kiên Giang', 'Việt Nam', 'https://img.com/phuquoc.jpg');

-- PHONG (6 phòng, vị trí ID 1 có 2 phòng)
-- PHONG (6 phòng, vị trí ID 1 có 2 phòng)
INSERT INTO Phong (
    ten_phong, chu_so_huu, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien,
    may_giat, ban_ui, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi,
    ma_vi_tri
)
VALUES
-- Vị trí 1 (TP.HCM): 2 phòng
('Căn hộ HCM 1', 1, 2, 1, 1, 1, 'Căn hộ tiện nghi trung tâm HCM', 600000,
 1, 1, 1, 1, 1, 1, 0, 0, 1),

('Căn hộ HCM 2', 2, 4, 2, 2, 1, 'Căn hộ rộng rãi, gần chợ Bến Thành', 900000,
 1, 1, 1, 1, 1, 1, 1, 0, 1),

-- Vị trí 2 (Đà Lạt)
('Biệt thự Đà Lạt', 3, 6, 3, 3, 2, 'Biệt thự có vườn và view rừng thông', 1500000,
 1, 1, 1, 1, 1, 1, 1, 1, 2),

('Nhà gỗ Đà Lạt', 1, 2, 1, 1, 1, 'Nhà gỗ nhỏ xinh, không gian ấm cúng', 700000,
 1, 0, 1, 0, 1, 1, 0, 0, 2),

-- Vị trí 3 (Phú Quốc)
('Resort Phú Quốc', 2, 5, 2, 2, 2, 'Resort 5 sao sát biển', 2000000,
 1, 1, 1, 1, 1, 1, 1, 1, 3),

('Bungalow Phú Quốc', 3, 3, 1, 2, 1, 'Bungalow riêng tư trong resort', 1200000,
 0, 1, 1, 1, 1, 0, 1, 1, 3);


INSERT INTO `HinhAnh_Phong` (`ma_phong`, `ma_nguoi_tao`, `url`) VALUES
(1, 1, 'https://example.com/phong_1_image_1.jpg'),

(2, 2, 'https://example.com/phong_2_image_1.jpg'),

(3, 3, 'https://example.com/phong_3_image_1.jpg'),

(4, 1, 'https://example.com/phong_4_image_1.jpg'),

(5, 2, 'https://example.com/phong_5_image_1.jpg'),

(6, 3, 'https://example.com/phong_6_image_1.jpg');


-- DATPHONG (6 lượt, có 2 lượt cùng phòng ID 1, 2 lượt của user ID 1)
INSERT INTO DatPhong (ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat)
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

CREATE TABLE Quyen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    module VARCHAR(100) NOT NULL,
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



INSERT INTO Quyen (name, endpoint, method, module)
VALUES
('Đặt phòng', '/api/dat-phong', 'POST', 'booking'),
('Xem đặt phòng', '/api/dat-phong', 'GET', 'booking'),
('xem đặt phòng theo mã đặt phòng', '/api/dat-phong/:id', 'GET', 'booking'),
('xem đặt phòng theo mã người dùng', '/api/dat-phong/lay-theo-nguoi-dung/:MaNguoiDung', 'GET', 'booking'),
('Sửa đặt phòng', '/api/dat-phong/:id', 'PATCH', 'booking'),
('Xóa đặt phòng', '/api/dat-phong/:id', 'DELETE', 'booking'),

('Tạo bình luận', '/api/binh-luan', 'POST', 'comment'),
('Xem cả luận', '/api/binh-luan', 'GET', 'comment'),
('Sửa bình luận', '/api/binh-luan/:id', 'PATCH', 'comment'),
('Xoá bình luận', '/api/binh-luan/:id', 'DELETE', 'comment'),
('Xem bình luận theo phong', '/api/binh-luan/lay-binh-luan-theo-phong/:MaPhong', 'GET', 'comment'),

('Tạo phòng', '/api/phong-thue', 'POST', 'room'),
('Xem phòng', '/api/phong-thue', 'GET', 'room'),
('Xem phòng theo mã phòng', '/api/phong-thue/:id', 'GET', 'room'),
('Sửa thông tin phòng', '/api/phong-thue/:id', 'PATCH', 'room'),
('Xóa một phòng', '/api/phong-thue/:id', 'DELETE', 'room'),
('Xem phòng theo vị trí', '/api/phong-thue/lay-phong-theo-vi-tri', 'GET', 'room'),
('Xem phòng theo phân trang', '/api/phong-thue/phan-trang-tim-kiem', 'GET', 'room'),

('Tạo vị trí', '/api/vi-tri', 'POST', 'location'),
('Xem vị trí', '/api/vi-tri', 'GET', 'location'),
('Xem vị trí theo mã vị trí', '/api/vi-tri/:id', 'GET', 'location'),
('Sửa vị trí', '/api/vi-tri/:id', 'PATCH', 'location'),
('Xóa vị trí', '/api/vi-tri/:id', 'DELETE', 'location'),
('Xem vị trí theo phân trang', '/api/vi-tri/phan-trang-tim-kiem', 'GET', 'location'),
('upload hình vị trí', '/api/vi-tri/upload-hinh-vitri', 'POST', 'location'),

('Tạo người dùng', '/api/nguoi-dung/:id', 'POST', 'users'),
('Xem người dùng', '/api/nguoi-dung', 'GET', 'users'),
('Xem người dùng theo mã người dùng', '/api/nguoi-dung/:id', 'GET', 'users'),
('Sửa thông tin người dùng', '/api/nguoi-dung/:id', 'PATCH', 'users'),
('Sửa thông profile người dùng', '/api/nguoi-dung/update-profile', 'PATCH', 'users'),
('Xóa người dùng', '/api/nguoi-dung/:id', 'DELETE', 'users'),
('Xem người dùng theo phân trang', '/api/nguoi-dung/phan-trang-tim-kiem', 'GET', 'users'),
('Xem người dùng theo tên', '/api/nguoi-dung/search/{TenNguoiDung}', 'GET', 'users'),
('upload hình đại diện người dùng', '/api/nguoi-dung/upload-avatar', 'POST', 'users'),
('Đăng ký làm host', '/api/nguoi-dung/register-host', 'POST', 'users'),
('get profile info', '/api/nguoi-dung/get-info', 'GET', 'users'),

('upload hình phòng', '/api/hinh-anh-phong-thue/upload-room-image/:roomId', 'POST', 'room-image'),
('Xem hình phòng', '/api/hinh-anh-phong-thue/', 'GET', 'room-image'),
('Xem hình phòng theo mã hình ảnh phòng', '/api/hinh-anh-phong-thue/:id', 'GET', 'room-image'),
('Xem hình phòng theo ma phong', '/api/hinh-anh-phong-thue/:maPhong', 'GET', 'room-image'),
('Xóa hình ảnh phòng', '/api/hinh-anh-phong-thue/:id', 'DELETE', 'room-image');

-- User (vai trò 2)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
VALUES
(2, 1),  -- Đặt phòng
(2, 3),  -- xem đặt phòng theo mã đặt phòng
(2, 4),  -- xem đặt phòng theo mã người dùng
(2, 5),  -- Sửa đặt phòng
(2, 6),  -- Xóa đặt phòng

(2, 7),  -- Tạo bình luận
(2, 9),  -- Sửa bình luận
(2, 10),  -- Xoá bình luận
(2, 11),  -- Xem bình luận theo phòng


(2, 14),  -- Xem phòng theo mã phòng
(2, 17),  -- Xem phòng theo vị trí
(2, 18),  -- Xem phòng theo phân trang

(2, 21),  -- Xem vị trí theo mã vị trí
(2, 24),  -- Xem vị trí theo phân trang

(2, 28),  -- Xem người dùng theo mã người dùng
(2, 30),  -- Sửa thông profile người dùng
(2, 34),  -- upload hình đại diện người dùng
(2, 35),  -- upload hình đại diện người dùng
(2, 36),  -- upload hình đại diện người dùng

(2, 39),   -- Xem hình phòng theo mã hình ảnh phòng
(2, 40);   -- Xem hình phòng theo ma phong

-- Host (vai trò 3)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
VALUES
(3, 3),  -- xem đặt phòng theo mã đặt phòng
(3, 4),  -- xem đặt phòng theo mã người dùng

(3, 12),  -- Tạo phòng
(3, 14),  -- Xem một phòng
(3, 15),  -- Sửa thông tin phòng
(3, 15),  -- Xoá một phòng
(3, 17),  -- Xem phòng theo vị trí
(3, 18),  -- Xem phòng theo phân trang

(3, 19),  -- Tạo vị trí
(3, 21),  -- Xem vị trí theo mã vị trí
(3, 22),  -- Sửa vị trí
(3, 23),  -- Xóa vị trí
(3, 24),  -- Xem vị trí phân trang
(3, 25),  -- upload hình vị trí

(3, 28),  -- Xem người dùng theo mã người dùng
(3, 30),  -- Sửa thông profile người dùng
(3, 34),  -- upload hình đại diện người dùng
(3, 36),  -- upload hình đại diện người dùng

(3, 37),   -- upload hình phòng
(3, 39),   -- Xem hình phòng theo mã hình ảnh phòng
(3, 40),   -- Xem hình phòng theo ma phong
(3, 41);   -- Xóa hình ảnh phòng

-- Admin (vai trò 1)
INSERT INTO PhanQuyen (ma_vai_tro, ma_quyen)
SELECT 1, id FROM Quyen;


-- Notification service

CREATE TABLE `Notification` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `bookingId` INT NULL,                           -- Optional FK to DatPhong
  `receiverId` INT NOT NULL,                      -- Target host user
  `type` ENUM('booking', 'message', 'alert') NOT NULL DEFAULT 'booking',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NULL,
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`bookingId`) REFERENCES `DatPhong` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`receiverId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);