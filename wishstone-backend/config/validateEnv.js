// Environment Variable Validation for Production
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT',
  'FRONTEND_URL'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  // Validate JWT_SECRET strength in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters in production');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
  return true;
};

module.exports = validateEnv;

// Run validation if called directly
if (require.main === module) {
  require('dotenv').config();
  validateEnv();
}
