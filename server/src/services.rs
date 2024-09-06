use crate::models::User;
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

pub fn get_user_by_id(id: i32) -> Result<User, diesel::result::Error> {
    let connection = establish_connection();
    use crate::schema::users::dsl::*;
    users.filter(id.eq(id))
        .first::<User>(&connection)
}

fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).expect("Error connecting to database")
}
