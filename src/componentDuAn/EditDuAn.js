
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
const EditDuAn =({show, handleClose, idda}) =>{
    const [maduan, setMaDuAn] = useState('');
    const [tenduan, setTenDuAn] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [trangthai, setTrangthai] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        if (idda && idda.trim()) {
            fetch(`http://localhost:8080/api/duan/detail-duan/${idda}`, {
                headers: headers
            })
                .then(response => response.json())
                .then((data) => {
                    setMaDuAn(data.maduan);
                    setTenDuAn(data.tenduan);
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                    setTrangthai(data.trangthai);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [idda]);

    const handleEditduan = () => {
        const token = localStorage.getItem('token');
        const formdata = {
            maduan: maduan,
            tenduan: tenduan,
            startDate: startDate,
            endDate: trangthai === "1" ? null : endDate,  // Đặt endDate về null nếu trạng thái là "hoạt động"
            trangthai: trangthai
        };

        console.log("Form Data gửi đi:", formdata);

        fetch(`http://localhost:8080/api/duan/update-duan/${idda}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formdata),
        })
        .then(response => {
            if (response.ok) {
                console.log("Cập nhật thành công");
                toast.success("Cập nhật thành công");
                handleClose();
            } else {
                response.json().then(error => {
                    console.error("Lỗi chi tiết:", error);
                    toast.warning("Cập nhật thất bại: " + (error.message || "Lỗi không rõ"));
                });
            }
        })
        .catch(error => {
            console.error("Đã xảy ra lỗi khi cập nhật dự án:", error);
        });
    }
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Dự Án</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form >
                <div className="form-group">
                        <label className='form-label'>Mã dự án:</label>
                        <input type="text" className="form-control"
                            value={maduan} onChange={(e) => setMaDuAn(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Tên dự án:</label>
                        <input type="text" className="form-control"
                            value={tenduan} onChange={(e) => setTenDuAn(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Ngày bắt đầu:</label>
                        <input type="date" className="form-control"
                            value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Ngày kết thúc:</label>
                        <input type="date" className="form-control"
                            value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={trangthai === "1"} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Trạng Thái:</label>
                        <select className="form-select"
                            value={trangthai} onChange={(e) => {
                                setTrangthai(e.target.value);
                                if (e.target.value === "1") {
                                    setEndDate('');
                                }
                                console.log("trangthai:", e.target.value);
                            }}>
                            <option value="0">Kết thúc</option>
                            <option value="1">Hoạt động</option>
                        </select>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleEditduan} >
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );



}
export default EditDuAn;