import mongoose from 'mongoose';


const generationalSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    scriptId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Script',
        required:true
    },
    type:{
        type:String,
        enum:['script-generation','script-revision','template-suggestion','optimization'],
        default:'script-generation'
    },
    input:{
        prompt:String,
        parameters:mongoose.schema.Types.Mixed,
        models:String
    },
    output:{
        type:String,
        metadata:mongoose.schema.Types.Mixed
    },
    perfomance:{
        tokensUsed:Number,
        generationTime:Number,
        cost:Number,
        model:String,

    },
    status:{
        type:String,
        enum:['pending','in-progress','completed','failed'],
        default:'pending'
    },
    error:{
        message:String,
        code:String,
        details:mongoose.schema.Types.Mixed}
    },
    {timestamps:true}
);
const Generation = mongoose.model('Generation', generationalSchema);
export default Generation;  