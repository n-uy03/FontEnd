import { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ImportExcel = ({ show, handleClose }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('')

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const token = localStorage.getItem('token');
        if (!selectedFile) {
            setUploadMessage('Please select a file!');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        try {
            const response = await fetch('http://localhost:8080/api/nhanvien/excel/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(' không  upload được  file.');
                toast.warning('upload dữ liệu không thành công');
            }
    
            // Kiểm tra nếu dữ liệu không phải là JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Nếu không phải JSON, đọc dữ liệu dưới dạng văn bản
                const responseData = await response.text();
                console.log(responseData); 
                setUploadMessage('Uploaded Dữ liệu Thành công');
                toast.success('upload dữ liệu thành công');
                handleClose();
                return;
            }
    
            const data = await response.json();
            setUploadMessage(`Uploaded dữ liệu thành công ${data} records.`);
            toast.success('upload dữ liệu thành công');
        } catch (error) {
            console.error(error);
            setUploadMessage(`không upload được file: ${error.message}`);
            toast.warning('upload dữ liệu không thành công');
        }
    };



    return (

        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Import Excel Nhân Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange}/>
                </Form.Group>
                <p>{uploadMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleUpload}>
                    UpLoad
                </Button>
            </Modal.Footer>
        </Modal>


    )
}
export default ImportExcel;