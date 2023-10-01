'use strict'

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const issueSchema = new mongoose.Schema(
  {
    project: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, required: true },
    assigned_to: String,
    open: { type: Boolean, default: true },
    status_text: String
  }
)
const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema)

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true }))

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      const params = {}
      for (const prop in req.query) {
        if (req.query[prop]) {
          params[prop] = req.query[prop]
        }
      }
      params.project = req.params.project

      let issues = await Issue.find(params, { __v: 0 })

      issues = issues.map((issue) => {
        return {
          _id: issue._id,
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_on: issue.created_on,
          updated_on: issue.updated_on,
          created_by: issue.created_by,
          assigned_to: issue.assigned_to,
          open: issue.open,
          status_text: issue.status_text
        }
      })

      return res.json(issues)
    })

    .post(async function (req, res) {
      const issueTitle = req.body.issue_title || req.query.issue_title
      const issueText = req.body.issue_text || req.query.issue_text
      const createdBy = req.body.created_by || req.query.created_by

      if (!issueTitle || !issueText || !createdBy) {
        return res.json({ error: 'required field(s) missing' })
      }

      const newIssue = new Issue(
        {
          project: req.params.project || 'apitest',
          issue_title: issueTitle,
          issue_text: issueText,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: createdBy,
          assigned_to: req.body.assigned_to || '',
          open: true,
          status_text: req.body.status_text || ''
        }
      )

      await newIssue.save().then(savedIssue => {
        const obj = {
          _id: savedIssue._id,
          issue_title: savedIssue.issue_title,
          issue_text: savedIssue.issue_text,
          created_on: savedIssue.created_on,
          updated_on: savedIssue.updated_on,
          created_by: savedIssue.created_by,
          assigned_to: savedIssue.assigned_to,
          open: savedIssue.open,
          status_text: savedIssue.status_text
        }
        return res.json(obj)
      })
    })

    .put(async function (req, res, done) {
      const _id = req.body._id || req.params._id
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      const params = {}
      for (const prop in req.body) {
        if (req.body[prop] && prop !== '_id' && prop !== 'project') {
          params[prop] = req.body[prop]
        }
      }

      if (Object.keys(params).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id })
      }

      params.updated_on = new Date()
      if (params.open === 'false') {
        params.open = false
      }

      const updated = await Issue.findOneAndUpdate(
        { _id },
        { $set: params },
        { returnNewDocument: true }
      )

      if (updated) {
        return res.json({ result: 'successfully updated', _id })
      } else {
        return res.json({ error: 'could not update', _id })
      }
    })

    .delete(async function (req, res) {
      const _id = req.body._id
      if (!_id) return res.json({ error: 'missing _id' })
      const deleted = await Issue.deleteOne({ _id })
      if (deleted.deletedCount === 0) {
        return res.json({ error: 'could not delete', _id })
      } else {
        return res.json({ result: 'successfully deleted', _id })
      }
    })
}
