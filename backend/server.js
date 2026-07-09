import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Initialize database config
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Error] SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env')
  process.exit(1)
}

// Global Supabase client (using service key or anon key)
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Middleware to authenticate Supabase JWT
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify token with Supabase by getting the user
    // We create a client specific to the request so that RLS handles it,
    // or we can use the admin client to verify the token.
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized: ' + (error?.message || 'Invalid user') })
    }

    // Attach user and a user-specific Supabase client to the request
    req.user = user

    // Auto-sync user profile to public.profiles table using supabaseAdmin
    try {
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email,
          role: user.user_metadata?.role || 'student',
          updated_at: new Date()
        }, { onConflict: 'id' })
    } catch (profileErr) {
      console.warn('[Warning] Failed to sync user profile:', profileErr.message || profileErr)
    }

    req.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    next()
  } catch (err) {
    console.error('Authentication middleware error:', err)
    return res.status(500).json({ message: 'Internal Server Error during auth' })
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Endpoint: GET /v1/answers
// Fetch all answers for a specific material and user (or another student if requester is teacher)
app.get('/v1/answers', authenticateUser, async (req, res) => {
  const { materialId, userId } = req.query

  if (!materialId) {
    return res.status(400).json({ message: 'materialId parameter is required' })
  }

  try {
    let targetUserId = req.user.id

    // If a different userId is requested, verify if the requester has a teacher role
    if (userId && userId !== req.user.id) {
      const { data: profile } = await req.supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single()

      if (profile && profile.role === 'teacher') {
        targetUserId = userId
      } else {
        return res.status(403).json({ message: 'Forbidden: only teachers can view other student answers' })
      }
    }

    const { data, error } = await req.supabase
      .from('user_answers')
      .select('section_index, question_index, answer_text')
      .eq('material_id', parseInt(materialId))
      .eq('user_id', targetUserId)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.json(data)
  } catch (err) {
    console.error('Error fetching answers:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Endpoint: POST /v1/answers
// Save or update answers in bulk
app.post('/v1/answers', authenticateUser, async (req, res) => {
  const { answers } = req.body

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'answers must be an array' })
  }

  try {
    const payload = answers.map(ans => ({
      user_id: req.user.id,
      material_id: parseInt(ans.materialId),
      section_index: parseInt(ans.sectionIndex),
      question_index: parseInt(ans.questionIndex),
      answer_text: ans.answerText || '',
      updated_at: new Date()
    }))

    const { error } = await req.supabase
      .from('user_answers')
      .upsert(payload, { onConflict: 'user_id,material_id,section_index,question_index' })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.json({ message: 'Answers saved successfully' })
  } catch (err) {
    console.error('Error saving answers:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`[Server] running on http://localhost:${PORT}`)
})
