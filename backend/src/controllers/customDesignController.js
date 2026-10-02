const customDesignService = require('../services/customDesignService');

const getOptions = async (req, res) => {
  res.json({ data: await customDesignService.getOptions() });
};

module.exports = { getOptions };
