import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
const CreateDuAn = ({show, handleClose}) => {

    const[maduan, setMaDuAn] =useState('');
    const[tenduan, setTenDuAn] = useState('');
    const[startDate, setStartDate] =useState ('');
    const[endDate, setEndDate]= useState('');
    const[trangthai, setTrangthai] = useState(1);
    const[error, setError] = useState({});

    const validate = () => {
        const errors = {};
      

        if (!maduan) {
            errors.maduan = 'Mã dự án không được để trống';
        }
        if (!tenduan) {
            errors.tenduan = 'Tên dự án không được để trống';
        }
        if (new Date(startDate) >= new Date(endDate)) {
            errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        }
        if (!startDate) {
            errors.tenduan = 'ngày bắt đầu không được để trống';
        }
       

        return errors;
    }

const handleAddduan=()=>{
    const token = localStorage.getItem('token');
    const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }
    const formdata ={ 
        maduan: maduan,
        tenduan: tenduan,
        startDate: startDate,
        endDate:endDate,
        trangthai: trangthai
    };
    console.log("Form Data gửi đi:", formdata);
    fetch("http://localhost:8080/api/duan/save-duan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formdata),
    })
    .then(response => {
        if (response.ok) {
            console.log("Thêm thành công");
            toast.success("Thêm mới thành công");
            handleClose();
        } else {         
            response.json().then(error => {
                console.error("Lỗi chi tiết:", error);
                toast.warning("Thêm thất bại: " + (error.message || "Lỗi không rõ"));
            });
        }
    })
    .catch(error => {
        console.error("Đã xảy ra lỗi khi thêm nhân viên:", error);
        ;
    });
}



    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Create Nhân Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form >
                    <div className="form-group">
                        <label className='form-lable'>Mã dự án: </label>
                        <input  type="text"  className="form-control"
                        value={maduan} onChange={(e) => {setMaDuAn(e.target.value)
                            setError(prev => ({
                                ...prev,
                                maduan: '',
                            }));
                        }} />   
                        {error.maduan && <span className="error" style={{color:'red'}}>{error.maduan}</span>}                        
                    </div>
                    <div className="form-group">
                        <label className='form-lable'>Tên dự án: </label>
                        <input  type="text"  className="form-control" 
                         value={tenduan} onChange={(e) => {setTenDuAn(e.target.value)
                            setError(prev => ({
                                ...prev,
                                tenduan: '',
                            }));
                         }}/>   
                           {error.tenduan && <span className="error" style={{color:'red'}}>{error.tenduan}</span>}                        
                    </div>
                    <div className="form-group">
                        <label className='form-lable'>Ngày bắt đầu: </label>
                        <input  type="date"  className="form-control" 
                         value={startDate} onChange={(e) => {setStartDate(e.target.value)
                            setError(prev => ({
                                ...prev,
                                startDate: '',
                            }));
                            {error.startDate && <span className="error" style={{color:'red'}}>{error.startDate}</span>}
                         }}/>                           
                    </div>
                    {/* <div className="form-group">
                        <label className='form-lable'>Ngày kết thúc: </label>
                        <input  type="date"  className="form-control" 
                        value={endDate} onChange={(e) => {setEndDate(e.target.value)
                            setError(prev => ({
                                ...prev,
                                endDate: '',
                            }));
                        }}/>       
                             {error.endDate && <span className="error" style={{color:'red'}}>{error.endDate}</span>}             
                    </div> */}
                    <div className="form-group">
                            <label className='form-lable'>Trạng Thái: </label>
                            <select className="form-select"
                             value={trangthai} onChange={(e) => {setTrangthai(e.target.value)
                                console.log("trangthai:", e.target.value);
                             }                               } >                                                              
                                <option value="1"> hoạt động</option>
                                <option value="0">kết thúc</option>                               
                            </select>
                        </div>


                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleAddduan} >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
    


}
export default CreateDuAn;