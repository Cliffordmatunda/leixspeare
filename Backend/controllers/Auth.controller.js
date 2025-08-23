import User from './User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validationResult from '../utils/validationResult.js';

//generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const authController = {

    //register new user
    async registerUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        try {
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                profile: req.body.profile || {},
                emailVerificationToken: crypto.randomBytes(20).toString('hex')
            });
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                token: generateToken(newUser._id)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //login user
    async loginUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            //find user by email
            const existingUser = await User.findOne({ email }).select('+password');
            if (!existingUser) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            //check password
            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            //check if user is active
            if (existingUser.isActive === false) {
                return res.status(403).json({ message: 'Account is not activated. Please check your email.' });
            }
            //generate token
            const token = generateToken(existingUser._id);
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        _id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        subScription: existingUser.subScription,
                        profile: existingUser.profile
                    }
                }
            });
        }
        catch (error) {
            console.error('login error:', error);
            res.status(500).json({
                message: 'Server error'
            });
        }
    },

    //update user profile
    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const updates = req.body;
            const allowedUpdates = ['username', 'email', 'password', 'profile.firstName', 'profile.lastName', 'profile.avatarUrl'];
            const updateData = {};
            //only allow specific fields to be updated
            Object.keys(updates).forEach((key) => {
                if (allowedUpdates.includes(key)) {
                    updateData[key] = updates[key];
                }
            });
            // If password is being updated, hash it
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true, runValidators: true }).select('-password');
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.error('update profile error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //change password
    async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { currentPassword, newPassword } = req.body;
            const existingUser = await User.findById(req.user.id).select('+password');
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            //check current password
            const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            //hash new password
            existingUser.password = await bcrypt.hash(newPassword, 10);
            await existingUser.save();
            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('change password error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            //generate reset token
            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 minutes
            await user.save();
            //send email with reset token (implementation of sendEmail function is assumed)
            //await sendEmail(user.email,'Password Reset',`Your reset token is: ${resetToken}`);
            res.json({
                success: true,
                message: 'Password reset token sent to email',
                //remove in production
                resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
            });
        }
        catch (error) {
            console.error('forgot password error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpire: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
            //update password
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            console.error('reset password error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            const user = await User.findOne({ emailVerificationToken: token });
            if (!user) {
                return res.status(400).json({ message: 'Invalid token' });
            }
            user.emailVerified = true;
            user.emailVerificationToken = undefined;
            await user.save();
            res.json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            console.error('verify email error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    //refresh token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || !user.isActive) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
            //generate new token
            const newToken = generateToken(user._id);
            res.json({
                success: true,
                token: newToken
            });
        }
        catch (error) {
            console.error('refresh token error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

};

export default authController;