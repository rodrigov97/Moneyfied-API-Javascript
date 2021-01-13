const config = {
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        //Email
        user: "",
        //Password
        pass: ""
    }
};

module.exports = config;
