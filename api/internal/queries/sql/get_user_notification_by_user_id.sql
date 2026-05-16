select id, user_id, all_new_vacancies, recommended_vacancies, disable_notifications, send_to_main_email, send_to_other_email
from user_notifications
where user_id = $1
