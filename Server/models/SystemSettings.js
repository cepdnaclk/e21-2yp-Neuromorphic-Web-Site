const mongoose = require("mongoose");

const SystemSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Neuromphis Research Center",
  },
  siteDescription: {
    type: String,
    default: "Leading research in neuromorphic computing and AI",
  },
  contactEmail: {
    type: String,
    default: "contact@neuromphis.com",
  },
  address: {
    type: String,
    default: "123 Research Blvd, Tech City, TC 12345",
  },
  phone: {
    type: String,
    default: "+1 (555) 123-4567",
  },
  socialMedia: {
    twitter: { type: String, default: "https://twitter.com/neuromphis" },
    linkedin: {
      type: String,
      default: "https://linkedin.com/company/neuromphis",
    },
    github: { type: String, default: "https://github.com/neuromphis" },
  },
});

module.exports = mongoose.model("SystemSettings", SystemSettingsSchema);
