const mongoose= require('mongoose');
const User= require("./User")

const conn = mongoose.connect("mongodb://127.0.0.1:27017/corsomongo")
async function run(){
    const user = new User({
        nome:"Luca",
        eta:26,
        hobbies:["calcio"],
        address:{
            street:"porto",
            number:"a33"
        },
        email:"a@a"
    })
    User.create(user);
    const query = User.where("address.street").equals("porto")
    console.log(query)
}
run()