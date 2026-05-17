insert into company (id, name, logo_url, location, description)
overriding system value
values
(101, 'AppFlow', 'https://placehold.co/64/red/white?text=Logo', 'Kyiv, Ukraine', 'Innovative app development company.'),
(102, 'Shop Sphere', 'https://placehold.co/64/red/white?text=Logo', 'Lviv, Ukraine', 'E-commerce solutions provider.'),
(103, 'BrandCraft', 'https://placehold.co/64/red/white?text=Logo', 'Kyiv, Ukraine', 'Creative branding agency.'),
(104, 'GameCloud', 'https://placehold.co/64/red/white?text=Logo', 'Dnipro, ukraine', 'cloud gaming platform.'),
(105, 'medtech innovations', 'https://placehold.co/64/red/white?text=Logo', 'Odesa, Ukraine', 'Medical technology startup.');

select setval('company_id_seq', (select max(id) from company));

insert into job (id, company_id, title, salary, level, format, employment_type, location, english_level, description, work_conditions, skills, benefits, num_views, date_added)
overriding system value
values
(
    1, 101, 'UI / UX Designer', '15000', 'Junior', 'Офіс', 'Неповна зайнятість', 'Київ', 'Intermediate',
    'Ми шукаємо талановитого Junior UI/UX дизайнера, який допоможе нам створювати інтуїтивно зрозумілі інтерфейси для наших мобільних застосунків. Ви працюватимете в команді досвідчених дизайнерів та розробників.',
    'Гнучкий графік роботи, можливість частково віддаленої роботи, регулярні фідбек-сесії.',
    array['Figma', 'UI Design', 'UX Design', 'Prototyping'],
    array['Медичне страхування', 'Курси англійської мови', 'Безкоштовні обіди'],
    35, '2023-09-12'
),
(
    2, 102, 'UI / UX Designer', '20000', 'Middle', 'Офіс', 'Неповна зайнятість', 'Львів', 'Upper-Intermediate',
    'Shop Sphere шукає Middle UI/UX дизайнера для покращення досвіду користувачів нашої e-commerce платформи. Якщо ви маєте око на деталі та любите вирішувати складні завдання - ми чекаємо на вас.',
    'Робота в сучасному офісі у Львові, професійна техніка, оплачувані конференції.',
    array['Figma', 'E-commerce', 'Responsive Design'],
    array['Спортивний зал', 'Корпоративні заходи', 'Бонуси за результати'],
    35, '2023-09-12'
),
(
    3, 103, 'UI / UX Designer (Senior/Middle)', '40000', 'Middle', 'Віддалено/офіс', 'Повна зайнятість', 'Київ', 'Advanced',
    'Приєднуйтесь до BrandCraft як UI/UX дизайнер. Ми створюємо унікальні бренди та цифрові продукти. Ваша роль буде ключовою у розробці дизайну для великих міжнародних проектів.',
    'Можливість працювати як в офісі, так і віддалено, робота з міжнародними клієнтами.',
    array['Branding', 'UI/UX', 'Interaction Design'],
    array['Висока зарплата', 'Міжнародні проекти', 'Професійний розвиток'],
    40, '2023-11-12'
),
(
    4, 104, 'UI / UX Designer (Games)', '20000', 'Junior', 'Віддалено/офіс', 'Повна зайнятість', 'Дніпро', 'Intermediate',
    'GameCloud шукає дизайнера, який любить ігри так само як і дизайн. Ви будете створювати інтерфейси для нашої ігрової хмарної платформи.',
    'Гнучкий початок робочого дня, доступ до новітніх ігор, творча атмосфера.',
    array['Game UI', 'UX Research', 'Figma'],
    array['Ігрова зона в офісі', 'Безкоштовні напої та снеки', 'Тімбілдінги'],
    44, '2023-09-01'
),
(
    5, 105, 'Product Designer', '20000', 'Middle', 'Віддалено', 'Неповна зайнятість', 'Одеса', 'Upper-Intermediate',
    'MedTech Innovations розробляє майбутнє медицини. Нам потрібен Middle Product Designer, який допоможе зробити медичні сервіси простішими та доступнішими.',
    'Повністю віддалена робота, соціально важливий проект, гнучкі години.',
    array['Product Design', 'UI/UX', 'HealthTech'],
    array['Медичне страхування', 'Відпустка 24 дні', 'Курси підвищення кваліфікації'],
    23, '2023-09-23'
);

select setval('job_id_seq', (select max(id) from job));
