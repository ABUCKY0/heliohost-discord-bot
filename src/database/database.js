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


/**
  * Enum for Database Management Actions
  * @readonly
  * @enum {number}
 */
const DBManagementActions = Object.freeze({ 
  ADD: 0,
  DELETE: 1,
  EDIT: 2,
  GET: 3,
  GETALL: 4
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
 * @property {string} articleBody The body of the reference.
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
 * Manages the tags in the database.
 * 
 * @param {DBManagementActions} action 
 * @param  {...any} args 
 * @returns {Status}
 * 
 * @example manageTags(DBManagementActions.ADD, "tagName", "tagBody")
 * @example manageTags(DBManagementActions.REMOVE, "tagName")
 * @example manageTags(DBManagementActions.EDIT, "oldTagName", "newTagName", "newTagBody")
 * @example manageTags(DBManagementActions.GET, "tagName")
 * @example manageTags(DBManagementActions.GETALL)
 */
async function manageTags(action, ...args) {
  let tagName = args[0] !== undefined ? args[0] : null;
  let tagBody = args[1] !== undefined ? args[1] : null;
  let newTagName = args[1] !== undefined ? args[1] : null;
  let newTagBody = args[2] !== undefined ? args[2] : null;
  let oldTagName = args[0] !== undefined ? args[0] : null;

  switch (action) {
    case DBManagementActions.ADD:
      tagName = tagName.toLowerCase();
      const existingTag_ADD = await Tag.findOne({ where: { tagName: tagName } });
      if (existingTag_ADD) {
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
      break;

    case DBManagementActions.DELETE:
      console.log("Removing Tag: ", tagName);
      const existingTag_REMOVE = await Tag.findOne({ where: { tagName: tagName } });
      console.log(existingTag_REMOVE)
      if (existingTag_REMOVE) {
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
      break;
    
    case DBManagementActions.EDIT:
      const existingTag_EDIT = await Tag.findOne({ where: { tagName: oldTagName } });
      if (!existingTag_EDIT) {
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
      break;
    
    case DBManagementActions.GET:
      const tag = await Tag.findOne({ where: { tagName: tagName } });
      if (tag) {
        console.log(`Tag found: `, tagName);
        return tag;
      }
      else {
        console.log("Tag not found.");
        return null;
      }
      break;
    
    case DBManagementActions.GETALL:
      const tags = await Tag.findAll();
      console.log(`All tags retrieved.`);
      return tags;
      break;
  }
}


/**
 * Manages the wiki articles in the database.
 * 
 * @param {DBManagementActions} action 
 * @param  {...any} args 
 * @returns {Status}
 * 
 * @example manageWiki(DBManagementActions.ADD, articleName, articleBody, articleLink)
 * @example manageWiki(DBManagementActions.REMOVE, articleName)
 * @example manageWiki(DBManagementActions.EDIT, oldArticleName, newArticleName, newArticleBody, newArticleLink)
 * @example manageWiki(DBManagementActions.GET, articleName)
 * @example manageWiki(DBManagementActions.GETALL)
 */
async function manageWiki(action, ...args) {
  let articleName = args[0] !== undefined ? args[0] : null;
  let articleBody = args[1] !== undefined ? args[1] : null;
  let newArticleName = args[1] !== undefined ? args[1] : null;
  let newArticleBody = args[2] !== undefined ? args[2] : null;
  let oldArticleName = args[0] !== undefined ? args[0] : null;

  switch (action) {
    case DBManagementActions.ADD:
      articleName = articleName.toLowerCase();
      const existingArticle_ADD = await Wiki.findOne({ where: { articleName: articleName } });
      if (existingArticle_ADD) {
        console.log("Article already Exists");
        return Status.FAIL;
      }

      try {
        const article = await Wiki.create({ articleName: articleName, articleBody: articleBody });
        console.log(`Article added: `, articleName);
        return Status.SUCCESS;
      }
      catch (error) {
        console.error('Error adding article: ', error)
        return Status.ERROR;
      }
      break;

    case DBManagementActions.DELETE:
      
      const existingArticle_REMOVE = await Wiki.findOne({ where: { articleName: articleName } });
      if (existingArticle_REMOVE) {
        try {
          await Wiki.destroy({ where: { articleName: articleName } });
          console.log(`Article Removed: `, articleName)
          return Status.SUCCESS;
        } catch (error) {
          console.error('Error removing Article: ', error);
          return Status.ERROR;
        }
      }
      else {
        console.log("Article doesn't exist.");
        return Status.FAIL;
      }
      break;
    
    case DBManagementActions.EDIT:
      const existingArticle_EDIT = await Wiki.findOne({ where: { articleName: oldArticleName } });
      if (!existingArticle_EDIT) {
        console.log("Article does not exist.");
        return Status.FAIL;
      }
    
      const updateData = {};
      if (newArticleName) updateData.articleName = newArticleName;
      if (newArticleBody !== null) updateData.articleDescription = newArticleBody;
    
      try {
        await Wiki.update(updateData, { where: { articleName: oldArticleName } });
        console.log(`Article updated: `, newArticleName || oldArticleName);
        return Status.SUCCESS;
      } catch (error) {
        console.error('Error updating article: ', error);
        return Status.ERROR;
      }
      break;
    
    case DBManagementActions.GET:
      const article = await Wiki.findOne({ where: { articleName: articleName } });
      if (article) {
        console.log(`Article found: `, articleName);
        return article;
      }
      else {
        console.log("Article not found.");
        return null;
      }
      break;
    
    case DBManagementActions.GETALL:
      const articles = await Wiki.findAll();
      console.log(`All articles retrieved.`);
      return articles;
      break;
  }
}

module.exports = { sequelize, Tag, Wiki, manageTags, manageWiki, Status, DBManagementActions };