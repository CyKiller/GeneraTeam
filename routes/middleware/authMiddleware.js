const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log(`User ${req.session.userId} is authenticated`);
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    console.log('User is not authenticated');
    return res.status(401).send('You are not authenticated'); // User is not authenticated
  }
};

const hasValidParams = (req, res, next) => {
  const { requestId } = req.query;
  if (!requestId) {
    console.log('Missing requestId for chat');
    return res.status(400).send('Missing requestId. Please select a valid request.');
  }
  console.log(`Request ID ${requestId} is present`);
  next();
};

module.exports = {
  isAuthenticated,
  hasValidParams
};