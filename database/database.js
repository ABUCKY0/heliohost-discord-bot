const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('../config.js');

/**
 * The sequelize object that connects to the database.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
  host: config.database.uri,
  dialect: 'mariadb',
  logging: false,
  storage: 'database.mariadb'
});


/**
 * The Tag object that represents a tag in the database.
 * @type {Model}
 * @property {string} tagName The name of the tag.
 * @property {string} tagDescription The body of the tag.
 */
const Tag = sequelize.define('Tag', {
  tagName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tagDescription: {
    type: DataTypes.STRING(2000),
  }
});

/**
 * Adds a tag to the database
 * @param tagName The name of the tag to add.
 * @param tagBody The body of the tag to add.
 * @returns 0 if Successful, -1 if tag already exists, and 1 if there was another error.
 */
async function addTag(tagName, tagBody) {
  tagName = tagName.toLowerCase();

  const existingTag = await Tag.findOne({ where: { tagName: tagName } });
  if (existingTag) {
    console.log("Tag already Exists");
    return -1;
  }

  try {
    const tag = await Tag.create({ tagName: tagName, tagDescription: tagBody });
    console.log(`Tag added: `, tagName);
    return 0;
  }
  catch (error) {
    console.error('Error adding tag: ', error)
    return 1;
  }
}

/** 
 * Removes a tag from the database
 * @param tagName The name of the tag to remove.
 * @returns 0 if Successful, -1 if tag isn't present, and 1 if there was another error.
 */
async function removeTag(tagName) {
  const existingTag = await Tag.findOne({ where: { tagName: tagName } });
  if (existingTag) {
    try {
      await Tag.destroy({ where: { tagName: tagName } });
      console.log(`Tag Removed: `, tagName)
      return 0;
    } catch (error) {
      console.error('Error removing tag: ', error);
      return 1;
    }
  }
  else {
    console.log("Tag doesn't exist.");
    return -1;
  }
}

/**
 * Updates a tag in the database
 * @param oldTagName The name of the tag to update.
 * @param oldTagBody The body of the tag to update.
 * @param newTagName The new name of the tag.
 * @param newTagBody The new body of the tag.
 * @returns 0 if Successful, -1 if tag isn't present, and 1 if there was another error.
 */
async function updateTag(oldTagName, newTagName, newTagBody) {

  const existingTag = await Tag.findOne({ where: { tagName: oldTagName } });
  if (!existingTag) {
    console.log("Tag does not exist.");
    return -1;
  }

  const updateData = {};
  if (newTagName) updateData.tagName = newTagName;
  if (newTagBody !== null) updateData.tagDescription = newTagBody;

  try {
    await Tag.update(updateData, { where: { tagName: oldTagName } });
    console.log(`Tag updated: `, newTagName || oldTagName);
    return 0;
  } catch (error) {
    console.error('Error updating tag: ', error);
    return 1;
  }
}

/**
 * Gets a tag from the database
 * @param tagName The name of the tag to get.
 * @returns The tag object if it exists, null if it doesn't.
 */
async function getTag(tagName) {
  const tag = await Tag.findOne({ where: { tagName: tagName } });
  if (tag) {
    console.log(`Tag found: `, tagName);
    return tag;
  }
  else {
    console.log("Tag not found.");
    return null;
  }
}

/**
 * Gets all tags from the database
 * @returns An array of all tags in the database.
 */
async function getAllTags() {
  const tags = await Tag.findAll();
  console.log(`All tags retrieved.`);
  return tags;
}
module.exports = { sequelize, Tag, addTag, removeTag, updateTag, getTag, getAllTags };
