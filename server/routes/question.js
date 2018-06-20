import express from 'express'
import {required, questionMiddleware} from '../middleware'
import {question} from '../db-api'
import {handleError} from '../utils'
import {User} from '../models'
const app = express.Router()

//GET /api/questions
app.get('/', async (req, res) => {
  try {
    const {sort} = req.query
    const questions = await question.findAll(sort)
    res.status(200).json(questions)
  } catch (e) {
    handleError(e, res)
  }
})

//GET /api/questions/:id
app.get('/:id', questionMiddleware, (req, res) => {
  try {
    res.status(200).json(req.question)
  } catch (e) {
    handleError(e, res)
  }
})

//POST /api/questions
app.post('/', required, async (req, res) => {
  const {title, description, icon} = req.body
  const q = {
    title,
    description,
    icon,
    user: req.user._id
  }
  try {
    const savedQuestion = await question.create(q)
    res.status(201).json(savedQuestion)
  } catch (e) {
    handleError(e, res)
  }

})

//POST /api/questions/:id/answers
app.post('/:id/answers', required, questionMiddleware, async (req, res) => {
  const a = req.body
  const q = req.question
  a.createdAt = new Date()
  a.user = new User(req.user)
  try {
    const savedAnswer = await question.createAnswer(q, a)
    res.status(201).json(savedAnswer)
  } catch (e) {
    handleError(e, res)
  }

})

export default app
