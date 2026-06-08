<?php

namespace Database\Seeders;

use App\Models\OrientationTest;
use App\Models\TestQuestion;
use Illuminate\Database\Seeder;

class OrientationTestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [

            // ─────────────────────────────────────────────────────────────────
            // TEST 1 — Aptitude & Interest Assessment (15 questions)
            // ─────────────────────────────────────────────────────────────────
            [
                'title'       => 'Aptitude & Interest Assessment',
                'description' => 'Discover your natural strengths, cognitive aptitudes, and work preferences to identify careers that align with your abilities.',
                'category'    => 'aptitude',
                'duration'    => 15,
                'status'      => 'active',
                'questions'   => [
                    [
                        'question' => 'Which type of activity do you enjoy the most?',
                        'type'     => 'single_choice',
                        'options'  => ['Building and creating things with my hands', 'Analyzing data and solving complex problems', 'Helping, teaching, or caring for others', 'Creating art, music, or writing'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'In school, which subject comes most naturally to you?',
                        'type'     => 'single_choice',
                        'options'  => ['Mathematics and logic', 'Sciences (physics, chemistry, biology)', 'Languages and literature', 'Social sciences and humanities'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you prefer to work?',
                        'type'     => 'single_choice',
                        'options'  => ['Independently with full autonomy', 'In a small focused team', 'Leading and guiding a group', 'Collaborating with many diverse people'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What matters most to you in a future career?',
                        'type'     => 'single_choice',
                        'options'  => ['Financial stability and high salary', 'Work-life balance and flexibility', 'Making a positive impact on society', 'Creative freedom and self-expression'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'When faced with a difficult problem, what is your instinct?',
                        'type'     => 'single_choice',
                        'options'  => ['Research it systematically and gather data', 'Brainstorm creative solutions and experiment', 'Discuss it with others and seek advice', 'Break it into steps and work methodically'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which work environment appeals to you most?',
                        'type'     => 'single_choice',
                        'options'  => ['Office or corporate environment', 'Laboratory or research facility', 'Outdoors or fieldwork', 'Remote or digital workspace'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How would you describe your relationship with technology?',
                        'type'     => 'single_choice',
                        'options'  => ['I love technology and enjoy learning new tools', 'I use technology practically to achieve goals', 'I prefer working with people over machines', 'I appreciate technology but prefer hands-on work'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What kind of challenges motivate you the most?',
                        'type'     => 'single_choice',
                        'options'  => ['Technical challenges that require deep expertise', 'Social challenges involving human relationships', 'Business challenges around growth and strategy', 'Creative challenges that push artistic boundaries'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you prefer to learn new things?',
                        'type'     => 'single_choice',
                        'options'  => ['Structured courses and formal education', 'Hands-on practice and experimentation', 'Reading books and independent research', 'Learning from mentors and through discussion'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'In 10 years, how do you picture your ideal workday?',
                        'type'     => 'single_choice',
                        'options'  => ['Solving technical problems and building systems', 'Meeting clients and building relationships', 'Conducting experiments or analyzing research data', 'Creating content, designs, or artistic work'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which describes your decision-making style?',
                        'type'     => 'single_choice',
                        'options'  => ['Data-driven — I rely on facts and numbers', 'Intuition-driven — I trust my gut feeling', 'People-driven — I consider how others are affected', 'Process-driven — I follow established frameworks'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about repetitive, routine tasks?',
                        'type'     => 'single_choice',
                        'options'  => ['I find comfort in routine and structure', 'I tolerate routine if the work is meaningful', 'I prefer variety and new challenges daily', 'I actively seek roles with constant change'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What role does money play in your career choice?',
                        'type'     => 'single_choice',
                        'options'  => ['It is my primary motivator', 'It is important but not the only factor', 'It matters less than passion and purpose', 'I prioritize stability over high income'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about leading or managing others?',
                        'type'     => 'single_choice',
                        'options'  => ['I naturally take charge and enjoy leadership', 'I lead when needed but prefer collaboration', 'I prefer to contribute as an individual', 'I actively avoid management responsibilities'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which of these would you most enjoy spending a full day doing?',
                        'type'     => 'single_choice',
                        'options'  => ['Writing code or designing a digital product', 'Diagnosing and treating a patient', 'Planning and executing a business strategy', 'Drawing, filming, or producing creative work'],
                        'points'   => 10,
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // TEST 2 — Values & Personality Profile (15 questions)
            // ─────────────────────────────────────────────────────────────────
            [
                'title'       => 'Values & Personality Profile',
                'description' => 'Understand your core values, personality traits, and motivational drivers to find your ideal career fit.',
                'category'    => 'personality',
                'duration'    => 15,
                'status'      => 'active',
                'questions'   => [
                    [
                        'question' => 'Which value is most important to you in life?',
                        'type'     => 'single_choice',
                        'options'  => ['Achievement and excellence', 'Security and stability', 'Adventure and exploration', 'Service and contribution to others'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you typically handle stress?',
                        'type'     => 'single_choice',
                        'options'  => ['Stay calm and think logically', 'Seek support from friends or family', 'Channel it into creative work', 'Exercise and take physical action'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which statement best describes you?',
                        'type'     => 'single_choice',
                        'options'  => ['I am detail-oriented and precise', 'I am a big-picture thinker and strategist', 'I am empathetic and people-focused', 'I am creative and always thinking of new ideas'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about taking risks?',
                        'type'     => 'single_choice',
                        'options'  => ['I avoid risks and prefer certainty', 'I take calculated risks with careful planning', 'I embrace risks as opportunities for growth', 'I prefer small risks within a safe framework'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'When working on a group project, you naturally take on which role?',
                        'type'     => 'single_choice',
                        'options'  => ['The organizer who structures everything', 'The idea generator who proposes solutions', 'The peacemaker who ensures harmony', 'The executor who gets things done'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which describes your ideal impact on the world?',
                        'type'     => 'single_choice',
                        'options'  => ['Build innovative technology that changes how people live', 'Heal people and improve public health', 'Create economic opportunity and employment', 'Advance knowledge through science and research'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about long-term study (5+ years at university)?',
                        'type'     => 'single_choice',
                        'options'  => ['Excited – I love learning and academic environments', 'Open – if it leads to a rewarding career', 'Neutral – I prefer shorter, more practical programs', 'Reluctant – I prefer entering the workforce sooner'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What do people most often ask for your help with?',
                        'type'     => 'single_choice',
                        'options'  => ['Technical problems (computers, devices, math)', 'Personal advice and emotional support', 'Creative projects (design, writing, ideas)', 'Planning and organizing tasks or events'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which achievement would make you most proud?',
                        'type'     => 'single_choice',
                        'options'  => ['Building a successful product or company', 'Publishing research that advances human knowledge', 'Helping thousands of people improve their lives', 'Creating art or work that inspires others'],
                        'points'   => 10,
                    ],
                    [
                        'question' => "How do you feel about Morocco's growing tech and business sectors?",
                        'type'     => 'single_choice',
                        'options'  => ['Very excited – I want to be part of this growth', 'Interested in opportunities it creates locally', 'Prefer to work internationally and abroad', 'Focused on traditional sectors like medicine or law'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you define personal success?',
                        'type'     => 'single_choice',
                        'options'  => ['Wealth and financial independence', 'Recognition and professional status', 'Personal fulfillment and happiness', 'Positive contribution to my community'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about working across different cultures or internationally?',
                        'type'     => 'single_choice',
                        'options'  => ['I love it — diversity energizes me', 'I am open to it with the right preparation', 'I prefer a familiar local environment', 'It depends on the opportunity'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What is your relationship with authority and hierarchy at work?',
                        'type'     => 'single_choice',
                        'options'  => ['I respect structure and follow it well', 'I work within it but prefer flat teams', 'I question it and prefer open dialogue', 'I want to be the one setting the direction'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which of these describes your social energy?',
                        'type'     => 'single_choice',
                        'options'  => ['Extrovert — energized by people and interaction', 'Ambivert — depends on the situation', 'Introvert — I recharge through alone time', 'Highly social only in professional settings'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'When you imagine yourself at 35, what does your life look like?',
                        'type'     => 'single_choice',
                        'options'  => ['Running my own business or startup', 'Leading a team in a major company', 'Practicing a respected profession (doctor, lawyer, engineer)', 'Working freely as a creator or consultant'],
                        'points'   => 10,
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // TEST 3 — Skills & Academic Strength Test (15 questions)
            // ─────────────────────────────────────────────────────────────────
            [
                'title'       => 'Skills & Academic Strength Test',
                'description' => 'Assess your academic strengths, practical skills, and learning style to match you with programs that suit your abilities.',
                'category'    => 'skills',
                'duration'    => 15,
                'status'      => 'active',
                'questions'   => [
                    [
                        'question' => 'How confident are you in mathematics and quantitative reasoning?',
                        'type'     => 'single_choice',
                        'options'  => ['Very confident – it is one of my strongest subjects', 'Moderately confident – I can handle it when needed', 'Somewhat weak – I struggle but manage', 'Not confident – I prefer non-mathematical fields'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How would you rate your writing and communication skills?',
                        'type'     => 'single_choice',
                        'options'  => ['Excellent – I write clearly and persuasively', 'Good – I communicate effectively in most situations', 'Average – I can get my point across', 'Developing – I find writing challenging'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you approach scientific experiments or laboratory work?',
                        'type'     => 'single_choice',
                        'options'  => ['I love it – hands-on experimentation excites me', 'I enjoy it when it connects to real applications', 'It is okay but not my favorite type of work', 'I prefer theoretical study over lab work'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'What is your level of experience with computers and programming?',
                        'type'     => 'single_choice',
                        'options'  => ['Advanced – I code and build projects regularly', 'Intermediate – I understand basics and can learn quickly', 'Beginner – I use computers but do not program', 'Minimal – I prefer non-digital work'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you perform under pressure and tight deadlines?',
                        'type'     => 'single_choice',
                        'options'  => ['I thrive under pressure and produce my best work', 'I manage well with good time management', 'I sometimes struggle but adapt over time', 'I prefer working without time pressure'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How comfortable are you with public speaking and presentations?',
                        'type'     => 'single_choice',
                        'options'  => ['Very comfortable – I enjoy presenting to groups', 'Comfortable with preparation', 'Nervous but I manage', 'I strongly prefer behind-the-scenes work'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you handle ambiguous or open-ended problems with no clear answer?',
                        'type'     => 'single_choice',
                        'options'  => ['I enjoy the freedom to explore and discover', 'I create structure to navigate ambiguity', 'I prefer more defined problems with clear solutions', 'I find them frustrating without guidance'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which best describes your approach to creative tasks?',
                        'type'     => 'single_choice',
                        'options'  => ['Highly creative – I constantly generate original ideas', 'Creative when inspired or challenged', 'Practical – I prefer refining existing ideas', 'Analytical – creativity is not my primary strength'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How well do you work with large amounts of data or information?',
                        'type'     => 'single_choice',
                        'options'  => ['Very well – I enjoy finding patterns in data', 'Well – I can organize and interpret data effectively', 'Average – I manage when necessary', 'I prefer qualitative work over data analysis'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How strong are your foreign language skills (e.g., French, English, Spanish)?',
                        'type'     => 'single_choice',
                        'options'  => ['Fluent in 2+ languages beyond Arabic and Darija', 'Proficient in one foreign language', 'Basic level in one foreign language', 'I primarily communicate in Arabic or Darija'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you rate your ability to research and self-learn independently?',
                        'type'     => 'single_choice',
                        'options'  => ['Excellent – I regularly learn new things on my own', 'Good – I can research effectively when motivated', 'Average – I prefer guided learning environments', 'I rely heavily on teachers or structured programs'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you feel about working with numbers in a professional context?',
                        'type'     => 'single_choice',
                        'options'  => ['I enjoy financial modeling, budgeting, or accounting', 'I can work with numbers but prefer other tasks', 'I avoid number-heavy work when possible', 'Numbers are a major weakness for me'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How would you describe your organizational and planning skills?',
                        'type'     => 'single_choice',
                        'options'  => ['Highly organized – I plan everything meticulously', 'Generally organized – I meet deadlines reliably', 'Somewhat disorganized – I improve under structure', 'I struggle with long-term planning'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'How do you approach learning a completely new subject from scratch?',
                        'type'     => 'single_choice',
                        'options'  => ['I dive in immediately and learn as I go', 'I create a structured learning plan first', 'I look for a course or mentor to guide me', 'I find it challenging and need a lot of support'],
                        'points'   => 10,
                    ],
                    [
                        'question' => 'Which academic track describes your background or interest best?',
                        'type'     => 'single_choice',
                        'options'  => ['Sciences (Maths, Physics, Chemistry, Biology)', 'Technology and Engineering (Informatique, Sciences de l\'ingénieur)', 'Economics and Management (Sciences économiques)', 'Literature and Humanities (Lettres, Sciences humaines)'],
                        'points'   => 10,
                    ],
                ],
            ],
        ];

        foreach ($tests as $testData) {
            $questions = $testData['questions'];
            unset($testData['questions']);

            $test = OrientationTest::firstOrCreate(
                ['title' => $testData['title']],
                $testData
            );

            // Delete old questions and re-seed to exactly 15
            if ($test->questions()->count() !== 15) {
                $test->questions()->delete();
                foreach ($questions as $questionData) {
                    TestQuestion::create(array_merge($questionData, ['test_id' => $test->id]));
                }
            }
        }

        $this->command->info(
            '✅ OrientationTestSeeder: ' . OrientationTest::count() . ' tests, ' .
            \App\Models\TestQuestion::count() . ' questions seeded.'
        );
    }
}
