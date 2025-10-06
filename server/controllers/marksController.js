const Marks = require('../models/Marks');
const Jury = require('../models/Jury');
const Team = require('../models/Team');

// Save marks for a jury
const saveMarks = async (req, res) => {
  try {
    const { juryName } = req.params;
    const { marks } = req.body; // Array of marks for all teams

    // Delete existing marks for this jury
    await Marks.deleteMany({ juryName });

    // Save new marks
    const savedMarks = [];
    for (const mark of marks) {
      const newMark = new Marks({
        juryName,
        teamName: mark.teamName,
        criteria: mark.criteria,
        total: mark.total
      });
      const saved = await newMark.save();
      savedMarks.push(saved);
    }

    // Update jury status
    await Jury.findOneAndUpdate(
      { name: juryName },
      { hasSubmitted: true, paused: false, submittedAt: new Date() },
      { upsert: true }
    );

    res.json(savedMarks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get marks for a specific jury
const getMarksByJury = async (req, res) => {
  try {
    const { juryName } = req.params;
    const marks = await Marks.find({ juryName });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leaderboard data
const getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find({});
    const juries = await Jury.find({});
    const allMarks = await Marks.find({});

    const leaderboard = teams.map(team => {
      const teamData = {
        teamName: team.name,
        category: team.category,
        juryTotals: {},
        grandTotal: 0
      };

      let totalScore = 0;
      juries.forEach(jury => {
        const juryMarks = allMarks.find(
          mark => mark.juryName === jury.name && mark.teamName === team.name
        );
        const score = juryMarks ? juryMarks.total : 0;
        teamData.juryTotals[jury.name] = score;
        totalScore += score;
      });

      teamData.grandTotal = totalScore;
      return teamData;
    });

    // Sort by grand total (descending)
    leaderboard.sort((a, b) => b.grandTotal - a.grandTotal);

    // Add ranks
    const rankedLeaderboard = leaderboard.map((team, index) => ({
      rank: index + 1,
      ...team
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      juries: juries.map(j => j.name)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get submission status for all juries
const getSubmissionStatus = async (req, res) => {
  try {
    const juries = await Jury.find({});
    const statusData = juries.map(jury => ({
      juryName: jury.name,
      status: jury.hasSubmitted ? 'Submitted' : jury.paused ? 'Paused' : 'Pending',
      submittedAt: jury.submittedAt
    }));
    res.json(statusData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all marks
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find({});
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveMarks,
  getMarksByJury,
  getLeaderboard,
  getSubmissionStatus,
  getAllMarks
};