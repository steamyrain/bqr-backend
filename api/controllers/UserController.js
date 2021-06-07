import User from '../models/User.js';
import bcryptService from '../services/bcrypt.service.js';
import authService from '../services/auth.service.js';

// object factory pattern 
const UserController = () => {

    const register = async(req,res) => {
        const {body} = req;
        if(body.password === body.password2){
            try{
                const user = await User.create({
                    email: body.email,
                    password: body.password,
                })
                const token = authService().issue({id: user.id});
                const options = {
                    maxAge: 1000 * 60 * 60 * 24 * 30, /* in milisec */
                    httpOnly: true, /* http only cookie (cant be access with script) */
                    signed: true, /* signed with secret that way we will know if cookie has been altered */
                    sameSite: 'none', /* this cookie will be send to all cross domain request */ 
                    secure: true /* samesite=='none'?secure=true:secure=false */
                }
                return res.cookie('bqr',token,options).send('')
            } catch (err) {
                console.log(err);
                return res.status(500).json({msg: 'Internal server error'});
            }
        } else {
            return res.status(400).json({msg: 'Bad Request: Passwords don\'t match'});
        }
    };

    const login = async(req,res) => {
        const {email,password} = req.body;
        if (email && password){
            try{
                const user = await User.findOne({
                    where: {
                        email,
                    },
                });
                if (!user){
                    return res.status(400).json({msg: 'Bad Request: User not found'});
                }
                if (bcryptService().comparePassword(password,user.password)){
                    const token = authService().issue({id: user.id});
                    const options = {
                        maxAge: 1000 * 60 * 60 * 24 * 30, /* in milisec */
                        httpOnly: true, /* http only cookie (cant be access with script) */
                        signed: true, /* signed with secret that way we will know if cookie has been altered */
                        sameSite: 'none', /* recommended for cors cookie */
                        secure: true /* samesite=='none'?secure=true:secure=false */
                    }
                    return res.cookie('bqr',token,options).send('')
                    //return res.status(200).json({token,user});
                }
                return res.status(401).json({msg: 'unauthorized'});
            } catch (err){
                console.log(err);
                return res.status(500).json({msg: 'Internal server error'});
            }
        }
        return res.status(400).json({msg: 'Bad Request: Email or Password is wrong'});
    };

    const validate = async(req,res) => {
        const {token} = req.body;
        authService().verify(token, (err) => {
            if(err){
                return res.status(401).json({msg: 'unauthorized'});
            }
            return res.status(200).json({isvalid: true});
        });
    };

    const getAll = async(req,res) => {
        try {
            const users = await User.findAll();
            return res.status(200).json({users});
        } catch (err) {
                console.log(err);
                return res.status(500).json({msg: 'Internal server error'});
        }
    };

    const getProfile = async(req,res)=> {
        try{
            const {authToken} = req.signedCookies.bqr
        } catch (err) {
            console.log(err);
            return res.status(401);
        }
    }

    // wrap into object 
    return {
        register,
        login,
        validate,
        getAll
    };
};

export default UserController;
