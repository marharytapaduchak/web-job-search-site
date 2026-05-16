update user_notifications
set
    all_new_vacancies     = $1,
    recommended_vacancies = $2,
    disable_notifications = $3,
    send_to_main_email    = $4,
    send_to_other_email   = $5
where id = $6
returning id, user_id, all_new_vacancies, recommended_vacancies, disable_notifications, send_to_main_email, send_to_other_email
