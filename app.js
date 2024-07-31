const express = require('express');
const mysql = require('mysql2');
const app = express();
// Create MySQL connection
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'c237_supermarketapp'
});
connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL database');
});
// Set up view engine
app.set('view engine', 'ejs');

// enable static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: false

}));


// Define routes
app.get('/',(req,res) => {
    const sql = 'SELECT * fROM products';
    connection.query( sql,(error,results) => {
        if (error) {
            console.error('Database query error:',error.message);
            return res.status(500).send('Error Retreiving products');
        }
      res.render('index',{products: results});
    });
});
// Example:
// app.get('/', (req, res) => {
// connection.query('SELECT * FROM TABLE', (error, results) => {
// if (error) throw error;
// res.render('index', { results }); // Render HTML page with data
// });
// });

app.get('/product/:id', (req, res) => {
    // Extract the product ID from the request parameters
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    
    // Fetch data from MySQL based on the product ID
    connection.query(sql, [productId], (error, results) => {
      if (error) {
        console.error('Database query error:', error.message);
        return res.status(500).send('Error retrieving product by ID');
      }
      
      // Check if any product with the given ID was found
      if (results.length > 0) {
        // Render HTML page with the product data
        res.render('product', { product: results[0] });
      } else {
        // If no product with the given ID was found, render a 404 page or handle it accordingly
        res.status(404).send('Product not found');
      }
    });
  });
  
app.get('/addProduct', (req, res) => {
  res.render('addProduct');
  });
  
  app.post('/addProduct', (req, res) => {
    // Extract product data from the request body
    const { name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    
    // Insert the new product into the database
    connection.query(sql, [name, quantity, price, image], (error, results) => {
      if (error) {
        // Handle any error that occurs during the database operation
        console.error('Error adding product:', error);
        res.status(500).send('Error adding product');
      } else {
        // Send a success response
        res.redirect('/');
      }
    });
  });
  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));