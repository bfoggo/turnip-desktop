#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use prisma_client_rust::queries::QueryError;
use rand::Rng;
use std::vec;
use tauri::State;

mod encounter;
use encounter::EncounterState;

#[allow(warnings, unused)]
mod prisma;
use prisma::{campaign, character, character_type, PrismaClient};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .manage(EncounterState(Default::default()))
        .manage(
            PrismaClient::_builder()
                .build()
                .await
                .expect("Failed to construct Prisma Client."),
        )
        .invoke_handler(tauri::generate_handler![
            upsert_character_type_enum,
            list_campaigns,
            add_campaign,
            delete_campaign,
            list_players,
            add_player,
            list_npcs,
            add_npc,
            delete_character,
            set_initiative,
            get_character_data,
            activate_character,
            deactivate_character,
            take_turn,
            get_whose_turn,
            get_num_turns,
            reset_round,
            resolve
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Debug, Clone)]
enum CharacterType {
    Player,
    NPC,
}

#[tauri::command]
async fn upsert_character_type_enum(
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character_type()
        .delete_many(vec![])
        .exec()
        .await?;
    prisma_client
        .character_type()
        .upsert(
            character_type::UniqueWhereParam::IdEquals(CharacterType::Player as i32),
            character_type::create(
                String::from("Player"),
                vec![character_type::SetParam::SetId(
                    CharacterType::Player as i32,
                )],
            ),
            vec![character_type::SetParam::SetName(String::from("Player"))],
        )
        .exec()
        .await?;
    prisma_client
        .character_type()
        .upsert(
            character_type::UniqueWhereParam::IdEquals(CharacterType::NPC as i32),
            character_type::create(
                String::from("NPC"),
                vec![character_type::SetParam::SetId(CharacterType::NPC as i32)],
            ),
            vec![character_type::SetParam::SetName(String::from("NPC"))],
        )
        .exec()
        .await?;
    Ok(())
}

type CampaignData = campaign::Data;

#[tauri::command]
async fn list_campaigns(
    encounter_state: State<'_, EncounterState>,
    prisma_client: State<'_, PrismaClient>,
) -> Result<Vec<CampaignData>, QueryError> {
    let campaigns = prisma_client.campaign().find_many(vec![]).exec().await?;
    encounter_state.0.lock().await.set_current_character(None);
    Ok(campaigns)
}

#[tauri::command]
async fn add_campaign(
    campaign_name: String,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .campaign()
        .create(campaign_name, vec![])
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn delete_campaign(
    campaign_name: String,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .campaign()
        .delete(campaign::UniqueWhereParam::NameEquals(campaign_name))
        .exec()
        .await?;
    Ok(())
}

#[derive(Debug, Clone, Copy, Default, serde::Serialize, serde::Deserialize)]
struct CampaignId(i32);

type CharacterData = character::Data;

#[tauri::command]
async fn list_players(
    campaign_id: CampaignId,
    prisma_client: State<'_, PrismaClient>,
) -> Result<Vec<CharacterData>, QueryError> {
    let players = prisma_client
        .character()
        .find_many(vec![
            character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                campaign_id.0,
            )),
            character::WhereParam::CharacterTypeId(prisma::read_filters::IntFilter::Equals(
                CharacterType::Player as i32,
            )),
        ])
        .exec()
        .await?;
    Ok(players)
}

#[tauri::command]
async fn list_npcs(
    campaign_id: CampaignId,
    prisma_client: State<'_, PrismaClient>,
) -> Result<Vec<CharacterData>, QueryError> {
    let npcs = prisma_client
        .character()
        .find_many(vec![
            character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                campaign_id.0,
            )),
            character::WhereParam::CharacterTypeId(prisma::read_filters::IntFilter::Equals(
                CharacterType::NPC as i32,
            )),
        ])
        .exec()
        .await?;
    Ok(npcs)
}

#[tauri::command]
async fn add_player(
    campaign_id: CampaignId,
    player_name: String,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .create(
            player_name,
            true,
            true,
            campaign::UniqueWhereParam::IdEquals(campaign_id.0),
            character_type::UniqueWhereParam::IdEquals(CharacterType::Player as i32),
            vec![],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn add_npc(
    campaign_id: CampaignId,
    npc_name: String,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .create(
            npc_name,
            true,
            true,
            campaign::UniqueWhereParam::IdEquals(campaign_id.0),
            character_type::UniqueWhereParam::IdEquals(CharacterType::NPC as i32),
            vec![],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn delete_character(
    character_id: i32,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .delete(character::UniqueWhereParam::IdEquals(character_id))
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn set_initiative(
    character_id: i32,
    initiative: i32,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .update(
            character::UniqueWhereParam::IdEquals(character_id),
            vec![character::SetParam::SetInitiative(Some(initiative))],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn get_character_data(
    character_id: i32,
    prisma_client: State<'_, PrismaClient>,
) -> Result<CharacterData, QueryError> {
    let character = prisma_client
        .character()
        .find_unique(character::UniqueWhereParam::IdEquals(character_id))
        .exec()
        .await?
        .unwrap();
    Ok(character)
}

#[tauri::command]
async fn activate_character(
    character_id: i32,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .update(
            character::UniqueWhereParam::IdEquals(character_id),
            vec![character::SetParam::SetIsActive(true)],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn deactivate_character(
    character_id: i32,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .update(
            character::UniqueWhereParam::IdEquals(character_id),
            vec![character::SetParam::SetIsActive(false)],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn take_turn(
    campaign_id: CampaignId,
    encounter_state: State<'_, EncounterState>,
    prisma_client: State<'_, PrismaClient>,
) -> Result<Option<String>, QueryError> {
    let mut characters = list_all_awaiting_characters(campaign_id, &prisma_client).await?;
    if characters.is_empty() {
        return Ok(None);
    }
    characters.sort_by(|a, b| {
        a.initiative
            .unwrap_or(0)
            .partial_cmp(&b.initiative.unwrap_or(0))
            .unwrap()
    });
    let initiatives: Vec<i32> = characters
        .iter()
        .map(|character| character.initiative.unwrap_or(0))
        .collect();
    let index = sample_from_sorted_initiatives(&initiatives);
    let character_id = characters[index].id;
    let mut encounter_state_lock = encounter_state.0.lock().await;
    encounter_state_lock.set_current_character(Some(&characters[index].name));
    encounter_state_lock.tick();
    prisma_client
        .character()
        .update(
            character::UniqueWhereParam::IdEquals(character_id),
            vec![character::SetParam::SetTurnAvailable(false)],
        )
        .exec()
        .await?;
    Ok(Some(characters[index].name.clone()))
}

#[tauri::command]
async fn get_whose_turn(
    encounter_state: State<'_, EncounterState>,
) -> Result<Option<String>, QueryError> {
    // encounter_state holds and ArcMutex
    let current_character = encounter_state.0.lock().await.get_current_character();
    Ok(current_character)
}

#[tauri::command]
async fn get_num_turns(encounter_state: State<'_, EncounterState>) -> Result<u32, QueryError> {
    let num_turns = encounter_state.0.lock().await.get_num_turns();
    Ok(num_turns)
}

async fn list_all_awaiting_characters(
    campaign_id: CampaignId,
    prisma_client: &PrismaClient,
) -> Result<Vec<CharacterData>, QueryError> {
    let characters = prisma_client
        .character()
        .find_many(vec![
            character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                campaign_id.0,
            )),
            character::WhereParam::IsActive(prisma::read_filters::BoolFilter::Equals(true)),
            character::WhereParam::TurnAvailable(prisma::read_filters::BoolFilter::Equals(true)),
        ])
        .exec()
        .await?;
    Ok(characters)
}

#[tauri::command]
async fn reset_round(
    campaign_id: CampaignId,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    // set all characters to have turn available
    prisma_client
        .character()
        .update_many(
            vec![
                character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                    campaign_id.0,
                )),
                character::WhereParam::IsActive(prisma::read_filters::BoolFilter::Equals(true)),
            ],
            vec![character::SetParam::SetTurnAvailable(true)],
        )
        .exec()
        .await?;
    Ok(())
}

fn sample_from_sorted_initiatives(sorted_initiatives: &Vec<i32>) -> usize {
    let mut rng = rand::thread_rng();
    let mut sum = 0;
    let mut index = 0;
    let total: i32 = sorted_initiatives.iter().sum();
    let random_number = rng.gen_range(0..total);
    while sum < random_number {
        sum += sorted_initiatives[index];
        if sum >= random_number {
            break;
        }
        index += 1;
    }
    index
}

#[tauri::command]
async fn resolve(
    campaign_id: CampaignId,
    encounter_state: State<'_, EncounterState>,
    prisma_client: State<'_, PrismaClient>,
) -> Result<(), QueryError> {
    prisma_client
        .character()
        .update_many(
            vec![
                character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                    campaign_id.0,
                )),
                character::WhereParam::IsActive(prisma::read_filters::BoolFilter::Equals(true)),
            ],
            vec![character::SetParam::SetTurnAvailable(true)],
        )
        .exec()
        .await?;
    let mut encounter_state_lock = encounter_state.0.lock().await;
    encounter_state_lock.reset_counter();
    Ok(())
}
