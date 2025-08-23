import mongoose from 'mongoose';


const analyticalsSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user,
    required:true
},
scriptId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Script',
    required:true
},
metrics:{
    engagementRate:{
        score:number,
        factors:[string],
        suggestions:[string]
    },
    seo:{
        score:number,
        keyphrases:[string],
        suggestions:[string]
    },
    readability:{
        score:Number,
        gradeLevel:String,
        suggestions:[string]
    },
    sentiment:{
        score:Number,
        dominantEmotion:String,
        suggestions:[string],
        emotions:mongoose.Schema.Types.Mixed
    }
},
nlp:{
    keyPhrases:[string],
    entities:[{
        text:String,
        type:String,
        relevance:Number
    }],
    topics:[{
        name:String,
        relevance:Number
    }],
    summary:string
},
    performance:{
        views:Number,
        likes:Number,
        shares:Number,
        comments:Number,
        watchTime:Number
    },
    analyzedAt:{
        type:Date,
        default:Date.now
    },
    version:string

},
{timestamps:true}
);
const Analytical = mongoose.model('Analytical', analyticalsSchema);
export default Analytical;