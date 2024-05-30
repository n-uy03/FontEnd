import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";

const CreateNhanVien = ({ show, handleClose, handleSearch }) => {
    const [ma, setMa] = useState('');
    const [ten, setTen] = useState('');
    const [gioitinh, setGioitinh] = useState('Nam');
    const [ngaysinh, setNgaysinh] = useState('');
    const [ngaygianhap, setNgaygianhap] = useState('');
    const [diachi, setDiachi] = useState('');
    const [sdt, setSdt] = useState('');
    const [matkhau, setMatkhau] = useState('');
    const [trangthai, setTrangthai] = useState('');
    const [chucvu, setChucVu] = useState('');
    const [listchucvu, setListChucVu] = useState([]);
    const [thongTinCaNhan, setThongTinCaNhan] = useState('');
    const [error, setError] = useState({})
    const validate = () => {
        const errors = {};
        const today = new Date().toISOString().split("T")[0];
        const phoneRegex = /^(09|08|03)\d{8}$/;

        if (!ma) {
            errors.ma = 'Mã nhân viên không được để trống';
        }
        if (!ten) {
            errors.ten = 'Tên nhân viên không được để trống';
        }
        if (ngaysinh && ngaysinh > today) {
            errors.ngaysinh = 'Ngày sinh không được lớn hơn today';
        }

        if (ngaygianhap && ngaygianhap > today) {
            errors.ngaygianhap = 'Ngày gia nhập không được lớn hơn today';
        }

        // Kiểm tra nếu ngày sinh sau ngày gia nhập
        if (ngaysinh && ngaygianhap && ngaysinh > ngaygianhap) {
            errors.ngaygianhap = 'Ngày gia nhập không được trước ngày sinh';
        }

        if (!diachi) {
            errors.diachi = 'Địa chỉ không được để trống';
        }

        if (!phoneRegex.test(sdt)) {
            errors.sdt = 'Số điện thoại phải gồm 10 số và bắt đầu bằng 09, 08, hoặc 03';
        }
        if (!matkhau) {
            errors.matkhau = 'Mật khẩu không được để trống';
        }
        // Xác thực số CCCD (ví dụ, không để trống)
        if (!thongTinCaNhan.socmnd) {
            errors.socmnd = 'Số CCCD không được để trống';
        }

        // Xác thực ngày cấp CCCD (ví dụ, ngày phải hợp lệ)
        if (!thongTinCaNhan.ngaycapcmnd) {
            errors.ngaycapcmnd = 'Ngày cấp CCCD không được để trống';
        }


        return errors;
    }


    useEffect(() => {
        const token = localStorage.getItem('token');

        // Tạo header cho yêu cầu
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
        };
      
        fetch(' http://localhost:8080/api/nhanvien/getListcv', {
        method: 'GET',
        headers: headers // Sử dụng header chứa token
    })
    .then(res => res.json())
    .then(data => {
        setListChucVu(data); // Cập nhật state chứa danh sách chức vụ
    })
    .catch(error => {
        console.error("Đã xảy ra lỗi khi lấy danh sách chức vụ:", error);
    });

    }, [])
   

    const handleGenderChange = (event) => {
        setGioitinh(event.target.value);
    };

    const handleAdd = () => {

        const token = localStorage.getItem('token');
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }
        const formData = {
            ma: ma,
            ten: ten,
            gioitinh: gioitinh,
            ngaysinh: ngaysinh,
            ngaygianhap: ngaygianhap,
            diachi: diachi,
            sdt: sdt,
            matkhau: matkhau,
            trangthai: trangthai,
            chucvu: {
                idcv: chucvu, // ID của chức vụ
            },
            // Thêm thông tin cá nhân nếu cần
            thongTinCaNhan: {
                socmnd: thongTinCaNhan.socmnd, // Số CCCD
                ngaycapcmnd: thongTinCaNhan.ngaycapcmnd, // Ngày cấp CCCD
            },
        };
        console.log("Form Data gửi đi:", formData);


        fetch("http://localhost:8080/api/nhanvien/save-nv", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Thêm thành công");
                    toast.success("Thêm mới thành công");
                    handleClose();
                } else {
                    console.error("Thêm thất bại. Mã lỗi:", response.status);
                    response.json().then(error => {
                        console.error("Lỗi chi tiết:", error);
                        toast.warning("Thêm thất bại: " + (error.message || "Lỗi không rõ"));
                    });
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi thêm nhân viên:", error);
                toast.error("Đã xảy ra lỗi: " + (error.message || "Lỗi không rõ"));
            });
    };

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Create Nhân Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form className='row'>

                    <div className='col-6 custom-form-container'>
                        <div className="form-group">
                            <label className='form-lable'>Mã: </label>
                            <input
                                type="text"
                                className="form-control"
                                value={ma}
                                onChange={(event) => {
                                    setMa(event.target.value);
                                    setError(prev => ({
                                        ...prev,
                                        ma: '',
                                    }));
                                }}
                            />
                            {error.ma && <p className="error-text">{error.ma}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Tên: </label>
                            <input type="text" className="form-control" value={ten} onChange={(event) => {
                                setTen(event.target.value);
                                setError(prev => ({
                                    ...prev,
                                    ten: '',
                                }));
                            }} />
                            {error.ten && <p className="error-text">{error.ten}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Giới Tính:</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" name="gender" value="Nam"
                                        className="form-check-input"
                                        onChange={handleGenderChange}
                                        checked={gioitinh === 'Nam'} />
                                    <label className="form-check-lable">Nam</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" name="gender" id="famale" value="Nữ"
                                        className="form-check-input"
                                        onChange={handleGenderChange}
                                        checked={gioitinh === 'Nữ'} />
                                    <label className="form-check-lable">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Ngày Sinh: </label>
                            <input type="date" className="form-control" value={ngaysinh} onChange={(event) => {
                                setNgaysinh(event.target.value);
                                setError(prev => ({
                                    ...prev,
                                    ngaysinh: '',
                                }));
                            }} />
                            {error.ngaysinh && <p className="error-text">{error.ngaysinh}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Ngày gia nhập: </label>
                            <input type="date" className="form-control" value={ngaygianhap} onChange={(event) => {
                                setNgaygianhap(event.target.value);
                                setError(prev => ({
                                    ...prev,
                                    ngaygianhap: '',
                                }));
                            }} />
                            {error.ngaygianhap && <p className="error-text">{error.ngaygianhap}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Số điện Thoại: </label>
                            <input type="text" className="form-control" value={sdt} onChange={(event) => {
                                setSdt(event.target.value)
                                setError(prev => ({
                                    ...prev,
                                    sdt: '',
                                }));
                            }} />
                            {error.sdt && <p className="error-text">{error.sdt}</p>}
                        </div>


                    </div>
                    <div className='col-6 custom-form-container'>

                        
                        <div className="form-group">
                            <label className='form-lable' >Địa Chỉ: </label>
                            <input type="text" className="form-control" value={diachi} onChange={(event) => {
                                setDiachi(event.target.value);
                                setError(prev => ({
                                    ...prev,
                                    diachi: '',
                                }));
                            }} />
                            {error.diachi && <p className="error-text">{error.diachi}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Mật Khẩu: </label>
                            <input type="text" className="form-control" value={matkhau} onChange={(event) => {
                                setMatkhau(event.target.value);
                                setError(prev => ({
                                    ...prev,
                                    matkhau: '',
                                }));
                            }} />
                            {error.matkhau && <p className="error-text">{error.matkhau}</p>}
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Trạng Thái: </label>
                            <select
                                className="form-select"
                                value={trangthai}
                                onChange={(event) => {
                                    setTrangthai(event.target.value); // Cập nhật trạng thái dưới dạng chuỗi
                                    console.log("trangthai:", event.target.value);
                                }}>
                                <option value="0">Nghỉ làm</option>
                                <option value="1">Đang làm</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className='form-lable'>Chức Vụ: </label>
                            <select className="form-select" value={chucvu} onChange={(event) => {
                                const newChucVu = event.target.value; // Lấy giá trị được chọn
                                setChucVu(newChucVu); // Cập nhật state
                                console.log("Chức vụ được chọn:", newChucVu); // In ra console
                            }}>
                                <option value="">Chọn Chức Vụ</option>
                                {listchucvu.map((chucvu, index) => (
                                    <option key={index} value={chucvu.idcv}>{`${chucvu.tencv}`}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className='form-label'>Số CCCD:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={thongTinCaNhan.socmnd || ''}
                                onChange={(event) => {
                                    setThongTinCaNhan((prev) => ({ ...prev, socmnd: event.target.value }));
                                }}
                            />
                            {error.socmnd && <p className="error-text">{error.socmnd}</p>}
                        </div>

                        
                        <div className="form-group">
                            <label className='form-label'>Ngày cấp CCCD:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={thongTinCaNhan.ngaycapcmnd || ''}
                                onChange={(event) => {
                                    setThongTinCaNhan((prev) => ({ ...prev, ngaycapcmnd: event.target.value }));
                                }}
                            />
                            {error.ngaycapcmnd && <p className="error-text">{error.ngaycapcmnd}</p>}
                        </div>


                    </div>


                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={() => { handleAdd() }}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );

}
export default CreateNhanVien;