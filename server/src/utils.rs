use std::env;

pub fn get_env_var(key: &str) -> String {
    env::var(key).unwrap_or_else(|_| String::from("Not Set"))
}
