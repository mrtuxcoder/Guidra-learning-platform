const User = require('../models/User');
const { signJwt } = require('../configs/jwt');

/**
 * Set password for Google OAuth users
 */
exports.setPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Check if user already has password
    if (user.hasPassword()) {
      return res.status(400).json({ error: 'You already have a password set. Use change password instead.' });
    }
    
    // Set the new password
    await user.setPassword(newPassword);
    
    // Generate new token with updated auth info
    const token = signJwt({ 
      id: user._id, 
      email: user.email, 
      name: user.name,
      authProvider: user.authProvider 
    });
    
    console.log('✅ [SET PASSWORD] Password set for user:', user.email);
    
    res.status(200).json({
      message: 'Password set successfully! You can now login with email and password.',
      hasPassword: true,
      authProvider: user.authProvider,
      token: token
    });
    
  } catch (error) {
    console.error('❌ [SET PASSWORD] Error:', error);
    
    if (error.message.includes('at least 6 characters')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to set password' });
  }
};

/**
 * Change existing password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ [CHANGE PASSWORD] Password changed for user:', user.email);
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('❌ [CHANGE PASSWORD] Error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

/**
 * Check password status
 */
exports.checkPasswordStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      hasPassword: user.hasPassword(),
      authProvider: user.authProvider,
      needsPasswordSetup: user.needsPasswordSetup ? user.needsPasswordSetup() : false
    });
    
  } catch (error) {
    console.error('❌ [CHECK PASSWORD] Error:', error);
    res.status(500).json({ error: 'Failed to check password status' });
  }
};