#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol, String};

#[contract]
pub struct ZyntraPay;

#[contractimpl]
impl ZyntraPay {
    pub fn pay(env: Env, sender: String, amount: u32) -> Symbol {
        env.storage().persistent().set(&symbol_short!("SENDER"), &sender);
        env.storage().persistent().set(&symbol_short!("AMOUNT"), &amount);

        let status = symbol_short!("PAID");
        env.storage().persistent().set(&symbol_short!("STATUS"), &status);

        status
    }

    pub fn status(env: Env) -> Symbol {
        env.storage()
            .persistent()
            .get(&symbol_short!("STATUS"))
            .unwrap_or(symbol_short!("NONE"))
    }

    pub fn sender(env: Env) -> String {
        env.storage()
            .persistent()
            .get(&symbol_short!("SENDER"))
            .unwrap_or(String::from_str(&env, ""))
    }

    pub fn amount(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&symbol_short!("AMOUNT"))
            .unwrap_or(0)
    }
}