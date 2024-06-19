import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import * as XLSX from 'xlsx';

const ListProduct = () => {
    const [allproducts, setAllProduct] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingField, setEditingField] = useState('');

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => {
                setAllProduct(data);
            });
    };

    const remove_product = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });
        await fetchInfo();
    };

    const updateProduct = async (product) => {
        await fetch('http://localhost:4000/updateproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        await fetchInfo();
        setEditingProduct(null);
        setEditingField('');
    };

    const handleEdit = (product, field) => {
        setEditingProduct(product);
        setEditingField(field);
    };

    const handleChange = (e) => {
        setEditingProduct({ ...editingProduct, [editingField]: e.target.value });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            updateProduct(editingProduct);
        }
    };

    const handleExport = () => {
        const dataToExport = allproducts.map((product) => ({
            'Tên sản phẩm': product.name,
            'Giá cũ': product.old_price,
            'Giá mới': product.new_price,
            'Danh mục': product.category,
        }));
    
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        XLSX.writeFile(wb, 'bao-gia-san-pham.xlsx');
    };
    

    return (
        <div className='list-product'>
            <h1>DANH SÁCH SẢN PHẨM</h1>
            <div className='export-button'>
                <button className='export-btn' onClick={handleExport}>Export</button>
            </div>
            <div className='listproduct-format-main'>
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className='listproduct-allproducts'>
                <hr />
                {allproducts.map((product, index) => (
                    <div key={index} className='listproduct-format-main listproduct-format'>
                        <img src={product.image} alt='' className='listproduct-product-icon' />
                        {editingProduct && editingProduct.id === product.id && editingField === 'name' ? (
                            <input
                                type='text'
                                value={editingProduct.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onBlur={() => updateProduct(editingProduct)}
                            />
                        ) : (
                            <p onClick={() => handleEdit(product, 'name')}>{product.name}</p>
                        )}
                        {editingProduct && editingProduct.id === product.id && editingField === 'old_price' ? (
                            <input
                                type='number'
                                value={editingProduct.old_price}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onBlur={() => updateProduct(editingProduct)}
                            />
                        ) : (
                            <p onClick={() => handleEdit(product, 'old_price')}>{product.old_price} VND</p>
                        )}
                        {editingProduct && editingProduct.id === product.id && editingField === 'new_price' ? (
                            <input
                                type='number'
                                value={editingProduct.new_price}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onBlur={() => updateProduct(editingProduct)}
                            />
                        ) : (
                            <p onClick={() => handleEdit(product, 'new_price')}>{product.new_price} VND</p>
                        )}
                        {editingProduct && editingProduct.id === product.id && editingField === 'category' ? (
                            <input
                                type='text'
                                value={editingProduct.category}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onBlur={() => updateProduct(editingProduct)}
                            />
                        ) : (
                            <p onClick={() => handleEdit(product, 'category')}>{product.category}</p>
                        )}
                        <img
                            onClick={() => remove_product(product.id)}
                            src={cross_icon}
                            alt=''
                            className='listproduct-remove-icon'
                        />
                    </div>
                ))}
                <hr />
            </div>
        </div>
    );
};

export default ListProduct;
