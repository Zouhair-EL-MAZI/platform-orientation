<?php

namespace Database\Seeders;

use App\Models\Career;
use App\Models\CareerCategory;
use Illuminate\Database\Seeder;

class CareerSeeder extends Seeder
{
    public function run(): void
    {
        $data = [

            // ─────────────────────────────────────────────────────────────────
            // 1. Technology & IT
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Technology & IT', 'description' => 'Software, data, cybersecurity, AI and digital systems'],
                'careers'  => [
                    [
                        'title'               => 'Software Engineer',
                        'description'         => 'Design, develop, and maintain software applications and systems. Work in agile teams to deliver scalable digital products.',
                        'salary_range'        => '8,000 – 25,000 MAD/month',
                        'required_skills'     => ['JavaScript', 'Python', 'Git', 'Algorithms', 'REST APIs'],
                        'future_scope'        => 'Very high demand. Morocco\'s tech sector is growing rapidly with offshore development centers in Casablanca and Rabat.',
                        'moroccan_context'    => 'Morocco hosts major tech companies like Capgemini, CGI, and IBM. The Digital Morocco 2030 strategy creates thousands of tech jobs annually.',
                        'study_paths'         => ['Classes Préparatoires → École d\'ingénieurs (ENSIAS, ENSA)', 'FST / FSTS (Licence + Master)', 'École privée (EMSI, ISGA, HEM)', 'BTS Informatique'],
                        'recommended_schools' => ['ENSIAS Rabat', 'ENSA Marrakech', 'EMSI', 'UM6P', 'ISGA'],
                        'demand_level'        => 'Very High',
                    ],
                    [
                        'title'               => 'Data Scientist',
                        'description'         => 'Analyze complex datasets, build predictive models, and extract insights that drive strategic decisions across business domains.',
                        'salary_range'        => '10,000 – 35,000 MAD/month',
                        'required_skills'     => ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
                        'future_scope'        => 'Extremely high demand. Moroccan banks, telecoms, and international companies actively recruit data scientists.',
                        'moroccan_context'    => 'Major Moroccan employers include Attijariwafa, OCP, Maroc Telecom, and international BPO firms. Freelancing internationally is also common.',
                        'study_paths'         => ['Master en Data Science (UM5, UM6P)', 'École d\'ingénieurs + spécialisation', 'Licence Math-Informatique + Master'],
                        'recommended_schools' => ['UM6P Benguerir', 'ENSIAS', 'UM5 Rabat', 'Université Hassan II'],
                        'demand_level'        => 'Very High',
                    ],
                    [
                        'title'               => 'Cybersecurity Analyst',
                        'description'         => 'Protect organizations from cyber threats, monitor networks, conduct vulnerability assessments, and implement security protocols.',
                        'salary_range'        => '9,000 – 28,000 MAD/month',
                        'required_skills'     => ['Network Security', 'Ethical Hacking', 'SIEM', 'Linux', 'Cryptography'],
                        'future_scope'        => 'Critical demand across banking, government, and telecom sectors as cyber threats increase.',
                        'moroccan_context'    => 'DGSSI (Direction Générale de la Sécurité des Systèmes d\'Information) drives national cybersecurity policy. Banks require many security profiles.',
                        'study_paths'         => ['École d\'ingénieurs (spécialisation Sécurité)', 'Master Cybersécurité', 'Certifications (CEH, CISSP, CompTIA)'],
                        'recommended_schools' => ['ENSIAS', 'ENSA', 'UM6P', 'Institut National des Postes et Télécommunications'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'AI / ML Engineer',
                        'description'         => 'Build and deploy machine learning models and AI systems for real-world applications including NLP, computer vision, and recommendation engines.',
                        'salary_range'        => '12,000 – 40,000 MAD/month',
                        'required_skills'     => ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Mathematics'],
                        'future_scope'        => 'One of the fastest-growing fields globally and in Morocco. Government AI strategy creates institutional demand.',
                        'moroccan_context'    => 'UM6P leads AI research in Morocco. OCP Group, CDG, and international companies recruit AI engineers locally.',
                        'study_paths'         => ['École d\'ingénieurs + Master IA', 'UM6P School of Computer Science', 'Doctorat en IA'],
                        'recommended_schools' => ['UM6P', 'ENSIAS', 'Centrale Casablanca', 'ENSA Kenitra'],
                        'demand_level'        => 'Very High',
                    ],
                    [
                        'title'               => 'Cloud Solutions Architect',
                        'description'         => 'Design and oversee cloud computing strategies, infrastructure deployment, and migration projects for enterprises.',
                        'salary_range'        => '15,000 – 45,000 MAD/month',
                        'required_skills'     => ['AWS/Azure/GCP', 'DevOps', 'Linux', 'Networking', 'Containers'],
                        'future_scope'        => 'Very high demand as Moroccan companies migrate to cloud infrastructure.',
                        'moroccan_context'    => 'Microsoft Azure, AWS, and Google Cloud are expanding in Morocco. Many IT firms offer cloud consulting services.',
                        'study_paths'         => ['École d\'ingénieurs + certifications Cloud', 'AWS/Azure/GCP Certifications', 'Master Systèmes Distribués'],
                        'recommended_schools' => ['ENSIAS', 'ENSA', 'UM6P', 'INPT Rabat'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 2. Engineering
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Engineering', 'description' => 'Civil, mechanical, electrical, industrial and environmental engineering'],
                'careers'  => [
                    [
                        'title'               => 'Civil Engineer',
                        'description'         => 'Plan, design, and oversee construction of infrastructure including roads, bridges, buildings, and water systems.',
                        'salary_range'        => '7,000 – 22,000 MAD/month',
                        'required_skills'     => ['AutoCAD', 'Structural Analysis', 'Project Management', 'Mathematics', 'BIM'],
                        'future_scope'        => 'Very high demand driven by Morocco\'s infrastructure investment in rail, roads, ports, and housing.',
                        'moroccan_context'    => 'Massive projects: LGV Rabat-Casablanca extension, Nador West Med port, Al Boraq TGV, and urban expansion programs create sustained demand.',
                        'study_paths'         => ['Classes Prépa → École d\'ingénieurs (EHTP, EMI)', 'ENTP Oran (Algérie)', 'Licence Génie Civil + Master'],
                        'recommended_schools' => ['EHTP Casablanca', 'EMI Rabat', 'ENSA', 'ENSAM Meknès'],
                        'demand_level'        => 'Very High',
                    ],
                    [
                        'title'               => 'Electrical Engineer',
                        'description'         => 'Design and develop electrical systems, power distribution networks, automation solutions, and electronic equipment.',
                        'salary_range'        => '7,000 – 20,000 MAD/month',
                        'required_skills'     => ['Circuit Design', 'PLC Programming', 'Power Systems', 'AutoCAD Electrical', 'Automation'],
                        'future_scope'        => 'Strong demand in energy, industry, and smart building sectors.',
                        'moroccan_context'    => 'Morocco\'s renewable energy ambition (52% by 2030) and industrial zones (Tanger MED) create strong electrical engineering demand.',
                        'study_paths'         => ['Classes Prépa → École d\'ingénieurs', 'FST Génie Électrique', 'BTS Électrotechnique + Licence Pro'],
                        'recommended_schools' => ['EMI Rabat', 'ENSAM Meknès', 'FST Mohammedia', 'École Hassania des TP'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Mechanical Engineer',
                        'description'         => 'Design, analyze, and manufacture mechanical systems and machines for industrial, automotive, and aerospace applications.',
                        'salary_range'        => '6,500 – 20,000 MAD/month',
                        'required_skills'     => ['SolidWorks/CATIA', 'Thermodynamics', 'Materials Science', 'Manufacturing', 'CAD/CAM'],
                        'future_scope'        => 'Steady demand in automotive, aeronautics, and industrial manufacturing sectors.',
                        'moroccan_context'    => 'Renault-Nissan Tanger, PSA Kenitra, and Boeing/Airbus supply chain in Morocco create strong mechanical engineering demand.',
                        'study_paths'         => ['Classes Prépa → ENSAM, EMI', 'FST Génie Mécanique', 'IUT Génie Mécanique'],
                        'recommended_schools' => ['ENSAM Meknès/Casablanca', 'EMI Rabat', 'ENSAM Casablanca'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Industrial Engineer',
                        'description'         => 'Optimize manufacturing processes, supply chains, and organizational systems to improve efficiency and reduce waste.',
                        'salary_range'        => '7,000 – 22,000 MAD/month',
                        'required_skills'     => ['Lean Manufacturing', 'Six Sigma', 'Operations Research', 'ERP Systems', 'Quality Control'],
                        'future_scope'        => 'Growing demand in Morocco\'s expanding industrial zones and automotive supply chains.',
                        'moroccan_context'    => 'Industrial free zones in Tanger, Kenitra, and Casablanca host hundreds of factories needing industrial engineers for process optimization.',
                        'study_paths'         => ['École d\'ingénieurs (option Génie Industriel)', 'Master Génie Industriel', 'Licence Gestion Industrielle'],
                        'recommended_schools' => ['ENSAM', 'INSA Euro-Méditerranée', 'ESITH Casablanca', 'EMI'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Renewable Energy Engineer',
                        'description'         => 'Design, implement, and maintain solar, wind, and other renewable energy systems and infrastructure.',
                        'salary_range'        => '8,000 – 25,000 MAD/month',
                        'required_skills'     => ['Solar PV Systems', 'Wind Energy', 'Grid Integration', 'SCADA', 'Energy Storage'],
                        'future_scope'        => 'Excellent prospects as Morocco targets 52% renewable energy by 2030.',
                        'moroccan_context'    => 'MASEN (Moroccan Agency for Sustainable Energy) operates the world\'s largest solar complex Noor Ouarzazate. ONEE and private players actively recruit.',
                        'study_paths'         => ['École d\'ingénieurs + Master Énergies Renouvelables', 'Master Énergie Solaire (IRESEN)', 'Licence Sciences de l\'Ingénieur'],
                        'recommended_schools' => ['UM6P', 'IRESEN Green Energy Park', 'EMI Rabat', 'ENSA Agadir'],
                        'demand_level'        => 'Very High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 3. Business & Finance
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Business & Finance', 'description' => 'Management, accounting, banking, marketing and entrepreneurship'],
                'careers'  => [
                    [
                        'title'               => 'Financial Analyst',
                        'description'         => 'Evaluate financial data, build models, assess investment opportunities, and provide strategic financial recommendations.',
                        'salary_range'        => '7,000 – 25,000 MAD/month',
                        'required_skills'     => ['Financial Modeling', 'Excel/Bloomberg', 'Accounting', 'Risk Analysis', 'CFA Knowledge'],
                        'future_scope'        => 'Strong demand in Moroccan banking, insurance, and investment sectors.',
                        'moroccan_context'    => 'Casablanca Finance City (CFC) is sub-Saharan Africa\'s leading financial hub. Attijariwafa, BMCE, CIH, and BMCI recruit financial analysts.',
                        'study_paths'         => ['École de Commerce (HEM, ISCAE, UIR)', 'Master Finance (Université)', 'Licence Sciences Économiques + Master'],
                        'recommended_schools' => ['HEC Paris (with Moroccan campuses)', 'ISCAE Casablanca', 'HEM', 'UIR Rabat', 'Université Hassan II'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Marketing Manager',
                        'description'         => 'Develop and execute marketing strategies, manage brand positioning, lead digital campaigns, and grow market share.',
                        'salary_range'        => '8,000 – 28,000 MAD/month',
                        'required_skills'     => ['Digital Marketing', 'Brand Strategy', 'Analytics', 'Content Creation', 'SEO/SEM'],
                        'future_scope'        => 'Growing demand as Moroccan companies invest in digital transformation and brand building.',
                        'moroccan_context'    => 'Morocco\'s FMCG, telecom, banking, and tourism sectors need strong marketing talent. Agences de communication in Casablanca are major employers.',
                        'study_paths'         => ['École de Commerce + spécialisation Marketing', 'Master Marketing Digital', 'Licence Commerce + Master'],
                        'recommended_schools' => ['ISCAE', 'HEM', 'Sciences Po Paris (échanges)', 'ESG Maroc', 'ENCG'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Accountant / CPA',
                        'description'         => 'Manage financial records, prepare statements, ensure tax compliance, and support financial planning and auditing processes.',
                        'salary_range'        => '5,000 – 18,000 MAD/month',
                        'required_skills'     => ['Accounting Standards', 'Tax Law', 'Excel', 'Sage/SAP', 'Financial Reporting'],
                        'future_scope'        => 'Consistent demand across all sectors. Expert-comptable (CPA) designation highly valued.',
                        'moroccan_context'    => 'Ordre des Experts-Comptables du Maroc regulates the profession. Many opportunities in cabinets comptables, Big 4, and corporate finance.',
                        'study_paths'         => ['ISCAE (Expert-Comptable)', 'Licence Comptabilité-Gestion + Master CCA', 'DUT GEA + Licence Pro'],
                        'recommended_schools' => ['ISCAE Casablanca', 'ENCG', 'Université Hassan II', 'FSE'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Entrepreneur / Startup Founder',
                        'description'         => 'Build and scale a business from idea to market, lead teams, manage funding, and create value in the Moroccan economy.',
                        'salary_range'        => 'Variable (0 – 100,000+ MAD/month)',
                        'required_skills'     => ['Business Planning', 'Leadership', 'Financial Literacy', 'Sales', 'Resilience'],
                        'future_scope'        => 'Morocco\'s startup ecosystem is rapidly growing with incubators, state support, and international investor interest.',
                        'moroccan_context'    => 'Maroc Numeric Fund, CMS (Casablanca FinTech City), Bidaya, and Num-Invest support startups. Cities: Casablanca, Rabat, Marrakech lead the ecosystem.',
                        'study_paths'         => ['École de Commerce + Entrepreneuriat', 'EMINES School of Industrial Management', 'Self-learning + Accelerator programs'],
                        'recommended_schools' => ['UM6P EMINES', 'HEM', 'ISCAE', 'UIR', 'Endeavor Morocco'],
                        'demand_level'        => 'Growing',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 4. Healthcare & Medicine
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Healthcare & Medicine', 'description' => 'Medical, nursing, pharmacy, dental and public health professions'],
                'careers'  => [
                    [
                        'title'               => 'Medical Doctor (Généraliste)',
                        'description'         => 'Diagnose and treat illnesses, provide primary healthcare, conduct examinations, and refer patients to specialists.',
                        'salary_range'        => '12,000 – 40,000 MAD/month',
                        'required_skills'     => ['Medical Diagnosis', 'Patient Care', 'Clinical Skills', 'Pharmacology', 'Communication'],
                        'future_scope'        => 'Very high and consistent demand. Morocco has a doctor shortage — significant opportunities in public and private sectors.',
                        'moroccan_context'    => 'Ministère de la Santé recruits thousands of doctors annually. Private clinics in Casablanca, Rabat, and Marrakech are growing. Rural areas have strong incentives.',
                        'study_paths'         => ['Concours Médecine → 7 ans Faculté de Médecine', 'Internat + Résidanat pour spécialisation'],
                        'recommended_schools' => ['Faculté de Médecine Casablanca', 'Faculté de Médecine Rabat', 'Faculté de Médecine Marrakech', 'UM5 Rabat'],
                        'demand_level'        => 'Very High',
                    ],
                    [
                        'title'               => 'Pharmacist',
                        'description'         => 'Dispense medications, advise patients on drug use and interactions, manage pharmaceutical inventory, and ensure medication safety.',
                        'salary_range'        => '8,000 – 22,000 MAD/month',
                        'required_skills'     => ['Pharmacology', 'Drug Interactions', 'Patient Counseling', 'Inventory Management', 'Chemistry'],
                        'future_scope'        => 'Stable demand in pharmacies, hospitals, pharmaceutical industry, and research.',
                        'moroccan_context'    => 'Morocco has a growing pharmaceutical manufacturing sector (Sanofi, Cooper Pharma, Maphar). Officine (retail pharmacy) is popular for independent practice.',
                        'study_paths'         => ['Concours Pharmacie → 6 ans Faculté de Pharmacie', 'Doctorat en Pharmacie'],
                        'recommended_schools' => ['Faculté de Médecine et de Pharmacie Rabat', 'Faculté de Pharmacie Casablanca'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Dentist',
                        'description'         => 'Diagnose and treat oral health conditions, perform dental procedures, and educate patients on preventive dental care.',
                        'salary_range'        => '10,000 – 45,000 MAD/month',
                        'required_skills'     => ['Dental Procedures', 'Patient Care', 'Oral Surgery', 'Radiology', 'Precision Work'],
                        'future_scope'        => 'Excellent prospects. Many dentists open private practices. Growing demand for specialized dental care.',
                        'moroccan_context'    => 'Private dental practice is very common. Moroccan diaspora patients travel for dental care due to lower costs, creating premium market opportunities.',
                        'study_paths'         => ['Concours Médecine Dentaire → 6 ans'],
                        'recommended_schools' => ['Faculté de Médecine Dentaire Casablanca', 'Faculté de Médecine Dentaire Rabat'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Nursing Specialist',
                        'description'         => 'Provide direct patient care, administer medications, monitor health conditions, and coordinate with medical teams in clinical settings.',
                        'salary_range'        => '4,500 – 12,000 MAD/month',
                        'required_skills'     => ['Clinical Care', 'Patient Monitoring', 'Medical Equipment', 'Teamwork', 'Emergency Response'],
                        'future_scope'        => 'Very high demand driven by healthcare infrastructure expansion and hospital construction.',
                        'moroccan_context'    => 'Ministry of Health invests heavily in hospital infrastructure. Opportunities in public hospitals, private clinics, and international healthcare missions.',
                        'study_paths'         => ['IFCS (Institut de Formation aux Carrières de Santé) — 3 ans', 'Licence Sciences Infirmières'],
                        'recommended_schools' => ['IFCS Casablanca', 'IFCS Rabat', 'IFCS Marrakech'],
                        'demand_level'        => 'Very High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 5. Education & Research
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Education & Research', 'description' => 'Teaching, academic research, training and educational technology'],
                'careers'  => [
                    [
                        'title'               => 'University Professor',
                        'description'         => 'Teach courses, conduct research, publish academic work, supervise students, and contribute to knowledge in your discipline.',
                        'salary_range'        => '10,000 – 25,000 MAD/month',
                        'required_skills'     => ['Subject Expertise', 'Research Methodology', 'Academic Writing', 'Teaching', 'Mentoring'],
                        'future_scope'        => 'Stable demand. Morocco expanding higher education capacity with new universities and private institutions.',
                        'moroccan_context'    => 'CNRST funds research programs. Many Moroccan professors pursue dual academic-consulting careers.',
                        'study_paths'         => ['Licence + Master + Doctorat (Bac+8)', 'Concours d\'agrégation', 'Post-doctorat'],
                        'recommended_schools' => ['UM5 Rabat', 'UM6P', 'Université Hassan II', 'Université Cadi Ayyad Marrakech'],
                        'demand_level'        => 'Medium',
                    ],
                    [
                        'title'               => 'High School Teacher',
                        'description'         => 'Teach secondary students in core subjects, develop curriculum, assess progress, and support student development.',
                        'salary_range'        => '5,000 – 12,000 MAD/month',
                        'required_skills'     => ['Subject Knowledge', 'Pedagogy', 'Communication', 'Classroom Management', 'Assessment'],
                        'future_scope'        => 'Consistent demand. Private international schools pay significantly higher salaries.',
                        'moroccan_context'    => 'Ministère de l\'Éducation Nationale runs Concours de Recrutement annually. Private French mission schools (Lycée Lyautey, etc.) offer competitive salaries.',
                        'study_paths'         => ['Licence + CRMEF (Centre Régional des Métiers de l\'Éducation)', 'Concours Enseignants'],
                        'recommended_schools' => ['CRMEF (toutes régions)', 'ENS (Écoles Normales Supérieures)'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 6. Law & Social Sciences
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Law & Social Sciences', 'description' => 'Law, judiciary, social work, psychology and political science'],
                'careers'  => [
                    [
                        'title'               => 'Lawyer / Avocat',
                        'description'         => 'Advise clients on legal matters, represent them in court, draft legal documents, and navigate commercial, civil, or criminal law.',
                        'salary_range'        => '6,000 – 60,000 MAD/month',
                        'required_skills'     => ['Legal Research', 'Argumentation', 'Contract Law', 'Negotiation', 'Arabic/French Legal Writing'],
                        'future_scope'        => 'Strong demand in corporate law, international business, and public sector. Growing fintech and startup legal needs.',
                        'moroccan_context'    => 'Barreau de Casablanca is one of the largest in Africa. International law firms (CMS Francis Lefebvre, Gide, etc.) have Casablanca offices.',
                        'study_paths'         => ['Licence Droit (4 ans) + Master + INBA (Institut National du Barreau)', 'Bac+5 minimum for Bar admission'],
                        'recommended_schools' => ['FSJES Casablanca (Ain Sebaa)', 'FSJES Rabat-Agdal', 'FSJES Marrakech', 'UMP Fès'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Psychologist',
                        'description'         => 'Assess and treat mental health conditions, provide therapy, conduct psychological evaluations, and support organizational wellbeing.',
                        'salary_range'        => '5,000 – 20,000 MAD/month',
                        'required_skills'     => ['Psychotherapy', 'Assessment Tools', 'Active Listening', 'CBT/Psychoanalysis', 'Ethics'],
                        'future_scope'        => 'Growing demand as mental health awareness increases in Morocco.',
                        'moroccan_context'    => 'Clinical psychology is expanding. Companies increasingly hire organizational psychologists (DRH). Private practice growing in urban centers.',
                        'study_paths'         => ['Licence Psychologie + Master Clinique (Bac+5)', 'Doctorat pour poste universitaire'],
                        'recommended_schools' => ['Faculté des Sciences de l\'Éducation Rabat', 'UM5', 'UM Hassan II'],
                        'demand_level'        => 'Growing',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 7. Architecture & Urban Planning
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Architecture & Design', 'description' => 'Architecture, urban planning, interior design and landscape architecture'],
                'careers'  => [
                    [
                        'title'               => 'Architect',
                        'description'         => 'Design buildings and spaces, develop construction plans, manage projects from concept to completion, and ensure aesthetic and structural integrity.',
                        'salary_range'        => '6,000 – 30,000 MAD/month',
                        'required_skills'     => ['AutoCAD/Revit/SketchUp', 'Structural Knowledge', 'Urban Design', 'Project Management', 'Creativity'],
                        'future_scope'        => 'Strong demand driven by Morocco\'s urban construction boom, luxury tourism, and social housing projects.',
                        'moroccan_context'    => 'Hassan II Mosque, Rabat new city projects, and Marrakech luxury resorts represent Morocco\'s architectural ambition. Ordre des Architectes governs the profession.',
                        'study_paths'         => ['Concours ENA (École Nationale d\'Architecture) → 6 ans', 'Écoles privées d\'Architecture'],
                        'recommended_schools' => ['ENA Rabat', 'ENA Marrakech', 'ENA Tétouan', 'ENA Fès'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Interior Designer',
                        'description'         => 'Create functional and aesthetically pleasing interior spaces for residential, commercial, and hospitality clients.',
                        'salary_range'        => '5,000 – 20,000 MAD/month',
                        'required_skills'     => ['3D Rendering', 'AutoCAD', 'Color Theory', 'Materials Knowledge', 'Client Communication'],
                        'future_scope'        => 'Growing market in Morocco\'s expanding hospitality, luxury real estate, and home renovation sectors.',
                        'moroccan_context'    => 'Morocco\'s artisanal heritage (zellige, tadelakt, stucco) merges with modern design. Marrakech and Casablanca have thriving interior design markets.',
                        'study_paths'         => ['BTS Design d\'Espace', 'Licence Design Intérieur (ESAV, ESMOD)', 'ENA option Aménagement'],
                        'recommended_schools' => ['ESAV Marrakech', 'ESMOD Casablanca', 'ENA', 'ISTA'],
                        'demand_level'        => 'Growing',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 8. Tourism & Hospitality
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Tourism & Hospitality', 'description' => 'Hotel management, tourism, culinary arts and travel services'],
                'careers'  => [
                    [
                        'title'               => 'Hotel Manager',
                        'description'         => 'Oversee all hotel operations including guest services, staff management, revenue optimization, and brand standards compliance.',
                        'salary_range'        => '8,000 – 35,000 MAD/month',
                        'required_skills'     => ['Operations Management', 'Revenue Management', 'Leadership', 'Guest Relations', 'French/English/Spanish'],
                        'future_scope'        => 'Strong demand. Morocco targets 26 million tourists by 2030 and is massively expanding hospitality infrastructure.',
                        'moroccan_context'    => 'Accor, Marriott, Hilton, Four Seasons, and Club Med operate in Morocco. ONMT (Office National Marocain du Tourisme) drives sector growth.',
                        'study_paths'         => ['ISHT (Institut Supérieur International du Tourisme)', 'BTS Hôtellerie-Restauration', 'École Hôtelière privée'],
                        'recommended_schools' => ['ISHT Tanger', 'IFHT (Institut de Formation Hôtelière)', 'CFA Tourisme'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Tour Guide & Tourism Consultant',
                        'description'         => 'Lead tourist groups, design itineraries, promote Moroccan heritage, and provide cultural expertise to visitors from around the world.',
                        'salary_range'        => '4,000 – 15,000 MAD/month',
                        'required_skills'     => ['Multilingual Communication', 'Moroccan History & Culture', 'Geography', 'Customer Service', 'First Aid'],
                        'future_scope'        => 'Growing with Morocco\'s tourism boom. Specialized guides (culinary, adventure, desert) command premium rates.',
                        'moroccan_context'    => 'Carte de Guide Officiel required. Destinations: Marrakech medina, Sahara desert, Fès el-Bali, Atlas mountains. European and Gulf markets are primary sources.',
                        'study_paths'         => ['Licence Tourisme + Guide Formation', 'BTS Tourisme', 'ISHT programmes'],
                        'recommended_schools' => ['ISHT Tanger', 'ESITH Casablanca', 'Faculté des Lettres (Tourisme)'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 9. Media & Communication
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Media & Communication', 'description' => 'Journalism, broadcasting, digital media, public relations and communication'],
                'careers'  => [
                    [
                        'title'               => 'Journalist / Reporter',
                        'description'         => 'Research and report on events, conduct interviews, write articles or produce broadcast content for news organizations.',
                        'salary_range'        => '4,000 – 15,000 MAD/month',
                        'required_skills'     => ['Investigative Research', 'Writing', 'Multimedia Production', 'Arabic/French/English', 'Ethics'],
                        'future_scope'        => 'Digital journalism and multimedia content creation offer growth. Traditional print declining but digital media expanding.',
                        'moroccan_context'    => '2M, Al Aoula, Medi1TV, Le360, TelQuel, and Medias24 are key employers. HACA (Haute Autorité de la Communication Audiovisuelle) regulates.',
                        'study_paths'         => ['ISIC (Institut Supérieur de l\'Information et de la Communication)', 'IFJ (Institut Français du Journalisme)', 'Licence Sciences de la Communication'],
                        'recommended_schools' => ['ISIC Rabat', 'École Supérieure de Journalisme', 'Université Mohamed V'],
                        'demand_level'        => 'Medium',
                    ],
                    [
                        'title'               => 'Digital Content Creator / Influencer',
                        'description'         => 'Produce engaging digital content across social media platforms, build audiences, and collaborate with brands on marketing campaigns.',
                        'salary_range'        => '5,000 – 50,000 MAD/month',
                        'required_skills'     => ['Video Production', 'Social Media Strategy', 'Copywriting', 'Analytics', 'Brand Partnerships'],
                        'future_scope'        => 'Very high growth in Morocco\'s digital advertising market. Instagram, TikTok, and YouTube audiences rapidly expanding.',
                        'moroccan_context'    => 'Moroccan creators reach Arab, African, and French-speaking audiences. Brands increasingly invest in influencer marketing. Self-employed model common.',
                        'study_paths'         => ['Self-taught + practice', 'BTS Communication', 'Formations courtes en video/media'],
                        'recommended_schools' => ['ISIC', 'Écoles privées de Communication', 'Formation en ligne (YouTube, Coursera)'],
                        'demand_level'        => 'Very High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 10. Agriculture & Agri-food
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Agriculture & Agri-food', 'description' => 'Agronomy, food science, agricultural engineering and rural development'],
                'careers'  => [
                    [
                        'title'               => 'Agronomist',
                        'description'         => 'Develop and improve agricultural production methods, advise farmers, conduct field research, and optimize crop yields sustainably.',
                        'salary_range'        => '6,000 – 18,000 MAD/month',
                        'required_skills'     => ['Soil Science', 'Crop Management', 'Irrigation', 'Agro-economics', 'GIS'],
                        'future_scope'        => 'Morocco\'s Plan Maroc Vert and Generation Green 2020–2030 create strong demand for agronomists.',
                        'moroccan_context'    => 'Agriculture represents 14% of Moroccan GDP. OCP Group, Cosumar, APAM, and thousands of agricultural cooperatives employ agronomists.',
                        'study_paths'         => ['IAV Hassan II (Institut Agronomique Vétérinaire)', 'ENA Meknès (École Nationale d\'Agriculture)', 'Licence Sciences Agronomiques'],
                        'recommended_schools' => ['IAV Hassan II Rabat', 'ENA Meknès', 'ENAM Meknès', 'Université Ibn Tofail'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Food Scientist / Ingénieur Agroalimentaire',
                        'description'         => 'Develop food products, improve processing methods, ensure food safety and quality standards in food manufacturing.',
                        'salary_range'        => '6,500 – 20,000 MAD/month',
                        'required_skills'     => ['Food Chemistry', 'Quality Control', 'HACCP', 'Product Development', 'Microbiology'],
                        'future_scope'        => 'Growing sector as Morocco exports processed foods and develops domestic food industry.',
                        'moroccan_context'    => 'Cosumar, Centrale Danone, Bimo, Les Conserves de Meknès are major employers. Morocco exports agri-food products to EU, Middle East, and Africa.',
                        'study_paths'         => ['IAV Hassan II (IAA option)', 'ENFI Salé', 'FST Génie Alimentaire', 'Licence Sciences Alimentaires'],
                        'recommended_schools' => ['IAV Hassan II', 'ENFI', 'FST Mohammedia'],
                        'demand_level'        => 'Growing',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 11. Logistics & Supply Chain
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Logistics & Transport', 'description' => 'Supply chain, logistics management, port operations and transport planning'],
                'careers'  => [
                    [
                        'title'               => 'Supply Chain Manager',
                        'description'         => 'Plan and coordinate the flow of goods, services, and information from suppliers to customers across global supply networks.',
                        'salary_range'        => '9,000 – 28,000 MAD/month',
                        'required_skills'     => ['Supply Chain Optimization', 'ERP (SAP)', 'Logistics Management', 'Negotiation', 'Data Analysis'],
                        'future_scope'        => 'Very high demand as Morocco becomes a regional logistics hub with Tanger Med port as Africa\'s largest.',
                        'moroccan_context'    => 'Tanger Med handles 9 million containers/year. Morocco\'s industrial zones (automotive, aeronautics) and growing e-commerce create strong logistics demand.',
                        'study_paths'         => ['ENCGT (École Nationale de Commerce et de Gestion Tanger)', 'Master Supply Chain', 'IUT Logistique'],
                        'recommended_schools' => ['ENCGT Tanger', 'ISCAE', 'ISL (Institut Supérieur de Logistique)', 'ENCG'],
                        'demand_level'        => 'Very High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 12. Sciences & Research
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Sciences & Research', 'description' => 'Physics, chemistry, biology, mathematics and fundamental research'],
                'careers'  => [
                    [
                        'title'               => 'Biologist / Biomedical Researcher',
                        'description'         => 'Conduct research on living organisms, develop medical treatments, and contribute to advances in biotechnology and life sciences.',
                        'salary_range'        => '6,000 – 20,000 MAD/month',
                        'required_skills'     => ['Laboratory Techniques', 'Molecular Biology', 'Data Analysis', 'Scientific Writing', 'Grant Writing'],
                        'future_scope'        => 'Growing with Morocco\'s investment in biotech and pharmaceutical manufacturing.',
                        'moroccan_context'    => 'Institut Pasteur du Maroc, AIMF, and UM6P lead biomedical research. Pharmaceutical manufacturing sector growing in Casablanca.',
                        'study_paths'         => ['Licence Biologie + Master + Doctorat', 'FST Sciences de la Vie', 'École Nationale Vétérinaire'],
                        'recommended_schools' => ['FST Fès', 'Université Hassan II', 'UM6P', 'Institut Pasteur du Maroc'],
                        'demand_level'        => 'Medium',
                    ],
                    [
                        'title'               => 'Geologist / Mining Engineer',
                        'description'         => 'Explore and analyze earth materials, survey mining deposits, assess geological risks, and support resource extraction projects.',
                        'salary_range'        => '7,000 – 25,000 MAD/month',
                        'required_skills'     => ['Geological Mapping', 'GIS/Remote Sensing', 'Mineralogy', 'Field Work', 'Environmental Assessment'],
                        'future_scope'        => 'Excellent prospects given Morocco\'s world-leading phosphate reserves and expanding mining sector.',
                        'moroccan_context'    => 'Morocco holds 75% of world phosphate reserves (OCP Group). Also significant deposits of cobalt, silver, iron. ONHYM recruits geologists nationally.',
                        'study_paths'         => ['École des Mines de Rabat (EMR)', 'FST Géologie', 'ESTEM'],
                        'recommended_schools' => ['École Mohammadia d\'Ingénieurs (EMI)', 'Mines Rabat', 'FST Marrakech'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 13. Public Sector & Diplomacy
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Public Sector & Diplomacy', 'description' => 'Government service, diplomacy, public administration and international relations'],
                'careers'  => [
                    [
                        'title'               => 'Diplomat / Foreign Affairs Officer',
                        'description'         => 'Represent Morocco internationally, negotiate agreements, manage bilateral relations, and support citizens abroad.',
                        'salary_range'        => '15,000 – 45,000 MAD/month',
                        'required_skills'     => ['International Law', 'Diplomatic Protocol', 'Languages (Arabic/French/English/Spanish)', 'Negotiation', 'Political Analysis'],
                        'future_scope'        => 'Prestigious career. Morocco is increasingly active in African Union, Arab League, and UN bodies.',
                        'moroccan_context'    => 'Ministère des Affaires Étrangères recruits via Concours. Morocco has over 100 embassies and consulates worldwide.',
                        'study_paths'         => ['Sciences Po + Master Relations Internationales', 'ISCAE + Concours Diplomatie', 'Licence Droit Public + Concours'],
                        'recommended_schools' => ['ENA Maroc (École Nationale d\'Administration)', 'Sciences Po (France)', 'FSJES Rabat-Agdal'],
                        'demand_level'        => 'Medium',
                    ],
                    [
                        'title'               => 'Civil Servant / Fonctionnaire',
                        'description'         => 'Work in government administration, implement public policies, manage public services, and serve the national interest.',
                        'salary_range'        => '4,500 – 18,000 MAD/month',
                        'required_skills'     => ['Administrative Law', 'Management', 'Public Finance', 'Communication', 'Organization'],
                        'future_scope'        => 'Stable employment with comprehensive benefits. Morocco modernizing public administration through digital transformation.',
                        'moroccan_context'    => 'Moroccan government is one of the largest employers. Concours de Recrutement organized by Ministère de la Réforme de l\'Administration.',
                        'study_paths'         => ['Licence Droit/Gestion + Concours de la Fonction Publique', 'ENA Maroc', 'ISCAE'],
                        'recommended_schools' => ['ENA Maroc', 'ISCAE', 'FSJES', 'ENCG'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 14. Arts & Creative Fields
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Arts & Creative Fields', 'description' => 'Fine arts, music, film, performing arts and cultural management'],
                'careers'  => [
                    [
                        'title'               => 'Graphic Designer / UX Designer',
                        'description'         => 'Create visual content for digital and print media, design user interfaces, and craft compelling brand identities.',
                        'salary_range'        => '5,000 – 20,000 MAD/month',
                        'required_skills'     => ['Adobe Creative Suite', 'Figma', 'Typography', 'Color Theory', 'UX Principles'],
                        'future_scope'        => 'Strong demand as Moroccan businesses invest in digital presence and brand development.',
                        'moroccan_context'    => 'Agences de communication in Casablanca and Rabat are primary employers. Freelancing for international clients via Upwork/Behance is increasingly popular.',
                        'study_paths'         => ['ESAV (École Supérieure des Arts Visuels)', 'ESMOD Maroc', 'ISTA Multimédia', 'Formations en ligne'],
                        'recommended_schools' => ['ESAV Marrakech', 'ESMOD Casablanca', 'ISTA', 'SUPINFO Maroc'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Film Director / Video Producer',
                        'description'         => 'Develop and direct film, documentary, or commercial video productions from concept through post-production.',
                        'salary_range'        => '5,000 – 35,000 MAD/month',
                        'required_skills'     => ['Screenwriting', 'Camera Operation', 'Editing (Premiere Pro)', 'Storytelling', 'Production Management'],
                        'future_scope'        => 'Growing with Morocco\'s international co-productions and advertising market expansion.',
                        'moroccan_context'    => 'Morocco is a preferred filming location (Hollywood uses Ouarzazate/Atlas Studios). CCM (Centre Cinématographique Marocain) funds local productions.',
                        'study_paths'         => ['ISCA (Institut Supérieur des Arts et Métiers de la Communication)', 'ESAV', 'Ateliers de cinéma indépendants'],
                        'recommended_schools' => ['ESAV Marrakech', 'ISCA', 'École de Cinéma de Marrakech'],
                        'demand_level'        => 'Growing',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────────
            // 15. Skilled Trades & Technical
            // ─────────────────────────────────────────────────────────────────
            [
                'category' => ['name' => 'Skilled Trades & Technical', 'description' => 'Electricians, plumbers, welders, mechanics and other skilled technical trades'],
                'careers'  => [
                    [
                        'title'               => 'Electrician / Électrotechnicien',
                        'description'         => 'Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.',
                        'salary_range'        => '4,000 – 14,000 MAD/month',
                        'required_skills'     => ['Electrical Wiring', 'Safety Standards', 'Blueprint Reading', 'Troubleshooting', 'NFC 15-100 Norms'],
                        'future_scope'        => 'Consistent demand across construction, industry, and smart building sectors.',
                        'moroccan_context'    => 'Morocco\'s construction boom and industrial expansion ensure strong trade demand. Self-employment and entrepreneurship common.',
                        'study_paths'         => ['BTS Électrotechnique', 'CAP/BEP Électricité', 'OFPPT (Technicien Spécialisé)', 'BAC Pro Électrotechnique'],
                        'recommended_schools' => ['OFPPT (toutes villes)', 'ISTA', 'Centres de Formation Professionnelle'],
                        'demand_level'        => 'High',
                    ],
                    [
                        'title'               => 'Automotive Technician / Mécanicien Auto',
                        'description'         => 'Diagnose, repair, and maintain vehicles including modern electric and hybrid cars using diagnostic tools and technical expertise.',
                        'salary_range'        => '3,500 – 12,000 MAD/month',
                        'required_skills'     => ['Engine Diagnostics', 'Electrical Systems', 'Hydraulics', 'OBD2 Tools', 'Customer Service'],
                        'future_scope'        => 'Evolving with electric vehicle adoption. Technicians skilled in EV maintenance will command premium rates.',
                        'moroccan_context'    => 'Morocco\'s automotive production (Renault, PSA) and 5+ million registered vehicles create sustained demand for qualified mechanics.',
                        'study_paths'         => ['BTS Maintenance Automobile', 'OFPPT Mécanique Auto', 'CAP Mécanique + formation constructeur'],
                        'recommended_schools' => ['OFPPT', 'ISTA Mécanique', 'Centres agréés Renault/PSA'],
                        'demand_level'        => 'High',
                    ],
                ],
            ],
        ];

        // ── Seed categories and careers ────────────────────────────────────────
        foreach ($data as $section) {
            $catData = $section['category'];
            $cat = CareerCategory::firstOrCreate(
                ['name' => $catData['name']],
                ['description' => $catData['description']]
            );

            foreach ($section['careers'] as $careerData) {
                Career::updateOrCreate(
                    ['title' => $careerData['title'], 'category_id' => $cat->id],
                    [
                        'description'         => $careerData['description'],
                        'salary_range'        => $careerData['salary_range'],
                        'required_skills'     => $careerData['required_skills'],
                        'future_scope'        => $careerData['future_scope'],
                        'moroccan_context'    => $careerData['moroccan_context'] ?? null,
                        'study_paths'         => $careerData['study_paths'] ?? null,
                        'recommended_schools' => $careerData['recommended_schools'] ?? null,
                        'demand_level'        => $careerData['demand_level'] ?? null,
                        'image'               => null,
                    ]
                );
            }
        }

        $totalCareers    = Career::count();
        $totalCategories = CareerCategory::count();

        $this->command->info("✅ CareerSeeder: {$totalCategories} categories, {$totalCareers} careers seeded.");
    }
}
