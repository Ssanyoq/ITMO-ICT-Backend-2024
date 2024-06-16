import { Sequelize } from 'sequelize-typescript'
import { TripLocation } from '../models/trips-locations/trip_location';

import { Trip } from '../models/trips/trip'

require('dotenv').config();

const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
})

const models = [
    Trip,
    TripLocation
]

sequelize.addModels(models)

sequelize
  .sync()
  .then(() => {
     console.log('synced models')
  })
  .catch((e) => console.log(e));

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection()

export default sequelize