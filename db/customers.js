const db = require('./dbconfig');

// Getterit
const getAllCustomers = (reg, res) => {
  db.query('SELECT * FROM customers', (err, result) => {
    if (err) {
      console.error(err);
    }
    else {
      res.json(result.rows);
    }
  })
}

const getCustomerById = (req, res) => {
  const query = {
    text: 'SELECT * FROM customers WHERE id = $1',
    values: [req.params.id],
  }

  db.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    else {
      if (result.rows.length > 0) {
        res.json(result.rows);
      }
      else {
        res.status(404).end();
      }
    }
  })
}

// Posterit
const addCustomer = (req, res) => {
  const newCustomer = req.body;

  const query = {
    text: 'INSERT INTO customers (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [newCustomer.firstname, newCustomer.lastname, newCustomer.email, newCustomer.phone]
  };

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      return res.status(500).json({ error: 'Database error' });
    }
    // Palautetaan oikeasti kannasta tallennettu rivi (sis. id:n jos sellainen on)
    res.status(201).json(result.rows[0]);
  });
};

// Delete
const deleteCustomer = (req, res) => {
  const query = {
    text: 'DELETE FROM customers WHERE id = $1',
    values: [req.params.id]
  }
  db.query(query, (err, res) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
  })
  res.status(204).end();
}

const deleteAllCustomers = (req, res) => {
  db.query('DELETE FROM customers'), (err, res) => {
    if (err) {
      return console.error('Error executing query', err.stack);
    }
  }
}

const updateCustomer = (req, res) => {
  const id = req.params.id;
  const uCustomer = req.body;

  const query = {
    text: `
      UPDATE customers 
      SET firstname=$1, lastname=$2, email=$3, phone=$4 
      WHERE id=$5
      RETURNING *
    `,
    values: [
      uCustomer.firstname,
      uCustomer.lastname,
      uCustomer.email,
      uCustomer.phone,
      id
    ]
  };

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(result.rows[0]);
  });
};


module.exports = {
  getAllCustomers: getAllCustomers,
  getCustomerById: getCustomerById,
  addCustomer: addCustomer,
  deleteCustomer: deleteCustomer,
  updateCustomer: updateCustomer,
  deleteAllCustomers: deleteAllCustomers
}