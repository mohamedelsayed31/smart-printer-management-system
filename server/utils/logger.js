const logger = (action, userId) => {
    const time = new Date().toLocaleString("ar-EG");
    console.log(`[${time}] Action: ${action} | UserID: ${userId}`);
  };
  module.exports = logger;