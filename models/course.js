const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add course title"]
    },
    description: {
        type: String,
        required: [true,"Please enter the course description"]
    },
    weeks: {
        type: String,
        required:[true,"Please enter the number of course weeks"]
    },
    tuition: {
        type: Number,
        required:[true,"Please add the tuition cost"]
    },
    minimumSkill: {
        type: String,
        required: [true, "please enter the minimum skill"],
        enum:["beginner","intermediate","advanced"]
    },
    scholarhipsAvailable: {
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default:Date.now
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
    }
});

//static methods to get average cost of course tuition
courseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
            
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost:{$avg:'$tuition'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost:Math.ceil(obj[0].averageCost/10)*10,
        });
    } catch (ex) {
        console.error(ex);
    }
}
//get Average Course after save
courseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp);
});

//get Average Course before save
courseSchema.pre("remove", function () {
    this.constructor.getAverageCost(this.bootcamp);
});



module.exports = mongoose.model("Course", courseSchema);