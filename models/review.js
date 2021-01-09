const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please Enter the Review Title'],
        trim: true,
        maxlength:200
    },
    text: {
        type: String,
        trim: true,  
        required: [true, "Please Enter the Review Text"],
    },
    rating: {
        type: Number,
        required: [true, "Please Enter the Rating between 1 to 10"],
        min: 1,
        max:10
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required:true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true
    },
    createdAt: {
        type: Date,
        default:Date.now(),
    }
});

//prevent user to submitting more than one review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { uniqe: true });

//static methods to get average rating of reviews
reviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
            
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating:{$avg:'$rating'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating:obj[0].averageRating
        });
    } catch (ex) {
        console.error(ex);
    }
}
//get Average Course after save
reviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.bootcamp);
});

//get Average Course before save
reviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model('Review', reviewSchema);