use crate::schema::{meetings, messages, users};
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, 
    pub exp: usize,  
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct Meeting {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub creator_id: i32,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = meetings)]
pub struct NewMeeting {
    pub title: String,
    pub description: Option<String>,
    #[diesel(sql_type = Timestamp)]
    pub start_time: NaiveDateTime,
    #[diesel(sql_type = Timestamp)]
    pub end_time: NaiveDateTime,
    pub creator_id: i32,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct Message {
    pub id: i32,
    pub content: String,
    pub sender_id: i32,
    pub meeting_id: i32,
    pub timestamp: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = messages)]
pub struct NewMessage {
    pub content: String,
    pub sender_id: i32,
    pub meeting_id: i32,
    #[diesel(sql_type = Timestamp)]
    pub timestamp: NaiveDateTime,
}