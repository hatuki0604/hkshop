import React, { useEffect, useState } from 'react';
import './ListOrder.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';


const ListOrder = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:4000/order', {
                headers: {
                    'auth-token': localStorage.getItem('token') // Gửi token để xác thực
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders(); // Khi component được mount, fetch dữ liệu đơn hàng
    }, []);

    const handleExport = () => {
        const formattedOrders = orders.map(order => ({
            'Ngày đặt hàng': new Date(order.order_date).toLocaleDateString(),
            'Tên khách hàng': order.receiverInfo.name,
            'Số điện thoại': order.receiverInfo.phone,
            'Địa chỉ': order.receiverInfo.address,
            'Products': order.products.map(product => `${product.quantity} - ${product.product.name}`).join(', '), // Hiển thị quantity
            'Tổng thanh toán': order.total_cost
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedOrders);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'danh-sach-don-hang.xlsx');
    };

    const handleExportPDF = (order) => {
        const doc = new jsPDF();

        // Nhúng font Roboto
        //doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');

        // Mã đơn hàng
        const orderDate = new Date(order.order_date);
        const orderId = `${orderDate.getMonth() + 1}${orderDate.getDate()}${orderDate.getFullYear()}${orderDate.getHours()}${orderDate.getMinutes()}${orderDate.getSeconds()}${orderDate.toLocaleTimeString().slice(-2)}${order.receiverInfo.phone}`;

        // Nội dung PDF
        doc.text(`Mã đơn hàng: ${orderId}`, 10, 10);
        doc.text(`Địa chỉ nhận hàng`, 10, 20);
        doc.text(`Họ và tên: ${order.receiverInfo.name}`, 10, 30);
        doc.text(`Số điện thoại: ${order.receiverInfo.phone}`, 10, 40);
        doc.text(`Địa chỉ: ${order.receiverInfo.address}`, 10, 50);
        doc.text(`Sản phẩm:`, 10, 60);

        // Sản phẩm
        let yOffset = 70;
        order.products.forEach(product => {
            doc.text(`- ${product.quantity} - ${product.product.name}`, 20, yOffset); // Hiển thị quantity và tên sản phẩm
            yOffset += 10;
        });

        // Tổng thanh toán
        doc.text(`Total cost: ${order.total_cost}`, 10, yOffset + 10);

        // Lưu file PDF
        doc.save(`order-${orderId}.pdf`);
    };

    return (
        <div className='list-order'>
            <h1>DANH SÁCH ĐƠN HÀNG</h1>
            <div className='export-button'>
                <button className='export-btn' onClick={handleExport}>Export</button>
            </div>
            <hr />
            <div className='order-list'>
                {orders.map((order, index) => (
                    <div 
                        key={index} 
                        className='order-item' 
                        onClick={() => handleExportPDF(order)} // Thêm sự kiện onClick để xuất PDF
                    >
                        <p style={{ fontSize: '14px', textAlign: 'end', fontStyle: 'italic' }}>
                            Ngày đặt hàng: {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        <p><strong>Địa chỉ nhận hàng</strong></p>
                        <p>Họ và tên: {order.receiverInfo.name}</p>
                        <p>Số điện thoại: {order.receiverInfo.phone}</p>
                        <p>Địa chỉ: {order.receiverInfo.address}</p>
                        <p><strong>Sản phẩm:</strong></p>
                        <ul>
                            {order.products.map(product => (
                                <li key={product.product._id}>
                                    {product.quantity} - <i>{product.product.name}</i> {/* Hiển thị quantity trước tên sản phẩm */}
                                </li>
                            ))}
                        </ul>
                        <p><strong>Total cost:</strong> {order.total_cost}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListOrder;
