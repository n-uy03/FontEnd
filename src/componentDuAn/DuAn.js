
import React from "react";
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import CreateDuAn from "./CreateDuAn";
import EditDuAn from "./EditDuAn";
import DetailDuAnToNhanVien from "../ComponentNhanVienDuAn/DetailDuAnTonhanVien";
import Iconmat from '../img/Iris-Scan-User--Streamline-Ultimate.png';
import Iconmat2 from '../img/Touch-Id-User--Streamline-Ultimate.png';
import xoa from '../img/Bin-2--Streamline-Ultimate.png';
import edit from '../img/Pencil-Write--Streamline-Ultimate.png';
const DuAn = () => {
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
    const [refresh, setRefresh] = useState(false);
    const [ShowCreateDuAn, setShowCreateDuAn] = useState(false);
    const [selectID, setSelectID] = useState(null);
    const [role, setRole] = useState(localStorage.getItem('role'));
    const handleCloseCreateDuAn = () => {
        setShowCreateDuAn(false)
        handleSearchDuAn()

    };
    const handleShowCreateDuAn = () => setShowCreateDuAn(true);

    const [ShowEditDuAn, setShowEditDuAn] = useState(false);
    const handleCloseEditDuAn = () => {
        setShowEditDuAn(false)
        handleSearchDuAn()

    };
    const handleShowEditDuAn = () => {
        setShowEditDuAn(true);

    }
    const EditDuan = (id) => {
        setSelectID(id);
        handleShowEditDuAn(id);
        handleShowEditDuAn();
    }

    const [showDetailDuanNhanVien, setShowDetailDuanNhanVien] = useState(false)
    const handleCloseDetailDuanNhanVien = () => {
        setShowDetailDuanNhanVien()
    }
    const handleShowDetailDuanNhanVien = (id) => {
        setSelectID(id);
        setShowDetailDuanNhanVien(true);
    }

    const handleSearchDuAn = (pageNumber) => {
        const token = localStorage.getItem('token');
        const requestdata = {
            tenduan: searchTerm,
            trangthai: trangthai !== '' ? parseInt(trangthai) : null,
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
                }
                return response.json();
            })
            .then((data) => {
                setDuAn(data);
                setTotalduan(data.totalElements);
                settotalPage(data.totalPages);
            })
            .catch(error => {
                console.error('lỗi:', error);
            });

    }
    useEffect(() => {
        handleSearchDuAn();
    }, [pageNumber, pageSize, searchTerm, startDate, endDate,trangthai]);
    
    const handlePageClick = (event) => {
        handleSearchDuAn(+event.selected)
    }
    const handleRefresh = () => {
        setSearchTerm('');
        setMaDuAn('');
        setTrangthai('')
        setPageNumber(1);
        setRefresh(true);
    };
    useEffect(() => {
        if (refresh) {
            toast.success('Làm mới thành công');
            setRefresh(false);
        }
    }, [refresh]);
    return (
        <div className='container'>
            <div className='header row' >
                <h1> Dự Án</h1>

                <div className="search-container col-6" >
                    <input
                        className="form-control"
                        placeholder="Tìm theo Tên dự án"
                        style={{ marginTop: "4px", marginLeft: "20px" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                    <button type="button" className="btn btn-light " style={{ border: "1px solid red" }} onClick={handleRefresh}>Reset</button>


                </div>

                <div className=" col-6">
                    <div className="trangthai">
                        <label>Trạng Thái:</label>
                        <select id="trangthai" name="trangthai"
                            style={{ border: "none" }}
                            value={trangthai}
                            onChange={(e) => {setTrangthai(e.target.value); setPageNumber(0)
                                console.log("trangthai:", e.target.value);
                                handleSearchDuAn()
                             }}>
                            <option value="">Tất cả</option>
                            <option value="0">Kết thúc</option>
                            <option value="1">Hoạt Động</option>
                                                     
                        </select>

                    </div>

                </div>

            </div>

            <Button variant="outline-success" onClick={handleShowCreateDuAn}>Add</Button>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Mã Dự án</th>
                        <th>Tên Dự án</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng Thái</th>
                      <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {duan.content && duan.content.map((item, index) => (
                        <tr key={index}>
                            <td>{item.maduan}</td>
                            <td>{item.tenduan}</td>
                            <td>{item.startDate}</td>
                            <td>{item.endDate}</td>
                            <td>{item.trangthai === 0 ? "Kết thúc" : "Hoạt Động"}</td>
                            <td>
                            {role === 'ROLE_ADMIN' &&(
                                <Button variant="outline-secondary" onClick={() => { EditDuan(item.id) }}><img src={edit} style={{ width: "24px", height: "24px" }} /></Button>
                            )}
                                    <Button variant="outline-info" onClick={() => handleShowDetailDuanNhanVien(item.id)}><img src={Iconmat} style={{ width: "24px", height: "24px" }} /></Button>
                               
                                
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

            {ShowCreateDuAn && <CreateDuAn show={ShowCreateDuAn} handleClose={handleCloseCreateDuAn} />}
            {ShowEditDuAn && <EditDuAn idda={selectID} show={ShowEditDuAn} handleClose={handleCloseEditDuAn} />}
            {showDetailDuanNhanVien && <DetailDuAnToNhanVien idduan={selectID} show={showDetailDuanNhanVien} handleClose={handleCloseDetailDuanNhanVien} />}
        </div>
    )
}
export default DuAn;