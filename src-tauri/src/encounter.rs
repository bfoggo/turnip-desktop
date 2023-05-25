use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

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
