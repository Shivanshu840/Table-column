import { Hono } from 'hono'
import { tableRouter } from './routes/table'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string
  }
}>()

app.use('/home/*', cors())
app.route('/home',tableRouter);

export default app
