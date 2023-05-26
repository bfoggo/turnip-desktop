use rand::Rng;
use serde::{Deserialize, Serialize};
use std::iter::Chain;
use std::ops::Deref;
use std::slice::Iter;
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

trait Check {
    fn check(&mut self, turn_counter: &mut TurnCounter) -> Option<String>;
}

#[derive(Serialize, Default, Deserialize, Debug, Clone)]
pub struct AsyncAction {
    pub event_message: String,
    pub turn_length: TurnLengths,
    absolute_turn_count: u32,
}
impl AsyncAction {
    pub fn new(
        event_message: String,
        turn_length: TurnLengths,
        turn_counter: &TurnCounter,
    ) -> Self {
        let turns_until_event = turn_length.get_turns();
        AsyncAction {
            event_message,
            turn_length,
            absolute_turn_count: turn_counter.get() + turns_until_event,
        }
    }
    fn set_absolute_turn_count(&mut self, turn_counter: &TurnCounter) {
        self.absolute_turn_count = turn_counter.get() + self.turn_length.get_turns();
    }
}

impl Check for AsyncAction {
    fn check(&mut self, turn_counter: &mut TurnCounter) -> Option<String> {
        if turn_counter.get() >= self.absolute_turn_count {
            Some(self.event_message.clone())
        } else {
            None
        }
    }
}

#[derive(Serialize, Default, Deserialize, Debug, Clone)]
pub struct RecurringAsyncAction(AsyncAction);

impl AsRef<AsyncAction> for RecurringAsyncAction {
    fn as_ref(&self) -> &AsyncAction {
        &self.0
    }
}

impl RecurringAsyncAction {
    pub fn new(event_message: String, turn_length: TurnLengths, counter: &TurnCounter) -> Self {
        RecurringAsyncAction(AsyncAction::new(event_message, turn_length, counter))
    }
    fn set_absolute_turn_count(&mut self, turn_counter: &TurnCounter) {
        self.0.set_absolute_turn_count(turn_counter);
    }
}

impl Check for RecurringAsyncAction {
    fn check(&mut self, turn_counter: &mut TurnCounter) -> Option<String> {
        let message = self.0.check(turn_counter);
        if message.is_some() {
            self.set_absolute_turn_count(turn_counter);
        }
        message
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct EncounterData {
    pub whose_turn: Option<String>,
    pub turn_counter: TurnCounter,
    pub async_actions: Vec<AsyncAction>,
    pub recurring_async_actions: Vec<RecurringAsyncAction>,
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
    pub fn add_async_action(&mut self, action: AsyncAction) {
        self.async_actions.push(action);
    }
    pub fn add_recurring_async_action(&mut self, action: RecurringAsyncAction) {
        self.recurring_async_actions.push(action);
    }
    pub fn check_all_async_actions(&mut self) -> Vec<String> {
        let mut messages: Vec<String> = Vec::new();
        let mut all_actions: Vec<Box<dyn Check>> = Vec::new();
        all_actions.extend(
            self.async_actions
                .iter()
                .map(|a| Box::new(a.clone()) as Box<dyn Check>),
        );
        all_actions.extend(
            self.recurring_async_actions
                .iter()
                .map(|a| Box::new(a.clone()) as Box<dyn Check>),
        );
        for action in all_actions.iter_mut() {
            if let Some(message) = action.check(&mut self.turn_counter) {
                messages.push(message);
            }
        }
        messages
    }
}
