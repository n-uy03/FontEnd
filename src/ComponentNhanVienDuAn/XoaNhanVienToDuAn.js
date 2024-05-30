
import { Button, Table, Modal } from "react-bootstrap";
const XoaNhanVienToDuAn=({ show, handleClose ,handleDeleteNhanVientoDuAn }) =>{
    return (<Modal show={show} onHide={handleClose} className='ModalDelete'>
    <Modal.Header closeButton>
        <Modal.Title className='text-center'>Xóa Nhân Viên Khỏi Dự án</Modal.Title>
    </Modal.Header>
    <Modal.Body>
            Bạn có muốn xóa nhân viên ra dự án này không?
        
    </Modal.Body>
    <Modal.Footer>
    <Button variant="danger" onClick={handleDeleteNhanVientoDuAn}>
            Xóa
        </Button>
        <Button variant="success" onClick={handleClose}>
            No
        </Button>

    </Modal.Footer>
</Modal>
);

}
export default XoaNhanVienToDuAn;