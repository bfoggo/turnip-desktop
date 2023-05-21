#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use prisma_client_rust::queries::QueryError;
use rand::Rng;

use std::vec;

#[allow(warnings, unused)]
mod prisma;
use prisma::{campaign, character, character_type, PrismaClient};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!

fn main() {
    tauri::Builder::default()
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
            take_turn
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
async fn upsert_character_type_enum() -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client.character_type().delete_many(vec![]).exec().await?;
    client
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
    client
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
async fn list_campaigns() -> Result<Vec<CampaignData>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let campaigns = client.campaign().find_many(vec![]).exec().await?;
    Ok(campaigns)
}

#[tauri::command]
async fn add_campaign(campaign_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .campaign()
        .create(campaign_name, vec![])
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn delete_campaign(campaign_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
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
async fn list_players(campaign_id: CampaignId) -> Result<Vec<CharacterData>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let players = client
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
async fn list_npcs(campaign_id: CampaignId) -> Result<Vec<CharacterData>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let npcs = client
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
async fn add_player(campaign_id: CampaignId, player_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
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
async fn add_npc(campaign_id: CampaignId, npc_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
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
async fn delete_character(character_id: i32) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .character()
        .delete(character::UniqueWhereParam::IdEquals(character_id))
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn set_initiative(character_id: i32, initiative: i32) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
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
async fn get_character_data(character_id: i32) -> Result<CharacterData, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let character = client
        .character()
        .find_unique(character::UniqueWhereParam::IdEquals(character_id))
        .exec()
        .await?
        .unwrap();
    Ok(character)
}

#[tauri::command]
async fn activate_character(character_id: i32) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");

    client
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
async fn deactivate_character(character_id: i32) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");

    client
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
async fn take_turn(campaign_id: CampaignId) -> Result<String, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let mut characters = list_all_awaiting_characters(campaign_id).await?;
    if characters.is_empty() {
        reset_round(campaign_id).await?;
        characters = list_all_awaiting_characters(campaign_id).await?;
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
    client
        .character()
        .update(
            character::UniqueWhereParam::IdEquals(character_id),
            vec![character::SetParam::SetTurnAvailable(false)],
        )
        .exec()
        .await?;
    Ok(characters[index].name.clone())
}

async fn list_all_awaiting_characters(
    campaign_id: CampaignId,
) -> Result<Vec<CharacterData>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let characters = client
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

async fn reset_round(campaign_id: CampaignId) -> Result<(), QueryError> {
    // set all characters to have turn available
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
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
    println!("random number: {:?}", random_number);
    println!("sorted initiatives: {:?}", sorted_initiatives);
    while sum < random_number {
        sum += sorted_initiatives[index];
        if sum >= random_number {
            break;
        }
        index += 1;
    }
    index
}
