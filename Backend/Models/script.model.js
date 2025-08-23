import mongoose from 'mongoose';
import Project from './project.model';


const sceneSchema = new mongoose.Schema({
sceneNumber:{type:Number,required:true},
title:String,
type:{
    type:String,
    enum:['intro','body','conclusion','hook','transition'],
    default:'body'
},
content:{
    dialogue:String,
    voiceOver:String,
    visuals:String,
    narration:String,
},
visuals:{
    images:[String],
    videoClips:[String],
    animations:[String],
    graphics:[String],
    description:String,
    bRoll:[String],
    shots:[String],
    },
    timing:{
        startTime:Number,
        duration:Number,
        endTime:Number
    },
    notes:String,

});
const scriptSchema= new mongoose.Schema({
    ProjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    title:{
        type:String,
        required:true,
        maxLength:200
    },
    structure:{
        hook:String,
        intro:String,
        mainContent:String,
        conclusion:String,
        callToAction:String
    },
    scenes:[sceneSchema],
    metadata:{
        wordCount:Number,
        estimatedDuration:Number,
        readabilityScore:Number,
        engagementScore:Number,
        seoScore:Number,
        sentimentScore:Number,
    },
    analysis:{
        keyphrases:[string],
        emotions:[string],
        topics:[string],
        suggestions:[string],

    },
    version:{
        number:{type:Number,default:1},
        changes:string,
        previousVersion:{type:mongoose.Schema.Types.ObjectId, ref:'Script'},
    },
    generation:{
        model:string,
        prompt:string,
        tokenUsed:Number,
        generationTime:Number,
        temperature:number
    },
    isActive:{
        type:Boolean,
        default:true
    },
    publishedAt:Date
},

    {timeStamps:true

});
const script = mongoose.model('Script', scriptSchema);
export default script;