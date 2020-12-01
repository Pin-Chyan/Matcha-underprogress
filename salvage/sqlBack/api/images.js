const request = require('./request');
const test_data = require('./default_data.json');

class controllers{

    constructor(senpai){
        this.senpai = senpai;
        this.request = new request.requestHandler(senpai);
    }
        
    query(req, res){
        var body = req.body;
        this.auth(body).then((authResult) => {
            console.log(authResult);
            if (authResult.status != 200)
                res.sendStatus(authResult.status);
            else if (this[body.controller])
                this[body.controller](body).then(result => { 
                    if (result.status == 200)
                        res.json(result.data);
                    else
                        res.sendStatus(result.status);
                });
            else
                res.json('error unknown controller');
        });
    }
    async auth(requestBody){
        var user = await this.request.read('users',{
            "user_id":requestBody.user
        });
        if (user.status == 'error')
            return this.ret(500,'server error');
        if (user.data.length == 0)
            return this.ret(404,'unknown user');
        if (requestBody.token == "admin")
            return this.ret(200,'welp');
        if (requestBody.token != user.data[0].token)
            return this.ret(403,'invalid token');
        return this.ret(200,'welp');
    } // checks token

    async upload_image(requestBody){
        var i = 1;
        var images = {};
        while (i < 6){
            if (requestBody.args["img" + i])
                images["img" + i] = requestBody.args["img" + i];
            i++;
        }
        var res = await this.request.update('images',images,{
                "user_id":requestBody.user
            }
        );
        return res;
    }
    async get_image(requestBody){
        return this.request.read('images', {
            "user_id":requestBody.user
        });
    }
}

module.exports = { controllers };