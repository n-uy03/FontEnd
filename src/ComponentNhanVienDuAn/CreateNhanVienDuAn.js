import { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import ReactPaginate from 'react-paginate';
const CreateNhanVienDuAn = ({ show, handleClose, idnv }) => {

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPage, settotalPage] = useState(0);
    const [maduan, setMaDuAn] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [trangthai, setTrangthai] = useState('');
    const [duan, setDuAn] = useState([]);
    const [totalduan, setTotalduan] = useState(0);
    const [selectedDuan, setSelectedDuan] = useState(null); // Dự án được chọn
    const [role, setRole] = useState('');
    const handleRoleChange = (event) => {
        setRole(event.target.value); // Cập nhật vai trò khi người dùng nhập
    };

    const handleShowRoleModal = (duanId) => {
        setSelectedDuan(duanId); // Lưu ID dự án được chọn
    };
    const handleSearchDuAn = (pageNumber) => {
        const token = localStorage.getItem('token');
        const requestdata = {
            tenduan: searchTerm,
            maduan: maduan,
            page: pageNumber,
            size: pageSize,
        };
        fetch('http://localhost:8080/api/duan/searchDuan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestdata)
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);

                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setDuAn(data);
                setTotalduan(data.totalElements);
                settotalPage(data.totalPages);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    }
    useEffect(() => {
        handleSearchDuAn();
    }, [searchTerm, startDate, endDate, pageNumber, pageSize]);
    const handlePageClick = (event) => {
        handleSearchDuAn(+event.selected)
    }

    const handleJoin = () => {
        const token = localStorage.getItem('token');
        if (!role.trim()) { // Kiểm tra nếu vai trò trống
            toast.error('Vui lòng nhập vai trò.');
            return;
        }

        fetch(`http://localhost:8080/api/nhanvien/${idnv}/duan/${selectedDuan}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                role,
                ngaythamgia: new Date().toISOString().split('T')[0], // Ngày hiện tại
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add NhanVien to DuAn');
                }
                return response.json();
            })
            .then(() => {
                toast.success('Nhân viên đã tham gia dự án thành công!');
                setSelectedDuan(null); // Đóng modal sau khi tham gia
                setRole(''); // Đặt lại vai trò
                handleClose(); // Đóng modal chính
            })
            .catch((error) => {
                toast.error('Dự án đã kết thúc vui lòng chọn dự án khác');
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Nhân Viên Vào Dự Án</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Mã Dự Án</th>
                                <th>Tên Dự Án</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {duan.content && duan.content.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.maduan}</td>
                                    <td>{item.tenduan}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                    <td>{item.trangthai === 1 ? 'Đang Hoạt Động' : 'Kết Thúc'}</td>
                                    <td>
                                        {/* Gọi handleShowRoleModal khi nhấn "Join" */}
                                        <Button variant="outline-info" onClick={() => handleShowRoleModal(item.id)}>Join</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        forcePage={pageNumber}
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={Math.max(totalPage, 1)} // Đảm bảo totalPage ít nhất là 1
                        previousLabel="<"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"

                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal nhập vai trò */}
            {selectedDuan !== null && (
                <Modal show={selectedDuan !== null} onHide={() => setSelectedDuan(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Nhập Vai Trò</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Vai Trò</label>
                        <input
                            type='text'
                            value={role}
                            onChange={handleRoleChange}
                            placeholder='Nhập vai trò'
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setSelectedDuan(null)}>
                            Đóng
                        </Button>
                        <Button variant='primary' onClick={handleJoin}>
                            Tham Gia
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};
export default CreateNhanVienDuAn;