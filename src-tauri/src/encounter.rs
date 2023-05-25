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
pub struct AsyncLairAction {
    pub event_message: String,
    pub turn_length: TurnLengths,
    absolute_turn_count: u32,
}
impl AsyncLairAction {
    pub fn new(
        event_message: String,
        turn_length: TurnLengths,
        turn_counter: &TurnCounter,
    ) -> Self {
        let turns_until_event = turn_length.get_turns();
        AsyncLairAction {
            event_message,
            turn_length,
            absolute_turn_count: turn_counter.get() + turns_until_event,
        }
    }
    pub async fn check(&mut self, turn_counter: &TurnCounter) -> Option<String> {
        if turn_counter.get() >= self.absolute_turn_count {
            self.absolute_turn_count += self.turn_length.get_turns();
            Some(self.event_message.clone())
        } else {
            None
        }
    }
    fn set_absolute_turn_count(&mut self, turn_counter: &TurnCounter) {
        self.absolute_turn_count = turn_counter.get() + self.turn_length.get_turns();
    }
}

#[derive(Serialize, Default, Deserialize, Debug, Clone)]
pub struct RecurringAsyncLairAction(AsyncLairAction);

impl RecurringAsyncLairAction {
    pub fn new(event_message: String, turn_length: TurnLengths, counter: &TurnCounter) -> Self {
        RecurringAsyncLairAction(AsyncLairAction::new(event_message, turn_length, counter))
    }
    pub async fn check(&mut self, turn_counter: &mut TurnCounter) -> Option<String> {
        let message = self.0.check(turn_counter).await;
        self.0.set_absolute_turn_count(turn_counter);
        message
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct EncounterData {
    pub whose_turn: Option<String>,
    pub turn_counter: TurnCounter,
    pub async_lair_actions: Vec<AsyncLairAction>,
    pub recurring_async_lair_actions: Vec<RecurringAsyncLairAction>,
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
