const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('../config.js');

/**
 * Enum for Return Status
 * @readonly
 * @enum {number}
 */
const Status = Object.freeze({
  SUCCESS: 0,
  FAIL: -1,
  ERROR: 1
});
let connectionTry = 1;
let backoffbase =  config.database.backoffBase;
/**
 * The sequelize object that connects to the database.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
  host: config.database.uri,
  dialect: 'mariadb',
  logging: console.log,
  storage: 'database.mariadb',
  retry: {
    max: 10, // Maximum number of retries
    match: [
      Sequelize.ConnectionError,
      Sequelize.ConnectionTimedOutError,
      Sequelize.TimeoutError
    ], // Retry for specific Sequelize errors
    backoffBase: config.database.backoffBase, // Initial delay in ms
    backoffExponent: config.database.backoffExponent, // Exponential backoff factor
  },
  hooks: {
    beforeConnect: (config) => {
      console.log('[Database Hook] Attempting to connect to database, try #' + connectionTry +  " of 10. Retrying in " + backoffbase/1000+ " seconds");
      connectionTry++;
      backoffbase = backoffbase * config.backoffExponent;
    },
    afterConnect: (connection) => {
      console.log('Connected to database');
    }
  },
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
 * The Wiki object that represents an article reference in the database.
 * @type {Model}
 * @property {string} articleName The name of the article entry to reference.
 * @property {string} tagDescription The body of the reference.
 */
const Wiki = sequelize.define("Wiki", {
  articleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  articleBody: {
    type: DataTypes.STRING(2000)
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
    return Status.FAIL;
  }

  try {
    const tag = await Tag.create({ tagName: tagName, tagDescription: tagBody });
    console.log(`Tag added: `, tagName);
    return Status.SUCCESS;
  }
  catch (error) {
    console.error('Error adding tag: ', error)
    return Status.ERROR;
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
      return Status.SUCCESS;
    } catch (error) {
      console.error('Error removing tag: ', error);
      return Status.ERROR;
    }
  }
  else {
    console.log("Tag doesn't exist.");
    return Status.FAIL;
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
    return Status.FAIL;
  }

  const updateData = {};
  if (newTagName) updateData.tagName = newTagName;
  if (newTagBody !== null) updateData.tagDescription = newTagBody;

  try {
    await Tag.update(updateData, { where: { tagName: oldTagName } });
    console.log(`Tag updated: `, newTagName || oldTagName);
    return Status.SUCCESS;
  } catch (error) {
    console.error('Error updating tag: ', error);
    return Status.ERROR;
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
