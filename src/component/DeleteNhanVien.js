
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeleteNhanVien = ({ show, handleClose, handleDelete }) => {

    return (<Modal show={show} onHide={handleClose} className='ModalDelete'>
        <Modal.Header closeButton>
            <Modal.Title className='text-center'>Xóa Nhân Viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                Bạn có muốn xóa nhân viên này không?
            
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
                Xóa
            </Button>
            <Button variant="success" onClick={handleClose}>
                No
            </Button>

        </Modal.Footer>
    </Modal>
    );



}
export default DeleteNhanVien;