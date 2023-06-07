import mongoose from 'mongoose';

export default class Database {
    public static getMongoDbConnection(connectionUri: string) {
        // Change the default Promise implementation to the global Promise implementation provided by Node.js
        mongoose.Promise = global.Promise;

        mongoose.connect(connectionUri);

        const dbConnection = mongoose.connection;
        dbConnection.once('open', () => console.log('✅ MongoDB - database connection established successfully!'));
        dbConnection.on('error', (err) => {
            console.log('❌ MongoDB - connection error. Please make sure MongoDB is running. Error: ' + err);
            process.exit();
        });

        return dbConnection;
    }
}
