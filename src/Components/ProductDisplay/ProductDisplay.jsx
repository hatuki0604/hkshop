import React from 'react';
import './ProductDisplay.css'
import star_icon from "../Assets/star_icon.png"
import star_dull_icon from "../Assets/star_dull_icon.png"
const ProductDisplay = (props) => {
    const {product}=props;
    return ( 
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src="product.image" alt="" />
                    <img src="product.image" alt="" />
                    <img src="product.image" alt="" />
                    <img src="product.image" alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img"src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">{product.old_price} VND</div>
                    <div className="productdisplay-right-new-old">{product.new_price} VND</div>
                </div>
                <div className="productdisplay-right-description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Praesentium, accusamus libero repellat ratione dolore odio,
                    autem repellendus reprehenderit fuga minus maxime facilis unde 
                    ullam ducimus cumque. Quos unde suscipit consectetur.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                </div>
                <div className="productdisplay-right-size">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button>Add to cart</button>
            <p className='productdisplay-right-category'><span>Category :</span>Women , T-Shirt, Crop Top</p>
            <p className='productdisplay-right-category'><span>Tags :</span>Modern , Latest</p>
        </div>
    );
}
 
export default ProductDisplay;