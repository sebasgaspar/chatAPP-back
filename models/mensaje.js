const {Schema, model} = require('mongoose');

const MensajeShema=Schema({
    de:{
        type:Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    para:{
        type:Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    mensaje:{
        type:String,
        required:true
    }
    
},{
    timestamps:true,
});

MensajeShema.method('toJSON',function(){
    const {__v,_id,password,...object} =this.toObject();
    return object;
});

module.exports=model('Mensaje', MensajeShema);