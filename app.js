const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./config/db')

dotenv.config()

const app = express();

const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter')
const shopsRouter = require('./routes/shopsRouter')
const productRouter = require('./routes/productRouter')
const orderRouter = require('./routes/orderRouter')

app.use(express.json());
app.use(morgan('dev'));
app.use(cors())


app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/shops', shopsRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
  
connectDB() 

const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))