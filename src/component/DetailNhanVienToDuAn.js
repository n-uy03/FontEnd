

import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import CreateNhanVienDuAn from "../ComponentNhanVienDuAn/CreateNhanVienDuAn";
const DetailNhanVienToDuAn = ({ show, handleClose, idnhanvien }) => {

  const [duAnList, setDuAnList] = useState([]);
  const [selectID, setSelectID] = useState(null);
  const [ShowCreateNhanVienDuAn, setShowCreateNhanVienDuAn] = useState(false);
  const handleCloseCreateNhanVienDuAn = () => {
    setShowCreateNhanVienDuAn(false)
    handleShowDetailnvda()

  };
  const handleShowCreateNhanVienDuAn = (id) => {
    setSelectID(id);
    setShowCreateNhanVienDuAn(true);
  };

  const handleShowDetailnvda = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
  };
    if (show && idnhanvien) {
      fetch(`http://localhost:8080/api/nhanvien/${idnhanvien}/Duanidnhanvien`,{
        method: 'GET',
        headers: headers
      })
        .then((res) => res.json())
        .then((data) => {
          setDuAnList(data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }

  useEffect(() => {
    handleShowDetailnvda();
  }, [show, idnhanvien]);

  const endNhanVienDuAn = (duAnId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/nhanvienduan/end/${duAnId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
    })
      .then((res) => res.json())
      .then((data) => {
        handleShowDetailnvda();
      })
      .catch(err => {
        console.error("Error updating project:", err);
      });
  };
  const StartNhanVienDuAn = (duAnId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/nhanvienduan/start/${duAnId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
    })
      .then((res) => res.json())
      .then((data) => {
        handleShowDetailnvda();
      })
      .catch(err => {
        console.error("Error updating project:", err);
      });
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Danh sách dự án của nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="outline-info" onClick={handleShowCreateNhanVienDuAn}>Thêm</Button>
          {duAnList.length === 0 ? (
            <p>Không có dự án nào.</p> // Xử lý khi danh sách rỗng
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên Dự án</th>
                  <th>Ngày Tham gia</th>
                  <th>Ngày Kết thúc</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {duAnList.map((duAn) => (
                  <tr key={duAn.id}>
                    <td>{duAn.tenduan}</td>
                    <td>{duAn.ngaythamgia}</td>
                    <td>{duAn.ngayketthucduan}</td>
                    <td>{duAn.role}</td>
                    <td>{duAn.trangthaidv === 1 ? 'Hoạt động' : 'Kết thúc'}</td>
                    <td>
                      {duAn.trangthaidv === 1 && (
                        <Button variant="outline-info" onClick={() => endNhanVienDuAn(duAn.id)}>Kết thúc</Button>
                      )}
                       {duAn.trangthaidv === 0 && (
                        <Button variant="outline-info" onClick={() => StartNhanVienDuAn(duAn.id)}>Hoạt Động</Button>
                      )}
                    </td>
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
      {ShowCreateNhanVienDuAn && (
        <CreateNhanVienDuAn
          idnv={idnhanvien}
          show={ShowCreateNhanVienDuAn}
          handleClose={handleCloseCreateNhanVienDuAn}
        />
      )}
    </div>
  );


}
export default DetailNhanVienToDuAn;