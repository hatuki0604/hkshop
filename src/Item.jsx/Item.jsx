import React from 'react';
import "./Item.css"
import { Link } from 'react-router-dom';

//Component Item dùng để hiển thị từng sản phẩm
const Item = (props) => {
    return ( 
        <div className='item'>
            <Link to={`/product/${props.id}`}><img src={props.image} alt="" /></Link>
            <p>{props.name}</p>
            <div className='item-prices'>
                <div className='item-price-new'>
                    {props.new_price} VND
                </div>

                <div className="item-price-old">
                    {props.old_price} VND

                </div>
            </div>
        </div>
    );
}

export default Item;

