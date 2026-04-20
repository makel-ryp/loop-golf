import type { Module } from '../types/modules';

export const modules: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'The Course',
    subtitle: 'Know your environment before you tee off.',
    color: '#3B6D11',
    lightColor: '#EAF3DE',
    passingScore: 7,
    totalQuestions: 10,
    intro:
      'Before you swing a club, you need to understand the battlefield. A golf course is made up of distinct zones — each with its own rules, challenges, and opportunities. Knowing what each area is called and how it affects your game is the first step to feeling confident on the course.',
    questions: [
      {
        id: 'm1-q1',
        n: 1,
        type: 'MC',
        tag: 'COURSE',
        question:
          'You hit your tee shot and it lands in the short, neatly mown grass between the tee and the green. What is this area called?',
        options: ['The apron', 'The fringe', 'The fairway', 'The rough'],
        correctAnswer: 'The fairway',
        explanation:
          'The fairway is the closely mown strip of grass designed as the ideal landing zone for tee shots. A ball in the fairway gives you a clean lie and maximum club selection for your next shot.',
        memoryHook: 'Short grass = the fairway. Long grass = the rough. Always aim for the short stuff.',
      },
      {
        id: 'm1-q2',
        n: 2,
        type: 'TF',
        tag: 'COURSE',
        question:
          'True or False: You are allowed to putt from the fringe (the slightly longer grass around the green).',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "The fringe (also called the apron or collar) is not technically the putting surface, but you are absolutely allowed to putt from it. In fact, putting from the fringe is often smarter than chipping for beginners — fewer variables.",
        memoryHook: 'Fringe = puttable. When in doubt from the fringe, putt it.',
      },
      {
        id: 'm1-q3',
        n: 3,
        type: 'MC',
        tag: 'COURSE',
        question: 'What do white stakes or white lines on a golf course indicate?',
        options: ['Ground under repair', 'Out of bounds', 'A lateral water hazard', 'A free drop zone'],
        correctAnswer: 'Out of bounds',
        explanation:
          'White stakes mark the out of bounds boundary. A ball crossing these markers results in a stroke-and-distance penalty — 1 stroke added and you replay from the original spot. Red stakes mark lateral hazards. Blue stakes typically mark GUR.',
        memoryHook: 'White = OB. Red = water hazard. Know your stake colors.',
      },
      {
        id: 'm1-q4',
        n: 4,
        type: 'TF',
        tag: 'COURSE',
        question:
          'True or False: A dogleg hole means the fairway curves left or right, making it impossible to see the green from the tee box.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "A dogleg is exactly that — a hole shaped like a bent leg, curving left or right partway through. You cannot see the green from the tee. Strategy involves deciding whether to cut the corner aggressively or play safely around the bend.",
        memoryHook: 'Dogleg = the hole bends. Check the scorecard diagram before you tee off.',
      },
      {
        id: 'm1-q5',
        n: 5,
        type: 'MC',
        tag: 'COURSE',
        question:
          "Your ball lands in an area marked with white painted lines and a sign that reads 'GUR.' What does this mean for you?",
        options: [
          '1 penalty stroke — drop outside the area',
          'Play the ball as it lies — no special treatment',
          'Free relief — drop at nearest point of complete relief, no penalty',
          'The hole is closed — skip to the next',
        ],
        correctAnswer: 'Free relief — drop at nearest point of complete relief, no penalty',
        explanation:
          'GUR stands for Ground Under Repair. These are areas being maintained and you receive mandatory free relief — zero penalty. Find the nearest point where the GUR no longer affects your stance or swing, then drop within one club length, no nearer the hole.',
        memoryHook: 'GUR = free drop, no penalty. White lines = take the relief.',
      },
      {
        id: 'm1-q6',
        n: 6,
        type: 'TF',
        tag: 'COURSE',
        question:
          "True or False: The flagstick (pin) is only useful from far away — once you're on the green, it tells you nothing about strategy.",
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'The pin position tells you a great deal about strategy. A front pin requires a higher, softer approach. A back pin gives you more green to work with. Knowing whether the pin is front, middle, or back changes your club selection and aim point on every approach shot.',
        memoryHook: 'Pin position = changes your approach strategy every hole. Front pin = more precision needed.',
      },
      {
        id: 'm1-q7',
        n: 7,
        type: 'MC',
        tag: 'COURSE',
        question: 'Which of the following correctly describes the difference between the rough and the fairway?',
        options: [
          'The rough is closer to the green; the fairway is near the tee',
          'The rough has longer, thicker grass making shots harder to control; the fairway is closely mown',
          'The rough is a penalty area; the fairway is free relief',
          'There is no meaningful difference — both are in play',
        ],
        correctAnswer:
          'The rough has longer, thicker grass making shots harder to control; the fairway is closely mown',
        explanation:
          'The rough borders the fairway and features longer, thicker grass. Shots from the rough are harder to control — expect less distance and less accuracy. The fairway\'s short grass gives you a clean lie and full club selection.',
        memoryHook: 'Fairway = clean lie, full options. Rough = harder shot, take more club.',
      },
      {
        id: 'm1-q8',
        n: 8,
        type: 'TF',
        tag: 'COURSE',
        question: 'True or False: A bunker (sand trap) is the same thing as a penalty area (water hazard).',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'Bunkers and penalty areas are completely different things with different rules. A bunker is a sand hazard — you play from it but cannot ground your club. A penalty area (water hazard) is marked with red or yellow stakes and costs a penalty stroke if your ball enters it.',
        memoryHook: 'Bunker = sand, play from it, rake after. Penalty area = water, 1 stroke penalty.',
      },
      {
        id: 'm1-q9',
        n: 9,
        type: 'MC',
        tag: 'COURSE',
        question: 'Standing on the tee box, you see colored markers — red, white, and blue. What do these indicate?',
        options: [
          'Danger zones for errant shots',
          'Different starting distances for different skill levels',
          'The order in which groups tee off',
          'Wind direction markers',
        ],
        correctAnswer: 'Different starting distances for different skill levels',
        explanation:
          'Tee markers indicate different distances from the hole — forward tees (red/gold) are shortest and easiest, white is middle distance, blue is back, and black/championship is longest. Beginners should always play forward tees.',
        memoryHook: 'Red/forward tees = shorter, friendlier, faster. Play them without shame.',
      },
      {
        id: 'm1-q10',
        n: 10,
        type: 'MC',
        tag: 'COURSE',
        question:
          'Your ball lands in a large puddle left by overnight rain. The puddle is not a marked hazard — just standing water on the fairway. What is this called and what are you entitled to?',
        options: [
          'A water hazard — 1 penalty stroke and a drop',
          'Casual water — free relief, no penalty',
          'An unplayable lie — 1 penalty stroke required',
          'Nothing special — play it as it lies',
        ],
        correctAnswer: 'Casual water — free relief, no penalty',
        explanation:
          'Temporary standing water (puddles after rain) is called casual water and gives you free relief anywhere on the course with no penalty stroke. Even if just your feet would be in the water at address, you\'re entitled to a drop.',
        memoryHook: 'Puddle on the course = casual water = free drop. No penalty.',
      },
    ],
  },

  {
    id: 'module-2',
    number: 2,
    title: 'Scoring',
    subtitle: 'How the game is counted — and how to use it to your advantage.',
    color: '#085041',
    lightColor: '#E1F5EE',
    passingScore: 7,
    totalQuestions: 10,
    intro:
      "Golf scoring is counterintuitive for newcomers — lower is better, every swing counts even if you miss, and there's a whole vocabulary for how far above or below 'expected' you finish each hole. Master this module and you'll never be confused on the scorecard again.",
    questions: [
      {
        id: 'm2-q1',
        n: 1,
        type: 'TF',
        tag: 'SCORING',
        question: 'True or False: In golf, the player with the highest score at the end of the round wins.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'Golf is unique — lowest score wins. Every stroke you take adds to your total, and the goal is to complete each hole in as few strokes as possible.',
        memoryHook: 'Golf: less is more. Lowest score wins. Always.',
      },
      {
        id: 'm2-q2',
        n: 2,
        type: 'MC',
        tag: 'SCORING',
        question: "A hole is labeled 'Par 4.' What does this mean?",
        options: [
          'The hole is 400 yards long',
          'An expert golfer is expected to complete it in 4 strokes',
          'You need at least 4 clubs to play the hole',
          'The hole has 4 bunkers',
        ],
        correctAnswer: 'An expert golfer is expected to complete it in 4 strokes',
        explanation:
          'Par is the expected score for an expert golfer — it assumes 2 putts once on the green. A par-4 means reaching the green in 2 shots and 2-putting. For a beginner, par on any hole is a genuine victory.',
        memoryHook: 'Par = expert target. Par-4 = 2 shots to the green + 2 putts.',
      },
      {
        id: 'm2-q3',
        n: 3,
        type: 'MC',
        tag: 'SCORING',
        question: "You're playing a par-4 hole and finish in 5 strokes. What is your score called?",
        options: ['Eagle', 'Birdie', 'Bogey', 'Double bogey'],
        correctAnswer: 'Bogey',
        explanation:
          'One stroke over par is called a bogey. On a par-4, that\'s 5 strokes. For beginners, consistently shooting bogey is excellent — averaging bogey for 18 holes gives you roughly 90.',
        memoryHook: "Bogey = 1 over par. It is a good score for a beginner. Don't let anyone tell you otherwise.",
      },
      {
        id: 'm2-q4',
        n: 4,
        type: 'TF',
        tag: 'SCORING',
        question: 'True or False: A birdie means you completed the hole in one stroke fewer than par.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "A birdie is 1 under par. On a par-4, that's 3 strokes. Named from old American slang where 'bird' meant something excellent.",
        memoryHook: 'Birdie = 1 under par. One better than expected.',
      },
      {
        id: 'm2-q5',
        n: 5,
        type: 'MC',
        tag: 'SCORING',
        question: 'You complete a par-5 hole in 3 strokes. What is this called?',
        options: ['Birdie', 'Eagle', 'Albatross', 'Ace'],
        correctAnswer: 'Eagle',
        explanation:
          "Two strokes under par is an eagle. On a par-5, holing out in 3 shots is an eagle. An albatross is 3 under par. An ace is a hole-in-one from the tee.",
        memoryHook: 'Eagle = 2 under par. Birdie = 1 under. Build the ladder from the bottom up.',
      },
      {
        id: 'm2-q6',
        n: 6,
        type: 'TF',
        tag: 'SCORING',
        question:
          "True or False: A 'whiff' — swinging at the ball and missing completely — does not count as a stroke because no contact was made.",
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          "A stroke is defined as any intentional forward movement of the club toward the ball — contact is not required. A complete miss (whiff) counts as your first stroke.",
        memoryHook: 'Whiff = stroke. Intention counts, not contact.',
      },
      {
        id: 'm2-q7',
        n: 7,
        type: 'MC',
        tag: 'SCORING',
        question: "What is the 'max score rule' and why is it useful for beginners?",
        options: [
          'A rule that limits each player to 3 mulligans per round',
          'Capping your score at double par per hole — pick up, write the max, and move on',
          'A tournament rule limiting scores to +10 over par for the round',
          'The maximum number of clubs allowed in the bag',
        ],
        correctAnswer: 'Capping your score at double par per hole — pick up, write the max, and move on',
        explanation:
          "The max score rule means if you reach double par on a hole (e.g., 8 on a par-4), you pick up, write the max, and move on. It protects your mental state, keeps pace for the group, and prevents one bad hole from ruining a round.",
        memoryHook: 'Max score rule: pick up at double par. Not quitting — playing smart.',
      },
      {
        id: 'm2-q8',
        n: 8,
        type: 'MC',
        tag: 'SCORING',
        question: 'What is the difference between a gross score and a net score?',
        options: [
          'Gross = front 9 total; net = back 9 total',
          'Gross = your actual stroke total; net = gross minus your handicap strokes',
          'Gross = stroke play total; net = match play total',
          'There is no difference — the terms are interchangeable',
        ],
        correctAnswer: 'Gross = your actual stroke total; net = gross minus your handicap strokes',
        explanation:
          'Your gross score is your real, unmodified stroke count. Your net score subtracts your handicap allowance, leveling the playing field between golfers of different abilities.',
        memoryHook: 'Gross = real score. Net = after handicap. Net is how you compete fairly.',
      },
      {
        id: 'm2-q9',
        n: 9,
        type: 'TF',
        tag: 'SCORING',
        question:
          "True or False: A handicap of 0 (scratch) means the golfer is expected to shoot par on any course.",
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'A scratch golfer has a 0 handicap index — meaning they are expected to play to par on any course under normal conditions. Less than 2% of all golfers worldwide reach scratch.',
        memoryHook: 'Scratch = 0 handicap = plays to par. Rare, excellent, long-term goal.',
      },
      {
        id: 'm2-q10',
        n: 10,
        type: 'MC',
        tag: 'SCORING',
        question: 'In the Stableford scoring format, what happens if you make a double bogey on a hole?',
        options: [
          'You lose 2 points from your total',
          'You earn 1 point',
          'You earn 0 points — no gain, no loss',
          'You are disqualified from that hole',
        ],
        correctAnswer: 'You earn 0 points — no gain, no loss',
        explanation:
          "In Stableford, double bogey or worse = 0 points. Bogey = 1 point, par = 2 points, birdie = 3 points, eagle = 4 points. A bad hole costs you nothing — pick up and move on.",
        memoryHook: 'Stableford: bad holes cost 0 points. Pick up and move on guilt-free.',
      },
    ],
  },

  {
    id: 'module-3',
    number: 3,
    title: 'The Rules',
    subtitle: 'Situations you will actually face in your first rounds.',
    color: '#712B13',
    lightColor: '#FAECE7',
    passingScore: 7,
    totalQuestions: 10,
    intro:
      "Golf has a thick rulebook, but beginners only need to know about 6 situations to handle 95% of what happens on the course. This module covers the rules you will actually encounter — penalties, relief situations, and the key 2019 rule changes every new golfer should know.",
    questions: [
      {
        id: 'm3-q1',
        n: 1,
        type: 'MC',
        tag: 'RULES',
        question:
          'Your tee shot looks like it might have gone out of bounds. What should you do BEFORE walking forward to search?',
        options: [
          "Walk forward immediately to check — don't waste a ball",
          'Hit a provisional ball, then go search',
          "Wait for a playing partner to confirm it's OB first",
          'Take a 1-stroke penalty and drop where you think it crossed',
        ],
        correctAnswer: 'Hit a provisional ball, then go search',
        explanation:
          "Always hit a provisional before searching when a ball might be lost or OB. If the original is found in bounds and playable, use it and the provisional doesn't count. If it's lost or OB, play the provisional with 1 penalty stroke.",
        memoryHook: 'Hit the provisional first. Walk second. Always.',
      },
      {
        id: 'm3-q2',
        n: 2,
        type: 'TF',
        tag: 'RULES',
        question:
          'True or False: Since the 2019 rules update, you can leave the flagstick in the hole when putting, and there is no penalty if your ball hits it.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'One of the biggest rule changes in 2019 removed the penalty for hitting the unattended flagstick while putting. The ball is holed. Leave the stick in or take it out — entirely your choice, no penalty either way.',
        memoryHook: '2019: flagstick in or out — no penalty. Ball is holed.',
      },
      {
        id: 'm3-q3',
        n: 3,
        type: 'MC',
        tag: 'RULES',
        question: 'Your ball lands on a paved cart path. What are you entitled to?',
        options: [
          'Nothing — play it as it lies',
          'Free relief: drop at nearest point of complete relief, no penalty',
          '1 penalty stroke drop anywhere within 2 club lengths',
          'Re-hit from the fairway with no penalty',
        ],
        correctAnswer: 'Free relief: drop at nearest point of complete relief, no penalty',
        explanation:
          "Cart paths are immovable obstructions. You receive free relief — zero penalty. Find the nearest point where the path no longer affects your stance or swing, then drop within one club length of that point, no nearer the hole.",
        memoryHook: 'Cart path = free relief. No penalty. Just drop.',
      },
      {
        id: 'm3-q4',
        n: 4,
        type: 'TF',
        tag: 'RULES',
        question:
          'True or False: In a sand bunker, you are allowed to let your club rest on the sand behind the ball before starting your swing.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'Grounding your club in a bunker — letting it rest on the sand before the stroke — is a 2-stroke penalty. Your club must hover until the moment of impact.',
        memoryHook: 'Bunker: club cannot touch sand before the stroke. 2-stroke penalty.',
      },
      {
        id: 'm3-q5',
        n: 5,
        type: 'MC',
        tag: 'RULES',
        question:
          'A ball goes into a pond marked with red stakes. What extra option do red stakes give you compared to yellow stakes?',
        options: [
          'Drop anywhere on the fairway for free',
          'Replay from the tee with no penalty',
          'Drop within 2 club lengths of where the ball crossed the hazard margin',
          'Drop at the nearest 150-yard marker',
        ],
        correctAnswer: 'Drop within 2 club lengths of where the ball crossed the hazard margin',
        explanation:
          'Red stakes mark a lateral penalty area. In addition to standard options, red stakes add the lateral drop: within 2 club lengths of where the ball crossed the boundary, no nearer the hole. All options cost 1 penalty stroke.',
        memoryHook: 'Red = more options. Red is the friendly one.',
      },
      {
        id: 'm3-q6',
        n: 6,
        type: 'MC',
        tag: 'RULES',
        question: 'How long do you have to search for a lost ball before it must be declared lost?',
        options: ['5 minutes', '4 minutes', '3 minutes', '2 minutes'],
        correctAnswer: '3 minutes',
        explanation:
          'Search time was reduced from 5 minutes to 3 minutes in the 2019 rules update to speed up play. After 3 minutes, the ball is officially lost.',
        memoryHook: '3 minutes to find it. Not 5. Changed in 2019.',
      },
      {
        id: 'm3-q7',
        n: 7,
        type: 'TF',
        tag: 'RULES',
        question:
          'True or False: You can declare any ball unplayable anywhere on the course (except in a penalty area) for a 1-stroke penalty.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "The unplayable lie rule is one of golf's most useful tools for beginners. You can declare any ball unplayable (except in a penalty area) for 1 stroke. Three options: replay from original spot, drop within 2 club lengths, or drop back on a line.",
        memoryHook: 'Unplayable lie = 1 stroke + a clean lie. Use it without shame.',
      },
      {
        id: 'm3-q8',
        n: 8,
        type: 'MC',
        tag: 'RULES',
        question:
          "You are on hole 3 and a playing partner notices you have 15 clubs in your bag (maximum is 14). You've already played 2 holes. What is your penalty in stroke play?",
        options: [
          'Disqualification',
          '1-stroke penalty added to your total',
          '2 penalty strokes per hole where the violation occurred, maximum 4 strokes total',
          'A warning for the first offense',
        ],
        correctAnswer: '2 penalty strokes per hole where the violation occurred, maximum 4 strokes total',
        explanation:
          'Carrying more than 14 clubs results in 2 penalty strokes for each hole where the violation existed, capped at a maximum of 4 strokes. You must immediately remove the extra club.',
        memoryHook: '14 clubs max. Count them before round 1. Every time.',
      },
      {
        id: 'm3-q9',
        n: 9,
        type: 'TF',
        tag: 'RULES',
        question:
          'True or False: When marking your ball on the green, you should place the coin in front of the ball (between the ball and the hole).',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'You always place your ball marker directly behind the ball — on the opposite side from the hole. Placing it in front would move it closer to the hole, which is not allowed.',
        memoryHook: 'Ball marker goes behind the ball. Always behind, never in front.',
      },
      {
        id: 'm3-q10',
        n: 10,
        type: 'MC',
        tag: 'RULES',
        question:
          'Your ball plugs into soft turf in the fairway after a high approach shot. What are you entitled to?',
        options: [
          'Nothing — play it as it lies',
          'Free relief: mark, lift, clean, and drop as close as possible without going nearer the hole',
          '1 penalty stroke drop within 2 club lengths',
          'Re-hit from the original spot for free',
        ],
        correctAnswer:
          'Free relief: mark, lift, clean, and drop as close as possible without going nearer the hole',
        explanation:
          'An embedded ball (plugged in its own pitch mark) in the general area gives you free relief. Mark the spot, lift and clean the ball, then drop as close as possible to the original spot, no nearer the hole.',
        memoryHook: 'Embedded ball in fairway/rough = free relief. Mark, lift, drop nearby.',
      },
    ],
  },

  {
    id: 'module-4',
    number: 4,
    title: 'Etiquette & Social',
    subtitle: 'How to be a welcome playing partner from round one.',
    color: '#3C3489',
    lightColor: '#EEEDFE',
    passingScore: 7,
    totalQuestions: 10,
    intro:
      "Golf etiquette isn't stuffy tradition — it's what makes the round enjoyable for everyone in your group. More beginners feel unwelcome because of etiquette than because of their score. Master this module and you'll be invited back regardless of how you're hitting the ball.",
    questions: [
      {
        id: 'm4-q1',
        n: 1,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          "Your playing partner has just started their pre-shot routine and is settling into address. You're mid-story to another player. What should you do?",
        options: [
          'Speak more quietly and wrap the story up quickly',
          'Step further away so your voice carries less',
          "Make eye contact to signal you're aware of them",
          "Stop talking completely and stand still until they've hit",
        ],
        correctAnswer: "Stop talking completely and stand still until they've hit",
        explanation:
          "Complete silence and stillness is the fundamental courtesy of golf. Not quieter — silent. Any sound or movement can break a player's concentration. Stop mid-sentence.",
        memoryHook: 'When someone swings: stop everything. Words included.',
      },
      {
        id: 'm4-q2',
        n: 2,
        type: 'TF',
        tag: 'ETIQUETTE',
        question:
          'True or False: Pace of play is judged against how far ahead the group in front of you is — not how close the group behind you is.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "Always measure your pace against the group ahead of you, not behind. If there's a full empty hole between your group and the group ahead, you're too slow.",
        memoryHook: 'Pace = gap to the group ahead. Not how patient the group behind is.',
      },
      {
        id: 'm4-q3',
        n: 3,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          "You've just played from a greenside bunker. The sand is heavily disturbed. What should you do before walking to your ball on the green?",
        options: [
          'Nothing — the groundskeeper rakes bunkers before each round',
          'Rake only the divot where you struck the ball',
          'Rake the entire disturbed area — footprints, divot, entry marks — before leaving',
          'Rake only if you took more than one shot from the bunker',
        ],
        correctAnswer: 'Rake the entire disturbed area — footprints, divot, entry marks — before leaving',
        explanation:
          'Rake every disturbed area — your footprints, the divot, and where you walked in. Leaving a bunker unraked means the next player might find their ball in your footprint with no relief.',
        memoryHook: 'Always rake the bunker. Every visit. The whole thing.',
      },
      {
        id: 'm4-q4',
        n: 4,
        type: 'TF',
        tag: 'ETIQUETTE',
        question:
          "'Ready golf' means you should wait for the player farthest from the hole to hit before playing your shot.",
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          "Ready golf is the opposite — whoever is ready plays next, regardless of distance from the hole. It saves 20-30 minutes per round. 'Farthest goes first' is for formal competition.",
        memoryHook: 'Ready golf: whoever is ready goes. Saves the whole round 20-30 minutes.',
      },
      {
        id: 'm4-q5',
        n: 5,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          "You've hit a wild shot that curves hard toward a group on the adjacent fairway who haven't seen it. What do you do immediately?",
        options: [
          "Shout 'Watch out!' as loud as you can",
          'Wave your arms to get their attention',
          "Shout 'Fore!' immediately and as loud as possible",
          'Wait to see if it will actually reach them',
        ],
        correctAnswer: "Shout 'Fore!' immediately and as loud as possible",
        explanation:
          "'Fore!' is the universal golf warning — every golfer knows that word means duck and cover. Shout it the second you think someone might be in the ball's path. Don't wait, don't calculate.",
        memoryHook: 'Fore! — shout it immediately. Every time. No hesitation.',
      },
      {
        id: 'm4-q6',
        n: 6,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          "Everyone in your group has just holed out on hole 9. Your partner pulls out the scorecard and starts filling in scores right there on the green. What's the problem?",
        options: [
          "Nothing — that's exactly when you fill in the scorecard",
          'Scorecards should only be filled in at the 19th hole',
          'The group behind is waiting to play — scores belong at the next tee',
          'Only the designated marker should fill in the card',
        ],
        correctAnswer: 'The group behind is waiting to play — scores belong at the next tee',
        explanation:
          'Walk off the green immediately after everyone holes out. Go to the next tee first, then fill in the scorecard while the first player prepares to tee off.',
        memoryHook: 'Scores at the next tee. Never on the green.',
      },
      {
        id: 'm4-q7',
        n: 7,
        type: 'TF',
        tag: 'ETIQUETTE',
        question:
          "True or False: On the green, you should avoid walking on the imaginary line between another player's ball and the hole.",
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "The line of putt — the path between a player's ball and the hole — should never be walked on. Footprints can affect how the ball rolls. Always step over putting lines, never through them.",
        memoryHook: 'Never walk on the line of putt. Step over it, always.',
      },
      {
        id: 'm4-q8',
        n: 8,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          'You hit an iron shot from the fairway and a chunk of turf (a divot) flies out. What should you do?',
        options: [
          'Nothing — the groundskeeper repairs divots',
          'Replace the turf chunk and press it down, or fill with sand mix if provided',
          'Only repair it if you are on a premium course',
          'Kick the turf chunk aside so it does not interfere with play',
        ],
        correctAnswer: 'Replace the turf chunk and press it down, or fill with sand mix if provided',
        explanation:
          'Always repair your divot — replace the turf and press it down, or fill with the sand/seed mixture provided on carts. It takes 3 seconds and marks you as a considerate golfer.',
        memoryHook: 'Hit, find the divot, fix it. Every single time. 3 seconds.',
      },
      {
        id: 'm4-q9',
        n: 9,
        type: 'TF',
        tag: 'ETIQUETTE',
        question:
          'True or False: Telling your playing partners you are new to golf before the round starts is always the right move.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "Telling your group you're new changes everything. Experienced golfers almost universally respond well. It removes performance anxiety, sets realistic expectations, and invites patience rather than silent judgment.",
        memoryHook: "Say you're new before you tee off. It's always the right move.",
      },
      {
        id: 'm4-q10',
        n: 10,
        type: 'MC',
        tag: 'ETIQUETTE',
        question:
          "Your group is falling behind — there's a full empty hole between you and the group ahead, and the group behind keeps arriving before you're ready. What should you do?",
        options: [
          'Assume the group ahead is playing too fast',
          'Ask the group behind to be more patient',
          'Speed up your group or wave the group behind through',
          'Keep your current pace — everyone plays at their own speed',
        ],
        correctAnswer: 'Speed up your group or wave the group behind through',
        explanation:
          'A gap ahead of you means your group is behind the pace of the field. Pick up the pace to close the gap, or wave the group behind through.',
        memoryHook: 'Gap ahead = you are slow. Speed up or wave them through.',
      },
    ],
  },

  {
    id: 'module-5',
    number: 5,
    title: 'The Swing & Clubs',
    subtitle: 'What is in the bag and how the ball actually flies.',
    color: '#633806',
    lightColor: '#FAEEDA',
    passingScore: 7,
    totalQuestions: 10,
    intro:
      "You don't need to be a swing expert to enjoy golf — but understanding the basics of what each club does and why the ball flies the way it does gives you an enormous advantage. This module covers the 14 clubs, ball flight fundamentals, and the key swing concepts that explain most of what happens on the course.",
    questions: [
      {
        id: 'm5-q1',
        n: 1,
        type: 'MC',
        tag: 'EQUIPMENT',
        question: 'How many clubs are you allowed to carry in your bag during a round of golf?',
        options: ['12', '14', '16', 'As many as you like'],
        correctAnswer: '14',
        explanation:
          'The maximum is 14 clubs. Carrying more results in a 2-stroke penalty per hole where the violation occurred, capped at 4 strokes.',
        memoryHook: '14 clubs max. Count before you tee off.',
      },
      {
        id: 'm5-q2',
        n: 2,
        type: 'TF',
        tag: 'EQUIPMENT',
        question:
          'True or False: A higher club number (e.g., a 9-iron vs. a 5-iron) means more loft, a higher ball flight, and a shorter distance.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'Higher club number = more loft = higher, shorter shots. A 9-iron has roughly 41-44 degrees of loft and might go 110-130 yards. A 5-iron has roughly 27 degrees and might go 160-180 yards.',
        memoryHook: 'Higher number = more loft = shorter, higher shot. Let the loft do the work.',
      },
      {
        id: 'm5-q3',
        n: 3,
        type: 'MC',
        tag: 'EQUIPMENT',
        question:
          'A beginner finds long irons (3-iron, 4-iron) very difficult to hit. What club type is specifically designed to replace them?',
        options: ['A fairway wood', 'A hybrid', 'A lob wedge', 'A gap wedge'],
        correctAnswer: 'A hybrid',
        explanation:
          'Hybrids combine a wood-style rounded head with an iron-length shaft — much easier to hit than long irons. Most teaching pros recommend replacing your 3 and 4 irons with hybrids immediately.',
        memoryHook: "Can't hit your 3 or 4 iron? Replace them with hybrids. Problem solved.",
      },
      {
        id: 'm5-q4',
        n: 4,
        type: 'TF',
        tag: 'SWING',
        question:
          'True or False: A slice curves sharply from left to right (for a right-handed golfer) and is the most common ball flight problem for beginners.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "The slice is the most common beginner miss. It's caused by an open clubface relative to an outside-in swing path. It's very fixable, usually by addressing swing path.",
        memoryHook: 'Slice = curves right, loses distance. Most common beginner miss. Very fixable.',
      },
      {
        id: 'm5-q5',
        n: 5,
        type: 'MC',
        tag: 'SWING',
        question:
          'What is the single most important factor that determines which direction the ball starts when it leaves the clubface?',
        options: [
          'The speed of the downswing',
          'The direction the clubface is pointing at impact',
          'The angle of the backswing',
          'Whether you are hitting uphill or downhill',
        ],
        correctAnswer: 'The direction the clubface is pointing at impact',
        explanation:
          'The clubface direction at impact accounts for roughly 75-85% of the initial ball direction. A square face = straight start. Open face = starts right. Closed face = starts left.',
        memoryHook: 'Face direction = where it starts. Path = how it curves. Face is king.',
      },
      {
        id: 'm5-q6',
        n: 6,
        type: 'MC',
        tag: 'EQUIPMENT',
        question: 'Which club is used exclusively on the putting green to roll the ball toward the hole?',
        options: ['The sand wedge', 'The gap wedge', 'The putter', 'The lob wedge'],
        correctAnswer: 'The putter',
        explanation:
          "The putter is the flat-faced club used to roll the ball along the green. It's the most-used club in any bag — putting accounts for roughly 40% of all strokes in a round.",
        memoryHook: 'Putter = most used club in the bag. 40% of all strokes. Practice it.',
      },
      {
        id: 'm5-q7',
        n: 7,
        type: 'TF',
        tag: 'SWING',
        question:
          'True or False: A draw (right-to-left ball flight for a right-hander) generally produces more distance than a straight shot or fade.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'A draw typically adds 5-10 yards compared to a straight shot or fade because the slightly closed face reduces backspin and produces a lower, more penetrating ball flight.',
        memoryHook: 'Draw = more distance. Fade = more control and softer landing. Both are legitimate.',
      },
      {
        id: 'm5-q8',
        n: 8,
        type: 'MC',
        tag: 'SWING',
        question:
          "A beginner's shot hits the ground well before the ball, sending a large chunk of turf flying but barely moving the ball. What is this shot called?",
        options: ['A thin', 'A topped shot', 'A fat shot (chunk)', 'A shank'],
        correctAnswer: 'A fat shot (chunk)',
        explanation:
          "Hitting fat (or chunking) means the club strikes the ground before the ball. The club digs in, the ball goes short, and the impact feels heavy. Caused by the swing's lowest point being too far behind the ball.",
        memoryHook: 'Fat = hit ground first. Thin = hit ball at equator. Both are misses — opposite ends.',
      },
      {
        id: 'm5-q9',
        n: 9,
        type: 'TF',
        tag: 'SWING',
        question:
          'True or False: A consistent pre-shot routine (same sequence of actions before every shot) is mainly for professionals — beginners do not need one.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'A pre-shot routine is actually more important for beginners than anyone. It builds consistency, reduces anxiety, and signals your brain to commit to the shot. Keep it under 30 seconds.',
        memoryHook: 'Pre-shot routine = consistency + calm. Same routine, same mental state, every shot.',
      },
      {
        id: 'm5-q10',
        n: 10,
        type: 'MC',
        tag: 'EQUIPMENT',
        question: 'What are the four main types of wedges, roughly in order from lowest to highest loft?',
        options: [
          'Pitching, gap, sand, lob',
          'Sand, gap, pitching, lob',
          'Lob, sand, gap, pitching',
          'Gap, pitching, lob, sand',
        ],
        correctAnswer: 'Pitching, gap, sand, lob',
        explanation:
          'The wedge family from lowest to highest loft: Pitching wedge (~46°), Gap wedge (~50°), Sand wedge (~56°), Lob wedge (~60°). Beginners only need a pitching wedge and sand wedge to start.',
        memoryHook: 'PW, GW, SW, LW — lowest to highest loft. Start with just PW and SW.',
      },
    ],
  },
];

export const getModuleById = (id: string): Module | undefined =>
  modules.find((m) => m.id === id);

export const getQuestionById = (moduleId: string, questionId: string) =>
  modules.find((m) => m.id === moduleId)?.questions.find((q) => q.id === questionId);

export const getTotalQuestions = (): number =>
  modules.reduce((sum, m) => sum + m.questions.length, 0);
