
const express = require('express');

const app = express();


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to FitComp!');
});


app.get('/health', (req, res) => {
  res.json({ status: 'Healthy' });
});

app.listen(port, () => {
  console.log(`FitComp app listening on port ${port}`);
});
