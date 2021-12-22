const { response } = require("express");
const bcrypt= require('bcryptjs');

const Usuario = require('../models/usuario');
const {generarJWT} =require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const { user , password} = req.body;
    try {

        const existeUsuario = await Usuario.findOne({user});
        if(existeUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt= bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        await usuario.save();

        //Generar mi JWT
        const token= await generarJWT(usuario.id)

        res.json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}
const login=async (req, res=response)=>{
    const{user, password}=req.body;
    try{
        const usuarioDB=await Usuario.findOne({user});
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'User no encontrado'
            });
        }

        //Validar password
        const validPassword =bcrypt.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es valida'
            });
        }

        const token=await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            usuario:usuarioDB,
            token:token
        })
    }
    catch(error){
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
    
}

const renewToken= async(req, res=response)=>{
    const uid=req.uid;
    const token=await generarJWT(uid);

    const usuario=await Usuario.findById(uid);

    res.json({
        ok:true,
        usuario,
        token
    })
}
module.exports = {
    crearUsuario,
    login,
    renewToken
}