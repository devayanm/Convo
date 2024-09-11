use crate::models::{Claims, Meeting, Message, NewMeeting, NewMessage, NewUser, User};
use actix_web::error::ErrorUnauthorized;
use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenv::dotenv;
use jsonwebtoken::{decode, errors::ErrorKind, DecodingKey, EncodingKey, Header, Validation};
use log::info;
use std::cmp::min;
use std::env;

pub fn get_user_by_id(_id: i32) -> Result<User, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::users::dsl::*;
    users.filter(id.eq(id)).first::<User>(&mut connection)
}

pub fn get_user_by_email(_email: &str) -> Result<User, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::users::dsl::*;
    users.filter(email.eq(email)).first::<User>(&mut connection)
}

pub fn create_user(user: NewUser) -> Result<User, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::users::dsl::*;
    diesel::insert_into(users)
        .values(&user)
        .get_result::<User>(&mut connection)
}

pub fn create_meeting(new_meeting: NewMeeting) -> Result<Meeting, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::meetings::dsl::*;
    diesel::insert_into(meetings)
        .values(&new_meeting)
        .get_result(&mut connection)
}

pub fn get_meeting_by_id(_id: i32) -> Result<Meeting, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::meetings::dsl::*;
    meetings.find(id).first::<Meeting>(&mut connection)
}

pub fn create_message(new_message: NewMessage) -> Result<Message, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::messages::dsl::*;
    diesel::insert_into(messages)
        .values(&new_message)
        .get_result(&mut connection)
}

pub fn get_messages_for_meeting(_meeting_id: i32) -> Result<Vec<Message>, diesel::result::Error> {
    let mut connection = establish_mutable_connection();
    use crate::schema::messages::dsl::*;
    messages
        .filter(meeting_id.eq(meeting_id))
        .load::<Message>(&mut connection)
}

pub fn establish_mutable_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).expect("Error connecting to database")
}

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool, bcrypt::BcryptError> {
    verify(password, hash)
}

pub fn generate_jwt(user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration as usize,
    };

    let encoding_key = EncodingKey::from_secret(
        env::var("JWT_SECRET")
            .expect("JWT_SECRET must be set")
            .as_ref(),
    );

    match jsonwebtoken::encode(&Header::default(), &claims, &encoding_key) {
        Ok(token) => {
            info!("Token generated successfully: {}", token);
            Ok(token)
        }
        Err(err) => {
            info!("Error generating token: {}", err);
            Err(err)
        }
    }
}

pub fn decode_jwt(token: &str) -> Result<Claims, actix_web::Error> {
    log::info!("Decoding JWT token: {}", &token[0..min(10, token.len())]);

    let jwt_secret = match env::var("JWT_SECRET") {
        Ok(secret) => secret,
        Err(_) => {
            log::error!("JWT_SECRET environment variable is not set.");
            return Err(ErrorUnauthorized("JWT secret is not configured").into());
        }
    };

    let decoding_key = DecodingKey::from_secret(jwt_secret.as_ref());

    match decode::<Claims>(token, &decoding_key, &Validation::default()) {
        Ok(token_data) => {
            log::info!("Token successfully decoded: {:?}", token_data.claims);
            Ok(token_data.claims)
        }
        Err(err) => match *err.kind() {
            ErrorKind::ExpiredSignature => {
                log::error!("Token has expired: {:?}", err);
                Err(ErrorUnauthorized("Token has expired").into())
            }
            ErrorKind::InvalidToken => {
                log::error!("Invalid token: {:?}", err);
                Err(ErrorUnauthorized("Invalid token").into())
            }
            _ => {
                log::error!("Error decoding token: {:?}", err);
                Err(ErrorUnauthorized("Error decoding token").into())
            }
        },
    }
}
