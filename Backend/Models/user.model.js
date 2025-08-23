
import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
  username:
   {type:string,
    required:true,
    unique:true,
  },


  email:
  {
    type:string,
    required:true,
    unique:true,
    trim: true,
    lowercase: true,

  },


  password:
  {
    type:string,
    required:true,
    minlength: 6,
    },


    profile:{
      FirstName:string,
      LastName:string,
      Bio:string,
      ProfilePicture:string,
      location:string,

    },
    subscription:{
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },

    expiryDate: {Date,
      featutes:{
        scriptsPerMonth:{type:Number,default:10},
        templatesAccess: {type:Boolean, default:false},
        analyticsAccess: {type:Boolean, default:false},
        apiAccess: {type:Boolean, default:false}
      }
      },
      usage: {
        scriptsUsed: { type: Number, default: 0 },
        templatesUsed: { type: Number, default: 0 },
        analyticsViewed: { type: Number, default: 0 },
      },

      preferences:{
        defaultNiche:string,
        defaultTone:{
          type:string,
          enum: ['casual', 'professional', 'friendly', 'formal'],
          default: 'casual',
        },
        defaultDuration:{type:Number, default: 5}, // in minutes
        language:{
          type: String,
          enum: ['en', 'es', 'fr', 'de', 'zh'],
          default: 'en',},
          favoriteTemplates:[{type: mongoose.Schema.Types.ObjectId, ref: 'Template'}],
          favoriteScripts:[{type: mongoose.Schema.Types.ObjectId, ref: 'Script'}],  
          preferredModel:{
            type: String,
            enum: ['gpt-3.5', 'gpt-4', 'custom'],
            default: 'gpt-3.5',}
      },
      integrations:{
        youtube: {
          channelId:string,
          channelName:string,
          accessToken:string,
          refreshToken:string,
          tokenExpiry: Date,},
          apiKeys:{
            openAi: string,
            google: string,
            clause:string,

          }

      },
      isActive: {
        type: Boolean,
        default: true
      },
      emailVerified: {
        type: Boolean,
        default: false
      },
      emailVerificationToken: {
        type: String,
        default: null
      },
      passwordResetToken: {
        type: String,},
        passwordResetExpires:Date

    
  },
 { timeStamps:true,
});
//password hashing middleware
userSchema .pre('save', async function(next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
}); 
//password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bycrpt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
export default User;