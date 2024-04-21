require('dotenv').config();

/**
 * Checks if CI/CD features should be enabled based on the environment variable.
 * @returns {boolean} True if CI/CD is enabled, false otherwise.
 */
function isCiCdEnabled() {
  const ciCdEnabled = process.env.ENABLE_CI_CD;
  if (ciCdEnabled === 'true') {
    console.log("CI/CD features are enabled.");
    return true;
  } else {
    console.log("CI/CD features are disabled. Operating in local development mode.");
    return false;
  }
}

module.exports = {
  isCiCdEnabled
};