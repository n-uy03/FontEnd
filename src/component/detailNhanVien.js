import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
const DetailNhanVien = ({show, handleClose, idnv})=>{

    const [nhanVienDetail, setNhanVienDetail] = useState([]);

    
    useEffect(() => {

        const token = localStorage.getItem('token');

        // Tạo header cho yêu cầu
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
        };
        if (idnv && idnv.trim()) // kt rỗng
            fetch(`http://localhost:8080/api/nhanvien/detail-nv/${idnv}`,{
                method: 'GET',
                headers: headers // Sử dụng header chứa token
            })
                .then((res) => res.json())
                .then((data) => {
                    setNhanVienDetail(data);
                 
                })
                .catch((err) => {
                    console.log(err);
                })
    }, [])

    return (<Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Detail Nhân Viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="row detail-content">
              <div className="col-6">
                <p>Mã:{nhanVienDetail.ma || "Không có thông tin"}</p>
                <p>Tên: {nhanVienDetail.ten || "Không có thông tin"}</p>
                <p>Giới tính: {nhanVienDetail.gioitinh || "Không có thông tin"}</p>
                <p>Ngày sinh: {nhanVienDetail.ngaysinh || "Không có thông tin"}</p>
                <p>Số cccd: {nhanVienDetail.thongTinCaNhan ? nhanVienDetail.thongTinCaNhan.socmnd : "Không xác định"}</p>
                <p>Ngày cấp: {nhanVienDetail.thongTinCaNhan ? nhanVienDetail.thongTinCaNhan.ngaycapcmnd : "Không xác định"}</p>
                </div>
                <div className="col-6">
                <p>Ngày gia Nhập: {nhanVienDetail.ngaygianhap || "Không có thông tin"}</p>
                <p>Địa chỉ: {nhanVienDetail.diachi || "Không có thông tin"}</p>
                <p>Số điện thoại: {nhanVienDetail.sdt || "Không có thông tin"}</p>
                <p>Mật Khẩu: {nhanVienDetail.matkhau || "Không có thông tin"}</p>
                <p>Trạng thái: {nhanVienDetail.trangthai === 1 ? "Đang làm" : "Nghỉ làm"}</p>
                <p>Chức vụ: {nhanVienDetail.chucvu ? nhanVienDetail.chucvu.tencv : "Không xác định"}</p>
                </div>
            </div>
            
        </Modal.Body>
        <Modal.Footer>
     
            <Button variant="secondary" onClick={handleClose}>
                Đóng
            </Button>

        </Modal.Footer>
    </Modal>
    );
}
export default DetailNhanVien;


