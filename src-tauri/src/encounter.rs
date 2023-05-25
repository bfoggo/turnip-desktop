use rand::Rng;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Serialize, Deserialize, Debug, Clone, Default, Copy)]
pub struct TurnCounter(u32);

impl TurnCounter {
    pub fn new() -> Self {
        TurnCounter(0)
    }
    pub fn increment(&mut self) {
        self.0 += 1;
    }
    pub fn get(&self) -> u32 {
        self.0
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum TurnLengths {
    Short,
    Medium,
    Long,
}

impl Default for TurnLengths {
    fn default() -> Self {
        TurnLengths::Medium
    }
}

impl TurnLengths {
    pub fn get_turns(&self) -> u32 {
        // randomly samples a number of turns on given intervals
        match self {
            TurnLengths::Short => {
                let mut rng = rand::thread_rng();
                rng.gen_range(1..=3)
            }
            TurnLengths::Medium => {
                let mut rng = rand::thread_rng();
                rng.gen_range(4..=10)
            }
            TurnLengths::Long => {
                let mut rng = rand::thread_rng();
                rng.gen_range(7..=9)
            }
        }
    }
}

#[derive(Serialize, Default, Deserialize, Debug, Clone)]
pub struct LairActionTimer {
    pub event_message: String,
    pub turn_lengths: TurnLengths,
    turns_until_event: u32,
}

impl LairActionTimer {
    pub fn new(event_message: String, turn_lengths: TurnLengths) -> Self {
        LairActionTimer {
            event_message,
            turn_lengths,
            turns_until_event: turn_lengths.get_turns(),
        }
    }
    pub async fn check(&mut self, turn_counter: &mut TurnCounter) -> Option<String> {
        if self.turns_until_event == 0 {
            self.turns_until_event = turn_counter.get();
            Some(self.event_message.clone())
        } else {
            self.turns_until_event -= 1;
            None
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct EncounterData {
    pub whose_turn: Option<String>,
}

#[derive(Default)]
pub struct EncounterState(pub Arc<Mutex<EncounterData>>);

impl EncounterData {
    pub fn set_current_character(&mut self, name: Option<&str>) {
        let name = name.map(|s| s.to_string());
        self.whose_turn = name;
    }
    pub fn get_current_character(&self) -> Option<String> {
        self.whose_turn.clone()
    }
}
