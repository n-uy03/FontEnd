
import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import XoaNhanVienToDuAn from './XoaNhanVienToDuAn';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Iconmat from '../img/Iris-Scan-User--Streamline-Ultimate.png';
import Iconmat2 from '../img/Touch-Id-User--Streamline-Ultimate.png';
import xoa from '../img/Bin-2--Streamline-Ultimate.png';
import edit from '../img/Pencil-Write--Streamline-Ultimate.png';

const DetailDuAnToNhanVien = ({ show, handleClose, idduan }) => {

  const [nhanvienlist, setNhanVienList] = useState([]);

  const [selectID, setSelectID] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role'));

  const [showDeleteNhanVientoduan, setShowDeleteNhanVientoduan] = useState(false);
  const handleCloseDeleteNhanVientoduan = () => setShowDeleteNhanVientoduan(false);
  const handleShowDeleteNhanVientoduan = () => setShowDeleteNhanVientoduan(true);

  const DeleteNhanVientoduan = (id) => {
    setSelectID(id);
    handleShowDeleteNhanVientoduan();
  };

  const handleDeleteNhanVientoDuAn = async () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/nhanvienduan/deletenhanvientoduan/${selectID}`, {
      method: 'DELETE', // Phương thức HTTP DELETE
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Tiêu đề HTTP
      },
    })
      .then(response => {
        if (response.ok) { // Kiểm tra nếu yêu cầu thành công
          toast.success('Xóa Thành Công'); // Thông báo thành công
          handleDetailDuAn(); // Cập nhật lại danh sách nhân viên dự án
          handleCloseDeleteNhanVientoduan(); // Đóng Modal
        } else {
          toast.error('Xóa không thành công'); // Thông báo lỗi nếu phản hồi không thành công
          console.error('Error deleting data:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting data:', error); // Xử lý lỗi nếu có vấn đề
      });
  };

  const handleDetailDuAn = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
  };
    if (show && idduan) {
      fetch(`http://localhost:8080/api/duan/${idduan}/nhanvien`,{
        headers: headers
      })
        .then((res) => res.json())
        .then((data) => {
          setNhanVienList(data);

        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }

  useEffect(() => {
    handleDetailDuAn()
  }, [show, idduan]);



  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Danh sách  nhân viên tham gia dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nhanvienlist.length === 0 ? (
            <p>Không có Nhân Viên nào</p>
          ) : (
            <Table striped bordered hover>

              <thead>
                <tr>
                  <th>Tên Nhân Viên</th>
                  <th>Ngày Sinh</th>
                  <th>Số điện thoại</th>
                  <th>Ngày Tham gia</th>
                  <th>Ngày Kết thúc</th>
                  <th>Vai trò</th>
                  <th>Trạng Thái</th>
                  {role === 'ROLE_ADMIN' && <th>Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {nhanvienlist.map((nhanvien) => (
                  <tr key={nhanvien.id}>
                    <td>{nhanvien.ten}</td>
                    <td>{nhanvien.ngaysinh}</td>
                    <td>{nhanvien.sdt}</td>
                    <td>{nhanvien.ngaythamgia}</td>
                    <td>{nhanvien.ngayketthucduan}</td>
                    <td>{nhanvien.role}</td>
                    <td>{nhanvien.trangthaidv === 1 ? "Hoạt Động" : "Kết thúc"}</td>
                  
                    {role === 'ROLE_ADMIN' &&(
                        <td>
                      <Button variant="outline-danger" onClick={() => DeleteNhanVientoduan(nhanvien.id)} ><img src={xoa} style={{ width: "24px", height: "24px" }} /></Button>
                      </td>
                    )}
                     
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {showDeleteNhanVientoduan && <XoaNhanVienToDuAn show={showDeleteNhanVientoduan} handleClose={handleCloseDeleteNhanVientoduan} handleDeleteNhanVientoDuAn={handleDeleteNhanVientoDuAn} />}
    </div>
  );
}
export default DetailDuAnToNhanVien;