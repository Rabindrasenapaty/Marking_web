const Config = require('../models/Config');

// Get configuration
const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne({});
    if (!config) {
      // Create default config if none exists
      config = new Config();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update configuration
const updateConfig = async (req, res) => {
  try {
    const {
      criteriaList,
      maxMarksPerCriterion,
      competitionName,
      collegeName,
      clubName
    } = req.body;

    let config = await Config.findOne({});
    if (!config) {
      config = new Config();
    }

    if (criteriaList) config.criteriaList = criteriaList;
    if (maxMarksPerCriterion !== undefined) config.maxMarksPerCriterion = maxMarksPerCriterion;
    if (competitionName) config.competitionName = competitionName;
    if (collegeName) config.collegeName = collegeName;
    if (clubName) config.clubName = clubName;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getConfig,
  updateConfig
};