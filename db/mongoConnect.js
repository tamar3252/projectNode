const mongoose = require('mongoose');
const {config} = require("../config/config")

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${config.userNameDb}:${config.passDb}@cluster0.rgwcpn5.mongodb.net/project3`);
    console.log("mongo connect")
}

