const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://trungkienplus:kien06042003@cluster0.6uzndu2.mongodb.net/hkshops")

//API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running!");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    await product.save();
    res.json({
        success: true,
        name: req.body.name,
    })
});

// Creating API For deleting Product
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
        success: true,
        name: req.body.name
    })
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

app.post('/updateproduct', async (req, res) => {
    const { id, name, old_price, new_price, category } = req.body;
    await Product.findOneAndUpdate(
        { id: id },
        {
            name: name,
            old_price: old_price,
            new_price: new_price,
            category: category
        }
    );
    res.json({
        success: true,
        message: "Product updated successfully"
    });
});

// Schema creating for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
    }
})

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });

})

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user && (!req.body.adminSite || user.isAdmin)) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
            return;
        }
    }
    res.json({ success: false, errors: "Wrong Email or Password" });
})

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" })
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "please authenticate using a valid token" })
        }
    }
}

// Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
})

// Creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
})

app.post('/removeallfromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] = 0;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
})

// Creating endpoint to get cartdata
app.get('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})

// Schema creating for Order
const Order = mongoose.model('Order', {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderProduct', required: true }],
    total_cost: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    receiverInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    }
});

const OrderProduct = mongoose.model('OrderProduct', {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

// Create a new order with a transaction
app.post('/orders', fetchUser, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { customer, products, total_cost } = req.body;
        // Create and save the order first
        const order = new Order({
            customer: req.user.id,
            receiverInfo: {
                name: customer.name,
                phone: customer.phone,
                address: customer.address
            },
            products: [],
            total_cost
        });
        await order.save({ session });

        // Create order products with the order reference
        const orderProducts = await OrderProduct.insertMany(
            products.map(p => ({
                product: p._id,
                quantity: p.quantity,
                price: p.new_price,
                order: order._id
            })),
            { session }
        );

        // Update the order with the list of order products
        order.products = orderProducts.map(op => op._id);
        await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).send(order);
    } catch (error) {
        // Abort the transaction
        await session.abortTransaction();
        session.endSession();
        res.status(400).send(error);
    }
});

//get all orders for Admin
app.get('/order', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate({
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Endpoint để lấy thông tin người dùng và các đơn hàng của họ
app.get('/getInfor', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData);
})

// API để lấy thông tin các đơn hàng của người dùng đã đăng nhập
app.get('/getOrder', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id }).populate('customer').populate({
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port)
    } else {
        console.log("Error: " + error)
    }
});
