const { compareSync } = require("bcryptjs");
const { response } = require("express");
const Usuario =require('../models/usuario');


const getUsuarios = async (req, res = response) => {
    const desde =Number(req.query.desde) || 0;
    const usuarios= await Usuario
    .find({_id:{$ne:req.uid}})
    .skip(desde)
    .limit(10);

    res.json({
        ok: true,
       usuarios:usuarios,
       desde
    });
}

module.exports = {
    getUsuarios
}