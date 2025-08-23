import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxLenght:200
    },
    description:String,
    category:{
        type:String,
        required:true,
        enum:['vlog','tutorial','review','interview','documentary','narrative']
    },
    niche:[String],
    structure:{
        sections:[{
            name:String,
            description:String,
            prompst: String,
            duration:Number,
            required:{type:Boolean, default:true}
     } ],
     totalSections:{type:Number, default:0},
     estimatedDuration:{type:Number, default:0}
    
    },
    prompts:{
        hook:String,
        intro:String,
        mainContent:String,
        conclusion:String,
        callToAction:String,
        transition: String
    },
    settings:{
        defaultTone:String,
        recommendedDuration:Number,
        targetAudience:String,
        difficulty:
        {
            type:String,
            enum:['beginner','intermediate','advanced'],
            default:'beginner'
        }
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isPublic:{type:Boolean, default:true},
    isPremium:{type:Boolean, default:false},
    usage:{
        timeUsed:{type:Number, default:0}, // in minutes
        ratings:{type:Number, default:0},
        reviews:[{
            userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
            rating:{type:Number, min:1, max:5},
            comment:String,
            createdAt:{type:Date, default:Date.now}
        }]
    },
    tags:[String]
},
{timeStamps:true
});
const Template = mongoose.model('Template', templateSchema);
export default Template;