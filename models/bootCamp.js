const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../configs/geocoder');

const bootCampSchema = new mongoose.Schema({
    user:String,
    name: {
        type: String,
        required: [true,'please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'],
        unique:true
    },
    slug:String,
    description: {
        type: String,
        trim: true,
        required: [true,'please add a description'],
        unique: true,
        maxlength:[1000,"Description can not be more than 50 characters"]
    },
    website: {
        type: String,
        trim:true,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use a valid Url with HTTP or HTTPS'],
    },
    phone: {
        type: String,
        maxlength:[20,"phone can not be more than 20 digits"]
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please Enter a valid Email"],
        trim:true,
    },
    address: {
        type: String,
        required:[true,'please Enter an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            //required: true
        },
        coordinates: {
            type: [Number],
           //required: true,
            index:'2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country:String
    },
    careers: {
        type: [String],
        required: true,
        enum:["Web Development", "UI/UX", "Business","Mobile Development","Data Science","Others"]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max:[10,"Rating must be not more 10"]
    },
    averageCost: Number,
    phone: {
        type: String,
        default:'placeholderPhoto.jpg'
    },
    bootcampImage: {
        type:String,
    },
    housing: {
        type: Boolean,
        default:false
    },
    jobAssistance: {
        type: Boolean,
        default:false
    },
    jobGuarantee: {
        type: Boolean,
        default:false
    },
    acceptGi: {
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true
    }
}, {
    toJSON: { virtuals: true },
    toObject:{virtuals:true}
});

//create slug field from name field
bootCampSchema.pre('save', function(next){
    this.slug = slugify(this.name.toString(), {lower: true});
    next();
})

//Using GeoCoder to build location field
bootCampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    //don't save address in the data base becouse we get the location from the address
    this.address = undefined;
    next();
});
//cascade delete courses when delete the bootcamp
bootCampSchema.pre('remove', async function (next) {
    console.log(`Courses beign removed from the bootcamp ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});
//reverse populate with virtuals
bootCampSchema.virtual('courses', {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne:false
})

module.exports = mongoose.model('Bootcamp', bootCampSchema);