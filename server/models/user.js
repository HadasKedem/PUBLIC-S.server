const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator'),
    bcrypt = require('bcrypt')

const UserSchema = new Schema({

    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },

    //Our password is hashed with bcrypt
    password: { type: String, required: true },

    tasks: [
        {
            task:
                { type: Schema.Types.ObjectId, ref: 'Task' },
            status: {
                recentlyCompleted: Date,
                status: String,
                goodForDays: Number
            }
        }
    ],

    captainUpInternalId: String,
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
    },

    role: { type: String, required: true, default: 'user', enum: ['user', 'admin'] },

    isActive: { type: Boolean, default: true }

}, {
    timestamps: true
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/** Password encryption. */
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

UserSchema.virtual("populateTasks").get(async function () {

    await this.populate('tasks.task').execPopulate();
    return this.tasks;

})

/** Calculates the tasks כשירות using each task's goodFor prop and the recentlyCompleted date prop. */
UserSchema.virtual("calcTasksStatuses").get(async function () {
    const utilityManager = require('../BL/utilityManager');

    // For each user-task:
    this.tasks.forEach(task => {

        task = utilityManager.calcTaskStatus(task);

    });
})



UserSchema.methods.comparePassword = function (plaintext, callback) {
    return bcrypt.compareSync(plaintext, this.password);
};

module.exports = mongoose.model("User", UserSchema);