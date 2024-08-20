import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { toJSON, paginate } from '../Plugins'; // Ensure these plugins are correctly implemented
import { roles } from '../../../Common/Config/roles';
import { PLAYER_GENDER, STAFF_ACCOUNT_FOR } from '../../../Common/Utils/constant';
import { accountSources, ACCOUNT_SOURCES } from '../../../Common/Config/accountSource';
import { appSources, APP_SOURCES } from '../../../Common/Config/appSource';

// Define the IUser interface
interface IUser extends Document {
    name: string;
    socialId?: string;
    gender?: string;
    phone?: string;
    address?: string;
    personalInfo?: Record<string, any>;
    socialType?: 'Facebook' | 'Google';
    email?: string;
    password: string;
    role?: string;
    userRoles?: {
        roleId: mongoose.Types.ObjectId;
        invitedBy?: mongoose.Types.ObjectId;
        isSuperAdminRole?: boolean;
    }[];
    staffAccountFor?: any;
    avatar?: string;
    socialAvatar?: string;
    isEmailVerified?: boolean;
    isDeleted?: boolean;
    isOnboarding?: boolean;
    shopifyAccessToken?: string;
    shopifyStoreName?: string;
    shopifyCartId?: string;
    isCompleteEnterProfile?: boolean;
    shopifyShop?: string;
    shopifyShopEmail?: string;
    isShopifyShopActive?: boolean;
    companyName?: string;
    industry?: string;
    productType?: string;
    source?: number;
    appSource?: number;
    triedPlanIds?: any;
    isPasswordMatch(password: string): Promise<boolean>;
}

// Define the IUserModel interface
interface IUserModel extends Model<IUser> {
    isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
    isSocialIdTaken(socialId: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
    isShopifyShopTaken(shopifyShop: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

// Define the User schema
const userSchema: Schema<IUser, IUserModel> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    socialId: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
        default: PLAYER_GENDER.MALE,
        enum: [PLAYER_GENDER.MALE, PLAYER_GENDER.FEMALE]
    },
    phone: {
        type: String,
        required: false,
        default: "",
    },
    address: {
        type: String,
        required: false,
        default: "",
    },
    personalInfo: {
        type: Schema.Types.Mixed, // Use Mixed type for any object
        required: false,
        default: null,
    },
    socialType: {
        type: String,
        enum: ["Facebook", "Google"]
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value: string) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: roles,
        default: 'retailers',
    },
    userRoles: {
        type: [
            {
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: null,
                    ref: "RoleAndPermission"
                },
                invitedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                isSuperAdminRole: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    staffAccountFor: {
        type: String,
        required: false,
        default: STAFF_ACCOUNT_FOR.METADROB
    },
    avatar: {
        type: String,
        required: false,
    },
    socialAvatar: {
        type: String,
        required: false,
        default: ""
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isOnboarding: {
        type: Boolean,
        default: false
    },
    shopifyAccessToken: {
        type: String,
        required: false,
        default: ""
    },
    shopifyStoreName: {
        type: String,
        required: false,
        default: ""
    },
    shopifyCartId: {
        type: String,
        required: false,
        default: ""
    },
    isCompleteEnterProfile: {
        type: Boolean,
        required: false,
        default: false
    },
    shopifyShop: {
        type: String,
        required: false,
        default: ""
    },
    shopifyShopEmail: {
        type: String,
        required: false,
        default: ""
    },
    isShopifyShopActive: {
        type: Boolean,
        required: false,
        default: true
    },
    companyName: {
        type: String,
        required: false,
    },
    industry: {
        type: String,
        required: false,
    },
    productType: {
        type: String,
        required: false,
    },
    source: {
        type: Number,
        enum: accountSources,
        default: ACCOUNT_SOURCES.METADROB,
    },
    appSource: {
        type: Number,
        enum: appSources,
        default: APP_SOURCES.METADROB,
    },
    triedPlanIds: {
        type: Array,
        required: false,
        default: [],
    },
}, {
    timestamps: true,
});

// Add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Static methods
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isSocialIdTaken = async function (socialId: string, excludeUserId?: mongoose.Types.ObjectId) {
    const user = await this.findOne({ socialId, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isShopifyShopTaken = async function (shopifyShop: string, excludeUserId?: mongoose.Types.ObjectId) {
    const user = await this.findOne({ shopifyShop, _id: { $ne: excludeUserId } });
    return !!user;
};

// Instance methods
userSchema.methods.isPasswordMatch = async function (password: string) {
    const user = this as IUser;
    return bcrypt.compare(password, user.password);
};

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    const user = this as IUser;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Create the User model
const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export { User };
