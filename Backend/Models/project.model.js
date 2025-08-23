import mngoose from 'mongoose';


const projectSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
  type:String,
  required:true,
  maxLength:200
  },
  description:String,
    niche:{
      type:String,
      required:true
    },
    targetAudience:{
      age:{min:Number,mx:Number},
      demographics:[string],
      interest:[string],
      description:string
    },
    videoSpecs:{
      duration:{type:Number,default:10},
      format:{type:string,enum:['short','medium','long'],default:'medium'},
      platform:{type:string,enum:['youtube','tiktok','twiter'],default:'youtube'}
    },
    contentSettings:{
      tone:{
        type:string,
        enum:['casual','proffesional','humorous','educative','dramatic'],
        default:'casual'
      },
      style:{
        type:string,
        enum:['narrative','tutorial','review','vlog','interview','documentary'],
        default:'narrative'
      },
      language:{type:string,default:'en'}


    },
    keyWords:{
      primary:[string],
      secondary:[string],
      trending:[string]
    },
    status:{
      type:string,
      enum:['draft','generating','completed','failed','archived'],
      default:'draft'
    },
    templateId:{
      type:Mongoose.Schema.Types.ObjectId,
      ref:'Template'
    },
    GenerationSettings:{
      model:string,
      temperature:{type:Number,default:0.7},
      maxTokens:{type:Number,default:2000},
      customPrompts:{
        hook:string,
        style:string,
        additional:string
      }
    },
    analytics:{
      views:{type:Number,default:0},
      shares:{type:Number,default:0},
      lastViewed:Date
    }
  },{timeStamps:true
});
const Project = mngoose.model('Project', projectSchema);
export default Project;