import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailNhanVien from './detailNhanVien';
import DeleteNhanVien from './DeleteNhanVien';
import CreateNhanVien from './CreateNhanVien';
import EditNhanVien from './EditNhanVien';
import DetailNhanVienToDuAn from './DetailNhanVienToDuAn';
import Iconmat from '../img/Iris-Scan-User--Streamline-Ultimate.png';
import Iconmat2 from '../img/Touch-Id-User--Streamline-Ultimate.png';
import xoa from '../img/Bin-2--Streamline-Ultimate.png';
import edit from '../img/Pencil-Write--Streamline-Ultimate.png';
import ExportExcel from './ExportExcel';
import ImportExcel from './ImportExcel';



const TableNhanVien = ({ dowloadExcel }) => {

    const [nhanvien, setNhanvien] = useState([]);

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateTo, setdateTo] = useState('');
    const [dateForm, setdateForm] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [totalnhanvien, setTotalnhanvien] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [selectID, setSelectID] = useState(null);
    const [role, setRole] = useState(localStorage.getItem('role'));

    const [ShowCreate, setShowCreate] = useState(false);
    const handleCloseCreate = () => {
        setShowCreate(false)
        handleSearch()
    };
    const handleShowCreate = () => setShowCreate(true);

    const [ShowImportEx, setShowImportEx] = useState(false);
    const handleCloseImportEx = () => {
        setShowImportEx(false)
        handleSearch()

    };
    const handleShowImportEx = () => setShowImportEx(true);


    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [showDetail, setShoeDetail] = useState(false);
    const handleCloseDetail = () => setShoeDetail(false);
    const handleShowDetail = () => setShoeDetail(true);

    const [showDetailNhanVienToDuAn, setShowDetailNhanVienToDuAn] = useState(false);
    const handleCloseDetailNhanVienToDuAn = () => setShowDetailNhanVienToDuAn(false);

    const handleShowDetailNhanVienToDuAn = (id) => {
        setSelectID(id);
        setShowDetailNhanVienToDuAn(true);
    };



    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => {
        setShowEdit(false);
        handleSearch()
    }
    const handleShowEdit = () => setShowEdit(true);


    const Detail = (id) => {
        setSelectID(id);
        handleShowDetail();
    };
    // const DetailNhanVienToDuAn = (id) => {
    //     setSelectID(id);
    //     handleShowDetailNhanVienToDuAn();
    // };
    const Delete = (id) => {
        setSelectID(id);
        handleShowDelete();
    };
    const Edit = (id) => {
        setSelectID(id);
        handleShowEdit(id);
        handleShowEdit();
    }

    const handleSearch = (pageNumber) => {
        const token = localStorage.getItem('token');
        const requestdata = {
            ten: searchTerm,
            sdt: phoneNumber,
            tencv: jobTitle,
            ngaybatdau: dateForm,
            ngayketthuc: dateTo,
            page: pageNumber,
            size: pageSize,
        };
        fetch('http://localhost:8080/api/nhanvien/search-nv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Gửi token trong header Authorization
            },
            body: JSON.stringify(requestdata),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setNhanvien(data);
                setTotalnhanvien(data.totalElements);
                settotalPage(data.totalPages);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:8080/api/nhanvien/delete/${selectID}`,{
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token trong header Authorization
            }
        })
            .then(() => {
                console.log('Data deleted successfully');
                toast.success('Xóa Thành Công');
                handleSearch()
                handleCloseDelete()

            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
    };
    const handleRefresh = () => {
        setSearchTerm('');
        setJobTitle('');
        setPhoneNumber('');
        setPageNumber(1);
        setdateForm('');
        setdateTo('');
        setRefresh(true);
    };

    const handlePageClick = (event) => {
        handleSearch(+event.selected)
    }
    useEffect(() => {
        handleSearch();
    }, [pageNumber, pageSize, searchTerm, phoneNumber, jobTitle, dateForm, dateTo]);

    useEffect(() => {
        if (refresh) {
            toast.success('Làm mới thành công');
            setRefresh(false);
        }
    }, [refresh]);



    return (
        <div className='container'>
            <div className='header row' >
                <h1> Nhân Viên</h1>

                <div className="search-container col-4" >
                    <input
                        className="form-control"
                        placeholder="Tìm theo Tên, SĐT"
                        style={{ marginTop: "4px", marginLeft: "20px" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                    <button type="button" className="btn btn-light " style={{ border: "1px solid red" }} onClick={handleRefresh}>Reset</button>


                </div>


                <div className=" col-4 khoangngay" >
                    <div className='ngaybatdau'>
                        <label >Ngày bắt đầu:</label>
                        <input type="date" id="start-date" name="start-date" value={dateForm} onChange={(e) => { setdateForm(e.target.value); setPageNumber(0) }} />
                    </div>
                    <div className='ngayketthuc'>
                        <label >Ngày kết thúc:</label>
                        <input type="date" id="end-date" name="end-date" value={dateTo} onChange={(e) => { setdateTo(e.target.value); setPageNumber(0) }} />
                    </div>
                </div>
                <div className=" col-2">
                    <div className="chucvu">
                        <label>Chức Vụ:</label>
                        <select id="chucvu" name="chucvu" style={{ border: "none" }} value={jobTitle}
                            onChange={(e) => { setJobTitle(e.target.value); setPageNumber(0) }}>
                            <option value="">Tất cả</option>
                            <option value="Quản Lí">Quản Lí</option>
                            <option value="NhânViên">Nhân Viên</option>
                            <option value="Dev">Dev</option>
                        </select>
                    </div>
                </div>
            </div>


            <div className='btndiv row'>
                <div className='col-6'>
                    <Button className="btn btn-success" onClick={handleShowCreate}>Add</Button>
                </div>
                <div className='btnexcel col-6'>
                    <Button ><ExportExcel /></Button>
                    <Button onClick={handleShowImportEx}>ImportEx</Button>
                </div>
            </div>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Giới Tính</th>
                        <th>Ngày Sinh</th>
                        <th>Ngày Gia Nhập</th>
                        <th>Địa Chỉ</th>
                        <th>Số Điện Thoại</th>
                        <th>Mật Khẩu</th>
                        <th>Trạng Thái</th>
                        <th>Chức Vụ</th>
                       <th>Hành động</th> {/* Hiển thị cột Hành động nếu là admin */}
                    </tr>
                </thead>
                <tbody>
                    {nhanvien.content && nhanvien.content.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ma}</td>
                            <td>{item.ten}</td>
                            <td>{item.gioitinh}</td>
                            <td>{item.ngaysinh}</td>
                            <td>{item.ngaygianhap}</td>
                            <td>{item.diachi}</td>
                            <td>{item.sdt}</td>
                            <td>{item.matkhau}</td>
                            <td>{item.trangthai === 1 ? "Đang làm" : "Nghỉ Làm"}</td>
                            <td>{item.chucvu ? item.chucvu.tencv:''}</td>
                            <td>
                                {role === 'ROLE_ADMIN' && (
                                    <td>
                                        <Button variant="outline-info" onClick={() => Edit(item.id)} >
                                            <img src={edit} alt="edit" style={{ width: "24px", height: "24px" }} />
                                        </Button>
                                        <Button variant="outline-info" onClick={() => Delete(item.id)}>
                                        <img src={xoa} alt="delete" style={{ width: "24px", height: "24px" }} /></Button>
                                        <Button variant="outline-info" onClick={() => handleShowDetailNhanVienToDuAn(item.id)}><img src={Iconmat2} style={{ width: "24px", height: "24px" }} /></Button>
                                </td>
                                )}
                                <Button variant="outline-warning" onClick={() => Detail(item.id)}><img src={Iconmat} style={{ width: "24px", height: "24px" }} /> </Button>
                               
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

            {ShowCreate && <CreateNhanVien show={ShowCreate} handleClose={handleCloseCreate} />}
            {ShowImportEx && <ImportExcel show={ShowImportEx} handleClose={handleCloseImportEx} />}
            {showDelete && <DeleteNhanVien show={showDelete} handleClose={handleCloseDelete} handleDelete={handleDelete} />}
            {showEdit && <EditNhanVien idnv={selectID} show={showEdit} handleClose={handleCloseEdit} />}
            {showDetail && <DetailNhanVien idnv={selectID} show={showDetail} handleClose={handleCloseDetail} />}
            {showDetailNhanVienToDuAn && <DetailNhanVienToDuAn idnhanvien={selectID} show={showDetailNhanVienToDuAn} handleClose={handleCloseDetailNhanVienToDuAn} />}
        </div>
    )
}

export default TableNhanVien; 