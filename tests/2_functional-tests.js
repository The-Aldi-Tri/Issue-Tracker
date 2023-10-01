const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const mocha = require('mocha')
const { suite, test } = mocha
const server = require('../server')
const { ObjectId } = require('mongoose').Types

chai.use(chaiHttp)

suite('Functional Tests', function () {
  let testId
  const invalidId = new ObjectId()

  suite('POST method tests', function () {
    test('Create an issue with every field', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send(
          {
            project: 'apitest',
            issue_title: 'Title issue',
            issue_text: 'Text issue',
            created_by: 'Someone',
            assigned_to: 'Someone else',
            status_text: 'Text status'
          }
        )
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.issue_title, 'Title issue')
          assert.equal(res.body.issue_text, 'Text issue')
          assert.closeTo(new Date(res.body.created_on).getTime(), new Date().getTime(), 5000)
          assert.closeTo(new Date(res.body.updated_on).getTime(), new Date().getTime(), 5000)
          assert.equal(res.body.created_by, 'Someone')
          assert.equal(res.body.assigned_to, 'Someone else')
          assert.equal(res.body.open, true)
          assert.equal(res.body.status_text, 'Text status')
          testId = res.body._id
          done()
        })
    })

    test('Create an issue with only required fields', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send(
          {
            project: 'apitest',
            issue_title: 'Title issue',
            issue_text: 'Text issue',
            created_by: 'Someone'
          }
        )
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.issue_title, 'Title issue')
          assert.equal(res.body.issue_text, 'Text issue')
          assert.closeTo(new Date(res.body.created_on).getTime(), new Date().getTime(), 5000)
          assert.closeTo(new Date(res.body.updated_on).getTime(), new Date().getTime(), 5000)
          assert.equal(res.body.created_by, 'Someone')
          assert.equal(res.body.assigned_to, '')
          assert.equal(res.body.open, true)
          assert.equal(res.body.status_text, '')
          done()
        })
    })

    test('Create an issue with missing required fields', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send({ project: 'apitest' })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'required field(s) missing')
          done()
        })
    })
  })

  suite('GET method tests', function () {
    test('View issues on a project', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/:project')
        .send({ project: 'apitest' })
        .end((err, res) => {
          if (err) assert.fail()
          assert.isArray(res.body)
          const issues = [...res.body]
          issues.forEach((issue) => {
            assert.hasAllKeys(issue,
              ['_id',
                'issue_title',
                'issue_text',
                'created_on',
                'updated_on',
                'created_by',
                'assigned_to',
                'open',
                'status_text'
              ]
            )
          })
          done()
        })
    })

    test('View issues on a project with one filter', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/:project')
        .send({ project: 'apitest' })
        .query({ open: 'false' })
        .end((err, res) => {
          if (err) assert.fail()
          assert.isArray(res.body)
          const issues = [...res.body]
          issues.forEach((issue) => {
            assert.hasAllKeys(issue,
              ['_id',
                'issue_title',
                'issue_text',
                'created_on',
                'updated_on',
                'created_by',
                'assigned_to',
                'open',
                'status_text'
              ]
            )
            assert.equal(issue.open, false)
          })
          done()
        })
    })

    test('View issues on a project with multiple filters', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/:project')
        .send({ project: 'apitest' })
        .query({ open: 'false', assigned_to: 'Joe' })
        .end((err, res) => {
          if (err) assert.fail()
          assert.isArray(res.body)
          const issues = [...res.body]
          issues.forEach((issue) => {
            assert.hasAllKeys(issue,
              ['_id',
                'issue_title',
                'issue_text',
                'created_on',
                'updated_on',
                'created_by',
                'assigned_to',
                'open',
                'status_text'
              ]
            )
            assert.equal(issue.open, 'false')
            assert.equal(issue.assigned_to, 'Joe')
          })
          done()
        })
    })
  })

  suite('PUT method tests', function () {
    test('Update one field on an issue', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/:project')
        .send({
          project: 'apitest',
          _id: testId,
          issue_title: 'Title has been changed'
        })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, testId)
          done()
        })
    })

    test('Update multiple fields on an issue', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/:project')
        .send({
          project: 'apitest',
          _id: testId,
          issue_text: 'Text has been changed',
          open: 'false'
        })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, testId)
          done()
        })
    })

    test('Update an issue with missing _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/:project')
        .send({
          project: 'apitest',
          issue_title: 'Title has been changed'
        })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })

    test('Update an issue with no fields to update', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/:project')
        .send({
          project: 'apitest',
          _id: '64fe982644c4da65e6186f85'
        })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'no update field(s) sent')
          assert.equal(res.body._id, '64fe982644c4da65e6186f85')
          done()
        })
    })

    test('Update an issue with an invalid _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/:project')
        .send({
          project: 'apitest',
          _id: invalidId,
          issue_title: 'Title has been changed'
        })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'could not update')
          assert.equal(res.body._id, invalidId)
          done()
        })
    })
  })

  suite('DELETE method tests', function () {
    test('Delete an issue', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/:project')
        .send({ _id: testId })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, testId)
          done()
        })
    })

    test('Delete an issue with an invalid _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/:project')
        .send({ _id: invalidId })
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'could not delete')
          assert.equal(res.body._id, invalidId)
          done()
        })
    })

    test('Delete an issue with missing _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/:project')
        .end((err, res) => {
          if (err) assert.fail()
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })
  })
})
