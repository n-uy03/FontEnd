
import React from 'react';

const ExportExcel=({nhanVienData})=>{
    const dowloadExcel = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/nhanvien/export-to-excel', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const blob = await response.blob();
            const linkurl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = linkurl;
            link.setAttribute('download', 'danh_sach_nhan_vien.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error);
        }
}
return (
   <a onClick={dowloadExcel}>
    ExportEx
   </a>
)
}
export default ExportExcel;