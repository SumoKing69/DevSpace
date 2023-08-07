const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
dotenv.config()

const some_url = process.env.URL

async function connectoDb(){
    try {
        const client = await MongoClient.connect(some_url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('DB is connected!');
        module.exports = client;
        const app = require('./app');
        app.listen(process.env.PORT, () => {
          console.log("Server is listening on 8112!");
        });
      } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); 
      }
}

connectoDb();
