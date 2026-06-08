<?php

namespace Database\Seeders;

use App\Models\Career;
use App\Models\CareerCategory;
use App\Models\OrientationTest;
use App\Models\TestQuestion;
use Illuminate\Database\Seeder;

class CareerAndTestSeeder extends Seeder
{
    public function run(): void
    {
        // ── Career Categories ──────────────────────────────────────────────
        $categories = [
            ['name' => 'Technology & IT',        'description' => 'Software, data, cybersecurity, and digital innovation'],
            ['name' => 'Engineering',             'description' => 'Civil, mechanical, electrical, and industrial engineering'],
            ['name' => 'Business & Finance',      'description' => 'Management, accounting, marketing, and entrepreneurship'],
            ['name' => 'Healthcare & Medicine',   'description' => 'Medical professions, nursing, pharmacy, and public health'],
            ['name' => 'Education & Research',    'description' => 'Teaching, academic research, and training'],
            ['name' => 'Law & Social Sciences',   'description' => 'Law, sociology, psychology, and political science'],
            ['name' => 'Arts & Creative Design',  'description' => 'Graphic design, architecture, media, and performing arts'],
            ['name' => 'Science & Environment',   'description' => 'Biology, chemistry, environmental science, and geology'],
        ];

        foreach ($categories as $cat) {
            CareerCategory::firstOrCreate(['name' => $cat['name']], ['description' => $cat['description']]);
        }

        $tech     = CareerCategory::where('name', 'Technology & IT')->first();
        $eng      = CareerCategory::where('name', 'Engineering')->first();
        $biz      = CareerCategory::where('name', 'Business & Finance')->first();
        $health   = CareerCategory::where('name', 'Healthcare & Medicine')->first();
        $edu      = CareerCategory::where('name', 'Education & Research')->first();
        $law      = CareerCategory::where('name', 'Law & Social Sciences')->first();
        $arts     = CareerCategory::where('name', 'Arts & Creative Design')->first();
        $science  = CareerCategory::where('name', 'Science & Environment')->first();

        // ── Careers ────────────────────────────────────────────────────────
        $careers = [
            // Technology
            ['category_id' => $tech->id, 'title' => 'Software Engineer', 'description' => 'Design, develop, and maintain software applications and systems. High demand across all industries.', 'salary_range' => '8,000–25,000 MAD/month', 'required_skills' => ['Programming', 'Problem Solving', 'Algorithms', 'Teamwork'], 'future_scope' => 'Excellent growth prospects with remote work opportunities globally.'],
            ['category_id' => $tech->id, 'title' => 'Data Scientist', 'description' => 'Analyze complex datasets, build machine learning models, and extract insights for decision-making.', 'salary_range' => '10,000–30,000 MAD/month', 'required_skills' => ['Statistics', 'Python', 'Machine Learning', 'Data Visualization'], 'future_scope' => 'One of the fastest-growing fields with applications in every sector.'],
            ['category_id' => $tech->id, 'title' => 'Cybersecurity Analyst', 'description' => 'Protect systems and networks from cyber threats, vulnerabilities, and attacks.', 'salary_range' => '9,000–22,000 MAD/month', 'required_skills' => ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Linux'], 'future_scope' => 'Critical role in every organization as digital threats increase.'],
            ['category_id' => $tech->id, 'title' => 'UX/UI Designer', 'description' => 'Create intuitive and engaging user experiences for digital products and applications.', 'salary_range' => '6,000–18,000 MAD/month', 'required_skills' => ['Creativity', 'Figma', 'User Research', 'Prototyping'], 'future_scope' => 'Growing demand as digital products proliferate across markets.'],
            ['category_id' => $tech->id, 'title' => 'AI/ML Engineer', 'description' => 'Build and deploy artificial intelligence and machine learning systems for real-world applications.', 'salary_range' => '12,000–35,000 MAD/month', 'required_skills' => ['Deep Learning', 'Python', 'TensorFlow', 'Mathematics'], 'future_scope' => 'Exceptional demand globally with transformative impact.'],
            // Engineering
            ['category_id' => $eng->id, 'title' => 'Civil Engineer', 'description' => 'Design and oversee construction of infrastructure including roads, bridges, and buildings.', 'salary_range' => '7,000–20,000 MAD/month', 'required_skills' => ['Mathematics', 'AutoCAD', 'Project Management', 'Physics'], 'future_scope' => 'Stable demand driven by Morocco infrastructure projects.'],
            ['category_id' => $eng->id, 'title' => 'Electrical Engineer', 'description' => 'Design and develop electrical systems, from power distribution to electronic components.', 'salary_range' => '7,500–22,000 MAD/month', 'required_skills' => ['Circuit Design', 'Mathematics', 'Physics', 'CAD'], 'future_scope' => 'Key role in renewable energy transition and smart city projects.'],
            ['category_id' => $eng->id, 'title' => 'Mechanical Engineer', 'description' => 'Design and analyze mechanical systems, machines, and manufacturing processes.', 'salary_range' => '7,000–20,000 MAD/month', 'required_skills' => ['CAD/CAM', 'Physics', 'Thermodynamics', 'Materials Science'], 'future_scope' => 'Versatile field with applications in automotive, aerospace, and energy sectors.'],
            // Business
            ['category_id' => $biz->id, 'title' => 'Financial Analyst', 'description' => 'Evaluate financial data, manage investments, and provide strategic business recommendations.', 'salary_range' => '6,000–18,000 MAD/month', 'required_skills' => ['Financial Modeling', 'Excel', 'Analytical Thinking', 'Economics'], 'future_scope' => 'Strong demand in banking, insurance, and corporate finance.'],
            ['category_id' => $biz->id, 'title' => 'Marketing Manager', 'description' => 'Develop and execute marketing strategies to grow brand awareness and revenue.', 'salary_range' => '7,000–22,000 MAD/month', 'required_skills' => ['Digital Marketing', 'Analytics', 'Communication', 'Creativity'], 'future_scope' => 'Digital transformation creates new opportunities in content and social media marketing.'],
            ['category_id' => $biz->id, 'title' => 'Entrepreneur / Business Creator', 'description' => 'Start and grow your own business, creating value and employment.', 'salary_range' => 'Variable — unlimited potential', 'required_skills' => ['Leadership', 'Risk Management', 'Innovation', 'Networking'], 'future_scope' => 'Growing ecosystem in Morocco with incubators and startup support.'],
            // Healthcare
            ['category_id' => $health->id, 'title' => 'Medical Doctor', 'description' => 'Diagnose, treat, and prevent illness and injury in patients across all age groups.', 'salary_range' => '12,000–50,000 MAD/month', 'required_skills' => ['Biology', 'Chemistry', 'Empathy', 'Critical Thinking'], 'future_scope' => 'Perennial demand with prestige and significant societal impact.'],
            ['category_id' => $health->id, 'title' => 'Pharmacist', 'description' => 'Dispense medications, counsel patients, and ensure drug safety and efficacy.', 'salary_range' => '8,000–20,000 MAD/month', 'required_skills' => ['Chemistry', 'Biology', 'Attention to Detail', 'Communication'], 'future_scope' => 'Stable demand with opportunities in clinical research and pharmaceutical companies.'],
            ['category_id' => $health->id, 'title' => 'Psychologist', 'description' => 'Assess, diagnose, and treat mental health disorders through therapy and counseling.', 'salary_range' => '7,000–18,000 MAD/month', 'required_skills' => ['Empathy', 'Active Listening', 'Psychology', 'Research'], 'future_scope' => 'Growing awareness of mental health creates increasing demand.'],
            // Education
            ['category_id' => $edu->id, 'title' => 'University Professor', 'description' => 'Teach, research, and contribute to knowledge advancement at higher education institutions.', 'salary_range' => '8,000–25,000 MAD/month', 'required_skills' => ['Subject Expertise', 'Research', 'Communication', 'Critical Thinking'], 'future_scope' => 'Respected career with academic freedom and research opportunities.'],
            ['category_id' => $edu->id, 'title' => 'Educational Technology Specialist', 'description' => 'Design and implement technology-based learning solutions and digital educational content.', 'salary_range' => '6,000–15,000 MAD/month', 'required_skills' => ['E-learning', 'Instructional Design', 'Technology', 'Creativity'], 'future_scope' => 'Growing field driven by digital transformation of education.'],
            // Law
            ['category_id' => $law->id, 'title' => 'Lawyer', 'description' => 'Represent and advise clients in legal matters, from contracts to litigation.', 'salary_range' => '8,000–40,000 MAD/month', 'required_skills' => ['Legal Research', 'Communication', 'Logical Thinking', 'Negotiation'], 'future_scope' => 'Stable demand with specializations in corporate, criminal, and international law.'],
            ['category_id' => $law->id, 'title' => 'Sociologist / Social Worker', 'description' => 'Study and address social issues, helping communities and vulnerable populations.', 'salary_range' => '4,000–12,000 MAD/month', 'required_skills' => ['Empathy', 'Research', 'Communication', 'Problem Solving'], 'future_scope' => 'Growing importance in urban development and social policy.'],
            // Arts
            ['category_id' => $arts->id, 'title' => 'Architect', 'description' => 'Design functional and aesthetic buildings and spaces that meet human needs.', 'salary_range' => '7,000–25,000 MAD/month', 'required_skills' => ['Design', 'AutoCAD', 'Creativity', 'Mathematics'], 'future_scope' => 'Steady demand with opportunities in sustainable and smart building design.'],
            ['category_id' => $arts->id, 'title' => 'Graphic Designer / Visual Artist', 'description' => 'Create visual content for brands, media, advertising, and digital platforms.', 'salary_range' => '4,000–15,000 MAD/month', 'required_skills' => ['Creativity', 'Adobe Suite', 'Color Theory', 'Typography'], 'future_scope' => 'Freelance opportunities and digital economy growth create diverse income streams.'],
            // Science
            ['category_id' => $science->id, 'title' => 'Environmental Engineer', 'description' => 'Develop solutions to protect the environment and manage natural resources sustainably.', 'salary_range' => '7,000–18,000 MAD/month', 'required_skills' => ['Chemistry', 'Biology', 'Environmental Law', 'Data Analysis'], 'future_scope' => 'Critical role in addressing climate change and sustainability goals.'],
            ['category_id' => $science->id, 'title' => 'Research Scientist', 'description' => 'Conduct experiments and develop new knowledge in fields like biology, chemistry, or physics.', 'salary_range' => '6,000–20,000 MAD/month', 'required_skills' => ['Critical Thinking', 'Research Methods', 'Laboratory Skills', 'Mathematics'], 'future_scope' => 'Fundamental to innovation and technological advancement.'],
        ];

        foreach ($careers as $career) {
            Career::firstOrCreate(
                ['title' => $career['title']],
                $career
            );
        }

        // ── Orientation Test ───────────────────────────────────────────────
        $test = OrientationTest::firstOrCreate(
            ['title' => 'Test d\'Orientation Générale'],
            [
                'description' => 'Évaluez vos intérêts, aptitudes et valeurs professionnelles pour découvrir les filières qui correspondent le mieux à votre profil.',
                'category'    => 'general',
                'duration'    => 20,
                'status'      => 'active',
            ]
        );

        if ($test->questions()->count() === 0) {
            $questions = [
                [
                    'question' => 'Quel type d\'activité vous attire le plus ?',
                    'type'     => 'single_choice',
                    'options'  => ['Construire et créer des objets ou systèmes', 'Analyser des données et résoudre des problèmes', 'Aider et accompagner les autres', 'Concevoir et exprimer des idées créatives'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Dans quel environnement de travail préférez-vous évoluer ?',
                    'type'     => 'single_choice',
                    'options'  => ['Bureau ou laboratoire', 'Terrain ou plein air', 'Hôpital ou clinique', 'Studio créatif ou agence'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Quelle matière vous passionnait le plus au lycée ?',
                    'type'     => 'single_choice',
                    'options'  => ['Mathématiques et physique', 'Sciences naturelles et biologie', 'Langues et lettres', 'Histoire, économie ou sciences sociales'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Comment préférez-vous travailler ?',
                    'type'     => 'single_choice',
                    'options'  => ['Seul(e), avec autonomie et concentration', 'En petite équipe soudée', 'En gérant et coordonnant une équipe', 'En contact constant avec le public'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Qu\'est-ce qui compte le plus pour vous dans une carrière ?',
                    'type'     => 'single_choice',
                    'options'  => ['Salaire élevé et stabilité financière', 'Équilibre vie pro/perso', 'Avoir un impact positif sur la société', 'Liberté créative et innovation'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Face à un problème difficile, quelle est votre première réaction ?',
                    'type'     => 'single_choice',
                    'options'  => ['Analyser les données et chercher une solution logique', 'Demander l\'avis des autres et collaborer', 'Faire confiance à mon intuition et expérimenter', 'Chercher une approche créative et originale'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Quel secteur vous attire le plus ?',
                    'type'     => 'single_choice',
                    'options'  => ['Technologie et innovation numérique', 'Santé et sciences médicales', 'Commerce, finance et entrepreneuriat', 'Art, culture et communication'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Quelles compétences considérez-vous comme vos points forts ?',
                    'type'     => 'single_choice',
                    'options'  => ['Compétences techniques et analytiques', 'Compétences relationnelles et empathie', 'Leadership et prise de décision', 'Créativité et sens artistique'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Quel niveau d\'études envisagez-vous ?',
                    'type'     => 'single_choice',
                    'options'  => ['Bac+3 (Licence)', 'Bac+5 (Master ou Grande École)', 'Bac+8 (Doctorat ou médecine)', 'Formation professionnelle ou technique'],
                    'points'   => 10,
                ],
                [
                    'question' => 'Décrivez brièvement vos ambitions professionnelles (optionnel)',
                    'type'     => 'text',
                    'options'  => null,
                    'points'   => 5,
                ],
            ];

            foreach ($questions as $q) {
                $test->questions()->create($q);
            }
        }
    }
}
