use diesel::{allow_tables_to_appear_in_same_query, table};

table! {
    users (id) {
        id -> Int4,
        name -> Varchar,
        email -> Varchar,
        password -> Varchar,
    }
}

table! {
    meetings (id) {
        id -> Int4,
        title -> Varchar,
        description -> Nullable<Varchar>,
        start_time -> Timestamp,
        end_time -> Timestamp,
        creator_id -> Int4,
    }
}

table! {
    messages (id) {
        id -> Int4,
        content -> Varchar,
        sender_id -> Int4,
        meeting_id -> Int4,
        timestamp -> Timestamp,
    }
}

allow_tables_to_appear_in_same_query!(users, meetings, messages);
