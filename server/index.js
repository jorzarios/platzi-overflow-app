import http from 'http'
import Debug from 'debug'
import app from './app'
import mongoose from 'mongoose'
import { mongoUrl } from './config'
import { port } from './config'

const debug = new Debug('platzi-overflow:root')

mongoose.Promise = global.Promise

async function start() {
  await mongoose.connect(mongoUrl)

  app.listen(port,() => {
    console.log(`Server running at port ${port}`);
  })
}

start()
