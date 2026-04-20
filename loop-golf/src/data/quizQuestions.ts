export type AnswerKey = 'A' | 'B' | 'C' | 'D'

export interface QuizOption {
  key: AnswerKey
  text: string
  points: number
}

export interface QuizQuestion {
  id: number
  category: string
  question: string
  options: QuizOption[]
  // Tags emitted when a specific answer is chosen — drives action plan
  tags?: Partial<Record<AnswerKey, string[]>>
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Part 1: The Starting Line ──────────────────────────────────────────
  {
    id: 1,
    category: 'The Starting Line',
    question: "Let's be honest: how much golf have you actually played?",
    options: [
      { key: 'A', text: "None. I've never even held a club.", points: 0 },
      { key: 'B', text: "I've messed around at Topgolf or mini-golf.", points: 1 },
      { key: 'C', text: "I've been to the driving range a few times.", points: 3 },
      { key: 'D', text: "I've played a few actual rounds, but I'm terrible.", points: 5 },
    ],
    tags: {
      A: ['complete_beginner'],
      B: ['complete_beginner'],
    },
  },
  {
    id: 2,
    category: 'The Starting Line',
    question: 'What is your main motivation for wanting to learn golf?',
    options: [
      { key: 'A', text: 'Work / Networking — my boss or clients play.', points: 3 },
      { key: 'B', text: 'Social — my friends or partner play and I feel left out.', points: 3 },
      { key: 'C', text: 'Fitness and spending time outdoors.', points: 4 },
      { key: 'D', text: 'I just love a good personal challenge.', points: 5 },
    ],
  },
  {
    id: 3,
    category: 'The Starting Line',
    question: 'Do you currently have any golf equipment?',
    options: [
      { key: 'A', text: 'Nothing at all. Where do I even buy tees?', points: 1 },
      { key: 'B', text: 'Hand-me-downs from a friend or relative.', points: 3 },
      { key: 'C', text: 'A cheap starter set I just bought.', points: 4 },
      { key: 'D', text: "No — I plan to rent clubs until I know if I like it.", points: 2 },
    ],
  },
  {
    id: 4,
    category: 'The Starting Line',
    question: 'What is your ultimate goal as a beginner golfer?',
    options: [
      { key: 'A', text: 'Just to not embarrass myself in front of others.', points: 1 },
      { key: 'B', text: 'To be able to hit the ball in the air consistently.', points: 2 },
      { key: 'C', text: 'To keep up with my friends on a weekend round.', points: 3 },
      { key: 'D', text: 'To break 100 and become a "real" golfer.', points: 5 },
    ],
  },

  // ── Part 2: The First-Tee Jitters ─────────────────────────────────────
  {
    id: 5,
    category: 'First-Tee Jitters',
    question: 'What makes you most anxious about stepping onto a real golf course?',
    options: [
      { key: 'A', text: 'Holding up the groups playing behind me.', points: 3 },
      { key: 'B', text: 'Whiffing (missing the ball completely) while people watch.', points: 1 },
      { key: 'C', text: "Not knowing all the unwritten rules and etiquette.", points: 4 },
      { key: 'D', text: "Hitting a ball into the woods... or a window.", points: 2 },
    ],
    tags: {
      A: ['pace_of_play_focus'],
      C: ['etiquette_focus'],
    },
  },
  {
    id: 6,
    category: 'First-Tee Jitters',
    question: 'If you hit a terrible shot off the first tee, how do you react?',
    options: [
      { key: 'A', text: 'I want the ground to swallow me whole.', points: 0 },
      { key: 'B', text: "I'll probably nervously laugh it off.", points: 2 },
      { key: 'C', text: 'I get frustrated and swing harder next time.', points: 1 },
      { key: 'D', text: "I don't care — I expect to be bad at first!", points: 5 },
    ],
  },
  {
    id: 7,
    category: 'First-Tee Jitters',
    question: 'How do you feel about playing with people who are much better than you?',
    options: [
      { key: 'A', text: "Terrified. I don't want to ruin their game.", points: 0 },
      { key: 'B', text: "Nervous, but hoping they give me some tips.", points: 2 },
      { key: 'C', text: "A little intimidated, but I'll survive.", points: 3 },
      { key: 'D', text: "Excited! It's the best way to learn.", points: 5 },
    ],
  },
  {
    id: 8,
    category: 'First-Tee Jitters',
    question: 'What physical part of the game are you most worried about learning?',
    options: [
      { key: 'A', text: 'The full swing (driver and irons).', points: 3 },
      { key: 'B', text: 'Chipping and pitching around the greens.', points: 3 },
      { key: 'C', text: 'Putting.', points: 3 },
      { key: 'D', text: 'Just making contact with the ball!', points: 2 },
    ],
    tags: {
      D: ['complete_beginner'],
    },
  },

  // ── Part 3: Golf IQ ────────────────────────────────────────────────────
  {
    id: 9,
    category: 'Golf IQ',
    question: 'Do you know the difference between an Iron, a Wood, and a Wedge?',
    options: [
      { key: 'A', text: 'Yes, I know exactly what they all do.', points: 10 },
      { key: 'B', text: "I kind of know, but don't ask me to choose one.", points: 6 },
      { key: 'C', text: 'I thought woods were actually made of wood?', points: 2 },
      { key: 'D', text: 'Absolutely no idea.', points: 0 },
    ],
    tags: {
      C: ['vocab_basics'],
      D: ['vocab_basics'],
    },
  },
  {
    id: 10,
    category: 'Golf IQ',
    question: 'You hear someone on the next hole yell "FORE!" — what do you do?',
    options: [
      { key: 'A', text: 'Look up to see where the ball is going.', points: 1 },
      { key: 'B', text: 'Yell "FIVE!" back.', points: 0 },
      { key: 'C', text: 'Duck, cover your head, and turn away from the sound.', points: 10 },
      { key: 'D', text: 'Start running to the golf cart.', points: 0 },
    ],
    tags: {
      A: ['etiquette_safety_first'],
      B: ['etiquette_safety_first'],
      D: ['etiquette_safety_first'],
    },
  },
  {
    id: 11,
    category: 'Golf IQ',
    question: 'What does the term "Par" mean to you?',
    options: [
      { key: 'A', text: 'The number of strokes an expert is expected to need for a hole.', points: 10 },
      { key: 'B', text: "A score I probably won't see for a very long time.", points: 5 },
      { key: 'C', text: 'Average (like "par for the course").', points: 5 },
      { key: 'D', text: "I'm really not sure how scoring works yet.", points: 0 },
    ],
    tags: {
      D: ['vocab_basics'],
    },
  },
  {
    id: 12,
    category: 'Golf IQ',
    question: 'On the putting green, who is supposed to putt first?',
    options: [
      { key: 'A', text: 'Whoever is ready first.', points: 3 },
      { key: 'B', text: 'The person whose ball is furthest from the hole.', points: 10 },
      { key: 'C', text: 'The person with the lowest score.', points: 0 },
      { key: 'D', text: 'The oldest person in the group.', points: 0 },
    ],
    tags: {
      A: ['etiquette_rules'],
      C: ['etiquette_rules'],
      D: ['etiquette_rules'],
    },
  },

  // ── Part 4: Budget & Logistics ─────────────────────────────────────────
  {
    id: 13,
    category: 'Budget & Logistics',
    question: 'What is your budget looking like for getting into golf?',
    options: [
      { key: 'A', text: 'Shoestring. I want to spend as little as possible.', points: 1 },
      { key: 'B', text: "Moderate. I'll buy decent used gear and pay for range balls.", points: 3 },
      { key: 'C', text: "Flexible. I'm willing to invest in a good starter set and lessons.", points: 4 },
      { key: 'D', text: 'Take my money. I want the good stuff.', points: 5 },
    ],
    tags: {
      A: ['budget_conscious'],
    },
  },
  {
    id: 14,
    category: 'Budget & Logistics',
    question: 'Are you planning to learn this game solo or with a crew?',
    options: [
      { key: 'A', text: 'Solo mission. Just me and YouTube.', points: 2 },
      { key: 'B', text: 'With my significant other.', points: 3 },
      { key: 'C', text: "With a group of friends who are also beginners.", points: 4 },
      { key: 'D', text: "I'm hoping to join a beginner's clinic to meet people.", points: 5 },
    ],
  },
  {
    id: 15,
    category: 'Budget & Logistics',
    question: 'How much time can you realistically dedicate to golf each week?',
    options: [
      { key: 'A', text: 'Maybe 1 hour at the driving range.', points: 2 },
      { key: 'B', text: '2–3 hours (a couple range sessions or 9 holes).', points: 3 },
      { key: 'C', text: 'A half-day on the weekends.', points: 4 },
      { key: 'D', text: "As much time as it takes to get good!", points: 5 },
    ],
  },
  {
    id: 16,
    category: 'Budget & Logistics',
    question: 'Where do you picture yourself playing most of your golf?',
    options: [
      { key: 'A', text: 'Mostly just hitting balls at the driving range.', points: 2 },
      { key: 'B', text: 'A casual local public course (muni).', points: 4 },
      { key: 'C', text: 'A private country club.', points: 3 },
      { key: 'D', text: 'Indoor simulators / Topgolf.', points: 2 },
    ],
  },

  // ── Part 5: Learning Style ─────────────────────────────────────────────
  {
    id: 17,
    category: 'Learning Style',
    question: 'How do you learn physical skills best?',
    options: [
      { key: 'A', text: 'Watching quick, bite-sized video tutorials.', points: 4 },
      { key: 'B', text: 'Reading step-by-step guides with pictures.', points: 4 },
      { key: 'C', text: 'In-person, one-on-one coaching.', points: 5 },
      { key: 'D', text: 'Trial and error — let me figure it out by doing it.', points: 3 },
    ],
  },
  {
    id: 18,
    category: 'Learning Style',
    question: 'If you could magically fix one thing about your beginner game, what would it be?',
    options: [
      { key: 'A', text: 'Slicing the ball (it always curves hard to the right).', points: 4 },
      { key: 'B', text: 'Hitting the ground before the ball (chunking).', points: 4 },
      { key: 'C', text: 'My grip and posture — I feel awkward over the ball.', points: 3 },
      { key: 'D', text: 'My confidence.', points: 3 },
    ],
  },
  {
    id: 19,
    category: 'Learning Style',
    question: 'What kind of golf content are you most looking for?',
    options: [
      { key: 'A', text: 'Swing basics and how-to guides.', points: 4 },
      { key: 'B', text: "Rules and etiquette so I don't look dumb.", points: 5 },
      { key: 'C', text: 'Gear recommendations for beginners on a budget.', points: 3 },
      { key: 'D', text: 'Mental tips to calm my nerves on the course.', points: 4 },
    ],
    tags: {
      B: ['etiquette_focus'],
    },
  },
  {
    id: 20,
    category: 'Learning Style',
    question: "What's your timeline for getting out on an actual golf course?",
    options: [
      { key: 'A', text: 'Within the next week or two!', points: 5 },
      { key: 'B', text: 'Next month, once I practice a bit.', points: 4 },
      { key: 'C', text: 'Sometime this year.', points: 3 },
      { key: 'D', text: "I need to feel confident at the range first — however long that takes.", points: 2 },
    ],
  },
]
